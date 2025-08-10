-- 실시간 순위 동기화 문제 해결

-- 1. 현재 실제 TOP 10 확인
SELECT 
  rank as "현재순위",
  id,
  title,
  score,
  previous_rank,
  CASE 
    WHEN previous_rank IS NULL THEN '🆕 신규진입'
    ELSE '기존 (이전 ' || previous_rank || '위)'
  END as type
FROM coversong_videos
WHERE competition_id = 5
ORDER BY rank
LIMIT 10;

-- 2. rising_stars 테이블의 신규진입 데이터와 실제 순위 비교
SELECT 
  rs.rank_position as "신규진입순위",
  rs.video_title,
  rs.video_id,
  rs.end_rank as "저장된순위",
  v.rank as "실제현재순위",
  v.score as "현재스코어",
  CASE 
    WHEN rs.end_rank != v.rank THEN '❌ 불일치 - 업데이트 필요'
    ELSE '✅ 일치'
  END as status
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.category = 'new_entry'
ORDER BY rs.rank_position;

-- 3. rising_stars의 end_rank를 현재 실제 순위로 업데이트
UPDATE coversong_rising_stars rs
SET end_rank = v.rank
FROM coversong_videos v
WHERE v.id = rs.video_id
  AND rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06';

-- 4. rank_changes 테이블도 업데이트
UPDATE coversong_rank_changes rc
SET end_rank = v.rank
FROM coversong_videos v
WHERE v.id = rc.video_id
  AND rc.competition_id = 5
  AND rc.period_end = '2025-08-06';

-- 5. 업데이트 후 최종 확인
SELECT 
  '=== 업데이트 완료 ===' as status,
  rs.category,
  rs.rank_position,
  rs.video_title,
  rs.end_rank as "표시될순위",
  v.rank as "실제순위",
  v.score as "스코어",
  CASE 
    WHEN rs.category = 'new_entry' AND rs.rank_position = 1 AND v.rank = 1 THEN 
      '✅ 신규진입 1위 & 전체 1위'
    WHEN rs.category = 'new_entry' THEN 
      '신규진입 ' || rs.rank_position || '위 (전체 ' || v.rank || '위)'
    ELSE rs.category
  END as display_text
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
ORDER BY rs.category, rs.rank_position;

-- 6. 특히 "Soda Pop" 영상 확인
SELECT 
  'Soda Pop 영상 확인' as check_type,
  v.rank as "실제순위",
  v.score as "스코어",
  v.previous_rank as "이전순위",
  rs.rank_position as "신규진입순위",
  rs.end_rank as "저장된순위"
FROM coversong_videos v
LEFT JOIN coversong_rising_stars rs ON rs.video_id = v.id
  AND rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.category = 'new_entry'
WHERE v.competition_id = 5
  AND v.title LIKE '%Soda%Pop%'
LIMIT 1;