-- ROS-KO-BLOCK-MODEL-01: authenticated, target-scoped mutation/read RPCs.

create or replace function public.ros_ko_request_begin(
  p_request_id uuid, p_operation text, p_spec_id text, p_input_text text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=public.ros_ko_require_actor(); v_req ros_ko_private.ko_mutation_requests;
begin
  perform pg_advisory_xact_lock(hashtextextended(v_actor::text||':'||p_request_id::text,0));
  insert into ros_ko_private.ko_mutation_requests(
    owner_id,request_id,operation,input_spec_id,request_input_sha256,request_input_text,request_input_hex
  ) values (
    v_actor,p_request_id,p_operation,p_spec_id,public.ros_ko_sha256_text(p_input_text),p_input_text,
    encode(convert_to(p_input_text,'UTF8'),'hex')
  ) on conflict do nothing;
  select * into strict v_req from ros_ko_private.ko_mutation_requests
    where owner_id=v_actor and request_id=p_request_id for update;
  if v_req.operation<>p_operation or v_req.input_spec_id<>p_spec_id
     or v_req.request_input_sha256<>public.ros_ko_sha256_text(p_input_text)
     or v_req.request_input_text<>p_input_text then
    raise exception using errcode='22023',message='IDEMPOTENCY_KEY_REUSE';
  end if;
  if v_req.status='completed' then return v_req.result||jsonb_build_object('replayed',true); end if;
  return null;
end $$;

create or replace function public.ros_ko_request_complete(
  p_request_id uuid,p_result_spec_id text,p_result_text text,p_result jsonb
) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=public.ros_ko_require_actor();
begin
  update ros_ko_private.ko_mutation_requests set status='completed',result_spec_id=p_result_spec_id,
    result_manifest_sha256=public.ros_ko_sha256_text(p_result_text),result_manifest_text=p_result_text,
    result_manifest_hex=encode(convert_to(p_result_text,'UTF8'),'hex'),result=p_result,completed_at=statement_timestamp()
  where owner_id=v_actor and request_id=p_request_id and status='running';
  if not found then raise exception using errcode='40001',message='REQUEST_COMPLETION_STATE_MISMATCH'; end if;
  return p_result;
end $$;

create or replace function public.ros_ko_result_manifest_text(
  p_request_id uuid,p_request_input_sha text,p_operation text,p_managed_scene_id uuid,
  p_project_id uuid,p_archive_id uuid,p_composition_id uuid,p_selection_id uuid,p_generation bigint
) returns text language plpgsql stable security definer set search_path='' as $$
declare v_fields text[]; v_scene public.ko_managed_scenes; v_comp public.ko_scene_composition_revisions;
begin
  select * into strict v_scene from public.ko_managed_scenes where id=p_managed_scene_id;
  select * into strict v_comp from public.ko_scene_composition_revisions where id=p_composition_id;
  v_fields:=array['ROS-KO-RESULT-MANIFEST-LPF-V2',p_request_id::text,p_request_input_sha,p_operation,
    p_project_id::text,p_managed_scene_id::text,p_archive_id::text,v_comp.block_count::text];
  select v_fields||coalesce(array_agg(value order by position,field_order),array[]::text[]) into v_fields
  from (select cb.position,f.field_order,f.value from public.ko_scene_composition_blocks cb
    left join public.ko_en_block_alignments a on a.ko_block_unit_id=cb.block_unit_id
    cross join lateral(values(1,lpad(cb.position::text,6,'0')),(2,cb.block_unit_id::text),
      (3,cb.block_version_id::text),(4,a.id::text)) f(field_order,value)
    where cb.composition_id=p_composition_id) q;
  v_fields:=v_fields||array[p_composition_id::text,v_comp.block_count::text];
  select v_fields||coalesce(array_agg(value order by position,field_order),array[]::text[]) into v_fields
  from (select cb.position,f.field_order,f.value from public.ko_scene_composition_blocks cb
    cross join lateral(values(1,lpad(cb.position::text,6,'0')),(2,cb.block_unit_id::text),
      (3,cb.block_version_id::text),(4,encode(convert_to(cb.separator_after,'UTF8'),'hex'))) f(field_order,value)
    where cb.composition_id=p_composition_id) q;
  v_fields:=v_fields||array[null,p_selection_id::text,p_generation::text,v_comp.block_count::text,
    v_comp.body_sha256,v_comp.manifest_sha256,(select projection_sha256 from public.ko_scene_reader_projections where managed_scene_id=p_managed_scene_id)];
  return public.ros_ko_lpf_v2(variadic v_fields);
end $$;

create or replace function public.ros_ko_migrate_scene(
  p_request_id uuid,p_expected_document_sha256 text,p_payload jsonb
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_actor uuid:=public.ros_ko_require_actor(); v_replay jsonb; v_doc public.novel_documents; v_root public.novel_documents;
  v_scene jsonb; v_legacy jsonb; v_path text[]; v_project uuid; v_managed uuid; v_archive uuid; v_comp uuid;
  v_selection uuid; v_unit uuid; v_version uuid; v_alignment uuid; v_row jsonb; v_pos int; v_body text:='';
  v_projection jsonb; v_manifest_text text; v_manifest_sha text; v_input text; v_result_text text; v_result jsonb;
  v_expected_blocks int:=(p_payload->>'block_count')::int;
begin
  perform public.ros_ko_assert_authorized(v_actor,p_payload->>'document_id',p_payload->>'scene_id','migrate');
  select id into v_project from public.revision_projects where slug=p_payload->>'project_slug';
  if v_project is null then
    insert into public.revision_projects(slug,title,description,source_document_id,owner_id)
      values(p_payload->>'project_slug',p_payload->>'project_title','KO immutable block model',p_payload->>'document_id',v_actor)
      returning id into v_project;
  elsif not exists(select 1 from public.revision_projects where id=v_project and owner_id=v_actor) then
    raise exception using errcode='42501',message='KO_PROJECT_OWNER_MISMATCH';
  end if;
  v_input:=public.ros_ko_lpf_v2(
    'ROS-KO-MIGRATION-REQUEST-LPF-V2',p_request_id::text,v_actor::text,v_project::text,
    p_payload->>'document_id',p_payload->>'document_slug',p_payload->>'scene_path_lpf',p_payload->>'scene_id',
    null,'0',null,p_expected_document_sha256,p_payload->>'expected_projection_sha256',p_payload->>'body_sha256',
    p_payload->>'review_manifest_sha256','initialize_review');
  v_replay:=public.ros_ko_request_begin(p_request_id,'migrate','ROS-KO-MIGRATION-REQUEST-LPF-V2',v_input);
  if v_replay is not null then return v_replay; end if;
  v_path:=array(select jsonb_array_elements_text(p_payload->'scene_path'));
  select * into strict v_root from public.novel_documents where id=p_payload->>'root_document_id' and slug=p_payload->>'root_document_id' for update;
  select * into strict v_doc from public.novel_documents where id=p_payload->>'document_id' and slug=p_payload->>'document_slug' for update;
  if public.ros_ko_sha256_text(v_doc.data::text)<>p_expected_document_sha256 then raise exception using errcode='40001',message='STALE_DOCUMENT_PREIMAGE'; end if;
  v_scene:=v_doc.data#>v_path;
  if v_scene is null or v_scene->>'id'<>p_payload->>'scene_id' or v_scene->>'title'<>p_payload->>'title_snapshot' then
    raise exception using errcode='22023',message='TARGET_SCENE_SCOPE_MISMATCH'; end if;
  if public.ros_ko_sha256_text((v_scene->'paragraphs')::text)<>p_payload->>'expected_projection_sha256' then
    raise exception using errcode='40001',message='STALE_LEGACY_PROJECTION'; end if;
  if jsonb_array_length(v_scene->'paragraphs')<>1 then raise exception using errcode='22023',message='LEGACY_PARAGRAPH_COUNT_MISMATCH'; end if;
  v_legacy:=(v_scene->'paragraphs')->0;
  if v_legacy->>'id'<>p_payload->>'legacy_paragraph_id' then raise exception using errcode='22023',message='LEGACY_PARAGRAPH_ID_MISMATCH'; end if;
  if exists(select 1 from public.ko_managed_scenes where document_id=v_doc.id and scene_id=p_payload->>'scene_id') then
    raise exception using errcode='23505',message='SCENE_ALREADY_MANAGED'; end if;
  for v_row in select value from jsonb_array_elements(p_payload->'blocks') loop
    v_pos:=(v_row->>'position')::int;
    if v_pos<1 or v_pos>v_expected_blocks or public.ros_ko_sha256_text(v_row->>'body')<>v_row->>'body_sha256'
       or octet_length(convert_to(v_row->>'body','UTF8'))<>(v_row->>'body_bytes')::int then
      raise exception using errcode='22023',message='BLOCK_PAYLOAD_INTEGRITY_FAILED'; end if;
    if not exists(select 1 from public.paragraph_versions pv join public.content_units cu on cu.id=pv.paragraph_unit_id
      where cu.id=(v_row->>'en_unit_id')::uuid and pv.id=(v_row->>'en_version_id')::uuid
        and public.ros_ko_sha256_text(pv.body_markdown)=v_row->>'en_body_sha256') then
      raise exception using errcode='40001',message='EN_ALIGNMENT_PREIMAGE_CHANGED'; end if;
    v_body:=v_body||(v_row->>'body')||(v_row->>'separator_after');
  end loop;
  if jsonb_array_length(p_payload->'blocks')<>v_expected_blocks or octet_length(convert_to(v_body,'UTF8'))<>(p_payload->>'body_bytes')::int
     or length(v_body)-length(replace(v_body,E'\n',''))<>(p_payload->>'body_lf')::int
     or public.ros_ko_sha256_text(v_body)<>p_payload->>'body_sha256' then
    raise exception using errcode='22023',message='SCENE_BODY_CONTRACT_MISMATCH'; end if;
  insert into public.ko_managed_scenes(logical_project_id,owner_id,root_document_id,document_id,document_slug,scene_id,scene_path,
    source_key,legacy_paragraph_id,manuscript_version,title_snapshot)
  values(v_project,v_actor,v_root.id,v_doc.id,v_doc.slug,p_payload->>'scene_id',v_path,p_payload->>'source_key',p_payload->>'legacy_paragraph_id',
    p_payload->>'manuscript_version',p_payload->>'title_snapshot') returning id into v_managed;
  insert into ros_ko_private.ko_scene_legacy_archives(managed_scene_id,source_document_id,source_document_slug,source_updated_at,
    source_row_json,source_row_text,source_row_hex,source_row_bytes,source_row_sha256,source_scene_json,source_scene_text,source_scene_hex,
    source_scene_bytes,source_scene_sha256,legacy_paragraph_json,legacy_paragraph_text,legacy_paragraph_hex,legacy_paragraph_bytes,
    legacy_paragraph_sha256,created_by)
  values(v_managed,v_doc.id,v_doc.slug,v_doc.updated_at,to_jsonb(v_doc),to_jsonb(v_doc)::text,encode(convert_to(to_jsonb(v_doc)::text,'UTF8'),'hex'),
    octet_length(convert_to(to_jsonb(v_doc)::text,'UTF8')),public.ros_ko_sha256_text(to_jsonb(v_doc)::text),v_scene,v_scene::text,
    encode(convert_to(v_scene::text,'UTF8'),'hex'),octet_length(convert_to(v_scene::text,'UTF8')),public.ros_ko_sha256_text(v_scene::text),
    v_legacy,v_legacy::text,encode(convert_to(v_legacy::text,'UTF8'),'hex'),octet_length(convert_to(v_legacy::text,'UTF8')),
    public.ros_ko_sha256_text(v_legacy::text),v_actor) returning id into v_archive;
  insert into public.ko_scene_composition_revisions(managed_scene_id,revision_no,manuscript_version,title_snapshot,block_count,terminal_lf,
    body_bytes,body_lf,body_sha256,input_review_manifest_sha256,manifest_sha256,created_by)
  values(v_managed,1,p_payload->>'manuscript_version',p_payload->>'title_snapshot',v_expected_blocks,(p_payload->>'terminal_lf')::smallint,
    (p_payload->>'body_bytes')::int,(p_payload->>'body_lf')::int,p_payload->>'body_sha256',p_payload->>'review_manifest_sha256',repeat('0',64),v_actor)
  returning id into v_comp;
  for v_row in select value from jsonb_array_elements(p_payload->'blocks') order by (value->>'position')::int loop
    v_pos:=(v_row->>'position')::int;
    insert into public.content_units(project_id,unit_type,source_key,source_path,original_position)
      values(v_project,'paragraph',v_row->>'ko_source_key',(p_payload->>'source_key')||'/'||(v_row->>'ko_source_key'),v_pos) returning id into v_unit;
    insert into public.paragraph_versions(paragraph_unit_id,version_no,body_markdown,body_hash,change_type,change_note,word_count,created_by)
      values(v_unit,1,v_row->>'body',public.ros_ko_sha256_text(v_row->>'body'),'import','r01 block materialization',
        case when btrim(v_row->>'body')='' then 0 else cardinality(regexp_split_to_array(btrim(v_row->>'body'),E'\\s+')) end,v_actor)
      returning id into v_version;
    insert into public.ko_scene_composition_blocks values(v_comp,v_pos,v_unit,v_version,v_row->>'ko_source_key',v_row->>'separator_after');
    insert into public.ko_en_block_alignments(ko_block_unit_id,managed_scene_id,en_block_unit_id,en_block_version_id,relation,evidence_manifest_sha256)
      values(v_unit,v_managed,(v_row->>'en_unit_id')::uuid,(v_row->>'en_version_id')::uuid,'translation_of',p_payload->>'review_manifest_sha256')
      returning id into v_alignment;
  end loop;
  v_manifest_text:=public.ros_ko_composition_manifest_text(v_comp); v_manifest_sha:=public.ros_ko_sha256_text(v_manifest_text);
  update public.ko_scene_composition_revisions set manifest_sha256=v_manifest_sha,status='sealed' where id=v_comp;
  set constraints public.ko_composition_validate_deferred immediate;
  v_projection:=public.ros_ko_build_projection(v_comp,1);
  insert into public.ko_scene_display_selections(managed_scene_id,review_composition_id,legacy_archive_id,display_mode,generation,updated_by)
    values(v_managed,v_comp,v_archive,'composition',1,v_actor) returning id into v_selection;
  update public.ko_managed_scenes set generation=1 where id=v_managed;
  insert into public.ko_scene_reader_projections(managed_scene_id,composition_id,generation,paragraphs,body_sha256,manifest_sha256,projection_sha256)
    values(v_managed,v_comp,1,v_projection,p_payload->>'body_sha256',v_manifest_sha,public.ros_ko_sha256_text(v_projection::text));
  insert into public.ko_scene_state_events(managed_scene_id,event_type,to_generation,to_composition_id,request_id,actor_id)
    values(v_managed,'migrated',1,v_comp,p_request_id,v_actor);
  insert into public.ko_protected_documents(document_id,document_slug,protection_reason,managed_scene_id)
    values(v_doc.id,v_doc.slug,'managed KO block Scene',v_managed),(v_root.id,v_root.slug,'root of managed KO block Scene',v_managed);
  perform set_config('ros_ko.internal_actor',v_actor::text,true); perform set_config('ros_ko.internal_request_id',p_request_id::text,true);
  perform set_config('ros_ko.internal_document_id',v_doc.id,true);
  update public.novel_documents set data=jsonb_set(jsonb_set(jsonb_set(data,v_path||array['paragraphs'],v_projection,false),
    v_path||array['storageModel'],to_jsonb('ros-ko-block-v1'::text),true),v_path||array['managedSceneId'],to_jsonb(v_managed::text),true)
    where id=v_doc.id and public.ros_ko_sha256_text(data::text)=p_expected_document_sha256;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_PROJECTION_UPDATE'; end if;
  v_result_text:=public.ros_ko_result_manifest_text(p_request_id,public.ros_ko_sha256_text(v_input),'migrate',v_managed,v_project,v_archive,v_comp,v_selection,1);
  v_result:=jsonb_build_object('replayed',false,'managed_scene_id',v_managed,'logical_project_id',v_project,'legacy_archive_id',v_archive,
    'composition_id',v_comp,'selection_id',v_selection,'generation',1,'block_count',v_expected_blocks,'body_sha256',p_payload->>'body_sha256',
    'manifest_sha256',v_manifest_sha,'projection_sha256',public.ros_ko_sha256_text(v_projection::text),'request_input_sha256',public.ros_ko_sha256_text(v_input),
    'result_manifest_sha256',public.ros_ko_sha256_text(v_result_text));
  return public.ros_ko_request_complete(p_request_id,'ROS-KO-RESULT-MANIFEST-LPF-V2',v_result_text,v_result);
end $$;

create or replace function public.ros_ko_get_scene(p_managed_scene_id uuid,p_composition_id uuid default null,p_include_legacy boolean default false)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_scene public.ko_managed_scenes; v_sel public.ko_scene_display_selections; v_comp uuid; v_result jsonb; v_paragraphs jsonb; v_body text; v_history jsonb;
begin
  v_scene:=public.ros_ko_assert_scene_owner(p_managed_scene_id,'read');
  select * into strict v_sel from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id;
  select coalesce(jsonb_agg(jsonb_build_object('composition_id',id,'revision_no',revision_no,'manuscript_version',manuscript_version,
    'body_sha256',body_sha256,'created_at',created_at,'is_review',id=v_sel.review_composition_id) order by revision_no desc),'[]'::jsonb)
    into v_history from public.ko_scene_composition_revisions where managed_scene_id=p_managed_scene_id and status='sealed';
  if p_composition_id is null and v_sel.display_mode='legacy' then
    select source_scene_json->'paragraphs' into v_paragraphs from ros_ko_private.ko_scene_legacy_archives where id=v_sel.legacy_archive_id;
    select string_agg(coalesce(item->'versions'->(item->>'activeVersion')->>'content',''),E'\n\n' order by ordinality)
      into v_body from jsonb_array_elements(v_paragraphs) with ordinality as legacy(item,ordinality);
    return jsonb_build_object('managed_scene_id',v_scene.id,'scene_id',v_scene.scene_id,'source_key',v_scene.source_key,'display_mode','legacy',
      'generation',v_sel.generation,'review_composition_id',v_sel.review_composition_id,'requested_composition_id',null,'read_only',true,
      'composition',jsonb_build_object('block_count',jsonb_array_length(v_paragraphs),'body_sha256',public.ros_ko_sha256_text(coalesce(v_body,'')),
        'manifest_sha256',null,'terminal_lf',0),'paragraphs',v_paragraphs,'projection_sha256',public.ros_ko_sha256_text(v_paragraphs::text),
      'available_compositions',v_history,'legacy_available',v_sel.legacy_archive_id is not null);
  end if;
  v_comp:=coalesce(p_composition_id,v_sel.review_composition_id);
  if not exists(select 1 from public.ko_scene_composition_revisions where id=v_comp and managed_scene_id=p_managed_scene_id and status='sealed') then
    raise exception using errcode='22023',message='COMPOSITION_SCOPE_MISMATCH'; end if;
  select jsonb_build_object('managed_scene_id',v_scene.id,'scene_id',v_scene.scene_id,'source_key',v_scene.source_key,'display_mode',v_sel.display_mode,
    'generation',v_sel.generation,'review_composition_id',v_sel.review_composition_id,'requested_composition_id',v_comp,
    'read_only',v_comp<>v_sel.review_composition_id or v_sel.display_mode<>'composition','composition',to_jsonb(cr),'paragraphs',public.ros_ko_build_projection(v_comp,v_sel.generation),
    'projection_sha256',public.ros_ko_sha256_text(public.ros_ko_build_projection(v_comp,v_sel.generation)::text),
    'available_compositions',v_history,'legacy_available',v_sel.legacy_archive_id is not null) into v_result
    from public.ko_scene_composition_revisions cr where cr.id=v_comp;
  if p_include_legacy then v_result:=v_result||jsonb_build_object('legacy_archive',(select jsonb_build_object('id',id,'source_row_sha256',source_row_sha256,
    'source_scene_sha256',source_scene_sha256,'legacy_paragraph_sha256',legacy_paragraph_sha256,'source_scene_json',source_scene_json) from ros_ko_private.ko_scene_legacy_archives where id=v_sel.legacy_archive_id)); end if;
  return v_result;
end $$;

-- Browsing the immutable legacy Scene is read-only and does not move either
-- the review pointer or the persisted Reader projection.
create or replace function public.ros_ko_get_legacy_scene(p_managed_scene_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_scene public.ko_managed_scenes; v_sel public.ko_scene_display_selections; v_paragraphs jsonb; v_body text; v_history jsonb;
begin
  v_scene:=public.ros_ko_assert_scene_owner(p_managed_scene_id,'read');
  select * into strict v_sel from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id;
  if v_sel.legacy_archive_id is null then raise exception using errcode='22023',message='LEGACY_ARCHIVE_NOT_AVAILABLE'; end if;
  select source_scene_json->'paragraphs' into strict v_paragraphs from ros_ko_private.ko_scene_legacy_archives where id=v_sel.legacy_archive_id;
  select string_agg(coalesce(item->'versions'->(item->>'activeVersion')->>'content',''),E'\n\n' order by ordinality)
    into v_body from jsonb_array_elements(v_paragraphs) with ordinality as legacy(item,ordinality);
  select coalesce(jsonb_agg(jsonb_build_object('composition_id',id,'revision_no',revision_no,'manuscript_version',manuscript_version,
    'body_sha256',body_sha256,'created_at',created_at,'is_review',id=v_sel.review_composition_id) order by revision_no desc),'[]'::jsonb)
    into v_history from public.ko_scene_composition_revisions where managed_scene_id=p_managed_scene_id and status='sealed';
  return jsonb_build_object('managed_scene_id',v_scene.id,'scene_id',v_scene.scene_id,'source_key',v_scene.source_key,'display_mode','legacy_browse',
    'generation',v_sel.generation,'review_composition_id',v_sel.review_composition_id,'requested_composition_id',null,'read_only',true,
    'composition',jsonb_build_object('block_count',jsonb_array_length(v_paragraphs),'body_sha256',public.ros_ko_sha256_text(coalesce(v_body,'')),
      'manifest_sha256',null,'terminal_lf',0),'paragraphs',v_paragraphs,'projection_sha256',public.ros_ko_sha256_text(v_paragraphs::text),
    'available_compositions',v_history,'legacy_available',true);
end $$;

-- A rewrite changes one immutable Block Version and advances one immutable Scene composition.
create or replace function public.ros_ko_rewrite_block(p_request_id uuid,p_managed_scene_id uuid,p_expected_generation bigint,
  p_expected_composition_id uuid,p_block_unit_id uuid,p_expected_parent_version_id uuid,p_expected_parent_body_sha256 text,
  p_expected_projection_sha256 text,p_new_body text,p_note text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=public.ros_ko_require_actor(); v_scene public.ko_managed_scenes; v_sel public.ko_scene_display_selections;
  v_old public.ko_scene_composition_revisions; v_parent public.paragraph_versions; v_ver uuid; v_comp uuid; v_rev int; v_body text;
  v_projection jsonb; v_manifest text; v_input text; v_replay jsonb; v_result text; v_json jsonb;
begin
  v_scene:=public.ros_ko_assert_scene_owner(p_managed_scene_id,'rewrite');
  v_input:=public.ros_ko_lpf_v2('ROS-KO-REWRITE-REQUEST-LPF-V2',p_request_id::text,v_actor::text,v_scene.logical_project_id::text,
    v_scene.document_id,v_scene.scene_id,p_expected_generation::text,p_expected_composition_id::text,(select manifest_sha256 from public.ko_scene_composition_revisions where id=p_expected_composition_id),
    p_expected_projection_sha256,p_block_unit_id::text,p_expected_parent_version_id::text,p_expected_parent_body_sha256,
    octet_length(convert_to(p_new_body,'UTF8'))::text,public.ros_ko_sha256_text(p_new_body),'rewrite','rewritten_from','advance_review',null);
  v_replay:=public.ros_ko_request_begin(p_request_id,'rewrite','ROS-KO-REWRITE-REQUEST-LPF-V2',v_input); if v_replay is not null then return v_replay; end if;
  select * into strict v_sel from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id for update;
  if v_sel.display_mode<>'composition' or v_sel.generation<>p_expected_generation or v_sel.review_composition_id<>p_expected_composition_id then
    raise exception using errcode='40001',message='STALE_COMPOSITION_GENERATION'; end if;
  select * into strict v_old from public.ko_scene_composition_revisions where id=p_expected_composition_id and status='sealed';
  select * into strict v_parent from public.paragraph_versions where id=p_expected_parent_version_id and paragraph_unit_id=p_block_unit_id;
  if public.ros_ko_sha256_text(v_parent.body_markdown)<>p_expected_parent_body_sha256 then raise exception using errcode='40001',message='STALE_PARENT_BODY'; end if;
  if not exists(select 1 from public.ko_scene_composition_blocks where composition_id=v_old.id and block_unit_id=p_block_unit_id and block_version_id=p_expected_parent_version_id) then
    raise exception using errcode='22023',message='PARENT_NOT_SELECTED'; end if;
  if (select projection_sha256 from public.ko_scene_reader_projections where managed_scene_id=p_managed_scene_id)<>p_expected_projection_sha256 then
    raise exception using errcode='40001',message='STALE_READER_PROJECTION'; end if;
  insert into public.paragraph_versions(paragraph_unit_id,version_no,body_markdown,body_hash,base_version_id,change_type,change_note,word_count,created_by)
    values(p_block_unit_id,(select max(version_no)+1 from public.paragraph_versions where paragraph_unit_id=p_block_unit_id),p_new_body,
      public.ros_ko_sha256_text(p_new_body),p_expected_parent_version_id,'rewrite',p_note,
      case when btrim(p_new_body)='' then 0 else cardinality(regexp_split_to_array(btrim(p_new_body),E'\\s+')) end,v_actor) returning id into v_ver;
  insert into public.paragraph_version_lineage(child_version_id,parent_version_id,relation_type) values(v_ver,p_expected_parent_version_id,'rewritten_from');
  select max(revision_no)+1 into v_rev from public.ko_scene_composition_revisions where managed_scene_id=p_managed_scene_id;
  insert into public.ko_scene_composition_revisions(managed_scene_id,revision_no,parent_revision_id,manuscript_version,title_snapshot,block_count,
    terminal_lf,body_bytes,body_lf,body_sha256,input_review_manifest_sha256,manifest_sha256,created_by)
    values(p_managed_scene_id,v_rev,v_old.id,v_old.manuscript_version,v_old.title_snapshot,v_old.block_count,v_old.terminal_lf,0,0,repeat('0',64),
      v_old.input_review_manifest_sha256,repeat('0',64),v_actor) returning id into v_comp;
  insert into public.ko_scene_composition_blocks select v_comp,position,block_unit_id,case when block_unit_id=p_block_unit_id then v_ver else block_version_id end,source_key,separator_after
    from public.ko_scene_composition_blocks where composition_id=v_old.id;
  select string_agg(pv.body_markdown||cb.separator_after,'' order by cb.position) into v_body from public.ko_scene_composition_blocks cb join public.paragraph_versions pv on pv.id=cb.block_version_id where cb.composition_id=v_comp;
  v_manifest:=public.ros_ko_composition_manifest_text(v_comp);
  update public.ko_scene_composition_revisions set body_bytes=octet_length(convert_to(v_body,'UTF8')),body_lf=length(v_body)-length(replace(v_body,E'\n','')),
    body_sha256=public.ros_ko_sha256_text(v_body),manifest_sha256=public.ros_ko_sha256_text(v_manifest),status='sealed' where id=v_comp;
  set constraints public.ko_composition_validate_deferred immediate;
  v_projection:=public.ros_ko_build_projection(v_comp,p_expected_generation+1);
  update public.ko_scene_display_selections set review_composition_id=v_comp,generation=generation+1,updated_by=v_actor,updated_at=statement_timestamp()
    where id=v_sel.id and generation=p_expected_generation; if not found then raise exception using errcode='40001',message='ZERO_ROW_SELECTION_UPDATE'; end if;
  update public.ko_scene_reader_projections set composition_id=v_comp,generation=p_expected_generation+1,paragraphs=v_projection,
    body_sha256=public.ros_ko_sha256_text(v_body),manifest_sha256=public.ros_ko_sha256_text(v_manifest),projection_sha256=public.ros_ko_sha256_text(v_projection::text),projected_at=statement_timestamp()
    where managed_scene_id=p_managed_scene_id and generation=p_expected_generation; if not found then raise exception using errcode='40001',message='ZERO_ROW_PROJECTION_ADVANCE'; end if;
  update public.ko_managed_scenes set generation=p_expected_generation+1 where id=p_managed_scene_id;
  insert into public.ko_scene_state_events(managed_scene_id,event_type,from_generation,to_generation,from_composition_id,to_composition_id,request_id,actor_id,detail)
    values(p_managed_scene_id,'review_advanced',p_expected_generation,p_expected_generation+1,v_old.id,v_comp,p_request_id,v_actor,
      jsonb_build_object('changed_unit_id',p_block_unit_id,'parent_version_id',p_expected_parent_version_id,'new_version_id',v_ver));
  perform set_config('ros_ko.internal_actor',v_actor::text,true);perform set_config('ros_ko.internal_request_id',p_request_id::text,true);perform set_config('ros_ko.internal_document_id',v_scene.document_id,true);
  update public.novel_documents set data=jsonb_set(data,v_scene.scene_path||array['paragraphs'],v_projection,false)
    where id=v_scene.document_id
      and public.ros_ko_sha256_text((data#>(v_scene.scene_path||array['paragraphs']))::text)=p_expected_projection_sha256;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_DOCUMENT_PROJECTION_UPDATE'; end if;
  v_result:=public.ros_ko_result_manifest_text(p_request_id,public.ros_ko_sha256_text(v_input),'rewrite',p_managed_scene_id,v_scene.logical_project_id,
    v_sel.legacy_archive_id,v_comp,v_sel.id,p_expected_generation+1);
  v_json:=jsonb_build_object('replayed',false,'managed_scene_id',p_managed_scene_id,'generation',p_expected_generation+1,'composition_id',v_comp,
    'new_version_id',v_ver,'body_sha256',public.ros_ko_sha256_text(v_body),'manifest_sha256',public.ros_ko_sha256_text(v_manifest),
    'projection_sha256',public.ros_ko_sha256_text(v_projection::text),'block_count',jsonb_array_length(v_projection),
    'request_input_sha256',public.ros_ko_sha256_text(v_input),'result_manifest_sha256',public.ros_ko_sha256_text(v_result));
  return public.ros_ko_request_complete(p_request_id,'ROS-KO-RESULT-MANIFEST-LPF-V2',v_result,v_json);
end $$;

create or replace function public.ros_ko_restore_legacy(p_request_id uuid,p_managed_scene_id uuid,p_expected_generation bigint,p_archive_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=public.ros_ko_require_actor();v_scene public.ko_managed_scenes;v_sel public.ko_scene_display_selections;v_arc ros_ko_private.ko_scene_legacy_archives;
  v_input text;v_replay jsonb;v_result text;v_json jsonb;v_expected_projection_sha256 text;
begin
  v_scene:=public.ros_ko_assert_scene_owner(p_managed_scene_id,'restore');
  v_input:=public.ros_ko_lpf_v2('ROS-KO-RESTORE-REQUEST-LPF-V2',p_request_id::text,v_actor::text,v_scene.logical_project_id::text,v_scene.document_id,v_scene.scene_id,
    p_expected_generation::text,(select review_composition_id::text from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id),
    (select projection_sha256 from public.ko_scene_reader_projections where managed_scene_id=p_managed_scene_id),p_archive_id::text,
    (select source_scene_sha256 from ros_ko_private.ko_scene_legacy_archives where id=p_archive_id),'legacy','increase_generation','preserve_canonical','legacy_restore');
  v_replay:=public.ros_ko_request_begin(p_request_id,'restore','ROS-KO-RESTORE-REQUEST-LPF-V2',v_input);if v_replay is not null then return v_replay;end if;
  select * into strict v_sel from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id for update;
  if v_sel.generation<>p_expected_generation then raise exception using errcode='40001',message='STALE_COMPOSITION_GENERATION';end if;
  select projection_sha256 into strict v_expected_projection_sha256 from public.ko_scene_reader_projections where managed_scene_id=p_managed_scene_id;
  select * into strict v_arc from ros_ko_private.ko_scene_legacy_archives where id=p_archive_id and managed_scene_id=p_managed_scene_id;
  update public.ko_scene_display_selections set display_mode='legacy',legacy_archive_id=p_archive_id,generation=generation+1,updated_by=v_actor,updated_at=statement_timestamp()
    where id=v_sel.id and generation=p_expected_generation;if not found then raise exception using errcode='40001',message='ZERO_ROW_RESTORE_UPDATE';end if;
  update public.ko_managed_scenes set generation=p_expected_generation+1 where id=p_managed_scene_id;
  insert into public.ko_scene_state_events(managed_scene_id,event_type,from_generation,to_generation,from_composition_id,request_id,actor_id,detail)
    values(p_managed_scene_id,'legacy_restored',p_expected_generation,p_expected_generation+1,v_sel.review_composition_id,p_request_id,v_actor,jsonb_build_object('archive_id',p_archive_id));
  perform set_config('ros_ko.internal_actor',v_actor::text,true);perform set_config('ros_ko.internal_request_id',p_request_id::text,true);perform set_config('ros_ko.internal_document_id',v_scene.document_id,true);
  update public.novel_documents set data=jsonb_set(data,v_scene.scene_path||array['paragraphs'],v_arc.source_scene_json->'paragraphs',false)
    where id=v_scene.document_id
      and public.ros_ko_sha256_text((data#>(v_scene.scene_path||array['paragraphs']))::text)=v_expected_projection_sha256;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_LEGACY_PROJECTION_UPDATE';end if;
  v_result:=public.ros_ko_lpf_v2('ROS-KO-RESTORE-RESULT-LPF-V2',p_request_id::text,public.ros_ko_sha256_text(v_input),p_managed_scene_id::text,p_archive_id::text,
    (p_expected_generation+1)::text,'legacy',v_sel.review_composition_id::text,'canonical_preserved');
  v_json:=jsonb_build_object('replayed',false,'managed_scene_id',p_managed_scene_id,'generation',p_expected_generation+1,'display_mode','legacy','archive_id',p_archive_id,
    'request_input_sha256',public.ros_ko_sha256_text(v_input),'result_manifest_sha256',public.ros_ko_sha256_text(v_result));
  return public.ros_ko_request_complete(p_request_id,'ROS-KO-RESTORE-RESULT-LPF-V2',v_result,v_json);
end $$;

-- A committed disaster-recovery restore is reversible without deleting the
-- restore event or any immutable composition. Reactivation advances the
-- generation and reinstates the already sealed review composition.
create or replace function public.ros_ko_reactivate_review(p_request_id uuid,p_managed_scene_id uuid,p_expected_generation bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=public.ros_ko_require_actor();v_scene public.ko_managed_scenes;v_sel public.ko_scene_display_selections;
  v_arc ros_ko_private.ko_scene_legacy_archives;v_projection jsonb;v_comp public.ko_scene_composition_revisions;
  v_input text;v_replay jsonb;v_result text;v_json jsonb;v_legacy_projection_sha text;
begin
  v_scene:=public.ros_ko_assert_scene_owner(p_managed_scene_id,'restore');
  v_input:=public.ros_ko_lpf_v2('ROS-KO-REACTIVATE-REQUEST-LPF-V2',p_request_id::text,v_actor::text,v_scene.logical_project_id::text,
    v_scene.document_id,v_scene.scene_id,p_expected_generation::text,(select review_composition_id::text from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id),
    (select legacy_archive_id::text from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id),'composition','increase_generation','preserve_history');
  v_replay:=public.ros_ko_request_begin(p_request_id,'restore','ROS-KO-REACTIVATE-REQUEST-LPF-V2',v_input);if v_replay is not null then return v_replay;end if;
  select * into strict v_sel from public.ko_scene_display_selections where managed_scene_id=p_managed_scene_id for update;
  if v_sel.generation<>p_expected_generation or v_sel.display_mode<>'legacy' then raise exception using errcode='40001',message='STALE_RESTORE_GENERATION';end if;
  select * into strict v_arc from ros_ko_private.ko_scene_legacy_archives where id=v_sel.legacy_archive_id and managed_scene_id=p_managed_scene_id;
  select * into strict v_comp from public.ko_scene_composition_revisions where id=v_sel.review_composition_id and managed_scene_id=p_managed_scene_id and status='sealed';
  v_legacy_projection_sha:=public.ros_ko_sha256_text((v_arc.source_scene_json->'paragraphs')::text);
  v_projection:=public.ros_ko_build_projection(v_comp.id,p_expected_generation+1);
  update public.ko_scene_display_selections set display_mode='composition',generation=generation+1,updated_by=v_actor,updated_at=statement_timestamp()
    where id=v_sel.id and generation=p_expected_generation;if not found then raise exception using errcode='40001',message='ZERO_ROW_REACTIVATE_UPDATE';end if;
  update public.ko_scene_reader_projections set generation=p_expected_generation+1,composition_id=v_comp.id,paragraphs=v_projection,
    body_sha256=v_comp.body_sha256,manifest_sha256=v_comp.manifest_sha256,projection_sha256=public.ros_ko_sha256_text(v_projection::text),projected_at=statement_timestamp()
    where managed_scene_id=p_managed_scene_id;if not found then raise exception using errcode='40001',message='ZERO_ROW_REACTIVATE_PROJECTION';end if;
  update public.ko_managed_scenes set generation=p_expected_generation+1 where id=p_managed_scene_id;
  insert into public.ko_scene_state_events(managed_scene_id,event_type,from_generation,to_generation,to_composition_id,request_id,actor_id,detail)
    values(p_managed_scene_id,'review_advanced',p_expected_generation,p_expected_generation+1,v_comp.id,p_request_id,v_actor,
      jsonb_build_object('archive_id',v_arc.id,'reason','reactivated_after_legacy_restore'));
  perform set_config('ros_ko.internal_actor',v_actor::text,true);perform set_config('ros_ko.internal_request_id',p_request_id::text,true);perform set_config('ros_ko.internal_document_id',v_scene.document_id,true);
  update public.novel_documents set data=jsonb_set(data,v_scene.scene_path||array['paragraphs'],v_projection,false)
    where id=v_scene.document_id and public.ros_ko_sha256_text((data#>(v_scene.scene_path||array['paragraphs']))::text)=v_legacy_projection_sha;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_REACTIVATE_DOCUMENT';end if;
  v_result:=public.ros_ko_lpf_v2('ROS-KO-REACTIVATE-RESULT-LPF-V2',p_request_id::text,public.ros_ko_sha256_text(v_input),p_managed_scene_id::text,
    v_comp.id::text,(p_expected_generation+1)::text,'composition','history_preserved');
  v_json:=jsonb_build_object('replayed',false,'managed_scene_id',p_managed_scene_id,'generation',p_expected_generation+1,'display_mode','composition',
    'composition_id',v_comp.id,'body_sha256',v_comp.body_sha256,'manifest_sha256',v_comp.manifest_sha256,
    'projection_sha256',public.ros_ko_sha256_text(v_projection::text),'request_input_sha256',public.ros_ko_sha256_text(v_input),
    'result_manifest_sha256',public.ros_ko_sha256_text(v_result));
  return public.ros_ko_request_complete(p_request_id,'ROS-KO-REACTIVATE-RESULT-LPF-V2',v_result,v_json);
end $$;

revoke all on function public.ros_ko_request_begin(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.ros_ko_request_complete(uuid,text,text,jsonb) from public,anon,authenticated;
revoke all on function public.ros_ko_result_manifest_text(uuid,text,text,uuid,uuid,uuid,uuid,uuid,bigint) from public,anon,authenticated;
revoke all on function public.ros_ko_migrate_scene(uuid,text,jsonb) from public,anon;
revoke all on function public.ros_ko_rewrite_block(uuid,uuid,bigint,uuid,uuid,uuid,text,text,text,text) from public,anon;
revoke all on function public.ros_ko_restore_legacy(uuid,uuid,bigint,uuid) from public,anon;
revoke all on function public.ros_ko_get_scene(uuid,uuid,boolean) from public,anon;
revoke all on function public.ros_ko_get_legacy_scene(uuid) from public,anon;
revoke all on function public.ros_ko_reactivate_review(uuid,uuid,bigint) from public,anon;
grant execute on function public.ros_ko_migrate_scene(uuid,text,jsonb) to authenticated;
grant execute on function public.ros_ko_rewrite_block(uuid,uuid,bigint,uuid,uuid,uuid,text,text,text,text) to authenticated;
grant execute on function public.ros_ko_restore_legacy(uuid,uuid,bigint,uuid) to authenticated;
grant execute on function public.ros_ko_get_scene(uuid,uuid,boolean) to authenticated;
grant execute on function public.ros_ko_get_legacy_scene(uuid) to authenticated;
grant execute on function public.ros_ko_reactivate_review(uuid,uuid,bigint) to authenticated;
