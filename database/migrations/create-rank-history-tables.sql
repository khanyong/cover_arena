-- 순위 히스토리 추적을 위한 테이블 생성

-- 1. 일별 순위 스냅샷 테이블
CREATE TABLE IF NOT EXISTS coversong_rank_history (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  rank INTEGER NOT NULL,
  site_score NUMERIC(10, 2),
  arena_likes INTEGER,
  youtube_likes INTEGER,
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 인덱스를 위한 복합키
  UNIQUE(video_id, competition_id, recorded_date)
);

-- 2. 순위 변동 추적 테이블 (기간별)
CREATE TABLE IF NOT EXISTS coversong_rank_changes (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'total'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  start_rank INTEGER,
  end_rank INTEGER,
  rank_change INTEGER, -- 양수: 상승, 음수: 하락
  max_rank INTEGER, -- 해당 기간 최고 순위
  min_rank INTEGER, -- 해당 기간 최저 순위
  is_new_entry BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 인덱스를 위한 복합키
  UNIQUE(video_id, competition_id, period_type, period_end)
);

-- 3. 급상승 영상 기록 테이블
CREATE TABLE IF NOT EXISTS coversong_rising_stars (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  competition_id INTEGER REFERENCES coversong_competitions(id),
  category TEXT NOT NULL, -- 'daily_rising', 'weekly_rising', 'new_entry'
  rank_position INTEGER NOT NULL, -- 1위, 2위, 3위 등
  rank_change INTEGER,
  recorded_date DATE NOT NULL,
  video_title TEXT,
  channel TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 인덱스를 위한 복합키
  UNIQUE(category, rank_position, recorded_date, competition_id)
);

-- 인덱스 생성
CREATE INDEX idx_rank_history_video_date ON coversong_rank_history(video_id, recorded_date);
CREATE INDEX idx_rank_history_competition ON coversong_rank_history(competition_id, recorded_date);
CREATE INDEX idx_rank_changes_video ON coversong_rank_changes(video_id, competition_id);
CREATE INDEX idx_rank_changes_period ON coversong_rank_changes(period_type, period_end);
CREATE INDEX idx_rising_stars_date ON coversong_rising_stars(recorded_date, category);

-- RLS 정책 설정
ALTER TABLE coversong_rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coversong_rank_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coversong_rising_stars ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view rank history" ON coversong_rank_history
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view rank changes" ON coversong_rank_changes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view rising stars" ON coversong_rising_stars
  FOR SELECT USING (true);

-- 관리자만 수정 가능
CREATE POLICY "Admin can manage rank history" ON coversong_rank_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admin can manage rank changes" ON coversong_rank_changes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admin can manage rising stars" ON coversong_rising_stars
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 순위 히스토리 기록 함수
CREATE OR REPLACE FUNCTION record_daily_ranks()
RETURNS void AS $$
BEGIN
  -- 현재 활성 competition 찾기
  WITH active_comp AS (
    SELECT id FROM coversong_competitions 
    WHERE status = 'active' 
    LIMIT 1
  )
  -- 오늘의 순위 기록
  INSERT INTO coversong_rank_history (
    video_id, competition_id, rank, site_score, 
    arena_likes, youtube_likes, recorded_date
  )
  SELECT 
    v.id,
    ac.id,
    ROW_NUMBER() OVER (ORDER BY v.site_score DESC) as rank,
    v.site_score,
    v.arena_likes,
    v.likes as youtube_likes,
    CURRENT_DATE
  FROM coversong_videos v
  CROSS JOIN active_comp ac
  WHERE v.competition_id = ac.id
  ON CONFLICT (video_id, competition_id, recorded_date) 
  DO UPDATE SET
    rank = EXCLUDED.rank,
    site_score = EXCLUDED.site_score,
    arena_likes = EXCLUDED.arena_likes,
    youtube_likes = EXCLUDED.youtube_likes;
END;
$$ LANGUAGE plpgsql;

-- 순위 변동 계산 함수
CREATE OR REPLACE FUNCTION calculate_rank_changes(
  p_competition_id INTEGER,
  p_period_type TEXT,
  p_period_days INTEGER DEFAULT 1
)
RETURNS void AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
BEGIN
  v_period_end := CURRENT_DATE;
  v_period_start := v_period_end - INTERVAL '1 day' * p_period_days;
  
  -- 기간별 순위 변동 계산
  INSERT INTO coversong_rank_changes (
    video_id, competition_id, period_type,
    period_start, period_end,
    start_rank, end_rank, rank_change,
    max_rank, min_rank, is_new_entry
  )
  WITH period_ranks AS (
    SELECT 
      video_id,
      MIN(CASE WHEN recorded_date = v_period_start THEN rank END) as start_rank,
      MAX(CASE WHEN recorded_date = v_period_end THEN rank END) as end_rank,
      MIN(rank) as min_rank,
      MAX(rank) as max_rank
    FROM coversong_rank_history
    WHERE competition_id = p_competition_id
      AND recorded_date BETWEEN v_period_start AND v_period_end
    GROUP BY video_id
  )
  SELECT 
    video_id,
    p_competition_id,
    p_period_type,
    v_period_start,
    v_period_end,
    start_rank,
    end_rank,
    CASE 
      WHEN start_rank IS NULL THEN NULL
      ELSE start_rank - end_rank
    END as rank_change,
    max_rank,
    min_rank,
    start_rank IS NULL as is_new_entry
  FROM period_ranks
  WHERE end_rank IS NOT NULL
  ON CONFLICT (video_id, competition_id, period_type, period_end)
  DO UPDATE SET
    start_rank = EXCLUDED.start_rank,
    end_rank = EXCLUDED.end_rank,
    rank_change = EXCLUDED.rank_change,
    max_rank = EXCLUDED.max_rank,
    min_rank = EXCLUDED.min_rank,
    is_new_entry = EXCLUDED.is_new_entry;
END;
$$ LANGUAGE plpgsql;

-- 급상승 영상 선정 함수
CREATE OR REPLACE FUNCTION select_rising_stars(
  p_competition_id INTEGER
)
RETURNS void AS $$
BEGIN
  -- 일일 급상승 TOP 3
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail
  )
  SELECT 
    rc.video_id,
    rc.competition_id,
    'daily_rising',
    ROW_NUMBER() OVER (ORDER BY rc.rank_change DESC),
    rc.rank_change,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail
  FROM coversong_rank_changes rc
  JOIN coversong_videos v ON v.id = rc.video_id
  WHERE rc.competition_id = p_competition_id
    AND rc.period_type = 'daily'
    AND rc.period_end = CURRENT_DATE
    AND rc.rank_change > 0
    AND NOT rc.is_new_entry
  ORDER BY rc.rank_change DESC
  LIMIT 3
  ON CONFLICT (category, rank_position, recorded_date, competition_id)
  DO UPDATE SET
    video_id = EXCLUDED.video_id,
    rank_change = EXCLUDED.rank_change,
    video_title = EXCLUDED.video_title,
    channel = EXCLUDED.channel,
    thumbnail = EXCLUDED.thumbnail;
  
  -- 주간 급상승 TOP 3
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail
  )
  SELECT 
    rc.video_id,
    rc.competition_id,
    'weekly_rising',
    ROW_NUMBER() OVER (ORDER BY rc.rank_change DESC),
    rc.rank_change,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail
  FROM coversong_rank_changes rc
  JOIN coversong_videos v ON v.id = rc.video_id
  WHERE rc.competition_id = p_competition_id
    AND rc.period_type = 'weekly'
    AND rc.period_end = CURRENT_DATE
    AND rc.rank_change > 0
    AND NOT rc.is_new_entry
  ORDER BY rc.rank_change DESC
  LIMIT 3
  ON CONFLICT (category, rank_position, recorded_date, competition_id)
  DO UPDATE SET
    video_id = EXCLUDED.video_id,
    rank_change = EXCLUDED.rank_change,
    video_title = EXCLUDED.video_title,
    channel = EXCLUDED.channel,
    thumbnail = EXCLUDED.thumbnail;
  
  -- 신규 진입 TOP 3
  INSERT INTO coversong_rising_stars (
    video_id, competition_id, category, rank_position,
    rank_change, recorded_date, video_title, channel, thumbnail
  )
  SELECT 
    rc.video_id,
    rc.competition_id,
    'new_entry',
    ROW_NUMBER() OVER (ORDER BY rc.end_rank ASC),
    NULL,
    CURRENT_DATE,
    v.title,
    v.channel,
    v.thumbnail
  FROM coversong_rank_changes rc
  JOIN coversong_videos v ON v.id = rc.video_id
  WHERE rc.competition_id = p_competition_id
    AND rc.period_type = 'daily'
    AND rc.period_end = CURRENT_DATE
    AND rc.is_new_entry = true
  ORDER BY rc.end_rank ASC
  LIMIT 3
  ON CONFLICT (category, rank_position, recorded_date, competition_id)
  DO UPDATE SET
    video_id = EXCLUDED.video_id,
    video_title = EXCLUDED.video_title,
    channel = EXCLUDED.channel,
    thumbnail = EXCLUDED.thumbnail;
END;
$$ LANGUAGE plpgsql;

-- 매일 자동 실행을 위한 통합 함수
CREATE OR REPLACE FUNCTION daily_rank_update()
RETURNS void AS $$
DECLARE
  v_competition_id INTEGER;
BEGIN
  -- 현재 활성 competition 찾기
  SELECT id INTO v_competition_id
  FROM coversong_competitions
  WHERE status = 'active'
  LIMIT 1;
  
  IF v_competition_id IS NOT NULL THEN
    -- 1. 오늘의 순위 기록
    PERFORM record_daily_ranks();
    
    -- 2. 일일 순위 변동 계산
    PERFORM calculate_rank_changes(v_competition_id, 'daily', 1);
    
    -- 3. 주간 순위 변동 계산 (일요일마다)
    IF EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN
      PERFORM calculate_rank_changes(v_competition_id, 'weekly', 7);
    END IF;
    
    -- 4. 전체 기간 순위 변동 계산
    PERFORM calculate_rank_changes(v_competition_id, 'total', 
      (SELECT CURRENT_DATE - DATE(start_time) 
       FROM coversong_competitions 
       WHERE id = v_competition_id)::INTEGER
    );
    
    -- 5. 급상승 영상 선정
    PERFORM select_rising_stars(v_competition_id);
  END IF;
END;
$$ LANGUAGE plpgsql;