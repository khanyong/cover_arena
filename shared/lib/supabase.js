import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드에서만 사용할 service role client (RLS 우회)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

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
      .update({ votes_count: supabase.sql`votes_count + 1` })
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

// 소설 연동 관련 함수들
export const novels = {
  // 모든 소설(목록) 불러오기 (메타데이터 위주)
  async getAllNovels() {
    const { data, error } = await supabase
      .from('novel_documents')
      .select('id, slug, title, data')
      .order('id', { ascending: true });
    
    return { data, error };
  },

  // 새 소설(권) 생성하기
  async createNovel(novelDetails) {
    const { data, error } = await supabase
      .from('novel_documents')
      .insert([
        {
          id: novelDetails.slug,
          slug: novelDetails.slug,
          title: novelDetails.title,
          data: novelDetails
        }
      ])
      .select();
    
    return { data, error };
  },

  // 특정 slug의 소설 불러오기 (파편화 지원)
  async getNovelBySlug(slug) {
    const { data: mainData, error: mainError } = await supabase
      .from('novel_documents')
      .select('data')
      .eq('slug', slug)
      .single();
    
    if (mainError || !mainData) {
      return { data: null, error: mainError };
    }

    const novel = mainData.data;

    // 만약 novel.acts가 존재하고 길이가 1 이상이라면, 파편화된 행들을 불러와 합친다.
    if (novel && novel.acts && novel.acts.length > 0) {
      const actSlugs = novel.acts.map(act => `${slug}-act-${act.number}`);
      
      const { data: actRows, error: actError } = await supabase
        .from('novel_documents')
        .select('slug, data')
        .in('slug', actSlugs);

      if (actRows && actRows.length > 0) {
        novel.acts = novel.acts.map(actStub => {
          const row = actRows.find(r => r.slug === `${slug}-act-${actStub.number}`);
          // 만약 DB에서 행을 찾으면 그것을 반환하고, 아니면 껍데기(stub) 유지
          return row ? row.data : actStub;
        });
      }
    }
    
    return { data: novel, error: null };
  },

  // 소설 덮어쓰기 (업데이트 - 파편화 지원)
  async saveNovel(novelDetails) {
    // 1. 소설 객체에서 acts 분리
    const fullActs = novelDetails.acts || [];
    
    // 메인 문서에는 acts의 껍데기(메타데이터)만 남겨서 용량을 최소화
    const mainNovel = {
      ...novelDetails,
      acts: fullActs.map(act => ({
        id: act.id,
        number: act.number,
        title: act.title,
        synopsis: act.synopsis || ''
      }))
    };

    // 2. 메인 문서 저장 (업데이트)
    const { data: mainResult, error: mainError } = await supabase
      .from('novel_documents')
      .update({ 
        data: mainNovel,
        title: mainNovel.title,
        updated_at: new Date().toISOString()
      })
      .eq('slug', mainNovel.slug);
      
    if (mainError) {
      console.error("Main novel save error:", mainError);
      return { data: null, error: mainError };
    }

    // 3. 분리된 Acts들을 각각의 행으로 병렬 저장 (upsert)
    // 15초 타임아웃을 우회하기 위해 Act별로 별도의 Row를 가짐
    if (fullActs.length > 0) {
      const actPromises = fullActs.map(act => {
        const actSlug = `${mainNovel.slug}-act-${act.number}`;
        return supabase
          .from('novel_documents')
          .upsert({
            id: actSlug, // primary key
            slug: actSlug,
            title: `${mainNovel.title} - Act ${act.number}`,
            data: act,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
      });

      try {
        await Promise.all(actPromises);
      } catch (e) {
        console.error("Act save error:", e);
      }
    }
    
    return { data: mainResult, error: null };
  }
}