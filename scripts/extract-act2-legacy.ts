import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const REPO_ROOT = path.join(process.cwd());
const GIT_COMMIT = 'd3f3eb2d89bb2fa74183cf2ce4f344175834ac55';
const FULL_SOURCE_PATH = 'public/quantum-vibration-novel-en.json';
const EXTRACT_SLUG = 'quantum-vibration-novel-en-act-2';

try {
  // 1. Extract from git
  const fullJsonStr = execSync(`git show ${GIT_COMMIT}:${FULL_SOURCE_PATH}`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
  const fullSourceHash = crypto.createHash('sha256').update(fullJsonStr).digest('hex');
  
  // 2. Parse and Extract exactly act 2
  const novel = JSON.parse(fullJsonStr);
  const act = novel.data.acts.find((a: any) => a.number === 2); // Prologue is act 2
  
  // Clean up exactly like seed script (seed-v1-locked.ts does it this way)
  // seed-v1-locked.ts extracts acts by mapping acts to novel_documents entries.
  // We want the exact chunk that went into novel_documents data field.
  const actChunk = { ...act };
  
  // Custom canonical stringify: Lexicographic order, UTF-8, LF endings, no whitespace
  function canonicalStringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map(canonicalStringify).join(',') + ']';
    }
    const keys = Object.keys(obj).sort();
    let res = '{';
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (obj[k] !== undefined) {
        res += JSON.stringify(k) + ':' + canonicalStringify(obj[k]);
        if (i < keys.length - 1) res += ',';
      }
    }
    res += '}';
    return res;
  }
  
  const extractedJsonStr = canonicalStringify(actChunk);
  
  // Write the file (UTF-8, no trailing newline)
  fs.writeFileSync('scratch/legacy_extracted_act2.json', extractedJsonStr, 'utf8');
  
  const extractedHash = crypto.createHash('sha256').update(extractedJsonStr).digest('hex');
  
  // Script hash (since we're running it now, we hash this file)
  const scriptContent = fs.readFileSync('scripts/extract-act2-legacy.ts', 'utf8');
  const scriptHash = crypto.createHash('sha256').update(scriptContent).digest('hex');
  const scriptCommit = execSync('git rev-parse HEAD').toString().trim();

  console.log(JSON.stringify({
    full_source_repository_path: FULL_SOURCE_PATH,
    full_source_git_commit: GIT_COMMIT,
    full_source_file_sha256: fullSourceHash,
    extraction_script_path: 'scripts/extract-act2-legacy.ts',
    extraction_script_git_commit: scriptCommit,
    extraction_script_sha256: scriptHash,
    extracted_document_slug: EXTRACT_SLUG,
    extracted_document_file_sha256: extractedHash,
    extracted_document_canonical_json_sha256: extractedHash
  }, null, 2));

} catch (err) {
  console.error('Extraction failed:', err);
}
