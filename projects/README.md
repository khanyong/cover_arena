# Projects Directory Structure

이 디렉토리는 여러 독립적인 프로젝트를 관리합니다.

## 폴더 구조

```
projects/
├── cover-arena/          # Cover Battle Arena 프로젝트
│   ├── components/       # Arena 전용 컴포넌트 (20개)
│   ├── lib/              # Arena 전용 라이브러리 (4개)
│   ├── api/              # Arena 전용 API 라우트 (10개)
│   └── pages/            # Arena 전용 페이지
│
├── three-body/           # 삼체 프로젝트 (예정)
│   ├── components/
│   ├── lib/
│   ├── api/
│   └── pages/
│
└── [future-projects]/    # 향후 추가 프로젝트
```

## 프로젝트 추가 방법

1. `projects/` 폴더에 새 프로젝트 폴더 생성
2. 표준 구조로 폴더 생성: `components/`, `lib/`, `api/`, `pages/`
3. `shared/` 폴더의 공통 리소스 활용
4. `pages/index.js`에서 랜딩 페이지에 프로젝트 추가

## 공유 리소스

프로젝트 간 공유되는 리소스는 `shared/` 폴더에 위치:
- `shared/lib/` - 공통 라이브러리 (supabase 등)
- `shared/components/` - 공통 컴포넌트 (LandingPage 등)
- `shared/styles/` - 공통 스타일

## 주의사항

- 각 프로젝트는 독립적으로 관리
- 프로젝트 간 직접 참조 금지 (shared 폴더 활용)
- API 라우트는 프로젝트별로 prefix 사용 권장
