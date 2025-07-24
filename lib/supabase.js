import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 사용자 인증 관련 함수들
export const auth = {
  // 회원 가입
  async signUp(email, password, username) {
    let redirectTo = 'https://cover-arena.vercel.app/auth';
    if (typeof window !== 'undefined') {
      redirectTo = window.location.origin + '/auth';
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        },
        redirectTo
      }
    })
    return { data, error }
  },

  // 로그인
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 현재 사용자 가져오기
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 인증 상태 변경 감지
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// 주제 관련 함수들
export const topics = {
  // 주제 목록 가져오기
  async getTopics() {
    const { data, error } = await supabase
      .from('coversong_topics')
      .select('*')
      .order('votes_count', { ascending: false })
    return { data, error }
  },

  // 새 주제 추가
  async addTopic(topic) {
    const { data, error } = await supabase
      .from('coversong_topics')
      .insert([{ topic, votes_count: 0 }])
      .select()
    return { data, error }
  },

  // 주제 투표
  async voteTopic(topicId, userId) {
    // 중복 투표 방지를 위해 coversong_topic_votes 테이블에 기록
    const { error: voteError } = await supabase
      .from('coversong_topic_votes')
      .insert([{ user_id: userId, topic_id: topicId }])
    
    if (voteError && voteError.code !== '23505') { // 23505는 중복 키 오류
      return { error: voteError }
    }
    
    // 주제 투표 수 증가
    const { error } = await supabase
      .from('coversong_topics')
      .update({ votes_count: supabase.rpc('coversong_increment') })
      .eq('id', topicId)
    
    return { error }
  }
}

// Competition 관련 함수들
export const competitions = {
  // Competition 생성
  async createCompetition(topic, startTime, endTime) {
    const { data, error } = await supabase
      .from('coversong_competitions')
      .insert([
        {
          topic,
          start_time: startTime,
          end_time: endTime,
          status: 'preparing'
        }
      ])
      .select()
    return { data, error }
  },

  // Competition 상태 업데이트
  async updateCompetitionStatus(competitionId, status) {
    const { data, error } = await supabase
      .from('coversong_competitions')
      .update({ status })
      .eq('id', competitionId)
    return { data, error }
  },

  // 현재 활성 Competition 가져오기
  async getActiveCompetition() {
    const { data, error } = await supabase
      .from('coversong_competitions')
      .select('*')
      .eq('status', 'active')
      .single()
    return { data, error }
  }
}

// 투표 히스토리 관련 함수들
export const votingHistory = {
  // 투표 기록
  async recordVote(userId, videoId, competitionId) {
    const { data, error } = await supabase
      .from('coversong_voting_history')
      .insert([
        {
          user_id: userId,
          video_id: videoId,
          competition_id: competitionId
        }
      ])
    return { data, error }
  },

  // 사용자 투표 히스토리 가져오기
  async getUserVotingHistory(userId) {
    const { data, error } = await supabase
      .from('coversong_voting_history')
      .select('*, coversong_videos(*), coversong_competitions(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

// 비디오 관련 함수들
export const videos = {
  // 비디오 추가
  async addVideo(videoData, topic) {
    const { data, error } = await supabase
      .from('coversong_videos')
      .insert([
        {
          ...videoData,
          topic
        }
      ])
      .select()
    return { data, error }
  },

  // 주제별 비디오 목록 가져오기
  async getVideosByTopic(topic) {
    const { data, error } = await supabase
      .from('coversong_videos')
      .select('*')
      .eq('topic', topic)
      .order('arena_likes', { ascending: false })
    return { data, error }
  },

  // 비디오 Arena 좋아요 업데이트
  async updateArenaLikes(videoId, newLikes) {
    const { data, error } = await supabase
      .from('coversong_videos')
      .update({ arena_likes: newLikes })
      .eq('id', videoId)
    return { data, error }
  }
} 