import { createClient } from '@supabase/supabase-js'
import {
  buildManagedSceneCopyText,
  clearManagedRequestId,
  findSceneById,
  getOrCreateManagedRequestId,
  hasManagedScenes,
  postgresJsonbText,
  sha256Hex
} from './rosKoBlockModel'

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

const managedReaderError = (code, message, cause = null) => ({
  code,
  message,
  cause
});

const getProjectionParagraphText = (paragraph) =>
  paragraph?.versions?.[paragraph.activeVersion]?.content ?? '';

const applyManagedSceneResult = (scene, managed) => {
  scene.paragraphs = managed.paragraphs;
  scene.managedSceneId = managed.managed_scene_id;
  scene.compositionRevisionId = managed.requested_composition_id;
  scene.managedReviewCompositionId = managed.review_composition_id;
  scene.managedViewKey = managed.display_mode === 'legacy' || managed.display_mode === 'legacy_browse'
    ? 'legacy'
    : managed.requested_composition_id;
  scene.generation = managed.generation;
  scene.canonicalBodySha256 = managed.composition.body_sha256;
  scene.projectionSha256 = managed.projection_sha256;
  scene.manifestSha256 = managed.composition.manifest_sha256;
  scene.terminalLf = managed.composition.terminal_lf;
  scene.managedReadOnly = Boolean(managed.read_only);
  scene.managedHistory = (managed.available_compositions || []).map((item) => ({
    compositionId: item.composition_id,
    revisionNo: item.revision_no,
    manuscriptVersion: item.manuscript_version,
    bodySha256: item.body_sha256,
    createdAt: item.created_at,
    isReview: Boolean(item.is_review)
  }));
  scene.managedLegacyAvailable = Boolean(managed.legacy_available);
};

const overlayManagedScenes = async (novel) => {
  const markedScenes = [];
  for (const act of novel?.acts || []) {
    for (const chapter of act.chapters || []) {
      for (const scene of chapter.scenes || []) {
        if (scene.storageModel === 'ros-ko-block-v1') markedScenes.push(scene);
      }
    }
  }

  // Before the feature is installed there is no marker and therefore no
  // managed lookup. Once a marker exists, every managed lookup is strict.
  if (markedScenes.length === 0) return { data: novel, error: null };

  for (const scene of markedScenes) {
    if (!scene.managedSceneId) {
      return {
        data: null,
        error: managedReaderError(
          'MANAGED_SCENE_MARKER_INCOMPLETE',
          `Managed Scene ${scene.id} has no managedSceneId.`
        )
      };
    }

    const { data: managed, error } = await supabase.rpc('ros_ko_get_scene', {
      p_managed_scene_id: scene.managedSceneId,
      p_composition_id: null,
      p_include_legacy: false
    });
    if (error || !managed) {
      return {
        data: null,
        error: managedReaderError(
          error?.code || 'MANAGED_SCENE_LOAD_FAILED',
          `Managed Scene ${scene.id} could not be loaded: ${error?.message || 'empty result'}`,
          error || null
        )
      };
    }
    if (managed.scene_id !== scene.id || managed.managed_scene_id !== scene.managedSceneId) {
      return {
        data: null,
        error: managedReaderError(
          'MANAGED_SCENE_IDENTITY_MISMATCH',
          `Managed Scene identity mismatch for ${scene.id}.`
        )
      };
    }
    if (!Array.isArray(managed.paragraphs) || managed.paragraphs.length !== managed.composition?.block_count) {
      return {
        data: null,
        error: managedReaderError(
          'MANAGED_SCENE_BLOCK_COUNT_MISMATCH',
          `Managed Scene ${scene.id} projection count does not match its composition.`
        )
      };
    }

    const projectionHash = await sha256Hex(postgresJsonbText(managed.paragraphs));
    const body = buildManagedSceneCopyText(
      { paragraphs: managed.paragraphs },
      {},
      getProjectionParagraphText
    );
    const bodyHash = await sha256Hex(body);
    if (projectionHash !== managed.projection_sha256 || bodyHash !== managed.composition?.body_sha256) {
      return {
        data: null,
        error: managedReaderError(
          'MANAGED_SCENE_PROJECTION_INTEGRITY_FAILED',
          `Managed Scene ${scene.id} projection/body hash verification failed.`
        )
      };
    }

    applyManagedSceneResult(scene, managed);
  }

  return { data: novel, error: null };
};

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
      .not('slug', 'like', '%-act-%')
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
      .select('id, slug, data')
      .eq('slug', slug)
      .single();
    
    if (mainError || !mainData) {
      return {
        data: null,
        error: mainError || {
          code: 'NOVEL_DOCUMENT_NOT_FOUND',
          message: `Reader document not found: ${slug}`
        },
        meta: { requestedSlug: slug, loadedSlug: null }
      };
    }

    if (mainData.id !== slug || mainData.slug !== slug) {
      return {
        data: null,
        error: {
          code: 'NOVEL_DOCUMENT_IDENTITY_MISMATCH',
          message: `Reader row identity mismatch: requested ${slug}, received id=${mainData.id || 'unknown'} slug=${mainData.slug || 'unknown'}`
        },
        meta: {
          requestedSlug: slug,
          loadedSlug: mainData.slug || null,
          documentId: mainData.id || null,
          complete: false
        }
      };
    }

    const novel = mainData.data ? JSON.parse(JSON.stringify(mainData.data)) : null;
    if (!novel) {
      return {
        data: null,
        error: {
          code: 'NOVEL_DOCUMENT_EMPTY',
          message: `Reader document payload is empty: ${slug}`
        },
        meta: { requestedSlug: slug, loadedSlug: mainData.slug }
      };
    }

    // 일부 구형 권별 문서는 payload.id가 과거 논리 ID를 유지한다.
    // 행 id/slug와 payload.slug를 언어·문서 식별의 권위값으로 사용하고,
    // payload.slug가 없는 legacy 문서에서만 payload.id를 보조 식별자로 검사한다.
    const payloadIdentityMismatch = novel.slug
      ? novel.slug !== slug
      : Boolean(novel.id && novel.id !== slug);

    if (payloadIdentityMismatch) {
      return {
        data: null,
        error: {
          code: 'NOVEL_PAYLOAD_IDENTITY_MISMATCH',
          message: `Reader payload identity mismatch: requested ${slug}, received id=${novel.id || 'unknown'} slug=${novel.slug || 'unknown'}`
        },
        meta: {
          requestedSlug: slug,
          loadedSlug: mainData.slug,
          documentId: mainData.id,
          payloadId: novel.id || null,
          payloadSlug: novel.slug || null,
          complete: false
        }
      };
    }

    // 만약 novel.acts가 존재하고 길이가 1 이상이라면, 파편화된 행들을 불러와 합친다.
    if (novel && novel.acts && novel.acts.length > 0) {
      const actSlugs = novel.acts.map(act => `${slug}-act-${act.number}`);
      
      const { data: actRows, error: actError } = await supabase
        .from('novel_documents')
        .select('id, slug, data')
        .in('slug', actSlugs);

      if (actError) {
        return {
          data: null,
          error: {
            ...actError,
            code: actError.code || 'NOVEL_FRAGMENT_QUERY_FAILED',
            message: `Reader ACT fragment query failed for ${slug}: ${actError.message || 'unknown error'}`
          },
          meta: {
            requestedSlug: slug,
            loadedSlug: mainData.slug,
            documentId: mainData.id,
            complete: false
          }
        };
      }

      const rowsBySlug = new Map((actRows || []).map(row => [row.slug, row]));
      const missingRequiredFragments = [];
      const invalidFragments = [];
      const duplicateActNumbers = novel.acts
        .map(act => act.number)
        .filter((number, index, numbers) => numbers.indexOf(number) !== index);

      if (duplicateActNumbers.length > 0) {
        return {
          data: null,
          error: {
            code: 'NOVEL_ACT_NUMBER_DUPLICATE',
            message: `Reader root contains duplicate ACT numbers for ${slug}: ${[...new Set(duplicateActNumbers)].join(', ')}`
          },
          meta: {
            requestedSlug: slug,
            loadedSlug: mainData.slug,
            documentId: mainData.id,
            complete: false
          }
        };
      }

      novel.acts = novel.acts.map(actStub => {
        const actSlug = `${slug}-act-${actStub.number}`;
        const row = rowsBySlug.get(actSlug);

        if (!row) {
          // chapters를 자체 보유한 legacy inline ACT는 fragment 없이도 유효하다.
          if (!Object.prototype.hasOwnProperty.call(actStub, 'chapters')) {
            missingRequiredFragments.push(actSlug);
          }
          return actStub;
        }

        if (row.id !== actSlug || row.slug !== actSlug || !row.data || row.data.number !== actStub.number) {
          invalidFragments.push(actSlug);
          return actStub;
        }

        return row.data;
      });

      if (missingRequiredFragments.length > 0 || invalidFragments.length > 0) {
        const details = [
          missingRequiredFragments.length > 0 ? `missing: ${missingRequiredFragments.join(', ')}` : null,
          invalidFragments.length > 0 ? `invalid: ${invalidFragments.join(', ')}` : null
        ].filter(Boolean).join('; ');

        return {
          data: null,
          error: {
            code: 'NOVEL_FRAGMENT_INCOMPLETE',
            message: `Reader ACT fragments are incomplete for ${slug} (${details})`
          },
          meta: {
            requestedSlug: slug,
            loadedSlug: mainData.slug,
            documentId: mainData.id,
            missingRequiredFragments,
            invalidFragments,
            complete: false
          }
        };
      }
    }

    const managedOverlay = await overlayManagedScenes(novel);
    if (managedOverlay.error) {
      return {
        data: null,
        error: managedOverlay.error,
        meta: {
          requestedSlug: slug,
          loadedSlug: mainData.slug,
          documentId: mainData.id,
          complete: false
        }
      };
    }
    
    return {
      data: managedOverlay.data,
      error: null,
      meta: {
        requestedSlug: slug,
        loadedSlug: mainData.slug,
        documentId: mainData.id,
        payloadId: novel.id || null,
        payloadSlug: novel.slug || null,
        fragmentCount: Array.isArray(novel.acts) ? novel.acts.length : 0,
        complete: true
      }
    };
  },

  // 소설 덮어쓰기 (업데이트 - 파편화 지원)
  async saveNovel(novelDetails) {
    if (hasManagedScenes(novelDetails)) {
      const error = managedReaderError(
        'MANAGED_SCENE_REQUIRES_TARGETED_RPC',
        'This Reader contains a managed block Scene. Whole-novel save is disabled; use the targeted block API.'
      );
      console.error(error.message);
      return { data: null, error };
    }

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
  },

  async rewriteManagedBlock({ scene, paragraph, newBody, note }) {
    if (
      scene?.storageModel !== 'ros-ko-block-v1' ||
      paragraph?.storageModel !== 'ros-ko-block-v1' ||
      !scene.managedSceneId ||
      !scene.compositionRevisionId ||
      !scene.projectionSha256 ||
      !paragraph.revisionVersionId
    ) {
      return {
        data: null,
        error: managedReaderError(
          'MANAGED_REWRITE_SCOPE_INCOMPLETE',
          'Managed block identity or optimistic-concurrency fields are incomplete.'
        )
      };
    }

    const parentBody = getProjectionParagraphText(paragraph);
    const parentBodySha256 = await sha256Hex(parentBody);
    const newBodySha256 = await sha256Hex(newBody);
    const newBodyBytes = new TextEncoder().encode(newBody).length;
    const retry = await getOrCreateManagedRequestId({
      managedSceneId: scene.managedSceneId,
      generation: scene.generation,
      compositionId: scene.compositionRevisionId,
      blockUnitId: paragraph.unitId || paragraph.id,
      parentVersionId: paragraph.revisionVersionId,
      parentBodySha256,
      projectionSha256: scene.projectionSha256,
      newBodyBytes,
      newBodySha256,
      note: note || ''
    });

    const { data, error } = await supabase.rpc('ros_ko_rewrite_block', {
      p_request_id: retry.requestId,
      p_managed_scene_id: scene.managedSceneId,
      p_expected_generation: scene.generation,
      p_expected_composition_id: scene.compositionRevisionId,
      p_block_unit_id: paragraph.unitId || paragraph.id,
      p_expected_parent_version_id: paragraph.revisionVersionId,
      p_expected_parent_body_sha256: parentBodySha256,
      p_expected_projection_sha256: scene.projectionSha256,
      p_new_body: newBody,
      p_note: note || ''
    });

    if (error) return { data: null, error, requestId: retry.requestId };
    clearManagedRequestId(retry.key);
    return { data, error: null, requestId: retry.requestId };
  },

  async getManagedSceneRevision(scene, viewKey) {
    if (scene?.storageModel !== 'ros-ko-block-v1' || !scene.managedSceneId) {
      return { data: null, error: managedReaderError('MANAGED_SCENE_SCOPE_INCOMPLETE', 'Managed Scene identity is incomplete.') };
    }

    const request = viewKey === 'legacy'
      ? supabase.rpc('ros_ko_get_legacy_scene', { p_managed_scene_id: scene.managedSceneId })
      : supabase.rpc('ros_ko_get_scene', {
          p_managed_scene_id: scene.managedSceneId,
          p_composition_id: viewKey,
          p_include_legacy: false
        });
    const { data, error } = await request;
    if (error || !data) return { data: null, error: error || managedReaderError('MANAGED_SCENE_LOAD_FAILED', 'Empty managed Scene result.') };

    const projectionHash = await sha256Hex(postgresJsonbText(data.paragraphs));
    const body = buildManagedSceneCopyText({ paragraphs: data.paragraphs }, {}, getProjectionParagraphText);
    const bodyHash = await sha256Hex(body);
    if (projectionHash !== data.projection_sha256 || bodyHash !== data.composition?.body_sha256) {
      return { data: null, error: managedReaderError('MANAGED_SCENE_PROJECTION_INTEGRITY_FAILED', 'Selected managed revision failed integrity verification.') };
    }

    const nextScene = JSON.parse(JSON.stringify(scene));
    applyManagedSceneResult(nextScene, data);
    return { data: nextScene, error: null };
  },

  // 에이전트 매직 링크 발급
  async createAgentToken(agentId, novelSlug) {
    // 32-character random hex for token
    const crypto = globalThis.crypto || require('crypto');
    const array = new Uint8Array(16);
    if (crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        // Fallback for node
        const r = crypto.randomBytes(16);
        for(let i=0; i<16; i++) array[i] = r[i];
    }
    const token = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1개월 뒤 만료

    const { data, error } = await supabase
      .from('agent_access_tokens')
      .insert([
        {
          agent_id: agentId,
          novel_slug: novelSlug,
          token: token,
          expires_at: expiresAt.toISOString(),
          is_active: true
        }
      ])
      .select()
      .single();

    return { data, error };
  },

  // 에이전트 토큰 검증
  async validateAgentToken(token) {
    const { data, error } = await supabase
      .from('agent_access_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (error || !data) return { data: null, error: error || new Error('Invalid token') };

    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return { data: null, error: new Error('Token expired') };
    }

    return { data, error: null };
  },

  // 읽음 시간 업데이트
  async updateTokenAccessTime(token) {
    const { error } = await supabase
      .from('agent_access_tokens')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('token', token);
    return { error };
  },

  // 활성 토큰 확인 (UI 표시용)
  async checkActiveAgentToken(agentId) {
    const { data, error } = await supabase
      .from('agent_access_tokens')
      .select('*')
      .eq('agent_id', agentId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // 유효기간 지났으면 비활성 취급
    if (data && new Date(data.expires_at) < new Date()) {
      return { data: null, error: null };
    }
    return { data, error };
  },

  // 링크 파기 (비활성화)
  async revokeAgentToken(agentId) {
    const { data, error } = await supabase
      .from('agent_access_tokens')
      .update({ is_active: false })
      .eq('agent_id', agentId)
      .eq('is_active', true)
      .select();
    return { data, error };
  }
}
