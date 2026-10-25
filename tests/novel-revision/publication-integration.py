"""Run after database-integration.py in the same isolated, private fixture."""
import importlib.util, pathlib, json, unittest, uuid
spec=importlib.util.spec_from_file_location('dbtest',pathlib.Path(__file__).with_name('database-integration.py'))
d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
sql,rpc=d.sql,d.rpc
class Publication(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.release=json.loads((d.P/'readback.json').read_text())['release_id']
  cls.request={'p_request_id':str(uuid.uuid4()),'p_release_id':cls.release}
  # An unrelated edit AFTER staging must survive publication.
  sql("update public.novel_documents set data=jsonb_set(data,'{otherScene}','\"later edit retained\"') where id='quantum-vibration-novel-en-act-2'")
  sql("insert into public.content_units(id,project_id,unit_type,source_key) values('90000000-0000-4000-8000-000000000001','707e3ae1-0817-467a-bb42-5401c646151e','chapter','TEST/OTHER/CHAPTER'); insert into public.revision_content_map(snapshot_id,unit_id,position,is_included,title_override,metadata_override) select id,'90000000-0000-4000-8000-000000000001',500,false,'Later chapter title','{\"later\":true}'::jsonb from public.revision_snapshots where is_primary_working")
  sql("insert into public.ko_protected_documents(document_id,document_slug,protection_reason,managed_scene_id) select document_id,document_slug,'TEST: actual production guard',id from public.ko_managed_scenes")
 def test_00_concurrent_target_map_edit_conflicts(self):
  import time
  from concurrent.futures import ThreadPoolExecutor
  # Real concurrent DB writer, not an application HTTP edit endpoint.
  command="begin;set local application_name='ros-exec02-editor';lock table public.revision_content_map in share row exclusive mode;update public.revision_content_map set title_override='Concurrent target edit' where snapshot_id=(select id from public.revision_snapshots where is_primary_working) and position=1;select pg_sleep(0.5);commit;"
  with ThreadPoolExecutor(max_workers=1) as pool:
   future=pool.submit(sql,command)
   for _ in range(30):
    if sql("select count(*) from pg_stat_activity where application_name='ros-exec02-editor' and wait_event='PgSleep'")=='1':break
    time.sleep(.02)
   else:self.fail('Concurrent editor barrier not reached')
   status,r=rpc('ros_bilingual_publish',self.request);future.result()
  self.assertEqual(status,409,r);self.assertIn('TARGET_MAP_CHANGED',r['message'])
  self.assertEqual(sql('select count(*) from ros_bilingual_private.publications'),'0')
  self.assertEqual(sql("select title_override from public.revision_content_map where snapshot_id=(select id from public.revision_snapshots where is_primary_working) and position=1"),'Concurrent target edit')
  sql("update public.revision_content_map set title_override=null where snapshot_id=(select id from public.revision_snapshots where is_primary_working) and position=1")
 def test_01_document_guard_active(self):
  with self.assertRaisesRegex(RuntimeError,'MANAGED_DOCUMENT_REQUIRES_TARGETED_RPC'):
   sql("update public.novel_documents set title='denied' where id='quantum-vibration-novel-act-2'")
 def test_02_public_projection_failure_is_atomic(self):
  before=d.counts()
  sql("""create function public.exec02_publication_fail() returns trigger language plpgsql as $$begin
   if new.id='quantum-vibration-novel-act-2' then raise exception 'TEST_ONLY_KO_PROJECTION_FAILURE';end if;return new;end$$;
   create trigger zz_exec02_publication_fail before update on public.novel_documents for each row execute function public.exec02_publication_fail();""")
  try:
   status,r=rpc('ros_bilingual_publish',self.request);self.assertGreaterEqual(status,400,r);self.assertIn('TEST_ONLY_KO_PROJECTION_FAILURE',r['message'])
   self.assertEqual(d.counts(),before)
   self.assertEqual(sql('select count(*) from ros_bilingual_private.publications'),'0')
   self.assertEqual(sql('select count(*) from ros_ko_private.ko_mutation_requests'),'0')
  finally:sql('drop trigger zz_exec02_publication_fail on public.novel_documents;drop function public.exec02_publication_fail();')
 def test_03_joint_publish_preserves_later_edit(self):
  status,r=rpc('ros_bilingual_publish',self.request);self.assertEqual(status,200,r);self.assertEqual(r['status'],'PUBLISHED')
  type(self).published=r;(d.P/'published.json').write_text(json.dumps(r))
  self.assertEqual(sql("select string_agg(jsonb_array_length(data#>'{chapters,1,scenes,0,paragraphs}')::text,',' order by id) from public.novel_documents where id like '%act-2'"),'67,67')
  self.assertEqual(sql("select data->>'otherScene' from public.novel_documents where id='quantum-vibration-novel-en-act-2'"),'later edit retained')
  self.assertEqual(sql('select review_composition_id::text from public.ko_scene_display_selections'),r['ko_composition_id'])
  self.assertEqual(sql('select id::text from public.revision_snapshots where is_primary_working'),r['en_snapshot_id'])
  self.assertEqual(sql("select is_included::text||':'||title_override||':'||metadata_override::text from public.revision_content_map where snapshot_id='"+r['en_snapshot_id']+"' and unit_id='90000000-0000-4000-8000-000000000001'"),'false:Later chapter title:{"later": true}')
 def test_04_publish_retry(self):
  before=d.counts();status,r=rpc('ros_bilingual_publish',self.request);self.assertEqual(status,200,r);self.assertTrue(r['replayed']);self.assertEqual(d.counts(),before)
if __name__=='__main__':unittest.main(verbosity=2)
