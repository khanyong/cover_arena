import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-vol4-en').single();
  if (data) {
    const act3 = data.data.acts.find(a => a.number === 3);
    const ch2 = act3.chapters.find(c => c.number === 2);
    const s4 = ch2.scenes.find(s => s.number === 4);
    if (s4) {
      console.log("Scene 4 ID:", s4.id);
      console.log("Paragraphs:", s4.paragraphs.length);
      s4.paragraphs.forEach((p, idx) => {
         const verKeys = Object.keys(p.versions);
         verKeys.forEach(k => {
           console.log(`Para ${idx} Ver ${k}:`, p.versions[k].content.substring(0, 100));
         });
      });
    }
  }
}
check();
