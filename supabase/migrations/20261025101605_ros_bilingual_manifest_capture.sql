-- Pin a complete edition with hashes, then hydrate bounded RLS-protected pieces.
-- A concurrent edit rejects the capture rather than mixing EN and KO editions.
create or replace function public.ros_bilingual_capture_book()
returns jsonb language sql stable security invoker set search_path='' set statement_timeout='45s' as $$
 with docs as materialized (
 select id,slug,encode(sha256(convert_to(data::text,'UTF8')),'hex') sha256 from public.novel_documents
 where slug in ('quantum-vibration-novel','quantum-vibration-novel-en')
 or slug ~ '^quantum-vibration-novel(-en)?-act-[0-9]+$'
 ), scenes as materialized (
 select s.id,public.ros_ko_get_scene(s.id,null,false) payload
 from public.ko_managed_scenes s where exists(select 1 from docs d where d.id=s.document_id)
 )
 select jsonb_build_object('format','ros-bilingual-book-manifest-v2',
 'documents',(select jsonb_agg(to_jsonb(d) order by slug) from docs d),
 'managed',coalesce((select jsonb_agg(jsonb_build_object('id',id,'sha256',encode(sha256(convert_to((payload || jsonb_build_object('bilingual_publication',public.ros_bilingual_read_published(id,(payload->>'requested_composition_id')::uuid)))::text,'UTF8')),'hex'))) from scenes),'[]'::jsonb))
$$;
create or replace function public.ros_bilingual_capture_document(p_id text,p_sha256 text)
returns text language plpgsql stable security invoker set search_path='' as $$
declare body text;
begin
 select data::text into body from public.novel_documents where id=p_id
 and (slug in ('quantum-vibration-novel','quantum-vibration-novel-en') or slug ~ '^quantum-vibration-novel(-en)?-act-[0-9]+$');
 if body is null then raise exception using errcode='42501',message='CAPTURE_DOCUMENT_UNAVAILABLE';end if;
 if encode(sha256(convert_to(body,'UTF8')),'hex') is distinct from p_sha256 then raise exception using errcode='PT409',message='CAPTURE_DOCUMENT_CHANGED';end if;
 return body;
end $$;
create or replace function public.ros_bilingual_capture_scene(p_id uuid,p_sha256 text)
returns text language plpgsql stable security invoker set search_path='' as $$
declare payload jsonb;body text;
begin
 payload:=public.ros_ko_get_scene(p_id,null,false);
 body:=(payload || jsonb_build_object('bilingual_publication',public.ros_bilingual_read_published(p_id,(payload->>'requested_composition_id')::uuid)))::text;
 if encode(sha256(convert_to(body,'UTF8')),'hex') is distinct from p_sha256 then raise exception using errcode='PT409',message='CAPTURE_SCENE_CHANGED';end if;
 return body;
end $$;
revoke all on function public.ros_bilingual_capture_document(text,text),public.ros_bilingual_capture_scene(uuid,text) from public,anon;
grant execute on function public.ros_bilingual_capture_document(text,text),public.ros_bilingual_capture_scene(uuid,text) to authenticated;
notify pgrst,'reload schema';
