-- === 순위변동 확인 스크립트 ===
-- rank 재계산 후 순위변동을 확인하는 스크립트

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

-- 3. 상위 20개 비디오의 순위변동 확인
SELECT 
  rank,
  previous_rank,
  CASE 
    WHEN previous_rank IS NULL THEN '신규'
    WHEN rank < previous_rank THEN '상승'
    WHEN rank > previous_rank THEN '하락'
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
LIMIT 20;

-- 4. 가장 큰 순위변동이 있는 비디오들 (상위 10개)
SELECT 
  rank,
  previous_rank,
  ABS(rank - COALESCE(previous_rank, rank)) as rank_change_abs,
  CASE 
    WHEN previous_rank IS NULL THEN '신규'
    WHEN rank < previous_rank THEN '상승'
    WHEN rank > previous_rank THEN '하락'
    ELSE '유지'
  END as rank_change,
  id,
  title,
  site_score
FROM coversong_videos 
WHERE competition_id = 5
ORDER BY ABS(rank - COALESCE(previous_rank, rank)) DESC
LIMIT 10; 