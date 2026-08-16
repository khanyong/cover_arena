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
    const ch2 = act3.chapters.find(c => c.number === 2);
    const s4 = ch2.scenes.find(s => s.number === 4);
    if (s4) {
      console.log("English Scene 4 paragraphs:", s4.paragraphs.length);
      s4.paragraphs.forEach(p => console.log(Object.values(p.versions)[0].content.substring(0, 50)));
    }
  }

  const { data: data2 } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-vol4').single();
  if (data2) {
    const act3 = data2.data.acts.find(a => a.number === 3);
    const ch2 = act3.chapters.find(c => c.number === 2);
    if (!ch2.scenes) {
      console.log("Korean has no scenes, paragraphs:", ch2.paragraphs?.length);
      ch2.paragraphs?.forEach(p => console.log(Object.values(p.versions)[0].content.substring(0, 50)));
    } else {
      const s4 = ch2.scenes.find(s => s.number === 4);
      if (s4) {
        console.log("Korean Scene 4 paragraphs:", s4.paragraphs.length);
        s4.paragraphs.forEach(p => console.log(Object.values(p.versions)[0].content.substring(0, 50)));
      }
    }
  }
}

check();
