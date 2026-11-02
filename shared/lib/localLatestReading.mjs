export function applyLocalLatestReading(novel,payload,language){
 if(!['ko','en'].includes(language)||!Array.isArray(payload?.scenes))throw Error('LATEST_PAYLOAD_INVALID');
 const targets=novel.acts.flatMap(a=>a.chapters.flatMap(c=>c.scenes));
 const seen=new Set();
 for(const entry of payload.scenes){
  const matches=targets.filter(s=>s.id===entry.sceneId);
  if(matches.length!==1||seen.has(entry.sceneId)||!entry.paragraphs?.length||entry.paragraphs.some(p=>typeof p.en!=='string'||typeof p.ko!=='string'))throw Error('LATEST_SCENE_MISMATCH');
  seen.add(entry.sceneId);
 }
 for(const entry of payload.scenes){
  const scene=targets.find(s=>s.id===entry.sceneId);
  scene.localLatestReading=entry;
  scene.managedReadOnly=true;
  scene.paragraphs=entry.paragraphs.map((p,i)=>({id:`local-latest:${entry.reviewId}:${i}`,activeVersion:'latest-reading',versions:{'latest-reading':{version:'latest-reading',content:p[language]}},separatorAfter:i===entry.paragraphs.length-1?'\n':'\n\n'}));
 }
 return novel;
}
