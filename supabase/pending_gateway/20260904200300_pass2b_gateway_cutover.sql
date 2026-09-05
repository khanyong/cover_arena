-- 20260904090300_pass2b_gateway_cutover.sql
-- Deprecate direct mutation privileges to enforce Model B Strict Gateway

SET search_path = '';

-- 1. Revoke direct DML from service_role
REVOKE INSERT, UPDATE, DELETE ON public.paragraph_versions FROM service_role;
REVOKE INSERT, UPDATE, DELETE ON public.revision_content_map FROM service_role;
REVOKE INSERT, UPDATE, DELETE ON public.paragraph_version_lineage FROM service_role;

-- 2. Revoke execution of existing mutation RPCs from service_role
-- Assuming we want to force usage through the new Gateway only for Pass 2B tasks.
-- If they are required for other tasks, they would be re-evaluated.
REVOKE EXECUTE ON FUNCTION public.create_paragraph_checkpoint(UUID, TEXT, UUID, TEXT, TEXT, INT) FROM service_role;
REVOKE EXECUTE ON FUNCTION public.clone_revision_snapshot(UUID, TEXT, TEXT) FROM service_role;
REVOKE EXECUTE ON FUNCTION public.lock_revision_snapshot(UUID, TEXT) FROM service_role;
REVOKE EXECUTE ON FUNCTION public.fn_complete_snapshot_copy(UUID, TEXT) FROM service_role;

-- 3. We explicitly grant execution to revision_executor so that the strict gateway can use them if it wrapped them
GRANT EXECUTE ON FUNCTION public.create_paragraph_checkpoint(UUID, TEXT, UUID, TEXT, TEXT, INT) TO revision_executor;
GRANT EXECUTE ON FUNCTION public.clone_revision_snapshot(UUID, TEXT, TEXT) TO revision_executor;
GRANT EXECUTE ON FUNCTION public.lock_revision_snapshot(UUID, TEXT) TO revision_executor;
GRANT EXECUTE ON FUNCTION public.fn_complete_snapshot_copy(UUID, TEXT) TO revision_executor;
