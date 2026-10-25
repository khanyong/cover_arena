import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadBilingualBookCapture} from '../../lib/novel-book/loadBilingualBookCapture.mjs';
const base=process.env.ROS_EXEC02_REST;
assert.match(base,/^http:\/\/127\.0\.0\.1:554\d\d$/);
const token=JSON.parse(readFileSync(process.env.ROS_EXEC02_FIXTURE_DIR+'/reader-session.json')).access_token;
const rpc=async(name,args={})=>{const r=await fetch(base+'/rpc/'+name,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(args)});const data=await r.json();return r.ok?{data,error:null}:{data:null,error:data};};
test('inactive historical ACT is retained in capture but excluded from both book compositions',async()=>{
 const m=await rpc('ros_bilingual_capture_book');assert.equal(m.error,null);assert.ok(m.data.documents.some(d=>d.slug==='quantum-vibration-novel-act-0'));
 const result=await loadBilingualBookCapture({rpc});
 for(const language of ['EN','KO'])assert.equal(result.books[language].counts.paragraphs,79);
});
