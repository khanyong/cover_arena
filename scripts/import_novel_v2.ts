import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Dynamically loading local ts module using tsx or standard TS execution
import { initialNovelData } from '../components/NovelPlatform/novelData';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const generateId = () => crypto.randomUUID();
const V_DATE = new Date().toISOString();

async function run() {
  const directory = path.join(process.cwd(), 'docs/novel_v2');
  const files = ['prologue.md', 'act0.md', 'act1.md', 'act2.md', 'act3.md', 'act4.md', 'epilogue.md'];

  const acts: any[] = [];
  let currentAct: any = null;
  let currentChapter: any = null;
  let currentScene: any = null;

  for (const filename of files) {
    const filepath = path.join(directory, filename);
    if (!fs.existsSync(filepath)) continue;

    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    let actNumber = acts.length; // auto increment acts
    let chapterNumber = 1;
    let sceneNumber = 1;
    
    currentAct = null;
    currentChapter = null;
    currentScene = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith('# ACT ') || line.startsWith('# PROLOGUE') || line.startsWith('# EPILOGUE')) {
        if (currentAct) continue; // Ignore duplicate ACT headers in the same file
        
        const title = line.replace(/^#\s*/, '').trim();
        currentAct = {
          number: actNumber,
          title: title,
          chapters: []
        };
        acts.push(currentAct);
        actNumber++;
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
           // fallback if a chapter is found before an act (e.g. prologue missing act header)
           currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] };
           acts.push(currentAct);
           actNumber++;
        }
        currentAct.chapters.push(currentChapter);
        chapterNumber++;
        sceneNumber = 1; // reset scene counter per chapter
        currentScene = null;
        continue;
      }

      if (line.startsWith('### ')) {
        const title = line.replace(/^###\s*/, '').replace(/^\[/, '').replace(/\]$/, '').trim();
        currentScene = {
          id: generateId(),
          number: sceneNumber,
          title: title,
          paragraphs: []
        };
        if (!currentChapter) {
           currentChapter = { number: chapterNumber, title: 'Unknown Chapter', scenes: [] };
           if (!currentAct) {
               currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] };
               acts.push(currentAct);
               actNumber++;
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
          // If we encounter text before a scene, create a default scene
          currentScene = {
              id: generateId(),
              number: sceneNumber,
              title: 'Opening',
              paragraphs: []
          };
          if (!currentChapter) {
             currentChapter = { number: chapterNumber, title: 'Opening Chapter', scenes: [] };
             if (!currentAct) {
                 currentAct = { number: actNumber, title: 'Opening Act', chapters: [] };
                 acts.push(currentAct);
                 actNumber++;
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
        activeVersion: 'v2.0',
        versions: {
          'v2.0': {
            version: 'v2.0',
            content: line,
            createdAt: V_DATE,
            author: 'Kwang Yong Yoo'
          }
        }
      });
    }
  }

  // Update original novel data with new acts
  initialNovelData.acts = acts;
  if (!initialNovelData.versionHistory.includes("v2.0")) {
      initialNovelData.versionHistory.push("v2.0");
  }
  initialNovelData.updatedAt = new Date().toISOString().split('T')[0];

  console.log(`Upserting novel data with ${acts.length} acts...`);

  const { data, error } = await supabase
    .from('novel_documents')
    .upsert({
      id: initialNovelData.id,
      slug: initialNovelData.slug,
      title: initialNovelData.title,
      data: initialNovelData
    }, { onConflict: 'slug' });

  if (error) {
    console.error('Failed to import novel data:', error);
  } else {
    console.log(`Successfully updated existing novel: ${initialNovelData.slug}`);
  }
}

run().catch(console.error);
