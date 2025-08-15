-- 중복 투표 확인

-- 1. 전체 투표 수 확인
SELECT COUNT(*) as total_votes FROM coversong_like_history;

-- 2. 특정 사용자의 투표 기록 확인
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

-- 3. 중복 투표 확인 (같은 사용자가 같은 비디오에 여러 번 투표)
SELECT 
    user_id,
    video_id,
    competition_id,
    COUNT(*) as vote_count
FROM coversong_like_history
GROUP BY user_id, video_id, competition_id
HAVING COUNT(*) > 1;

-- 4. 특정 비디오의 좋아요 수 확인
SELECT 
    id,
    title,
    arena_likes,
    guest_likes,
    arena_likes + guest_likes as total_likes
FROM coversong_videos
WHERE id = '2FS3JAPTKXs';