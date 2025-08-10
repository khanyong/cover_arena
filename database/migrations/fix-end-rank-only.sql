-- end_rank만 수정 (start_rank는 신규진입은 NULL이 맞음)

-- 1. 현재 상태 확인
SELECT 
  rc.video_id,
  rc.start_rank,  -- 신규진입은 NULL이 정상
  rc.end_rank,     -- 이것이 NULL이면 문제
  rc.is_new_entry,
  v.rank as actual_current_rank
FROM coversong_rank_changes rc
JOIN coversong_videos v ON v.id = rc.video_id
WHERE rc.competition_id = 5
  AND rc.period_end = '2025-08-06'
  AND rc.is_new_entry = true
LIMIT 10;

-- 2. coversong_rank_changes의 end_rank 업데이트
UPDATE coversong_rank_changes rc
SET end_rank = v.rank
FROM coversong_videos v
WHERE v.id = rc.video_id
  AND rc.competition_id = 5
  AND rc.period_end = '2025-08-06'
  AND rc.end_rank IS NULL;  -- NULL인 것만 업데이트

-- 3. 업데이트 후 확인
SELECT 
  video_id,
  start_rank,
  end_rank,
  is_new_entry,
  CASE 
    WHEN is_new_entry AND start_rank IS NULL AND end_rank IS NOT NULL THEN '✅ 정상'
    WHEN is_new_entry AND end_rank IS NULL THEN '❌ end_rank NULL 문제'
    ELSE '기존 영상'
  END as status
FROM coversong_rank_changes
WHERE competition_id = 5
  AND period_end = '2025-08-06'
  AND is_new_entry = true
LIMIT 10;

-- 4. coversong_rising_stars의 end_rank 업데이트
UPDATE coversong_rising_stars rs
SET end_rank = rc.end_rank
FROM coversong_rank_changes rc
WHERE rc.video_id = rs.video_id
  AND rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.end_rank IS NULL
  AND rc.period_end = '2025-08-06';

-- 5. 그래도 NULL이면 coversong_videos에서 직접 가져오기
UPDATE coversong_rising_stars rs
SET end_rank = v.rank
FROM coversong_videos v
WHERE v.id = rs.video_id
  AND rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.end_rank IS NULL;

-- 6. 최종 확인
SELECT 
  category,
  rank_position,
  video_title,
  start_rank,
  end_rank,
  CASE 
    WHEN category = 'new_entry' THEN 
      '신규진입 ' || rank_position || '위 → 현재 ' || COALESCE(end_rank::text, 'NULL!!!') || '위'
    WHEN category = 'daily_rising' THEN 
      COALESCE(start_rank::text, 'NEW') || ' → ' || COALESCE(end_rank::text, 'NULL!!!') || '위'
    ELSE category
  END as display_info
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = '2025-08-06'
ORDER BY category, rank_position;

-- 7. 신규진입 TOP 3의 실제 순위 확인
SELECT 
  rs.rank_position,
  rs.video_title,
  rs.end_rank as stored_end_rank,
  v.rank as actual_rank,
  CASE 
    WHEN rs.end_rank = v.rank THEN '✅ 일치'
    WHEN rs.end_rank IS NULL THEN '❌ NULL'
    ELSE '❌ 불일치'
  END as status
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.category = 'new_entry'
ORDER BY rs.rank_position;