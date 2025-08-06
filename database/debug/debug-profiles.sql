-- Profiles 테이블 문제 진단
-- Supabase SQL Editor에서 실행하세요

-- 1. auth.users 테이블에서 사용자 확인
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'khanyong@hotmail.com';

-- 2. profiles 테이블에서 해당 사용자 확인
SELECT 
  id,
  username,
  is_admin,
  created_at
FROM public.profiles 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'khanyong@hotmail.com'
);

-- 3. 모든 profiles 확인
SELECT 
  p.id,
  p.username,
  p.is_admin,
  p.created_at,
  u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;

-- 4. 트리거 함수 확인
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'; 