-- 좋아요 누적 문제 해결을 위한 스키마 수정
-- Supabase SQL Editor에서 실행하세요

-- 1. guest_likes 필드 추가
ALTER TABLE coversong_videos 
ADD COLUMN IF NOT EXISTS guest_likes INTEGER DEFAULT 0;

-- 2. 좋아요 히스토리 테이블 수정 (중복 투표 방지)
CREATE TABLE IF NOT EXISTS coversong_like_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT REFERENCES coversong_videos(id) ON DELETE CASCADE,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  like_type TEXT NOT NULL CHECK (like_type IN ('arena', 'guest')), -- 'arena' 또는 'guest'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id, competition_id, like_type) -- 중복 투표 방지
);

-- 3. 좋아요 증가 함수 (중복 방지)
CREATE OR REPLACE FUNCTION increment_likes(
  p_video_id TEXT,
  p_competition_id INTEGER,
  p_user_id UUID DEFAULT NULL,
  p_like_type TEXT DEFAULT 'arena'
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_existing_like RECORD;
BEGIN
  -- 로그인 사용자의 경우 중복 투표 확인
  IF p_user_id IS NOT NULL THEN
    SELECT * INTO v_existing_like 
    FROM coversong_like_history 
    WHERE user_id = p_user_id 
      AND video_id = p_video_id 
      AND competition_id = p_competition_id
      AND like_type = p_like_type;
    
    -- 이미 투표한 경우 에러 반환
    IF v_existing_like IS NOT NULL THEN
      RETURN json_build_object(
        'success', false,
        'message', '이미 투표하셨습니다.',
        'arena_likes', 0,
        'guest_likes', 0
      );
    END IF;
    
    -- 투표 히스토리 저장
    INSERT INTO coversong_like_history (user_id, video_id, competition_id, like_type)
    VALUES (p_user_id, p_video_id, p_competition_id, p_like_type);
  END IF;
  
  -- 좋아요 증가
  IF p_like_type = 'arena' THEN
    UPDATE coversong_videos 
    SET arena_likes = arena_likes + 1,
        updated_at = NOW()
    WHERE id = p_video_id;
  ELSE
    UPDATE coversong_videos 
    SET guest_likes = guest_likes + 1,
        updated_at = NOW()
    WHERE id = p_video_id;
  END IF;
  
  -- 결과 반환
  SELECT json_build_object(
    'success', true,
    'message', '투표가 완료되었습니다.',
    'arena_likes', arena_likes,
    'guest_likes', guest_likes
  ) INTO v_result
  FROM coversong_videos 
  WHERE id = p_video_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 4. 좋아요 조회 함수
CREATE OR REPLACE FUNCTION get_video_likes(p_video_id TEXT)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'arena_likes', arena_likes,
    'guest_likes', guest_likes,
    'total_likes', arena_likes + guest_likes
  ) INTO v_result
  FROM coversong_videos 
  WHERE id = p_video_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 5. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_like_history_user_video ON coversong_like_history(user_id, video_id);
CREATE INDEX IF NOT EXISTS idx_like_history_competition ON coversong_like_history(competition_id);
CREATE INDEX IF NOT EXISTS idx_videos_guest_likes ON coversong_videos(guest_likes DESC);

-- 6. 확인 쿼리
SELECT 
  'coversong_videos' as table_name,
  COUNT(*) as total_videos,
  SUM(arena_likes) as total_arena_likes,
  SUM(guest_likes) as total_guest_likes
FROM coversong_videos;

-- 완료 메시지
SELECT '좋아요 누적 문제 해결을 위한 스키마가 업데이트되었습니다!' as message; 