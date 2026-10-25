import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadBilingualBookCapture} from '../../lib/novel-book/loadBilingualBookCapture.mjs';
import {loadSceneTranslationComparison} from '../../shared/lib/novelTranslationComparison.js';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR,base=process.env.ROS_EXEC02_REST;
assert.match(base,/^http:\/\/127\.0\.0\.1:554\d\d$/);
const published=process.env.ROS_EXEC02_PHASE==='published';
const staged=JSON.parse(readFileSync(dir+'/readback.json'));
const token=JSON.parse(readFileSync(dir+'/reader-session.json')).access_token;
const rpc=async(name,args={})=>{
 const r=await fetch(base+'/rpc/'+name,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(args)});
 const data=await r.json();return r.ok?{data,error:null}:{data:null,error:data};
};
const sceneId='13a795ae-456e-4623-9714-b302c9db9585';
test('shared reader sees only the published KO scene and bilingual book capture',async()=>{
 const {data:scene,error}=await rpc('ros_ko_get_scene',{p_managed_scene_id:sceneId,p_composition_id:null,p_include_legacy:false});
 assert.equal(error,null);assert.equal(scene.paragraphs.length,published?67:79);
 const capture=await loadBilingualBookCapture({rpc});
 for(const lang of ['EN','KO'])assert.equal(capture.books[lang].counts.paragraphs,published?67:79);
 const history=await rpc('ros_bilingual_revision_history',{p_managed_scene_id:sceneId});
 assert.equal(history.error,null);
 const privateRead=await rpc('ros_bilingual_read_staged',{p_release_id:staged.release_id});
 assert.equal(privateRead.error?.code,'42501');
 if(!published){
  const r=await rpc('ros_ko_get_scene',{p_managed_scene_id:sceneId,p_composition_id:staged.ko_composition_id,p_include_legacy:false});
  assert.equal(r.error?.code,'42501');
 }else{
  const compared=await loadSceneTranslationComparison({client:{rpc},scene:{id:'b48a4f04',storageModel:'ros-ko-block-v1',managedSceneId:sceneId,managedSourceKey:scene.source_key,managedDocumentId:'quantum-vibration-novel-act-2',managedDocumentSlug:'quantum-vibration-novel-act-2',compositionRevisionId:scene.requested_composition_id,canonicalBodySha256:scene.composition.body_sha256,terminalLf:0,paragraphs:scene.paragraphs}});
  assert.equal(compared.rows.length,67);
 }
});
test('shared read capability never grants staging or publication',async()=>{
 const request=JSON.parse(readFileSync(dir+'/fixture.request.json'));
 assert.equal((await rpc('ros_bilingual_stage',request)).error?.code,'42501');
 assert.equal((await rpc('ros_bilingual_publish',{p_request_id:crypto.randomUUID(),p_release_id:staged.release_id})).error?.code,'42501');
});
