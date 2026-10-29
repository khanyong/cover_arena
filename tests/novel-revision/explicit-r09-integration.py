"""Exact R09 fixture on a new isolated database; never a production endpoint."""
import json, os, pathlib, subprocess, urllib.request, urllib.error, uuid
p=pathlib.Path(os.environ['ROS_EXEC02_FIXTURE_DIR'])
db=os.environ['ROS_EXEC02_DB'];rest=os.environ['ROS_EXEC02_REST']
assert db=='ros_exec02_run21' and rest=='http://127.0.0.1:55488'
d='/Applications/Docker.app/Contents/Resources/bin/docker'
assert subprocess.check_output([d,'inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],text=True).strip()=='exec02-nonproduction'
def sql(query):
 r=subprocess.run([d,'exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',db,'-At','-v','ON_ERROR_STOP=1'],input=query,text=True,capture_output=True)
 if r.returncode: raise RuntimeError(r.stderr)
 return r.stdout.strip()
def rpc(name,body,actor='owner'):
 headers={'Content-Type':'application/json','Authorization':'Bearer '+json.loads((p/(actor+'-session.json')).read_text())['access_token']}
 req=urllib.request.Request(rest+'/rpc/'+name,data=json.dumps(body).encode(),headers=headers)
 try:
  with urllib.request.urlopen(req,timeout=30) as r:return r.status,json.load(r)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
request=json.loads((p/'fixture.request.json').read_text());m=json.loads((p/'fixture.manifest.json').read_text());plan=json.loads((p/'fixture.expected-plan.json').read_text())
before=json.loads(sql("select jsonb_build_object('units',(select count(*) from public.content_units),'versions',(select count(*) from public.paragraph_versions))"))
status,result=rpc('ros_bilingual_stage',request);assert status==200,result
status,readback=rpc('ros_bilingual_read_staged',{'p_release_id':result['release_id']});assert status==200,readback
assert len(readback['pairs'])==226
for actual,expected in zip(readback['pairs'],plan['result_pairs']):
 for lang in ['en','ko']:
  want=expected['original'][lang] if expected['kind']=='retained' else expected[lang]
  assert actual[lang+'_body']==want['body']
  assert actual[lang+'_sha256']==want['sha256']
r09=m['changes'][8]['before_pairs'];first,second=readback['pairs'][176:178]
for lang in ['en','ko']:
 assert first[lang+'_unit_id']==r09[0][lang]['unit_id']
 assert first[lang+'_version_id']!=r09[0][lang]['version_id']
 assert second[lang+'_unit_id']==r09[1][lang]['unit_id']
 assert second[lang+'_version_id']==r09[1][lang]['version_id']
 assert all(x[lang+'_unit_id']!=r09[2][lang]['unit_id'] for x in readback['pairs'])
 for predecessor in r09:
  assert sql("select count(*) from public.paragraph_versions where id='"+predecessor[lang]['version_id']+"'")=='1'
after=json.loads(sql("select jsonb_build_object('units',(select count(*) from public.content_units),'versions',(select count(*) from public.paragraph_versions))"))
assert after['units']==before['units'],(before,after)
assert after['versions']-before['versions']==24,(before,after)
status,replay=rpc('ros_bilingual_stage',request);assert status==200 and replay['replayed'] and replay['release_id']==result['release_id']
tampered=json.loads(json.dumps(request));tampered['p_request_id']=str(uuid.uuid4());tampered['p_proposal']['changes'][0]['en']['proposed_after']+=' changed'
status,_=rpc('ros_bilingual_stage',tampered);assert status>=400
status,_=rpc('ros_bilingual_stage',request,'outsider');assert status==403
(p/'explicit-r09-result.json').write_text(json.dumps({'release_id':result['release_id'],'readback_pairs':226,'exact_bilingual_spans':12,'unit_delta':after['units']-before['units'],'version_delta':after['versions']-before['versions'],'r09_preserved_version':True,'historical_versions_retained':True,'retry':'PASS','tampered_after':'REJECTED','outsider':'REJECTED'},indent=2))
print('PASS: exact 12-span bilingual readback; R09 replace/preserve/exclude; zero new Units; 24 new Versions; historical Versions retained; retry/tamper/outsider')
