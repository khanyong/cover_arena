-- ====================================================================
-- Migration: 20260903_009_canon_normalization_type.sql
-- Description: Add 'canon_normalization' to paragraph_versions change_type constraint
-- ====================================================================

ALTER TABLE public.paragraph_versions
DROP CONSTRAINT IF EXISTS paragraph_versions_change_type_check;

ALTER TABLE public.paragraph_versions
ADD CONSTRAINT paragraph_versions_change_type_check
CHECK (change_type IN ('import', 'rewrite', 'split', 'merge', 'calibration', 'polish', 'canon_normalization'));
