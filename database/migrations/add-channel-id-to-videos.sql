-- coversong_videos 테이블에 channel_id 컬럼 추가
ALTER TABLE coversong_videos 
ADD COLUMN IF NOT EXISTS channel_id TEXT;

-- 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON coversong_videos(channel_id);

-- 기존 뷰 업데이트
DROP VIEW IF EXISTS coversong_videos_filtered;
DROP VIEW IF EXISTS coversong_video_rankings;

-- 채널 ID와 채널명 모두로 필터링하는 뷰 생성
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
  WHERE (c.channel_name = v.channel OR c.channel_id = v.channel_id)
  AND c.is_active = TRUE
);

-- 랭킹 뷰도 동일하게 업데이트
CREATE VIEW coversong_video_rankings AS
SELECT 
  v.id,
  v.title,
  v.channel,
  v.channel_id,
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
    WHERE (c.channel_name = v.channel OR c.channel_id = v.channel_id)
    AND c.is_active = TRUE
  );

SELECT 'Channel ID column and updated views created successfully!' as message;