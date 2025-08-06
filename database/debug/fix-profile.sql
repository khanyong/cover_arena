-- 수동으로 Profile 생성 및 Admin 권한 부여
-- Supabase SQL Editor에서 실행하세요

-- 1. 사용자 ID 가져오기
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- 사용자 ID 가져오기
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = 'khanyong@hotmail.com';
  
  -- Profile이 없으면 생성
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
    INSERT INTO public.profiles (id, username, is_admin)
    VALUES (
      user_id, 
      COALESCE(
        (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = user_id),
        'khanyong'
      ),
      true  -- Admin 권한 부여
    );
    
    RAISE NOTICE 'Profile created for user: %', user_id;
  ELSE
    -- 이미 존재하면 Admin 권한만 부여
    UPDATE public.profiles 
    SET is_admin = true 
    WHERE id = user_id;
    
    RAISE NOTICE 'Admin privileges granted to existing profile: %', user_id;
  END IF;
END $$;

-- 2. 결과 확인
SELECT 
  p.id,
  p.username,
  p.is_admin,
  p.created_at,
  u.email,
  u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'khanyong@hotmail.com'; 