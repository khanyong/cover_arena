-- Historical publication comparison only. No mutable selections or manuscript writes.
create function ros_bilingual_private.revision_history(p_managed_scene_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not coalesce(public.ros_ko_can_read_scene(p_managed_scene_id),false) then
  raise exception using errcode='42501',message='SCENE_ACCESS_DENIED';
 end if;
 select coalesce(jsonb_agg(jsonb_build_object(
  'id',p.id,'created_at',p.created_at,'revision',a.revision,
  'current',coalesce(sel.publication_id=p.id,false),
  'before',jsonb_build_object('en',p.en_before,'ko',p.ko_before),
  'after',jsonb_build_object('en',p.en_after,'ko',p.ko_after),
  'groups',a.baseline->'changes','plan',a.plan->'result_pairs'
 ) order by p.created_at desc,p.id),'[]'::jsonb) into result
 from ros_bilingual_private.publications p
 join ros_bilingual_private.releases r on r.id=p.release_id
 join ros_bilingual_private.approvals a on a.id=r.approval_id
 left join ros_bilingual_private.publication_selections sel on sel.managed_scene_id=a.managed_scene_id
 where a.managed_scene_id=p_managed_scene_id;
 return result;
end $$;
create function public.ros_bilingual_revision_history(p_managed_scene_id uuid)
returns jsonb language sql stable security invoker set search_path='' as $$
 select ros_bilingual_private.revision_history(p_managed_scene_id)
$$;
revoke all on function ros_bilingual_private.revision_history(uuid),public.ros_bilingual_revision_history(uuid) from public,anon,authenticated;
grant execute on function ros_bilingual_private.revision_history(uuid),public.ros_bilingual_revision_history(uuid) to authenticated;
