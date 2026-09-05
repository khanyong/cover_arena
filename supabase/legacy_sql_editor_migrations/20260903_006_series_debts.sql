-- ====================================================================
-- Migration: 20260903_006_series_debts.sql
-- Description: Series Debt Register & Act 0 Epistemic Boundary Schema
-- ====================================================================

-- 1. Series Debt Register Table
CREATE TABLE IF NOT EXISTS public.series_debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    project_id UUID NOT NULL REFERENCES public.revision_projects(id) ON DELETE CASCADE,
    source_scene_unit_id UUID REFERENCES public.content_units(id) ON DELETE SET NULL,
    debt_type TEXT NOT NULL CHECK (debt_type IN ('CONTINUITY', 'SERIES_BRIDGE', 'CHARACTER_LENS', 'EPISTEMIC')),
    title TEXT NOT NULL,
    source_scope TEXT NOT NULL,
    target_scope TEXT NOT NULL,
    established_in_source TEXT NOT NULL,
    forbidden_in_target TEXT NOT NULL,
    required_in_target TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'ADDRESSED', 'WAIVED')) DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_series_debts_project ON public.series_debts(project_id, debt_type);

-- 2. Extend scene_matrices with Epistemic Boundary & Relationship Movement
ALTER TABLE public.scene_matrices
ADD COLUMN IF NOT EXISTS epistemic_boundary JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS relationship_movement JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS series_debt_codes TEXT[] DEFAULT '{}'::text[];

-- 3. RLS for series_debts
ALTER TABLE public.series_debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "series_debts_owner_all"
ON public.series_debts FOR ALL
USING (public.fn_is_project_owner(project_id))
WITH CHECK (public.fn_is_project_owner(project_id));
