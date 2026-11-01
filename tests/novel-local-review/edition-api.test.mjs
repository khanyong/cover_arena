import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import vm from 'node:vm';import ts from 'typescript';
const compiled=ts.transpileModule(await readFile(new URL('../../pages/api/novel-local-edition.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function setup({local=true,auth=true,permission=true}={}){
 let captures=0,renders=0;const edition={id:'e'.repeat(64),scenes:[{reviewId:'PRO-C01-S01-r01'}],books:{KO:{language:'ko',fixed:true}}};
 const deps={loadBookSnapshot:{authenticateBookRequest:async()=>{if(!auth)throw Object.assign(new Error('LOGIN_REQUIRED'),{status:401});return {userId:'owner',client:{rpc:async()=>({data:permission?{scene_id:'scene'}:null})}};}},loadBilingualBookCapture:{loadBilingualBookCapture:async()=>{captures++;throw Error('unexpected live fallback');}},store:{localRequest:()=>local,readReview:async()=>({manifest:{managedSceneId:'managed'}}),listReviews:async()=>[],listReadingOrder:async()=>[],sha:()=> 'hash'},decisions:{readDecisions:async()=>({})},editions:{readEdition:async()=>edition,masterText:()=> 'exact fixed edition',outputArtifact:async(e,u,l,f,render)=>({bytes:await render()}),listEditions:async()=>[]},renderBookEpub:{renderBookEpub:async()=>{renders++;throw Error('unexpected');}},renderBookPdf:{renderBookPdf:async()=>{renders++;throw Error('unexpected');}}};
 const exports={};vm.runInNewContext(compiled,{exports,Buffer,require(name){const key=Object.keys(deps).find(k=>name.endsWith('/'+k+'.mjs'));if(!key)throw Error(name);return deps[key];}});
 const req={method:'GET',headers:{host:'localhost:3000',origin:'http://localhost:3000'},query:{edition:edition.id,lang:'ko',format:'txt'},body:{confirmBookComponents:true}};
 const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.statusCode=s;return this;},end(){},json(value){this.body=value;},send(value){this.body=value;}};
 return {req,res,handler:exports.default,counts:()=>({captures,renders})};
}
test('edition API requires localhost, authentication and scene permission',async()=>{
 for(const [settings,status] of [[{local:false},404],[{auth:false},401],[{permission:false},403]]){const t=setup(settings);await t.handler(t.req,t.res);assert.equal(t.res.statusCode,status);assert.equal(t.counts().renders,0);}
});
test('edition API serves fixed text without consulting latest content, blocks incomplete adoption and foreign origins',async()=>{
 const t=setup();await t.handler(t.req,t.res);assert.equal(t.res.body.toString(),'exact fixed edition');assert.equal(t.res.headers['X-ROS-Edition'],'e'.repeat(64));assert.equal(t.counts().captures,0);
 const missing=setup();missing.req.method='POST';await missing.handler(missing.req,missing.res);assert.equal(missing.res.statusCode,409);assert.equal(missing.res.body.error,'FINAL_52_SCENES_REQUIRED');assert.equal(missing.counts().captures,0);
 const cross=setup();cross.req.method='POST';cross.req.headers.origin='https://other.example';await cross.handler(cross.req,cross.res);assert.equal(cross.res.statusCode,403);
});
