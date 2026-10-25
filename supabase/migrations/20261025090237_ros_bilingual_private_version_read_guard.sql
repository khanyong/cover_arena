-- Restrict only newly staged bilingual versions. Existing project read policies
-- remain necessary and unchanged; this policy cannot grant any additional read.
-- A publication remains historical after restore, so its versions stay readable
-- under the original project policy. Retained baseline versions are never hidden.
create function ros_bilingual_private.version_read_visible(p_version_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select not exists (
   select 1 from ros_bilingual_private.releases r
   join ros_bilingual_private.approvals a on a.id=r.approval_id
   where (r.pairs @> jsonb_build_array(jsonb_build_object('en_version_id',p_version_id))
       or r.pairs @> jsonb_build_array(jsonb_build_object('ko_version_id',p_version_id)))
     and not (r.baseline->'ordered_alignment' @> jsonb_build_array(jsonb_build_object('en',jsonb_build_object('version_id',p_version_id)))
           or r.baseline->'ordered_alignment' @> jsonb_build_array(jsonb_build_object('ko',jsonb_build_object('version_id',p_version_id))))
     and not exists(select 1 from ros_bilingual_private.publications p where p.release_id=r.id)
     and (auth.uid() is distinct from a.approved_actor
       or not coalesce(public.ros_ko_can_read_scene(a.managed_scene_id),false))
 )
$$;
revoke all on function ros_bilingual_private.version_read_visible(uuid) from public;
-- A boolean-only wrapper lets RLS evaluate the private predicate without giving
-- anonymous callers USAGE on the private schema or access to private records.
create function public.ros_bilingual_version_read_visible(p_version_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select ros_bilingual_private.version_read_visible(p_version_id)
$$;
revoke all on function public.ros_bilingual_version_read_visible(uuid) from public;
grant execute on function public.ros_bilingual_version_read_visible(uuid) to anon,authenticated;
create policy ros_bilingual_unpublished_version_read
on public.paragraph_versions as restrictive for select to anon,authenticated
using (public.ros_bilingual_version_read_visible(id));
