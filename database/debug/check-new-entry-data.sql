-- 신규진입 데이터 확인 쿼리

-- 1. 현재 전체 순위 TOP 10 확인 (신규진입 여부 포함)
SELECT 
  v.rank,
  v.id,
  v.title,
  v.channel,
  v.previous_rank,
  CASE 
    WHEN v.previous_rank IS NULL THEN '신규진입'
    ELSE '기존'
  END as entry_type
FROM coversong_videos v
WHERE v.competition_id = 5  -- 현재 활성 대회 ID
ORDER BY v.rank ASC
LIMIT 10;

-- 2. coversong_rank_changes 테이블에서 신규진입 확인
SELECT 
  rc.video_id,
  rc.end_rank,
  rc.is_new_entry,
  v.title,
  v.channel
FROM coversong_rank_changes rc
JOIN coversong_videos v ON v.id = rc.video_id
WHERE rc.competition_id = 5
  AND rc.period_type = 'daily'
  AND rc.period_end = CURRENT_DATE
  AND rc.is_new_entry = true
ORDER BY rc.end_rank ASC;

-- 3. coversong_rising_stars 테이블에서 신규진입 카테고리 데이터 확인
SELECT 
  rs.*,
  v.rank as current_rank,
  v.title
FROM coversong_rising_stars rs
LEFT JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.category = 'new_entry'
  AND rs.recorded_date = (
    SELECT MAX(recorded_date) 
    FROM coversong_rising_stars 
    WHERE competition_id = 5
  )
ORDER BY rs.rank_position ASC;

-- 4. 가장 최근 날짜의 모든 rising_stars 데이터 확인
SELECT 
  category,
  rank_position,
  video_id,
  video_title,
  end_rank,
  rank_change
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = (
    SELECT MAX(recorded_date) 
    FROM coversong_rising_stars 
    WHERE competition_id = 5
  )
ORDER BY category, rank_position;

-- 5. 전체 2위 영상이 신규진입인지 확인
SELECT 
  v.id,
  v.rank,
  v.title,
  v.previous_rank,
  rc.is_new_entry,
  rs.category,
  rs.rank_position
FROM coversong_videos v
LEFT JOIN coversong_rank_changes rc ON rc.video_id = v.id 
  AND rc.competition_id = v.competition_id
  AND rc.period_type = 'daily'
  AND rc.period_end = CURRENT_DATE
LEFT JOIN coversong_rising_stars rs ON rs.video_id = v.id
  AND rs.competition_id = v.competition_id
  AND rs.recorded_date = CURRENT_DATE
WHERE v.competition_id = 5
  AND v.rank = 2;