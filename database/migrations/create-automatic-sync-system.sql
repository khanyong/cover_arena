-- 순위 동기화 자동화 시스템 구축
-- 향후 문제가 발생하지 않도록 근본적인 해결책

-- 1. 순위 재계산 함수 생성 (스코어 기반 자동 순위 계산)
CREATE OR REPLACE FUNCTION recalculate_video_ranks(p_competition_id INTEGER)
RETURNS void AS $$
BEGIN
  -- 스코어 기준으로 순위 재계산
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY site_score DESC, 
                 candidate_score DESC, 
                 views DESC,
                 id ASC  -- 동점일 때 일관성을 위해
      ) as new_rank
    FROM coversong_videos
    WHERE competition_id = p_competition_id
  )
  UPDATE coversong_videos v
  SET rank = r.new_rank
  FROM ranked r
  WHERE v.id = r.id
    AND v.competition_id = p_competition_id;
    
  RAISE NOTICE 'Ranks recalculated for competition %', p_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 2. rank_changes 테이블 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_rank_changes_table(p_competition_id INTEGER)
RETURNS void AS $$
BEGIN
  -- 오늘 날짜의 rank_changes 삭제 (재생성을 위해)
  DELETE FROM coversong_rank_changes
  WHERE competition_id = p_competition_id
    AND period_end = CURRENT_DATE;
    
  -- 일일 변경사항 삽입
  INSERT INTO coversong_rank_changes (
    video_id, competition_id, period_type, period_start, period_end,
    start_rank, end_rank, rank_change, is_new_entry
  )
  SELECT 
    v.id,
    v.competition_id,
    'daily',
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE,
    v.previous_rank,
    v.rank,
    CASE 
      WHEN v.previous_rank IS NULL THEN NULL
      ELSE v.previous_rank - v.rank
    END,
    (v.previous_rank IS NULL)
  FROM coversong_videos v
  WHERE v.competition_id = p_competition_id;
  
  RAISE NOTICE 'Rank changes updated for competition %', p_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 3. rising_stars 자동 업데이트 함수 (개선된 버전)
CREATE OR REPLACE FUNCTION update_rising_stars_automatic(p_competition_id INTEGER)
RETURNS void AS $$
BEGIN
  -- 기존 데이터 삭제
  DELETE FROM coversong_rising_stars
  WHERE competition_id = p_competition_id
    AND recorded_date = CURRENT_DATE;
    
  -- 신규 진입 TOP 3 (실제 현재 순위 사용)
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
    NULL,  -- 신규진입은 start_rank가 NULL
    v.rank  -- 실제 현재 순위
  FROM coversong_videos v
  WHERE v.competition_id = p_competition_id
    AND v.previous_rank IS NULL
    AND v.rank <= 100
  ORDER BY v.rank ASC
  LIMIT 3;
  
  -- 일일 급상승 TOP 3 (신규진입 포함)
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail,
    start_rank, end_rank
  )
  SELECT 
    v.id,
    v.competition_id,
    'daily_rising',
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE 
          WHEN v.previous_rank IS NULL THEN 999999  -- 신규진입 최우선
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
    AND (v.previous_rank IS NULL OR v.previous_rank > v.rank)
    AND v.rank <= 100
  ORDER BY 
    CASE 
      WHEN v.previous_rank IS NULL THEN 999999
      ELSE v.previous_rank - v.rank
    END DESC,
    v.rank ASC
  LIMIT 3;
  
  RAISE NOTICE 'Rising stars updated for competition %', p_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 4. 마스터 동기화 함수 (모든 작업을 순서대로 실행)
CREATE OR REPLACE FUNCTION sync_all_rankings(p_competition_id INTEGER DEFAULT NULL)
RETURNS void AS $$
DECLARE
  v_competition_id INTEGER;
BEGIN
  -- competition_id가 지정되지 않으면 활성 대회 찾기
  IF p_competition_id IS NULL THEN
    SELECT id INTO v_competition_id
    FROM competitions
    WHERE is_active = true
    LIMIT 1;
  ELSE
    v_competition_id := p_competition_id;
  END IF;
  
  IF v_competition_id IS NULL THEN
    RAISE EXCEPTION 'No active competition found';
  END IF;
  
  -- 1단계: 순위 재계산
  PERFORM recalculate_video_ranks(v_competition_id);
  
  -- 2단계: rank_changes 업데이트
  PERFORM update_rank_changes_table(v_competition_id);
  
  -- 3단계: rising_stars 업데이트
  PERFORM update_rising_stars_automatic(v_competition_id);
  
  RAISE NOTICE 'All rankings synchronized for competition %', v_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 5. 자동 트리거 생성 (스코어 변경 시 자동 실행)
CREATE OR REPLACE FUNCTION trigger_rank_update()
RETURNS TRIGGER AS $$
BEGIN
  -- 스코어가 변경되면 순위 재계산
  IF (TG_OP = 'UPDATE' AND 
      (OLD.site_score != NEW.site_score OR 
       OLD.candidate_score != NEW.candidate_score OR
       OLD.arena_likes != NEW.arena_likes OR
       OLD.guest_likes != NEW.guest_likes)) THEN
    
    -- 비동기로 처리하기 위해 플래그만 설정
    -- 실제 재계산은 별도 프로세스에서 처리
    UPDATE competitions 
    SET needs_rank_update = true 
    WHERE id = NEW.competition_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_ranks_on_score_change ON coversong_videos;
CREATE TRIGGER update_ranks_on_score_change
AFTER UPDATE ON coversong_videos
FOR EACH ROW
EXECUTE FUNCTION trigger_rank_update();

-- 6. competitions 테이블에 플래그 컬럼 추가
ALTER TABLE competitions 
ADD COLUMN IF NOT EXISTS needs_rank_update BOOLEAN DEFAULT FALSE;

-- 7. 크론잡으로 실행할 함수 (1분마다 실행 권장)
CREATE OR REPLACE FUNCTION process_rank_updates()
RETURNS void AS $$
DECLARE
  comp RECORD;
BEGIN
  -- 업데이트가 필요한 대회 처리
  FOR comp IN 
    SELECT id 
    FROM competitions 
    WHERE needs_rank_update = true
  LOOP
    -- 순위 동기화 실행
    PERFORM sync_all_rankings(comp.id);
    
    -- 플래그 리셋
    UPDATE competitions 
    SET needs_rank_update = false 
    WHERE id = comp.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 8. 권한 부여
GRANT EXECUTE ON FUNCTION recalculate_video_ranks(INTEGER) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION update_rank_changes_table(INTEGER) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION update_rising_stars_automatic(INTEGER) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION sync_all_rankings(INTEGER) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION process_rank_updates() TO authenticated, anon, service_role;

-- 9. 즉시 실행하여 현재 데이터 정리
SELECT sync_all_rankings(5);

-- 10. 검증
SELECT 
  'After Sync' as status,
  rank,
  id,
  title,
  site_score,
  previous_rank,
  CASE 
    WHEN previous_rank IS NULL THEN '신규진입'
    ELSE '기존'
  END as type
FROM coversong_videos
WHERE competition_id = 5
ORDER BY rank
LIMIT 10;

-- 사용 방법:
-- 1. 매일 자동 실행: SELECT sync_all_rankings(5);
-- 2. n8n에서 YouTube 데이터 업데이트 후 실행
-- 3. 사용자가 투표 후 자동 트리거
-- 4. 크론잡으로 1분마다: SELECT process_rank_updates();