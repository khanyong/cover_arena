"""Add synthetic unrelated map rows to a fresh, labelled NONPRODUCTION run."""
import importlib.util,pathlib
spec=importlib.util.spec_from_file_location('d',pathlib.Path(__file__).with_name('database-integration.py'))
d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
assert d.sql('select count(*) from ros_bilingual_private.releases')=='0'
d.sql("""with added as (
 insert into public.content_units(project_id,unit_type,source_key)
 select '707e3ae1-0817-467a-bb42-5401c646151e','chapter','SYNTHETIC/SCALE/'||n
 from generate_series(1,45704) n returning id,source_key)
 insert into public.revision_content_map(snapshot_id,unit_id,position,is_included)
 select s.id,u.id,1000+split_part(u.source_key,'/',3)::integer,false
 from added u cross join public.revision_snapshots s where s.is_primary_working;
""")
print('Synthetic baseline map count:',d.sql('select count(*) from public.revision_content_map where snapshot_id=(select id from public.revision_snapshots where is_primary_working)'))
