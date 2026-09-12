// === n8n Code Node - Supabase 직접 Insert 버전 ===

try {
  const SUPABASE_URL = 'https://iklsghevdtqqkjuaympc.supabase.co';
  // Server-side n8n environment only; never paste a key into this file.
  // If environment access is blocked, leave it blocked and fail closed.
  const SUPABASE_SERVICE_ROLE_KEY = typeof $env === 'undefined'
    ? undefined
    : $env.SUPABASE_SERVICE_ROLE_KEY;
  if (typeof SUPABASE_SERVICE_ROLE_KEY !== 'string' || !SUPABASE_SERVICE_ROLE_KEY.trim()) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured for this n8n runtime.');
  }

  function safeParseInt(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : Math.max(0, parsed);
  }

  // === DEBUG: 입력 데이터 분석 ===
  console.log('=== 입력 데이터 분석 ===');
  console.log('Total items:', items.length);
  
  // 3가지 다른 입력을 정확히 찾아서 변수에 할당
  const competitionItem = items.find(item => item.json && item.json.id && item.json.topic);
  console.log('Competition item found:', !!competitionItem);
  
  const youtubeDetailsItems = items.filter(item => 
    item.json && item.json.body && item.json.body.items
  );
  console.log('YouTube items found:', youtubeDetailsItems.length);
  
  const existingVideoItems = items.filter(item => 
    item.json && 
    typeof item.json === 'object' && 
    !item.json.id && 
    !item.json.body && 
    item.json.youtube_id
  );
  
  console.log('Existing video items found:', existingVideoItems.length);

  if (!competitionItem) {
    throw new Error('대회 정보를 찾을 수 없습니다.');
  }
  if (!youtubeDetailsItems.length) {
    throw new Error('YouTube 데이터를 찾을 수 없습니다.');
  }

  const activeCompetition = competitionItem.json;
  const videoDetails = youtubeDetailsItems.map(item => item.json.body.items).flat();
  const existingVideos = existingVideoItems.map(item => item.json);
  
  console.log('Active competition:', activeCompetition);
  console.log('Video details count:', videoDetails.length);
  console.log('Existing videos count:', existingVideos.length);
  
  const competitionId = activeCompetition.id;
  const competitionTopic = activeCompetition.topic;

  // 기존 데이터를 Map으로 변환
  const existingVideosMap = new Map();
  existingVideos.forEach(video => {
    existingVideosMap.set(video.youtube_id, {
      arena_likes: safeParseInt(video.arena_likes),
      guest_likes: safeParseInt(video.guest_likes),
      topic: video.topic,
      competition_id: video.competition_id,
      current_rank: video.rank,
      previous_rank: video.previous_rank
    });
  });

  console.log('기존 비디오 Map 생성 완료');
  console.log('기존 비디오 ID 목록:', Array.from(existingVideosMap.keys()).slice(0, 5));

  // YouTube에서 가져온 새 데이터 처리
  const videosWithThumbnails = videoDetails.filter(v => 
    v.snippet?.thumbnails && (v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url)
  );
  
  // 신규 영상 목록 추적
  const newVideos = [];
  
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
    
    const existingVideo = existingVideosMap.get(youtubeId);
    
    let arena_likes = existingVideo ? existingVideo.arena_likes : 0;
    let guest_likes = existingVideo ? existingVideo.guest_likes : 0;
    
    let previous_rank = null;
    if (existingVideo) {
      previous_rank = existingVideo.current_rank;
      console.log(`기존 비디오 ${youtubeId}: arena_likes=${arena_likes}, previous_rank=${previous_rank}`);
    } else {
      // 신규 영상 추적
      newVideos.push(youtubeId);
      console.log(`신규 비디오 ${youtubeId}: arena_likes=0, previous_rank=null`);
    }

    const candidate_score = views + (likes * 100);
    const site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10);
    const final_site_score = site_score;

    const topic = existingVideo ? existingVideo.topic : competitionTopic;
    const competition_id = existingVideo ? existingVideo.competition_id : competitionId;

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
  console.log(`📊 처리할 영상 수: ${allVideos.length}개`);
  console.log(`🆕 신규 영상 수: ${newVideos.length}개`);
  console.log(`신규 영상 ID 목록:`, newVideos);

  // site_score 기준으로 정렬
  allVideos.sort((a, b) => b.site_score - a.site_score);

  // 전체 영상에 순위 설정 (중복 점수 처리)
  let currentRank = 1;
  let currentScore = null;
  
  allVideos.forEach((v, i) => {
    if (currentScore !== v.site_score) {
      currentRank = i + 1;
      currentScore = v.site_score;
    }
    v.rank = currentRank;
  });

  // 상위 100개만 DB에 저장할 데이터로 선택
  const top100 = allVideos.slice(0, 100);
  
  console.log('Total videos processed:', allVideos.length);
  console.log('Top 100 videos to save:', top100.length);
  
  // 순위변동 분석
  console.log('📊 순위변동 분석:');
  let newCount = 0, upCount = 0, downCount = 0, sameCount = 0;
  
  top100.forEach(video => {
    if (video.previous_rank === null) newCount++;
    else if (video.rank < video.previous_rank) upCount++;
    else if (video.rank > video.previous_rank) downCount++;
    else sameCount++;
  });
  
  console.log(`📈 순위변동 요약: 신규 ${newCount}개, 상승 ${upCount}개, 하락 ${downCount}개, 유지 ${sameCount}개`);

  // === 직접 Supabase API 호출하여 데이터 저장 ===
  console.log('=== Supabase 직접 저장 시작 ===');
  
  try {
    // 상위 100개 영상 데이터를 Supabase에 upsert
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/coversong_videos`,
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: top100,
      returnFullResponse: true
    });
    
    console.log('Supabase 응답 상태:', response.statusCode);
    console.log('Supabase 응답 헤더:', response.headers);
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      const savedData = response.body || [];
      console.log('✅ Supabase 저장 성공');
      console.log('저장된 레코드 수:', Array.isArray(savedData) ? savedData.length : 0);
      
      // 저장된 데이터 중 신규 영상 확인
      if (Array.isArray(savedData) && savedData.length > 0) {
        const savedNewVideos = savedData.filter(v => newVideos.includes(v.youtube_id));
        console.log(`✅ 신규 영상 ${savedNewVideos.length}개 저장 확인:`, savedNewVideos.map(v => v.youtube_id));
      }
    } else {
      console.error('❌ Supabase 저장 실패:', response.body);
      throw new Error(`Supabase 저장 실패: ${JSON.stringify(response.body)}`);
    }
  } catch (saveError) {
    console.error('❌ Supabase API 호출 오류:', saveError.message);
    throw saveError;
  }

  // 순위 히스토리 업데이트
  console.log('=== 순위 히스토리 업데이트 시작 ===');
  try {
    const historyResponse = await this.helpers.httpRequest({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/rpc/daily_rank_update`,
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: {},
      returnFullResponse: true
    });
    
    if (historyResponse.statusCode === 200 || historyResponse.statusCode === 204) {
      console.log('✅ 순위 히스토리 업데이트 성공');
    } else {
      console.log('⚠️ 순위 히스토리 업데이트 실패:', historyResponse.body);
    }
  } catch (historyError) {
    console.log('⚠️ 순위 히스토리 업데이트 중 오류:', historyError.message);
  }
  console.log('=== 순위 히스토리 업데이트 완료 ===');
  
  // n8n 형식에 맞게 반환 - 전체 영상 데이터 반환
  const result = allVideos.map(video => ({
    json: video
  }));

  console.log('Returning result items:', result.length);
  console.log('DB saved items:', top100.length);
  console.log('=== 최종처리 완료 ===');
  
  return result;

} catch (error) {
  console.log('=== ERROR OCCURRED ===');
  console.log('Error message:', error.message);
  console.log('Full error:', error);
  
  return [{
    json: {
      message: error.message,
      success: false
    }
  }];
}
