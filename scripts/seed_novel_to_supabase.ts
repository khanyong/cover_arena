import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log('Seeding novel data to Supabase...');
  
  // We dynamically import the ts file using a simple hack or just use fetch if we have an API. 
  // Let's use the local file. Wait, node can't easily require a ts file that uses ES imports.
  // Instead, I'll just write a quick script that uses ts-node or tsx.
  const { initialNovelData } = await import('../components/NovelPlatform/novelData');
  
  const { data, error } = await supabase
    .from('novel_documents')
    .upsert({
      id: initialNovelData.id,
      slug: initialNovelData.slug,
      title: initialNovelData.title,
      data: initialNovelData
    }, { onConflict: 'slug' });

  if (error) {
    console.error('Failed to seed novel data:', error);
  } else {
    console.log('Successfully seeded novel data to Supabase!');
  }
}

seedData();
