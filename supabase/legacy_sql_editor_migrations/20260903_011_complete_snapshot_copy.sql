-- ====================================================================
-- Migration: 20260903_011_complete_snapshot_copy.sql
-- Description: Complete snapshot copy directly inside PostgreSQL
-- ====================================================================

CREATE OR REPLACE FUNCTION public.fn_complete_snapshot_copy(
    p_source_code TEXT DEFAULT 'B1_v1.0_LOCKED',
    p_target_code TEXT DEFAULT 'B1_v1.1_STRUCT_DRAFT'
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_source_id UUID;
    v_target_id UUID;
    v_inserted_count BIGINT;
BEGIN
    SELECT id INTO v_source_id FROM public.revision_snapshots WHERE code = p_source_code;
    SELECT id INTO v_target_id FROM public.revision_snapshots WHERE code = p_target_code;

    IF v_source_id IS NULL THEN
        RAISE EXCEPTION 'Source snapshot % not found', p_source_code;
    END IF;

    IF v_target_id IS NULL THEN
        RAISE EXCEPTION 'Target snapshot % not found', p_target_code;
    END IF;

    -- Insert missing rows directly
    INSERT INTO public.revision_content_map (
        snapshot_id,
        unit_id,
        parent_unit_id,
        position,
        paragraph_version_id,
        is_included,
        title_override,
        metadata_override
    )
    SELECT
        v_target_id,
        m.unit_id,
        m.parent_unit_id,
        m.position,
        m.paragraph_version_id,
        m.is_included,
        m.title_override,
        m.metadata_override
    FROM public.revision_content_map m
    WHERE m.snapshot_id = v_source_id
    ON CONFLICT (snapshot_id, unit_id) DO NOTHING;

    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;

    -- Update target snapshot word count and updated_at
    UPDATE public.revision_snapshots
    SET word_count = (SELECT word_count FROM public.revision_snapshots WHERE id = v_source_id),
        updated_at = now()
    WHERE id = v_target_id;

    RETURN v_inserted_count;
END;
$$;
