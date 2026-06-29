import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../projects/notion_papers/backup_combined');
const NOTION_DIR = path.join(__dirname, '../projects/notion_papers');

function hasKorean(text) {
  return /[가-힣]/.test(text);
}

function splitHeaderBilingual(line) {
  const prefixMatch = line.match(/^(#+)\s+/);
  if (!prefixMatch) return { ko: line, en: line };
  const prefix = prefixMatch[1];
  const content = line.slice(prefix.length).trim();

  // 1. Check if it is a chapter header: e.g. "1장. 서론 (Introduction)"
  const chHeaderMatch = content.match(/^(\d+)장\.\s*([^\(]+)\s*\(([^\)]+)\)$/);
  if (chHeaderMatch) {
    const chNum = chHeaderMatch[1];
    const koTitle = chHeaderMatch[2].trim();
    const enTitle = chHeaderMatch[3].trim();
    return {
      ko: `${prefix} ${chNum}장. ${koTitle}`,
      en: `${prefix} Chapter ${chNum}. ${enTitle}`
    };
  }

  // 2. Check for parentheses split: "Title (Translation)"
  const parenMatch = content.match(/^([^\(]+)\s*\(([^\)]+)\)$/);
  if (parenMatch) {
    const first = parenMatch[1].trim();
    const second = parenMatch[2].trim();
    const koPart = hasKorean(first) ? first : second;
    const enPart = hasKorean(first) ? second : first;
    return {
      ko: `${prefix} ${koPart}`,
      en: `${prefix} ${enPart}`
    };
  }

  // 3. Check for slash split
  if (content.includes('/')) {
    const parts = content.split('/');
    const first = parts[0].trim();
    const second = parts[1].trim();
    const koPart = hasKorean(first) ? first : second;
    const enPart = hasKorean(first) ? second : first;
    return {
      ko: `${prefix} ${koPart}`,
      en: `${prefix} ${enPart}`
    };
  }

  return { ko: line, en: line };
}

function migrateFile(fileName) {
  const filePath = path.join(BACKUP_DIR, fileName);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const koLines = [];
  const enLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (koLines.length > 0 && koLines[koLines.length - 1] !== '') koLines.push('');
      if (enLines.length > 0 && enLines[enLines.length - 1] !== '') enLines.push('');
      continue;
    }

    if (trimmed.startsWith('#')) {
      if (trimmed.toLowerCase().startsWith('## abstract') || trimmed.startsWith('## 초록')) {
        koLines.push('## 초록 (Abstract)');
        enLines.push('## Abstract');
        continue;
      }
      const splitHeader = splitHeaderBilingual(trimmed);
      koLines.push(splitHeader.ko);
      enLines.push(splitHeader.en);
      continue;
    }

    const cleanText = trimmed.replace(/\\\\/g, '\\');
    
    // Refined equation detector: only treat it as pure math if it doesn't contain general English words
    const hasMath = cleanText.includes('\\') || cleanText.includes('^') || cleanText.includes('_') || cleanText.includes('$');
    const englishWords = cleanText.match(/[a-zA-Z]{3,}/g) || [];
    const nonMathWords = englishWords.filter(w => !['lim', 'max', 'min', 'sin', 'cos', 'tan', 'log'].includes(w.toLowerCase()));
    const isPureMath = hasMath && !hasKorean(cleanText) && (nonMathWords.length < 3);

    const isDelimiter = cleanText === '$$' || cleanText === '<math>' || cleanText === '</math>' || cleanText === '---';

    if (isDelimiter || isPureMath) {
      koLines.push(line);
      enLines.push(line);
      continue;
    }

    const isKo = hasKorean(trimmed);
    if (isKo) {
      koLines.push(line);
    } else {
      enLines.push(line);
    }
  }

  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  
  // Save completely clean, placeholder-free outputs
  fs.writeFileSync(path.join(NOTION_DIR, `${base}-ko${ext}`), koLines.join('\n').replace(/\n{3,}/g, '\n\n'), 'utf-8');
  console.log(`📝 Re-written Korean file: ${base}-ko${ext} (Lines: ${koLines.length})`);

  fs.writeFileSync(path.join(NOTION_DIR, `${base}-en${ext}`), enLines.join('\n').replace(/\n{3,}/g, '\n\n'), 'utf-8');
  console.log(`📝 Re-written English file: ${base}-en${ext} (Lines: ${enLines.length})`);
}

function run() {
  console.log('🔄 Re-running precise migration (fully clean without placeholders)...');
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('spatial-vibration-') && f.endsWith('.md'));
  files.forEach(migrateFile);
  console.log('✅ Clean precise migration completed!');
}
run();
