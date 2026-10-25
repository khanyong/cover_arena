import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {revisionComparisonRows} from '../../shared/lib/novelRevisionComparison.mjs';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR;
const secret=JSON.parse(readFileSync(dir+'/../local-secrets.json'));
const login=async who=>{const r=await fetch('http://127.0.0.1:55463/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:who+'@exec02.test',password:secret.password})});assert.equal(r.status,200);return (await r.json()).access_token;};
const call=async(token,scene='13a795ae-456e-4623-9714-b302c9db9585')=>fetch('http://127.0.0.1:55464/rpc/ros_bilingual_revision_history',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify({p_managed_scene_id:scene})});
test('historical before/after survives restore, groups merges and preserves both complete texts',async()=>{
 const r=await call(await login('owner'));assert.equal(r.status,200);const history=await r.json();assert.equal(history.length,1);assert.equal(history[0].current,false);
 for(const lang of ['en','ko']){
  const rows=revisionComparisonRows(history[0],lang);assert.equal(rows.length,63);assert.equal(rows.filter(r=>r.changed).length,7);
  assert.deepEqual(rows.filter(r=>r.changed).map(r=>[r.before.length,r.after.length]),[[5,3],[3,1],[2,1],[3,2],[1,1],[8,2],[1,1]]);
  for(const side of ['before','after'])assert.deepEqual(rows.flatMap(r=>r[side]),history[0][side][lang].map(p=>p.versions[p.activeVersion].content));
 }
 const broken=structuredClone(history[0]);broken.groups[0].before_positions[1]=80;
 assert.throws(()=>revisionComparisonRows(broken,'en'));
});
test('anonymous, unrelated actor and wrong scene cannot read private history',async()=>{
 assert.equal((await call(null)).status,401);
 assert.equal((await call(await login('outsider'))).status,403);
 assert.equal((await call(await login('owner'),'00000000-0000-4000-8000-000000000099')).status,403);
});
