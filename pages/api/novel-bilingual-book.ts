import type { NextApiRequest, NextApiResponse } from 'next';
import {authenticateBookRequest} from '../../lib/novel-book/loadBookSnapshot.mjs';
import {loadBilingualBookCapture} from '../../lib/novel-book/loadBilingualBookCapture.mjs';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
 try {
  const {client}=await authenticateBookRequest(req.headers.authorization);
  const capture=await loadBilingualBookCapture(client);
  return res.status(200).json({captureId:capture.captureId,counts:{EN:capture.books.EN.counts,KO:capture.books.KO.counts}});
 }catch(e){const status=(e as {status?:number}).status;return res.status([401,403,409,422].includes(status||0)?status!:503).json({error:'BILINGUAL_CAPTURE_UNAVAILABLE'});}
}
