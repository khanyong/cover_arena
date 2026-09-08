export const contentTitles = [
  '자본 확충 및 연결 수익성 회복', '목차 및 분석 범위',
  '투자 검토 핵심', '위폼스 인수 목적 및 판단 근거', '인수 전후 매출 및 수익성 추이', '위폼스 영업손익 변동 요인', '대손 조정 및 연결 수익성', '재무구조 및 유동성', '내부거래 제거 및 연결 매출',
  '시장 범위 및 매출 정의', '동종산업 경쟁사 비교', '시장 전망 및 점유율 검증', '시장 기반 매출 추정', '연결 추정손익계산서', '위폼스 수익성 회복 가정',
  'DCF 평가 기준', 'WACC 시장 입력', '베타 및 자본구조', 'FCFF 산출', '1차 재무가정 및 재투자', '무성장 잔존가치', '기업가치 및 주주가치', '무성장 TV 단일변수 검토',
  '상장 비교기업 선정 및 비교', '비교기업 멀티플 산정', '세 가지 시나리오 및 주요 가정', '낙관안 추정손익 및 현금흐름', '중도안 추정손익 및 현금흐름', '비관안 추정손익 및 현금흐름', 'DCF·멀티플 교차가치', '평가방식 간 차이 및 변수 민감도',
  '70억 투자금 사용안', '신주 납입 및 재무구조 변화', '단계별 투자유치 계획', '지분 희석 및 회수 분석', '투자 집행 및 연결 현금흐름', '자회사 수익성 민감도', '투자조건 및 집행 기준', '자료 출처 및 가정 검토',
]

const chapterDefinitions = [
  { numeral: 'I', heading: '과거 실적 및 인수 판단', lines: ['과거 실적 및', '인수 판단'], contentStart: 2, contentEnd: 8, detail: '인수 목적 / 사후 성과 / 손실·정상화 / 재무구조 / 연결조정', topics: ['인수 목적 및 경제적 효과', '인수 전후 실적 및 손실 요인', '대손 조정 및 유동성', '내부거래 제거 및 연결 매출'] },
  { numeral: 'II', heading: '시장 분석 및 추정손익', lines: ['시장 분석 및', '추정손익'], contentStart: 9, contentEnd: 14, detail: '시장 범위 / 경쟁사 / 시장 규모·점유율 / 매출 / 추정손익', topics: ['제품별 시장 및 경쟁사', '시장 전망 및 점유율 검증', '매출 추정 및 연결 손익', '자회사 수익성 회복 가정'] },
  { numeral: 'III', heading: '가치추정 분석', lines: ['가치추정 분석'], contentStart: 15, contentEnd: 30, detail: 'WACC / FCFF / 무성장 TV / 비교기업 / 3개 시나리오 / DCF·멀티플', topics: ['평가 기준·WACC·FCFF', '비교기업 선정 및 관측 멀티플', '낙관안·중도안·비관안', '교차가치·평가 차이·민감도'] },
  { numeral: 'IV', heading: '투자유치 및 자금 회수', lines: ['투자유치 및', '자금 회수'], contentStart: 31, contentEnd: 37, detail: '자금배분 / 납입 효과 / Series A·B·C / 희석 / 집행 기준', topics: ['투자금 배분 및 납입 효과', 'Series A·B·C 및 지분 희석', '자회사 효과 및 현금 회수', '투자조건 및 집행 기준'] },
  { numeral: 'V', heading: '자료 출처 및 가정 검토', lines: ['자료 출처 및', '가정 검토'], contentStart: 38, contentEnd: 38, detail: '시장 관측값 / 회사 계획 / 분석 가정 / 가치 확정', topics: ['시장 관측값 및 공개 연구', '회사 자료 및 추정 계획', '분석 가정 및 검증 항목', '가치 확정에 필요한 자료'] },
]

// Display-page indices include one divider before each chapter.
export const chapters = chapterDefinitions.map((chapter, index) => ({
  ...chapter,
  title: `${chapter.numeral}. ${chapter.heading}`,
  start: chapter.contentStart + index,
  end: chapter.contentEnd + index + 1,
}))

export const pageForContent = (index: number) => index + chapters.filter(chapter => chapter.contentStart <= index).length

export const outline = contentTitles.flatMap((title, index) => {
  const chapter = chapters.find(item => item.contentStart === index)
  return chapter ? [chapter.title, title] : [title]
})
