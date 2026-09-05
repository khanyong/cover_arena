import { supabase } from '../supabase';
import type {
  RevisionProject,
  RevisionSnapshot,
  ContentUnit,
  RevisionContentMapEntry,
  ParagraphVersion,
  SceneMatrix,
  SceneWithParagraphs,
} from './types';

export async function getRevisionProjectBySlug(slug: string): Promise<RevisionProject | null> {
  const { data, error } = await supabase
    .from('revision_projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as RevisionProject;
}

export async function getRevisionSnapshots(projectId: string): Promise<RevisionSnapshot[]> {
  const { data, error } = await supabase
    .from('revision_snapshots')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as RevisionSnapshot[];
}

export async function getRevisionSnapshotByCode(projectId: string, code: string): Promise<RevisionSnapshot | null> {
  const { data, error } = await supabase
    .from('revision_snapshots')
    .select('*')
    .eq('project_id', projectId)
    .eq('code', code)
    .single();

  if (error || !data) return null;
  return data as RevisionSnapshot;
}

export async function getSceneUnit(projectId: string, identifier: string): Promise<ContentUnit | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  
  let query = supabase.from('content_units').select('*').eq('project_id', projectId);
  if (isUuid) {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('source_path', identifier);
  }

  const { data, error } = await query.single();
  if (error || !data) return null;
  return data as ContentUnit;
}

export const getSceneUnitByPath = getSceneUnit;

export async function getSceneWithParagraphs(
  snapshotId: string,
  sceneUnitId: string
): Promise<SceneWithParagraphs | null> {
  // 1. Fetch scene content unit
  const { data: sceneUnit, error: sceneErr } = await supabase
    .from('content_units')
    .select('*')
    .eq('id', sceneUnitId)
    .single();

  if (sceneErr || !sceneUnit) return null;

  // 2. Fetch scene matrix
  const { data: smData } = await supabase
    .from('scene_matrices')
    .select('*')
    .eq('snapshot_id', snapshotId)
    .eq('scene_unit_id', sceneUnitId)
    .maybeSingle();

  // 3. Fetch paragraph map entries under this scene
  const { data: mapRows, error: mapErr } = await supabase
    .from('revision_content_map')
    .select('*')
    .eq('snapshot_id', snapshotId)
    .eq('parent_unit_id', sceneUnitId)
    .eq('is_included', true)
    .order('position', { ascending: true });

  if (mapErr || !mapRows || mapRows.length === 0) {
    return {
      sceneUnit: sceneUnit as ContentUnit,
      sceneMatrix: (smData as SceneMatrix) || null,
      paragraphs: [],
    };
  }

  const paragraphUnitIds = mapRows.map(m => m.unit_id);
  const versionIds = mapRows.map(m => m.paragraph_version_id).filter(Boolean);

  // 4. Fetch content_units for paragraphs
  const { data: unitRows } = await supabase
    .from('content_units')
    .select('*')
    .in('id', paragraphUnitIds);

  const unitMap = new Map((unitRows || []).map(u => [u.id, u as ContentUnit]));

  // 5. Fetch paragraph_versions
  const { data: versionRows } = await supabase
    .from('paragraph_versions')
    .select('*')
    .in('id', versionIds);

  const versionMap = new Map((versionRows || []).map(v => [v.id, v as ParagraphVersion]));

  const paragraphs = mapRows.map(mapEntry => ({
    unit: unitMap.get(mapEntry.unit_id)!,
    mapEntry: mapEntry as RevisionContentMapEntry,
    version: versionMap.get(mapEntry.paragraph_version_id)!,
  })).filter(p => p.unit && p.version);

  return {
    sceneUnit: sceneUnit as ContentUnit,
    sceneMatrix: (smData as SceneMatrix) || null,
    paragraphs,
  };
}

export async function getSceneMatrix(snapshotId: string, sceneUnitId: string): Promise<SceneMatrix | null> {
  const { data, error } = await supabase
    .from('scene_matrices')
    .select('*')
    .eq('snapshot_id', snapshotId)
    .eq('scene_unit_id', sceneUnitId)
    .maybeSingle();

  if (error || !data) return null;
  return data as SceneMatrix;
}

export async function getLatestAuditRun(projectId: string, passNumber: number = 1): Promise<any | null> {
  const { data, error } = await supabase
    .from('audit_runs')
    .select('*')
    .eq('project_id', projectId)
    .eq('pass_number', passNumber)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function getStructureProposal(auditRunId: string, sceneUnitId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('structure_change_proposals')
    .select('*')
    .eq('audit_run_id', auditRunId)
    .eq('scene_unit_id', sceneUnitId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function getChapterGate(auditRunId: string, chapterUnitId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('chapter_gates')
    .select('*')
    .eq('audit_run_id', auditRunId)
    .eq('chapter_unit_id', chapterUnitId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
