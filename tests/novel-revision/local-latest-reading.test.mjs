import test from 'node:test';
import assert from 'node:assert/strict';
import {applyLocalLatestReading} from '../../shared/lib/localLatestReading.mjs';
const fixture=()=>({acts:[{chapters:[{scenes:[{id:'a',paragraphs:[{id:'old'}]},{id:'other',paragraphs:[{id:'preserve'}]}]}]}]});
const payload={scenes:[{sceneId:'a',reviewId:'test-D1',pairId:'fixed',paragraphs:[{ko:'국문',en:'English'},{ko:'끝',en:'End'}]}]};
test('same fixed pair supplies both languages; unrelated scene retained',()=>{
 for(const language of ['ko','en']){
  const novel=fixture(),other=structuredClone(novel.acts[0].chapters[0].scenes[1]);
  applyLocalLatestReading(novel,payload,language);
  const [scene,untouched]=novel.acts[0].chapters[0].scenes;
  assert.deepEqual(scene.paragraphs.map(p=>p.versions[p.activeVersion].content),payload.scenes[0].paragraphs.map(p=>p[language]));
  assert.equal(scene.localLatestReading.pairId,'fixed');assert.equal(scene.managedReadOnly,true);assert.deepEqual(untouched,other);
 }
});
test('missing or duplicate target fails before any projection changes',()=>{
 for(const scenes of [[...payload.scenes,{...payload.scenes[0],sceneId:'missing'}],[...payload.scenes,...payload.scenes]]){
  const novel=fixture(),before=structuredClone(novel);assert.throws(()=>applyLocalLatestReading(novel,{scenes},'ko'));assert.deepEqual(novel,before);
 }
});
test('no activation leaves manuscript unchanged',()=>{const novel=fixture(),before=structuredClone(novel);applyLocalLatestReading(novel,{scenes:[]},'en');assert.deepEqual(novel,before);});
