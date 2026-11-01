import {authenticateBookRequest} from '../../lib/novel-book/loadBookSnapshot.mjs';
import {loadBilingualBookCapture} from '../../lib/novel-book/loadBilingualBookCapture.mjs';
import {localRequest,readReview,listReviews,listReadingOrder,sha} from '../../lib/novel-local-review/store.mjs';
import {readDecisions} from '../../lib/novel-local-review/decisions.mjs';
import {composeEdition,saveEdition,readEdition,masterText,listEditions,outputArtifact} from '../../lib/novel-local-review/editions.mjs';
import {renderBookEpub} from '../../lib/novel-book/renderBookEpub.mjs';
import {renderBookPdf} from '../../lib/novel-book/renderBookPdf.mjs';
export const config={api:{responseLimit:false}};
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!localRequest(req))return res.status(404).end();
 if(!['GET','POST'].includes(req.method))return res.status(405).end();
 let rendered;
 try{
  const {client,userId}=await authenticateBookRequest(req.headers.authorization);
  if(req.method==='GET'&&req.query.list==='1')return res.json({editions:await listEditions(userId)});
  let edition;
  if(req.method==='POST'){
   if(req.headers.origin!==`http://${req.headers.host}`)return res.status(403).end();
   if(req.body?.confirmBookComponents!==true)throw Object.assign(new Error('BOOK_COMPONENT_CONFIRMATION_REQUIRED'),{status:409});
   const order=await listReadingOrder(userId,await listReviews(userId));
   if(order.length!==52||order.some(e=>e.loaded===false))throw Object.assign(new Error('FINAL_52_SCENES_REQUIRED'),{status:409});
   const entries=[];
   for(const item of order){
    const review=await readReview(item.id,userId),state=await readDecisions(review,userId);
    if(!state.adopted)throw Object.assign(new Error('FINAL_52_SCENES_REQUIRED'),{status:409});
    const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:item.managedSceneId,p_composition_id:null,p_include_legacy:false});
    if(error||!data)return res.status(403).end();
    entries.push({reviewId:item.id,sceneId:data.scene_id,adopted:state.adopted});
   }
   const capture=await loadBilingualBookCapture(client);
   edition=await saveEdition(composeEdition(capture.books,entries),userId);
   return res.json({id:edition.id,scenes:edition.scenes,createdAt:edition.createdAt});
  }
  edition=await readEdition(req.query.edition,userId);
  // Recheck current permission, but never reload content into the fixed edition.
  for(const entry of edition.scenes){const review=await readReview(entry.reviewId,userId);const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:review.manifest.managedSceneId,p_composition_id:null,p_include_legacy:false});if(error||!data)return res.status(403).end();}
  const language=req.query.lang==='en'?'en':'ko',format=String(req.query.format||'txt');
  if(format==='json')return res.json(edition);
  const {bytes}=await outputArtifact(edition,userId,language,format,async()=>{let bytes;
  if(format==='txt')bytes=Buffer.from(masterText(edition,language));
  else if(['pdf','epub'].includes(format)){
   const snapshot={...edition.books[language.toUpperCase()],finalEditionId:edition.id};
   rendered=await (format==='pdf'?renderBookPdf:renderBookEpub)(snapshot,{pageSize:'book',fontSize:11});
   const reader=rendered.stream.getReader(),chunks=[];try{for(;;){const {done,value}=await reader.read();if(done)break;chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
   bytes=Buffer.concat(chunks);
  }else throw Object.assign(new Error('INVALID_FORMAT'),{status:400});
 return bytes;});
  res.setHeader('X-ROS-Edition',edition.id);res.setHeader('X-Content-SHA256',sha(bytes));
  res.setHeader('Content-Type',format==='txt'?'text/plain; charset=utf-8':format==='pdf'?'application/pdf':'application/epub+zip');
  res.setHeader('Content-Disposition',`attachment; filename="ROS-final-${edition.id.slice(0,12)}-${language}.${format}"`);return res.send(bytes);
 }catch(e){return res.status([400,401,403,409].includes(e.status)?e.status:503).json({error:e.message||'EDITION_UNAVAILABLE'});}finally{await rendered?.close();}
}
