-- === 순위 하락 확인 스크립트 ===
-- 순위가 하락한 비디오들을 확인하는 스크립트

-- 1. 순위 하락 통계
SELECT 
  COUNT(CASE WHEN rank > previous_rank THEN 1 END) as total_decreases,
  AVG(CASE WHEN rank > previous_rank THEN (rank - previous_rank) END) as avg_decrease,
  MAX(CASE WHEN rank > previous_rank THEN (rank - previous_rank) END) as max_decrease
FROM coversong_videos 
WHERE competition_id = 5 AND previous_rank IS NOT NULL;

-- 2. 가장 큰 순위 하락 (상위 20개)
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
  guest_likes,
  views,
  likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NOT NULL 
  AND rank > previous_rank
ORDER BY (rank - previous_rank) DESC
LIMIT 20;

-- 3. 상위 50위에서 하락한 비디오들
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
  AND previous_rank <= 50
ORDER BY (rank - previous_rank) DESC;

-- 4. 하락한 비디오들의 점수 분석
SELECT 
  '하락 비디오' as category,
  COUNT(*) as count,
  AVG(site_score) as avg_site_score,
  AVG(candidate_score) as avg_candidate_score,
  AVG(arena_likes) as avg_arena_likes,
  AVG(guest_likes) as avg_guest_likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NOT NULL 
  AND rank > previous_rank

UNION ALL

SELECT 
  '전체 비디오' as category,
  COUNT(*) as count,
  AVG(site_score) as avg_site_score,
  AVG(candidate_score) as avg_candidate_score,
  AVG(arena_likes) as avg_arena_likes,
  AVG(guest_likes) as avg_guest_likes
FROM coversong_videos 
WHERE competition_id = 5; 