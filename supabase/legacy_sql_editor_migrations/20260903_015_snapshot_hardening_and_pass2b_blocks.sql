-- ====================================================================
-- Migration: 20260903_015_snapshot_hardening_and_pass2b_blocks.sql
-- Description: Hardening triggers for locked snapshots & Pass 2B Paragraph Block Schema
-- ====================================================================

-- 1. Prevent deleting finalized snapshots (locked, archived, superseded)
CREATE OR REPLACE FUNCTION public.fn_prevent_finalized_snapshot_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.state IN ('locked', 'archived', 'superseded') THEN
        RAISE EXCEPTION 'Snapshot % is finalized (state: %) and cannot be deleted.', OLD.code, OLD.state;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_finalized_snapshot_delete ON public.revision_snapshots;
CREATE TRIGGER trg_prevent_finalized_snapshot_delete
BEFORE DELETE ON public.revision_snapshots
FOR EACH ROW
EXECUTE FUNCTION public.fn_prevent_finalized_snapshot_delete();

-- 2. Prevent modifying core metadata of locked snapshots
CREATE OR REPLACE FUNCTION public.fn_prevent_finalized_snapshot_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.state = 'locked' THEN
        -- Unlock attempt
        IF NEW.state != 'locked' THEN
            RAISE EXCEPTION 'Snapshot % is permanently locked and cannot be changed back to %.', OLD.code, NEW.state;
        END IF;

        -- Core integrity fields attempt
        IF NEW.code IS DISTINCT FROM OLD.code OR
           NEW.base_snapshot_id IS DISTINCT FROM OLD.base_snapshot_id OR
           NEW.project_id IS DISTINCT FROM OLD.project_id OR
           (OLD.manifest_hash IS NOT NULL AND NEW.manifest_hash IS DISTINCT FROM OLD.manifest_hash) THEN
            RAISE EXCEPTION 'Cannot modify immutable integrity fields (code, base_snapshot_id, manifest_hash) on locked snapshot %.', OLD.code;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_finalized_snapshot_update ON public.revision_snapshots;
CREATE TRIGGER trg_prevent_finalized_snapshot_update
BEFORE UPDATE ON public.revision_snapshots
FOR EACH ROW
EXECUTE FUNCTION public.fn_prevent_finalized_snapshot_update();

-- 3. Schema for Pass 2B Paragraph Blocks and Revision Packets
CREATE TABLE IF NOT EXISTS public.scene_revision_packets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_run_id UUID NOT NULL REFERENCES public.audit_runs(id) ON DELETE CASCADE,
    scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    packet_status TEXT NOT NULL CHECK (packet_status IN ('DRAFT', 'REVIEWED', 'APPROVED', 'EXECUTED', 'VERIFIED')) DEFAULT 'DRAFT',
    baseline_word_count INT NOT NULL,
    target_word_count INT NOT NULL,
    target_tolerance_percent NUMERIC(4,2) NOT NULL DEFAULT 5.00,
    strategy_summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(audit_run_id, scene_unit_id)
);

CREATE TABLE IF NOT EXISTS public.paragraph_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    packet_id UUID NOT NULL REFERENCES public.scene_revision_packets(id) ON DELETE CASCADE,
    scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE CASCADE,
    block_order INT NOT NULL,
    block_label TEXT NOT NULL,
    first_paragraph_unit_id UUID NOT NULL REFERENCES public.content_units(id),
    last_paragraph_unit_id UUID NOT NULL REFERENCES public.content_units(id),
    baseline_word_count INT NOT NULL,
    target_word_count INT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('KEEP', 'CUT', 'COMPRESS', 'RELOCATE', 'BRIDGE', 'SPLIT', 'MERGE')) DEFAULT 'KEEP',
    approval_status TEXT NOT NULL CHECK (approval_status IN ('PROPOSED', 'REVIEWED', 'APPROVED', 'EXECUTED', 'VERIFIED')) DEFAULT 'PROPOSED',
    function_summary TEXT NOT NULL,
    rationale TEXT,
    protected_asset_ids TEXT[] DEFAULT '{}'::text[],
    continuity_dependencies TEXT[] DEFAULT '{}'::text[],
    destination_scene_id UUID REFERENCES public.content_units(id),
    bridge_requirement TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(packet_id, block_order)
);

CREATE INDEX IF NOT EXISTS idx_pblocks_scene ON public.paragraph_blocks(scene_unit_id, block_order);
CREATE INDEX IF NOT EXISTS idx_rev_packets_audit ON public.scene_revision_packets(audit_run_id);
