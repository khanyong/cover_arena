import { supabase } from './supabase'

// 리뷰 생성
export async function createReview(reviewData) {
  const { data, error } = await supabase
    .from('coversong_reviews')
    .insert([reviewData])
    .select()
    .single()

  if (error) throw error
  return data
}

// 리뷰 업데이트
export async function updateReview(reviewId, updates) {
  const { data, error } = await supabase
    .from('coversong_reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single()

  if (error) throw error
  return data
}

// 비디오의 모든 리뷰 가져오기
export async function getVideoReviews(videoId, orderBy = 'created_at', ascending = false) {
  const { data, error } = await supabase
    .from('coversong_reviews')
    .select(`
      *,
      user:auth.users!user_id (
        id,
        email,
        raw_user_meta_data
      ),
      reactions:coversong_review_reactions (
        reaction_type,
        user_id
      ),
      comments:coversong_review_comments (
        id,
        comment_text,
        created_at,
        user:auth.users!user_id (
          id,
          email,
          raw_user_meta_data
        )
      )
    `)
    .eq('video_id', videoId)
    .order(orderBy, { ascending })

  if (error) throw error
  return data
}

// 특정 리뷰 가져오기
export async function getReview(reviewId) {
  const { data, error } = await supabase
    .from('coversong_reviews')
    .select(`
      *,
      user:auth.users!user_id (
        id,
        email,
        raw_user_meta_data
      ),
      reactions:coversong_review_reactions (
        reaction_type,
        user_id
      )
    `)
    .eq('id', reviewId)
    .single()

  if (error) throw error
  return data
}

// 사용자가 특정 비디오에 작성한 리뷰 확인
export async function getUserVideoReview(userId, videoId) {
  const { data, error } = await supabase
    .from('coversong_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116은 no rows found 에러
  return data
}

// 리뷰 삭제
export async function deleteReview(reviewId) {
  const { error } = await supabase
    .from('coversong_reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
  return true
}

// 댓글 생성
export async function createComment(commentData) {
  const { data, error } = await supabase
    .from('coversong_review_comments')
    .insert([commentData])
    .select(`
      *,
      user:auth.users!user_id (
        id,
        email,
        raw_user_meta_data
      )
    `)
    .single()

  if (error) throw error
  return data
}

// 댓글 업데이트
export async function updateComment(commentId, updates) {
  const { data, error } = await supabase
    .from('coversong_review_comments')
    .update({ ...updates, is_edited: true })
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw error
  return data
}

// 댓글 삭제
export async function deleteComment(commentId) {
  const { error } = await supabase
    .from('coversong_review_comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
  return true
}

// 리뷰에 대한 댓글 가져오기
export async function getReviewComments(reviewId) {
  const { data, error } = await supabase
    .from('coversong_review_comments')
    .select(`
      *,
      user:auth.users!user_id (
        id,
        email,
        raw_user_meta_data
      ),
      replies:coversong_review_comments!parent_id (
        *,
        user:auth.users!user_id (
          id,
          email,
          raw_user_meta_data
        )
      )
    `)
    .eq('review_id', reviewId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

// 리뷰 반응 추가/제거
export async function toggleReaction(reviewId, userId, reactionType) {
  // 먼저 기존 반응 확인
  const { data: existing } = await supabase
    .from('coversong_review_reactions')
    .select('*')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .eq('reaction_type', reactionType)
    .single()

  if (existing) {
    // 이미 있으면 제거
    const { error } = await supabase
      .from('coversong_review_reactions')
      .delete()
      .eq('id', existing.id)

    if (error) throw error
    return { action: 'removed' }
  } else {
    // 없으면 추가
    const { data, error } = await supabase
      .from('coversong_review_reactions')
      .insert([{ review_id: reviewId, user_id: userId, reaction_type: reactionType }])
      .select()
      .single()

    if (error) throw error
    return { action: 'added', data }
  }
}

// 비디오 리뷰 요약 정보 가져오기
export async function getVideoReviewSummary(videoId) {
  const { data, error } = await supabase
    .from('coversong_review_summary')
    .select('*')
    .eq('video_id', videoId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || {
    total_reviews: 0,
    avg_overall_rating: 0,
    avg_vocal_rating: 0,
    avg_emotion_rating: 0,
    avg_arrangement_rating: 0,
    avg_quality_rating: 0,
    unique_reviewers: 0,
    total_helpful_votes: 0
  }
}

// 리뷰어 통계 가져오기
export async function getReviewerStats(userId) {
  const { data, error } = await supabase
    .from('coversong_reviewer_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || {
    total_reviews: 0,
    total_helpful_received: 0,
    average_rating_given: 0,
    reviewer_level: 'beginner',
    trust_score: 50,
    badges: []
  }
}

// 상위 리뷰어 목록 가져오기
export async function getTopReviewers(limit = 10) {
  const { data, error } = await supabase
    .from('coversong_reviewer_stats')
    .select(`
      *,
      user:auth.users!user_id (
        id,
        email,
        raw_user_meta_data
      )
    `)
    .order('trust_score', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}