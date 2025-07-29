-- === 순위변동 종합 분석 스크립트 ===
-- 상승, 하락, 신규, 유지를 모두 한 번에 확인하는 스크립트

-- 1. 순위변동 요약 통계
SELECT 
  '=== 순위변동 요약 ===' as section,
  COUNT(*) as total_videos,
  COUNT(CASE WHEN previous_rank IS NULL THEN 1 END) as new_videos,
  COUNT(CASE WHEN rank < previous_rank THEN 1 END) as rank_up,
  COUNT(CASE WHEN rank > previous_rank THEN 1 END) as rank_down,
  COUNT(CASE WHEN rank = previous_rank THEN 1 END) as rank_same
FROM coversong_videos 
WHERE competition_id = 5

UNION ALL

-- 2. 하락 통계
SELECT 
  '=== 하락 통계 ===' as section,
  COUNT(CASE WHEN rank > previous_rank THEN 1 END) as total_decreases,
  AVG(CASE WHEN rank > previous_rank THEN (rank - previous_rank) END) as avg_decrease,
  MAX(CASE WHEN rank > previous_rank THEN (rank - previous_rank) END) as max_decrease,
  NULL as rank_same
FROM coversong_videos 
WHERE competition_id = 5 AND previous_rank IS NOT NULL

UNION ALL

-- 3. 상승 통계
SELECT 
  '=== 상승 통계 ===' as section,
  COUNT(CASE WHEN rank < previous_rank THEN 1 END) as total_increases,
  AVG(CASE WHEN rank < previous_rank THEN (previous_rank - rank) END) as avg_increase,
  MAX(CASE WHEN rank < previous_rank THEN (previous_rank - rank) END) as max_increase,
  NULL as rank_same
FROM coversong_videos 
WHERE competition_id = 5 AND previous_rank IS NOT NULL;

-- 4. 가장 큰 순위 상승 (상위 10개)
SELECT 
  '=== 가장 큰 순위 상승 ===' as section,
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

-- 5. 가장 큰 순위 하락 (상위 10개)
SELECT 
  '=== 가장 큰 순위 하락 ===' as section,
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

-- 6. 신규 비디오 (상위 10개)
SELECT 
  '=== 신규 비디오 ===' as section,
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

-- 7. 상위 50위에서 하락한 비디오들
SELECT 
  '=== 상위 50위에서 하락한 비디오들 ===' as section,
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

-- 8. 순위 유지 (변화 없는 비디오 - 상위 10개)
SELECT 
  '=== 순위 유지 ===' as section,
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

-- 9. 전체 순위변동 통합 뷰 (상위 30개)
SELECT 
  '=== 전체 순위변동 통합 뷰 (상위 30개) ===' as section,
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

-- 10. 점수별 분석
SELECT 
  '=== 점수별 분석 ===' as section,
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
  '=== 점수별 분석 ===' as section,
  '상승 비디오' as category,
  COUNT(*) as count,
  AVG(site_score) as avg_site_score,
  AVG(candidate_score) as avg_candidate_score,
  AVG(arena_likes) as avg_arena_likes,
  AVG(guest_likes) as avg_guest_likes
FROM coversong_videos 
WHERE competition_id = 5 
  AND previous_rank IS NOT NULL 
  AND rank < previous_rank

UNION ALL

SELECT 
  '=== 점수별 분석 ===' as section,
  '전체 비디오' as category,
  COUNT(*) as count,
  AVG(site_score) as avg_site_score,
  AVG(candidate_score) as avg_candidate_score,
  AVG(arena_likes) as avg_arena_likes,
  AVG(guest_likes) as avg_guest_likes
FROM coversong_videos 
WHERE competition_id = 5; 