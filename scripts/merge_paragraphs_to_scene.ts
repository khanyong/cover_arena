import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Fetching all acts from DB...");
  const { data: rows, error } = await supabase
    .from('novel_documents')
    .select('id, slug, title, data')
    .like('id', '%-act-%');

  if (error || !rows) {
    console.error("Error fetching rows:", error);
    return;
  }

  console.log(`Found ${rows.length} act rows. Merging paragraphs...`);

  for (const row of rows) {
    const actData = row.data;
    if (!actData || !actData.chapters) continue;

    let modified = false;

    for (const ch of actData.chapters) {
      if (!ch.scenes) continue;
      
      for (const scene of ch.scenes) {
        if (scene.paragraphs && scene.paragraphs.length > 1) {
          // Merge all paragraphs into the first one
          const mergedParagraph = scene.paragraphs[0];
          const activeVer = mergedParagraph.activeVersion || Object.keys(mergedParagraph.versions)[0] || 'v1.0';
          
          let mergedContent = mergedParagraph.versions[activeVer]?.content || '';
          
          for (let i = 1; i < scene.paragraphs.length; i++) {
            const p = scene.paragraphs[i];
            const pVer = p.activeVersion || Object.keys(p.versions)[0];
            const pContent = p.versions[pVer]?.content || '';
            mergedContent += '\n\n' + pContent;
          }
          
          mergedParagraph.versions[activeVer].content = mergedContent;
          
          // Keep only the merged paragraph
          scene.paragraphs = [mergedParagraph];
          modified = true;
        }
      }
    }

    if (modified) {
      console.log(`Updating ${row.id}...`);
      const { error: updateError } = await supabase
        .from('novel_documents')
        .update({ data: actData, updated_at: new Date().toISOString() })
        .eq('id', row.id);
        
      if (updateError) {
        console.error(`Failed to update ${row.id}:`, updateError);
      } else {
        console.log(`Successfully merged ${row.id}`);
      }
    } else {
       console.log(`No merge needed for ${row.id}`);
    }
  }

  console.log("Done.");
}

run().catch(console.error);
