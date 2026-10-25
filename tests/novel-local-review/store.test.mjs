import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {sha,immutable,buildDraft,readReview,safeId,localRequest} from '../../lib/novel-local-review/store.mjs';
import {listReadingOrder} from '../../lib/novel-local-review/store.mjs';
const baseline=[{position:1,en_body:'Alpha',ko_body:'가'},{position:2,en_body:'Beta',ko_body:'나'},{position:3,en_body:'Gamma',ko_body:'다'}];
test('reading plan does not claim missing revisions are loaded or expose them to another user',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ros-order-'));try{
  const scenes=[{id:'PRO-C01-S01-r01',scene:'first',readerPath:'https://external.invalid'},{id:'PRO-C02-S01-r01',scene:'second'}];
  await writeFile(join(root,'reading-order.json'),JSON.stringify({allowedUserIds:['author'],scenes}));
  const reviews=[{id:'PRO-C02-S01-r01',scene:'second'},{id:'PRO-C02-S01-r02',scene:'second'}];
  const order=await listReadingOrder('author',reviews,root);
  assert.equal(order[0].loaded,false);assert.equal(order[0].status,'LOCAL_REVIEW_MISSING');assert.equal(order[0].readerPath,undefined);
  assert.deepEqual(order.slice(1),reviews);assert.deepEqual(await listReadingOrder('other',[],root),[]);
 }finally{await rm(root,{recursive:true,force:true});}
});
const lang=(before,after)=>({start_position:1,end_position:2,official_before:before,full_after:after,after_block_hashes:after.map(sha)});
const report=()=>({status:'MAPPED_DRAFT_NOT_APPROVED',changes:[{id:'R01',title:'merge',languages:{en:lang(['Alpha','Beta'],['Combined']),ko:lang(['가','나'],['합침'])}}]});
test('merges retain provenance and untouched context',()=>{const r=buildDraft(report(),baseline);assert.equal(r.before.length,3);assert.equal(r.after.length,2);assert.deepEqual(r.after[0].sourcePositions,[1,2]);assert.equal(r.after[1].en,'Gamma');assert.equal(r.rows[0].content.en.before.length,2);});
test('stale source and modified proposal rejected',()=>{const r=report();r.changes[0].languages.en.full_after[0]='altered';assert.throws(()=>buildDraft(r,baseline),/HASH/);assert.throws(()=>buildDraft(report(),[{...baseline[0],en_body:'stale'},...baseline.slice(1)]),/CONFLICT/);});
test('path traversal rejected',()=>assert.throws(()=>safeId('../secret'),/INVALID/));
test('Act zero review IDs are accepted without accepting arbitrary directory names',()=>{
 assert.equal(safeId('A0-C01-S01-r01'),'A0-C01-S01-r01');
 for(const id of ['A0-C01-S01-r01/..','A0-C1-S01-r01','OTHER-C01-S01-r01'])assert.throws(()=>safeId(id),/INVALID/);
});
test('production and external network requests rejected',()=>{const old=process.env.NODE_ENV;process.env.NODE_ENV='production';assert.equal(localRequest({socket:{remoteAddress:'127.0.0.1'},headers:{host:'localhost:3000'}}),false);process.env.NODE_ENV='development';assert.equal(localRequest({socket:{remoteAddress:'10.0.0.1'},headers:{host:'localhost:3000'}}),false);assert.equal(localRequest({socket:{remoteAddress:'127.0.0.1'},headers:{host:'evil.example'}}),false);process.env.NODE_ENV=old;});
test('immutable retry, restart read, wrong user and corruption',async()=>{const root=await mkdtemp(join(tmpdir(),'ros-review-'));try{const id='PRO-C02-S02-r01',dir=join(root,id);await mkdir(dir);const payload=buildDraft(report(),baseline),files={};for(const name of ['before','after','rows']){const raw=JSON.stringify(payload[name]);files[name]=sha(raw);await immutable(join(dir,name+'.json'),raw);await immutable(join(dir,name+'.json'),raw);}await writeFile(join(dir,'manifest.json'),JSON.stringify({id,allowedUserIds:['author'],files}));assert.equal((await readReview(id,'author',root)).after[0].en,'Combined');await assert.rejects(readReview(id,'reader',root),/DENIED/);await assert.rejects(immutable(join(dir,'after.json'),'different'),/IMMUTABLE/);await writeFile(join(dir,'after.json'),'[]');await assert.rejects(readReview(id,'author',root),/INTEGRITY/);}finally{await rm(root,{recursive:true,force:true});}});

test('catalog filters users, separates scenes and comments persist',async()=>{
 const {listReviews,addComment,readComments}=await import('../../lib/novel-local-review/store.mjs');
 const root=await mkdtemp(join(tmpdir(),'ros-catalog-'));try{
  for(const id of ['PRO-C02-S02-r01','PRO-C03-S01-r01','A0-C01-S01-r01']){
   const dir=join(root,id);await mkdir(dir);const payload=buildDraft(report(),baseline),files={};
   for(const name of ['before','after','rows']){const raw=JSON.stringify(payload[name]);files[name]=sha(raw);await immutable(join(dir,name+'.json'),raw);}
   await writeFile(join(dir,'manifest.json'),JSON.stringify({id,scene:id.slice(0,11),baselineId:'fixed',title:id,allowedUserIds:['author'],files}));
  }
  assert.equal((await listReviews('author',root)).length,3);assert.deepEqual(await listReviews('reader',root),[]);
  assert.equal((await readReview('A0-C01-S01-r01','author',root)).after[0].en,'Combined');
  const r=await readReview('PRO-C02-S02-r01','author',root);await addComment(r,'author',{item:'R01',text:'storage test'},root);
  assert.equal((await readComments(r.manifest.id,root))[0].baseline,'fixed');assert.equal((await readComments('PRO-C03-S01-r01',root)).length,0);
  await assert.rejects(readReview('PRO-C03-S02-r01','author',root),{code:'ENOENT'});
 }finally{await rm(root,{recursive:true,force:true});}
});
