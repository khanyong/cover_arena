import {test} from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {readDecisions,saveDecision} from '../../lib/novel-local-review/decisions.mjs';
import {candidate,finalize,ROUND} from '../../lib/novel-local-review/finalVersions.mjs';
import {composeEdition,masterText,outputArtifact} from '../../lib/novel-local-review/editions.mjs';
const review={manifest:{id:'PRO-C01-S01-r01',baselineId:'fixed',managedSceneId:'managed',koCompositionId:'composition',enSnapshotId:'snapshot',files:{before:'a',after:'b',rows:'c'}},rows:[{id:'R01',changed:true,content:{ko:{before:['전1','전2'],after:['후']},en:{before:['old1','old2'],after:['new']}}},{id:'B3',changed:false,content:{ko:{before:['보존'],after:['보존']},en:{before:['keep'],after:['keep']}}}]};
test('exact full-text confirmation, separate languages, stale rejection, preserved adoption and immutable history',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ros-final-'));const user='author';try{
  let state=await readDecisions(review,user,root);
  assert.deepEqual(candidate(review,state,'ko').paragraphs,['후','보존']);
  const apply=async extra=>{state=await finalize(review,user,{revision:state.revision,basis:state.basis,...extra},root);};
  await assert.rejects(apply({action:'confirm-language',language:'ko',contentHash:'wrong'}));
  await apply({action:'confirm-language',language:'ko',...candidate(review,state,'ko')});
  await assert.rejects(apply({action:'adopt-bilingual',correspondenceReviewed:true}));
  await apply({action:'confirm-language',language:'en',...candidate(review,state,'en')});
  await apply({action:'adopt-bilingual',enId:state.confirmed.en.id,koId:state.confirmed.ko.id,correspondenceReviewed:true});
  const old=state.adopted;
  state=await saveDecision(review,user,{revision:state.revision,basis:state.basis,item:'R01',language:'ko',choice:'before'},root);
  assert.deepEqual(candidate(review,state,'ko').paragraphs,['전1','전2','보존']);assert.deepEqual(state.adopted,old);
  await assert.rejects(apply({action:'adopt-bilingual',enId:state.confirmed.en.id,koId:state.confirmed.ko.id,correspondenceReviewed:true}));
  await apply({action:'confirm-language',language:'ko',...candidate(review,state,'ko')});
  await apply({action:'adopt-bilingual',enId:state.confirmed.en.id,koId:state.confirmed.ko.id,correspondenceReviewed:true});
  assert.equal(state.adoptionHistory.length,2);assert.deepEqual(state.adoptionHistory[0],old);assert.equal(state.adopted.alignment[0].ko.length,2);assert.equal(state.adopted.alignment[0].en.length,1);
  assert.deepEqual((await readDecisions(review,user,root)).adopted,state.adopted);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('book requires all adopted scenes, freezes old adopted text and preserves appendix; output bytes reused and checked',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ros-edition-'));try{
 const baseState={choices:{}};const entries=Array.from({length:52},(_,i)=>({reviewId:review.manifest.id,sceneId:'s'+i,adopted:{id:'final'+i,round:ROUND,en:candidate(review,baseState,'en'),ko:candidate(review,baseState,'ko'),alignmentHash:'fixed'}}));
 const books={};for(const l of ['EN','KO'])books[l]={title:'Book',acts:[{title:'Act',chapters:[{title:'Chapter',scenes:[...entries.map(e=>({id:e.sceneId,title:e.sceneId,paragraphs:[{text:'wrong latest'}]})),{id:'appendix',title:'Appendix',paragraphs:[{text:'appendix unchanged'}]}]}]}]};
 assert.throws(()=>composeEdition(books,entries.slice(1)));const edition={id:'a'.repeat(64),...composeEdition(books,entries)};
 assert.ok(masterText(edition,'ko').includes('후'));assert.ok(!masterText(edition,'ko').includes('wrong latest'));assert.ok(masterText(edition,'ko').includes('appendix unchanged'));
 let runs=0;const render=async()=>{runs++;return Buffer.from('fixed bytes');};const first=await outputArtifact(edition,'author','ko','txt',render,root),second=await outputArtifact(edition,'author','ko','txt',render,root);
 assert.equal(runs,1);assert.equal(first.receipt.fileHash,second.receipt.fileHash);assert.equal(second.bytes.toString(),'fixed bytes');
 await assert.rejects(outputArtifact(edition,'author','ko','../../escape',render,root));
 }finally{await rm(root,{recursive:true,force:true});}
});
