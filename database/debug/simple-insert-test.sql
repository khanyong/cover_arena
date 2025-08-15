-- 간단한 INSERT 테스트

-- 1. 실제 비디오 ID 확인 (competition_id = 5)
SELECT id, title FROM coversong_videos WHERE competition_id = 5 LIMIT 1;

-- 2. 실제 사용자 ID 확인
SELECT id, email FROM auth.users LIMIT 1;

-- 3. 위에서 얻은 ID로 직접 INSERT
-- 아래 VALUES 부분의 'USER_ID_HERE'와 'VIDEO_ID_HERE'를 
-- 위에서 조회한 실제 값으로 바꿔서 실행하세요

INSERT INTO coversong_like_history (
    user_id, 
    video_id, 
    competition_id, 
    like_type
) VALUES (
    'USER_ID_HERE',  -- 실제 user id로 변경
    'VIDEO_ID_HERE', -- 실제 video id로 변경
    5,
    'arena'
);