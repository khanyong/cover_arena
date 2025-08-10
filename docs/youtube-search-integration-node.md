# YouTube 검색 통합 노드 분석

## 개요
이 문서는 n8n 워크플로우의 YouTube 검색 통합 노드 코드를 상세히 분석합니다. 이 노드는 Supabase에서 대회 주제를 가져와 YouTube API를 통해 관련 영상을 검색합니다.

## 코드 구조

### 1. API 키 관리
```javascript
const YOUTUBE_API_KEYS = {
  KEY_1: 'AIzaSyB-lpxpfzGhjpw3_qB1QU-wgR4pS3Uu8tQ'
};
```
- 단일 API 키 사용
- 하드코딩된 키 (보안상 환경변수 사용 권장)

### 2. 입력 데이터 처리

#### 2.1 Supabase 응답 파싱
```javascript
const supabaseResponse = items[0].json;
```
- n8n의 이전 노드(Supabase 조회)에서 받은 데이터
- 활성 대회 정보 포함 (id, topic)

#### 2.2 토픽 추출 로직
```javascript
// 두 가지 형식 지원
if (supabaseResponse && supabaseResponse.topic) {
  // 직접 객체 형식
  topicRaw = supabaseResponse.topic;
  competitionId = supabaseResponse.id;
} else if (supabaseResponse && Array.isArray(supabaseResponse)) {
  // 배열 형식
  topicRaw = supabaseResponse[0].topic;
  competitionId = supabaseResponse[0].id;
}
```

**지원하는 데이터 형식:**
1. 직접 객체: `{ topic: "...", id: 5 }`
2. 배열: `[{ topic: "...", id: 5 }]`

#### 2.3 다중 토픽 처리
```javascript
const topics = topicRaw.split(',').map(t => t.trim()).filter(Boolean);
```
- 쉼표로 구분된 여러 토픽 지원
- 예: "Huntrix - Golden, Beatles - Yesterday" → ["Huntrix - Golden", "Beatles - Yesterday"]
- 공백 제거 및 빈 값 필터링

### 3. 검색 전략

#### 3.1 반복 검색 구조
```javascript
topics.forEach(topic => {
  for (let iteration = 1; iteration <= 6; iteration++) {
    // 각 토픽을 6번 반복 검색
  }
});
```

**반복 구조:**
- 각 토픽당 6번 반복
- 총 요청 수 = 토픽 수 × 6
- 예: 1개 토픽 → 6개 요청, 2개 토픽 → 12개 요청

#### 3.2 페이지네이션 시도
```javascript
pageToken: iteration === 1 ? '' : '{{$json.nextPageToken}}'
```
- 첫 번째 반복: pageToken 없음
- 2-6번째 반복: 이전 응답의 nextPageToken 사용 시도
- **주의**: 현재 구조상 실제로 작동하지 않을 가능성 있음

#### 3.3 지연 처리
```javascript
delayBeforeNext: iteration < 6 ? 2000 : 0
```
- 각 반복 사이 2초 지연 (마지막 제외)
- API 제한 회피 목적
- 총 지연 시간: (반복 수 - 토픽 수) × 2초

### 4. 출력 데이터 구조

각 반복에 대해 생성되는 JSON 객체:
```javascript
{
  topic: "Huntrix - Golden",           // 검색할 주제
  competitionId: 5,                    // 대회 ID
  iteration: 1,                        // 현재 반복 번호 (1-6)
  pageToken: "",                       // 페이지 토큰 (페이지네이션용)
  apiKey: "AIzaSy...",                // YouTube API 키
  keyIndex: 0,                         // API 키 인덱스 (현재 미사용)
  delayBeforeNext: 2000,               // 다음 반복까지 대기 시간(ms)
  totalIterations: 6,                  // 총 반복 횟수
  currentIteration: 1                  // 현재 반복 번호
}
```

### 5. 에러 처리

#### 5.1 토픽 없음 에러
```javascript
if (!topicRaw) {
  throw new Error('No topic found in Supabase response');
}
```

#### 5.2 API 키 에러
```javascript
if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  throw new Error('Please set your API key');
}
```

#### 5.3 에러 응답 형식
```javascript
{
  message: "Error message",
  success: false,
  error: true
}
```

## 데이터 플로우

```
[Supabase 대회 조회]
        ↓
[토픽 추출 및 파싱]
        ↓
[토픽별 6회 반복 설정]
        ↓
[각 반복에 대한 요청 객체 생성]
        ↓
[다음 노드로 전달 (YouTube API 호출)]
```

## 예상 동작

### 시나리오 1: 단일 토픽
```
입력: { topic: "Huntrix - Golden", id: 5 }
출력: 6개 요청 객체
- Iteration 1: 즉시 실행
- Iteration 2: 2초 후 실행
- Iteration 3: 4초 후 실행
- Iteration 4: 6초 후 실행
- Iteration 5: 8초 후 실행
- Iteration 6: 10초 후 실행
총 소요 시간: 10초
예상 수집 영상: 300개 (50 × 6)
```

### 시나리오 2: 다중 토픽
```
입력: { topic: "Song A, Song B", id: 5 }
출력: 12개 요청 객체
- Song A: 6개 요청
- Song B: 6개 요청
총 소요 시간: 22초 (11개 × 2초 지연)
예상 수집 영상: 600개 (50 × 6 × 2)
```

## 문제점 및 개선 사항

### 현재 문제점

1. **페이지네이션 미작동**
   - `{{$json.nextPageToken}}` 템플릿 문법이 코드 노드에서 작동하지 않음
   - 실제로는 같은 첫 50개 결과를 6번 반복할 가능성

2. **하드코딩된 API 키**
   - 보안 위험
   - 코드에 직접 노출

3. **고정된 반복 횟수**
   - 모든 토픽에 대해 무조건 6번 반복
   - 실제 필요한 영상 수와 무관

4. **단순 반복 전략**
   - 정렬 옵션 변경 없음
   - 검색어 변형 없음

### 개선 제안

#### 1. 실제 페이지네이션 구현
```javascript
// 이전 응답을 저장하고 nextPageToken 사용
const previousResponse = $item(0).json;
const pageToken = previousResponse?.nextPageToken || '';
```

#### 2. 다양한 검색 전략
```javascript
const searchStrategies = [
  { order: 'relevance', query: `${topic} cover` },
  { order: 'date', query: `${topic} cover` },
  { order: 'viewCount', query: `${topic} cover` },
  { order: 'relevance', query: `${topic} acoustic cover` },
  { order: 'relevance', query: `${topic} piano cover` },
  { order: 'relevance', query: `${topic} guitar cover` }
];
```

#### 3. 환경 변수 사용
```javascript
const API_KEY = $env.YOUTUBE_API_KEY;
```

#### 4. 동적 반복 횟수
```javascript
const iterations = Math.ceil(targetVideos / 50);
```

## 로깅 및 디버깅

### 주요 로그 포인트
1. 입력 데이터 확인
2. 토픽 파싱 결과
3. API 키 확인 (일부만 표시)
4. 각 반복 생성 확인
5. 총 예상 결과 수

### 디버그 정보
```javascript
console.log('Topics:', topics.length, '× 6 iterations =', result.length, 'total requests');
console.log('Expected total videos:', topics.length * 6 * 50, 'videos');
console.log('Total expected delay time:', (result.length - topics.length) * 2, 'seconds');
```

## 성능 분석

### API 사용량
- 요청당 API 쿼터: 100 units (Search API)
- 토픽당 사용량: 600 units (6회 × 100)
- 일일 한도: 10,000 units
- 최대 처리 가능: 약 16개 토픽/일

### 시간 복잡도
- 토픽당 소요 시간: 10초 (5개 지연 × 2초)
- n개 토픽: 10n초
- 병렬 처리 불가 (순차 실행)

## 결론

이 노드는 YouTube 검색을 자동화하는 핵심 구성요소입니다. 현재 구현은 기본적인 반복 검색을 수행하지만, 실제 페이지네이션이 작동하지 않아 중복 결과가 많을 것으로 예상됩니다.

### 핵심 기능
- ✅ Supabase에서 동적 토픽 가져오기
- ✅ 다중 토픽 지원
- ✅ API 제한 회피를 위한 지연 처리
- ⚠️ 페이지네이션 (부분적 구현)
- ❌ 검색 다양화 전략

### 권장 개선 우선순위
1. **높음**: 실제 작동하는 페이지네이션 구현
2. **높음**: API 키 환경변수 이동
3. **중간**: 검색 전략 다양화
4. **낮음**: 동적 반복 횟수 조정