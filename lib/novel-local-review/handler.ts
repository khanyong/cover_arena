import {readDecisions,saveDecision} from './decisions.mjs';
import {authenticateBookRequest} from '../novel-book/loadBookSnapshot.mjs';
import {localRequest,readReview,readComments,addComment,listReviews,listReadingOrder} from './store.mjs';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!localRequest(req))return res.status(404).end();
 if(!['GET','POST'].includes(req.method))return res.status(405).end();
 try{
  const {client,userId}=await authenticateBookRequest(req.headers.authorization);
  if((req.query.list==='1'||req.query.export==='1') && req.method==='GET'){
   const visible=[];
   const reviews=await listReviews(userId);
   const order=await listReadingOrder(userId,reviews);
   for(let i=0;i<order.length;i+=8){
    const batch=await Promise.all(order.slice(i,i+8).map(async item=>{
     const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:item.managedSceneId,p_composition_id:null,p_include_legacy:false});
     if(error)throw Object.assign(new Error('SCENE_CHECK_FAILED'),{status:503});
     return data?item:null;
    }));
    visible.push(...batch.filter(Boolean));
   }
   if(req.query.export==='1'){
    const lang=req.query.lang==='en'?'en':'ko';
    const text=['비공개 로컬 수정 후판 모음 — 전권 확정본/온라인 게시 아님'];
    for(const item of visible){
     text.push(`## ${item.scene} · ${item.title}`);
     if(item.loaded===false){text.push('로컬 후판 미적재 — 이 파일에 본문 미포함');continue;}
     const review=await readReview(item.id,userId);
     text.push(`${item.id} | SHA256 ${review.manifest.files.after}`,...review.after.map(block=>block[lang]));
    }
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    return res.send(text.join('\n\n'));
   }
   return res.json({reviews:visible.filter(item=>item.loaded!==false),readingOrder:visible});
  }
  const review=await readReview(req.query.id,userId);
  // Normal user-scoped RPC independently enforces existing scene read permission.
  const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:review.manifest.managedSceneId,p_composition_id:null,p_include_legacy:false});
  if(error||!data)return res.status(403).json({error:'REVIEW_ACCESS_DENIED'});
  if(req.method==='POST'){
   if(req.headers.origin!==`http://${req.headers.host}`)return res.status(403).json({error:'ORIGIN_DENIED'});
   if(req.body?.action==='decision')return res.json(await saveDecision(review,userId,req.body));
   return res.json(await addComment(review,userId,req.body));
  }
  const {allowedUserIds,...manifest}=review.manifest;
  return res.json({...review,manifest:{...manifest,legacySceneId:data.scene_id},decisions:await readDecisions(review,userId),comments:await readComments(manifest.id),account:userId,baselineChanged:data.requested_composition_id!==manifest.koCompositionId});
 }catch(e){const status=[400,401,403,409].includes(e.status)?e.status:e.code==='ENOENT'?404:503;return res.status(status).json({error:status===401?'LOGIN_REQUIRED':status===403?'REVIEW_ACCESS_DENIED':status===409?'REVIEW_INTEGRITY_FAILED':'REVIEW_UNAVAILABLE'});}
}
