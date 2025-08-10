# YouTube 검색 다양화 개선 방안

## 현재 문제점
`order=relevance`로 6번 반복 검색 시 동일한 영상이 계속 반환되는 문제가 있습니다. YouTube는 관련성이 높은 상위 50개를 일관되게 반환하기 때문입니다.

## 개선 방안

### 1. 정렬 옵션 다양화
각 반복마다 다른 정렬 옵션 사용:

```javascript
const orderOptions = [
  'relevance',   // 관련성 (기본)
  'date',        // 최신 순
  'viewCount',   // 조회수 순
  'rating',      // 평점 순 (좋아요 비율)
  'title'        // 제목 알파벳 순
];

// 각 iteration마다 다른 정렬 사용
for (let i = 0; i < 6; i++) {
  const order = orderOptions[i % orderOptions.length];
  // YouTube API 호출 with order parameter
}
```

### 2. 시간 필터 활용
publishedAfter/publishedBefore 파라미터로 기간별 검색:

```javascript
// 최근 6개월 단위로 나누어 검색
const timeRanges = [
  { after: '2024-01-01T00:00:00Z', before: '2024-12-31T23:59:59Z' }, // 2024년
  { after: '2023-01-01T00:00:00Z', before: '2023-12-31T23:59:59Z' }, // 2023년
  { after: '2022-01-01T00:00:00Z', before: '2022-12-31T23:59:59Z' }, // 2022년
  { after: '2021-01-01T00:00:00Z', before: '2021-12-31T23:59:59Z' }, // 2021년
  { after: '2020-01-01T00:00:00Z', before: '2020-12-31T23:59:59Z' }, // 2020년
  { after: '2019-01-01T00:00:00Z', before: '2019-12-31T23:59:59Z' }  // 2019년
];
```

### 3. 검색어 변형
같은 주제를 다양한 방식으로 검색:

```javascript
const searchVariations = [
  `${topic} cover`,
  `${topic} acoustic cover`,
  `${topic} piano cover`,
  `${topic} guitar cover`,
  `${topic} vocal cover`,
  `${topic} remix`
];

// 각 variation으로 검색
searchVariations.forEach(query => {
  // YouTube API 호출
});
```

### 4. 페이지네이션 활용
nextPageToken을 사용하여 다음 페이지 결과 가져오기:

```javascript
let pageToken = null;
const allResults = [];

for (let page = 0; page < 6; page++) {
  const params = {
    q: `${topic} cover`,
    order: 'relevance',
    maxResults: 50,
    pageToken: pageToken  // 다음 페이지 토큰
  };
  
  const response = await youtubeSearch(params);
  allResults.push(...response.items);
  
  pageToken = response.nextPageToken;
  if (!pageToken) break; // 더 이상 페이지가 없으면 중단
}
```

### 5. 언어/지역 다양화
다양한 언어와 지역의 결과 수집:

```javascript
const regions = ['US', 'GB', 'KR', 'JP', 'DE', 'FR'];
const languages = ['en', 'ko', 'ja', 'de', 'fr', 'es'];

for (let i = 0; i < 6; i++) {
  const params = {
    q: `${topic} cover`,
    regionCode: regions[i],
    relevanceLanguage: languages[i]
  };
  // 각 지역/언어별 검색
}
```

### 6. 혼합 전략 (추천)
위 방법들을 조합한 최적 전략:

```javascript
async function diversifiedSearch(topic) {
  const results = [];
  
  // 1차: 관련성 높은 최신 영상 (페이지네이션)
  const page1 = await search({
    q: `${topic} cover`,
    order: 'relevance',
    maxResults: 50
  });
  results.push(...page1.items);
  
  // 2차: 다음 페이지
  if (page1.nextPageToken) {
    const page2 = await search({
      q: `${topic} cover`,
      order: 'relevance',
      maxResults: 50,
      pageToken: page1.nextPageToken
    });
    results.push(...page2.items);
  }
  
  // 3차: 최신 영상
  const recent = await search({
    q: `${topic} cover`,
    order: 'date',
    maxResults: 50,
    publishedAfter: new Date(Date.now() - 90*24*60*60*1000).toISOString() // 최근 3개월
  });
  results.push(...recent.items);
  
  // 4차: 조회수 높은 영상
  const popular = await search({
    q: `${topic} cover`,
    order: 'viewCount',
    maxResults: 50
  });
  results.push(...popular.items);
  
  // 5차: 특정 스타일 (acoustic)
  const acoustic = await search({
    q: `${topic} acoustic cover`,
    order: 'relevance',
    maxResults: 50
  });
  results.push(...acoustic.items);
  
  // 6차: 특정 스타일 (piano)
  const piano = await search({
    q: `${topic} piano cover`,
    order: 'relevance',
    maxResults: 50
  });
  results.push(...piano.items);
  
  return results;
}
```

## 구현 예시 (n8n 워크플로우용)

```javascript
// n8n Code Node에서 사용할 수 있는 개선된 검색 로직
const searchStrategies = [
  { query: `${topic} cover`, order: 'relevance' },           // 기본 관련성
  { query: `${topic} cover`, order: 'date' },                // 최신
  { query: `${topic} cover`, order: 'viewCount' },           // 인기
  { query: `${topic} acoustic cover`, order: 'relevance' },  // 어쿠스틱
  { query: `${topic} piano cover`, order: 'relevance' },     // 피아노
  { query: `${topic} guitar cover`, order: 'relevance' }     // 기타
];

// 각 전략으로 검색 실행
for (let i = 0; i < searchStrategies.length; i++) {
  const strategy = searchStrategies[i];
  
  // YouTube Search API 호출
  const searchParams = {
    part: 'snippet',
    q: strategy.query,
    type: 'video',
    videoDuration: 'short',
    order: strategy.order,
    maxResults: 50,
    key: YOUTUBE_API_KEY
  };
  
  // API 호출 및 결과 수집
  const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${new URLSearchParams(searchParams)}`);
  const data = await response.json();
  
  // 결과 처리
  processSearchResults(data.items);
}
```

## 예상 결과

### 기존 방식 (relevance × 6)
- 수집 영상: 300개
- 중복 제거 후: 약 50-70개 (대부분 중복)

### 개선된 방식 (혼합 전략)
- 수집 영상: 300개
- 중복 제거 후: 약 200-250개 (다양성 크게 향상)

## 장단점 분석

### 장점
1. **다양성**: 훨씬 다양한 영상 수집 가능
2. **신규 발견**: 숨겨진 좋은 커버 발견 확률 증가
3. **시간대별 포함**: 오래된 명작과 최신 트렌드 모두 포함
4. **스타일 다양성**: 다양한 장르와 스타일의 커버 포함

### 단점
1. **품질 편차**: 일부 낮은 품질 영상 포함 가능
2. **복잡도 증가**: 구현 및 관리 복잡도 상승
3. **API 쿼터**: 다양한 검색으로 API 사용량 증가 가능

## 권장 사항

### 즉시 적용 가능한 개선
1. **페이지네이션 사용**: nextPageToken으로 추가 결과 가져오기
2. **정렬 옵션 변경**: relevance → date, viewCount 혼용
3. **검색어 변형**: cover 외에 acoustic, piano 등 추가

### 중장기 개선
1. **A/B 테스트**: 다양한 전략 효과 측정
2. **사용자 피드백**: 어떤 스타일의 커버를 선호하는지 분석
3. **머신러닝**: 사용자 선호도 학습하여 검색 최적화

## 결론

현재의 단순 반복 검색 대신, 다양한 검색 전략을 조합하면:
- 3-4배 더 많은 고유 영상 수집 가능
- 사용자에게 더 풍부한 선택지 제공
- 커버 영상의 다양한 스타일과 시대 포괄

가장 실용적인 개선은 **페이지네이션**과 **정렬 옵션 다양화**를 조합하는 것입니다.