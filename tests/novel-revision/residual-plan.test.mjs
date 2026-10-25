import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildBilingualPlan,approvalContent,digest} from '../../lib/novel-revision/bilingual-plan.mjs';
const proposal=JSON.parse(readFileSync(process.env.ROS_R01_PROPOSAL));
const expected=JSON.parse(readFileSync(process.env.ROS_R01_MANIFEST));
const trustedApprovalDigest=process.env.ROS_R01_APPROVAL_DIGEST;
assert.equal(digest(approvalContent(proposal)),trustedApprovalDigest);
const input=()=>({proposal:structuredClone(proposal),expected:structuredClone(expected),current:structuredClone(expected),trustedApprovalDigest});
test('eight approved spans map to 129 pairs, retaining all 116 outside pairs',()=>{
 const plan=buildBilingualPlan(input()); assert.equal(plan.result_pairs.length,129); assert.equal(plan.retained_pairs,116);
 assert.deepEqual(plan.lineage.map(l=>[l.predecessor_pairs.length,l.successor_keys.length]),[[1,1],[1,1],[3,1],[4,4],[3,1],[5,2],[2,1],[4,2]]);
 const consumed=new Set(expected.changes.flatMap(c=>c.before_pairs.map(p=>p.alignment_id)));
 assert.deepEqual(plan.result_pairs.filter(p=>p.kind==='retained').map(p=>p.original),expected.ordered_alignment.filter(p=>!consumed.has(p.alignment_id)));
});
test('different approved scene cannot reuse this mapping',()=>{const x=input();x.current.managed_scene.scene_id='b48a4f04';assert.throws(()=>buildBilingualPlan(x),{code:'WRONG_TARGET'});});
test('modified wording and stale KO version fail closed',()=>{let x=input();x.proposal.changes[7].ko.proposed_after+='!';assert.throws(()=>buildBilingualPlan(x),{code:'APPROVAL_DIGEST_MISMATCH'});x=input();x.current.ordered_alignment[90].ko.version_id='stale';assert.throws(()=>buildBilingualPlan(x),{code:'STALE_BASELINE'});});
