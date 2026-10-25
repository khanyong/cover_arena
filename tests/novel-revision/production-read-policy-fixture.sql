-- NONPRODUCTION only: predicates read from the deployed catalog on 2026-10-25.
-- Does not install operational grants or modify production owners.
create or replace function public.fn_is_project_owner(p_project_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.revision_projects where id=p_project_id and (owner_id=auth.uid() or owner_id is null))
$$;
create or replace function ros_ko_private.scene_actor_has_capability(p_scene uuid,p_actor uuid,p_capability text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ko_managed_scenes s
 join ros_ko_private.ko_scene_authorizations a on a.document_id=s.document_id and a.scene_id=s.scene_id and a.actor_id=p_actor
 where s.id=p_scene and p_actor is not null and (s.owner_id=p_actor or p_capability in ('read','rewrite'))
 and case p_capability when 'read' then a.can_read when 'rewrite' then a.can_read and a.can_rewrite
 when 'migrate' then a.can_migrate when 'restore' then a.can_restore else false end)
$$;
create or replace function public.ros_ko_assert_scene_owner(p_managed_scene_id uuid,p_capability text)
returns public.ko_managed_scenes language plpgsql stable security definer set search_path='' as $$
declare s public.ko_managed_scenes; actor uuid:=public.ros_ko_require_actor();
begin
 select * into s from public.ko_managed_scenes where id=p_managed_scene_id;
 if not found or (s.owner_id<>actor and (p_capability is null or p_capability not in ('read','rewrite'))) then
 raise exception using errcode='42501',message='MANAGED_SCENE_ACCESS_DENIED';end if;
 if not ros_ko_private.scene_actor_has_capability(p_managed_scene_id,actor,p_capability) then
 raise exception using errcode='42501',message='MANAGED_SCENE_CAPABILITY_DENIED';end if;
 return s;
end $$;
create or replace function public.ros_ko_can_read_scene(p_managed_scene_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select ros_ko_private.scene_actor_has_capability(p_managed_scene_id,auth.uid(),'read')
$$;
alter policy fixture_projects_owner on public.revision_projects using(owner_id=auth.uid() or owner_id is null);
alter policy fixture_units_owner on public.content_units using(public.fn_is_project_owner(project_id));
alter policy fixture_snapshots_owner on public.revision_snapshots using(public.fn_is_project_owner(project_id));
