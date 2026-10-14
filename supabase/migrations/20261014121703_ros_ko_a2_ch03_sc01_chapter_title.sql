-- A2/CH03/SC01 shared Chapter title: narrowly delegated metadata correction.
CREATE OR REPLACE FUNCTION ros_ko_private.rename_a2_ch03_sc01_chapter_delegated(
  p_request_id uuid,p_expected_document_sha256 text,p_payload jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $function$
declare
  v_actor constant uuid := '3b3baba4-c608-45e5-98e9-fac61577b005';
  v_peer constant uuid := 'd5355824-7e26-4874-8bd2-ce58ca29a5b8';
  v_project constant uuid := '955c9b9e-146c-40b0-b57a-655195b11086';
  v_doc_id constant text := 'quantum-vibration-novel-act-5';
  v_old_title constant text := 'Chapter 3: Math vs Metal';
  v_new_title constant text := '제3장: 수학 대 금속';
  v_title_path text[] := array['chapters','2','title'];
  v_scene_path text[] := array['chapters','2','scenes','0'];
  v_input_spec constant text := 'ROS-KO-A2-CH03-CHAPTER-DELEGATED-TITLE-LPF-V1';
  v_result_spec constant text := 'ROS-KO-A2-CH03-CHAPTER-DELEGATED-TITLE-RESULT-LPF-V1';
  v_body_sha constant text := '87de1979abf329b8c88a88e377a23fa52618b3d7ff273873003b6dc98decb598';
  v_auth_actor uuid; v_managed uuid; v_comp uuid; v_count int;
  v_doc public.novel_documents; v_after public.novel_documents;
  v_root public.novel_documents; v_en_root public.novel_documents; v_en_doc public.novel_documents;
  v_scene public.ko_managed_scenes; v_sel public.ko_scene_display_selections;
  v_projection public.ko_scene_reader_projections; v_composition public.ko_scene_composition_revisions;
  v_req ros_ko_private.ko_mutation_requests; v_audit jsonb; v_state jsonb; v_after_state jsonb;
  v_input text; v_result_text text; v_result jsonb; v_new_data jsonb; v_outside_sha text; v_body text;
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
     or coalesce(p_payload->>'expected_managed_scene_id','') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     or coalesce(p_payload->>'expected_composition_id','') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     or p_payload->>'generation' is distinct from '1'
     or coalesce(p_payload->>'expected_root_data_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_en_root_data_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(p_payload->>'expected_en_document_sha256','') !~ '^[0-9a-f]{64}$' then
    raise exception using errcode='22023',message='CHAPTER_TITLE_INPUT_INVALID';
  end if;
  if p_payload->'delegated_audit' is distinct from jsonb_build_object(
    'original_instruction_id','ROS-KO-A2-CH03-SC01-DB-CODE-GIT-DEPLOY-01',
    'original_instruction_sha256','f10d66f2f24207a0b574a78fb47fb7f8a8a13f3f122745c3d9590684483149b3') then
    raise exception using errcode='22023',message='DELEGATED_DIRECT_INSTRUCTION_REQUIRED';
  end if;
  v_managed := (p_payload->>'expected_managed_scene_id')::uuid;
  v_comp := (p_payload->>'expected_composition_id')::uuid;
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
    where document_id=v_doc_id and scene_id='f7cf08b2' and actor_id in(v_actor,v_peer)
    order by actor_id for share;
  if (select count(*) from ros_ko_private.ko_scene_authorizations
      where document_id=v_doc_id and scene_id='f7cf08b2' and actor_id in(v_actor,v_peer)
        and can_read is true and can_rewrite is true
        and can_migrate is not distinct from (actor_id=v_actor)
        and can_restore is not distinct from (actor_id=v_actor))<>2 then
    raise exception using errcode='42501',message='EXISTING_TARGET_CAPABILITY_CONFLICT';
  end if;
  v_input := public.ros_ko_lpf_v2(v_input_spec,p_request_id::text,v_actor::text,v_project::text,
    v_doc_id,'chapters/2/title','f7cf08b2',v_old_title,v_new_title,p_expected_document_sha256,
    v_managed::text,v_comp::text,'1',v_body_sha,public.ros_ko_sha256_text(p_payload::text),
    session_user::text,current_user::text,v_auth_actor::text,'delegated_admin_not_login',
    p_payload#>>'{delegated_audit,original_instruction_id}',p_payload#>>'{delegated_audit,original_instruction_sha256}',
    null,null);
  v_audit := (p_payload->'delegated_audit')||jsonb_build_object(
    'mode','delegated_admin_not_login','database_executor','postgres',
    'session_user',session_user::text,'current_user',current_user::text,'authenticated_actor_id',v_auth_actor,
    'delegated_audit_principal',v_actor,'manuscript_owner',v_actor,'logical_project_id',v_project,
    'supabase_project_ref','iklsghevdtqqkjuaympc','root_document_id','quantum-vibration-novel',
    'document_id',v_doc_id,'scene_id','f7cf08b2','title_path',to_jsonb(v_title_path),
    'source_key','A2/CH03/SC01','operation_scope','chapter_title_only',
    'original_instruction_sha256_provenance','original_pasted_request_bytes',
    'request_id',p_request_id,'request_input_spec_id',v_input_spec,
    'request_input_sha256',public.ros_ko_sha256_text(v_input),
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
  -- Follow the existing rewrite/restore selection-first lock order.
  select * into strict v_sel from public.ko_scene_display_selections
    where managed_scene_id=v_managed for update;
  select * into strict v_scene from public.ko_managed_scenes where id=v_managed for share;
  select * into strict v_projection from public.ko_scene_reader_projections
    where managed_scene_id=v_managed for share;
  select * into strict v_composition from public.ko_scene_composition_revisions where id=v_comp for share;
  if v_scene.logical_project_id is distinct from v_project or v_scene.owner_id is distinct from v_actor
     or v_scene.root_document_id is distinct from 'quantum-vibration-novel'
     or v_scene.document_id is distinct from v_doc_id or v_scene.document_slug is distinct from v_doc_id
     or v_scene.scene_id is distinct from 'f7cf08b2' or v_scene.scene_path is distinct from v_scene_path
     or v_scene.source_key is distinct from 'A2/CH03/SC01'
     or v_scene.storage_model is distinct from 'ros-ko-block-v1' or v_scene.generation is distinct from 1::bigint
     or v_scene.manuscript_version is distinct from 'r01'
     or v_scene.title_snapshot is distinct from '[Scene 1: Test Fourteen]'
     or v_sel.review_composition_id is distinct from v_comp or v_sel.final_composition_id is not null
     or v_sel.display_mode is distinct from 'composition' or v_sel.generation is distinct from 1::bigint
     or v_projection.composition_id is distinct from v_comp or v_projection.generation is distinct from 1::bigint
     or v_composition.managed_scene_id is distinct from v_managed or v_composition.status is distinct from 'sealed'
     or v_composition.revision_no is distinct from 1 or v_composition.manuscript_version is distinct from 'r01'
     or v_composition.title_snapshot is distinct from '[Scene 1: Test Fourteen]'
     or v_composition.block_count is distinct from 264 or v_composition.body_bytes is distinct from 30280
     or v_composition.body_lf is distinct from 532 or v_composition.terminal_lf is distinct from 0::smallint
     or v_composition.body_sha256 is distinct from v_body_sha
     or v_projection.body_sha256 is distinct from v_body_sha
     or v_projection.manifest_sha256 is distinct from v_composition.manifest_sha256 then
    raise exception using errcode='40001',message='CHAPTER_TITLE_CURRENT_REVIEW_CHANGED';
  end if;
  perform public.ros_ko_validate_composition(v_comp);
  if v_projection.paragraphs is distinct from public.ros_ko_build_projection(v_comp,1)
     or v_projection.projection_sha256 is distinct from public.ros_ko_sha256_text(v_projection.paragraphs::text) then
    raise exception using errcode='40001',message='CHAPTER_TITLE_PROJECTION_CHANGED';
  end if;
  select string_agg(pv.body_markdown||b.separator_after,'' order by b.position) into v_body
    from public.ko_scene_composition_blocks b
    join public.paragraph_versions pv on pv.id=b.block_version_id and pv.paragraph_unit_id=b.block_unit_id
    where b.composition_id=v_comp;
  if public.ros_ko_sha256_text(v_body) is distinct from v_body_sha then
    raise exception using errcode='40001',message='CHAPTER_TITLE_BODY_CHANGED';
  end if;
  v_state := jsonb_build_object('managed',to_jsonb(v_scene),'selection',to_jsonb(v_sel),
    'projection',to_jsonb(v_projection),'composition',to_jsonb(v_composition),
    'blocks',(select jsonb_agg(to_jsonb(b) order by b.position) from public.ko_scene_composition_blocks b where b.composition_id=v_comp),
    'versions',(select jsonb_agg(to_jsonb(pv) order by pv.id) from public.paragraph_versions pv
      join public.ko_scene_composition_blocks b on b.block_version_id=pv.id where b.composition_id=v_comp));
  perform 1 from public.novel_documents
    where id in('quantum-vibration-novel',v_doc_id,'quantum-vibration-novel-en','quantum-vibration-novel-en-act-5')
    order by id for update;
  select * into strict v_root from public.novel_documents where id='quantum-vibration-novel' and slug=id;
  select * into strict v_doc from public.novel_documents where id=v_doc_id and slug=id;
  select * into strict v_en_root from public.novel_documents where id='quantum-vibration-novel-en' and slug=id;
  select * into strict v_en_doc from public.novel_documents where id='quantum-vibration-novel-en-act-5' and slug=id;
  if public.ros_ko_sha256_text(v_doc.data::text) is distinct from p_expected_document_sha256
     or public.ros_ko_sha256_text(v_root.data::text) is distinct from p_payload->>'expected_root_data_sha256'
     or public.ros_ko_sha256_text(v_en_root.data::text) is distinct from p_payload->>'expected_en_root_data_sha256'
     or public.ros_ko_sha256_text(v_en_doc.data::text) is distinct from p_payload->>'expected_en_document_sha256'
     or left(v_root.title,5) is distinct from '[KO] ' or left(v_doc.title,5) is distinct from '[KO] '
     or left(v_en_root.title,5) is distinct from '[EN] ' or left(v_en_doc.title,5) is distinct from '[EN] '
     or v_doc.data->'number' is distinct from '5'::jsonb or v_en_doc.data->'number' is distinct from '5'::jsonb
     or v_doc.data#>'{chapters,2,number}' is distinct from '3'::jsonb
     or v_en_doc.data#>'{chapters,2,number}' is distinct from '3'::jsonb
     or v_doc.data#>>'{chapters,2,scenes,0,id}' is distinct from 'f7cf08b2'
     or v_doc.data#>'{chapters,2,scenes,0,number}' is distinct from '1'::jsonb
     or v_en_doc.data#>>'{chapters,2,scenes,0,id}' is distinct from 'f7cf08b2'
     or v_en_doc.data#>'{chapters,2,scenes,0,number}' is distinct from '1'::jsonb
     or v_en_doc.data#>>'{chapters,2,title}' is distinct from 'Chapter 3: Math vs Metal'
     or v_en_doc.data#>>'{chapters,2,scenes,0,title}' is distinct from '[Scene 1: Test Fourteen]'
     or (select count(*) from jsonb_array_elements(v_root.data->'acts') a
       where a->'number'='5'::jsonb and a->>'title'=v_doc.data->>'title')<>1
     or (select count(*) from jsonb_array_elements(v_en_root.data->'acts') a
       where a->'number'='5'::jsonb and a->>'title'=v_en_doc.data->>'title')<>1
     or v_doc.data#>>(v_scene_path||array['managedSceneId']) is distinct from v_managed::text
     or v_doc.data#>>(v_scene_path||array['storageModel']) is distinct from 'ros-ko-block-v1'
     or v_doc.data#>>(v_scene_path||array['title']) is distinct from '[Scene 1: Test Fourteen]'
     or v_doc.data#>(v_scene_path||array['paragraphs']) is distinct from v_projection.paragraphs then
    raise exception using errcode='40001',message='CHAPTER_TITLE_CURRENT_DOCUMENT_CHANGED';
  end if;
  if v_doc.data#>>v_title_path=v_new_title then
    raise exception using errcode='22023',message='TITLE_ALREADY_MATCHED_REQUIRE_NO_WRITE';
  end if;
  if v_doc.data#>>v_title_path is distinct from v_old_title then
    raise exception using errcode='40001',message='CHAPTER_TITLE_AUTHOR_CHANGE';
  end if;
  -- Require existing target protection to remain intact, never add/reassign it.
  perform 1 from public.ko_protected_documents
    where document_id in('quantum-vibration-novel',v_doc_id) order by document_id for share;
  if not exists(select 1 from public.ko_protected_documents g
      join public.ko_managed_scenes m on m.id=g.managed_scene_id
      join public.revision_projects p on p.id=m.logical_project_id
      where g.document_id=v_doc_id and g.document_slug=v_doc_id
        and g.protection_reason='managed KO block Scene'
        and m.document_id=v_doc_id and m.document_slug=v_doc_id
        and m.root_document_id='quantum-vibration-novel'
        and m.logical_project_id=v_project and m.owner_id=v_actor
        and m.storage_model='ros-ko-block-v1'
        and p.owner_id=v_actor and p.source_document_id='quantum-vibration-novel-act-2')
     or not exists(select 1 from public.ko_protected_documents g
       join public.ko_managed_scenes m on m.id=g.managed_scene_id
       join public.revision_projects p on p.id=m.logical_project_id
       where g.document_id='quantum-vibration-novel' and g.document_slug=g.document_id
         and g.protection_reason='root of managed KO block Scene'
         and m.root_document_id=g.document_id and m.logical_project_id=v_project and m.owner_id=v_actor
         and m.document_id='quantum-vibration-novel-act-2' and m.document_slug=m.document_id
         and p.owner_id=v_actor and p.source_document_id=m.document_id) then
    raise exception using errcode='40001',message='CHAPTER_TITLE_PROTECTION_CHANGED';
  end if;
  v_outside_sha := public.ros_ko_sha256_text((v_doc.data#-v_title_path)::text);
  v_new_data := jsonb_set(v_doc.data,v_title_path,to_jsonb(v_new_title),false);
  perform set_config('ros_ko.internal_actor',v_actor::text,true);
  perform set_config('ros_ko.internal_request_id',p_request_id::text,true);
  perform set_config('ros_ko.internal_document_id',v_doc_id,true);
  update public.novel_documents set data=v_new_data where id=v_doc_id
    and public.ros_ko_sha256_text(data::text)=p_expected_document_sha256
    and data#>>v_title_path=v_old_title returning * into v_after;
  if not found then raise exception using errcode='40001',message='ZERO_ROW_CHAPTER_TITLE_UPDATE'; end if;
  perform set_config('ros_ko.internal_actor',coalesce(v_prev_actor,''),true);
  perform set_config('ros_ko.internal_request_id',coalesce(v_prev_request,''),true);
  perform set_config('ros_ko.internal_document_id',coalesce(v_prev_document,''),true);
  if v_after.data is distinct from v_new_data
     or public.ros_ko_sha256_text((v_after.data#-v_title_path)::text) is distinct from v_outside_sha
     or (to_jsonb(v_after)-'data'-'updated_at') is distinct from (to_jsonb(v_doc)-'data'-'updated_at') then
    raise exception using errcode='40001',message='CHAPTER_TITLE_OUTSIDE_SCOPE_CHANGED';
  end if;
  select jsonb_build_object('managed',to_jsonb(m),'selection',to_jsonb(s),'projection',to_jsonb(p),
    'composition',to_jsonb(c),
    'blocks',(select jsonb_agg(to_jsonb(b) order by b.position) from public.ko_scene_composition_blocks b where b.composition_id=v_comp),
    'versions',(select jsonb_agg(to_jsonb(pv) order by pv.id) from public.paragraph_versions pv
      join public.ko_scene_composition_blocks b on b.block_version_id=pv.id where b.composition_id=v_comp))
    into v_after_state from public.ko_managed_scenes m
    join public.ko_scene_display_selections s on s.managed_scene_id=m.id
    join public.ko_scene_reader_projections p on p.managed_scene_id=m.id
    join public.ko_scene_composition_revisions c on c.id=s.review_composition_id
    where m.id=v_managed;
  if v_after_state is distinct from v_state then
    raise exception using errcode='40001',message='CHAPTER_TITLE_MANUSCRIPT_STATE_CHANGED';
  end if;
  v_audit := v_audit||jsonb_build_object(
    'before_document_sha256',p_expected_document_sha256,'after_document_sha256',public.ros_ko_sha256_text(v_after.data::text),
    'outside_title_sha256',v_outside_sha,'unchanged_manuscript_state_sha256',public.ros_ko_sha256_text(v_state::text));
  v_result_text := public.ros_ko_lpf_v2(v_result_spec,p_request_id::text,public.ros_ko_sha256_text(v_input),
    v_doc_id,'chapters/2/title',v_old_title,v_new_title,p_expected_document_sha256,
    public.ros_ko_sha256_text(v_after.data::text),v_outside_sha,public.ros_ko_sha256_text(v_state::text),
    v_managed::text,v_comp::text,'1',v_body_sha,public.ros_ko_sha256_text(v_audit::text));
  v_result := jsonb_build_object('replayed',false,'operation','rename_title','scope','chapter_title_only',
    'document_id',v_doc_id,'title_path',to_jsonb(v_title_path),'old_title',v_old_title,'new_title',v_new_title,
    'managed_scene_id',v_managed,'composition_id',v_comp,'generation',1,'body_sha256',v_body_sha,
    'before_document_sha256',p_expected_document_sha256,'after_document_sha256',public.ros_ko_sha256_text(v_after.data::text),
    'request_input_sha256',public.ros_ko_sha256_text(v_input),
    'result_manifest_sha256',public.ros_ko_sha256_text(v_result_text),'delegated_audit',v_audit);
  update ros_ko_private.ko_mutation_requests set status='completed',result_spec_id=v_result_spec,
    result_manifest_sha256=public.ros_ko_sha256_text(v_result_text),result_manifest_text=v_result_text,
    result_manifest_hex=encode(convert_to(v_result_text,'UTF8'),'hex'),result=v_result,completed_at=statement_timestamp()
    where owner_id=v_actor and request_id=p_request_id and status='running'
      and request_input_sha256=public.ros_ko_sha256_text(v_input) and request_input_text=v_input;
  if not found then raise exception using errcode='40001',message='REQUEST_COMPLETION_STATE_MISMATCH'; end if;
  return v_result;
end
$function$;
ALTER FUNCTION ros_ko_private.rename_a2_ch03_sc01_chapter_delegated(uuid,text,jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION ros_ko_private.rename_a2_ch03_sc01_chapter_delegated(uuid,text,jsonb)
  FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION ros_ko_private.rename_a2_ch03_sc01_chapter_delegated(uuid,text,jsonb) TO postgres;
COMMENT ON FUNCTION ros_ko_private.rename_a2_ch03_sc01_chapter_delegated(uuid,text,jsonb)
  IS 'A2/CH03 metadata only: actual postgres execution, observed Auth context and expressly delegated audit owner are distinct; changes only Chapter title and one audited request.';
