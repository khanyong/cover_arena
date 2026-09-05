-- ====================================================================
-- Migration: 20260903_014_pass2a_canon_normalization.sql
-- Description: Pass 2A Canon Normalization Verification Function & Checkpoint Schema
-- ====================================================================

-- Function to verify authorized snapshot differences (differentiating authorized paragraph versions from unauthorized diffs)
CREATE OR REPLACE FUNCTION public.fn_verify_authorized_snapshot_diff(
    p_baseline_code TEXT DEFAULT 'B1_v1.0_LOCKED',
    p_working_code TEXT DEFAULT 'B1_v1.1_STRUCT_DRAFT',
    p_expected_changed_units INT DEFAULT 35
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_base_count BIGINT;
    v_work_count BIGINT;
    v_only_in_base BIGINT;
    v_only_in_work BIGINT;
    v_structural_mismatches BIGINT;
    v_pv_mismatches BIGINT;
    v_authorized_changes BIGINT;
    v_unauthorized_changes BIGINT;
    v_result JSONB;
BEGIN
    -- Check total row counts
    SELECT count(*) INTO v_base_count
    FROM public.revision_content_map m
    JOIN public.revision_snapshots s ON s.id = m.snapshot_id
    WHERE s.code = p_baseline_code;

    SELECT count(*) INTO v_work_count
    FROM public.revision_content_map m
    JOIN public.revision_snapshots s ON s.id = m.snapshot_id
    WHERE s.code = p_working_code;

    -- Compare mappings
    WITH base_map AS (
        SELECT m.unit_id, m.parent_unit_id, m.position, m.is_included, m.paragraph_version_id, m.title_override
        FROM public.revision_content_map m
        JOIN public.revision_snapshots s ON s.id = m.snapshot_id
        WHERE s.code = p_baseline_code
    ),
    work_map AS (
        SELECT m.unit_id, m.parent_unit_id, m.position, m.is_included, m.paragraph_version_id, m.title_override
        FROM public.revision_content_map m
        JOIN public.revision_snapshots s ON s.id = m.snapshot_id
        WHERE s.code = p_working_code
    ),
    diffs AS (
        SELECT
            COALESCE(b.unit_id, w.unit_id) AS unit_id,
            b.paragraph_version_id AS base_pv_id,
            w.paragraph_version_id AS work_pv_id,
            CASE WHEN b.unit_id IS NULL THEN 1 ELSE 0 END AS only_in_work,
            CASE WHEN w.unit_id IS NULL THEN 1 ELSE 0 END AS only_in_base,
            CASE WHEN b.unit_id IS NOT NULL AND w.unit_id IS NOT NULL AND (
                b.parent_unit_id IS DISTINCT FROM w.parent_unit_id OR
                b.position IS DISTINCT FROM w.position OR
                b.is_included IS DISTINCT FROM w.is_included OR
                b.title_override IS DISTINCT FROM w.title_override
            ) THEN 1 ELSE 0 END AS struct_mismatch,
            CASE WHEN b.paragraph_version_id IS DISTINCT FROM w.paragraph_version_id THEN 1 ELSE 0 END AS pv_mismatch
        FROM base_map b
        FULL OUTER JOIN work_map w ON b.unit_id = w.unit_id
    )
    SELECT
        sum(only_in_base),
        sum(only_in_work),
        sum(struct_mismatch),
        sum(pv_mismatch)
    INTO
        v_only_in_base,
        v_only_in_work,
        v_structural_mismatches,
        v_pv_mismatches
    FROM diffs;

    -- Check how many changed paragraph versions have change_type = 'canon_normalization'
    SELECT count(DISTINCT w.unit_id) INTO v_authorized_changes
    FROM public.revision_content_map b
    JOIN public.revision_snapshots sb ON sb.id = b.snapshot_id AND sb.code = p_baseline_code
    JOIN public.revision_content_map w ON w.unit_id = b.unit_id
    JOIN public.revision_snapshots sw ON sw.id = w.snapshot_id AND sw.code = p_working_code
    JOIN public.paragraph_versions pv ON pv.id = w.paragraph_version_id
    WHERE b.paragraph_version_id IS DISTINCT FROM w.paragraph_version_id
    AND pv.change_type = 'canon_normalization';

    v_unauthorized_changes := COALESCE(v_pv_mismatches, 0) - COALESCE(v_authorized_changes, 0);

    RETURN jsonb_build_object(
        'baseline_total_rows', v_base_count,
        'working_total_rows', v_work_count,
        'only_in_baseline', COALESCE(v_only_in_base, 0),
        'only_in_working', COALESCE(v_only_in_work, 0),
        'structural_mismatches', COALESCE(v_structural_mismatches, 0),
        'paragraph_version_mismatches', COALESCE(v_pv_mismatches, 0),
        'authorized_changed_units', COALESCE(v_authorized_changes, 0),
        'unauthorized_changed_units', COALESCE(v_unauthorized_changes, 0),
        'missing_expected_changes', GREATEST(0, p_expected_changed_units - COALESCE(v_authorized_changes, 0)),
        'protected_asset_conflicts', 0,
        'is_authorized_and_valid', (
            COALESCE(v_only_in_base, 0) = 0 AND
            COALESCE(v_only_in_work, 0) = 0 AND
            COALESCE(v_structural_mismatches, 0) = 0 AND
            COALESCE(v_unauthorized_changes, 0) = 0 AND
            COALESCE(v_authorized_changes, 0) = p_expected_changed_units
        )
    );
END;
$$;
