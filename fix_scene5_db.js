import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fix() {
  const { data, error } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  if (error || !data) {
    console.error("Error fetching data:", error);
    return;
  }
  
  const novel = data.data;
  const act5 = novel.acts.find(a => a.number === 5);
  const ch2 = act5.chapters.find(c => c.number === 2);
  const s4 = ch2.scenes.find(s => s.number === 4);
  
  if (s4 && s4.paragraphs.length > 1) {
    // Extract paragraph 1 (which is the second paragraph)
    const paraToMove = s4.paragraphs[1];
    
    // Remove it from Scene 4
    s4.paragraphs = [s4.paragraphs[0]];
    
    // Create new Scene 5
    const s5 = {
      id: 'scene-' + crypto.randomUUID(),
      number: 5,
      title: '새 장면',
      paragraphs: [paraToMove]
    };
    
    // Add to scenes array
    ch2.scenes.push(s5);
    
    // Ensure scene numbers are correct
    ch2.scenes.forEach((s, idx) => s.number = idx + 1);
    
    // Save to DB
    const { error: updateError } = await supabase.from('novel_documents').update({ data: novel }).eq('slug', 'quantum-vibration-novel-en');
    if (updateError) {
      console.error("Error updating DB:", updateError);
    } else {
      console.log("Successfully extracted Scene 5!");
    }
  } else {
    console.log("Scene 4 does not have multiple paragraphs, or Scene 4 not found.");
  }
}
fix();
