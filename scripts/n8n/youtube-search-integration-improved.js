// === YouTube 검색 통합 노드 (개선된 버전) ===

// API 키 관리 (환경변수에서 가져오기를 권장하지만, n8n에서는 직접 설정)
const YOUTUBE_API_KEYS = {
  KEY_1: 'AIzaSyB-lpxpfzGhjpw3_qB1QU-wgR4pS3Uu8tQ'  // 실제 API 키로 변경
};

try {
  console.log('=== YouTube 검색 통합 시작 (개선된 버전) ===');
  console.log('Input items:', items.length);
  
  // Supabase 응답에서 대회 정보 추출
  const supabaseResponse = items[0].json;
  console.log('Supabase response type:', typeof supabaseResponse);
  
  let topicRaw = null;
  let competitionId = null;

  // 다양한 응답 형식 지원
  if (supabaseResponse && supabaseResponse.topic) {
    topicRaw = supabaseResponse.topic;
    competitionId = supabaseResponse.id;
    console.log('Topic from direct object:', topicRaw);
  } else if (Array.isArray(supabaseResponse) && supabaseResponse.length > 0) {
    topicRaw = supabaseResponse[0].topic;
    competitionId = supabaseResponse[0].id;
    console.log('Topic from array:', topicRaw);
  } else {
    throw new Error('No topic found in Supabase response');
  }
  
  console.log('Competition:', { id: competitionId, topic: topicRaw });
  
  // 다중 토픽 파싱 (쉼표 구분)
  const topics = topicRaw.split(',').map(t => t.trim()).filter(Boolean);
  console.log('Parsed topics:', topics);
  
  if (topics.length === 0) {
    throw new Error('No valid topics found after parsing');
  }
  
  // API 키 확인
  const API_KEY = YOUTUBE_API_KEYS.KEY_1;
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('Please set your API key in YOUTUBE_API_KEYS.KEY_1');
  }
  
  console.log('Using API key:', API_KEY.substring(0, 10) + '...');
  
  // === 개선된 검색 전략 ===
  // 각 토픽에 대해 다양한 검색 방법 적용
  const searchStrategies = [
    // 1. 기본 관련성 검색
    {
      query: 'cover',
      order: 'relevance',
      publishedAfter: null,
      description: 'Most relevant covers'
    },
    // 2. 최신 커버 (최근 6개월)
    {
      query: 'cover',
      order: 'date',
      publishedAfter: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Recent covers (last 6 months)'
    },
    // 3. 조회수 높은 커버
    {
      query: 'cover',
      order: 'viewCount',
      publishedAfter: null,
      description: 'Most viewed covers'
    },
    // 4. 어쿠스틱 커버
    {
      query: 'acoustic cover',
      order: 'relevance',
      publishedAfter: null,
      description: 'Acoustic covers'
    },
    // 5. 피아노 커버
    {
      query: 'piano cover',
      order: 'relevance',
      publishedAfter: null,
      description: 'Piano covers'
    },
    // 6. 기타 커버
    {
      query: 'guitar cover',
      order: 'relevance',
      publishedAfter: null,
      description: 'Guitar covers'
    }
  ];
  
  // 결과 배열 생성
  const result = [];
  let requestIndex = 0;
  
  // 각 토픽에 대해 다양한 전략 적용
  topics.forEach((topic, topicIndex) => {
    console.log(`\nProcessing topic ${topicIndex + 1}/${topics.length}: ${topic}`);
    
    // 각 검색 전략 적용
    searchStrategies.forEach((strategy, strategyIndex) => {
      requestIndex++;
      
      // 검색 쿼리 구성
      const fullQuery = `${topic} ${strategy.query}`;
      
      // 요청 객체 생성
      const requestObj = {
        json: {
          // 기본 정보
          topic: topic,
          competitionId: competitionId,
          
          // 검색 파라미터
          searchQuery: fullQuery,
          order: strategy.order,
          publishedAfter: strategy.publishedAfter,
          
          // 반복 정보 (이전 버전과의 호환성)
          iteration: strategyIndex + 1,
          totalIterations: searchStrategies.length,
          currentIteration: strategyIndex + 1,
          
          // 검색 전략 정보
          strategyDescription: strategy.description,
          strategyIndex: strategyIndex,
          
          // API 키
          apiKey: API_KEY,
          keyIndex: 0,
          
          // 지연 처리 (마지막 요청이 아니면 2초 대기)
          delayBeforeNext: requestIndex < (topics.length * searchStrategies.length) ? 2000 : 0,
          
          // 디버그 정보
          requestIndex: requestIndex,
          totalRequests: topics.length * searchStrategies.length,
          topicIndex: topicIndex,
          
          // 페이지네이션 지원 (첫 페이지는 빈 문자열)
          pageToken: '',
          
          // 추가 파라미터
          maxResults: 50,
          videoDuration: 'short',  // 4분 이하
          type: 'video',
          part: 'snippet',
          
          // 지역/언어 다양화 (옵션)
          regionCode: strategyIndex % 2 === 0 ? 'US' : 'KR',  // 미국과 한국 교대
          relevanceLanguage: strategyIndex % 2 === 0 ? 'en' : 'ko'  // 영어와 한국어 교대
        }
      };
      
      result.push(requestObj);
      
      console.log(`  Strategy ${strategyIndex + 1}: ${strategy.description}`);
      console.log(`    Query: "${fullQuery}"`);
      console.log(`    Order: ${strategy.order}`);
      if (strategy.publishedAfter) {
        console.log(`    Published after: ${strategy.publishedAfter}`);
      }
    });
  });
  
  // 결과 요약
  console.log('\n=== 검색 요청 생성 완료 ===');
  console.log(`총 토픽 수: ${topics.length}`);
  console.log(`토픽당 전략 수: ${searchStrategies.length}`);
  console.log(`총 요청 수: ${result.length}`);
  console.log(`예상 수집 영상 수: ${result.length * 50} (최대)`);
  console.log(`예상 소요 시간: ${(result.length - 1) * 2}초 (지연 시간)`);
  
  // 검색 전략별 요청 수 집계
  const strategyCount = {};
  searchStrategies.forEach(s => {
    strategyCount[s.description] = topics.length;
  });
  console.log('\n검색 전략별 요청 수:', strategyCount);
  
  // API 쿼터 사용량 예상
  const estimatedQuota = result.length * 100; // Search API는 요청당 100 units
  console.log(`\n예상 API 쿼터 사용량: ${estimatedQuota} units`);
  console.log(`일일 한도 대비: ${(estimatedQuota / 10000 * 100).toFixed(1)}%`);
  
  return result;
  
} catch (error) {
  console.log('=== ERROR OCCURRED ===');
  console.log('Error message:', error.message);
  console.log('Error stack:', error.stack);
  
  // 에러 응답
  return [{
    json: {
      message: error.message,
      success: false,
      error: true,
      timestamp: new Date().toISOString()
    }
  }];
}