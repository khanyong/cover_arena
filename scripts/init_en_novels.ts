import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

async function initEnNovels() {
  console.log("Fetching existing novels...");
  const { data: novels, error } = await supabase
    .from('novel_documents')
    .select('id, slug, title, data');

  if (error) {
    console.error("Error fetching novels:", error);
    return;
  }

  if (!novels) {
    console.log("No novels found.");
    return;
  }

  // Filter only korean novels (those without -en)
  const koNovels = novels.filter(n => !n.slug.endsWith('-en'));

  console.log(`Found ${koNovels.length} Korean novels to duplicate.`);

  for (const novel of koNovels) {
    const enSlug = `${novel.slug}-en`;
    
    // Check if it already exists
    const { data: existing } = await supabase
      .from('novel_documents')
      .select('id')
      .eq('id', enSlug)
      .single();

    if (existing) {
      console.log(`English version for ${novel.slug} already exists. Skipping.`);
      continue;
    }

    const enTitle = `[EN] ${novel.title}`;
    
    // Deep copy the JSON data
    const enData = JSON.parse(JSON.stringify(novel.data));
    enData.id = enSlug;
    enData.slug = enSlug;
    enData.title = enTitle;
    
    console.log(`Creating English version: ${enSlug}`);
    const { error: insertError } = await supabase
      .from('novel_documents')
      .insert([
        {
          id: enSlug,
          slug: enSlug,
          title: enTitle,
          data: enData
        }
      ]);

    if (insertError) {
      console.error(`Error inserting ${enSlug}:`, insertError);
    } else {
      console.log(`Successfully created ${enSlug}`);
    }
  }

  console.log("Migration complete.");
}

initEnNovels();
