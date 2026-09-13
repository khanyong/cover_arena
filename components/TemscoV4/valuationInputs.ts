import data from './valuationData.json'

export const valuationDate = '2026-09-13'
// Four company-plan years (2026–2029); only the remaining 2026 stub is valued.
export const companyForecastEndYear = 2029
export const forecastEndYear = companyForecastEndYear
export const terminalCashFlowYear = forecastEndYear + 1
export const residualDays2026 = 109
export const residualFraction2026 = residualDays2026 / 365
export const baseWacc = data.market.wacc.selectedModelConvention.wacc
export const ncwcRatio = data.market.industry.ncwcToRevenue
export const developmentRatio = data.market.industry.rdToRevenue * 0.20
// OMM review (2026-09-13): DNP group EV/EBIT is not an eligible OMM peer multiple.
// A missing peer input must remain unavailable, never zero or an inherited DNP value.
export const exitMultiple: number | null = null
export const exitMultipleBasis = {
  status: 'pending-omm-peer-verification',
  priorityPeer: '핌스',
  productPeers: ['핌스', '풍원정밀', '세우인코퍼레이션'],
  excludedAppliedPeer: 'DNP',
  reason: 'OMM 대상 사업과 DNP 전사 사업·이익 범위 불일치. 비교기업 EV·이익 및 매출 분모 대사 후 재산정.',
} as const

export const firstPassAssumptions = {
  openingAssetPools: data.assetPools,
  growthAssetPlan: data.growthAssetPlan as { company: 'parent' | 'subsidiary'; year: number; assetClass: 'land' | 'building' | 'equipment'; cost: number }[],
  depreciation: {
    residualValueRate: 0, landDepreciationRate: 0,
    constructionInProgressInService: false,
    existingEquipmentRemainingYears: 5, newEquipmentYears: 10,
    existingBuildingRemainingYears: 40, newBuildingYears: 40,
    finiteIntangibleYears: 5, firstYearFraction: 0.5,
  },
  development: { usefulLifeYears: 5, firstYearFraction: 0.5 },
}
