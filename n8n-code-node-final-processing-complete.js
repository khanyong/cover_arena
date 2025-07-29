// === n8n Code Node - 최종처리 (완전한 버전) ===
// API Keys (상단에 선언)
const SUPABASE_URL = 'https://iklsghevdtqqkjuaympc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = '여기에_실제_서비스_롤_키_입력';

try {
  console.log('=== DEBUG: 최종처리 시작 ===');
  console.log('Input items:', items);
  
  // 활성 competition 정보 찾기 (HTTP Request-Supabase Topic 조회에서 온 데이터)
  const competitionItem = items.find(item => 
    item.json && Array.isArray(item.json) && item.json.length > 0 && 
    item.json[0] && item.json[0].id && item.json[0].topic
  );
  
  const activeCompetition = competitionItem?.json[0];
  const competitionId = activeCompetition?.id || 5; // 기본값 5
  const competitionTopic = activeCompetition?.topic || 'Huntrix - Golden';
  
  console.log('Active competition found:', activeCompetition);
  console.log('Using competition_id:', competitionId);
  console.log('Using competition_topic:', competitionTopic);
  
  // 1. Supabase에서 기존 비디오 데이터 가져오기 (fetch 사용)
  console.log('기존 비디오 데이터 조회 시작...');
  
  const existingVideosResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/coversong_videos?competition_id=eq.${competitionId}&select=id,arena_likes,guest_likes,topic,competition_id`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!existingVideosResponse.ok) {
    throw new Error(`기존 데이터 조회 실패: ${existingVideosResponse.status}`);
  }
  
  const existingVideos = await existingVideosResponse.json();
  console.log('기존 비디오 수:', existingVideos.length);
  
  // 2. 기존 데이터를 Map으로 변환 (빠른 조회용)
  const existingVideosMap = new Map();
  existingVideos.forEach(video => {
    existingVideosMap.set(video.id, video);
  });
  
  console.log('기존 비디오 Map 생성 완료');
  
  // 3. YouTube에서 가져온 새 데이터 처리
  let allVideos = [];
  
  items.forEach((item, index) => {
    // competition 정보는 건너뛰기
    if (item.json && Array.isArray(item.json) && item.json.length > 0 && 
        item.json[0] && item.json[0].id && item.json[0].topic) {
      console.log(`Skipping competition item ${index + 1}`);
      return;
    }
    
    console.log(`Processing YouTube item ${index + 1}:`, item.json);
    
    const httpResponse = item.json;
    const videoDetails = httpResponse.body?.items || [];
    const searchResults = item.json.searchResults || [];
    const totalVideos = item.json.totalVideos || 0;
    
    console.log(`Item ${index + 1} - Video details:`, videoDetails.length);
    console.log(`Item ${index + 1} - Search results:`, searchResults.length);
    console.log(`Item ${index + 1} - Total videos:`, totalVideos);
    
    // 썸네일 필터링
    const videosWithThumbnails = videoDetails.filter(v => {
      const hasThumbnail = v.snippet && 
                          v.snippet.thumbnails && 
                          (v.snippet.thumbnails.high?.url || 
                           v.snippet.thumbnails.medium?.url || 
                           v.snippet.thumbnails.default?.url);
      return hasThumbnail;
    });
    
    console.log(`Item ${index + 1} - Videos with thumbnails:`, videosWithThumbnails.length);
    
    // 비디오 처리 및 기존 데이터와 병합
    const processedVideos = videosWithThumbnails.map(v => {
      const snippet = v.snippet;
      const statistics = v.statistics;
      const contentDetails = v.contentDetails;
      const status = v.status;
      
      const views = parseInt(statistics?.viewCount || 0);
      const likes = parseInt(statistics?.likeCount || 0);
      const dislikes = parseInt(statistics?.dislikeCount || 0);
      const favorites = parseInt(statistics?.favoriteCount || 0);
      const comments = parseInt(statistics?.commentCount || 0);
      
      // 기존 데이터 확인
      const existingVideo = existingVideosMap.get(v.id);
      
      // arena_likes, guest_likes 처리
      let arena_likes = 0;
      let guest_likes = 0;
      
      if (existingVideo) {
        // 기존 비디오: 기존 값 유지
        arena_likes = existingVideo.arena_likes || 0;
        guest_likes = existingVideo.guest_likes || 0;
        console.log(`기존 비디오 ${v.id}: arena_likes=${arena_likes}, guest_likes=${guest_likes}`);
      } else {
        // 새로운 비디오: 0으로 초기화
        arena_likes = 0;
        guest_likes = 0;
        console.log(`새로운 비디오 ${v.id}: arena_likes=0, guest_likes=0`);
      }
      
      // 점수 계산
      const candidate_score = views + (likes * 100);
      const site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10);
      const score = site_score;
      const weight = 1.0;
      
      console.log(`비디오 ${v.id} 점수 계산:`, {
        views,
        likes,
        candidate_score,
        arena_likes,
        guest_likes,
        site_score
      });
      
      // 기존 topic, competition_id 유지
      const topic = existingVideo ? existingVideo.topic : competitionTopic;
      const competition_id = existingVideo ? existingVideo.competition_id : competitionId;
      
      // duration 파싱
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
        return str
          .replace(/[^\w\s\-.,!?()가-힣]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, maxLength);
      }
      
      const durationInSeconds = parseDuration(contentDetails?.duration);
      
      // tags 정리 (최대 5개로 제한)
      const cleanTags = Array.isArray(snippet.tags) 
        ? snippet.tags.slice(0, 5).map(tag => cleanString(tag, 30))
        : [];
      
      // 고유 ID 생성 (youtube_id를 기반으로)
      const uniqueId = v.id;
      
      return {
        // id 필드 추가 (NOT NULL 제약조건)
        id: uniqueId,
        title: cleanString(snippet.title || '', 200),
        channel: cleanString(snippet.channelTitle || '', 100),
        thumbnail: snippet.thumbnails?.high?.url || '',
        youtube_id: v.id || '',
        views: views || 0,
        likes: likes || 0,
        arena_likes: arena_likes, // 기존 값 유지 또는 0
        topic: topic, // 기존 값 유지 또는 기본값
        competition_id: competition_id, // 기존 값 유지 또는 기본값
        size: durationInSeconds || 0,
        score: score || 0,
        rank: 0,
        weight: weight || 1.0,
        candidate_score: candidate_score || 0,
        site_score: site_score || 0, // arena_likes, guest_likes 포함된 최종 점수
        guest_likes: guest_likes, // 기존 값 유지 또는 0
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
        dislikes: dislikes || 0,
        favorites: favorites || 0,
        comments: comments || 0,
        duration: contentDetails?.duration || '',
        dimension: contentDetails?.dimension || '',
        definition: contentDetails?.definition || '',
        caption: contentDetails?.caption === 'true' ? true : false,
        licensed_content: contentDetails?.licensedContent === true ? true : false,
        privacy_status: status?.privacyStatus || '',
        embeddable: status?.embeddable === true ? true : false,
        made_for_kids: status?.madeForKids === true ? true : false,
        actual_start_time: v.liveStreamingDetails?.actualStartTime || null,
        actual_end_time: v.liveStreamingDetails?.actualEndTime || null,
        scheduled_start_time: v.liveStreamingDetails?.scheduledStartTime || null,
        concurrent_viewers: v.liveStreamingDetails?.concurrentViewers || 0,
        location_description: v.recordingDetails?.locationDescription || '',
        location_latitude: v.recordingDetails?.location?.latitude || 0,
        location_longitude: v.recordingDetails?.location?.longitude || 0
      };
    });
    
    allVideos = allVideos.concat(processedVideos);
  });
  
  console.log('Total videos from all iterations:', allVideos.length);
  console.log('Expected videos: N topics × 6 iterations × 50 videos = N×300 videos');
  console.log('Final competition_id being used:', competitionId);
  
  // 중복 제거는 이미 Code-데이터처리에서 처리되었으므로 여기서는 간단한 확인만
  const uniqueVideos = allVideos;
  console.log(`📊 처리할 영상 수: ${uniqueVideos.length}개`);
  
  // 4. site_score 기준으로 정렬 (arena_likes, guest_likes 포함된 점수)
  uniqueVideos.sort((a, b) => b.site_score - a.site_score);
  
  // 5. 상위 100개 선택
  const top100 = uniqueVideos.slice(0, 100);
  top100.forEach((v, i) => v.rank = i + 1);
  
  console.log('Final videos to save:', top100.length);
  console.log('First video title:', top100[0]?.title || 'N/A');
  console.log('First video score:', top100[0]?.candidate_score || 'N/A');
  console.log('First video ID:', top100[0]?.id || 'N/A');
  console.log('First video competition_id:', top100[0]?.competition_id || 'N/A');
  
  // 점수 계산 확인 로그
  console.log('📋 상위 5개 영상 ID 및 점수:');
  top100.slice(0, 5).forEach((video, index) => {
    console.log(`  ${index + 1}위: ${video.id} - ${video.title}`);
    console.log(`    candidate_score: ${video.candidate_score}`);
    console.log(`    arena_likes: ${video.arena_likes} (${video.arena_likes * 500}점)`);
    console.log(`    guest_likes: ${video.guest_likes} (${video.guest_likes * 10}점)`);
    console.log(`    site_score: ${video.site_score}`);
  });
  
  // JSON 유효성 최종 테스트
  try {
    const testJson = JSON.stringify(top100[0]);
    console.log('JSON validation passed for first video');
  } catch (jsonError) {
    console.log('JSON validation failed:', jsonError.message);
  }
  
  // 6. n8n 형식에 맞게 반환
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