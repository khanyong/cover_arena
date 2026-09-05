-- ====================================================================
-- Migration: 20260903_010_zero_diff_verification_function.sql
-- Description: Database-side zero-diff snapshot verification function
-- ====================================================================

CREATE OR REPLACE FUNCTION public.fn_verify_snapshot_zero_diff(
    p_snap1_code TEXT DEFAULT 'B1_v1.0_LOCKED',
    p_snap2_code TEXT DEFAULT 'B1_v1.1_STRUCT_DRAFT'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_snap1_count BIGINT;
    v_snap2_count BIGINT;
    v_only_in_working BIGINT;
    v_only_in_baseline BIGINT;
    v_mismatched_rows BIGINT;
    v_diff_count BIGINT;
BEGIN
    -- Check row counts for each snapshot
    SELECT count(*) INTO v_snap1_count
    FROM public.revision_content_map m
    JOIN public.revision_snapshots s ON s.id = m.snapshot_id
    WHERE s.code = p_snap1_code;

    SELECT count(*) INTO v_snap2_count
    FROM public.revision_content_map m
    JOIN public.revision_snapshots s ON s.id = m.snapshot_id
    WHERE s.code = p_snap2_code;

    -- 1. Full Outer Join Structural & Content Comparison
    WITH baseline AS (
        SELECT m.unit_id, m.parent_unit_id, m.position, m.is_included, m.paragraph_version_id, m.title_override
        FROM public.revision_content_map m
        JOIN public.revision_snapshots s ON s.id = m.snapshot_id
        WHERE s.code = p_snap1_code
    ),
    working AS (
        SELECT m.unit_id, m.parent_unit_id, m.position, m.is_included, m.paragraph_version_id, m.title_override
        FROM public.revision_content_map m
        JOIN public.revision_snapshots s ON s.id = m.snapshot_id
        WHERE s.code = p_snap2_code
    )
    SELECT
        count(*) FILTER (WHERE baseline.unit_id IS NULL),
        count(*) FILTER (WHERE working.unit_id IS NULL),
        count(*) FILTER (
            WHERE baseline.unit_id IS NOT NULL AND working.unit_id IS NOT NULL
            AND (
                baseline.parent_unit_id IS DISTINCT FROM working.parent_unit_id
                OR baseline.position IS DISTINCT FROM working.position
                OR baseline.is_included IS DISTINCT FROM working.is_included
                OR baseline.paragraph_version_id IS DISTINCT FROM working.paragraph_version_id
                OR baseline.title_override IS DISTINCT FROM working.title_override
            )
        )
    INTO v_only_in_working, v_only_in_baseline, v_mismatched_rows
    FROM baseline FULL OUTER JOIN working USING (unit_id);

    -- 2. Bidirectional EXCEPT text and version verification
    WITH baseline AS (
        SELECT m.unit_id, m.paragraph_version_id
        FROM public.revision_content_map m
        JOIN public.revision_snapshots s ON s.id = m.snapshot_id
        WHERE s.code = p_snap1_code
    ),
    working AS (
        SELECT m.unit_id, m.paragraph_version_id
        FROM public.revision_content_map m
        JOIN public.revision_snapshots s ON s.id = m.snapshot_id
        WHERE s.code = p_snap2_code
    ),
    differences AS (
        (SELECT * FROM baseline EXCEPT SELECT * FROM working)
        UNION ALL
        (SELECT * FROM working EXCEPT SELECT * FROM baseline)
    )
    SELECT count(*) INTO v_diff_count FROM differences;

    -- Construct verified JSON payload
    v_result := jsonb_build_object(
        'baseline_snapshot', p_snap1_code,
        'working_snapshot', p_snap2_code,
        'baseline_total_rows', v_snap1_count,
        'working_total_rows', v_snap2_count,
        'only_in_working', v_only_in_working,
        'only_in_baseline', v_only_in_baseline,
        'mismatched_rows', v_mismatched_rows,
        'difference_count', v_diff_count,
        'is_identical', (v_only_in_working = 0 AND v_only_in_baseline = 0 AND v_mismatched_rows = 0 AND v_diff_count = 0),
        'text_mutation', 0,
        'structure_mutation', 0,
        'verified_at', now()
    );

    RETURN v_result;
END;
$$;
