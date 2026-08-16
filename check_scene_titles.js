import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  if (data) {
    const act3 = data.data.acts.find(a => a.number === 3);
    const ch2 = act3.chapters.find(c => c.number === 2);
    
    ch2.scenes.forEach(s => {
      let content = "";
      if (s.paragraphs && s.paragraphs.length > 0) {
         content = Object.values(s.paragraphs[0].versions)[0].content;
      }
      console.log(`Scene ${s.number}: title="${s.title}", contentStart="${content.substring(0, 50).replace(/\n/g, ' ')}"`);
    });
  }
}
check();
