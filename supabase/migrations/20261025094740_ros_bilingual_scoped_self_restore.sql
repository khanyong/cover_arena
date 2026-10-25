-- Explicit opt-in for the approved r01 actor to undo their own publication.
-- Empty on installation; no existing access grants or manuscript data changed.
create table ros_bilingual_private.self_restore_approvals (
 approval_id uuid primary key references ros_bilingual_private.approvals(id),
 actor_id uuid not null references auth.users(id),
 evidence text not null check(length(btrim(evidence))>0),
 created_at timestamptz not null default now()
);
alter table ros_bilingual_private.self_restore_approvals enable row level security;
revoke all on ros_bilingual_private.self_restore_approvals from public,anon,authenticated;
create trigger self_restore_approval_immutable before update or delete on ros_bilingual_private.self_restore_approvals
for each row execute function ros_bilingual_private.immutable();

create or replace function ros_bilingual_private.restore_publication(p_request_id uuid,p_publication_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare pub ros_bilingual_private.publications;r ros_bilingual_private.releases;a ros_bilingual_private.approvals;
 s public.ko_managed_scenes;sel public.ko_scene_display_selections;head uuid;snap uuid;prior jsonb;result jsonb;koafter jsonb;currentmap jsonb;
begin
 select * into strict pub from ros_bilingual_private.publications where id=p_publication_id;
 select * into strict r from ros_bilingual_private.releases where id=pub.release_id;
 a:=ros_bilingual_private.authorize(r.approval_id);
 -- Only the explicitly registered r01 self-publication exception may use rewrite
 -- authority. Existing generic restore rights, owners and policies are unchanged.
 if not (a.change_key='ROS-STYLE-PRO-C01-S01-r01' and a.revision=1
   and a.approval_digest='823cf88be9224b3b54ca4b92b58eff19e0445507bad3a45f6c7509e48387826f'
   and r.actor_id=auth.uid()
   and exists(select 1 from ros_bilingual_private.self_restore_approvals x
     where x.approval_id=a.id and x.actor_id=auth.uid())
   and exists(select 1 from ros_bilingual_private.publication_events e
     where e.publication_id=pub.id and e.action='publish' and e.actor_id=auth.uid())) then
   perform public.ros_ko_assert_scene_owner(a.managed_scene_id,'restore');
 end if;
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
