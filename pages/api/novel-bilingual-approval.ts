import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateBookRequest } from '../../lib/novel-book/loadBookSnapshot.mjs';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error:'METHOD_NOT_ALLOWED'}); }
  try {
    const { client } = await authenticateBookRequest(req.headers.authorization);
    const body=req.body;
    if (!body || Object.keys(body).some(key=>!['package_id','proposal','approval_digest'].includes(key))
      || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(body.package_id || '')
      || !/^[a-f0-9]{64}$/.test(body.approval_digest || '') || !body.proposal) {
      return res.status(400).json({error:'INVALID_APPROVAL_REQUEST'});
    }
    // The user cannot supply the trusted package, actor, baseline or plan.
    const {data,error}=await client.rpc('ros_bilingual_register_approval',{
      p_package_id:body.package_id,p_proposal:body.proposal,p_approval_digest:body.approval_digest,
    });
    if (error) return res.status(error.code==='42501'?403:error.code==='PT409'?409:503).json({error:'APPROVAL_REGISTRATION_REJECTED'});
    return res.status(200).json(data);
  } catch (error) {
    const status=(error as {status?:number}).status;
    return res.status(status===401||status===403?status:503).json({error:'APPROVAL_REGISTRATION_REJECTED'});
  }
}
