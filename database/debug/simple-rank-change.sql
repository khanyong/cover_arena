-- 가장 간단한 순위변동 추적 (previous_rank 필드만 추가)
-- Supabase SQL Editor에서 실행하세요

-- 1. previous_rank 필드만 추가
ALTER TABLE coversong_videos 
ADD COLUMN IF NOT EXISTS previous_rank INTEGER;

-- 2. 순위변동 계산 함수 (간단한 버전)
CREATE OR REPLACE FUNCTION calculate_rank_changes(
  p_competition_id INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- 이전 순위를 현재 순위로 저장
  UPDATE coversong_videos 
  SET previous_rank = rank
  WHERE competition_id = p_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 3. 순위변동 요약 조회 함수 (데이터 타입 수정)
CREATE OR REPLACE FUNCTION get_rank_summary(
  p_competition_id INTEGER
)
RETURNS TABLE (
  new_count BIGINT,
  up_count BIGINT,
  down_count BIGINT,
  same_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE previous_rank IS NULL) as new_count,
    COUNT(*) FILTER (WHERE previous_rank > rank) as up_count,
    COUNT(*) FILTER (WHERE previous_rank < rank) as down_count,
    COUNT(*) FILTER (WHERE previous_rank = rank) as same_count
  FROM coversong_videos 
  WHERE competition_id = p_competition_id;
END;
$$ LANGUAGE plpgsql;

-- 완료 메시지
SELECT '간단한 순위변동 추적이 설정되었습니다!' as message; 