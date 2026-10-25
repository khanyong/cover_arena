"""Populate the already-created isolated run2 DB. No production connection.
Run once. Intentionally fails rather than deleting an existing fixture.
"""
import urllib.request,json,subprocess,pathlib,os,hashlib,time
p=pathlib.Path(os.environ['ROS_EXEC02_FIXTURE_DIR']);s=json.loads((p.parent/'local-secrets.json').read_text())
D='/usr/local/bin/docker'
DB=os.environ.get('ROS_EXEC02_DB','ros_exec02_run2')
AUTH=os.environ.get('ROS_EXEC02_AUTH','http://127.0.0.1:55435')
import re
assert re.fullmatch(r'ros_exec02_run[0-9]+',DB) and re.fullmatch(r'http://127\.0\.0\.1:554[0-9]{2}',AUTH)
assert subprocess.check_output([D,'inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],text=True).strip()=='exec02-nonproduction'
for attempt in range(30):
 try:
  with urllib.request.urlopen(AUTH+'/health',timeout=2) as health:
   if health.status==200:break
 except (OSError,ConnectionError):pass
 time.sleep(.25)
else:raise RuntimeError('Isolated GoTrue health check failed')
def db(raw):
 r=subprocess.run([D,'exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',DB,'-v','ON_ERROR_STOP=1','-At'],input=raw,capture_output=True)
 if r.returncode:raise RuntimeError(r.stderr.decode())
 return r.stdout
# Reuse the image's official auth.uid/jwt implementation after GoTrue initial
# migrations. No request claims or authenticated identities are injected.
helpers=subprocess.check_output([D,'exec','ros-exec02-db','psql','-U','supabase_admin','-d','ros_exec02','-Atc',"select pg_get_functiondef(oid)||';' from pg_proc where pronamespace='auth'::regnamespace and proname in ('uid','jwt','role')"])
db(helpers)
for name in ['owner','outsider','reader']:
 req=urllib.request.Request(AUTH+'/signup',data=json.dumps({'email':name+'@exec02.test','password':s['password']}).encode(),headers={'Content-Type':'application/json'})
 d=json.load(urllib.request.urlopen(req));(p/(name+'-session.json')).write_text(json.dumps(d));(p/(name+'-session.json')).chmod(0o600)
files=['tests/novel-revision/fixture-schema.sql','supabase/migrations/20261005123000_ros_ko_block_model_v2_schema.sql','supabase/migrations/20261005123100_ros_ko_block_model_v2_api.sql','supabase/migrations/20261025072604_ros_bilingual_staged_transaction.sql','supabase/migrations/20261025074724_ros_bilingual_rewrite_identity.sql','supabase/migrations/20261025074937_ros_bilingual_publication.sql','tests/novel-revision/reader-policy-fixture.sql','tests/novel-revision/production-read-policy-fixture.sql','supabase/migrations/20261025082926_ros_bilingual_revision_comparison.sql','supabase/migrations/20261025084610_ros_bilingual_existing_project_authority.sql','supabase/migrations/20261025090237_ros_bilingual_private_version_read_guard.sql','supabase/migrations/20261025094740_ros_bilingual_scoped_self_restore.sql','supabase/migrations/20261025100010_ros_bilingual_bounded_transaction_timeout.sql','supabase/migrations/20261025100854_ros_bilingual_capture_evaluate_once.sql','supabase/migrations/20261025101605_ros_bilingual_manifest_capture.sql','supabase/migrations/20261025101711_ros_bilingual_republish_restored.sql','supabase/migrations/20261025110509_ros_bilingual_second_scene.sql']
applied=[]
for file in files:
 raw=pathlib.Path(file).read_bytes();db(raw);print('APPLIED',file)
 applied.append({'path':file,'sha256':hashlib.sha256(raw).hexdigest()})
(p/'applied-files.json').write_text(json.dumps(applied,indent=2))
owner=json.loads((p/'owner-session.json').read_text())['user']['id'];node=os.environ.get('ROS_NODE','node')
subprocess.run([node,'tests/novel-revision/seed-private-fixture.mjs',os.environ['ROS_R01_MANIFEST'],os.environ['ROS_R01_PROPOSAL'],owner,str(p/'fixture'),json.loads((p/'outsider-session.json').read_text())['user']['id'] if os.environ.get('ROS_EXEC02_DELEGATED')=='1' else owner],check=True)
(p/'seed.log').write_bytes(db((p/'fixture.sql').read_bytes()))
subprocess.run([node,'tests/novel-revision/register-private-approval.mjs',str(p/'fixture'),os.environ['ROS_R01_PROPOSAL'],owner],check=True)
db((p/'fixture.approval.sql').read_bytes())
reader=json.loads((p/'reader-session.json').read_text())['user']['id']
db(("insert into ros_ko_private.ko_scene_authorizations(actor_id,document_id,scene_id,can_read,can_rewrite,can_migrate,can_restore) select '"+reader+"',document_id,scene_id,true,false,false,false from public.ko_managed_scenes; update public.revision_projects set owner_id=null where id='707e3ae1-0817-467a-bb42-5401c646151e';").encode())
print('PRIVATE FIXTURE READY')
