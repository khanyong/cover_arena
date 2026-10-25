"""Hash pinning and bounded payload test on an existing isolated fixture."""
import importlib.util,pathlib,unittest
spec=importlib.util.spec_from_file_location('d',pathlib.Path(__file__).with_name('database-integration.py'));d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
class Capture(unittest.TestCase):
 def test_01_large_document_and_drift(self):
  d.sql("update public.novel_documents set data=jsonb_set(data,'{synthetic_capture_test}',to_jsonb(repeat('synthetic ',400000))) where id='quantum-vibration-novel-en'")
  try:
   status,m=d.rpc('ros_bilingual_capture_book',{},'reader');self.assertEqual(status,200,m)
   self.assertLess(len(str(m)),10000)
   entry=next(x for x in m['documents'] if x['id']=='quantum-vibration-novel-en')
   args={'p_id':entry['id'],'p_sha256':entry['sha256']}
   status,body=d.rpc('ros_bilingual_capture_document',args,'reader');self.assertEqual(status,200);self.assertGreater(len(body),3000000)
   d.sql("update public.novel_documents set data=jsonb_set(data,'{synthetic_capture_test}','\"changed\"') where id='quantum-vibration-novel-en'")
   self.assertEqual(d.rpc('ros_bilingual_capture_document',args,'reader')[0],409)
   for actor in [None]:self.assertIn(d.rpc('ros_bilingual_capture_document',args,actor)[0],[401,403])
   scene=m['managed'][0];self.assertEqual(d.rpc('ros_bilingual_capture_scene',{'p_id':scene['id'],'p_sha256':'0'*64},'reader')[0],409)
  finally:d.sql("update public.novel_documents set data=data-'synthetic_capture_test' where id='quantum-vibration-novel-en'")
if __name__=='__main__':unittest.main(verbosity=2)
