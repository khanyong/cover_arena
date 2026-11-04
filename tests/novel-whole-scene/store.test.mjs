import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {readWhole,changeWhole} from '../../lib/novel-whole-scene/store.mjs';import {sha} from '../../lib/novel-local-review/store.mjs';
test('whole manuscripts: independent languages, idempotency, stale writes and no implicit adoption',async()=>{
 const root=await mkdtemp(join(tmpdir(),'whole-'));const scene='A0-C02-S02',user='test-author';
 try{
 const texts={ko:'국문 하나\n\n둘\n',en:'One.'};const input={action:'register',family:'FUNERAL-D1',texts,hashes:{ko:sha(texts.ko),en:sha(texts.en)},revision:0};
 let s=await changeWhole(scene,user,input,root);assert.equal(s.decisions.length,0);assert.equal(s.versions[0].text,texts.ko);assert.equal(s.sets[0].alignmentStatus,'UNALIGNED');
 assert.deepEqual(await changeWhole(scene,user,{...input,revision:1},root),s);
 const pair=s.sets[0];s=await changeWhole(scene,user,{action:'decide',revision:1,setId:pair.id,language:'ko',decision:'adopt-whole',sha256:sha(texts.ko),note:''},root);
 assert.equal(s.decisions.length,1);assert.equal(s.decisions[0].language,'ko');
 const en='Changed English.';s=await changeWhole(scene,user,{...input,revision:2,texts:{...texts,en},hashes:{ko:sha(texts.ko),en:sha(en)}},root);
 assert.equal(s.versions.length,3);assert.equal(s.sets[1].ko,pair.ko);assert.equal(s.decisions.length,1);
 const decision={action:'decide',revision:3,setId:s.sets[1].id,language:'en',decision:'request-revision',sha256:sha(en),note:'revise'};
 const concurrent=await Promise.allSettled([changeWhole(scene,user,decision,root),changeWhole(scene,user,decision,root)]);assert.equal(concurrent.filter(r=>r.status==='fulfilled').length,1);
 await assert.rejects(changeWhole(scene,user,{...input,revision:0},root),/REVISION_CONFLICT/);
 assert.equal((await readWhole(scene,'other-user',root)).versions.length,0);
 assert.equal((await readWhole(scene,user,root)).revision,4);
 }finally{await rm(root,{recursive:true,force:true});}
});
