import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {readDecisions,saveDecision,basisOf} from '../../lib/novel-local-review/decisions.mjs';
test('language-specific immutable decisions, readback, concurrent conflict and source binding',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ros-choice-'));
 const review={manifest:{id:'PRO-C01-S01-r01',baselineId:'fixed',files:{before:'a',after:'b',rows:'c'}},rows:[{id:'R01',changed:true,content:{ko:{before:['전'],after:['후']},en:{before:['before'],after:['after']}}}]};
 const source=JSON.stringify(review);
 try{
  const initial=await readDecisions(review,'author',root);assert.equal(initial.revision,0);
  const input={item:'R01',language:'ko',choice:'before',revision:0,basis:basisOf(review)};
  const results=await Promise.allSettled([saveDecision(review,'author',input,root),saveDecision(review,'author',input,root)]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  const first=await readDecisions(review,'author',root);assert.equal(first.choices['ko:R01'].choice,'before');assert.equal(first.choices['en:R01'].choice,'before');
  await saveDecision(review,'author',{...input,revision:1,choice:'custom',texts:['직접 수정\n내부 줄바꿈']},root);
  assert.deepEqual((await readDecisions(review,'author',root)).choices['ko:R01'].texts,['직접 수정\n내부 줄바꿈']);
  assert.equal((await readDecisions(review,'other',root)).revision,0);
  await assert.rejects(saveDecision(review,'author',{...input,revision:2,choice:'custom',texts:['']},root));
  await assert.rejects(saveDecision(review,'author',{...input,revision:2,item:'B1'},root));
  assert.equal(JSON.stringify(review),source);
  await assert.rejects(readDecisions({...review,manifest:{...review.manifest,files:{after:'changed'}}},'author',root));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('paired edits save atomically and reject invalid or stale pairs without losing either language',async()=>{
 const {saveBilingualDecision}=await import('../../lib/novel-local-review/decisions.mjs');
 const root=await mkdtemp(join(tmpdir(),'ros-paired-'));
 const review={manifest:{id:'PRO-C01-S01-r01',baselineId:'fixed',files:{before:'a',after:'b',rows:'c'}},rows:[{id:'R01',changed:true,content:{ko:{before:['전'],after:['후']},en:{before:['before'],after:['after']}}}]};
 const input={item:'R01',revision:0,basis:basisOf(review),texts:{ko:['수정\n국문'],en:['Edited\nEnglish']}};
 try{
  await assert.rejects(saveBilingualDecision(review,'author',{...input,texts:{ko:['수정'],en:['']}},root));
  assert.equal((await readDecisions(review,'author',root)).revision,0);
  const results=await Promise.allSettled([saveBilingualDecision(review,'author',input,root),saveBilingualDecision(review,'author',input,root)]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  const saved=await readDecisions(review,'author',root);
  assert.equal(saved.revision,1);
  for(const lang of ['ko','en']){assert.deepEqual(saved.choices[`${lang}:R01`].texts,input.texts[lang]);assert.equal(saved.choices[`${lang}:R01`].pairedRevision,1);}
  await assert.rejects(saveBilingualDecision(review,'author',{...input,texts:{ko:['stale'],en:['stale']}},root));
  assert.deepEqual(await readDecisions(review,'author',root),saved);
  await assert.rejects(saveDecision(review,'author',{item:'R01',language:'ko',choice:'before',revision:1,basis:input.basis},root),/EN_CUSTOM_CONFLICT/);
  assert.deepEqual((await readDecisions(review,'author',root)).choices['en:R01'],saved.choices['en:R01']);
  assert.equal((await readDecisions(review,'other',root)).revision,0);
 }finally{await rm(root,{recursive:true,force:true});}
});
