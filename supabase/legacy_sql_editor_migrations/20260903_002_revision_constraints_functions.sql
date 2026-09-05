-- ====================================================================
-- Migration: 20260903_002_revision_constraints_functions.sql
-- Description: DB-level immutability triggers and atomic RPC functions
-- ====================================================================

-- 1. Trigger Function: Prevent mutation of paragraph_versions
CREATE OR REPLACE FUNCTION public.fn_prevent_paragraph_version_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'paragraph_versions records are immutable and cannot be updated or deleted. (id: %)', OLD.id;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_paragraph_version_mutation ON public.paragraph_versions;
CREATE TRIGGER trg_prevent_paragraph_version_mutation
BEFORE UPDATE OR DELETE ON public.paragraph_versions
FOR EACH ROW
EXECUTE FUNCTION public.fn_prevent_paragraph_version_mutation();

-- 2. Trigger Function: Prevent mutation of revision_content_map when Snapshot is LOCKED
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

    IF target_state = 'locked' THEN
        RAISE EXCEPTION 'Cannot modify content map for a locked revision snapshot (snapshot_id: %)', target_snapshot_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_locked_content_map_mutation ON public.revision_content_map;
CREATE TRIGGER trg_prevent_locked_content_map_mutation
BEFORE INSERT OR UPDATE OR DELETE ON public.revision_content_map
FOR EACH ROW
EXECUTE FUNCTION public.fn_prevent_locked_content_map_mutation();

-- 3. Trigger Function: Prevent unlocking a locked Snapshot
CREATE OR REPLACE FUNCTION public.fn_prevent_snapshot_unlock()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.state = 'locked' AND NEW.state != 'locked' THEN
        RAISE EXCEPTION 'Snapshot % is permanently locked and cannot be changed back to %.', OLD.code, NEW.state;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_snapshot_unlock ON public.revision_snapshots;
CREATE TRIGGER trg_prevent_snapshot_unlock
BEFORE UPDATE ON public.revision_snapshots
FOR EACH ROW
EXECUTE FUNCTION public.fn_prevent_snapshot_unlock();

-- 4. RPC Function: create_paragraph_checkpoint
-- Creates a new paragraph_version and atomically updates revision_content_map in the Draft snapshot
CREATE OR REPLACE FUNCTION public.create_paragraph_checkpoint(
    p_snapshot_id UUID,
    p_paragraph_unit_id UUID,
    p_expected_current_version_id UUID,
    p_new_body_markdown TEXT,
    p_change_type TEXT DEFAULT 'rewrite',
    p_change_note TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_snapshot_state TEXT;
    v_current_version_id UUID;
    v_new_version_id UUID;
    v_next_version_no INT;
    v_word_count INT;
    v_body_hash TEXT;
BEGIN
    -- A. Verify snapshot is in 'draft' state
    SELECT state INTO v_snapshot_state
    FROM public.revision_snapshots
    WHERE id = p_snapshot_id;

    IF v_snapshot_state IS NULL THEN
        RAISE EXCEPTION 'Snapshot % not found.', p_snapshot_id;
    END IF;

    IF v_snapshot_state != 'draft' THEN
        RAISE EXCEPTION 'Cannot create checkpoint in non-draft snapshot (state: %).', v_snapshot_state;
    END IF;

    -- B. Verify current version in content map matches expected version (optimistic concurrency)
    SELECT paragraph_version_id INTO v_current_version_id
    FROM public.revision_content_map
    WHERE snapshot_id = p_snapshot_id AND unit_id = p_paragraph_unit_id;

    IF v_current_version_id IS DISTINCT FROM p_expected_current_version_id THEN
        RAISE EXCEPTION 'Version conflict: expected version %, but current version in snapshot is %.',
            p_expected_current_version_id, v_current_version_id;
    END IF;

    -- C. Calculate word count and body hash
    v_word_count := cardinality(regexp_split_to_array(trim(p_new_body_markdown), '\s+'));
    IF trim(p_new_body_markdown) = '' THEN
        v_word_count := 0;
    END IF;
    v_body_hash := md5(p_new_body_markdown);

    -- D. Determine next version number for this paragraph unit
    SELECT COALESCE(MAX(version_no), 0) + 1 INTO v_next_version_no
    FROM public.paragraph_versions
    WHERE paragraph_unit_id = p_paragraph_unit_id;

    -- E. Insert new paragraph version
    INSERT INTO public.paragraph_versions (
        id,
        paragraph_unit_id,
        version_no,
        body_markdown,
        body_hash,
        base_version_id,
        change_type,
        change_note,
        word_count,
        created_by,
        created_at
    ) VALUES (
        gen_random_uuid(),
        p_paragraph_unit_id,
        v_next_version_no,
        p_new_body_markdown,
        v_body_hash,
        v_current_version_id,
        p_change_type,
        p_change_note,
        v_word_count,
        auth.uid(),
        now()
    )
    RETURNING id INTO v_new_version_id;

    -- F. Update revision_content_map to point to the new version
    UPDATE public.revision_content_map
    SET paragraph_version_id = v_new_version_id
    WHERE snapshot_id = p_snapshot_id AND unit_id = p_paragraph_unit_id;

    -- G. Record lineage if previous version existed
    IF v_current_version_id IS NOT NULL THEN
        INSERT INTO public.paragraph_version_lineage (
            child_version_id,
            parent_version_id,
            relation_type,
            sequence_no,
            note
        ) VALUES (
            v_new_version_id,
            v_current_version_id,
            'rewritten_from',
            1,
            p_change_note
        );
    END IF;

    -- Return newly created version info
    RETURN jsonb_build_object(
        'success', true,
        'snapshot_id', p_snapshot_id,
        'paragraph_unit_id', p_paragraph_unit_id,
        'new_version_id', v_new_version_id,
        'version_no', v_next_version_no,
        'body_hash', v_body_hash,
        'word_count', v_word_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC Function: clone_revision_snapshot
-- Clones an existing snapshot (e.g. B1_v1.0_LOCKED) into a new working Draft snapshot
CREATE OR REPLACE FUNCTION public.clone_revision_snapshot(
    p_source_snapshot_id UUID,
    p_new_code TEXT,
    p_new_name TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_source public.revision_snapshots%ROWTYPE;
    v_new_snapshot_id UUID;
BEGIN
    SELECT * INTO v_source
    FROM public.revision_snapshots
    WHERE id = p_source_snapshot_id;

    IF v_source.id IS NULL THEN
        RAISE EXCEPTION 'Source snapshot % not found.', p_source_snapshot_id;
    END IF;

    -- A. Create new snapshot in draft state
    INSERT INTO public.revision_snapshots (
        id,
        project_id,
        code,
        name,
        description,
        state,
        base_snapshot_id,
        word_count,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        v_source.project_id,
        p_new_code,
        p_new_name,
        p_description,
        'draft',
        p_source_snapshot_id,
        v_source.word_count,
        now(),
        now()
    )
    RETURNING id INTO v_new_snapshot_id;

    -- B. Copy revision_content_map rows
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
        v_new_snapshot_id,
        unit_id,
        parent_unit_id,
        position,
        paragraph_version_id,
        is_included,
        title_override,
        metadata_override
    FROM public.revision_content_map
    WHERE snapshot_id = p_source_snapshot_id;

    -- C. Copy scene_matrices records
    INSERT INTO public.scene_matrices (
        snapshot_id,
        scene_unit_id,
        pov_character,
        local_question,
        new_evidence,
        model_movement,
        capability,
        "constraint",
        character_decision,
        power_shift,
        final_consequence,
        next_problem,
        action,
        compression_target_words,
        compression_target_percent,
        protected_status,
        status,
        notes
    )
    SELECT
        v_new_snapshot_id,
        scene_unit_id,
        pov_character,
        local_question,
        new_evidence,
        model_movement,
        capability,
        "constraint",
        character_decision,
        power_shift,
        final_consequence,
        next_problem,
        action,
        compression_target_words,
        compression_target_percent,
        protected_status,
        status,
        notes
    FROM public.scene_matrices
    WHERE snapshot_id = p_source_snapshot_id;

    RETURN v_new_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC Function: lock_revision_snapshot
-- Calculates total word count, manifest hash, and locks the snapshot permanently
CREATE OR REPLACE FUNCTION public.lock_revision_snapshot(
    p_snapshot_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_total_words INT;
    v_manifest_hash TEXT;
    v_snapshot_code TEXT;
BEGIN
    SELECT code INTO v_snapshot_code
    FROM public.revision_snapshots
    WHERE id = p_snapshot_id;

    IF v_snapshot_code IS NULL THEN
        RAISE EXCEPTION 'Snapshot % not found.', p_snapshot_id;
    END IF;

    -- Calculate total word count from active paragraph versions
    SELECT COALESCE(SUM(pv.word_count), 0) INTO v_total_words
    FROM public.revision_content_map rcm
    JOIN public.paragraph_versions pv ON rcm.paragraph_version_id = pv.id
    WHERE rcm.snapshot_id = p_snapshot_id AND rcm.is_included = true;

    -- Calculate manifest hash from sorted unit_id:version_id:body_hash
    SELECT md5(string_agg(rcm.unit_id::text || ':' || COALESCE(pv.body_hash, 'none') || ':' || rcm.position::text, '|' ORDER BY rcm.parent_unit_id NULLS FIRST, rcm.position ASC))
    INTO v_manifest_hash
    FROM public.revision_content_map rcm
    LEFT JOIN public.paragraph_versions pv ON rcm.paragraph_version_id = pv.id
    WHERE rcm.snapshot_id = p_snapshot_id;

    -- Lock snapshot
    UPDATE public.revision_snapshots
    SET
        state = 'locked',
        word_count = v_total_words,
        manifest_hash = v_manifest_hash,
        locked_at = now(),
        locked_by = auth.uid(),
        updated_at = now()
    WHERE id = p_snapshot_id;

    RETURN jsonb_build_object(
        'success', true,
        'snapshot_id', p_snapshot_id,
        'code', v_snapshot_code,
        'state', 'locked',
        'word_count', v_total_words,
        'manifest_hash', v_manifest_hash
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
