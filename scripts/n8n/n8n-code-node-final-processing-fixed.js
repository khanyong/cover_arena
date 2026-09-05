// === n8n Code Node - 최종처리 (Credentials 미사용 버전) ===

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
  
  items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, {
      hasJson: !!item.json,
      jsonType: typeof item.json,
      isArray: Array.isArray(item.json),
      keys: item.json ? Object.keys(item.json) : [],
      hasId: item.json && !!item.json.id,
      hasTopic: item.json && !!item.json.topic,
      hasBody: item.json && !!item.json.body,
      bodyKind: item.json && item.json.body ? item.json.body.kind : null,
      hasItems: item.json && item.json.body && !!item.json.body.items,
      firstItemYoutubeId: item.json && Array.isArray(item.json) && item.json.length > 0 ? !!item.json[0].youtube_id : null,
      // 추가 디버깅 정보
      jsonLength: item.json && Array.isArray(item.json) ? item.json.length : 'N/A',
      sampleData: item.json && Array.isArray(item.json) && item.json.length > 0 ? item.json[0] : 'N/A'
    });
  });

  // --- 3가지 다른 입력을 정확히 찾아서 변수에 할당 (조건 완화) ---
  const competitionItem = items.find(item => item.json && item.json.id && item.json.topic);
  console.log('Competition item found:', !!competitionItem);
  
  // YouTube 데이터 조건 완화
  const youtubeDetailsItems = items.filter(item => 
    item.json && item.json.body && item.json.body.items
  );
  console.log('YouTube items found:', youtubeDetailsItems.length);
  
  // === FIXED: 기존 DB 데이터 찾기 - 개별 비디오 아이템들 수집 ===
  // 로그를 보면 Item 7~214가 개별 비디오 객체들임
  const existingVideoItems = items.filter(item => 
    item.json && 
    typeof item.json === 'object' && 
    !item.json.id && // 대회 정보가 아님 (id가 있으면 대회 정보)
    !item.json.body && // YouTube 데이터가 아님 (body가 있으면 YouTube 데이터)
    item.json.youtube_id // youtube_id가 있으면 기존 비디오 데이터
  );
  
  console.log('Existing video items found:', existingVideoItems.length);
  if (existingVideoItems.length > 0) {
    console.log('Sample existing video item:', {
      youtube_id: existingVideoItems[0].json.youtube_id,
      rank: existingVideoItems[0].json.rank,
      previous_rank: existingVideoItems[0].json.previous_rank,
      arena_likes: existingVideoItems[0].json.arena_likes
    });
  }

  if (!competitionItem) {
    throw new Error('대회 정보를 찾을 수 없습니다. (id와 topic이 있는 항목 필요)');
  }
  if (!youtubeDetailsItems.length) {
    throw new Error('YouTube 데이터를 찾을 수 없습니다. (body.items가 있는 항목 필요)');
  }

  const activeCompetition = competitionItem.json;
  const videoDetails = youtubeDetailsItems.map(item => item.json.body.items).flat();
  
  // === FIXED: existingVideos를 개별 아이템들의 json으로 수집 ===
  const existingVideos = existingVideoItems.map(item => item.json);
  
  console.log('Active competition:', activeCompetition);
  console.log('Video details count:', videoDetails.length);
  console.log('Existing videos count:', existingVideos.length);
  console.log('Existing videos type:', typeof existingVideos);
  console.log('Existing videos isArray:', Array.isArray(existingVideos));
  
  const competitionId = activeCompetition.id;
  const competitionTopic = activeCompetition.topic;
  
  console.log('Active competition found:', activeCompetition);
  console.log('Using competition_id:', competitionId);
  console.log('Using competition_topic:', competitionTopic);

  // YouTube 비디오 데이터 확인
  if (!videoDetails || videoDetails.length === 0) {
    throw new Error('YouTube 비디오 데이터를 찾을 수 없습니다.');
  }
  console.log('YouTube 비디오 상세 정보 수:', videoDetails.length);
  
  // 기존 비디오 데이터 확인
  if (!existingVideos || existingVideos.length === 0) {
    console.log('기존 비디오 수: 0 (새로운 데이터만 처리)');
  } else {
    console.log('기존 비디오 수:', existingVideos.length);
  }
  
  // === DEBUG: 기존 비디오 데이터 상세 분석 ===
  console.log('=== 기존 비디오 데이터 분석 ===');
  if (Array.isArray(existingVideos) && existingVideos.length > 0) {
    existingVideos.slice(0, 5).forEach((video, index) => {
      console.log(`기존 비디오 ${index + 1}:`, {
        youtube_id: video.youtube_id,
        rank: video.rank,
        previous_rank: video.previous_rank,
        arena_likes: video.arena_likes,
        guest_likes: video.guest_likes
      });
    });
  } else {
    console.log('기존 비디오 데이터가 없습니다.');
  }
  // --- 데이터 분리 로직 끝 ---

  // 2. 기존 데이터를 Map으로 변환
  const existingVideosMap = new Map();
  existingVideos.forEach(video => {
    existingVideosMap.set(video.youtube_id, {
      arena_likes: safeParseInt(video.arena_likes),
      guest_likes: safeParseInt(video.guest_likes),
      topic: video.topic,
      competition_id: video.competition_id,
      current_rank: video.rank,  // ✅ 현재 rank를 별도로 저장
      previous_rank: video.previous_rank  // ✅ 기존 previous_rank 유지
    });
  });

  console.log('기존 비디오 Map 생성 완료');
  console.log('기존 비디오 ID 목록:', Array.from(existingVideosMap.keys()).slice(0, 5));

  // 3. YouTube에서 가져온 새 데이터 처리
  const videosWithThumbnails = videoDetails.filter(v => 
    v.snippet?.thumbnails && (v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url)
  );
  
  const processedVideos = videosWithThumbnails.map(videoFromApi => {
    const snippet = videoFromApi.snippet;
    const statistics = videoFromApi.statistics;
    const contentDetails = videoFromApi.contentDetails;
    const status = videoFromApi.status;
    const youtubeId = videoFromApi.id; // ID를 명확한 변수에 저장

    const views = safeParseInt(statistics?.viewCount);
    const likes = safeParseInt(statistics?.likeCount);
    const dislikes = safeParseInt(statistics?.dislikeCount);
    const favorites = safeParseInt(statistics?.favoriteCount);
    const comments = safeParseInt(statistics?.commentCount);
    
    // 맵 조회 시 통일된 변수명 사용
    const existingVideo = existingVideosMap.get(youtubeId);
    
    let arena_likes = existingVideo ? existingVideo.arena_likes : 0;
    let guest_likes = existingVideo ? existingVideo.guest_likes : 0;
    
    // === FIXED: previous_rank 설정 로직 수정 ===
    let previous_rank = null;
    if (existingVideo) {
      // 기존 비디오: 현재 rank를 previous_rank로 설정 (순위변동 추적)
      previous_rank = existingVideo.current_rank;
      console.log(`기존 비디오 ${youtubeId}: arena_likes=${arena_likes}, guest_likes=${guest_likes}, previous_rank=${previous_rank} (기존 rank: ${existingVideo.current_rank})`);
    } else {
      // 새로운 비디오: previous_rank는 null
      console.log(`새로운 비디오 ${youtubeId}: arena_likes=0, guest_likes=0, previous_rank=null`);
    }

    const candidate_score = views + (likes * 100);
    const site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10);
    // 본선 점수는 항상 예선 점수 + 추가 점수여야 함
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
      previous_rank: previous_rank,  // 명시적으로 previous_rank 설정
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

  // 4. site_score 기준으로 정렬
  allVideos.sort((a, b) => b.site_score - a.site_score);

  // 5. 상위 100개 선택하고 새로운 순위 설정 (중복 순위 처리)
  const top100 = allVideos.slice(0, 100);
  
  // === FIXED: 올바른 rank 계산 로직 + 상세 디버깅 ===
  let currentRank = 1;
  let currentScore = null;
  
  console.log('=== Rank 계산 시작 ===');
  console.log('정렬된 상위 10개 비디오 점수:');
  top100.slice(0, 10).forEach((v, i) => {
    console.log(`${i + 1}번째: site_score=${v.site_score}, score=${v.score}`);
  });
  
  top100.forEach((v, i) => {
    console.log(`처리 중 ${i + 1}번째: site_score=${v.site_score}, currentScore=${currentScore}, currentRank=${currentRank}`);
    
    if (currentScore !== v.site_score) {
      // 새로운 점수: 순위 증가
      currentRank = i + 1;
      currentScore = v.site_score;
      console.log(`✅ 새로운 점수: ${currentScore}, 순위 변경: ${currentRank}`);
    } else {
      console.log(`🔄 동일한 점수: ${currentScore}, 순위 유지: ${currentRank}`);
    }
    v.rank = currentRank;
    console.log(`최종 rank: ${v.rank}`);
  });
  
  console.log('=== Rank 계산 완료 ===');
  console.log('최종 rank 분포:');
  const rankCount = {};
  top100.forEach(v => {
    rankCount[v.rank] = (rankCount[v.rank] || 0) + 1;
  });
  console.log(rankCount);

  console.log('Final videos to save:', top100.length);
  console.log('Rank distribution check:');
  
  // 순위 분포 확인
  const rankDistribution = {};
  top100.forEach(video => {
    rankDistribution[video.rank] = (rankDistribution[video.rank] || 0) + 1;
  });
  
  console.log('Rank distribution:', rankDistribution);
  
  // === DEBUG: 상위 10개 영상 점수와 순위 확인 ===
  console.log('=== 상위 10개 영상 점수와 순위 확인 ===');
  top100.slice(0, 10).forEach((video, index) => {
    console.log(`${index + 1}번째: rank=${video.rank}, site_score=${video.site_score}, title=${video.title.substring(0, 30)}...`);
  });
  
  // === DEBUG: score 순서 검증 ===
  console.log('=== score 순서 검증 ===');
  for (let i = 0; i < Math.min(10, top100.length - 1); i++) {
    const current = top100[i];
    const next = top100[i + 1];
    console.log(`${i + 1}번째 vs ${i + 2}번째: ${current.site_score} >= ${next.site_score} (${current.site_score >= next.site_score ? '✅' : '❌'})`);
  }
  
  // === DEBUG: rank 순서 검증 ===
  console.log('=== rank 순서 검증 ===');
  for (let i = 0; i < Math.min(10, top100.length - 1); i++) {
    const current = top100[i];
    const next = top100[i + 1];
    console.log(`${i + 1}번째 vs ${i + 2}번째: rank ${current.rank} vs rank ${next.rank} (${current.rank <= next.rank ? '✅' : '❌'})`);
  }

  // === DEBUG: 최종 데이터 확인 ===
  console.log('=== 최종 저장 데이터 샘플 ===');
  top100.slice(0, 3).forEach((video, index) => {
    console.log(`최종 비디오 ${index + 1}:`, {
      youtube_id: video.youtube_id,
      rank: video.rank,
      previous_rank: video.previous_rank,
      arena_likes: video.arena_likes,
      guest_likes: video.guest_likes
    });
  });

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

  // 7. 순위 히스토리 업데이트 (daily_rank_update 함수 호출)
  console.log('=== 순위 히스토리 업데이트 시작 ===');
  try {
    // Supabase 직접 호출로 daily_rank_update 실행
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/daily_rank_update`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.ok) {
      console.log('✅ 순위 히스토리 업데이트 성공');
    } else {
      const errorText = await response.text();
      console.log('⚠️ 순위 히스토리 업데이트 실패:', errorText);
    }
  } catch (historyError) {
    console.log('⚠️ 순위 히스토리 업데이트 중 오류:', historyError.message);
  }
  console.log('=== 순위 히스토리 업데이트 완료 ===');
  
  // 8. n8n 형식에 맞게 반환
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
