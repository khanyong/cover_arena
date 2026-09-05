import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

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
  console.log('=== PROTECTED ASSET INTERSECTION ANALYSIS FOR PASS 2A ===\n');

  // 1. Fetch locked baseline snapshot
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id, code').eq('code', 'B1_v1.0_LOCKED').single();

  // 2. Fetch all mappings with paragraph versions
  console.log('Fetching content map with paragraph versions...');
  const { data: mapRows, error: mErr } = await supabase
    .from('revision_content_map')
    .select('unit_id, position, paragraph_version_id, paragraph_versions(id, body_markdown)')
    .eq('snapshot_id', baseSnap!.id);

  if (mErr) throw new Error(`Content map fetch failed: ${mErr.message}`);
  console.log(`Total mapped units in snapshot: ${mapRows.length}`);

  // 3. Identify affected paragraphs
  const affected: {
    unit_id: string;
    pv_id: string;
    text: string;
    changes: string[];
  }[] = [];

  for (const row of mapRows) {
    const pv = (row as any).paragraph_versions;
    if (!pv || !pv.body_markdown) continue;

    const originalText = pv.body_markdown;
    let newText = originalText;
    const detected: string[] = [];

    for (const rule of REPLACEMENT_RULES) {
      const matches = originalText.match(rule.pattern);
      if (matches) {
        detected.push(`${rule.label} (${matches.length}x)`);
        newText = newText.replace(rule.pattern, rule.replacement);
      }
    }

    if (newText !== originalText) {
      affected.push({
        unit_id: row.unit_id,
        pv_id: pv.id,
        text: originalText,
        changes: detected
      });
    }
  }

  console.log(`Identified ${affected.length} affected paragraphs requiring canon replacement (Expected: 35).`);

  // 4. Fetch all protected assets from scene matrices
  const { data: matrices } = await supabase
    .from('scene_matrices')
    .select('scene_unit_id, protected_assets, protected_status')
    .eq('snapshot_id', baseSnap!.id);

  const protectedAssets: any[] = [];
  (matrices || []).forEach(m => {
    if (m.protected_assets && Array.isArray(m.protected_assets)) {
      m.protected_assets.forEach(a => {
        protectedAssets.push({
          scene_unit_id: m.scene_unit_id,
          asset: typeof a === 'string' ? a : JSON.stringify(a)
        });
      });
    }
  });

  console.log(`Total protected assets in repository: ${protectedAssets.length}`);

  // 5. Intersect affected paragraphs with protected assets
  let countA = 0; // No overlap
  let countB = 0; // Protected paragraph, but protected phrase does not contain old name
  let countC = 0; // Exact-text protected phrase contains deprecated name
  const conflicts: any[] = [];

  for (const aff of affected) {
    // Find if any protected asset is contained in this paragraph or vice versa
    const matchingAssets = protectedAssets.filter(pa => {
      const cleanPa = pa.asset.replace(/^“|”$/g, '').trim();
      return aff.text.includes(cleanPa) || (cleanPa.length > 20 && cleanPa.includes(aff.text));
    });

    if (matchingAssets.length === 0) {
      countA++;
    } else {
      // Check if any matching protected asset contains an old name
      const assetWithOldName = matchingAssets.find(ma => {
        return REPLACEMENT_RULES.some(r => r.pattern.test(ma.asset));
      });

      if (assetWithOldName) {
        countC++;
        conflicts.push({
          unit_id: aff.unit_id,
          pv_id: aff.pv_id,
          asset: assetWithOldName.asset,
          text: aff.text
        });
      } else {
        countB++;
      }
    }
  }

  console.log('\n===========================================================');
  console.log('       INTERSECTION ANALYSIS RESULTS                       ');
  console.log('===========================================================');
  console.log(`Affected Paragraph Count:               ${affected.length}`);
  console.log(`Type A (No overlap with protected assets): ${countA}`);
  console.log(`Type B (In protected scene/context, but protected phrase contains no old name): ${countB}`);
  console.log(`Type C (Exact-text protected phrase contains deprecated name): ${countC}`);
  console.log(`Protected Asset Conflicts Unresolved:   ${conflicts.length}`);

  if (conflicts.length > 0) {
    console.log('\nConflicts requiring resolution:');
    conflicts.forEach(c => console.log('-', c.asset));
  } else {
    console.log('\nPROTECTED ASSET CONFLICTS UNRESOLVED: 0 (All clear for Pass 2A!)');
  }

  // 6. Write detailed report to exports
  const exportData = {
    affected_paragraphs_count: affected.length,
    type_a_count: countA,
    type_b_count: countB,
    type_c_count: countC,
    protected_asset_conflicts_unresolved: conflicts.length,
    conflicts,
    affected_paragraphs: affected.map(a => ({
      unit_id: a.unit_id,
      pv_id: a.pv_id,
      changes: a.changes,
      sample_text: a.text.substring(0, 100) + '...'
    }))
  };

  const fs = await import('fs');
  fs.writeFileSync('exports/pass-2a-protected-asset-intersection.json', JSON.stringify(exportData, null, 2), 'utf-8');
  console.log('Detailed intersection report written to exports/pass-2a-protected-asset-intersection.json');
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
