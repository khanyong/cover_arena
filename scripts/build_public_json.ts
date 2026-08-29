import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

function generateId() {
  return crypto.randomUUID().substring(0, 8);
}

function run() {
  const docsDir = path.join(process.cwd(), 'docs', 'novel_v2');
  const files = ['title_page.md', 'prologue.md', 'act0.md', 'act1.md', 'act2.md', 'act3.md', 'act4.md', 'epilogue.md', 'appendix.md'];
  const acts: any[] = [];
  const V_DATE = '2026-08-28 12:00';
  let chapterNumber = 1;
  let sceneNumber = 1;

  for (const filename of files) {
    const filepath = path.join(docsDir, filename);
    if (!fs.existsSync(filepath)) continue;
    
    let actNumber = acts.length;
    if (filename === 'title_page.md') actNumber = 1;
    else if (filename === 'prologue.md') actNumber = 2;
    else if (filename === 'act0.md') actNumber = 3;
    else if (filename === 'act1.md') actNumber = 4;
    else if (filename === 'act2.md') actNumber = 5;
    else if (filename === 'act3.md') actNumber = 6;
    else if (filename === 'act4.md') actNumber = 7;
    else if (filename === 'epilogue.md') actNumber = 8;
    else if (filename === 'appendix.md') actNumber = 9;
    
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    let currentAct: any = null;
    let currentChapter: any = null;
    let currentScene: any = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('# ACT ') || line.startsWith('# PROLOGUE') || line.startsWith('# EPILOGUE') || line.startsWith('# APPENDIX')) {
        if (currentAct) continue;
        currentAct = { number: actNumber, title: line.replace(/^#\s*/, '').trim(), chapters: [] };
        acts.push(currentAct);
        chapterNumber = 1; currentChapter = null; currentScene = null;
        continue;
      }
      if (line.startsWith('## ')) {
        currentChapter = { number: chapterNumber, title: line.replace(/^##\s*/, '').trim(), scenes: [] };
        if (!currentAct) { currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] }; acts.push(currentAct); }
        currentAct.chapters.push(currentChapter);
        chapterNumber++; sceneNumber = 1; currentScene = null;
        continue;
      }
      if (line.startsWith('### ')) {
         currentScene = { id: generateId(), number: sceneNumber, title: line.replace(/^###\s*/, '').trim(), paragraphs: [] };
         if (!currentChapter) {
            currentChapter = { number: chapterNumber, title: 'Opening Chapter', scenes: [] };
            if (!currentAct) { currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] }; acts.push(currentAct); }
            currentAct.chapters.push(currentChapter); chapterNumber++;
         }
         currentChapter.scenes.push(currentScene); sceneNumber++;
         continue;
      }
      if (!currentScene) {
          currentScene = { id: generateId(), number: sceneNumber, title: 'Opening', paragraphs: [] };
          if (!currentChapter) {
             currentChapter = { number: chapterNumber, title: 'Opening Chapter', scenes: [] };
             if (!currentAct) { currentAct = { number: actNumber, title: 'Unknown Act', chapters: [] }; acts.push(currentAct); }
             currentAct.chapters.push(currentChapter); chapterNumber++;
          }
          currentChapter.scenes.push(currentScene); sceneNumber++;
      }
      currentScene.paragraphs.push({
        id: generateId(),
        activeVersion: 'v_en',
        versions: { 'v_en': { version: 'v_en', content: line, createdAt: V_DATE, author: 'Kwang Yong Yoo' } }
      });
    }
  }

  // Build full payload
  const enData = {
    id: 'quantum-vibration-novel-en',
    slug: 'quantum-vibration-novel-en',
    title: '[EN] The Resonance of Space: Architects of Spacetime',
    author: 'Kwang Yong Yoo',
    synopsis: '',
    versionHistory: ['v_en'],
    updatedAt: new Date().toISOString().split('T')[0],
    characters: [],
    locations: [],
    acts: acts
  };

  const outPath = path.join(process.cwd(), 'public', 'quantum-vibration-novel-en.json');
  fs.writeFileSync(outPath, JSON.stringify({ id: enData.id, slug: enData.slug, title: enData.title, data: enData }));
  console.log('Successfully wrote to ' + outPath);
}

run();
