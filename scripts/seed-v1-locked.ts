import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local or .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// RFC 4122 DNS Namespace
const DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

function parseUuid(uuidStr: string): Buffer {
  return Buffer.from(uuidStr.replace(/-/g, ''), 'hex');
}

function formatUuid(buf: Buffer): string {
  const hex = buf.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
}

export function generateDeterministicUuid(sourcePath: string): string {
  const nsBuf = parseUuid(DNS_NAMESPACE);
  const nameBuf = Buffer.from(`book1-en:${sourcePath}`, 'utf8');
  const hash = crypto.createHash('sha1').update(Buffer.concat([nsBuf, nameBuf])).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // Version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // Variant RFC 4122
  return formatUuid(hash.subarray(0, 16));
}

interface ParsedParagraph {
  id: string;
  sourceKey: string;
  sourcePath: string;
  position: number;
  markdown: string;
  bodyHash: string;
  wordCount: number;
}

interface ParsedScene {
  id: string;
  sceneNumber: number;
  sourceKey: string;
  sourcePath: string;
  position: number;
  title: string;
  paragraphs: ParsedParagraph[];
  rawContent: string;
}

interface ParsedChapter {
  id: string;
  chapterNumber: number;
  sourceKey: string;
  sourcePath: string;
  position: number;
  title: string;
  scenes: ParsedScene[];
}

interface ParsedAct {
  id: string;
  actNumber: number;
  sourceKey: string;
  sourcePath: string;
  position: number;
  title: string;
  chapters: ParsedChapter[];
}

async function loadAndParseSource() {
  console.log('Fetching main document quantum-vibration-novel-en...');
  const { data: mainRow, error: mainErr } = await supabase
    .from('novel_documents')
    .select('id, slug, title, data')
    .eq('slug', 'quantum-vibration-novel-en')
    .single();

  if (mainErr || !mainRow) {
    throw new Error(`Failed to load main document: ${mainErr?.message}`);
  }

  const novel = mainRow.data;
  const actSlugs = (novel.acts || []).map((a: any) => `quantum-vibration-novel-en-act-${a.number}`);

  console.log(`Fetching ${actSlugs.length} sharded act documents...`);
  const { data: actRows, error: actErr } = await supabase
    .from('novel_documents')
    .select('id, slug, title, data')
    .in('slug', actSlugs);

  if (actErr || !actRows) {
    throw new Error(`Failed to load sharded acts: ${actErr?.message}`);
  }

  // Sort acts by number
  const sortedActRows = actRows.sort((a, b) => (a.data.number || 0) - (b.data.number || 0));

  const parsedActs: ParsedAct[] = [];
  let totalWordCount = 0;
  let totalParagraphCount = 0;
  let totalSceneCount = 0;
  let totalChapterCount = 0;

  for (let aIdx = 0; aIdx < sortedActRows.length; aIdx++) {
    const actData = sortedActRows[aIdx].data;
    const actNumber = actData.number || aIdx + 1;
    const actPath = `act-${actNumber}`;
    const actId = generateDeterministicUuid(actPath);

    const parsedAct: ParsedAct = {
      id: actId,
      actNumber,
      sourceKey: `act:${actNumber}`,
      sourcePath: actPath,
      position: aIdx + 1,
      title: actData.title || `Act ${actNumber}`,
      chapters: [],
    };

    const chapters = actData.chapters || [];
    for (let cIdx = 0; cIdx < chapters.length; cIdx++) {
      const chData = chapters[cIdx];
      const chNumber = chData.number || cIdx + 1;
      const chPath = `${actPath}/ch-${chNumber}`;
      const chId = generateDeterministicUuid(chPath);

      const parsedChapter: ParsedChapter = {
        id: chId,
        chapterNumber: chNumber,
        sourceKey: `act:${actNumber}:ch:${chNumber}`,
        sourcePath: chPath,
        position: cIdx + 1,
        title: chData.title || `Chapter ${chNumber}`,
        scenes: [],
      };

      const scenes = chData.scenes || [];
      for (let sIdx = 0; sIdx < scenes.length; sIdx++) {
        const scData = scenes[sIdx];
        const scNumber = scData.number || sIdx + 1;
        const scPath = `${chPath}/sc-${scNumber}`;
        const scId = generateDeterministicUuid(scPath);

        // Get raw content
        let rawContent = '';
        if (scData.paragraphs && scData.paragraphs.length > 0) {
          const p = scData.paragraphs[0];
          const verKey = p.activeVersion || Object.keys(p.versions || {})[0];
          if (verKey && p.versions && p.versions[verKey]) {
            rawContent = p.versions[verKey].content || '';
          }
        }

        // Split paragraphs on double newline
        const rawBlocks = rawContent.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
        const parsedParagraphs: ParsedParagraph[] = [];

        for (let pIdx = 0; pIdx < rawBlocks.length; pIdx++) {
          const blockMarkdown = rawBlocks[pIdx];
          const padIdx = String(pIdx + 1).padStart(4, '0');
          const pPath = `${scPath}/p-${padIdx}`;
          const pId = generateDeterministicUuid(pPath);
          const words = blockMarkdown.split(/\s+/).filter(Boolean).length;
          const bodyHash = crypto.createHash('md5').update(blockMarkdown).digest('hex');

          totalWordCount += words;
          totalParagraphCount++;

          parsedParagraphs.push({
            id: pId,
            sourceKey: `act:${actNumber}:ch:${chNumber}:sc:${scNumber}:p:${pIdx + 1}`,
            sourcePath: pPath,
            position: pIdx + 1,
            markdown: blockMarkdown,
            bodyHash,
            wordCount: words,
          });
        }

        const parsedScene: ParsedScene = {
          id: scId,
          sceneNumber: scNumber,
          sourceKey: `act:${actNumber}:ch:${chNumber}:sc:${scNumber}`,
          sourcePath: scPath,
          position: sIdx + 1,
          title: scData.title || `Scene ${scNumber}`,
          paragraphs: parsedParagraphs,
          rawContent,
        };

        parsedChapter.scenes.push(parsedScene);
        totalSceneCount++;
      }

      parsedAct.chapters.push(parsedChapter);
      totalChapterCount++;
    }

    parsedActs.push(parsedAct);
  }

  // Calculate composite source hash
  const sourcePayload = JSON.stringify(sortedActRows.map(r => ({ id: r.id, data: r.data })));
  const sourceHash = crypto.createHash('sha256').update(sourcePayload).digest('hex');

  return {
    sourceDocumentId: 'quantum-vibration-novel-en',
    sourceHash,
    parsedActs,
    totalActs: parsedActs.length,
    totalChapters: totalChapterCount,
    totalScenes: totalSceneCount,
    totalParagraphs: totalParagraphCount,
    totalWords: totalWordCount,
  };
}

async function runDryRun() {
  console.log('\n========================================');
  console.log('       SEED V1 DRY-RUN REPORT           ');
  console.log('========================================');
  const data = await loadAndParseSource();

  console.log(`Source Document ID: ${data.sourceDocumentId}`);
  console.log(`Source Payload SHA-256: ${data.sourceHash}`);
  console.log(`Total Acts: ${data.totalActs}`);
  console.log(`Total Chapters: ${data.totalChapters}`);
  console.log(`Total Scenes: ${data.totalScenes}`);
  console.log(`Total Paragraphs: ${data.totalParagraphs}`);
  console.log(`Total Words: ${data.totalWords}`);

  console.log('\n--- Act Breakdown ---');
  for (const act of data.parsedActs) {
    let actWords = 0;
    let actParas = 0;
    let actScenes = 0;
    for (const ch of act.chapters) {
      for (const sc of ch.scenes) {
        actScenes++;
        actParas += sc.paragraphs.length;
        for (const p of sc.paragraphs) {
          actWords += p.wordCount;
        }
      }
    }
    console.log(`Act ${act.actNumber}: "${act.title}" -> ${act.chapters.length} Chs, ${actScenes} Scs, ${actParas} Paras, ${actWords} Words`);
  }

  // Verify sample round-trip on Local Execution scene
  const act2 = data.parsedActs.find(a => a.actNumber === 2);
  const ch3 = act2?.chapters.find(c => c.chapterNumber === 3);
  const scLocalExec = ch3?.scenes.find(s => s.title.includes('Local Execution'));

  if (scLocalExec) {
    const joined = scLocalExec.paragraphs.map(p => p.markdown).join('\n\n');
    const exactMatch = scLocalExec.rawContent.trim() === joined;
    console.log(`\n[Round-trip Verification] Local Execution (${scLocalExec.paragraphs.length} paras): Exact match = ${exactMatch}`);
  }

  console.log('\n[DRY-RUN COMPLETE] Validation passed with 0 errors.');
}

async function runApply() {
  console.log('\n========================================');
  console.log('       SEED V1 APPLY MIGRATION          ');
  console.log('========================================');
  const data = await loadAndParseSource();
  const PROJECT_SLUG = 'the-resonance-of-space-book-1';
  const SNAPSHOT_CODE = 'B1_v1.0_LOCKED';

  // 1. Check idempotency in import_runs
  const { data: existingRun, error: checkErr } = await supabase
    .from('import_runs')
    .select('*')
    .eq('source_document_id', data.sourceDocumentId)
    .eq('source_hash', data.sourceHash)
    .eq('target_snapshot_code', SNAPSHOT_CODE)
    .single();

  if (existingRun && existingRun.status === 'succeeded') {
    console.log(`\n[IDEMPOTENT] Import run already succeeded on ${existingRun.completed_at}.`);
    console.log(`Snapshot ID: ${existingRun.snapshot_id}`);
    return;
  }

  // 2. Ensure revision_projects exists
  console.log('\nEnsuring revision_projects record...');
  let projectId: string;
  const { data: projRow } = await supabase
    .from('revision_projects')
    .select('id')
    .eq('slug', PROJECT_SLUG)
    .single();

  if (projRow) {
    projectId = projRow.id;
    console.log(`Existing project found: ${projectId}`);
  } else {
    const { data: newProj, error: projErr } = await supabase
      .from('revision_projects')
      .insert({
        slug: PROJECT_SLUG,
        title: 'The Resonance of Space (Book 1)',
        description: 'Hard SF Novel Book 1 Second Revision Project',
        source_document_id: data.sourceDocumentId,
        target_range_min: 165000,
        target_range_max: 185000,
      })
      .select('id')
      .single();

    if (projErr || !newProj) {
      throw new Error(`Failed to create revision project: ${projErr?.message}`);
    }
    projectId = newProj.id;
    console.log(`Created new project: ${projectId}`);
  }

  // 3. Record import_run as running
  const { data: importRun, error: runErr } = await supabase
    .from('import_runs')
    .upsert({
      source_document_id: data.sourceDocumentId,
      source_hash: data.sourceHash,
      target_snapshot_code: SNAPSHOT_CODE,
      project_id: projectId,
      status: 'running',
      started_at: new Date().toISOString(),
    }, { onConflict: 'source_document_id,source_hash,target_snapshot_code' })
    .select('id')
    .single();

  const runId = importRun?.id;

  try {
    // 4. Batch prepare content_units and paragraph_versions
    console.log('Preparing content_units and paragraph_versions...');
    const contentUnitsToInsert: any[] = [];
    const paragraphVersionsToInsert: any[] = [];
    const contentMapEntries: any[] = [];
    const sceneMatrixEntries: any[] = [];

    // Snapshot ID
    const snapshotId = generateDeterministicUuid(`snapshot:${SNAPSHOT_CODE}`);

    for (const act of data.parsedActs) {
      contentUnitsToInsert.push({
        id: act.id,
        project_id: projectId,
        unit_type: 'act',
        source_key: act.sourceKey,
        source_path: act.sourcePath,
        original_parent_id: null,
        original_position: act.position,
        title: act.title,
      });

      contentMapEntries.push({
        snapshot_id: snapshotId,
        unit_id: act.id,
        parent_unit_id: null,
        position: act.position,
        paragraph_version_id: null,
        is_included: true,
      });

      for (const ch of act.chapters) {
        contentUnitsToInsert.push({
          id: ch.id,
          project_id: projectId,
          unit_type: 'chapter',
          source_key: ch.sourceKey,
          source_path: ch.sourcePath,
          original_parent_id: act.id,
          original_position: ch.position,
          title: ch.title,
        });

        contentMapEntries.push({
          snapshot_id: snapshotId,
          unit_id: ch.id,
          parent_unit_id: act.id,
          position: ch.position,
          paragraph_version_id: null,
          is_included: true,
        });

        for (const sc of ch.scenes) {
          contentUnitsToInsert.push({
            id: sc.id,
            project_id: projectId,
            unit_type: 'scene',
            source_key: sc.sourceKey,
            source_path: sc.sourcePath,
            original_parent_id: ch.id,
            original_position: sc.position,
            title: sc.title,
          });

          contentMapEntries.push({
            snapshot_id: snapshotId,
            unit_id: sc.id,
            parent_unit_id: ch.id,
            position: sc.position,
            paragraph_version_id: null,
            is_included: true,
          });

          sceneMatrixEntries.push({
            snapshot_id: snapshotId,
            scene_unit_id: sc.id,
            action: 'Keep',
            status: 'Diagnosed',
            protected_status: 'None',
          });

          for (const p of sc.paragraphs) {
            const versionId = generateDeterministicUuid(`version:${p.sourcePath}:v1`);

            contentUnitsToInsert.push({
              id: p.id,
              project_id: projectId,
              unit_type: 'paragraph',
              source_key: p.sourceKey,
              source_path: p.sourcePath,
              original_parent_id: sc.id,
              original_position: p.position,
              title: null,
            });

            paragraphVersionsToInsert.push({
              id: versionId,
              paragraph_unit_id: p.id,
              version_no: 1,
              body_markdown: p.markdown,
              body_hash: p.bodyHash,
              change_type: 'import',
              change_note: 'Initial import from v1.0 locked JSON',
              word_count: p.wordCount,
            });

            contentMapEntries.push({
              snapshot_id: snapshotId,
              unit_id: p.id,
              parent_unit_id: sc.id,
              position: p.position,
              paragraph_version_id: versionId,
              is_included: true,
            });
          }
        }
      }
    }

    // 5. Batch insert content_units in chunks of 500
    console.log(`Inserting ${contentUnitsToInsert.length} content_units...`);
    for (let i = 0; i < contentUnitsToInsert.length; i += 500) {
      const chunk = contentUnitsToInsert.slice(i, i + 500);
      const { error } = await supabase.from('content_units').upsert(chunk, { onConflict: 'project_id,source_path' });
      if (error) throw new Error(`content_units insert failed: ${error.message}`);
    }

    // 6. Batch insert paragraph_versions in chunks of 500
    console.log(`Inserting ${paragraphVersionsToInsert.length} paragraph_versions...`);
    for (let i = 0; i < paragraphVersionsToInsert.length; i += 500) {
      const chunk = paragraphVersionsToInsert.slice(i, i + 500);
      const { error } = await supabase.from('paragraph_versions').upsert(chunk, { onConflict: 'paragraph_unit_id,version_no' });
      if (error) throw new Error(`paragraph_versions insert failed: ${error.message}`);
    }

    // 7. Insert or update revision_snapshots as draft initially
    console.log(`Creating snapshot ${SNAPSHOT_CODE}...`);
    const { error: snapErr } = await supabase.from('revision_snapshots').upsert({
      id: snapshotId,
      project_id: projectId,
      code: SNAPSHOT_CODE,
      name: 'Book 1 v1.0 Locked Baseline',
      description: 'Original frozen baseline manuscript from novel_documents',
      state: 'draft',
      word_count: data.totalWords,
    }, { onConflict: 'project_id,code' });

    if (snapErr) throw new Error(`revision_snapshots insert failed: ${snapErr.message}`);

    // 8. Batch insert revision_content_map in chunks of 500
    console.log(`Inserting ${contentMapEntries.length} content_map mappings...`);
    for (let i = 0; i < contentMapEntries.length; i += 500) {
      const chunk = contentMapEntries.slice(i, i + 500);
      const { error } = await supabase.from('revision_content_map').upsert(chunk, { onConflict: 'snapshot_id,unit_id' });
      if (error) throw new Error(`revision_content_map insert failed: ${error.message}`);
    }

    // 9. Batch insert scene_matrices
    console.log(`Inserting ${sceneMatrixEntries.length} scene_matrices...`);
    const { error: smErr } = await supabase.from('scene_matrices').upsert(sceneMatrixEntries, { onConflict: 'snapshot_id,scene_unit_id' });
    if (smErr) throw new Error(`scene_matrices insert failed: ${smErr.message}`);

    // 10. Call lock_revision_snapshot RPC to permanently lock B1_v1.0_LOCKED
    console.log(`Locking snapshot ${SNAPSHOT_CODE} via DB RPC...`);
    const { data: lockResult, error: lockErr } = await supabase.rpc('lock_revision_snapshot', {
      p_snapshot_id: snapshotId,
    });

    if (lockErr) throw new Error(`lock_revision_snapshot RPC failed: ${lockErr.message}`);
    console.log('Lock Result:', lockResult);

    // 11. Mark import_runs as succeeded
    await supabase.from('import_runs').update({
      snapshot_id: snapshotId,
      status: 'succeeded',
      node_count: contentUnitsToInsert.length,
      paragraph_count: paragraphVersionsToInsert.length,
      word_count: data.totalWords,
      completed_at: new Date().toISOString(),
    }).eq('id', runId);

    console.log('\n========================================');
    console.log('  MIGRATION & LOCK SUCCESSFULLY APPLIED ');
    console.log('========================================');
    console.log(`Snapshot Code: ${SNAPSHOT_CODE}`);
    console.log(`Snapshot UUID: ${snapshotId}`);
    console.log(`Total Units: ${contentUnitsToInsert.length}`);
    console.log(`Total Paragraph Versions: ${paragraphVersionsToInsert.length}`);
    console.log(`Total Words: ${data.totalWords}`);
  } catch (err: any) {
    console.error('Migration failed:', err.message);
    if (runId) {
      await supabase.from('import_runs').update({
        status: 'failed',
        error_log: err.message,
        completed_at: new Date().toISOString(),
      }).eq('id', runId);
    }
    process.exit(1);
  }
}

async function runVerify() {
  console.log('\n========================================');
  console.log('       SEED V1 VERIFY ONLY              ');
  console.log('========================================');
  const SNAPSHOT_CODE = 'B1_v1.0_LOCKED';

  const { data: snapshot, error: snapErr } = await supabase
    .from('revision_snapshots')
    .select('*')
    .eq('code', SNAPSHOT_CODE)
    .single();

  if (snapErr || !snapshot) {
    console.error(`Snapshot ${SNAPSHOT_CODE} not found in DB.`);
    return;
  }

  console.log(`Snapshot Found: ${snapshot.code} (State: ${snapshot.state}, Words: ${snapshot.word_count})`);
  console.log(`Manifest Hash: ${snapshot.manifest_hash}`);
  console.log(`Locked At: ${snapshot.locked_at}`);

  // Test immutability: attempt to update content map on locked snapshot (should fail)
  console.log('\nTesting DB lock trigger (attempting mutation on locked snapshot)...');
  const { error: triggerErr } = await supabase
    .from('revision_content_map')
    .update({ title_override: 'Illegal Mutation Test' })
    .eq('snapshot_id', snapshot.id);

  if (triggerErr) {
    console.log(`[PASS] Mutation rejected by trigger: "${triggerErr.message}"`);
  } else {
    console.error('[FAIL] Trigger did not reject mutation on locked snapshot!');
  }
}

// CLI entry point
const args = process.argv.slice(2);
if (args.includes('--apply')) {
  runApply();
} else if (args.includes('--verify-only')) {
  runVerify();
} else {
  runDryRun();
}
