import { supabase } from './supabase'

// ============ 면벽 계획 (Wallfacer Plans) ============

export const wallfacerPlans = {
  // 모든 계획 가져오기
  async getPlans(sortBy = 'created_at', limit = 50) {
    const { data, error } = await supabase
      .from('threebody_wallfacer_plans')
      .select('*')
      .order(sortBy, { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // 특정 계획 가져오기
  async getPlan(id) {
    const { data, error } = await supabase
      .from('threebody_wallfacer_plans')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      // 조회수 증가
      await supabase
        .from('threebody_wallfacer_plans')
        .update({ views_count: data.views_count + 1 })
        .eq('id', id)
    }

    return { data, error }
  },

  // 새 계획 추가
  async createPlan(plan) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { data, error } = await supabase
      .from('threebody_wallfacer_plans')
      .insert([{
        user_id: user.data.user.id,
        username: user.data.user.user_metadata?.username || user.data.user.email,
        ...plan
      }])
      .select()

    return { data, error }
  },

  // 계획 수정
  async updatePlan(id, updates) {
    const { data, error } = await supabase
      .from('threebody_wallfacer_plans')
      .update(updates)
      .eq('id', id)
      .select()

    return { data, error }
  },

  // 계획 삭제
  async deletePlan(id) {
    const { error } = await supabase
      .from('threebody_wallfacer_plans')
      .delete()
      .eq('id', id)

    return { error }
  },

  // 계획 좋아요
  async likePlan(planId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    // 좋아요 추가
    const { error: likeError } = await supabase
      .from('threebody_plan_likes')
      .insert([{ plan_id: planId, user_id: user.data.user.id }])

    if (likeError) {
      if (likeError.code === '23505') {
        // 이미 좋아요를 눌렀다면 취소
        return await wallfacerPlans.unlikePlan(planId)
      }
      return { error: likeError }
    }

    // 좋아요 수 증가
    const { error } = await supabase.rpc('increment_plan_likes', { plan_id: planId })

    return { error }
  },

  // 좋아요 취소
  async unlikePlan(planId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { error: unlikeError } = await supabase
      .from('threebody_plan_likes')
      .delete()
      .eq('plan_id', planId)
      .eq('user_id', user.data.user.id)

    if (unlikeError) return { error: unlikeError }

    // 좋아요 수 감소
    const { error } = await supabase.rpc('decrement_plan_likes', { plan_id: planId })

    return { error }
  },

  // 사용자가 좋아요를 눌렀는지 확인
  async checkUserLike(planId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return { data: false, error: null }

    const { data, error } = await supabase
      .from('threebody_plan_likes')
      .select('id')
      .eq('plan_id', planId)
      .eq('user_id', user.data.user.id)
      .single()

    return { data: !!data, error: null }
  }
}

// ============ 토론 게시판 (Discussions) ============

export const discussions = {
  // 토론 목록 가져오기
  async getDiscussions(section = null, sortBy = 'created_at', limit = 50) {
    let query = supabase
      .from('threebody_discussions')
      .select('*')
      .order(sortBy, { ascending: false })
      .limit(limit)

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query
    return { data, error }
  },

  // 특정 토론 가져오기
  async getDiscussion(id) {
    const { data, error } = await supabase
      .from('threebody_discussions')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      // 조회수 증가
      await supabase
        .from('threebody_discussions')
        .update({ views_count: data.views_count + 1 })
        .eq('id', id)
    }

    return { data, error }
  },

  // 새 토론 생성
  async createDiscussion(discussion) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { data, error } = await supabase
      .from('threebody_discussions')
      .insert([{
        user_id: user.data.user.id,
        username: user.data.user.user_metadata?.username || user.data.user.email,
        ...discussion
      }])
      .select()

    return { data, error }
  },

  // 토론 수정
  async updateDiscussion(id, updates) {
    const { data, error } = await supabase
      .from('threebody_discussions')
      .update(updates)
      .eq('id', id)
      .select()

    return { data, error }
  },

  // 토론 삭제
  async deleteDiscussion(id) {
    const { error } = await supabase
      .from('threebody_discussions')
      .delete()
      .eq('id', id)

    return { error }
  },

  // 토론 좋아요
  async likeDiscussion(discussionId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { error: likeError } = await supabase
      .from('threebody_discussion_likes')
      .insert([{ discussion_id: discussionId, user_id: user.data.user.id }])

    if (likeError) {
      if (likeError.code === '23505') {
        return await discussions.unlikeDiscussion(discussionId)
      }
      return { error: likeError }
    }

    const { error } = await supabase.rpc('increment_discussion_likes', { discussion_id: discussionId })
    return { error }
  },

  // 좋아요 취소
  async unlikeDiscussion(discussionId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { error: unlikeError } = await supabase
      .from('threebody_discussion_likes')
      .delete()
      .eq('discussion_id', discussionId)
      .eq('user_id', user.data.user.id)

    if (unlikeError) return { error: unlikeError }

    const { error } = await supabase.rpc('decrement_discussion_likes', { discussion_id: discussionId })
    return { error }
  }
}

// ============ 댓글 (Comments) ============

export const comments = {
  // 토론의 댓글 가져오기
  async getComments(discussionId) {
    const { data, error } = await supabase
      .from('threebody_comments')
      .select('*')
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true })

    return { data, error }
  },

  // 새 댓글 추가
  async createComment(comment) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { data, error } = await supabase
      .from('threebody_comments')
      .insert([{
        user_id: user.data.user.id,
        username: user.data.user.user_metadata?.username || user.data.user.email,
        ...comment
      }])
      .select()

    if (!error) {
      // 토론의 댓글 수 증가
      await supabase.rpc('increment_discussion_comments', { discussion_id: comment.discussion_id })
    }

    return { data, error }
  },

  // 댓글 수정
  async updateComment(id, content) {
    const { data, error } = await supabase
      .from('threebody_comments')
      .update({ content })
      .eq('id', id)
      .select()

    return { data, error }
  },

  // 댓글 삭제
  async deleteComment(id, discussionId) {
    const { error } = await supabase
      .from('threebody_comments')
      .delete()
      .eq('id', id)

    if (!error) {
      await supabase.rpc('decrement_discussion_comments', { discussion_id: discussionId })
    }

    return { error }
  },

  // 댓글 좋아요
  async likeComment(commentId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { error: likeError } = await supabase
      .from('threebody_comment_likes')
      .insert([{ comment_id: commentId, user_id: user.data.user.id }])

    if (likeError) {
      if (likeError.code === '23505') {
        return await comments.unlikeComment(commentId)
      }
      return { error: likeError }
    }

    const { error } = await supabase.rpc('increment_comment_likes', { comment_id: commentId })
    return { error }
  },

  // 좋아요 취소
  async unlikeComment(commentId) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    const { error: unlikeError } = await supabase
      .from('threebody_comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.data.user.id)

    if (unlikeError) return { error: unlikeError }

    const { error } = await supabase.rpc('decrement_comment_likes', { comment_id: commentId })
    return { error }
  }
}

// ============ 전략 투표 (Strategy Votes) ============

export const strategyVotes = {
  // 투표 결과 가져오기
  async getVoteResults(category) {
    const { data, error } = await supabase
      .from('threebody_strategy_votes')
      .select('option_value')
      .eq('category', category)

    if (error) return { data: null, error }

    // 집계
    const results = {}
    data.forEach(vote => {
      results[vote.option_value] = (results[vote.option_value] || 0) + 1
    })

    return { data: results, error: null }
  },

  // 투표하기
  async vote(category, optionValue) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return { error: { message: '로그인이 필요합니다.' } }
    }

    // Upsert (이미 투표했으면 업데이트)
    const { data, error } = await supabase
      .from('threebody_strategy_votes')
      .upsert([{
        category,
        option_value: optionValue,
        user_id: user.data.user.id
      }], { onConflict: 'category,user_id' })

    return { data, error }
  },

  // 사용자의 투표 가져오기
  async getUserVote(category) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return { data: null, error: null }

    const { data, error } = await supabase
      .from('threebody_strategy_votes')
      .select('option_value')
      .eq('category', category)
      .eq('user_id', user.data.user.id)
      .single()

    return { data: data?.option_value, error: null }
  }
}
