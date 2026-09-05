import { supabase } from '../supabase';
import type { SceneMatrix } from './types';

export interface CreateCheckpointParams {
  snapshotId: string;
  paragraphUnitId: string;
  expectedCurrentVersionId: string;
  newBodyMarkdown: string;
  changeType?: string;
  changeNote?: string;
}

export async function createParagraphCheckpoint(params: CreateCheckpointParams) {
  const { data, error } = await supabase.rpc('create_paragraph_checkpoint', {
    p_snapshot_id: params.snapshotId,
    p_paragraph_unit_id: params.paragraphUnitId,
    p_expected_current_version_id: params.expectedCurrentVersionId,
    p_new_body_markdown: params.newBodyMarkdown,
    p_change_type: params.changeType || 'rewrite',
    p_change_note: params.changeNote || null,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function cloneRevisionSnapshot(
  sourceSnapshotId: string,
  newCode: string,
  newName: string,
  description?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('clone_revision_snapshot', {
    p_source_snapshot_id: sourceSnapshotId,
    p_new_code: newCode,
    p_new_name: newName,
    p_description: description || null,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data as string;
}

export async function lockRevisionSnapshot(snapshotId: string) {
  const { data, error } = await supabase.rpc('lock_revision_snapshot', {
    p_snapshot_id: snapshotId,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function saveSceneMatrix(matrix: Partial<SceneMatrix> & { snapshot_id: string; scene_unit_id: string }) {
  const { data, error } = await supabase
    .from('scene_matrices')
    .upsert({
      ...matrix,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'snapshot_id,scene_unit_id' })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as SceneMatrix;
}
