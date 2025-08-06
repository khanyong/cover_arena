-- 순위변동 요약 함수 수정 (데이터 타입 오류 해결)
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 함수 삭제
DROP FUNCTION IF EXISTS get_rank_summary(INTEGER);

-- 2. 새로운 함수 생성 (BIGINT 타입 사용)
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

-- 3. 확인 쿼리
SELECT * FROM get_rank_summary(5); -- 실제 competition_id로 변경하세요

-- 완료 메시지
SELECT '순위변동 요약 함수가 성공적으로 수정되었습니다!' as message; 