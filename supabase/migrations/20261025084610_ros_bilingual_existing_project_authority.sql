-- No owners, grants, policies or approval actors are changed.
create or replace function ros_bilingual_private.authorize(p_approval_id uuid)
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
 -- Reuse the deployed EN project policy (including legacy unowned projects).
 -- The signed-in actor must still match the fixed approval and KO rewrite capability.
 if not coalesce(public.fn_is_project_owner(a.en_project_id),false) then
   raise exception using errcode='42501',message='EN_PROJECT_ACCESS_DENIED'; end if;
 return a;
end $$;

