# YouTube 영상 검색 로직 분석

## 개요
이 문서는 n8n 워크플로우와 애플리케이션에서 YouTube 영상을 검색하고 수집하는 로직을 상세히 설명합니다.

## 검색 파라미터

### 1. 검색 쿼리 구성
```javascript
q = encodeURIComponent(topic + ' cover')
```
- **topic**: 대회에서 설정한 주제 (예: "Huntrix - Golden")
- **추가 키워드**: " cover"를 자동으로 추가하여 커버 영상만 검색
- **URL 인코딩**: 특수문자 처리를 위해 encodeURIComponent 사용

### 2. 필터링 옵션
```javascript
// YouTube API v3 검색 파라미터
{
  part: 'snippet',           // 기본 정보 (제목, 채널, 썸네일 등)
  type: 'video',             // 영상만 검색 (채널, 플레이리스트 제외)
  videoDuration: 'short',    // 짧은 영상 (4분 이하)
  order: 'relevance',        // 관련성 순으로 정렬
  maxResults: 50             // 한 번에 최대 50개 (API 제한)
}
```

### 3. 검색 파라미터 상세

| 파라미터 | 값 | 설명 |
|---------|---|------|
| **part** | snippet | 영상의 기본 정보 반환 |
| **q** | "{topic} cover" | 검색어 (주제 + cover) |
| **type** | video | 영상 타입만 검색 |
| **videoDuration** | short | 4분 이하 영상만 |
| **order** | relevance | 관련성 순 정렬 |
| **maxResults** | 50 | API 호출당 최대 결과 수 |

## 데이터 수집 프로세스

### 1. 반복 검색 (Iteration)
n8n 워크플로우에서는 동일한 검색을 여러 번 반복하여 더 많은 영상을 수집합니다:

```javascript
// n8n에서 6번 반복 검색
for (let iteration = 1; iteration <= 6; iteration++) {
  // 같은 검색어로 YouTube API 호출
  // 각 호출마다 최대 50개 영상 수집
  // 총 300개 영상 목표 (50 × 6)
}
```

**반복 검색의 이유:**
- YouTube API는 한 번에 최대 50개만 반환
- 동일 검색어로도 매번 약간 다른 결과 반환 (YouTube 알고리즘)
- 더 다양한 영상 수집 가능

### 2. 검색 결과 처리

#### 2.1 썸네일 필터링
```javascript
const videosWithThumbnails = searchResults.filter(item => {
  const hasThumbnail = item.snippet && 
                      item.snippet.thumbnails && 
                      (item.snippet.thumbnails.high?.url || 
                       item.snippet.thumbnails.medium?.url || 
                       item.snippet.thumbnails.default?.url);
  return hasThumbnail;
});
```
- 썸네일이 없는 영상 제외 (삭제되거나 비공개 영상)
- high > medium > default 우선순위로 썸네일 선택

#### 2.2 메타데이터 추가
```javascript
videosWithThumbnails.forEach(video => {
  video._searchTopic = topic;           // 검색 주제
  video._iteration = iteration;         // 반복 회차
  video._competitionId = competitionId; // 대회 ID
});
```

### 3. 중복 제거
```javascript
// 중복 ID 체크
const uniqueVideoIds = [...new Set(allVideoIds)];

// 중복 제거 로직
const uniqueSearchResults = [];
const seenIds = new Set();

allSearchResults.forEach(item => {
  const videoId = item.id?.videoId;
  if (videoId && !seenIds.has(videoId)) {
    seenIds.add(videoId);
    uniqueSearchResults.push(item);
  }
});
```

**중복 발생 원인:**
- 여러 번 반복 검색 시 같은 영상이 여러 번 나타날 수 있음
- YouTube 알고리즘이 인기 영상을 여러 검색에서 반복 노출

### 4. 배치 처리
```javascript
// 50개씩 배치로 나누기 (YouTube API 제한)
const batches = [];
for (let i = 0; i < uniqueVideoIds.length; i += 50) {
  batches.push(uniqueVideoIds.slice(i, i + 50));
}
```

**배치 처리 이유:**
- YouTube Videos API는 한 번에 최대 50개 ID만 처리
- 상세 정보 조회를 위해 배치로 나누어 처리

## 상세 정보 수집

### 1. Videos API 호출
검색으로 얻은 영상 ID로 상세 정보를 추가로 조회:

```javascript
// 영상 상세 정보 가져오기
const detailsResponse = await fetch(
  `${YOUTUBE_API_BASE_URL}/videos?` +
  `part=statistics,snippet,contentDetails,status&` +
  `id=${videoIds}&` +  // 쉼표로 구분된 ID 목록
  `key=${YOUTUBE_API_KEY}`
)
```

### 2. 수집되는 정보

#### 기본 정보 (snippet)
- title: 영상 제목
- channelTitle: 채널명
- description: 영상 설명
- publishedAt: 업로드 날짜
- thumbnails: 썸네일 URL들
- tags: 태그 목록
- categoryId: 카테고리 ID

#### 통계 정보 (statistics)
- viewCount: 조회수
- likeCount: 좋아요 수
- dislikeCount: 싫어요 수 (현재 비공개)
- favoriteCount: 즐겨찾기 수
- commentCount: 댓글 수

#### 콘텐츠 정보 (contentDetails)
- duration: 영상 길이 (ISO 8601 형식)
- dimension: 2D/3D
- definition: HD/SD
- caption: 자막 여부

#### 상태 정보 (status)
- privacyStatus: 공개/비공개/일부공개
- embeddable: 임베드 가능 여부
- madeForKids: 아동용 콘텐츠 여부

## 검색 최적화 전략

### 1. 다양성 확보
- 같은 검색어로 6번 반복하여 다양한 결과 수집
- YouTube의 추천 알고리즘 변동성 활용

### 2. 품질 필터링
- 썸네일이 있는 영상만 선택 (활성 영상)
- 4분 이하 짧은 영상 우선 (커버곡 특성)

### 3. 효율성
- 배치 처리로 API 호출 최소화
- 중복 제거로 불필요한 처리 방지

## 데이터 플로우

```
[Competition Topic 조회]
         ↓
[YouTube Search API 호출] × 6회
         ↓
[검색 결과 수집 (최대 300개)]
         ↓
[썸네일 필터링]
         ↓
[중복 제거]
         ↓
[배치 생성 (50개씩)]
         ↓
[Videos API로 상세 정보 조회]
         ↓
[최종 데이터 처리]
```

## 예시 시나리오

### 주제: "Huntrix - Golden"

1. **검색어 생성**: "Huntrix - Golden cover"
2. **1차 검색**: 50개 영상 ID 수집
3. **2차 검색**: 추가 50개 (일부 중복 가능)
4. **3차 검색**: 추가 50개
5. **4차 검색**: 추가 50개
6. **5차 검색**: 추가 50개
7. **6차 검색**: 추가 50개
8. **중복 제거**: 300개 → 약 250개 (예상)
9. **배치 처리**: 5개 배치 (50×5)
10. **상세 정보 조회**: 250개 영상 완전한 정보 획득

## API 제한 사항

### YouTube Data API v3 쿼터
- 일일 쿼터: 10,000 units
- Search API: 100 units per call
- Videos API: 1 unit per call

### 쿼터 사용 예시
```
검색 6회: 600 units (100 × 6)
상세 조회 5배치: 5 units (1 × 5)
총 사용: 605 units
```

## 에러 처리

### 일반적인 에러
1. **API 키 문제**: 유효하지 않거나 만료된 키
2. **쿼터 초과**: 일일 한도 초과
3. **네트워크 에러**: 연결 실패
4. **빈 결과**: 검색 결과 없음

### 에러 처리 전략
```javascript
try {
  // API 호출
} catch (error) {
  console.log('Error message:', error.message);
  return {
    message: error.message,
    success: false,
    competition_id: competitionId
  };
}
```

## 개선 가능 사항

### 1. 검색 다양화
- 다양한 검색어 조합 (cover, remix, acoustic 등)
- 시간대별 검색 (publishedAfter 파라미터)
- 언어별 검색 (relevanceLanguage 파라미터)

### 2. 스마트 중복 제거
- 제목 유사도 검사
- 채널명 + 길이 조합으로 중복 감지

### 3. 캐싱 전략
- 자주 검색되는 주제 캐싱
- 영상 정보 캐싱으로 API 호출 감소

## 결론

현재 YouTube 검색 로직은 단순하지만 효과적인 방식으로 구현되어 있습니다:
- **검색어**: 주제 + "cover" 키워드
- **반복 검색**: 6회 반복으로 다양성 확보
- **필터링**: 짧은 영상, 썸네일 있는 영상
- **중복 제거**: Set 자료구조 활용
- **배치 처리**: API 제한 준수

이 시스템은 주어진 주제에 대해 충분한 양의 고품질 커버 영상을 수집하여, 사용자들이 투표하고 순위를 매길 수 있는 기반을 제공합니다.