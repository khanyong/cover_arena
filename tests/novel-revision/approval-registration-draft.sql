-- WIP isolated acceptance schema. Packages are reviewed server-side evidence,
-- never writable by browser/API roles. Loading a package does not publish text.
create table ros_bilingual_private.approval_packages (
 id uuid primary key,
 instruction_id text not null check(instruction_id='ROS-STYLE-BATCH18-PUBLISH-EXEC-01-20261028'),
 instruction_received_at timestamptz not null,
 package jsonb not null,
 loaded_at timestamptz not null default now(),
 check(package ?& array['change_key','revision','approved_actor','approval_digest','proposal','baseline','plan','managed_scene_id','en_project_id','en_document_id','evidence']),
 check(jsonb_typeof(package->'plan')='object' and package->'plan' ? 'contract'),
 check(package#>'{plan,contract}' ? 'explicit_structure'),
 check(package->>'change_key' = any(array[
 'ROS-STYLE-PRO-C02-S02-r01','ROS-STYLE-PRO-C03-S01-r01','ROS-STYLE-PRO-C03-S02-r01',
 'ROS-STYLE-A0-C01-S01-r01','ROS-STYLE-A0-C01-S02-r01','ROS-STYLE-A0-C02-S01-r01',
 'ROS-STYLE-A0-C02-S02-r01','ROS-STYLE-A0-C03-S01-r01','ROS-STYLE-A0-C03-S02-r01',
 'ROS-STYLE-A0-C04-S01-r01','ROS-STYLE-A0-C04-S02-r01','ROS-STYLE-A1-C01-S01-r01',
 'ROS-STYLE-A1-C01-S02-r01','ROS-STYLE-A1-C02-S01-r01','ROS-STYLE-A1-C02-S02-r01',
 'ROS-STYLE-A1-C03-S01-r01','ROS-STYLE-A1-C03-S03-r01','ROS-STYLE-A1-C04-S01-r01'])),
 check((package->>'revision')::integer=1),
 check(package#>>'{plan,contract,explicit_structure}'='true'),
 check(package->>'approval_digest'=package#>>'{plan,approval_digest}')
);
alter table ros_bilingual_private.approval_packages enable row level security;
revoke all on ros_bilingual_private.approval_packages from public,anon,authenticated;
create trigger bilingual_package_immutable before update or delete on ros_bilingual_private.approval_packages
for each row execute function ros_bilingual_private.immutable();

create function ros_bilingual_private.register_approval(p_package_id uuid,p_proposal jsonb,p_approval_digest text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare pack ros_bilingual_private.approval_packages; a ros_bilingual_private.approvals;
 old ros_bilingual_private.approvals; actor uuid:=auth.uid();
begin
 if actor is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
  or coalesce((auth.jwt()->>'exp')::bigint,0)<=extract(epoch from now()) then
  raise exception using errcode='42501',message='AUTHENTICATED_ACTOR_REQUIRED';end if;
 select * into pack from ros_bilingual_private.approval_packages where id=p_package_id;
 if not found or pack.package->>'approved_actor' is distinct from actor::text then
  raise exception using errcode='42501',message='APPROVAL_PACKAGE_ACCESS_DENIED';end if;
 a:=jsonb_populate_record(null::ros_bilingual_private.approvals,pack.package);
 if p_proposal is distinct from a.proposal or p_approval_digest is distinct from a.approval_digest then
  raise exception using errcode='PT409',message='APPROVAL_PACKAGE_MISMATCH';end if;
 perform public.ros_ko_assert_scene_owner(a.managed_scene_id,'rewrite');
 if not coalesce(public.fn_is_project_owner(a.en_project_id),false) then
  raise exception using errcode='42501',message='EN_PROJECT_ACCESS_DENIED';end if;
 perform pg_advisory_xact_lock(hashtextextended(a.change_key||':'||a.revision::text,0));
 select * into old from ros_bilingual_private.approvals where change_key=a.change_key and revision=a.revision;
 if found then
  if old.proposal is distinct from a.proposal or old.plan is distinct from a.plan
   or old.baseline is distinct from a.baseline or old.approval_digest is distinct from a.approval_digest
   or old.approved_actor is distinct from actor then
   raise exception using errcode='PT409',message='APPROVAL_ALREADY_REGISTERED_DIFFERENTLY';end if;
  return jsonb_build_object('approval_id',old.id,'replayed',true,'registered_at',old.approved_at);
 end if;
 perform ros_bilingual_private.assert_baseline(a);
 insert into ros_bilingual_private.approvals(id,change_key,revision,managed_scene_id,en_project_id,en_document_id,
 approved_actor,approval_digest,proposal,baseline,plan,evidence,approved_at)
 values(pack.id,a.change_key,a.revision,a.managed_scene_id,a.en_project_id,a.en_document_id,actor,
 a.approval_digest,a.proposal,a.baseline,a.plan,pack.instruction_id||' / '||a.evidence,now()) returning * into old;
 return jsonb_build_object('approval_id',old.id,'replayed',false,'registered_at',old.approved_at,
 'instruction_received_at',pack.instruction_received_at);
end $$;
revoke all on function ros_bilingual_private.register_approval(uuid,jsonb,text) from public,anon,authenticated;
create function public.ros_bilingual_register_approval(p_package_id uuid,p_proposal jsonb,p_approval_digest text)
returns jsonb language sql security definer set search_path='' as $$
 select ros_bilingual_private.register_approval(p_package_id,p_proposal,p_approval_digest)
$$;
revoke all on function public.ros_bilingual_register_approval(uuid,jsonb,text) from public,anon;
grant execute on function public.ros_bilingual_register_approval(uuid,jsonb,text) to authenticated;
