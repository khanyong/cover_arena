import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  const act3 = data.data.acts.find(a => a.number === 3);
  console.log("Act 3 Title:", act3.title);
  const ch2 = act3.chapters.find(c => c.number === 2);
  console.log("Chapter 2 Title:", ch2.title);
}
check();
