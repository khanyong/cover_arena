import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel').single();
  if (data) {
    const act3 = data.data.acts.find(a => a.number === 3);
    if (!act3) { console.log("No Act 3"); return; }
    const ch2 = act3.chapters.find(c => c.number === 2);
    if (!ch2) { console.log("No Chapter 2"); return; }
    if (ch2.scenes) {
       console.log("Scenes:", ch2.scenes.length);
       ch2.scenes.forEach(s => console.log(`Scene ${s.number}:`, s.title));
    } else {
       console.log("No scenes array");
    }
  }
}
check();
