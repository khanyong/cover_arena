// Group structural replacements using recorded mapping, never by sentence index.
export function revisionComparisonRows(publication, language) {
 if (!['en','ko'].includes(language)) throw new Error('INVALID_LANGUAGE');
 const before=publication.before[language], after=publication.after[language];
 const plan=publication.plan;
 if (!Array.isArray(before)||!Array.isArray(after)||plan?.length!==after.length) throw new Error('INVALID_HISTORY');
 const text=p=>{const t=p?.versions?.[p.activeVersion]?.content;if(typeof t!=='string')throw new Error('MISSING_VERSION');return t;};
 const rows=[], used=new Set();
 for(let i=0;i<before.length;i++) {
  const group=publication.groups.find(g=>g.before_positions[0]===i+1);
  if(group){
   const [start,end]=group.before_positions;
   const indexes=plan.flatMap((p,j)=>p.change_key===group.edit_id?[j]:[]);
   if(end<start||end>before.length||!indexes.length)throw new Error('INVALID_MAPPING');
   indexes.forEach(j=>{if(used.has(j))throw new Error('DUPLICATE_MAPPING');used.add(j);});
   rows.push({key:group.edit_id,changed:true,before:before.slice(i,end).map(text),after:indexes.map(j=>text(after[j]))});i=end-1;
  } else {
   const id=before[i].unitId||before[i].id;
   const matches=after.flatMap((p,j)=>(p.unitId||p.id)===id?[j]:[]);
   if(matches.length!==1||used.has(matches[0]))throw new Error('MISSING_MAPPING');
   const j=matches[0];used.add(j);
   if(text(before[i])!==text(after[j]))throw new Error('UNMAPPED_CHANGE');
   rows.push({key:id,changed:false,before:[text(before[i])],after:[text(after[j])]});
  }
 }
 if(used.size!==after.length)throw new Error('INCOMPLETE_MAPPING');
 return rows;
}
