-- C01: preserve 1:1 Unit identity and historical alignment; retain map attributes.
-- Existing staged releases remain immutable. Apply before creating a new reviewed stage.
create or replace function ros_bilingual_private.stage(p_request_id uuid,p_approval_id uuid,p_proposal jsonb,p_baseline_digest text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 a ros_bilingual_private.approvals; actor uuid:=auth.uid(); payload jsonb; previous ros_bilingual_private.requests;
 rel ros_bilingual_private.releases; oldcomp public.ko_scene_composition_revisions;
 newcomp uuid; newsnap uuid; newrel uuid:=gen_random_uuid(); pair jsonb; resultpairs jsonb:='[]';
 l text; unit uuid; ver uuid; enunit uuid; enver uuid; kounit uuid; kover uuid; alignment uuid;
 source text; pos integer:=0; body text; fullbody text; oldpair jsonb; lin jsonb; parent jsonb;
 rewrite boolean; prior_version uuid; next_version integer; maprow public.revision_content_map;
 vmanifest text; separator text; enparent uuid; koparent uuid;
begin
 a:=ros_bilingual_private.authorize(p_approval_id);
 if p_request_id is null or p_proposal is distinct from a.proposal
   or p_baseline_digest is distinct from a.plan->>'baseline_digest' then
   raise exception using errcode='22023',message='APPROVAL_PAYLOAD_MISMATCH'; end if;
 payload:=jsonb_build_object('approval_id',p_approval_id,'proposal',p_proposal,'baseline_digest',p_baseline_digest);
 -- Serialize retries, including requests with a different approval under one key.
 perform pg_advisory_xact_lock(hashtextextended(actor::text||p_request_id::text,0));
 select * into previous from ros_bilingual_private.requests where actor_id=actor and request_id=p_request_id;
 if found then
   if previous.payload is distinct from payload then raise exception using errcode='22023',message='IDEMPOTENCY_KEY_CONFLICT'; end if;
   return jsonb_build_object('release_id',previous.release_id,'replayed',true,'status','PRIVATE_STAGED');
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_approval_id::text,0));
 select * into rel from ros_bilingual_private.releases where approval_id=p_approval_id;
 if found then
   insert into ros_bilingual_private.requests values(actor,p_request_id,payload,rel.id,now());
   return jsonb_build_object('release_id',rel.id,'replayed',true,'status','PRIVATE_STAGED');
 end if;
 -- Existing map writers do not all lock their snapshot parent. Table locks are
 -- intentionally conservative for this infrequent, bounded structural edit.
 lock table public.revision_content_map, public.revision_snapshots,
   public.ko_en_block_alignments in share row exclusive mode;
 perform 1 from public.revision_projects where id in (a.en_project_id,(a.baseline#>>'{managed_scene,logical_project_id}')::uuid) order by id for update;
 perform 1 from public.novel_documents where id in (a.en_document_id,a.baseline#>>'{managed_scene,document_id}') order by id for update;
 perform 1 from public.ko_managed_scenes where id=a.managed_scene_id for update;
 perform 1 from public.ko_scene_display_selections where managed_scene_id=a.managed_scene_id for update;
 perform ros_bilingual_private.assert_baseline(a);
 select * into strict oldcomp from public.ko_scene_composition_revisions where id=(a.baseline#>>'{composition,id}')::uuid and status='sealed';
 select original_parent_id into enparent from public.content_units where id=(a.baseline#>>'{ordered_alignment,0,en,unit_id}')::uuid;
 select original_parent_id into koparent from public.content_units where id=(a.baseline#>>'{ordered_alignment,0,ko,unit_id}')::uuid;
 insert into public.revision_snapshots(project_id,code,name,state,base_snapshot_id,snapshot_kind,is_canonical,is_current_release,is_primary_working)
 values(a.en_project_id,'bilingual-stage-'||newrel::text,a.change_key,'draft',(a.baseline#>>'{en_snapshot,id}')::uuid,'formal',false,false,false) returning id into newsnap;
 insert into public.revision_content_map(snapshot_id,unit_id,parent_unit_id,position,paragraph_version_id,is_included,title_override,metadata_override)
 select newsnap,unit_id,parent_unit_id,position,paragraph_version_id,is_included,title_override,metadata_override
 from public.revision_content_map where snapshot_id=(a.baseline#>>'{en_snapshot,id}')::uuid
 and unit_id not in (select (value#>>'{en,unit_id}')::uuid from jsonb_array_elements(a.baseline->'ordered_alignment'));
 insert into public.ko_scene_composition_revisions(managed_scene_id,revision_no,parent_revision_id,manuscript_version,title_snapshot,block_count,terminal_lf,body_bytes,body_lf,body_sha256,manifest_sha256,created_by)
 values(a.managed_scene_id,(select max(revision_no)+1 from public.ko_scene_composition_revisions where managed_scene_id=a.managed_scene_id),oldcomp.id,
 a.change_key,oldcomp.title_snapshot,67,oldcomp.terminal_lf,0,0,repeat('0',64),repeat('0',64),actor) returning id into newcomp;
 for pair in select value from jsonb_array_elements(a.plan->'result_pairs') loop
   pos:=pos+1; separator:=case when pos<67 then E'\n\n' when oldcomp.terminal_lf=1 then E'\n' else '' end;
   if pair->>'kind'='retained' then
     oldpair:=pair->'original'; enunit:=(oldpair#>>'{en,unit_id}')::uuid; enver:=(oldpair#>>'{en,version_id}')::uuid;
     kounit:=(oldpair#>>'{ko,unit_id}')::uuid; kover:=(oldpair#>>'{ko,version_id}')::uuid; alignment:=(oldpair->>'alignment_id')::uuid;
   else
     select value into strict lin from jsonb_array_elements(a.plan->'lineage') where value->>'change_key'=pair->>'change_key';
     rewrite:=jsonb_array_length(lin->'predecessor_pairs')=1 and jsonb_array_length(lin->'successor_keys')=1;
     foreach l in array array['en','ko'] loop
       body:=pair#>>array[l,'body'];
       if public.ros_ko_sha256_text(body) is distinct from pair#>>array[l,'sha256'] then raise exception 'APPROVED_PLAN_HASH_MISMATCH'; end if;
       prior_version:=null;
       if rewrite then
         unit:=(lin#>>array['predecessor_pairs','0',l||'_unit_id'])::uuid;
         prior_version:=(lin#>>array['predecessor_pairs','0',l||'_version_id'])::uuid;
         -- Serialize version allocation with other writers using the same Unit.
         perform 1 from public.content_units where id=unit for update;
         select coalesce(max(version_no),0)+1 into next_version from public.paragraph_versions where paragraph_unit_id=unit;
       else
         source:='BILINGUAL/'||newrel::text||'/'||l||'/'||pos::text;
         insert into public.content_units(project_id,unit_type,source_key,source_path,original_parent_id,original_position)
         values(case when l='en' then a.en_project_id else (a.baseline#>>'{managed_scene,logical_project_id}')::uuid end,
         'paragraph',source,source,case when l='en' then enparent else koparent end,pos) returning id into unit;
         next_version:=1;
       end if;
       insert into public.paragraph_versions(paragraph_unit_id,version_no,base_version_id,body_markdown,body_hash,change_type,change_note,created_by)
       values(unit,next_version,prior_version,body,public.ros_ko_sha256_text(body),case when rewrite then 'rewrite' else 'merge' end,
         a.change_key||' '||(pair->>'change_key'),actor) returning id into ver;
       for parent in select value from jsonb_array_elements(lin->'predecessor_pairs') loop
         insert into public.paragraph_version_lineage(child_version_id,parent_version_id,relation_type)
         values(ver,(parent->>(l||'_version_id'))::uuid,case when rewrite then 'rewritten_from' else 'merged_from' end);
       end loop;
       if l='en' then enunit:=unit;enver:=ver;else kounit:=unit;kover:=ver;end if;
     end loop;
     if rewrite then
       -- The legacy alignment is a historical reference; never mutate its EN version.
       -- The immutable release pair below binds BOTH current version IDs.
       alignment:=(lin#>>'{predecessor_pairs,0,alignment_id}')::uuid;
     else
     -- Current correspondence is one-to-one; merge history is recorded above.
     insert into public.ko_en_block_alignments(ko_block_unit_id,managed_scene_id,en_block_unit_id,en_block_version_id,relation,evidence_manifest_sha256)
     values(kounit,a.managed_scene_id,enunit,enver,'translation_of',a.approval_digest) returning id into alignment;
     end if;
   end if;
   select source_key into source from public.content_units where id=kounit;
   insert into public.ko_scene_composition_blocks values(newcomp,pos,kounit,kover,source,separator);
   select * into strict maprow from public.revision_content_map
   where snapshot_id=(a.baseline#>>'{en_snapshot,id}')::uuid and unit_id=
     case when pair->>'kind'='retained' then enunit else (lin#>>'{predecessor_pairs,0,en_unit_id}')::uuid end;
   insert into public.revision_content_map(snapshot_id,unit_id,parent_unit_id,position,paragraph_version_id,is_included,title_override,metadata_override)
   values(newsnap,enunit,maprow.parent_unit_id,pos,enver,maprow.is_included,maprow.title_override,maprow.metadata_override);
   resultpairs:=resultpairs||jsonb_build_array(jsonb_build_object('position',pos,'alignment_id',alignment,
     'en_unit_id',enunit,'en_version_id',enver,'ko_unit_id',kounit,'ko_version_id',kover,'separator_after',separator,
     'en_sha256',(select public.ros_ko_sha256_text(body_markdown) from public.paragraph_versions where id=enver),
     'ko_sha256',(select public.ros_ko_sha256_text(body_markdown) from public.paragraph_versions where id=kover)));
 end loop;
 if pos<>67 then raise exception 'RESULT_PAIR_COUNT_MISMATCH';end if;
 select string_agg(pv.body_markdown||cb.separator_after,'' order by cb.position) into fullbody
 from public.ko_scene_composition_blocks cb join public.paragraph_versions pv on pv.id=cb.block_version_id where cb.composition_id=newcomp;
 if public.ros_ko_sha256_text(fullbody) is distinct from a.baseline#>>'{after_sha256,ko}' then raise exception 'KO_RESULT_HASH_MISMATCH';end if;
 update public.ko_scene_composition_revisions set body_bytes=octet_length(convert_to(fullbody,'UTF8')),
 body_lf=length(fullbody)-length(replace(fullbody,E'\n','')),body_sha256=public.ros_ko_sha256_text(fullbody),
 manifest_sha256=public.ros_ko_sha256_text(public.ros_ko_composition_manifest_text(newcomp)),status='sealed' where id=newcomp;
 perform public.ros_ko_validate_composition(newcomp);
 select string_agg(pv.body_markdown||(r->>'separator_after'),'' order by (r->>'position')::int) into fullbody
 from jsonb_array_elements(resultpairs) r join public.paragraph_versions pv on pv.id=(r->>'en_version_id')::uuid;
 if public.ros_ko_sha256_text(fullbody) is distinct from a.baseline#>>'{after_sha256,en}' then raise exception 'EN_RESULT_HASH_MISMATCH';end if;
 insert into ros_bilingual_private.releases(id,approval_id,actor_id,en_snapshot_id,ko_composition_id,baseline,pairs,lineage)
 values(newrel,a.id,actor,newsnap,newcomp,a.baseline||jsonb_build_object(
 'en_target_map',(select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) from public.revision_content_map m
 where snapshot_id=(a.baseline#>>'{en_snapshot,id}')::uuid and unit_id in(select (p#>>'{en,unit_id}')::uuid from jsonb_array_elements(a.baseline->'ordered_alignment') p)),
 'en_staged_map',(select jsonb_agg(to_jsonb(m)-'snapshot_id' order by position) from public.revision_content_map m
 where snapshot_id=newsnap and unit_id in(select (p->>'en_unit_id')::uuid from jsonb_array_elements(resultpairs) p))),resultpairs,a.plan->'lineage');
 insert into ros_bilingual_private.anchor_reviews(release_id,change_key,predecessors,successors)
 select newrel,value->>'change_key',value->'predecessor_pairs',value->'successor_keys' from jsonb_array_elements(a.plan->'lineage');
 insert into ros_bilingual_private.selections(managed_scene_id,release_id) values(a.managed_scene_id,newrel)
 on conflict(managed_scene_id) do update set release_id=excluded.release_id,generation=ros_bilingual_private.selections.generation+1;
 insert into ros_bilingual_private.events(actor_id,managed_scene_id,release_id,action) values(actor,a.managed_scene_id,newrel,'staged');
 insert into ros_bilingual_private.requests values(actor,p_request_id,payload,newrel,now());
 return jsonb_build_object('release_id',newrel,'replayed',false,'status','PRIVATE_STAGED');
end $$;
