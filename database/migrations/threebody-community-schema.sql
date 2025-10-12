-- 삼체 커뮤니티 기능 테이블들

-- 1. 면벽 계획 (Wallfacer Plans)
CREATE TABLE IF NOT EXISTS threebody_wallfacer_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  strategy_type TEXT NOT NULL, -- '기술', '외교', '군사', '심리', '기타'
  description TEXT NOT NULL,
  detailed_plan TEXT NOT NULL,
  success_probability INTEGER CHECK (success_probability >= 0 AND success_probability <= 100),
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 면벽 계획 투표/좋아요
CREATE TABLE IF NOT EXISTS threebody_plan_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES threebody_wallfacer_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, user_id)
);

-- 3. 토론 게시판 스레드
CREATE TABLE IF NOT EXISTS threebody_discussions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'timeline', 'characters', 'fleet', 'doomsday', etc.
  section_item TEXT, -- 특정 아이템 ID (예: '뤄지', '말일전투')
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  discussion_type TEXT NOT NULL, -- 'theory', 'question', 'analysis', 'scenario'
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 댓글 시스템
CREATE TABLE IF NOT EXISTS threebody_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID REFERENCES threebody_discussions(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES threebody_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 토론 좋아요
CREATE TABLE IF NOT EXISTS threebody_discussion_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID REFERENCES threebody_discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discussion_id, user_id)
);

-- 6. 댓글 좋아요
CREATE TABLE IF NOT EXISTS threebody_comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES threebody_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 7. 전략 투표 (최고의 전략 선정)
CREATE TABLE IF NOT EXISTS threebody_strategy_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'best_wallfacer', 'best_survival', 'best_diplomacy', etc.
  option_value TEXT NOT NULL, -- '뤄지', '정청신', 'custom_plan_id', etc.
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_wallfacer_plans_user ON threebody_wallfacer_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_wallfacer_plans_created ON threebody_wallfacer_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallfacer_plans_likes ON threebody_wallfacer_plans(likes_count DESC);

CREATE INDEX IF NOT EXISTS idx_discussions_section ON threebody_discussions(section);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON threebody_discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_likes ON threebody_discussions(likes_count DESC);

CREATE INDEX IF NOT EXISTS idx_comments_discussion ON threebody_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON threebody_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON threebody_comments(created_at DESC);

-- RLS (Row Level Security) 정책
ALTER TABLE threebody_wallfacer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE threebody_plan_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE threebody_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE threebody_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE threebody_discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE threebody_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE threebody_strategy_votes ENABLE ROW LEVEL SECURITY;

-- 읽기는 모두 허용
CREATE POLICY "Anyone can view plans" ON threebody_wallfacer_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can view discussions" ON threebody_discussions FOR SELECT USING (true);
CREATE POLICY "Anyone can view comments" ON threebody_comments FOR SELECT USING (true);

-- 쓰기는 인증된 사용자만
CREATE POLICY "Authenticated users can create plans" ON threebody_wallfacer_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON threebody_wallfacer_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON threebody_wallfacer_plans FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create discussions" ON threebody_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own discussions" ON threebody_discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own discussions" ON threebody_discussions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create comments" ON threebody_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON threebody_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON threebody_comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can like plans" ON threebody_plan_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view plan likes" ON threebody_plan_likes FOR SELECT USING (true);
CREATE POLICY "Users can remove own likes" ON threebody_plan_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can like discussions" ON threebody_discussion_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view discussion likes" ON threebody_discussion_likes FOR SELECT USING (true);
CREATE POLICY "Users can remove own likes" ON threebody_discussion_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can like comments" ON threebody_comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view comment likes" ON threebody_comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can remove own likes" ON threebody_comment_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can vote" ON threebody_strategy_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view votes" ON threebody_strategy_votes FOR SELECT USING (true);
CREATE POLICY "Users can update own votes" ON threebody_strategy_votes FOR UPDATE USING (auth.uid() = user_id);

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wallfacer_plans_updated_at BEFORE UPDATE ON threebody_wallfacer_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON threebody_discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON threebody_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
