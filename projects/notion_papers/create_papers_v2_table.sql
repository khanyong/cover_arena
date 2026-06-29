-- =========================================================================
-- SQL Schema definition for Mosaic Version Control System (papers_v2)
-- PostgreSQL / Supabase Compatible
-- =========================================================================

-- 1. Papers Table
CREATE TABLE IF NOT EXISTS public.papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_ko TEXT NOT NULL,
    title_en TEXT NOT NULL,
    authors_ko TEXT,
    authors_en TEXT,
    affiliations_ko TEXT,
    affiliations_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on papers" ON public.papers FOR SELECT USING (true);

-- 2. Chapters Table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE NOT NULL,
    number INT NOT NULL,
    title_ko TEXT NOT NULL,
    title_en TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (paper_id, number)
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on chapters" ON public.chapters FOR SELECT USING (true);

-- 3. Sections (Paragraphs) Table
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
    paragraph_id VARCHAR(50) NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (chapter_id, paragraph_id)
);

CREATE INDEX IF NOT EXISTS idx_sections_chapter_order ON public.sections(chapter_id, order_index);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on sections" ON public.sections FOR SELECT USING (true);

-- 4. Section Versions Table
CREATE TABLE IF NOT EXISTS public.section_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE NOT NULL,
    version_key VARCHAR(10) NOT NULL,
    text_ko TEXT,
    text_en TEXT,
    is_strikethrough BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (section_id, version_key)
);

CREATE INDEX IF NOT EXISTS idx_section_versions_lookup ON public.section_versions(section_id, version_key);

ALTER TABLE public.section_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on section_versions" ON public.section_versions FOR SELECT USING (true);
