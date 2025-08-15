-- coversong_like_history 테이블 테스트

-- 1. 현재 정책 확인
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'coversong_like_history';

-- 2. 테이블에 있는 데이터 확인
SELECT COUNT(*) as total_likes FROM coversong_like_history;

-- 3. 최근 5개 투표 기록 확인
SELECT 
    lh.id,
    lh.user_id,
    lh.video_id,
    lh.competition_id,
    lh.like_type,
    lh.created_at
FROM coversong_like_history lh
ORDER BY lh.created_at DESC
LIMIT 5;

-- 4. 테스트 삽입 (실제 video_id와 competition_id로 변경 필요)
-- INSERT INTO coversong_like_history (user_id, video_id, competition_id, like_type)
-- VALUES ('your-user-uuid', 'video-id', 1, 'arena');

-- 5. 중복 체크 확인 (특정 사용자의 중복 투표)
SELECT 
    user_id,
    video_id,
    COUNT(*) as vote_count
FROM coversong_like_history
WHERE like_type = 'arena'
GROUP BY user_id, video_id
HAVING COUNT(*) > 1;