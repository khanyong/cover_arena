-- Preserve one MVCC snapshot and invoker RLS. Materialize each managed scene once.
create or replace function public.ros_bilingual_capture_book()
returns jsonb language sql stable security invoker set search_path='' set statement_timeout='45s' as $$
 with docs as materialized (
 select id,slug,data from public.novel_documents
 where slug in ('quantum-vibration-novel','quantum-vibration-novel-en')
 or slug ~ '^quantum-vibration-novel(-en)?-act-[0-9]+$'
 ), managed_raw as materialized (
 select s.id,public.ros_ko_get_scene(s.id,null,false) payload
 from public.ko_managed_scenes s
 where exists(select 1 from docs d where d.id=s.document_id)
 ), managed as materialized (
 select payload || jsonb_build_object('bilingual_publication',public.ros_bilingual_read_published(id,(payload->>'requested_composition_id')::uuid)) payload
 from managed_raw
 )
 select jsonb_build_object('format','ros-bilingual-book-capture-v1','documents',
 (select jsonb_agg(to_jsonb(d) order by slug) from docs d),'managed',
 coalesce((select jsonb_agg(payload) from managed),'[]'::jsonb))
$$;
notify pgrst,'reload schema';
