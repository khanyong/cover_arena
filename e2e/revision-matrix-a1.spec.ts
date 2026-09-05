import { describe, it, expect, beforeAll } from 'vitest';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

describe('Revision Matrix A1 Integration & Hardening Suite', () => {
  let projectId: string;
  let lockedSnapshotId: string;
  let localExecutionSceneId: string;

  beforeAll(async () => {
    const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
    projectId = proj.id;

    const { data: snap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
    lockedSnapshotId = snap.id;

    const { data: scUnit } = await supabase.from('content_units').select('id').eq('source_path', 'act-2/ch-3/sc-2').single();
    localExecutionSceneId = scUnit.id;
  });

  it('1. B1_v1.0_LOCKED snapshot must be permanently locked', async () => {
    const { data: snap } = await supabase.from('revision_snapshots').select('state, is_canonical').eq('id', lockedSnapshotId).single();
    expect(snap.state).toBe('locked');
    expect(snap.is_canonical).toBe(true);
  });

  it('2. DB lock trigger must disallow direct mutation on B1_v1.0_LOCKED content map', async () => {
    const { error } = await supabase
      .from('revision_content_map')
      .update({ title_override: 'Mutated' })
      .eq('snapshot_id', lockedSnapshotId);

    expect(error).not.toBeNull();
    expect(error?.message).toContain('Cannot modify content map for a locked revision snapshot');
  });

  it('3. Paragraph versions must be immutable (disallow UPDATE and DELETE)', async () => {
    const { data: ver } = await supabase.from('paragraph_versions').select('id').limit(1).single();

    const { error: updateErr } = await supabase
      .from('paragraph_versions')
      .update({ body_markdown: 'Mutated' })
      .eq('id', ver.id);

    expect(updateErr).not.toBeNull();
    expect(updateErr?.message).toContain('paragraph_versions records are immutable');

    const { error: deleteErr } = await supabase
      .from('paragraph_versions')
      .delete()
      .eq('id', ver.id);

    expect(deleteErr).not.toBeNull();
    expect(deleteErr?.message).toContain('paragraph_versions records are immutable');
  });

  it('4. Local Execution scene unit must be resolvable by permanent UUID', async () => {
    const { data: unit, error } = await supabase.from('content_units').select('*').eq('id', localExecutionSceneId).single();
    expect(error).toBeNull();
    expect(unit.title).toContain('Local Execution');
    expect(unit.source_path).toBe('act-2/ch-3/sc-2');
  });

  it('5. Whole-manuscript total counts must match canonical specification', async () => {
    const { count: unitCount } = await supabase.from('content_units').select('*', { count: 'exact', head: true });
    expect(unitCount).toBe(45647);

    const { count: baselineVersionCount } = await supabase
      .from('paragraph_versions')
      .select('*', { count: 'exact', head: true })
      .eq('change_type', 'import');

    expect(baselineVersionCount).toBe(45549);
  });
});
