/** Observed listed-company benchmarks, not a selected TEMSCO fair-value multiple.
 * Full source captures/limitations: projects/temsco/v3/research/multiples-{global,korea}.{json,md}.
 * Each company is computed in its own currency; only the dimensionless ratio crosses currencies.
 */
export const dnpBenchmark = {
  name: 'DNP', ticker: '7912 / TSE', observationDate: '2026-03-31', financialDate: '2026-03-31',
  earningsPeriod: 'FY2026/3', currencyUnit: '백만 엔', price: 2827.5,
  issuedLessTreasuryShares: 431432864,
  equityValue: 2827.5 * 431432864 / 1e6,
  debtIncludingFinanceLeases: 281727,
  nonControllingBookProxy: 76602,
  cashEquivalents: 243565,
  ebit: 101039,
  role: '역사적 관측 앵커 · 확정 적용배수 아님',
}
export const dnpEnterpriseValue = dnpBenchmark.equityValue + dnpBenchmark.debtIncludingFinanceLeases + dnpBenchmark.nonControllingBookProxy - dnpBenchmark.cashEquivalents
export const dnpEvEbit = dnpEnterpriseValue / dnpBenchmark.ebit

export const nanoBenchmark = {
  name: '나노신소재', ticker: '121600 / KOSDAQ', observationDate: '2026-09-08', financialDate: '2026-06-30',
  earningsPeriod: 'LTM 2026/6', currencyUnit: '억 원', price: 46250,
  issuedShares: 12262191, treasuryShares: 220206,
  equityValue: 46250 * (12262191 - 220206) / 1e8,
  debtFaceProxy: 100 + 620 + 335,
  leases: 1177286787 / 1e8,
  cash: 73208146998 / 1e8,
  shortTermFinancialAssets: 858.30,
  ebit: 10636867627 / 1e8,
  role: '사업 구성 차이에 대한 대체 앵커 · 상단 가치 확정 아님',
}
export const nanoEnterpriseValue = nanoBenchmark.equityValue + nanoBenchmark.debtFaceProxy + nanoBenchmark.leases - nanoBenchmark.cash - nanoBenchmark.shortTermFinancialAssets
export const nanoEvEbit = nanoEnterpriseValue / nanoBenchmark.ebit
