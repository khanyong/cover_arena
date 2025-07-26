-- 회원 관리 기능 추가 SQL 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. profiles 테이블에 회원 관리 필드 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- 'pending', 'active', 'rejected', 'suspended'

-- 2. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON profiles(approved);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- 3. 기존 사용자들을 활성화 상태로 변경 (선택사항)
-- UPDATE profiles SET approved = true, status = 'active' WHERE approved IS NULL;

-- 4. RLS 정책 업데이트 (관리자만 회원 정보 수정 가능)
CREATE POLICY "Admins can update user profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 5. 관리자만 회원 목록 조회 가능
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 6. 확인 쿼리
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
  COUNT(*) FILTER (WHERE status = 'active') as active_users,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_users,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_users
FROM profiles; 