import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-vol4').single();
  if (data) {
    for (const act of data.data.acts) {
      console.log(`Act ${act.number}:`);
      for (const ch of act.chapters) {
        console.log(`  Chapter ${ch.number}: ${ch.scenes?.length || 0} scenes`);
      }
    }
  }
}

check();
