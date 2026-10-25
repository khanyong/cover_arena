"""Run on an isolated published fixture. Deliberately ends jointly RESTORED."""
import importlib.util,pathlib,json,unittest,uuid
spec=importlib.util.spec_from_file_location('d',pathlib.Path(__file__).with_name('database-integration.py'));d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
pub=json.loads((d.P/'published.json').read_text());actor=json.loads((d.P/'owner-session.json').read_text())['user']['id'];other=json.loads((d.P/'outsider-session.json').read_text())['user']['id']
class ScopedRestore(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  assert d.sql("select owner_id from public.ko_managed_scenes")==other
  cls.request={'p_request_id':str(uuid.uuid4()),'p_publication_id':pub['publication_id']}
 def test_01_no_opt_in_denied(self):
  before=d.counts();status,r=d.rpc('ros_bilingual_restore_publication',self.request)
  self.assertEqual(status,403,r);self.assertEqual(before,d.counts())
 def test_02_scoped_registration_not_general_restore(self):
  d.sql("insert into ros_bilingual_private.self_restore_approvals(approval_id,actor_id,evidence) values('"+d.request['p_approval_id']+"','"+actor+"','NONPRODUCTION explicit self-publication restore approval')")
  self.assertEqual(d.sql("select ros_ko_private.scene_actor_has_capability(id,'"+actor+"','restore') from public.ko_managed_scenes"),'f')
  for who in [None,'outsider','reader']:
   before=d.counts();status,r=d.rpc('ros_bilingual_restore_publication',self.request,who);self.assertIn(status,[401,403],r);self.assertEqual(before,d.counts())
 def test_03_later_edit_blocks_restore(self):
  where=" where snapshot_id='"+pub['en_snapshot_id']+"' and position=1"
  d.sql("update public.revision_content_map set title_override='Later edit'"+where)
  try:
   before=d.counts();status,r=d.rpc('ros_bilingual_restore_publication',self.request);self.assertEqual(status,409,r);self.assertIn('RESTORE_MAP_CHANGED',r['message']);self.assertEqual(before,d.counts())
  finally:d.sql('update public.revision_content_map set title_override=null'+where)
 def test_04_self_restore_and_replay(self):
  status,r=d.rpc('ros_bilingual_restore_publication',self.request);self.assertEqual(status,200,r);self.assertEqual(r['status'],'RESTORED')
  self.assertEqual(d.sql("select string_agg(jsonb_array_length(data#>'{chapters,1,scenes,0,paragraphs}')::text,',' order by id) from public.novel_documents where id like '%act-2'"),'79,79')
  before=d.counts();status,replay=d.rpc('ros_bilingual_restore_publication',self.request);self.assertEqual(status,200,replay);self.assertTrue(replay['replayed']);self.assertEqual(before,d.counts())
  (d.P/'self-restore-result.json').write_text(json.dumps(r))
if __name__=='__main__':unittest.main(verbosity=2)
