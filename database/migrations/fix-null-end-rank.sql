-- end_rank NULL 문제 즉시 수정

-- 1. 현재 NULL 상태 확인
SELECT 
  category,
  rank_position,
  video_id,
  video_title,
  end_rank,
  start_rank
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = '2025-08-06'
ORDER BY category, rank_position;

-- 2. coversong_videos 테이블과 조인하여 실제 순위 확인
SELECT 
  rs.category,
  rs.rank_position,
  rs.video_id,
  rs.video_title as rising_title,
  v.title as current_title,
  v.rank as actual_rank,
  rs.end_rank as stored_end_rank
FROM coversong_rising_stars rs
LEFT JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
ORDER BY rs.category, rs.rank_position;

-- 3. end_rank를 실제 현재 순위로 업데이트
UPDATE coversong_rising_stars rs
SET end_rank = v.rank
FROM coversong_videos v
WHERE rs.video_id = v.id
  AND rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.end_rank IS NULL;

-- 4. 업데이트 결과 확인
SELECT 
  category,
  rank_position,
  video_id,
  video_title,
  end_rank,
  CASE 
    WHEN category = 'new_entry' THEN
      CASE rank_position
        WHEN 1 THEN 'Should show "현재 1위"'
        WHEN 2 THEN 'Should show "현재 2위"'
        WHEN 3 THEN 'Should show "현재 3위"'
      END
    ELSE 'Should show current rank: ' || end_rank || '위'
  END as expected_display
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date = '2025-08-06'
ORDER BY category, rank_position;

-- 5. 특히 신규진입 영상들의 실제 순위 확인
SELECT 
  rs.rank_position as "신규진입 순위",
  rs.video_title as "영상 제목",
  v.rank as "실제 전체 순위",
  rs.end_rank as "저장된 순위"
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.recorded_date = '2025-08-06'
  AND rs.category = 'new_entry'
ORDER BY rs.rank_position;

-- 6. 함수 재생성 (video_id 매칭 문제 해결)
CREATE OR REPLACE FUNCTION update_rising_stars(
  p_competition_id INTEGER
)
RETURNS void AS $$
BEGIN
  -- 먼저 기존 데이터 삭제 (당일 데이터)
  DELETE FROM coversong_rising_stars
  WHERE competition_id = p_competition_id
    AND recorded_date = CURRENT_DATE;

  -- 신규 진입 TOP 3
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    v.id,
    v.competition_id,
    'new_entry',
    ROW_NUMBER() OVER (ORDER BY v.rank ASC),
    NULL,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    NULL,
    v.rank  -- 실제 현재 순위
  FROM coversong_videos v
  WHERE v.competition_id = p_competition_id
    AND v.previous_rank IS NULL
    AND v.rank <= 100
  ORDER BY v.rank ASC
  LIMIT 3;

  -- 일일 급상승 TOP 3 (신규 진입 포함)
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    v.id,
    v.competition_id,
    'daily_rising',
    ROW_NUMBER() OVER (ORDER BY 
      CASE 
        WHEN v.previous_rank IS NULL THEN 1000
        ELSE v.previous_rank - v.rank
      END DESC,
      v.rank ASC
    ),
    CASE 
      WHEN v.previous_rank IS NULL THEN NULL
      ELSE v.previous_rank - v.rank
    END,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    v.previous_rank,
    v.rank
  FROM coversong_videos v
  WHERE v.competition_id = p_competition_id
    AND v.rank <= 100
    AND (v.previous_rank IS NULL OR v.previous_rank > v.rank)
  ORDER BY 
    CASE 
      WHEN v.previous_rank IS NULL THEN 1000
      ELSE v.previous_rank - v.rank
    END DESC,
    v.rank ASC
  LIMIT 3;

  -- 주간은 일단 생략 (필요시 추가)
  
END;
$$ LANGUAGE plpgsql;

-- 7. 함수 재실행
SELECT update_rising_stars(5);

-- 8. 최종 확인
SELECT 
  category,
  rank_position,
  video_title,
  end_rank as "현재 순위",
  CASE 
    WHEN category = 'new_entry' THEN '신규진입 ' || rank_position || '위 (전체 ' || end_rank || '위)'
    WHEN category = 'daily_rising' THEN '일일 급상승 ' || rank_position || '위 (전체 ' || end_rank || '위)'
    ELSE category
  END as display_text
FROM coversong_rising_stars
WHERE competition_id = 5
  AND recorded_date >= CURRENT_DATE
ORDER BY category, rank_position;