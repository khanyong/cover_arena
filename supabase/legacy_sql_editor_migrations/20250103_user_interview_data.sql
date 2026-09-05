-- User Interview Questions and Answers Tables

-- Table for storing user's customized interview questions
CREATE TABLE IF NOT EXISTS univ_user_interview_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_question_id TEXT NOT NULL, -- Reference to the original question (e.g., "essential_1", "category_autonomous_1")
  question_type TEXT NOT NULL, -- "essential" or "category"
  category TEXT, -- Category name for category questions (e.g., "자율활동")
  custom_question TEXT NOT NULL, -- User's customized version of the question
  original_question TEXT NOT NULL, -- Original question for reference
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one entry per user per question
  UNIQUE(user_id, original_question_id)
);

-- Table for storing user's interview answers
CREATE TABLE IF NOT EXISTS univ_user_interview_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL, -- Reference to the question (same as original_question_id)
  answer TEXT NOT NULL, -- User's written answer
  keywords TEXT[], -- Array of keywords extracted from the answer
  time_spent INTEGER DEFAULT 0, -- Time spent writing in seconds
  is_completed BOOLEAN DEFAULT FALSE, -- Whether user considers this answer complete
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one answer per user per question
  UNIQUE(user_id, question_id)
);

-- Table for storing model answers reference (optional, for user to see)
CREATE TABLE IF NOT EXISTS univ_model_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  model_answer TEXT NOT NULL,
  keywords TEXT[],
  category TEXT,
  source TEXT, -- Source document reference (생활기록부 출처)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_univ_user_questions_user_id ON univ_user_interview_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_univ_user_questions_type ON univ_user_interview_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_univ_user_answers_user_id ON univ_user_interview_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_univ_user_answers_completed ON univ_user_interview_answers(is_completed);

-- Enable Row Level Security
ALTER TABLE univ_user_interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE univ_user_interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE univ_model_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for univ_user_interview_questions
CREATE POLICY "Users can view their own questions"
  ON univ_user_interview_questions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questions"
  ON univ_user_interview_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
  ON univ_user_interview_questions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions"
  ON univ_user_interview_questions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for univ_user_interview_answers
CREATE POLICY "Users can view their own answers"
  ON univ_user_interview_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers"
  ON univ_user_interview_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
  ON univ_user_interview_answers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers"
  ON univ_user_interview_answers FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for univ_model_answers (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view model answers"
  ON univ_model_answers FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at
CREATE TRIGGER update_univ_user_interview_questions_updated_at
  BEFORE UPDATE ON univ_user_interview_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_univ_user_interview_answers_updated_at
  BEFORE UPDATE ON univ_user_interview_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
