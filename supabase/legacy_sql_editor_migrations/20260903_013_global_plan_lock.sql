-- ====================================================================
-- Migration: 20260903_013_global_plan_lock.sql
-- Description: Schema, Tables, and Atomic Locking Function for Book 1 Pass 1 Global Plan Lock
-- ====================================================================

-- 1. Extend audit_runs for Global Plan Lock semantics
ALTER TABLE public.audit_runs DROP CONSTRAINT IF EXISTS audit_runs_run_type_check;
ALTER TABLE public.audit_runs ADD CONSTRAINT audit_runs_run_type_check 
    CHECK (run_type IN ('formal', 'amendment', 'pilot', 'global_lock', 'global_plan_lock'));

ALTER TABLE public.audit_runs
ADD COLUMN IF NOT EXISTS audit_semantics TEXT NOT NULL DEFAULT 'ANALYSIS'
CHECK (audit_semantics IN ('ANALYSIS', 'PLAN_LOCK', 'EXECUTION_AUDIT')),
ADD COLUMN IF NOT EXISTS manifest_hash TEXT,
ADD COLUMN IF NOT EXISTS manifest_data JSONB;

-- 2. Audit Run Dependencies Table
CREATE TABLE IF NOT EXISTS public.audit_run_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_global_audit_id UUID NOT NULL REFERENCES public.audit_runs(id) ON DELETE CASCADE,
    dependency_type TEXT NOT NULL CHECK (dependency_type IN ('CHILD_AUDIT', 'CANON_DECISION', 'SCOPE_RECORD', 'INCIDENT_RECORD', 'PROVENANCE')),
    dependency_id UUID,
    dependency_code TEXT NOT NULL,
    dependency_hash_at_lock TEXT NOT NULL,
    dependency_status_at_lock TEXT NOT NULL,
    sequence_no INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(parent_global_audit_id, dependency_code)
);

CREATE INDEX IF NOT EXISTS idx_audit_run_deps_parent ON public.audit_run_dependencies(parent_global_audit_id);

-- 3. Extend series_debts with lifecycle management fields
ALTER TABLE public.series_debts
ADD COLUMN IF NOT EXISTS severity TEXT NOT NULL DEFAULT 'HIGH' CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
ADD COLUMN IF NOT EXISTS resolution_stage TEXT,
ADD COLUMN IF NOT EXISTS blocking_stage TEXT,
ADD COLUMN IF NOT EXISTS required_action TEXT,
ADD COLUMN IF NOT EXISTS acceptance_criteria TEXT,
ADD COLUMN IF NOT EXISTS responsible_role TEXT;

-- 4. Enable RLS on audit_run_dependencies
ALTER TABLE public.audit_run_dependencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_run_dependencies_owner_all" ON public.audit_run_dependencies;
CREATE POLICY "audit_run_dependencies_owner_all"
ON public.audit_run_dependencies FOR ALL
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- 5. Atomic Global Audit Locking Function
CREATE OR REPLACE FUNCTION public.fn_lock_pass1_global_audit(
    p_manifest JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_global_code TEXT := 'B1_PASS1_GLOBAL_001';
    v_manifest_hash TEXT;
    v_proj_id UUID;
    v_base_snap_id UUID;
    v_target_snap_id UUID;
    v_existing_id UUID;
    v_existing_hash TEXT;
    v_global_audit_id UUID;
    v_zero_diff JSONB;
    v_child_count INT;
    v_canon_count INT;
    v_dep_item JSONB;
    v_idx INT := 1;
BEGIN
    -- 1. Acquire transactional advisory lock to guarantee mutual exclusion
    PERFORM pg_advisory_xact_lock(hashtext('pass1_global_plan_lock'));

    v_manifest_hash := p_manifest->>'manifest_hash';
    IF v_manifest_hash IS NULL OR length(v_manifest_hash) != 64 THEN
        RAISE EXCEPTION 'Invalid manifest_hash in manifest payload';
    END IF;

    -- 2. Check if global audit already exists
    SELECT id, audit_hash INTO v_existing_id, v_existing_hash
    FROM public.audit_runs
    WHERE code = v_global_code;

    IF v_existing_id IS NOT NULL THEN
        IF v_existing_hash = v_manifest_hash THEN
            RETURN jsonb_build_object(
                'status', 'ALREADY_LOCKED',
                'audit_code', v_global_code,
                'audit_id', v_existing_id,
                'audit_hash', v_existing_hash,
                'message', 'Idempotent success: Global audit already locked with identical hash'
            );
        ELSE
            RAISE EXCEPTION 'Global audit % already exists with conflicting hash % (new: %)', v_global_code, v_existing_hash, v_manifest_hash;
        END IF;
    END IF;

    -- 3. Resolve Project and Snapshot IDs
    SELECT id INTO v_proj_id FROM public.revision_projects WHERE slug = 'the-resonance-of-space-book-1';
    SELECT id INTO v_base_snap_id FROM public.revision_snapshots WHERE code = 'B1_v1.0_LOCKED';
    SELECT id INTO v_target_snap_id FROM public.revision_snapshots WHERE code = 'B1_v1.1_STRUCT_DRAFT';

    IF v_proj_id IS NULL OR v_base_snap_id IS NULL OR v_target_snap_id IS NULL THEN
        RAISE EXCEPTION 'Core project or snapshot records not found';
    END IF;

    -- 4. Verify exactly 15 required child audits are LOCKED
    SELECT count(*) INTO v_child_count
    FROM public.audit_runs
    WHERE code IN (
        'B1_PASS1_PROLOGUE_001',
        'B1_PASS1_ACT0_001', 'B1_PASS1_ACT0_001_A01', 'B1_PASS1_ACT0_001_A02',
        'B1_PASS1_ACT1_001', 'B1_PASS1_ACT1_001_A01',
        'B1_PASS1_ACT2_001', 'B1_PASS1_ACT2_001_A01',
        'B1_PASS1_ACT3_001', 'B1_PASS1_ACT3_001_A01',
        'B1_PASS1_ACT4_001', 'B1_PASS1_ACT4_001_A01',
        'B1_PASS1_EPILOGUE_001', 'B1_PASS1_EPILOGUE_001_A01',
        'B1_PASS1_FRONTMATTER_APPENDIX_001'
    )
    AND status = 'locked';

    IF v_child_count != 15 THEN
        RAISE EXCEPTION 'Audit prerequisite failure: Expected 15 locked child audits, found %', v_child_count;
    END IF;

    -- 5. Verify Family Name Canon decision is LOCKED
    SELECT count(*) INTO v_canon_count
    FROM public.canon_decisions
    WHERE decision_code = 'CANON_DECISION_FAMILY_NAMES_001'
    AND status = 'locked';

    IF v_canon_count != 1 THEN
        RAISE EXCEPTION 'Canon prerequisite failure: CANON_DECISION_FAMILY_NAMES_001 is not locked';
    END IF;

    -- 6. Verify Database-side Zero-Diff
    v_zero_diff := public.fn_verify_snapshot_zero_diff('B1_v1.0_LOCKED', 'B1_v1.1_STRUCT_DRAFT');
    IF (v_zero_diff->>'is_identical')::boolean IS NOT TRUE OR (v_zero_diff->>'difference_count')::int != 0 THEN
        RAISE EXCEPTION 'Zero-diff failure: working snapshot differs from locked baseline: %', v_zero_diff;
    END IF;

    -- 7. Insert Global Audit Run row
    INSERT INTO public.audit_runs (
        code,
        project_id,
        source_snapshot_id,
        target_snapshot_id,
        pass_number,
        scope_name,
        criteria_version,
        run_type,
        audit_semantics,
        status,
        audit_hash,
        manifest_hash,
        manifest_data,
        locked_at,
        amendment_reason
    ) VALUES (
        v_global_code,
        v_proj_id,
        v_base_snap_id,
        v_target_snap_id,
        1,
        'BOOK I — COMPLETE PASS 1 DIAGNOSTIC PLAN',
        '1.0.0',
        'global_plan_lock',
        'PLAN_LOCK',
        'locked',
        v_manifest_hash,
        v_manifest_hash,
        p_manifest,
        now(),
        'Global plan lock freezing all 52 narrative scenes, 7 publication source units, 9 publication blocks, 15 child audits, family name canon, debt register, and 180k target budget allocation.'
    ) RETURNING id INTO v_global_audit_id;

    -- 8. Insert Dependencies into audit_run_dependencies
    FOR v_dep_item IN SELECT * FROM jsonb_array_elements(p_manifest->'child_audits')
    LOOP
        INSERT INTO public.audit_run_dependencies (
            parent_global_audit_id,
            dependency_type,
            dependency_code,
            dependency_hash_at_lock,
            dependency_status_at_lock,
            sequence_no,
            notes
        ) VALUES (
            v_global_audit_id,
            'CHILD_AUDIT',
            v_dep_item->>'code',
            v_dep_item->>'audit_hash',
            'locked',
            v_idx,
            v_dep_item->>'scope'
        );
        v_idx := v_idx + 1;
    END LOOP;

    -- Non-audit dependencies
    INSERT INTO public.audit_run_dependencies (
        parent_global_audit_id, dependency_type, dependency_code, dependency_hash_at_lock, dependency_status_at_lock, sequence_no, notes
    ) VALUES
    (v_global_audit_id, 'CANON_DECISION', 'CANON_DECISION_FAMILY_NAMES_001', 'CANON_FAMILY_NAMES_LOCKED', 'locked', v_idx, 'Canonized Yoo Ji-man, Jeon Seo-yeon, Ian Yoo'),
    (v_global_audit_id, 'SCOPE_RECORD', 'BOOK1_NARRATIVE_UNIT_SCOPE_001', '52_NARRATIVE_7_NON_NARRATIVE', 'locked', v_idx + 1, '52 canonical narrative scenes vs 7 non-narrative source units'),
    (v_global_audit_id, 'INCIDENT_RECORD', 'PLATFORM_INCIDENT_SNAPSHOT_CLONE_001', 'SNAPSHOT_CLONE_REPAIRED', 'repaired', v_idx + 2, 'Snapshot clone missing rows repaired and zero-diff verified'),
    (v_global_audit_id, 'PROVENANCE', 'B1_PASS1_PROVENANCE_001', 'IMMUTABLE_BASELINE_B1_V1_0', 'locked', v_idx + 3, 'Grounding in B1_v1.0_LOCKED immutable source');

    RETURN jsonb_build_object(
        'status', 'LOCKED',
        'audit_code', v_global_code,
        'audit_id', v_global_audit_id,
        'audit_hash', v_manifest_hash,
        'child_audits_count', v_child_count,
        'dependencies_count', v_idx + 3,
        'zero_diff_verified', true,
        'locked_at', now()
    );
END;
$$;
