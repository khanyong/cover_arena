"""Exact adopted-text acceptance in isolated GoTrue/PostgREST/Postgres only."""
import importlib.util,pathlib,json,unittest,uuid,copy
from concurrent.futures import ThreadPoolExecutor
spec=importlib.util.spec_from_file_location('dbtest',pathlib.Path(__file__).with_name('database-integration.py'))
d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
class FinalAdoption(unittest.TestCase):
 def test_01_registration_permissions_and_digest(self):
  body={'p_package_id':d.request['p_approval_id'],'p_proposal':d.request['p_proposal'],'p_approval_digest':d.plan['approval_digest']}
  for actor in [None,'outsider','reader','owner']:
   status,context=d.rpc('ros_bilingual_final_approval_context',{'p_package_id':body['p_package_id']},actor)
   if actor=='owner':
    self.assertEqual(status,200,context);self.assertEqual(context['proposal'],body['p_proposal']);self.assertEqual(context['approval_digest'],body['p_approval_digest'])
   else:self.assertGreaterEqual(status,400)
  for actor in [None,'outsider','reader']:
   status,r=d.rpc('ros_bilingual_register_final_approval',body,actor);self.assertGreaterEqual(status,400)
  for variant in ['word','scope','digest']:
   changed=copy.deepcopy(body)
   if variant=='word':changed['p_proposal']['changes'][0]['en']['proposed_after']+=' changed'
   if variant=='scope':changed['p_proposal']['scope']['managed_scene_id']=str(uuid.uuid4())
   if variant=='digest':changed['p_approval_digest']='0'*64
   status,r=d.rpc('ros_bilingual_register_final_approval',changed);self.assertEqual(status,409,r)
  self.assertEqual(d.sql('select count(*) from ros_bilingual_private.approvals'),'0')
  bad_id=str(uuid.uuid4());wrong_anchor=str(uuid.uuid4())
  d.sql("insert into ros_bilingual_private.final_adoption_packages(id,instruction_id,instruction_received_at,package) select '"+bad_id+"',instruction_id,instruction_received_at,jsonb_set(package,'{baseline,ordered_alignment,0,alignment_en_version_id}',to_jsonb('"+wrong_anchor+"'::text)) from ros_bilingual_private.final_adoption_packages where id='"+body['p_package_id']+"'")
  status,r=d.rpc('ros_bilingual_register_final_approval',dict(body,p_package_id=bad_id));self.assertEqual(status,409,r);self.assertIn('STALE_BILINGUAL_BLOCK',r['message'])
  status,r=d.rpc('ros_bilingual_register_final_approval',body);self.assertEqual(status,200,r)
  status,r=d.rpc('ros_bilingual_register_final_approval',body);self.assertEqual(status,200,r);self.assertTrue(r['replayed'])
 def test_02_selected_version_and_historical_anchor_are_distinct(self):
  row=next(p['original'] for p in d.plan['result_pairs'] if p['kind']=='retained' and p['original'].get('alignment_en_version_id')!=p['original']['en']['version_id'])
  # Existing alignments are immutable in production. A baseline with altered
  # pinned anchor is rejected at registration, rather than mutating that row.
  body={'p_package_id':d.request['p_approval_id'],'p_proposal':copy.deepcopy(d.request['p_proposal']),'p_approval_digest':d.plan['approval_digest']}
  body['p_proposal']['scope']['alignment_hash']='0'*64
  status,r=d.rpc('ros_bilingual_register_final_approval',body);self.assertEqual(status,409,r)
  self.assertNotEqual(row['alignment_en_version_id'],row['en']['version_id'])
 def test_03_failure_after_en_split_rolls_back(self):
  before=d.counts()
  d.sql("""create function public.final_test_fail_ko() returns trigger language plpgsql as $$begin
  if new.change_type='split' and exists(select 1 from public.content_units where id=new.paragraph_unit_id and project_id='955c9b9e-146c-40b0-b57a-655195b11086') then raise exception 'TEST_ONLY_KO_SPLIT';end if;return new;end$$;
  create trigger final_test_fail_ko before insert on public.paragraph_versions for each row execute function public.final_test_fail_ko();""")
  try:
   status,r=d.rpc('ros_bilingual_stage',d.request);self.assertGreaterEqual(status,400,r);self.assertIn('TEST_ONLY_KO_SPLIT',r['message']);self.assertEqual(d.counts(),before)
  finally:d.sql('drop trigger final_test_fail_ko on public.paragraph_versions;drop function public.final_test_fail_ko();')
 def test_04_joint_stage_exact_readback_and_lineage(self):
  before=json.loads(d.counts())
  with ThreadPoolExecutor(max_workers=3) as pool: results=list(pool.map(lambda _:d.rpc('ros_bilingual_stage',dict(d.request,p_request_id=str(uuid.uuid4()))),range(3)))
  for status,r in results:self.assertEqual(status,200,r)
  self.assertEqual(len({r['release_id'] for _,r in results}),1)
  release=results[0][1]['release_id'];status,read=d.rpc('ros_bilingual_read_staged',{'p_release_id':release});self.assertEqual(status,200,read)
  self.assertEqual(len(read['pairs']),72)
  for actual,expected in zip(read['pairs'],d.plan['result_pairs']):
   for lang in ['en','ko']:
    value=expected['original'][lang] if expected['kind']=='retained' else expected[lang]
    self.assertEqual(actual[lang+'_body'],value['body']);self.assertEqual(actual[lang+'_sha256'],value['sha256'])
    if expected['kind']=='retained':
     self.assertEqual(actual[lang+'_unit_id'],value['unit_id']);self.assertEqual(actual[lang+'_version_id'],value['version_id'])
    else:
     lineage=next(l for l in d.plan['lineage'] if l['change_key']==expected['change_key']);parent=lineage['predecessor_pairs'][expected['predecessor_indexes'][0]]
     if expected['operation']=='replace':self.assertEqual(actual[lang+'_unit_id'],parent[lang+'_unit_id'])
     else:self.assertNotEqual(actual[lang+'_unit_id'],parent[lang+'_unit_id'])
     self.assertEqual(d.sql("select relation_type from public.paragraph_version_lineage where child_version_id='"+actual[lang+'_version_id']+"' and parent_version_id='"+parent[lang+'_version_id']+"'"),'split_from' if expected['operation']=='split' else 'rewritten_from')
  after=json.loads(d.counts());self.assertEqual(after['units']-before['units'],16);self.assertEqual(after['versions']-before['versions'],24)
  self.assertEqual(after['documents'],before['documents']);self.assertEqual(after['public_selection'],before['public_selection'])
  (d.P/'readback.json').write_text(json.dumps(read))
 def test_05_private_access_and_replay(self):
  read=json.loads((d.P/'readback.json').read_text());before=d.counts()
  status,r=d.rpc('ros_bilingual_read_staged',{'p_release_id':read['release_id']},'outsider');self.assertGreaterEqual(status,400)
  status,r=d.rpc('ros_bilingual_stage',d.request);self.assertEqual(status,200,r);self.assertTrue(r['replayed'])
  status,r=d.rpc('ros_bilingual_stage',d.request);self.assertEqual(status,200,r);self.assertTrue(r['replayed'])
  self.assertEqual(d.sql('select count(*) from ros_bilingual_private.releases'),'1')
if __name__=='__main__':unittest.main(verbosity=2)
