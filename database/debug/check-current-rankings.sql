-- 현재 실제 TOP 5 확인
SELECT 
  rank,
  id,
  title,
  site_score,
  candidate_score,
  arena_likes,
  guest_likes
FROM coversong_videos
WHERE competition_id = 5
ORDER BY rank
LIMIT 5;