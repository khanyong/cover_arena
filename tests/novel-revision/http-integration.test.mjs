import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR;
const input=JSON.parse(readFileSync(dir+'/fixture.request.json'));
const body={request_id:input.p_request_id,approval_id:input.p_approval_id,proposal:input.p_proposal};
const endpoint='http://127.0.0.1:3003/api/novel-bilingual-stage';
const token=name=>JSON.parse(readFileSync(dir+'/'+name+'-session.json')).access_token;
const send=(name,payload=body)=>fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(name?{Authorization:'Bearer '+token(name)}:{})},body:JSON.stringify(payload)});
test('actual Next HTTP route: method restriction',async()=>assert.equal((await fetch(endpoint)).status,405));
test('actual Next HTTP route: no authentication',async()=>assert.equal((await send(null)).status,401));
test('actual Next HTTP route: valid owner, exact stage replay',async()=>{
 const r=await send('owner');assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);
 const result=await r.json();assert.equal(result.status,'PRIVATE_STAGED');assert.equal(result.replayed,true);
});
test('actual Next HTTP route: real authenticated outsider rejected',async()=>assert.equal((await send('outsider')).status,403));
test('actual Next HTTP route: approved wording tamper rejected',async()=>{
 const p=structuredClone(body);p.proposal.changes[0].en.proposed_after+='!';assert.equal((await send('owner',p)).status,409);
});
test('actual Next HTTP route: naturally expired GoTrue-issued session rejected',async()=>assert.equal((await send('expired')).status,401));
