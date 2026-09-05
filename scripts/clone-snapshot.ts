import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const sourceCode = process.argv[2] || 'B1_v1.0_LOCKED';
  const targetCode = process.argv[3] || 'B1_v1.1_PILOT_DRAFT';
  const targetName = process.argv[4] || 'Book 1 v1.1 Pilot Working Draft';

  console.log(`Cloning snapshot ${sourceCode} -> ${targetCode}...`);

  // 1. Fetch source snapshot
  const { data: sourceSnap, error: sErr } = await supabase
    .from('revision_snapshots')
    .select('*')
    .eq('code', sourceCode)
    .single();

  if (sErr || !sourceSnap) {
    throw new Error(`Source snapshot ${sourceCode} not found: ${sErr?.message}`);
  }

  // 2. Check if target snapshot already exists
  let targetSnapId: string;
  const { data: existingTarget } = await supabase
    .from('revision_snapshots')
    .select('id')
    .eq('project_id', sourceSnap.project_id)
    .eq('code', targetCode)
    .maybeSingle();

  if (existingTarget) {
    targetSnapId = existingTarget.id;
    console.log(`Target snapshot ${targetCode} already exists: ${targetSnapId}`);
  } else {
    const { data: newSnap, error: nErr } = await supabase
      .from('revision_snapshots')
      .insert({
        project_id: sourceSnap.project_id,
        code: targetCode,
        name: targetName,
        description: 'Working draft cloned from ' + sourceCode,
        state: 'draft',
        base_snapshot_id: sourceSnap.id,
        word_count: sourceSnap.word_count,
      })
      .select('id')
      .single();

    if (nErr || !newSnap) {
      throw new Error(`Failed to create target snapshot: ${nErr?.message}`);
    }
    targetSnapId = newSnap.id;
    console.log(`Created new target snapshot ${targetCode}: ${targetSnapId}`);
  }

  // 3. Batch copy revision_content_map
  console.log('Fetching content map from source...');
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
      snapshot_id: targetSnapId,
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
    console.log(`Copied ${totalCopied} content map records...`);
    offset += limit;
  }

  // 4. Copy scene_matrices
  console.log('Copying scene_matrices...');
  const { data: matrices, error: mErr } = await supabase
    .from('scene_matrices')
    .select('*')
    .eq('snapshot_id', sourceSnap.id);

  if (mErr) throw new Error(`Fetch scene_matrices failed: ${mErr.message}`);

  if (matrices && matrices.length > 0) {
    const mappedMatrices = matrices.map(m => ({
      ...m,
      snapshot_id: targetSnapId,
      updated_at: new Date().toISOString(),
    }));

    const { error: insMatErr } = await supabase
      .from('scene_matrices')
      .upsert(mappedMatrices, { onConflict: 'snapshot_id,scene_unit_id' });

    if (insMatErr) throw new Error(`Insert scene_matrices failed: ${insMatErr.message}`);
    console.log(`Copied ${matrices.length} scene_matrices records.`);
  }

  console.log(`\n[SUCCESS] Snapshot cloned: ${targetCode} (${targetSnapId}) with ${totalCopied} map entries.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
