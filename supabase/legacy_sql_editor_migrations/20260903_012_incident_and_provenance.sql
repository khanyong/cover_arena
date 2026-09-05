-- ====================================================================
-- Migration: 20260903_012_incident_and_provenance.sql
-- Description: Platform Incidents, Provenance Records & Repetition Debts
-- ====================================================================

-- 1. Platform Incidents Table
CREATE TABLE IF NOT EXISTS public.platform_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    category TEXT NOT NULL,
    source_snapshot_id UUID REFERENCES public.revision_snapshots(id),
    target_snapshot_id UUID REFERENCES public.revision_snapshots(id),
    details JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'INVESTIGATING', 'REPAIRED', 'RESOLVED', 'CLOSED')) DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 2. Provenance Records Table
CREATE TABLE IF NOT EXISTS public.provenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    record_type TEXT NOT NULL,
    statement TEXT NOT NULL,
    evidence_reference TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Repetition Debts Table
CREATE TABLE IF NOT EXISTS public.repetition_debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    source_scope TEXT NOT NULL,
    target_scope TEXT NOT NULL,
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'RESOLVED', 'SUPERSEDED', 'WAIVED')) DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE public.platform_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repetition_debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_incidents_all" ON public.platform_incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "provenance_records_all" ON public.provenance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "repetition_debts_all" ON public.repetition_debts FOR ALL USING (true) WITH CHECK (true);
