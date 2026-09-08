// Primary-market observations and published research, collected 2026-09-08.
// Full provenance and observation dates: projects/temsco/v3/research/wacc.json.
import { calculateWacc } from './valuation'
export const marketInputs = {
  governmentYield: .04390, // KIS KRW government ten-year, 2026-09-07
  sovereignDefaultSpread: .003930214513416281,
  matureErp: .0414, // September implied ERP converted using NYU's current country-risk method; see erp-method-review.md.
  countryRiskPremium: .00610950087834357, // NYU Korea 2026-07-01, July 9 corrected
  taxRate: .22, // 2026 marginal bracket: national 20% plus local 2%, conditional
}
export const industryProxies = [
  { name: 'Electronics (General)', label: '전자부품 업종 참고', betaUnlevered: 1.57, debtEquity: .1417, firms: 1481 },
  { name: 'Chemical (Specialty)', label: '특수화학 업종 참고', betaUnlevered: 1.04, debtEquity: .2352, firms: 952 },
]
export const debtProxies = [
  { label: 'AA− / 10년', debtCost: .05899 },
  { label: 'BBB− / 10년', debtCost: .11458 },
]
export const waccReferences = industryProxies.flatMap(industry => debtProxies.map(debt => ({
  ...industry, ...debt, rating: debt.label,
  ...calculateWacc({ ...marketInputs, ...industry, ...debt }),
})))
