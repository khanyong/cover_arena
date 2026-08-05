const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function clean() {
  console.log('Fetching English document...');
  const { data: enDataRes, error: enErr } = await supabase.from('novel_documents').select('data').eq('id', 'quantum-vibration-novel-en');
  if (enErr) return console.error(enErr);
  let enJson = enDataRes[0].data;

  let modifiedCount = 0;
  
  enJson.acts.forEach(act => {
    act.chapters.forEach(ch => {
      ch.paragraphs.forEach(p => {
        let changed = false;
        const newVersions = {};
        
        // Rebuild versions mapping mapping any ugly names to cleaner semantic names
        let nextMinor = 1;
        // First copy non-english and base v_en
        Object.entries(p.versions).forEach(([k, v]) => {
          if (!k.startsWith('v_en-')) {
            newVersions[k] = v;
          }
        });
        
        // Then re-map English custom versions
        const enVersions = Object.keys(p.versions)
          .filter(k => k.startsWith('v_en-'))
          .sort((a,b) => {
            // keep insertion order or just sort by createdAt
            return new Date(p.versions[a].createdAt).getTime() - new Date(p.versions[b].createdAt).getTime();
          });
          
        for (const oldKey of enVersions) {
          const newKey = `v_en-0.0.${nextMinor}`;
          newVersions[newKey] = { ...p.versions[oldKey], version: newKey };
          if (p.activeVersion === oldKey) {
            p.activeVersion = newKey;
          }
          if (oldKey !== newKey) changed = true;
          nextMinor++;
        }
        
        if (changed) {
          p.versions = newVersions;
          modifiedCount++;
        }
      });
    });
  });

  if (modifiedCount > 0) {
    console.log(`Cleaned history for ${modifiedCount} paragraphs. Updating DB...`);
    await supabase.from('novel_documents').update({ data: enJson }).eq('id', 'quantum-vibration-novel-en');
  } else {
    console.log('No ugly history tags found. Already clean.');
  }
}
clean();
