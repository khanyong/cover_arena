-- Fix sample reviews to use actual youtube_id values from coversong_videos table

-- First, delete existing sample reviews (they have wrong video_id values)
DELETE FROM coversong_review_comments WHERE review_id IN (
  SELECT id FROM coversong_reviews WHERE review_text LIKE '%좋네요%' OR review_text LIKE '%감동%'
);

DELETE FROM coversong_review_reactions WHERE review_id IN (
  SELECT id FROM coversong_reviews WHERE review_text LIKE '%좋네요%' OR review_text LIKE '%감동%'
);

DELETE FROM coversong_reviews WHERE review_text LIKE '%좋네요%' OR review_text LIKE '%감동%';

-- Now insert reviews with correct video_id (youtube_id from coversong_videos)
DO $$
DECLARE
  v_record RECORD;
  p_record RECORD;
  new_review_id uuid;
  reviewer_count int := 0;
  review_texts text[] := ARRAY[
    '정말 감동적인 커버입니다. 원곡보다 더 좋아요!',
    '보컬 실력이 대단하네요. 앞으로도 기대됩니다.',
    '편곡이 너무 좋아요. 새로운 느낌이에요.',
    '영상 퀄리티가 정말 좋네요. 프로 같아요!',
    '감정 전달이 완벽해요. 듣는 내내 눈물이...',
    '이런 커버는 처음이에요. 정말 독특하고 좋아요!',
    '목소리가 너무 좋아요. 계속 듣고 싶어요.',
    '와... 정말 실력자시네요. 응원합니다!',
    '원곡을 완전히 새롭게 해석하셨네요. 멋져요!',
    '들을 때마다 감동이에요. 최고의 커버!'
  ];
BEGIN
  -- Get actual youtube_ids from coversong_videos
  FOR v_record IN 
    SELECT youtube_id, title 
    FROM coversong_videos 
    WHERE youtube_id IS NOT NULL
    LIMIT 20
  LOOP
    -- For each video, create 2-3 reviews from different users
    reviewer_count := 0;
    
    FOR p_record IN 
      SELECT id 
      FROM profiles 
      WHERE id NOT IN (
        SELECT user_id FROM coversong_reviews WHERE video_id = v_record.youtube_id
      )
      ORDER BY RANDOM()
      LIMIT 3
    LOOP
      reviewer_count := reviewer_count + 1;
      
      -- Insert review with actual youtube_id as video_id
      INSERT INTO coversong_reviews (
        video_id,
        user_id,
        overall_rating,
        vocal_rating,
        emotion_rating,
        arrangement_rating,
        quality_rating,
        review_text,
        helpful_count,
        created_at,
        updated_at
      ) VALUES (
        v_record.youtube_id,  -- Use actual youtube_id from videos table
        p_record.id,
        3 + FLOOR(RANDOM() * 3)::int,  -- 3-5 rating
        3 + FLOOR(RANDOM() * 3)::int,
        3 + FLOOR(RANDOM() * 3)::int,
        3 + FLOOR(RANDOM() * 3)::int,
        3 + FLOOR(RANDOM() * 3)::int,
        review_texts[1 + FLOOR(RANDOM() * 10)::int] || ' (영상: ' || v_record.title || ')',
        FLOOR(RANDOM() * 20)::int,
        NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30)::int,
        NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30)::int
      ) RETURNING id INTO new_review_id;
      
      -- Add some helpful reactions randomly
      IF RANDOM() > 0.5 THEN
        -- Get a random user to add reaction
        INSERT INTO coversong_review_reactions (
          review_id,
          user_id,
          reaction_type
        )
        SELECT 
          new_review_id,
          id,
          'helpful'
        FROM profiles
        WHERE id != p_record.id
        ORDER BY RANDOM()
        LIMIT FLOOR(RANDOM() * 3)::int;
      END IF;
      
      -- Exit after 2-3 reviews per video
      IF reviewer_count >= 2 + FLOOR(RANDOM() * 2)::int THEN
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Verify the fix
SELECT 
  COUNT(DISTINCT r.video_id) as videos_with_reviews,
  COUNT(*) as total_reviews,
  COUNT(DISTINCT r.user_id) as unique_reviewers
FROM coversong_reviews r
INNER JOIN coversong_videos v ON r.video_id = v.youtube_id;