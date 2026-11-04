import {mkdir,readFile,readdir,writeFile,link,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {sha,storeRoot} from '../novel-local-review/store.mjs';
export const SCENES=['A0-C02-S02','A0-C03-S01','A0-C03-S02','A0-C04-S01','A0-C04-S02'];
const fail=(message,status=409)=>Object.assign(new Error(message),{status});
function directory(scene,user,root){if(!SCENES.includes(scene)||!user)throw fail('INVALID_SCOPE',400);return resolve(root,'whole-scenes',scene,sha(user));}
export async function readWhole(scene,user,root=storeRoot()){
 const dir=directory(scene,user,root);let names;
 try{names=(await readdir(dir)).filter(n=>/^\d{8}\.json$/.test(n)).sort();}catch(e){if(e.code!=='ENOENT')throw e;names=[];}
 if(!names.length)return {revision:0,versions:[],sets:[],decisions:[]};
 const raw=JSON.parse(await readFile(resolve(dir,names.at(-1)),'utf8'));
 if(sha(JSON.stringify(raw.state))!==raw.sha256)throw fail('INTEGRITY_ERROR');
 for(const v of raw.state.versions)if(sha(v.text)!==v.sha256)throw fail('INTEGRITY_ERROR');
 return raw.state;
}
export async function changeWhole(scene,user,input,root=storeRoot()){
 const old=await readWhole(scene,user,root);
 if(input.revision!==old.revision)throw fail('REVISION_CONFLICT');
 const next=structuredClone(old),now=new Date().toISOString();
 if(input.action==='register'){
  if(typeof input.family!=='string'||!/^FUNERAL-[A-Za-z0-9-]{1,64}$/.test(input.family))throw fail('INVALID_FAMILY',400);
  for(const l of ['ko','en'])if(typeof input.texts?.[l]!=='string'||!input.texts[l].trim()||Buffer.byteLength(input.texts[l])>1000000||sha(input.texts[l])!==input.hashes?.[l])throw fail('INVALID_MANUSCRIPT_OR_HASH',400);
  const pair={};
  for(const language of ['ko','en']){
   const text=input.texts[language],hash=sha(text);
   let v=next.versions.find(v=>v.language===language&&v.text===text);
   if(!v){v={id:randomUUID(),language,text,sha256:hash,createdAt:now};next.versions.push(v);}
   pair[language]=v.id;
  }
  if(next.sets.some(s=>s.family===input.family&&s.ko===pair.ko&&s.en===pair.en))return old;
  next.sets.push({id:randomUUID(),family:input.family,...pair,alignmentStatus:'UNALIGNED',createdAt:now});
 }else if(input.action==='decide'){
  const set=next.sets.find(s=>s.id===input.setId);
  if(!set||!['ko','en'].includes(input.language)||!['adopt-whole','keep-current','request-revision'].includes(input.decision))throw fail('INVALID_DECISION',400);
  const v=next.versions.find(v=>v.id===set[input.language]);
  if(input.sha256!==v.sha256)throw fail('CONTENT_CHANGED');
  if(typeof input.note!=='string'||input.note.length>10000)throw fail('INVALID_NOTE',400);
  next.decisions.push({id:randomUUID(),setId:set.id,language:input.language,versionId:v.id,sha256:v.sha256,decision:input.decision,note:input.note,at:now});
 }else throw fail('INVALID_ACTION',400);
 next.revision++;
 const dir=directory(scene,user,root);await mkdir(dir,{recursive:true,mode:0o700});
 const tmp=resolve(dir,randomUUID()+'.tmp');
 await writeFile(tmp,JSON.stringify({sha256:sha(JSON.stringify(next)),state:next}),{flag:'wx',mode:0o600});
 try{await link(tmp,resolve(dir,String(next.revision).padStart(8,'0')+'.json'));}catch(e){if(e.code==='EEXIST')throw fail('REVISION_CONFLICT');throw e;}finally{await unlink(tmp);}
 return next;
}
