-- 즉시 실행용 SQL - 신규진입 영상 순위 수정
-- 현재 잘못된 end_rank 값을 즉시 수정

-- 1. 현재 상황 확인
SELECT 
  'BEFORE FIX' as status,
  rs.category,
  rs.rank_position,
  rs.video_title,
  rs.end_rank as stored_end_rank,
  v.rank as actual_current_rank,
  rs.video_id
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.category = 'new_entry'
  AND rs.recorded_date >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY rs.rank_position;

-- 2. end_rank 값을 실제 현재 순위로 즉시 업데이트
UPDATE coversong_rising_stars rs
SET end_rank = v.rank
FROM coversong_videos v
WHERE rs.video_id = v.id
  AND rs.competition_id = 5
  AND rs.recorded_date >= CURRENT_DATE - INTERVAL '1 day';

-- 3. 수정 후 확인
SELECT 
  'AFTER FIX' as status,
  rs.category,
  rs.rank_position,
  rs.video_title,
  rs.end_rank as stored_end_rank,
  v.rank as actual_current_rank,
  CASE 
    WHEN rs.end_rank = v.rank THEN '✅ FIXED'
    ELSE '❌ MISMATCH'
  END as check_result
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.category = 'new_entry'
  AND rs.recorded_date >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY rs.rank_position;

-- 4. 추가로 rank_changes 테이블도 확인 및 수정
UPDATE coversong_rank_changes rc
SET end_rank = v.rank
FROM coversong_videos v
WHERE rc.video_id = v.id
  AND rc.competition_id = 5
  AND rc.period_end >= CURRENT_DATE - INTERVAL '1 day'
  AND rc.is_new_entry = true;

-- 5. 함수도 즉시 수정 (기존 함수 대체)
CREATE OR REPLACE FUNCTION update_rising_stars(
  p_competition_id INTEGER
)
RETURNS void AS $$
BEGIN
  -- 신규 진입 TOP 3 (v.rank 직접 사용)
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    v.id as video_id,
    v.competition_id,
    'new_entry',
    ROW_NUMBER() OVER (ORDER BY v.rank ASC),
    NULL,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    NULL,
    v.rank  -- 직접 현재 순위 사용
  FROM coversong_videos v
  WHERE v.competition_id = p_competition_id
    AND v.previous_rank IS NULL  -- 신규진입 조건
    AND v.rank <= 100  -- 상위 100위 이내
  ORDER BY v.rank ASC
  LIMIT 3
  ON CONFLICT (category, rank_position, recorded_date, competition_id)
  DO UPDATE SET
    video_id = EXCLUDED.video_id,
    video_title = EXCLUDED.video_title,
    channel = EXCLUDED.channel,
    thumbnail = EXCLUDED.thumbnail,
    end_rank = EXCLUDED.end_rank;
    
  -- 일일 급상승 TOP 3 (기존 영상 중 순위 상승)
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    v.id as video_id,
    v.competition_id,
    'daily_rising',
    ROW_NUMBER() OVER (ORDER BY 
      CASE 
        WHEN v.previous_rank IS NULL THEN 999999
        WHEN v.previous_rank > v.rank THEN v.previous_rank - v.rank
        ELSE 0
      END DESC,
      v.rank ASC
    ),
    CASE 
      WHEN v.previous_rank IS NULL THEN NULL
      WHEN v.previous_rank > v.rank THEN v.previous_rank - v.rank
      ELSE 0
    END as rank_change,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    v.previous_rank,
    v.rank
  FROM coversong_videos v
  WHERE v.competition_id = p_competition_id
    AND v.rank <= 100
    AND (v.previous_rank IS NULL OR v.previous_rank > v.rank)  -- 신규 또는 순위 상승
  ORDER BY 
    CASE 
      WHEN v.previous_rank IS NULL THEN 999999
      WHEN v.previous_rank > v.rank THEN v.previous_rank - v.rank
      ELSE 0
    END DESC,
    v.rank ASC
  LIMIT 3
  ON CONFLICT (category, rank_position, recorded_date, competition_id)
  DO UPDATE SET
    video_id = EXCLUDED.video_id,
    rank_change = EXCLUDED.rank_change,
    video_title = EXCLUDED.video_title,
    channel = EXCLUDED.channel,
    thumbnail = EXCLUDED.thumbnail,
    start_rank = EXCLUDED.start_rank,
    end_rank = EXCLUDED.end_rank;
    
END;
$$ LANGUAGE plpgsql;

-- 6. 함수 재실행
SELECT update_rising_stars(5);

-- 7. 최종 확인
SELECT 
  'FINAL CHECK' as status,
  category,
  rank_position,
  video_title,
  end_rank,
  CASE 
    WHEN category = 'new_entry' AND rank_position = 1 THEN 'Should be rank 1'
    WHEN category = 'new_entry' AND rank_position = 2 THEN 'Should be rank 2 or lower'
    ELSE 'Check manually'
  END as expected
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY category, rank_position;