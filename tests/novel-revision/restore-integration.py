"""Joint restore through actual HTTP API while readers capture both languages."""
import importlib.util,pathlib,json,unittest,uuid,urllib.request,threading
from concurrent.futures import ThreadPoolExecutor
spec=importlib.util.spec_from_file_location('d',pathlib.Path(__file__).with_name('database-integration.py'));d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
pub=json.loads((d.P/'published.json').read_text())
body={'action':'restore','request_id':str(uuid.uuid4()),'target_id':pub['publication_id']}
def restore():
 req=urllib.request.Request('http://127.0.0.1:3003/api/novel-bilingual-publication',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','Authorization':'Bearer '+json.loads((d.P/'owner-session.json').read_text())['access_token']})
 with urllib.request.urlopen(req) as r:return r.status,json.load(r)
class Restore(unittest.TestCase):
 def test_01_restore_during_reads(self):
  # Compare both document languages from the actual single-statement reader RPC.
  barrier=threading.Barrier(3)
  def reads(_):
   barrier.wait();result=[]
   for i in range(12):
    status,c=d.capture()
    if status==409:
     self.assertIn(c['message'],['CAPTURE_DOCUMENT_CHANGED','CAPTURE_SCENE_CHANGED']);result.append(['RETRY']);continue
    self.assertEqual(status,200,c)
    docs=[x for x in c['documents'] if x['id'].endswith('act-2')]
    sizes=[len(x['data']['chapters'][1]['scenes'][0]['paragraphs']) for x in docs]
    self.assertIn(sizes,[[67,67],[79,79]])
    self.assertEqual(c['managed'][0]['composition']['block_count'],sizes[0]);result.append(sizes)
   return result
  def change():barrier.wait();return restore()
  with ThreadPoolExecutor(max_workers=3) as pool:
   a=pool.submit(reads,0);b=pool.submit(reads,1);c=pool.submit(change)
   status,r=c.result();self.assertEqual(status,200,r);self.assertEqual(r['status'],'RESTORED')
   observed=a.result()+b.result()
  (d.P/'restore-results.json').write_text(json.dumps({'result':r,'read_pairs':observed}))
  self.assertEqual(d.sql("select data->>'otherScene' from public.novel_documents where id='quantum-vibration-novel-en-act-2'"),'later edit retained')
 def test_02_replay_and_history(self):
  before=d.counts();status,r=restore();self.assertEqual(status,200);self.assertTrue(r['replayed']);self.assertEqual(d.counts(),before)
  status,p=d.rpc('ros_bilingual_read_published',{'p_managed_scene_id':'13a795ae-456e-4623-9714-b302c9db9585','p_composition_id':pub['ko_composition_id']})
  self.assertEqual(status,200,p);self.assertEqual(len(p['pairs']),67)
 def test_03_old_capture_download_rejected(self):
  capture=json.loads((d.P/'output-results.json').read_text())[0]['captureId']
  req=urllib.request.Request('http://127.0.0.1:3003/api/novel-book-pdf',data=json.dumps({'slug':'quantum-vibration-novel-en','captureId':capture}).encode(),headers={'Content-Type':'application/json','Authorization':'Bearer '+json.loads((d.P/'owner-session.json').read_text())['access_token']})
  try:urllib.request.urlopen(req);self.fail('Old edition was silently replaced')
  except urllib.error.HTTPError as e:self.assertEqual(e.code,409)
if __name__=='__main__':unittest.main(verbosity=2)
