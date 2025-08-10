// === YouTube 검색 통합 노드 (다양화 보장 버전) ===
// 페이지네이션 대신 다양한 검색 전략으로 중복 최소화

const YOUTUBE_API_KEYS = {
  KEY_1: 'AIzaSyB-lpxpfzGhjpw3_qB1QU-wgR4pS3Uu8tQ'  // 실제 API 키로 변경
};

try {
  console.log('=== YouTube 검색 다양화 버전 시작 ===');
  console.log('Input items:', items.length);
  
  // Supabase 응답에서 대회 정보 추출
  const supabaseResponse = items[0].json;
  let topicRaw = null;
  let competitionId = null;

  // 토픽 추출
  if (supabaseResponse && supabaseResponse.topic) {
    topicRaw = supabaseResponse.topic;
    competitionId = supabaseResponse.id;
  } else if (Array.isArray(supabaseResponse) && supabaseResponse[0]) {
    topicRaw = supabaseResponse[0].topic;
    competitionId = supabaseResponse[0].id;
  } else {
    throw new Error('No topic found in Supabase response');
  }
  
  console.log('Topic:', topicRaw);
  console.log('Competition ID:', competitionId);
  
  // 다중 토픽 파싱
  const topics = topicRaw.split(',').map(t => t.trim()).filter(Boolean);
  console.log('Parsed topics:', topics);
  
  const API_KEY = YOUTUBE_API_KEYS.KEY_1;
  
  // === 중복 방지를 위한 다양화 전략 ===
  // 12가지 다른 검색 조합으로 고유한 결과 보장
  const searchVariations = [
    // 1-3: 기본 검색 (정렬 옵션 다양화)
    {
      suffix: 'cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: 'short',
      description: '관련성 높은 짧은 커버'
    },
    {
      suffix: 'cover',
      order: 'viewCount',
      publishedAfter: null,
      videoDuration: null,  // 모든 길이
      description: '조회수 높은 커버 (모든 길이)'
    },
    {
      suffix: 'cover song',
      order: 'date',
      publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 최근 1개월
      videoDuration: 'short',
      description: '최근 1개월 커버'
    },
    
    // 4-6: 스타일별 검색
    {
      suffix: 'acoustic cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: 'medium',  // 4-20분
      description: '어쿠스틱 커버 (중간 길이)'
    },
    {
      suffix: 'piano cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: 'short',
      description: '피아노 커버'
    },
    {
      suffix: 'guitar cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: 'short',
      description: '기타 커버'
    },
    
    // 7-9: 시간대별 검색
    {
      suffix: 'cover',
      order: 'relevance',
      publishedAfter: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1년 이내
      publishedBefore: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6개월 이전
      videoDuration: 'short',
      description: '6개월-1년 전 커버'
    },
    {
      suffix: 'cover 2024',  // 연도 추가
      order: 'relevance',
      publishedAfter: '2024-01-01T00:00:00Z',
      videoDuration: 'short',
      description: '2024년 커버'
    },
    {
      suffix: 'cover 2023',
      order: 'relevance',
      publishedAfter: '2023-01-01T00:00:00Z',
      publishedBefore: '2023-12-31T23:59:59Z',
      videoDuration: 'short',
      description: '2023년 커버'
    },
    
    // 10-12: 특수 검색
    {
      suffix: 'vocal cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: 'short',
      description: '보컬 커버'
    },
    {
      suffix: 'remix cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: 'short',
      description: '리믹스 커버'
    },
    {
      suffix: 'live cover',
      order: 'relevance',
      publishedAfter: null,
      videoDuration: null,
      description: '라이브 커버'
    }
  ];
  
  // 각 토픽에 대해 12가지 변형 검색 생성
  const result = [];
  let requestIndex = 0;
  
  topics.forEach((topic, topicIndex) => {
    console.log(`\n토픽 ${topicIndex + 1}/${topics.length}: ${topic}`);
    
    // 토픽이 2개면 각 6개씩, 1개면 12개 모두 사용
    const variationsToUse = topics.length === 2 
      ? searchVariations.slice(0, 6)  // 2개 토픽 × 6 = 12
      : searchVariations;  // 1개 토픽 × 12 = 12
    
    variationsToUse.forEach((variation, varIndex) => {
      requestIndex++;
      
      // 검색 쿼리 구성
      const searchQuery = `${topic} ${variation.suffix}`;
      
      // 지역 코드 순환 (다양성 증가)
      const regionCodes = ['US', 'GB', 'KR', 'JP', 'CA', 'AU'];
      const regionCode = regionCodes[varIndex % regionCodes.length];
      
      // 언어 코드 순환
      const languages = ['en', 'ko', 'ja', 'es', 'fr', 'de'];
      const relevanceLanguage = languages[varIndex % languages.length];
      
      const requestObj = {
        json: {
          // 기본 정보
          topic: topic,
          competitionId: competitionId,
          
          // 검색 파라미터
          searchQuery: searchQuery,
          order: variation.order,
          publishedAfter: variation.publishedAfter,
          publishedBefore: variation.publishedBefore || null,
          videoDuration: variation.videoDuration,
          
          // 다양화 파라미터
          regionCode: regionCode,
          relevanceLanguage: relevanceLanguage,
          
          // 메타 정보
          variationIndex: varIndex,
          variationDescription: variation.description,
          requestIndex: requestIndex,
          totalRequests: topics.length * variationsToUse.length,
          
          // API 설정
          apiKey: API_KEY,
          maxResults: 50,
          type: 'video',
          part: 'snippet',
          
          // 지연 처리
          delayBeforeNext: requestIndex < (topics.length * variationsToUse.length) ? 2000 : 0,
          
          // 디버그 정보
          topicIndex: topicIndex,
          totalTopics: topics.length,
          isLastRequest: requestIndex === (topics.length * variationsToUse.length)
        }
      };
      
      result.push(requestObj);
      
      console.log(`  ${varIndex + 1}. ${variation.description}`);
      console.log(`     쿼리: "${searchQuery}"`);
      console.log(`     정렬: ${variation.order}, 지역: ${regionCode}, 언어: ${relevanceLanguage}`);
      if (variation.publishedAfter) {
        console.log(`     기간: ${variation.publishedAfter.substring(0, 10)}부터`);
      }
    });
  });
  
  // 결과 요약
  console.log('\n=== 검색 요청 생성 완료 ===');
  console.log(`총 요청 수: ${result.length}개 (정확히 12개여야 함)`);
  console.log(`예상 고유 영상 수: ${result.length * 40}개 이상 (중복률 20% 가정)`);
  console.log(`예상 소요 시간: ${(result.length - 1) * 2}초`);
  
  // 검색 전략 분포
  const strategyStats = {
    기본검색: result.filter(r => r.json.searchQuery.includes('cover') && !r.json.searchQuery.includes('acoustic')).length,
    스타일별: result.filter(r => r.json.searchQuery.match(/acoustic|piano|guitar|vocal|remix|live/)).length,
    시간필터: result.filter(r => r.json.publishedAfter !== null).length,
    전체길이: result.filter(r => r.json.videoDuration === null).length
  };
  console.log('\n검색 전략 분포:', strategyStats);
  
  // API 쿼터 사용량
  const estimatedQuota = result.length * 100;
  console.log(`\nAPI 쿼터 사용량: ${estimatedQuota} units (${(estimatedQuota / 10000 * 100).toFixed(1)}%)`);
  
  // 정확히 12개 확인
  if (result.length !== 12) {
    console.warn(`⚠️ 경고: 출력이 12개가 아닙니다! (현재: ${result.length}개)`);
  } else {
    console.log('✅ 정확히 12개 요청 생성 완료');
  }
  
  return result;
  
} catch (error) {
  console.log('=== ERROR OCCURRED ===');
  console.log('Error:', error.message);
  
  return [{
    json: {
      message: error.message,
      success: false,
      error: true,
      timestamp: new Date().toISOString()
    }
  }];
}