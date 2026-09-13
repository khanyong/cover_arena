import ValuationSlide, { type ValuationSlideKind } from '../../components/TemscoV4/ValuationSlides'
import { MarketValuationSlide } from '../../components/TemscoV4/MarketValuationSlides'
import { FinancialSourceSlide } from '../../components/TemscoV4/FinancialSourceSlides'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AcquisitionSynergySlide from '../../components/TemscoV4/AcquisitionSynergySlide'
import AcquisitionValueSlide from '../../components/TemscoV4/AcquisitionValueSlide'
import DeckContents from '../../components/TemscoV4/DeckContents'
import ChapterDivider from '../../components/TemscoV4/ChapterDivider'
import InvestorExitSlide from '../../components/TemscoV4/InvestorExitSlide'
import TechnologySlide, { technologySlideIds } from '../../components/TemscoV4/TechnologySlides'
import OverviewSlide from '../../components/TemscoV4/OverviewSlides'
import StrategySlide from '../../components/TemscoV4/StrategySlides'
import PdfDownloadControls from '../../components/TemscoV4/PdfDownloadControls'
import { v4Slides, v4Chapters, getV4SlideIndex } from '../../lib/temsco/v4-slide-catalog'

const valuationPanels: { id: string; kind?: ValuationSlideKind; market?: 'wacc' | 'peers' }[] = [
  {
    "id": "valuation",
    "kind": "overview"
  },
  {
    "id": "valuation-source",
    "kind": "source"
  },
  {
    "id": "valuation-wacc",
    "market": "wacc"
  },
  {
    "id": "valuation-assumptions",
    "kind": "assumptions"
  },
  {
    "id": "valuation-parent-fcff",
    "kind": "parent-fcff"
  },
  {
    "id": "valuation-consolidated-fcff",
    "kind": "consolidated-fcff"
  },
  {
    "id": "valuation-terminal",
    "kind": "terminal"
  },
  {
    "id": "valuation-peers",
    "market": "peers"
  },
  {
    "id": "valuation-methods",
    "kind": "methods"
  },
  {
    "id": "valuation-scenarios",
    "kind": "scenarios"
  },
  {
    "id": "valuation-sensitivity",
    "kind": "sensitivity"
  },
  {
    "id": "valuation-equity",
    "kind": "equity"
  },
  {
    "id": "valuation-investment",
    "kind": "investment"
  }
]

const TOTAL_SLIDES = v4Slides.length
const slideTitles = v4Slides.map(slide => `${slide.num}. ${slide.title}`)

export default function TemscoDeckV4Page() {
  const [viewMode, setViewMode] = useState<'presentation' | 'scroll'>('presentation')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isNavigationReady, setIsNavigationReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, TOTAL_SLIDES - 1))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx)
    if (viewMode === 'scroll') {
      document.querySelector(`[data-slide-id="${v4Slides[idx].id}"]`)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }

  const navigateToSlide = (id: string) => goToSlide(getV4SlideIndex(id))

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err))
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    const syncSlideFromUrl = () => {
      const value = new URLSearchParams(window.location.search).get('slide')
      const page = Number(value)
      setCurrentSlide(value && Number.isInteger(page) && page >= 1 && page <= TOTAL_SLIDES ? page - 1 : 0)
    }
    syncSlideFromUrl()
    setIsNavigationReady(true)
    window.addEventListener('popstate', syncSlideFromUrl)
    return () => window.removeEventListener('popstate', syncSlideFromUrl)
  }, [])

  useEffect(() => {
    if (!isNavigationReady) return
    const url = new URL(window.location.href)
    if (url.searchParams.get('slide') !== v4Slides[currentSlide].num) {
      url.searchParams.set('slide', v4Slides[currentSlide].num)
      window.history.replaceState(null, '', url)
    }
    if (viewMode === 'scroll') {
      document.querySelector(`[data-slide-id="${v4Slides[currentSlide].id}"]`)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, [currentSlide, viewMode, isNavigationReady])

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, select, button, a, [contenteditable="true"]')) return

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        setCurrentSlide(prev => Math.min(prev + 1, TOTAL_SLIDES - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault()
        setCurrentSlide(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentSlide(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setCurrentSlide(TOTAL_SLIDES - 1)
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const updateScale = () => {
      if (viewMode !== 'presentation') {
        setScale(1)
        return
      }
      const availableWidth = window.innerWidth - (isFullscreen ? 24 : 48)
      const availableHeight = window.innerHeight - (isFullscreen ? 144 : 208)
      
      const scaleX = availableWidth / 1123
      const scaleY = availableHeight / 794
      const newScale = Math.min(scaleX, scaleY, 1.4)
      setScale(Math.max(newScale, 0.1))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [viewMode, isFullscreen])

  const getSlideClass = (index: number, bg: string = 'bg-white') => {
    const isActive = currentSlide === index
    if (viewMode === 'presentation') {
      return `temsco-slide ${bg} ${isActive ? 'block shadow-2xl ring-1 ring-slate-700/50' : 'hidden print:!block'}`
    }
    return `temsco-slide ${bg}`
  }

  const getSlideProps = (id: string, bg?: string) => {
    const index = getV4SlideIndex(id)
    return {
      'data-page': String(index + 1),
      'data-slide-id': id,
      'data-slide-kind': v4Slides[index].kind,
      className: getSlideClass(index, bg),
    }
  }

  const renderChapter = (id: string) => {
    const chapter = v4Chapters.find(item => item.id === id)
    if (!chapter) throw new Error(`Unknown TEMSCO V4 chapter: ${id}`)
    return (
      <div {...getSlideProps(chapter.divider.id)}>
        <ChapterDivider chapter={chapter} onNavigate={navigateToSlide} />
      </div>
    )
  }

  const renderValuationPanels = (chapterId: 'valuation' | 'appendix') => {
    const chapter = v4Chapters.find(item => item.id === chapterId)!
    return chapter.slides.map(slide => {
      const panel = valuationPanels.find(item => item.id === slide.id)
      if (!panel) throw new Error(`Unknown TEMSCO V4 valuation panel: ${slide.id}`)
      return <div key={panel.id} {...getSlideProps(panel.id, 'bg-white')}>
        {panel.market ? <MarketValuationSlide kind={panel.market} /> : <ValuationSlide kind={panel.kind!} />}
      </div>
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 print:bg-white print:min-h-0 print:block flex flex-col font-sans text-slate-800">
      <Head>
        <title>템스코 4안 - NDA 이후 상세 검토용</title>
        <meta name="description" content="템스코 4안 투자제안서 · NDA 이후 상세 검토용" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          :root {
            --slide-width: 1123px;
            --slide-height: 794px;
          }
          
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .temsco-slide { 
            width: var(--slide-width); 
            height: var(--slide-height); 
            background-color: #ffffff; 
            position: relative; 
            box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.4); 
            overflow: hidden; 
            flex-shrink: 0;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            box-sizing: border-box;
            counter-increment: slide-page;
            scroll-margin-top: 100px;
          }

          .temsco-slide::after {
            content: attr(data-page);
            position: absolute;
            bottom: 24px;
            right: 48px;
            font-size: 15px;
            font-weight: 700;
            color: #94a3b8;
            z-index: 100;
          }

          @page {
            size: A4 landscape;
            margin: 0mm !important;
          }

          @media print {
            @page {
              size: A4 landscape;
              margin: 0mm !important;
            }
            * {
              box-shadow: none !important;
              text-shadow: none !important;
              filter: none !important;
            }
            html, body { 
              background-color: #ffffff !important; 
              background: #ffffff !important;
              padding: 0 !important; 
              margin: 0 !important; 
              width: 100% !important;
              max-width: 297mm !important;
              height: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print,
            header,
            footer,
            #print-guide,
            body > *:not(#__next),
            body > #__next > div > header,
            body > #__next > div > div.no-print,
            [class*="feed"], [class*="rss"], [id*="feed"], [id*="rss"],
            [class*="extension"], [id*="extension"],
            [data-extension-id],
            img[src*="feed"], img[src*="rss"],
            svg[class*="feed"], svg[class*="rss"],
            a[href*="rss"], a[href*="feed"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              width: 0 !important;
              height: 0 !important;
              position: absolute !important;
              left: -9999px !important;
            }
            #__next,
            #__next > div,
            div[class*="overflow-hidden"],
            .temsco-slide-container {
              display: block !important;
              overflow: visible !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              width: 100% !important;
              max-width: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
              position: static !important;
              transform: none !important;
            }
            .temsco-slide-container {
              padding: 0 !important;
              gap: 0 !important;
              margin: 0 !important;
              background-color: #ffffff !important;
              background: #ffffff !important;
              display: block !important;
              height: auto !important;
              transform: none !important;
            }
            .temsco-slide { 
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 100% !important; 
              max-width: 297mm !important;
              height: 209mm !important; 
              min-height: 209mm !important;
              max-height: 209mm !important;
              box-shadow: none !important; 
              border: none !important;
              border-radius: 0 !important;
              margin: 0 auto !important; 
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              page-break-after: always !important; 
              break-after: page !important;
              overflow: hidden !important;
              position: relative !important;
              box-sizing: border-box !important;
              transform: none !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .temsco-slide:last-child,
            .temsco-slide:last-of-type {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
          }
        `}</style>
      </Head>

      <header className="no-print bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white px-5 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <Link 
            href="/temsco"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition flex items-center gap-1.5 border border-slate-700 shadow-sm"
          >
            <span>←</span> 4안 · NDA 이후 상세 검토용
          </Link>
          <div className="h-4 w-px bg-slate-700" />
          
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setViewMode('presentation')}
              className={`text-xs font-black px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'presentation'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <i className="fa-solid fa-desktop text-[11px]"></i>
              <span>PPT 슬라이드 쇼</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`text-xs font-black px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'scroll'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <i className="fa-solid fa-scroll text-[11px]"></i>
              <span>연속 스크롤</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigateToSlide('contents')}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/40 text-blue-300 hover:bg-blue-950 transition"
            aria-label="전체 목차로 이동"
          >
            목차
          </button>
          <div className="hidden md:flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="font-bold text-blue-400 mr-2">{String(currentSlide + 1).padStart(2, '0')} / {TOTAL_SLIDES}</span>
            <select
              value={currentSlide}
              onChange={(e) => goToSlide(Number(e.target.value))}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              {slideTitles.map((title, i) => (
                <option key={i} value={i} className="bg-slate-900 text-white">
                  {title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleFullscreen}
            title="전체화면 (F)"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
          >
            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            <span className="hidden sm:inline">{isFullscreen ? '전체화면 해제' : '전체화면'}</span>
          </button>

          <Link
            href="/temsco/original"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition hidden sm:inline-block"
          >
            1안 투자제안서
          </Link>

          <PdfDownloadControls />
        </div>
      </header>

      {/* Main Slide Container */}
      <div 
        className={viewMode === 'presentation' ? 'flex flex-col items-center justify-start flex-1 overflow-hidden relative pt-4 pb-28 print:!block print:!overflow-visible print:!h-auto print:!min-h-0 print:!p-0 print:!m-0' : 'flex-1 py-8 print:!p-0 print:!m-0'}
        style={viewMode === 'presentation' ? { minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)' } : undefined}
      >
        <div
          className="print:!w-auto print:!h-auto"
          style={viewMode === 'presentation' ? { width: 1123 * scale, height: 794 * scale, flexShrink: 0 } : undefined}
        >
        <main
          className="temsco-slide-container flex flex-col items-center print:!block print:!overflow-visible print:!h-auto print:!min-h-0 print:!p-0 print:!m-0"
          style={{ 
            counterReset: 'slide-page',
            width: viewMode === 'presentation' ? 1123 : undefined,
            transform: viewMode === 'presentation' ? `scale(${scale})` : undefined,
            transformOrigin: 'left top',
            transition: 'transform 0.15s ease-out'
          }}
        >
        {/* 표지 */}
        <div {...getSlideProps('cover', 'bg-white')}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/95 to-slate-100/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-bl-full opacity-50 -z-0"></div>
          <div className="relative z-10 flex flex-col items-start justify-start h-full px-24 pt-24 pb-8">
            <div className="border-l-4 border-blue-600 pl-6 mb-7">
              <h2 className="text-2xl text-blue-700 font-bold tracking-widest uppercase">TEMSCO Investment Proposal</h2>
              <p className="text-slate-500 mt-1.5 font-medium text-sm">NDA 이후 상세 검토용 · CONFIDENTIAL</p>
            </div>
            <h1 className="leading-tight mb-7 flex flex-col items-start">
              <span className="text-[34px] font-bold text-slate-800 tracking-tight mb-1">
                박막 코팅 소재 × 정밀 메탈마스크,
              </span>
              <span className="text-[44px] font-black text-blue-700 tracking-tight mb-1">
                반도체·디스플레이 산업의 글로벌
              </span>
              <span className="text-[50px] font-black text-slate-900 tracking-tight">
                <span className="text-blue-700">TIER-1 소부장 파트너</span>로의 퀀텀점프
              </span>
            </h1>
            <p className="text-lg text-slate-700 mb-7 font-medium leading-relaxed max-w-3xl bg-white/60 p-4 rounded-xl border border-slate-200 shadow-xs">
              템스코의 고순도 박막 코팅 소재 기술력과 정밀 메탈마스크 제조 역량을 결합하여 업계 유일의 &apos;소재-정밀가공-코팅-세정&apos; 원스톱 일원화 체계를 완성했습니다. LG 1차 벤더 직접 판매 및 중국 고객 판매 기반. LG 레퍼런스를 활용한 삼성 공급 가격 협상 진행.
            </p>
            <div className="mt-auto w-full flex justify-between items-end border-t border-slate-300 pt-5 pb-2">
              <div>
                <p className="text-2xl font-bold tracking-wide text-slate-800">주식회사 템스코 (TEMSCO, Ltd.)</p>
                <p className="text-sm text-slate-500 mt-1">CEO 오정석 | 설립일: 2010. 10. 22</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-slate-600 font-bold">2026. 09.</p>
              </div>
            </div>
          </div>
        </div>

        <div {...getSlideProps('contents')}>
          <DeckContents onNavigate={navigateToSlide} />
        </div>

        {renderChapter('overview')}

        <div {...getSlideProps('investment-highlights')}><OverviewSlide id="investment-highlights" /></div>

        <div {...getSlideProps('company-overview')}><OverviewSlide id="company-overview" /></div>

        {renderChapter('acquisition')}

        {/* Acquisition Value and Annual Profit */}
        <div {...getSlideProps('acquisition-value')} id="acquisition-value">
          <AcquisitionValueSlide />
        </div>

        {/* Acquisition Synergy */}
        <div {...getSlideProps('acquisition-synergy')} id="acquisition-synergy">
          <AcquisitionSynergySlide />
        </div>

        <div {...getSlideProps('business-synergy')}><OverviewSlide id="business-synergy" /></div>

        {renderChapter('technology')}
        {technologySlideIds.map(id => (
          <div key={id} {...getSlideProps(id)}><TechnologySlide id={id} /></div>
        ))}

        {renderChapter('growth')}

        <div {...getSlideProps('risk-resolution')}><StrategySlide id="risk-resolution" /></div>

        <div {...getSlideProps('growth-pipeline')}><StrategySlide id="growth-pipeline" /></div>

        {renderChapter('financials')}

        {/* Financial Turnaround */}
        <div {...getSlideProps('financial-turnaround', 'bg-white')}><FinancialSourceSlide kind="turnaround" /></div>

        {/* Segment Revenue (마스크 vs 소재 부문별 매출 로드맵) */}
        <div {...getSlideProps('segment-revenue', 'bg-white')}><FinancialSourceSlide kind="revenue" /></div>

        {/* Income Statement (종합 추정손익계산서 및 수익성 분석) */}
        <div {...getSlideProps('income-statement', 'bg-white')}><FinancialSourceSlide kind="income" /></div>

        {renderChapter('valuation')}

        {/* Valuation & Post-Investment */}
        {renderValuationPanels('valuation')}

        {renderChapter('funding')}

        <div {...getSlideProps('use-of-proceeds')}><StrategySlide id="use-of-proceeds" /></div>

        <div {...getSlideProps('investor-exit')}><InvestorExitSlide /></div>

        {renderChapter('appendix')}
        {renderValuationPanels('appendix')}
      </main>
        </div>
      </div>

      {/* Floating Bottom Control Bar in Presentation Mode */}
      {viewMode === 'presentation' && (
        <div className="no-print fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-2xl flex flex-col items-center gap-2 max-w-[95vw]">
          <div className="flex items-center gap-3">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              title="이전 슬라이드 (←, PageUp)"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
              <span className="hidden sm:inline">이전</span>
            </button>

            {/* Current Slide Info Chip */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-black text-blue-400">
                {String(currentSlide + 1).padStart(2, '0')} <span className="text-slate-500 font-normal">/ {TOTAL_SLIDES}</span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="font-bold text-slate-200 max-w-[200px] sm:max-w-[320px] truncate">
                {slideTitles[currentSlide]}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === TOTAL_SLIDES - 1}
              title="다음 슬라이드 (→, Space, PageDown)"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-600/30 active:scale-95"
            >
              <span className="hidden sm:inline">다음</span>
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>

            {/* Fullscreen Icon Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? '전체화면 해제 (F)' : '전체화면 (F)'}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center justify-center text-xs ml-1"
            >
              <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
          </div>

          {/* Quick Number/Dot Navigator Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-1 py-0.5">
            {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                title={slideTitles[idx]}
                className={`text-[11px] font-bold rounded-md px-2 py-0.5 transition ${
                  currentSlide === idx
                    ? 'bg-blue-600 text-white shadow-sm scale-110'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
