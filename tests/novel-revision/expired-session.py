"""Issue a real short-lived GoTrue session in the isolated DB; never forge JWTs."""
import os,json,pathlib,subprocess,urllib.request,time
p=pathlib.Path(os.environ['ROS_EXEC02_FIXTURE_DIR']);s=json.loads((p.parent/'local-secrets.json').read_text())
D='/usr/local/bin/docker';DB=os.environ['ROS_EXEC02_DB']
assert DB=='ros_exec02_run6'
assert subprocess.check_output([D,'inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],text=True).strip()=='exec02-nonproduction'
env={'GOTRUE_API_HOST':'0.0.0.0','GOTRUE_API_PORT':'9999','API_EXTERNAL_URL':'http://127.0.0.1:55455','GOTRUE_SITE_URL':'http://127.0.0.1:55455','GOTRUE_DB_DRIVER':'postgres','GOTRUE_DB_DATABASE_URL':'postgres://supabase_auth_admin:'+s['password']+'@ros-exec02-db:5432/'+DB,'GOTRUE_JWT_SECRET':s['jwt'],'GOTRUE_JWT_EXP':'1','GOTRUE_JWT_AUD':'authenticated','GOTRUE_JWT_DEFAULT_GROUP_NAME':'authenticated','GOTRUE_MAILER_AUTOCONFIRM':'true'}
args=[D,'run','-d','--name','ros_exec02_run6-shortauth','--network','ros-exec02-test','--label','ros.scope=exec02-nonproduction','-p','127.0.0.1:55455:9999']
for k,v in env.items():args+=['-e',k+'='+v]
subprocess.run(args+['public.ecr.aws/supabase/gotrue:v2.196.0'],check=True,capture_output=True)
for attempt in range(20):
 try:urllib.request.urlopen('http://127.0.0.1:55455/health',timeout=1);break
 except Exception:time.sleep(.25)
req=urllib.request.Request('http://127.0.0.1:55455/token?grant_type=password',data=json.dumps({'email':'owner@exec02.test','password':s['password']}).encode(),headers={'Content-Type':'application/json'})
r=json.load(urllib.request.urlopen(req));assert r['expires_in']<=5,r['expires_in'];(p/'expired-session.json').write_text(json.dumps(r));(p/'expired-session.json').chmod(0o600)
time.sleep(r['expires_in']+2)
request=json.loads((p/'fixture.request.json').read_text());body={'request_id':request['p_request_id'],'approval_id':request['p_approval_id'],'proposal':request['p_proposal']}
req=urllib.request.Request('http://127.0.0.1:3003/api/novel-bilingual-stage',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','Authorization':'Bearer '+r['access_token']})
try:response=urllib.request.urlopen(req);raise AssertionError(response.status)
except urllib.error.HTTPError as e:assert e.code==401,e.code
print('PASS: actual GoTrue-issued expired token rejected by actual Next HTTP API (401)')
