import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  const act5 = data.data.acts.find(a => a.number === 5);
  const ch2 = act5.chapters.find(c => c.number === 2);
  console.log("Total scenes in Act 5 Chapter 2:", ch2.scenes.length);
  ch2.scenes.forEach((s, i) => {
    console.log(`\n--- Scene ${s.number} (ID: ${s.id}) title: ${s.title} ---`);
    s.paragraphs.forEach((p, j) => {
      const activeContent = p.versions[p.activeVersion]?.content || '';
      console.log(`Para ${j} (Version: ${p.activeVersion}):`, activeContent.substring(0, 100).replace(/\n/g, ' '));
    });
  });
}
check();
