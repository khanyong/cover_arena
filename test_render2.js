import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';

const novelDataCode = fs.readFileSync('/Users/M2proMini/Documents/khanyong_projects/components/NovelPlatform/novelData.ts', 'utf8');
const getParagraphTextMatch = novelDataCode.match(/export function getParagraphText[\s\S]*?^}/m);
const getSceneTitleMatch = novelDataCode.match(/export function getSceneTitle[\s\S]*?^}/m);

// A simple eval environment
const context = `
  ${getParagraphTextMatch[0].replace('export ', '')}
  ${getSceneTitleMatch[0].replace('export ', '')}
  
  module.exports = { getSceneTitle };
`;
fs.writeFileSync('/Users/M2proMini/Documents/khanyong_projects/eval_helper.js', context);

const { getSceneTitle } = require('/Users/M2proMini/Documents/khanyong_projects/eval_helper.js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  if (data) {
    const act3 = data.data.acts.find(a => a.number === 3);
    const ch2 = act3.chapters.find(c => c.number === 2);
    
    console.log("--- Left TOC Titles ---");
    ch2.scenes.forEach(scene => {
      console.log(`🎬 ${getSceneTitle(scene)}`);
    });
  }
}
check();
