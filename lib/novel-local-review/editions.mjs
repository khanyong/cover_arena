import {randomUUID} from 'node:crypto';
import {readFile,mkdir,writeFile,readdir,link,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha,storeRoot,immutable} from './store.mjs';
import {ROUND} from './finalVersions.mjs';
const fail=message=>Object.assign(new Error(message),{status:409});
export function composeEdition(books,entries){
 if(entries.length!==52||new Set(entries.map(e=>e.sceneId)).size!==52||entries.some(e=>!e.adopted||e.adopted.round!==ROUND))throw fail('FINAL_52_SCENES_REQUIRED');
 const copy=structuredClone(books);
 for(const language of ['en','ko']){
  const book=copy[language.toUpperCase()];const found=new Set();
  for(const act of book.acts)for(const chapter of act.chapters)for(const scene of chapter.scenes){
   const entry=entries.find(e=>e.sceneId===scene.id);
   if(!entry)continue;
   if(found.has(scene.id))throw fail('DUPLICATE_SCENE');found.add(scene.id);
   const value=entry.adopted[language];
   if(sha(JSON.stringify(value.paragraphs))!==value.contentHash)throw fail('FINAL_CONTENT_HASH_MISMATCH');
   const original=scene.paragraphs,usedIds=new Set();
   scene.paragraphs=value.paragraphs.map((text,i)=>{const matches=original.filter(p=>p.text===text);const result=matches.length===1&&!usedIds.has(matches[0].id)?{...matches[0],text}:{id:`${scene.id}-${language}-final-${i+1}`,text,versionId:value.id};usedIds.add(result.id);return result;});
   scene.finalVersionId=value.id;scene.compositionId=entry.adopted.id;
  }
  if(found.size!==52)throw fail('FINAL_SCENE_MAPPING_INCOMPLETE');
  const actual=book.acts.flatMap(a=>a.chapters.flatMap(c=>c.scenes)).filter(s=>found.has(s.id)).map(s=>s.id);
  if(JSON.stringify(actual)!==JSON.stringify(entries.map(e=>e.sceneId)))throw fail('FINAL_READING_ORDER_MISMATCH');
  book.counts={scenes:book.acts.flatMap(a=>a.chapters.flatMap(c=>c.scenes)).length,paragraphs:book.acts.flatMap(a=>a.chapters.flatMap(c=>c.scenes.flatMap(s=>s.paragraphs))).length};
 }
 return {round:ROUND,createdAt:new Date().toISOString(),books:copy,scenes:entries.map(e=>({reviewId:e.reviewId,sceneId:e.sceneId,adoptionId:e.adopted.id,enHash:e.adopted.en.contentHash,koHash:e.adopted.ko.contentHash,alignmentHash:e.adopted.alignmentHash}))};
}
export async function assetHashes(){const result={};for(const path of ['assets/book-covers/ros-cover-v1.png','assets/book-fonts/NotoSerifKR-Regular.otf','assets/book-fonts/NotoSerifKR-Bold.otf','lib/novel-book/bookHtml.mjs','lib/novel-book/renderBookPdf.mjs','lib/novel-book/renderBookEpub.mjs','shared/lib/equationCommentary.js','shared/lib/equationCommentaryIndex.js','lib/novel-book/kindleMathImages.mjs','package-lock.json'])result[path]=sha(await readFile(resolve(process.cwd(),path)));return result;}
export async function saveEdition(value,userId,root=storeRoot()){
 const content={...value,assets:await assetHashes(),userId};const raw=JSON.stringify(content);const id=sha(raw);
 const dir=resolve(root,'final-editions',sha(userId));await mkdir(dir,{recursive:true,mode:0o700});await immutable(resolve(dir,id+'.json'),raw);return {id,...content};
}
export async function readEdition(id,userId,root=storeRoot()){
 if(!/^[a-f0-9]{64}$/.test(id))throw fail('INVALID_EDITION');
 const raw=await readFile(resolve(root,'final-editions',sha(userId),id+'.json'),'utf8');
 if(sha(raw)!==id)throw fail('EDITION_INTEGRITY_FAILED');const value=JSON.parse(raw);
 if(value.userId!==userId)throw fail('EDITION_ACCESS_DENIED');
 if(JSON.stringify(value.assets)!==JSON.stringify(await assetHashes()))throw fail('EDITION_RENDERER_OR_ASSET_CHANGED');
 return {id,...value};
}
export function masterText(edition,language){
 const book=edition.books[language.toUpperCase()];
 return [`판본 ${edition.id}`,book.title,book.subtitle,book.author,...book.acts.flatMap(a=>[a.title,...a.chapters.flatMap(c=>[c.title,...c.scenes.flatMap(s=>[s.title,...s.paragraphs.map(p=>p.text)])])])].join('\n\n');
}

export async function listEditions(userId,root=storeRoot()){
 const dir=resolve(root,'final-editions',sha(userId));let names;try{names=await readdir(dir);}catch(e){if(e.code==='ENOENT')return [];throw e;}
 const result=[];for(const name of names.filter(n=>/^[a-f0-9]{64}\.json$/.test(n))){const raw=await readFile(resolve(dir,name),'utf8');if(sha(raw)!==name.slice(0,-5))throw fail('EDITION_INTEGRITY_FAILED');const v=JSON.parse(raw);result.push({id:name.slice(0,-5),createdAt:v.createdAt});}return result.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
export async function outputArtifact(edition,userId,language,format,render,root=storeRoot()){
 if(!['en','ko'].includes(language)||!['txt','pdf','epub'].includes(format))throw fail('INVALID_FORMAT');
 const dir=resolve(root,'final-editions',sha(userId),edition.id);await mkdir(dir,{recursive:true,mode:0o700});
 const path=resolve(dir,`${language}.${format}.json`);
 try{const record=JSON.parse(await readFile(path,'utf8')),bytes=Buffer.from(record.base64,'base64');if(sha(bytes)!==record.receipt.fileHash)throw fail('OUTPUT_INTEGRITY_FAILED');return {bytes,receipt:record.receipt};}catch(e){if(e.code!=='ENOENT')throw e;}
 const bytes=await render();
 const receipt={editionId:edition.id,language,format,fileHash:sha(bytes),bytes:bytes.length,createdAt:new Date().toISOString(),contentHash:sha(JSON.stringify(edition.books[language.toUpperCase()])),visualValidation:'NOT_CHECKED',contentValidation:'NOT_CHECKED'};
 const temp=resolve(dir,`${randomUUID()}.tmp`);await writeFile(temp,JSON.stringify({base64:bytes.toString('base64'),receipt}),{flag:'wx',mode:0o600});
 try{await link(temp,path);}catch(e){if(e.code!=='EEXIST')throw e;return outputArtifact(edition,userId,language,format,render,root);}finally{await unlink(temp);}
 return {bytes,receipt};
}
