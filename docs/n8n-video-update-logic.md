# n8n 영상 업데이트 로직 상세 설명

## 개요
이 문서는 n8n 워크플로우의 최종처리 노드에서 YouTube 영상 데이터를 업데이트하고 순위를 재산정하는 로직을 상세히 설명합니다.

## 핵심 원칙
1. **기존 영상 업데이트**: YouTube API에서 최신 조회수와 좋아요를 가져와 업데이트
2. **신규 영상 추가**: 새로 발견된 영상을 데이터베이스에 추가
3. **스코어 재산정**: 모든 영상의 스코어를 다시 계산
4. **순위 재산정**: 전체 영상을 스코어 기준으로 정렬하여 새로운 순위 부여
5. **순위 변동 추적**: 이전 순위와 현재 순위를 비교하여 변동 사항 파악

## 상세 로직

### 1. 데이터 입력 및 준비

#### 1.1 입력 데이터 (3가지 소스)
```javascript
// 1. 대회 정보 (competitions 테이블)
const competitionItem = {
  id: 5,
  topic: "Huntrix - Golden",
  // ... 기타 대회 정보
}

// 2. YouTube API 응답 (새로 검색된 영상들)
const youtubeDetailsItems = [
  {
    body: {
      items: [/* YouTube 영상 상세 정보 */]
    }
  }
]

// 3. 기존 데이터베이스 영상들 (coversong_videos 테이블)
const existingVideoItems = [
  {
    youtube_id: "abc123",
    arena_likes: 10,
    guest_likes: 5,
    rank: 3,
    // ... 기타 필드
  }
]
```

#### 1.2 기존 영상 Map 생성
```javascript
const existingVideosMap = new Map();
existingVideos.forEach(video => {
  existingVideosMap.set(video.youtube_id, {
    arena_likes: video.arena_likes,    // 사이트 내 좋아요 (유지)
    guest_likes: video.guest_likes,    // 게스트 좋아요 (유지)
    topic: video.topic,
    competition_id: video.competition_id,
    current_rank: video.rank,          // 현재 순위
    previous_rank: video.previous_rank // 이전 순위
  });
});
```

### 2. 영상 처리 로직

#### 2.1 각 YouTube 영상 처리
```javascript
const processedVideos = videosWithThumbnails.map(videoFromApi => {
  const youtubeId = videoFromApi.id;
  const existingVideo = existingVideosMap.get(youtubeId);
  
  // YouTube API에서 최신 통계 가져오기
  const views = parseInt(statistics?.viewCount || 0);
  const likes = parseInt(statistics?.likeCount || 0);
  
  // 기존 영상인지 신규 영상인지 판단
  if (existingVideo) {
    // 기존 영상: 사이트 좋아요 유지, YouTube 통계만 업데이트
    arena_likes = existingVideo.arena_likes;
    guest_likes = existingVideo.guest_likes;
    previous_rank = existingVideo.current_rank;
  } else {
    // 신규 영상: 사이트 좋아요 0으로 시작
    arena_likes = 0;
    guest_likes = 0;
    previous_rank = null;
    newVideos.push(youtubeId);
  }
});
```

#### 2.2 스코어 계산 공식
```javascript
// 1단계: YouTube 기반 스코어 (매일 업데이트됨)
const candidate_score = views + (likes * 100);

// 2단계: 사이트 활동 반영 스코어
const site_score = candidate_score + (arena_likes * 500) + (guest_likes * 10);

// 최종 스코어
const final_score = site_score;
```

**스코어 가중치 설명:**
- 조회수: 1점
- YouTube 좋아요: 100점
- Arena 좋아요 (사이트 내 투표): 500점
- Guest 좋아요: 10점

### 3. 순위 재산정

#### 3.1 정렬 및 순위 부여
```javascript
// site_score 기준 내림차순 정렬
allVideos.sort((a, b) => b.site_score - a.site_score);

// 순위 부여 (동점자 처리)
let currentRank = 1;
let currentScore = null;

allVideos.forEach((v, i) => {
  if (currentScore !== v.site_score) {
    currentRank = i + 1;  // 동점자가 아니면 실제 순위
    currentScore = v.site_score;
  }
  v.rank = currentRank;   // 동점자는 같은 순위
});
```

#### 3.2 상위 100개 선택
```javascript
const top100 = allVideos.slice(0, 100);
```

### 4. 순위 변동 분석

#### 4.1 변동 유형 분류
```javascript
top100.forEach(video => {
  if (video.previous_rank === null) {
    // 신규 진입
    newCount++;
  } else if (video.rank < video.previous_rank) {
    // 순위 상승 (숫자가 작아짐)
    upCount++;
  } else if (video.rank > video.previous_rank) {
    // 순위 하락 (숫자가 커짐)
    downCount++;
  } else {
    // 순위 유지
    sameCount++;
  }
});
```

### 5. 데이터베이스 저장

#### 5.1 Supabase Upsert
```javascript
// 전체 영상 데이터를 upsert (중복 시 업데이트)
const response = await httpRequest({
  method: 'POST',
  url: `${SUPABASE_URL}/rest/v1/coversong_videos`,
  headers: {
    'Prefer': 'resolution=merge-duplicates,return=representation'
  },
  body: allVideos
});
```

#### 5.2 순위 히스토리 업데이트
```javascript
// 일일 순위 기록을 위한 함수 호출
await httpRequest({
  method: 'POST',
  url: `${SUPABASE_URL}/rest/v1/rpc/daily_rank_update`
});
```

## 데이터 플로우 다이어그램

```
[YouTube API] ─────┐
                   ├──> [영상 처리] ──> [스코어 계산] ──> [순위 정렬]
[기존 DB 데이터] ──┘                                          │
                                                             ↓
                                                    [상위 100개 선택]
                                                             │
                                                             ↓
                                                    [DB 저장 (Upsert)]
                                                             │
                                                             ↓
                                                    [순위 히스토리 기록]
```

## 주요 특징

### 1. 공정한 순위 시스템
- **기존 영상 우대**: arena_likes와 guest_likes가 누적되어 스코어에 반영
- **신규 영상 기회**: YouTube 조회수와 좋아요가 높으면 즉시 상위 진입 가능

### 2. 데이터 일관성
- **중복 방지**: youtube_id를 기준으로 upsert 수행
- **데이터 보존**: 사이트 내 활동 데이터(arena_likes, guest_likes)는 항상 유지

### 3. 순위 변동 추적
- **previous_rank**: 이전 순위 저장으로 변동 추이 파악
- **순위 히스토리**: 일별 순위 변화를 별도 테이블에 기록

## 예시 시나리오

### 시나리오 1: 기존 1위 영상
```
어제: views=10000, likes=100, arena_likes=5
     → candidate_score = 10000 + 10000 = 20000
     → site_score = 20000 + 2500 = 22500
     → rank = 1

오늘: views=12000, likes=120, arena_likes=5 (유지)
     → candidate_score = 12000 + 12000 = 24000
     → site_score = 24000 + 2500 = 26500
     → rank = 1 (유지 또는 변동)
```

### 시나리오 2: 신규 진입 영상
```
오늘: views=50000, likes=500, arena_likes=0 (신규)
     → candidate_score = 50000 + 50000 = 100000
     → site_score = 100000 + 0 = 100000
     → rank = 1 (바로 1위 가능)
     → previous_rank = null (신규 표시)
```

## 최적화 포인트

1. **배치 처리**: 모든 영상을 한 번에 처리하여 API 호출 최소화
2. **Map 자료구조**: O(1) 조회 시간으로 빠른 기존 영상 확인
3. **조건부 로깅**: 필요한 정보만 선택적으로 출력

## 에러 처리

- 대회 정보 없음: "대회 정보를 찾을 수 없습니다."
- YouTube 데이터 없음: "YouTube 데이터를 찾을 수 없습니다."
- Supabase 저장 실패: 상세 에러 메시지와 함께 실패 반환

## 결론

이 로직은 YouTube의 실시간 인기도와 사이트 내 사용자 활동을 균형있게 반영하여, 공정하고 투명한 순위 시스템을 구현합니다. 매일 자동으로 실행되어 최신 트렌드를 반영하면서도, 커뮤니티의 선호도를 존중하는 하이브리드 랭킹 시스템입니다.