export type ContentUnitType = 'act' | 'chapter' | 'scene' | 'paragraph';
export type SnapshotState = 'draft' | 'locked' | 'archived';
export type ChangeType = 'import' | 'rewrite' | 'split' | 'merge' | 'calibration' | 'polish';
export type SceneAction = 'Keep' | 'Compress' | 'Merge' | 'Reorder' | 'Reframe' | 'Rewrite' | 'Archive';
export type ProtectedStatus = 'None' | 'Exact Text' | 'Semantic' | 'Structural' | 'Canon';
export type SceneStatus = 'Diagnosed' | 'Structure Approved' | 'Science Cleared' | 'Rewrite Ready' | 'Drafted' | 'Reviewed' | 'Accepted' | 'Locked';

export interface RevisionProject {
  id: string;
  slug: string;
  title: string;
  description?: string;
  source_document_id: string;
  owner_id?: string;
  target_range_min: number;
  target_range_max: number;
  created_at: string;
  updated_at: string;
}

export interface ContentUnit {
  id: string;
  project_id: string;
  unit_type: ContentUnitType;
  source_key: string;
  source_path: string;
  original_parent_id?: string | null;
  original_position: number;
  title?: string | null;
  created_at: string;
}

export interface RevisionSnapshot {
  id: string;
  project_id: string;
  code: string;
  name: string;
  description?: string;
  state: SnapshotState;
  base_snapshot_id?: string | null;
  manifest_hash?: string;
  word_count: number;
  locked_at?: string | null;
  locked_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParagraphVersion {
  id: string;
  paragraph_unit_id: string;
  version_no: number;
  body_markdown: string;
  body_hash: string;
  base_version_id?: string | null;
  change_type: ChangeType;
  change_note?: string | null;
  word_count: number;
  created_by?: string | null;
  created_at: string;
}

export interface RevisionContentMapEntry {
  snapshot_id: string;
  unit_id: string;
  parent_unit_id?: string | null;
  position: number;
  paragraph_version_id?: string | null;
  is_included: boolean;
  title_override?: string | null;
  metadata_override?: any;
}

export interface SceneMatrix {
  snapshot_id: string;
  scene_unit_id: string;
  pov_character?: string | null;
  local_question?: string | null;
  new_evidence?: string | null;
  model_movement?: string | null;
  capability?: string | null;
  constraint?: string | null;
  character_decision?: string | null;
  power_shift?: string | null;
  final_consequence?: string | null;
  next_problem?: string | null;
  action: SceneAction;
  compression_target_words?: number | null;
  compression_target_percent?: number | null;
  protected_status: ProtectedStatus;
  status: SceneStatus;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SceneWithParagraphs {
  sceneUnit: ContentUnit;
  sceneMatrix: SceneMatrix | null;
  paragraphs: Array<{
    unit: ContentUnit;
    mapEntry: RevisionContentMapEntry;
    version: ParagraphVersion;
  }>;
}
