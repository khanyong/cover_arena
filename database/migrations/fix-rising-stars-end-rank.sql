-- 신규진입 영상 순위 표시 문제 수정
-- coversong_rising_stars 테이블에 end_rank가 제대로 저장되도록 수정

-- 1. 테이블에 누락된 컬럼 추가 (이미 있으면 무시)
ALTER TABLE coversong_rising_stars 
ADD COLUMN IF NOT EXISTS start_rank INTEGER,
ADD COLUMN IF NOT EXISTS end_rank INTEGER;

-- 2. 기존 함수 삭제
DROP FUNCTION IF EXISTS update_rising_stars(INTEGER);

-- 3. 수정된 함수 생성 (end_rank 포함)
CREATE OR REPLACE FUNCTION update_rising_stars(
  p_competition_id INTEGER
)
RETURNS void AS $$
BEGIN
  -- 일일 급상승 TOP 3
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    rc.video_id,
    rc.competition_id,
    'daily_rising',
    ROW_NUMBER() OVER (ORDER BY rc.rank_change DESC),
    rc.rank_change,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    rc.start_rank,
    rc.end_rank  -- end_rank 추가
  FROM coversong_rank_changes rc
  JOIN coversong_videos v ON v.id = rc.video_id
  WHERE rc.competition_id = p_competition_id
    AND rc.period_type = 'daily'
    AND rc.period_end = CURRENT_DATE
    AND rc.rank_change > 0
    AND NOT rc.is_new_entry
  ORDER BY rc.rank_change DESC
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
  
  -- 주간 급상승 TOP 3
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    rc.video_id,
    rc.competition_id,
    'weekly_rising',
    ROW_NUMBER() OVER (ORDER BY rc.rank_change DESC),
    rc.rank_change,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    rc.start_rank,
    rc.end_rank  -- end_rank 추가
  FROM coversong_rank_changes rc
  JOIN coversong_videos v ON v.id = rc.video_id
  WHERE rc.competition_id = p_competition_id
    AND rc.period_type = 'weekly'
    AND rc.period_end = CURRENT_DATE
    AND rc.rank_change > 0
    AND NOT rc.is_new_entry
  ORDER BY rc.rank_change DESC
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
  
  -- 신규 진입 TOP 3 (중요: end_rank 추가)
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    rc.video_id,
    rc.competition_id,
    'new_entry',
    ROW_NUMBER() OVER (ORDER BY rc.end_rank ASC),
    NULL,  -- 신규진입은 rank_change가 없음
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail,
    NULL,  -- 신규진입은 start_rank가 없음
    rc.end_rank  -- 현재 순위 (중요!)
  FROM coversong_rank_changes rc
  JOIN coversong_videos v ON v.id = rc.video_id
  WHERE rc.competition_id = p_competition_id
    AND rc.period_type = 'daily'
    AND rc.period_end = CURRENT_DATE
    AND rc.is_new_entry = true
  ORDER BY rc.end_rank ASC
  LIMIT 3
  ON CONFLICT (category, rank_position, recorded_date, competition_id)
  DO UPDATE SET
    video_id = EXCLUDED.video_id,
    video_title = EXCLUDED.video_title,
    channel = EXCLUDED.channel,
    thumbnail = EXCLUDED.thumbnail,
    end_rank = EXCLUDED.end_rank;  -- end_rank 업데이트 추가
    
END;
$$ LANGUAGE plpgsql;

-- 4. 권한 부여
GRANT EXECUTE ON FUNCTION update_rising_stars(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION update_rising_stars(INTEGER) TO anon;

-- 5. 현재 데이터 수정 (임시)
-- 현재 활성 대회의 rising_stars 데이터 업데이트
UPDATE coversong_rising_stars rs
SET end_rank = v.rank
FROM coversong_videos v
WHERE rs.video_id = v.id
  AND rs.competition_id = 5  -- 현재 활성 대회 ID
  AND rs.recorded_date = CURRENT_DATE
  AND rs.category = 'new_entry';

-- 6. 확인 쿼리
SELECT 
  rs.category,
  rs.rank_position,
  rs.video_title,
  rs.end_rank as stored_end_rank,
  v.rank as current_rank,
  v.previous_rank
FROM coversong_rising_stars rs
JOIN coversong_videos v ON v.id = rs.video_id
WHERE rs.competition_id = 5
  AND rs.recorded_date = CURRENT_DATE
ORDER BY rs.category, rs.rank_position;

-- 7. 함수 재실행하여 정확한 데이터 생성
SELECT update_rising_stars(5);  -- competition_id = 5