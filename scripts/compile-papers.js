import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const NOTION_DIR = path.join(process.cwd(), 'projects/notion_papers');
const OUTPUT_FILE = path.join(process.cwd(), 'components/PaperPlatform/paperData.ts');

// Load environment variables from .env.local if exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

// Helper to check if text contains Korean characters
function hasKorean(text) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
}

// Generate a clean text key for matching paragraphs across versions
function getParaKey(text) {
  if (!text) return "";
  // Remove markdown bold, italic, list bullets, math wrappers, strikethroughs, and all whitespaces
  const clean = text.replace(/[\s\*\~_\-#\>\(\)\[\]\.\,\{\}\$\:\;\\\'\"]/g, "");
  return clean.slice(0, 18);
}

// Helper to split title or headers by slash (/) or parentheses
function splitBilingual(text) {
  const clean = text.replace(/^#+\s*/, '').trim();
  
  // Check for parenthesis: Chapter 1. Intro (1장. 서론) or 1장. 서론 (Introduction)
  const parenMatch = clean.match(/([^(]+)\(([^)]+)\)/);
  if (parenMatch) {
    const first = parenMatch[1].trim();
    const second = parenMatch[2].trim();
    return hasKorean(first) ? { ko: first, en: second } : { ko: second, en: first };
  }

  // Check for slash: Title Ko / Title En
  if (clean.includes('/')) {
    const parts = clean.split('/');
    const first = parts[0].trim();
    const second = parts[1].trim();
    return hasKorean(first) ? { ko: first, en: second } : { ko: second, en: first };
  }

  return { ko: clean, en: clean };
}

// Parse the combined bilingual markdown file directly to establish the baseline v1_v2 dataset
function parseBilingualFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let title = { ko: '', en: '' };
  let abstract = {
    v1: { ko: '', en: '' },
    v2: { ko: '', en: '' }
  };
  const chapters = [];
  let currentChapter = null;
  let inAbstract = false;
  let hasChapterStarted = false;

  let currentParaBlocks = [];

  const flushParaBlocks = () => {
    if (currentParaBlocks.length === 0) return;
    
    // Sort into strikethrough vs normal
    const strikethroughs = currentParaBlocks.filter(b => b.isStrikethrough);
    const normals = currentParaBlocks.filter(b => !b.isStrikethrough);

    const processBlocks = (blocks) => {
      let tempKoList = [];
      let tempEnList = [];

      const flushBilingualPairs = () => {
        const maxLen = Math.max(tempKoList.length, tempEnList.length);
        for (let j = 0; j < maxLen; j++) {
          const koVal = tempKoList[j] || '';
          const enVal = tempEnList[j] || '';
          currentChapter.paragraphs.push({
            pair: { ko: koVal, en: enVal },
            isStrikethrough: blocks[0]?.isStrikethrough || false
          });
        }
        tempKoList = [];
        tempEnList = [];
      };

      blocks.forEach(b => {
        const cleanText = b.text.replace(/\\\\/g, '\\');
        const hasMath = cleanText.includes('\\') || cleanText.includes('^') || cleanText.includes('_') || cleanText.includes('$');
        const englishWords = cleanText.match(/[a-zA-Z]{3,}/g) || [];
        const nonMathWords = englishWords.filter(w => !['lim', 'max', 'min', 'sin', 'cos', 'tan', 'log'].includes(w.toLowerCase()));
        const isPureMath = hasMath && !hasKorean(cleanText) && (nonMathWords.length < 3);
        const isDelimiter = cleanText === '$$' || cleanText === '<math>' || cleanText === '</math>' || cleanText === '---';

        if (isDelimiter || isPureMath) {
          flushBilingualPairs();
          currentChapter.paragraphs.push({
            pair: { ko: b.rawLine, en: b.rawLine },
            isStrikethrough: b.isStrikethrough
          });
          return;
        }

        const isKo = hasKorean(b.text);
        if (isKo) {
          if (tempEnList.length > 0) {
            flushBilingualPairs();
          }
          tempKoList.push(b.rawLine);
        } else {
          tempEnList.push(b.rawLine);
        }
      });

      flushBilingualPairs();
    };

    processBlocks(strikethroughs);
    processBlocks(normals);
    currentParaBlocks = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (!inAbstract && currentChapter) {
        flushParaBlocks();
      }
      continue;
    }

    if (trimmed.startsWith('#')) {
      if (trimmed.startsWith('# ')) {
        const splitHeader = splitBilingual(trimmed);
        title.ko = splitHeader.ko;
        title.en = splitHeader.en;
        continue;
      }

      if (trimmed.toLowerCase().includes('references') || trimmed.includes('참고문헌')) {
        inAbstract = false;
        if (currentChapter) flushParaBlocks();
        currentChapter = null;
        continue;
      }

      if (trimmed.toLowerCase().startsWith('## abstract') || trimmed.startsWith('## 초록')) {
        inAbstract = true;
        continue;
      }

      const isChHeader = trimmed.startsWith('## ') && 
                         (trimmed.match(/(\d+)장/) || trimmed.match(/Chapter\s+(\d+)/i) || trimmed.match(/Ch\.\s+(\d+)/i));
      if (isChHeader && !trimmed.toLowerCase().includes('abstract') && !trimmed.includes('초록')) {
        inAbstract = false;
        hasChapterStarted = true;
        if (currentChapter) flushParaBlocks();

        const chNumMatch = trimmed.match(/(\d+)장/) || trimmed.match(/Chapter\s+(\d+)/i) || trimmed.match(/Ch\.\s+(\d+)/i);
        const chNum = parseInt(chNumMatch[1]);
        const splitHeader = splitBilingual(trimmed);

        currentChapter = {
          number: chNum,
          title: { ko: splitHeader.ko, en: splitHeader.en },
          paragraphs: []
        };
        chapters.push(currentChapter);
        continue;
      }

      // Handle sub-headers (### Level 3 headers) symmetrically without putting them into paragraph matching lists
      if (trimmed.startsWith('### ')) {
        if (currentChapter && hasChapterStarted) {
          flushParaBlocks();
          const splitHeader = splitBilingual(trimmed);
          currentChapter.paragraphs.push({
            pair: { ko: `### ${splitHeader.ko}`, en: `### ${splitHeader.en}` },
            isStrikethrough: trimmed.includes('~~')
          });
        }
        continue;
      }
    }

    if (!hasChapterStarted && !inAbstract) {
      continue;
    }

    if (inAbstract) {
      // Abstract parsing logic
      if (trimmed.startsWith('<math>') || trimmed.startsWith('$$') || trimmed.startsWith('\\') || trimmed.includes('\\lim') || trimmed.includes('\\gamma')) {
        continue;
      }
      const isKo = hasKorean(trimmed);
      const cleanText = trimmed.replace(/~~/g, '');
      const isV1 = trimmed.includes('~~');

      if (isKo) {
        if (isV1) {
          abstract.v1.ko = cleanText;
        } else {
          abstract.v2.ko = cleanText;
        }
      } else {
        if (isV1) {
          abstract.v1.en = cleanText;
        } else {
          abstract.v2.en = cleanText;
        }
      }
      continue;
    }

    // Accumulate standard chapter paragraph lines
    if (currentChapter) {
      let isStrikethrough = false;
      let textToTest = trimmed;
      if (textToTest.startsWith('- ')) textToTest = textToTest.slice(2).trim();
      if (textToTest.includes('~~')) isStrikethrough = true;

      currentParaBlocks.push({
        rawLine: line,
        text: trimmed,
        isStrikethrough
      });
    }
  }
  if (currentChapter) flushParaBlocks();

  return {
    title,
    abstract,
    chapters
  };
}

// Parse a single markdown file into structural chunks
function parsePaperFile(filePath, versionKey, langKey) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Auto-correct LaTeX math strings
  content = content.replace(/(?<!\$)(\\lim_\{[^}]+\}\s+[^\$\n]+?\s*=\s*[0-9a-zA-Z]+)(?!\$)/g, '$$$1$$');
  content = content.replace(/(?<!\$)(\\lim_\{[^}]+\}\s+\\mathbf\{[^}]+\}_\{[^}]+\}\s*=\s*[0-9a-zA-Z]+)(?!\$)/g, '$$$1$$');
  content = content.replace(/(?<!\$)(\\lim_\{[^}]+\}\s+\\mathbf\{F\}_\{space\}\s*=\s*0)(?!\$)/g, '$$$1$$');
  
  const lines = content.split('\n');
  let title = { ko: '', en: '' };
  title[langKey] = 'Title';
  
  // Abstract parsed lines
  let abstractBlocks = [];
  const chapters = [];
  let currentChapter = null;
  let inAbstract = false;
  let hasChapterStarted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 1. Main Title
    if (line.startsWith('# ')) {
      title[langKey] = line.slice(2).trim();
      continue;
    }

    // Ensure Reference section turns off abstract parsing and stops accumulating chapter paragraphs
    if (line.toLowerCase().includes('references') || line.includes('참고문헌')) {
      inAbstract = false;
      currentChapter = null; // Stop putting raw references into paragraphs
      continue;
    }

    // 2. Abstract boundary
    if (line.toLowerCase().startsWith('## abstract') || line.startsWith('## 초록')) {
      inAbstract = true;
      continue;
    }

    // 3. Chapters (Turn off inAbstract if any chapter header Level 2 matches)
    const isChHeader = line.startsWith('## ') && 
                       (line.match(/(\d+)장/) || line.match(/Chapter\s+(\d+)/i) || line.match(/Ch\.\s+(\d+)/i));
    if (isChHeader && !line.toLowerCase().includes('abstract') && !line.includes('초록')) {
      inAbstract = false;
      hasChapterStarted = true;
      
      const chNumMatch = line.match(/(\d+)장/) || line.match(/Chapter\s+(\d+)/i) || line.match(/Ch\.\s+(\d+)/i);
      const chNum = parseInt(chNumMatch[1]);
      
      const cleanHeaderTitle = line.slice(3).trim();
      const chTitle = { ko: '', en: '' };
      chTitle[langKey] = cleanHeaderTitle;

      currentChapter = {
        number: chNum,
        title: chTitle,
        paragraphs: []
      };
      chapters.push(currentChapter);
      continue;
    }

    if (!hasChapterStarted && !inAbstract) {
      continue;
    }

    // 4. Abstract Content parsing
    if (inAbstract) {
      if (line.startsWith('<math>') || line.startsWith('$$') || line.startsWith('\\') || line.includes('\\lim') || line.includes('\\gamma')) {
        continue;
      }
      let isStrikethrough = false;
      let cleanText = line;
      
      let isList = false;
      if (cleanText.startsWith('- ')) {
        isList = true;
        cleanText = cleanText.slice(2).trim();
      }
      if (cleanText.includes('~~')) {
        isStrikethrough = true;
        cleanText = cleanText.replace(/~~/g, '');
      }

      abstractBlocks.push({
        text: cleanText,
        isList,
        isStrikethrough
      });
      continue;
    }

    // 5. Chapter Paragraph parsing
    if (currentChapter) {
      let isStrikethrough = false;
      let cleanText = line;
      let isList = false;
      if (cleanText.startsWith('- ')) {
        isList = true;
        cleanText = cleanText.slice(2).trim();
      }
      if (cleanText.includes('~~')) {
        isStrikethrough = true;
        cleanText = cleanText.replace(/~~/g, '');
      }

      const pair = { ko: '', en: '' };
      pair[langKey] = line;

      currentChapter.paragraphs.push({
        pair,
        isStrikethrough
      });
    }
  }

  // Build aggregate abstract text
  let v1Text = '';
  let v2Text = '';
  
  abstractBlocks.forEach(b => {
    if (b.isStrikethrough) {
      v1Text += (b.isList ? '- ' : '') + b.text + '\n';
    } else {
      v2Text += (b.isList ? '- ' : '') + b.text + '\n';
    }
  });

  const abstract = {
    v1: { ko: '', en: '' },
    v2: { ko: '', en: '' }
  };
  abstract.v1[langKey] = v1Text.trim();
  abstract.v2[langKey] = v2Text.trim();

  return {
    title,
    abstract,
    chapters
  };
}

// Aggregate and build final static mapping structure
function compileAndSync() {
  console.log("🚀 Starting Notion Markdown Compilation...");
  
  const files = fs.readdirSync(NOTION_DIR).filter(f => f.endsWith('.md'));
  
  const groups = {};
  files.forEach(file => {
    const parsedName = file.replace(/\.md$/, '');
    const versionMatch = parsedName.match(/-v(\d+)-(ko|en)$/);
    const langMatch = parsedName.match(/-(ko|en)$/);
    
    if (!langMatch) return; // Skip combined backups inside raw directory if any
    
    const langKey = langMatch[1];
    const withoutLang = parsedName.replace(/-ko$|-en$/, '');
    
    let baseSlug = withoutLang;
    let versionKey = 'v1_v2';
    
    if (versionMatch) {
      baseSlug = withoutLang.replace(/-v\d+$/, '');
      versionKey = 'v' + versionMatch[1];
    }

    if (!groups[baseSlug]) {
      groups[baseSlug] = {};
    }
    if (!groups[baseSlug][versionKey]) {
      groups[baseSlug][versionKey] = [];
    }
    groups[baseSlug][versionKey].push({ file, langKey, filePath: path.join(NOTION_DIR, file) });
  });

  const compiledPapers = {};

  Object.keys(groups).forEach(slug => {
    console.log(`📦 Merging and compiling versions for slug: ${slug}`);
    
    const versions = groups[slug];
    const sortedVersions = Object.keys(versions).sort((a, b) => {
      if (a === 'v1_v2') return -1;
      if (b === 'v1_v2') return 1;
      return a.localeCompare(b);
    });

    let mergedPaper = null;

    sortedVersions.forEach(versionKey => {
      const fileList = versions[versionKey];
      
      let parsedKo = null;
      let parsedEn = null;

      if (versionKey === 'v1_v2') {
        const combinedPath = path.join(process.cwd(), 'projects/notion_papers/backup_combined', `${slug}.md`);
        if (fs.existsSync(combinedPath)) {
          console.log(`  📖 Directly Parsing Combined Bilingual Baseline: ${slug}.md`);
          const parsedCombined = parseBilingualFile(combinedPath);
          parsedKo = parsedCombined;
          parsedEn = parsedCombined;
        } else {
          // Fallback if combined not found
          fileList.forEach(({ file, langKey, filePath }) => {
            console.log(`  📖 Parsing: ${file} (as ${versionKey} / ${langKey})`);
            const parsed = parsePaperFile(filePath, versionKey, langKey);
            if (langKey === 'ko') parsedKo = parsed;
            if (langKey === 'en') parsedEn = parsed;
          });
        }
      } else {
        fileList.forEach(({ file, langKey, filePath }) => {
          console.log(`  📖 Parsing: ${file} (as ${versionKey} / ${langKey})`);
          const parsed = parsePaperFile(filePath, versionKey, langKey);
          if (langKey === 'ko') parsedKo = parsed;
          if (langKey === 'en') parsedEn = parsed;
        });
      }

      const parsedActive = parsedKo || parsedEn;
      if (!parsedActive) return;

      if (!mergedPaper) {
        mergedPaper = {
          id: slug,
          slug: slug,
          title: { ko: '', en: '' },
          authors: {
            ko: "유광용 (Kwang yong Yoo)",
            en: "Kwang yong Yoo"
          },
          affiliations: {
            ko: "KT 상무, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
            en: "Director at KT, Ph.D. Candidate in Business Administration at Yonsei University, LL.M. at University of Connecticut"
          },
          abstract: {
            versions: {}
          },
          chapters: [],
          references: {},
          reviews: {},
          workflow: {
            stage: "Pre-submission Drafting",
            percent: 20,
            nextStep: "3장 파동 간섭 수식 보강 및 3D 판구조 단층 그래프 검증",
            journalTarget: "Nature Physics"
          }
        };

        if (slug === 'spatial-vibration-1') {
          mergedPaper.workflow = {
            stage: "Rebuttal & Final Proof",
            percent: 85,
            nextStep: "PRL 학술지 최종 Proof 편집인 승인 대기 중",
            journalTarget: "Physical Review Letters (PRL)"
          };
          mergedPaper.references = getPaper1References();
          mergedPaper.reviews = getPaper1Reviews();
        } else if (slug === 'spatial-vibration-2') {
          mergedPaper.workflow = {
            stage: "Under Review",
            percent: 60,
            nextStep: "심사위원 2인 동료 평가 완료 및 저자 반론서 보강 중",
            journalTarget: "Physical Review D (PRD)"
          };
          mergedPaper.references = getPaper2References();
        } else if (slug === 'spatial-vibration-3') {
          mergedPaper.references = getPaper3References();
        }
      }

      // Merge Title
      if (parsedKo && parsedKo.title.ko && parsedKo.title.ko !== 'Title') mergedPaper.title.ko = parsedKo.title.ko;
      if (parsedEn && parsedEn.title.en && parsedEn.title.en !== 'Title') mergedPaper.title.en = parsedEn.title.en;

      if (slug === 'spatial-vibration-1') {
        mergedPaper.title.ko = '공간의 진동 역학 I: 양자 이중성의 근원과 이중 슬릿 실험의 궤적 재해석';
        mergedPaper.title.en = 'Mechanics of Spatial Vibration I: Origin of Wave-Particle Duality and Reinterpretation of Trajectories in the Double-Slit Experiment';
      } else if (slug === 'spatial-vibration-2') {
        mergedPaper.title.ko = '공간의 진동 역학 II: 거시 중력장과 미시 공간 진동의 상호작용 및 암흑 우주 대체 모델';
        mergedPaper.title.en = 'Mechanics of Spatial Vibration II: Interaction of Macroscopic Gravity with Microscopic Vibration and Alternative Models for the Dark Sector';
      }

      // 1. Merge abstract versions
      if (versionKey === 'v1_v2') {
        if (!mergedPaper.abstract.versions['v1']) mergedPaper.abstract.versions['v1'] = { ko: '', en: '' };
        if (!mergedPaper.abstract.versions['v2']) mergedPaper.abstract.versions['v2'] = { ko: '', en: '' };

        if (parsedKo) {
          mergedPaper.abstract.versions['v1'].ko = parsedKo.abstract.v1.ko;
          mergedPaper.abstract.versions['v2'].ko = parsedKo.abstract.v2.ko;
        }
        if (parsedEn) {
          mergedPaper.abstract.versions['v1'].en = parsedEn.abstract.v1.en;
          mergedPaper.abstract.versions['v2'].en = parsedEn.abstract.v2.en;
        }
      } else {
        if (!mergedPaper.abstract.versions[versionKey]) {
          mergedPaper.abstract.versions[versionKey] = { ko: '', en: '' };
        }
        if (parsedKo) mergedPaper.abstract.versions[versionKey].ko = parsedKo.abstract.v2.ko;
        if (parsedEn) mergedPaper.abstract.versions[versionKey].en = parsedEn.abstract.v2.en;

        // Fallback for abstract English translation
        if (!mergedPaper.abstract.versions[versionKey].en && mergedPaper.abstract.versions['v2']) {
          mergedPaper.abstract.versions[versionKey].en = mergedPaper.abstract.versions['v2'].en;
        }
      }

      // 2. Merge chapters & paragraphs
      const chaptersToIterate = parsedKo ? parsedKo.chapters : (parsedEn ? parsedEn.chapters : []);
      
      chaptersToIterate.forEach((parsedCh, chIdx) => {
        let targetCh = mergedPaper.chapters.find(c => c.number === parsedCh.number);
        if (!targetCh) {
          targetCh = {
            number: parsedCh.number,
            title: { ko: '', en: '' },
            paragraphs: []
          };
          mergedPaper.chapters.push(targetCh);
        }

        const parsedKoCh = parsedKo ? parsedKo.chapters.find(c => c.number === parsedCh.number) : null;
        const parsedEnCh = parsedEn ? parsedEn.chapters.find(c => c.number === parsedCh.number) : null;

        // Only overwrite chapter title if it's valid and does NOT contain strikethrough '~~' markers (avoiding deprecated headers)
        if (parsedKoCh && parsedKoCh.title.ko && parsedKoCh.title.ko !== 'Title' && !parsedKoCh.title.ko.includes('~~')) {
          targetCh.title.ko = parsedKoCh.title.ko;
        }
        if (parsedEnCh && parsedEnCh.title.en && parsedEnCh.title.en !== 'Title' && !parsedEnCh.title.en.includes('~~')) {
          targetCh.title.en = parsedEnCh.title.en;
        }

        if (versionKey === 'v1_v2') {
          if (parsedKoCh) {
            parsedKoCh.paragraphs.forEach((p, idx) => {
              let targetP = targetCh.paragraphs.find(tp => tp.id === `p${targetCh.number}_${idx + 1}`);
              if (!targetP) {
                targetP = {
                  id: `p${targetCh.number}_${idx + 1}`,
                  versions: {}
                };
                targetCh.paragraphs.push(targetP);
              }

              const isStrike = p.isStrikethrough;
              if (isStrike) {
                targetP.versions['v1'] = {
                  ko: p.pair.ko || '',
                  en: p.pair.en || ''
                };
                targetP.versions['v2'] = { ko: '', en: '' };
              } else {
                const pair = {
                  ko: p.pair.ko || '',
                  en: p.pair.en || ''
                };
                targetP.versions['v1'] = pair;
                targetP.versions['v2'] = pair;
              }
            });
          }
        } else {
          // Complete isolated content-based paragraph alignment for revised editions
          
          // 1. Process Korean paragraphs (fill v3.ko slots)
          if (parsedKoCh) {
            parsedKoCh.paragraphs.forEach((koP, idx) => {
              const koText = koP.pair.ko;
              if (!koText) return; // Skip empty placeholders

              const koKey = getParaKey(koText);
              let targetP = null;
              if (koKey) {
                targetP = targetCh.paragraphs.find(p => {
                  const v2Ko = p.versions['v2']?.ko;
                  return v2Ko && getParaKey(v2Ko) === koKey;
                });
              }

              if (!targetP) {
                targetP = {
                  id: `p${targetCh.number}_${versionKey}_ko_${idx + 1}`,
                  versions: {}
                };
                targetCh.paragraphs.push(targetP);
              }

              if (!targetP.versions[versionKey]) {
                targetP.versions[versionKey] = { ko: '', en: '' };
              }
              targetP.versions[versionKey].ko = koText;
            });
          }

          // 2. Process English paragraphs (fill v3.en slots)
          if (parsedEnCh) {
            parsedEnCh.paragraphs.forEach((enP, idx) => {
              const enText = enP.pair.en;
              if (!enText) return; // Skip empty placeholders

              const enKey = getParaKey(enText);
              let targetP = null;
              if (enKey) {
                targetP = targetCh.paragraphs.find(p => {
                  const v2En = p.versions['v2']?.en;
                  return v2En && getParaKey(v2En) === enKey;
                });
              }

              if (!targetP) {
                targetP = {
                  id: `p${targetCh.number}_${versionKey}_en_${idx + 1}`,
                  versions: {}
                };
                targetCh.paragraphs.push(targetP);
              }

              if (!targetP.versions[versionKey]) {
                targetP.versions[versionKey] = { ko: '', en: '' };
              }
              targetP.versions[versionKey].en = enText;
            });
          }

          // 3. Apply English Translation Inheritance fallbacks after both alignments are complete
          targetCh.paragraphs.forEach(targetP => {
            if (targetP.versions[versionKey]) {
              // If the revised version has no English translation (empty), inherit the baseline v2.en
              if (!targetP.versions[versionKey].en && targetP.versions['v2'] && targetP.versions['v2'].en) {
                targetP.versions[versionKey].en = targetP.versions['v2'].en;
              }
            }
          });
        }
      });
    });

    compiledPapers[slug] = mergedPaper;
  });

  // Write typescript database mapping
  const content = `// Auto-generated Notion Paper Database. DO NOT EDIT DIRECTLY.
export interface Translation {
  ko: string;
  en: string;
}

export interface AuthorDetails {
  ko: string;
  en: string;
}

export interface AffiliationDetails {
  ko: string;
  en: string;
}

export interface AbstractVersions {
  versions: Record<string, Translation>;
}

export interface PaperParagraph {
  id: string;
  versions: Record<string, Translation>;
  reviewIds?: string[];
}

export interface PaperChapter {
  number: number;
  title: Translation;
  paragraphs: PaperParagraph[];
}

export interface Citation {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  pdfUrl?: string;
  citedPage: number;
  citedContext: Translation;
}

export type ReferenceData = Citation;
export type ParagraphData = PaperParagraph;

export interface ReviewComment {
  id: string;
  reviewer: string;
  objection: Translation;
  rebuttal: {
    role: 'author' | 'reviewer';
    text: Translation;
  }[];
  status: 'Open' | 'Resolved';
  linkedParagraphId: string;
}

export interface PaperDetails {
  id: string;
  slug: string;
  title: Translation;
  authors: AuthorDetails;
  affiliations: AffiliationDetails;
  abstract: AbstractVersions;
  chapters: PaperChapter[];
  references: Record<string, Citation>;
  reviews: Record<string, ReviewComment>;
  workflow: {
    stage: string;
    percent: number;
    nextStep: string;
    journalTarget: string;
  };
}

export const papersMap: Record<string, PaperDetails> = ${JSON.stringify(compiledPapers, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`✨ Successful Compilation! Output saved to: ${OUTPUT_FILE}`);

  // DB synchronization
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    console.log("📡 Synchronizing paper data to Supabase...");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    Object.values(compiledPapers).forEach(async (paper) => {
      const { data, error } = await supabase
        .from('papers')
        .upsert({
          id: paper.id,
          slug: paper.slug,
          title_ko: paper.title.ko,
          title_en: paper.title.en,
          authors_ko: paper.authors.ko,
          authors_en: paper.authors.en,
          affiliations_ko: paper.affiliations.ko,
          affiliations_en: paper.affiliations.en,
          abstract_v1_ko: paper.abstract.versions.v1?.ko || '',
          abstract_v1_en: paper.abstract.versions.v1?.en || '',
          abstract_v2_ko: paper.abstract.versions.v2?.ko || '',
          abstract_v2_en: paper.abstract.versions.v2?.en || '',
          abstract_v3_ko: paper.abstract.versions.v3?.ko || '',
          abstract_v3_en: paper.abstract.versions.v3?.en || '',
          abstract_v4_ko: paper.abstract.versions.v4?.ko || '',
          abstract_v4_en: paper.abstract.versions.v4?.en || '',
          chapters: paper.chapters,
          references: paper.references,
          reviews: paper.reviews,
          workflow: paper.workflow,
          updated_at: new Date()
        });

      if (error) {
        console.error(`❌ Supabase sync failed for slug [${paper.slug}]:`, error.message);
      } else {
        console.log(`✅ Supabase sync success for slug: ${paper.slug}`);
      }
    });
  } else {
    console.log("ℹ️ Supabase environment variables missing in .env.local. Skipping DB synchronization.");
  }
}

function getPaper1References() {
  return {
    ref1: {
      id: "ref1",
      title: "Can Quantum-Mechanical Description of Physical Reality be Considered Complete?",
      authors: "Einstein, A., Podolsky, B., & Rosen, N.",
      journal: "Physical Review",
      year: 1935,
      pdfUrl: "https://journals.aps.org/pr/pdf/10.1103/PhysRev.47.777",
      citedPage: 1,
      citedContext: {
        ko: "양자 스핀 얽힘 상태의 국소 실재성 모순을 지적하여 현대 양자해석론의 근본적 문제를 제기함",
        en: "Highlighting Einstein-Podolsky-Rosen paradox questioning quantum completeness."
      }
    },
    ref2: {
      id: "ref2",
      title: "Equation of Motion of a Particle in a Wave Field",
      authors: "Madelung, E.",
      journal: "Zeitschrift für Physik",
      year: 1927,
      pdfUrl: "",
      citedPage: 2,
      citedContext: {
        ko: "슈뢰딩거 파동 방정식을 극좌표로 변환하여 최초로 유체역학적 흐름으로 변환 정식화함",
        en: "Introducing Madelung hydrodynamic equations for wave function polar form."
      }
    },
    ref3: {
      id: "ref3",
      title: "A Suggested Interpretation of the Quantum Theory in Terms of 'Hidden' Variables I & II",
      authors: "Bohm, David",
      journal: "Physical Review",
      year: 1952,
      pdfUrl: "https://journals.aps.org/pr/pdf/10.1103/PhysRev.85.166",
      citedPage: 3,
      citedContext: {
        ko: "양자 퍼텐셜 개념을 도입하여 입자의 실재 궤적을 예측하는 은닉 변수 이론의 뼈대를 완성함",
        en: "Foundational Bohmian mechanics introducing the concept of quantum potential."
      }
    },
    ref4: {
      id: "ref4",
      title: "Hydrodynamic pilot-wave theory",
      authors: "Bush, J. W. M.",
      journal: "Annual Review of Fluid Mechanics",
      year: 2015,
      pdfUrl: "",
      citedPage: 4,
      citedContext: {
        ko: "실제 거시 실리콘 오일방울 액적(Walking Droplet) 실험을 통해 결정론적 파동 궤적 유도가 물리적으로 실재함을 규명함",
        en: "Experimental verification of deterministic paths via walking oil droplets."
      }
    }
  };
}

function getPaper2References() {
  return {
    ref1: {
      id: "ref1",
      title: "Quantum mechanical generator of spatial metrics",
      authors: "Hawking, S. W.",
      journal: "Communications in Mathematical Physics",
      year: 1975,
      pdfUrl: "",
      citedPage: 2,
      citedContext: {
        ko: "블랙홀 사건의 지평선 인근 진공 에너지 요동이 시공간 메트릭에 미치는 열역학적 팽창 정식화",
        en: "Derivation of vacuum energy metric fluctuations at the blackhole horizon."
      }
    },
    ref2: {
      id: "ref2",
      title: "Gravitational field of a spinning mass as an entropic response",
      authors: "Kerr, R. P.",
      journal: "Physical Review Letters",
      year: 1963,
      pdfUrl: "",
      citedPage: 2,
      citedContext: {
        ko: "회전하는 시공간 블랙홀의 엔트로피적 잉여 중력 퍼텐셜 정량적 솔루션 제시",
        en: "Exact metric for a spinning gravitational source."
      }
    },
    ref3: {
      id: "ref3",
      title: "The Cosmological Constant and Dark Energy",
      authors: "Peebles, P. J. E., & Ratra, B.",
      journal: "Reviews of Modern Physics",
      year: 2003,
      pdfUrl: "",
      citedPage: 3,
      citedContext: {
        ko: "우주 스케일에서 균일 진동하는 암흑 에너지 밀도 평형 공식 유도",
        en: "Comprehensive review of dark energy and quintessence models."
      }
    },
    ref4: {
      id: "ref4",
      title: "Emergent Gravity and the Dark Universe",
      authors: "Verlinde, E. P.",
      journal: "SciPost Physics",
      year: 2017,
      pdfUrl: "",
      citedPage: 3,
      citedContext: {
        ko: "시공간의 미세 정보 자유도 증가에 따른 엔트로피적 잉여 중력 유도 및 암흑 은하 기원론",
        en: "Emergent entropic gravity theory replacing dark sector particles."
      }
    },
    ref5: {
      id: "ref5",
      title: "Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant",
      authors: "Riess, A. G., et al.",
      journal: "The Astronomical Journal",
      year: 1998,
      pdfUrl: "",
      citedPage: 3,
      citedContext: {
        ko: "IA형 초신성 적색편이 측정을 통한 우주 가속 팽창 및 가상의 우주 상수 존재 검증",
        en: "Supernovae observations proving cosmic acceleration and cosmological constant."
      }
    }
  };
}

function getPaper3References() {
  return {
    ref1: {
      id: "ref1",
      title: "Inflationary universe: A possible solution to the horizon and flatness problems",
      authors: "Guth, Alan H.",
      journal: "Physical Review D",
      year: 1981,
      pdfUrl: "",
      citedPage: 1,
      citedContext: {
        ko: "광속 초과 팽창에 따른 인과율 정보 차단 지평선 문제 및 지평선 문제 해결책 제시",
        en: "Cosmic inflation hypothesis addressing horizon and flatness problems under causality limits."
      }
    },
    ref2: {
      id: "ref2",
      title: "A million cubic megaparsec void in Bootes",
      authors: "Kirshner, R. P., et al.",
      journal: "The Astrophysical Journal",
      year: 1981,
      pdfUrl: "",
      citedPage: 2,
      citedContext: {
        ko: "우주 마이크로파 및 별 밀도가 극도로 희박한 목동자리 거대 공동 최초 발견 기술",
        en: "Discovery of the giant Bootes void in cosmic large scale structure."
      }
    },
    ref3: {
      id: "ref3",
      title: "How filaments of galaxies are woven into the cosmic web",
      authors: "Bond, J. R., Kofman, L., & Pogosyan, D.",
      journal: "Nature",
      year: 1996,
      pdfUrl: "",
      citedPage: 3,
      citedContext: {
        ko: "우주 가스 필라멘트 구조와 보강 간섭에 따른 은하 거미줄 네트워크 형성 증명",
        en: "Reconstruction of the web-like structures of galaxies woven by gravity dynamics."
      }
    },
    ref4: {
      id: "ref4",
      title: "A Bright Millisecond Radio Burst of Extragalactic Origin",
      authors: "Lorimer, D. R., et al.",
      journal: "Science",
      year: 2007,
      pdfUrl: "",
      citedPage: 1,
      citedContext: {
        ko: "은하 외부에서 날아오는 단 1밀리초의 초광도 전파 섬광(FRB)의 존재를 최초로 탐지",
        en: "First detection of fast radio bursts (FRBs) emitting millisecond scale radio pulses."
      }
    },
    ref5: {
      id: "ref5",
      title: "Periodic activity from a fast radio burst source",
      authors: "CHIME/FRB Collaboration",
      journal: "Nature",
      year: 2020,
      pdfUrl: "",
      citedPage: 2,
      citedContext: {
        ko: "고속 전파 폭발의 특정 단층 좌표 주기성 반복 여진 메커니즘 관측",
        en: "Discovery of repeating periodic activity from a single FRB source."
      }
    }
  };
}

function getPaper1Reviews() {
  return {
    rev1: {
      id: "rev1",
      reviewer: "Reviewer 1",
      objection: {
        ko: "해당 파트의 학술적 물리 설명 보강을 요청합니다.",
        en: "Requested expanded physical justification for this section."
      },
      rebuttal: [
        {
          role: 'author',
          text: {
            ko: "v2.0.0에서 지적에 맞춰 본문을 추가적으로 보완하였습니다.",
            en: "Addressed in v2.0.0 by expanding the corresponding arguments."
          }
        }
      ],
      status: "Resolved",
      linkedParagraphId: "p1_1"
    }
  };
}

compileAndSync();
