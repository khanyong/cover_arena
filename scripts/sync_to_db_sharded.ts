import * as fs from 'fs';
import * as path from 'path';
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

async function syncFileToDB(filePath: string, slug: string) {
  console.log(`\nProcessing ${filePath} -> slug: ${slug}`);
  const dataRaw = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
  let novelDetails;
  try {
    const parsed = JSON.parse(dataRaw);
    novelDetails = parsed.data || parsed;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return;
  }

  const fullActs = novelDetails.acts || [];
  
  const mainNovel = {
    ...novelDetails,
    slug: slug, // ensure slug matches target
    acts: fullActs.map((act: any) => ({
      id: act.id,
      number: act.number,
      title: act.title,
      synopsis: act.synopsis || ''
    }))
  };

  console.log("Saving main novel stub...");
  const { error: mainError } = await supabase
    .from('novel_documents')
    .upsert({ 
      id: slug,
      slug: slug,
      title: mainNovel.title,
      data: mainNovel,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    
  if (mainError) {
    console.error("Main novel save error:", mainError);
    return;
  }

  console.log(`Main novel saved. Syncing ${fullActs.length} Acts...`);
  
  if (fullActs.length > 0) {
    for (const act of fullActs) {
      const actSlug = `${slug}-act-${act.number}`;
      console.log(`  - Saving Act ${act.number} (${actSlug})`);
      
      const { error: actError } = await supabase
        .from('novel_documents')
        .upsert({
          id: actSlug,
          slug: actSlug,
          title: `${mainNovel.title} - Act ${act.number}`,
          data: act,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        
      if (actError) {
         console.error(`  Error saving act ${act.number}:`, actError);
      }
    }
  }
  
  console.log("Sync complete for", slug);
}

async function run() {
  // Sync English
  if (fs.existsSync(path.join(process.cwd(), 'public/quantum-vibration-novel-en.json'))) {
     await syncFileToDB('public/quantum-vibration-novel-en.json', 'quantum-vibration-novel-en');
  } else {
     console.log("English JSON not found.");
  }
  
  // Try to sync Korean if we generated it, or use the older one?
  if (fs.existsSync(path.join(process.cwd(), 'public/quantum-vibration-novel.json'))) {
     await syncFileToDB('public/quantum-vibration-novel.json', 'quantum-vibration-novel');
  }
}

run().catch(console.error);
