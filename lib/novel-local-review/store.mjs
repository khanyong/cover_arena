import {readFile, mkdir, writeFile, appendFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
export const sha = value => createHash('sha256').update(value).digest('hex');
const fail=(message,status=409)=>Object.assign(new Error(message),{status});
export const localRequest = req => process.env.NODE_ENV==='development'
 && ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)
 && /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(req.headers.host||'');
export const storeRoot=()=>resolve(process.env.ROS_LOCAL_REVIEW_ROOT||resolve(process.cwd(),'../ros-local-review-store'));
export function safeId(id){if(typeof id!=='string'||!/^(?:PRO|A0|A1)-C\d{2}-S\d{2}-r\d{2}$/.test(id))throw fail('INVALID_REVIEW_ID',400);return id;}
export async function immutable(path,content){try{await writeFile(path,content,{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;if(await readFile(path,'utf8')!==content)throw fail('IMMUTABLE_REVIEW_CONFLICT');}}
export function buildDraft(report,baseline){
 const rows=[],before=[],after=[];const used=new Set();
 if(report.status!=='MAPPED_DRAFT_NOT_APPROVED'||!Array.isArray(report.changes))throw fail('NOT_A_DRAFT');
 for(let i=0;i<baseline.length;i++){
  const b=baseline[i];if(b.position!==i+1)throw fail('INVALID_ORDER');
  before.push({position:b.position,en:b.en_body,ko:b.ko_body,source:b});
 }
 for(let i=0;i<baseline.length;i++){
  const b=baseline[i],c=report.changes.find(c=>c.languages.en.start_position===b.position);
  if(c){
   if(used.has(c.id))throw fail('DUPLICATE_CHANGE');used.add(c.id);
   const content={};
   for(const l of ['en','ko']){
    const a=c.languages[l];
    if(a.start_position!==b.position||a.end_position!==a.start_position+a.official_before.length-1||JSON.stringify(baseline.slice(i,i+a.official_before.length).map(r=>r[l+'_body']))!==JSON.stringify(a.official_before))throw fail('BASELINE_CONFLICT');
    if(a.full_after.some((v,j)=>sha(v)!==a.after_block_hashes[j]))throw fail('AFTER_HASH_CONFLICT');
    content[l]={before:a.official_before,after:a.full_after};
   }
   if(content.en.after.length!==content.ko.after.length||content.en.before.length!==content.ko.before.length)throw fail('ALIGNMENT_CONFLICT');
   rows.push({id:c.id,title:c.title,changed:true,content});
   content.en.after.forEach((en,j)=>after.push({en,ko:content.ko.after[j],change:c.id,sourcePositions:[c.languages.en.start_position,c.languages.en.end_position]}));
   i+=content.en.before.length-1;
  }else {rows.push({id:`B${b.position}`,title:'변경 없음',changed:false,content:{en:{before:[b.en_body],after:[b.en_body]},ko:{before:[b.ko_body],after:[b.ko_body]}}});after.push({en:b.en_body,ko:b.ko_body,sourcePositions:[b.position,b.position],source:b});}
 }
 if(used.size!==report.changes.length)throw fail('UNMAPPED_CHANGE');
 return {before,after,rows};
}
export async function readReview(id,userId,root=storeRoot()){
 const dir=resolve(root,safeId(id));const manifest=JSON.parse(await readFile(resolve(dir,'manifest.json'),'utf8'));
 if(!manifest.allowedUserIds.includes(userId))throw fail('REVIEW_ACCESS_DENIED',403);
 const result={manifest};
 for(const name of ['before','after','rows']){const raw=await readFile(resolve(dir,name+'.json'),'utf8');if(sha(raw)!==manifest.files[name])throw fail('REVIEW_INTEGRITY_FAILED');result[name]=JSON.parse(raw);}
 return result;
}
export async function readComments(id,root=storeRoot()){try{return (await readFile(resolve(root,safeId(id),'comments.jsonl'),'utf8')).trim().split('\n').filter(Boolean).map(l=>JSON.parse(l));}catch(e){if(e.code==='ENOENT')return [];throw e;}}
export async function addComment(review,userId,input,root=storeRoot()){
 if(!input||Object.keys(input).some(k=>!['item','text'].includes(k))||!review.rows.some(r=>r.id===input.item)||typeof input.text!=='string'||!input.text.trim()||input.text.length>4000)throw fail('INVALID_COMMENT',400);
 const entry={scene:review.manifest.scene,revision:review.manifest.id,baseline:review.manifest.baselineId,item:input.item,text:input.text.trim(),userId,createdAt:new Date().toISOString()};
 await appendFile(resolve(root,safeId(review.manifest.id),'comments.jsonl'),JSON.stringify(entry)+'\n',{mode:0o600});return entry;
}

export async function listReviews(userId,root=storeRoot()){
 let names;try{names=await readdir(root);}catch(e){if(e.code==='ENOENT')return [];throw e;}
 const list=[];
 for(const id of names.sort()){
  if(!/^(?:PRO|A0|A1)-C\d{2}-S\d{2}-r\d{2}$/.test(id))continue;
  try{const {manifest:m}=await readReview(id,userId,root);list.push({id:m.id,scene:m.scene,title:m.title,status:m.status,managedSceneId:m.managedSceneId,baselineId:m.baselineId,proposalId:m.proposalId});}catch(e){if(e.status!==403)throw e;}
 }
 return list;
}

// The private reading plan contains metadata only; a plan entry never implies an
// immutable review has actually been loaded. Scene permission is checked by API.
export async function listReadingOrder(userId,reviews,root=storeRoot()){
 let plan;try{plan=JSON.parse(await readFile(resolve(root,'reading-order.json'),'utf8'));}catch(e){if(e.code==='ENOENT')return reviews;throw e;}
 if(!plan.allowedUserIds?.includes(userId))return reviews;
 const result=[];
 for(const item of plan.scenes){
  const loaded=reviews.filter(r=>r.scene===item.scene);
  if(loaded.length)result.push(...loaded);
  else result.push({id:safeId(item.id),scene:item.scene,title:item.title,managedSceneId:item.managedSceneId,status:'LOCAL_REVIEW_MISSING',loaded:false,readerPath:/^\/novel\/[a-z0-9-]+#scene-[a-z0-9]+$/.test(item.readerPath)?item.readerPath:undefined});
 }
 return [...result,...reviews.filter(r=>!plan.scenes.some(p=>p.scene===r.scene))];
}
