const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fix() {
  console.log('Fetching Korean document...');
  const { data: koDataRes, error: koErr } = await supabase.from('novel_documents').select('data').eq('id', 'quantum-vibration-novel');
  if (koErr) return console.error(koErr);
  let koJson = koDataRes[0].data;

  console.log('Fetching English document...');
  const { data: enDataRes, error: enErr } = await supabase.from('novel_documents').select('data').eq('id', 'quantum-vibration-novel-en');
  if (enErr) return console.error(enErr);
  let enJson = enDataRes[0].data;

  // 1. The Korean document currently holds the user's latest English edits!
  // We need to copy this JSON to the English document, but change its slug.
  const newEnJson = JSON.parse(JSON.stringify(koJson));
  newEnJson.slug = 'quantum-vibration-novel-en';
  // Note: the title inside newEnJson might be the Korean title, let's fix it just in case
  newEnJson.title = '[EN] ' + newEnJson.title.replace('[EN] ', '');

  // 2. Restore the Korean document's activeVersion back to Korean versions
  let restoredKoCount = 0;
  koJson.acts.forEach(act => {
    act.chapters.forEach(ch => {
      ch.paragraphs.forEach(p => {
        if (p.activeVersion.startsWith('v_en')) {
          // Find the latest version that doesn't start with v_en
          const keys = Object.keys(p.versions).filter(k => !k.startsWith('v_en')).sort();
          if (keys.length > 0) {
            p.activeVersion = keys[keys.length - 1]; // usually v6.5 or v6.6
            restoredKoCount++;
          }
        }
      });
    });
  });

  console.log(`Restored activeVersion to Korean for ${restoredKoCount} paragraphs in Korean document.`);

  // 3. Update the Korean document in DB
  console.log('Updating Korean document in DB...');
  await supabase.from('novel_documents').update({ data: koJson }).eq('id', 'quantum-vibration-novel');

  // 4. Update the English document in DB
  console.log('Updating English document in DB...');
  await supabase.from('novel_documents').update({ data: newEnJson }).eq('id', 'quantum-vibration-novel-en');

  // 5. Fix vol2 and vol3
  const vols = ['quantum-vibration-vol2', 'quantum-vibration-vol3'];
  for (const vol of vols) {
    console.log(`Fixing ${vol}-en slug inside JSON...`);
    const { data: vData } = await supabase.from('novel_documents').select('data').eq('id', `${vol}-en`);
    if (vData && vData.length > 0) {
      let vJson = vData[0].data;
      if (vJson.slug === vol) {
        vJson.slug = `${vol}-en`;
        await supabase.from('novel_documents').update({ data: vJson }).eq('id', `${vol}-en`);
        console.log(`Fixed slug for ${vol}-en`);
      }
    }
  }

  console.log('Done!');
}

fix();
