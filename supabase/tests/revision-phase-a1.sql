-- ====================================================================
-- Test Suite: supabase/tests/revision-phase-a1.sql
-- Description: Independent SQL regression test suite for Phase A1 Hardening
-- ====================================================================

DO $$
DECLARE
    v_project_id UUID;
    v_locked_snapshot_id UUID;
    v_pilot_snapshot_id UUID;
    v_target_paragraph_id UUID;
    v_current_version_id UUID;
    v_test_failed BOOLEAN := false;
BEGIN
    RAISE NOTICE 'Starting Revision Phase A1 SQL Tests...';

    -- Test 1: Verify revision_projects exists
    SELECT id INTO v_project_id
    FROM public.revision_projects
    WHERE slug = 'the-resonance-of-space-book-1';

    IF v_project_id IS NULL THEN
        RAISE EXCEPTION 'TEST 1 FAILED: revision_projects the-resonance-of-space-book-1 not found.';
    END IF;
    RAISE NOTICE '[PASS] Test 1: Revision project found (id: %)', v_project_id;

    -- Test 2: Verify B1_v1.0_LOCKED snapshot exists and is locked
    SELECT id INTO v_locked_snapshot_id
    FROM public.revision_snapshots
    WHERE project_id = v_project_id AND code = 'B1_v1.0_LOCKED' AND state = 'locked';

    IF v_locked_snapshot_id IS NULL THEN
        RAISE EXCEPTION 'TEST 2 FAILED: B1_v1.0_LOCKED snapshot not found or not in locked state.';
    END IF;
    RAISE NOTICE '[PASS] Test 2: B1_v1.0_LOCKED snapshot is locked (id: %)', v_locked_snapshot_id;

    -- Test 3: Verify trigger blocks direct UPDATE on locked snapshot content map
    BEGIN
        UPDATE public.revision_content_map
        SET title_override = 'Illegal Update Test'
        WHERE snapshot_id = v_locked_snapshot_id;

        -- If it reaches here, the trigger failed!
        RAISE EXCEPTION 'TEST 3 FAILED: Trigger failed to prevent modification on locked snapshot!';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%Cannot modify content map for a locked revision snapshot%' THEN
                RAISE NOTICE '[PASS] Test 3: Lock trigger successfully rejected mutation on B1_v1.0_LOCKED: %', SQLERRM;
            ELSE
                RAISE EXCEPTION 'TEST 3 FAILED: Unexpected error: %', SQLERRM;
            END IF;
    END;

    -- Test 4: Verify trigger blocks UPDATE on paragraph_versions
    SELECT id INTO v_current_version_id
    FROM public.paragraph_versions
    LIMIT 1;

    BEGIN
        UPDATE public.paragraph_versions
        SET body_markdown = 'Illegal Direct Body Update'
        WHERE id = v_current_version_id;

        RAISE EXCEPTION 'TEST 4 FAILED: Trigger failed to prevent UPDATE on paragraph_versions!';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%paragraph_versions records are immutable%' THEN
                RAISE NOTICE '[PASS] Test 4: Immutability trigger successfully rejected UPDATE on paragraph_versions: %', SQLERRM;
            ELSE
                RAISE EXCEPTION 'TEST 4 FAILED: Unexpected error: %', SQLERRM;
            END IF;
    END;

    -- Test 5: Verify trigger blocks DELETE on paragraph_versions
    BEGIN
        DELETE FROM public.paragraph_versions
        WHERE id = v_current_version_id;

        RAISE EXCEPTION 'TEST 5 FAILED: Trigger failed to prevent DELETE on paragraph_versions!';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%paragraph_versions records are immutable%' THEN
                RAISE NOTICE '[PASS] Test 5: Immutability trigger successfully rejected DELETE on paragraph_versions: %', SQLERRM;
            ELSE
                RAISE EXCEPTION 'TEST 5 FAILED: Unexpected error: %', SQLERRM;
            END IF;
    END;

    RAISE NOTICE '=== ALL SQL REGRESSION TESTS PASSED SUCCESSFULLY! ===';
END $$;
