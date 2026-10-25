-- Each republish gets a new immutable publication; manuscript versions are reused.
-- Existing history, actor permissions, locks and stale checks remain intact.
alter table ros_bilingual_private.publications drop constraint publications_release_id_key;
create index publications_release_history on ros_bilingual_private.publications(release_id,created_at desc,id desc);
create or replace function ros_bilingual_private.publish(p_request_id uuid,p_release_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r ros_bilingual_private.releases;a ros_bilingual_private.approvals;s public.ko_managed_scenes;
 sel public.ko_scene_display_selections;head uuid;snap uuid;pub uuid:=gen_random_uuid();prior jsonb;
 lastpub ros_bilingual_private.publications; restored jsonb;
 enbefore jsonb;kobefore jsonb;enafter jsonb;koafter jsonb;enbody text;kobody text;result jsonb;doc jsonb;path text[];
begin
 select * into strict r from ros_bilingual_private.releases where id=p_release_id;
 a:=ros_bilingual_private.authorize(r.approval_id);
 -- Uses the existing authenticated mutation ledger and document guard contract.
 prior:=public.ros_ko_request_begin(p_request_id,'rewrite','ROS-BILINGUAL-PUBLISH-V1',p_release_id::text);
 if prior is not null then return prior;end if;
 perform pg_advisory_xact_lock(hashtextextended(a.managed_scene_id::text,1));
 select * into lastpub from ros_bilingual_private.publications where release_id=r.id order by created_at desc,id desc limit 1;
 if found then
  select e.result into restored from ros_bilingual_private.publication_events e
  where e.publication_id=lastpub.id and e.action='restore' and e.actor_id=auth.uid()
  order by e.created_at desc limit 1;
  if restored is null or r.actor_id is distinct from auth.uid()
   or not exists(select 1 from ros_bilingual_private.publication_events e where e.publication_id=lastpub.id and e.action='publish' and e.actor_id=auth.uid()) then
   raise exception using errcode='PT409',message='ALREADY_PUBLISHED_USE_ORIGINAL_REQUEST';end if;
 end if;
 lock table public.revision_content_map,public.revision_snapshots,public.ko_en_block_alignments in share row exclusive mode;
 perform 1 from public.revision_projects where id in(a.en_project_id,(a.baseline#>>'{managed_scene,logical_project_id}')::uuid) order by id for update;
 perform 1 from public.novel_documents where id in(a.en_document_id,a.baseline#>>'{managed_scene,document_id}') order by id for update;
 select * into strict s from public.ko_managed_scenes where id=a.managed_scene_id for update;
 select * into strict sel from public.ko_scene_display_selections where managed_scene_id=s.id for update;
 select id into strict head from public.revision_snapshots where project_id=a.en_project_id and is_primary_working;
 if lastpub.id is not null then
  if sel.generation is distinct from (restored->>'generation')::bigint
   or s.generation is distinct from sel.generation
   or sel.review_composition_id is distinct from lastpub.previous_ko_composition_id
   or exists(select 1 from ros_bilingual_private.publication_selections where managed_scene_id=s.id and publication_id is not null)
   or head is distinct from (restored->>'en_snapshot_id')::uuid then
   raise exception using errcode='PT409',message='REPUBLISH_RESTORED_BASE_CHANGED';end if;
  -- Rebase only the generation created by our recorded joint restore.
  -- Immutable approval/versions/maps remain unchanged and are rechecked below.
  a.baseline:=jsonb_set(jsonb_set(a.baseline,'{managed_scene,generation}',to_jsonb(sel.generation)), '{selection,generation}',to_jsonb(sel.generation));
 end if;
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

create or replace function ros_bilingual_private.read_published(p_managed_scene_id uuid,p_composition_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r ros_bilingual_private.releases;pub ros_bilingual_private.publications;rows jsonb;
begin
 if not coalesce(public.ros_ko_can_read_scene(p_managed_scene_id),false) then raise exception using errcode='42501',message='SCENE_ACCESS_DENIED';end if;
 select r0.* into r from ros_bilingual_private.releases r0 join ros_bilingual_private.approvals a on a.id=r0.approval_id
 join ros_bilingual_private.publications p on p.release_id=r0.id
 where a.managed_scene_id=p_managed_scene_id and r0.ko_composition_id=p_composition_id order by p.created_at desc,p.id desc limit 1;
 if not found then return null;end if;
 select * into strict pub from ros_bilingual_private.publications where release_id=r.id order by created_at desc,id desc limit 1;
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

notify pgrst,'reload schema';
