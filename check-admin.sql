-- Admin 권한 확인
-- Supabase SQL Editor에서 실행하세요

-- 1. khanyong@hotmail.com 계정의 Admin 권한 확인
SELECT 
  p.username,
  u.email,
  p.is_admin,
  p.created_at,
  u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'khanyong@hotmail.com';

-- 2. 모든 Admin 계정 목록
SELECT 
  p.username,
  u.email,
  p.is_admin,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true
ORDER BY p.created_at DESC; 