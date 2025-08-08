-- 기존 SELECT 정책 삭제
DROP POLICY IF EXISTS "Admin can view blocked videos" ON coversong_blocked_videos;

-- 새로운 SELECT 정책 생성 - 모든 사용자가 차단된 영상 목록을 볼 수 있도록 허용
-- (youtube_id와 is_active 필드만 조회 가능하도록 제한하려면 뷰를 사용하는 것이 좋지만,
-- 현재는 전체 테이블 조회를 허용)
CREATE POLICY "Anyone can view blocked videos" ON coversong_blocked_videos
  FOR SELECT USING (true);

-- 또는 더 안전하게 하려면 active 상태인 것만 볼 수 있도록:
-- DROP POLICY IF EXISTS "Anyone can view blocked videos" ON coversong_blocked_videos;
-- CREATE POLICY "Anyone can view active blocked videos" ON coversong_blocked_videos
--   FOR SELECT USING (is_active = true);