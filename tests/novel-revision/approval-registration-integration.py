"""Real Auth/REST registration test against the designated fresh package fixture."""
import os,json,pathlib,urllib.request,urllib.error,uuid,threading
from concurrent.futures import ThreadPoolExecutor
p=pathlib.Path(os.environ['ROS_EXEC02_FIXTURE_DIR']);rest=os.environ['ROS_EXEC02_REST']
assert os.environ['ROS_EXEC02_DB']=='ros_exec02_run22' and rest=='http://127.0.0.1:55490'
request=json.loads((p/'fixture.request.json').read_text());plan=json.loads((p/'fixture.expected-plan.json').read_text())
body={'p_package_id':request['p_approval_id'],'p_proposal':request['p_proposal'],'p_approval_digest':plan['approval_digest']}
def call(name,payload,actor='owner'):
 headers={'Content-Type':'application/json'}
 if actor:headers['Authorization']='Bearer '+json.loads((p/(actor+'-session.json')).read_text())['access_token']
 req=urllib.request.Request(rest+'/rpc/'+name,data=json.dumps(payload).encode(),headers=headers)
 try:
  with urllib.request.urlopen(req,timeout=30) as r:return r.status,json.load(r)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
register=lambda payload,actor='owner':call('ros_bilingual_register_approval',payload,actor)
assert call('ros_bilingual_stage',request)[0]==403 # no approval yet
assert register(body,None)[0] in [401,403]
assert register(body,'outsider')[0]==403
assert register({**body,'p_package_id':str(uuid.uuid4())})[0]==403
assert register({**body,'p_approval_digest':'0'*64})[0]==409
changed=json.loads(json.dumps(body));changed['p_proposal']['changes'][0]['en']['proposed_after']+=' word'
assert register(changed)[0]==409
outside=json.loads(json.dumps(body));outside['p_proposal']['proposal_id']='ROS-STYLE-A1-C04-S02-r01'
assert register(outside)[0]==409
barrier=threading.Barrier(4)
def concurrent(_):barrier.wait();return register(body)
with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(concurrent,range(4)))
assert all(status==200 for status,_ in results),results
assert len({result['approval_id'] for _,result in results})==1
assert sum(not result['replayed'] for _,result in results)==1
status,staged=call('ros_bilingual_stage',request);assert status==200,staged
(p/'registration-result.json').write_text(json.dumps({'cases':8,'concurrent_results':results,'staged':staged,'scope':'NONPRODUCTION A1-C02-S01 ONLY'},indent=2))
print('PASS: missing approval, anonymous, outsider, unknown package, digest mismatch, one-word AFTER, out-of-scope, first concurrent registration; authenticated stage succeeds')
