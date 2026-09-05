import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Argument parsing
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isApply = args.includes('--apply');
const isVerifyOnly = args.includes('--verify-only');

let targetSnapshotCode = 'B1_PILOT_NAME_CANON_001';
const snapIdx = args.indexOf('--snapshot');
if (snapIdx !== -1 && args[snapIdx + 1]) {
  targetSnapshotCode = args[snapIdx + 1];
}

// Canonical replacement rules
const REPLACEMENT_RULES = [
  { pattern: /\bKim Ji-man\b/g, replacement: 'Yoo Ji-man', label: 'Kim Ji-man' },
  { pattern: /\bKIM JI-MAN\b/g, replacement: 'YOO JI-MAN', label: 'KIM JI-MAN' },
  { pattern: /\bKIM, JI-MAN\b/g, replacement: 'YOO, JI-MAN', label: 'KIM, JI-MAN' },
  { pattern: /\bKim J\.M\.\b/g, replacement: 'Yoo J.M.', label: 'Kim J.M.' },
  { pattern: /\bYoo Seo-yeon\b/g, replacement: 'Jeon Seo-yeon', label: 'Yoo Seo-yeon' },
  { pattern: /\bYOO, SEO-YEON\b/g, replacement: 'JEON, SEO-YEON', label: 'YOO, SEO-YEON' },
  { pattern: /\bYOO SEO-YEON\b/g, replacement: 'JEON SEO-YEON', label: 'YOO SEO-YEON' },
  { pattern: /\bSeo-yeon Yoo\b/g, replacement: 'Jeon Seo-yeon', label: 'Seo-yeon Yoo' },
  { pattern: /\bMrs\. Yoo\b/g, replacement: 'Ms. Jeon', label: 'Mrs. Yoo' },
  { pattern: /\bMr\. Kim\b/g, replacement: 'Mr. Yoo', label: 'Mr. Kim' },
];

const PROTECTED_PATTERNS = [
  /\bIan Yoo\b/g,
  /\bDr\. Yoo\b/g,
  /\bYOO, IAN\b/g,
  /\bKwang Yong Yoo\b/g,
];

async function main() {
  console.log('===========================================================');
  console.log('  FAMILY NAME CANON NORMALIZER (apply-family-name-canon)   ');
  console.log('===========================================================');
  console.log(`Target Snapshot: ${targetSnapshotCode}`);
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : isApply ? 'APPLY' : isVerifyOnly ? 'VERIFY-ONLY' : 'DRY-RUN (default)'}\n`);

  // 1. Fetch Target Snapshot
  const { data: snapshot, error: sErr } = await supabase
    .from('revision_snapshots')
    .select('*')
    .eq('code', targetSnapshotCode)
    .single();

  if (sErr || !snapshot) {
    throw new Error(`Target snapshot "${targetSnapshotCode}" not found: ${sErr?.message}`);
  }

  // 2. Fetch all mappings and current paragraph versions for snapshot
  console.log(`Fetching all paragraph mappings for snapshot ${snapshot.code}...`);
  const { data: mapRows, error: mErr } = await supabase
    .from('revision_content_map')
    .select('unit_id, position, paragraph_version_id, paragraph_versions(id, body_markdown)')
    .eq('snapshot_id', snapshot.id);

  if (mErr) throw new Error(`Failed to load content map: ${mErr.message}`);
  console.log(`Loaded ${mapRows.length} mapped units.\n`);

  const affectedParagraphs: {
    unitId: string;
    currentVersionId: string;
    originalText: string;
    newText: string;
    changes: string[];
  }[] = [];

  const counts: Record<string, number> = {};
  REPLACEMENT_RULES.forEach(r => counts[r.label] = 0);

  let protectedOccurrences = 0;
  let ambiguousOccurrences = 0;

  for (const row of mapRows) {
    const pv = (row as any).paragraph_versions;
    if (!pv || !pv.body_markdown) continue;

    const originalText = pv.body_markdown;
    let newText = originalText;
    const detectedChanges: string[] = [];

    // Check protected
    for (const pPat of PROTECTED_PATTERNS) {
      const pMatches = originalText.match(pPat);
      if (pMatches) protectedOccurrences += pMatches.length;
    }

    // Apply replacements
    for (const rule of REPLACEMENT_RULES) {
      const matches = originalText.match(rule.pattern);
      if (matches) {
        counts[rule.label] += matches.length;
        detectedChanges.push(`${rule.label} (${matches.length}x)`);
        newText = newText.replace(rule.pattern, rule.replacement);
      }
    }

    if (newText !== originalText) {
      affectedParagraphs.push({
        unitId: row.unit_id,
        currentVersionId: pv.id,
        originalText,
        newText,
        changes: detectedChanges,
      });
    }
  }

  // --- REPORT SECTION ---
  console.log('--- DRY-RUN SCAN REPORT ---');
  console.log(`Total paragraphs scanned: ${mapRows.length}`);
  console.log(`Affected paragraphs requiring new versions: ${affectedParagraphs.length}\n`);

  console.log('Exact Matches Detected:');
  for (const [label, count] of Object.entries(counts)) {
    console.log(`  - ${label.padEnd(16)}: ${count}`);
  }
  console.log(`\nProtected Occurrences (Ian Yoo, Dr. Yoo, YOO, IAN, Kwang Yong Yoo): ${protectedOccurrences}`);
  console.log(`Ambiguous Occurrences: ${ambiguousOccurrences}\n`);

  if (isDryRun || (!isApply && !isVerifyOnly)) {
    console.log('Sample Affected Paragraphs:');
    affectedParagraphs.slice(0, 3).forEach((ap, i) => {
      console.log(`\n[${i+1}] Unit ID: ${ap.unitId} | Changes: ${ap.changes.join(', ')}`);
      console.log(`  BEFORE: "${ap.originalText.substring(0, 100)}..."`);
      console.log(`  AFTER:  "${ap.newText.substring(0, 100)}..."`);
    });
    console.log('\n[DRY-RUN COMPLETE] Run with --apply to commit new paragraph versions.');
    return;
  }

  if (isVerifyOnly) {
    console.log('--- VERIFICATION ONLY ---');
    let totalDeprecated = 0;
    for (const [label, count] of Object.entries(counts)) {
      totalDeprecated += count;
    }
    if (totalDeprecated === 0) {
      console.log('[VERIFIED] 0 deprecated aliases found in snapshot. Canon normalization complete!');
    } else {
      console.log(`[WARNING] Found ${totalDeprecated} deprecated aliases still in snapshot.`);
    }
    return;
  }

  if (isApply) {
    console.log('--- APPLYING CANON NORMALIZATION ---');
    console.log(`Creating ${affectedParagraphs.length} new paragraph versions on snapshot ${snapshot.code}...`);

    let appliedCount = 0;
    for (const ap of affectedParagraphs) {
      const { data: cp, error: cpErr } = await supabase.rpc('create_paragraph_checkpoint', {
        p_snapshot_id: snapshot.id,
        p_paragraph_unit_id: ap.unitId,
        p_expected_current_version_id: ap.currentVersionId,
        p_new_body_markdown: ap.newText,
        p_change_type: 'canon_normalization',
        p_change_note: 'Applied CANON_DECISION_FAMILY_NAMES_001',
      });

      if (cpErr) {
        throw new Error(`Failed to create paragraph checkpoint for unit ${ap.unitId}: ${cpErr.message}`);
      }
      appliedCount++;
      if (appliedCount % 5 === 0 || appliedCount === affectedParagraphs.length) {
        console.log(`  Applied ${appliedCount} / ${affectedParagraphs.length} checkpoints...`);
      }
    }

    console.log(`\n[SUCCESS] Successfully applied ${appliedCount} canon-normalized paragraph versions to ${snapshot.code}!`);
  }
}

main().catch(err => {
  console.error('[FAILED]:', err);
  process.exit(1);
});
