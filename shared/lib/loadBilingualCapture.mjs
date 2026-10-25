/** Hydrate a hash-pinned MVCC manifest without one enormous database JSON value.
 * All calls retain the caller's authentication and RLS. Any drift fails closed. */
export async function loadBilingualCapture(client, {signal} = {}) {
 const rpc = async (name, args) => {
  let query = client.rpc(name, args);
  if (signal && query.abortSignal) query = query.abortSignal(signal);
  const result = await query;
  if (result.error) throw result.error;
  return result.data;
 };
 try {
  const manifest = await rpc('ros_bilingual_capture_book');
  if (manifest?.format === 'ros-bilingual-book-capture-v1') return {data: manifest,error:null};
  if (manifest?.format !== 'ros-bilingual-book-manifest-v2' || !Array.isArray(manifest.documents) || !Array.isArray(manifest.managed))
   throw new Error('BILINGUAL_BOOK_MANIFEST_INVALID');
  const documents = [], managed = [];
  // One bounded payload at a time avoids concurrent full-book allocations.
  for (const entry of manifest.documents) {
   const text = await rpc('ros_bilingual_capture_document',{p_id:entry.id,p_sha256:entry.sha256});
   documents.push({id:entry.id,slug:entry.slug,data:JSON.parse(text)});
  }
  for (const entry of manifest.managed) {
   const text = await rpc('ros_bilingual_capture_scene',{p_id:entry.id,p_sha256:entry.sha256});
   managed.push(JSON.parse(text));
  }
  return {data:{format:'ros-bilingual-book-capture-v1',documents,managed},error:null};
 } catch(error) {return {data:null,error};}
}
