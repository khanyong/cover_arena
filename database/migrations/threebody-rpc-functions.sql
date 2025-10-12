-- RPC 함수들 (Supabase에서 호출할 수 있는 PostgreSQL 함수)

-- 면벽 계획 좋아요 증가
CREATE OR REPLACE FUNCTION increment_plan_likes(plan_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_wallfacer_plans
  SET likes_count = likes_count + 1
  WHERE id = plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 면벽 계획 좋아요 감소
CREATE OR REPLACE FUNCTION decrement_plan_likes(plan_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_wallfacer_plans
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 토론 좋아요 증가
CREATE OR REPLACE FUNCTION increment_discussion_likes(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_discussions
  SET likes_count = likes_count + 1
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 토론 좋아요 감소
CREATE OR REPLACE FUNCTION decrement_discussion_likes(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_discussions
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 토론 댓글 수 증가
CREATE OR REPLACE FUNCTION increment_discussion_comments(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_discussions
  SET comments_count = comments_count + 1
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 토론 댓글 수 감소
CREATE OR REPLACE FUNCTION decrement_discussion_comments(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_discussions
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 댓글 좋아요 증가
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 댓글 좋아요 감소
CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threebody_comments
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
