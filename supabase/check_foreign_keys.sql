-- Foreign Key 관계 확인

-- 1. profiles 테이블 구조 확인
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. coversong_reviews 테이블의 foreign key 확인
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'coversong_reviews'
  AND tc.constraint_type = 'FOREIGN KEY';

-- 3. 실제 리뷰 데이터와 profiles 매칭 확인
SELECT 
  r.id as review_id,
  r.user_id,
  p.id as profile_id,
  p.username,
  p.email,
  CASE 
    WHEN p.id IS NULL THEN 'Profile Not Found!'
    ELSE 'OK'
  END as status
FROM coversong_reviews r
LEFT JOIN profiles p ON r.user_id = p.id
LIMIT 10;

-- 4. profiles 테이블에 없는 user_id를 가진 리뷰 찾기
SELECT 
  r.user_id,
  COUNT(*) as review_count
FROM coversong_reviews r
LEFT JOIN profiles p ON r.user_id = p.id
WHERE p.id IS NULL
GROUP BY r.user_id;

-- 5. 간단한 조인 테스트
SELECT 
  r.*,
  p.username,
  p.email
FROM coversong_reviews r
LEFT JOIN profiles p ON r.user_id = p.id
LIMIT 5;