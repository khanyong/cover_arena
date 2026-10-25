-- An immutable publication record is separate from PRIVATE_STAGED history.
-- No approval or production manuscript is inserted by this migration.
create table ros_bilingual_private.publications (
 id uuid primary key default gen_random_uuid(),
 release_id uuid not null unique references ros_bilingual_private.releases(id),
 en_snapshot_id uuid not null references public.revision_snapshots(id),
 previous_en_snapshot_id uuid not null references public.revision_snapshots(id),
 previous_ko_composition_id uuid not null references public.ko_scene_composition_revisions(id),
 published_generation bigint not null,
 en_before_map jsonb not null,en_after_map jsonb not null,
 en_before jsonb not null,ko_before jsonb not null,en_after jsonb not null,ko_after jsonb not null,
 created_at timestamptz not null default now()
);
create table ros_bilingual_private.publication_selections (
 managed_scene_id uuid primary key references public.ko_managed_scenes(id),
 publication_id uuid references ros_bilingual_private.publications(id),
 generation bigint not null
);
create table ros_bilingual_private.publication_events (
 id uuid primary key default gen_random_uuid(),publication_id uuid not null references ros_bilingual_private.publications(id),
 actor_id uuid not null references auth.users(id),request_id uuid not null,
 action text not null check(action in ('publish','restore')),result jsonb not null,
 created_at timestamptz not null default now(),unique(actor_id,request_id)
);
alter table ros_bilingual_private.publications enable row level security;
alter table ros_bilingual_private.publication_selections enable row level security;
alter table ros_bilingual_private.publication_events enable row level security;
revoke all on ros_bilingual_private.publications,ros_bilingual_private.publication_selections,ros_bilingual_private.publication_events from public,anon,authenticated;
create trigger publication_immutable before update or delete on ros_bilingual_private.publications for each row execute function ros_bilingual_private.immutable();
create trigger publication_event_immutable before update or delete on ros_bilingual_private.publication_events for each row execute function ros_bilingual_private.immutable();

create function ros_bilingual_private.publish(p_request_id uuid,p_release_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r ros_bilingual_private.releases;a ros_bilingual_private.approvals;s public.ko_managed_scenes;
 sel public.ko_scene_display_selections;head uuid;snap uuid;pub uuid:=gen_random_uuid();prior jsonb;
 enbefore jsonb;kobefore jsonb;enafter jsonb;koafter jsonb;enbody text;kobody text;result jsonb;doc jsonb;path text[];
begin
 select * into strict r from ros_bilingual_private.releases where id=p_release_id;
 a:=ros_bilingual_private.authorize(r.approval_id);
 -- Uses the existing authenticated mutation ledger and document guard contract.
 prior:=public.ros_ko_request_begin(p_request_id,'rewrite','ROS-BILINGUAL-PUBLISH-V1',p_release_id::text);
 if prior is not null then return prior;end if;
 perform pg_advisory_xact_lock(hashtextextended(a.managed_scene_id::text,1));
 if exists(select 1 from ros_bilingual_private.publications where release_id=r.id) then
  raise exception using errcode='PT409',message='ALREADY_PUBLISHED_USE_ORIGINAL_REQUEST';end if;
 lock table public.revision_content_map,public.revision_snapshots,public.ko_en_block_alignments in share row exclusive mode;
 perform 1 from public.revision_projects where id in(a.en_project_id,(a.baseline#>>'{managed_scene,logical_project_id}')::uuid) order by id for update;
 perform 1 from public.novel_documents where id in(a.en_document_id,a.baseline#>>'{managed_scene,document_id}') order by id for update;
 select * into strict s from public.ko_managed_scenes where id=a.managed_scene_id for update;
 select * into strict sel from public.ko_scene_display_selections where managed_scene_id=s.id for update;
 select id into strict head from public.revision_snapshots where project_id=a.en_project_id and is_primary_working;
 path:=s.scene_path||array['paragraphs'];
 select data into strict doc from public.novel_documents where id=a.en_document_id;
 if doc#>>(s.scene_path||array['id']) is distinct from s.scene_id then raise exception using errcode='PT409',message='EN_SCENE_PATH_CONFLICT';end if;
 enbefore:=doc#>path;
 select data into strict doc from public.novel_documents where id=s.document_id;
 if doc#>>(s.scene_path||array['id']) is distinct from s.scene_id then raise exception using errcode='PT409',message='KO_SCENE_PATH_CONFLICT';end if;
 kobefore:=doc#>path;
 -- Validate the actual Reader text as well as the versioned target. Whole-document
 -- unrelated edits are kept: update only this scene, clone the CURRENT EN map.
 select string_agg(p#>>array['versions',p->>'activeVersion','content'],E'\n\n' order by n) into enbody from jsonb_array_elements(enbefore) with ordinality q(p,n);
 select string_agg(p#>>array['versions',p->>'activeVersion','content'],E'\n\n' order by n) into kobody from jsonb_array_elements(kobefore) with ordinality q(p,n);
 if public.ros_ko_sha256_text(enbody) is distinct from a.baseline#>>'{before_sha256,en}' or public.ros_ko_sha256_text(kobody) is distinct from a.baseline#>>'{before_sha256,ko}' then
  raise exception using errcode='PT409',message='READER_TARGET_CONFLICT';end if;
 -- Only non-target head/doc hashes are rebased. All target versions, 79 pairs,
 -- approved prose, KO composition, generation and historical alignment are rechecked.
 a.baseline:=jsonb_set(a.baseline,'{en_snapshot,id}',to_jsonb(head::text));
 select jsonb_set(a.baseline,'{documents}',jsonb_agg(jsonb_build_object('id',d.id,'document_sha256',public.ros_ko_sha256_text(d.data::text)))) into a.baseline
 from public.novel_documents d where id in(a.en_document_id,s.document_id);
 perform ros_bilingual_private.assert_baseline(a);
 if r.baseline->'en_target_map' is null or r.baseline->'en_staged_map' is null then
  raise exception using errcode='PT409',message='STAGE_MAP_EVIDENCE_REQUIRED';end if;
 if (select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) from public.revision_content_map m
 where snapshot_id=head and unit_id in(select (p#>>'{en,unit_id}')::uuid from jsonb_array_elements(r.baseline->'ordered_alignment') p))
 is distinct from r.baseline->'en_target_map' then raise exception using errcode='PT409',message='TARGET_MAP_CHANGED';end if;
 if (select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) from public.revision_content_map m
 where snapshot_id=r.en_snapshot_id and unit_id in(select (p->>'en_unit_id')::uuid from jsonb_array_elements(r.pairs) p))
 is distinct from r.baseline->'en_staged_map' then raise exception using errcode='PT409',message='STAGED_MAP_CHANGED';end if;

 perform ros_bilingual_private.read_release(r.id); -- immutable versions and stored hashes
 select jsonb_agg(jsonb_build_object('id',p->>'en_unit_id','unitId',p->>'en_unit_id',
  'revisionVersionId',p->>'en_version_id','activeVersion','review','bilingualReleaseId',r.id,
  'versions',jsonb_build_object('review',jsonb_build_object('version','review','content',v.body_markdown))) order by (p->>'position')::int)
 into enafter from jsonb_array_elements(r.pairs) p join public.paragraph_versions v on v.id=(p->>'en_version_id')::uuid;
 koafter:=public.ros_ko_build_projection(r.ko_composition_id,sel.generation+1);
 insert into public.revision_snapshots(project_id,code,name,state,base_snapshot_id,snapshot_kind,is_canonical,is_current_release,is_primary_working)
 values(a.en_project_id,'bilingual-publish-'||pub,a.change_key,'draft',head,'formal',false,false,false) returning id into snap;
 insert into public.revision_content_map select snap,unit_id,parent_unit_id,position,paragraph_version_id,is_included,title_override,metadata_override
 from public.revision_content_map where snapshot_id=head and unit_id not in(select (p#>>'{en,unit_id}')::uuid from jsonb_array_elements(r.baseline->'ordered_alignment') p);
 insert into public.revision_content_map select snap,unit_id,parent_unit_id,position,paragraph_version_id,is_included,title_override,metadata_override
 from public.revision_content_map where snapshot_id=r.en_snapshot_id and unit_id in(select (p->>'en_unit_id')::uuid from jsonb_array_elements(r.pairs) p);
 update public.revision_snapshots set is_primary_working=false where id=head;
 update public.revision_snapshots set is_primary_working=true where id=snap;
 update public.ko_scene_display_selections set review_composition_id=r.ko_composition_id,generation=generation+1,updated_by=auth.uid(),updated_at=now() where id=sel.id;
 update public.ko_managed_scenes set generation=sel.generation+1 where id=s.id;
 insert into public.ko_scene_reader_projections(managed_scene_id,composition_id,generation,paragraphs,body_sha256,manifest_sha256,projection_sha256)
 select s.id,c.id,sel.generation+1,koafter,c.body_sha256,c.manifest_sha256,public.ros_ko_sha256_text(koafter::text) from public.ko_scene_composition_revisions c where c.id=r.ko_composition_id
 on conflict(managed_scene_id) do update set composition_id=excluded.composition_id,generation=excluded.generation,paragraphs=excluded.paragraphs,body_sha256=excluded.body_sha256,manifest_sha256=excluded.manifest_sha256,projection_sha256=excluded.projection_sha256,projected_at=now();
 perform set_config('ros_ko.internal_actor',auth.uid()::text,true);perform set_config('ros_ko.internal_request_id',p_request_id::text,true);
 perform set_config('ros_ko.internal_document_id',a.en_document_id,true);
 update public.novel_documents set data=jsonb_set(data,path,enafter,false) where id=a.en_document_id;
 perform set_config('ros_ko.internal_document_id',s.document_id,true);
 update public.novel_documents set data=jsonb_set(data,path,koafter,false) where id=s.document_id;
 insert into public.ko_scene_state_events(managed_scene_id,event_type,from_generation,to_generation,from_composition_id,to_composition_id,request_id,actor_id,detail)
 values(s.id,'review_advanced',sel.generation,sel.generation+1,sel.review_composition_id,r.ko_composition_id,p_request_id,auth.uid(),jsonb_build_object('bilingual_publication_id',pub));
 insert into ros_bilingual_private.publications values(pub,r.id,snap,head,sel.review_composition_id,sel.generation+1,
 (select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) from public.revision_content_map m where snapshot_id=head and unit_id in(select (p#>>'{en,unit_id}')::uuid from jsonb_array_elements(r.baseline->'ordered_alignment') p)),
 (select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) from public.revision_content_map m where snapshot_id=snap and unit_id in(select (p->>'en_unit_id')::uuid from jsonb_array_elements(r.pairs) p)),enbefore,kobefore,enafter,koafter,now());
 insert into ros_bilingual_private.publication_selections values(s.id,pub,sel.generation+1)
 on conflict(managed_scene_id) do update set publication_id=excluded.publication_id,generation=excluded.generation;
 result:=jsonb_build_object('publication_id',pub,'release_id',r.id,'en_snapshot_id',snap,'ko_composition_id',r.ko_composition_id,'generation',sel.generation+1,'status','PUBLISHED','replayed',false);
 insert into ros_bilingual_private.publication_events(publication_id,actor_id,request_id,action,result) values(pub,auth.uid(),p_request_id,'publish',result);
 return public.ros_ko_request_complete(p_request_id,'ROS-BILINGUAL-PUBLISH-RESULT-V1',result::text,result);
end $$;
create function public.ros_bilingual_publish(p_request_id uuid,p_release_id uuid) returns jsonb language sql security invoker set search_path='' as $$select ros_bilingual_private.publish(p_request_id,p_release_id)$$;
revoke all on function ros_bilingual_private.publish(uuid,uuid),public.ros_bilingual_publish(uuid,uuid) from public,anon,authenticated;
grant execute on function ros_bilingual_private.publish(uuid,uuid),public.ros_bilingual_publish(uuid,uuid) to authenticated;

-- The composition ID pins the EN/KO pair, independent of the current pointer.
create function ros_bilingual_private.read_published(p_managed_scene_id uuid,p_composition_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r ros_bilingual_private.releases;pub ros_bilingual_private.publications;rows jsonb;
begin
 if not coalesce(public.ros_ko_can_read_scene(p_managed_scene_id),false) then raise exception using errcode='42501',message='SCENE_ACCESS_DENIED';end if;
 select r0.* into r from ros_bilingual_private.releases r0 join ros_bilingual_private.approvals a on a.id=r0.approval_id
 join ros_bilingual_private.publications p on p.release_id=r0.id
 where a.managed_scene_id=p_managed_scene_id and r0.ko_composition_id=p_composition_id;
 if not found then return null;end if;
 select * into strict pub from ros_bilingual_private.publications where release_id=r.id;
 select jsonb_agg(p||jsonb_build_object('en_body',ev.body_markdown,'ko_body',kv.body_markdown) order by (p->>'position')::int)
 into rows from jsonb_array_elements(r.pairs) p
 join public.paragraph_versions ev on ev.id=(p->>'en_version_id')::uuid
 join public.paragraph_versions kv on kv.id=(p->>'ko_version_id')::uuid;
 if jsonb_array_length(rows)<>67 or exists(select 1 from jsonb_array_elements(rows) p
 where public.ros_ko_sha256_text(p->>'en_body') is distinct from p->>'en_sha256'
 or public.ros_ko_sha256_text(p->>'ko_body') is distinct from p->>'ko_sha256') then raise exception 'PUBLICATION_VERSION_DRIFT';end if;
 return jsonb_build_object('publication_id',pub.id,'release_id',r.id,'en_snapshot_id',pub.en_snapshot_id,
 'ko_composition_id',r.ko_composition_id,'pairs',rows,'en_paragraphs',pub.en_after,'ko_paragraphs',pub.ko_after);
end $$;
create function public.ros_bilingual_read_published(p_managed_scene_id uuid,p_composition_id uuid)
returns jsonb language sql stable security invoker set search_path='' as $$select ros_bilingual_private.read_published(p_managed_scene_id,p_composition_id)$$;
revoke all on function ros_bilingual_private.read_published(uuid,uuid),public.ros_bilingual_read_published(uuid,uuid) from public,anon,authenticated;
grant execute on function ros_bilingual_private.read_published(uuid,uuid),public.ros_bilingual_read_published(uuid,uuid) to authenticated;

create function ros_bilingual_private.restore_publication(p_request_id uuid,p_publication_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare pub ros_bilingual_private.publications;r ros_bilingual_private.releases;a ros_bilingual_private.approvals;
 s public.ko_managed_scenes;sel public.ko_scene_display_selections;head uuid;snap uuid;prior jsonb;result jsonb;koafter jsonb;currentmap jsonb;
begin
 select * into strict pub from ros_bilingual_private.publications where id=p_publication_id;
 select * into strict r from ros_bilingual_private.releases where id=pub.release_id;
 a:=ros_bilingual_private.authorize(r.approval_id);
 perform public.ros_ko_assert_scene_owner(a.managed_scene_id,'restore');
 prior:=public.ros_ko_request_begin(p_request_id,'restore','ROS-BILINGUAL-RESTORE-V1',p_publication_id::text);
 if prior is not null then return prior;end if;
 perform pg_advisory_xact_lock(hashtextextended(a.managed_scene_id::text,1));
 lock table public.revision_content_map,public.revision_snapshots,public.ko_en_block_alignments in share row exclusive mode;
 perform 1 from public.revision_projects where id in(a.en_project_id,(a.baseline#>>'{managed_scene,logical_project_id}')::uuid) order by id for update;
 perform 1 from public.novel_documents where id in(a.en_document_id,a.baseline#>>'{managed_scene,document_id}') order by id for update;
 select * into strict s from public.ko_managed_scenes where id=a.managed_scene_id for update;
 select * into strict sel from public.ko_scene_display_selections where managed_scene_id=s.id for update;
 select id into strict head from public.revision_snapshots where project_id=a.en_project_id and is_primary_working;
 if sel.review_composition_id<>r.ko_composition_id or sel.generation<>pub.published_generation
 or not exists(select 1 from ros_bilingual_private.publication_selections where managed_scene_id=s.id and publication_id=pub.id)
 or (select data#>(s.scene_path||array['paragraphs']) from public.novel_documents where id=a.en_document_id) is distinct from pub.en_after
 or (select data#>(s.scene_path||array['paragraphs']) from public.novel_documents where id=s.document_id) is distinct from pub.ko_after then
 raise exception using errcode='PT409',message='RESTORE_TARGET_CHANGED';end if;
 select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) into currentmap from public.revision_content_map m
 where snapshot_id=head and unit_id in(select (p->>'en_unit_id')::uuid from jsonb_array_elements(r.pairs) p);
 if currentmap is distinct from pub.en_after_map then raise exception using errcode='PT409',message='RESTORE_MAP_CHANGED';end if;
 insert into public.revision_snapshots(project_id,code,name,state,base_snapshot_id,snapshot_kind,is_canonical,is_current_release,is_primary_working)
 values(a.en_project_id,'bilingual-restore-'||p_request_id,a.change_key,'draft',head,'formal',false,false,false) returning id into snap;
 insert into public.revision_content_map select snap,unit_id,parent_unit_id,position,paragraph_version_id,is_included,title_override,metadata_override
 from public.revision_content_map where snapshot_id=head and unit_id not in(select (p->>'en_unit_id')::uuid from jsonb_array_elements(r.pairs) p);
 insert into public.revision_content_map select snap,m.unit_id,m.parent_unit_id,m.position,m.paragraph_version_id,m.is_included,m.title_override,m.metadata_override
 from jsonb_populate_recordset(null::public.revision_content_map,pub.en_before_map) m;
 update public.revision_snapshots set is_primary_working=false where id=head;
 update public.revision_snapshots set is_primary_working=true where id=snap;
 koafter:=public.ros_ko_build_projection(pub.previous_ko_composition_id,sel.generation+1);
 update public.ko_scene_display_selections set review_composition_id=pub.previous_ko_composition_id,generation=generation+1,updated_by=auth.uid(),updated_at=now() where id=sel.id;
 update public.ko_managed_scenes set generation=sel.generation+1 where id=s.id;
 update public.ko_scene_reader_projections p set composition_id=c.id,generation=sel.generation+1,paragraphs=koafter,body_sha256=c.body_sha256,manifest_sha256=c.manifest_sha256,projection_sha256=public.ros_ko_sha256_text(koafter::text),projected_at=now()
 from public.ko_scene_composition_revisions c where p.managed_scene_id=s.id and c.id=pub.previous_ko_composition_id;
 if not found then raise exception 'RESTORE_PROJECTION_MISSING';end if;
 perform set_config('ros_ko.internal_actor',auth.uid()::text,true);perform set_config('ros_ko.internal_request_id',p_request_id::text,true);
 perform set_config('ros_ko.internal_document_id',a.en_document_id,true);
 update public.novel_documents set data=jsonb_set(data,s.scene_path||array['paragraphs'],pub.en_before,false) where id=a.en_document_id;
 perform set_config('ros_ko.internal_document_id',s.document_id,true);
 update public.novel_documents set data=jsonb_set(data,s.scene_path||array['paragraphs'],koafter,false) where id=s.document_id;
 update ros_bilingual_private.publication_selections set publication_id=null,generation=sel.generation+1 where managed_scene_id=s.id;
 insert into public.ko_scene_state_events(managed_scene_id,event_type,from_generation,to_generation,from_composition_id,to_composition_id,request_id,actor_id,detail)
 values(s.id,'review_advanced',sel.generation,sel.generation+1,r.ko_composition_id,pub.previous_ko_composition_id,p_request_id,auth.uid(),jsonb_build_object('restored_publication_id',pub.id));
 result:=jsonb_build_object('publication_id',pub.id,'en_snapshot_id',snap,'ko_composition_id',pub.previous_ko_composition_id,'generation',sel.generation+1,'status','RESTORED','replayed',false);
 insert into ros_bilingual_private.publication_events(publication_id,actor_id,request_id,action,result) values(pub.id,auth.uid(),p_request_id,'restore',result);
 return public.ros_ko_request_complete(p_request_id,'ROS-BILINGUAL-RESTORE-RESULT-V1',result::text,result);
end $$;
create function public.ros_bilingual_restore_publication(p_request_id uuid,p_publication_id uuid)
returns jsonb language sql security invoker set search_path='' as $$select ros_bilingual_private.restore_publication(p_request_id,p_publication_id)$$;
revoke all on function ros_bilingual_private.restore_publication(uuid,uuid),public.ros_bilingual_restore_publication(uuid,uuid) from public,anon,authenticated;
grant execute on function ros_bilingual_private.restore_publication(uuid,uuid),public.ros_bilingual_restore_publication(uuid,uuid) to authenticated;

-- One MVCC statement captures BOTH languages and managed selections. Invoker
-- rights preserve every existing document/scene RLS policy (no new SELECT grant).
create function public.ros_bilingual_capture_book()
returns jsonb language sql stable security invoker set search_path='' as $$
 with docs as materialized (
 select id,slug,data from public.novel_documents
 where slug in ('quantum-vibration-novel','quantum-vibration-novel-en')
 or slug ~ '^quantum-vibration-novel(-en)?-act-[0-9]+$'
 ), managed as materialized (
 select m.payload || jsonb_build_object('bilingual_publication',public.ros_bilingual_read_published(s.id,(m.payload->>'requested_composition_id')::uuid)) payload from public.ko_managed_scenes s
 cross join lateral(select public.ros_ko_get_scene(s.id,null,false) payload) m
 where exists(select 1 from docs d where d.id=s.document_id)
 )
 select jsonb_build_object('format','ros-bilingual-book-capture-v1','documents',
 (select jsonb_agg(to_jsonb(d) order by slug) from docs d),'managed',
 coalesce((select jsonb_agg(payload) from managed),'[]'::jsonb))
$$;
revoke all on function public.ros_bilingual_capture_book() from public,anon;
grant execute on function public.ros_bilingual_capture_book() to authenticated;

-- Keep the deployed Reader implementation and its existing permission checks,
-- while preventing shared readers from selecting unpublished staging revisions.
alter function public.ros_ko_get_scene(uuid,uuid,boolean) rename to get_scene_before_bilingual;
alter function public.get_scene_before_bilingual(uuid,uuid,boolean) set schema ros_bilingual_private;
revoke all on function ros_bilingual_private.get_scene_before_bilingual(uuid,uuid,boolean) from public,anon,authenticated;
create function ros_bilingual_private.get_scene(p_managed_scene_id uuid,p_composition_id uuid,p_include_legacy boolean)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if exists(select 1 from ros_bilingual_private.releases r where r.ko_composition_id=p_composition_id
  and r.actor_id is distinct from auth.uid() and not exists(select 1 from ros_bilingual_private.publications p where p.release_id=r.id)) then
  raise exception using errcode='42501',message='PRIVATE_COMPOSITION_ACCESS_DENIED';end if;
 result:=ros_bilingual_private.get_scene_before_bilingual(p_managed_scene_id,p_composition_id,p_include_legacy);
 if jsonb_typeof(result->'available_compositions')='array' then
  result:=jsonb_set(result,'{available_compositions}',coalesce((select jsonb_agg(c) from jsonb_array_elements(result->'available_compositions') c
   where not exists(select 1 from ros_bilingual_private.releases r where r.ko_composition_id=(c->>'composition_id')::uuid
   and r.actor_id is distinct from auth.uid() and not exists(select 1 from ros_bilingual_private.publications p where p.release_id=r.id))),'[]'::jsonb));
 end if;
 return result;
end $$;
create function public.ros_ko_get_scene(p_managed_scene_id uuid,p_composition_id uuid default null,p_include_legacy boolean default false)
returns jsonb language sql stable security invoker set search_path='' as $$select ros_bilingual_private.get_scene(p_managed_scene_id,p_composition_id,p_include_legacy)$$;
revoke all on function ros_bilingual_private.get_scene(uuid,uuid,boolean),public.ros_ko_get_scene(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function ros_bilingual_private.get_scene(uuid,uuid,boolean),public.ros_ko_get_scene(uuid,uuid,boolean) to authenticated;
