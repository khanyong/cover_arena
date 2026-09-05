import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  console.log('=== CLONING POST-PASS 2A CHECKPOINT SNAPSHOT ===\n');
  const SOURCE_CODE = 'B1_v1.1_STRUCT_DRAFT';
  const TARGET_CODE = 'B1_PASS2A_CANON_NORMALIZED_LOCKED';

  // 1. Fetch Source Snapshot
  const { data: sourceSnap } = await supabase.from('revision_snapshots').select('*').eq('code', SOURCE_CODE).single();
  if (!sourceSnap) throw new Error(`Source snapshot ${SOURCE_CODE} not found.`);

  // 2. Ensure Target Snapshot is freshly created in 'draft' state
  await supabase.from('revision_snapshots').delete().eq('code', TARGET_CODE);
  const { data: targetSnap, error: nErr } = await supabase.from('revision_snapshots').insert({
    project_id: sourceSnap.project_id,
    code: TARGET_CODE,
    name: 'Book 1 Pass 2A Canon Normalized Locked Snapshot',
    description: 'Immutable checkpoint between Canon normalization and structural revision',
    state: 'draft',
    base_snapshot_id: sourceSnap.id,
    word_count: sourceSnap.word_count,
    snapshot_kind: 'formal',
    is_canonical: false,
  }).select().single();
  if (nErr) throw new Error(`Failed to create target snapshot: ${nErr.message}`);

  // 3. Batch Copy content map (2000 per chunk)
  console.log(`Copying 45,647 content map records from ${SOURCE_CODE} to ${TARGET_CODE}...`);
  let offset = 0;
  const limit = 2000;
  let totalCopied = 0;

  while (true) {
    const { data: chunk, error: cErr } = await supabase
      .from('revision_content_map')
      .select('unit_id, parent_unit_id, position, paragraph_version_id, is_included, title_override, metadata_override')
      .eq('snapshot_id', sourceSnap.id)
      .range(offset, offset + limit - 1);

    if (cErr) throw new Error(`Fetch map failed at offset ${offset}: ${cErr.message}`);
    if (!chunk || chunk.length === 0) break;

    const mappedChunk = chunk.map(row => ({
      snapshot_id: targetSnap.id,
      unit_id: row.unit_id,
      parent_unit_id: row.parent_unit_id,
      position: row.position,
      paragraph_version_id: row.paragraph_version_id,
      is_included: row.is_included,
      title_override: row.title_override,
      metadata_override: row.metadata_override,
    }));

    const { error: insErr } = await supabase
      .from('revision_content_map')
      .upsert(mappedChunk, { onConflict: 'snapshot_id,unit_id' });

    if (insErr) throw new Error(`Insert map failed at offset ${offset}: ${insErr.message}`);

    totalCopied += chunk.length;
    console.log(`   Copied ${totalCopied} / 45647 records...`);
    offset += limit;
  }

  // 4. Copy scene_matrices
  console.log('Copying scene_matrices...');
  const { data: matrices } = await supabase
    .from('scene_matrices')
    .select('*')
    .eq('snapshot_id', sourceSnap.id);

  if (matrices && matrices.length > 0) {
    const mappedMatrices = matrices.map(m => ({
      ...m,
      snapshot_id: targetSnap.id,
      updated_at: new Date().toISOString(),
    }));

    const { error: insMatErr } = await supabase
      .from('scene_matrices')
      .upsert(mappedMatrices, { onConflict: 'snapshot_id,scene_unit_id' });

    if (insMatErr) throw new Error(`Insert scene_matrices failed: ${insMatErr.message}`);
    console.log(`   Copied ${matrices.length} scene_matrices records.`);
  }

  // 5. Lock Target Checkpoint Snapshot
  console.log(`Locking ${TARGET_CODE}...`);
  const { error: lockErr } = await supabase
    .from('revision_snapshots')
    .update({
      state: 'locked',
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', targetSnap.id);

  if (lockErr) throw new Error(`Locking target snapshot failed: ${lockErr.message}`);

  // 6. Final verification
  const { count: finalCount } = await supabase
    .from('revision_content_map')
    .select('*', { count: 'exact', head: true })
    .eq('snapshot_id', targetSnap.id);

  console.log('\n===========================================================');
  console.log(`[SUCCESS] CHECKPOINT SNAPSHOT ${TARGET_CODE} LOCKED!`);
  console.log(`Total Mappings: ${finalCount} / 45647`);
  console.log(`Status: LOCKED`);
  console.log('===========================================================');
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
