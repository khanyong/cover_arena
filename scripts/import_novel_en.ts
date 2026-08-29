import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { initialNovelData } from '../components/NovelPlatform/novelData';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

async function run() {
  const docsDir = path.join(process.cwd(), 'docs', 'novel_v2');
  const files = [
    'prologue.md',
    'act0.md',
    'act1.md',
    'act2.md',
    'act3.md',
    'act4.md',
    'epilogue.md',
    'appendix.md'
  ];

  const acts: any[] = [];
  const V_DATE = '2026-08-28 12:00';
  let chapterNumber = 1;
  let sceneNumber = 1;

  for (const filename of files) {
    const filepath = path.join(docsDir, filename);
    if (!fs.existsSync(filepath)) {
      console.warn(`File not found: ${filepath}`);
      continue;
    }
    
    let actNumber = acts.length; // auto increment acts
    if (filename === 'prologue.md') actNumber = 1;
    else if (filename === 'act0.md') actNumber = 2;
    else if (filename === 'act1.md') actNumber = 3;
    else if (filename === 'act2.md') actNumber = 4;
    else if (filename === 'act3.md') actNumber = 5;
    else if (filename === 'act4.md') actNumber = 6;
    else if (filename === 'epilogue.md') actNumber = 7;
    else if (filename === 'appendix.md') actNumber = 8;
    
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    
    let currentAct: any = null;
    let currentChapter: any = null;
    let currentScene: any = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith('# ACT ') || line.startsWith('# PROLOGUE') || line.startsWith('# EPILOGUE') || line.startsWith('# APPENDIX')) {
        if (currentAct) continue; // Ignore duplicate ACT headers in the same file
        
        const title = line.replace(/^#\s*/, '').trim();
        currentAct = {
          number: actNumber,
          title: title,
          chapters: []
        };
        acts.push(currentAct);
        chapterNumber = 1; // reset chapter counter per act
        currentChapter = null;
        currentScene = null;
        continue;
      }

      if (line.startsWith('## ')) {
        const title = line.replace(/^##\s*/, '').trim();
        currentChapter = {
          number: chapterNumber,
          title: title,
          scenes: []
        };
        if (!currentAct) {
           currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] };
           acts.push(currentAct);
        }
        currentAct.chapters.push(currentChapter);
        chapterNumber++;
        sceneNumber = 1; // reset scene counter per chapter
        currentScene = null;
        continue;
      }

      if (line.startsWith('### ')) {
         const title = line.replace(/^###\s*/, '').trim();
         currentScene = {
             id: generateId(),
             number: sceneNumber,
             title: title,
             paragraphs: []
         };
         if (!currentChapter) {
            currentChapter = { number: chapterNumber, title: 'Opening Chapter', scenes: [] };
            if (!currentAct) {
                currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] };
                acts.push(currentAct);
            }
            currentAct.chapters.push(currentChapter);
            chapterNumber++;
         }
         currentChapter.scenes.push(currentScene);
         sceneNumber++;
         continue;
      }

      // It's a paragraph
      if (!currentScene) {
          currentScene = {
              id: generateId(),
              number: sceneNumber,
              title: 'Opening',
              paragraphs: []
          };
          if (!currentChapter) {
             currentChapter = { number: chapterNumber, title: 'Opening Chapter', scenes: [] };
             if (!currentAct) {
                 currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] };
                 acts.push(currentAct);
             }
             currentAct.chapters.push(currentChapter);
             chapterNumber++;
          }
          currentChapter.scenes.push(currentScene);
          sceneNumber++;
      }

      const pid = generateId();
      currentScene.paragraphs.push({
        id: pid,
        activeVersion: 'v_en',
        versions: {
          'v_en': {
            version: 'v_en',
            content: line,
            createdAt: V_DATE,
            author: 'Kwang Yong Yoo'
          }
        }
      });
    }
  }

  // Fetch the current EN data to preserve metadata
  const { data: dbData, error: fetchErr } = await supabase.from('novel_documents').select('*').eq('id', 'quantum-vibration-novel-en').single();
  

  const enData = Object.assign({}, initialNovelData, { id: 'quantum-vibration-novel-en', slug: 'quantum-vibration-novel-en', title: dbData.title });
  enData.acts = acts;
  if (!enData.versionHistory.includes("v_en")) {
      enData.versionHistory.push("v_en");
  }
  enData.updatedAt = new Date().toISOString().split('T')[0];

  console.log(`Payload size: ${JSON.stringify(enData).length}`); console.log(`Upserting EN novel data with ${acts.length} acts...`);

  const { data, error } = await supabase
    .from('novel_documents')
    .upsert({ id: "quantum-vibration-novel-en", slug: "quantum-vibration-novel-en", title: dbData.title, data: enData })
    

  if (error) {
    console.error('Failed to import novel data:', error);
  } else {
    console.log(`Successfully updated existing novel: quantum-vibration-novel-en`);
  }
}

run().catch(console.error);
