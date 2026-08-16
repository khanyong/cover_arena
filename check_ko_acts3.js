import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-vol4').single();
  if (data) {
    data.data.acts.forEach(a => {
      console.log(`Act ${a.number}: ${a.chapters.length} chapters`);
      a.chapters.forEach(c => {
        console.log(`  Chapter ${c.number}: title="${c.title}", paragraphs=${c.paragraphs?.length}, scenes=${c.scenes?.length}`);
      });
    });
  }
}
check();
