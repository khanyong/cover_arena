import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  // Fix Book 2 EN
  let vol2en = novels.find(n => n.id === 'quantum-vibration-vol2-en');
  if (vol2en) {
    let data = { ...vol2en.data, slug: 'quantum-vibration-vol2-en' };
    await supabase.from('novel_documents').update({ data: data }).eq('id', 'quantum-vibration-vol2-en');
    console.log("Fixed Book 2 EN slug");
  }

  // Fix Book 3 EN
  let vol3en = novels.find(n => n.id === 'quantum-vibration-vol3-en');
  if (vol3en) {
    let data = { ...vol3en.data, slug: 'quantum-vibration-vol3-en' };
    await supabase.from('novel_documents').update({ data: data }).eq('id', 'quantum-vibration-vol3-en');
    console.log("Fixed Book 3 EN slug");
  }

  // Check
  const { data: n2 } = await supabase.from('novel_documents').select('*');
  console.log(JSON.stringify(n2.map(n => ({ id: n.id, data_slug: n.data.slug, title: n.data.title })), null, 2));
}

main().catch(console.error);
