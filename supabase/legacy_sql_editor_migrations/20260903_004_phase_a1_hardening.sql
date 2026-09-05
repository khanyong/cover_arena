-- ====================================================================
-- Migration: 20260903_004_phase_a1_hardening.sql
-- Description: Phase A1 Hardening: Snapshot metadata, Pilot A1 archiving, Browser DML lockdown
-- ====================================================================

-- 1. Add snapshot_kind and is_canonical to revision_snapshots
ALTER TABLE public.revision_snapshots
ADD COLUMN IF NOT EXISTS snapshot_kind TEXT NOT NULL DEFAULT 'formal'
CHECK (snapshot_kind IN ('formal', 'pilot', 'audit'));

ALTER TABLE public.revision_snapshots
ADD COLUMN IF NOT EXISTS is_canonical BOOLEAN NOT NULL DEFAULT true;

-- 2. Archive B1_v1.1_PILOT_DRAFT as B1_PILOT_A1_ARCHIVED (non-canonical pilot snapshot)
UPDATE public.revision_snapshots
SET
    code = 'B1_PILOT_A1_ARCHIVED',
    name = 'Book 1 Pilot A1 Archived Snapshot',
    description = 'Isolated test edits from Pilot A1 verification. Archived.',
    snapshot_kind = 'pilot',
    is_canonical = false,
    state = 'archived',
    updated_at = now()
WHERE code = 'B1_v1.1_PILOT_DRAFT';

-- 3. Browser DML Lockdown: Tighten RLS policies
-- Enforce that paragraph_versions and revision_content_map can ONLY be modified via SECURITY DEFINER RPCs (create_paragraph_checkpoint, clone_revision_snapshot)

-- Drop existing broad owner policies for paragraph_versions & revision_content_map
DROP POLICY IF EXISTS "paragraph_versions_owner_all" ON public.paragraph_versions;
DROP POLICY IF EXISTS "revision_content_map_owner_all" ON public.revision_content_map;

-- Allow SELECT for project owners
CREATE POLICY "paragraph_versions_owner_select"
ON public.paragraph_versions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.content_units cu
    WHERE cu.id = paragraph_versions.paragraph_unit_id
    AND public.fn_is_project_owner(cu.project_id)
));

CREATE POLICY "revision_content_map_owner_select"
ON public.revision_content_map FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.revision_snapshots rs
    WHERE rs.id = revision_content_map.snapshot_id
    AND public.fn_is_project_owner(rs.project_id)
));

-- Deny direct INSERT/UPDATE/DELETE from client API (only SECURITY DEFINER RPC functions have write access)
-- Note: In Supabase Postgres, omitting INSERT/UPDATE/DELETE policies when RLS is enabled implicitly denies direct client mutations!
-- For explicit safety, we define restrictive check policies or rely on absence of write policies for authenticated roles.
