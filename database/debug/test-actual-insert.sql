-- 실제 데이터로 INSERT 테스트

-- 1. 실제 비디오 확인 (competition_id = 5인 비디오)
SELECT id, title, competition_id 
FROM coversong_videos 
WHERE competition_id = 5 
LIMIT 5;

-- 2. 실제 사용자 확인
SELECT id, email, raw_user_meta_data->>'username' as username 
FROM auth.users 
LIMIT 5;

-- 3. 위에서 얻은 실제 값으로 INSERT 테스트
-- 예: video_id와 user_id를 실제 값으로 변경하세요
/*
INSERT INTO coversong_like_history (
    user_id, 
    video_id, 
    competition_id, 
    like_type,
    created_at
) VALUES (
    '실제_USER_ID를_여기에',  -- 위 2번 쿼리에서 얻은 user id
    '실제_VIDEO_ID를_여기에', -- 위 1번 쿼리에서 얻은 video id
    5,                        -- competition ID
    'arena',
    NOW()
) RETURNING *;
*/

-- 4. RLS 정책 우회 테스트 (관리자 권한으로)
-- RLS를 임시로 비활성화하고 INSERT 시도
/*
ALTER TABLE coversong_like_history DISABLE ROW LEVEL SECURITY;

INSERT INTO coversong_like_history (
    user_id, 
    video_id, 
    competition_id, 
    like_type,
    created_at
) VALUES (
    '실제_USER_ID',
    '실제_VIDEO_ID',
    5,
    'arena',
    NOW()
) RETURNING *;

-- 테스트 후 다시 활성화
ALTER TABLE coversong_like_history ENABLE ROW LEVEL SECURITY;
*/

-- 5. 결과 확인
SELECT * FROM coversong_like_history ORDER BY created_at DESC LIMIT 5;