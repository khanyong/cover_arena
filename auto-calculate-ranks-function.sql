-- === 자동 순위 계산 함수 ===
-- 언제든지 호출하여 현재 데이터로 순위를 재계산할 수 있는 함수

CREATE OR REPLACE FUNCTION calculate_current_ranks(p_competition_id INTEGER)
RETURNS TEXT AS $$
DECLARE
    result_text TEXT;
    total_videos INTEGER;
    zero_site_score INTEGER;
    zero_candidate_score INTEGER;
BEGIN
    -- 1. candidate_score 재계산
    UPDATE coversong_videos 
    SET candidate_score = views + (likes * 100)
    WHERE competition_id = p_competition_id;
    
    -- 2. site_score 재계산
    UPDATE coversong_videos 
    SET site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10)
    WHERE competition_id = p_competition_id;
    
    -- 3. score 필드 설정
    UPDATE coversong_videos 
    SET score = site_score
    WHERE competition_id = p_competition_id;
    
    -- 4. 순위 재계산 (previous_rank는 건드리지 않음)
    WITH ranked_videos AS (
      SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY site_score DESC, candidate_score DESC, views DESC) as new_rank
      FROM coversong_videos 
      WHERE competition_id = p_competition_id
    )
    UPDATE coversong_videos 
    SET rank = ranked_videos.new_rank
    FROM ranked_videos
    WHERE coversong_videos.id = ranked_videos.id;
    
    -- 5. 결과 통계 수집
    SELECT 
      COUNT(*),
      COUNT(CASE WHEN site_score = 0 THEN 1 END),
      COUNT(CASE WHEN candidate_score = 0 THEN 1 END)
    INTO total_videos, zero_site_score, zero_candidate_score
    FROM coversong_videos 
    WHERE competition_id = p_competition_id;
    
    -- 6. 결과 메시지 생성
    result_text := '순위 계산 완료!' || 
                   ' 총 비디오: ' || total_videos || '개' ||
                   ', site_score=0: ' || zero_site_score || '개' ||
                   ', candidate_score=0: ' || zero_candidate_score || '개';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql;

-- 함수 사용 예시:
-- SELECT calculate_current_ranks(5); 