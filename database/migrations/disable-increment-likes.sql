-- increment_likes 함수 비활성화 또는 수정

-- 1. 기존 함수 삭제 (있다면)
DROP FUNCTION IF EXISTS increment_likes(TEXT, INTEGER, UUID, TEXT);

-- 2. 또는 함수를 수정하여 아무것도 하지 않도록
-- CREATE OR REPLACE FUNCTION increment_likes(
--   p_video_id TEXT,
--   p_competition_id INTEGER,
--   p_user_id UUID DEFAULT NULL,
--   p_like_type TEXT DEFAULT 'arena'
-- )
-- RETURNS JSON AS $$
-- BEGIN
--   -- 더 이상 사용하지 않음 - /api/vote-video 사용
--   RETURN json_build_object(
--     'success', false,
--     'message', 'This function is deprecated. Use /api/vote-video instead.'
--   );
-- END;
-- $$ LANGUAGE plpgsql;

-- 3. 함수 권한 제거 (삭제하지 않고 권한만 제거)
-- REVOKE EXECUTE ON FUNCTION increment_likes FROM PUBLIC;
-- REVOKE EXECUTE ON FUNCTION increment_likes FROM anon;