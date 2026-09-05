-- 실제 사용자를 활용한 샘플 리뷰 데이터 생성
-- 기존 사용자가 있다면 그들을 활용하고, 없다면 테스트 사용자를 생성

-- 먼저 테스트용 사용자 생성 (auth.users에 직접 삽입할 수 없으므로 별도 테이블 사용)
CREATE TABLE IF NOT EXISTS sample_review_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 샘플 사용자 데이터 삽입
INSERT INTO sample_review_users (email, display_name) VALUES
  ('music_lover_01@example.com', '음악애호가'),
  ('vocal_expert@example.com', '보컬전문가'),
  ('cover_fan_kr@example.com', '커버팬'),
  ('melody_seeker@example.com', '멜로디시커'),
  ('harmony_lover@example.com', '하모니러버'),
  ('kpop_enthusiast@example.com', 'K팝매니아'),
  ('ballad_lover@example.com', '발라드러버'),
  ('music_critic@example.com', '음악평론가'),
  ('indie_fan@example.com', '인디팬'),
  ('vocal_coach@example.com', '보컬코치')
ON CONFLICT (email) DO NOTHING;

-- 샘플 리뷰 생성 함수
CREATE OR REPLACE FUNCTION generate_sample_reviews()
RETURNS void AS $$
DECLARE
  video_record RECORD;
  user_record RECORD;
  review_count INTEGER;
  rating_variance DECIMAL;
  base_rating INTEGER;
  review_id UUID;
BEGIN
  -- 각 영상에 대해 리뷰 생성
  FOR video_record IN 
    SELECT youtube_id, title, channel, site_score
    FROM coversong_videos 
    WHERE site_score IS NOT NULL
    ORDER BY site_score DESC
    LIMIT 100
  LOOP
    -- 점수가 높은 영상일수록 더 많은 리뷰 (1-5개)
    review_count := CASE 
      WHEN video_record.site_score > 50000 THEN 3 + floor(random() * 3)::INTEGER
      WHEN video_record.site_score > 30000 THEN 2 + floor(random() * 3)::INTEGER
      ELSE 1 + floor(random() * 2)::INTEGER
    END;
    
    -- 점수가 높은 영상일수록 높은 평점 경향
    base_rating := CASE
      WHEN video_record.site_score > 50000 THEN 4
      WHEN video_record.site_score > 30000 THEN 3
      ELSE 3
    END;
    
    -- 리뷰 생성
    FOR i IN 1..review_count LOOP
      -- 랜덤 사용자 선택
      SELECT * INTO user_record
      FROM sample_review_users
      ORDER BY random()
      LIMIT 1;
      
      -- 평점 변동성 추가 (±1)
      rating_variance := random();
      
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
        user_record.id,
        video_record.youtube_id,
        GREATEST(1, LEAST(5, base_rating + CASE 
          WHEN rating_variance < 0.2 THEN -1
          WHEN rating_variance > 0.8 THEN 1
          ELSE 0
        END)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        GREATEST(1, LEAST(5, base_rating + floor(random() * 3 - 1)::INTEGER)),
        CASE user_record.display_name
          WHEN '음악애호가' THEN 
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '이 커버는 정말 듣기 좋네요. 원곡의 매력을 잘 살렸습니다.'
              WHEN 1 THEN '매일 듣고 있어요! 중독성 있는 커버입니다.'
              ELSE '음악을 사랑하는 사람으로서 이런 커버를 들을 수 있어 행복합니다.'
            END
          WHEN '보컬전문가' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '발성과 호흡이 매우 안정적입니다. 기술적으로 뛰어난 커버네요.'
              WHEN 1 THEN '음역대 활용이 훌륭하고 감정 표현도 섬세합니다.'
              ELSE '보컬 테크닉이 인상적입니다. 특히 고음 처리가 깔끔하네요.'
            END
          WHEN '커버팬' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '여러 커버를 들어봤지만 이게 최고예요!'
              WHEN 1 THEN '원곡보다 더 좋은 것 같아요. 자주 들을게요!'
              ELSE '커버 영상 마니아인데 이건 꼭 들어보세요!'
            END
          WHEN '멜로디시커' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '멜로디 라인이 아름답게 표현되었네요.'
              WHEN 1 THEN '음악적 해석이 독특하고 매력적입니다.'
              ELSE '선율이 귀에 착착 감기네요. 좋은 커버입니다.'
            END
          WHEN '하모니러버' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '화음 처리가 정말 아름답습니다.'
              WHEN 1 THEN '편곡이 원곡과 달라서 신선해요. 하모니가 풍성합니다.'
              ELSE '음악적 조화가 뛰어난 커버네요.'
            END
          WHEN 'K팝매니아' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '한국 음악의 매력을 잘 표현한 커버입니다!'
              WHEN 1 THEN 'K-POP 커버 중 최고예요! 완벽합니다.'
              ELSE '이런 퀄리티의 K-POP 커버는 처음이에요!'
            END
          WHEN '발라드러버' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '감성이 정말 잘 전달되는 커버네요. 눈물이 날 뻔했어요.'
              WHEN 1 THEN '발라드의 정석을 보여주는 커버입니다.'
              ELSE '감정선이 완벽해요. 몰입해서 들었습니다.'
            END
          WHEN '음악평론가' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '음악적 완성도가 높은 커버입니다. 세부적인 표현이 뛰어나네요.'
              WHEN 1 THEN '장르의 특성을 잘 이해하고 재해석한 수준 높은 커버입니다.'
              ELSE '기술적, 예술적 측면 모두 균형잡힌 훌륭한 작품입니다.'
            END
          WHEN '인디팬' THEN
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '독립적인 색깔이 느껴지는 매력적인 커버네요.'
              WHEN 1 THEN '상업적이지 않고 진정성이 느껴집니다.'
              ELSE '개성있는 해석이 돋보이는 커버입니다.'
            END
          ELSE
            CASE floor(random() * 3)::INTEGER
              WHEN 0 THEN '프로페셔널한 보컬 코칭이 느껴지는 커버입니다.'
              WHEN 1 THEN '발성과 딕션이 완벽합니다. 교과서적인 커버네요.'
              ELSE '보컬 기술의 정수를 보여주는 커버입니다.'
            END
        END,
        floor(random() * 30)::INTEGER, -- helpful_count
        CASE 
          WHEN user_record.display_name IN ('보컬전문가', '음악평론가', '보컬코치') THEN 'expert'
          WHEN random() < 0.3 THEN 'intermediate'
          ELSE 'beginner'
        END,
        NOW() - INTERVAL '1 day' * floor(random() * 60)::INTEGER - INTERVAL '1 hour' * floor(random() * 24)::INTEGER
      ) 
      ON CONFLICT (user_id, video_id) DO NOTHING
      RETURNING id INTO review_id;
      
      -- 일부 리뷰에 반응 추가 (40% 확률)
      IF review_id IS NOT NULL AND random() < 0.4 THEN
        -- 1-3개의 도움됨 반응 추가
        FOR j IN 1..(1 + floor(random() * 3)::INTEGER) LOOP
          INSERT INTO coversong_review_reactions (
            user_id,
            review_id,
            reaction_type,
            created_at
          )
          SELECT 
            id,
            review_id,
            CASE 
              WHEN random() < 0.7 THEN 'helpful'
              WHEN random() < 0.9 THEN 'agree'
              ELSE 'expert'
            END,
            NOW() - INTERVAL '1 day' * floor(random() * 30)::INTEGER
          FROM sample_review_users
          WHERE id != user_record.id
          ORDER BY random()
          LIMIT 1
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
    LIMIT 30
  LOOP
    -- 각 영상의 리뷰 중 일부에 댓글 추가
    FOR review_id IN 
      SELECT id 
      FROM coversong_reviews 
      WHERE video_id = video_record.youtube_id
      ORDER BY random()
      LIMIT 2
    LOOP
      -- 1-2개의 댓글 추가
      FOR i IN 1..(1 + floor(random() * 2)::INTEGER) LOOP
        SELECT * INTO user_record
        FROM sample_review_users
        ORDER BY random()
        LIMIT 1;
        
        INSERT INTO coversong_review_comments (
          review_id,
          user_id,
          comment_text,
          created_at
        ) VALUES (
          review_id,
          user_record.id,
          CASE floor(random() * 10)::INTEGER
            WHEN 0 THEN '완전 공감합니다! 저도 같은 생각이에요.'
            WHEN 1 THEN '좋은 리뷰 감사합니다. 도움이 많이 되었어요.'
            WHEN 2 THEN '정확한 평가네요. 특히 보컬 부분 동의합니다.'
            WHEN 3 THEN '이 리뷰 보고 영상 봤는데 정말 좋네요!'
            WHEN 4 THEN '자세한 분석 감사합니다. 많이 배웠어요.'
            WHEN 5 THEN '저는 조금 다르게 생각하는데, 그래도 좋은 의견이네요.'
            WHEN 6 THEN '이런 관점도 있군요! 새로운 시각을 얻었습니다.'
            WHEN 7 THEN '리뷰 잘 봤습니다. 다른 커버도 추천해주세요!'
            WHEN 8 THEN '전문적인 리뷰네요. 많이 배우고 갑니다.'
            ELSE '멋진 리뷰입니다! 👍'
          END,
          NOW() - INTERVAL '1 day' * floor(random() * 20)::INTEGER
        )
        ON CONFLICT DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
  
END;
$$ LANGUAGE plpgsql;

-- 함수 실행
SELECT generate_sample_reviews();

-- 리뷰어 통계 업데이트
INSERT INTO coversong_reviewer_stats (user_id, total_reviews, average_rating_given, reviewer_level, trust_score, total_helpful_received)
SELECT 
  r.user_id,
  COUNT(DISTINCT r.id) as total_reviews,
  AVG(r.overall_rating) as average_rating_given,
  CASE 
    WHEN COUNT(DISTINCT r.id) >= 20 THEN 'expert'
    WHEN COUNT(DISTINCT r.id) >= 10 THEN 'intermediate'
    ELSE 'beginner'
  END as reviewer_level,
  50 + (COUNT(DISTINCT r.id) * 5) + (AVG(r.overall_rating) * 10) + COALESCE(SUM(r.helpful_count), 0) as trust_score,
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
  '생성 완료!' as status,
  (SELECT COUNT(*) FROM coversong_reviews) as total_reviews,
  (SELECT COUNT(DISTINCT video_id) FROM coversong_reviews) as videos_with_reviews,
  (SELECT COUNT(*) FROM coversong_review_comments) as total_comments,
  (SELECT COUNT(*) FROM coversong_review_reactions) as total_reactions,
  (SELECT ROUND(AVG(overall_rating), 2) FROM coversong_reviews) as avg_rating;

-- 샘플 데이터 확인 (상위 10개 영상의 리뷰 통계)
SELECT 
  v.title,
  v.channel,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.overall_rating), 2) as avg_rating,
  SUM(r.helpful_count) as total_helpful
FROM coversong_videos v
LEFT JOIN coversong_reviews r ON v.youtube_id = r.video_id
WHERE v.site_score IS NOT NULL
GROUP BY v.youtube_id, v.title, v.channel
ORDER BY v.site_score DESC
LIMIT 10;