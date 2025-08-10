-- 실제 1위와 신규진입 데이터 확인

-- 1. 현재 실제 TOP 5 확인
SELECT 
  rank,
  id,
  title,
  score,
  previous_rank,
  CASE 
    WHEN previous_rank IS NULL THEN '🆕 신규진입'
    ELSE '기존'
  END as type
FROM coversong_videos
WHERE competition_id = 5
ORDER BY rank
LIMIT 5;

-- 2. 신규진입 영상 중 TOP 5 확인
SELECT 
  rank as "현재순위",
  id,
  title,
  score
FROM coversong_videos
WHERE competition_id = 5
  AND previous_rank IS NULL
ORDER BY rank
LIMIT 5;

-- 3. rising_stars 테이블에 저장된 신규진입 데이터
SELECT 
  rank_position,
  video_id,
  video_title,
  end_rank
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = '2025-08-06'
  AND category = 'new_entry'
ORDER BY rank_position;

-- 4. 왜 Soda Pop (4위)가 rising_stars에 없는지 확인
-- rising_stars는 '2025-08-06' 날짜로 저장되었는데, 
-- 그 당시에는 다른 영상들이 신규진입이었을 가능성

-- 5. rising_stars 테이블 다시 생성 (현재 데이터 기준)
DELETE FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = CURRENT_DATE
  AND category = 'new_entry';

INSERT INTO coversong_rising_stars (
  video_id, competition_id, category, rank_position,
  rank_change, recorded_date, video_title, channel, thumbnail,
  start_rank, end_rank
)
SELECT 
  id,
  competition_id,
  'new_entry',
  ROW_NUMBER() OVER (ORDER BY rank ASC),
  NULL,
  CURRENT_DATE,
  title,
  channel,
  thumbnail,
  NULL,
  rank
FROM coversong_videos
WHERE competition_id = 5
  AND previous_rank IS NULL
ORDER BY rank
LIMIT 3;

-- 6. 새로 생성된 데이터 확인
SELECT 
  rank_position as "신규진입 순위",
  video_title,
  end_rank as "현재 전체 순위",
  CASE 
    WHEN rank_position = 1 AND end_rank = 4 THEN '✅ Soda Pop이 신규진입 1위 & 전체 4위'
    ELSE '확인'
  END as status
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = CURRENT_DATE
  AND category = 'new_entry'
ORDER BY rank_position;