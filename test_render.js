import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getSceneTitle(scene, customVersionMap) {
  if (scene.title) return scene.title;
  
  if (scene.paragraphs && scene.paragraphs.length > 0) {
    const firstParagraph = scene.paragraphs[0];
    const versionKey = customVersionMap ? customVersionMap[firstParagraph.id] : undefined;
    const activeVerKey = versionKey || firstParagraph.activeVersion;
    const versionData = firstParagraph.versions[activeVerKey];
    const text = (versionData ? versionData.content : '').trim();
    
    if (text) {
      let firstLine = text.split('\n')[0].trim();
      firstLine = firstLine.replace(/^#+\s*/, '').trim();
      firstLine = firstLine.replace(/^\[(.*?)\]$/, '$1').trim();
      const sentenceMatch = firstLine.match(/^.*?[.?!](?:\s|$)/);
      let title = firstLine;
      if (title.length > 50 && sentenceMatch) {
         title = sentenceMatch[0].trim();
      }
      if (title.length > 40) {
        title = title.substring(0, 40) + '...';
      }
      if (title) return title;
    }
  }
  return `SCENE ${scene.number}`;
}

async function check() {
  const { data } = await supabase.from('novel_documents').select('data').eq('slug', 'quantum-vibration-novel-en').single();
  if (data) {
    const act3 = data.data.acts.find(a => a.number === 3);
    const ch2 = act3.chapters.find(c => c.number === 2);
    
    console.log("--- Left TOC ---");
    ch2.scenes.forEach(scene => {
      console.log(`🎬 ${getSceneTitle(scene)}`);
    });
    
    console.log("\n--- Right Pane ---");
    ch2.scenes.forEach(scene => {
      console.log(`Header: ${getSceneTitle(scene)}`);
    });
  }
}
check();
