// KRW 100 million. Ordinary Korean for-profit corporate rates from tax years starting 2026.
// Sources: NTS cntntsId=7746; Anyang official 2026 local income tax guide key=482.
// Provisional model: taxable base = book profit; no NOL, credits, deferred tax or payment lag.
export const corporateTaxAssumptions = {
  effectiveYear: 2026,
  taxpayer: '일반 영리법인',
  thresholds: [2, 200, 3000],
  nationalRates: [.10, .20, .22, .25],
  localRates: [.01, .02, .022, .025],
  sourceNational: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7746',
  sourceLocal: 'https://www.anyang.go.kr/main/contents.do?key=482',
  status: '공식 세율 기반 1차 가정 · 법인별 과세표준=장부이익 · 공제·결손금·납부시차 0',
} as const

export function ordinaryCorporateTax(profit: number) {
  if (!Number.isFinite(profit)) throw new Error('Taxable profit must be finite')
  const taxable = Math.max(profit, 0)
  const brackets = [...corporateTaxAssumptions.thresholds, Infinity]
  let lower = 0, national = 0, local = 0
  brackets.forEach((upper, index) => {
    const amount = Math.max(0, Math.min(taxable, upper) - lower)
    national += amount * corporateTaxAssumptions.nationalRates[index]
    local += amount * corporateTaxAssumptions.localRates[index]
    lower = upper
  })
  return { national, local, total: national + local, taxable, effectiveRate: taxable > 0 ? (national + local) / taxable : 0 }
}
