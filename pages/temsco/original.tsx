import Head from 'next/head'
import Link from 'next/link'

export default function TemscoOriginalPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-900 print:bg-white print:min-h-0 print:block flex flex-col font-sans text-slate-800">
      <Head>
        <title>주식회사 템스코 (TEMSCO) - IR 투자제안서 (Original)</title>
        <meta name="description" content="주식회사 템스코(TEMSCO) IR 자료 슬라이드 (Original 버전)" />
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
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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

          .conic-donut { 
            background: conic-gradient(#1e3a8a 0% 40%, #3b82f6 40% 80%, #9ca3af 80% 100%); 
            border-radius: 50%; 
            position: relative;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .conic-donut::after {
            content: ""; 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            width: 55%; 
            height: 55%; 
            background-color: white; 
            border-radius: 50%;
          }

          @media print {
            @page {
              size: 297mm 210mm;
              margin: 0mm !important;
            }
            html, body { 
              background-color: #ffffff !important; 
              background: #ffffff !important;
              padding: 0 !important; 
              margin: 0 !important; 
              width: 297mm !important;
              height: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { 
              display: none !important; 
            }
            /* Hide any external browser extension elements injected into body */
            body > *:not(#__next),
            body > #__next > div > header,
            body > #__next > div > div.no-print,
            [class*="feed"], [class*="rss"], [id*="feed"], [id*="rss"],
            [class*="extension"], [id*="extension"],
            [data-extension-id] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
            .temsco-slide-container {
              padding: 0 !important;
              gap: 0 !important;
              margin: 0 !important;
              background-color: #ffffff !important;
              background: #ffffff !important;
              display: block !important;
              height: auto !important;
            }
            .temsco-slide { 
              width: 297mm !important; 
              height: 209.5mm !important; 
              min-height: 209.5mm !important;
              max-height: 209.5mm !important;
              box-shadow: none !important; 
              border: none !important;
              border-radius: 0 !important;
              margin: 0 !important; 
              page-break-before: always !important;
              page-break-after: always !important; 
              break-before: page !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              overflow: hidden !important;
              position: relative !important;
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .temsco-slide:first-of-type {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            .temsco-slide:last-of-type,
            .temsco-slide:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
          }
        `}</style>
      </Head>

      <header className="no-print bg-slate-800/95 backdrop-blur border-b border-slate-700 text-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <span>←</span> 포트폴리오 홈
          </Link>
          <div className="h-4 w-px bg-slate-600" />
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-xs px-2.5 py-0.5 rounded font-black tracking-wider uppercase">Original Deck</span>
            <h1 className="text-sm md:text-base font-bold text-white">
              주식회사 템스코 (TEMSCO) 투자제안서 <span className="text-amber-400 text-xs font-normal">[초기 원본]</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Version Switcher Chips */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
            <Link
              href="/temsco"
              className="text-xs font-medium px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Latest (수정본)
            </Link>
            <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-amber-600 text-white shadow-sm">
              Original (초기본)
            </span>
          </div>

          <a
            href="/temsco/original.html"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition border border-slate-600"
          >
            HTML 원문
          </a>

          <button
            onClick={handlePrint}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-file-pdf"></i>
            PDF로 인쇄 / 저장
          </button>
        </div>
      </header>

      {/* Print Guide Notification */}
      <div className="no-print flex justify-center pt-6 px-4">
        <div 
          className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex justify-between items-center shadow-lg text-white"
          style={{ width: 'var(--slide-width)', maxWidth: '100%' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg flex-shrink-0">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">수정 전 초기 원본(Original) 프레젠테이션 뷰</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                최신 수정본을 확인하시려면 상단 메뉴바의 <b>[Latest (수정본)]</b> 네임칩을 클릭하세요.
              </p>
            </div>
          </div>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg font-bold transition flex items-center gap-2 flex-shrink-0 shadow cursor-pointer"
          >
            <i className="fa-solid fa-print"></i>지금 PDF 저장
          </button>
        </div>
      </div>

      {/* Slides Container */}
      <main 
        className="temsco-slide-container flex-1 py-8 flex flex-col items-center gap-10"
        style={{ counterReset: 'slide-page' }}
      >
        {/* Slide 1 */}
        <div className="temsco-slide bg-white">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/95 to-slate-100/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-bl-full opacity-50 -z-0"></div>
          <div className="relative z-10 flex flex-col items-start justify-start h-full px-24 pt-32">
            <div className="border-l-4 border-blue-600 pl-6 mb-8">
              <h2 className="text-2xl text-blue-700 font-bold tracking-widest uppercase">TEMSCO Investment Proposal</h2>
              <p className="text-slate-500 mt-2 font-medium">CONFIDENTIAL - For Investors Only</p>
            </div>
            <h1 className="text-[3.5rem] font-black leading-tight mb-8 text-slate-900">
              일시적 재무 착시를 넘어,<br />
              <span className="text-blue-700">반도체 및 디스플레이 산업의 글로벌 TIER-1 소부장 파트너</span>로의 폭발적 도약
            </h1>
            <p className="text-xl text-slate-700 mb-12 font-medium leading-relaxed max-w-3xl bg-white/60 p-4 rounded-lg border border-slate-200">
              2차 벤더의 구조적 한계를 탈피하고, 박막코팅소재와 정밀 부품(메탈마스크)의 일괄 공급망을 완성했습니다. ㈜템스코는 압도적인 기술 시너지를 바탕으로 삼성·LG 및 글로벌 패널 메이커의 1차 핵심 파트너로 진화하고 있습니다.
            </p>
            <div className="mt-auto pb-12 w-full flex justify-between items-end border-t border-slate-300 pt-6">
              <div>
                <p className="text-2xl font-bold tracking-wide text-slate-800">주식회사 템스코 (TEMSCO, Ltd.)</p>
                <p className="text-sm text-slate-500 mt-1">CEO 오정석 | 설립일: 2010. 10. 22</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-slate-600 font-bold">2026. 07.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="temsco-slide bg-white">
          <div className="h-full flex flex-col p-12">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Executive Summary : 비즈니스 하이라이트</h2>
            <div className="grid grid-cols-2 gap-5 h-full pb-2">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-blue-600 text-[1.75rem] mb-3"><i className="fa-solid fa-shield-halved"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">The Crisis &amp; Overcome</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  <b>과감한 상각 처리를 통한 리스크 완전 소멸</b><br />
                  2025년 주요 거래처인 파인원의 흑자부도로 약 75억 원의 미회수 채권이 발생했습니다. 템스코는 이를 이연시키지 않고 <b>68.2억 원을 대손상각(비용)으로 일시 반영</b>하는 정면 돌파를 택했습니다. 이로 인해 장부상 부채비율은 급증했으나, 회사의 잠재적 불확실성과 회계적 리스크는 선제적으로 완전 소멸되었습니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-indigo-600 text-[1.75rem] mb-3"><i className="fa-solid fa-object-group"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">The Game Changer</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  <b>M&amp;A를 통한 소부장 수직 계열화 완성</b><br />
                  2024년 3월, 진공증착설비에 사용되는 핵심정밀부품인 메탈마스크 전문기업 <b>위폼스㈜ 경영권(지분 75%)을 전격 인수</b>했습니다. 단순 박막 코팅소재 공급을 넘어 &apos;소재+부품&apos; 일괄 솔루션을 제공하는 밸류체인을 구축함으로써, 글로벌 고객사들이 요구하는 Tier-1 자격을 획득하는 결정적 전환점을 마련했습니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-emerald-600 text-[1.75rem] mb-3"><i className="fa-solid fa-handshake-angle"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">The Traction</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  <b>글로벌 1차 벤더 직납 확정 및 폭발적 수주</b><br />
                  중간 벤더(파인원)의 부재를 기회로 삼아 <b>삼성/LG디스플레이 1차 벤더로 직납 지위를 확보</b>했습니다. 삼성 디스플레이 27년 양산 신모델 4개 선정을 완료하였고, LG 디스플레이 최우선협상 메인업체로 선정되었습니다. 또한 중국 비전옥스와 양산 대체 물량 30% 배정을 확정 지었습니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-start relative shadow-sm hover:shadow-md transition">
                <div className="text-slate-700 text-[1.75rem] mb-3"><i className="fa-solid fa-chart-line"></i></div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">The Vision</h3>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  <b>2026년 매출 400억 달성 및 반도체 스케일업</b><br />
                  일회성 상각 비용을 제외한 템스코의 2025년 본업 실질 영업이익은 11.8억 원(흑자)으로 펀더멘털을 유지하고 있습니다. 확정된 디스플레이 수주 물량을 통해 <b>26년 매출 400억 원 달성을 가시화</b>하고, 향후 반도체용 HF가스용 봄베, 고순도CuMn 스퍼터링타겟, 전력반도체모듈 전용 구리기판 등의 시장에도 진입할 것입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="temsco-slide bg-slate-50">
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2.2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-2 mb-8 inline-block w-max">Company Overview &amp; Milestones</h2>
            <div className="flex flex-1 gap-10 items-stretch">
              <div className="w-[45%] flex flex-col gap-5">
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-8 border-l-[10px] border-l-blue-600 shadow-sm relative h-[45%]">
                  <p className="text-blue-600 font-bold text-sm tracking-widest mb-2 uppercase">Our Mission</p>
                  <h3 className="text-[1.6rem] font-black text-slate-900 leading-tight mb-4 tracking-tight">&quot;우리는 사업을 창출하고<br />연결하여 완성한다&quot;</h3>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                    템스코는 단순한 부품 납품업체가 아닙니다. 국내외 유수한 소재 메이커와의 협업 R&amp;D를 통해 디스플레이와 반도체 공정에 필수적인 핵심 소재를 발굴하고, 이를 장비 부품과 결합하여 고객사에게 최적화된 통합 솔루션을 &apos;연결&apos;하고 &apos;완성&apos;합니다.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm h-[55%]">
                  <h4 className="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                    <i className="fa-solid fa-layer-group text-blue-600 mr-2"></i>핵심 사업 영역
                  </h4>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-4">
                      <span className="bg-blue-100 text-blue-700 font-black text-xs px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">박막코팅재료</span>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] mb-0.5">박막코팅소재 (Array Layer)</p>
                        <p className="text-[13px] text-slate-500 leading-snug">반도체 및 디스플레이 미세 선폭 배선막용 핵심 소재. 알루미늄, 몰리브덴 타겟 등.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="bg-indigo-100 text-indigo-700 font-black text-xs px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">부품</span>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] mb-0.5">정밀 메탈마스크 (위폼스)</p>
                        <p className="text-[13px] text-slate-500 leading-snug">OLED 진공증착설비에 사용되는 메탈마스크. 고객사 수율을 좌우하는 핵심부품.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="bg-slate-200 text-slate-700 font-black text-xs px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">소재</span>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] mb-0.5">특수강 및 비철소재</p>
                        <p className="text-[13px] text-slate-500 leading-snug">진공 부품용 Ni특수강, SUS420 등 고신뢰성 기초 소재 벤더 네트워크.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[55%] flex flex-col justify-end pt-4 pb-2">
                <div className="relative bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-center w-[90%] mx-auto mb-10">
                  <h3 className="font-black text-[1.1rem] text-slate-800">2차 벤더에서 글로벌 Tier-1으로의 진화 로드맵</h3>
                  <div className="absolute -top-4 -right-10 text-blue-600 font-black text-[1.1rem] bg-slate-50 px-2 tracking-wide">Tier-1 Leap!</div>
                </div>
                <div className="flex-1 flex flex-col justify-end relative h-[320px]">
                  <div className="flex items-end h-[280px] gap-3 px-2">
                    <div className="w-1/4 h-[35%] bg-[#f1f5f9] border border-slate-200 rounded-t-lg flex flex-col items-center justify-center px-1 py-3 text-center shadow-sm">
                      <p className="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-nowrap tracking-tight">창업 및 안정적 성장<br /><span className="font-medium text-[10px] mt-1.5 block">(2차 벤더 기반)</span></p>
                    </div>
                    <div className="w-1/4 h-[55%] bg-[#eff6ff] border border-blue-200 rounded-t-lg flex flex-col items-center justify-center px-1 py-3 text-center relative shadow-sm">
                      <div className="absolute -top-8 bg-[#e0e7ff] text-[#3730a3] text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">M&amp;A 모멘텀</div>
                      <i className="fa-solid fa-building-circle-check text-blue-500 text-2xl mb-2"></i>
                      <p className="text-[11px] font-bold text-blue-900 leading-relaxed whitespace-nowrap tracking-tight">위폼스㈜ 경영권 인수<br /><span className="font-medium text-[10px] text-blue-700 mt-1.5 block">(메탈마스크 역량 확보)</span></p>
                    </div>
                    <div className="w-1/4 h-[80%] bg-[#3b4758] rounded-t-lg flex flex-col items-center justify-start pt-6 px-1 py-3 text-center relative shadow-md">
                      <div className="absolute -top-8 bg-[#fee2e2] border border-red-200 text-[#b91c1c] text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">리스크 선제 해소</div>
                      <i className="fa-solid fa-broom text-red-400 text-[1.4rem] mb-3"></i>
                      <p className="text-[11px] font-bold text-white leading-relaxed tracking-tight">파인원 75억 미회수 건<br />선제적 결산 상각 반영<br /><span className="font-medium text-[10px] text-slate-300 mt-2 block leading-relaxed">(부실 자산 완전 제각)</span></p>
                    </div>
                    <div className="w-1/4 h-[100%] bg-[#2563eb] rounded-t-lg flex flex-col items-center justify-start pt-6 px-1 py-3 text-center relative shadow-md">
                      <i className="fa-solid fa-earth-asia text-white text-3xl mb-3"></i>
                      <p className="text-[12px] font-bold text-white leading-relaxed mb-4 whitespace-nowrap tracking-tight">글로벌 1차 벤더<br />양산 개시</p>
                      <div className="bg-white w-[95%] rounded p-1 shadow-sm">
                        <p className="text-[10px] font-bold text-blue-800 leading-tight whitespace-nowrap tracking-tight">삼성, LG, AMAT,<br />Visionox, CSOT</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-4 border-t border-slate-300 pt-2">
                    <div className="w-1/4 text-center text-[13px] font-bold text-slate-600">2010 ~ 2023</div>
                    <div className="w-1/4 text-center text-[13px] font-bold text-blue-600">24. 03</div>
                    <div className="w-1/4 text-center text-[13px] font-bold text-slate-800">25. 12</div>
                    <div className="w-1/4 text-center text-[13px] font-black text-blue-800">26. 01 ~</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 4 */}
        <div className="temsco-slide bg-white">
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-10 inline-block w-max">Core Competency : 2차 벤더의 한계를 넘어선 &apos;소재-부품 통합 시너지&apos;</h2>
            <div className="flex-1 flex flex-col justify-between pb-6">
              <div className="flex items-center justify-center gap-8 h-full">
                <div className="w-[30%] bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
                  <span className="bg-slate-200 text-slate-600 font-bold px-3 py-1 rounded text-sm mb-4 inline-block">과거 (Before)</span>
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-slate-400 border border-slate-200 shadow-sm"><i className="fa-solid fa-link-slash"></i></div>
                  <h4 className="font-bold text-xl text-slate-700 mb-2">단일 품목 2차 벤더</h4>
                  <p className="text-[15px] text-slate-500 font-medium">중간 벤더 의존으로 인한 납기 지연 및 원가 마진의 구조적 한계 노출</p>
                </div>
                <div className="text-4xl text-blue-300"><i className="fa-solid fa-angles-right"></i></div>
                <div className="w-[60%] flex gap-6 bg-blue-50 border border-blue-200 p-10 rounded-2xl shadow-md relative">
                  <div className="absolute -top-5 right-10 bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow-lg text-lg flex items-center">
                    <i className="fa-solid fa-crown mr-2 text-yellow-300"></i>Tier-1 통합 솔루션 완성
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-xl border border-blue-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border border-blue-100"><i className="fa-solid fa-layer-group"></i></div>
                    <h4 className="font-black text-2xl text-slate-800 mb-2">템스코 <span className="text-lg font-bold text-slate-500">(TEMSCO)</span></h4>
                    <p className="font-bold text-blue-700 text-lg bg-blue-50 py-2 rounded leading-snug">박막코팅 재료<br />비철소재</p>
                  </div>
                  <div className="flex items-center justify-center text-4xl text-blue-400 drop-shadow-sm"><i className="fa-solid fa-plus"></i></div>
                  <div className="flex-1 bg-white p-6 rounded-xl border border-indigo-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border border-indigo-100"><i className="fa-solid fa-microchip"></i></div>
                    <h4 className="font-black text-2xl text-slate-800 mb-2">위폼스 <span className="text-lg font-bold text-slate-500">(WEFORMS)</span></h4>
                    <p className="font-bold text-indigo-700 text-lg bg-indigo-50 py-1 rounded">정밀 메탈마스크</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 text-white p-8 rounded-2xl flex items-start justify-between shadow-lg mt-8">
                <div className="w-1/3 border-r border-slate-600 pr-8">
                  <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center"><i className="fa-solid fa-stopwatch mr-2"></i>벤더 단축 효과</h4>
                  <p className="text-[14px] text-slate-300 leading-relaxed font-medium break-keep">중간 마진을 제거하여 고객사의 원가 절감에 기여하고 공급 납기를 최적화합니다.</p>
                </div>
                <div className="w-1/3 border-r border-slate-600 px-8">
                  <h4 className="text-xl font-bold text-emerald-400 mb-3 flex items-center"><i className="fa-solid fa-boxes-stacked mr-2"></i>일괄 공급망 구축</h4>
                  <p className="text-[14px] text-slate-300 leading-relaxed font-medium break-keep">박막코팅 소재부터 정밀 부품까지 진공증착의 핵심 요소를 토탈 프로바이더로 제공하며, 산업영역을 이차전지 및 페로브스카이트 태양전지 등으로 확장하고 있습니다.</p>
                </div>
                <div className="w-1/3 pl-8">
                  <h4 className="text-xl font-bold text-purple-400 mb-3 flex items-center"><i className="fa-solid fa-handshake-angle mr-2"></i>공동 R&amp;D 파트너</h4>
                  <p className="text-[14px] text-slate-300 leading-relaxed font-medium break-keep">글로벌 패널 메이커의 차세대 신규 모델(OLED 등) 공동 개발 지위를 확보합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 5 */}
        <div className="temsco-slide bg-white">
          <div className="h-full flex flex-col p-14">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Risk &amp; Resolution : 파인원 사태의 본질과 재무 팩트 체크</h2>
            <p className="text-[17px] tracking-tight break-keep text-slate-800 mb-8 border-l-4 border-red-600 pl-4 bg-red-50 py-2 border border-red-100">
              &quot;부채비율 1557%의 진실&quot; : 당사의 영업력이나 기술력 훼손이 아닌, 과거 악성 채권 상각에 따른 <b>장부상 자본 감소(회계적 착시)</b>입니다.
            </p>
            <div className="flex-1 flex items-stretch justify-between gap-8 pb-4">
              <div className="flex-1 bg-white border border-slate-300 shadow-sm rounded-xl p-8 flex items-end justify-center relative">
                <div className="absolute top-4 left-6 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-200"><i className="fa-solid fa-chart-column mr-2"></i>자본총계 변동 폭포수 차트 (단위: 억원)</div>
                <div className="flex flex-col items-center justify-end h-[300px]">
                  <span className="text-2xl font-bold text-slate-800 mb-2">104.7억</span>
                  <div className="w-24 bg-blue-600 rounded-t h-[240px] shadow-sm flex items-end justify-center pb-4 text-white font-bold text-sm">24년 자본총계</div>
                </div>
                <div className="flex flex-col items-center justify-start h-[300px] pt-[60px]">
                  <span className="text-xl font-bold text-red-600 mb-2">-68.2억</span>
                  <div className="w-24 bg-red-500 rounded h-[160px] shadow-sm flex flex-col items-center justify-center text-white font-bold border border-red-600">
                    <i className="fa-solid fa-arrow-down mb-1"></i>대손상각비
                  </div>
                </div>
                <div className="flex flex-col items-center justify-start h-[300px] pt-[220px]">
                  <span className="text-sm font-bold text-orange-600 mb-1">-15.4억</span>
                  <div className="w-24 bg-orange-400 rounded h-[36px] shadow-sm flex items-center justify-center text-white font-bold text-xs border border-orange-500">기타(지분법등)</div>
                </div>
                <div className="flex flex-col items-center justify-end h-[300px]">
                  <span className="text-2xl font-bold text-slate-800 mb-2">21.0억</span>
                  <div className="w-24 bg-slate-500 rounded-t h-[44px] shadow-sm flex items-end justify-center pb-2 text-white font-bold text-sm">25년 자본총계</div>
                </div>
              </div>
              <div className="w-[45%] flex flex-col">
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl shadow-sm h-full flex flex-col justify-center gap-6">
                  <div className="border-b border-slate-300 pb-5">
                    <span className="bg-red-100 text-red-800 border border-red-200 font-bold px-3 py-1 rounded text-sm mb-3 inline-block"><i className="fa-solid fa-triangle-exclamation mr-2"></i>이슈의 발생 (Crisis)</span>
                    <p className="text-slate-700 text-[15px] leading-relaxed">
                      2025년 9월, 제품 불량이 아닌 고객사(파인원)의 무리한 상장 준비 및 선행투자로 인한 <b>&apos;흑자 부도&apos;</b> 발생. 회수 불투명해진 약 75억 원 채권 중 <b>68.2억 원을 25년 결산에 대손상각(비용)으로 전액 반영</b>.
                    </p>
                  </div>
                  <div>
                    <span className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-3 py-1 rounded text-sm mb-3 inline-block"><i className="fa-solid fa-lightbulb mr-2"></i>팩트 체크 및 기회 (Resolution)</span>
                    <ul className="space-y-3 text-slate-700 text-[15px] leading-relaxed list-none">
                      <li className="flex items-start"><i className="fa-solid fa-check text-green-600 mt-1 mr-2"></i><span><b>부채 자체 증가 없음:</b> 25년 총 부채는 전년 대비 감소. 부채비율 폭등은 분모(자본) 감소에 의한 산술적 결과.</span></li>
                      <li className="flex items-start"><i className="fa-solid fa-check text-green-600 mt-1 mr-2"></i><span><b>현금 유출 없는 회계적 손실:</b> 대손상각은 과거 채권의 제각일 뿐, 당기 영업 현금흐름을 훼손하지 않음.</span></li>
                      <li className="flex items-start"><i className="fa-solid fa-check text-green-600 mt-1 mr-2"></i><span><b>최종 고객사 직납 기회:</b> 중간 벤더 소멸을 기회로 중국 CSOT, 비전옥스 등 최종 패널 메이커 1차 직납 진입.</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 6 */}
        <div className="temsco-slide bg-slate-50">
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-4 inline-block w-max">Traction : 글로벌 Top-Tier 양산 파이프라인 확보</h2>
            <p className="text-slate-700 text-lg mb-8 font-medium">템스코와 위폼스의 결합은 국내외 주요 디스플레이 메이커의 강력한 러브콜로 이어지고 있습니다 (2026년 본격 양산 개시).</p>
            <div className="grid grid-cols-2 gap-8 flex-1">
              <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-200 pb-3"><i className="fa-solid fa-building-flag text-blue-600 mr-3"></i>국내 메인 고객사 (디스플레이)</h3>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-xl text-blue-800">S사 (삼성디스플레이)</h4>
                      <span className="bg-green-100 text-green-800 border border-green-300 text-sm font-bold px-3 py-1 rounded-full"><i className="fa-solid fa-circle-check mr-2"></i>선정 완료</span>
                    </div>
                    <ul className="text-sm text-slate-700 space-y-2 mt-3">
                      <li>• <b>부품:</b> 27년 양산용 메탈마스크 신모델 <b>4개 선정 완료</b> (추가 2개 모델 논의 중)</li>
                      <li>• <b>소재:</b> 고순도 알루미늄 스퍼터링 타겟 및 Invar 소재 1차 벤더 양산 평가 진행 중</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-xl text-red-700">L사 (LG디스플레이)</h4>
                      <span className="bg-green-100 text-green-800 border border-green-300 text-sm font-bold px-3 py-1 rounded-full"><i className="fa-solid fa-handshake mr-2"></i>메인업체 지정</span>
                    </div>
                    <ul className="text-sm text-slate-700 space-y-2 mt-3">
                      <li>• <b>부품:</b> 1차 벤더 메탈마스크 <b>최우선협상 메인업체 선정</b> (모든 개발모델 최우선 평가권 확보)</li>
                      <li>• <b>소재:</b> 몰리브덴/알루미늄 스퍼터링 타겟 평가 중 (실버 합금 타겟 추가 계획)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-200 pb-3"><i className="fa-solid fa-globe text-emerald-600 mr-3"></i>글로벌 장비 / 패널 메이커</h3>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-black text-xl text-slate-900">Visionox (중국 비전옥스)</h4>
                        <p className="text-xs text-slate-500 mt-1 font-bold">OLED 패널 제조</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 border border-blue-300 text-sm font-bold px-3 py-1 rounded-full"><i className="fa-solid fa-boxes-packing mr-2"></i>양산 물량 확보</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-3 border-t border-slate-200 pt-3 leading-relaxed">
                      파인원의 신용불량 공백을 메우기 위해 당사가 <b>직접 대체 업체로 평가 통과.</b><br />양산 공급 물량의 <b>30% 배정 협의 완료</b> (2026년 4분기부터 양산 공급 논의 중).
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
                      <h4 className="font-black text-lg text-slate-900 mb-1">AMAT &amp; emagin (미국)</h4>
                      <p className="text-xs text-slate-500 mb-3 font-bold">진공장비 / 마이크로 디스플레이</p>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-300">시양산 개시</span>
                    </div>
                    <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
                      <h4 className="font-black text-lg text-slate-900 mb-1">CSOT (중국)</h4>
                      <p className="text-xs text-slate-500 mb-3 font-bold">OLED 패널 제조</p>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-300">물량 배정 논의 중</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 7 */}
        <div className="temsco-slide bg-white">
          <div className="h-full flex flex-col p-14">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Financial Turnaround : 데이터로 증명하는 본질적 수익성</h2>
            <p className="text-lg text-slate-800 mb-8 border-l-4 border-blue-600 pl-4 bg-blue-50 py-2 font-medium border border-blue-100">
              2025년 감사보고서 기준, 영업손실(-51.9억)은 판관비에 포함된 일회성 대손상각비(63.7억) 때문입니다. 이를 환원하면 <b>당사의 실제 본업 영업이익(Adjusted OP)은 +11.8억 원 흑자</b>입니다.
            </p>
            <div className="flex-1 flex items-start justify-center gap-12 mt-4">
              <div className="w-[55%] relative h-[380px] border-b-2 border-slate-800 flex items-end justify-between px-10 pb-0 bg-slate-50 rounded-xl pt-10 border border-slate-200 shadow-sm">
                <div className="absolute left-4 top-[170px] text-sm font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-300">0 (손익분기)</div>
                <div className="absolute w-full left-0 h-px bg-slate-400 border-b border-dashed border-slate-500 top-[180px] z-0"></div>
                <div className="relative z-10 flex flex-col items-center justify-start h-full pt-[180px]">
                  <div className="w-24 bg-red-500 rounded-b h-[90px] shadow-sm flex items-start justify-center pt-2 text-white font-bold relative border border-red-600"></div>
                  <span className="text-lg font-bold text-red-600 mt-2">-51.9억</span>
                  <span className="text-slate-800 font-bold whitespace-nowrap text-sm mt-1">장부상 영업손실</span>
                </div>
                <div className="relative z-10 text-2xl text-slate-500 h-full flex items-center pt-[30px]"><i className="fa-solid fa-plus"></i></div>
                <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[200px]">
                  <span className="text-lg font-bold text-slate-700 mb-2">+63.7억</span>
                  <div className="w-24 bg-white border-2 border-dashed border-slate-400 rounded-t h-[110px] shadow-sm flex items-center justify-center text-slate-700 font-bold text-center relative px-1 leading-tight text-sm">
                    일회성<br />대손상각비
                    <span className="absolute -bottom-8 text-slate-800 font-bold whitespace-nowrap text-sm">비용 환원(Add-back)</span>
                  </div>
                </div>
                <div className="relative z-10 text-2xl text-slate-500 h-full flex items-center pt-[30px]"><i className="fa-solid fa-equals"></i></div>
                <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[200px]">
                  <span className="text-2xl font-black text-blue-700 mb-2">+11.8억</span>
                  <div className="w-28 bg-blue-600 rounded-t h-[20px] shadow-sm relative border border-blue-700">
                    <span className="absolute -bottom-14 w-full text-center text-blue-900 font-black text-base leading-tight">실질 조정<br />영업이익</span>
                  </div>
                </div>
              </div>
              <div className="w-[45%] h-full flex flex-col gap-5">
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-lg text-slate-800 mb-2 border-b border-slate-200 pb-2 flex items-center"><i className="fa-solid fa-clock-rotate-left mr-2 text-slate-500"></i>과거 펀더멘털 (2024년 결산)</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• <b>매출액:</b> 398.5억 원 (고성장 이력)</li>
                    <li>• <b>영업이익:</b> 20.5억 원 (영업이익률 5.2% 수준)</li>
                    <li>• 본업 자체는 연 400억 규모를 안정적으로 소화하는 구조.</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm flex-1">
                  <h4 className="font-bold text-lg text-blue-900 mb-2 border-b border-blue-200 pb-2 flex items-center"><i className="fa-solid fa-rocket mr-2 text-blue-600"></i>향후 턴어라운드 (2026년 목표)</h4>
                  <ul className="text-[15px] text-slate-800 space-y-3 mt-3 leading-relaxed font-medium">
                    <li><b>1. 매출 400억 원 돌파 확정적:</b> 위폼스 메탈마스크 직납 물량 및 비전옥스 30% 배정 물량 본격 인식.</li>
                    <li><b>2. 1차 벤더 마진율 프리미엄:</b> 직거래 구조 전환으로 <b>약 8~9% 수준</b>의 수익성 극대화 예상.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 8 */}
        <div className="temsco-slide bg-white">
          <div className="h-full flex flex-col p-14 relative z-10">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-6 inline-block w-max">Financial Projections : 추정손익계산서 기반 중장기 성장 전망</h2>
            <div className="flex-1 flex gap-8">
              {/* Left: Growth Narrative */}
              <div className="w-[35%] flex flex-col justify-between">
                <div>
                  <p className="text-blue-600 font-bold mb-2 uppercase tracking-wide">Key Projections</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-5">2029년 매출 <span className="text-blue-700">700억</span>,<br />영업이익 <span className="text-blue-700">64.9억</span> 달성</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg shadow-sm">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center mb-1"><i className="fa-solid fa-arrow-trend-up text-blue-600 mr-2"></i>매출 Top-line 확장</h4>
                      <p className="text-[12px] text-slate-600 font-medium leading-relaxed">제품 및 상품 매출의 고른 성장을 통해 FY2026년 400억 원에서 매년 두 자릿수 성장을 기록하며 2029년 700억 원에 도달합니다.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg shadow-sm">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center mb-1"><i className="fa-solid fa-won-sign text-emerald-600 mr-2"></i>이익률의 구조적 개선</h4>
                      <p className="text-[12px] text-slate-600 font-medium leading-relaxed">25년 일회성 대손상각(63.7억) 악재가 완전히 소멸되어 FY2026 영업이익 31.5억(OPM 7.9%)으로 즉각 흑자 전환됩니다.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg shadow-sm">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center mb-1"><i className="fa-solid fa-gem text-purple-600 mr-2"></i>수익성 우위 확보</h4>
                      <p className="text-[12px] text-slate-600 font-medium leading-relaxed">직납 체계 안정화에 힘입어 매출총이익률이 15.0% 수준으로 유지되며, 2029년 순이익 45.9억 원(순이익률 6.6%)을 달성합니다.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Detailed Estimated Financial Table based on Image Data */}
              <div className="w-[65%] bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="font-bold text-slate-800 text-sm"><i className="fa-solid fa-table mr-2 text-blue-600"></i>추정손익계산서 요약 (단위: 억원)</span>
                  <span className="text-[11px] text-slate-500 font-medium">※ 첨부 감사보고서 및 경영계획 기준</span>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col justify-center">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-slate-800 text-white font-bold">
                      <tr className="text-[12px]">
                        <th className="py-2.5 px-2 text-left pl-4 w-[28%]">구분 (항목)</th>
                        <th className="py-2.5 px-2">전기실적<br /><span className="text-[10px] font-normal text-slate-300">(24년)</span></th>
                        <th className="py-2.5 px-2">당기실적<br /><span className="text-[10px] font-normal text-slate-300">(25년)</span></th>
                        <th className="py-2.5 px-2 text-blue-300">FY2026(E)</th>
                        <th className="py-2.5 px-2">FY2027(E)</th>
                        <th className="py-2.5 px-2">FY2028(E)</th>
                        <th className="py-2.5 px-2 font-black">FY2029(E)</th>
                      </tr>
                    </thead>
                    <tbody className="font-medium text-slate-700 text-[12px]">
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <td className="py-2 font-bold text-left pl-4 border-r border-slate-200">제품 매출</td>
                        <td>236.8</td><td>179.1</td><td>250.0</td><td>300.0</td><td>350.0</td><td>400.0</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold text-left pl-4 border-r border-slate-200">상품 매출</td>
                        <td>161.8</td><td>171.5</td><td>150.0</td><td>220.0</td><td>250.0</td><td>300.0</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-blue-50/50 font-bold">
                        <td className="py-2 text-left pl-4 border-r border-slate-200 text-blue-900">매출액 합계</td>
                        <td>398.6</td><td>350.6</td><td className="text-blue-700">400.0</td><td>520.0</td><td>600.0</td><td className="text-blue-900">700.0</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold text-left pl-4 border-r border-slate-200">매출총이익</td>
                        <td>40.4</td><td>37.8</td><td>60.0</td><td>78.0</td><td>90.0</td><td>105.0</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <td className="py-2 font-bold text-left pl-4 border-r border-slate-200 text-slate-500">매출총이익률</td>
                        <td>10.1%</td><td>10.8%</td><td>15.0%</td><td>15.0%</td><td>15.0%</td><td>15.0%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold text-left pl-4 border-r border-slate-200 text-blue-700">영업이익</td>
                        <td className="text-slate-800">20.6</td><td className="text-red-500 font-bold">-51.9</td><td className="text-blue-700 font-bold bg-blue-50/70">31.5</td><td>44.9</td><td>53.4</td><td className="font-black text-blue-900">64.9</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <td className="py-2 font-bold text-left pl-4 border-r border-slate-200 text-slate-500">영업이익률 (OPM)</td>
                        <td>5.2%</td><td className="text-red-500 font-bold">(14.8%)</td><td className="text-blue-700 font-bold">7.9%</td><td>8.6%</td><td>8.9%</td><td className="font-bold">9.3%</td>
                      </tr>
                      <tr className="hover:bg-slate-50 font-bold bg-indigo-50/30">
                        <td className="py-2 text-left pl-4 border-r border-slate-200 text-indigo-900">당기순이익</td>
                        <td>16.1</td><td className="text-red-500">-83.7</td><td className="text-blue-700">19.9</td><td>30.3</td><td>37.0</td><td className="text-indigo-900">45.9</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 9 */}
        <div className="temsco-slide bg-slate-50">
          <div className="h-full flex flex-col p-14">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-8 inline-block w-max">Valuation &amp; Post-Investment : 투자 유치에 따른 재무구조 혁신</h2>
            <div className="flex gap-8 h-full">
              <div className="w-1/3 bg-white border border-slate-300 shadow-sm rounded-xl p-8 flex flex-col justify-start">
                <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded text-sm font-bold w-max mb-4">Pre-Money Valuation Logic</span>
                <h3 className="text-2xl font-bold mb-6 text-slate-900">내재 가치 평가</h3>
                <p className="text-[15px] text-slate-700 mb-6 leading-relaxed">
                  일회성 손실을 제외한 당사의 정상 영업이익 창출력은 약 <b>15억~20억 원</b> 수준입니다. 삼성/LG 1차 소부장 벤더의 상장사 평균 멀티플을 적용할 경우, 현재 투자가치는 대단히 매력적인 구간에 위치합니다.
                </p>
                <div className="mt-auto bg-blue-50 border border-blue-100 p-5 rounded-lg shadow-inner">
                  <p className="text-sm text-blue-800 font-bold mb-2 border-b border-blue-200 pb-1">2026년 예상 실적 기반 추정</p>
                  <p className="text-xl font-black text-slate-800">Target Rev: 400억 원</p>
                  <p className="text-xl font-black text-blue-700 mt-1">Target OP: 31.5억 원 (7.9%)</p>
                </div>
              </div>
              <div className="w-2/3 bg-white text-slate-800 border border-slate-300 shadow-sm rounded-xl p-8 flex flex-col">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded text-sm font-bold w-max mb-4">Post-Investment Impact (50억 자금 조달 가정 시)</span>
                <h3 className="text-2xl font-bold mb-6 text-slate-900">재무구조 완전 정상화 시뮬레이션</h3>
                <div className="flex items-center justify-between mt-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <div className="flex flex-col items-center w-[40%]">
                    <h4 className="font-bold text-slate-600 mb-4 bg-white px-3 py-1 border border-slate-200 rounded whitespace-nowrap">2025년 결산 (투자 전)</h4>
                    <div className="w-full max-w-[200px] border border-slate-400 rounded overflow-hidden shadow-sm">
                      <div className="bg-red-500 text-white text-center py-4 font-bold text-lg border-b border-white">부채 328억</div>
                      <div className="bg-slate-300 text-slate-800 text-center py-2 font-bold text-sm">자본 21억</div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-slate-600 font-bold">장부상 부채비율</p>
                      <p className="text-3xl font-black text-red-600">1,557%</p>
                    </div>
                  </div>
                  <div className="text-4xl text-blue-400"><i className="fa-solid fa-arrow-right-long"></i></div>
                  <div className="flex flex-col items-center w-[40%]">
                    <h4 className="font-bold text-blue-700 mb-4 bg-blue-50 px-3 py-1 border border-blue-200 rounded whitespace-nowrap">투자 유치 후 (50억 자본 전입)</h4>
                    <div className="w-full max-w-[200px] border border-blue-400 rounded overflow-hidden shadow-md transform scale-105">
                      <div className="bg-red-400 text-white text-center py-3 font-bold text-base border-b border-white">부채 328억 (유지)</div>
                      <div className="bg-blue-600 text-white text-center py-4 font-bold text-lg">자본 71억 (+50억)</div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-blue-700 font-bold">자본 확충시 부채비율</p>
                      <p className="text-3xl font-black text-blue-700">461% <i className="fa-solid fa-arrow-trend-down text-lg"></i></p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">26년 순이익 가산시 300%대 진입</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 10 */}
        <div className="temsco-slide bg-white">
          <div className="h-full flex flex-col p-14">
            <h2 className="text-[2rem] font-black text-slate-800 border-b-4 border-blue-600 pb-3 mb-8 inline-block w-max">The Ask &amp; Use of Proceeds : 성장 재원 확보</h2>
            <div className="flex-1 flex gap-8 h-full">
              <div className="w-1/2 bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="bg-blue-600 text-white inline-block px-3 py-1 rounded font-bold text-sm mb-4 shadow-sm">Target Funding</div>
                  <h3 className="text-4xl font-black text-blue-800 mb-6">30억 ~ 50억 원</h3>
                  <p className="text-slate-700 mb-6 font-bold border-b border-slate-300 pb-3 text-[15px] leading-relaxed">
                    당사는 재무구조 개선과 26~27년 폭발적 수주 대응을 위해 자금을 조달하며, 투자 기관의 펀드 성격에 맞춘 <b>유연한 투자 구조(Tailor-made)</b> 설계가 가능합니다.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 border border-blue-300 rounded-full flex items-center justify-center text-lg mr-4 flex-shrink-0 mt-1"><i className="fa-solid fa-chart-pie"></i></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">자본 확충형 (Equity) 제안</h4>
                      <p className="text-sm text-slate-600">RCPS, CPS, 보통주 등 자본으로 전입되어 즉각적인 부채비율 감소 및 업사이드를 공유하는 구조.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-white rounded-lg border border-emerald-200 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center text-lg mr-4 flex-shrink-0 mt-1"><i className="fa-solid fa-money-bill-transfer"></i></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">메자닌 / 부채형 (Debt) 제안</h4>
                      <p className="text-sm text-slate-600">CB, BW 등 원금 보장을 확보하면서 1차 벤더 양산 실적에 따라 주식 전환 차익을 노리는 구조.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-300 flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-slate-900 mb-8 w-full text-left border-b border-slate-300 pb-2 flex items-center"><i className="fa-solid fa-bullseye text-blue-700 mr-2"></i>자금 활용 계획 (Use of Proceeds)</h3>
                <div className="flex flex-col items-center justify-center w-full gap-8">
                  <div className="w-40 h-40 conic-donut shadow-md border border-slate-200 rounded-full"></div>
                  <div className="flex flex-col space-y-4 w-full px-4">
                    <div className="flex items-start bg-white p-3 rounded border border-slate-200 shadow-sm">
                      <div className="w-4 h-4 bg-[#1e3a8a] rounded-sm mt-0.5 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-black text-slate-900 text-base">설비 투자 (CAPEX) <span className="text-blue-800 ml-2">40% (약 20억)</span></p>
                        <p className="text-sm text-slate-600 mt-1 font-medium">위폼스 메탈마스크 정밀 가공 설비 고도화 및 라인 증설.</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-white p-3 rounded border border-slate-200 shadow-sm">
                      <div className="w-4 h-4 bg-[#3b82f6] rounded-sm mt-0.5 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-black text-slate-900 text-base">운영 자금 (Working Capital) <span className="text-blue-600 ml-2">40% (약 20억)</span></p>
                        <p className="text-sm text-slate-600 mt-1 font-medium">디스플레이 신모델 수주 물량 급증에 따른 선제적 원소재 매입 대금.</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-white p-3 rounded border border-slate-200 shadow-sm">
                      <div className="w-4 h-4 bg-[#9ca3af] rounded-sm mt-0.5 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-black text-slate-900 text-base">연구 개발 (R&amp;D 및 신사업) <span className="text-slate-600 ml-2">20% (약 10억)</span></p>
                        <p className="text-sm text-slate-600 mt-1 font-medium">반도체 신규 소재 및 전력반도체 구리기판 양산 테스트 비용.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
