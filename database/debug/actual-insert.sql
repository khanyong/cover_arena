-- 실제 값으로 INSERT 실행

-- video ID 확인 (이미 실행했다면 결과를 사용)
SELECT id, title FROM coversong_videos WHERE competition_id = 5 LIMIT 3;

-- 위에서 얻은 video ID를 아래 'VIDEO_ID_HERE' 부분에 넣어서 실행
INSERT INTO coversong_like_history (
    user_id, 
    video_id, 
    competition_id, 
    like_type
) VALUES (
    '117dee3a-6499-48e5-9bb6-020bc6e32507',  -- 실제 user id
    'VIDEO_ID_HERE',                          -- 여기에 실제 video id 넣기
    5,
    'arena'
) RETURNING *;

-- 확인
SELECT * FROM coversong_like_history 
WHERE user_id = '117dee3a-6499-48e5-9bb6-020bc6e32507';