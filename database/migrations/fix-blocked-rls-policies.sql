-- 모든 기존 정책 먼저 삭제
DROP POLICY IF EXISTS "Anyone can view blocked videos" ON coversong_blocked_videos;
DROP POLICY IF EXISTS "Admin can view blocked videos" ON coversong_blocked_videos;
DROP POLICY IF EXISTS "Admin can block videos" ON coversong_blocked_videos;
DROP POLICY IF EXISTS "Admin can unblock videos" ON coversong_blocked_videos;

DROP POLICY IF EXISTS "Anyone can view blocked channels" ON coversong_blocked_channels;
DROP POLICY IF EXISTS "Admin can view blocked channels" ON coversong_blocked_channels;
DROP POLICY IF EXISTS "Admin can block channels" ON coversong_blocked_channels;
DROP POLICY IF EXISTS "Admin can unblock channels" ON coversong_blocked_channels;

-- 차단된 영상 테이블 정책 재생성
CREATE POLICY "Anyone can view blocked videos" ON coversong_blocked_videos
  FOR SELECT USING (true);

CREATE POLICY "Admin can block videos" ON coversong_blocked_videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admin can unblock videos" ON coversong_blocked_videos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 차단된 채널 테이블 정책 재생성
CREATE POLICY "Anyone can view blocked channels" ON coversong_blocked_channels
  FOR SELECT USING (true);

CREATE POLICY "Admin can block channels" ON coversong_blocked_channels
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admin can unblock channels" ON coversong_blocked_channels
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

SELECT 'RLS policies fixed - blocked lists are now publicly viewable!' as message;