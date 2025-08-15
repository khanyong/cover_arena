-- 사용자 투표 기록 확인

-- 1. 해당 사용자의 모든 투표 확인
SELECT 
    lh.id,
    lh.user_id,
    lh.video_id,
    lh.competition_id,
    lh.created_at,
    v.title
FROM coversong_like_history lh
LEFT JOIN coversong_videos v ON lh.video_id = v.id
WHERE lh.user_id = '117dee3a-6499-48e5-9bb6-020bc6e32507'
ORDER BY lh.created_at DESC;

-- 2. 중복 투표 확인 (같은 비디오에 여러 번 투표)
SELECT 
    video_id,
    COUNT(*) as vote_count,
    MIN(created_at) as first_vote,
    MAX(created_at) as last_vote
FROM coversong_like_history
WHERE user_id = '117dee3a-6499-48e5-9bb6-020bc6e32507'
GROUP BY video_id
HAVING COUNT(*) > 1;

-- 3. 전체 투표 수
SELECT COUNT(*) as total_votes 
FROM coversong_like_history
WHERE user_id = '117dee3a-6499-48e5-9bb6-020bc6e32507';