import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {authenticateBookRequest} from '../../lib/novel-book/loadBookSnapshot.mjs';
import {localRequest,readReview,storeRoot,sha} from '../../lib/novel-local-review/store.mjs';

// Reading projection only. Never writes formal manuscript or adoption tables.
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!localRequest(req))return res.status(404).end();
 if(req.method!=='GET')return res.status(405).end();
 try{
  const {client,userId}=await authenticateBookRequest(req.headers.authorization);
  let config;
  try{config=JSON.parse(await readFile(join(storeRoot(),'site-latest.json'),'utf8'));}
  catch(e){if(e.code==='ENOENT')return res.json({scenes:[]});throw e;}
  const scenes=await Promise.all(config.scenes.map(async entry=>{
   const review=await readReview(entry.reviewId,userId);
   if(review.manifest.managedSceneId!==entry.managedSceneId)throw Error('LATEST_IDENTITY_MISMATCH');
   const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:entry.managedSceneId,p_composition_id:null,p_include_legacy:false});
   if(error||!data)throw Object.assign(Error('LATEST_ACCESS_DENIED'),{status:403});
   for(const lang of ['en','ko'])if(sha(review.after.map(b=>b[lang]).join('\n\n')+'\n')!==entry.hashes[lang])throw Error('LATEST_HASH_MISMATCH');
   return {sceneId:data.scene_id,managedSceneId:entry.managedSceneId,reviewId:entry.reviewId,pairId:config.id+':'+entry.reviewId,
    hashes:entry.hashes,paragraphs:review.after.map(b=>({en:b.en,ko:b.ko})),koStatus:'AUTHOR_ADOPTED',enStatus:'IN_REVIEW',formalRegistration:false};
  }));
  return res.json({id:config.id,scenes});
 }catch(e){return res.status([401,403].includes(e.status)?e.status:503).json({error:'LATEST_READING_UNAVAILABLE'});}
}
