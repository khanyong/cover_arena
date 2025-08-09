-- 기존 테이블 삭제 (잘못된 참조 수정을 위해)
DROP TABLE IF EXISTS coversong_review_comments CASCADE;
DROP TABLE IF EXISTS coversong_review_reactions CASCADE;
DROP TABLE IF EXISTS coversong_reviewer_stats CASCADE;
DROP TABLE IF EXISTS coversong_reviews CASCADE;
DROP VIEW IF EXISTS coversong_review_summary CASCADE;

-- 리뷰 테이블 재생성 (profiles 테이블 참조)
CREATE TABLE IF NOT EXISTS coversong_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  
  -- 전체 평점 및 카테고리별 평점 (1-5)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5) NOT NULL,
  vocal_rating INTEGER CHECK (vocal_rating >= 1 AND vocal_rating <= 5),
  emotion_rating INTEGER CHECK (emotion_rating >= 1 AND emotion_rating <= 5),
  arrangement_rating INTEGER CHECK (arrangement_rating >= 1 AND arrangement_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  
  -- 리뷰 텍스트
  review_text TEXT,
  
  -- 도움됨 카운트 및 메타데이터
  helpful_count INTEGER DEFAULT 0,
  is_expert_review BOOLEAN DEFAULT FALSE,
  reviewer_level TEXT DEFAULT 'beginner' CHECK (reviewer_level IN ('beginner', 'intermediate', 'expert')),
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- 중복 리뷰 방지 (한 사용자는 한 영상에 하나의 리뷰만)
  UNIQUE(user_id, video_id)
);

-- 리뷰 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS coversong_review_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES coversong_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES coversong_review_comments(id) ON DELETE CASCADE, -- 대댓글용
  
  comment_text TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 리뷰 반응 테이블 생성 (좋아요, 동의, 반대 등)
CREATE TABLE IF NOT EXISTS coversong_review_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  review_id UUID REFERENCES coversong_reviews(id) ON DELETE CASCADE NOT NULL,
  
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'agree', 'disagree', 'expert')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- 한 사용자는 한 리뷰에 하나의 반응만
  UNIQUE(user_id, review_id, reaction_type)
);

-- 리뷰어 통계 테이블 (리뷰어 레벨 및 신뢰도 추적)
CREATE TABLE IF NOT EXISTS coversong_reviewer_stats (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  
  total_reviews INTEGER DEFAULT 0,
  total_helpful_received INTEGER DEFAULT 0,
  average_rating_given DECIMAL(3,2),
  reviewer_level TEXT DEFAULT 'beginner' CHECK (reviewer_level IN ('beginner', 'intermediate', 'expert')),
  trust_score DECIMAL(5,2) DEFAULT 50.00, -- 0-100 신뢰도 점수
  
  badges JSONB DEFAULT '[]'::jsonb, -- 획득한 배지 목록
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_reviews_video_id ON coversong_reviews(video_id);
CREATE INDEX idx_reviews_user_id ON coversong_reviews(user_id);
CREATE INDEX idx_reviews_created_at ON coversong_reviews(created_at DESC);
CREATE INDEX idx_review_comments_review_id ON coversong_review_comments(review_id);
CREATE INDEX idx_review_reactions_review_id ON coversong_review_reactions(review_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE coversong_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coversong_review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coversong_review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coversong_reviewer_stats ENABLE ROW LEVEL SECURITY;

-- 리뷰 정책
CREATE POLICY "Anyone can view reviews" ON coversong_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON coversong_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON coversong_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON coversong_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 댓글 정책
CREATE POLICY "Anyone can view comments" ON coversong_review_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON coversong_review_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON coversong_review_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON coversong_review_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 반응 정책
CREATE POLICY "Anyone can view reactions" ON coversong_review_reactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reactions" ON coversong_review_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON coversong_review_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- 통계 정책
CREATE POLICY "Anyone can view reviewer stats" ON coversong_reviewer_stats
  FOR SELECT USING (true);

CREATE POLICY "System can manage reviewer stats" ON coversong_reviewer_stats
  FOR ALL USING (true);

-- 트리거 함수: 리뷰 생성/수정 시 updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON coversong_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_comments_updated_at BEFORE UPDATE ON coversong_review_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 트리거 함수: helpful_count 자동 업데이트
CREATE OR REPLACE FUNCTION update_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.reaction_type = 'helpful' THEN
    UPDATE coversong_reviews 
    SET helpful_count = helpful_count + 1 
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' AND OLD.reaction_type = 'helpful' THEN
    UPDATE coversong_reviews 
    SET helpful_count = helpful_count - 1 
    WHERE id = OLD.review_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_review_helpful_count
  AFTER INSERT OR DELETE ON coversong_review_reactions
  FOR EACH ROW EXECUTE FUNCTION update_helpful_count();

-- 트리거 함수: 리뷰어 통계 자동 업데이트
CREATE OR REPLACE FUNCTION update_reviewer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO coversong_reviewer_stats (user_id, total_reviews, average_rating_given)
    VALUES (NEW.user_id, 1, NEW.overall_rating)
    ON CONFLICT (user_id) DO UPDATE
    SET 
      total_reviews = coversong_reviewer_stats.total_reviews + 1,
      average_rating_given = (
        (coversong_reviewer_stats.average_rating_given * coversong_reviewer_stats.total_reviews + NEW.overall_rating) 
        / (coversong_reviewer_stats.total_reviews + 1)
      ),
      updated_at = TIMEZONE('utc', NOW());
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviewer_stats_on_review
  AFTER INSERT ON coversong_reviews
  FOR EACH ROW EXECUTE FUNCTION update_reviewer_stats();

-- 뷰: 리뷰 요약 정보
CREATE OR REPLACE VIEW coversong_review_summary AS
SELECT 
  video_id,
  COUNT(*) as total_reviews,
  AVG(overall_rating)::DECIMAL(3,2) as avg_overall_rating,
  AVG(vocal_rating)::DECIMAL(3,2) as avg_vocal_rating,
  AVG(emotion_rating)::DECIMAL(3,2) as avg_emotion_rating,
  AVG(arrangement_rating)::DECIMAL(3,2) as avg_arrangement_rating,
  AVG(quality_rating)::DECIMAL(3,2) as avg_quality_rating,
  COUNT(DISTINCT user_id) as unique_reviewers,
  SUM(helpful_count) as total_helpful_votes
FROM coversong_reviews
GROUP BY video_id;