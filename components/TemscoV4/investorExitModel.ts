import data from './valuationData.json'
import { baseValuation, scenarioValuations, type ValuationResult } from './valuationModel'
import { exitMultiple } from './valuationInputs'

/** All amounts: KRW 100 million. Exit dates/pricing/costs below are analyst planning assumptions. */
export const investorExitAssumptions = {
  investment: 70,
  investmentYear: 2026,
  entryPreMoney: baseValuation.consolidatedEquity,
  subsequentDilution: 0.20,
  ipoPrimaryShare: 0.20,
  ipoTargetYear: 2031,
  ipoRealizationYear: 2032,
  saleYear: 2031,
  transactionCostRate: 0.02,
  dividends: 0,
  ipoMultipleFactors: [0.60, 0.70, 0.80],
  saleMultipleFactors: [0.50, 0.60, 0.70],
  buybackAnnualRates: [0.08, 0.10, 0.12],
  buybackPricingYears: 5,
  buybackNoticeDays: 90,
  buybackPaymentDays: 180,
} as const

export const entryInvestorShare = investorExitAssumptions.investment / (investorExitAssumptions.entryPreMoney + investorExitAssumptions.investment)
export const preIpoInvestorShare = entryInvestorShare * (1 - investorExitAssumptions.subsequentDilution)
export const postIpoInvestorShare = preIpoInvestorShare * (1 - investorExitAssumptions.ipoPrimaryShare)

export function investorReturn(grossProceeds: number, years: number, investment = investorExitAssumptions.investment) {
  const costs = grossProceeds * investorExitAssumptions.transactionCostRate
  const netProceeds = grossProceeds - costs + investorExitAssumptions.dividends
  const profit = netProceeds - investment
  const moic = netProceeds / investment
  return { grossProceeds, costs, netProceeds, profit, moic, irr: Math.pow(moic, 1 / years) - 1 }
}

/** Future enterprise value, NOT 2026 PV. 2025 net debt held constant as an explicit proxy.
 * Funding proceeds assumed deployed; no accumulation of FCFF/new cash in the bridge.
 * Same terminal EBIT/multiple applied to subsidiary NCI; investment book value never added.
 */
export function futureOwnerValue(valuation: ValuationResult, multiple: number) {
  const groupEv = valuation.consolidated.terminalEbit * multiple
  const subsidiaryEv = valuation.subsidiary.terminalEbit * multiple
  const subsidiaryEquity = Math.max(0, subsidiaryEv - valuation.subsidiary.netDebt)
  const nci = subsidiaryEquity * data.ownership.nci
  const ownerEquity = Math.max(0, groupEv - valuation.consolidated.netDebt - nci)
  return { groupEv, subsidiaryEv, subsidiaryEquity, nci, ownerEquity }
}

export function calculateInvestorExitCases(appliedMultiple: number | null = exitMultiple) {
  if (appliedMultiple !== null && (!Number.isFinite(appliedMultiple) || appliedMultiple <= 0)) throw new Error('Exit multiple must be positive or unavailable')
  return scenarioValuations.map((valuation, index) => {
  const a = investorExitAssumptions
  const ipoMultiple = appliedMultiple === null ? null : appliedMultiple * a.ipoMultipleFactors[index]
  const saleMultiple = appliedMultiple === null ? null : appliedMultiple * a.saleMultipleFactors[index]
  const ipoBeforeOffering = ipoMultiple === null ? null : futureOwnerValue(valuation, ipoMultiple)
  // Same issue price per share. New primary cash increases owner equity and share count together.
  const listingMarketCap = ipoBeforeOffering === null ? null : ipoBeforeOffering.ownerEquity / (1 - a.ipoPrimaryShare)
  const primaryOffering = listingMarketCap === null ? null : listingMarketCap * a.ipoPrimaryShare
  const sale = saleMultiple === null ? null : futureOwnerValue(valuation, saleMultiple)
  const buybackPrice = a.investment * Math.pow(1 + a.buybackAnnualRates[index], a.buybackPricingYears) - a.dividends
  const buybackReturn = investorReturn(buybackPrice, a.buybackPricingYears)
  return {
    scenario: valuation.scenario.id, label: valuation.scenario.label,
    normalizedGroupEbit: valuation.consolidated.terminalEbit,
    normalizedSubsidiaryEbit: valuation.subsidiary.terminalEbit,
    ipo: ipoBeforeOffering === null || listingMarketCap === null || primaryOffering === null || ipoMultiple === null ? null : { ...ipoBeforeOffering, multiple: ipoMultiple, listingMarketCap, primaryOffering,
      ...investorReturn(listingMarketCap * postIpoInvestorShare, a.ipoRealizationYear - a.investmentYear) },
    sale: sale === null || saleMultiple === null ? null : { ...sale, multiple: saleMultiple,
      ...investorReturn(sale.ownerEquity * preIpoInvestorShare, a.saleYear - a.investmentYear) },
    // Five-year price illustration only. Actual payment may follow notice/settlement periods.
    // No displayed IRR: settlement delay changes realized annualized return.
    buyback: { annualPricingRate: a.buybackAnnualRates[index],
      grossProceeds: buybackReturn.grossProceeds, costs: buybackReturn.costs,
      netProceeds: buybackReturn.netProceeds, profit: buybackReturn.profit, moic: buybackReturn.moic },
  }
  })
}

export const investorExitCases = calculateInvestorExitCases()
