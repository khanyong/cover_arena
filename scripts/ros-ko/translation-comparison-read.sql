-- First-Scene bilingual comparison. Read-only API; no manuscript/mapping changes.
-- Apply as one transaction so the new privileged function is never publicly callable.
begin;

create or replace function public.ros_ko_get_translation_comparison(
  p_managed_scene_id uuid, p_composition_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_scene public.ko_managed_scenes;
  v_ko jsonb;
  v_comp public.ko_scene_composition_revisions;
  v_doc public.novel_documents;
  v_en_scene jsonb;
  v_matches jsonb;
  v_latest jsonb;
  v_latest_id uuid;
  v_latest_body text;
  v_status text;
  v_rows jsonb := '[]'::jsonb;
  v_body text := '';
  v_en_body text := '';
  v_changed integer := 0;
  v_unavailable integer := 0;
  v_structure_changed boolean := false;
  v_row record;
  v_count integer := 0;
begin
  -- Existing explicit owner and per-Scene read capability are both required.
  v_scene := public.ros_ko_assert_scene_owner(p_managed_scene_id, 'read');
  if v_scene.document_id <> 'quantum-vibration-novel-act-2'
    or v_scene.document_slug <> 'quantum-vibration-novel-act-2'
    or v_scene.scene_id <> 'b48a4f04' or v_scene.source_key <> 'PRO/CH01/SC01'
    or v_scene.scene_path <> array['chapters','1','scenes','0'] then
    raise exception using errcode='22023', message='TRANSLATION_COMPARISON_SCOPE_UNSUPPORTED';
  end if;
  v_ko := public.ros_ko_get_scene(p_managed_scene_id, p_composition_id, false);
  if v_ko->>'requested_composition_id' is null then
    raise exception using errcode='22023', message='LEGACY_TRANSLATION_COMPARISON_UNSUPPORTED';
  end if;
  select * into strict v_comp from public.ko_scene_composition_revisions
    where id=(v_ko->>'requested_composition_id')::uuid
      and managed_scene_id=p_managed_scene_id and status='sealed';
  if v_comp.block_count <> 79 or v_comp.terminal_lf <> 0 then
    raise exception using errcode='22023', message='TRANSLATION_COMPARISON_STRUCTURE_UNSUPPORTED';
  end if;

  select * into strict v_doc from public.novel_documents
    where id='quantum-vibration-novel-en-act-2' and slug='quantum-vibration-novel-en-act-2';
  -- Scene identity, not Chapter title or array position, identifies the EN Scene.
  select coalesce(jsonb_agg(s), '[]'::jsonb) into v_matches
    from jsonb_array_elements(v_doc.data->'chapters') c
    cross join lateral jsonb_array_elements(c->'scenes') s
    where s->>'id'=v_scene.scene_id;
  if jsonb_array_length(v_matches)=1 then v_en_scene:=v_matches->0; end if;

  for v_row in
    select cb.position, cb.block_unit_id, cb.block_version_id, cb.separator_after,
      ku.project_id ko_project_id, kv.paragraph_unit_id ko_version_unit_id, kv.body_markdown ko_body,
      a.id alignment_id, a.relation, a.en_block_unit_id, a.en_block_version_id,
      eu.project_id en_project_id, eu.unit_type en_unit_type, ev.paragraph_unit_id en_version_unit_id,
      ev.body_markdown en_body
    from public.ko_scene_composition_blocks cb
    left join public.content_units ku on ku.id=cb.block_unit_id
    left join public.paragraph_versions kv on kv.id=cb.block_version_id
    left join public.ko_en_block_alignments a on a.ko_block_unit_id=cb.block_unit_id
      and a.managed_scene_id=p_managed_scene_id
    left join public.content_units eu on eu.id=a.en_block_unit_id
    left join public.paragraph_versions ev on ev.id=a.en_block_version_id
    where cb.composition_id=v_comp.id order by cb.position
  loop
    v_count:=v_count+1;
    if v_row.position<>v_count or v_row.ko_project_id is distinct from v_scene.logical_project_id
      or v_row.ko_version_unit_id is distinct from v_row.block_unit_id or v_row.ko_body is null
      or v_row.separator_after is distinct from (case when v_count=79 then '' else E'\n\n' end) then
      raise exception using errcode='22023', message='KO_COMPARISON_MAPPING_INVALID';
    end if;
    -- Pinned provenance is never replaced with latest EN when a reference is missing.
    if v_row.alignment_id is null or v_row.relation<>'translation_of'
      or v_row.en_project_id is distinct from '707e3ae1-0817-467a-bb42-5401c646151e'::uuid
      or v_row.en_unit_type is distinct from 'paragraph'
      or v_row.en_version_unit_id is distinct from v_row.en_block_unit_id or v_row.en_body is null
      or not exists (
        select 1 from public.revision_content_map m
        join public.revision_snapshots snap on snap.id=m.snapshot_id
        join public.content_units es on es.id=m.parent_unit_id
        where m.unit_id=v_row.en_block_unit_id
          and es.id='55b46292-0335-5fbc-ab9e-baa44d3bea70'::uuid
          and es.unit_type='scene' and es.source_path='act-2/ch-2/sc-1'
          and es.project_id=v_row.en_project_id and snap.project_id=v_row.en_project_id
      ) then
      raise exception using errcode='22023', message='PINNED_EN_ALIGNMENT_INVALID';
    end if;

    v_latest_id:=null; v_latest_body:=null; v_status:='unavailable';
    if jsonb_typeof(v_en_scene->'paragraphs')='array' then
      select coalesce(jsonb_agg(p), '[]'::jsonb) into v_matches
        from jsonb_array_elements(v_en_scene->'paragraphs') p
        where coalesce(p->>'unitId',p->>'id')=v_row.en_block_unit_id::text;
      if jsonb_array_length(v_matches)=1 then
        v_latest:=v_matches->0;
        if (v_latest->>'revisionVersionId') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
          select pv.id,pv.body_markdown into v_latest_id,v_latest_body
            from public.paragraph_versions pv
            where pv.id=(v_latest->>'revisionVersionId')::uuid
              and pv.paragraph_unit_id=v_row.en_block_unit_id
              and pv.body_markdown=v_latest->'versions'->(v_latest->>'activeVersion')->>'content';
          if found then
            v_status:=case when v_latest_id=v_row.en_block_version_id and v_latest_body=v_row.en_body
              then 'unchanged' else 'changed' end;
          end if;
        end if;
      end if;
    end if;
    if v_status='changed' then v_changed:=v_changed+1; end if;
    if v_status='unavailable' then v_unavailable:=v_unavailable+1; end if;
    v_body:=v_body||v_row.ko_body||v_row.separator_after;
    v_en_body:=v_en_body||v_row.en_body||v_row.separator_after;
    v_rows:=v_rows||jsonb_build_array(jsonb_build_object(
      'position',v_row.position,'ko_unit_id',v_row.block_unit_id,'ko_version_id',v_row.block_version_id,
      'ko_body',v_row.ko_body,'separator_after',v_row.separator_after,'alignment_id',v_row.alignment_id,
      'en_unit_id',v_row.en_block_unit_id,'en_version_id',v_row.en_block_version_id,
      'en_body',v_row.en_body,'en_body_sha256',public.ros_ko_sha256_text(v_row.en_body),
      'en_latest_version_id',v_latest_id,'en_latest_body',v_latest_body,
      'en_latest_body_sha256',public.ros_ko_sha256_text(v_latest_body),'en_status',v_status));
  end loop;
  if v_count<>79 or public.ros_ko_sha256_text(v_body)<>v_comp.body_sha256
    or (select count(distinct r->>'en_unit_id') from jsonb_array_elements(v_rows) r)<>79 then
    raise exception using errcode='22023', message='COMPARISON_RECONSTRUCTION_FAILED';
  end if;
  if jsonb_typeof(v_en_scene->'paragraphs')='array' then
    v_structure_changed:=
      (select jsonb_agg(coalesce(p->>'unitId',p->>'id') order by n)
         from jsonb_array_elements(v_en_scene->'paragraphs') with ordinality x(p,n))
      is distinct from
      (select jsonb_agg(r->>'en_unit_id' order by n) from jsonb_array_elements(v_rows) with ordinality x(r,n));
  end if;
  return jsonb_build_object('format','novel-translation-comparison-v1',
    'managed_scene_id',v_scene.id,'scene_id',v_scene.scene_id,'source_key',v_scene.source_key,
    'ko_document_id',v_scene.document_id,'ko_document_slug',v_scene.document_slug,
    'ko_composition_id',v_comp.id,'ko_body_sha256',v_comp.body_sha256,'ko_body',v_body,
    'ko_title',v_comp.title_snapshot,'ko_terminal_lf',v_comp.terminal_lf,
    'en_document_id',v_doc.id,'en_document_slug',v_doc.slug,'en_scene_id',v_scene.scene_id,
    'en_title',v_en_scene->>'title','en_title_basis','current_reader',
    'en_body',v_en_body,'en_body_sha256',public.ros_ko_sha256_text(v_en_body),'en_terminal_lf',0,
    'rows',v_rows,'changed_count',v_changed,'unavailable_count',v_unavailable,
    'en_latest_structure_changed',v_structure_changed,
    'latest_status',case when v_unavailable>0 then 'unavailable'
      when v_changed>0 or v_structure_changed then 'changed' else 'unchanged' end);
end $$;

revoke all on function public.ros_ko_get_translation_comparison(uuid,uuid) from public,anon,authenticated;
grant execute on function public.ros_ko_get_translation_comparison(uuid,uuid) to authenticated;
comment on function public.ros_ko_get_translation_comparison(uuid,uuid) is
  'Read-only owner-scoped first KO Scene comparison. Pinned EN versions are immutable translation references; latest EN is separately identity-matched.';
commit;
