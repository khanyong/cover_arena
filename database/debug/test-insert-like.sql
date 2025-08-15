-- 직접 INSERT 테스트

-- 1. 먼저 실제 비디오와 사용자 확인
SELECT id, title FROM coversong_videos LIMIT 3;

-- 2. 실제 사용자 확인 (있다면)
SELECT id, email FROM auth.users LIMIT 3;

-- 3. 실제 competition 확인
SELECT id, topic, status FROM coversong_competitions ORDER BY id DESC LIMIT 3;

-- 4. 테스트 INSERT (실제 값으로 변경 필요)
-- 예시: 실제 video_id, user_id, competition_id로 바꿔서 실행
/*
INSERT INTO coversong_like_history (
    user_id, 
    video_id, 
    competition_id, 
    like_type,
    created_at
) VALUES (
    'YOUR_USER_UUID_HERE',  -- 실제 user UUID
    'ACTUAL_VIDEO_ID_HERE', -- 실제 video ID
    1,                      -- 실제 competition ID
    'arena',
    NOW()
);
*/

-- 5. INSERT 후 확인
SELECT * FROM coversong_like_history ORDER BY created_at DESC LIMIT 5;