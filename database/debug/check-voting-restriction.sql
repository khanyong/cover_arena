-- 투표 제한 시스템 확인

-- 1. increment_likes 함수가 존재하는지 확인
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
AND routine_name = 'increment_likes';

-- 2. coversong_like_history 테이블이 존재하는지 확인
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'coversong_like_history'
ORDER BY ordinal_position;

-- 3. coversong_like_history 테이블의 UNIQUE 제약 확인
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    string_agg(kcu.column_name, ', ') as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name = 'coversong_like_history'
AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.constraint_name, tc.constraint_type;

-- 4. 현재 투표 기록 확인 (최근 10개)
SELECT 
    lh.id,
    lh.user_id,
    lh.video_id,
    lh.competition_id,
    lh.like_type,
    lh.created_at,
    v.title as video_title
FROM coversong_like_history lh
LEFT JOIN coversong_videos v ON lh.video_id = v.id
ORDER BY lh.created_at DESC
LIMIT 10;

-- 5. 중복 투표 테스트 (특정 사용자가 같은 비디오에 여러 번 투표했는지)
SELECT 
    user_id,
    video_id,
    competition_id,
    COUNT(*) as vote_count
FROM coversong_like_history
WHERE like_type = 'arena'
GROUP BY user_id, video_id, competition_id
HAVING COUNT(*) > 1;

-- 6. 함수 정의 확인
SELECT 
    pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'increment_likes';