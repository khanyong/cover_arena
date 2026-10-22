-- A4/CH04/SC01 target-only delegated materialization and ordered Chapter/Scene-title application.
-- Approved by ROS-KO-A4-CH04-SC01-r01-EXEC-01-20261022.
-- Existing authenticated APIs, FK/RLS/guards and all past records are unchanged.
CREATE OR REPLACE FUNCTION ros_ko_private.migrate_a4_ch04_sc01_delegated(
  p_request_id uuid, p_expected_document_sha256 text, p_payload jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $function$
declare
  v_actor constant uuid := '3b3baba4-c608-45e5-98e9-fac61577b005';
  v_peer constant uuid := 'd5355824-7e26-4874-8bd2-ce58ca29a5b8';
  v_project constant uuid := '955c9b9e-146c-40b0-b57a-655195b11086';
  v_en_project constant uuid := '707e3ae1-0817-467a-bb42-5401c646151e';
  v_en_parent constant uuid := '60aad8d4-2589-59a8-ac55-bc42605db7ae';
  v_en_snapshot constant uuid := '66cda81f-6a3a-4c8b-a226-c7169ffd2710';
  v_input_spec constant text := 'ROS-KO-A4-CH04-SC01-DELEGATED-MIGRATION-LPF-V1';
  v_result_spec constant text := 'ROS-KO-A4-CH04-SC01-DELEGATED-RESULT-LPF-V1';
  v_expected_blocks constant int := 257;
  v_auth_actor uuid; v_audit jsonb; v_cap record; v_req ros_ko_private.ko_mutation_requests;
  v_doc public.novel_documents; v_root public.novel_documents;
  v_en_doc public.novel_documents; v_en_root public.novel_documents;
  v_scene jsonb; v_legacy jsonb; v_legacy_paragraphs jsonb;
  v_path text[] := array['chapters','3','scenes','0'];
  v_managed uuid; v_archive uuid; v_comp uuid; v_selection uuid; v_unit uuid; v_version uuid; v_alignment uuid;
  v_row jsonb; v_pos int; v_body text := ''; v_en_body text := ''; v_en_paragraph jsonb; v_en_version_body text;
  v_projection jsonb; v_manifest_text text; v_manifest_sha text; v_input text;
  v_result_text text; v_result jsonb; v_payload_sha text; v_review_text text;
  v_protection public.ko_protected_documents; v_protection_target record; v_root_origin_document_id text;
  v_cap_added jsonb := '[]'::jsonb; v_count int; v_started_at timestamptz;
  v_prev_actor text := current_setting('ros_ko.internal_actor',true);
  v_prev_request text := current_setting('ros_ko.internal_request_id',true);
  v_prev_document text := current_setting('ros_ko.internal_document_id',true);
begin
  -- This is a private direct-admin operation, not an authenticated user API.
  if session_user::text is distinct from 'postgres' or current_user::text is distinct from 'postgres' then
    raise exception using errcode='42501',message='NORMAL_POSTGRES_ADMIN_REQUIRED';
  end if;
  if current_setting('session_replication_role') is distinct from 'origin' then
    raise exception using errcode='42501',message='NORMAL_TRIGGER_EXECUTION_REQUIRED';
  end if;
  v_auth_actor := auth.uid();
  v_started_at := statement_timestamp();
  if p_request_id is null or jsonb_typeof(p_payload) is distinct from 'object'
     or coalesce(p_expected_document_sha256,'') !~ '^[0-9a-f]{64}$' then
    raise exception using errcode='22023',message='DELEGATED_INPUT_INVALID';
  end if;
  if p_payload->>'root_document_id' is distinct from 'quantum-vibration-novel'
     or p_payload->>'document_id' is distinct from 'quantum-vibration-novel-act-7'
     or p_payload->>'document_slug' is distinct from 'quantum-vibration-novel-act-7'
     or p_payload->>'scene_id' is distinct from 'bc44ce05'
     or p_payload->'scene_path' is distinct from to_jsonb(v_path)
     or p_payload->>'scene_path_lpf' is distinct from array_to_string(v_path,'/')
     or p_payload->>'source_key' is distinct from 'A4/CH04/SC01'
     or p_payload->>'legacy_paragraph_id' is distinct from '__empty_scene_bc44ce05__'
     or p_payload->>'title_snapshot' is distinct from '[Scene 1: What Changed When We Acted]'
     or p_payload->>'project_slug' is distinct from 'ros-ko-pro-ch01-sc01-blocks'
     or p_payload->>'project_title' is distinct from 'ROS-KO PRO/CH01/SC01 Blocks'
     or p_payload->>'manuscript_version' is distinct from 'r01'
     or p_payload->>'block_count' is distinct from '257'
     or p_payload->>'body_bytes' is distinct from '42735'
     or p_payload->>'body_lf' is distinct from '512'
     or p_payload->>'terminal_lf' is distinct from '0'
     or p_payload->>'expected_document_sha256' is distinct from p_expected_document_sha256
     or p_payload->>'body_sha256' is distinct from '961cda21d33102e47f882274f38e7a1f2e599aec4d30fc0820309b28939f7606'
     or p_payload->>'en_primary_snapshot_id' is distinct from v_en_snapshot::text
     or p_payload->>'en_parent_id' is distinct from v_en_parent::text
     or p_payload->>'en_project_id' is distinct from v_en_project::text
     or p_payload ?| array['legacy_contract','expected_legacy_count','expected_legacy_paragraphs'] then
    raise exception using errcode='22023',message='DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED';
  end if;
  if p_payload->'delegated_audit' is distinct from jsonb_build_object(
       'original_instruction_id','ROS-KO-A4-CH04-SC01-r01-EXEC-01-20261022',
       'original_instruction_sha256','a5b5db0ccf0311983b9a1cc382239664f45e2e3042d8309d43106f859f058648') then
    raise exception using errcode='22023',message='DELEGATED_DIRECT_INSTRUCTION_REQUIRED';
  end if;
  if jsonb_typeof(p_payload->'blocks') is distinct from 'array'
     or jsonb_array_length(p_payload->'blocks')<>257
     or coalesce(p_payload->>'expected_projection_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_legacy_scene_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'review_manifest_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_root_data_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_en_root_data_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_en_document_sha256','') !~ '^[0-9a-f]{64}$' then
    raise exception using errcode='22023',message='DELEGATED_PREIMAGE_CONTRACT_INVALID';
  end if;
  -- Keep both designated accounts usable; no profile flags or prior Act grants
  -- are treated as authority for this new Scene.
  perform 1 from auth.users where id in(v_actor,v_peer) order by id for share;
  select count(*) into v_count from auth.users
    where id in(v_actor,v_peer) and confirmed_at is not null and deleted_at is null
      and is_anonymous is false and (banned_until is null or banned_until<=statement_timestamp());
  if v_count<>2 then
    raise exception using errcode='42501',message='DESIGNATED_ACCOUNT_NOT_USABLE';
  end if;
  perform 1 from public.revision_projects where id=v_project for share;
  if not exists(select 1 from public.revision_projects
    where id=v_project and owner_id=v_actor and slug='ros-ko-pro-ch01-sc01-blocks'
      and title='ROS-KO PRO/CH01/SC01 Blocks' and source_document_id='quantum-vibration-novel-act-2') then
    raise exception using errcode='42501',message='EXISTING_KO_PROJECT_OWNER_MISMATCH';
  end if;
  v_payload_sha := public.ros_ko_sha256_text(p_payload::text);
  v_input := public.ros_ko_lpf_v2(
    v_input_spec,p_request_id::text,v_actor::text,v_project::text,
    p_payload->>'document_id',p_payload->>'document_slug',p_payload->>'scene_path_lpf',p_payload->>'scene_id',
    null,'0',null,p_expected_document_sha256,p_payload->>'expected_projection_sha256',
    p_payload->>'body_sha256',p_payload->>'review_manifest_sha256','initialize_review',
    v_payload_sha,session_user::text,current_user::text,v_auth_actor::text,'delegated_admin_not_login',
    p_payload#>>'{delegated_audit,original_instruction_id}',p_payload#>>'{delegated_audit,original_instruction_sha256}',
    null,null);
  v_audit := (p_payload->'delegated_audit')||jsonb_build_object(
    'mode','delegated_admin_not_login','database_executor','postgres',
    'original_instruction_sha256_provenance','original_pasted_request_bytes',
    'session_user',session_user::text,'current_user',current_user::text,
    'authenticated_actor_id',v_auth_actor,'delegated_audit_principal',v_actor,'manuscript_owner',v_actor,
    'logical_project_id',v_project,'supabase_project_ref','iklsghevdtqqkjuaympc',
    'root_document_id','quantum-vibration-novel','document_id','quantum-vibration-novel-act-7',
    'scene_id','bc44ce05','scene_path',to_jsonb(v_path),'source_key','A4/CH04/SC01',
    'request_id',p_request_id,'request_input_spec_id',v_input_spec,
    'request_input_sha256',public.ros_ko_sha256_text(v_input),'payload_sha256',v_payload_sha,
    'started_at',v_started_at);
  -- Same key, lock and exact byte contracts as the original request ledger,
  -- without its auth.uid()-requiring user entry point.
  perform pg_advisory_xact_lock(hashtextextended(v_actor::text||':'||p_request_id::text,0));
  insert into ros_ko_private.ko_mutation_requests(
    owner_id,request_id,operation,input_spec_id,request_input_sha256,request_input_text,request_input_hex)
  values(v_actor,p_request_id,'migrate',v_input_spec,public.ros_ko_sha256_text(v_input),v_input,
    encode(convert_to(v_input,'UTF8'),'hex')) on conflict do nothing;
  select * into strict v_req from ros_ko_private.ko_mutation_requests
    where owner_id=v_actor and request_id=p_request_id for update;
  if v_req.operation is distinct from 'migrate' or v_req.input_spec_id is distinct from v_input_spec
     or v_req.request_input_sha256 is distinct from public.ros_ko_sha256_text(v_input)
     or v_req.request_input_text is distinct from v_input
     or v_req.request_input_hex is distinct from encode(convert_to(v_input,'UTF8'),'hex') then
    raise exception using errcode='22023',message='IDEMPOTENCY_KEY_REUSE';
  end if;
  if v_req.status='completed' then
    -- Never re-materialize or point review back to generation 1 on replay.
    return v_req.result||jsonb_build_object('replayed',true);
  end if;
  -- Fixed root/Act locks also serialize different request IDs for this target.
  perform 1 from public.novel_documents
    where id in('quantum-vibration-novel','quantum-vibration-novel-act-7',
                'quantum-vibration-novel-en','quantum-vibration-novel-en-act-7')
    order by id for update;
  select * into strict v_root from public.novel_documents where id='quantum-vibration-novel' and slug=id;
  select * into strict v_doc from public.novel_documents where id='quantum-vibration-novel-act-7' and slug=id;
  select * into strict v_en_root from public.novel_documents where id='quantum-vibration-novel-en' and slug=id;
  select * into strict v_en_doc from public.novel_documents where id='quantum-vibration-novel-en-act-7' and slug=id;
  if public.ros_ko_sha256_text(v_doc.data::text) is distinct from p_expected_document_sha256
     or public.ros_ko_sha256_text(v_root.data::text) is distinct from p_payload->>'expected_root_data_sha256'
     or public.ros_ko_sha256_text(v_en_root.data::text) is distinct from p_payload->>'expected_en_root_data_sha256'
     or public.ros_ko_sha256_text(v_en_doc.data::text) is distinct from p_payload->>'expected_en_document_sha256' then
    raise exception using errcode='40001',message='STALE_DOCUMENT_PREIMAGE';
  end if;
  if v_doc.data->'number' is distinct from '7'::jsonb
     or v_en_doc.data->'number' is distinct from '7'::jsonb
     or v_doc.data#>'{chapters,3,number}' is distinct from '4'::jsonb
     or v_en_doc.data#>'{chapters,3,number}' is distinct from '4'::jsonb
     or v_doc.data#>>'{chapters,3,title}' is distinct from 'Chapter 4: The Resonance of Space'
     or v_en_doc.data#>>'{chapters,3,title}' is distinct from 'Chapter 4: The Resonance of Space'
     or v_doc.data#>'{chapters,3,scenes,0,number}' is distinct from '1'::jsonb
     or v_en_doc.data#>'{chapters,3,scenes,0,number}' is distinct from '1'::jsonb
     or v_en_doc.data#>>'{chapters,3,scenes,0,id}' is distinct from 'bc44ce05'
     or v_en_doc.data#>>'{chapters,3,scenes,0,title}' is distinct from '[Scene 1: What Changed When We Acted]'
     or left(v_en_root.title,5) is distinct from '[EN] '
     or left(v_en_doc.title,5) is distinct from '[EN] '
     or (select count(*) from jsonb_array_elements(v_root.data->'acts') a
         where a->'number'='7'::jsonb and a->>'title'=v_doc.data->>'title')<>1
     or (select count(*) from jsonb_array_elements(v_en_root.data->'acts') a
         where a->'number'='7'::jsonb and a->>'title'=v_en_doc.data->>'title')<>1
     or (select count(*) from jsonb_array_elements(v_doc.data->'chapters') c
         cross join lateral jsonb_array_elements(c->'scenes') s where s->>'id'='bc44ce05')<>1
     or (select count(*) from jsonb_array_elements(v_en_doc.data->'chapters') c
         cross join lateral jsonb_array_elements(c->'scenes') s where s->>'id'='bc44ce05')<>1 then
    raise exception using errcode='22023',message='CURRENT_KO_EN_MEMBERSHIP_MISMATCH';
  end if;
  -- Additional, bounded compatibility path for the existing canonical KO root.
  -- The old same-Act path below is unchanged. This path never reassigns a root
  -- protection, changes a project's source document, or alters request encoding.
  -- Both source and target Act documents must be real members of this KO root.
  select origin_doc.id into v_root_origin_document_id
    from public.ko_protected_documents root_guard
    join public.ko_managed_scenes origin_scene on origin_scene.id=root_guard.managed_scene_id
    join public.revision_projects origin_project on origin_project.id=origin_scene.logical_project_id
    join public.novel_documents origin_doc on origin_doc.id=origin_scene.document_id
    where root_guard.document_id=v_root.id and root_guard.document_slug=v_root.slug
      and root_guard.protection_reason='root of managed KO block Scene'
      and v_root.id='quantum-vibration-novel' and v_root.slug=v_root.id
      and v_root.data->>'id'=v_root.id and v_root.data->>'slug'=v_root.slug
      and left(v_root.title,5)='[KO] '
      and origin_scene.logical_project_id=v_project and origin_scene.owner_id=v_actor
      and origin_scene.root_document_id=v_root.id and origin_scene.storage_model='ros-ko-block-v1'
      and origin_project.owner_id=v_actor and origin_project.source_document_id=origin_doc.id
      and origin_scene.document_slug=origin_doc.slug and origin_doc.slug=origin_doc.id
      and left(origin_doc.title,5)='[KO] ' and left(v_doc.title,5)='[KO] '
      and jsonb_typeof(origin_doc.data->'number')='number'
      and origin_doc.data->>'number' ~ '^[1-9][0-9]*$'
      and origin_doc.id=v_root.id||'-act-'||(origin_doc.data->>'number')
      and jsonb_typeof(v_doc.data->'number')='number'
      and v_doc.data->>'number' ~ '^[1-9][0-9]*$'
      and v_doc.id=v_root.id||'-act-'||(v_doc.data->>'number') and v_doc.slug=v_doc.id
      and (select count(*) from jsonb_array_elements(case when jsonb_typeof(v_root.data->'acts')='array'
             then v_root.data->'acts' else '[]'::jsonb end) as a(item)
           where item->'number'=origin_doc.data->'number')=1
      and exists(select 1 from jsonb_array_elements(case when jsonb_typeof(v_root.data->'acts')='array'
             then v_root.data->'acts' else '[]'::jsonb end) as a(item)
           where item->'number'=origin_doc.data->'number' and item->>'title'=origin_doc.data->>'title')
      and (select count(*) from jsonb_array_elements(case when jsonb_typeof(v_root.data->'acts')='array'
             then v_root.data->'acts' else '[]'::jsonb end) as a(item)
           where item->'number'=v_doc.data->'number')=1
      and exists(select 1 from jsonb_array_elements(case when jsonb_typeof(v_root.data->'acts')='array'
             then v_root.data->'acts' else '[]'::jsonb end) as a(item)
           where item->'number'=v_doc.data->'number' and item->>'title'=v_doc.data->>'title')
    for share of root_guard,origin_scene,origin_project,origin_doc;
  -- A source-document mismatch is allowed only through that validated root.
  -- In particular, a different/unprotected root cannot make the reuse valid.
  if v_root_origin_document_id is null and exists (
      select 1 from public.revision_projects where id=v_project
        and source_document_id is distinct from v_doc.id) then
    raise exception using errcode='22023',message='SHARED_KO_PROTECTION_SCOPE_MISMATCH';
  end if;
  v_scene := v_doc.data#>v_path;
  if v_scene->>'id' is distinct from 'bc44ce05'
     or v_scene->>'title' is distinct from p_payload->>'title_snapshot'
     or public.ros_ko_sha256_text(v_scene::text) is distinct from p_payload->>'expected_legacy_scene_sha256'
     or public.ros_ko_sha256_text((v_scene->'paragraphs')::text) is distinct from p_payload->>'expected_projection_sha256' then
    raise exception using errcode='40001',message='STALE_LEGACY_SCENE';
  end if;
  v_legacy_paragraphs := v_scene->'paragraphs';
  if jsonb_typeof(v_legacy_paragraphs) is distinct from 'array' or jsonb_array_length(v_legacy_paragraphs)<>0 then
    raise exception using errcode='22023',message='EXACT_EMPTY_LEGACY_REQUIRED';
  end if;
  -- The schema requires a non-null legacy identifier/archive row even when the
  -- legacy Scene has no paragraph. The sentinel is internal metadata only; the
  -- exact empty array and complete source Scene remain sealed in the archive.
  v_legacy := 'null'::jsonb;
  if exists(select 1 from public.ko_managed_scenes
      where (document_id=v_doc.id and scene_id='bc44ce05')
         or (logical_project_id=v_project and source_key='A4/CH04/SC01')) then
    raise exception using errcode='23505',message='SCENE_ALREADY_MANAGED';
  end if;
  if exists(select 1 from public.content_units
      where project_id=v_project and
        (source_key in('A4/CH04/SC01','KO/A4/CH04/SC01') or source_key like 'KO/A4/CH04/SC01/%'
         or source_path like 'A4/CH04/SC01/%')) then
    raise exception using errcode='23505',message='PARTIAL_TARGET_UNITS_REQUIRE_REVIEW';
  end if;
  if exists(select 1 from ros_ko_private.ko_mutation_requests r
      where not (r.owner_id=v_actor and r.request_id=p_request_id)
        and r.operation='migrate' and r.status='running'
        and position(public.ros_ko_lpf_v2('quantum-vibration-novel-act-7') in r.request_input_text)>0
        and position(public.ros_ko_lpf_v2('bc44ce05') in r.request_input_text)>0) then
    raise exception using errcode='23505',message='UNFINISHED_TARGET_REQUEST_REQUIRES_REVIEW';
  end if;
  -- Exact grant flags are either absent or already identical; an explicit denial
  -- or broader grant is never overwritten by this delegated instruction.
  perform 1 from ros_ko_private.ko_scene_authorizations
    where document_id=v_doc.id and scene_id='bc44ce05' and actor_id in(v_actor,v_peer)
    order by actor_id for update;
  for v_cap in select * from ros_ko_private.ko_scene_authorizations
    where document_id=v_doc.id and scene_id='bc44ce05' and actor_id in(v_actor,v_peer)
  loop
    if v_cap.can_read is distinct from true or v_cap.can_rewrite is distinct from true
       or v_cap.can_migrate is distinct from (v_cap.actor_id=v_actor)
       or v_cap.can_restore is distinct from (v_cap.actor_id=v_actor) then
      raise exception using errcode='42501',message='EXISTING_TARGET_CAPABILITY_CONFLICT';
    end if;
  end loop;
  -- Lock the current primary snapshot and every map row of this Scene; updates
  -- to included/excluded mappings and FK-checked additions cannot race the seal.
  perform 1 from public.revision_snapshots where id=v_en_snapshot for update;
  if not exists(select 1 from public.revision_snapshots where id=v_en_snapshot
      and project_id=v_en_project and is_primary_working is true) then
    raise exception using errcode='40001',message='EN_PRIMARY_SNAPSHOT_CHANGED';
  end if;
  perform 1 from public.revision_content_map where snapshot_id=v_en_snapshot
    and parent_unit_id=v_en_parent order by unit_id for share;
  perform 1 from public.content_units where id in(v_en_parent,
    '8c7b7f90-5d77-5b5b-8e0f-34a95672c30b'::uuid,'0dde6825-5b2c-5263-b7ef-f58439f23746'::uuid)
    order by id for share;
  if not exists(select 1 from public.content_units s
      join public.content_units c on c.id=s.original_parent_id
      join public.content_units a on a.id=c.original_parent_id
    where s.id=v_en_parent and s.project_id=v_en_project and s.unit_type='scene'
      and s.source_key='act:7:ch:4:sc:1' and s.source_path='act-7/ch-4/sc-1'
      and s.title='[Scene 1: What Changed When We Acted]'
      and c.id='8c7b7f90-5d77-5b5b-8e0f-34a95672c30b' and c.project_id=v_en_project
      and c.unit_type='chapter' and c.source_key='act:7:ch:4'
      and c.title='Chapter 4: The Resonance of Space'
      and a.id='0dde6825-5b2c-5263-b7ef-f58439f23746' and a.project_id=v_en_project
      and a.unit_type='act' and a.source_key='act:7'
      and a.title='ACT 4: THE CANCELLATION HORIZON') then
    raise exception using errcode='40001',message='EN_ANCESTRY_CHANGED';
  end if;
  if (select count(*) from public.revision_content_map
       where snapshot_id=v_en_snapshot and parent_unit_id=v_en_parent and is_included)<>257
     or (select count(distinct position) from public.revision_content_map
       where snapshot_id=v_en_snapshot and parent_unit_id=v_en_parent and is_included)<>257
     or (select min(position) from public.revision_content_map
       where snapshot_id=v_en_snapshot and parent_unit_id=v_en_parent and is_included)<>1
     or (select max(position) from public.revision_content_map
       where snapshot_id=v_en_snapshot and parent_unit_id=v_en_parent and is_included)<>257
     or jsonb_array_length(v_en_doc.data#>'{chapters,3,scenes,0,paragraphs}')<>257 then
    raise exception using errcode='40001',message='EN_CURRENT_MAPPING_COUNT_CHANGED';
  end if;
  v_review_text := public.ros_ko_lpf_v2('ROS-KO-MIGRATION-REVIEW-MANIFEST-LPF-V2',
    'A4/CH04/SC01','bc44ce05','[Scene 1: What Changed When We Acted]','r01','ros-ko-block-v1','257');
  for v_row,v_pos in select value,ordinality::int
    from jsonb_array_elements(p_payload->'blocks') with ordinality
  loop
    if jsonb_typeof(v_row) is distinct from 'object'
       or v_row->>'position' is distinct from v_pos::text
       or v_row->>'en_current_position' is distinct from v_pos::text
       or v_row->>'ko_source_key' is distinct from 'KO/A4/CH04/SC01/B'||lpad(v_pos::text,4,'0')
       or v_row->>'separator_after' is distinct from (case when v_pos<257 then E'\n\n' else '' end)
       or jsonb_typeof(v_row->'body') is distinct from 'string'
       or public.ros_ko_sha256_text(v_row->>'body') is distinct from v_row->>'body_sha256'
       or octet_length(convert_to(v_row->>'body','UTF8')) is distinct from (v_row->>'body_bytes')::int
       or length(v_row->>'body')-length(replace(v_row->>'body',E'\n',''))<>0
       or position(E'\r' in v_row->>'body')<>0
       or coalesce(v_row->>'en_original_position','') !~ '^[1-9][0-9]*$' then
      raise exception using errcode='22023',message='BLOCK_PAYLOAD_INTEGRITY_FAILED';
    end if;
    perform 1 from public.content_units where id=(v_row->>'en_unit_id')::uuid for share;
    perform 1 from public.paragraph_versions where id=(v_row->>'en_version_id')::uuid for share;
    select pv.body_markdown into v_en_version_body
      from public.paragraph_versions pv join public.content_units cu on cu.id=pv.paragraph_unit_id
      join public.revision_content_map m on m.unit_id=cu.id and m.paragraph_version_id=pv.id
      where cu.id=(v_row->>'en_unit_id')::uuid and pv.id=(v_row->>'en_version_id')::uuid
        and cu.project_id=v_en_project and cu.unit_type='paragraph'
        and cu.original_parent_id=v_en_parent
        and cu.original_position=(v_row->>'en_original_position')::int
        and cu.source_key=v_row->>'en_source_key' and cu.source_path=v_row->>'en_source_path'
        and m.snapshot_id=v_en_snapshot and m.parent_unit_id=v_en_parent
        and m.position=v_pos and m.is_included is true
        and public.ros_ko_sha256_text(pv.body_markdown)=v_row->>'en_body_sha256';
    if not found then
      raise exception using errcode='40001',message='EN_ALIGNMENT_PREIMAGE_CHANGED';
    end if;
    if length(v_en_version_body)-length(replace(v_en_version_body,E'\n',''))<>0
       or position(E'\r' in v_en_version_body)<>0 then
      raise exception using errcode='40001',message='EN_BLOCK_LINE_CONTRACT_CHANGED';
    end if;
    v_en_paragraph := (v_en_doc.data#>'{chapters,3,scenes,0,paragraphs}')->(v_pos-1);
    if v_en_paragraph->>'id' is distinct from v_row->>'en_unit_id'
       or v_en_paragraph->>'revisionVersionId' is distinct from v_row->>'en_version_id'
       or v_en_paragraph->'versions'->(v_en_paragraph->>'activeVersion')->>'content'
          is distinct from v_en_version_body then
      raise exception using errcode='40001',message='EN_READER_SELECTION_CHANGED';
    end if;
    v_body := v_body||(v_row->>'body')||(v_row->>'separator_after');
    v_en_body := v_en_body||v_en_version_body||(v_row->>'separator_after');
    v_review_text := v_review_text||public.ros_ko_lpf_v2(lpad(v_pos::text,6,'0'),
      v_row->>'ko_source_key',null,null,v_row->>'body_sha256',v_row->>'separator_after',
      v_row->>'en_unit_id',v_row->>'en_version_id',v_row->>'en_body_sha256');
  end loop;
  if public.ros_ko_sha256_text(v_review_text) is distinct from p_payload->>'review_manifest_sha256' then
    raise exception using errcode='22023',message='REVIEW_MANIFEST_CONTRACT_MISMATCH';
  end if;
  if octet_length(convert_to(v_body,'UTF8'))<>42735
     or length(v_body)-length(replace(v_body,E'\n',''))<>512
     or public.ros_ko_sha256_text(v_body)<>'961cda21d33102e47f882274f38e7a1f2e599aec4d30fc0820309b28939f7606'
     or length(v_en_body)-length(replace(v_en_body,E'\n',''))<>512
     or position(E'\r' in v_en_body)<>0
     or octet_length(convert_to(v_en_body,'UTF8'))<>33631
     or public.ros_ko_sha256_text(v_en_body)<>'d8bad11587de44430b33fd5eb0900714710a3aea46803f83e08275e1987cf9ea' then
    raise exception using errcode='22023',message='SCENE_BODY_CONTRACT_MISMATCH';
  end if;
  for v_cap in select * from (values(v_actor,true,true,true,true),
      (v_peer,true,false,true,false)) a(actor_id,can_read,can_migrate,can_rewrite,can_restore)
  loop
    insert into ros_ko_private.ko_scene_authorizations(actor_id,document_id,scene_id,
      can_read,can_migrate,can_rewrite,can_restore)
    values(v_cap.actor_id,v_doc.id,'bc44ce05',v_cap.can_read,v_cap.can_migrate,v_cap.can_rewrite,v_cap.can_restore)
    on conflict do nothing;
    if found then v_cap_added := v_cap_added||jsonb_build_array(v_cap.actor_id); end if;
    -- Recheck after INSERT conflict too; no concurrent denial may be ignored.
    if not exists(select 1 from ros_ko_private.ko_scene_authorizations a
      where a.actor_id=v_cap.actor_id and a.document_id=v_doc.id and a.scene_id='bc44ce05'
        and a.can_read is not distinct from v_cap.can_read and a.can_migrate is not distinct from v_cap.can_migrate
        and a.can_rewrite is not distinct from v_cap.can_rewrite and a.can_restore is not distinct from v_cap.can_restore) then
      raise exception using errcode='42501',message='TARGET_CAPABILITY_CONCURRENT_CONFLICT';
    end if;
  end loop;
  v_audit := v_audit||jsonb_build_object('capabilities_added_for',v_cap_added);
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
  insert into public.ko_scene_state_events(managed_scene_id,event_type,to_generation,to_composition_id,request_id,actor_id,detail)
    values(v_managed,'migrated',1,v_comp,p_request_id,v_actor,jsonb_build_object('delegated_audit',v_audit));
  -- The locked Act/root documents serialize migrations sharing these protections.
  -- This request requires both pre-existing protections. No registry INSERT,
  -- UPDATE or DELETE is performed, and their original owning Scenes remain.
  for v_protection_target in
    select * from (values
      (v_doc.id,v_doc.slug,'managed KO block Scene'::text),
      (v_root.id,v_root.slug,'root of managed KO block Scene'::text)
    ) as expected(document_id,document_slug,protection_reason)
  loop
    select * into v_protection from public.ko_protected_documents
      where document_id=v_protection_target.document_id
         or document_slug=v_protection_target.document_slug
      for update;
    if found then
      if v_protection.document_id is distinct from v_protection_target.document_id
        or v_protection.document_slug is distinct from v_protection_target.document_slug
        or v_protection.protection_reason is distinct from v_protection_target.protection_reason
        or not exists (
          select 1 from public.ko_managed_scenes protected_scene
          join public.revision_projects protected_project
            on protected_project.id=protected_scene.logical_project_id
          where protected_scene.id=v_protection.managed_scene_id
            and protected_scene.logical_project_id=v_project
            and protected_scene.owner_id=v_actor
            and protected_scene.root_document_id=v_root.id
            and protected_scene.storage_model='ros-ko-block-v1'
            and protected_project.owner_id=v_actor
            and (
              (protected_scene.document_id=v_doc.id
                and protected_scene.document_slug=v_doc.slug
                and protected_project.source_document_id=v_doc.id)
              or (v_root_origin_document_id is not null
                and protected_project.source_document_id=v_root_origin_document_id
                and (
                  (v_protection_target.protection_reason='root of managed KO block Scene'
                    and protected_scene.document_id=v_root_origin_document_id
                    and protected_scene.document_slug=v_root_origin_document_id)
                  or (v_protection_target.protection_reason='managed KO block Scene'
                    and protected_scene.document_id=v_doc.id
                    and protected_scene.document_slug=v_doc.slug)
                ))
            )
        ) then
        raise exception using errcode='22023',message='SHARED_KO_PROTECTION_SCOPE_MISMATCH';
      end if;
    else
      insert into public.ko_protected_documents(document_id,document_slug,protection_reason,managed_scene_id)
        values(v_protection_target.document_id,v_protection_target.document_slug,
          v_protection_target.protection_reason,v_managed);
    end if;
  end loop;
  perform set_config('ros_ko.internal_actor',v_actor::text,true); perform set_config('ros_ko.internal_request_id',p_request_id::text,true);
  perform set_config('ros_ko.internal_document_id',v_doc.id,true);
  update public.novel_documents set data=jsonb_set(jsonb_set(jsonb_set(data,v_path||array['paragraphs'],v_projection,false),
    v_path||array['storageModel'],to_jsonb('ros-ko-block-v1'::text),true),v_path||array['managedSceneId'],to_jsonb(v_managed::text),true)
    where id=v_doc.id and public.ros_ko_sha256_text(data::text)=p_expected_document_sha256;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_PROJECTION_UPDATE'; end if;
  -- Internal guard context is a targeted request linkage, never a login claim.
  perform set_config('ros_ko.internal_actor',coalesce(v_prev_actor,''),true);
  perform set_config('ros_ko.internal_request_id',coalesce(v_prev_request,''),true);
  perform set_config('ros_ko.internal_document_id',coalesce(v_prev_document,''),true);
  v_result_text := public.ros_ko_result_manifest_text(p_request_id,public.ros_ko_sha256_text(v_input),
    'migrate',v_managed,v_project,v_archive,v_comp,v_selection,1)
    ||public.ros_ko_lpf_v2(v_result_spec,public.ros_ko_sha256_text(v_audit::text),
      session_user::text,current_user::text,v_auth_actor::text,'delegated_admin_not_login');
  v_result := jsonb_build_object('replayed',false,'managed_scene_id',v_managed,'logical_project_id',v_project,
    'legacy_archive_id',v_archive,'composition_id',v_comp,'selection_id',v_selection,
    'generation',1,'block_count',v_expected_blocks,'body_sha256',p_payload->>'body_sha256',
    'manifest_sha256',v_manifest_sha,'projection_sha256',public.ros_ko_sha256_text(v_projection::text),
    'request_input_sha256',public.ros_ko_sha256_text(v_input),
    'result_manifest_sha256',public.ros_ko_sha256_text(v_result_text),'delegated_audit',v_audit);
  update ros_ko_private.ko_mutation_requests set status='completed',result_spec_id=v_result_spec,
    result_manifest_sha256=public.ros_ko_sha256_text(v_result_text),result_manifest_text=v_result_text,
    result_manifest_hex=encode(convert_to(v_result_text,'UTF8'),'hex'),result=v_result,completed_at=statement_timestamp()
    where owner_id=v_actor and request_id=p_request_id and status='running'
      and request_input_sha256=public.ros_ko_sha256_text(v_input) and request_input_text=v_input;
  if not found then
    raise exception using errcode='40001',message='REQUEST_COMPLETION_STATE_MISMATCH';
  end if;
  return v_result;
end
$function$;
ALTER FUNCTION ros_ko_private.migrate_a4_ch04_sc01_delegated(uuid,text,jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION ros_ko_private.migrate_a4_ch04_sc01_delegated(uuid,text,jsonb)
  FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION ros_ko_private.migrate_a4_ch04_sc01_delegated(uuid,text,jsonb) TO postgres;
COMMENT ON FUNCTION ros_ko_private.migrate_a4_ch04_sc01_delegated(uuid,text,jsonb)
  IS 'Target-only delegated admin materialization: A4/CH04/SC01. Real postgres execution and observed auth.uid are recorded separately from the user-designated manuscript owner/audit principal. No authenticated API changes.';


CREATE OR REPLACE FUNCTION ros_ko_private.rename_a4_ch04_sc01_title_delegated(
  p_request_id uuid,p_expected_document_sha256 text,p_payload jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $function$
declare
  v_actor constant uuid := '3b3baba4-c608-45e5-98e9-fac61577b005';
  v_peer constant uuid := 'd5355824-7e26-4874-8bd2-ce58ca29a5b8';
  v_project constant uuid := '955c9b9e-146c-40b0-b57a-655195b11086';
  v_root_id constant text := 'quantum-vibration-novel';
  v_doc_id constant text := 'quantum-vibration-novel-act-7';
  v_en_root_id constant text := 'quantum-vibration-novel-en';
  v_en_doc_id constant text := 'quantum-vibration-novel-en-act-7';
  v_scene_id constant text := 'bc44ce05';
  v_source_key constant text := 'A4/CH04/SC01';
  v_body_sha constant text := '961cda21d33102e47f882274f38e7a1f2e599aec4d30fc0820309b28939f7606';
  v_scene_path text[] := array['chapters','3','scenes','0'];
  v_scope text; v_old_title text; v_new_title text; v_old_scene_title text; v_new_scene_title text;
  v_title_path text[]; v_root_title_path text[] := array['acts','6','title'];
  v_generation bigint; v_next_generation bigint; v_input_spec text; v_result_spec text;
  v_auth_actor uuid; v_managed uuid; v_comp uuid; v_new_comp uuid; v_count int; v_next_revision int;
  v_doc public.novel_documents; v_after public.novel_documents;
  v_root public.novel_documents; v_root_after public.novel_documents;
  v_en_root public.novel_documents; v_en_doc public.novel_documents;
  v_scene public.ko_managed_scenes; v_sel public.ko_scene_display_selections;
  v_projection public.ko_scene_reader_projections; v_composition public.ko_scene_composition_revisions;
  v_req ros_ko_private.ko_mutation_requests; v_audit jsonb; v_state jsonb; v_after_state jsonb;
  v_input text; v_result_text text; v_result jsonb; v_new_data jsonb; v_new_root_data jsonb;
  v_new_projection jsonb; v_new_manifest_sha text; v_body text;
  v_doc_outside_sha text; v_root_outside_sha text;
  v_prev_actor text := current_setting('ros_ko.internal_actor',true);
  v_prev_request text := current_setting('ros_ko.internal_request_id',true);
  v_prev_document text := current_setting('ros_ko.internal_document_id',true);
begin
  if session_user::text is distinct from 'postgres' or current_user::text is distinct from 'postgres'
     or current_setting('session_replication_role') is distinct from 'origin' then
    raise exception using errcode='42501',message='NORMAL_POSTGRES_ADMIN_REQUIRED';
  end if;
  v_auth_actor := auth.uid();
  if p_request_id is null or jsonb_typeof(p_payload) is distinct from 'object'
     or coalesce(p_expected_document_sha256,'') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_root_data_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_en_root_data_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_en_document_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_managed_scene_id','') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     or coalesce(p_payload->>'expected_composition_id','') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    raise exception using errcode='22023',message='TITLE_INPUT_INVALID';
  end if;
  if p_payload->'delegated_audit' is distinct from jsonb_build_object(
    'original_instruction_id','ROS-KO-A4-CH04-SC01-r01-EXEC-01-20261022',
    'original_instruction_sha256','a5b5db0ccf0311983b9a1cc382239664f45e2e3042d8309d43106f859f058648') then
    raise exception using errcode='22023',message='DELEGATED_DIRECT_INSTRUCTION_REQUIRED';
  end if;

  v_scope := p_payload->>'scope';
  if v_scope='chapter' then
    v_generation:=1; v_title_path:=array['chapters','3','title'];
    v_old_title:='Chapter 4: The Resonance of Space'; v_new_title:='제4장: 공간의 공명';
    v_old_scene_title:='[Scene 1: What Changed When We Acted]'; v_new_scene_title:=v_old_scene_title;
  elsif v_scope='scene' then
    v_generation:=2; v_title_path:=array['chapters','3','scenes','0','title'];
    v_old_title:='[Scene 1: What Changed When We Acted]'; v_new_title:='[장면 1: 우리가 개입했을 때 달라진 것]';
    v_old_scene_title:=v_old_title; v_new_scene_title:=v_new_title;
  else
    raise exception using errcode='22023',message='TITLE_SCOPE_INVALID';
  end if;
  v_next_generation := v_generation+1;
  if p_payload->>'generation' is distinct from v_generation::text
     or p_payload->>'old_title' is distinct from v_old_title
     or p_payload->>'new_title' is distinct from v_new_title then
    raise exception using errcode='22023',message='TITLE_SEQUENCE_INPUT_INVALID';
  end if;
  v_managed := (p_payload->>'expected_managed_scene_id')::uuid;
  v_comp := (p_payload->>'expected_composition_id')::uuid;
  v_input_spec := 'ROS-KO-A4-CH04-SC01-'||upper(v_scope)||'-TITLE-LPF-V1';
  v_result_spec := 'ROS-KO-A4-CH04-SC01-'||upper(v_scope)||'-TITLE-RESULT-LPF-V1';

  perform 1 from auth.users where id in(v_actor,v_peer) order by id for share;
  select count(*) into v_count from auth.users where id in(v_actor,v_peer)
    and confirmed_at is not null and deleted_at is null and is_anonymous is false
    and (banned_until is null or banned_until<=statement_timestamp());
  if v_count<>2 then raise exception using errcode='42501',message='DESIGNATED_ACCOUNT_NOT_USABLE'; end if;
  perform 1 from public.revision_projects where id=v_project for share;
  if not exists(select 1 from public.revision_projects where id=v_project and owner_id=v_actor
      and slug='ros-ko-pro-ch01-sc01-blocks' and source_document_id='quantum-vibration-novel-act-2') then
    raise exception using errcode='42501',message='EXISTING_KO_PROJECT_OWNER_MISMATCH';
  end if;
  perform 1 from ros_ko_private.ko_scene_authorizations
    where document_id=v_doc_id and scene_id=v_scene_id and actor_id in(v_actor,v_peer)
    order by actor_id for share;
  if (select count(*) from ros_ko_private.ko_scene_authorizations
      where document_id=v_doc_id and scene_id=v_scene_id and actor_id in(v_actor,v_peer)
        and can_read and can_rewrite
        and can_migrate is not distinct from (actor_id=v_actor)
        and can_restore is not distinct from (actor_id=v_actor))<>2 then
    raise exception using errcode='42501',message='EXISTING_TARGET_CAPABILITY_CONFLICT';
  end if;

  v_input := public.ros_ko_lpf_v2(v_input_spec,p_request_id::text,v_actor::text,v_project::text,
    v_root_id,array_to_string(v_title_path,'/'),v_doc_id,v_scene_id,v_scope,v_old_title,v_new_title,
    p_payload->>'expected_root_data_sha256',p_expected_document_sha256,v_managed::text,v_comp::text,
    v_generation::text,v_body_sha,public.ros_ko_sha256_text(p_payload::text),
    session_user::text,current_user::text,v_auth_actor::text,'delegated_admin_not_login',
    p_payload#>>'{delegated_audit,original_instruction_id}',
    p_payload#>>'{delegated_audit,original_instruction_sha256}',null,null);
  v_audit := (p_payload->'delegated_audit')||jsonb_build_object(
    'mode','delegated_admin_not_login','database_executor','postgres','session_user',session_user::text,
    'current_user',current_user::text,'authenticated_actor_id',v_auth_actor,
    'delegated_audit_principal',v_actor,'manuscript_owner',v_actor,'logical_project_id',v_project,
    'supabase_project_ref','iklsghevdtqqkjuaympc','root_document_id',v_root_id,'document_id',v_doc_id,
    'scene_id',v_scene_id,'title_path',to_jsonb(v_title_path),'source_key',v_source_key,
    'operation_scope',v_scope||'_title_only','request_id',p_request_id,
    'request_input_spec_id',v_input_spec,'request_input_sha256',public.ros_ko_sha256_text(v_input),
    'payload_sha256',public.ros_ko_sha256_text(p_payload::text),'started_at',statement_timestamp());

  perform pg_advisory_xact_lock(hashtextextended(v_actor::text||':'||p_request_id::text,0));
  insert into ros_ko_private.ko_mutation_requests(owner_id,request_id,operation,input_spec_id,
    request_input_sha256,request_input_text,request_input_hex)
  values(v_actor,p_request_id,'rename_title',v_input_spec,public.ros_ko_sha256_text(v_input),v_input,
    encode(convert_to(v_input,'UTF8'),'hex')) on conflict do nothing;
  select * into strict v_req from ros_ko_private.ko_mutation_requests
    where owner_id=v_actor and request_id=p_request_id for update;
  if v_req.operation is distinct from 'rename_title' or v_req.input_spec_id is distinct from v_input_spec
     or v_req.request_input_sha256 is distinct from public.ros_ko_sha256_text(v_input)
     or v_req.request_input_text is distinct from v_input
     or v_req.request_input_hex is distinct from encode(convert_to(v_input,'UTF8'),'hex') then
    raise exception using errcode='22023',message='IDEMPOTENCY_KEY_REUSE';
  end if;
  if v_req.status='completed' then return v_req.result||jsonb_build_object('replayed',true); end if;

  select * into strict v_sel from public.ko_scene_display_selections
    where managed_scene_id=v_managed for update;
  select * into strict v_scene from public.ko_managed_scenes where id=v_managed for share;
  select * into strict v_projection from public.ko_scene_reader_projections
    where managed_scene_id=v_managed for share;
  select * into strict v_composition from public.ko_scene_composition_revisions where id=v_comp for share;
  if v_scene.logical_project_id is distinct from v_project or v_scene.owner_id is distinct from v_actor
     or v_scene.root_document_id is distinct from v_root_id or v_scene.document_id is distinct from v_doc_id
     or v_scene.document_slug is distinct from v_doc_id or v_scene.scene_id is distinct from v_scene_id
     or v_scene.scene_path is distinct from v_scene_path or v_scene.source_key is distinct from v_source_key
     or v_scene.storage_model is distinct from 'ros-ko-block-v1'
     or v_scene.generation is distinct from v_generation or v_scene.manuscript_version is distinct from 'r01'
     or v_scene.title_snapshot is distinct from '[Scene 1: What Changed When We Acted]'
     or v_sel.review_composition_id is distinct from v_comp or v_sel.final_composition_id is not null
     or v_sel.display_mode is distinct from 'composition' or v_sel.generation is distinct from v_generation
     or v_projection.composition_id is distinct from v_comp or v_projection.generation is distinct from v_generation
     or v_composition.managed_scene_id is distinct from v_managed or v_composition.status is distinct from 'sealed'
     or v_composition.revision_no is distinct from v_generation::int
     or v_composition.manuscript_version is distinct from 'r01'
     or v_composition.title_snapshot is distinct from v_old_scene_title
     or v_composition.block_count is distinct from 257 or v_composition.body_bytes is distinct from 42735
     or v_composition.body_lf is distinct from 512 or v_composition.terminal_lf is distinct from 0::smallint
     or v_composition.body_sha256 is distinct from v_body_sha
     or v_projection.body_sha256 is distinct from v_body_sha
     or v_projection.manifest_sha256 is distinct from v_composition.manifest_sha256 then
    raise exception using errcode='40001',message='TITLE_CURRENT_REVIEW_CHANGED';
  end if;
  perform public.ros_ko_validate_composition(v_comp);
  if v_projection.paragraphs is distinct from public.ros_ko_build_projection(v_comp,v_generation)
     or v_projection.projection_sha256 is distinct from public.ros_ko_sha256_text(v_projection.paragraphs::text) then
    raise exception using errcode='40001',message='TITLE_PROJECTION_CHANGED';
  end if;
  select string_agg(pv.body_markdown||b.separator_after,'' order by b.position) into v_body
    from public.ko_scene_composition_blocks b
    join public.paragraph_versions pv on pv.id=b.block_version_id and pv.paragraph_unit_id=b.block_unit_id
    where b.composition_id=v_comp;
  if public.ros_ko_sha256_text(v_body) is distinct from v_body_sha then
    raise exception using errcode='40001',message='TITLE_BODY_CHANGED';
  end if;

  select jsonb_build_object('managed_immutable',to_jsonb(m)-'generation','composition',to_jsonb(c),
    'blocks',(select jsonb_agg(to_jsonb(b) order by b.position) from public.ko_scene_composition_blocks b where b.composition_id=v_comp),
    'units',(select jsonb_agg(to_jsonb(u) order by u.id) from public.content_units u
      join public.ko_scene_composition_blocks b on b.block_unit_id=u.id where b.composition_id=v_comp),
    'versions',(select jsonb_agg(to_jsonb(pv) order by pv.id) from public.paragraph_versions pv
      join public.ko_scene_composition_blocks b on b.block_version_id=pv.id where b.composition_id=v_comp),
    'alignments',(select jsonb_agg(to_jsonb(a) order by a.id) from public.ko_en_block_alignments a where a.managed_scene_id=v_managed),
    'archive',(select to_jsonb(a) from ros_ko_private.ko_scene_legacy_archives a where a.managed_scene_id=v_managed))
    into v_state from public.ko_managed_scenes m
    join public.ko_scene_composition_revisions c on c.id=v_comp and c.managed_scene_id=m.id
    where m.id=v_managed;

  perform 1 from public.novel_documents where id in(v_root_id,v_doc_id,v_en_root_id,v_en_doc_id) order by id for update;
  select * into strict v_root from public.novel_documents where id=v_root_id and slug=id;
  select * into strict v_doc from public.novel_documents where id=v_doc_id and slug=id;
  select * into strict v_en_root from public.novel_documents where id=v_en_root_id and slug=id;
  select * into strict v_en_doc from public.novel_documents where id=v_en_doc_id and slug=id;
  if public.ros_ko_sha256_text(v_doc.data::text) is distinct from p_expected_document_sha256
     or public.ros_ko_sha256_text(v_root.data::text) is distinct from p_payload->>'expected_root_data_sha256'
     or public.ros_ko_sha256_text(v_en_root.data::text) is distinct from p_payload->>'expected_en_root_data_sha256'
     or public.ros_ko_sha256_text(v_en_doc.data::text) is distinct from p_payload->>'expected_en_document_sha256'
     or v_doc.data->'number' is distinct from '7'::jsonb or v_en_doc.data->'number' is distinct from '7'::jsonb
     or v_en_doc.data->>'title' is distinct from 'ACT 4: THE CANCELLATION HORIZON'
     or v_en_doc.data#>>'{chapters,3,title}' is distinct from 'Chapter 4: The Resonance of Space'
     or v_en_doc.data#>>'{chapters,3,scenes,0,id}' is distinct from v_scene_id
     or v_en_doc.data#>>'{chapters,3,scenes,0,title}' is distinct from '[Scene 1: What Changed When We Acted]'
     or v_doc.data#>>'{chapters,3,scenes,0,id}' is distinct from v_scene_id
     or v_doc.data#>>(v_scene_path||array['managedSceneId']) is distinct from v_managed::text
     or v_doc.data#>>(v_scene_path||array['storageModel']) is distinct from 'ros-ko-block-v1'
     or v_doc.data#>(v_scene_path||array['paragraphs']) is distinct from v_projection.paragraphs then
    raise exception using errcode='40001',message='TITLE_CURRENT_DOCUMENT_CHANGED';
  end if;
  if (v_scope='chapter' and (v_doc.data->>'title' is distinct from '제4막: 상쇄의 지평'
       or v_root.data#>>v_root_title_path is distinct from '제4막: 상쇄의 지평'
       or v_doc.data#>>v_title_path is distinct from v_old_title
       or v_doc.data#>>'{chapters,3,scenes,0,title}' is distinct from '[Scene 1: What Changed When We Acted]'))
     or (v_scope='scene' and (v_doc.data->>'title' is distinct from '제4막: 상쇄의 지평'
       or v_root.data#>>v_root_title_path is distinct from '제4막: 상쇄의 지평'
       or v_doc.data#>>'{chapters,3,title}' is distinct from '제4장: 공간의 공명'
       or v_doc.data#>>v_title_path is distinct from v_old_title)) then
    raise exception using errcode='40001',message='TITLE_SEQUENCE_PREIMAGE_CHANGED';
  end if;
  if v_doc.data#>>v_title_path=v_new_title then
    raise exception using errcode='22023',message='TITLE_ALREADY_MATCHED_REQUIRE_NO_WRITE';
  end if;

  if not exists(select 1 from public.ko_protected_documents g
      where g.document_id=v_doc_id and g.document_slug=v_doc_id
        and g.protection_reason='managed KO block Scene')
     or not exists(select 1 from public.ko_managed_scenes m
      where m.id=v_managed and m.document_id=v_doc_id and m.root_document_id=v_root_id
        and m.logical_project_id=v_project and m.owner_id=v_actor)
     or not exists(select 1 from public.ko_protected_documents g
      where g.document_id=v_root_id and g.document_slug=v_root_id
        and g.protection_reason='root of managed KO block Scene') then
    raise exception using errcode='40001',message='TITLE_PROTECTION_CHANGED';
  end if;

  select max(revision_no)+1 into v_next_revision from public.ko_scene_composition_revisions
    where managed_scene_id=v_managed;
  if v_next_revision is distinct from v_next_generation::int then
    raise exception using errcode='40001',message='TITLE_LATER_COMPOSITION_EXISTS';
  end if;
  insert into public.ko_scene_composition_revisions(managed_scene_id,revision_no,parent_revision_id,manuscript_version,
    title_snapshot,block_count,terminal_lf,body_bytes,body_lf,body_sha256,input_review_manifest_sha256,manifest_sha256,created_by)
  values(v_managed,v_next_generation::int,v_comp,'r01',v_new_scene_title,257,0,42735,512,v_body_sha,
    v_composition.input_review_manifest_sha256,repeat('0',64),v_actor) returning id into v_new_comp;
  insert into public.ko_scene_composition_blocks(composition_id,position,block_unit_id,block_version_id,source_key,separator_after)
    select v_new_comp,position,block_unit_id,block_version_id,source_key,separator_after
    from public.ko_scene_composition_blocks where composition_id=v_comp;
  get diagnostics v_count = row_count;
  if v_count<>257 then raise exception using errcode='40001',message='TITLE_BLOCK_COPY_COUNT_CHANGED'; end if;
  v_new_manifest_sha := public.ros_ko_sha256_text(public.ros_ko_composition_manifest_text(v_new_comp));
  update public.ko_scene_composition_revisions set manifest_sha256=v_new_manifest_sha,status='sealed' where id=v_new_comp;
  perform public.ros_ko_validate_composition(v_new_comp);
  v_new_projection := public.ros_ko_build_projection(v_new_comp,v_next_generation);

  update public.ko_scene_display_selections set review_composition_id=v_new_comp,generation=v_next_generation,
    updated_by=v_actor,updated_at=statement_timestamp() where id=v_sel.id and generation=v_generation
    and review_composition_id=v_comp and final_composition_id is null;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_TITLE_SELECTION'; end if;
  update public.ko_scene_reader_projections set composition_id=v_new_comp,generation=v_next_generation,
    paragraphs=v_new_projection,body_sha256=v_body_sha,manifest_sha256=v_new_manifest_sha,
    projection_sha256=public.ros_ko_sha256_text(v_new_projection::text),projected_at=statement_timestamp()
    where managed_scene_id=v_managed and composition_id=v_comp and generation=v_generation;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_TITLE_PROJECTION'; end if;
  update public.ko_managed_scenes set generation=v_next_generation
    where id=v_managed and generation=v_generation;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_TITLE_MANAGED'; end if;

  v_doc_outside_sha := public.ros_ko_sha256_text(((v_doc.data#-v_title_path)#-(v_scene_path||array['paragraphs']))::text);
  v_root_outside_sha := public.ros_ko_sha256_text((v_root.data#-v_root_title_path)::text);
  v_new_data := jsonb_set(jsonb_set(v_doc.data,v_title_path,to_jsonb(v_new_title),false),
    v_scene_path||array['paragraphs'],v_new_projection,false);
  if v_scope='act' then
    v_new_root_data := jsonb_set(v_root.data,v_root_title_path,to_jsonb(v_new_title),false);
  else
    v_new_root_data := v_root.data;
  end if;

  perform set_config('ros_ko.internal_actor',v_actor::text,true);
  perform set_config('ros_ko.internal_request_id',p_request_id::text,true);
  if v_scope='act' then
    perform set_config('ros_ko.internal_document_id',v_root_id,true);
    update public.novel_documents set data=v_new_root_data where id=v_root_id
      and public.ros_ko_sha256_text(data::text)=p_payload->>'expected_root_data_sha256'
      and data#>>v_root_title_path=v_old_title returning * into v_root_after;
    if not found then raise exception using errcode='40001',message='ZERO_ROW_ACT_ROOT_TITLE_UPDATE'; end if;
  else
    v_root_after := v_root;
  end if;
  perform set_config('ros_ko.internal_document_id',v_doc_id,true);
  update public.novel_documents set data=v_new_data where id=v_doc_id
    and public.ros_ko_sha256_text(data::text)=p_expected_document_sha256
    and data#>>v_title_path=v_old_title returning * into v_after;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_TITLE_DOCUMENT_UPDATE'; end if;
  perform set_config('ros_ko.internal_actor',coalesce(v_prev_actor,''),true);
  perform set_config('ros_ko.internal_request_id',coalesce(v_prev_request,''),true);
  perform set_config('ros_ko.internal_document_id',coalesce(v_prev_document,''),true);

  if v_after.data is distinct from v_new_data or v_root_after.data is distinct from v_new_root_data
     or public.ros_ko_sha256_text(((v_after.data#-v_title_path)#-(v_scene_path||array['paragraphs']))::text)
        is distinct from v_doc_outside_sha
     or public.ros_ko_sha256_text((v_root_after.data#-v_root_title_path)::text) is distinct from v_root_outside_sha
     or (to_jsonb(v_after)-'data'-'updated_at') is distinct from (to_jsonb(v_doc)-'data'-'updated_at')
     or (to_jsonb(v_root_after)-'data'-'updated_at') is distinct from (to_jsonb(v_root)-'data'-'updated_at') then
    raise exception using errcode='40001',message='TITLE_OUTSIDE_SCOPE_CHANGED';
  end if;

  select jsonb_build_object('managed_immutable',to_jsonb(m)-'generation','composition',to_jsonb(c),
    'blocks',(select jsonb_agg(to_jsonb(b) order by b.position) from public.ko_scene_composition_blocks b where b.composition_id=v_comp),
    'units',(select jsonb_agg(to_jsonb(u) order by u.id) from public.content_units u
      join public.ko_scene_composition_blocks b on b.block_unit_id=u.id where b.composition_id=v_comp),
    'versions',(select jsonb_agg(to_jsonb(pv) order by pv.id) from public.paragraph_versions pv
      join public.ko_scene_composition_blocks b on b.block_version_id=pv.id where b.composition_id=v_comp),
    'alignments',(select jsonb_agg(to_jsonb(a) order by a.id) from public.ko_en_block_alignments a where a.managed_scene_id=v_managed),
    'archive',(select to_jsonb(a) from ros_ko_private.ko_scene_legacy_archives a where a.managed_scene_id=v_managed))
    into v_after_state from public.ko_managed_scenes m
    join public.ko_scene_composition_revisions c on c.id=v_comp and c.managed_scene_id=m.id
    where m.id=v_managed;
  if v_after_state is distinct from v_state then
    raise exception using errcode='40001',message='TITLE_IMMUTABLE_STATE_CHANGED';
  end if;
  if (select jsonb_agg(to_jsonb(b)-'composition_id' order by b.position) from public.ko_scene_composition_blocks b where b.composition_id=v_new_comp)
     is distinct from (select jsonb_agg(to_jsonb(b)-'composition_id' order by b.position) from public.ko_scene_composition_blocks b where b.composition_id=v_comp) then
    raise exception using errcode='40001',message='TITLE_BLOCK_REFERENCES_CHANGED';
  end if;

  v_audit := v_audit||jsonb_build_object(
    'before_document_sha256',p_expected_document_sha256,
    'after_document_sha256',public.ros_ko_sha256_text(v_after.data::text),
    'before_root_sha256',p_payload->>'expected_root_data_sha256',
    'after_root_sha256',public.ros_ko_sha256_text(v_root_after.data::text),
    'unchanged_manuscript_state_sha256',public.ros_ko_sha256_text(v_state::text));
  insert into public.ko_scene_state_events(managed_scene_id,event_type,from_generation,to_generation,
    from_composition_id,to_composition_id,request_id,actor_id,detail)
  values(v_managed,'review_advanced',v_generation,v_next_generation,v_comp,v_new_comp,p_request_id,v_actor,
    jsonb_build_object('operation','rename_title','scope',v_scope,'metadata_only',true,
      'old_title',v_old_title,'new_title',v_new_title,'body_sha256',v_body_sha,
      'new_body_versions',0,'delegated_audit',v_audit));
  v_result := jsonb_build_object('replayed',false,'operation','rename_title','scope',v_scope||'_title_only',
    'document_id',v_doc_id,'title_path',to_jsonb(v_title_path),'old_title',v_old_title,'new_title',v_new_title,
    'managed_scene_id',v_managed,'previous_composition_id',v_comp,'composition_id',v_new_comp,
    'previous_generation',v_generation,'generation',v_next_generation,'revision_no',v_next_generation,
    'manuscript_version','r01','new_body_versions',0,'body_sha256',v_body_sha,
    'manifest_sha256',v_new_manifest_sha,'projection_sha256',public.ros_ko_sha256_text(v_new_projection::text),
    'before_document_sha256',p_expected_document_sha256,
    'after_document_sha256',public.ros_ko_sha256_text(v_after.data::text),
    'before_root_sha256',p_payload->>'expected_root_data_sha256',
    'after_root_sha256',public.ros_ko_sha256_text(v_root_after.data::text),
    'request_input_sha256',public.ros_ko_sha256_text(v_input),'delegated_audit',v_audit);
  v_result_text := public.ros_ko_lpf_v2(v_result_spec,v_result::text);
  v_result := v_result||jsonb_build_object('result_manifest_sha256',public.ros_ko_sha256_text(v_result_text));
  update ros_ko_private.ko_mutation_requests set status='completed',result_spec_id=v_result_spec,
    result_manifest_sha256=public.ros_ko_sha256_text(v_result_text),result_manifest_text=v_result_text,
    result_manifest_hex=encode(convert_to(v_result_text,'UTF8'),'hex'),result=v_result,completed_at=statement_timestamp()
    where owner_id=v_actor and request_id=p_request_id and status='running'
      and request_input_sha256=public.ros_ko_sha256_text(v_input) and request_input_text=v_input;
  if not found then raise exception using errcode='40001',message='REQUEST_COMPLETION_STATE_MISMATCH'; end if;
  return v_result;
end
$function$;
ALTER FUNCTION ros_ko_private.rename_a4_ch04_sc01_title_delegated(uuid,text,jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION ros_ko_private.rename_a4_ch04_sc01_title_delegated(uuid,text,jsonb)
  FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION ros_ko_private.rename_a4_ch04_sc01_title_delegated(uuid,text,jsonb) TO postgres;
COMMENT ON FUNCTION ros_ko_private.rename_a4_ch04_sc01_title_delegated(uuid,text,jsonb)
  IS 'Target-only A4/CH04/SC01 ordered Chapter and Scene title transitions. Each creates one metadata-only review revision that reuses the same 257 body Versions; the shared Act title is preserved.';
