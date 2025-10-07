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
    path: 'https://kyyquant-ai-solution.vercel.app/',

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
    id: 'cover-charts',
    slug: 'cover-charts',
    title: 'Cover Charts Analytics',
    subtitle: 'ML-powered Trend Analysis Platform',
    category: 'Data Analytics',
    year: '2024',
    status: 'development',

    executiveSummary: '머신러닝 기반 커버 음악 트렌드 분석 플랫폼입니다. TensorFlow를 활용한 성장 패턴 예측과 2년치 히스토리컬 데이터 분석으로 아티스트와 곡의 장기 트렌드를 제공합니다.',

    overview: '커버 음악 퍼포먼스의 장기 트렌드를 분석하는 고급 분석 플랫폼입니다. 머신러닝을 활용한 예측 인사이트와 누적 통계로 떠오르는 아티스트와 트렌딩 곡을 식별합니다.',

    problemStatement: 'Cover Battle Arena는 단기 경쟁에 초점을 맞추고 있어, 장기적인 트렌드 분석과 아티스트 성장 패턴 파악이 어렵습니다. 과거 데이터를 활용한 예측 기능도 부재합니다.',

    solution: 'Python과 TensorFlow를 사용한 머신러닝 모델로 아티스트의 성장 궤적을 예측하고, 여러 경쟁 기간의 누적 데이터를 분석하여 장기 트렌드를 제공합니다. FastAPI 백엔드로 빠른 데이터 처리를 보장하며, Chart.js로 시각화된 종합 성과 리포트를 생성합니다.',

    technicalHighlights: [
      '머신러닝 예측: TensorFlow를 활용한 아티스트 성장 패턴 및 트렌드 예측',
      '빅데이터 처리: Pandas를 통한 대량의 히스토리컬 데이터 분석',
      'FastAPI 백엔드: 고성능 비동기 API 서버로 빠른 데이터 조회',
      'PostgreSQL: 시계열 데이터 최적화 및 효율적인 쿼리',
      '예측 모델: LSTM 네트워크를 활용한 시계열 예측',
      '자동 리포트: 주간/월간/연간 트렌드 분석 리포트 자동 생성'
    ],

    results: '개발 진행 중이며, 과거 2년치 데이터 분석을 목표로 하고 있습니다. 아티스트별, 곡별, 장르별 트렌드 분석 기능을 제공할 예정입니다.',

    tech: ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL', 'Chart.js', 'Pandas', 'NumPy', 'Scikit-learn'],

    features: [
      { title: '트렌드 예측', desc: 'TensorFlow 기반 머신러닝 예측 모델' },
      { title: '히스토리컬 데이터', desc: '과거 2년치 누적 통계 및 분석' },
      { title: '성과 지표', desc: '아티스트/곡별 상세 성과 분석' },
      { title: '아티스트 랭킹', desc: '종합 순위 및 성장률 추적' }
    ]
  }
]
