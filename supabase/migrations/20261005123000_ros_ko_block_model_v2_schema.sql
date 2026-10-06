-- ROS-KO-BLOCK-MODEL-01: immutable KO block/composition storage.
-- Schema only. No manuscript row is migrated by this file.

create schema if not exists ros_ko_private;
revoke all on schema ros_ko_private from public, anon, authenticated;

create table public.ko_managed_scenes (
  id uuid primary key default gen_random_uuid(),
  logical_project_id uuid not null references public.revision_projects(id),
  owner_id uuid not null references auth.users(id),
  root_document_id text not null references public.novel_documents(id),
  document_id text not null references public.novel_documents(id),
  document_slug text not null,
  scene_id text not null,
  scene_path text[] not null,
  source_key text not null,
  legacy_paragraph_id text not null,
  manuscript_version text not null,
  title_snapshot text not null,
  storage_model text not null default 'ros-ko-block-v1'
    check (storage_model = 'ros-ko-block-v1'),
  generation bigint not null default 0 check (generation >= 0),
  created_at timestamptz not null default statement_timestamp(),
  unique (document_id, scene_id),
  unique (logical_project_id, source_key),
  check (cardinality(scene_path) >= 4)
);

create table ros_ko_private.ko_scene_authorizations (
  actor_id uuid not null references auth.users(id),
  document_id text not null references public.novel_documents(id),
  scene_id text not null,
  can_read boolean not null default true,
  can_migrate boolean not null default false,
  can_rewrite boolean not null default false,
  can_restore boolean not null default false,
  granted_at timestamptz not null default statement_timestamp(),
  primary key (actor_id, document_id, scene_id)
);

create table public.ko_protected_documents (
  document_id text primary key references public.novel_documents(id),
  document_slug text not null unique,
  protection_reason text not null,
  managed_scene_id uuid references public.ko_managed_scenes(id),
  created_at timestamptz not null default statement_timestamp()
);

create table ros_ko_private.ko_scene_legacy_archives (
  id uuid primary key default gen_random_uuid(),
  managed_scene_id uuid not null unique references public.ko_managed_scenes(id),
  source_document_id text not null,
  source_document_slug text not null,
  source_updated_at timestamptz,
  source_row_json jsonb not null,
  source_row_text text not null,
  source_row_hex text not null,
  source_row_bytes integer not null,
  source_row_sha256 text not null check (source_row_sha256 ~ '^[0-9a-f]{64}$'),
  source_scene_json jsonb not null,
  source_scene_text text not null,
  source_scene_hex text not null,
  source_scene_bytes integer not null,
  source_scene_sha256 text not null check (source_scene_sha256 ~ '^[0-9a-f]{64}$'),
  legacy_paragraph_json jsonb not null,
  legacy_paragraph_text text not null,
  legacy_paragraph_hex text not null,
  legacy_paragraph_bytes integer not null,
  legacy_paragraph_sha256 text not null check (legacy_paragraph_sha256 ~ '^[0-9a-f]{64}$'),
  wrapper_format text not null default 'ROS-KO-ARCHIVE-PG-JSONB-TEXT-SHA256-V1',
  supersedes_archive_id uuid references ros_ko_private.ko_scene_legacy_archives(id),
  sealed_at timestamptz not null default statement_timestamp(),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default statement_timestamp()
);

create table public.ko_scene_composition_revisions (
  id uuid primary key default gen_random_uuid(),
  managed_scene_id uuid not null references public.ko_managed_scenes(id),
  revision_no integer not null check (revision_no > 0),
  parent_revision_id uuid references public.ko_scene_composition_revisions(id),
  manuscript_version text not null,
  title_snapshot text not null,
  block_count integer not null check (block_count > 0),
  terminal_lf smallint not null default 0 check (terminal_lf in (0, 1)),
  body_bytes integer not null check (body_bytes >= 0),
  body_lf integer not null check (body_lf >= 0),
  body_sha256 text not null check (body_sha256 ~ '^[0-9a-f]{64}$'),
  input_review_manifest_sha256 text,
  manifest_spec_id text not null default 'ROS-KO-COMPOSITION-MANIFEST-LPF-V2',
  manifest_sha256 text not null check (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  status text not null default 'assembling' check (status in ('assembling', 'sealed')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default statement_timestamp(),
  unique (managed_scene_id, revision_no),
  unique (managed_scene_id, id)
);

create table public.ko_scene_composition_blocks (
  composition_id uuid not null references public.ko_scene_composition_revisions(id),
  position integer not null check (position > 0),
  block_unit_id uuid not null references public.content_units(id),
  block_version_id uuid not null references public.paragraph_versions(id),
  source_key text not null,
  separator_after text not null check (separator_after in ('', E'\n', E'\n\n')),
  primary key (composition_id, position),
  unique (composition_id, block_unit_id)
);

create table public.ko_scene_display_selections (
  id uuid primary key default gen_random_uuid(),
  managed_scene_id uuid not null unique references public.ko_managed_scenes(id),
  review_composition_id uuid references public.ko_scene_composition_revisions(id),
  final_composition_id uuid references public.ko_scene_composition_revisions(id),
  legacy_archive_id uuid references ros_ko_private.ko_scene_legacy_archives(id),
  display_mode text not null default 'composition' check (display_mode in ('composition', 'legacy')),
  generation bigint not null default 1 check (generation > 0),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default statement_timestamp(),
  check (
    (display_mode = 'composition' and review_composition_id is not null)
    or (display_mode = 'legacy' and legacy_archive_id is not null)
  )
);

create table public.ko_scene_reader_projections (
  managed_scene_id uuid primary key references public.ko_managed_scenes(id),
  composition_id uuid references public.ko_scene_composition_revisions(id),
  generation bigint not null check (generation > 0),
  paragraphs jsonb not null check (jsonb_typeof(paragraphs) = 'array'),
  body_sha256 text not null check (body_sha256 ~ '^[0-9a-f]{64}$'),
  manifest_sha256 text not null check (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  projection_spec_id text not null default 'ROS-KO-PROJECTION-PG-JSONB-TEXT-SHA256-V1',
  projection_sha256 text not null check (projection_sha256 ~ '^[0-9a-f]{64}$'),
  projected_at timestamptz not null default statement_timestamp()
);

create table public.ko_scene_state_events (
  id uuid primary key default gen_random_uuid(),
  managed_scene_id uuid not null references public.ko_managed_scenes(id),
  event_type text not null check (event_type in ('migrated', 'review_advanced', 'legacy_restored')),
  from_generation bigint,
  to_generation bigint not null,
  from_composition_id uuid,
  to_composition_id uuid,
  request_id uuid not null,
  actor_id uuid not null references auth.users(id),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default statement_timestamp(),
  unique (managed_scene_id, request_id)
);

create table public.ko_en_block_alignments (
  id uuid primary key default gen_random_uuid(),
  ko_block_unit_id uuid not null unique references public.content_units(id),
  managed_scene_id uuid not null references public.ko_managed_scenes(id),
  en_block_unit_id uuid not null references public.content_units(id),
  en_block_version_id uuid not null references public.paragraph_versions(id),
  relation text not null default 'translation_of'
    check (relation in ('translation_of', 'split_from', 'merged_from')),
  evidence_manifest_sha256 text not null check (evidence_manifest_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default statement_timestamp()
);

create table ros_ko_private.ko_mutation_requests (
  owner_id uuid not null references auth.users(id),
  request_id uuid not null,
  operation text not null check (operation in ('migrate', 'rewrite', 'restore')),
  input_spec_id text not null,
  request_input_sha256 text not null check (request_input_sha256 ~ '^[0-9a-f]{64}$'),
  request_input_text text not null,
  request_input_hex text not null,
  status text not null default 'running' check (status in ('running', 'completed')),
  result_spec_id text,
  result_manifest_sha256 text,
  result_manifest_text text,
  result_manifest_hex text,
  result jsonb,
  created_at timestamptz not null default statement_timestamp(),
  completed_at timestamptz,
  primary key (owner_id, request_id)
);

create index ko_composition_blocks_version_idx on public.ko_scene_composition_blocks(block_version_id);
create index ko_compositions_scene_created_idx on public.ko_scene_composition_revisions(managed_scene_id, revision_no desc);
create index ko_state_events_scene_created_idx on public.ko_scene_state_events(managed_scene_id, created_at desc);

create or replace function public.ros_ko_sha256_text(p_value text)
returns text language sql immutable strict set search_path = '' as $$
  select encode(extensions.digest(convert_to(p_value, 'UTF8'), 'sha256'), 'hex')
$$;

create or replace function public.ros_ko_lpf_v2(variadic p_fields text[])
returns text language sql immutable set search_path = '' as $$
  select coalesce(string_agg(
    case when value is null then 'N00000000:'
      else 'S' || lpad(to_hex(octet_length(convert_to(value, 'UTF8'))), 8, '0') || ':' || value end,
    '' order by ordinality
  ), '')
  from unnest(p_fields) with ordinality as f(value, ordinality)
$$;

create or replace function public.ros_ko_require_actor()
returns uuid language plpgsql stable security definer set search_path = '' as $$
declare v_actor uuid := auth.uid();
begin
  if v_actor is null then
    raise exception using errcode = '42501', message = 'AUTHENTICATED_ACTOR_REQUIRED';
  end if;
  return v_actor;
end
$$;

create or replace function public.ros_ko_assert_authorized(
  p_actor uuid, p_document_id text, p_scene_id text, p_capability text
)
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from ros_ko_private.ko_scene_authorizations a
    where a.actor_id = p_actor and a.document_id = p_document_id and a.scene_id = p_scene_id
      and case p_capability
        when 'read' then a.can_read
        when 'migrate' then a.can_migrate
        when 'rewrite' then a.can_rewrite
        when 'restore' then a.can_restore
        else false end
  ) then
    raise exception using errcode = '42501', message = 'MANAGED_SCENE_CAPABILITY_DENIED';
  end if;
end
$$;

create or replace function public.ros_ko_assert_scene_owner(p_managed_scene_id uuid, p_capability text)
returns public.ko_managed_scenes language plpgsql stable security definer set search_path = '' as $$
declare v_scene public.ko_managed_scenes; v_actor uuid := public.ros_ko_require_actor();
begin
  select * into v_scene from public.ko_managed_scenes where id = p_managed_scene_id;
  if not found or v_scene.owner_id <> v_actor then
    raise exception using errcode = '42501', message = 'MANAGED_SCENE_ACCESS_DENIED';
  end if;
  perform public.ros_ko_assert_authorized(v_actor, v_scene.document_id, v_scene.scene_id, p_capability);
  return v_scene;
end
$$;

create or replace function public.ros_ko_build_projection(p_composition_id uuid, p_generation bigint)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cb.block_unit_id::text,
    'unitId', cb.block_unit_id::text,
    'sourceKey', cb.source_key,
    'revisionVersionId', cb.block_version_id::text,
    'activeVersion', 'review',
    'storageModel', 'ros-ko-block-v1',
    'compositionRevisionId', cr.id::text,
    'generation', p_generation,
    'separatorAfter', cb.separator_after,
    'versions', jsonb_build_object('review', jsonb_build_object(
      'version', 'review', 'content', pv.body_markdown, 'note', pv.change_note,
      'createdAt', pv.created_at, 'versionNo', pv.version_no,
      'revisionVersionId', pv.id::text
    ))
  ) order by cb.position), '[]'::jsonb)
  from public.ko_scene_composition_blocks cb
  join public.ko_scene_composition_revisions cr on cr.id = cb.composition_id
  join public.paragraph_versions pv on pv.id = cb.block_version_id
  where cb.composition_id = p_composition_id
$$;

create or replace function public.ros_ko_composition_manifest_text(p_composition_id uuid)
returns text language plpgsql stable security definer set search_path = '' as $$
declare v_comp public.ko_scene_composition_revisions; v_fields text[];
begin
  select * into strict v_comp from public.ko_scene_composition_revisions where id = p_composition_id;
  v_fields := array[
    'ROS-KO-COMPOSITION-MANIFEST-LPF-V2', v_comp.managed_scene_id::text,
    v_comp.id::text, lpad(v_comp.revision_no::text, 6, '0'), v_comp.manuscript_version,
    v_comp.title_snapshot, v_comp.block_count::text, v_comp.terminal_lf::text
  ];
  select v_fields || coalesce(array_agg(value order by position, field_order), array[]::text[])
    into v_fields
  from (
    select cb.position, f.field_order, f.value
    from public.ko_scene_composition_blocks cb
    join public.paragraph_versions pv on pv.id = cb.block_version_id
    cross join lateral (values
      (1, lpad(cb.position::text, 6, '0')),
      (2, cb.block_unit_id::text),
      (3, cb.block_version_id::text),
      (4, cb.source_key),
      (5, encode(convert_to(cb.separator_after, 'UTF8'), 'hex')),
      (6, public.ros_ko_sha256_text(pv.body_markdown))
    ) f(field_order, value)
    where cb.composition_id = p_composition_id
  ) q;
  return public.ros_ko_lpf_v2(variadic v_fields);
end
$$;

create or replace function public.ros_ko_validate_composition(p_composition_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_comp public.ko_scene_composition_revisions; v_count integer; v_min integer; v_max integer;
  v_bad integer; v_body text; v_manifest text;
begin
  select * into strict v_comp from public.ko_scene_composition_revisions where id = p_composition_id;
  select count(*), min(cb.position), max(cb.position),
         string_agg(pv.body_markdown || cb.separator_after, '' order by cb.position),
         count(*) filter (where cu.project_id <> ms.logical_project_id or pv.paragraph_unit_id <> cb.block_unit_id)
    into v_count, v_min, v_max, v_body, v_bad
  from public.ko_scene_composition_blocks cb
  join public.ko_scene_composition_revisions cr on cr.id = cb.composition_id
  join public.ko_managed_scenes ms on ms.id = cr.managed_scene_id
  join public.content_units cu on cu.id = cb.block_unit_id
  join public.paragraph_versions pv on pv.id = cb.block_version_id
  where cb.composition_id = p_composition_id;
  if v_count <> v_comp.block_count or v_min <> 1 or v_max <> v_comp.block_count then
    raise exception using errcode='23514', message='COMPOSITION_POSITION_OR_COUNT_MISMATCH';
  end if;
  if v_bad <> 0 then raise exception using errcode='23514', message='COMPOSITION_MEMBERSHIP_MISMATCH'; end if;
  if exists (
    select 1 from public.ko_scene_composition_blocks
    where composition_id=p_composition_id and (
      (position < v_comp.block_count and separator_after <> E'\n\n') or
      (position = v_comp.block_count and separator_after <> case when v_comp.terminal_lf=1 then E'\n' else '' end)
    )
  ) then raise exception using errcode='23514', message='COMPOSITION_SEPARATOR_MISMATCH'; end if;
  v_manifest := public.ros_ko_composition_manifest_text(p_composition_id);
  if octet_length(convert_to(coalesce(v_body,''),'UTF8')) <> v_comp.body_bytes
     or length(coalesce(v_body,''))-length(replace(coalesce(v_body,''),E'\n','')) <> v_comp.body_lf
     or public.ros_ko_sha256_text(coalesce(v_body,'')) <> v_comp.body_sha256
     or public.ros_ko_sha256_text(v_manifest) <> v_comp.manifest_sha256 then
    raise exception using errcode='23514', message='COMPOSITION_BODY_OR_MANIFEST_MISMATCH';
  end if;
end
$$;

create or replace function public.ros_ko_composition_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if tg_table_name='ko_scene_composition_revisions' then
    if tg_op='DELETE' or (old.status='sealed' and new is distinct from old) then
      raise exception using errcode='55000', message='SEALED_COMPOSITION_IMMUTABLE';
    end if;
  else
    v_id := case when tg_op='INSERT' then new.composition_id else old.composition_id end;
    if exists(select 1 from public.ko_scene_composition_revisions where id=v_id and status='sealed') then
      raise exception using errcode='55000', message='SEALED_COMPOSITION_MAPPING_IMMUTABLE';
    end if;
  end if;
  if tg_op='DELETE' then return old; end if; return new;
end
$$;

create trigger ko_composition_immutable before update or delete on public.ko_scene_composition_revisions
for each row execute function public.ros_ko_composition_guard();
create trigger ko_composition_mapping_immutable before insert or update or delete on public.ko_scene_composition_blocks
for each row execute function public.ros_ko_composition_guard();

create or replace function public.ros_ko_deferred_composition_validate()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status='sealed' then perform public.ros_ko_validate_composition(new.id); end if;
  return new;
end
$$;
create constraint trigger ko_composition_validate_deferred
after insert or update of status on public.ko_scene_composition_revisions
deferrable initially deferred for each row execute function public.ros_ko_deferred_composition_validate();

create or replace function public.ros_ko_archive_immutable()
returns trigger language plpgsql security definer set search_path = '' as $$
begin raise exception using errcode='55000', message='LEGACY_ARCHIVE_IMMUTABLE'; end
$$;
create trigger ko_legacy_archive_immutable before update or delete on ros_ko_private.ko_scene_legacy_archives
for each row execute function public.ros_ko_archive_immutable();

create or replace function public.ros_ko_registry_immutable()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op='DELETE' then raise exception using errcode='55000', message='MANAGED_SCENE_REGISTRY_IMMUTABLE'; end if;
  if new.document_id<>old.document_id or new.document_slug<>old.document_slug
     or new.root_document_id<>old.root_document_id or new.scene_id<>old.scene_id
     or new.scene_path<>old.scene_path or new.logical_project_id<>old.logical_project_id
     or new.owner_id<>old.owner_id then
    raise exception using errcode='55000', message='MANAGED_SCENE_IDENTITY_IMMUTABLE';
  end if;
  return new;
end
$$;
create trigger ko_managed_scene_registry_guard before update or delete on public.ko_managed_scenes
for each row execute function public.ros_ko_registry_immutable();

create or replace function public.ros_ko_novel_document_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_old_id text; v_new_id text; v_internal_id text; v_actor uuid; v_request uuid;
begin
  if tg_op<>'INSERT' then v_old_id:=old.id; end if;
  if tg_op<>'DELETE' then v_new_id:=new.id; end if;
  if exists(select 1 from public.ko_protected_documents where document_id in (v_old_id,v_new_id)) then
    v_internal_id:=current_setting('ros_ko.internal_document_id',true);
    v_actor:=nullif(current_setting('ros_ko.internal_actor',true),'')::uuid;
    v_request:=nullif(current_setting('ros_ko.internal_request_id',true),'')::uuid;
    if v_internal_id is null or v_internal_id not in (v_old_id,v_new_id)
       or not exists(select 1 from ros_ko_private.ko_mutation_requests r
         where r.owner_id=v_actor and r.request_id=v_request and r.status='running') then
      raise exception using errcode='55000', message='MANAGED_DOCUMENT_REQUIRES_TARGETED_RPC';
    end if;
  end if;
  if tg_op='DELETE' then return old; end if; return new;
end
$$;
create trigger ko_managed_novel_document_guard before insert or update or delete on public.novel_documents
for each row execute function public.ros_ko_novel_document_guard();

alter table public.ko_managed_scenes enable row level security;
alter table public.ko_protected_documents enable row level security;
alter table public.ko_scene_composition_revisions enable row level security;
alter table public.ko_scene_composition_blocks enable row level security;
alter table public.ko_scene_display_selections enable row level security;
alter table public.ko_scene_reader_projections enable row level security;
alter table public.ko_scene_state_events enable row level security;
alter table public.ko_en_block_alignments enable row level security;

create policy ko_managed_scenes_owner_read on public.ko_managed_scenes for select to authenticated
using (owner_id=auth.uid() and exists(select 1 from ros_ko_private.ko_scene_authorizations a
  where a.actor_id=auth.uid()
    and a.document_id=ko_managed_scenes.document_id
    and a.scene_id=ko_managed_scenes.scene_id
    and a.can_read));
create policy ko_compositions_owner_read on public.ko_scene_composition_revisions for select to authenticated
using (exists(select 1 from public.ko_managed_scenes ms where ms.id=managed_scene_id and ms.owner_id=auth.uid()));
create policy ko_composition_blocks_owner_read on public.ko_scene_composition_blocks for select to authenticated
using (exists(select 1 from public.ko_scene_composition_revisions cr join public.ko_managed_scenes ms on ms.id=cr.managed_scene_id
  where cr.id=composition_id and ms.owner_id=auth.uid()));
create policy ko_selections_owner_read on public.ko_scene_display_selections for select to authenticated
using (exists(select 1 from public.ko_managed_scenes ms where ms.id=managed_scene_id and ms.owner_id=auth.uid()));
create policy ko_projections_owner_read on public.ko_scene_reader_projections for select to authenticated
using (exists(select 1 from public.ko_managed_scenes ms where ms.id=managed_scene_id and ms.owner_id=auth.uid()));
create policy ko_events_owner_read on public.ko_scene_state_events for select to authenticated
using (exists(select 1 from public.ko_managed_scenes ms where ms.id=managed_scene_id and ms.owner_id=auth.uid()));
create policy ko_alignments_owner_read on public.ko_en_block_alignments for select to authenticated
using (exists(select 1 from public.ko_managed_scenes ms where ms.id=managed_scene_id and ms.owner_id=auth.uid()));

revoke all on all tables in schema ros_ko_private from public, anon, authenticated;
revoke all on public.ko_managed_scenes, public.ko_protected_documents,
  public.ko_scene_composition_revisions, public.ko_scene_composition_blocks,
  public.ko_scene_display_selections, public.ko_scene_reader_projections,
  public.ko_scene_state_events, public.ko_en_block_alignments from public, anon, authenticated;
grant select on public.ko_managed_scenes, public.ko_scene_composition_revisions,
  public.ko_scene_composition_blocks, public.ko_scene_display_selections,
  public.ko_scene_reader_projections, public.ko_scene_state_events,
  public.ko_en_block_alignments to authenticated;

revoke all on function public.ros_ko_sha256_text(text) from public,anon,authenticated;
revoke all on function public.ros_ko_lpf_v2(text[]) from public,anon,authenticated;
revoke all on function public.ros_ko_require_actor() from public,anon,authenticated;
revoke all on function public.ros_ko_assert_authorized(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.ros_ko_assert_scene_owner(uuid,text) from public,anon,authenticated;
revoke all on function public.ros_ko_build_projection(uuid,bigint) from public,anon,authenticated;
revoke all on function public.ros_ko_composition_manifest_text(uuid) from public,anon,authenticated;
revoke all on function public.ros_ko_validate_composition(uuid) from public,anon,authenticated;
revoke all on function public.ros_ko_composition_guard() from public,anon,authenticated;
revoke all on function public.ros_ko_deferred_composition_validate() from public,anon,authenticated;
revoke all on function public.ros_ko_archive_immutable() from public,anon,authenticated;
revoke all on function public.ros_ko_registry_immutable() from public,anon,authenticated;
revoke all on function public.ros_ko_novel_document_guard() from public,anon,authenticated;
