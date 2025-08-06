# 프로젝트 구조

## 📁 폴더 구조

```
CoverCompetition/
│
├── 📂 components/          # React 컴포넌트
│   ├── CompetitionArena.js  # 경쟁 아레나 컴포넌트
│   ├── Header.js            # 헤더 컴포넌트
│   ├── RankChangeSummary.js # 순위 변동 요약
│   ├── RankChangeSummaryEnhanced.js # 향상된 순위 변동
│   ├── RisingStarVideo.js  # 급상승 영상
│   ├── Top3Videos.js       # TOP 3 영상
│   ├── VideoTable.js        # 영상 테이블
│   └── ...
│
├── 📂 pages/               # Next.js 페이지
│   ├── index.js            # 메인 페이지
│   ├── admin.js            # 관리자 페이지
│   ├── auth.js             # 인증 페이지
│   └── api/                # API 라우트
│       ├── rank-history.js
│       └── videos.js
│
├── 📂 lib/                 # 라이브러리 및 유틸리티
│   ├── supabase.js         # Supabase 클라이언트
│   ├── youtube.js          # YouTube API
│   ├── rankTracker.js      # 순위 추적
│   └── rankHistoryTracker.js # 순위 히스토리 추적
│
├── 📂 database/            # 데이터베이스 관련 파일
│   ├── migrations/         # DB 마이그레이션
│   │   ├── supabase-schema.sql
│   │   ├── create-rank-history-tables.sql
│   │   └── fix-likes-schema.sql
│   │
│   ├── functions/          # DB 함수 및 트리거
│   │   ├── auto-calculate-ranks-function.sql
│   │   └── fix-trigger.sql
│   │
│   ├── admin/              # 관리자 관련 SQL
│   │   ├── admin-setup.sql
│   │   └── verify-admin.sql
│   │
│   └── debug/              # 디버그 및 수정 스크립트
│       ├── fix-rank-history-schema.sql
│       ├── init-rank-history.sql
│       └── rank-changes-analysis.sql
│
├── 📂 scripts/             # 스크립트 파일
│   ├── n8n/                # n8n 워크플로우 코드
│   │   ├── n8n-code-final-with-history.js
│   │   └── n8n-code-node-final-processing.js
│   │
│   ├── utilities/          # 유틸리티 스크립트
│   │   └── update-n8n-code.js
│   │
│   └── updateCandidates.js # 후보 업데이트 스크립트
│
├── 📂 styles/              # 스타일 파일
│   └── globals.css
│
├── 📂 supabase/            # Supabase 설정
│   ├── config.toml
│   └── functions/
│
├── 📂 docs/                # 문서
│   └── PROJECT_STRUCTURE.md # 프로젝트 구조 문서
│
└── 📄 설정 파일들
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── README.md
```

## 📝 주요 파일 설명

### Database 폴더
- **migrations/**: 데이터베이스 스키마 및 테이블 생성 SQL
- **functions/**: 저장 프로시저, 함수, 트리거
- **admin/**: 관리자 권한 및 설정 관련
- **debug/**: 개발 중 사용한 디버그 및 수정 스크립트

### Scripts 폴더
- **n8n/**: n8n 워크플로우에서 사용하는 코드 노드 스크립트
- **utilities/**: 프로젝트 유틸리티 스크립트

## 🔧 주요 기능별 파일 위치

### 순위 히스토리 시스템
- DB 스키마: `database/migrations/create-rank-history-tables.sql`
- API: `pages/api/rank-history.js`
- 추적 로직: `lib/rankHistoryTracker.js`
- UI 컴포넌트: `components/RankChangeSummaryEnhanced.js`

### n8n 워크플로우
- 최종 처리 코드: `scripts/n8n/n8n-code-final-with-history.js`
- 사용 방법: n8n의 Code 노드에 복사하여 사용

### 관리자 기능
- 페이지: `pages/admin.js`
- 설정 SQL: `database/admin/admin-setup.sql`