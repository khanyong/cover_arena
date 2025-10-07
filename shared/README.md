# Shared Resources Directory

이 디렉토리는 모든 프로젝트에서 공유하는 리소스를 관리합니다.

## 폴더 구조

```
shared/
├── lib/              # 공통 라이브러리
│   └── supabase.js   # Supabase 클라이언트 설정
│
├── components/       # 공통 컴포넌트
│   └── LandingPage.js  # 메인 랜딩 페이지
│
└── styles/           # 공통 스타일
```

## 사용 방법

### 프로젝트에서 shared 리소스 import

```javascript
// Supabase 클라이언트 사용
import { supabase } from '../../../shared/lib/supabase'

// 공통 컴포넌트 사용
import Component from '../../../shared/components/Component'
```

## 추가 규칙

- 프로젝트 특화 로직은 shared에 추가하지 않음
- 2개 이상의 프로젝트에서 사용하는 경우만 shared로 이동
- 공통 타입 정의, 유틸리티 함수 등 추가 가능
