import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBilingualPlan,approvalContent,digest,sha256} from '../../lib/novel-revision/bilingual-plan.mjs';
function input() {
 const row=n=>({position:n,alignment_id:`alignment-${n}`,en:{unit_id:`en-unit-${n}`,version_id:`en-version-${n}`,body:`EN ${n}`,sha256:sha256(`EN ${n}`),separator_after:n===1?'\n\n':''},ko:{unit_id:`ko-unit-${n}`,version_id:`ko-version-${n}`,body:`KO ${n}`,sha256:sha256(`KO ${n}`),separator_after:n===1?'\n\n':''}});
 const rows=[row(1),row(2)];
 const proposal={proposal_id:'SYNTHETIC-NEW-SCENE',proposal_revision:1,scope:{scene:'scene'},changes:[{editorial_change_key:'R01',...Object.fromEntries(['en','ko'].map(l=>[l,{source_excerpt_before:rows[0][l].body,source_excerpt_before_sha256:rows[0][l].sha256,proposed_after:`${l.toUpperCase()} changed`,proposed_after_sha256:sha256(`${l.toUpperCase()} changed`),after_paragraphs:[`${l.toUpperCase()} changed`]}]))}]};
 const expected={managed_scene:{id:'managed',scene_id:'scene',source_key:'ACT/CH/SC',document_id:'document'},selection:{generation:1},composition:{id:'composition'},en_snapshot:{project_id:'project'},documents:[],ordered_alignment:rows,changes:[{edit_id:'R01',before_positions:[1,1],before_pairs:[rows[0]]}],before_sha256:{en:sha256('EN 1\n\nEN 2'),ko:sha256('KO 1\n\nKO 2')},after_sha256:{en:sha256('EN changed\n\nEN 2'),ko:sha256('KO changed\n\nKO 2')}};
 return {proposal,expected,current:structuredClone(expected),trustedApprovalDigest:digest(approvalContent(proposal)),trustedContract:{proposal_id:proposal.proposal_id,revision:1,id:'managed',scene:'scene',source:'ACT/CH/SC',document:'document',en_project:'project',before:2,after:2,retained:1,counts:[[1,1]]}};
}
test('new scene needs a separate trusted contract; proposal alone cannot expand scope',()=>{const x=input();delete x.trustedContract;assert.throws(()=>buildBilingualPlan(x),{code:'WRONG_PROPOSAL'});});
test('immutable approved contract produces paired plan and retains outside row',()=>{const x=input(),p=buildBilingualPlan(x);assert.deepEqual(p.contract,x.trustedContract);assert.deepEqual(p.result_pairs[1].original,x.expected.ordered_alignment[1]);assert.equal(p.result_pairs.length,2);});
test('cross-scene or cross-document targets are rejected',()=>{for(const k of ['id','scene','source','document','en_project']){const x=input();x.trustedContract[k]='wrong';assert.throws(()=>buildBilingualPlan(x),{code:'WRONG_TARGET'});}});
test('malformed structural counts are rejected',()=>{const x=input();x.trustedContract.counts=[[1,0]];assert.throws(()=>buildBilingualPlan(x),{code:'INVALID_TRUSTED_CONTRACT'});});
test('approved wording and stale KO version still fail closed',()=>{let x=input();x.proposal.changes[0].ko.proposed_after+='!';assert.throws(()=>buildBilingualPlan(x),{code:'APPROVAL_DIGEST_MISMATCH'});x=input();x.current.ordered_alignment[0].ko.version_id='stale';assert.throws(()=>buildBilingualPlan(x),{code:'STALE_BASELINE'});});
