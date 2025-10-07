-- 차단된 채널 테이블의 RLS 정책 수정
-- 읽기는 모든 사용자가 가능하도록 변경 (차단 정보는 공개)
-- 쓰기/수정/삭제는 여전히 관리자만 가능

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Admin can view blocked channels" ON coversong_blocked_channels;
DROP POLICY IF EXISTS "Admin can block channels" ON coversong_blocked_channels;
DROP POLICY IF EXISTS "Admin can unblock channels" ON coversong_blocked_channels;

-- 새로운 정책 생성
-- 1. 모든 사용자가 차단 목록을 볼 수 있음
CREATE POLICY "Anyone can view blocked channels" ON coversong_blocked_channels
  FOR SELECT USING (true);

-- 2. 관리자만 채널을 차단할 수 있음
CREATE POLICY "Admin can block channels" ON coversong_blocked_channels
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 3. 관리자만 차단을 해제할 수 있음
CREATE POLICY "Admin can unblock channels" ON coversong_blocked_channels
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 차단된 영상 테이블도 동일하게 수정
DROP POLICY IF EXISTS "Admin can view blocked videos" ON coversong_blocked_videos;
DROP POLICY IF EXISTS "Admin can block videos" ON coversong_blocked_videos;
DROP POLICY IF EXISTS "Admin can unblock videos" ON coversong_blocked_videos;

-- 모든 사용자가 차단된 영상 목록을 볼 수 있음
CREATE POLICY "Anyone can view blocked videos" ON coversong_blocked_videos
  FOR SELECT USING (true);

-- 관리자만 영상을 차단할 수 있음
CREATE POLICY "Admin can block videos" ON coversong_blocked_videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 관리자만 차단을 해제할 수 있음
CREATE POLICY "Admin can unblock videos" ON coversong_blocked_videos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

SELECT 'RLS policies updated - blocked lists are now publicly viewable!' as message;