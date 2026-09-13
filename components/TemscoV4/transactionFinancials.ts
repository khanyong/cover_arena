// KRW amounts from the provided 2026E workbooks, read 2026-09-13.
// Cached company forecasts; no actual-cash or acquisition-increment inference.
export const transactionSources = {
  parent: {
    revenue: 40_000_000_000, cost: 33_200_000_000, sga: 2_648_159_951.7200003,
    maskRevenue: 16_000_000_000, maskCost: 12_800_000_000,
    materialRevenue: 24_000_000_000, materialCost: 20_400_000_000,
    netIncome: 2_469_283_142.2584,
    reference: '템스코 추정손익!L7/L11/L19/L31, M7/M11, N7/N11',
  },
  subsidiary: {
    revenue: 14_000_000_000, cost: 15_595_163_681, sga: 1_227_070_817,
    salesToParent: 9_156_298_904, directMaterialCost: 2_156_403_434,
    netIncome: -3_029_881_038,
    reference: '위폼스 추정손익!G5/G6/G9/G10/G17/G31',
  },
  rawMaterialSales: 3_380_941_200,
  adjustment: {
    sales: -12_537_240_104, cost: -12_537_240_104, sga: 0,
    reference: '연결 양식: 연결조정 내역!G7/G9/G10, 연결!N10:Q34',
  },
}

export type ProfitRow = {
  label: string
  revenue: number
  cost: number
  grossProfit: number
  sga: number
  operatingProfit: number
}

const row = (label: string, revenue: number, cost: number, sga: number): ProfitRow => ({
  label, revenue, cost, grossProfit: revenue - cost, sga, operatingProfit: revenue - cost - sga,
})

export function buildTransactionFinancials(source: typeof transactionSources = transactionSources) {
  const { parent: p, subsidiary: w, adjustment: a } = source
  const materialMargin = 1 - p.materialCost / p.materialRevenue
  const rawCost = source.rawMaterialSales * (1 - materialMargin)
  const parentRows = [
    row('① 원재료 → 위폼스', source.rawMaterialSales, rawCost, p.sga * source.rawMaterialSales / p.revenue),
    row('② 마스크부문 전체', p.maskRevenue, p.maskCost, p.sga * p.maskRevenue / p.revenue),
    row('기타 소재사업', p.materialRevenue - source.rawMaterialSales, p.materialCost - rawCost,
      p.sga * (p.materialRevenue - source.rawMaterialSales) / p.revenue),
  ]
  const subsidiaryShare = w.salesToParent / w.revenue
  const subsidiaryRows = [
    row('② 마스크 → 템스코', w.salesToParent, w.cost * subsidiaryShare, w.sga * subsidiaryShare),
    row('기타 고객 거래', w.revenue - w.salesToParent, w.cost * (1 - subsidiaryShare), w.sga * (1 - subsidiaryShare)),
  ]
  return {
    parentRows, subsidiaryRows, materialMargin, subsidiaryShare,
    parentTotal: row('전사 합계 · 원본', p.revenue, p.cost, p.sga),
    subsidiaryTotal: row('전사 합계 · 원본', w.revenue, w.cost, w.sga),
    consolidated: row('연결 합계 · 원본', p.revenue + w.revenue + a.sales, p.cost + w.cost + a.cost, p.sga + w.sga + a.sga),
    consolidatedNetIncome: p.netIncome + w.netIncome,
    adjustmentProfit: a.sales - a.cost - a.sga,
    materialReconciliationGap: source.rawMaterialSales - w.directMaterialCost,
  }
}

export const transactionFinancials = buildTransactionFinancials()
export const inEok = (won: number) => won / 100_000_000
export const formatEok = (won: number) => inEok(won).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
