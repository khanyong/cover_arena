import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {authenticateBookRequest} from '../../lib/novel-book/loadBookSnapshot.mjs';
import {stageBilingualRevision} from '../../lib/novel-revision/stageBilingualRevision.mjs';
const p=process.env.ROS_EXEC02_FIXTURE_DIR;
const request=JSON.parse(readFileSync(p+'/fixture.request.json'));
const body={request_id:request.p_request_id,approval_id:request.p_approval_id,proposal:request.p_proposal};
const env={NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:55441',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_exec02_localtest'};
// Test transport splits Supabase's /auth/v1 and /rest/v1 routes onto the two
// isolated official services. Both still verify the real GoTrue access token.
const fetchImpl=(input,init)=>{
 const url=new URL(input instanceof Request?input.url:String(input));
 assert.equal(url.origin,env.NEXT_PUBLIC_SUPABASE_URL);
 let target;
 if(url.pathname.startsWith('/auth/v1/')) target=(process.env.ROS_EXEC02_AUTH || 'http://127.0.0.1:55439')+url.pathname.slice(8)+url.search;
 else if(url.pathname.startsWith('/rest/v1/')) target=(process.env.ROS_EXEC02_REST || 'http://127.0.0.1:55440')+url.pathname.slice(8)+url.search;
 else throw Error('Unexpected local service route');
 return fetch(target,init);
};
const login=async(name)=>authenticateBookRequest('Bearer '+JSON.parse(readFileSync(p+'/'+name+'-session.json')).access_token,{env,fetchImpl});
test('server rejects missing and invalid real Auth tokens',async()=>{
 await assert.rejects(authenticateBookRequest(undefined,{env,fetchImpl}),{status:401});
 await assert.rejects(authenticateBookRequest('Bearer aaa.bbb.ccc',{env,fetchImpl}),{status:401});
});
test('server retrieves independent approval and reuses original planner before RPC replay',async()=>{
 const {client}=await login('owner');const r=await stageBilingualRevision(client,body);
 assert.equal(r.status,'PRIVATE_STAGED');assert.equal(r.replayed,true);
});
test('server rejects body-supplied actor and altered AFTER',async()=>{
 const {client}=await login('owner');
 await assert.rejects(stageBilingualRevision(client,{...body,actor_id:'spoof'}),{status:400});
 const changed=structuredClone(body);changed.proposal.changes[0].ko.proposed_after+='!';
 await assert.rejects(stageBilingualRevision(client,changed),{code:'APPROVAL_DIGEST_MISMATCH'});
});
test('server denies authenticated user lacking scene approval',async()=>{
 const {client}=await login('outsider');await assert.rejects(stageBilingualRevision(client,body),{status:403});
});
