-- 초기 순위 히스토리 데이터 생성 스크립트
-- 현재 활성 competition의 영상들에 대해 오늘의 순위를 기록합니다

-- 1. 오늘의 순위 기록
DO $$
DECLARE
  v_competition_id INTEGER;
BEGIN
  -- 현재 활성 competition 찾기
  SELECT id INTO v_competition_id
  FROM coversong_competitions
  WHERE status = 'active'
  LIMIT 1;
  
  IF v_competition_id IS NOT NULL THEN
    -- 오늘의 순위 기록
    INSERT INTO coversong_rank_history (
      video_id, competition_id, rank, site_score, 
      arena_likes, youtube_likes, recorded_date
    )
    SELECT 
      v.id,
      v.competition_id,
      ROW_NUMBER() OVER (ORDER BY v.site_score DESC NULLS LAST, v.arena_likes DESC) as rank,
      v.site_score,
      v.arena_likes,
      v.likes as youtube_likes,
      CURRENT_DATE
    FROM coversong_videos v
    WHERE v.competition_id = v_competition_id
    ON CONFLICT (video_id, competition_id, recorded_date) 
    DO UPDATE SET
      rank = EXCLUDED.rank,
      site_score = EXCLUDED.site_score,
      arena_likes = EXCLUDED.arena_likes,
      youtube_likes = EXCLUDED.youtube_likes;
    
    RAISE NOTICE '오늘의 순위 기록 완료: competition_id = %', v_competition_id;
  ELSE
    RAISE NOTICE '활성 competition이 없습니다.';
  END IF;
END $$;

-- 2. 어제 데이터 생성 (테스트용 - 순위 변동을 보기 위해)
-- 실제 운영 시에는 이 부분을 제거하거나 주석 처리하세요
DO $$
DECLARE
  v_competition_id INTEGER;
BEGIN
  -- 현재 활성 competition 찾기
  SELECT id INTO v_competition_id
  FROM coversong_competitions
  WHERE status = 'active'
  LIMIT 1;
  
  IF v_competition_id IS NOT NULL THEN
    -- 어제의 순위 기록 (약간의 변동을 주어 테스트)
    INSERT INTO coversong_rank_history (
      video_id, competition_id, rank, site_score, 
      arena_likes, youtube_likes, recorded_date
    )
    SELECT 
      v.id,
      v.competition_id,
      -- 랜덤하게 순위 변동 추가
      ROW_NUMBER() OVER (ORDER BY v.site_score DESC NULLS LAST, v.arena_likes DESC) + 
        FLOOR(RANDOM() * 5 - 2)::INTEGER as rank,
      v.site_score - (RANDOM() * 10),
      v.arena_likes - FLOOR(RANDOM() * 5)::INTEGER,
      v.likes as youtube_likes,
      CURRENT_DATE - INTERVAL '1 day'
    FROM coversong_videos v
    WHERE v.competition_id = v_competition_id
    LIMIT 95  -- 어제는 95개만 있었다고 가정 (신규 진입 테스트)
    ON CONFLICT (video_id, competition_id, recorded_date) 
    DO UPDATE SET
      rank = EXCLUDED.rank,
      site_score = EXCLUDED.site_score,
      arena_likes = EXCLUDED.arena_likes,
      youtube_likes = EXCLUDED.youtube_likes;
    
    RAISE NOTICE '어제의 순위 기록 완료 (테스트 데이터)';
  END IF;
END $$;

-- 3. 일일 순위 변동 계산
DO $$
DECLARE
  v_competition_id INTEGER;
BEGIN
  -- 현재 활성 competition 찾기
  SELECT id INTO v_competition_id
  FROM coversong_competitions
  WHERE status = 'active'
  LIMIT 1;
  
  IF v_competition_id IS NOT NULL THEN
    -- calculate_rank_changes 함수 호출
    PERFORM calculate_rank_changes(v_competition_id, 'daily', 1);
    RAISE NOTICE '일일 순위 변동 계산 완료';
  END IF;
END $$;

-- 4. 급상승 영상 선정
DO $$
DECLARE
  v_competition_id INTEGER;
BEGIN
  -- 현재 활성 competition 찾기
  SELECT id INTO v_competition_id
  FROM coversong_competitions
  WHERE status = 'active'
  LIMIT 1;
  
  IF v_competition_id IS NOT NULL THEN
    -- select_rising_stars 함수 호출
    PERFORM select_rising_stars(v_competition_id);
    RAISE NOTICE '급상승 영상 선정 완료';
  END IF;
END $$;

-- 5. 결과 확인
SELECT 
  'rank_history' as table_name,
  COUNT(*) as record_count
FROM coversong_rank_history
WHERE recorded_date >= CURRENT_DATE - INTERVAL '1 day'

UNION ALL

SELECT 
  'rank_changes' as table_name,
  COUNT(*) as record_count
FROM coversong_rank_changes
WHERE period_end = CURRENT_DATE

UNION ALL

SELECT 
  'rising_stars' as table_name,
  COUNT(*) as record_count
FROM coversong_rising_stars
WHERE recorded_date = CURRENT_DATE;