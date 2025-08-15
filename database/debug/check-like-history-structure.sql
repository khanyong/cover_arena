-- coversong_like_history 테이블 구조 확인

-- 1. 테이블 구조 확인
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'coversong_like_history'
ORDER BY ordinal_position;

-- 2. 인덱스 확인
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'coversong_like_history';

-- 3. 제약 조건 확인  
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'coversong_like_history'::regclass;

-- 4. 최근 투표 기록 확인 (최근 10개)
SELECT 
    id,
    user_id,
    video_id,
    competition_id,
    like_type,
    created_at
FROM coversong_like_history
ORDER BY created_at DESC
LIMIT 10;

-- 5. 중복 투표 확인
SELECT 
    user_id,
    video_id,
    COUNT(*) as vote_count
FROM coversong_like_history
WHERE competition_id = 5
GROUP BY user_id, video_id
HAVING COUNT(*) > 1;