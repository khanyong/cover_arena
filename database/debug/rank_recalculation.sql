-- === 현재 DB 내용으로 rank 정확히 산정하는 스크립트 (개선版) ===
-- previous_rank는 그대로 두고 현재 rank만 재계산
-- competition_id = 5인 데이터만 처리
-- 실제 값이 변경된 행만 updated_at 갱신

-- 1. candidate_score 재계산 (views + likes * 100)
UPDATE coversong_videos 
SET 
  candidate_score = views + (likes * 100),
  updated_at = CASE 
    WHEN candidate_score != (views + (likes * 100)) THEN NOW()
    ELSE updated_at
  END
WHERE competition_id = 5;

-- 2. site_score 재계산 (candidate_score + arena_likes * 500 + guest_likes * 10)
UPDATE coversong_videos 
SET 
  site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10),
  updated_at = CASE 
    WHEN site_score != (candidate_score + (arena_likes * 500) + (guest_likes * 10)) THEN NOW()
    ELSE updated_at
  END
WHERE competition_id = 5;

-- 3. score 필드도 site_score와 동일하게 설정
UPDATE coversong_videos 
SET 
  score = site_score,
  updated_at = CASE 
    WHEN score != site_score THEN NOW()
    ELSE updated_at
  END
WHERE competition_id = 5;

-- 4. 순위 재계산 (site_score 기준으로 정렬)
-- previous_rank는 건드리지 않음
WITH ranked_videos AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY site_score DESC, candidate_score DESC, views DESC) as new_rank
  FROM coversong_videos 
  WHERE competition_id = 5
)
UPDATE coversong_videos 
SET 
  rank = ranked_videos.new_rank,
  updated_at = CASE 
    WHEN rank != ranked_videos.new_rank THEN NOW()
    ELSE updated_at
  END
FROM ranked_videos
WHERE coversong_videos.id = ranked_videos.id;

-- 5. 결과 확인을 위한 조회
SELECT 
  COUNT(*) as total_videos,
  COUNT(CASE WHEN site_score = 0 THEN 1 END) as zero_site_score,
  COUNT(CASE WHEN candidate_score = 0 THEN 1 END) as zero_candidate_score,
  COUNT(CASE WHEN arena_likes > 0 THEN 1 END) as has_arena_likes,
  COUNT(CASE WHEN guest_likes > 0 THEN 1 END) as has_guest_likes,
  COUNT(CASE WHEN previous_rank IS NULL THEN 1 END) as null_previous_rank
FROM coversong_videos 
WHERE competition_id = 5;

-- 6. 상위 10개 비디오 확인
SELECT 
  rank,
  previous_rank,
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
