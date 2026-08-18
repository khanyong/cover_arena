import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  data.data.acts.forEach(a => {
    console.log(`Act number ${a.number}: ${a.title}`);
    a.chapters.forEach(c => {
      console.log(`  Ch number ${c.number}: ${c.title}`);
    });
  });
}
check();
