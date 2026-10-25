"""Populate the already-created isolated run2 DB. No production connection.
Run once. Intentionally fails rather than deleting an existing fixture.
"""
import urllib.request,json,subprocess,pathlib,os
p=pathlib.Path(os.environ['ROS_EXEC02_FIXTURE_DIR']);s=json.loads((p.parent/'local-secrets.json').read_text())
D='/usr/local/bin/docker'
DB=os.environ.get('ROS_EXEC02_DB','ros_exec02_run2')
AUTH=os.environ.get('ROS_EXEC02_AUTH','http://127.0.0.1:55435')
import re
assert re.fullmatch(r'ros_exec02_run[0-9]+',DB) and re.fullmatch(r'http://127\.0\.0\.1:554[0-9]{2}',AUTH)
assert subprocess.check_output([D,'inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],text=True).strip()=='exec02-nonproduction'
def db(raw):
 r=subprocess.run([D,'exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',DB,'-v','ON_ERROR_STOP=1','-At'],input=raw,capture_output=True)
 if r.returncode:raise RuntimeError(r.stderr.decode())
 return r.stdout
# Reuse the image's official auth.uid/jwt implementation after GoTrue initial
# migrations. No request claims or authenticated identities are injected.
helpers=subprocess.check_output([D,'exec','ros-exec02-db','psql','-U','supabase_admin','-d','ros_exec02','-Atc',"select pg_get_functiondef(oid)||';' from pg_proc where pronamespace='auth'::regnamespace and proname in ('uid','jwt','role')"])
db(helpers)
for name in ['owner','outsider']:
 req=urllib.request.Request(AUTH+'/signup',data=json.dumps({'email':name+'@exec02.test','password':s['password']}).encode(),headers={'Content-Type':'application/json'})
 d=json.load(urllib.request.urlopen(req));(p/(name+'-session.json')).write_text(json.dumps(d));(p/(name+'-session.json')).chmod(0o600)
for file in ['tests/novel-revision/fixture-schema.sql','supabase/migrations/20261005123000_ros_ko_block_model_v2_schema.sql','supabase/migrations/20261025072604_ros_bilingual_staged_transaction.sql']:
 db(pathlib.Path(file).read_bytes());print('APPLIED',file)
owner=json.loads((p/'owner-session.json').read_text())['user']['id'];node=os.environ.get('ROS_NODE','node')
subprocess.run([node,'tests/novel-revision/seed-private-fixture.mjs',os.environ['ROS_R01_MANIFEST'],os.environ['ROS_R01_PROPOSAL'],owner,str(p/'fixture')],check=True)
(p/'seed.log').write_bytes(db((p/'fixture.sql').read_bytes()))
subprocess.run([node,'tests/novel-revision/register-private-approval.mjs',str(p/'fixture'),os.environ['ROS_R01_PROPOSAL'],owner],check=True)
db((p/'fixture.approval.sql').read_bytes());print('PRIVATE FIXTURE READY')
