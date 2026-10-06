import inputs from './shareCapitalData.json'
import data from './valuationData.json'
import { baseValuation, type ValuationResult } from './valuationModel'

export const shareCapital = inputs
export const basicShareBasis = '발행주식수 기준 · 동일권리 단순환산 · 자기주식 미조정'

/** Equity is in KRW 100 million; issued shares are a count, not nominal capital. */
export function basicValuePerShare(equity: number | null, issuedShares: number): number | null {
  if (!Number.isSafeInteger(issuedShares) || issuedShares <= 0) throw new Error('Invalid issued share count')
  if (equity === null) return null
  if (!Number.isFinite(equity)) throw new Error('Invalid equity value')
  return equity * 100_000_000 / issuedShares
}

export function calculateShareValues(valuation: ValuationResult = baseValuation) {
  const dilutedShareCount = (issued: number, potential: number) => {
    if (!Number.isSafeInteger(potential) || potential < 0) throw new Error('Invalid potential share count')
    return issued + potential
  }
  const parentDilutedShares = dilutedShareCount(inputs.parent.issuedShares, inputs.parent.potentialShares)
  const subsidiaryDilutedShares = dilutedShareCount(inputs.subsidiary.issuedShares, inputs.subsidiary.potentialShares)
  return {
    parentDilutedShares,
    subsidiaryDilutedShares,
    parentNominalCapitalKRW: inputs.parent.parValueKRW * inputs.parent.issuedShares,
    subsidiaryNominalCapitalKRW: inputs.subsidiary.parValueKRW * inputs.subsidiary.issuedShares,
    heldSubsidiaryShares: inputs.subsidiary.issuedShares * data.ownership.parent,
    nonControllingShares: inputs.subsidiary.issuedShares * data.ownership.nci,
    parentSotp: basicValuePerShare(valuation.parentSotp, inputs.parent.issuedShares),
    consolidatedOwner: basicValuePerShare(valuation.consolidatedEquity, inputs.parent.issuedShares),
    subsidiary: basicValuePerShare(valuation.subsidiaryEquity, inputs.subsidiary.issuedShares),
    dilutedParentSotp: basicValuePerShare(valuation.parentSotp, parentDilutedShares),
    dilutedConsolidatedOwner: basicValuePerShare(valuation.consolidatedEquity, parentDilutedShares),
    dilutedSubsidiary: basicValuePerShare(valuation.subsidiaryEquity, subsidiaryDilutedShares),
    multipleParentSotp: basicValuePerShare(valuation.multipleParentSotp, inputs.parent.issuedShares),
    multipleConsolidatedOwner: basicValuePerShare(valuation.multipleConsolidatedEquity, inputs.parent.issuedShares),
    multipleSubsidiary: basicValuePerShare(valuation.subsidiary.multipleRawEquity === null ? null : Math.max(0, valuation.subsidiary.multipleRawEquity), inputs.subsidiary.issuedShares),
  }
}

export const baseShareValues = calculateShareValues()
