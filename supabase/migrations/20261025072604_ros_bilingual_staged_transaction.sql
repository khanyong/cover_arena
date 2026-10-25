-- EXEC-02: authenticated, atomic bilingual PRIVATE staging.
-- No production approval, manuscript projection or public pointer is changed by
-- this migration. Existing sealed compositions and EN snapshots remain intact.
create schema if not exists ros_bilingual_private;
revoke all on schema ros_bilingual_private from public, anon, authenticated;

-- Loaded only by the reviewed administrative approval-registration procedure.
-- Browser/API clients cannot approve their own payload or supply a trusted plan.
create table ros_bilingual_private.approvals (
 id uuid primary key default gen_random_uuid(),
 change_key text not null, revision integer not null check(revision > 0),
 managed_scene_id uuid not null references public.ko_managed_scenes(id),
 en_project_id uuid not null references public.revision_projects(id),
 en_document_id text not null references public.novel_documents(id),
 approved_actor uuid not null references auth.users(id),
 approval_digest text not null check(approval_digest ~ '^[a-f0-9]{64}$'),
 proposal jsonb not null, baseline jsonb not null, plan jsonb not null,
 evidence text not null, approved_at timestamptz not null,
 unique(change_key,revision),
 check(proposal->>'proposal_id' = change_key),
 check((proposal->>'proposal_revision')::integer = revision),
 check(plan->>'executable' = 'false'),
 check(plan->>'approval_digest' = approval_digest),
 check(jsonb_array_length(plan->'result_pairs') = 67)
);
create table ros_bilingual_private.releases (
 id uuid primary key default gen_random_uuid(),
 approval_id uuid not null unique references ros_bilingual_private.approvals(id),
 actor_id uuid not null references auth.users(id),
 en_snapshot_id uuid not null references public.revision_snapshots(id),
 ko_composition_id uuid not null references public.ko_scene_composition_revisions(id),
 baseline jsonb not null, pairs jsonb not null, lineage jsonb not null,
 status text not null default 'PRIVATE_STAGED' check(status='PRIVATE_STAGED'),
 created_at timestamptz not null default now()
);
create table ros_bilingual_private.requests (
 actor_id uuid not null references auth.users(id), request_id uuid not null,
 payload jsonb not null, release_id uuid not null references ros_bilingual_private.releases(id),
 created_at timestamptz not null default now(), primary key(actor_id,request_id)
);
create table ros_bilingual_private.selections (
 managed_scene_id uuid primary key references public.ko_managed_scenes(id),
 release_id uuid references ros_bilingual_private.releases(id),
 generation bigint not null default 1
);
create table ros_bilingual_private.events (
 id uuid primary key default gen_random_uuid(), actor_id uuid not null references auth.users(id),
 managed_scene_id uuid not null references public.ko_managed_scenes(id),
 release_id uuid references ros_bilingual_private.releases(id),
 action text not null check(action in ('staged','restored_to_baseline')),
 created_at timestamptz not null default now()
);
-- Merged anchors remain attached to historical versions. No silent retargeting.
create table ros_bilingual_private.anchor_reviews (
 release_id uuid not null references ros_bilingual_private.releases(id),
 change_key text not null, predecessors jsonb not null, successors jsonb not null,
 status text not null default 'MANUAL_REVIEW_REQUIRED' check(status='MANUAL_REVIEW_REQUIRED'),
 primary key(release_id,change_key)
);

alter table ros_bilingual_private.approvals enable row level security;
alter table ros_bilingual_private.releases enable row level security;
alter table ros_bilingual_private.requests enable row level security;
alter table ros_bilingual_private.selections enable row level security;
alter table ros_bilingual_private.events enable row level security;
alter table ros_bilingual_private.anchor_reviews enable row level security;
revoke all on all tables in schema ros_bilingual_private from public,anon,authenticated;

create function ros_bilingual_private.immutable()
returns trigger language plpgsql set search_path='' as $$
begin raise exception using errcode='55000',message='BILINGUAL_HISTORY_IMMUTABLE'; end $$;
create trigger bilingual_approval_immutable before update or delete on ros_bilingual_private.approvals
for each row execute function ros_bilingual_private.immutable();
create trigger bilingual_release_immutable before update or delete on ros_bilingual_private.releases
for each row execute function ros_bilingual_private.immutable();
create trigger bilingual_request_immutable before update or delete on ros_bilingual_private.requests
for each row execute function ros_bilingual_private.immutable();
create trigger bilingual_event_immutable before update or delete on ros_bilingual_private.events
for each row execute function ros_bilingual_private.immutable();

create function ros_bilingual_private.authorize(p_approval_id uuid)
returns ros_bilingual_private.approvals language plpgsql security definer set search_path='' as $$
declare a ros_bilingual_private.approvals; u uuid:=auth.uid();
begin
 if u is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
   or coalesce((auth.jwt()->>'exp')::bigint,0) <= extract(epoch from now()) then
   raise exception using errcode='42501',message='AUTHENTICATED_ACTOR_REQUIRED'; end if;
 select * into a from ros_bilingual_private.approvals where id=p_approval_id;
 if not found or a.approved_actor<>u then
   raise exception using errcode='42501',message='BILINGUAL_APPROVAL_ACCESS_DENIED'; end if;
 perform public.ros_ko_assert_scene_owner(a.managed_scene_id,'rewrite');
 if not exists(select 1 from public.revision_projects where id=a.en_project_id and owner_id=u) then
   raise exception using errcode='42501',message='EN_PROJECT_ACCESS_DENIED'; end if;
 return a;
end $$;

-- PT409 is deliberate: PostgREST retries SQLSTATE 40001 automatically. A stale
-- editorial baseline is a permanent conflict, not a transient serialization error.
-- Check real official tables, not client-supplied "current" JSON. Called while
-- holding the same locks as staging; JSON hashes are PostgreSQL-side hashes.
create function ros_bilingual_private.assert_baseline(a ros_bilingual_private.approvals)
returns void language plpgsql security definer set search_path='' as $$
declare b jsonb:=a.baseline; r jsonb; d jsonb; v text; n integer;
begin
 if not exists(select 1 from public.ko_managed_scenes s where s.id=a.managed_scene_id
   and s.generation=(b#>>'{managed_scene,generation}')::bigint
   and s.document_id=b#>>'{managed_scene,document_id}' and s.scene_id=b#>>'{managed_scene,scene_id}')
 or not exists(select 1 from public.ko_scene_display_selections s where s.managed_scene_id=a.managed_scene_id
   and s.generation=(b#>>'{selection,generation}')::bigint
   and s.review_composition_id=(b#>>'{composition,id}')::uuid and s.display_mode='composition')
 or not exists(select 1 from public.revision_snapshots s where s.id=(b#>>'{en_snapshot,id}')::uuid
   and s.project_id=a.en_project_id and s.is_primary_working) then
   raise exception using errcode='PT409',message='STALE_BILINGUAL_HEAD'; end if;
 for d in select value from jsonb_array_elements(b->'documents') loop
   select public.ros_ko_sha256_text(data::text) into v from public.novel_documents where id=d->>'id';
   if v is distinct from d->>'document_sha256' then
     raise exception using errcode='PT409',message='STALE_DOCUMENT'; end if;
 end loop;
 select count(*) into n from public.ko_scene_composition_blocks where composition_id=(b#>>'{composition,id}')::uuid;
 if n<>79 then raise exception using errcode='PT409',message='STALE_COMPOSITION'; end if;
 for r in select value from jsonb_array_elements(b->'ordered_alignment') loop
   if not exists(select 1 from public.ko_scene_composition_blocks cb
      join public.paragraph_versions kv on kv.id=cb.block_version_id
      join public.ko_en_block_alignments al on al.ko_block_unit_id=cb.block_unit_id
      join public.paragraph_versions ev on ev.id=al.en_block_version_id
      join public.revision_content_map em on em.unit_id=al.en_block_unit_id
        and em.snapshot_id=(b#>>'{en_snapshot,id}')::uuid
      where cb.composition_id=(b#>>'{composition,id}')::uuid
        and cb.position=(r->>'position')::integer
        and cb.block_unit_id=(r#>>'{ko,unit_id}')::uuid and kv.id=(r#>>'{ko,version_id}')::uuid
        and cb.separator_after=r#>>'{ko,separator_after}'
        and al.id=(r->>'alignment_id')::uuid and al.managed_scene_id=a.managed_scene_id
        and al.en_block_unit_id=(r#>>'{en,unit_id}')::uuid and ev.id=(r#>>'{en,version_id}')::uuid
        and em.paragraph_version_id=ev.id and em.is_included
        and public.ros_ko_sha256_text(kv.body_markdown)=r#>>'{ko,sha256}'
        and kv.body_markdown=r#>>'{ko,body}'
        and public.ros_ko_sha256_text(ev.body_markdown)=r#>>'{en,sha256}'
        and ev.body_markdown=r#>>'{en,body}') then
     raise exception using errcode='PT409',message='STALE_BILINGUAL_BLOCK'; end if;
 end loop;
end $$;

create function ros_bilingual_private.stage(p_request_id uuid,p_approval_id uuid,p_proposal jsonb,p_baseline_digest text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 a ros_bilingual_private.approvals; actor uuid:=auth.uid(); payload jsonb; previous ros_bilingual_private.requests;
 rel ros_bilingual_private.releases; oldcomp public.ko_scene_composition_revisions;
 newcomp uuid; newsnap uuid; newrel uuid:=gen_random_uuid(); pair jsonb; resultpairs jsonb:='[]';
 l text; unit uuid; ver uuid; enunit uuid; enver uuid; kounit uuid; kover uuid; alignment uuid;
 source text; pos integer:=0; body text; fullbody text; oldpair jsonb; lin jsonb; parent jsonb;
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
     foreach l in array array['en','ko'] loop
       body:=pair#>>array[l,'body'];
       if public.ros_ko_sha256_text(body) is distinct from pair#>>array[l,'sha256'] then raise exception 'APPROVED_PLAN_HASH_MISMATCH'; end if;
       source:='BILINGUAL/'||newrel::text||'/'||l||'/'||pos::text;
       insert into public.content_units(project_id,unit_type,source_key,source_path,original_parent_id,original_position)
       values(case when l='en' then a.en_project_id else (a.baseline#>>'{managed_scene,logical_project_id}')::uuid end,
       'paragraph',source,source,case when l='en' then enparent else koparent end,pos) returning id into unit;
       insert into public.paragraph_versions(paragraph_unit_id,version_no,body_markdown,body_hash,change_type,change_note,created_by)
       values(unit,1,body,public.ros_ko_sha256_text(body),'merge',a.change_key||' '||(pair->>'change_key'),actor) returning id into ver;
       for parent in select value from jsonb_array_elements(lin->'predecessor_pairs') loop
         insert into public.paragraph_version_lineage(child_version_id,parent_version_id,relation_type)
         values(ver,(parent->>(l||'_version_id'))::uuid,'merged_from');
       end loop;
       if l='en' then enunit:=unit;enver:=ver;else kounit:=unit;kover:=ver;end if;
     end loop;
     -- Current correspondence is one-to-one; merge history is recorded above.
     insert into public.ko_en_block_alignments(ko_block_unit_id,managed_scene_id,en_block_unit_id,en_block_version_id,relation,evidence_manifest_sha256)
     values(kounit,a.managed_scene_id,enunit,enver,'translation_of',a.approval_digest) returning id into alignment;
   end if;
   select source_key into source from public.content_units where id=kounit;
   insert into public.ko_scene_composition_blocks values(newcomp,pos,kounit,kover,source,separator);
   insert into public.revision_content_map(snapshot_id,unit_id,parent_unit_id,position,paragraph_version_id,is_included)
   values(newsnap,enunit,enparent,pos,enver,true);
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
 values(newrel,a.id,actor,newsnap,newcomp,a.baseline,resultpairs,a.plan->'lineage');
 insert into ros_bilingual_private.anchor_reviews(release_id,change_key,predecessors,successors)
 select newrel,value->>'change_key',value->'predecessor_pairs',value->'successor_keys' from jsonb_array_elements(a.plan->'lineage');
 insert into ros_bilingual_private.selections(managed_scene_id,release_id) values(a.managed_scene_id,newrel)
 on conflict(managed_scene_id) do update set release_id=excluded.release_id,generation=ros_bilingual_private.selections.generation+1;
 insert into ros_bilingual_private.events(actor_id,managed_scene_id,release_id,action) values(actor,a.managed_scene_id,newrel,'staged');
 insert into ros_bilingual_private.requests values(actor,p_request_id,payload,newrel,now());
 return jsonb_build_object('release_id',newrel,'replayed',false,'status','PRIVATE_STAGED');
end $$;

create function public.ros_bilingual_stage(p_request_id uuid,p_approval_id uuid,p_proposal jsonb,p_baseline_digest text)
returns jsonb language sql security invoker set search_path='' as $$
 select ros_bilingual_private.stage(p_request_id,p_approval_id,p_proposal,p_baseline_digest)
$$;
-- Private schema functions are not PostgREST-exposed. The wrapper is invoker;
-- only the tightly scoped private entrypoints receive authenticated EXECUTE.
grant usage on schema ros_bilingual_private to authenticated;
revoke all on all functions in schema ros_bilingual_private from public,anon,authenticated;
grant execute on function ros_bilingual_private.stage(uuid,uuid,jsonb,text) to authenticated;
revoke all on function public.ros_bilingual_stage(uuid,uuid,jsonb,text) from public,anon;
grant execute on function public.ros_bilingual_stage(uuid,uuid,jsonb,text) to authenticated;

create function ros_bilingual_private.read_release(p_release_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r ros_bilingual_private.releases; a ros_bilingual_private.approvals; pairs jsonb;
begin
 select * into r from ros_bilingual_private.releases where id=p_release_id;
 if not found then raise exception using errcode='42501',message='RELEASE_ACCESS_DENIED';end if;
 a:=ros_bilingual_private.authorize(r.approval_id);
 if exists(select 1 from jsonb_array_elements(r.pairs) p
   left join public.paragraph_versions ev on ev.id=(p->>'en_version_id')::uuid
   left join public.paragraph_versions kv on kv.id=(p->>'ko_version_id')::uuid
   where public.ros_ko_sha256_text(ev.body_markdown) is distinct from p->>'en_sha256'
      or public.ros_ko_sha256_text(kv.body_markdown) is distinct from p->>'ko_sha256') then
   raise exception using errcode='PT409',message='STAGED_VERSION_DRIFT';end if;
 select jsonb_agg(p||jsonb_build_object('en_body',ev.body_markdown,'ko_body',kv.body_markdown) order by (p->>'position')::int)
 into pairs from jsonb_array_elements(r.pairs) p
 join public.paragraph_versions ev on ev.id=(p->>'en_version_id')::uuid
 join public.paragraph_versions kv on kv.id=(p->>'ko_version_id')::uuid;
 return jsonb_build_object('release_id',r.id,'status',r.status,'pairs',pairs,'en_snapshot_id',r.en_snapshot_id,
 'ko_composition_id',r.ko_composition_id,'lineage',r.lineage);
end $$;
create function public.ros_bilingual_read_staged(p_release_id uuid)
returns jsonb language sql security invoker set search_path='' as $$select ros_bilingual_private.read_release(p_release_id)$$;
revoke all on function ros_bilingual_private.read_release(uuid) from public,anon;
grant execute on function ros_bilingual_private.read_release(uuid) to authenticated;
revoke all on function public.ros_bilingual_read_staged(uuid) from public,anon;
grant execute on function public.ros_bilingual_read_staged(uuid) to authenticated;

create function ros_bilingual_private.context(p_approval_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare a ros_bilingual_private.approvals;
begin
 a:=ros_bilingual_private.authorize(p_approval_id);
 return jsonb_build_object('proposal',a.proposal,'baseline',a.baseline,'approval_digest',a.approval_digest,'plan',a.plan);
end $$;
create function public.ros_bilingual_stage_context(p_approval_id uuid)
returns jsonb language sql security invoker set search_path='' as $$select ros_bilingual_private.context(p_approval_id)$$;
revoke all on function ros_bilingual_private.context(uuid) from public,anon;
grant execute on function ros_bilingual_private.context(uuid) to authenticated;
revoke all on function public.ros_bilingual_stage_context(uuid) from public,anon;
grant execute on function public.ros_bilingual_stage_context(uuid) to authenticated;

-- Restore PRIVATE selection only. No production restore/publish entrypoint is
-- offered until the Reader and output paths can consume a common edition.
create function ros_bilingual_private.restore_stage(p_request_id uuid,p_release_id uuid,p_expected_generation bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r ros_bilingual_private.releases; a ros_bilingual_private.approvals;
 s ros_bilingual_private.selections; oldreq ros_bilingual_private.requests; payload jsonb; actor uuid:=auth.uid();
begin
 select * into r from ros_bilingual_private.releases where id=p_release_id;
 if not found then raise exception using errcode='42501',message='RELEASE_ACCESS_DENIED';end if;
 a:=ros_bilingual_private.authorize(r.approval_id);
 perform public.ros_ko_assert_scene_owner(a.managed_scene_id,'restore');
 if p_request_id is null then raise exception using errcode='22023',message='REQUEST_ID_REQUIRED';end if;
 payload:=jsonb_build_object('operation','restore_private','release_id',p_release_id,'generation',p_expected_generation);
 perform pg_advisory_xact_lock(hashtextextended(actor::text||p_request_id::text,0));
 select * into oldreq from ros_bilingual_private.requests where actor_id=actor and request_id=p_request_id;
 if found then
   if oldreq.payload is distinct from payload then raise exception using errcode='22023',message='IDEMPOTENCY_KEY_CONFLICT';end if;
   return jsonb_build_object('restored',true,'replayed',true,'generation',p_expected_generation+1);
 end if;
 lock table public.revision_content_map,public.revision_snapshots,public.ko_en_block_alignments in share row exclusive mode;
 perform 1 from public.novel_documents where id in (a.en_document_id,a.baseline#>>'{managed_scene,document_id}') order by id for update;
 perform 1 from public.ko_managed_scenes where id=a.managed_scene_id for update;
 perform 1 from public.ko_scene_display_selections where managed_scene_id=a.managed_scene_id for update;
 select * into s from ros_bilingual_private.selections where managed_scene_id=a.managed_scene_id for update;
 if not found or s.release_id is distinct from p_release_id or s.generation is distinct from p_expected_generation then
   raise exception using errcode='PT409',message='STALE_PRIVATE_SELECTION';end if;
 -- The official baseline was never overwritten; switching this private pointer
 -- to null restores that same EN/KO composition together, preserving history.
 perform ros_bilingual_private.assert_baseline(a);
 update ros_bilingual_private.selections set release_id=null,generation=generation+1 where managed_scene_id=a.managed_scene_id;
 insert into ros_bilingual_private.events(actor_id,managed_scene_id,release_id,action) values(actor,a.managed_scene_id,r.id,'restored_to_baseline');
 insert into ros_bilingual_private.requests values(actor,p_request_id,payload,r.id,now());
 return jsonb_build_object('restored',true,'replayed',false,'generation',p_expected_generation+1);
end $$;
create function public.ros_bilingual_restore_staged(p_request_id uuid,p_release_id uuid,p_expected_generation bigint)
returns jsonb language sql security invoker set search_path='' as $$select ros_bilingual_private.restore_stage(p_request_id,p_release_id,p_expected_generation)$$;
revoke all on function ros_bilingual_private.restore_stage(uuid,uuid,bigint) from public,anon;
grant execute on function ros_bilingual_private.restore_stage(uuid,uuid,bigint) to authenticated;
revoke all on function public.ros_bilingual_restore_staged(uuid,uuid,bigint) from public,anon;
grant execute on function public.ros_bilingual_restore_staged(uuid,uuid,bigint) to authenticated;
