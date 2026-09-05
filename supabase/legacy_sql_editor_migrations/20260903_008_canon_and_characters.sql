-- ====================================================================
-- Migration: 20260903_008_canon_and_characters.sql
-- Description: Character Entities, Aliases, Canon Decisions & Debt Resolution
-- ====================================================================

-- 1. Character Entities Table
CREATE TABLE IF NOT EXISTS public.character_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_code TEXT UNIQUE NOT NULL,
    canonical_name_ko TEXT NOT NULL,
    canonical_name_en TEXT NOT NULL,
    canonical_name_formal TEXT NOT NULL,
    relationship_role TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Character Aliases Table (For historical tracking & migration)
CREATE TABLE IF NOT EXISTS public.character_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.character_entities(id) ON DELETE CASCADE,
    alias_text TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    alias_type TEXT NOT NULL CHECK (alias_type IN ('canonical', 'formal', 'direct', 'deprecated_historical', 'allowed')),
    is_canonical BOOLEAN NOT NULL DEFAULT false,
    is_deprecated BOOLEAN NOT NULL DEFAULT false,
    valid_from_snapshot TEXT,
    valid_until_snapshot TEXT,
    replacement_alias TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_character_aliases_text ON public.character_aliases(alias_text);

-- 3. Canon Decisions Table
CREATE TABLE IF NOT EXISTS public.canon_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    decision_type TEXT NOT NULL CHECK (decision_type IN ('AUTHORIAL_CANON', 'SCIENTIFIC_CANON', 'STRUCTURAL_CANON')),
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'LOCKED', 'SUPERSEDED')) DEFAULT 'LOCKED',
    effective_scope TEXT NOT NULL,
    effective_from TEXT NOT NULL,
    summary TEXT NOT NULL,
    details JSONB NOT NULL,
    supersedes_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Extend series_debts with resolution tracking
ALTER TABLE public.series_debts
ADD COLUMN IF NOT EXISTS resolution_status TEXT NOT NULL DEFAULT 'OPEN'
CHECK (resolution_status IN ('OPEN', 'RESOLVED', 'SUPERSEDED', 'WAIVED')),
ADD COLUMN IF NOT EXISTS resolved_by_canon_code TEXT,
ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

-- 5. RLS for new tables
ALTER TABLE public.character_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canon_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "character_entities_select" ON public.character_entities FOR SELECT USING (true);
CREATE POLICY "character_entities_all" ON public.character_entities FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "character_aliases_select" ON public.character_aliases FOR SELECT USING (true);
CREATE POLICY "character_aliases_all" ON public.character_aliases FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "canon_decisions_select" ON public.canon_decisions FOR SELECT USING (true);
CREATE POLICY "canon_decisions_all" ON public.canon_decisions FOR ALL USING (true) WITH CHECK (true);
