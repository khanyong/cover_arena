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
        
        // Find any version keys that look like 'v1.X' in the english document
        const versionKeys = Object.keys(p.versions);
        const hasWrongKeys = versionKeys.some(k => k.startsWith('v1.'));
        
        if (hasWrongKeys) {
          console.log(`Fixing paragraph ${p.id} which has keys:`, versionKeys);
          
          const newVersions = {};
          let nextMinor = 1;
          
          // Sort existing keys to preserve chronological history
          const sortedKeys = versionKeys.sort((a,b) => {
             return new Date(p.versions[a].createdAt).getTime() - new Date(p.versions[b].createdAt).getTime();
          });
          
          for (const oldKey of sortedKeys) {
            const newKey = `v_en-0.0.${nextMinor}`;
            newVersions[newKey] = { ...p.versions[oldKey], version: newKey };
            if (p.activeVersion === oldKey) {
              p.activeVersion = newKey;
            }
            changed = true;
            nextMinor++;
          }
          
          if (changed) {
            p.versions = newVersions;
            modifiedCount++;
          }
        }
      });
    });
  });

  if (modifiedCount > 0) {
    console.log(`Fixed history for ${modifiedCount} paragraphs. Updating DB...`);
    await supabase.from('novel_documents').update({ data: enJson }).eq('id', 'quantum-vibration-novel-en');
    console.log('Done!');
  } else {
    console.log('No misplaced v1.X tags found in English document.');
  }
}
clean();
