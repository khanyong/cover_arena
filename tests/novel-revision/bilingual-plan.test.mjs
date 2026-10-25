import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildBilingualPlan, approvalContent, digest } from '../../lib/novel-revision/bilingual-plan.mjs';
// Real editorial inputs stay outside the public application bundle. Explicit paths
// are required: a missing fixture must fail rather than silently skip acceptance.
const proposal = JSON.parse(readFileSync(process.env.ROS_R01_PROPOSAL, 'utf8'));
const expected = JSON.parse(readFileSync(process.env.ROS_R01_MANIFEST, 'utf8'));
const approved = process.env.ROS_R01_APPROVAL_DIGEST;
assert.match(approved || '', /^[a-f0-9]{64}$/);
assert.equal(digest(approvalContent(proposal)), approved);
const input = () => ({ proposal: structuredClone(proposal), expected: structuredClone(expected), current: structuredClone(expected), trustedApprovalDigest: approved });
const fails = (mutate, code) => { const x = input(); mutate(x); assert.throws(() => buildBilingualPlan(x), { code }); };

test('T04 local: exact seven pairs produce 67 current pairs and 23-to-11 historical lineage', () => {
 const x=input(), before=JSON.stringify(x); const plan=buildBilingualPlan(x);
 assert.equal(JSON.stringify(x),before); assert.equal(plan.result_pairs.length,67);
 assert.equal(plan.retained_pairs,56); assert.equal(plan.executable,false);
 assert.deepEqual(plan.lineage.map(l=>[l.predecessor_pairs.length,l.successor_keys.length]),[[5,3],[3,1],[2,1],[3,2],[1,1],[8,2],[1,1]]);
});
for (const [label, mutate] of [
 ['EN version',x=>x.current.ordered_alignment[0].en.version_id='changed'],
 ['KO version',x=>x.current.ordered_alignment[0].ko.version_id='changed'],
 ['KO generation',x=>x.current.managed_scene.generation++],
 ['composition',x=>x.current.composition.id='changed'],
 ['snapshot',x=>x.current.en_snapshot.id='changed'],
 ['document head',x=>x.current.documents[0].document_sha256='changed'],
 ['separator',x=>x.current.ordered_alignment[0].ko.separator_after='\n'],
 ['alignment',x=>x.current.ordered_alignment[0].alignment_id='changed'],
]) test(`T02/T07 local: rejects stale ${label}`,()=>fails(mutate,'STALE_BASELINE'));
test('T02 local: rejects different scene',()=>fails(x=>x.current.managed_scene.scene_id='other','WRONG_TARGET'));
test('T03 local: AFTER tampering cannot be approved by client flag',()=>fails(x=>{x.proposal.changes[0].en.proposed_after+='!';x.proposal.approved=true;},'APPROVAL_DIGEST_MISMATCH'));
test('T03 local: rejects revision change',()=>fails(x=>x.proposal.proposal_revision=2,'WRONG_PROPOSAL'));
test('T03 local: rejects wrong approval digest',()=>fails(x=>x.trustedApprovalDigest='0'.repeat(64),'APPROVAL_DIGEST_MISMATCH'));
test('T03 local: rejects paragraph array tampering even when AFTER is unchanged',()=>fails(x=>x.proposal.changes[0].en.after_paragraphs[0]+='!','AFTER_STRUCTURE_MISMATCH'));
test('T08 local: all 56 outside pairs retain full original objects including IDs, notes and separators',()=>{
 const plan=buildBilingualPlan(input()); const removed=new Set(expected.changes.flatMap(c=>c.before_pairs.map(p=>p.alignment_id)));
 assert.deepEqual(plan.result_pairs.filter(p=>p.kind==='retained').map(p=>p.original),expected.ordered_alignment.filter(p=>!removed.has(p.alignment_id)));
 for(const lang of ['en','ko']) {
  const original=expected.ordered_alignment.map(p=>p[lang].body).join('\n\n');
  const retained=plan.result_pairs.filter(p=>p.kind==='retained').map(p=>p.original[lang].body).join('\n\n');
  const equations=t=>t.match(/\$\$[\s\S]*?\$\$/g)||[];
  assert.equal(equations(original).length,4);assert.deepEqual(equations(retained),equations(original));
 }
});
test('T10 local: merged anchors are marked historical/manual review, not silently relocated',()=>{
 const plan=buildBilingualPlan(input());assert.ok(plan.lineage.every(l=>l.anchor_policy==='PRESERVE_HISTORICAL_REQUIRE_MANUAL_REVIEW'));
 assert.ok(plan.result_pairs.filter(p=>p.kind==='replacement').every(p=>!p.en.unit_id&&!p.ko.unit_id));
});
test('fails closed on corrupt body even if expected/current are both altered',()=>fails(x=>{x.expected.ordered_alignment[0].en.body+='!';x.current=structuredClone(x.expected);},'BODY_HASH_MISMATCH'));
test('fails closed on mapping mismatch',()=>fails(x=>x.expected.changes[0].before_pairs[0].en.body+='!','MAPPING_MISMATCH'));
