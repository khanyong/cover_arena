import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function TemscoDeckPage() {
  const [viewMode, setViewMode] = useState<'presentation' | 'scroll'>('presentation')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const TOTAL_SLIDES = 11

  const slideTitles = [
    '01. 표지 (TEMSCO Investment Proposal)',
    '02. Executive Summary : 핵심 투자 하이라이트',
    '03. Company Overview : 기업 개요 및 연혁',
    '04. Market Opportunity : 디스플레이 시장 기회 & 공급망 재편',
    '05. Core Solution : 소재·부품 수직계열화 토탈 솔루션',
    '06. Core Competencies : 고순도 코팅 기술 & 메탈마스크 해자',
    '07. Expansion Strategy : 글로벌 1차 벤더 직납 확대',
    '08. Financial Track Record : 2025년 부실 100% 해소',
    '09. Financial Projections : 2026-2029 퀀텀점프 실적 추정',
    '10. Non-Mask New Growth : 탈마스크 신성장 로드맵',
    '11. The Ask & Use of Proceeds : 30~50억 투자 조건 및 자금 활용',
  ]

  const handlePrint = () => {
    window.print()
  }

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, TOTAL_SLIDES - 1))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx)
  }

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
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

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
      const availableHeight = window.innerHeight - (isFullscreen ? 110 : 170)
      
      const scaleX = availableWidth / 1123
      const scaleY = availableHeight / 794
      const newScale = Math.min(scaleX, scaleY, 1.4)
      setScale(Math.max(newScale, 0.4))
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

  return (
    <div className="min-h-screen bg-slate-950 print:bg-white print:min-h-0 print:block flex flex-col font-sans text-slate-800">
      <Head>
        <title>주식회사 템스코 (TEMSCO) - IR 투자제안서 슬라이드</title>
        <meta name="description" content="주식회사 템스코(TEMSCO) IR 자료 슬라이드 및 PDF 다운로드" />
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
          }

          .temsco-slide::after {
            content: counter(slide-page);
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
            <span>←</span> 템스코 소개
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

        <div className="flex items-center space-x-2.5">
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
            초기 원본
          </Link>

          <button
            onClick={handlePrint}
            className="text-xs font-black px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-file-pdf"></i>
            PDF 저장
          </button>
        </div>
      </header>

      {/* Main Slide Container */}
      <div 
        className={viewMode === 'presentation' ? 'flex flex-col items-center justify-center flex-1 overflow-hidden relative py-4 print:!block print:!overflow-visible print:!h-auto print:!min-h-0 print:!p-0 print:!m-0' : 'flex-1 py-8 print:!p-0 print:!m-0'}
        style={viewMode === 'presentation' ? { minHeight: isFullscreen ? '100vh' : 'calc(100vh - 120px)' } : undefined}
      >
        <main 
          className="temsco-slide-container flex flex-col items-center print:!block print:!overflow-visible print:!h-auto print:!min-h-0 print:!p-0 print:!m-0"
          style={{ 
            counterReset: 'slide-page',
            transform: viewMode === 'presentation' ? `scale(${scale})` : undefined,
            transformOrigin: 'center top',
            transition: 'transform 0.15s ease-out'
          }}
        >
        {/* Slide 1 : 표지 */}
        <div className={getSlideClass(0, 'bg-white')}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/95 to-slate-100/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-bl-full opacity-50 -z-0"></div>
          <div className="relative z-10 flex flex-col items-start justify-start h-full px-24 pt-24 pb-8">
            <div className="border-l-4 border-blue-600 pl-6 mb-7">
              <h2 className="text-2xl text-blue-700 font-bold tracking-widest uppercase">TEMSCO Investment Proposal</h2>
              <p className="text-slate-500 mt-1.5 font-medium text-sm">CONFIDENTIAL - For Investors Only</p>
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
              템스코의 고순도 박막 코팅 소재 기술력과 정밀 메탈마스크 제조 역량을 결합하여 업계 유일의 &apos;소재-정밀가공-코팅-세정&apos; 원스톱 일원화 체계를 완성했습니다. 삼성·LG 및 글로벌 패널사의 1차 핵심 파트너로 도약합니다.
            </p>
            <div className="mt-auto w-full flex justify-between items-end border-t border-slate-300 pt-5 pb-2">
              <div>
                <p className="text-2xl font-bold tracking-wide text-slate-800">주식회사 템스코 (TEMSCO, Ltd.)</p>
                <p className="text-sm text-slate-500 mt-1">CEO 오정석 | 설립일: 2010. 10. 22</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-slate-600 font-bold">2026. 08.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 : Slide 1. Executive Summary */}
        <div className={getSlideClass(1, 'bg-white')}>
          <div className="h-full flex flex-col p-12">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Executive Summary : 핵심 투자 하이라이트</h2>
            <div className="grid grid-cols-2 gap-5 h-full pb-2">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-blue-600 text-[1.75rem] mb-3"><i className="fa-solid fa-layer-group"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">소재·부품 수직계열화 토탈 솔루션 완성</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  템스코의 고순도 박막 코팅 소재(스퍼터링 타겟) 기술력과 2024년 3월 인수한 <b>위폼스(주)의 정밀 메탈마스크 제조 역량을 결합</b>하여, 업계 유일의 <b>&apos;소재-정밀가공-코팅-세정&apos; 원스톱 일원화 체계를 완성</b>하였습니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-indigo-600 text-[1.75rem] mb-3"><i className="fa-solid fa-earth-asia"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">글로벌 Top-tier 1차 벤더(Tier-1) 직납 승격</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  기존 2차 벤더 간접 납품 구조에서 탈피하여 <b>삼성디스플레이, LG디스플레이, 미국 AMAT, eMagin, 중국 CSOT 및 비전옥스(Visionox)</b> 등에 1차 벤더 등록을 완료하고 2026년부터 본격적인 양산 공급을 개시하였습니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-emerald-600 text-[1.75rem] mb-3"><i className="fa-solid fa-handshake-angle"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">위기를 기회로 전환한 턴어라운드 &amp; 직수출 확대</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  파인원 회생절차를 계기로 글로벌 패널사 직납 체제로 전면 전환하였으며, <b>중국 비전옥스로부터 마스크 전체 물량의 30% 배정을 확정</b>받는 등 수주 규모를 획기적으로 확대하고 2026년 4분기부터 직수출 양산에 돌입합니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-slate-700 text-[1.75rem] mb-3"><i className="fa-solid fa-chart-line"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">2025년 잠재 부실 완전 해소 &amp; 퀀텀점프 실적</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  2025년 결산 시 회생 관련 채권 <b>약 80억 원을 전액 대손상각 처리하여 부실을 100% 선반영(Clean Sheet)</b>했습니다. 2026년 매출 400억 흑자 전환을 시작으로 <b>2027년 520억, 2029년 700억 원(OPM 11.3%, OP 78.9억)</b>을 실현합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 : Slide 2. Company Overview */}
        <div className={getSlideClass(2, 'bg-slate-50')}>
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2.2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-2 mb-8 inline-block w-max">Company Overview &amp; Milestones</h2>
            <div className="flex flex-1 gap-10 items-stretch">
              <div className="w-[45%] flex flex-col gap-5">
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-8 border-l-[10px] border-l-blue-600 shadow-sm relative h-[45%] flex flex-col justify-start">
                  <p className="text-blue-600 font-bold text-sm tracking-widest mb-2 uppercase">Core Identity</p>
                  <h3 className="text-[1.5rem] font-black text-slate-900 leading-tight mb-3 tracking-tight">&quot;첨단 소부장 융합으로 글로벌 초격차를 연결한다&quot;</h3>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                    2010년 10월 설립 이후 반도체 및 디스플레이 핵심 배선막(Array layer) 고순도 박막코팅소재로 출발하여, 첨단 에너지 및 정밀부품 분야로 포트폴리오를 지속 확장해 왔습니다.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm h-[55%] flex flex-col justify-start">
                  <h4 className="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                    <i className="fa-solid fa-layer-group text-blue-600 mr-2"></i>핵심 사업 영역 및 다각화
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <span className="bg-blue-100 text-blue-700 font-black text-xs px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">박막소재</span>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] mb-0.5">고순도 박막코팅소재 (Al, Mo, CuMn, Ag 등)</p>
                        <p className="text-[13px] text-slate-500 leading-snug">반도체·디스플레이 미세 배선막용 스퍼터링 타겟 및 첨단 에너지 소재.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="bg-indigo-100 text-indigo-700 font-black text-xs px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">정밀부품</span>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] mb-0.5">정밀 메탈마스크 (위폼스 CVD/OMM/FMM)</p>
                        <p className="text-[13px] text-slate-500 leading-snug">OLED 진공증착 핵심 부품. 24년 3월 인수 통해 일괄 제조 역량 확보.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="bg-slate-200 text-slate-700 font-black text-xs px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">특수강</span>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] mb-0.5">Ni 특수강 및 SUS420 비철소재</p>
                        <p className="text-[13px] text-slate-500 leading-snug">고진공 챔버 및 정밀 가공 부품용 신뢰성 기초 소재 네트워크 구축.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[55%] flex flex-col justify-end pt-4 pb-2">
                <div className="relative bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-center w-[90%] mx-auto mb-10">
                  <h3 className="font-black text-[1.1rem] text-slate-800">단품 제조사를 넘어선 &apos;소부장 융합 Tier-1&apos; 진화 연혁</h3>
                  <div className="absolute -top-4 -right-10 text-blue-600 font-black text-[1.1rem] bg-slate-50 px-2 tracking-wide">Growth Roadmap</div>
                </div>
                <div className="flex-1 flex flex-col justify-end relative h-[320px]">
                  <div className="flex items-end h-[280px] gap-3 px-2">
                    <div className="w-1/4 h-[35%] bg-[#f1f5f9] border border-slate-200 rounded-t-lg flex flex-col items-center justify-center px-1 py-3 text-center shadow-sm">
                      <p className="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-nowrap tracking-tight">2010.10 설립<br /><span className="font-medium text-[10px] mt-1.5 block">고순도 박막소재 기반</span></p>
                    </div>
                    <div className="w-1/4 h-[55%] bg-[#eff6ff] border border-blue-200 rounded-t-lg flex flex-col items-center justify-center px-1 py-3 text-center relative shadow-sm">
                      <div className="absolute -top-8 bg-[#e0e7ff] text-[#3730a3] text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">M&amp;A 모멘텀</div>
                      <i className="fa-solid fa-building-circle-check text-blue-500 text-2xl mb-2"></i>
                      <p className="text-[11px] font-bold text-blue-900 leading-relaxed whitespace-nowrap tracking-tight">위폼스(주) 전격 인수<br /><span className="font-medium text-[10px] text-blue-700 mt-1.5 block">(메탈마스크 역량 내재화)</span></p>
                    </div>
                    <div className="w-1/4 h-[80%] bg-[#3b4758] rounded-t-lg flex flex-col items-center justify-start pt-6 px-1 py-3 text-center relative shadow-md">
                      <div className="absolute -top-8 bg-[#fee2e2] border border-red-200 text-[#b91c1c] text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">Clean Sheet</div>
                      <i className="fa-solid fa-broom text-red-400 text-[1.4rem] mb-3"></i>
                      <p className="text-[11px] font-bold text-white leading-relaxed tracking-tight">미회수 채권 80억<br />전액 대손상각 결산<br /><span className="font-medium text-[10px] text-slate-300 mt-2 block leading-relaxed">(잠재 부실 100% 소멸)</span></p>
                    </div>
                    <div className="w-1/4 h-[100%] bg-[#2563eb] rounded-t-lg flex flex-col items-center justify-start pt-6 px-1 py-3 text-center relative shadow-md">
                      <i className="fa-solid fa-earth-asia text-white text-3xl mb-3"></i>
                      <p className="text-[12px] font-bold text-white leading-relaxed mb-4 whitespace-nowrap tracking-tight">글로벌 1차 벤더<br />양산 본격 공급</p>
                      <div className="bg-white w-[95%] rounded p-1 shadow-sm">
                        <p className="text-[10px] font-bold text-blue-800 leading-tight whitespace-nowrap tracking-tight">SDC, LGD, AMAT,<br />eMagin, Visionox, CSOT</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-4 border-t border-slate-300 pt-2">
                    <div className="w-1/4 text-center text-[13px] font-bold text-slate-600">2010 ~ 2023</div>
                    <div className="w-1/4 text-center text-[13px] font-bold text-blue-600">2024. 03</div>
                    <div className="w-1/4 text-center text-[13px] font-bold text-slate-800">2025. 12</div>
                    <div className="w-1/4 text-center text-[13px] font-black text-blue-800">2026. 01 ~</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 4 : Business Synergy */}
        <div className={getSlideClass(3, 'bg-white')}>
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-10 inline-block w-max">Business Synergy : [소재-정밀가공-코팅-세정] 원스톱 일원화 체계</h2>
            <div className="flex-1 flex flex-col justify-between pb-6">
              <div className="flex items-center justify-center gap-8 h-full">
                <div className="w-[30%] bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
                  <span className="bg-slate-200 text-slate-600 font-bold px-3 py-1 rounded text-sm mb-4 inline-block">원소재 자체 조달 및 가공</span>
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-blue-600 border border-slate-200 shadow-sm"><i className="fa-solid fa-cube"></i></div>
                  <h4 className="font-bold text-xl text-slate-800 mb-2">Invar 박판·후판 직공급</h4>
                  <p className="text-[14px] text-slate-600 font-medium">원자재 직조달 및 중간 유통 마진 제거로 마스크 원가 구조 최적화</p>
                </div>
                <div className="text-4xl text-blue-300"><i className="fa-solid fa-angles-right"></i></div>
                <div className="w-[60%] flex gap-6 bg-blue-50 border border-blue-200 p-10 rounded-2xl shadow-md relative">
                  <div className="absolute -top-5 right-10 bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow-lg text-lg flex items-center">
                    <i className="fa-solid fa-crown mr-2 text-yellow-300"></i>원스톱 일원화 시스템 완성
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-xl border border-blue-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border border-blue-100"><i className="fa-solid fa-layer-group"></i></div>
                    <h4 className="font-black text-2xl text-slate-800 mb-2">템스코 <span className="text-lg font-bold text-slate-500">(TEMSCO)</span></h4>
                    <p className="font-bold text-blue-700 text-lg bg-blue-50 py-2 rounded leading-snug">CVD 코팅 &amp; 세정</p>
                  </div>
                  <div className="flex items-center justify-center text-4xl text-blue-400 drop-shadow-sm"><i className="fa-solid fa-plus"></i></div>
                  <div className="flex-1 bg-white p-6 rounded-xl border border-indigo-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border border-indigo-100"><i className="fa-solid fa-microchip"></i></div>
                    <h4 className="font-black text-2xl text-slate-800 mb-2">위폼스 <span className="text-lg font-bold text-slate-500">(WEFORMS)</span></h4>
                    <p className="font-bold text-indigo-700 text-lg bg-indigo-50 py-1 rounded">정밀 메탈마스크 제조<br />(CVD, OMM, FMM)</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 text-white p-8 rounded-2xl flex items-start justify-between shadow-lg mt-8">
                <div className="w-1/3 border-r border-slate-600 pr-8">
                  <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center"><i className="fa-solid fa-stopwatch mr-2"></i>공정 리드타임 단축</h4>
                  <p className="text-[14px] text-slate-300 leading-relaxed font-medium break-keep">전 공정 내재화를 통해 외주 분산 대비 품질 편차를 통제하고 초격차 수율 확보.</p>
                </div>
                <div className="w-1/3 border-r border-slate-600 px-8">
                  <h4 className="text-xl font-bold text-emerald-400 mb-3 flex items-center"><i className="fa-solid fa-boxes-stacked mr-2"></i>소재-부품 융합 확장</h4>
                  <p className="text-[14px] text-slate-300 leading-relaxed font-medium break-keep">마스크 1차 벤더를 지렛대 삼아 박막 코팅 소재까지 1차 벤더 확정.</p>
                </div>
                <div className="w-1/3 pl-8">
                  <h4 className="text-xl font-bold text-purple-400 mb-3 flex items-center"><i className="fa-solid fa-handshake-angle mr-2"></i>이익률 극대화 실현</h4>
                  <p className="text-[14px] text-slate-300 leading-relaxed font-medium break-keep">중간 유통 마진의 완전 제거로 원가경쟁력 확보 및 높은 영업이익률 체질 전환.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 5 : Risk & Resolution (Original 복원) */}
        <div className={getSlideClass(4, 'bg-white')}>
          <div className="h-full flex flex-col p-14">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Risk &amp; Resolution : 파인원 사태의 본질과 재무 팩트 체크</h2>
            <p className="text-[17px] tracking-tight break-keep text-slate-800 mb-8 border-l-4 border-red-600 pl-4 bg-red-50 py-2 border border-red-100">
              &quot;부채비율 1557%의 진실&quot; : 당사의 영업력이나 기술력 훼손이 아닌, 과거 악성 채권 상각에 따른 <b>장부상 자본 감소(회계적 착시)</b>입니다.
            </p>
            
            <div className="flex-1 flex items-stretch justify-between gap-8 pb-4">
              {/* Waterfall Chart Container */}
              <div className="flex-1 bg-white border border-slate-300 shadow-sm rounded-xl p-8 flex items-end justify-center relative">
                <div className="absolute top-4 left-6 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                  <i className="fa-solid fa-chart-column mr-2"></i>자본총계 변동 폭포수 차트 (단위: 억원)
                </div>
                
                <div className="flex flex-col items-center justify-end h-[300px]">
                  <span className="text-2xl font-bold text-slate-800 mb-2">104.7억</span>
                  <div className="w-24 bg-blue-600 rounded-t h-[240px] shadow-sm flex items-end justify-center pb-4 text-white font-bold text-sm">24년 자본총계</div>
                </div>
                
                {/* Decrement 1 */}
                <div className="flex flex-col items-center justify-start h-[300px] pt-[60px]">
                  <span className="text-xl font-bold text-red-600 mb-2">-68.2억</span>
                  <div className="w-24 bg-red-500 rounded h-[160px] shadow-sm flex flex-col items-center justify-center text-white font-bold border border-red-600">
                    <i className="fa-solid fa-arrow-down mb-1"></i>대손상각비
                  </div>
                </div>

                {/* Decrement 2 */}
                <div className="flex flex-col items-center justify-start h-[300px] pt-[220px]">
                  <span className="text-sm font-bold text-orange-600 mb-1">-15.4억</span>
                  <div className="w-24 bg-orange-400 rounded h-[36px] shadow-sm flex items-center justify-center text-white font-bold text-xs border border-orange-500">기타(지분법등)</div>
                </div>

                <div className="flex flex-col items-center justify-end h-[300px]">
                  <span className="text-2xl font-bold text-slate-800 mb-2">21.0억</span>
                  <div className="w-24 bg-slate-500 rounded-t h-[44px] shadow-sm flex items-end justify-center pb-2 text-white font-bold text-sm">25년 자본총계</div>
                </div>
              </div>

              {/* Text Explanation */}
              <div className="w-[45%] flex flex-col">
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl shadow-sm h-full flex flex-col justify-center gap-6">
                  <div className="border-b border-slate-300 pb-5">
                    <span className="bg-red-100 text-red-800 border border-red-200 font-bold px-3 py-1 rounded text-sm mb-3 inline-block">
                      <i className="fa-solid fa-triangle-exclamation mr-2"></i>이슈의 발생 (Crisis)
                    </span>
                    <p className="text-slate-700 text-[15px] leading-relaxed">
                      2025년 9월, 제품 불량이 아닌 고객사(파인원)의 무리한 상장 준비 및 선행투자로 인한 <b>&apos;흑자 부도&apos;</b> 발생. 이에 따라 회수 불투명해진 약 75억 원의 채권 중 <b>68.2억 원을 25년 결산에 대손상각(비용)으로 전액 반영</b>하였습니다.
                    </p>
                  </div>
                  <div>
                    <span className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-3 py-1 rounded text-sm mb-3 inline-block">
                      <i className="fa-solid fa-lightbulb mr-2"></i>팩트 체크 및 기회 (Resolution)
                    </span>
                    <ul className="space-y-3 text-slate-700 text-[15px] leading-relaxed list-none">
                      <li className="flex items-start"><i className="fa-solid fa-check text-green-600 mt-1 mr-2"></i><span><b>부채 자체의 증가 없음:</b> 25년 총 부채는 328억으로 전년(333억) 대비 감소. 부채비율 폭등은 분모(자본) 감소에 의한 단순 산술적 결과입니다.</span></li>
                      <li className="flex items-start"><i className="fa-solid fa-check text-green-600 mt-1 mr-2"></i><span><b>현금 유출 없는 회계적 손실:</b> 대손상각은 과거 발생 채권의 제각(Write-off)일 뿐, 당기 영업 현금흐름을 훼손하지 않습니다.</span></li>
                      <li className="flex items-start"><i className="fa-solid fa-check text-green-600 mt-1 mr-2"></i><span><b>최종 고객사 직납 기회 창출:</b> 중간 벤더 소멸을 기회로 중국 CSOT, 비전옥스 등 최종 패널 메이커의 1차 직납 업체로 진입하는 성과를 거두었습니다.</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 6 : Growth Pipeline */}
        <div className={getSlideClass(5, 'bg-slate-50')}>
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-4 inline-block w-max">Growth Pipeline : 주요 고객사별 양산 전개 계획</h2>
            <p className="text-slate-700 text-lg mb-6 font-medium">국내외 메이저 패널 메이커 및 글로벌 반도체·XR 장비사와의 직납 양산 라인업을 완성했습니다.</p>
            
            <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
              {/* Left Column: 국내 메인 고객사 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm relative flex flex-col justify-start min-w-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center border-b border-slate-200 pb-3">
                  <i className="fa-solid fa-building-flag text-blue-600 mr-3"></i>
                  국내 메인 고객사 (디스플레이)
                </h3>
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <h4 className="font-black text-xl text-blue-800">삼성디스플레이 (SDC)</h4>
                      <span className="bg-green-100 text-green-800 border border-green-300 text-[13px] font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shrink-0">
                        <i className="fa-solid fa-circle-check"></i>4개 모델 선정
                      </span>
                    </div>
                    <ul className="text-[14px] text-slate-700 space-y-2 font-medium">
                      <li>• <b>부품:</b> 진공증착용 메탈마스크 2027년 본양산 <b>신규 4개 모델 선정 완료</b> (추가 2개 모델 협의 중)</li>
                      <li>• <b>소재:</b> 고순도 알루미늄(Al) 타겟 및 Invar 특수 소재 직납 평가 동시 진행</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <h4 className="font-black text-xl text-red-700">LG디스플레이 (LGD)</h4>
                      <span className="bg-green-100 text-green-800 border border-green-300 text-[13px] font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shrink-0">
                        <i className="fa-solid fa-handshake"></i>메인 공급사 선정
                      </span>
                    </div>
                    <ul className="text-[14px] text-slate-700 space-y-2 font-medium">
                      <li>• <b>부품:</b> 메탈마스크 1차 벤더 <b>최우선 협상 대상자 및 메인 공급사 공식 선정</b></li>
                      <li>• <b>소재:</b> 몰리브덴(Mo)/알루미늄(Al) 타겟 평가 후 은(Ag) 합금 타겟 순차 확대</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: 글로벌 고객사 & 신사업 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm relative flex flex-col justify-start min-w-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center border-b border-slate-200 pb-3">
                  <i className="fa-solid fa-globe text-emerald-600 mr-3"></i>
                  글로벌 패널사 &amp; 반도체/XR 장비사
                </h3>
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-black text-xl text-slate-900">중국 Visionox &amp; CSOT</h4>
                        <p className="text-[13px] text-slate-500 font-bold mt-1">OLED 패널 글로벌 제조사</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[13px] font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shrink-0">
                        <i className="fa-solid fa-boxes-packing"></i>물량 30% 배정 확정
                      </span>
                    </div>
                    <p className="text-[14px] text-slate-700 mt-2 border-t border-slate-200 pt-3 leading-relaxed font-medium">
                      파인원 대체 1차 벤더 승격을 완료하여 <b>비전옥스 전체 메탈마스크 물량의 30% 배정을 확정</b>받았으며, 2026년 4분기부터 직수출 양산에 돌입합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-center gap-3">
                      <div>
                        <h4 className="font-black text-base text-slate-900 mb-1.5 break-keep">AMAT &amp; eMagin (미국)</h4>
                        <p className="text-[13px] text-slate-500 font-bold break-keep">글로벌 장비사 / 초고해상도 XR</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-[12.5px] font-bold px-2.5 py-1 rounded-lg border border-yellow-300 w-max">
                        1차 벤더 등록 완료
                      </span>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-center gap-3">
                      <div>
                        <h4 className="font-black text-base text-slate-900 mb-1.5 break-keep">반도체 신사업 파이프라인</h4>
                        <p className="text-[13px] text-slate-500 font-bold break-keep">HF 봄베 / CuMn 타겟 / 구리기판</p>
                      </div>
                      <span className="bg-purple-100 text-purple-800 text-[12.5px] font-bold px-2.5 py-1 rounded-lg border border-purple-300 w-max">
                        시제품 평가 전개
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 7 : Financial Turnaround */}
        <div className={getSlideClass(6, 'bg-white')}>
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-5 inline-block w-max">Financial Turnaround : 본질적 수익성 흑자 턴어라운드</h2>
            <p className="text-base text-slate-800 mb-6 border-l-4 border-blue-600 pl-4 bg-blue-50 py-2.5 font-medium border border-blue-100 rounded-r-xl break-keep">
              2025년 결산 시 회생 관련 채권(약 80억)을 전액 대손상각 완료하여 잠재 부실을 100% 해소하였으며, <b>2026년부터 1차 직납 공급 개시로 폭발적 흑자 턴어라운드</b>를 시작합니다.
            </p>

            <div className="flex-1 flex gap-8 items-stretch min-h-0">
              {/* Left Column: Turnaround Waterfall / Bar Chart */}
              <div className="w-[55%] bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm flex flex-col justify-between relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <i className="fa-solid fa-chart-column text-blue-600"></i>
                    영업이익 턴어라운드 및 퀀텀점프 (단위: 억원)
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                    기준: 0 손익분기선
                  </span>
                </div>

                {/* Chart Canvas */}
                <div className="relative h-[270px] w-full flex items-center justify-between px-4 mt-2">
                  {/* Baseline: 0 Line */}
                  <div className="absolute w-full left-0 top-[135px] border-b-2 border-dashed border-slate-400 z-0"></div>

                  {/* Bar 1: 2025년 */}
                  <div className="relative z-10 flex flex-col items-center justify-start h-full pt-[135px] w-24">
                    <div className="w-22 bg-red-500 rounded-b-xl h-[70px] shadow-sm flex flex-col items-center justify-center text-white font-bold border border-red-600 text-xs text-center leading-tight">
                      <span className="text-[11px]">2025년</span>
                      <span className="text-[9.5px] text-red-100 font-normal">대손 반영</span>
                    </div>
                    <span className="text-lg font-black text-red-600 mt-1.5">-51.9억</span>
                    <span className="text-xs text-slate-600 font-bold whitespace-nowrap">장부상 손실</span>
                  </div>

                  {/* Bridge 1: 2025 -> 2026 */}
                  <div className="relative z-10 flex flex-col items-center justify-center pb-8">
                    <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <i className="fa-solid fa-arrow-trend-up"></i>
                      <span>+91.4억</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 mt-1.5 whitespace-nowrap">
                      흑자 턴어라운드
                    </span>
                    <svg className="w-9 h-5 text-emerald-600 mt-1" viewBox="0 0 36 20" fill="none">
                      <path d="M2 18C12 18 20 12 32 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3"/>
                      <path d="M24 3L33 3L33 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Bar 2: 2026(E) */}
                  <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[135px] w-24">
                    <span className="text-lg font-black text-blue-700 mb-1.5">+39.5억</span>
                    <div className="w-22 bg-blue-600 rounded-t-xl h-[90px] shadow-sm flex flex-col items-center justify-center text-white font-bold text-center text-xs border border-blue-700">
                      <span>2026(E)</span>
                      <span className="text-[10px] text-blue-100 font-normal">영업이익</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs text-blue-900 font-black block whitespace-nowrap">매출 400억</span>
                      <span className="text-[11px] text-slate-600 font-semibold">(OPM 9.9%)</span>
                    </div>
                  </div>

                  {/* Bridge 2: 2026 -> 2029 */}
                  <div className="relative z-10 flex flex-col items-center justify-center pb-12">
                    <div className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <i className="fa-solid fa-bolt text-yellow-300"></i>
                      <span>2.0배 성장</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300 mt-1.5 whitespace-nowrap">
                      퀀텀점프 스케일업
                    </span>
                    <svg className="w-9 h-5 text-indigo-600 mt-1" viewBox="0 0 36 20" fill="none">
                      <path d="M2 18C12 15 22 10 32 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3"/>
                      <path d="M24 3L33 3L33 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Bar 3: 2029(E) */}
                  <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[135px] w-26">
                    <span className="text-xl font-black text-indigo-700 mb-1.5">+78.9억</span>
                    <div className="w-24 bg-indigo-700 rounded-t-xl h-[125px] shadow-sm flex flex-col items-center justify-center text-white font-bold text-center text-xs border border-indigo-800">
                      <span>2029(E)</span>
                      <span className="text-[10px] text-indigo-100 font-normal">영업이익</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs text-indigo-900 font-black block whitespace-nowrap">매출 700억</span>
                      <span className="text-[11px] text-slate-600 font-semibold">(OPM 11.3%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Takeaways */}
              <div className="w-[45%] flex flex-col gap-4 justify-between">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-base text-slate-800 mb-2.5 border-b border-slate-200 pb-2 flex items-center">
                    <i className="fa-solid fa-shield-halved mr-2 text-slate-600"></i>
                    Clean Balance Sheet 달성
                  </h4>
                  <ul className="text-[13px] text-slate-700 space-y-2 font-medium leading-relaxed break-keep">
                    <li>• 과거 거래처 부실 채권을 일시에 전액 상각하여 리스크 제로화</li>
                    <li>• 향후 담보권 실행 및 회생 배당에 따른 추가 이익 환입 확보</li>
                    <li>• 1차 벤더 직거래 구조로 전환되어 부실 채권 발생 원천 차단</li>
                  </ul>
                </div>

                <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl shadow-sm flex-1 flex flex-col justify-start">
                  <h4 className="font-bold text-base text-blue-900 mb-2.5 border-b border-blue-200 pb-2 flex items-center">
                    <i className="fa-solid fa-rocket mr-2 text-blue-600"></i>
                    고수익 직납 체제 안착 로드맵
                  </h4>
                  <ul className="text-[13px] text-slate-800 space-y-2.5 leading-relaxed font-medium break-keep">
                    <li><b>1. 2026년 흑자 전환:</b> 매출 400억, 영업이익 39.5억(OPM 9.9%), 순이익 26.1억</li>
                    <li><b>2. 2027년 양산 본격화:</b> SDC 4개 모델 + LGD 메인 공급으로 매출 520억, 영업이익 55.3억(OPM 10.6%)</li>
                    <li><b>3. 2029년 퀀텀 점프:</b> 마스크 직납 50.6% 돌파 및 반도체 신사업 확장으로 매출 700억, 영업이익 78.9억 달성</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 8-1 : Segment Revenue (마스크 vs 소재 부문별 매출 로드맵) */}
        <div className={getSlideClass(7, 'bg-white')}>
          <div className="h-full flex flex-col p-14 relative z-10 min-w-0">
            <div className="flex justify-between items-start mb-3 border-b-4 border-blue-600 pb-3">
              <div>
                <h2 className="text-[2rem] font-black text-slate-800 inline-block">부문별 매출 실적 및 마스크 · 소재 성장 로드맵</h2>
              </div>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 mt-1">단위: 억원 (주식회사 템스코 기준)</span>
            </div>

            {/* Segment Breakdown Detailed Table (Strict table-fixed & 100% container width) */}
            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm mb-3 w-full min-w-0">
              <table className="w-full table-fixed text-center">
                <thead className="bg-slate-800 text-white font-bold">
                  <tr className="text-[11.5px]">
                    <th className="py-1.5 px-3 text-left pl-4 w-[28%] break-keep">사업 부문 및 손익 세부 항목</th>
                    <th className="py-1.5 px-1 w-[12%]">2024년<br /><span className="text-[9.5px] font-normal text-slate-300">(실적)</span></th>
                    <th className="py-1.5 px-1 w-[12%]">2025년<br /><span className="text-[9.5px] font-normal text-slate-300">(실적)</span></th>
                    <th className="py-1.5 px-1 w-[12%] text-blue-300 bg-slate-900/60 font-black">FY2026(E)<br /><span className="text-[9.5px] font-normal text-blue-200">턴어라운드</span></th>
                    <th className="py-1.5 px-1 w-[12%]">FY2027(E)<br /><span className="text-[9.5px] font-normal text-slate-300">양산 본격화</span></th>
                    <th className="py-1.5 px-1 w-[12%]">FY2028(E)<br /><span className="text-[9.5px] font-normal text-slate-300">스케일업</span></th>
                    <th className="py-1.5 px-1 w-[12%] font-black text-yellow-300">FY2029(E)<br /><span className="text-[9.5px] font-normal text-slate-300">퀀텀점프</span></th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-700 text-[11px]">
                  {/* Segment 1: Metal Mask */}
                  <tr className="bg-indigo-50/80 border-b border-indigo-100 font-bold text-indigo-950">
                    <td className="py-1.5 text-left pl-4 border-r border-slate-200 break-keep">
                      <i className="fa-solid fa-microchip text-indigo-600 text-xs mr-1.5"></i>
                      <span>1. 메탈마스크 사업 부문 매출</span>
                    </td>
                    <td className="break-keep">100.6</td>
                    <td className="break-keep">120.0</td>
                    <td className="text-indigo-700 font-black bg-indigo-100/50 ">160.0</td>
                    <td className="font-bold text-indigo-800 ">231.0</td>
                    <td className="font-bold ">277.5</td>
                    <td className="font-black text-indigo-900 bg-indigo-100/60 ">354.0</td>
                  </tr>
                  <tr className="border-b border-slate-100 text-slate-600">
                    <td className="py-1 text-left pl-8 border-r border-slate-200 break-keep">└ 마스크 부문 매출원가</td>
                    <td className="break-keep">86.5</td><td className="break-keep">103.2</td><td className="break-keep">128.0</td><td className="break-keep">184.8</td><td className="break-keep">222.0</td><td className="break-keep">283.2</td>
                  </tr>
                  <tr className="border-b-2 border-indigo-200 bg-indigo-50/40 text-indigo-950 font-bold">
                    <td className="py-1 text-left pl-8 border-r border-slate-200 text-indigo-900 break-keep">└ 마스크 매출총이익 (20.0%)</td>
                    <td className="break-keep">14.1 (14.0%)</td><td className="break-keep">16.8 (14.0%)</td>
                    <td className="text-indigo-700 font-bold ">32.0 (20.0%)</td>
                    <td className="font-bold ">46.2 (20.0%)</td>
                    <td className="font-bold ">55.5 (20.0%)</td>
                    <td className="font-bold ">70.8 (20.0%)</td>
                  </tr>

                  {/* Segment 2: Coating Material */}
                  <tr className="bg-blue-50/80 border-b border-blue-100 font-bold text-blue-950">
                    <td className="py-1.5 text-left pl-4 border-r border-slate-200 break-keep">
                      <i className="fa-solid fa-layer-group text-blue-600 text-xs mr-1.5"></i>
                      <span>2. 박막타겟 및 소재 사업 부문 매출</span>
                    </td>
                    <td className="break-keep">298.0</td><td className="break-keep">230.6</td>
                    <td className="text-blue-700 font-black bg-blue-100/50 ">240.0</td>
                    <td className="font-bold text-blue-800 ">289.0</td>
                    <td className="font-bold ">322.5</td>
                    <td className="font-black text-blue-900 bg-blue-100/60 ">346.0</td>
                  </tr>
                  <tr className="border-b border-slate-100 text-slate-600">
                    <td className="py-1 text-left pl-8 border-r border-slate-200 break-keep">└ 소재 부문 매출원가</td>
                    <td className="break-keep">271.7</td><td className="break-keep">209.5</td><td className="break-keep">204.0</td><td className="break-keep">246.8</td><td className="break-keep">276.0</td><td className="break-keep">297.8</td>
                  </tr>
                  <tr className="border-b-2 border-blue-200 bg-blue-50/40 text-blue-950 font-bold">
                    <td className="py-1 text-left pl-8 border-r border-slate-200 text-blue-900 break-keep">└ 소재 매출총이익 (13.9~15.0%)</td>
                    <td className="break-keep">26.3 (8.8%)</td><td className="break-keep">21.0 (9.1%)</td>
                    <td className="text-blue-700 font-bold ">36.0 (15.0%)</td>
                    <td className="font-bold ">42.2 (14.6%)</td>
                    <td className="font-bold ">46.5 (14.4%)</td>
                    <td className="font-bold ">48.2 (13.9%)</td>
                  </tr>

                  {/* Total Consolidation */}
                  <tr className="border-t-2 border-slate-600 bg-slate-800 text-white font-bold text-[11.5px]">
                    <td className="py-2 text-left pl-4 border-r border-slate-700 break-keep">
                      <i className="fa-solid fa-calculator text-yellow-300 text-xs mr-1.5"></i>
                      <span>전사 총 매출액 합계 (1 + 2)</span>
                    </td>
                    <td className="break-keep">398.6</td><td className="break-keep">350.6</td>
                    <td className="text-blue-300 font-black text-[12px] ">400.0</td>
                    <td className="break-keep">520.0</td><td className="break-keep">600.0</td>
                    <td className="text-yellow-300 font-black text-[12px] ">700.0</td>
                  </tr>
                  <tr className="border-b border-slate-700 bg-slate-700 text-slate-200 text-[10.5px] font-semibold">
                    <td className="py-1 text-left pl-8 border-r border-slate-600 break-keep">└ 전사 총 매출원가 합계</td>
                    <td className="break-keep">358.2</td><td className="break-keep">312.7</td><td className="break-keep">332.0</td><td className="break-keep">431.6</td><td className="break-keep">498.0</td><td className="break-keep">581.0</td>
                  </tr>
                  <tr className="bg-slate-900 text-emerald-300 font-black text-[11px]">
                    <td className="py-1.5 text-left pl-8 border-r border-slate-700 text-white break-keep">└ 전사 총 매출총이익 합계 (17.0%)</td>
                    <td className="break-keep">40.4 (10.1%)</td><td className="break-keep">37.8 (10.8%)</td>
                    <td className="text-emerald-300 font-black ">68.0 (17.0%)</td>
                    <td className="text-emerald-300 ">88.4 (17.0%)</td>
                    <td className="text-emerald-300 ">102.0 (17.0%)</td>
                    <td className="text-yellow-300 font-black ">119.0 (17.0%)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Growth Driver Highlight Cards */}
            <div className="grid grid-cols-2 gap-5 flex-1 min-h-0 min-w-0">
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 flex flex-col justify-center gap-3 shadow-sm min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-2.5 border-b border-indigo-200 pb-2">
                    <h4 className="font-black text-[15px] text-indigo-950 flex items-center gap-2">
                      <i className="fa-solid fa-rocket text-indigo-600"></i>
                      <span>메탈마스크 부문(템스코) 성장 동력</span>
                    </h4>
                    <span className="text-[11.5px] bg-indigo-600 text-white px-3 py-1 rounded-full font-black  shadow-xs">
                      26E 160억 ➔ 29E 354억
                    </span>
                  </div>
                  <ul className="text-[13px] text-slate-800 space-y-2 leading-snug font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold select-none flex-shrink-0">•</span>
                      <span><b>삼성디스플레이(SDC):</b> 2027년 양산 메탈마스크 <b>신규 4개 모델 선정 완료</b> (추가 2개 모델 협의 중)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold select-none flex-shrink-0">•</span>
                      <span><b>LG디스플레이(LGD):</b> 1차 벤더 <b>최우선협상 메인 공급사 공식 선정</b> (신규 개발모델 우선 공급)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold select-none flex-shrink-0">•</span>
                      <span><b>중국 Visionox:</b> 1차 승인으로 <b>전체 마스크 물량의 30% 배정 확정</b> (26년 4분기 출하)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/95 p-2.5 px-3.5 rounded-xl border border-indigo-100 text-[12px] text-indigo-950 font-bold text-left shadow-sm flex items-start gap-1.5">
                  <span className="select-none flex-shrink-0">💡</span>
                  <span><b>메탈마스크 매출 비중:</b> 2025년 34.2% ➔ 2026년 40.0% ➔ 2029년 50.6%로 전사 핵심 캐시카우 도약</span>
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 flex flex-col justify-center gap-3 shadow-sm min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-2.5 border-b border-blue-200 pb-2">
                    <h4 className="font-black text-[15px] text-blue-950 flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved text-blue-600"></i>
                      <span>박막타겟 &amp; 소재 부문(템스코) 성장 동력</span>
                    </h4>
                    <span className="text-[11.5px] bg-blue-600 text-white px-3 py-1 rounded-full font-black  shadow-xs">
                      26E 240억 ➔ 29E 346억
                    </span>
                  </div>
                  <ul className="text-[13px] text-slate-800 space-y-2 leading-snug font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold select-none flex-shrink-0">•</span>
                      <span><b>디스플레이 타겟 직납:</b> 고순도 알루미늄(Al), 몰리브덴(Mo), 은(Ag) 합금 타겟 직납 확정</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold select-none flex-shrink-0">•</span>
                      <span><b>비철소재 및 특수강:</b> 고진공 챔버 및 정밀부품용 Ni특수강/SUS420 안정적 상품 유통망 확대</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold select-none flex-shrink-0">•</span>
                      <span><b>반도체 신사업 확장:</b> 반도체 HF가스 봄베, 고순도 CuMn 타겟, 전력반도체 구리기판 시제품 평가</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/95 p-2.5 px-3.5 rounded-xl border border-blue-100 text-[12px] text-blue-950 font-bold text-left shadow-sm break-keep flex items-start gap-1.5">
                  <span className="select-none flex-shrink-0">💡</span>
                  <span><b>소재·부품 수직계열화 시너지:</b> 마스크 부문 20.0% 고마진 실현 및 소재 부문 연 300억대 안정적 체력 확보</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 8-2 : Income Statement (종합 추정손익계산서 및 수익성 분석) */}
        <div className={getSlideClass(8, 'bg-white')}>
          <div className="h-full flex flex-col p-14 relative z-10 min-w-0">
            <div className="flex justify-between items-start mb-3 border-b-4 border-blue-600 pb-3">
              <div>
                <h2 className="text-[2rem] font-black text-slate-800 inline-block">종합 추정손익계산서 및 수익성 구조 분석</h2>
              </div>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 mt-1">단위: 억원 (감사보고서 및 확정 경영계획 기준)</span>
            </div>

            {/* Comprehensive Income Statement Table (Strict table-fixed & 100% width) */}
            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm mb-3 w-full min-w-0">
              <table className="w-full table-fixed text-center">
                <thead className="bg-slate-800 text-white font-bold">
                  <tr className="text-[11.5px]">
                    <th className="py-1.5 px-3 text-left pl-4 w-[28%] break-keep">구분 (손익 항목)</th>
                    <th className="py-1.5 px-1 w-[12%]">2024년<br /><span className="text-[9.5px] font-normal text-slate-300">(실적)</span></th>
                    <th className="py-1.5 px-1 w-[12%]">2025년<br /><span className="text-[9.5px] font-normal text-slate-300">(상각반영)</span></th>
                    <th className="py-1.5 px-1 w-[12%] text-blue-300 bg-slate-900/60 font-black">FY2026(E)<br /><span className="text-[9.5px] font-normal text-blue-200">턴어라운드</span></th>
                    <th className="py-1.5 px-1 w-[12%]">FY2027(E)<br /><span className="text-[9.5px] font-normal text-slate-300">양산 본격화</span></th>
                    <th className="py-1.5 px-1 w-[12%]">FY2028(E)<br /><span className="text-[9.5px] font-normal text-slate-300">스케일업</span></th>
                    <th className="py-1.5 px-1 w-[12%] font-black text-yellow-300">FY2029(E)<br /><span className="text-[9.5px] font-normal text-slate-300">퀀텀점프</span></th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-700 text-[11px]">
                  <tr className="border-b border-slate-200 bg-blue-50/70 font-bold text-blue-900">
                    <td className="py-1.5 text-left pl-4 border-r border-slate-200 break-keep">Ⅰ. 매출액 (Total Revenue)</td>
                    <td className="break-keep">398.6</td><td className="break-keep">350.6</td>
                    <td className="text-blue-700 font-black text-[12px] ">400.0</td>
                    <td className="font-bold ">520.0</td><td className="font-bold ">600.0</td>
                    <td className="text-blue-900 font-black text-[12.5px] ">700.0</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-bold text-left pl-4 border-r border-slate-200 break-keep">Ⅱ. 매출원가 합계</td>
                    <td className="break-keep">358.2</td><td className="break-keep">312.7</td><td className="break-keep">332.0</td><td className="break-keep">431.6</td><td className="break-keep">498.0</td><td className="break-keep">581.0</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-emerald-50/60 font-bold text-emerald-950">
                    <td className="py-1.5 text-left pl-4 border-r border-slate-200 break-keep">Ⅲ. 매출총이익 (17.0%)</td>
                    <td className="break-keep">40.4 (10.1%)</td><td className="break-keep">37.8 (10.8%)</td>
                    <td className="text-emerald-700 font-black ">68.0 (17.0%)</td>
                    <td className="font-bold ">88.4 (17.0%)</td>
                    <td className="font-bold ">102.0 (17.0%)</td>
                    <td className="text-emerald-900 font-black ">119.0 (17.0%)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-bold text-left pl-4 border-r border-slate-200 break-keep">Ⅳ. 판매비와관리비 합계</td>
                    <td className="break-keep">19.8</td><td className="text-red-600 font-bold ">89.7 (상각포함)</td><td className="break-keep">28.5</td><td className="break-keep">33.1</td><td className="break-keep">36.6</td><td className="break-keep">40.1</td>
                  </tr>
                  <tr className="border-b-2 border-slate-300 bg-blue-100/60 font-bold text-blue-950">
                    <td className="py-1.5 text-left pl-4 border-r border-slate-200 text-blue-900 text-[11.5px] break-keep">Ⅴ. 영업이익 (Operating Profit)</td>
                    <td className="text-slate-800 ">20.6</td>
                    <td className="text-red-500 font-bold ">-51.9</td>
                    <td className="text-blue-700 font-black bg-blue-200/50 text-[12.5px] ">39.5</td>
                    <td className="font-black text-blue-800 ">55.3</td>
                    <td className="font-black ">65.4</td>
                    <td className="font-black text-blue-950 bg-blue-200/60 text-[13px] ">78.9</td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
                    <td className="py-1 text-left pl-4 border-r border-slate-200 break-keep">   영업이익률 (OPM)</td>
                    <td className="break-keep">5.2%</td><td className="text-red-500 ">-14.8%</td>
                    <td className="text-blue-700 font-black ">9.9%</td>
                    <td className="font-bold text-blue-800 ">10.6%</td>
                    <td className="font-bold ">10.9%</td>
                    <td className="font-black text-blue-900 ">11.3%</td>
                  </tr>
                  <tr className="border-b border-slate-100 text-slate-600">
                    <td className="py-1 font-bold text-left pl-4 border-r border-slate-200 break-keep">Ⅵ. 영업외손익(순) 및 금융비용</td>
                    <td className="break-keep">0.5</td><td className="break-keep">-31.0</td><td className="break-keep">-6.0</td><td className="break-keep">-6.0</td><td className="break-keep">-6.0</td><td className="break-keep">-6.0</td>
                  </tr>
                  <tr className="border-b border-slate-100 text-slate-600">
                    <td className="py-1 font-bold text-left pl-4 border-r border-slate-200 break-keep">Ⅶ. 법인세비용</td>
                    <td className="break-keep">5.0</td><td className="break-keep">0.8</td><td className="break-keep">7.4</td><td className="break-keep">10.8</td><td className="break-keep">13.1</td><td className="break-keep">16.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50 font-bold bg-indigo-50/80 text-indigo-950 border-t border-indigo-200">
                    <td className="py-1.5 text-left pl-4 border-r border-slate-200 text-indigo-900 text-[11.5px] break-keep">Ⅷ. 당기순이익 (Net Income)</td>
                    <td className="break-keep">16.1</td><td className="text-red-500 font-bold ">-83.7</td>
                    <td className="text-indigo-700 font-black text-[12px] ">26.1</td>
                    <td className="font-bold text-indigo-800 ">38.4</td>
                    <td className="font-bold ">46.3</td>
                    <td className="text-indigo-900 font-black text-[12.5px] ">56.8</td>
                  </tr>
                  <tr className="bg-indigo-50/30 text-indigo-800 text-[10.5px] font-bold">
                    <td className="py-0.5 text-left pl-4 border-r border-slate-200 break-keep">   당기순이익률 (NPM)</td>
                    <td className="break-keep">4.0%</td><td className="text-red-500 ">-23.9%</td>
                    <td className="text-indigo-700 font-bold ">6.5%</td>
                    <td className="font-bold ">7.4%</td>
                    <td className="font-bold ">7.7%</td>
                    <td className="text-indigo-900 font-black ">8.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Highlights 3-Cards */}
            <div className="grid grid-cols-3 gap-5 flex-1 min-h-0 min-w-0">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col justify-center gap-2.5 shadow-sm min-w-0">
                <div className="min-w-0">
                  <h4 className="font-black text-[14px] text-blue-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-chart-line text-blue-600"></i>본업 실질 흑자 턴어라운드
                  </h4>
                  <p className="text-[12.5px] text-slate-700 leading-relaxed font-medium">
                    2025년 대손상각(63.7억) 일회성 악재가 종결되어, <b>2026년 영업이익 39.5억(OPM 9.9%), 순이익 26.1억</b>으로 즉각 흑자 전환을 달성합니다.
                  </p>
                </div>
                <div className="text-[12px] font-bold text-blue-800 bg-white p-2 rounded-lg border border-blue-100 text-center shadow-sm mt-0.5">
                  2026(E) OP 39.5억 (흑자 전환)
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col justify-center gap-2.5 shadow-sm min-w-0">
                <div className="min-w-0">
                  <h4 className="font-black text-[14px] text-emerald-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-hand-holding-dollar text-emerald-600"></i>원가 구조 혁신 (마진율 17%)
                  </h4>
                  <p className="text-[12.5px] text-slate-700 leading-relaxed font-medium">
                    &apos;원소재-정밀가공-코팅-세정&apos; 원스톱 내재화로 외주 마진을 제거하여 <b>매출총이익률 17.0%(119억)</b>의 안정적 원가 경쟁력을 확립했습니다.
                  </p>
                </div>
                <div className="text-[12px] font-bold text-emerald-800 bg-white p-2 rounded-lg border border-emerald-100 text-center shadow-sm mt-0.5">
                  매출총이익률: 10.8% ➔ 17.0% 구조적 개선
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col justify-center gap-2.5 shadow-sm min-w-0">
                <div className="min-w-0">
                  <h4 className="font-black text-[14px] text-indigo-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-crown text-indigo-600"></i>Tier-1 직납 영업레버리지
                  </h4>
                  <p className="text-[12.5px] text-slate-700 leading-relaxed font-medium">
                    중간 유통 단계 축소 및 글로벌 1차 직납 공급 확대로 <b>2029년 매출 700억 원, 영업이익률 11.3%(78.9억)</b>의 고수익 체질을 완성합니다.
                  </p>
                </div>
                <div className="text-[12px] font-bold text-indigo-800 bg-white p-2 rounded-lg border border-indigo-100 text-center shadow-sm mt-0.5">
                  2029(E) OP 78.9억 (OPM 11.3%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 9 : Valuation & Post-Investment */}
        <div className={getSlideClass(9, 'bg-slate-50')}>
          <div className="h-full flex flex-col p-14">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Valuation &amp; Post-Investment : 투자 유치에 따른 재무구조 혁신</h2>
            <div className="flex gap-8 flex-1 min-h-0 items-stretch">
              <div className="w-1/3 bg-white border border-slate-300 shadow-sm rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded text-sm font-bold w-max mb-4 inline-block">Pre-Money Valuation Logic</span>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">내재 가치 평가</h3>
                  <p className="text-[14px] text-slate-700 mb-4 leading-relaxed break-keep font-medium">
                    일회성 상각 요인이 완전 소멸된 템스코의 2026년 예상 영업이익은 <b>39.5억 원(OPM 9.9%)</b>입니다. 삼성·LG 및 글로벌 패널 1차 벤더 직납 확정에 따른 상장사 수준의 멀티플 적용 시 탁월한 밸류에이션 매력을 보유하고 있습니다.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg shadow-inner">
                  <p className="text-xs text-blue-800 font-bold mb-1.5 border-b border-blue-200 pb-1">2026년 예상 실적 기반 지표</p>
                  <p className="text-xl font-black text-slate-800">Target Rev: 400억 원</p>
                  <p className="text-xl font-black text-blue-700 mt-1">Target OP: 39.5억 원 (9.9%)</p>
                </div>
              </div>
              <div className="w-2/3 bg-white text-slate-800 border border-slate-300 shadow-sm rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded text-sm font-bold w-max mb-3 inline-block">Post-Investment Impact (50억 자금 조달 가정 시)</span>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">재무구조 완전 정상화 시뮬레이션</h3>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-6 rounded-lg border border-slate-200 flex-1">
                  <div className="flex flex-col items-center w-[40%]">
                    <h4 className="font-bold text-slate-600 mb-3 bg-white px-3 py-1 border border-slate-200 rounded text-xs whitespace-nowrap">2025년 결산 (상각 반영)</h4>
                    <div className="w-full max-w-[190px] border border-slate-400 rounded overflow-hidden shadow-sm">
                      <div className="bg-red-500 text-white text-center py-3.5 font-bold text-base border-b border-white">부채 328억</div>
                      <div className="bg-slate-300 text-slate-800 text-center py-2 font-bold text-xs">자본 21억</div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs text-slate-600 font-bold">장부상 부채비율</p>
                      <p className="text-3xl font-black text-red-600">1,557%</p>
                    </div>
                  </div>
                  <div className="text-4xl text-blue-400"><i className="fa-solid fa-arrow-right-long"></i></div>
                  <div className="flex flex-col items-center w-[40%]">
                    <h4 className="font-bold text-blue-700 mb-3 bg-blue-50 px-3 py-1 border border-blue-200 rounded text-xs whitespace-nowrap">투자 유치 후 (50억 자본 전입)</h4>
                    <div className="w-full max-w-[190px] border border-blue-400 rounded overflow-hidden shadow-md transform scale-105">
                      <div className="bg-red-400 text-white text-center py-3 font-bold text-sm border-b border-white">부채 328억 (유지)</div>
                      <div className="bg-blue-600 text-white text-center py-3.5 font-bold text-base">자본 71억 (+50억)</div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs text-blue-700 font-bold">자본 확충시 부채비율</p>
                      <p className="text-3xl font-black text-blue-700">461% <i className="fa-solid fa-arrow-trend-down text-lg"></i></p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">26년 순이익 가산시 300%대 진입</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 10 : The Ask & Use of Proceeds */}
        <div className={getSlideClass(10, 'bg-white')}>
          <div className="h-full flex flex-col p-10 pt-8 pb-7">
            <h2 className="text-[1.95rem] font-black text-slate-800 border-b-4 border-blue-600 pb-2 mb-4 inline-block w-max">The Ask &amp; Use of Proceeds : 성장 재원 확보</h2>
            <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
              {/* Left: Funding Structure */}
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="bg-blue-600 text-white inline-block px-3.5 py-1 rounded-md font-bold text-xs mb-2.5 shadow-xs">Target Funding</div>
                  <h3 className="text-[38px] font-black text-blue-900 leading-tight mb-3">30억 ~ 50억 원</h3>
                  <p className="text-slate-700 font-medium border-b border-slate-300 pb-4 text-[14.5px] leading-relaxed break-keep">
                    당사는 재무구조 개선과 26~27년 폭발적 수주 대응을 위해 자금을 조달하며, 투자 기관의 펀드 성격에 맞춘 <b>유연한 투자 구조(Tailor-made)</b> 설계가 가능합니다.
                  </p>
                </div>
                <div className="space-y-3.5">
                  <div className="flex items-start p-4 bg-white rounded-xl border border-blue-200 shadow-xs">
                    <div className="w-11 h-11 bg-blue-100 text-blue-700 border border-blue-300 rounded-full flex items-center justify-center text-lg mr-4 flex-shrink-0 mt-0.5"><i className="fa-solid fa-chart-pie"></i></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15.5px] mb-1">자본 확충형 (Equity) 제안</h4>
                      <p className="text-[13px] text-slate-600 leading-relaxed break-keep">RCPS(상환전환우선주), CPS, 보통주 등 자본으로 전입되어 즉각적인 부채비율 감소 및 밸류에이션 업사이드(Upside)를 공유하는 구조.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-white rounded-xl border border-emerald-200 shadow-xs">
                    <div className="w-11 h-11 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center text-lg mr-4 flex-shrink-0 mt-0.5"><i className="fa-solid fa-money-bill-transfer"></i></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15.5px] mb-1">메자닌 / 부채형 (Debt) 제안</h4>
                      <p className="text-[13px] text-slate-600 leading-relaxed break-keep">CB(전환사채), BW(신주인수권부사채) 등 원금 보장의 안정성을 확보하면서 향후 1차 벤더 양산 실적에 따라 주식 전환 차익을 노리는 구조.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Use of Proceeds */}
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-slate-300 pb-2">
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center"><i className="fa-solid fa-bullseye text-blue-700 mr-2"></i>자금 활용 계획 (Use of Proceeds)</h3>
                  <span className="text-xs text-slate-500 font-bold">조달 금액 기준</span>
                </div>
                
                <div className="flex justify-center my-2">
                  {/* Robust SVG Donut Chart */}
                  <div className="relative w-36 h-36 flex items-center justify-center filter drop-shadow-sm">
                    <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                      {/* Segment 1: 설비 투자 40% (약 20억) - #1e3a8a */}
                      <circle
                        cx="80"
                        cy="80"
                        r="58"
                        fill="transparent"
                        stroke="#1e3a8a"
                        strokeWidth="26"
                        strokeDasharray="145.77 218.66"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: 운영 자금 40% (약 20억) - #3b82f6 */}
                      <circle
                        cx="80"
                        cy="80"
                        r="58"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="26"
                        strokeDasharray="145.77 218.66"
                        strokeDashoffset="-145.77"
                      />
                      {/* Segment 3: R&D 및 신사업 20% (약 10억) - #9ca3af */}
                      <circle
                        cx="80"
                        cy="80"
                        r="58"
                        fill="transparent"
                        stroke="#9ca3af"
                        strokeWidth="26"
                        strokeDasharray="72.88 291.55"
                        strokeDashoffset="-291.55"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] font-black text-slate-400 leading-none">TOTAL</span>
                      <span className="text-[15px] font-black text-slate-800 leading-tight">50억</span>
                    </div>
                  </div>
                </div>
                
                {/* Legend & Text */}
                <div className="flex flex-col space-y-2.5 w-full">
                  <div className="flex items-start bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div className="w-3.5 h-3.5 bg-[#1e3a8a] rounded-sm mt-0.5 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-black text-slate-900 text-[13.5px]">설비 투자 (CAPEX) <span className="text-blue-800 ml-2 font-black">40% (약 20억)</span></p>
                      <p className="text-[12px] text-slate-600 mt-0.5 font-medium leading-snug break-keep">1차 벤더 양산 물량 대응을 위한 메탈마스크 정밀 가공 설비 고도화 및 라인 증설.</p>
                    </div>
                  </div>
                  <div className="flex items-start bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div className="w-3.5 h-3.5 bg-[#3b82f6] rounded-sm mt-0.5 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-black text-slate-900 text-[13.5px]">운영 자금 (Working Capital) <span className="text-blue-600 ml-2 font-black">40% (약 20억)</span></p>
                      <p className="text-[12px] text-slate-600 mt-0.5 font-medium leading-snug break-keep">26년 삼성/LG디스플레이 및 비전옥스 신모델 수주 물량 급증에 따른 선제적 원소재 매입 대금.</p>
                    </div>
                  </div>
                  <div className="flex items-start bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div className="w-3.5 h-3.5 bg-[#9ca3af] rounded-sm mt-0.5 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-black text-slate-900 text-[13.5px]">연구 개발 (R&amp;D 및 신사업) <span className="text-slate-600 ml-2 font-black">20% (약 10억)</span></p>
                      <p className="text-[12px] text-slate-600 mt-0.5 font-medium leading-snug break-keep">디스플레이를 넘어 반도체(HF가스 봄베, CuMn 타겟) 및 전력반도체 구리기판 양산 테스트 비용.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
