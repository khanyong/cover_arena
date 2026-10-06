export type V5SlideCategory = 'highlights' | 'strategy' | 'financials'
export type V5SlideKind = 'cover' | 'contents' | 'divider' | 'content'

export type V5Slide = {
  id: string
  num: string
  title: string
  desc: string
  category: V5SlideCategory
  icon: string
  kind: V5SlideKind
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
    desc: '개별·연결 기업가치 · DCF·배수 비교 · 시나리오',
    slideIds: ['valuation', 'valuation-wacc', 'valuation-parent-fcff', 'valuation-consolidated-fcff', 'valuation-peers', 'valuation-methods', 'valuation-scenarios'],
  },
  {
    id: 'funding', num: '07', title: '투자 유치 및 회수 전략',
    english: 'FUNDING & INVESTOR EXIT', category: 'financials',
    desc: '투자 유치 · 자금 운용 · IPO·지분매각·Buy-back',
    slideIds: ['use-of-proceeds', 'investor-exit'],
  },
  {
    id: 'appendix', num: 'A', title: '평가 근거 및 가정',
    english: 'APPENDIX', category: 'financials',
    desc: '재무자료 대사 · 재투자·운전자본 가정',
    slideIds: ['valuation-source', 'valuation-assumptions'],
  },
] as const

const contentSlides: Omit<V5Slide, 'num' | 'kind' | 'chapterId'>[] = [
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
    title: '매출 및 영업이익 추이',
    desc: '2023~2030년 템스코 개별·연결 매출 및 영업이익 추이',
    category: 'financials',
    icon: 'fa-chart-line',
  },
  {
    id: 'segment-revenue',
    title: '매출 및 영업이익 연결 내역',
    desc: '2026~2030년 양사 매출·영업이익 합산 및 내부거래 조정',
    category: 'financials',
    icon: 'fa-chart-column',
  },
  {
    id: 'income-statement',
    title: '별도·연결 추정손익계산서',
    desc: '2024~2025년 실적과 2026~2030년 매출·비용·이익 전망',
    category: 'financials',
    icon: 'fa-table-list',
  },
  { id: 'valuation', title: '개별·연결 기업가치 비교', desc: '템스코·위폼스 개별 기업가치와 그룹 전체 기업가치 비교', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-source', title: '재무자료 대사 및 평가 기준일', desc: '5안 Excel 원본 손익·상각 대용치·2025말 순차입금', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-wacc', title: '가중평균자본비용(WACC)의 산정', desc: '지정 DCF 평가모델의 WACC 13.74%·산정근거 및 입력가정', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-assumptions', title: '상각·재투자·운전자본 가정', desc: '사업계획 2026~2030·2031년 이후 추정 FCFF 및 자산·운전자본 추정', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-parent-fcff', title: '템스코 개별 기업가치 및 추정현금흐름', desc: '2026~2030 5개 연도·2026 잔여기간 별도 FCFF·잔여가치·EV 합산', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-consolidated-fcff', title: '연결 기업가치 및 추정현금흐름', desc: '2026~2030 5개 연도·2026 잔여기간 연결 FCFF·잔여가치·EV 합산', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-peers', title: 'OMM 경쟁사 및 비교기업 선정', desc: '핌스 우선·풍원정밀·세우인코퍼레이션, 소재 코멧·YMC 구분', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-methods', title: '연결 기업가치의 DCF·배수 비교', desc: 'DCF 가치·OMM 비교기업 배수 검토·방법별 가치 비교', category: 'financials', icon: 'fa-chart-line' },
  { id: 'valuation-scenarios', title: '시나리오별 개별·연결 기업가치', desc: '2030E 손익·2031년 이후 잔여가치 및 비관·중도·낙관별 DCF·배수', category: 'financials', icon: 'fa-chart-line' },
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
  if (!slide) throw new Error(`Unknown TEMSCO V5 content slide: ${id}`)
  return slide
}

// Page numbers derive from the same chapter sequence used by the deck and landing page.
const orderedSlides: Omit<V5Slide, 'num'>[] = [
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

export const v5Slides: V5Slide[] = orderedSlides.map((slide, index) => ({
  ...slide, num: String(index + 1).padStart(2, '0'),
}))

export function getV5SlideIndex(id: string) {
  const index = v5Slides.findIndex(slide => slide.id === id)
  if (index < 0) throw new Error(`Unknown TEMSCO V5 slide: ${id}`)
  return index
}

export const v5Chapters = chapterDefinitions.map(chapter => {
  const divider = v5Slides[getV5SlideIndex(`chapter-${chapter.id}`)]
  const slides = chapter.slideIds.map(id => v5Slides[getV5SlideIndex(id)])
  const firstPage = slides[0].num
  const lastPage = slides[slides.length - 1].num
  return {
    ...chapter, divider, slides,
    pageRange: firstPage === lastPage ? firstPage : `${firstPage}–${lastPage}`,
  }
})

export type V5Chapter = (typeof v5Chapters)[number]

export const v5MainChapters = v5Chapters.filter(chapter => chapter.id !== 'appendix')
