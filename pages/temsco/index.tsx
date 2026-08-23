import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function TemscoLandingPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'highlights' | 'financials' | 'strategy'>('all')

  const slideList = [
    { num: '01', title: 'Cover & Title', desc: '박막 코팅 소재 × 진공 메탈마스크 글로벌 TIER-1 소부장 파트너', category: 'highlights', icon: 'fa-shield-halved' },
    { num: '02', title: 'Executive Summary', desc: '4대 핵심 투자 하이라이트 (수직계열화, 1차벤더, 부실해소, 퀀텀점프)', category: 'highlights', icon: 'fa-chart-line' },
    { num: '03', title: 'Company Overview', desc: '기업 개요, 핵심 연혁, 위폼스 인수 효과 및 경영진 프로필', category: 'highlights', icon: 'fa-building' },
    { num: '04', title: 'Market Opportunity', desc: '글로벌 디스플레이 공급망 재편 및 OLED 메탈마스크 시장 기회', category: 'strategy', icon: 'fa-globe' },
    { num: '05', title: 'Core Solution', desc: '국내 유일 소재-정밀가공-코팅-세정 원스톱 일원화 체계', category: 'strategy', icon: 'fa-layer-group' },
    { num: '06', title: 'Core Competencies', desc: '초고순도 박막 코팅 기술력 및 정밀 메탈마스크 핵심 해자', category: 'strategy', icon: 'fa-award' },
    { num: '07', title: 'Expansion Strategy', desc: '삼성/LG디스플레이, AMAT, 비전옥스 1차 벤더 직납 확대 전략', category: 'strategy', icon: 'fa-arrows-split-up-and-left' },
    { num: '08', title: 'Financial Cleanup', desc: '2025년 파인원 채권 80억 전액 대손상각(Clean Sheet) 및 재무 정상화', category: 'financials', icon: 'fa-receipt' },
    { num: '09', title: 'Financial Projections', desc: '2026년 400억 ➔ 2029년 700억 원(OPM 11.3%) 퀀텀점프 추정', category: 'financials', icon: 'fa-arrow-trend-up' },
    { num: '10', title: 'New Growth Drivers', desc: '반도체 HF봄베, CuMn타겟, 전력반도체 Cu기판 등 탈마스크 50.6% 도약', category: 'strategy', icon: 'fa-microchip' },
    { num: '11', title: 'The Ask & Proceeds', desc: '30억 ~ 50억 원 투자 유치 조건 및 설비/운영/R&D 자금 배분 계획', category: 'financials', icon: 'fa-hand-holding-dollar' },
  ]

  const filteredSlides = activeTab === 'all' 
    ? slideList 
    : slideList.filter(s => s.category === activeTab)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <Head>
        <title>주식회사 템스코 (TEMSCO) - 공식 IR 투자제안서 허브</title>
        <meta name="description" content="주식회사 템스코(TEMSCO) IR 투자제안서 (Series A / Growth Capital) - 글로벌 디스플레이·반도체 소부장 파트너" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* Top Global Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 border border-slate-700"
          >
            <span>←</span> 메인 홈
          </Link>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wider">TEMSCO IR</span>
            <span className="text-sm font-bold text-white tracking-tight">주식회사 템스코 투자제안서</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/temsco/original"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:inline-block"
          >
            초기 원본 슬라이드
          </Link>
          <Link
            href="/temsco/deck"
            className="text-xs font-black px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
          >
            <i className="fa-solid fa-play text-[10px]"></i>
            투자제안서 보기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Background glow & grid */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badges */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs font-bold mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>2026-2029 Series A / Growth Capital</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-semibold">CONFIDENTIAL</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.2] mb-6">
            박막 코팅 소재 <span className="text-blue-500 font-normal">×</span> 진공 메탈마스크<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
              글로벌 TIER-1 소부장 파트너
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10 text-balance">
            주식회사 템스코(TEMSCO)는 고순도 박막 코팅 소재 기술력과 정밀 메탈마스크 역량을 결합하여 
            업계 유일의 <b className="text-white font-bold">&apos;소재-가공-코팅-세정&apos; 원스톱 솔루션</b>을 구축했습니다.<br className="hidden sm:inline" />
            삼성·LG디스플레이 및 글로벌 패널사의 핵심 1차 협력사로 퀀텀점프합니다.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              href="/temsco/deck"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-95 transition flex items-center gap-3"
            >
              <i className="fa-solid fa-file-powerpoint text-lg"></i>
              투자제안서 슬라이드 보기
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </Link>

            <Link
              href="/temsco/original"
              className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center gap-2.5"
            >
              <i className="fa-solid fa-code-compare text-slate-400"></i>
              초기 원본 보기
            </Link>

            <a
              href="/temsco/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center gap-2.5"
            >
              <i className="fa-solid fa-file-code text-slate-400"></i>
              단일 HTML 파일
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">2026E 매출액</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">400억 원</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">흑자전환 (OP 45.2억)</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">2029E 목표 실적</p>
              <p className="text-2xl sm:text-3xl font-black text-white">700억 원</p>
              <p className="text-[11px] text-blue-300 font-semibold mt-1">영업이익률 11.3%</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">글로벌 벤더 지위</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">Tier-1</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">삼성·LG·비전옥스 직납</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">투자 유치 목표</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">30~50억</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">라인 증설 &amp; 원소재 확보</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Investment Highlights */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded border border-blue-800/60">Core Investment Points</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">핵심 투자 하이라이트</h2>
          <p className="text-sm text-slate-400 mt-1">위기를 기회로 전환한 템스코의 4가지 독보적 경쟁력</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-blue-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">소재·부품 수직계열화 토탈 솔루션</h3>
            <p className="text-sm text-slate-300 leading-relaxed break-keep">
              템스코의 고순도 박막 코팅 소재(스퍼터링 타겟) 기술력과 2024년 3월 인수한 위폼스(주)의 정밀 메탈마스크 제조 역량을 결합하여 업계 유일의 <b>&apos;소재-정밀가공-코팅-세정&apos; 원스톱 일원화 체계</b>를 완성했습니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-blue-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <i className="fa-solid fa-globe"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">글로벌 Top-tier 1차 벤더(Tier-1) 직납 승격</h3>
            <p className="text-sm text-slate-300 leading-relaxed break-keep">
              기존 2차 벤더 간접 납품 구조에서 탈피하여 <b>삼성디스플레이, LG디스플레이, 미국 AMAT, eMagin, 중국 CSOT 및 비전옥스(Visionox)</b> 등에 1차 벤더 등록을 완료하고 2026년부터 본격 양산 공급을 개시했습니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-blue-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">위기를 기회로 전환한 턴어라운드 &amp; 직수출 확대</h3>
            <p className="text-sm text-slate-300 leading-relaxed break-keep">
              파인원 회생절차를 계기로 글로벌 패널사 직납 체제로 전면 전환하였으며, <b>중국 비전옥스로부터 마스크 전체 물량의 30% 배정을 확정</b>받는 등 수주 규모를 획기적으로 확대하고 2026년 4분기부터 직수출 양산에 돌입합니다.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-blue-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2025년 잠재 부실 완전 해소 &amp; 퀀텀점프 실적</h3>
            <p className="text-sm text-slate-300 leading-relaxed break-keep">
              2025년 결산 시 회생 관련 채권 <b>약 80억 원을 전액 대손상각 처리하여 부실을 100% 선반영(Clean Sheet)</b>했습니다. 2026년 매출 400억 흑자 전환을 시작으로 2027년 520억, 2029년 700억 원(OPM 11.3%, OP 78.9억)을 실현합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Slide Deck Index & Navigator */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded border border-blue-800/60">Pitch Deck Slides</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">슬라이드 목차 및 바로가기</h2>
            <p className="text-sm text-slate-400 mt-1">총 11개 슬라이드로 구성된 전체 투자제안서를 목차별로 열람할 수 있습니다.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              전체 ({slideList.length})
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${activeTab === 'highlights' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              핵심 개요
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${activeTab === 'strategy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              기술·전략
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${activeTab === 'financials' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              재무·투자
            </button>
          </div>
        </div>

        {/* Slide Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSlides.map((slide) => (
            <Link
              key={slide.num}
              href="/temsco/deck"
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 p-4 rounded-xl transition flex items-start gap-3.5 group shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                {slide.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition truncate">
                    {slide.title}
                  </h4>
                  <i className="fa-solid fa-arrow-right text-xs text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition"></i>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {slide.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View Full Deck Big CTA */}
        <div className="mt-8 text-center bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-800/40 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">11개 전체 슬라이드를 고화질 프레젠테이션으로 확인하세요</h3>
          <p className="text-xs text-slate-400 mb-5">A4 가로 비율 완벽 지원, 브라우저 슬라이드 모드 및 1클릭 PDF 인쇄 다운로드 제공</p>
          <Link
            href="/temsco/deck"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition"
          >
            <i className="fa-solid fa-desktop"></i>
            투자제안서 슬라이드 전체 보기 (Deck Viewer)
          </Link>
        </div>
      </section>

      {/* Company Summary Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-bold text-slate-300 text-sm">주식회사 템스코 (TEMSCO, Ltd.)</p>
            <p className="mt-1">대표이사: 오정석 | 설립일: 2010. 10. 22 | 자본금: 13.97억 원</p>
            <p className="mt-0.5">본사: 충청남도 아산시 음봉면 | 안성 제1사업장 / 화성 제2사업장</p>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <Link href="/" className="hover:text-white transition">포트폴리오 홈</Link>
            <span>•</span>
            <Link href="/temsco/deck" className="hover:text-white transition font-semibold text-blue-400">투자제안서 슬라이드</Link>
            <span>•</span>
            <Link href="/temsco/original" className="hover:text-white transition">초기 원본</Link>
            <span>•</span>
            <a href="/temsco/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">단일 HTML 원문</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-900 text-center text-slate-600 text-[11px]">
          © 2026 TEMSCO, Ltd. All Rights Reserved. Confidential - For Investment Proposal Purpose Only.
        </div>
      </footer>
    </div>
  )
}
