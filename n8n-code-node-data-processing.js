// === n8n Code Node - 데이터처리 (중복 제거 버전) ===

try {
  console.log('=== DEBUG: 데이터처리 시작 ===');
  console.log('Input items:', items);
  
  // 활성 competition 정보 찾기 (HTTP Request-Supabase Topic 조회에서 온 데이터)
  const competitionItem = items.find(item => 
    item.json && Array.isArray(item.json) && item.json.length > 0 && 
    item.json[0] && item.json[0].id && item.json[0].topic
  );
  
  const activeCompetition = competitionItem?.json[0];
  const competitionId = activeCompetition?.id || 5; // 기본값 5
  const competitionTopic = activeCompetition?.topic || 'Unknown';
  
  console.log('Active competition found:', activeCompetition);
  console.log('Using competition_id:', competitionId);
  console.log('Using competition_topic:', competitionTopic);
  
  let allVideoIds = [];
  let allSearchResults = [];
  
  // 모든 아이템 처리 (YouTube API 응답만 처리)
  items.forEach((item, index) => {
    // competition 정보는 건너뛰기
    if (item.json && Array.isArray(item.json) && item.json.length > 0 && 
        item.json[0] && item.json[0].id && item.json[0].topic) {
      console.log(`Skipping competition item ${index + 1}`);
      return;
    }
    
    console.log(`Processing YouTube item ${index + 1}:`, item.json);
    
    // YouTube API 응답에서 실제 검색 결과 추출
    const youtubeResponse = item.json;
    const searchResults = youtubeResponse.items || [];
    const topic = item.json.topic || competitionTopic; // competition topic 사용
    const iteration = item.json.iteration || 1;
    const delayBeforeNext = item.json.delayBeforeNext || 0;
    const currentIteration = item.json.currentIteration || 1;
    const totalIterations = item.json.totalIterations || 6;
    
    console.log(`Item ${index + 1} - Topic: ${topic}, Iteration: ${iteration}`);
    console.log(`Item ${index + 1} - YouTube API response:`, youtubeResponse);
    console.log(`Item ${index + 1} - Search results:`, searchResults.length);
    console.log(`Item ${index + 1} - Delay before next: ${delayBeforeNext}ms`);
    
    if (searchResults.length === 0) {
      console.log(`Item ${index + 1} - No search results found`);
      return;
    }
    
    // 썸네일 필터링
    const videosWithThumbnails = searchResults.filter(item => {
      const hasThumbnail = item.snippet && 
                          item.snippet.thumbnails && 
                          (item.snippet.thumbnails.high?.url || 
                           item.snippet.thumbnails.medium?.url || 
                           item.snippet.thumbnails.default?.url);
      return hasThumbnail;
    });
    
    console.log(`Item ${index + 1} - Videos with thumbnails:`, videosWithThumbnails.length);
    console.log(`Item ${index + 1} - Filtered out videos:`, searchResults.length - videosWithThumbnails.length);
    
    // 메타데이터 추가 (competition_id 포함)
    videosWithThumbnails.forEach(video => {
      video._searchTopic = topic;
      video._iteration = iteration;
      video._currentIteration = currentIteration;
      video._totalIterations = totalIterations;
      video._competitionId = competitionId; // 동적 competition_id 추가
    });
    
    allSearchResults = allSearchResults.concat(videosWithThumbnails);
    const videoIds = videosWithThumbnails.map(item => item.id.videoId).filter(Boolean);
    allVideoIds = allVideoIds.concat(videoIds);
    
    console.log(`Item ${index + 1} - Extracted video IDs:`, videoIds.length);
    
    // iteration 간격 로그
    if (delayBeforeNext > 0) {
      console.log(`Waiting ${delayBeforeNext}ms before next iteration (${currentIteration}/${totalIterations})`);
    } else {
      console.log(`No delay needed (last iteration: ${currentIteration}/${totalIterations})`);
    }
  });
  
  console.log('Total videos from all topics/iterations:', allVideoIds.length);
  console.log('Total search results:', allSearchResults.length);
  console.log('Final competition_id being used:', competitionId);
  
  // === 중복 제거 로직 추가 ===
  console.log('=== 중복 제거 시작 ===');
  
  // 중복 체크
  const idCounts = {};
  const duplicateIds = [];
  
  allVideoIds.forEach(videoId => {
    if (idCounts[videoId]) {
      idCounts[videoId]++;
      if (!duplicateIds.includes(videoId)) {
        duplicateIds.push(videoId);
      }
    } else {
      idCounts[videoId] = 1;
    }
  });
  
  // 중복된 ID가 있으면 로그 출력
  if (duplicateIds.length > 0) {
    console.log('🚨 중복된 ID 발견:', duplicateIds);
    console.log('중복 ID 상세 정보:');
    duplicateIds.forEach(id => {
      const duplicates = allVideoIds.filter(videoId => videoId === id);
      console.log(`ID ${id}: ${duplicates.length}개 중복`);
    });
  } else {
    console.log('✅ 모든 ID가 고유합니다.');
  }
  
  // 고유한 비디오 ID만 유지
  const uniqueVideoIds = [...new Set(allVideoIds)];
  console.log(`📊 중복 제거 후 고유 영상 수: ${uniqueVideoIds.length}개`);
  console.log(`제거된 중복: ${allVideoIds.length - uniqueVideoIds.length}개`);
  
  // 고유한 검색 결과만 유지
  const uniqueSearchResults = [];
  const seenIds = new Set();
  
  allSearchResults.forEach(item => {
    const videoId = item.id?.videoId;
    if (videoId && !seenIds.has(videoId)) {
      seenIds.add(videoId);
      uniqueSearchResults.push(item);
    }
  });
  
  console.log('고유한 검색 결과 수:', uniqueSearchResults.length);
  console.log('=== 중복 제거 완료 ===');
  
  if (uniqueVideoIds.length === 0) {
    console.log('No valid video IDs found after deduplication');
    return [{
      json: {
        message: 'No valid video IDs after deduplication',
        success: false,
        competition_id: competitionId
      }
    }];
  }
  
  // 배치 생성 (50개씩) - 중복 제거된 ID 사용
  const batches = [];
  for (let i = 0; i < uniqueVideoIds.length; i += 50) {
    batches.push(uniqueVideoIds.slice(i, i + 50));
  }
  
  console.log('Created batches:', batches.length);
  console.log('First batch size:', batches[0]?.length || 0);
  console.log('Last batch size:', batches[batches.length - 1]?.length || 0);
  
  return batches.map((batch, index) => ({
    json: {
      videoIds: batch.join(','),
      searchResults: uniqueSearchResults, // 중복 제거된 검색 결과 사용
      batchIndex: index + 1,
      totalBatches: batches.length,
      totalVideos: uniqueVideoIds.length, // 중복 제거된 총 개수
      competition_id: competitionId,
      competition_topic: competitionTopic
    }
  }));
  
} catch (error) {
  console.log('=== ERROR OCCURRED ===');
  console.log('Error message:', error.message);
  console.log('Full error:', error);
  
  return [{
    json: {
      message: error.message,
      success: false,
      competition_id: 5 // 에러 시에도 기본값
    }
  }];
} 