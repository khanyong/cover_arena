export type Metric = {
  label: string
  value: string
}

export type Feature = {
  title: string
  desc: string
}

export type Project = {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  year: string
  status: 'active' | 'development' | 'archived'
  path?: string
  metrics?: Metric[]
  overview: string
  problemStatement?: string
  solution?: string
  technicalHighlights?: string[]
  results?: string
  tech: string[]
  features?: Feature[]
  thumbnail?: string
  executiveSummary?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'spatial-vibration-1',
    slug: 'spatial-vibration-1',
    title: 'Academic Paper: Spatial Vibration Hypothesis',
    subtitle: 'Interactive Peer-Review & Simulation Platform',
    category: 'Theoretical Physics & Web Platform',
    year: '2026',
    status: 'active',
    path: '/papers',
    executiveSummary: '양자역학의 코펜하겐 해석 한계를 극복하기 위해 제안된 "공간의 진동" 가설 논문과 이를 인터랙티브하게 검증하는 피어 리뷰/시뮬레이션 플랫폼입니다.',
    metrics: [
      { label: 'Chapters', value: '7' },
      { label: 'Sandbox', value: 'Double-Slit' },
      { label: 'Status', value: 'Rebuttal' },
    ],
    overview: '현대 양자학설의 이중성 역설을 "입자의 실재성과 배경 공간의 미세 진동 분리" 가설로 재해석한 이론 물리 논문입니다. 독자가 논문을 직접 읽으며 이중 슬릿 샌드박스로 물리 궤적을 확인하고, 피어 리뷰어들의 지적 사항 및 은닉 변수 버전별 차이를 비교(Mosaic/Diff)할 수 있는 학술 아카이브 형태의 인터랙티브 플랫폼을 제공합니다.',
    problemStatement: '양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률로 정의하고 대상의 실재성을 배제하는 등, 철학적·물리적으로 직관적 이해가 극히 어렵습니다. 또한 복잡한 은닉 변수 제안이나 피어 리뷰 피드백 수정본들을 일반 정적 논문 파일(PDF)만으로는 직관적으로 대조 학습하고 시각적으로 검증하기가 불가능에 가깝습니다.',
    solution: '전자의 실재 궤적 진동과 요동하는 배경 공간을 분리하는 "공간 진동 퍼텐셜"을 제안하고, 이중 슬릿 시뮬레이션 샌드박스를 개발하여 독자가 파동성과 입자성의 합치를 브라우저상에서 실시간으로 시각화하고 검증할 수 있도록 연동했습니다. 아울러 문단별 은닉 변수 수정안을 직접 토글해서 조립하는 모자이크(Mosaic) 및 디프(Diff) 분석 모듈을 제공하고, 학술지(arXiv/Nature/PRL/IEEE) 포맷에 맞춘 맞춤형 서체와 인용 레이아웃을 제공합니다.',
    technicalHighlights: [
      '인터랙티브 이중 슬릿 샌드박스: HTML5 Canvas 기반 물리 궤적 시각화',
      '인라인 모자이크 조립(Mosaic Mode): 단락 레벨 양방향 텍스트 스위칭',
      '버전 디프 비교: PaperDiffViewer 기반 V1 Draft vs V2 Final 대칭 레이아웃',
      '다이내믹 학술지 포맷팅: arXiv, Nature, PRL, IEEE 스타일 및 References 동적 렌더링',
      '수식 레이텍 마운트: MathJax 연동을 통한 TeX 수식의 완벽한 폰트 렌더링'
    ],
    results: '제1논문(spatial-vibration-1)의 7개 장 및 초록, 참고문헌 컴파일 수집 완료. 샌드박스 연동 및 버전 스위칭, 다국어 뷰 구축 및 빌드 성공.',
    tech: [
      'Next.js (Turbopack)',
      'TypeScript',
      'MathJax (LaTeX)',
      'HTML5 Canvas',
      'Supabase',
      'PostgreSQL',
      'Tailwind CSS'
    ],
    features: [
      { title: '물리 샌드박스', desc: '이중 슬릿 실험에서의 공간 요동파($\\Psi$) 및 입자 궤적 시뮬레이터' },
      { title: '모자이크 조립', desc: '문단별 원하는 버전(V1/V2/V3)을 조립하여 맞춤식으로 읽기' },
      { title: '학술지 포맷팅', desc: 'arXiv, Nature, PRL, IEEE 양식에 따른 서체, 라벨, 인용구 레이아웃 실시간 교체' },
      { title: '피어 리뷰 연동', desc: '논문 지점별 리뷰어 질의응답 및 락 해제 인증 시스템' }
    ]
  },
  {
    id: 'bll-pro',
    slug: 'bll-pro',
    title: 'BLL Pro',
    subtitle: 'Bar Exam Learning Platform',
    category: 'LegalTech & EdTech',
    year: '2024',
    status: 'active',
    path: 'https://www.bll-pro.com/',

    executiveSummary: '미국 변호사 시험(Bar Exam) 준비를 위한 올인원 법률 교육 플랫폼입니다. MBE 객관식, MEE 에세이, MPT 문서 작성 시스템과 2,500+ 법률 용어 사전, AI 기반 답안 평가를 제공합니다.',

    metrics: [
      { label: 'Legal Terms', value: '2.5K+' },
      { label: 'Mind Maps', value: '35+' },
      { label: 'Features', value: '7' },
    ],

    overview: '미국 변호사 시험의 세 가지 주요 영역(MBE, MEE, MPT)을 체계적으로 학습할 수 있는 종합 플랫폼입니다. 법률 용어 사전, 판례 분석, 스터디 그룹, 학습 시간 추적 등 다양한 학습 도구를 제공합니다.',

    problemStatement: 'Bar Exam 응시자들은 객관식(MBE), 에세이(MEE), 문서 작성(MPT) 세 영역을 모두 준비해야 하지만, 통합된 학습 플랫폼이 없습니다. 또한 방대한 법률 용어와 판례를 효율적으로 학습하고, 답안 작성 실력을 객관적으로 평가받기 어렵습니다.',

    solution: 'MBE 객관식 문제 풀이 시스템, Lexical 에디터 기반 MEE 에세이 작성, PDF 라이브러리가 포함된 MPT 문서 작성 환경을 하나의 플랫폼으로 통합했습니다. 2,500+ 법률 용어 사전과 35개 마인드맵으로 체계적 학습을 지원하며, 키워드 기반 자동 채점과 AI 평가로 실력 향상을 돕습니다.',

    technicalHighlights: [
      '전역 Supabase 쿼리 인터셉터: Proxy 패턴으로 자동 세션 검증 및 타임아웃 적용',
      '3층 세션 갱신 시스템: App/AuthContext/쿼리 레벨 자동 토큰 갱신',
      'Lexical 에디터: 리치 텍스트 + 마크다운 + 자동 저장(30초)',
      '학습 시간 추적: useStudyTimeTracker 훅으로 페이지별 자동 기록',
      '키워드 자동 채점: String similarity 알고리즘 기반 에세이 평가',
      '마인드맵 자동 생성: 35개 스크립트로 Mermaid 다이어그램 자동 생성',
      'Row Level Security: 모든 테이블에 RLS 정책 적용으로 보안 강화'
    ],

    results: 'Phase 2 완료(Lexical 에디터 통합), 2,500+ 법률 용어 데이터베이스 구축, 35개 과목별 마인드맵 생성, MBE/MEE/MPT 전 영역 시스템 구현, 커뮤니티 및 스터디 그룹 기능 활성화, Vercel 배포 완료.',

    tech: [
      'React 18',
      'React Router v7',
      'Material-UI',
      'Zustand',
      'Supabase',
      'PostgreSQL',
      'Lexical',
      'Marked',
      'Turndown',
      'Recharts',
      'Mermaid',
      'DOMPurify',
      'Vercel'
    ],

    features: [
      { title: 'MBE 테스트', desc: '객관식 문제 풀이, 오답 노트, 과목별 진도 관리' },
      { title: 'MEE 에세이', desc: 'Lexical 에디터, 자동 저장, 키워드 채점' },
      { title: 'MPT 문서', desc: 'PDF 라이브러리, 법률 템플릿, 90분 타이머' },
      { title: '법률 용어 사전', desc: '2,500+ 용어, 과목별 분류, 예문 제공' },
      { title: '학습 통계', desc: '시간 추적, 정답률 분석, Recharts 시각화' },
      { title: '커뮤니티', desc: '스터디 그룹, 합격 수기, 판례 분석 공유' }
    ]
  },
  {
    id: 'kyyquant',
    slug: 'kyyquant-ai-solution',
    title: 'KyyQuant AI Solution',
    subtitle: 'AI-Powered Quantitative Trading Platform',
    category: 'FinTech & Trading Systems',
    year: '2024',
    status: 'active',
    path: 'https://kyyquant.com/',

    executiveSummary: 'AI 기반 퀀트 트레이딩 플랫폼으로 드래그 앤 드롭 전략 빌더, 멀티 종목 백테스팅, 키움 OpenAPI 연동 자동매매를 제공합니다. React 18 + TypeScript + Supabase로 구축되었으며, 81% 개발 완료(22/28 tasks)입니다.',

    metrics: [
      { label: 'Development', value: '81%' },
      { label: 'Stock Data', value: '2.8K+' },
      { label: 'Tech Stack', value: '15+' },
    ],

    overview: '한국 주식 시장을 위한 AI 기반 퀀트 트레이딩 플랫폼입니다. 코딩 없이 투자 전략을 구성하고, 실제 데이터로 백테스트하며, 키움증권 API를 통해 자동매매를 실행할 수 있습니다.',

    problemStatement: '개인 투자자들은 프로그래밍 지식 없이 체계적인 퀀트 투자를 하기 어려우며, 전략 백테스팅과 자동매매 시스템 구축에 높은 기술적 장벽이 존재합니다. 또한 증권사 API 연동과 데이터 수집이 복잡합니다.',

    solution: '드래그 앤 드롭 기반 전략 빌더로 비개발자도 복잡한 투자 전략을 구성할 수 있습니다. Supabase + FastAPI 아키텍처로 2,878개 한국 주식의 실시간 데이터를 수집하고, TensorFlow 기반 백테스팅 엔진으로 전략을 검증합니다. 키움 REST API와 n8n 워크플로우를 통해 자동매매를 실행합니다.',

    technicalHighlights: [
      '전략 빌더: 3단계 전략 시스템, 15+ 기술적 지표, AND/OR 로직 조합',
      '백테스팅: 멀티 종목 동시 백테스트, 분할 매수/매도, MDD/샤프지수 계산',
      '데이터 수집: 키움 REST API + pykrx로 2,878개 종목 시세 자동 수집',
      '자동매매: NAS 서버 기반 n8n 워크플로우, APScheduler 스케줄링',
      '실시간 시스템: Supabase Realtime으로 포지션/계좌 실시간 동기화',
      'AI 최적화: 전략 분석, 완성도 점수, 최적 파라미터 제안',
      '커뮤니티: 전략 공유, 백테스트 결과 공유, 8개 게시판'
    ],

    results: '현재 22개 주요 개발 태스크 완료(81%), 2,878개 한국 주식 데이터 수집, 완전한 백테스팅 엔진 구현, 키움 REST API 연동 성공, Vercel 자동 배포 완료. 실전 투자 준비 단계입니다.',

    tech: [
      'React 18',
      'TypeScript',
      'Material-UI',
      'Redux Toolkit',
      'Supabase',
      'PostgreSQL',
      'Python',
      'FastAPI',
      '키움 OpenAPI',
      'TensorFlow',
      'Chart.js',
      'n8n',
      'Docker',
      'Vercel'
    ],

    features: [
      { title: '전략 빌더', desc: '드래그 앤 드롭으로 복잡한 투자 전략 구성' },
      { title: '백테스팅', desc: '실제 데이터 기반 전략 성과 검증 및 리스크 분석' },
      { title: '자동매매', desc: '키움 API 연동으로 전략 자동 실행' },
      { title: '투자 유니버스', desc: '3,349개 종목 필터링 및 선별 시스템' },
      { title: 'AI 분석', desc: '전략 최적화 및 성과 예측' },
      { title: '커뮤니티', desc: '전략 공유 및 백테스트 결과 공유' }
    ]
  },
  {
    id: 'cover-arena',
    slug: 'cover-arena',
    title: 'Cover Battle Arena',
    subtitle: 'Real-time K-pop Cover Competition Platform',
    category: 'Full-Stack Web Application',
    year: '2024',
    status: 'active',
    path: '/app',

    executiveSummary: '케이팝 커버 아티스트를 위한 실시간 경쟁 플랫폼으로, YouTube API 자동 연동과 커뮤니티 투표 시스템을 통해 공정한 순위 경쟁 환경을 제공합니다. 1,200+ 활성 사용자, 일일 500+ 참여자, 15,000+ 투표를 기록 중입니다.',

    metrics: [
      { label: 'Active Users', value: '1.2K+' },
      { label: 'Daily Active', value: '500+' },
      { label: 'Total Votes', value: '15K+' },
    ],

    overview: '케이팝 커버 영상 아티스트들을 위한 실시간 경쟁 플랫폼입니다. 매일 자동으로 업데이트되는 순위 시스템과 커뮤니티 투표를 통해 아티스트들이 공정하게 경쟁할 수 있는 환경을 제공합니다.',

    problemStatement: '커버 아티스트들은 자신의 실력을 객관적으로 평가받을 수 있는 플랫폼이 부족했습니다. 기존 플랫폼들은 단순 조회수 위주의 평가나 주관적인 커뮤니티 반응에 의존했으며, 실시간 경쟁 시스템과 투명한 평가 기준이 없었습니다.',

    solution: 'YouTube API v3를 활용한 자동 데이터 수집, Supabase 실시간 구독을 통한 즉각적인 순위 업데이트, 그리고 조회수/좋아요/커뮤니티 투표를 종합한 가중치 기반 랭킹 시스템을 제공합니다. 회원 인증 및 중복 투표 방지 시스템으로 공정성을 보장하며, Chart.js를 활용한 상세 분석 대시보드로 아티스트들의 성장을 추적할 수 있습니다.',

    technicalHighlights: [
      '자동화된 데이터 수집: YouTube API v3를 통해 24시간마다 영상 통계를 자동 수집 및 업데이트',
      '실시간 시스템: Supabase real-time subscriptions으로 순위 변동을 즉시 반영',
      '가중치 랭킹 알고리즘: 조회수, 좋아요, 커뮤니티 투표를 종합한 공정한 순위 계산',
      '인증 및 보안: 회원 인증 시스템과 중복 투표 방지 로직 구현',
      '데이터 시각화: Chart.js를 활용한 기간별 성적 분석 및 트렌드 차트',
      '반응형 디자인: 모바일/데스크톱 최적화로 모든 디바이스에서 원활한 사용',
      'Serverless 아키텍처: Vercel 배포로 확장 가능하고 비용 효율적인 인프라'
    ],

    results: '현재 1,200명 이상의 활성 사용자, 일일 500명 이상의 참여자, 총 15,000회 이상의 투표를 기록하고 있습니다. 매일 자동으로 영상 통계를 업데이트하며, 각 경쟁 기간마다 상세한 분석 리포트를 제공합니다.',

    tech: ['Next.js 14', 'React', 'Supabase', 'PostgreSQL', 'YouTube API v3', 'Chart.js', 'Tailwind CSS', 'Vercel'],

    features: [
      { title: '실시간 순위 시스템', desc: 'Supabase 실시간 구독으로 즉각적인 순위 업데이트' },
      { title: '커뮤니티 투표', desc: '회원 인증 기반 공정한 투표 시스템' },
      { title: '분석 대시보드', desc: 'Chart.js 기반 상세 통계 및 트렌드 분석' },
      { title: 'YouTube 연동', desc: 'API v3를 통한 자동 영상 데이터 수집' }
    ]
  },
  {
    id: 'three-body',
    slug: 'three-body',
    title: 'Three Body Universe',
    subtitle: 'Interactive Literary Analysis Platform',
    category: 'Data Visualization',
    year: '2024',
    status: 'development',
    path: '/three-body',

    executiveSummary: '류츠신의 삼체 3부작을 체계적으로 탐구할 수 있는 인터랙티브 문학 분석 플랫폼입니다. D3.js 기반 인물 관계 그래프와 Neo4j 그래프 데이터베이스로 복잡한 세계관을 시각화합니다.',

    overview: '류츠신의 삼체 3부작 세계관을 체계적으로 탐구할 수 있는 인터랙티브 문학 분석 플랫폼입니다. 복잡한 인물 관계도, 시간순 사건 타임라인, 과학 개념 데이터베이스를 시각화하여 독자들의 이해를 돕습니다.',

    problemStatement: '삼체 시리즈는 방대한 세계관과 복잡한 인물 관계, 어려운 과학 개념으로 인해 독자들이 내용을 완전히 이해하기 어렵습니다. 기존에는 이를 체계적으로 정리하고 시각화한 플랫폼이 없었습니다.',

    solution: 'D3.js를 활용한 인터랙티브 인물 관계 그래프, 3부작 전체를 아우르는 시간순 이벤트 타임라인, 그리고 소설 속 과학 개념을 검색 가능한 데이터베이스로 구축했습니다. Neo4j 그래프 데이터베이스를 사용하여 복잡한 관계망을 효율적으로 저장하고 조회합니다.',

    technicalHighlights: [
      '그래프 데이터베이스: Neo4j를 활용한 인물 관계망 저장 및 복잡한 쿼리 처리',
      'D3.js 시각화: 인터랙티브한 인물 관계 그래프 및 타임라인 구현',
      'TypeScript: 타입 안정성을 통한 대규모 데이터 관리',
      'Framer Motion: 부드러운 애니메이션과 전환 효과',
      '검색 시스템: 인물, 사건, 과학 개념의 빠른 검색 및 필터링',
      '반응형 그래프: 화면 크기에 따라 자동으로 조정되는 시각화'
    ],

    results: '개발 진행 중이며, 주요 인물 100명 이상, 핵심 사건 200개 이상, 과학 개념 50개 이상을 데이터베이스화할 예정입니다.',

    tech: ['Next.js', 'D3.js', 'Neo4j Graph DB', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],

    features: [
      { title: '인물 관계망', desc: 'D3.js 기반 인터랙티브 네트워크 그래프' },
      { title: '타임라인 시각화', desc: '시간순 사건 정리 및 검색' },
      { title: '컨텐츠 검색', desc: '인물/사건/개념 통합 검색 시스템' },
      { title: '스토리 분석', desc: '줄거리 요약 및 심층 분석' }
    ]
  },
  {
    id: 'univ-exam',
    slug: 'univ-exam',
    title: 'InterviewCoach',
    subtitle: '2026 수시면접 준비 시스템',
    category: 'EdTech',
    year: '2025',
    status: 'active',
    path: '/univ-exam',

    executiveSummary: '2026년 대학입학 수시면접을 체계적으로 준비할 수 있는 종합 시스템입니다. 생활기록부 분석, 5개 대학별 맞춤 예상 질문 생성, 평가기준 기반 답변 작성 지원으로 효율적인 면접 준비를 돕습니다.',

    metrics: [
      { label: 'Universities', value: '5' },
      { label: 'Categories', value: '6' },
      { label: 'Features', value: '15+' },
    ],

    overview: '고등학교 3년간의 생활기록부를 체계적으로 분석하고, 지원하는 5개 대학의 면접 평가기준에 맞춘 예상 질문을 자동 생성합니다. 생활기록부 내용을 근거로 답변을 작성하고 준비도를 실시간으로 추적할 수 있습니다.',

    problemStatement: '수시 면접을 준비하는 학생들은 방대한 생활기록부 내용을 정리하고, 각 대학의 다른 평가기준에 맞춰 예상 질문을 준비하는 데 어려움을 겪습니다. 또한 답변 작성 시 생활기록부의 어떤 내용을 활용해야 할지 파악하기 어렵고, 전체 준비 진행도를 체계적으로 관리하기 힘듭니다.',

    solution: '생활기록부를 학년별/카테고리별(자율/동아리/진로/교과/행동특성)로 자동 분류하고 키워드를 추출합니다. 5개 대학의 면접 평가기준과 비중을 분석하여 맞춤형 예상 질문을 자동 생성하며, 질문과 관련된 생활기록부 활동을 자동으로 매칭합니다. 답변 작성 에디터는 관련 활동을 참조할 수 있게 하고, 타이머와 자동 저장 기능을 제공합니다. 전체/대학별/평가기준별 준비도를 실시간 분석하여 개선 방향을 제안합니다.',

    technicalHighlights: [
      '지능형 질문 생성: 대학 평가기준 비중 기반 질문 수 자동 조절 및 생활기록부 키워드 매칭',
      '활동 분석 엔진: 3년치 생활기록부 자동 분류, 키워드 추출, 전공 관련도 분석',
      '관계 매칭 알고리즘: 질문 키워드와 생활기록부 활동 자동 연결 (매칭 점수 기반)',
      '실시간 준비도 추적: 전체/대학별/평가기준별 완료율 계산 및 시각화',
      '자동 저장: 2초 디바운스 기반 답변 자동 저장 (LocalStorage)',
      '다중 필터 시스템: 대학/평가기준/상태별 질문 필터링',
      '반응형 디자인: 모바일/태블릿/데스크톱 완벽 대응'
    ],

    results: '완전한 생활기록부 분석 시스템, 5개 주요 대학(서울대/연세대/고려대/카이스트/포스텍) 면접 정보 데이터베이스, 평가기준별 질문 템플릿 라이브러리, 종합 분석 대시보드 구현 완료. 학생들의 체계적인 수시면접 준비를 지원합니다.',

    tech: [
      'React 18',
      'JavaScript',
      'LocalStorage',
      'CSS Grid',
      'Flexbox',
      'Chart.js',
      'Responsive Design'
    ],

    features: [
      { title: '생활기록부 분석', desc: '학년별/카테고리별 자동 정리 및 키워드 추출' },
      { title: '대학 관리', desc: '5개 대학의 면접 평가기준 및 비중 시각화' },
      { title: '예상 질문 생성', desc: '평가 비중 기반 맞춤형 질문 자동 생성' },
      { title: '답변 작성', desc: '관련 활동 매칭, 타이머, 자동 저장 기능' },
      { title: '준비도 분석', desc: '실시간 진행도 추적 및 개선 제안' },
      { title: '활동 인사이트', desc: '강점 분석, 전공 관련도, 리더십 경험 파악' }
    ]
  },
  {
    id: 'nun-ma-sae',
    slug: 'nun-ma-sae',
    title: '눈물을 마시는 새 Universe',
    subtitle: '한국 판타지 문학 분석 및 시각화',
    category: 'Data Visualization',
    year: '2024',
    status: 'development',
    path: '/nun-ma-sae',

    executiveSummary: '이영도 작가의 "눈물을 마시는 새" 세계관을 체계적으로 탐구할 수 있는 인터랙티브 문학 분석 플랫폼입니다. 인물 관계, 네 선민종족의 특징, 주요 사건 타임라인을 시각화합니다.',

    overview: '한국 판타지 문학의 금자탑인 "눈물을 마시는 새" 4부작의 복잡한 서사와 세계관을 직관적으로 보여주는 데이터 시각화 프로젝트입니다. 구출대의 여정과 네 선민종족의 역학관계를 깊이 있게 다룹니다.',

    problemStatement: '눈물을 마시는 새는 독창적인 4대 선민종족(인간, 레콘, 도깨비, 나가)과 무수히 많은 고유명사, 방대한 설정들로 인해 독자들이 스토리의 전체적인 흐름과 지리적 관계를 직관적으로 이해하기 어렵습니다.',

    solution: '시간의 흐름에 따른 주요 사건 타임라인, 인명 및 세력별 복잡한 관계도, 그리고 한계선과 북부 등 주요 배경에 대한 시각화 인터랙션을 제공하여 소설에 대한 완벽한 이해와 몰입을 돕습니다.',

    technicalHighlights: [
      'D3.js 기반: 대륙의 지형 및 주요 인물의 여정 시각화 처리',
      '상호작용 가능한 인물 네트워크: 구출대, 나가 사회 등 세력망 구현',
      '크로스 레퍼런스 시스템: 용어에서 사건, 인물로의 문맥 맥락 이어주기'
    ],

    results: '현재 개발 초기 단계이며, 기본 페이지 라우팅과 주요 네비게이션 구조 설계, 더미 콘텐츠 구성을 진행하고 있습니다.',

    tech: [
      'Next.js 14',
      'React 18',
      'D3.js',
      'Tailwind CSS',
      'Framer Motion'
    ],

    features: [
      { title: '발자취 타임라인', desc: '주요 사건과 구출대의 이동 경로에 맞춘 시간표' },
      { title: '구출대와 관계도', desc: '핵심 등장인물과 세력간의 동적 네트워크 그래프' },
      { title: '4대 선민종족', desc: '인간, 레콘, 도깨비, 바디를 공유하는 나가의 특성 서술' },
      { title: '키보렌과 세계 지도', desc: '한계선, 북부, 하텐그라쥬 등 주요 지명 시각화' }
    ]
  },
  {
    id: 'ppt-converter',
    slug: 'ppt-converter',
    title: 'HTML-to-PPTX Converter',
    subtitle: 'Editable Presentation Generator',
    category: 'Productivity Tool & Document Automation',
    year: '2026',
    status: 'active',
    path: '/tools/ppt-converter',
    executiveSummary: '구조화된 HTML 슬라이드를 PowerPoint의 편집 가능한 네이티브 텍스트, 표, 엑셀 차트 객체로 변환해 주는 자동화 도구입니다.',
    metrics: [
      { label: 'Conversion', value: 'Instant' },
      { label: 'Formats', value: 'Text/Table/Chart' },
      { label: 'PPTX Engine', value: 'python-pptx' }
    ],
    overview: '정해진 HTML 마크업 양식을 바탕으로 슬라이드를 디자인하면, 이를 스크린샷 이미지로 복사하는 대신 파워포인트 내에서 더블클릭하여 편집할 수 있는 벡터 셰이프(Shapes) 및 네이티브 컴포넌트로 자동 파싱하여 다운로드하게 돕는 유틸리티 웹 서비스입니다.',
    problemStatement: '기존의 웹 프리젠테이션 툴은 HTML을 단순히 PDF나 이미지로 익스포트하여 글자 수정 및 개별 도형 편집이 불가능했습니다. 개발자와 기획자가 웹에서 시각화한 결과물을 보고용 파워포인트로 재가공하기 위해서는 수작업으로 글자와 차트를 다시 입력해야 하는 막대한 중복 노동이 발생했습니다.',
    solution: 'FastAPI 및 Python-PPTX를 Next.js API와 융합한 이중 엔진 시스템을 구축했습니다. HTML의 inline style과 data-속성을 파싱하여 슬라이드의 좌표별로 실제 텍스트 박스, 동적 데이터 표, 그리고 파워포인트의 네이티브 category 엑셀 차트를 온전히 재생성하여 하나의 ZIP/PPTX 형태로 즉시 스트리밍 다운로드하게 지원합니다.',
    technicalHighlights: [
      'Editable Native Shapes: 이미지 캡처 방식 대신 글자 및 데이터가 살아있는 백터 컴포넌트 재생성',
      '차트 엑셀 데이터 동기화: categories 및 series 데이터를 PPTX 차트 데이터셋으로 정밀 매핑',
      'Next.js API & Child Process: Node.js 서버 내부에서 백그라운드 파이썬 엔진을 안정적으로 스폰(Spawn)하여 변환',
      '임시 자원 클리닝: 변환 작업 후 메모리와 로컬 디스크 상의 업로드 임시 파일 자동 수거 및 소거',
      '프리미엄 드롭존 UI: 유려한 마이크로 인터랙션과 실시간 로딩 가이드 툴킷 제공'
    ],
    results: 'HTML-to-PPTX 변환 유틸 탑재 완료. 템플릿(sample.html)을 업로드하여 텍스트 상자 및 차트의 온전한 파워포인트 편집 기능 동작 확인 및 빌드 성공.',
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'Python',
      'python-pptx',
      'BeautifulSoup4',
      'Tailwind CSS'
    ],
    features: [
      { title: '텍스트 상자 생성', desc: 'data-font-size, color, bold 속성에 기초한 편집가능 텍스트 박스 배치' },
      { title: 'Excel 연동 차트', desc: 'column, bar, line, pie 타입의 파워포인트 자체 엑셀 차트 생성' },
      { title: '동적 데이터 표', desc: '컬럼 넓이 및 셀 배경색 지정을 포함한 네이티브 표 오브젝트 변환' },
      { title: '프리미엄 가이드', desc: 'HTML 템플릿 마크업 설명과 실시간 아코디언 가이드 제공' }
    ]
  },
  {
    id: 'quantum-vibration-novel',
    slug: 'quantum-vibration-novel',
    title: '텐서의 바다: 공간의 진동',
    subtitle: 'Interactive Hard SF Novel',
    category: 'Literature & Web Platform',
    year: '2026',
    status: 'active',
    path: '/novel/quantum-vibration-novel',
    executiveSummary: '물리학적 상상력과 소설이 결합된 하드 SF 소설 뷰어 플랫폼입니다. 독자가 실시간으로 단락의 버전을 수정하고 조합할 수 있는 양방향 독서 경험을 제공합니다.',
    metrics: [
      { label: 'Chapters', value: '4' },
      { label: 'Versions', value: 'v3.0' },
      { label: 'Features', value: 'Inline Edit & Diff' }
    ],
    overview: '이안과 세라가 우주의 근원인 텐서 유체의 비밀을 풀고 거대한 방주 오디세우스를 타고 탈출하는 하드 SF 서사시입니다. Next.js 기반의 커스텀 뷰어 플랫폼 위에서, 독자는 모든 단락의 과거 버전을 조회하고, 직접 내용을 수정하여 새로운 버전을 파생시키는 창작자(Architect)의 역할을 함께 수행합니다.',
    problemStatement: '기존의 정적 텍스트 기반 소설은 버전 업데이트나 대안적 서사를 동시에 탐구하기 어렵습니다. SF의 특성상 과학적 설명이나 묘사가 발전함에 따라 텍스트가 어떻게 다채로워지는지 직관적으로 확인할 플랫폼이 필요했습니다.',
    solution: '단락(Paragraph) 단위로 텍스트를 컴포넌트화하여, 인라인 퀵 에디터와 Diff Viewer를 통한 즉각적인 수정 및 대조를 지원합니다. 또한 KaTeX 렌더링 엔진을 탑재해 소설 내부의 물리학 수식을 아름답게 표현합니다.',
    technicalHighlights: [
      'Full Continuous Reader: 전체 단락 끊김 없는 양방향 렌더링',
      'Inline Quick Editor: 모달리스 기반의 즉각적 텍스트 수정 및 버전 관리',
      'Diff Viewer: 과거 버전과 현재 작성 중인 텍스트 간의 시각적 디프 대조',
      'React Markdown & KaTeX: 하드 SF 특화된 수학 공식 및 서식 렌더링'
    ],
    results: '총 1막~3막, 에필로그에 이르는 전체 데이터 세팅 및 v3.0 버전 스케일업 묘사가 완료되었으며, 완벽한 LaTeX 렌더러가 장착되었습니다.',
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'React Markdown',
      'KaTeX',
      'Tailwind CSS'
    ],
    features: [
      { title: '인라인 버전 에디팅', desc: '본문의 어떤 단락이든 클릭해 내용을 덮어쓰지 않고 새로운 버전 생성' },
      { title: '과거 버전 대조 (Diff)', desc: '이전 버전과 현재 작성 중인 텍스트의 변경점을 시각적으로 비교' },
      { title: '수식 렌더링', desc: 'KaTeX를 활용한 미려한 아인슈타인 방정식 및 카멜레온 메커니즘 수식 표현' },
      { title: '연속 읽기 모드', desc: '부드러운 스크롤 트래킹과 Sticky 네비게이션으로 끊김 없는 독서 경험 제공' }
    ]
  }
];
