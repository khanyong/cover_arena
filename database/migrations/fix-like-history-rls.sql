-- coversong_like_history 테이블의 RLS 정책 수정

-- 1. RLS 활성화 (이미 활성화되어 있을 수 있음)
ALTER TABLE coversong_like_history ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제
DROP POLICY IF EXISTS "Users can insert their own likes" ON coversong_like_history;
DROP POLICY IF EXISTS "Anyone can insert likes" ON coversong_like_history;
DROP POLICY IF EXISTS "Users can view likes" ON coversong_like_history;
DROP POLICY IF EXISTS "Anyone can view likes" ON coversong_like_history;

-- 3. 새로운 정책 생성
-- 모든 사용자(로그인/비로그인)가 삽입 가능
CREATE POLICY "Anyone can insert likes" 
ON coversong_like_history 
FOR INSERT 
WITH CHECK (true);

-- 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view likes" 
ON coversong_like_history 
FOR SELECT 
USING (true);

-- 4. 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'coversong_like_history';

-- 5. 테이블 권한 확인
SELECT 
    'RLS Enabled' as status,
    relrowsecurity as rls_enabled,
    relforcerowsecurity as rls_forced
FROM pg_class
WHERE relname = 'coversong_like_history';