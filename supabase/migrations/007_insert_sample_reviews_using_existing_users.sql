-- 기존 사용자를 활용한 샘플 리뷰 데이터 생성
-- auth.users 테이블의 실제 사용자를 사용합니다

DO $$
DECLARE
  video_record RECORD;
  user_record RECORD;
  existing_users UUID[];
  selected_user_id UUID;
  review_count INTEGER;
  base_rating INTEGER;
  review_id UUID;
  i INTEGER;
  j INTEGER;
  
  -- 리뷰 텍스트 배열
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
    '듣기 편안하고 좋네요. 실력이 느껴지는 커버입니다.',
    '매일 듣고 있어요! 중독성 있는 커버입니다.',
    '여러 커버를 들어봤지만 이게 최고예요!',
    '발성과 호흡이 매우 안정적입니다. 기술적으로 뛰어난 커버네요.',
    '음역대 활용이 훌륭하고 감정 표현도 섬세합니다.',
    '멜로디 라인이 아름답게 표현되었네요.',
    '음악적 해석이 독특하고 매력적입니다.',
    '한국 음악의 매력을 잘 표현한 커버입니다!',
    '감성이 정말 잘 전달되는 커버네요. 눈물이 날 뻔했어요.',
    '음악적 완성도가 높은 커버입니다. 세부적인 표현이 뛰어나네요.',
    '개성있는 해석이 돋보이는 커버입니다.'
  ];
  
  -- 댓글 텍스트 배열
  comment_texts TEXT[] := ARRAY[
    '완전 공감합니다! 저도 같은 생각이에요.',
    '좋은 리뷰 감사합니다. 도움이 많이 되었어요.',
    '정확한 평가네요. 특히 보컬 부분 동의합니다.',
    '이 리뷰 보고 영상 봤는데 정말 좋네요!',
    '자세한 분석 감사합니다. 많이 배웠어요.',
    '저는 조금 다르게 생각하는데, 그래도 좋은 의견이네요.',
    '이런 관점도 있군요! 새로운 시각을 얻었습니다.',
    '리뷰 잘 봤습니다. 다른 커버도 추천해주세요!',
    '전문적인 리뷰네요. 많이 배우고 갑니다.',
    '멋진 리뷰입니다! 👍'
  ];
  
BEGIN
  -- 기존 auth.users에서 사용자 ID 가져오기
  SELECT ARRAY_AGG(id) INTO existing_users
  FROM auth.users
  LIMIT 10; -- 최대 10명의 사용자만 사용
  
  -- 사용자가 없는 경우 종료
  IF existing_users IS NULL OR array_length(existing_users, 1) = 0 THEN
    RAISE NOTICE 'No users found in auth.users table. Please create some users first.';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Found % users to use for sample reviews', array_length(existing_users, 1);
  
  -- 각 영상에 대해 리뷰 생성
  FOR video_record IN 
    SELECT youtube_id, title, channel, site_score
    FROM coversong_videos 
    WHERE site_score IS NOT NULL
    ORDER BY site_score DESC
    LIMIT 100
  LOOP
    -- 점수가 높은 영상일수록 더 많은 리뷰 (1-3개)
    review_count := CASE 
      WHEN video_record.site_score > 50000 THEN 2 + floor(random() * 2)::INTEGER
      WHEN video_record.site_score > 30000 THEN 1 + floor(random() * 2)::INTEGER
      ELSE 1
    END;
    
    -- 사용 가능한 사용자 수보다 많은 리뷰를 요청하지 않도록 제한
    review_count := LEAST(review_count, array_length(existing_users, 1));
    
    -- 점수가 높은 영상일수록 높은 평점 경향
    base_rating := CASE
      WHEN video_record.site_score > 50000 THEN 4
      WHEN video_record.site_score > 30000 THEN 3
      ELSE 3
    END;
    
    -- 리뷰 생성
    FOR i IN 1..review_count LOOP
      -- 사용자 배열에서 랜덤 선택
      selected_user_id := existing_users[1 + floor(random() * array_length(existing_users, 1))::INTEGER];
      
      -- 이미 리뷰를 작성한 사용자는 건너뛰기
      IF EXISTS (
        SELECT 1 FROM coversong_reviews 
        WHERE user_id = selected_user_id 
        AND video_id = video_record.youtube_id
      ) THEN
        CONTINUE;
      END IF;
      
      -- 리뷰 삽입
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
        selected_user_id,
        video_record.youtube_id,
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        review_texts[1 + floor(random() * array_length(review_texts, 1))::INTEGER],
        floor(random() * 20)::INTEGER, -- helpful_count
        CASE 
          WHEN random() < 0.1 THEN 'expert'
          WHEN random() < 0.3 THEN 'intermediate'
          ELSE 'beginner'
        END,
        NOW() - INTERVAL '1 day' * floor(random() * 60)::INTEGER
      ) 
      ON CONFLICT (user_id, video_id) DO NOTHING
      RETURNING id INTO review_id;
      
      -- 일부 리뷰에 반응 추가 (30% 확률)
      IF review_id IS NOT NULL AND random() < 0.3 THEN
        -- 다른 사용자가 도움됨 반응
        FOR j IN 1..LEAST(2, array_length(existing_users, 1) - 1) LOOP
          selected_user_id := existing_users[1 + floor(random() * array_length(existing_users, 1))::INTEGER];
          
          INSERT INTO coversong_review_reactions (
            user_id,
            review_id,
            reaction_type,
            created_at
          ) VALUES (
            selected_user_id,
            review_id,
            CASE 
              WHEN random() < 0.8 THEN 'helpful'
              WHEN random() < 0.95 THEN 'agree'
              ELSE 'disagree'
            END,
            NOW() - INTERVAL '1 day' * floor(random() * 30)::INTEGER
          )
          ON CONFLICT (user_id, review_id, reaction_type) DO NOTHING;
        END LOOP;
      END IF;
      
    END LOOP;
  END LOOP;
  
  -- 상위 영상 일부에 댓글 추가
  FOR video_record IN 
    SELECT youtube_id 
    FROM coversong_videos 
    WHERE site_score IS NOT NULL
    ORDER BY site_score DESC
    LIMIT 20
  LOOP
    -- 각 영상의 리뷰 중 일부에 댓글 추가
    FOR review_id IN 
      SELECT id 
      FROM coversong_reviews 
      WHERE video_id = video_record.youtube_id
      ORDER BY random()
      LIMIT 1
    LOOP
      -- 1개의 댓글 추가
      selected_user_id := existing_users[1 + floor(random() * array_length(existing_users, 1))::INTEGER];
      
      INSERT INTO coversong_review_comments (
        review_id,
        user_id,
        comment_text,
        created_at
      ) VALUES (
        review_id,
        selected_user_id,
        comment_texts[1 + floor(random() * array_length(comment_texts, 1))::INTEGER],
        NOW() - INTERVAL '1 day' * floor(random() * 20)::INTEGER
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Sample reviews created successfully!';
  
END $$;

-- 리뷰어 통계 업데이트
INSERT INTO coversong_reviewer_stats (user_id, total_reviews, average_rating_given, reviewer_level, trust_score, total_helpful_received)
SELECT 
  r.user_id,
  COUNT(DISTINCT r.id) as total_reviews,
  AVG(r.overall_rating) as average_rating_given,
  CASE 
    WHEN COUNT(DISTINCT r.id) >= 10 THEN 'expert'
    WHEN COUNT(DISTINCT r.id) >= 5 THEN 'intermediate'
    ELSE 'beginner'
  END as reviewer_level,
  50 + (COUNT(DISTINCT r.id) * 5) + (AVG(r.overall_rating) * 10) as trust_score,
  COALESCE(SUM(r.helpful_count), 0) as total_helpful_received
FROM coversong_reviews r
GROUP BY r.user_id
ON CONFLICT (user_id) 
DO UPDATE SET
  total_reviews = EXCLUDED.total_reviews,
  average_rating_given = EXCLUDED.average_rating_given,
  reviewer_level = EXCLUDED.reviewer_level,
  trust_score = EXCLUDED.trust_score,
  total_helpful_received = EXCLUDED.total_helpful_received,
  updated_at = NOW();

-- 결과 통계 출력
SELECT 
  '샘플 리뷰 생성 완료!' as status,
  (SELECT COUNT(*) FROM coversong_reviews) as total_reviews,
  (SELECT COUNT(DISTINCT video_id) FROM coversong_reviews) as videos_with_reviews,
  (SELECT COUNT(*) FROM coversong_review_comments) as total_comments,
  (SELECT COUNT(*) FROM coversong_review_reactions) as total_reactions,
  (SELECT ROUND(AVG(overall_rating), 2) FROM coversong_reviews) as avg_rating;

-- 샘플 데이터 확인 (상위 10개 영상의 리뷰 통계)
SELECT 
  v.title,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.overall_rating), 2) as avg_rating,
  STRING_AGG(DISTINCT u.email, ', ') as reviewers
FROM coversong_videos v
LEFT JOIN coversong_reviews r ON v.youtube_id = r.video_id
LEFT JOIN auth.users u ON r.user_id = u.id
WHERE v.site_score IS NOT NULL
GROUP BY v.youtube_id, v.title
ORDER BY v.site_score DESC
LIMIT 10;