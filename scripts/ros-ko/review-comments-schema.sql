-- ROS-KO review comments: independent append-only editorial records.
-- This DDL never modifies manuscript Versions, compositions, projections or documents.
-- Supabase CLI migration creation was unavailable (installed binary: Bad CPU type).
-- Materialize as a migration using a working CLI before committing migration history.

create table ros_ko_private.ko_review_comment_events (
  event_id uuid primary key,
  id uuid not null,
  revision integer not null check (revision > 0),
  managed_scene_id uuid not null references public.ko_managed_scenes(id),
  block_unit_id uuid not null references public.content_units(id),
  block_version_id uuid not null references public.paragraph_versions(id),
  composition_id uuid not null references public.ko_scene_composition_revisions(id),
  source_key text not null,
  position integer not null check (position > 0),
  body_snapshot text not null,
  body_sha256 text not null check (body_sha256 ~ '^[0-9a-f]{64}$'),
  scene_title text not null,
  selected_text text not null default '',
  selection_start integer,
  selection_end integer,
  context_before text not null default '',
  context_after text not null default '',
  kind text not null check (kind in ('style','translation','term','dialogue','fact','continuity','formula','other')),
  priority text not null check (priority in ('required','suggested','question')),
  direction text not null check (length(btrim(direction)) > 0 and length(direction) <= 12000),
  proposal text not null default '' check (length(proposal) <= 30000),
  status text not null check (status in ('open','sent','review','resolved','held','withdrawn')),
  include_in_export boolean not null default true,
  created_at timestamptz not null,
  updated_at timestamptz not null default statement_timestamp(),
  author_id uuid not null references auth.users(id),
  expected_revision integer not null check (expected_revision >= 0),
  request_input jsonb not null check (jsonb_typeof(request_input) = 'object'),
  unique (id, revision),
  check (revision = expected_revision + 1),
  check (body_sha256 = public.ros_ko_sha256_text(body_snapshot)),
  check (
    (selected_text = '' and selection_start is null and selection_end is null)
    or (selected_text <> '' and selection_start >= 0 and selection_end > selection_start
      and selection_end <= char_length(body_snapshot)
      and substring(body_snapshot from selection_start + 1 for selection_end - selection_start) = selected_text)
  )
);

create index ko_review_comment_events_scene_idx
  on ros_ko_private.ko_review_comment_events(managed_scene_id, id, revision desc);
alter table ros_ko_private.ko_review_comment_events enable row level security;
revoke all on ros_ko_private.ko_review_comment_events from public, anon, authenticated;

create function ros_ko_private.review_comment_event_immutable()
returns trigger language plpgsql set search_path='' as $$
begin
  raise exception using errcode='42501', message='REVIEW_COMMENT_HISTORY_IMMUTABLE';
end $$;
create trigger ko_review_comment_events_immutable
before update or delete on ros_ko_private.ko_review_comment_events
for each row execute function ros_ko_private.review_comment_event_immutable();
create trigger ko_review_comment_events_no_truncate
before truncate on ros_ko_private.ko_review_comment_events
for each statement execute function ros_ko_private.review_comment_event_immutable();

-- Private storage requires SECURITY DEFINER; all callable entry points explicitly
-- check the existing actor/owner/capability contract before accessing it.
create function ros_ko_private.review_comment_records(p_managed_scene_id uuid)
returns jsonb language sql stable security definer set search_path='' as $$
  with latest as (
    select distinct on (e.id) e.*
    from ros_ko_private.ko_review_comment_events e
    where e.managed_scene_id = p_managed_scene_id
    order by e.id, e.revision desc
  )
  select coalesce(jsonb_agg(
    (to_jsonb(l) - 'request_input' - 'expected_revision') || jsonb_build_object(
      'is_stale', not exists (
        select 1 from public.ko_scene_display_selections s
        join public.ko_scene_composition_blocks b on b.composition_id=s.review_composition_id
        where s.managed_scene_id=p_managed_scene_id and s.display_mode='composition'
          and b.block_unit_id=l.block_unit_id and b.block_version_id=l.block_version_id
      ),
      'history', (
        select jsonb_agg(to_jsonb(h) - 'request_input' - 'expected_revision' order by h.revision)
        from ros_ko_private.ko_review_comment_events h
        where h.id=l.id and h.managed_scene_id=p_managed_scene_id
      )
    ) order by l.position, l.created_at, l.id
  ), '[]'::jsonb) from latest l
$$;

create function public.ros_ko_review_comments_list(p_managed_scene_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
  perform public.ros_ko_assert_scene_owner(p_managed_scene_id,'read');
  return ros_ko_private.review_comment_records(p_managed_scene_id);
end $$;

create function public.ros_ko_review_comment_save(
  p_managed_scene_id uuid,
  p_comment_id uuid,
  p_event_id uuid,
  p_expected_revision integer,
  p_input jsonb
)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_scene public.ko_managed_scenes;
  v_selection public.ko_scene_display_selections;
  v_mapping public.ko_scene_composition_blocks;
  v_comp public.ko_scene_composition_revisions;
  v_old ros_ko_private.ko_review_comment_events;
  v_replay ros_ko_private.ko_review_comment_events;
  v_new ros_ko_private.ko_review_comment_events;
  v_actor uuid;
  v_key text;
  v_body text;
  v_current boolean;
  v_result jsonb;
  v_time timestamptz := statement_timestamp();
begin
  v_scene := public.ros_ko_assert_scene_owner(p_managed_scene_id,'rewrite');
  perform public.ros_ko_assert_scene_owner(p_managed_scene_id,'read');
  v_actor := public.ros_ko_require_actor();
  if p_comment_id is null or p_event_id is null or p_expected_revision is null
     or p_expected_revision < 0 or p_input is null or jsonb_typeof(p_input)<>'object' then
    raise exception using errcode='22023', message='REVIEW_COMMENT_INVALID_INPUT';
  end if;
  for v_key in select jsonb_object_keys(p_input) loop
    if v_key not in ('block_unit_id','block_version_id','composition_id','body_sha256',
      'selected_text','selection_start','selection_end','kind','priority','direction',
      'proposal','status','include_in_export') then
      raise exception using errcode='22023', message='REVIEW_COMMENT_UNKNOWN_FIELD';
    end if;
    if v_key not in ('selection_start','selection_end','include_in_export')
       and jsonb_typeof(p_input->v_key)<>'string' then
      raise exception using errcode='22023', message='REVIEW_COMMENT_INVALID_FIELD_TYPE';
    end if;
  end loop;
  if (p_input ? 'include_in_export' and jsonb_typeof(p_input->'include_in_export')<>'boolean')
     or (p_input ? 'selection_start' and jsonb_typeof(p_input->'selection_start') not in ('number','null'))
     or (p_input ? 'selection_end' and jsonb_typeof(p_input->'selection_end') not in ('number','null')) then
    raise exception using errcode='22023', message='REVIEW_COMMENT_INVALID_FIELD_TYPE';
  end if;

  -- Fixed order: event key, comment key, managed Scene, selection. A duplicate
  -- first arrival waits for its predecessor then rereads the committed event.
  perform pg_advisory_xact_lock(hashtextextended('ros-ko-comment-event:'||p_event_id::text,0));
  perform pg_advisory_xact_lock(hashtextextended('ros-ko-comment:'||p_comment_id::text,0));
  perform public.ros_ko_assert_scene_owner(p_managed_scene_id,'rewrite');
  perform public.ros_ko_assert_scene_owner(p_managed_scene_id,'read');
  select * into v_replay from ros_ko_private.ko_review_comment_events where event_id=p_event_id;
  if found then
    if v_replay.id<>p_comment_id or v_replay.managed_scene_id<>p_managed_scene_id
       or v_replay.author_id<>v_actor or v_replay.expected_revision<>p_expected_revision
       or v_replay.request_input<>p_input then
      raise exception using errcode='22023', message='IDEMPOTENCY_KEY_REUSE';
    end if;
    select item into v_result from jsonb_array_elements(ros_ko_private.review_comment_records(p_managed_scene_id)) item
      where item->>'id'=p_comment_id::text;
    return v_result || jsonb_build_object('replayed',true);
  end if;

  select * into v_scene from public.ko_managed_scenes where id=p_managed_scene_id for share;
  select * into strict v_selection from public.ko_scene_display_selections
    where managed_scene_id=p_managed_scene_id for share;
  select * into v_old from ros_ko_private.ko_review_comment_events
    where id=p_comment_id order by revision desc limit 1;
  v_current := found;
  if v_current then
    if v_old.managed_scene_id<>p_managed_scene_id or v_old.author_id<>v_actor then
      raise exception using errcode='42501', message='REVIEW_COMMENT_SCOPE_MISMATCH';
    end if;
    if p_expected_revision<>v_old.revision then
      raise exception using errcode='40001', message='REVIEW_COMMENT_STALE_REVISION';
    end if;
    -- Existing anchors stay on the original body/version even after a rewrite.
    for v_key in select unnest(array['block_unit_id','block_version_id','composition_id',
      'body_sha256','selected_text','selection_start','selection_end']) loop
      if p_input ? v_key and p_input->v_key is distinct from to_jsonb(v_old)->v_key then
        raise exception using errcode='22023', message='REVIEW_COMMENT_ANCHOR_IMMUTABLE';
      end if;
    end loop;
    v_new := v_old;
  else
    if p_expected_revision<>0 then
      raise exception using errcode='40001', message='REVIEW_COMMENT_STALE_REVISION';
    end if;
    if not (p_input ?& array['block_unit_id','block_version_id','composition_id','body_sha256']) then
      raise exception using errcode='22023', message='REVIEW_COMMENT_ANCHOR_REQUIRED';
    end if;
    if v_selection.display_mode<>'composition' or v_selection.review_composition_id::text<>p_input->>'composition_id' then
      raise exception using errcode='40001', message='REVIEW_COMMENT_STALE_COMPOSITION';
    end if;
    select * into v_comp from public.ko_scene_composition_revisions
      where id=(p_input->>'composition_id')::uuid and managed_scene_id=p_managed_scene_id and status='sealed';
    if not found then raise exception using errcode='22023', message='REVIEW_COMMENT_COMPOSITION_SCOPE_MISMATCH'; end if;
    select * into v_mapping from public.ko_scene_composition_blocks
      where composition_id=v_comp.id and block_unit_id=(p_input->>'block_unit_id')::uuid
        and block_version_id=(p_input->>'block_version_id')::uuid;
    if not found then raise exception using errcode='22023', message='REVIEW_COMMENT_BLOCK_SCOPE_MISMATCH'; end if;
    select pv.body_markdown into strict v_body from public.paragraph_versions pv
      join public.content_units cu on cu.id=pv.paragraph_unit_id
      where pv.id=v_mapping.block_version_id and pv.paragraph_unit_id=v_mapping.block_unit_id
        and cu.project_id=v_scene.logical_project_id;
    if public.ros_ko_sha256_text(v_body)<>p_input->>'body_sha256' then
      raise exception using errcode='22023', message='REVIEW_COMMENT_BODY_HASH_MISMATCH';
    end if;
    v_new.id:=p_comment_id;
    v_new.managed_scene_id:=p_managed_scene_id;
    v_new.author_id:=v_actor;
    v_new.block_unit_id:=v_mapping.block_unit_id;
    v_new.block_version_id:=v_mapping.block_version_id;
    v_new.composition_id:=v_comp.id;
    v_new.source_key:=v_mapping.source_key;
    v_new.position:=v_mapping.position;
    v_new.body_snapshot:=v_body;
    v_new.body_sha256:=public.ros_ko_sha256_text(v_body);
    v_new.scene_title:=v_comp.title_snapshot;
    v_new.selected_text:=coalesce(p_input->>'selected_text','');
    v_new.selection_start:=(p_input->>'selection_start')::integer;
    v_new.selection_end:=(p_input->>'selection_end')::integer;
    if v_new.selected_text='' then
      if v_new.selection_start is not null or v_new.selection_end is not null then
        raise exception using errcode='22023', message='REVIEW_COMMENT_SELECTION_MISMATCH';
      end if;
      v_new.context_before:=''; v_new.context_after:='';
    else
      if v_new.selection_start is null or v_new.selection_end is null
         or v_new.selection_start<0 or v_new.selection_end<=v_new.selection_start
         or v_new.selection_end>char_length(v_body)
         or substring(v_body from v_new.selection_start+1 for v_new.selection_end-v_new.selection_start)<>v_new.selected_text then
        raise exception using errcode='22023', message='REVIEW_COMMENT_SELECTION_MISMATCH';
      end if;
      v_new.context_before:=substring(v_body from greatest(1,v_new.selection_start-39) for least(40,v_new.selection_start));
      v_new.context_after:=substring(v_body from v_new.selection_end+1 for 40);
    end if;
    v_new.created_at:=v_time;
    v_new.kind:='other'; v_new.priority:='suggested'; v_new.proposal:='';
    v_new.status:='open'; v_new.include_in_export:=true;
  end if;

  v_new.kind:=coalesce(p_input->>'kind',v_new.kind);
  v_new.priority:=coalesce(p_input->>'priority',v_new.priority);
  v_new.direction:=coalesce(p_input->>'direction',v_new.direction);
  v_new.proposal:=coalesce(p_input->>'proposal',v_new.proposal);
  v_new.status:=coalesce(p_input->>'status',v_new.status);
  v_new.include_in_export:=coalesce((p_input->>'include_in_export')::boolean,v_new.include_in_export);
  if v_new.kind not in ('style','translation','term','dialogue','fact','continuity','formula','other')
     or v_new.priority not in ('required','suggested','question')
     or v_new.status not in ('open','sent','review','resolved','held','withdrawn')
     or v_new.direction is null or length(btrim(v_new.direction))=0 or length(v_new.direction)>12000
     or length(v_new.proposal)>30000 then
    raise exception using errcode='22023', message='REVIEW_COMMENT_INVALID_CONTENT';
  end if;
  v_new.event_id:=p_event_id;
  v_new.revision:=p_expected_revision+1;
  v_new.expected_revision:=p_expected_revision;
  v_new.request_input:=p_input;
  v_new.updated_at:=v_time;
  insert into ros_ko_private.ko_review_comment_events select v_new.*;
  select item into v_result from jsonb_array_elements(ros_ko_private.review_comment_records(p_managed_scene_id)) item
    where item->>'id'=p_comment_id::text;
  return v_result || jsonb_build_object('replayed',false);
end $$;

revoke all on function ros_ko_private.review_comment_event_immutable() from public, anon, authenticated;
revoke all on function ros_ko_private.review_comment_records(uuid) from public, anon, authenticated;
revoke all on function public.ros_ko_review_comments_list(uuid) from public, anon, authenticated;
revoke all on function public.ros_ko_review_comment_save(uuid,uuid,uuid,integer,jsonb) from public, anon, authenticated;
grant execute on function public.ros_ko_review_comments_list(uuid) to authenticated;
grant execute on function public.ros_ko_review_comment_save(uuid,uuid,uuid,integer,jsonb) to authenticated;
