export type V4SlideCategory = 'highlights' | 'strategy' | 'financials'
export type V4SlideKind = 'cover' | 'contents' | 'divider' | 'content'

export type V4Slide = {
  id: string
  num: string
  title: string
  desc: string
  category: V4SlideCategory
  icon: string
  kind: V4SlideKind
  chapterId?: string
}

const chapterDefinitions = [
  {
    id: 'overview', num: '01', title: '투자 개요 및 회사 현황',
    english: 'INVESTMENT OVERVIEW', category: 'highlights',
    desc: '투자 포인트 · 기술 리더십 · 성장 연혁',
    slideIds: ['investment-highlights', 'company-overview'],
  },
  {
    id: 'acquisition', num: '02', title: '인수 전략 및 시너지',
    english: 'ACQUISITION & SYNERGY', category: 'strategy',
    desc: '90억 원 인수 · 연간·누적 손익 · 거래별 시너지',
    slideIds: ['acquisition-value', 'acquisition-synergy', 'business-synergy'],
  },
  {
    id: 'technology', num: '03', title: '기술 역량 및 제품 경쟁력',
    english: 'TECHNOLOGY & PRODUCTS', category: 'strategy',
    desc: '소재·코팅 · 마스크 구조·제조 · 품질 측정 · 대면적 개발',
    slideIds: ['technology-materials', 'technology-mask', 'technology-process', 'technology-quality', 'technology-development'],
  },
  {
    id: 'growth', num: '04', title: '사업 환경 및 성장 전략',
    english: 'BUSINESS & GROWTH', category: 'strategy',
    desc: '사업 리스크 · 공급 구조 변화 · 고객별 진척',
    slideIds: ['risk-resolution', 'growth-pipeline'],
  },
  {
    id: 'financials', num: '05', title: '재무 실적 및 손익 전망',
    english: 'FINANCIAL PERFORMANCE', category: 'financials',
    desc: '수익성 회복 · 부문별 매출 · 추정손익계산서',
    slideIds: ['financial-turnaround', 'segment-revenue', 'income-statement'],
  },
  {
    id: 'valuation', num: '06', title: '기업가치 및 투자 효과',
    english: 'VALUATION & CAPITAL STRUCTURE', category: 'financials',
    desc: '별도·연결 DCF · 시장배수 · 시나리오 · 75% 지분·증자 효과',
    slideIds: ['valuation', 'valuation-parent-fcff', 'valuation-consolidated-fcff', 'valuation-terminal', 'valuation-peers', 'valuation-methods', 'valuation-scenarios', 'valuation-sensitivity', 'valuation-equity', 'valuation-investment'],
  },
  {
    id: 'funding', num: '07', title: '투자 유치 및 회수 전략',
    english: 'FUNDING & INVESTOR EXIT', category: 'financials',
    desc: '투자 유치 · 자금 운용 · IPO·M&A·Buy-back',
    slideIds: ['use-of-proceeds', 'investor-exit'],
  },
  {
    id: 'appendix', num: 'A', title: '평가 근거 및 가정',
    english: 'APPENDIX', category: 'financials',
    desc: '재무 원본 대사 · 시장 할인율 · 재투자·운전자본 가정',
    slideIds: ['valuation-source', 'valuation-wacc', 'valuation-assumptions'],
  },
] as const

const contentSlides: Omit<V4Slide, 'num' | 'kind' | 'chapterId'>[] = [
  {
    id: 'cover',
    title: '표지 (TEMSCO Investment Proposal)',
    desc: '박막 코팅 소재와 정밀 메탈마스크를 결합한 템스코 투자제안서',
    category: 'highlights',
    icon: 'fa-shield-halved',
  },
  {
    id: 'investment-highlights',
    title: '핵심 투자 하이라이트',
    desc: '소재·부품 사업 연계, 고객별 공급 진척, 재무 회복 및 성장 계획',
    category: 'highlights',
    icon: 'fa-chart-line',
  },
  {
    id: 'company-overview',
    title: '회사 개요 및 기술 리더십',
    desc: '오정석 대표 대통령표창, 핵심 사업 영역 및 위폼스 인수 연혁',
    category: 'highlights',
    icon: 'fa-building',
  },
  {
    id: 'acquisition-value',
    title: '위폼스 인수 시너지: 원가 경쟁력·차세대 매출 기반',
    desc: '90억 취득대가, 원재료 조달·G8.6급 기술 협업 및 2024~2029년 손익 추이',
    category: 'strategy',
    icon: 'fa-chart-line',
  },
  {
    id: 'acquisition-synergy',
    title: '인수 시너지 · 거래별 수익과 법인별 손익',
    desc: '2026E 원재료·마스크 거래액, 법인별 손익 배부 및 연결 손익 대사',
    category: 'strategy',
    icon: 'fa-link',
  },
  {
    id: 'business-synergy',
    title: '소재·부품 공정 연계 및 사업 시너지',
    desc: '소재 조달·정밀가공·코팅·세정의 연결과 납기·원가 개선 방향',
    category: 'strategy',
    icon: 'fa-layer-group',
  },
  {
    id: 'risk-resolution',
    title: '채권 손상 및 재무구조 변화',
    desc: '파인원 관련 채권의 회계 처리와 고객 공급 구조의 변화',
    category: 'financials',
    icon: 'fa-receipt',
  },
  { id: 'technology-materials', title: '소재 공급 및 박막 코팅 기술', desc: '고순도 Al·INVAR36 공급 사양과 PVD 인라인 스퍼터', category: 'strategy', icon: 'fa-layer-group' },
  { id: 'technology-mask', title: '오픈 메탈 마스크 구조 및 적용 공정', desc: 'Sheet·Frame·Welding 구성과 OMM·CVD Mask 적용', category: 'strategy', icon: 'fa-microchip' },
  { id: 'technology-process', title: '정밀 마스크 제조 및 검사 공정', desc: '시트 에칭·인장용접·AOI 공정 및 실제 설비', category: 'strategy', icon: 'fa-gears' },
  { id: 'technology-quality', title: '단면 가공 및 코팅 품질 측정', desc: 'SEM 단면과 위치별 코팅 두께·공정 사양', category: 'strategy', icon: 'fa-microscope' },
  { id: 'technology-development', title: '대면적 마스크 개발 및 생산 기반', desc: 'G6H 양산 이력과 G8급·Micro OLED 개발 단계', category: 'strategy', icon: 'fa-expand' },
  {
    id: 'growth-pipeline',
    title: '주요 고객사별 공급 현황',
    desc: 'LG디스플레이 1차 벤더 확정, 중국 판매 및 삼성디스플레이 가격 협상',
    category: 'strategy',
    icon: 'fa-arrows-split-up-and-left',
  },
  {
    id: 'financial-turnaround',
    title: '별도·연결 매출 및 영업손익 추이',
    desc: '2025년 손익과 일회성 비용 분석, 2026년 이후 수익성 회복 계획',
    category: 'financials',
    icon: 'fa-chart-line',
  },
  {
    id: 'segment-revenue',
    title: '법인별 매출 및 내부거래 조정',
    desc: '마스크·소재 부문의 과거 매출, 고객별 성장 근거 및 매출 구성 전망',
    category: 'financials',
    icon: 'fa-chart-column',
  },
  {
    id: 'income-statement',
    title: '별도·연결 추정손익계산서',
    desc: '2024~2025년 실적과 2026~2029년 매출·비용·이익 전망',
    category: 'financials',
    icon: 'fa-table-list',
  },
  { id: 'valuation', title: '기업가치 평가 체계 및 지분가치 비교', desc: '위폼스 지분75%·비지배25%, 연결 및 별도 SOTP 비교', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-source', title: '재무 원본 대사 및 평가 기준일', desc: '4안 Excel 원본 손익·상각 대용치·2025말 순차입금', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-wacc', title: '시장지표 기반 할인율 산정', desc: '무위험수익률·ERP·CRP·베타·시장 자본구조·차입비용', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-assumptions', title: '상각·재투자·운전자본 가정', desc: '회사계획 2026~2029·2030 이후 정상 FCFF 및 자산·운전자본 추정', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-parent-fcff', title: '템스코 별도 추정손익 및 FCFF', desc: '2026~2029 4개 연도·2026 잔여기간 별도 FCFF·잔여가치·EV 합산', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-consolidated-fcff', title: '연결 추정손익 및 FCFF', desc: '2026~2029 4개 연도·2026 잔여기간 연결 FCFF·잔여가치·EV 합산', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-terminal', title: '무성장 잔여가치 및 정상 이익', desc: '2029말 잔여가치·2030 정상 FCFF·g=0·유지투자', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-peers', title: 'OMM 경쟁사 및 비교기업 선정', desc: '핌스 우선·풍원정밀·세우인코퍼레이션, 소재 코멧·YMC 구분', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-methods', title: 'DCF 가치 및 OMM 배수 검토', desc: 'DCF 유지·DNP 적용 철회·OMM 배수 및 가치 격차 산정 보류', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-scenarios', title: '비관·중도·낙관 시나리오별 가치', desc: '2029E 손익·2030 정상가치 및 비관·중도·낙관별 DCF·배수', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-sensitivity', title: '할인율·정상 이익·투자시점 민감도', desc: 'WACC·정상 이익 및 미집행 CAPEX 영향', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-equity', title: '영업가치·지분가치 연결 및 비지배지분', desc: '그룹 순차입금·NCI 차감, 별도 지분가치 합산', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-investment', title: '70억 원 투자 유치 및 자본구조 변화', desc: '별도·연결 증자 직후 재무비율·Post-money·조건부 희석', category: 'financials', icon: 'fa-chart-line' },
  {
    id: 'use-of-proceeds',
    title: '투자 유치 및 자금 활용 계획',
    desc: '70억 원 투자 유치 제안 및 설비·운영·R&D 자금 활용 계획',
    category: 'financials',
    icon: 'fa-hand-holding-dollar',
  },
  {
    id: 'investor-exit',
    title: '투자자 Exit Plan',
    desc: 'IPO 목표·회수대금·세전 순이익 범위 및 Buy-back 행사 조건',
    category: 'financials',
    icon: 'fa-arrow-right-from-bracket',
  },
]


function getContentSlide(id: string) {
  const slide = contentSlides.find(item => item.id === id)
  if (!slide) throw new Error(`Unknown TEMSCO V4 content slide: ${id}`)
  return slide
}

// Page numbers derive from the same chapter sequence used by the deck and landing page.
const orderedSlides: Omit<V4Slide, 'num'>[] = [
  { ...getContentSlide('cover'), kind: 'cover' },
  {
    id: 'contents', title: '투자제안서 목차', kind: 'contents',
    desc: `본문 ${chapterDefinitions.filter(chapter => chapter.id !== 'appendix').length}개 장·별첨 구성 및 페이지 안내`, category: 'highlights', icon: 'fa-list',
  },
  ...chapterDefinitions.flatMap(chapter => [
    {
      id: `chapter-${chapter.id}`, title: chapter.title, desc: chapter.desc,
      category: chapter.category, icon: 'fa-bookmark', kind: 'divider' as const,
      chapterId: chapter.id,
    },
    ...chapter.slideIds.map(id => ({
      ...getContentSlide(id), kind: 'content' as const, chapterId: chapter.id,
    })),
  ]),
]

export const v4Slides: V4Slide[] = orderedSlides.map((slide, index) => ({
  ...slide, num: String(index + 1).padStart(2, '0'),
}))

export function getV4SlideIndex(id: string) {
  const index = v4Slides.findIndex(slide => slide.id === id)
  if (index < 0) throw new Error(`Unknown TEMSCO V4 slide: ${id}`)
  return index
}

export const v4Chapters = chapterDefinitions.map(chapter => {
  const divider = v4Slides[getV4SlideIndex(`chapter-${chapter.id}`)]
  const slides = chapter.slideIds.map(id => v4Slides[getV4SlideIndex(id)])
  const firstPage = slides[0].num
  const lastPage = slides[slides.length - 1].num
  return {
    ...chapter, divider, slides,
    pageRange: firstPage === lastPage ? firstPage : `${firstPage}–${lastPage}`,
  }
})

export type V4Chapter = (typeof v4Chapters)[number]

export const v4MainChapters = v4Chapters.filter(chapter => chapter.id !== 'appendix')
