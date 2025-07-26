-- Cover Battle Arena 100 - 기존 profiles 테이블 활용 업데이트
-- 기존 profiles 테이블이 있는 경우 사용하세요

-- 1. 기존 profiles 테이블에 is_admin 필드 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 1-1. 회원 관리 필드 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- 'pending', 'approved', 'rejected', 'suspended'

-- 1-2. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON profiles(approved);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

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

-- 7. Competition 히스토리 관리 테이블 추가
CREATE TABLE IF NOT EXISTS competition_history (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  round_number INTEGER NOT NULL, -- 회차 번호
  topic TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  announcement_date TIMESTAMP WITH TIME ZONE,
  total_participants INTEGER DEFAULT 0,
  winner_video_id TEXT REFERENCES coversong_videos(id),
  winner_channel TEXT,
  winner_score NUMERIC,
  runner_up_video_id TEXT REFERENCES coversong_videos(id),
  runner_up_channel TEXT,
  runner_up_score NUMERIC,
  third_place_video_id TEXT REFERENCES coversong_videos(id),
  third_place_channel TEXT,
  third_place_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 히스토리 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_competition_history_round ON competition_history(round_number DESC);
CREATE INDEX IF NOT EXISTS idx_competition_history_competition_id ON competition_history(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_history_announcement_date ON competition_history(announcement_date DESC);

-- 9. 히스토리 테이블 RLS 정책
ALTER TABLE competition_history ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 히스토리 조회 가능
CREATE POLICY "Anyone can view competition history" ON competition_history
  FOR SELECT USING (true);

-- 관리자만 히스토리 생성/수정 가능
CREATE POLICY "Admins can manage competition history" ON competition_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 10. 자동 updated_at 업데이트 트리거
CREATE OR REPLACE FUNCTION update_competition_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_competition_history_updated_at
  BEFORE UPDATE ON competition_history
  FOR EACH ROW
  EXECUTE FUNCTION update_competition_history_updated_at();

-- 11. 다음 회차 번호 자동 계산 함수
CREATE OR REPLACE FUNCTION get_next_round_number()
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE((SELECT MAX(round_number) FROM competition_history), 0) + 1;
END;
$$ LANGUAGE plpgsql;

-- 12. 히스토리 자동 생성 함수 (발표 시 호출)
CREATE OR REPLACE FUNCTION create_competition_history(
  p_competition_id INTEGER,
  p_topic TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS INTEGER AS $$
DECLARE
  v_round_number INTEGER;
  v_winner_video_id TEXT;
  v_winner_channel TEXT;
  v_winner_score NUMERIC;
  v_runner_up_video_id TEXT;
  v_runner_up_channel TEXT;
  v_runner_up_score NUMERIC;
  v_third_place_video_id TEXT;
  v_third_place_channel TEXT;
  v_third_place_score NUMERIC;
  v_total_participants INTEGER;
BEGIN
  -- 다음 회차 번호 가져오기
  v_round_number := get_next_round_number();
  
  -- TOP 3 영상 정보 가져오기
  SELECT 
    id, channel, site_score,
    COUNT(*) OVER() as total_count
  INTO 
    v_winner_video_id, v_winner_channel, v_winner_score, v_total_participants
  FROM coversong_videos 
  WHERE competition_id = p_competition_id 
    AND final_rank IS NOT NULL
  ORDER BY final_rank ASC 
  LIMIT 1;
  
  -- 2위 영상
  SELECT 
    id, channel, site_score
  INTO 
    v_runner_up_video_id, v_runner_up_channel, v_runner_up_score
  FROM coversong_videos 
  WHERE competition_id = p_competition_id 
    AND final_rank IS NOT NULL
  ORDER BY final_rank ASC 
  LIMIT 1 OFFSET 1;
  
  -- 3위 영상
  SELECT 
    id, channel, site_score
  INTO 
    v_third_place_video_id, v_third_place_channel, v_third_place_score
  FROM coversong_videos 
  WHERE competition_id = p_competition_id 
    AND final_rank IS NOT NULL
  ORDER BY final_rank ASC 
  LIMIT 1 OFFSET 2;
  
  -- 히스토리 생성
  INSERT INTO competition_history (
    competition_id,
    round_number,
    topic,
    start_date,
    end_date,
    announcement_date,
    total_participants,
    winner_video_id,
    winner_channel,
    winner_score,
    runner_up_video_id,
    runner_up_channel,
    runner_up_score,
    third_place_video_id,
    third_place_channel,
    third_place_score
  ) VALUES (
    p_competition_id,
    v_round_number,
    p_topic,
    p_start_date,
    p_end_date,
    NOW(),
    v_total_participants,
    v_winner_video_id,
    v_winner_channel,
    v_winner_score,
    v_runner_up_video_id,
    v_runner_up_channel,
    v_runner_up_score,
    v_third_place_video_id,
    v_third_place_channel,
    v_third_place_score
  );
  
  RETURN v_round_number;
END;
$$ LANGUAGE plpgsql;

-- 13. 확인 쿼리
SELECT 
  'competition_history' as table_name,
  COUNT(*) as total_records
FROM competition_history;

-- 7. 증가 함수 생성 (arena_likes, votes_count 증가용)
CREATE OR REPLACE FUNCTION coversong_increment()
RETURNS INTEGER
LANGUAGE SQL
AS $$
  SELECT COALESCE(MAX(arena_likes), 0) + 1
  FROM coversong_videos
  WHERE id = (SELECT id FROM coversong_videos WHERE id = coversong_videos.id LIMIT 1);
$$;

-- 8. 사용자 생성 시 프로필 자동 생성 트리거 (기존 profiles 테이블 사용)
CREATE OR REPLACE FUNCTION coversong_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email, is_admin)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.email, FALSE)
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS coversong_on_auth_user_created ON auth.users;
CREATE TRIGGER coversong_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION coversong_handle_new_user();

-- 9. Row Level Security (RLS) 정책 설정

-- coversong_topics 테이블 RLS
ALTER TABLE coversong_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view topics" ON coversong_topics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert topics" ON coversong_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update topics" ON coversong_topics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admin can delete topics" ON coversong_topics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- coversong_competitions 테이블 RLS
ALTER TABLE coversong_competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competitions" ON coversong_competitions
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage competitions" ON coversong_competitions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- coversong_videos 테이블 RLS
ALTER TABLE coversong_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos" ON coversong_videos
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage videos" ON coversong_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
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

-- 7. 기존 coversong_competitions 테이블에 히스토리 관리 컬럼 추가
ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS round_number INTEGER;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS announcement_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS total_participants INTEGER DEFAULT 0;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS winner_video_id TEXT REFERENCES coversong_videos(id);

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS winner_channel TEXT;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS winner_score NUMERIC;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS runner_up_video_id TEXT REFERENCES coversong_videos(id);

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS runner_up_channel TEXT;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS runner_up_score NUMERIC;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS third_place_video_id TEXT REFERENCES coversong_videos(id);

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS third_place_channel TEXT;

ALTER TABLE coversong_competitions 
ADD COLUMN IF NOT EXISTS third_place_score NUMERIC;

-- 8. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_competitions_round ON coversong_competitions(round_number DESC);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON coversong_competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_announcement_date ON coversong_competitions(announcement_date DESC);

-- 9. 다음 회차 번호 자동 계산 함수
CREATE OR REPLACE FUNCTION get_next_round_number()
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE((SELECT MAX(round_number) FROM coversong_competitions WHERE round_number IS NOT NULL), 0) + 1;
END;
$$ LANGUAGE plpgsql;

-- 10. 발표 시 히스토리 정보 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_competition_results(
  p_competition_id INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_round_number INTEGER;
  v_winner_video_id TEXT;
  v_winner_channel TEXT;
  v_winner_score NUMERIC;
  v_runner_up_video_id TEXT;
  v_runner_up_channel TEXT;
  v_runner_up_score NUMERIC;
  v_third_place_video_id TEXT;
  v_third_place_channel TEXT;
  v_third_place_score NUMERIC;
  v_total_participants INTEGER;
BEGIN
  -- 다음 회차 번호 가져오기
  v_round_number := get_next_round_number();
  
  -- TOP 3 영상 정보 가져오기
  SELECT 
    id, channel, site_score,
    COUNT(*) OVER() as total_count
  INTO 
    v_winner_video_id, v_winner_channel, v_winner_score, v_total_participants
  FROM coversong_videos 
  WHERE competition_id = p_competition_id 
    AND final_rank IS NOT NULL
  ORDER BY final_rank ASC 
  LIMIT 1;
  
  -- 2위 영상
  SELECT 
    id, channel, site_score
  INTO 
    v_runner_up_video_id, v_runner_up_channel, v_runner_up_score
  FROM coversong_videos 
  WHERE competition_id = p_competition_id 
    AND final_rank IS NOT NULL
  ORDER BY final_rank ASC 
  LIMIT 1 OFFSET 1;
  
  -- 3위 영상
  SELECT 
    id, channel, site_score
  INTO 
    v_third_place_video_id, v_third_place_channel, v_third_place_score
  FROM coversong_videos 
  WHERE competition_id = p_competition_id 
    AND final_rank IS NOT NULL
  ORDER BY final_rank ASC 
  LIMIT 1 OFFSET 2;
  
  -- Competition 정보 업데이트
  UPDATE coversong_competitions SET
    round_number = v_round_number,
    announcement_date = NOW(),
    total_participants = v_total_participants,
    winner_video_id = v_winner_video_id,
    winner_channel = v_winner_channel,
    winner_score = v_winner_score,
    runner_up_video_id = v_runner_up_video_id,
    runner_up_channel = v_runner_up_channel,
    runner_up_score = v_runner_up_score,
    third_place_video_id = v_third_place_video_id,
    third_place_channel = v_third_place_channel,
    third_place_score = v_third_place_score,
    status = 'ended',
    updated_at = NOW()
  WHERE id = p_competition_id;
  
  RETURN v_round_number;
END;
$$ LANGUAGE plpgsql;

-- 11. 확인 쿼리
SELECT 
  'coversong_competitions' as table_name,
  COUNT(*) as total_competitions,
  COUNT(*) FILTER (WHERE status = 'active') as active_competitions,
  COUNT(*) FILTER (WHERE status = 'ended') as ended_competitions,
  COUNT(*) FILTER (WHERE round_number IS NOT NULL) as numbered_competitions
FROM coversong_competitions;

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
SELECT 'Cover Battle Arena 100 Database Schema updated successfully using existing profiles table!' as message; 