-- khanyong@hotmail.com 계정의 Admin 권한 확인 및 부여
-- Supabase SQL Editor에서 실행하세요

-- 1. 현재 상태 확인
SELECT 
  p.id,
  p.username,
  u.email,
  p.is_admin,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'khanyong@hotmail.com';

-- 2. Admin 권한 부여 (is_admin이 false인 경우)
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'khanyong@hotmail.com'
);

-- 3. 결과 확인
SELECT 
  p.username,
  u.email,
  p.is_admin,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'khanyong@hotmail.com'; 