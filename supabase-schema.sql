-- Cover Battle Arena 100 Database Schema
-- Supabase SQL Editor에서 실행하세요

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS coversong_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 주제 제안 테이블
CREATE TABLE IF NOT EXISTS coversong_topics (
  id SERIAL PRIMARY KEY,
  topic TEXT NOT NULL UNIQUE,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 대회 관리 테이블
CREATE TABLE IF NOT EXISTS coversong_competitions (
  id SERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'preparing', -- 'preparing', 'active', 'ended'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 영상 정보 테이블
CREATE TABLE IF NOT EXISTS coversong_videos (
  id TEXT PRIMARY KEY, -- YouTube video ID
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  thumbnail TEXT,
  youtube_id TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  arena_likes INTEGER DEFAULT 0,
  topic TEXT NOT NULL,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 투표 히스토리 테이블
CREATE TABLE IF NOT EXISTS coversong_voting_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT REFERENCES coversong_videos(id) ON DELETE CASCADE,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id, competition_id) -- 중복 투표 방지
);

-- 6. 주제 투표 테이블
CREATE TABLE IF NOT EXISTS coversong_topic_votes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id INTEGER REFERENCES coversong_topics(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id) -- 중복 투표 방지
);

-- 7. 증가 함수 생성 (arena_likes, votes_count 증가용)
CREATE OR REPLACE FUNCTION coversong_increment()
RETURNS INTEGER
LANGUAGE SQL
AS $$
  SELECT COALESCE(MAX(arena_likes), 0) + 1
  FROM coversong_videos
  WHERE id = (SELECT id FROM coversong_videos WHERE id = coversong_videos.id LIMIT 1);
$$;

-- 8. 사용자 생성 시 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION coversong_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO coversong_profiles (id, username, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS coversong_on_auth_user_created ON auth.users;
CREATE TRIGGER coversong_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION coversong_handle_new_user();

-- 9. Row Level Security (RLS) 정책 설정

-- coversong_profiles 테이블 RLS
ALTER TABLE coversong_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON coversong_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON coversong_profiles
  FOR UPDATE USING (auth.uid() = id);

-- coversong_topics 테이블 RLS
ALTER TABLE coversong_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view topics" ON coversong_topics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert topics" ON coversong_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update topics" ON coversong_topics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM coversong_profiles 
      WHERE coversong_profiles.id = auth.uid() 
      AND coversong_profiles.is_admin = true
    )
  );

CREATE POLICY "Admin can delete topics" ON coversong_topics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM coversong_profiles 
      WHERE coversong_profiles.id = auth.uid() 
      AND coversong_profiles.is_admin = true
    )
  );

-- coversong_competitions 테이블 RLS
ALTER TABLE coversong_competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competitions" ON coversong_competitions
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage competitions" ON coversong_competitions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM coversong_profiles 
      WHERE coversong_profiles.id = auth.uid() 
      AND coversong_profiles.is_admin = true
    )
  );

-- coversong_videos 테이블 RLS
ALTER TABLE coversong_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos" ON coversong_videos
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage videos" ON coversong_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM coversong_profiles 
      WHERE coversong_profiles.id = auth.uid() 
      AND coversong_profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated users can update arena_likes" ON coversong_videos
  FOR UPDATE USING (auth.role() = 'authenticated');

-- coversong_voting_history 테이블 RLS
ALTER TABLE coversong_voting_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voting history" ON coversong_voting_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert voting history" ON coversong_voting_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- coversong_topic_votes 테이블 RLS
ALTER TABLE coversong_topic_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topic votes" ON coversong_topic_votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert topic votes" ON coversong_topic_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. 샘플 데이터 삽입

-- 샘플 주제 제안
INSERT INTO coversong_topics (topic, votes_count) VALUES
  ('Taylor Swift - Cruel Summer', 45),
  ('BTS - Butter', 38),
  ('Olivia Rodrigo - Vampire', 32),
  ('NewJeans - Super Shy', 28),
  ('The Weeknd - Blinding Lights', 25)
ON CONFLICT (topic) DO NOTHING;

-- 샘플 대회
INSERT INTO coversong_competitions (topic, start_time, end_time, status) VALUES
  ('KPOP Demon Hunters', NOW(), NOW() + INTERVAL '24 hours', 'active')
ON CONFLICT DO NOTHING;

-- 11. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_coversong_videos_topic ON coversong_videos(topic);
CREATE INDEX IF NOT EXISTS idx_coversong_videos_arena_likes ON coversong_videos(arena_likes DESC);
CREATE INDEX IF NOT EXISTS idx_coversong_voting_history_user_id ON coversong_voting_history(user_id);
CREATE INDEX IF NOT EXISTS idx_coversong_voting_history_video_id ON coversong_voting_history(video_id);
CREATE INDEX IF NOT EXISTS idx_coversong_topic_votes_user_id ON coversong_topic_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_coversong_topics_votes_count ON coversong_topics(votes_count DESC);

-- 12. 뷰 생성 (자주 사용되는 쿼리용)
CREATE OR REPLACE VIEW coversong_video_rankings AS
SELECT 
  v.id,
  v.title,
  v.channel,
  v.youtube_id,
  v.views,
  v.likes,
  v.arena_likes,
  v.topic,
  ROW_NUMBER() OVER (PARTITION BY v.topic ORDER BY v.arena_likes DESC) as rank
FROM coversong_videos v
WHERE v.arena_likes > 0;

-- 완료 메시지
SELECT 'Cover Battle Arena 100 Database Schema with coversong_ prefix created successfully!' as message; 