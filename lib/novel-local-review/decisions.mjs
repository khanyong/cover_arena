import {mkdir,readdir,readFile,writeFile,link,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {resolve} from 'node:path';
import {sha,safeId,storeRoot} from './store.mjs';
const fail=(message,status=409)=>Object.assign(new Error(message),{status});
export const basisOf=review=>sha(JSON.stringify([review.manifest.id,review.manifest.baselineId,review.manifest.files]));
const directory=(review,userId,root)=>resolve(root,safeId(review.manifest.id),'decisions',sha(userId));
export async function readDecisions(review,userId,root=storeRoot()){
 const dir=directory(review,userId,root);let names=[];
 try{names=(await readdir(dir)).filter(n=>/^\d{8}\.json$/.test(n)).sort();}catch(e){if(e.code!=='ENOENT')throw e;}
 if(!names.length)return {revision:0,basis:basisOf(review),choices:{}};
 const state=JSON.parse(await readFile(resolve(dir,names.at(-1)),'utf8'));
 if(state.basis!==basisOf(review))throw fail('DECISION_BASELINE_CHANGED');
 return state;
}
export async function saveDecision(review,userId,input,root=storeRoot()){
 if(!input||!['en','ko'].includes(input.language)||!['before','after','custom'].includes(input.choice)||!Number.isInteger(input.revision))throw fail('INVALID_DECISION',400);
 const row=review.rows.find(r=>r.changed&&r.id===input.item);
 if(!row)throw fail('INVALID_DECISION_ITEM',400);
 if(input.choice==='custom'&&(!Array.isArray(input.texts)||![row.content[input.language].before.length,row.content[input.language].after.length].includes(input.texts.length)||input.texts.some(t=>typeof t!=='string'||!t.trim()||t.length>50000)))throw fail('INVALID_CUSTOM_PARAGRAPHS',400);
 const state=await readDecisions(review,userId,root);
 if(input.basis!==state.basis||input.revision!==state.revision)throw fail('DECISION_CONFLICT');
 const entry={item:input.item,language:input.language,choice:input.choice,...(input.choice==='custom'?{texts:input.texts}:{}),createdAt:new Date().toISOString()};
 const next={...state,revision:state.revision+1,userId,choices:{...state.choices,[`${input.language}:${input.item}`]:entry}};
 const dir=directory(review,userId,root);await mkdir(dir,{recursive:true,mode:0o700});
 const temp=resolve(dir,`${randomUUID()}.tmp`);
 await writeFile(temp,JSON.stringify(next,null,2)+'\n',{flag:'wx',mode:0o600});
 try{await link(temp,resolve(dir,`${String(next.revision).padStart(8,'0')}.json`));}catch(e){if(e.code==='EEXIST')throw fail('DECISION_CONFLICT');throw e;}finally{await unlink(temp);}
 return next;
}
