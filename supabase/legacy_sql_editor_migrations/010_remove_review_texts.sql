-- 모든 리뷰의 텍스트 내용을 제거하고 점수만 유지
UPDATE coversong_reviews
SET review_text = NULL
WHERE review_text IS NOT NULL;

-- 확인
SELECT 
  COUNT(*) as total_reviews,
  COUNT(review_text) as reviews_with_text,
  COUNT(overall_rating) as reviews_with_rating
FROM coversong_reviews;