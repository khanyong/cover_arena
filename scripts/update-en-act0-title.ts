import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  console.log('===========================================================');
  console.log('       UPDATING ENGLISH NOVEL ACT 0 TITLE TO ENGLISH       ');
  console.log('===========================================================\n');

  // 1. Fetch main English novel document
  const { data: mainDoc, error: mErr } = await supabase
    .from('novel_documents')
    .select('*')
    .eq('slug', 'quantum-vibration-novel-en')
    .single();

  if (mErr || !mainDoc) throw new Error(`Failed to fetch quantum-vibration-novel-en: ${mErr?.message}`);

  // Update Act 0 title in main document
  let updatedMainActs = false;
  if (mainDoc.data && Array.isArray(mainDoc.data.acts)) {
    mainDoc.data.acts = mainDoc.data.acts.map((act: any) => {
      if (act.title && (act.title.includes('제0막') || act.title.includes('ACT 0'))) {
        console.log(`Updating main document act title from "${act.title}" to "ACT 0: THE BROKEN VARIABLE"`);
        updatedMainActs = true;
        return {
          ...act,
          title: 'ACT 0: THE BROKEN VARIABLE'
        };
      }
      return act;
    });
  }

  if (updatedMainActs) {
    const { error: saveMainErr } = await supabase
      .from('novel_documents')
      .update({ data: mainDoc.data, updated_at: new Date().toISOString() })
      .eq('id', mainDoc.id);

    if (saveMainErr) throw new Error(`Failed to update main document: ${saveMainErr.message}`);
    console.log('Successfully updated quantum-vibration-novel-en acts list.');
  }

  // 2. Fetch fragmented Act 3 document for English
  const { data: act3Doc, error: aErr } = await supabase
    .from('novel_documents')
    .select('*')
    .eq('slug', 'quantum-vibration-novel-en-act-3')
    .single();

  if (aErr || !act3Doc) throw new Error(`Failed to fetch quantum-vibration-novel-en-act-3: ${aErr?.message}`);

  if (act3Doc.data) {
    console.log(`Updating act-3 document title from "${act3Doc.data.title}" to "ACT 0: THE BROKEN VARIABLE"`);
    act3Doc.data.title = 'ACT 0: THE BROKEN VARIABLE';

    // Also update chapter 1 title if it has Korean
    if (Array.isArray(act3Doc.data.chapters)) {
      act3Doc.data.chapters = act3Doc.data.chapters.map((ch: any) => {
        if (ch.title && ch.title.includes('제1장: 건축적 결함')) {
          console.log(`Updating chapter 1 title from "${ch.title}" to "Chapter 1: The Architectural Flaw"`);
          return {
            ...ch,
            title: 'Chapter 1: The Architectural Flaw'
          };
        }
        return ch;
      });
    }

    const { error: saveAct3Err } = await supabase
      .from('novel_documents')
      .update({ data: act3Doc.data, updated_at: new Date().toISOString() })
      .eq('id', act3Doc.id);

    if (saveAct3Err) throw new Error(`Failed to update act-3 document: ${saveAct3Err.message}`);
    console.log('Successfully updated quantum-vibration-novel-en-act-3 document.');
  }

  console.log('\n===========================================================');
  console.log('[SUCCESS] English Act 0 titles successfully updated to:');
  console.log('Act Title:       "ACT 0: THE BROKEN VARIABLE"');
  console.log('Chapter 1 Title: "Chapter 1: The Architectural Flaw"');
  console.log('===========================================================\n');
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
