-- increment_likes 함수 확인

-- 1. 함수 존재 여부 확인
SELECT 
    proname as function_name,
    pronargs as arg_count
FROM pg_proc
WHERE proname = 'increment_likes';

-- 2. 함수 정의 확인
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'increment_likes';

-- 3. 최근 수정된 비디오 확인
SELECT 
    id,
    title,
    arena_likes,
    updated_at
FROM coversong_videos
WHERE competition_id = 5
ORDER BY updated_at DESC
LIMIT 5;