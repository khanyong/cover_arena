import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('slug, data');
  if (data) {
    data.forEach(d => {
      console.log(`\n=== ${d.slug} ===`);
      const act3 = d.data.acts.find(a => a.number === 3);
      if (act3) {
        const ch2 = act3.chapters.find(c => c.number === 2);
        if (ch2) {
          console.log(`Act 3 Chapter 2 Scenes: ${ch2.scenes ? ch2.scenes.length : (ch2.paragraphs ? '0 (paragraphs only)' : 'missing')}`);
        } else {
          console.log('Act 3 Chapter 2 missing');
        }
      } else {
        console.log('Act 3 missing');
      }
    });
  }
}
check();
