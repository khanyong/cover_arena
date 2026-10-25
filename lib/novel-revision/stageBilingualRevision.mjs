import { buildBilingualPlan, digest, RevisionConflict } from './bilingual-plan.mjs';

const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const call = async (client, name, args) => {
 const {data,error}=await client.rpc(name,args);
 if(error) {
  const status=error.code==='42501'?403:error.code==='PT409'?409:error.code==='22023'?422:503;
  const e=new Error('BILINGUAL_STAGE_REJECTED');e.status=status;e.code=error.code;throw e;
 }
 return data;
};
/** Uses an already authenticated, request-scoped USER client. No service key.
 * Database RPC independently authorizes and rechecks live rows under locks.
 */
export async function stageBilingualRevision(client, body) {
 if (!body || !uuid(body.request_id) || !uuid(body.approval_id) || !body.proposal
   || Object.keys(body).some(k=>!['request_id','approval_id','proposal'].includes(k))) {
   const e=new Error('INVALID_BILINGUAL_REQUEST');e.status=400;throw e;
 }
 const context=await call(client,'ros_bilingual_stage_context',{p_approval_id:body.approval_id});
 const plan=buildBilingualPlan({proposal:body.proposal,expected:context.baseline,current:context.baseline,
   trustedApprovalDigest:context.approval_digest});
 if (digest(plan)!==digest(context.plan)) throw new RevisionConflict('APPROVED_PLAN_MISMATCH');
 return call(client,'ros_bilingual_stage',{p_request_id:body.request_id,p_approval_id:body.approval_id,
   p_proposal:body.proposal,p_baseline_digest:plan.baseline_digest});
}
