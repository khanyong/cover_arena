// === n8n Code Node - 최종처리 (Merge 순서 수정 버전) ===

try {
  console.log('=== DEBUG: 최종처리 시작 ===');
  console.log('Input items:', items);

  // Supabase 인증 정보 (하드코딩)
  const SUPABASE_URL = 'https://iklsghevdtqqkjuaympc.supabase.co';
  const SUPABASE_SERVICE_ROLE_KEY = '여기에_실제_서비스_롤_키_입력'; // <-- 실제 키로 교체 필요

  // 안전한 숫자 변환 함수
  function safeParseInt(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : Math.max(0, parsed);
  }

  // --- Merge 노드 데이터 분리 로직 (순서 기반) ---
  // Input 1: Supabase Topic 조회 (n8n 컨텍스트 포함)
  // Input 2: YouTube Videos Details
  // Input 3: Supabase 기존데이터조회
  
  const competitionItem = items[0]; // 항상 첫 번째 (n8n 컨텍스트)
  const youtubeVideosItem = items[1]; // 항상 두 번째
  const existingVideosItem = items[2]; // 항상 세 번째

  console.log('Competition item (index 0):', competitionItem?.json);
  console.log('YouTube videos item (index 1):', youtubeVideosItem?.json?.body?.items?.length || 0);
  console.log('Existing videos item (index 2):', existingVideosItem?.json?.length || 0);

  // 활성 competition 정보 추출
  const activeCompetition = competitionItem?.json;
  const competitionId = activeCompetition?.id || 5;
  const competitionTopic = activeCompetition?.topic || 'Huntrix - Golden';

  console.log('Active competition found:', activeCompetition);
  console.log('Using competition_id:', competitionId);
  console.log('Using competition_topic:', competitionTopic);

  // YouTube 비디오 데이터 확인
  if (!youtubeVideosItem) {
    throw new Error('YouTube 비디오 데이터를 찾을 수 없습니다.');
  }

  const videoDetails = youtubeVideosItem.json.body?.items || [];
  console.log('YouTube 비디오 상세 정보 수:', videoDetails.length);

  // 기존 비디오 데이터 확인
  const existingVideos = existingVideosItem?.json || [];
  console.log('기존 비디오 수:', existingVideos.length);
  // --- 데이터 분리 로직 끝 ---

  // 2. 기존 데이터를 Map으로 변환
  const existingVideosMap = new Map();
  existingVideos.forEach(video => {
    existingVideosMap.set(video.youtube_id, {
      arena_likes: safeParseInt(video.arena_likes),
      guest_likes: safeParseInt(video.guest_likes),
      topic: video.topic,
      competition_id: video.competition_id,
      previous_rank: video.rank
    });
  });

  console.log('기존 비디오 Map 생성 완료');
  console.log('기존 비디오 ID 목록:', Array.from(existingVideosMap.keys()).slice(0, 5));

  // 3. YouTube에서 가져온 새 데이터 처리
  const videosWithThumbnails = videoDetails.filter(v => 
    v.snippet?.thumbnails && (v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url)
  );
  
  console.log('Videos with thumbnails:', videosWithThumbnails.length);

  const processedVideos = videosWithThumbnails.map(v => {
    const snippet = v.snippet;
    const statistics = v.statistics;
    const contentDetails = v.contentDetails;
    const status = v.status;

    const views = safeParseInt(statistics?.viewCount);
    const likes = safeParseInt(statistics?.likeCount);
    const dislikes = safeParseInt(statistics?.dislikeCount);
    const favorites = safeParseInt(statistics?.favoriteCount);
    const comments = safeParseInt(statistics?.commentCount);
    
    const existingVideo = existingVideosMap.get(v.id);
    
    let arena_likes = existingVideo ? existingVideo.arena_likes : 0;
    let guest_likes = existingVideo ? existingVideo.guest_likes : 0;
    let previous_rank = existingVideo ? existingVideo.previous_rank : null;

    if(existingVideo) {
      console.log(`기존 비디오 ${v.id}: arena_likes=${arena_likes}, guest_likes=${guest_likes}, previous_rank=${previous_rank}`);
    } else {
      console.log(`새로운 비디오 ${v.id}: arena_likes=0, guest_likes=0, previous_rank=null`);
    }

    const candidate_score = views + (likes * 100);
    const site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10);
    
    console.log(`비디오 ${v.id} 점수 계산:`, { views, likes, candidate_score, arena_likes, guest_likes, site_score });
    
    // 본선 점수는 항상 예선 점수 + 추가 점수여야 함 (Math.max 제거)
    const final_site_score = site_score;
    const topic = existingVideo ? existingVideo.topic : competitionTopic;
    const competition_id = existingVideo ? existingVideo.competition_id : competitionId;

    function parseDuration(duration) {
      if (!duration) return 0;
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return 0;
      const hours = parseInt(match[1] || 0);
      const minutes = parseInt(match[2] || 0);
      const seconds = parseInt(match[3] || 0);
      return (hours * 3600) + (minutes * 60) + seconds;
    }

    function cleanString(str, maxLength = 1000) {
      if (!str) return '';
      return str.replace(/[^\w\s\-.,!?()가-힣]/g, '').replace(/\s+/g, ' ').trim().substring(0, maxLength);
    }
    
    const durationInSeconds = parseDuration(contentDetails?.duration);
    const cleanTags = Array.isArray(snippet.tags) ? snippet.tags.slice(0, 5).map(tag => cleanString(tag, 30)) : [];
    
    return {
      id: v.id,
      title: cleanString(snippet.title || '', 200),
      channel: cleanString(snippet.channelTitle || '', 100),
      thumbnail: snippet.thumbnails?.high?.url || '',
      youtube_id: v.id || '',
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
      actual_start_time: v.liveStreamingDetails?.actualStartTime || null,
      actual_end_time: v.liveStreamingDetails?.actualEndTime || null,
      scheduled_start_time: v.liveStreamingDetails?.scheduledStartTime || null,
      concurrent_viewers: v.liveStreamingDetails?.concurrentViewers || 0,
      location_description: v.recordingDetails?.locationDescription || '',
      location_latitude: v.recordingDetails?.location?.latitude || 0,
      location_longitude: v.recordingDetails?.location?.longitude || 0
    };
  });

  const allVideos = processedVideos;
  console.log(`📊 처리할 영상 수: ${allVideos.length}개`);

  // 4. site_score 기준으로 정렬
  allVideos.sort((a, b) => b.site_score - a.site_score);

  // 5. 상위 100개 선택하고 새로운 순위 설정
  const top100 = allVideos.slice(0, 100);
  top100.forEach((v, i) => {
    v.rank = i + 1;
  });

  console.log('Final videos to save:', top100.length);

  // 6. 상세 분석
  console.log('📊 순위변동 분석:');
  let newCount = 0, upCount = 0, downCount = 0, sameCount = 0;
  
  top100.forEach(video => {
    if (video.previous_rank === null) newCount++;
    else if (video.rank < video.previous_rank) upCount++;
    else if (video.rank > video.previous_rank) downCount++;
    else sameCount++;
  });
  
  console.log(`📈 순위변동 요약: 신규 ${newCount}개, 상승 ${upCount}개, 하락 ${downCount}개, 유지 ${sameCount}개`);

  // 7. n8n 형식에 맞게 반환
  const result = top100.map(video => ({
    json: video
  }));

  console.log('Returning result items:', result.length);
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