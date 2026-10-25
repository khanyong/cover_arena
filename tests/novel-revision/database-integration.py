"""Actual local GoTrue -> PostgREST -> PostgreSQL tests; no JWT injection.
Requires the specifically labelled disposable ros-exec02-db fixture, populated
by seed-private-fixture.mjs. Never reads a production URL or service-role key.
"""
import json, os, subprocess, unittest, urllib.request, urllib.error, uuid
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
P=Path(os.environ['ROS_EXEC02_FIXTURE_DIR'])
D='/usr/local/bin/docker'
DB=os.environ.get('ROS_EXEC02_DB','ros_exec02')
REST=os.environ.get('ROS_EXEC02_REST','http://127.0.0.1:55434')
import re
assert re.fullmatch(r'ros_exec02(?:_run[0-9]+)?',DB) and re.fullmatch(r'http://127\.0\.0\.1:554[0-9]{2}',REST)
label=subprocess.check_output([D,'inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],text=True).strip()
assert label=='exec02-nonproduction', 'Refuse database outside explicitly isolated test container'

def sql(query):
 r=subprocess.run([D,'exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',DB,'-At','-v','ON_ERROR_STOP=1'],input=query,text=True,capture_output=True)
 if r.returncode: raise RuntimeError(r.stderr)
 return r.stdout.strip()

def rpc(name,body,token='owner'):
 headers={'Content-Type':'application/json'}
 if token: headers['Authorization']='Bearer '+json.loads((P/(token+'-session.json')).read_text())['access_token']
 req=urllib.request.Request(REST+'/rpc/'+name,data=json.dumps(body).encode(),headers=headers)
 try:
  with urllib.request.urlopen(req,timeout=30) as r:return r.status,json.load(r)
 except urllib.error.HTTPError as e:return e.code,json.load(e)

def counts():
 return sql("select jsonb_build_object('units',(select count(*) from public.content_units),'versions',(select count(*) from public.paragraph_versions),'lineage',(select count(*) from public.paragraph_version_lineage),'compositions',(select count(*) from public.ko_scene_composition_revisions),'snapshots',(select count(*) from public.revision_snapshots),'alignments',(select count(*) from public.ko_en_block_alignments),'releases',(select count(*) from ros_bilingual_private.releases),'events',(select count(*) from ros_bilingual_private.events),'requests',(select count(*) from ros_bilingual_private.requests),'public_selection',(select jsonb_agg(to_jsonb(s)) from public.ko_scene_display_selections s),'documents',(select jsonb_agg(to_jsonb(d) order by id) from public.novel_documents d))")

request=json.loads((P/'fixture.request.json').read_text())
plan=json.loads((P/'fixture.expected-plan.json').read_text())
class Integration(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.before=counts()
 def rejected(self,body=None,token='owner',message=None):
  before=counts();status,result=rpc('ros_bilingual_stage',body or request,token)
  self.assertGreaterEqual(status,400,result)
  if message:self.assertIn(message,result.get('message',''))
  self.assertEqual(counts(),before)
 def test_01_unauthenticated(self):self.rejected(token=None)
 def test_02_unauthorized(self):self.rejected(token='outsider',message='BILINGUAL_APPROVAL_ACCESS_DENIED')
 def test_03_after_tampering(self):
  body=json.loads(json.dumps(request));body['p_proposal']['changes'][0]['en']['proposed_after']+='!'
  self.rejected(body,message='APPROVAL_PAYLOAD_MISMATCH')
 def test_04_stale_document_head(self):
  sql("update public.novel_documents set data=jsonb_set(data,'{otherScene}','\"concurrent edit\"') where id='quantum-vibration-novel-en-act-2'")
  try:self.rejected(message='STALE_DOCUMENT')
  finally:sql("update public.novel_documents set data=jsonb_set(data,'{otherScene}','\"preserve me\"') where id='quantum-vibration-novel-en-act-2'")
 def test_05_rollback_after_EN_insert(self):
  sql("""create function public.exec02_test_fail_ko() returns trigger language plpgsql as $$begin
   if new.change_type='merge' and exists(select 1 from public.content_units where id=new.paragraph_unit_id and project_id='955c9b9e-146c-40b0-b57a-655195b11086') then
   raise exception 'TEST_ONLY_AFTER_EN_INSERT';end if;return new;end$$;
   create trigger exec02_test_fail_ko before insert on public.paragraph_versions for each row execute function public.exec02_test_fail_ko();""")
  try:self.rejected(message='TEST_ONLY_AFTER_EN_INSERT')
  finally:sql('drop trigger exec02_test_fail_ko on public.paragraph_versions; drop function public.exec02_test_fail_ko();')
 def test_06_success_and_bilingual_readback(self):
  status,result=rpc('ros_bilingual_stage',request);self.assertEqual(status,200,result)
  self.assertFalse(result['replayed']);self.assertEqual(result['status'],'PRIVATE_STAGED')
  type(self).release=result['release_id']
  status,r=rpc('ros_bilingual_read_staged',{'p_release_id':self.release});self.assertEqual(status,200,r)
  self.assertEqual(len(r['pairs']),67)
  for actual,expected in zip(r['pairs'],plan['result_pairs']):
   for l in ['en','ko']:
    original=expected['original'][l] if expected['kind']=='retained' else expected[l]
    self.assertEqual(actual[l+'_body'],original['body'])
    if expected['kind']=='retained':
     self.assertEqual(actual[l+'_unit_id'],original['unit_id']);self.assertEqual(actual[l+'_version_id'],original['version_id'])
  before=json.loads(self.before);after=json.loads(counts())
  self.assertEqual(after['versions']-before['versions'],22);self.assertEqual(after['units']-before['units'],22)
  self.assertEqual(after['public_selection'],before['public_selection']);self.assertEqual(after['documents'],before['documents'])
  (P/'readback.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
 def test_07_lost_response_replay(self):
  # A successful commit occurred above. Discard that response and resend the
  # exact request as a client would after losing its acknowledgement.
  before=counts();status,r=rpc('ros_bilingual_stage',request)
  self.assertEqual(status,200,r);self.assertTrue(r['replayed']);self.assertEqual(r['release_id'],self.release);self.assertEqual(counts(),before)
 def test_08_same_key_different_payload(self):
  body=json.loads(json.dumps(request));body['p_baseline_digest']='0'*64
  self.rejected(body,message='APPROVAL_PAYLOAD_MISMATCH')
 def test_09_concurrent_retries(self):
  before=counts()
  with ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(lambda _:rpc('ros_bilingual_stage',request),range(2)))
  for status,r in results:self.assertEqual(status,200,r);self.assertEqual(r['release_id'],self.release)
  self.assertEqual(counts(),before)
 def test_10_private_history_is_not_writable(self):
  status,r=rpc('ros_bilingual_read_staged',{'p_release_id':self.release},'outsider');self.assertGreaterEqual(status,400)
  grants=sql("select count(*) from information_schema.role_table_grants where table_schema='ros_bilingual_private' and grantee in ('anon','authenticated','PUBLIC')")
  self.assertEqual(grants,'0')

 def test_11_private_joint_restore_and_replay(self):
  before=json.loads(counts())
  restore={'p_request_id':str(uuid.uuid4()),'p_release_id':self.release,'p_expected_generation':99}
  status,r=rpc('ros_bilingual_restore_staged',restore);self.assertEqual(status,409,r)
  restore['p_expected_generation']=1
  status,r=rpc('ros_bilingual_restore_staged',restore);self.assertEqual(status,200,r);self.assertTrue(r['restored'])
  self.assertEqual(sql("select (release_id is null)::text||':'||generation from ros_bilingual_private.selections"),'true:2')
  after=json.loads(counts());self.assertEqual(after['versions'],before['versions']);self.assertEqual(after['public_selection'],before['public_selection']);self.assertEqual(after['documents'],before['documents'])
  status,r=rpc('ros_bilingual_restore_staged',restore);self.assertEqual(status,200,r);self.assertTrue(r['replayed'])
  self.assertEqual(json.loads(counts()),after)
  status,r=rpc('ros_bilingual_read_staged',{'p_release_id':self.release});self.assertEqual(status,200,r);self.assertEqual(len(r['pairs']),67)

if __name__=='__main__':unittest.main(verbosity=2)
