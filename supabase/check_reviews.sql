-- 리뷰가 생성된 영상 확인 쿼리

-- 1. 전체 리뷰 통계
SELECT 
  '전체 통계' as category,
  COUNT(DISTINCT video_id) as videos_with_reviews,
  COUNT(*) as total_reviews,
  ROUND(AVG(overall_rating), 2) as avg_rating
FROM coversong_reviews;

-- 2. 리뷰가 있는 상위 20개 영상 목록
SELECT 
  v.title,
  v.channel,
  v.youtube_id,
  v.site_score,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.overall_rating), 2) as avg_rating,
  MIN(r.overall_rating) as min_rating,
  MAX(r.overall_rating) as max_rating,
  STRING_AGG(DISTINCT 
    CASE 
      WHEN p.username IS NOT NULL THEN p.username
      WHEN p.email IS NOT NULL THEN SPLIT_PART(p.email, '@', 1)
      ELSE 'User ' || LEFT(r.user_id::TEXT, 8)
    END, ', '
  ) as reviewers
FROM coversong_videos v
INNER JOIN coversong_reviews r ON v.youtube_id = r.video_id
LEFT JOIN profiles p ON r.user_id = p.id
GROUP BY v.youtube_id, v.title, v.channel, v.site_score
ORDER BY v.site_score DESC
LIMIT 20;

-- 3. 카테고리별 평균 평점
SELECT 
  '평균 평점 분석' as category,
  ROUND(AVG(overall_rating), 2) as overall_avg,
  ROUND(AVG(vocal_rating), 2) as vocal_avg,
  ROUND(AVG(emotion_rating), 2) as emotion_avg,
  ROUND(AVG(arrangement_rating), 2) as arrangement_avg,
  ROUND(AVG(quality_rating), 2) as quality_avg
FROM coversong_reviews;

-- 4. 리뷰어별 활동 통계
SELECT 
  CASE 
    WHEN p.username IS NOT NULL THEN p.username
    WHEN p.email IS NOT NULL THEN p.email
    ELSE 'User ' || LEFT(p.id::TEXT, 8)
  END as reviewer,
  COUNT(r.id) as reviews_written,
  ROUND(AVG(r.overall_rating), 2) as avg_rating_given,
  STRING_AGG(v.title, ', ' ORDER BY v.site_score DESC LIMIT 3) as reviewed_videos
FROM coversong_reviews r
JOIN profiles p ON r.user_id = p.id
JOIN coversong_videos v ON r.video_id = v.youtube_id
GROUP BY p.id, p.username, p.email
ORDER BY reviews_written DESC;

-- 5. 댓글이 있는 리뷰
SELECT 
  v.title as video_title,
  r.review_text,
  r.overall_rating,
  COUNT(c.id) as comment_count
FROM coversong_reviews r
JOIN coversong_videos v ON r.video_id = v.youtube_id
LEFT JOIN coversong_review_comments c ON r.id = c.review_id
WHERE c.id IS NOT NULL
GROUP BY r.id, v.title, r.review_text, r.overall_rating
ORDER BY comment_count DESC
LIMIT 10;

-- 6. 반응(좋아요 등)이 많은 리뷰
SELECT 
  v.title as video_title,
  r.review_text,
  r.overall_rating,
  r.helpful_count,
  COUNT(react.id) as total_reactions
FROM coversong_reviews r
JOIN coversong_videos v ON r.video_id = v.youtube_id
LEFT JOIN coversong_review_reactions react ON r.id = react.review_id
WHERE r.helpful_count > 0 OR react.id IS NOT NULL
GROUP BY r.id, v.title, r.review_text, r.overall_rating, r.helpful_count
ORDER BY r.helpful_count DESC, total_reactions DESC
LIMIT 10;

-- 7. 평점별 리뷰 분포
SELECT 
  overall_rating as stars,
  COUNT(*) as review_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM coversong_reviews), 1) as percentage
FROM coversong_reviews
GROUP BY overall_rating
ORDER BY overall_rating DESC;

-- 8. 최근 생성된 리뷰 10개
SELECT 
  v.title,
  r.overall_rating,
  r.review_text,
  r.created_at,
  CASE 
    WHEN p.username IS NOT NULL THEN p.username
    ELSE 'User ' || LEFT(p.id::TEXT, 8)
  END as reviewer
FROM coversong_reviews r
JOIN coversong_videos v ON r.video_id = v.youtube_id
JOIN profiles p ON r.user_id = p.id
ORDER BY r.created_at DESC
LIMIT 10;