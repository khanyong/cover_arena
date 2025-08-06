-- Admin 계정 설정 SQL
-- Supabase SQL Editor에서 실행하세요

-- 1. admin@example.com 계정에 admin 권한 부여
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@example.com'
);

-- 2. 확인 쿼리
SELECT 
  p.id,
  p.username,
  p.is_admin,
  u.email,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@example.com';

-- 3. 모든 admin 계정 확인
SELECT 
  p.username,
  u.email,
  p.is_admin,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true; 