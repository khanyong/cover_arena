-- 차단된 채널 테이블 생성
CREATE TABLE IF NOT EXISTS coversong_blocked_channels (
  id SERIAL PRIMARY KEY,
  channel_name TEXT NOT NULL UNIQUE,
  channel_id TEXT, -- YouTube channel ID if available
  reason TEXT,
  blocked_by UUID REFERENCES auth.users(id),
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unblocked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_blocked_channels_name ON coversong_blocked_channels(channel_name);
CREATE INDEX IF NOT EXISTS idx_blocked_channels_is_active ON coversong_blocked_channels(is_active);

-- RLS 정책 설정
ALTER TABLE coversong_blocked_channels ENABLE ROW LEVEL SECURITY;

-- 관리자만 차단 목록을 볼 수 있음
CREATE POLICY "Admin can view blocked channels" ON coversong_blocked_channels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 관리자만 채널을 차단할 수 있음
CREATE POLICY "Admin can block channels" ON coversong_blocked_channels
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 관리자만 차단을 해제할 수 있음
CREATE POLICY "Admin can unblock channels" ON coversong_blocked_channels
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 기존 필터링 뷰 업데이트
DROP VIEW IF EXISTS coversong_videos_filtered;
DROP VIEW IF EXISTS coversong_video_rankings;

-- 차단된 영상과 채널을 모두 제외한 비디오 뷰 생성
CREATE VIEW coversong_videos_filtered AS
SELECT v.*
FROM coversong_videos v
WHERE NOT EXISTS (
  SELECT 1 
  FROM coversong_blocked_videos b 
  WHERE b.youtube_id = v.youtube_id 
  AND b.is_active = TRUE
)
AND NOT EXISTS (
  SELECT 1
  FROM coversong_blocked_channels c
  WHERE c.channel_name = v.channel
  AND c.is_active = TRUE
);

-- 차단된 영상과 채널을 모두 제외한 랭킹 뷰 생성
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
  )
  AND NOT EXISTS (
    SELECT 1
    FROM coversong_blocked_channels c
    WHERE c.channel_name = v.channel
    AND c.is_active = TRUE
  );

SELECT 'Blocked channels table and updated views created successfully!' as message;