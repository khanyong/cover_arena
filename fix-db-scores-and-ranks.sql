-- === DB 점수 및 순위 정리 스크립트 ===
-- 실행 전: competition_id = 5인 데이터만 처리

-- 1. candidate_score 재계산 (views + likes * 100)
UPDATE coversong_videos 
SET candidate_score = views + (likes * 100)
WHERE competition_id = 5;

-- 2. site_score 재계산 (candidate_score + arena_likes * 500 + guest_likes * 10)
UPDATE coversong_videos 
SET site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10)
WHERE competition_id = 5;

-- 3. score 필드도 site_score와 동일하게 설정
UPDATE coversong_videos 
SET score = site_score
WHERE competition_id = 5;

-- 4. 순위 재계산 (site_score 기준으로 정렬)
WITH ranked_videos AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY site_score DESC, candidate_score DESC, views DESC) as new_rank
  FROM coversong_videos 
  WHERE competition_id = 5
)
UPDATE coversong_videos 
SET rank = ranked_videos.new_rank
FROM ranked_videos
WHERE coversong_videos.id = ranked_videos.id;

-- 5. previous_rank를 현재 rank로 설정 (순위변동 추적을 위해)
UPDATE coversong_videos 
SET previous_rank = rank 
WHERE competition_id = 5;

-- 6. 결과 확인을 위한 조회
SELECT 
  COUNT(*) as total_videos,
  COUNT(CASE WHEN site_score = 0 THEN 1 END) as zero_site_score,
  COUNT(CASE WHEN candidate_score = 0 THEN 1 END) as zero_candidate_score,
  COUNT(CASE WHEN arena_likes > 0 THEN 1 END) as has_arena_likes,
  COUNT(CASE WHEN guest_likes > 0 THEN 1 END) as has_guest_likes
FROM coversong_videos 
WHERE competition_id = 5;

-- 7. 상위 10개 비디오 확인
SELECT 
  rank,
  id,
  title,
  views,
  likes,
  arena_likes,
  guest_likes,
  candidate_score,
  site_score
FROM coversong_videos 
WHERE competition_id = 5
ORDER BY rank ASC
LIMIT 10; 