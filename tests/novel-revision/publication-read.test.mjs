import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {loadBilingualBookCapture} from '../../lib/novel-book/loadBilingualBookCapture.mjs';
import {loadSceneTranslationComparison} from '../../shared/lib/novelTranslationComparison.js';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR,base=process.env.ROS_EXEC02_REST;
assert.match(base,/^http:\/\/127\.0\.0\.1:554\d\d$/);
const published=JSON.parse(readFileSync(dir+'/published.json'));
const manifest=JSON.parse(readFileSync(dir+'/fixture.manifest.json'));
const pairCount=JSON.parse(readFileSync(dir+'/fixture.expected-plan.json')).result_pairs.length;
const managedId=manifest.managed_scene.id;
const clientFor=name=>({rpc:async(nameRpc,args={})=>{
 const token=JSON.parse(readFileSync(dir+'/'+name+'-session.json')).access_token;
 const r=await fetch(base+'/rpc/'+nameRpc,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(args)});
 const data=await r.json();return r.ok?{data,error:null}:{data:null,error:data};
}});
const client=clientFor('owner');
test('published pair read pins rewritten and merged EN/KO versions',async()=>{
 const {data,error}=await client.rpc('ros_bilingual_read_published',{p_managed_scene_id:managedId,p_composition_id:published.ko_composition_id});
 assert.equal(error,null);assert.equal(data.pairs.length,pairCount);assert.equal(data.publication_id,published.publication_id);
 writeFileSync(dir+'/published-readback.json',JSON.stringify(data));
});
test('existing comparison validator accepts pinned publication',async()=>{
 const {data:managed,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:managedId,p_composition_id:published.ko_composition_id,p_include_legacy:false});
 assert.equal(error,null);
 const scene={id:manifest.managed_scene.scene_id,storageModel:'ros-ko-block-v1',managedSceneId:managed.managed_scene_id,
 managedSourceKey:managed.source_key,managedDocumentId:'quantum-vibration-novel-act-2',managedDocumentSlug:'quantum-vibration-novel-act-2',
 compositionRevisionId:managed.requested_composition_id,canonicalBodySha256:managed.composition.body_sha256,terminalLf:0,paragraphs:managed.paragraphs};
 const result=await loadSceneTranslationComparison({scene,client});assert.equal(result.rows.length,pairCount);
 assert.equal(result.publication_id,published.publication_id);writeFileSync(dir+'/comparison.json',JSON.stringify(result));
});
test('one database statement supplies both complete private fixture books',async()=>{
 const capture=await loadBilingualBookCapture(client);
 for(const lang of ['EN','KO']){assert.equal(capture.books[lang].counts.paragraphs,pairCount);assert.equal(capture.books[lang].source.captureId,capture.captureId);}
 writeFileSync(dir+'/book-capture.json',JSON.stringify(capture));
});
test('outsider cannot read private publication or capture restricted KO book',async()=>{
 const outsider=clientFor('outsider');const r=await outsider.rpc('ros_bilingual_read_published',{p_managed_scene_id:managedId,p_composition_id:published.ko_composition_id});
 assert.equal(r.error.code,'42501');await assert.rejects(loadBilingualBookCapture(outsider));
});
