// === n8n Code Node - 최종처리 (순위 히스토리 업데이트 포함) ===

try {
  const SUPABASE_URL = 'https://iklsghevdtqqkjuaympc.supabase.co';
  const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbHNnaGV2ZHRxcWtqdWF5bXBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTIxNjQwOCwiZXhwIjoyMDYwNzkyNDA4fQ.W6uhuskvC_gWRRhpWs9tgsZMLrVwvCgGDALFY7y7nsM';

  function safeParseInt(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : Math.max(0, parsed);
  }

  // 날짜 유효성 검사 함수 (상단으로 이동)
  function isValidDate(dateString) {
    if (!dateString || dateString === '' || dateString === 'null') return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // === DEBUG: 입력 데이터 분석 ===
  console.log('=== 입력 데이터 분석 ===');
  console.log('Total items:', items.length);

  items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, {
      hasJson: !!item.json,
      jsonType: typeof item.json,
      isArray: Array.isArray(item.json),
      keys: item.json ? Object.keys(item.json).slice(0, 5) : [],
      hasId: item.json && !!item.json.id,
      hasTopic: item.json && !!item.json.topic,
      hasBody: item.json && !!item.json.body,
      hasYoutubeId: item.json && !!item.json.youtube_id,
      hasRank: item.json && item.json.rank !== undefined
    });
  });

  // --- 3가지 다른 입력을 정확히 찾아서 변수에 할당 ---

  // 1. Competition 정보 찾기
  const competitionItem = items.find(item => item.json && item.json.id && item.json.topic);
  console.log('Competition item found:', !!competitionItem);

  // 2. YouTube API 데이터 찾기
  const youtubeDetailsItems = items.filter(item =>
    item.json && item.json.body && item.json.body.items
  );
  console.log('YouTube items found:', youtubeDetailsItems.length);

  // 3. 기존 DB 데이터 찾기 (수정된 필터 조건)
  const existingVideoItems = items.filter(item =>
    item.json &&
    typeof item.json === 'object' &&
    !Array.isArray(item.json) &&
    !item.json.id && // 대회 정보가 아님
    !item.json.body && // YouTube 데이터가 아님
    item.json.youtube_id && // youtube_id가 있음
    (item.json.rank !== undefined || item.json.rank !== null) // rank가 존재
  );

  console.log('Existing video items found:', existingVideoItems.length);

  // 기존 비디오 데이터 상세 확인
  if (existingVideoItems.length > 0) {
    console.log('=== 기존 비디오 데이터 샘플 (상위 3개) ===');
    existingVideoItems.slice(0, 3).forEach((item, idx) => {
      const video = item.json;
      console.log(`기존 비디오 ${idx + 1}:`, {
        youtube_id: video.youtube_id,
        rank: video.rank,
        rank_type: typeof video.rank,
        previous_rank: video.previous_rank,
        previous_rank_type: typeof video.previous_rank,
        arena_likes: video.arena_likes,
        guest_likes: video.guest_likes
      });
    });
  }

  // 필수 데이터 검증
  if (!competitionItem) {
    throw new Error('대회 정보를 찾을 수 없습니다. (id와 topic이 있는 항목 필요)');
  }
  if (!youtubeDetailsItems.length) {
    throw new Error('YouTube 데이터를 찾을 수 없습니다. (body.items가 있는 항목 필요)');
  }

  const activeCompetition = competitionItem.json;
  const videoDetails = youtubeDetailsItems.map(item => item.json.body.items).flat();
  const existingVideos = existingVideoItems.map(item => item.json);

  console.log('Active competition:', activeCompetition);
  console.log('Video details count:', videoDetails.length);
  console.log('Existing videos count:', existingVideos.length);

  const competitionId = activeCompetition.id;
  const competitionTopic = activeCompetition.topic;

  console.log('Using competition_id:', competitionId);
  console.log('Using competition_topic:', competitionTopic);

  // YouTube 비디오 데이터 확인
  if (!videoDetails || videoDetails.length === 0) {
    throw new Error('YouTube 비디오 데이터를 찾을 수 없습니다.');
  }
  console.log('YouTube 비디오 상세 정보 수:', videoDetails.length);

  // === 기존 데이터를 Map으로 변환 ===
  const existingVideosMap = new Map();

  existingVideos.forEach(video => {
    // rank 값을 안전하게 가져오기
    const currentRank = video.rank !== undefined && video.rank !== null ?
                       safeParseInt(video.rank, null) : null;
    const previousRank = video.previous_rank !== undefined && video.previous_rank !== null ?
                        safeParseInt(video.previous_rank, null) : null;

    existingVideosMap.set(video.youtube_id, {
      arena_likes: safeParseInt(video.arena_likes),
      guest_likes: safeParseInt(video.guest_likes),
      topic: video.topic,
      competition_id: video.competition_id,
      current_rank: currentRank,
      previous_rank: previousRank
    });

    console.log(`Map 저장 - ${video.youtube_id}: current_rank=${currentRank}, previous_rank=${previousRank}`);
  });

  console.log('기존 비디오 Map 생성 완료');
  console.log('Map 크기:', existingVideosMap.size);

  // === YouTube에서 가져온 새 데이터 처리 ===
  const videosWithThumbnails = videoDetails.filter(v =>
    v.snippet?.thumbnails && (v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url)
  );

  console.log('Thumbnail이 있는 비디오 수:', videosWithThumbnails.length);

  // 유틸리티 함수들
  function parseDuration(duration) {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    return (parseInt(match[1]||0) * 3600) + (parseInt(match[2]||0) * 60) + parseInt(match[3]||0);
  }

  function cleanString(str, maxLength = 1000) {
    if (!str) return '';
    return str.replace(/[^\w\s\-.,!?()가-힣]/g, '').replace(/\s+/g, ' ').trim().substring(0, maxLength);
  }

  const processedVideos = videosWithThumbnails.map(videoFromApi => {
    const snippet = videoFromApi.snippet;
    const statistics = videoFromApi.statistics;
    const contentDetails = videoFromApi.contentDetails;
    const status = videoFromApi.status;
    const youtubeId = videoFromApi.id;

    const views = safeParseInt(statistics?.viewCount);
    const likes = safeParseInt(statistics?.likeCount);
    const dislikes = safeParseInt(statistics?.dislikeCount);
    const favorites = safeParseInt(statistics?.favoriteCount);
    const comments = safeParseInt(statistics?.commentCount);

    // 기존 비디오 데이터 조회
    const existingVideo = existingVideosMap.get(youtubeId);

    let arena_likes = 0;
    let guest_likes = 0;
    let previous_rank = null;
    let topic = competitionTopic;
    let competition_id = competitionId;

    if (existingVideo) {
      arena_likes = existingVideo.arena_likes;
      guest_likes = existingVideo.guest_likes;
      topic = existingVideo.topic || competitionTopic;
      competition_id = existingVideo.competition_id || competitionId;

      // === previous_rank 설정 (핵심 로직) ===
      if (existingVideo.current_rank !== null && existingVideo.current_rank !== undefined) {
        previous_rank = existingVideo.current_rank;
        console.log(`기존 비디오 ${youtubeId}: rank ${existingVideo.current_rank} → previous_rank ${previous_rank}`);
      } else if (existingVideo.previous_rank !== null && existingVideo.previous_rank !== undefined) {
        previous_rank = existingVideo.previous_rank;
        console.log(`기존 비디오 ${youtubeId}: current_rank가 null, previous_rank ${previous_rank} 유지`);        
      } else {
        previous_rank = null;
        console.log(`기존 비디오 ${youtubeId}: rank와 previous_rank 모두 null`);
      }
    } else {
      previous_rank = null;
      console.log(`새 비디오 ${youtubeId}: previous_rank=null`);
    }

    const candidate_score = views + (likes * 100);
    const site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10);
    const final_site_score = Math.max(candidate_score, site_score);

    const durationInSeconds = parseDuration(contentDetails?.duration);
    const cleanTags = Array.isArray(snippet.tags) ? snippet.tags.slice(0, 5).map(tag => cleanString(tag, 30)) : [];

    return {
      id: youtubeId,
      title: cleanString(snippet.title || '', 200),
      channel: cleanString(snippet.channelTitle || '', 100),
      thumbnail: snippet.thumbnails?.high?.url || '',
      youtube_id: youtubeId,
      views: views,
      likes: likes,
      arena_likes: arena_likes,
      topic: topic,
      competition_id: competition_id,
      size: durationInSeconds || 0,
      score: final_site_score,
      rank: 0,
      weight: 1.0,
      candidate_score: candidate_score,
      site_score: final_site_score,
      guest_likes: guest_likes,
      previous_rank: previous_rank,
      description: cleanString(snippet.description || '', 500),
      published_at: snippet.publishedAt || null,
      channel_id: snippet.channelId || '',
      tags: cleanTags,
      category_id: snippet.categoryId || '',
      default_language: snippet.defaultLanguage || '',
      default_audio_language: snippet.defaultAudioLanguage || '',
      live_broadcast_content: snippet.liveBroadcastContent || '',
      thumbnail_default: snippet.thumbnails?.default?.url || '',
      thumbnail_medium: snippet.thumbnails?.medium?.url || '',
      thumbnail_standard: snippet.thumbnails?.standard?.url || '',
      thumbnail_maxres: snippet.thumbnails?.maxres?.url || '',
      dislikes: dislikes,
      favorites: favorites,
      comments: comments,
      duration: contentDetails?.duration || '',
      dimension: contentDetails?.dimension || '',
      definition: contentDetails?.definition || '',
      caption: contentDetails?.caption === 'true',
      licensed_content: contentDetails?.licensedContent === true,
      privacy_status: status?.privacyStatus || '',
      embeddable: status?.embeddable === true,
      made_for_kids: status?.madeForKids === true,
      actual_start_time: videoFromApi.liveStreamingDetails?.actualStartTime || null,
      actual_end_time: videoFromApi.liveStreamingDetails?.actualEndTime || null,
      scheduled_start_time: videoFromApi.liveStreamingDetails?.scheduledStartTime || null,
      concurrent_viewers: videoFromApi.liveStreamingDetails?.concurrentViewers || 0,
      location_description: videoFromApi.recordingDetails?.locationDescription || '',
      location_latitude: videoFromApi.recordingDetails?.location?.latitude || 0,
      location_longitude: videoFromApi.recordingDetails?.location?.longitude || 0
    };
  });

  const allVideos = processedVideos;
  console.log(`총 처리할 영상 수: ${allVideos.length}개`);

  // === site_score 기준으로 정렬 ===
  allVideos.sort((a, b) => b.site_score - a.site_score);

  // === 상위 100개 선택하고 새로운 순위 설정 ===
  const top100 = allVideos.slice(0, 100);

  // 순위 계산
  let currentRank = 1;
  let currentScore = null;

  console.log('=== 새로운 Rank 계산 시작 ===');

  top100.forEach((v, i) => {
    if (currentScore !== v.site_score) {
      currentRank = i + 1;
      currentScore = v.site_score;
    }
    v.rank = currentRank;
  });

  console.log('=== Rank 계산 완료 ===');

  // === 순위변동 분석 ===
  let newCount = 0, upCount = 0, downCount = 0, sameCount = 0;

  top100.forEach(video => {
    if (video.previous_rank === null || video.previous_rank === undefined) {
      newCount++;
    } else if (video.rank < video.previous_rank) {
      upCount++;
    } else if (video.rank > video.previous_rank) {
      downCount++;
    } else {
      sameCount++;
    }
  });

  console.log(`순위변동 요약: 신규 ${newCount}개, 상승 ${upCount}개, 하락 ${downCount}개, 유지 ${sameCount}개`);

  // === 순위 히스토리 업데이트 - 직접 데이터 삽입 ===
  console.log('=== 순위 히스토리 업데이트 시작 ===');
  try {
    // 오늘 날짜 구하기
    const today = new Date().toISOString().split('T')[0];
    
    // rank_history 데이터 준비
    const rankHistoryData = top100.map(video => ({
      video_id: video.youtube_id,
      competition_id: competitionId,
      rank: video.rank,
      site_score: video.site_score,
      arena_likes: video.arena_likes,
      youtube_likes: video.likes,
      recorded_date: today
    }));
    
    // Supabase에 직접 데이터 삽입
    await $http.request({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/coversong_rank_history`,
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: rankHistoryData
    });
    
    console.log('✅ 순위 히스토리 기록 성공:', rankHistoryData.length + '개 항목');
    
    // daily_rank_update 함수 호출하여 rank_changes와 rising_stars 업데이트
    try {
      await $http.request({
        method: 'POST',
        url: `${SUPABASE_URL}/rest/v1/rpc/daily_rank_update`,
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: {}
      });
      console.log('✅ 순위 변동 계산 및 급상승 영상 선정 완료');
    } catch (rpcError) {
      console.log('⚠️ 순위 변동 계산 중 오류 (무시하고 계속):', rpcError.message);
    }
    
  } catch (historyError) {
    console.log('⚠️ 순위 히스토리 업데이트 중 오류:', historyError.message);
    // 오류가 발생해도 계속 진행
  }
  console.log('=== 순위 히스토리 업데이트 완료 ===');

  // === 수정된 return 부분 ===
  const result = top100.map(video => ({
    json: {
      // 기본 필드 (NOT NULL)
      id: video.id || video.youtube_id,
      youtube_id: video.youtube_id,
      title: (video.title || '').substring(0, 200),
      channel: (video.channel || '').substring(0, 100),
      topic: video.topic || 'default',

      // 숫자 필드 (안전한 변환)
      views: Math.max(0, parseInt(video.views) || 0),
      likes: Math.max(0, parseInt(video.likes) || 0),
      arena_likes: Math.max(0, parseInt(video.arena_likes) || 0),
      guest_likes: Math.max(0, parseInt(video.guest_likes) || 0),
      competition_id: parseInt(video.competition_id) || null,
      rank: parseInt(video.rank) || null,
      previous_rank: video.previous_rank !== null && video.previous_rank !== undefined ?
                     parseInt(video.previous_rank) : null,
      dislikes: Math.max(0, parseInt(video.dislikes) || 0),
      favorites: Math.max(0, parseInt(video.favorites) || 0),
      comments: Math.max(0, parseInt(video.comments) || 0),
      concurrent_viewers: Math.max(0, parseInt(video.concurrent_viewers) || 0),

      // Float 필드
      site_score: parseFloat(video.site_score) || 0,
      candidate_score: parseFloat(video.candidate_score) || 0,
      size: parseFloat(video.size) || 0,
      score: parseFloat(video.score) || 0,
      weight: parseFloat(video.weight) || 1.0,
      location_latitude: parseFloat(video.location_latitude) || 0,
      location_longitude: parseFloat(video.location_longitude) || 0,

      // Text 필드 (nullable, 안전한 처리)
      thumbnail: video.thumbnail || null,
      description: video.description ? video.description.substring(0, 500) : null,
      channel_id: video.channel_id || null,
      category_id: video.category_id || null,
      default_language: video.default_language || null,
      default_audio_language: video.default_audio_language || null,
      live_broadcast_content: video.live_broadcast_content || null,
      thumbnail_default: video.thumbnail_default || null,
      thumbnail_medium: video.thumbnail_medium || null,
      thumbnail_standard: video.thumbnail_standard || null,
      thumbnail_maxres: video.thumbnail_maxres || null,
      duration: video.duration || null,
      dimension: video.dimension || null,
      definition: video.definition || null,
      privacy_status: video.privacy_status || null,
      location_description: video.location_description || null,

      // Boolean 필드 (안전한 변환)
      caption: video.caption === true || video.caption === 'true',
      licensed_content: video.licensed_content === true || video.licensed_content === 'true',
      embeddable: video.embeddable === true || video.embeddable === 'true',
      made_for_kids: video.made_for_kids === true || video.made_for_kids === 'true',

      // Timestamp 필드 (ISO 형식 확인)
      published_at: video.published_at && isValidDate(video.published_at) ?
                    video.published_at : null,
      actual_start_time: video.actual_start_time && isValidDate(video.actual_start_time) ?
                         video.actual_start_time : null,
      actual_end_time: video.actual_end_time && isValidDate(video.actual_end_time) ?
                       video.actual_end_time : null,
      scheduled_start_time: video.scheduled_start_time && isValidDate(video.scheduled_start_time) ?
                            video.scheduled_start_time : null,

      // Array 필드 (안전한 처리)
      tags: Array.isArray(video.tags) && video.tags.length > 0 ?
            video.tags.slice(0, 5) : []
    }
  }));

  console.log('Returning result items:', result.length);
  console.log('=== 최종처리 완료 ===');

  return result;

} catch (error) {
  console.log('=== ERROR OCCURRED ===');
  console.log('Error message:', error.message);
  console.log('Error stack:', error.stack);

  return [{
    json: {
      success: false,
      error: error.message
    }
  }];
}