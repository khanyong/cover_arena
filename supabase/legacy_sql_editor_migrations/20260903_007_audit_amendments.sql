-- ====================================================================
-- Migration: 20260903_007_audit_amendments.sql
-- Description: Audit Amendments, Target Tolerance & Additive Audit Tracking
-- ====================================================================

-- 1. Add amendment tracking to audit_runs
ALTER TABLE public.audit_runs
ADD COLUMN IF NOT EXISTS parent_audit_id UUID REFERENCES public.audit_runs(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS run_type TEXT NOT NULL DEFAULT 'formal'
CHECK (run_type IN ('formal', 'amendment', 'pilot')),
ADD COLUMN IF NOT EXISTS amendment_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_audit_runs_parent ON public.audit_runs(parent_audit_id);

-- 2. Add editorial guidance & tolerance to structure_change_proposals
ALTER TABLE public.structure_change_proposals
ADD COLUMN IF NOT EXISTS target_tolerance_percent NUMERIC(4,2) NOT NULL DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS target_type TEXT NOT NULL DEFAULT 'editorial_guidance',
ADD COLUMN IF NOT EXISTS is_hard_limit BOOLEAN NOT NULL DEFAULT false;
