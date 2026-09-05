-- ====================================================================
-- Migration: 20260903_005_pass1_audit_core.sql
-- Description: Pass 1 Scene Inventory & Audit Core Architecture
-- ====================================================================

-- 1. Add snapshot release/working semantics to revision_snapshots
ALTER TABLE public.revision_snapshots
ADD COLUMN IF NOT EXISTS is_current_release BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_primary_working BOOLEAN NOT NULL DEFAULT false;

-- Set initial semantic flags
UPDATE public.revision_snapshots
SET is_current_release = true, is_primary_working = false
WHERE code = 'B1_v1.0_LOCKED';

UPDATE public.revision_snapshots
SET is_current_release = false, is_primary_working = true
WHERE code = 'B1_v1.1_STRUCT_DRAFT';

-- 2. Extend lock trigger to prevent mutation on 'archived' snapshots as well as 'locked'
CREATE OR REPLACE FUNCTION public.fn_prevent_locked_content_map_mutation()
RETURNS TRIGGER AS $$
DECLARE
    target_snapshot_id UUID;
    target_state TEXT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_snapshot_id := OLD.snapshot_id;
    ELSE
        target_snapshot_id := NEW.snapshot_id;
    END IF;

    SELECT state INTO target_state
    FROM public.revision_snapshots
    WHERE id = target_snapshot_id;

    IF target_state IN ('locked', 'archived') THEN
        RAISE EXCEPTION 'Cannot modify content map for a % revision snapshot (snapshot_id: %)', target_state, target_snapshot_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Audit Runs Table
CREATE TABLE IF NOT EXISTS public.audit_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    project_id UUID NOT NULL REFERENCES public.revision_projects(id) ON DELETE CASCADE,
    source_snapshot_id UUID NOT NULL REFERENCES public.revision_snapshots(id) ON DELETE RESTRICT,
    target_snapshot_id UUID REFERENCES public.revision_snapshots(id) ON DELETE SET NULL,
    pass_number INT NOT NULL DEFAULT 1,
    scope_unit_id UUID REFERENCES public.content_units(id) ON DELETE SET NULL,
    scope_name TEXT NOT NULL,
    criteria_version TEXT NOT NULL DEFAULT '1.0.0',
    status TEXT NOT NULL CHECK (status IN ('draft', 'in_review', 'locked', 'archived')) DEFAULT 'draft',
    audit_hash TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_runs_project ON public.audit_runs(project_id, pass_number);

-- 4. Extend scene_matrices for audit_runs
ALTER TABLE public.scene_matrices
ADD COLUMN IF NOT EXISTS audit_run_id UUID REFERENCES public.audit_runs(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS protected_assets JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS repetition_notes TEXT,
ADD COLUMN IF NOT EXISTS future_book_notes TEXT;

-- Drop old primary key on (snapshot_id, scene_unit_id) to allow (audit_run_id, scene_unit_id) or flexible audit runs
ALTER TABLE public.scene_matrices DROP CONSTRAINT IF EXISTS scene_matrices_pkey;
ALTER TABLE public.scene_matrices ADD CONSTRAINT uq_scene_matrices_snapshot_scene UNIQUE (snapshot_id, scene_unit_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_scene_matrices_audit_scene ON public.scene_matrices(audit_run_id, scene_unit_id) WHERE audit_run_id IS NOT NULL;

-- 5. Structure Change Proposals Table (Pass 1 Action recommendations executed in Pass 2)
CREATE TABLE IF NOT EXISTS public.structure_change_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_run_id UUID NOT NULL REFERENCES public.audit_runs(id) ON DELETE CASCADE,
    scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('KEEP_COMPRESS', 'KEEP_COMPRESS_PROTECTED', 'KEEP_REFRAME_COMPRESS', 'MERGE', 'REORDER', 'ARCHIVE', 'DELETE')),
    rationale TEXT NOT NULL,
    current_word_count INT NOT NULL DEFAULT 0,
    projected_word_delta INT NOT NULL DEFAULT 0,
    target_word_count INT NOT NULL DEFAULT 0,
    target_compression_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    merge_group_id TEXT,
    proposed_parent_id UUID REFERENCES public.content_units(id) ON DELETE SET NULL,
    proposed_position INT,
    dependency_notes TEXT,
    approval_status TEXT NOT NULL CHECK (approval_status IN ('proposed', 'approved', 'rejected', 'executed')) DEFAULT 'proposed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_proposals_audit_scene UNIQUE (audit_run_id, scene_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_proposals_audit ON public.structure_change_proposals(audit_run_id);

-- 6. Chapter Gates Table
CREATE TABLE IF NOT EXISTS public.chapter_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_run_id UUID NOT NULL REFERENCES public.audit_runs(id) ON DELETE CASCADE,
    chapter_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    local_question TEXT NOT NULL,
    answer TEXT NOT NULL,
    larger_question TEXT NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('PASS', 'PASS_WITH_RESERVATIONS', 'FAIL')),
    verdict_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_chapter_gates_audit_chapter UNIQUE (audit_run_id, chapter_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_chapter_gates_audit ON public.chapter_gates(audit_run_id);

-- 7. RLS Policies for new tables
ALTER TABLE public.audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.structure_change_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_gates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_runs_owner_all"
ON public.audit_runs FOR ALL
USING (public.fn_is_project_owner(project_id))
WITH CHECK (public.fn_is_project_owner(project_id));

CREATE POLICY "structure_change_proposals_owner_all"
ON public.structure_change_proposals FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.audit_runs ar
    WHERE ar.id = structure_change_proposals.audit_run_id
    AND public.fn_is_project_owner(ar.project_id)
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.audit_runs ar
    WHERE ar.id = structure_change_proposals.audit_run_id
    AND public.fn_is_project_owner(ar.project_id)
));

CREATE POLICY "chapter_gates_owner_all"
ON public.chapter_gates FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.audit_runs ar
    WHERE ar.id = chapter_gates.audit_run_id
    AND public.fn_is_project_owner(ar.project_id)
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.audit_runs ar
    WHERE ar.id = chapter_gates.audit_run_id
    AND public.fn_is_project_owner(ar.project_id)
));
