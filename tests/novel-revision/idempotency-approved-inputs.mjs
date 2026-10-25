// DB/RPC contract test only. The second approval is synthetic revision metadata
// inside the labelled test DB; it is NOT a new editorial revision or author approval.
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {digest,approvalContent} from '../../lib/novel-revision/bilingual-plan.mjs';
const db=process.env.ROS_EXEC02_DB,dir=process.env.ROS_EXEC02_FIXTURE_DIR,rest=process.env.ROS_EXEC02_REST;
assert.match(db,/^ros_exec02_run[0-9]+$/);assert.match(rest,/^http:\/\/127\.0\.0\.1:554\d\d$/);
const docker='/usr/local/bin/docker';assert.equal(execFileSync(docker,['inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],{encoding:'utf8'}).trim(),'exec02-nonproduction');
const request=JSON.parse(readFileSync(dir+'/fixture.request.json'));
const proposal=structuredClone(request.p_proposal);proposal.proposal_revision=2;
const approvedDigest=digest(approvalContent(proposal));
const q=v=>"'"+JSON.stringify(v).replaceAll("'","''")+"'::jsonb";
const id='70200000-0000-4000-8000-000000000099';
const sql=`insert into ros_bilingual_private.approvals(id,change_key,revision,managed_scene_id,en_project_id,en_document_id,approved_actor,approval_digest,proposal,baseline,plan,evidence,approved_at)
 select '${id}',change_key,2,managed_scene_id,en_project_id,en_document_id,approved_actor,'${approvedDigest}',${q(proposal)},baseline,jsonb_set(jsonb_set(plan,'{revision}','2'::jsonb),'{approval_digest}',to_jsonb('${approvedDigest}'::text)),'SYNTHETIC NONPRODUCTION APPROVAL: DB idempotency contract only',now() from ros_bilingual_private.approvals where id='${request.p_approval_id}';`;
execFileSync(docker,['exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',db,'-v','ON_ERROR_STOP=1'],{input:sql,stdio:['pipe','pipe','pipe']});
const token=JSON.parse(readFileSync(dir+'/owner-session.json')).access_token;
const call=async(name,payload)=>{const r=await fetch(rest+'/rpc/'+name,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(payload)});return {status:r.status,body:await r.json()};};
const context=await call('ros_bilingual_stage_context',{p_approval_id:id});assert.equal(context.status,200);
assert.equal(digest(approvalContent(context.body.proposal)),context.body.approval_digest);
const result=await call('ros_bilingual_stage',{...request,p_approval_id:id,p_proposal:proposal});
assert.equal(result.status,400);assert.equal(result.body.message,'IDEMPOTENCY_KEY_CONFLICT');
assert.equal(execFileSync(docker,['exec','ros-exec02-db','psql','-U','supabase_admin','-d',db,'-Atc',"select count(*) from ros_bilingual_private.releases where approval_id='"+id+"'"],{encoding:'utf8'}).trim(),'0');
console.log('PASS: independently registered, digest-valid second approval reusing committed request key reaches IDEMPOTENCY_KEY_CONFLICT; no second stage created');
