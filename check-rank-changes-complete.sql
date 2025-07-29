-- === 순위변동 완전 확인 스크립트 ===
-- 상승과 하락을 모두 확인할 수 있는 스크립트

-- 1. 순위변동 요약 (RPC 함수 사용)
SELECT * FROM get_rank_summary(5);

-- 2. 순위변동 상세 분석
SELECT 
  COUNT(*) as total_videos,
  COUNT(CASE WHEN previous_rank IS NULL THEN 1 END) as new_videos,
  COUNT(CASE WHEN rank < previous_rank THEN 1 END) as rank_up,
  COUNT(CASE WHEN rank > previous_rank THEN 1 END) as rank_down,
  COUNT(CASE WHEN rank = previous_rank THEN 1 END) as rank_same
FROM coversong_videos 
WHERE competition_id = 5;

-- 3. 가장 큰 순위 상승 (상위 10개)
SELECT 
  rank,
  previous_rank,
  (previous_rank - rank) as rank_increase,
  '상승' as rank_change,
  id,
  title,
  site_score,
  candidate_score,
  arena_likes,
  guest_likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NOT NULL 
  AND rank < previous_rank
ORDER BY (previous_rank - rank) DESC
LIMIT 10;

-- 4. 가장 큰 순위 하락 (상위 10개)
SELECT 
  rank,
  previous_rank,
  (rank - previous_rank) as rank_decrease,
  '하락' as rank_change,
  id,
  title,
  site_score,
  candidate_score,
  arena_likes,
  guest_likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NOT NULL 
  AND rank > previous_rank
ORDER BY (rank - previous_rank) DESC
LIMIT 10;

-- 5. 신규 비디오 (previous_rank가 NULL인 경우)
SELECT 
  rank,
  previous_rank,
  '신규' as rank_change,
  id,
  title,
  site_score,
  candidate_score,
  arena_likes,
  guest_likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NULL
ORDER BY rank ASC
LIMIT 10;

-- 6. 순위 유지 (변화 없는 비디오)
SELECT 
  rank,
  previous_rank,
  '유지' as rank_change,
  id,
  title,
  site_score,
  candidate_score,
  arena_likes,
  guest_likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NOT NULL 
  AND rank = previous_rank
ORDER BY rank ASC
LIMIT 10;

-- 7. 전체 순위변동 통합 뷰 (상위 30개)
SELECT 
  rank,
  previous_rank,
  CASE 
    WHEN previous_rank IS NULL THEN '신규'
    WHEN rank < previous_rank THEN '상승 (' || (previous_rank - rank) || ')'
    WHEN rank > previous_rank THEN '하락 (' || (rank - previous_rank) || ')'
    ELSE '유지'
  END as rank_change,
  id,
  title,
  site_score,
  candidate_score,
  arena_likes,
  guest_likes
FROM coversong_videos 
WHERE competition_id = 5
ORDER BY rank ASC
LIMIT 30; 