import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  if (data) {
    const act3 = data.data.acts.find(a => a.number === 3);
    if (act3) {
      for (const ch of act3.chapters) {
        console.log(`Act 3 Chapter ${ch.number}:`);
        for (const s of ch.scenes) {
          console.log(`  Scene ${s.number}: ${s.id}`);
        }
      }
    }
  }
}

check();
