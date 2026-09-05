-- ====================================================================
-- Migration: 20260903_001_revision_core.sql
-- Description: Core schema for 9-Pass Novel Revision Platform (Phase A)
-- ====================================================================

-- 1. Revision Projects Table
CREATE TABLE IF NOT EXISTS public.revision_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    source_document_id TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_range_min INT NOT NULL DEFAULT 165000,
    target_range_max INT NOT NULL DEFAULT 185000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Content Units Table (Permanent identity for Act, Chapter, Scene, Paragraph)
CREATE TABLE IF NOT EXISTS public.content_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.revision_projects(id) ON DELETE CASCADE,
    unit_type TEXT NOT NULL CHECK (unit_type IN ('act', 'chapter', 'scene', 'paragraph')),
    source_key TEXT NOT NULL,
    source_path TEXT NOT NULL,
    original_parent_id UUID REFERENCES public.content_units(id) ON DELETE SET NULL,
    original_position INT NOT NULL DEFAULT 0,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_content_units_source_key UNIQUE (project_id, source_key),
    CONSTRAINT uq_content_units_source_path UNIQUE (project_id, source_path)
);

CREATE INDEX IF NOT EXISTS idx_content_units_project_type ON public.content_units(project_id, unit_type);
CREATE INDEX IF NOT EXISTS idx_content_units_parent ON public.content_units(original_parent_id);

-- 3. Revision Snapshots Table (Whole-manuscript snapshots e.g. B1_v1.0_LOCKED, B1_v1.1_PILOT_DRAFT)
CREATE TABLE IF NOT EXISTS public.revision_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.revision_projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    state TEXT NOT NULL CHECK (state IN ('draft', 'locked', 'archived')) DEFAULT 'draft',
    base_snapshot_id UUID REFERENCES public.revision_snapshots(id) ON DELETE SET NULL,
    manifest_hash TEXT,
    word_count INT NOT NULL DEFAULT 0,
    locked_at TIMESTAMPTZ,
    locked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_revision_snapshots_code UNIQUE (project_id, code)
);

CREATE INDEX IF NOT EXISTS idx_revision_snapshots_project ON public.revision_snapshots(project_id);

-- 4. Paragraph Versions Table (Immutable versions of paragraph text)
CREATE TABLE IF NOT EXISTS public.paragraph_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paragraph_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    version_no INT NOT NULL DEFAULT 1,
    body_markdown TEXT NOT NULL,
    body_hash TEXT NOT NULL,
    base_version_id UUID REFERENCES public.paragraph_versions(id) ON DELETE SET NULL,
    change_type TEXT NOT NULL DEFAULT 'import' CHECK (change_type IN ('import', 'rewrite', 'split', 'merge', 'calibration', 'polish')),
    change_note TEXT,
    word_count INT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_paragraph_versions_no UNIQUE (paragraph_unit_id, version_no)
);

CREATE INDEX IF NOT EXISTS idx_paragraph_versions_unit ON public.paragraph_versions(paragraph_unit_id);

-- 5. Paragraph Version Lineage Table (Many-to-many split/merge/rewriting graph)
CREATE TABLE IF NOT EXISTS public.paragraph_version_lineage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_version_id UUID NOT NULL REFERENCES public.paragraph_versions(id) ON DELETE CASCADE,
    parent_version_id UUID NOT NULL REFERENCES public.paragraph_versions(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL CHECK (relation_type IN ('rewritten_from', 'split_from', 'merged_from', 'adapted_from')),
    sequence_no INT NOT NULL DEFAULT 1,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_lineage_child_parent UNIQUE (child_version_id, parent_version_id)
);

CREATE INDEX IF NOT EXISTS idx_lineage_child ON public.paragraph_version_lineage(child_version_id);
CREATE INDEX IF NOT EXISTS idx_lineage_parent ON public.paragraph_version_lineage(parent_version_id);

-- 6. Revision Content Map Table (Defines snapshot structure, ordering, and active paragraph versions)
CREATE TABLE IF NOT EXISTS public.revision_content_map (
    snapshot_id UUID NOT NULL REFERENCES public.revision_snapshots(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    parent_unit_id UUID REFERENCES public.content_units(id) ON DELETE SET NULL,
    position INT NOT NULL DEFAULT 0,
    paragraph_version_id UUID REFERENCES public.paragraph_versions(id) ON DELETE SET NULL,
    is_included BOOLEAN NOT NULL DEFAULT true,
    title_override TEXT,
    metadata_override JSONB,
    PRIMARY KEY (snapshot_id, unit_id),
    CONSTRAINT uq_content_map_ordering UNIQUE (snapshot_id, parent_unit_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS idx_content_map_parent ON public.revision_content_map(snapshot_id, parent_unit_id, position);
CREATE INDEX IF NOT EXISTS idx_content_map_paragraph_ver ON public.revision_content_map(paragraph_version_id);

-- 7. Scene Matrices Table (Diagnosis & review per snapshot / audit run)
CREATE TABLE IF NOT EXISTS public.scene_matrices (
    snapshot_id UUID NOT NULL REFERENCES public.revision_snapshots(id) ON DELETE CASCADE,
    scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    pov_character TEXT,
    local_question TEXT,
    new_evidence TEXT,
    model_movement TEXT,
    capability TEXT,
    "constraint" TEXT,
    character_decision TEXT,
    power_shift TEXT,
    final_consequence TEXT,
    next_problem TEXT,
    action TEXT CHECK (action IN ('Keep', 'Compress', 'Merge', 'Reorder', 'Reframe', 'Rewrite', 'Archive')) DEFAULT 'Keep',
    compression_target_words INT,
    compression_target_percent NUMERIC(5,2),
    protected_status TEXT CHECK (protected_status IN ('None', 'Exact Text', 'Semantic', 'Structural', 'Canon')) DEFAULT 'None',
    status TEXT CHECK (status IN ('Diagnosed', 'Structure Approved', 'Science Cleared', 'Rewrite Ready', 'Drafted', 'Reviewed', 'Accepted', 'Locked')) DEFAULT 'Diagnosed',
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (snapshot_id, scene_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_scene_matrices_status ON public.scene_matrices(snapshot_id, status);

-- 8. Import Runs Table (Idempotent seed and migration tracking)
CREATE TABLE IF NOT EXISTS public.import_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_document_id TEXT NOT NULL,
    source_hash TEXT NOT NULL,
    target_snapshot_code TEXT NOT NULL,
    project_id UUID NOT NULL REFERENCES public.revision_projects(id) ON DELETE CASCADE,
    snapshot_id UUID REFERENCES public.revision_snapshots(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed')) DEFAULT 'running',
    node_count INT NOT NULL DEFAULT 0,
    paragraph_count INT NOT NULL DEFAULT 0,
    word_count INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    error_log TEXT,
    CONSTRAINT uq_import_runs_idempotency UNIQUE (source_document_id, source_hash, target_snapshot_code)
);
