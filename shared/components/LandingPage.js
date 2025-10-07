import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

const PROJECTS = [
  {
    id: 'cover-arena',
    title: 'Cover Battle Arena',
    subtitle: 'Real-time K-pop Cover Competition Platform',
    category: 'Full-Stack Web Application',
    path: '/app',
    status: 'active',
    year: '2024',
    metrics: { users: '1.2K+', daily: '500+', votes: '15K+' },

    overview: '케이팝 커버 영상 아티스트들을 위한 실시간 경쟁 플랫폼입니다. 매일 자동으로 업데이트되는 순위 시스템과 커뮤니티 투표를 통해 아티스트들이 공정하게 경쟁할 수 있는 환경을 제공합니다.',

    problemStatement: '커버 아티스트들은 자신의 실력을 객관적으로 평가받을 수 있는 플랫폼이 부족했습니다. 기존 플랫폼들은 단순 조회수 위주의 평가나 주관적인 커뮤니티 반응에 의존했으며, 실시간 경쟁 시스템과 투명한 평가 기준이 없었습니다.',

    solution: '이 플랫폼은 YouTube API v3를 활용한 자동 데이터 수집, Supabase 실시간 구독을 통한 즉각적인 순위 업데이트, 그리고 조회수/좋아요/커뮤니티 투표를 종합한 가중치 기반 랭킹 시스템을 제공합니다. 회원 인증 및 중복 투표 방지 시스템으로 공정성을 보장하며, Chart.js를 활용한 상세 분석 대시보드로 아티스트들의 성장을 추적할 수 있습니다.',

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
    title: 'Three Body Universe',
    subtitle: 'Interactive Literary Analysis Platform',
    category: 'Data Visualization & Literary Analysis',
    path: '/three-body',
    status: 'development',
    year: '2024',

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
    title: 'Cover Charts Analytics',
    subtitle: 'Long-term Trend Analysis Platform',
    category: 'Data Analytics & Machine Learning',
    path: '/cover-charts',
    status: 'development',
    year: '2024',

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

export default function LandingPage() {
  const router = useRouter()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    // Tech keywords floating effect
    const words = [
      'REACT', 'NEXT.JS', 'TYPESCRIPT', 'DATABASE', 'API', 'REALTIME', 'SUPABASE',
      'SERVERLESS', 'CLOUD', 'ANALYTICS', 'DASHBOARD', 'VISUALIZATION', 'D3.JS',
      'POSTGRESQL', 'RESPONSIVE', 'PERFORMANCE', 'OPTIMIZATION', 'MACHINE LEARNING'
    ]

    const textElements = []
    const density = 8

    for (let i = 0; i < density; i++) {
      textElements.push({
        text: words[Math.floor(Math.random() * words.length)],
        x: Math.random() * canvas.width,
        y: (Math.random() * canvas.height),
        opacity: Math.random() * 0.03 + 0.01,
        fontSize: Math.random() * 20 + 10,
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() > 0.5 ? 1 : -1
      })
    }

    let animationId
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      textElements.forEach(elem => {
        elem.x += elem.speed * elem.direction

        // Wrap around
        if (elem.direction > 0 && elem.x > canvas.width + 200) {
          elem.x = -200
        } else if (elem.direction < 0 && elem.x < -200) {
          elem.x = canvas.width + 200
        }

        ctx.save()
        ctx.font = `300 ${elem.fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
        ctx.fillStyle = `rgba(156, 163, 175, ${elem.opacity})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(elem.text, elem.x, elem.y)
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', setCanvasSize)
    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleProjectClick = (project) => {
    if (project.status === 'active') {
      router.push(project.path)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background Layer */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-300 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">Developer</div>
                <div className="text-xs text-gray-500 font-semibold tracking-wide">PORTFOLIO</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#projects" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">Projects</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">About</a>
              <button
                onClick={() => router.push('/auth')}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-6 min-h-screen flex items-center" style={{
        background: `linear-gradient(135deg,
          rgba(45, 45, 55, 0.98) 0%,
          rgba(60, 60, 75, 0.96) 25%,
          rgba(80, 80, 100, 0.94) 50%,
          rgba(60, 60, 75, 0.96) 75%,
          rgba(45, 45, 55, 0.98) 100%
        )`
      }}>
        {/* Radial gradient overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 85% 85%, rgba(255, 255, 255, 0.06) 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 40%)
          `
        }}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          background: `
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255, 255, 255, 0.02) 40px, rgba(255, 255, 255, 0.02) 41px),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 255, 255, 0.02) 40px, rgba(255, 255, 255, 0.02) 41px)
          `
        }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xl mb-10 border border-gray-200">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-bold text-gray-800 tracking-wide">AVAILABLE FOR OPPORTUNITIES</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-[1.1] tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
              <span className="text-gray-100">Full-Stack</span>
              <br />
              <span className="text-gray-100">Developer</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto font-normal">
              Building <span className="font-bold text-indigo-300">scalable web applications</span> with modern technologies.
              <br className="hidden md:block" />
              Specialized in <span className="font-bold text-purple-300">real-time systems</span>,{' '}
              <span className="font-bold text-pink-300">data visualization</span>, and{' '}
              <span className="font-bold text-blue-300">user experience</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-5 mb-20">
              <a
                href="#projects"
                className="px-10 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-white transition-all hover:shadow-xl text-lg"
              >
                View Projects
              </a>
              <a
                href="mailto:contact@example.com"
                className="px-10 py-4 bg-transparent text-gray-100 font-bold rounded-xl hover:bg-white/10 transition-all border-2 border-gray-100 text-lg"
              >
                Get in Touch
              </a>
            </div>

            {/* Stats */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Platform Content</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">{PROJECTS.length}+</div>
                  <div className="text-sm font-semibold text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">2024</div>
                  <div className="text-sm font-semibold text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">{PROJECTS.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm font-semibold text-gray-600">Live</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">AI</div>
                  <div className="text-sm font-semibold text-gray-600">Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative z-10" style={{
        background: `linear-gradient(180deg,
          rgba(248, 250, 252, 1) 0%,
          rgba(241, 245, 249, 1) 50%,
          rgba(226, 232, 240, 0.8) 100%
        )`
      }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-8">
              <div className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">PORTFOLIO</div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">Featured Work</h2>
            </div>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Selected projects showcasing technical expertise and innovation</p>
          </div>

          {/* Project Grid */}
          <div className="space-y-8">
            {PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                className={`group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 border border-gray-200 ${
                  project.status === 'active'
                    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1'
                    : 'opacity-80'
                }`}
                onClick={() => handleProjectClick(project)}
              >
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Project Visual - Left Side */}
                  <div className={`md:col-span-2 relative bg-gradient-to-br ${
                    idx === 0 ? 'from-indigo-600 via-purple-600 to-pink-600' :
                    idx === 1 ? 'from-purple-600 via-pink-600 to-rose-600' :
                    'from-pink-600 via-rose-600 to-orange-600'
                  } p-10 md:p-12 flex items-center justify-center min-h-[320px] md:min-h-[420px] overflow-hidden`}>

                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
                        animation: 'slide 20s linear infinite'
                      }}></div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-8 right-8 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-8 left-8 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    {/* Content */}
                    <div className="relative text-center z-10">
                      <div className="inline-block px-4 py-2 bg-white/30 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest mb-5 shadow-lg border border-white/40">
                        {project.category}
                      </div>

                      {/* Large Typography Display */}
                      <div className="mb-6">
                        <div className="text-6xl md:text-7xl font-black text-white leading-none mb-2" style={{
                          textShadow: '0 8px 16px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.2)',
                          letterSpacing: '-0.05em'
                        }}>
                          {project.title.split(' ')[0]}
                        </div>
                        <div className="text-4xl md:text-5xl font-black text-white/90 leading-tight" style={{
                          textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          letterSpacing: '-0.03em'
                        }}>
                          {project.title.split(' ').slice(1).join(' ')}
                        </div>
                      </div>

                      {/* Metrics */}
                      {project.metrics && (
                        <div className="mt-8 grid grid-cols-3 gap-3">
                          {Object.entries(project.metrics).map(([key, value]) => (
                            <div key={key} className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-3 border border-white/30">
                              <div className="text-2xl md:text-3xl font-black text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                                {value}
                              </div>
                              <div className="text-xs text-white/95 uppercase tracking-wide font-bold">
                                {key}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Info - Right Side */}
                  <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-between bg-white">
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h4 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                            {project.subtitle}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-lg">{project.year}</span>
                            {project.status === 'active' ? (
                              <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-black rounded-full flex items-center gap-2 border-2 border-green-200">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                LIVE
                              </span>
                            ) : (
                              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-black rounded-full border-2 border-gray-200">
                                IN DEVELOPMENT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Overview */}
                      <div className="mb-8 pb-6 border-b border-gray-200">
                        <h5 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">OVERVIEW</h5>
                        <p className="text-gray-800 leading-relaxed text-base">
                          {project.overview}
                        </p>
                      </div>

                      {/* Problem Statement */}
                      <div className="mb-8 pb-6 border-b border-gray-200">
                        <h5 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">PROBLEM</h5>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {project.problemStatement}
                        </p>
                      </div>

                      {/* Solution */}
                      <div className="mb-8 pb-6 border-b border-gray-200">
                        <h5 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">SOLUTION</h5>
                        <p className="text-gray-800 leading-relaxed text-base font-medium">
                          {project.solution}
                        </p>
                      </div>

                      {/* Technical Highlights */}
                      {project.technicalHighlights && (
                        <div className="mb-8 pb-6 border-b border-gray-200">
                          <h5 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">TECHNICAL HIGHLIGHTS</h5>
                          <div className="space-y-3">
                            {project.technicalHighlights.map((highlight, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0 mt-2"></div>
                                <p className="text-gray-700 leading-relaxed text-sm">{highlight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Results */}
                      <div className="mb-8 pb-6 border-b border-gray-200">
                        <h5 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">RESULTS</h5>
                        <p className="text-gray-800 leading-relaxed text-base font-medium">
                          {project.results}
                        </p>
                      </div>

                      {/* Features */}
                      {project.features && (
                        <div className="mb-8">
                          <h5 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">KEY FEATURES</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.features.map((feature, i) => (
                              <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="font-bold text-gray-900 text-sm mb-1">{feature.title}</div>
                                <div className="text-gray-600 text-xs">{feature.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tech Stack */}
                      <div className="mb-8">
                        <div className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">TECH STACK</div>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, i) => (
                            <span
                              key={i}
                              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    {project.status === 'active' && (
                      <div className="mt-6 flex items-center gap-3 text-indigo-600 font-black text-lg group-hover:gap-4 transition-all">
                        <span>VIEW PROJECT</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 text-white relative overflow-hidden z-10" style={{
        background: `linear-gradient(135deg,
          rgba(55, 65, 81, 0.98) 0%,
          rgba(75, 85, 99, 0.96) 50%,
          rgba(55, 65, 81, 0.98) 100%
        )`
      }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Let's Build Something Great</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed font-normal">
            Passionate about creating elegant solutions to complex problems.
            <br className="hidden md:block" />
            Always open to discussing new projects, creative ideas, or opportunities.
          </p>
          <a
            href="mailto:contact@example.com"
            className="inline-block px-12 py-5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all hover:shadow-xl text-lg"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white border-t border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div>
                <div className="text-gray-900 font-black">Developer Portfolio</div>
                <div className="text-sm text-gray-500 font-semibold">© 2024 All rights reserved</div>
              </div>
            </div>
            <div className="flex gap-8">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 font-bold transition-colors uppercase text-sm tracking-wide">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 font-bold transition-colors uppercase text-sm tracking-wide">
                LinkedIn
              </a>
              <a href="mailto:contact@example.com" className="text-gray-600 hover:text-gray-900 font-bold transition-colors uppercase text-sm tracking-wide">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(70px); }
        }
      `}</style>
    </div>
  )
}
