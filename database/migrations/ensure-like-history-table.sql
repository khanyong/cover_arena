-- coversong_like_history 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS coversong_like_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT REFERENCES coversong_videos(id) ON DELETE CASCADE,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  like_type TEXT NOT NULL CHECK (like_type IN ('arena', 'guest')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id, competition_id, like_type)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_like_history_user_video ON coversong_like_history(user_id, video_id);
CREATE INDEX IF NOT EXISTS idx_like_history_competition ON coversong_like_history(competition_id);

-- 테이블 확인
SELECT 
  'Table created/verified' as status,
  COUNT(*) as total_records
FROM coversong_like_history;