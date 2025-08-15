-- 비디오 좋아요 수 확인

-- competition_id = 5인 비디오들의 좋아요 수
SELECT 
    id,
    title,
    arena_likes,
    guest_likes,
    arena_likes + guest_likes as total_likes
FROM coversong_videos
WHERE competition_id = 5
ORDER BY arena_likes DESC
LIMIT 10;