"""Only a labelled isolated fixture after scoped-self-restore.py; ends PUBLISHED."""
import importlib.util,pathlib,json,unittest,uuid
spec=importlib.util.spec_from_file_location('d',pathlib.Path(__file__).with_name('database-integration.py'));d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
old=json.loads((d.P/'published.json').read_text());restored=json.loads((d.P/'self-restore-result.json').read_text())
class Republish(unittest.TestCase):
 def test_01_later_generation_refused(self):
  d.sql('update public.ko_managed_scenes set generation=generation+1')
  try:
   status,r=d.rpc('ros_bilingual_publish',{'p_request_id':str(uuid.uuid4()),'p_release_id':old['release_id']})
   self.assertEqual(status,409,r);self.assertEqual(r['message'],'REPUBLISH_RESTORED_BASE_CHANGED')
  finally:d.sql('update public.ko_managed_scenes set generation=generation-1')
 def test_02_republish_and_retry(self):
  request={'p_request_id':str(uuid.uuid4()),'p_release_id':old['release_id']}
  status,r=d.rpc('ros_bilingual_publish',request);self.assertEqual(status,200,r)
  self.assertNotEqual(r['publication_id'],old['publication_id']);self.assertEqual(r['generation'],restored['generation']+1)
  self.assertEqual(d.sql('select count(*) from ros_bilingual_private.publications'),'2')
  self.assertEqual(d.sql('select count(*) from ros_bilingual_private.releases'),'1')
  before=d.counts();status,replay=d.rpc('ros_bilingual_publish',request);self.assertEqual(status,200,replay);self.assertTrue(replay['replayed']);self.assertEqual(before,d.counts())
  status,denied=d.rpc('ros_bilingual_publish',{'p_request_id':str(uuid.uuid4()),'p_release_id':old['release_id']});self.assertEqual(status,409,denied)
  status,scene=d.rpc('ros_bilingual_read_published',{'p_managed_scene_id':'13a795ae-456e-4623-9714-b302c9db9585','p_composition_id':r['ko_composition_id']},'reader');self.assertEqual(status,200,scene);self.assertEqual(scene['publication_id'],r['publication_id']);self.assertEqual(len(scene['pairs']),67)
  (d.P/'republished.json').write_text(json.dumps(r))
if __name__=='__main__':unittest.main(verbosity=2)
