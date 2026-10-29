import {readFileSync,writeFileSync} from 'node:fs';
import {buildBilingualPlan} from '../../lib/novel-revision/bilingual-plan.mjs';
const [prefix,proposalFile,actor] = process.argv.slice(2);
const m=JSON.parse(readFileSync(prefix+'.manifest.json'));
const state=JSON.parse(readFileSync(prefix.replace(/fixture$/,'seed.log'),'utf8').trim().split('\n').at(-1));
m.documents=state.documents;m.composition=state.composition;
const proposal=JSON.parse(readFileSync(proposalFile));
const digest=process.env.ROS_R01_APPROVAL_DIGEST;
if(!/^[a-f0-9]{64}$/.test(digest||''))throw Error('Explicit private fixture approval digest required');
const plan=buildBilingualPlan({proposal,expected:m,current:m,trustedApprovalDigest:digest,trustedContract:m.contract});
const q=x=>"'"+JSON.stringify(x).replaceAll("'","''")+"'::jsonb";
const approval='70200000-0000-4000-8000-000000000001';
writeFileSync(prefix+'.approval.sql',`insert into ros_bilingual_private.approvals(id,change_key,revision,managed_scene_id,en_project_id,en_document_id,approved_actor,approval_digest,proposal,baseline,plan,evidence,approved_at) values('${approval}','${proposal.proposal_id}',${proposal.proposal_revision},'${m.managed_scene.id}','${m.en_snapshot.project_id}','${m.managed_scene.document_id.replace('quantum-vibration-novel-','quantum-vibration-novel-en-')}','${actor}','${digest}',${q(proposal)},${q(m)},${q(plan)},'NONPRODUCTION FIXTURE of existing EXEC01 approval',now());\nNOTIFY pgrst,'reload schema';\n`);
if (process.env.ROS_EXEC02_PACKAGE_ONLY === '1') {
 const payload={id:approval,change_key:proposal.proposal_id,revision:proposal.proposal_revision,managed_scene_id:m.managed_scene.id,en_project_id:m.en_snapshot.project_id,en_document_id:m.managed_scene.document_id.replace('quantum-vibration-novel-','quantum-vibration-novel-en-'),approved_actor:actor,approval_digest:digest,proposal,baseline:m,plan,evidence:'NONPRODUCTION exact approved fixture'};
 writeFileSync(prefix+'.approval.sql',`insert into ros_bilingual_private.approval_packages(id,instruction_id,instruction_received_at,package) values('${approval}','ROS-STYLE-BATCH18-PUBLISH-EXEC-01-20261028',now(),${q(payload)});\nNOTIFY pgrst,'reload schema';\n`);
}
writeFileSync(prefix+'.request.json',JSON.stringify({p_request_id:'70200000-0000-4000-8000-000000000002',p_approval_id:approval,p_proposal:proposal,p_baseline_digest:plan.baseline_digest}));
writeFileSync(prefix+'.expected-plan.json',JSON.stringify(plan));
