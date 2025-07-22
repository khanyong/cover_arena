# 🎵 Cover Battle Arena 100

100개 실시간 커버송 competition 플랫폼

## 🎯 주요 기능

### 🏆 Competition 시스템
- 다양한 주제의 커버송 competition
- 실시간 평가에 따른 영상 크기 변화
- 격자 레이아웃으로 시각적 경쟁

### 🗳️ 주제 제안 시스템
- 현재 competition 진행 중에도 다음 주제 제안 가능
- 실시간 주제 투표 및 순위 표시
- 자동 주제 전환 시스템

### 👥 사용자 시스템
- 로그인 사용자: 1점 평가
- 비로그인 사용자: 0.0001점 평가
- IP 기반 봇 방지 시스템

### 📊 실시간 업데이트
- WebSocket을 통한 실시간 데이터 동기화
- 동적 격자 레이아웃 업데이트
- 실시간 순위 및 통계

### 🎬 YouTube API 연동
- 주제별 영상 자동 스크랩
- 실시간 좋아요 수 동기화
- 동적 격자 크기 변화

## 🚀 시작하기

### 1. Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. **SQL Editor**에서 `supabase-schema.sql` 파일의 내용을 복사하여 실행
3. Settings > API에서 URL과 anon key 복사

### 2. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일 생성:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
```

### 3. 의존성 설치
```bash
npm install
```

### 4. YouTube API 키 설정 (선택사항)
실제 유튜브 영상을 스크랩하려면 YouTube Data API v3 키가 필요합니다:

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 API 키 발급
2. `.env.local` 파일에 API 키 추가

### 5. Admin 사용자 생성
1. 일반 사용자로 회원가입
2. Supabase Dashboard > Table Editor > `profiles` 테이블에서 해당 사용자의 `is_admin`을 `true`로 변경
3. 또는 SQL Editor에서 다음 명령 실행:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### 6. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 🎮 사용 방법

### 영상 평가하기
1. 격자에서 영상에 마우스 올리면 자동재생
2. 영상 클릭 시 전체화면 팝업
3. 팝업에서 ❤️ 좋아요 버튼으로 투표
4. 투표 수에 따라 격자에서 영상 크기가 실시간 변화

### 주제 변경하기
1. 상단의 "다음 Competition 주제 제안" 섹션에서
2. 새로운 주제 제안 또는 기존 주제 투표
3. "선택" 버튼으로 즉시 주제 변경

## 📁 프로젝트 구조

```
├── components/          # React 컴포넌트
│   ├── VideoGrid.js    # 동적 격자 레이아웃
│   ├── VideoCard.js    # 개별 영상 카드
│   ├── Header.js       # 헤더 컴포넌트
│   └── TopicSuggestion.js # 주제 제안 시스템
├── pages/              # Next.js 페이지
│   ├── index.js        # 메인 페이지
│   └── api/            # API 라우트
│       └── videos.js   # 유튜브 영상 스크랩 API
├── lib/                # 유틸리티 함수
│   └── youtube.js      # YouTube API 연동
└── styles/             # CSS 스타일
    └── globals.css     # 전역 스타일
```

## 🔧 기술 스택

- **Frontend**: Next.js, React, Tailwind CSS
- **API**: YouTube Data API v3
- **실시간**: WebSocket (예정)
- **데이터베이스**: PostgreSQL (예정)

## 🎯 핵심 특징

### 🎬 **실제 유튜브 임베드**
- 각 격자에 실제 유튜브 플레이어
- 호버 시 자동재생 (음소거)
- 클릭 시 전체화면 재생

### 📊 **동적 크기 변화**
- 좋아요 수에 따른 실시간 크기 변화
- 부드러운 애니메이션 전환
- 상대적 크기 분배 시스템

### 🗳️ **실시간 투표**
- 팝업에서 좋아요 = 투표
- 즉시 격자 크기 재계산
- 시각적 경쟁 요소

### 🔄 **자동 스크랩**
- 주제 변경 시 자동으로 관련 영상 검색
- YouTube API 연동으로 실시간 데이터
- 샘플 데이터로 개발 환경 지원 