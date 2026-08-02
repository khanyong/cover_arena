import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getPrologueFirstParagraph() {
  const { data, error } = await supabase
    .from('novel_documents')
    .select('data')
    .eq('slug', 'quantum-vibration-novel')
    .single();

  if (error || !data) {
    console.error("Error fetching novel:", error);
    return;
  }

  const novel = data.data;
  
  // Find Prologue (Act 0), Chapter 1, Paragraph 1
  const prologueAct = novel.acts.find(a => a.number === 0);
  const chapter1 = prologueAct.chapters[0];
  const firstParagraph = chapter1.paragraphs[0];

  console.log("=== FIRST PARAGRAPH ===");
  console.log("ID:", firstParagraph.id);
  console.log("Active Version:", firstParagraph.activeVersion);
  
  const content = firstParagraph.versions[firstParagraph.activeVersion].content;
  console.log("\n--- CONTENT ---");
  console.log(content);
  
  console.log("\n--- AI PROMPT ---");
  console.log(firstParagraph.aiPrompt || "No prompt found.");
}

getPrologueFirstParagraph();
