"""Start one fresh run in the labelled local test container; never delete data.
The initial ros-exec02-db Docker container and ros-exec02-test network must exist.
No production credentials or URLs are accepted. Secrets live outside the repo.
"""
import os,json,subprocess,re,pathlib
D='/usr/local/bin/docker';DB=os.environ['ROS_EXEC02_DB'];AUTH=os.environ['ROS_EXEC02_AUTH'];REST=os.environ['ROS_EXEC02_REST'];P=pathlib.Path(os.environ['ROS_EXEC02_FIXTURE_DIR'])
assert re.fullmatch(r'ros_exec02_run[0-9]+',DB)
assert all(re.fullmatch(r'http://127\.0\.0\.1:554[0-9]{2}',u) for u in [AUTH,REST])
assert subprocess.check_output([D,'inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],text=True).strip()=='exec02-nonproduction'
s=json.loads((P.parent/'local-secrets.json').read_text());P.mkdir(exist_ok=True)
def sql(q,db):
 r=subprocess.run([D,'exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',db,'-At','-v','ON_ERROR_STOP=1'],input=q,text=True,capture_output=True)
 if r.returncode:raise RuntimeError(r.stderr)
 return r.stdout
sql('CREATE DATABASE '+DB+';','postgres')
sql('create schema auth authorization supabase_auth_admin; create schema extensions; grant usage on schema auth to anon,authenticated; ',DB)
for suffix,image,port,env in [
 ('auth','public.ecr.aws/supabase/gotrue:v2.196.0',AUTH.split(':')[-1]+':9999',{
 'GOTRUE_API_HOST':'0.0.0.0','GOTRUE_API_PORT':'9999','API_EXTERNAL_URL':AUTH,'GOTRUE_SITE_URL':AUTH,'GOTRUE_DB_DRIVER':'postgres','GOTRUE_DB_DATABASE_URL':'postgres://supabase_auth_admin:'+s['password']+'@ros-exec02-db:5432/'+DB,'GOTRUE_JWT_SECRET':s['jwt'],'GOTRUE_JWT_EXP':'3600','GOTRUE_JWT_AUD':'authenticated','GOTRUE_JWT_DEFAULT_GROUP_NAME':'authenticated','GOTRUE_MAILER_AUTOCONFIRM':'true','GOTRUE_DISABLE_SIGNUP':'false'}),
 ('rest','public.ecr.aws/supabase/postgrest:v12.2.11',REST.split(':')[-1]+':3000',{
 'PGRST_DB_URI':'postgres://authenticator:'+s['password']+'@ros-exec02-db:5432/'+DB,'PGRST_DB_SCHEMAS':'public','PGRST_DB_ANON_ROLE':'anon','PGRST_JWT_SECRET':s['jwt']})]:
 args=[D,'run','-d','--name',DB+'-'+suffix,'--network','ros-exec02-test','--label','ros.scope=exec02-nonproduction','-p','127.0.0.1:'+port]
 for k,v in env.items():args+=['-e',k+'='+v]
 subprocess.run(args+[image],check=True)
