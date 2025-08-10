// === YouTube 검색 통합 노드 (페이지네이션 지원 버전) ===
// 이 버전은 n8n의 Loop 노드와 함께 사용하여 실제 페이지네이션을 구현합니다

const YOUTUBE_API_KEYS = {
  KEY_1: 'AIzaSyB-lpxpfzGhjpw3_qB1QU-wgR4pS3Uu8tQ'  // 실제 API 키로 변경
};

try {
  console.log('=== YouTube 검색 (페이지네이션 버전) ===');
  
  // 입력 데이터 확인
  const inputData = items[0].json;
  console.log('Input data keys:', Object.keys(inputData));
  
  // 초기 실행인지 페이지네이션 실행인지 확인
  const isInitialRun = !inputData.pageToken && !inputData.isPageRequest;
  const isPaginationRun = inputData.isPageRequest === true;
  
  if (isInitialRun) {
    // === 초기 실행: Supabase에서 토픽 가져와서 첫 검색 설정 ===
    console.log('Initial run - Setting up search requests');
    
    const supabaseResponse = inputData;
    let topicRaw = null;
    let competitionId = null;
    
    // 토픽 추출
    if (supabaseResponse.topic) {
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
    
    const topics = topicRaw.split(',').map(t => t.trim()).filter(Boolean);
    
    // 검색 전략 정의 (각 전략을 2페이지까지 가져오기)
    const searchStrategies = [
      {
        query: 'cover',
        order: 'relevance',
        description: 'Most relevant covers',
        maxPages: 2  // 각 전략당 최대 페이지 수
      },
      {
        query: 'cover',
        order: 'date',
        publishedAfter: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Recent covers (3 months)',
        maxPages: 1
      },
      {
        query: 'cover',
        order: 'viewCount',
        description: 'Most viewed covers',
        maxPages: 2
      },
      {
        query: 'acoustic cover',
        order: 'relevance',
        description: 'Acoustic covers',
        maxPages: 1
      },
      {
        query: 'piano cover',
        order: 'relevance',
        description: 'Piano covers',
        maxPages: 1
      },
      {
        query: 'guitar cover',
        order: 'relevance',
        description: 'Guitar covers',
        maxPages: 1
      }
    ];
    
    const API_KEY = YOUTUBE_API_KEYS.KEY_1;
    const result = [];
    
    // 각 토픽과 전략에 대한 초기 요청 생성
    topics.forEach((topic, topicIndex) => {
      searchStrategies.forEach((strategy, strategyIndex) => {
        result.push({
          json: {
            // 검색 정보
            topic: topic,
            competitionId: competitionId,
            searchQuery: `${topic} ${strategy.query}`,
            order: strategy.order,
            publishedAfter: strategy.publishedAfter || null,
            
            // 페이지네이션 정보
            pageToken: '',  // 첫 페이지
            currentPage: 1,
            maxPages: strategy.maxPages,
            isPageRequest: false,  // 초기 요청
            
            // 전략 정보
            strategyDescription: strategy.description,
            strategyIndex: strategyIndex,
            topicIndex: topicIndex,
            
            // API 정보
            apiKey: API_KEY,
            maxResults: 50,
            videoDuration: 'short',
            type: 'video',
            part: 'snippet',
            
            // 지연 설정
            delayBeforeNext: 2000,
            
            // 통계
            totalStrategies: searchStrategies.length,
            totalTopics: topics.length
          }
        });
      });
    });
    
    console.log(`Created ${result.length} initial search requests`);
    return result;
    
  } else if (isPaginationRun) {
    // === 페이지네이션 실행: 이전 검색의 다음 페이지 요청 ===
    console.log('Pagination run - Processing next page');
    
    // 이전 응답에서 nextPageToken 확인
    const previousResponse = inputData.previousResponse;
    const nextPageToken = previousResponse?.nextPageToken;
    const currentPage = inputData.currentPage || 1;
    const maxPages = inputData.maxPages || 2;
    
    console.log(`Current page: ${currentPage}/${maxPages}`);
    console.log(`Next page token: ${nextPageToken ? 'Available' : 'Not available'}`);
    
    // 다음 페이지가 있고, 최대 페이지 수를 초과하지 않았다면
    if (nextPageToken && currentPage < maxPages) {
      // 다음 페이지 요청 생성
      return [{
        json: {
          ...inputData,  // 이전 요청 정보 유지
          pageToken: nextPageToken,
          currentPage: currentPage + 1,
          isPageRequest: true,
          previousResponse: null  // 이전 응답 제거 (크기 감소)
        }
      }];
    } else {
      // 더 이상 페이지가 없음
      console.log('No more pages available or max pages reached');
      return [{
        json: {
          message: 'Pagination complete',
          topic: inputData.topic,
          totalPages: currentPage,
          success: true
        }
      }];
    }
    
  } else {
    // === 일반 검색 요청 처리 ===
    console.log('Standard search request');
    
    // 기존 요청 그대로 전달
    return [{
      json: inputData
    }];
  }
  
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

// === n8n 워크플로우 구성 가이드 ===
/*
이 코드를 n8n에서 페이지네이션과 함께 사용하는 방법:

1. 워크플로우 구조:
   [Supabase 조회] 
   → [이 코드 노드 (초기 요청 생성)]
   → [Loop 노드]
     → [YouTube API 호출]
     → [응답 처리]
     → [이 코드 노드 (페이지네이션 체크)]
     → [조건부: 다음 페이지 있음?]
       → Yes: Loop 계속
       → No: Loop 종료
   → [데이터 통합]

2. Loop 노드 설정:
   - Split In Batches 노드 사용
   - Batch Size: 1
   - 각 검색 요청을 순차적으로 처리

3. YouTube API 호출 후:
   - 응답에 nextPageToken이 있는지 확인
   - 있다면 이 코드로 다시 전달하여 다음 페이지 요청 생성

4. 데이터 흐름:
   - 초기: { topic, competitionId } → 여러 검색 요청 생성
   - 페이지네이션: { previousResponse, pageToken, ... } → 다음 페이지 요청
   - 완료: { success: true, totalPages } → 다음 검색으로

5. 장점:
   - 실제 페이지네이션 작동
   - 각 전략별로 다른 페이지 수 설정 가능
   - 중복 최소화
   - API 쿼터 효율적 사용
*/