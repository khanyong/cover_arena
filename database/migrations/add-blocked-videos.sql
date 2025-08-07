-- 차단된 영상 테이블 생성
CREATE TABLE IF NOT EXISTS coversong_blocked_videos (
  id SERIAL PRIMARY KEY,
  youtube_id TEXT NOT NULL UNIQUE,
  reason TEXT,
  blocked_by UUID REFERENCES auth.users(id),
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unblocked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_blocked_videos_youtube_id ON coversong_blocked_videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_blocked_videos_is_active ON coversong_blocked_videos(is_active);

-- RLS 정책 설정
ALTER TABLE coversong_blocked_videos ENABLE ROW LEVEL SECURITY;

-- 관리자만 차단 목록을 볼 수 있음
CREATE POLICY "Admin can view blocked videos" ON coversong_blocked_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

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

-- 기존 뷰가 있으면 삭제
DROP VIEW IF EXISTS coversong_videos_filtered;
DROP VIEW IF EXISTS coversong_video_rankings;

-- 차단된 영상을 제외한 비디오 뷰 생성
CREATE VIEW coversong_videos_filtered AS
SELECT v.*
FROM coversong_videos v
WHERE NOT EXISTS (
  SELECT 1 
  FROM coversong_blocked_videos b 
  WHERE b.youtube_id = v.youtube_id 
  AND b.is_active = TRUE
);

-- 차단된 영상을 제외한 랭킹 뷰 생성
CREATE VIEW coversong_video_rankings AS
SELECT 
  v.id,
  v.title,
  v.channel,
  v.youtube_id,
  v.views,
  v.likes,
  v.arena_likes,
  v.topic,
  ROW_NUMBER() OVER (PARTITION BY v.topic ORDER BY v.arena_likes DESC) as rank
FROM coversong_videos v
WHERE v.arena_likes > 0
  AND NOT EXISTS (
    SELECT 1 
    FROM coversong_blocked_videos b 
    WHERE b.youtube_id = v.youtube_id 
    AND b.is_active = TRUE
  );

SELECT 'Blocked videos table and views created successfully!' as message;