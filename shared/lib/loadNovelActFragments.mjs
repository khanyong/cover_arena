/** Bound each authenticated ACT read; never return a partial book on failure. */
export async function loadNovelActFragments(client, slugs) {
  const rows = [];
  for (const slug of [...new Set(slugs)]) {
    const started = Date.now();
    const {data, error} = await client.from('novel_documents')
      .select('id, slug, data').eq('slug', slug);
    if (error) return {data:null,error:{...error,
      message:`ACT ${slug} (${Date.now()-started}ms): ${error.message || 'query failed'}`}};
    rows.push(...(data || []));
  }
  return {data:rows,error:null};
}
