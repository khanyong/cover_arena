-- Test-only policy equivalents for the captured production read contract.
-- Existing KO schema supplies ros_ko_can_read_scene and its policies unchanged.
-- Legacy fixture only: owner+registered read capability. Production uses its
-- deployed shared-reader predicate; this is NOT a claim of full policy parity.
create function public.ros_ko_can_read_scene(p_managed_scene_id uuid) returns boolean language plpgsql stable security definer set search_path='' as $$begin
 perform public.ros_ko_assert_scene_owner(p_managed_scene_id,'read');return true;
 exception when insufficient_privilege then return false;end$$;
revoke all on function public.ros_ko_can_read_scene(uuid) from public,anon;
grant execute on function public.ros_ko_can_read_scene(uuid) to authenticated;
alter table public.novel_documents enable row level security;
grant select on public.novel_documents to anon,authenticated;
create policy fixture_document_read on public.novel_documents for select to anon,authenticated using(true);
create policy fixture_ko_restriction on public.novel_documents as restrictive for select to anon,authenticated
using(id !~ '^quantum-vibration-novel(-act-[0-9]+)?$' or exists(select 1 from public.ko_managed_scenes s where s.document_id='quantum-vibration-novel-act-2' and public.ros_ko_can_read_scene(s.id)));
alter table public.content_units enable row level security;
alter table public.paragraph_versions enable row level security;
alter table public.revision_snapshots enable row level security;
alter table public.revision_content_map enable row level security;
alter table public.paragraph_version_lineage enable row level security;
grant select on public.content_units,public.paragraph_versions,public.revision_snapshots,public.revision_content_map to authenticated;
create policy fixture_units_owner on public.content_units for select to authenticated using(exists(select 1 from public.revision_projects p where p.id=project_id and p.owner_id=auth.uid()));
create policy fixture_versions_owner on public.paragraph_versions for select to authenticated using(exists(select 1 from public.content_units u where u.id=paragraph_unit_id));
create policy fixture_snapshots_owner on public.revision_snapshots for select to authenticated using(exists(select 1 from public.revision_projects p where p.id=project_id and p.owner_id=auth.uid()));
create policy fixture_map_owner on public.revision_content_map for select to authenticated using(exists(select 1 from public.revision_snapshots s where s.id=snapshot_id));
grant select on public.revision_projects to authenticated;
alter table public.revision_projects enable row level security;
create policy fixture_projects_owner on public.revision_projects for select to authenticated using(owner_id=auth.uid());
create function public.fixture_immutable_version() returns trigger language plpgsql as $$begin raise exception 'paragraph_versions records are immutable';end$$;
create trigger fixture_immutable_version before update or delete on public.paragraph_versions for each row execute function public.fixture_immutable_version();
create function public.fixture_locked_map() returns trigger language plpgsql as $$begin
 if exists(select 1 from public.revision_snapshots where id=case when TG_OP='DELETE' then old.snapshot_id else new.snapshot_id end and state in ('locked','archived')) then raise exception 'locked content map';end if;
 if TG_OP='DELETE' then return old;end if;return new;end$$;
create trigger fixture_locked_map before insert or update or delete on public.revision_content_map for each row execute function public.fixture_locked_map();
-- Original migration's direct private authorization subquery cannot run under
-- authenticated. Production uses this deployed predicate shape instead.
drop policy ko_managed_scenes_owner_read on public.ko_managed_scenes;
create policy ko_managed_scenes_owner_read on public.ko_managed_scenes for select to authenticated using(public.ros_ko_can_read_scene(id));
