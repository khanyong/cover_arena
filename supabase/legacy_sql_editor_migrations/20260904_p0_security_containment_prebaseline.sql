BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- ============================================================
-- 1. Protect agent access tokens
-- ============================================================
ALTER TABLE public.agent_access_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.agent_access_tokens FROM PUBLIC, anon, authenticated;
-- service_role의 기존 backend 권한은 유지한다.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.agent_access_tokens TO service_role;

-- ============================================================
-- 2. Make novel_documents read-only to browser roles
-- ============================================================
DROP POLICY IF EXISTS "Enable insert access for all users on novel_documents" ON public.novel_documents;
DROP POLICY IF EXISTS "Enable update access for all users on novel_documents" ON public.novel_documents;
DROP POLICY IF EXISTS "Enable read access for all users on novel_documents" ON public.novel_documents;

CREATE POLICY novel_documents_public_read ON public.novel_documents 
FOR SELECT TO anon, authenticated USING (true);

REVOKE ALL PRIVILEGES ON TABLE public.novel_documents FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.novel_documents TO anon, authenticated;

-- ============================================================
-- 3. Close the world-writable lineage table
-- ============================================================
DROP POLICY IF EXISTS paragraph_version_lineage_owner_all ON public.paragraph_version_lineage;
REVOKE ALL PRIVILEGES ON TABLE public.paragraph_version_lineage FROM PUBLIC, anon, authenticated;

-- ============================================================
-- 4. Defense-in-depth on core prose tables
-- Existing owner SELECT policies remain intact.
-- ============================================================
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.paragraph_versions FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.revision_content_map FROM PUBLIC, anon, authenticated;

-- ============================================================
-- 5. Close publicly callable SECURITY DEFINER mutation RPCs
-- service_role remains temporarily authorized until Gateway 
-- Cutover is completed.
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.create_paragraph_checkpoint(
  uuid, uuid, uuid, text, text, text
) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.clone_revision_snapshot(
  uuid, text, text, text
) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.fn_complete_snapshot_copy(
  text, text
) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.lock_revision_snapshot(
  uuid
) FROM PUBLIC, anon, authenticated;

COMMIT;
