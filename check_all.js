import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('novel_documents').select('slug, data');
  if (!data) return;
  for (const doc of data) {
    const act3 = doc.data.acts?.find(a => a.number === 3);
    const ch2 = act3?.chapters?.find(c => c.number === 2);
    if (ch2) {
      console.log(`[${doc.slug}] Act 3 Chapter 2 Scenes:`);
      console.log(ch2.scenes?.map(s => ({ id: s.id, number: s.number })));
    }
  }
}

check();
