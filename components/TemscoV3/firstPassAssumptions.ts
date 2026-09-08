/** Editable first-pass assumptions. Rates are decimals; asset/expense amounts are 억 원.
 * Company source files are preserved. These are modeling assumptions pending replacement.
 */
export const firstPassAssumptions = {
  version: '2026-09-09 / 1차 가정',
  industry: {
    name: 'Electronics (General)', region: 'Global', firms: 1481, observedAt: '2026-01-05',
    ncwcToRevenue: .18422333239155061,
    rdToRevenue: .04250308100037906,
    ncwcSource: 'https://pages.stern.nyu.edu/~adamodar/pc/datasets/wcdataGlobal.xls',
    rdSource: 'https://pages.stern.nyu.edu/~adamodar/pc/datasets/marginGlobal.xls',
    definition: '업종 합산액 / 업종 합산 매출 · 국내 마스크 전용 평균과 구분',
  },
  depreciation: {
    existingEquipmentRemainingYears: 5,
    newEquipmentYears: 10, // 신규·유지 장비의 공통 상각기간
    finiteIntangibleYears: 5,
    existingBuildingRemainingYears: 40,
    newBuildingYears: 40,
    firstYearFraction: .5,
    residualValueRate: 0,
    landDepreciationRate: 0,
    constructionInProgressInService: false,
    note: '기존 순장부액의 잔여기간 가정 / 정액법 / 신규·유지 취득연도 반기 / 토지·미가동 CIP·영업권 제외',
    updateWith: '고정자산대장·취득일·실제 잔여내용연수·제조/판관 배부',
  },
  development: {
    assumedCapitalizedShare: .20,
    usefulLifeYears: 5,
    firstYearFraction: .5,
    alreadyIncludedInCompanyExpenseShare: 0,
    taxDeductionFollowsBookAmortization: true,
    note: '산업 R&D 강도 × 20%의 추가 자산화 지출 대용 / 20%는 분석 가정, 산업 자산화율 아님',
    updateWith: '프로젝트별 개발비 예산·자산인식 요건·개시일·세무 공제시점',
  },
  workingCapital: {
    scenarioMultipliers: { optimistic: .8, base: 1, pessimistic: 1.2 },
    openingMethod: '2025매출×산업NCWC율에서 중도2026말로 선형 보간한 공통 평가일 잔액',
    note: 'NCWC=(유동자산−현금)−(유동부채−단기이자부채) / 핵심3계정 방식과 중복 합산 제외',
    updateWith: '월별 영업유동자산·부채 명세 및 수금·재고·지급 계획',
  },
  equityBridge: {
    netDebtProxy: 235.10,
    nonControllingInterestProxy: 13.30,
    otherAdjustment: 0,
    balanceDate: '2025-12-31',
    note: '2025 수록잔액을 평가일 대용으로 사용 / NCI 장부가 대용·비영업 조정 0의 1차 가정',
    updateWith: '평가일 순차입금·비지배지분 가치·비영업자산·기타 청구권',
  },
} as const

export const assumedCapitalizedDevelopmentToRevenue = firstPassAssumptions.industry.rdToRevenue * firstPassAssumptions.development.assumedCapitalizedShare
