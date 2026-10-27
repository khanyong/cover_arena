import {authenticateBookRequest} from '../novel-book/loadBookSnapshot.mjs';
import {localRequest,readReview,readComments,addComment,listReviews,listReadingOrder} from './store.mjs';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!localRequest(req))return res.status(404).end();
 if(!['GET','POST'].includes(req.method))return res.status(405).end();
 try{
  const {client,userId}=await authenticateBookRequest(req.headers.authorization);
  if(req.query.list==='1' && req.method==='GET'){
   const visible=[];
   const reviews=await listReviews(userId);
   for(const item of await listReadingOrder(userId,reviews)){
    const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:item.managedSceneId,p_composition_id:null,p_include_legacy:false});
    if(!error&&data)visible.push(item);
   }
   return res.json({reviews:visible.filter(item=>item.loaded!==false),readingOrder:visible});
  }
  const review=await readReview(req.query.id,userId);
  // Normal user-scoped RPC independently enforces existing scene read permission.
  const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:review.manifest.managedSceneId,p_composition_id:null,p_include_legacy:false});
  if(error||!data)return res.status(403).json({error:'REVIEW_ACCESS_DENIED'});
  if(req.method==='POST'){
   if(req.headers.origin!==`http://${req.headers.host}`)return res.status(403).json({error:'ORIGIN_DENIED'});
   return res.json(await addComment(review,userId,req.body));
  }
  const {allowedUserIds,...manifest}=review.manifest;
  return res.json({...review,manifest,comments:await readComments(manifest.id),account:userId,baselineChanged:data.requested_composition_id!==manifest.koCompositionId});
 }catch(e){const status=[400,401,403,409].includes(e.status)?e.status:e.code==='ENOENT'?404:503;return res.status(status).json({error:status===401?'LOGIN_REQUIRED':status===403?'REVIEW_ACCESS_DENIED':status===409?'REVIEW_INTEGRITY_FAILED':'REVIEW_UNAVAILABLE'});}
}
