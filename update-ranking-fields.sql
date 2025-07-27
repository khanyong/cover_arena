-- 순위변동 추적을 위한 필드 추가 (기존 rank 필드 활용)
-- Supabase SQL Editor에서 실행하세요

-- 1. coversong_videos 테이블에 순위변동 추적 필드 추가
ALTER TABLE coversong_videos 
ADD COLUMN IF NOT EXISTS previous_rank INTEGER,
ADD COLUMN IF NOT EXISTS rank_change INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rank_status TEXT DEFAULT 'new';

-- 2. 기존 rank 필드를 활용한 순위변동 계산 함수 생성
CREATE OR REPLACE FUNCTION update_video_rankings(
  p_competition_id INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_video RECORD;
BEGIN
  -- 순위변동 계산 (기존 rank 필드 활용)
  FOR v_video IN 
    SELECT 
      id,
      rank as current_rank,
      previous_rank
    FROM coversong_videos 
    WHERE competition_id = p_competition_id
  LOOP
    -- 순위변동 계산
    UPDATE coversong_videos SET
      previous_rank = rank,
      rank_change = CASE 
        WHEN previous_rank IS NULL THEN NULL -- 신규
        WHEN previous_rank < rank THEN previous_rank - rank -- 하락 (음수)
        WHEN previous_rank > rank THEN previous_rank - rank -- 상승 (양수)
        ELSE 0 -- 변화없음
      END,
      rank_status = CASE 
        WHEN previous_rank IS NULL THEN 'new'
        WHEN previous_rank < rank THEN 'down'
        WHEN previous_rank > rank THEN 'up'
        ELSE 'same'
      END,
      updated_at = NOW()
    WHERE id = v_video.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 3. 순위변동 요약 조회 함수 생성
CREATE OR REPLACE FUNCTION get_ranking_summary(
  p_competition_id INTEGER
)
RETURNS TABLE (
  new_count INTEGER,
  up_count INTEGER,
  down_count INTEGER,
  same_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE rank_status = 'new') as new_count,
    COUNT(*) FILTER (WHERE rank_status = 'up') as up_count,
    COUNT(*) FILTER (WHERE rank_status = 'down') as down_count,
    COUNT(*) FILTER (WHERE rank_status = 'same') as same_count
  FROM coversong_videos 
  WHERE competition_id = p_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 4. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_videos_rank_status ON coversong_videos(rank_status);
CREATE INDEX IF NOT EXISTS idx_videos_rank_change ON coversong_videos(rank_change);
CREATE INDEX IF NOT EXISTS idx_videos_previous_rank ON coversong_videos(previous_rank);

-- 5. 순위 업데이트 시 자동 순위변동 계산 트리거
CREATE OR REPLACE FUNCTION trigger_update_rank_change()
RETURNS TRIGGER AS $$
BEGIN
  -- 순위가 변경되었을 때만 순위변동 계산
  IF OLD.rank IS DISTINCT FROM NEW.rank THEN
    NEW.previous_rank := OLD.rank;
    NEW.rank_change := CASE 
      WHEN OLD.rank IS NULL THEN NULL -- 신규
      WHEN OLD.rank < NEW.rank THEN OLD.rank - NEW.rank -- 하락 (음수)
      WHEN OLD.rank > NEW.rank THEN OLD.rank - NEW.rank -- 상승 (양수)
      ELSE 0 -- 변화없음
    END;
    NEW.rank_status := CASE 
      WHEN OLD.rank IS NULL THEN 'new'
      WHEN OLD.rank < NEW.rank THEN 'down'
      WHEN OLD.rank > NEW.rank THEN 'up'
      ELSE 'same'
    END;
    -- updated_at은 기본 트리거에서 자동 업데이트됨
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS trigger_video_rank_change ON coversong_videos;
CREATE TRIGGER trigger_video_rank_change
  BEFORE UPDATE ON coversong_videos
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_rank_change();

-- 6. 확인 쿼리
SELECT 
  'coversong_videos' as table_name,
  COUNT(*) as total_videos,
  COUNT(*) FILTER (WHERE rank IS NOT NULL) as ranked_videos,
  COUNT(*) FILTER (WHERE rank_status = 'new') as new_videos,
  COUNT(*) FILTER (WHERE rank_status = 'up') as up_videos,
  COUNT(*) FILTER (WHERE rank_status = 'down') as down_videos,
  COUNT(*) FILTER (WHERE rank_status = 'same') as same_videos
FROM coversong_videos;

-- 완료 메시지
SELECT '순위변동 추적 필드가 성공적으로 추가되었습니다! (기존 필드 활용)' as message; 