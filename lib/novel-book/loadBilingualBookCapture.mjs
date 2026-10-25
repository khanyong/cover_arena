import {loadBilingualCapture} from '../../shared/lib/loadBilingualCapture.mjs';
import {getBookFragmentSlugs,assembleBookActs,buildBookSnapshot,getBookManagedMarkers,bookSourceFingerprint,BookSnapshotError} from '../../shared/lib/novelBookSnapshot.mjs';
/** Both languages are read by one RLS-protected database statement. The returned
 * object is immutable application data; renderers never consult a live pointer. */
export async function loadBilingualBookCapture(client,{signal,now=()=>new Date().toISOString()}={}) {
 const {data,error}=await loadBilingualCapture(client,{signal});
 if(error)throw new BookSnapshotError('BILINGUAL_BOOK_CAPTURE_UNAVAILABLE',error.code==='42501'?403:503);
 if(data?.format!=='ros-bilingual-book-capture-v1'||!Array.isArray(data.documents)||!Array.isArray(data.managed))
  throw new BookSnapshotError('BILINGUAL_BOOK_CAPTURE_INVALID');
 const captureId=await bookSourceFingerprint(data);const books={};
 for(const [language,slug] of [['EN','quantum-vibration-novel-en'],['KO','quantum-vibration-novel']]) {
  const roots=data.documents.filter(d=>d.id===slug&&d.slug===slug);
  if(roots.length!==1)throw new BookSnapshotError('BOOK_ACCESS_OR_SOURCE_UNAVAILABLE',403);
  const root=roots[0],required=new Set(getBookFragmentSlugs(root,slug)),fragments=data.documents.filter(d=>required.has(d.slug));
  const markers=getBookManagedMarkers(assembleBookActs(root,fragments,slug));
  const managedResults=new Map(markers.map(m=>{
   const results=data.managed.filter(p=>p.managed_scene_id===m.managedSceneId);
   if(results.length!==1)throw new BookSnapshotError('BOOK_MANAGED_MAPPING_INVALID');
   return [m.managedSceneId,results[0]];
  }));
  const snapshot=await buildBookSnapshot({slug,root,fragments,managedResults,capturedAt:now()});
  snapshot.source={consistency:'single-bilingual-database-statement',captureId};books[language]=snapshot;
 }
 return {captureId,books};
}
