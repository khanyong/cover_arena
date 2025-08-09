-- 익명 방문자 추적 테이블
CREATE TABLE IF NOT EXISTS coversong_page_visits (
  id BIGSERIAL PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_fingerprint TEXT, -- 브라우저 핑거프린트 (IP + User-Agent 해시)
  referrer TEXT,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_hour INTEGER NOT NULL DEFAULT EXTRACT(HOUR FROM NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 일일 통계 뷰 (빠른 조회용)
CREATE OR REPLACE VIEW coversong_daily_visit_stats AS
SELECT 
  visit_date,
  COUNT(*) as total_visits,
  COUNT(DISTINCT visitor_fingerprint) as unique_visitors,
  COUNT(DISTINCT page_path) as pages_visited
FROM coversong_page_visits
GROUP BY visit_date
ORDER BY visit_date DESC;

-- 실시간 통계 뷰 (최근 24시간)
CREATE OR REPLACE VIEW coversong_realtime_stats AS
SELECT 
  COUNT(*) as visits_24h,
  COUNT(DISTINCT visitor_fingerprint) as unique_visitors_24h,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 hour' THEN 1 END) as visits_1h
FROM coversong_page_visits
WHERE created_at > NOW() - INTERVAL '24 hours';

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_coversong_page_visits_date ON coversong_page_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_coversong_page_visits_fingerprint ON coversong_page_visits(visitor_fingerprint);
CREATE INDEX IF NOT EXISTS idx_coversong_page_visits_created_at ON coversong_page_visits(created_at);

-- RLS 정책 (보안)
ALTER TABLE coversong_page_visits ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 삽입 가능 (익명 방문자 추적용)
CREATE POLICY "Anyone can insert visit data" ON coversong_page_visits
  FOR INSERT WITH CHECK (true);

-- 통계는 인증된 사용자만 조회 가능
CREATE POLICY "Authenticated users can view visit data" ON coversong_page_visits
  FOR SELECT USING (auth.role() = 'authenticated');
