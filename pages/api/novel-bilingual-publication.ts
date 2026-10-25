import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateBookRequest } from '../../lib/novel-book/loadBookSnapshot.mjs';
const uuid = (v: unknown) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
export const config = { api: { bodyParser: { sizeLimit: '4kb' } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
 const b=req.body;
 if(!b || !['publish','restore'].includes(b.action) || !uuid(b.request_id) || !uuid(b.target_id)
   || Object.keys(b).some(k=>!['action','request_id','target_id'].includes(k))) return res.status(400).json({error:'INVALID_REQUEST'});
 try {
  const {client}=await authenticateBookRequest(req.headers.authorization);
  const {data,error}=await client.rpc(b.action==='publish'?'ros_bilingual_publish':'ros_bilingual_restore_publication',{
   p_request_id:b.request_id,...(b.action==='publish'?{p_release_id:b.target_id}:{p_publication_id:b.target_id})});
  if(error) return res.status(error.code==='PT409'?409:error.code==='42501'?403:error.code==='22023'?422:503).json({error:'PUBLICATION_REJECTED'});
  return res.status(200).json(data);
 }catch(e){const status=(e as {status?:number}).status;return res.status(status===401?401:503).json({error:'PUBLICATION_UNAVAILABLE'});}
}
