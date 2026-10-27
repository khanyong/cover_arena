import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNovelActFragments} from '../../shared/lib/loadNovelActFragments.mjs';
function fixture(fail) {
 const calls=[]; let active=0,max=0;
 const client={from(table){assert.equal(table,'novel_documents');return {select(fields){assert.equal(fields,'id, slug, data');return {async eq(field,slug){assert.equal(field,'slug');calls.push(slug);max=Math.max(max,++active);await new Promise(r=>setTimeout(r,1));--active;return slug===fail?{data:null,error:{code:'57014',message:'statement timeout'}}:{data:slug==='inline'?[]:[{id:slug,slug,data:{chapters:[]}}],error:null};}};}};}};
 return {client,calls,max:()=>max};
}
test('reads one ACT at a time using the caller client, preserves order and missing inline fragments',async()=>{
 const f=fixture();const r=await loadNovelActFragments(f.client,['a','inline','b','a']);
 assert.deepEqual(f.calls,['a','inline','b']);assert.equal(f.max(),1);
 assert.deepEqual(r.data.map(x=>x.slug),['a','b']);assert.equal(r.error,null);
});
test('a failed ACT returns no partial manuscript and identifies the failing scope',async()=>{
 const f=fixture('b');const r=await loadNovelActFragments(f.client,['a','b','c']);
 assert.equal(r.data,null);assert.equal(r.error.code,'57014');assert.match(r.error.message,/ACT b \(\d+ms\): statement timeout/);assert.deepEqual(f.calls,['a','b']);
});
