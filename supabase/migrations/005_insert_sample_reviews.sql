-- 샘플 리뷰 데이터 삽입 스크립트
-- 모든 영상에 대해 초기 샘플 리뷰를 생성합니다

-- 먼저 샘플 사용자들을 생성 (실제로는 auth.users에 이미 존재해야 함)
-- 이 부분은 실제 사용자 ID로 대체해야 합니다

DO $$
DECLARE
  video_record RECORD;
  sample_user_ids UUID[] := ARRAY[
    gen_random_uuid(), -- 샘플 유저 1
    gen_random_uuid(), -- 샘플 유저 2
    gen_random_uuid(), -- 샘플 유저 3
    gen_random_uuid(), -- 샘플 유저 4
    gen_random_uuid()  -- 샘플 유저 5
  ];
  user_id UUID;
  rating_base INTEGER;
  vocal_rating INTEGER;
  emotion_rating INTEGER;
  arrangement_rating INTEGER;
  quality_rating INTEGER;
  review_texts TEXT[] := ARRAY[
    '정말 감동적인 커버입니다. 원곡의 느낌을 잘 살리면서도 자신만의 색깔을 잘 표현했네요.',
    '보컬 실력이 뛰어나고 감정 전달이 잘 되었습니다. 편곡도 신선하네요!',
    '목소리가 정말 매력적이에요. 듣는 내내 귀가 즐거웠습니다.',
    '영상 퀄리티도 좋고 노래도 잘 부르시네요. 앞으로도 기대됩니다!',
    '원곡과는 다른 매력이 있어서 좋았어요. 계속 듣고 싶어지는 커버입니다.',
    '감정이 잘 전달되는 커버네요. 보컬 톤이 곡과 잘 어울립니다.',
    '편곡이 정말 독특하고 좋아요! 새로운 느낌의 커버입니다.',
    '깔끔한 보컬과 안정적인 퍼포먼스가 인상적입니다.',
    '이런 해석도 가능하군요! 정말 창의적인 커버입니다.',
    '듣기 편안하고 좋네요. 실력이 느껴지는 커버입니다.'
  ];
  review_text TEXT;
  i INTEGER;
BEGIN
  -- coversong_videos 테이블의 상위 100개 영상에 대해 리뷰 생성
  FOR video_record IN 
    SELECT youtube_id 
    FROM coversong_videos 
    ORDER BY site_score DESC NULLS LAST
    LIMIT 100
  LOOP
    -- 각 영상마다 2-4개의 리뷰 생성
    FOR i IN 1..2 + floor(random() * 3)::INTEGER LOOP
      -- 랜덤 사용자 선택
      user_id := sample_user_ids[1 + floor(random() * 5)::INTEGER];
      
      -- 베이스 평점 설정 (3-5 사이)
      rating_base := 3 + floor(random() * 3)::INTEGER;
      
      -- 카테고리별 평점 (베이스 평점 ±1)
      vocal_rating := GREATEST(1, LEAST(5, rating_base + floor(random() * 3 - 1)::INTEGER));
      emotion_rating := GREATEST(1, LEAST(5, rating_base + floor(random() * 3 - 1)::INTEGER));
      arrangement_rating := GREATEST(1, LEAST(5, rating_base + floor(random() * 3 - 1)::INTEGER));
      quality_rating := GREATEST(1, LEAST(5, rating_base + floor(random() * 3 - 1)::INTEGER));
      
      -- 랜덤 리뷰 텍스트 선택
      review_text := review_texts[1 + floor(random() * 10)::INTEGER];
      
      -- 리뷰 삽입 (중복 방지)
      INSERT INTO coversong_reviews (
        user_id,
        video_id,
        overall_rating,
        vocal_rating,
        emotion_rating,
        arrangement_rating,
        quality_rating,
        review_text,
        helpful_count,
        reviewer_level,
        created_at
      ) VALUES (
        user_id,
        video_record.youtube_id,
        rating_base,
        vocal_rating,
        emotion_rating,
        arrangement_rating,
        quality_rating,
        review_text,
        floor(random() * 20)::INTEGER, -- 도움됨 카운트 (0-19)
        CASE 
          WHEN random() < 0.7 THEN 'beginner'
          WHEN random() < 0.9 THEN 'intermediate'
          ELSE 'expert'
        END,
        NOW() - INTERVAL '1 day' * floor(random() * 30)::INTEGER -- 최근 30일 내 랜덤 날짜
      ) ON CONFLICT (user_id, video_id) DO NOTHING;
      
      -- 일부 리뷰에 대해 도움됨 반응 추가 (30% 확률)
      IF random() < 0.3 THEN
        -- 다른 랜덤 사용자가 도움됨 반응
        INSERT INTO coversong_review_reactions (
          user_id,
          review_id,
          reaction_type,
          created_at
        )
        SELECT 
          sample_user_ids[1 + floor(random() * 5)::INTEGER],
          id,
          'helpful',
          NOW() - INTERVAL '1 day' * floor(random() * 15)::INTEGER
        FROM coversong_reviews
        WHERE video_id = video_record.youtube_id
          AND user_id = user_id
        ORDER BY created_at DESC
        LIMIT 1
        ON CONFLICT (user_id, review_id, reaction_type) DO NOTHING;
      END IF;
      
    END LOOP;
  END LOOP;
  
  -- 일부 리뷰에 댓글 추가 (상위 20개 영상에만)
  FOR video_record IN 
    SELECT youtube_id 
    FROM coversong_videos 
    ORDER BY site_score DESC NULLS LAST
    LIMIT 20
  LOOP
    -- 해당 영상의 첫 번째 리뷰에 댓글 추가
    INSERT INTO coversong_review_comments (
      review_id,
      user_id,
      comment_text,
      created_at
    )
    SELECT 
      r.id,
      sample_user_ids[1 + floor(random() * 5)::INTEGER],
      CASE floor(random() * 5)::INTEGER
        WHEN 0 THEN '정말 공감되는 리뷰네요!'
        WHEN 1 THEN '저도 같은 생각입니다. 특히 보컬이 인상적이었어요.'
        WHEN 2 THEN '좋은 평가 감사합니다. 다른 커버도 추천해주세요!'
        WHEN 3 THEN '이 리뷰 덕분에 영상을 보게 되었는데 정말 좋네요.'
        ELSE '자세한 리뷰 감사합니다!'
      END,
      NOW() - INTERVAL '1 day' * floor(random() * 10)::INTEGER
    FROM coversong_reviews r
    WHERE r.video_id = video_record.youtube_id
    ORDER BY r.created_at DESC
    LIMIT 1
    ON CONFLICT DO NOTHING;
  END LOOP;
  
END $$;

-- 리뷰어 통계 업데이트
INSERT INTO coversong_reviewer_stats (user_id, total_reviews, average_rating_given, reviewer_level, trust_score)
SELECT 
  user_id,
  COUNT(*) as total_reviews,
  AVG(overall_rating) as average_rating_given,
  CASE 
    WHEN COUNT(*) >= 10 THEN 'expert'
    WHEN COUNT(*) >= 5 THEN 'intermediate'
    ELSE 'beginner'
  END as reviewer_level,
  50 + (COUNT(*) * 5) + (AVG(overall_rating) * 10) as trust_score
FROM coversong_reviews
GROUP BY user_id
ON CONFLICT (user_id) 
DO UPDATE SET
  total_reviews = EXCLUDED.total_reviews,
  average_rating_given = EXCLUDED.average_rating_given,
  reviewer_level = EXCLUDED.reviewer_level,
  trust_score = EXCLUDED.trust_score,
  updated_at = NOW();

-- 결과 확인
SELECT 
  'Total Reviews Created:' as metric,
  COUNT(*) as count
FROM coversong_reviews
UNION ALL
SELECT 
  'Total Comments Created:',
  COUNT(*)
FROM coversong_review_comments
UNION ALL
SELECT 
  'Total Reactions Created:',
  COUNT(*)
FROM coversong_review_reactions
UNION ALL
SELECT 
  'Videos with Reviews:',
  COUNT(DISTINCT video_id)
FROM coversong_reviews;