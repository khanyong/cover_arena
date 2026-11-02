import {sha,storeRoot} from './store.mjs';
import {readDecisions,appendState} from './decisions.mjs';
const fail=(message,status=409)=>Object.assign(new Error(message),{status});
export const ROUND='ROS-FINAL-VERSION-20261101-01';
export function candidate(review,state,language){
 if(!['en','ko'].includes(language))throw fail('INVALID_LANGUAGE',400);
 const ranges=review.rows.map(row=>{
  const choice=state.choices[`${language}:${row.id}`];
  const kind=choice?.choice==='hold'?'before':choice?.choice||review.manifest.defaultChoice||'after';
  return {item:row.id,kind,texts:kind==='custom'?choice.texts:row.content[language][kind]};
 });
 const paragraphs=ranges.flatMap(r=>r.texts);
 const same=side=>JSON.stringify(paragraphs)===JSON.stringify(review.rows.flatMap(r=>r.content[language][side]));
 return {language,ranges,paragraphs,contentHash:sha(JSON.stringify(paragraphs)),compositionHash:sha(JSON.stringify(ranges)),origin:same('after')?'after':same('before')?'before':'custom'};
}
export function versionView(review,state){return {...state,candidates:{ko:candidate(review,state,'ko'),en:candidate(review,state,'en')},round:ROUND};}
export async function finalize(review,userId,input,root=storeRoot()){
 if(review.manifest.finalizationBlocked)throw fail('REASSESSMENT_VALIDATION_PENDING');
 const state=await readDecisions(review,userId,root);
 if(input.revision!==state.revision||input.basis!==state.basis)throw fail('DECISION_CONFLICT');
 const next={...state,revision:state.revision+1,round:ROUND};
 const at=new Date().toISOString();
 if(input.action==='confirm-language'){
  const value=candidate(review,state,input.language);
  if(input.contentHash!==value.contentHash||input.compositionHash!==value.compositionHash)throw fail('CANDIDATE_CHANGED');
  // Equation/commentary source must survive editing. Exact fixed notes remain authoritative.
  for(const range of value.ranges.filter(r=>r.kind==='custom')){
   const source=review.rows.find(r=>r.id===range.item).content[input.language].after.join('\n');
   const target=range.texts.join('\n');
   const protectedParts=source.match(/\$\$[\s\S]*?\$\$|^>.*$/gm)||[];
   if(protectedParts.some(text=>!target.includes(text)))throw fail('ANNOTATION_CHANGED');
  }
  const confirmed={...value,id:`${review.manifest.id}-${input.language}-v${next.revision}-${value.contentHash.slice(0,12)}`,basis:state.basis,decisionRevision:state.revision,confirmedAt:at,userId,round:ROUND};
  next.confirmed={...state.confirmed,[input.language]:confirmed};
  next.confirmationHistory=[...(state.confirmationHistory||[]),confirmed];
 }else if(input.action==='adopt-bilingual'){
  const en=state.confirmed?.en,ko=state.confirmed?.ko;
  if(!en||!ko||input.enId!==en.id||input.koId!==ko.id||input.correspondenceReviewed!==true)throw fail('BILINGUAL_CONFIRMATION_REQUIRED');
  for(const language of ['en','ko']){
   const value=candidate(review,state,language),confirmed=state.confirmed[language];
   if(value.contentHash!==confirmed.contentHash||value.compositionHash!==confirmed.compositionHash)throw fail('CANDIDATE_NOT_CONFIRMED');
  }
  if(state.adopted?.en.id===en.id&&state.adopted?.ko.id===ko.id)return state;
  const alignment=en.ranges.map((range,i)=>({item:range.item,en:range.texts,ko:ko.ranges[i].texts}));
  const adopted={id:`${review.manifest.id}-final-v${next.revision}`,round:ROUND,adoptedAt:at,userId,basis:state.basis,en,ko,alignment,alignmentHash:sha(JSON.stringify(alignment)),source:{managedSceneId:review.manifest.managedSceneId,koCompositionId:review.manifest.koCompositionId,enSnapshotId:review.manifest.enSnapshotId,files:review.manifest.files}};
  next.adopted=adopted;next.adoptionHistory=[...(state.adoptionHistory||[]),adopted];
 }else throw fail('INVALID_FINAL_ACTION',400);
 return appendState(review,userId,next,root);
}

export function reviewStatus(review,state){
 const current={en:candidate(review,state,'en'),ko:candidate(review,state,'ko')};
 const matches=(a,b)=>!!a&&a.contentHash===b.contentHash&&a.compositionHash===b.compositionHash;
 return {finalAdoptionId:state.adopted?.id||null,
  adoptedCandidateCurrent:!!state.adopted&&['en','ko'].every(l=>matches(state.adopted[l],current[l])),
  confirmedLanguages:['ko','en'].filter(l=>matches(state.confirmed?.[l],current[l])),
  pendingConfirmationLanguages:['ko','en'].filter(l=>state.confirmed?.[l]&&!matches(state.confirmed[l],current[l]))};
}
