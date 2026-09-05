-- 20260904_001_pass2b_lineage_and_projections.sql
-- Adopts Model B (Strict Execution Gateway)

SET search_path = '';

-- 1. Create the STRICT GATEWAY Role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'revision_executor') THEN
    CREATE ROLE revision_executor NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
  END IF;
END $$;

-- 2. Create Private Schema
CREATE SCHEMA IF NOT EXISTS revision_private;
ALTER SCHEMA revision_private OWNER TO revision_executor;

-- Revoke default privileges in both schemas
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA revision_private REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA revision_private REVOKE ALL ON FUNCTIONS FROM PUBLIC;

-- 3. Modify existing Lineage Table (Assumes structure was validated)
-- First backfill the columns as nullable, then we could apply NOT NULL later.
ALTER TABLE public.paragraph_version_lineage
ADD COLUMN IF NOT EXISTS execution_run_code TEXT,
ADD COLUMN IF NOT EXISTS approval_code TEXT,
ADD COLUMN IF NOT EXISTS source_order INT;

-- 4. Create Tables in Private Schema

CREATE TABLE IF NOT EXISTS revision_private.legacy_document_backups (
    backup_code TEXT PRIMARY KEY,
    document_slug TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_repository_path TEXT NOT NULL,
    source_git_commit TEXT NOT NULL,
    source_file_sha256 TEXT NOT NULL,
    canonical_json_sha256 TEXT NOT NULL,
    document_json JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('REGISTERING', 'VERIFIED', 'LOCKED')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS revision_private.supervised_import_approvals (
    approval_code TEXT PRIMARY KEY,
    scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE RESTRICT,
    editorial_draft_code TEXT NOT NULL,
    revision_run_code TEXT NOT NULL,
    canonical_package_sha256 TEXT NOT NULL CHECK (canonical_package_sha256 ~ '^[0-9a-f]{64}$'),
    source_file_sha256 TEXT NOT NULL,
    approved_package_json JSONB NOT NULL,
    approval_status TEXT NOT NULL CHECK (approval_status IN ('DRAFT', 'APPROVED_FOR_IMPORT', 'REVOKED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS revision_private.supervised_import_source_bindings (
    approval_code TEXT NOT NULL REFERENCES revision_private.supervised_import_approvals(approval_code) ON DELETE RESTRICT,
    source_ordinal INT NOT NULL,
    paragraph_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE RESTRICT,
    parent_scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE RESTRICT,
    source_position INT NOT NULL,
    baseline_version_id UUID NOT NULL REFERENCES public.paragraph_versions(id) ON DELETE RESTRICT,
    expected_working_version_id_after_recovery UUID NOT NULL REFERENCES public.paragraph_versions(id) ON DELETE RESTRICT,
    source_body_sha256 TEXT NOT NULL,
    source_is_included BOOLEAN NOT NULL,
    CONSTRAINT pk_source_bindings PRIMARY KEY (approval_code, source_ordinal),
    CONSTRAINT uq_bindings_unit UNIQUE (approval_code, paragraph_unit_id)
);

CREATE TABLE IF NOT EXISTS revision_private.supervised_import_runs (
    import_code TEXT PRIMARY KEY,
    approval_code TEXT NOT NULL REFERENCES revision_private.supervised_import_approvals(approval_code) ON DELETE RESTRICT,
    status TEXT NOT NULL CHECK (status IN ('STARTED', 'VERIFYING', 'PROJECTION_FAILED', 'LOCKED', 'FAILED')),
    working_snapshot_id UUID NOT NULL REFERENCES public.revision_snapshots(id) ON DELETE RESTRICT,
    pre_mapping_sha256 TEXT NOT NULL,
    post_mapping_sha256 TEXT,
    expected_block_sha256 TEXT NOT NULL,
    actual_block_sha256 TEXT,
    expected_counts JSONB NOT NULL,
    actual_counts JSONB,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_at TIMESTAMPTZ,
    locked_at TIMESTAMPTZ,
    verification_json JSONB
);

CREATE TABLE IF NOT EXISTS revision_private.supervised_import_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_code TEXT NOT NULL REFERENCES revision_private.supervised_import_runs(import_code) ON DELETE RESTRICT,
    approval_code TEXT NOT NULL REFERENCES revision_private.supervised_import_approvals(approval_code) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE RESTRICT,
    source_version_id UUID NOT NULL REFERENCES public.paragraph_versions(id) ON DELETE RESTRICT,
    result_version_id UUID REFERENCES public.paragraph_versions(id) ON DELETE RESTRICT,
    operation TEXT NOT NULL CHECK (operation IN ('KEEP', 'REPLACE', 'MERGE_REPLACE', 'MERGE_SOURCE_EXCLUDED')),
    position_before INT NOT NULL,
    position_after INT NOT NULL,
    is_included_before BOOLEAN NOT NULL,
    is_included_after BOOLEAN NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    CONSTRAINT uq_import_item UNIQUE (import_code, unit_id)
);

CREATE TABLE IF NOT EXISTS revision_private.failed_import_manifests (
    manifest_code TEXT PRIMARY KEY,
    import_run_code TEXT NOT NULL,
    snapshot_code TEXT NOT NULL,
    scene_unit_id UUID NOT NULL REFERENCES public.content_units(id) ON DELETE RESTRICT,
    status TEXT NOT NULL CHECK (status IN ('REGISTERED', 'RECOVERED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS revision_private.abandoned_version_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manifest_code TEXT NOT NULL REFERENCES revision_private.failed_import_manifests(manifest_code) ON DELETE RESTRICT,
    paragraph_version_id UUID NOT NULL REFERENCES public.paragraph_versions(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_abandoned_version UNIQUE (paragraph_version_id)
);

-- 5. Create Projections (Public Schema for Viewers, but Restricted Writers)
CREATE TABLE IF NOT EXISTS public.revision_document_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.revision_projects(id) ON DELETE CASCADE,
    snapshot_id UUID NOT NULL REFERENCES public.revision_snapshots(id) ON DELETE CASCADE,
    generated_by_import_code TEXT REFERENCES revision_private.supervised_import_runs(import_code) ON DELETE SET NULL,
    projection_kind TEXT NOT NULL CHECK (projection_kind IN ('working_preview', 'editor_preview', 'reader_export', 'archive_export')),
    source_mapping_sha256 TEXT NOT NULL,
    projection_sha256 TEXT NOT NULL,
    document_json JSONB NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL CHECK (status IN ('building', 'ready', 'stale', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_current_ready CHECK (NOT is_current OR status = 'ready')
);

-- 6. Trigger to Prevent Mutation of Locked Approvals
CREATE OR REPLACE FUNCTION revision_private.fn_prevent_locked_approval_mutation()
RETURNS TRIGGER AS $func$
BEGIN
    IF OLD.locked_at IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot modify or delete a locked supervised import approval.';
    END IF;
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_approval_mutation
BEFORE UPDATE OR DELETE ON revision_private.supervised_import_approvals
FOR EACH ROW EXECUTE FUNCTION revision_private.fn_prevent_locked_approval_mutation();

CREATE OR REPLACE FUNCTION revision_private.fn_prevent_locked_backup_mutation()
RETURNS TRIGGER AS $func$
BEGIN
    IF OLD.locked_at IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot modify or delete a locked legacy document backup.';
    END IF;
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_backup_mutation
BEFORE UPDATE OR DELETE ON revision_private.legacy_document_backups
FOR EACH ROW EXECUTE FUNCTION revision_private.fn_prevent_locked_backup_mutation();


-- 7. Apply Ownership and Revoke Public/Service Role DML Access
-- Give ownership to revision_executor
ALTER TABLE public.revision_document_projections OWNER TO revision_executor;
ALTER TABLE revision_private.legacy_document_backups OWNER TO revision_executor;
ALTER TABLE revision_private.supervised_import_approvals OWNER TO revision_executor;
ALTER TABLE revision_private.supervised_import_source_bindings OWNER TO revision_executor;
ALTER TABLE revision_private.supervised_import_runs OWNER TO revision_executor;
ALTER TABLE revision_private.supervised_import_items OWNER TO revision_executor;
ALTER TABLE revision_private.failed_import_manifests OWNER TO revision_executor;
ALTER TABLE revision_private.abandoned_version_records OWNER TO revision_executor;
ALTER TABLE public.paragraph_versions OWNER TO revision_executor;
ALTER TABLE public.revision_content_map OWNER TO revision_executor;
ALTER TABLE public.paragraph_version_lineage OWNER TO revision_executor;

-- Ensure RLS is active
ALTER TABLE public.paragraph_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_content_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraph_version_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_document_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.legacy_document_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.supervised_import_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.supervised_import_source_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.supervised_import_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.supervised_import_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.failed_import_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_private.abandoned_version_records ENABLE ROW LEVEL SECURITY;

-- 8. Setup RLS Policies for revision_executor
-- This allows revision_executor to perform necessary DML if operating from an RPC.
-- Since it's NOBYPASSRLS, it needs explicit policies, or we can use security definer bypassing, but let's be explicit.
CREATE POLICY revision_executor_all ON public.paragraph_versions FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON public.revision_content_map FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON public.paragraph_version_lineage FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON public.revision_document_projections FOR ALL TO revision_executor USING (true) WITH CHECK (true);

-- Private schema is only accessible to revision_executor, so we can just give full access to it.
CREATE POLICY revision_executor_all ON revision_private.legacy_document_backups FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON revision_private.supervised_import_approvals FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON revision_private.supervised_import_source_bindings FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON revision_private.supervised_import_runs FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON revision_private.supervised_import_items FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON revision_private.failed_import_manifests FOR ALL TO revision_executor USING (true) WITH CHECK (true);
CREATE POLICY revision_executor_all ON revision_private.abandoned_version_records FOR ALL TO revision_executor USING (true) WITH CHECK (true);

-- Allow authenticated users to view active projections
CREATE POLICY authenticated_select ON public.revision_document_projections FOR SELECT TO authenticated USING (true);
-- Give service_role SELECT for sanity checks and monitoring (BUT NO INSERT/UPDATE/DELETE)
CREATE POLICY service_role_select ON public.paragraph_versions FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON public.revision_content_map FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON public.paragraph_version_lineage FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON public.revision_document_projections FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.legacy_document_backups FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.supervised_import_approvals FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.supervised_import_source_bindings FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.supervised_import_runs FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.supervised_import_items FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.failed_import_manifests FOR SELECT TO service_role USING (true);
CREATE POLICY service_role_select ON revision_private.abandoned_version_records FOR SELECT TO service_role USING (true);

-- Revoke specific direct DML from service_role
REVOKE INSERT, UPDATE, DELETE ON public.paragraph_versions FROM service_role;
REVOKE INSERT, UPDATE, DELETE ON public.revision_content_map FROM service_role;
REVOKE INSERT, UPDATE, DELETE ON public.paragraph_version_lineage FROM service_role;
