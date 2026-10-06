import source from './waccData.json'

// Apply the supplied model's CAPM and target capital structure without fixing derived rates.
const unleveredBeta = source.peerBeta / (1 + (1 - source.taxRate) * source.peerDebtEquity)
const leveredBeta = unleveredBeta * (1 + (1 - source.taxRate) * source.targetDebtEquity)
const costOfEquity = source.rf + source.erp * leveredBeta + source.sizePremium
const afterTaxDebtCost = source.preTaxDebtCost * (1 - source.taxRate)
const equityWeight = 1 / (1 + source.targetDebtEquity)
const debtWeight = source.targetDebtEquity / (1 + source.targetDebtEquity)

export const waccModel = {
  ...source, unleveredBeta, leveredBeta, costOfEquity, afterTaxDebtCost, equityWeight, debtWeight,
  wacc: costOfEquity * equityWeight + afterTaxDebtCost * debtWeight,
}
