-- ====================================================================
-- Migration: 20260903_003_revision_rls.sql
-- Description: Row Level Security (RLS) policies for revision tables
-- ====================================================================

-- 1. Enable RLS on all 8 tables
ALTER TABLE public.revision_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraph_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraph_version_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_content_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_matrices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_runs ENABLE ROW LEVEL SECURITY;

-- 2. Helper function to check if current user owns the project
CREATE OR REPLACE FUNCTION public.fn_is_project_owner(p_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.revision_projects
        WHERE id = p_project_id
        AND (owner_id = auth.uid() OR owner_id IS NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Policies for revision_projects
CREATE POLICY "revision_projects_owner_all"
ON public.revision_projects FOR ALL
USING (owner_id = auth.uid() OR owner_id IS NULL)
WITH CHECK (owner_id = auth.uid() OR owner_id IS NULL);

-- 4. Policies for content_units
CREATE POLICY "content_units_owner_all"
ON public.content_units FOR ALL
USING (public.fn_is_project_owner(project_id))
WITH CHECK (public.fn_is_project_owner(project_id));

-- 5. Policies for revision_snapshots
CREATE POLICY "revision_snapshots_owner_all"
ON public.revision_snapshots FOR ALL
USING (public.fn_is_project_owner(project_id))
WITH CHECK (public.fn_is_project_owner(project_id));

-- 6. Policies for paragraph_versions
CREATE POLICY "paragraph_versions_owner_all"
ON public.paragraph_versions FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.content_units cu
    WHERE cu.id = paragraph_versions.paragraph_unit_id
    AND public.fn_is_project_owner(cu.project_id)
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.content_units cu
    WHERE cu.id = paragraph_versions.paragraph_unit_id
    AND public.fn_is_project_owner(cu.project_id)
));

-- 7. Policies for paragraph_version_lineage
CREATE POLICY "paragraph_version_lineage_owner_all"
ON public.paragraph_version_lineage FOR ALL
USING (true)
WITH CHECK (true);

-- 8. Policies for revision_content_map
CREATE POLICY "revision_content_map_owner_all"
ON public.revision_content_map FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.revision_snapshots rs
    WHERE rs.id = revision_content_map.snapshot_id
    AND public.fn_is_project_owner(rs.project_id)
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.revision_snapshots rs
    WHERE rs.id = revision_content_map.snapshot_id
    AND public.fn_is_project_owner(rs.project_id)
));

-- 9. Policies for scene_matrices
CREATE POLICY "scene_matrices_owner_all"
ON public.scene_matrices FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.revision_snapshots rs
    WHERE rs.id = scene_matrices.snapshot_id
    AND public.fn_is_project_owner(rs.project_id)
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.revision_snapshots rs
    WHERE rs.id = scene_matrices.snapshot_id
    AND public.fn_is_project_owner(rs.project_id)
));

-- 10. Policies for import_runs
CREATE POLICY "import_runs_owner_all"
ON public.import_runs FOR ALL
USING (public.fn_is_project_owner(project_id))
WITH CHECK (public.fn_is_project_owner(project_id));
