-- 리뷰 시스템 디버깅 쿼리

-- 1. 리뷰 테이블에 데이터가 있는지 확인
SELECT 
  'coversong_reviews 테이블' as table_name,
  COUNT(*) as total_count
FROM coversong_reviews;

-- 2. 상위 5개 리뷰 샘플 확인
SELECT 
  r.id,
  r.video_id,
  r.overall_rating,
  r.review_text,
  r.created_at,
  v.title as video_title
FROM coversong_reviews r
LEFT JOIN coversong_videos v ON r.video_id = v.youtube_id
ORDER BY r.created_at DESC
LIMIT 5;

-- 3. 비디오 ID 형식 확인 (불일치 가능성)
SELECT DISTINCT
  'Reviews video_id format' as source,
  video_id,
  LENGTH(video_id) as id_length
FROM coversong_reviews
LIMIT 5;

-- 4. Videos 테이블의 youtube_id 형식 확인
SELECT DISTINCT
  'Videos youtube_id format' as source,
  youtube_id,
  LENGTH(youtube_id) as id_length
FROM coversong_videos
WHERE site_score IS NOT NULL
ORDER BY site_score DESC
LIMIT 5;

-- 5. 매칭되는 리뷰 확인
SELECT 
  v.youtube_id,
  v.title,
  COUNT(r.id) as review_count
FROM coversong_videos v
LEFT JOIN coversong_reviews r ON v.youtube_id = r.video_id
WHERE v.site_score IS NOT NULL
GROUP BY v.youtube_id, v.title
HAVING COUNT(r.id) > 0
ORDER BY v.site_score DESC
LIMIT 10;

-- 6. RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename LIKE 'coversong_review%'
ORDER BY tablename, policyname;

-- 7. 사용자 정보 확인
SELECT 
  'Profiles 테이블 사용자 수' as info,
  COUNT(*) as count
FROM profiles;

-- 8. 리뷰와 사용자 연결 확인
SELECT 
  r.id as review_id,
  r.user_id,
  p.username,
  p.email,
  r.overall_rating,
  r.video_id
FROM coversong_reviews r
LEFT JOIN profiles p ON r.user_id = p.id
LIMIT 5;