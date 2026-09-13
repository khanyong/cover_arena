import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import PdfDownloadControls from '../../components/TemscoV4/PdfDownloadControls'
import { v4Slides, v4Chapters, v4MainChapters, type V4SlideCategory } from '../../lib/temsco/v4-slide-catalog'

export default function TemscoLandingPage() {
  const [activeTab, setActiveTab] = useState<'all' | V4SlideCategory>('all')

  const filteredSlides = activeTab === 'all' 
    ? v4Slides
    : v4Slides.filter(s => s.category === activeTab)

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
            1안 투자제안서
          </Link>
          <Link
            href="/temsco/deck-v4"
            className="text-xs font-black px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
          >
            <i className="fa-solid fa-play text-[10px]"></i>
            4안 투자제안서 보기
          </Link>
        </div>
      </header>

      <section aria-labelledby="proposal-versions" className="px-6 py-8 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-6xl mx-auto">
          <h2 id="proposal-versions" className="text-xl font-bold text-white mb-2">투자제안서 버전 선택</h2>
          <p className="text-sm text-slate-400 mb-5">1~4안 투자제안서를 각각 열어볼 수 있습니다. 4안은 인수 시너지와 별도·연결 가치평가를 반영한 작성 중 버전입니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/temsco/original" className="rounded-xl border border-slate-700 bg-slate-900 p-5 hover:border-blue-500 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
              <span className="text-xs font-bold text-slate-400">VERSION 01</span>
              <h3 className="text-lg font-bold text-white mt-2">1안 투자제안서</h3>
              <p className="text-sm text-slate-400 mt-2">최초 투자제안서</p>
            </Link>
            <Link href="/temsco/deck" className="rounded-xl border border-slate-700 bg-slate-900 p-5 hover:border-blue-500 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
              <span className="text-xs font-bold text-blue-400">VERSION 02</span>
              <h3 className="text-lg font-bold text-white mt-2">2안 투자제안서</h3>
              <p className="text-sm text-slate-400 mt-2">투자 하이라이트·시장·성장 전략 · 11장</p>
            </Link>
            <Link href="/temsco/deck-v3" className="rounded-xl border border-slate-700 bg-slate-900 p-5 hover:border-blue-500 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
              <span className="text-xs font-bold text-slate-400">VERSION 03</span>
              <h3 className="text-lg font-bold text-white mt-2">3안 투자제안서</h3>
              <p className="text-sm text-slate-400 mt-2">과거 실적·DCF·멀티플·3개 시나리오·후속 투자유치 · 간지 포함 44장</p>
            </Link>
            <Link href="/temsco/deck-v4" className="rounded-xl border border-blue-500/60 bg-blue-950/30 p-5 hover:border-blue-400 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
              <span className="text-xs font-bold text-blue-400">VERSION 04 · 작성 중</span>
              <h3 className="text-lg font-bold text-white mt-2">4안 · NDA 이후 상세 검토용</h3>
              <p className="text-sm text-slate-300 mt-2">기술·인수 시너지·별도·연결 DCF · {v4MainChapters.length}개 장·별첨 · 목차·간지 포함 {v4Slides.length}장</p>
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="nda-editions" className="px-6 py-9 border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div><p className="text-xs tracking-widest text-blue-400 font-bold mb-2">INVESTOR MATERIALS</p><h2 id="nda-editions" className="text-xl font-bold">투자 검토 단계별 자료</h2></div>
            <p className="text-xs text-slate-400">검토 단계별 PDF · A4 가로</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <article className="border border-blue-500/50 rounded-xl bg-blue-950/20 p-6 flex flex-col">
              <p className="text-xs font-bold text-blue-400 tracking-widest">PRE-NDA</p>
              <h3 className="text-lg font-bold mt-2">NDA 이전 투자 검토용</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-3 mb-4">4안 전체 {v4Slides.length}페이지. 민감 수치·자료 CONFIDENTIAL 처리. 목차·도표·설명 유지.</p>
              <Link className="text-sm text-blue-300 font-bold underline underline-offset-4 mt-auto" href="/temsco/pre-nda">NDA 이전 자료 미리보기 →</Link>
            </article>
            <article className="border border-slate-700 rounded-xl bg-slate-900 p-6 flex flex-col">
              <p className="text-xs font-bold text-slate-400 tracking-widest">POST-NDA · VERSION 04</p>
              <h3 className="text-lg font-bold mt-2">NDA 이후 상세 검토용</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-3 mb-4">기존 4안 전체 {v4Slides.length}페이지. 별도·연결 재무, 인수 시너지, DCF·멀티플, 투자 효과 및 상세 가정.</p>
              <Link className="text-sm text-blue-300 font-bold underline underline-offset-4 mt-auto" href="/temsco/deck-v4">NDA 이후 자료 미리보기 →</Link>
            </article>
          </div>
          <PdfDownloadControls showPrint={false} />
        </div>
      </section>

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
            박막 코팅 소재 <span className="text-blue-500 font-normal">×</span> 정밀 메탈마스크<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
              글로벌 TIER-1 소부장 파트너
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10 text-balance">
            주식회사 템스코(TEMSCO)는 고순도 박막 코팅 소재 기술력과 정밀 메탈마스크 역량을 결합하여 
            업계 유일의 <b className="text-white font-bold">&apos;소재-가공-코팅-세정&apos; 원스톱 솔루션</b>을 구축했습니다.<br className="hidden sm:inline" />
            LG디스플레이 1차 벤더 확정과 중국 판매를 기반으로 사업을 확대하며, 삼성디스플레이와는 가격 협상을 진행 중입니다.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              href="/temsco/deck-v4"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-95 transition flex items-center gap-3"
            >
              <i className="fa-solid fa-file-powerpoint text-lg"></i>
              4안 투자제안서 슬라이드 보기
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </Link>

            <Link
              href="/temsco/original"
              className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center gap-2.5"
            >
              <i className="fa-solid fa-code-compare text-slate-400"></i>
              1안 투자제안서 보기
            </Link>

            <a
              href="/temsco/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center gap-2.5"
            >
              <i className="fa-solid fa-file-code text-slate-400"></i>
              2안 HTML 파일
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">4안 · 2026E 별도 매출</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">400억 원</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">영업이익 41.52억 · 회사 계획</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">4안 · 2029E 연결 매출</p>
              <p className="text-2xl sm:text-3xl font-black text-white">832.86억 원</p>
              <p className="text-[11px] text-blue-300 font-semibold mt-1">영업이익 155.90억 · 회사 계획</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">고객별 공급 단계</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">LG Tier-1</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">중국 판매 · 삼성 가격 협상</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl text-center backdrop-blur-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">투자 유치 목표</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">70억 원</p>
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
            <h3 className="text-lg font-bold text-white mb-2">LG 1차 벤더 확정 및 고객별 공급 확대</h3>
            <p className="text-sm text-slate-300 leading-relaxed break-keep">
              <b>LG디스플레이 1차 벤더 등록을 확정</b>하고 중국 고객 대상 판매를 진행하고 있습니다. <b>삼성디스플레이는 가격 협상 중</b>이며, 고객별 공급 단계에 맞춰 사업을 확대하고 있습니다.
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
            <h3 className="text-lg font-bold text-white mb-2">4안 재무자료 기반 별도·연결 실적 전망</h3>
            <p className="text-sm text-slate-300 leading-relaxed break-keep">
              2025년 채권 손상 손실 반영. <b>2026E 별도 매출 400.00억·영업이익 41.52억 / 연결 매출 414.63억·영업이익 13.30억.</b> 2029E 연결 매출 832.86억·영업이익 155.90억의 회사 계획.
            </p>
          </div>
        </div>
      </section>

      {/* Slide Deck Index & Navigator */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded border border-blue-800/60">Pitch Deck Slides</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">4안 슬라이드 목차 및 바로가기</h2>
            <p className="text-sm text-slate-400 mt-1">본문 {v4MainChapters.length}개 장·별첨 · 전체 목차 1장 · 간지 {v4Chapters.length}장 · 총 {v4Slides.length}페이지</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              전체 ({v4Slides.length})
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
              key={slide.id}
              href={`/temsco/deck-v4?slide=${slide.num}`}
              data-v4-slide-link={slide.id}
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 p-4 rounded-xl transition flex items-start gap-3.5 group shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                {slide.num}
              </div>
              <div className="flex-1 min-w-0">
                {(slide.kind === 'contents' || slide.kind === 'divider') && (
                  <span className="inline-block mb-1 text-[10px] font-bold tracking-wider text-blue-400">
                    {slide.kind === 'contents' ? '전체 목차' : slide.chapterId === 'appendix' ? '별첨 · 간지' : `CHAPTER ${v4Chapters.find(chapter => chapter.id === slide.chapterId)?.num} · 간지`}
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition break-keep leading-snug">
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
          <h3 className="text-lg font-bold text-white mb-2">4안의 {v4Slides.length}개 전체 슬라이드를 고화질 프레젠테이션으로 확인하세요</h3>
          <p className="text-xs text-slate-400 mb-5">A4 가로 비율 완벽 지원, 브라우저 슬라이드 모드 및 1클릭 PDF 인쇄 다운로드 제공</p>
          <Link
            href="/temsco/deck-v4"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition"
          >
            <i className="fa-solid fa-desktop"></i>
            4안 투자제안서 전체 보기 (Deck Viewer)
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
            <Link href="/temsco/deck-v4" className="hover:text-white transition font-semibold text-blue-400">4안 투자제안서</Link>
            <span>•</span>
            <Link href="/temsco/original" className="hover:text-white transition">1안 투자제안서</Link>
            <span>•</span>
            <a href="/temsco/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">2안 HTML 원문</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-900 text-center text-slate-600 text-[11px]">
          © 2026 TEMSCO, Ltd. All Rights Reserved. Confidential - For Investment Proposal Purpose Only.
        </div>
      </footer>
    </div>
  )
}
