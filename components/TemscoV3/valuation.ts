// All rate inputs are decimals. g=0 is the user's explicit terminal policy.
export const terminalGrowth = 0 as const
export const valuationDate = '2026-09-08'

export type WaccInputs = {
  governmentYield: number; sovereignDefaultSpread: number; matureErp: number;
  countryRiskPremium: number; betaUnlevered: number; debtEquity: number;
  debtCost: number; taxRate: number;
}
export function calculateWacc(input: WaccInputs) {
  const fields = [input.governmentYield, input.sovereignDefaultSpread, input.matureErp, input.countryRiskPremium, input.betaUnlevered, input.debtEquity, input.debtCost, input.taxRate]
  if (fields.some(v => !Number.isFinite(v)) || input.debtEquity < 0 || input.taxRate < 0 || input.taxRate > 1 || input.debtCost < 0 || input.betaUnlevered < 0) throw new Error('Invalid WACC inputs')
  const riskFree = input.governmentYield - input.sovereignDefaultSpread
  const betaLevered = input.betaUnlevered * (1 + (1 - input.taxRate) * input.debtEquity)
  // A country exposure of one is a disclosed reference assumption, not a measured company exposure.
  const equityCost = riskFree + betaLevered * input.matureErp + input.countryRiskPremium
  const equityWeight = 1 / (1 + input.debtEquity)
  const debtWeight = 1 - equityWeight
  const wacc = equityCost * equityWeight + input.debtCost * (1 - input.taxRate) * debtWeight
  return { riskFree, betaLevered, equityCost, equityWeight, debtWeight, wacc }
}

export type CashFlowPeriod = {
  label: string; cashDate: string; ebit: number | null; cashOperatingTax: number | null;
  depreciation: number | null; capex: number | null; capitalizedDevelopment: number | null;
  deltaOperatingWorkingCapital: number | null;
}
export function calculateFcff(period: CashFlowPeriod): number | null {
  const fields = [period.ebit, period.cashOperatingTax, period.depreciation, period.capex, period.capitalizedDevelopment, period.deltaOperatingWorkingCapital]
  if (fields.some(value => value === null || !Number.isFinite(value))) return null
  return period.ebit! - period.cashOperatingTax! + period.depreciation! - period.capex! - period.capitalizedDevelopment! - period.deltaOperatingWorkingCapital!
}
export function zeroGrowthTerminal(normalizedFcff: number, terminalWacc: number) {
  if (!Number.isFinite(normalizedFcff) || !Number.isFinite(terminalWacc) || terminalWacc <= 0) throw new Error('Invalid terminal inputs')
  return normalizedFcff / terminalWacc
}
function strictDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid calendar date')
  const parsed = Date.parse(`${date}T00:00:00Z`)
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0, 10) !== date) throw new Error('Invalid calendar date')
  return parsed
}
export function discountDcf(periods: CashFlowPeriod[], asOf: string, wacc: number, terminalDate: string, normalizedFcff: number | null) {
  if (!Number.isFinite(wacc) || wacc <= 0) throw new Error('Invalid discount rate')
  const start = strictDate(asOf)
  const terminalTime = strictDate(terminalDate)
  if (!Number.isFinite(start) || !Number.isFinite(terminalTime) || terminalTime <= start) throw new Error('Invalid valuation dates')
  const missing = periods.filter(p => calculateFcff(p) === null).map(p => p.label)
  if (normalizedFcff === null) missing.push('정상화 잔존 FCFF')
  if (missing.length) return { status: 'incomplete' as const, missing, enterpriseValue: null }
  const presentCash = periods.reduce((sum, period) => {
    const date = strictDate(period.cashDate)
    if (!Number.isFinite(date) || date <= start || date > terminalTime) throw new Error('Cash flow lies outside the forecast period')
    return sum + calculateFcff(period)! / (1 + wacc) ** ((date - start) / 86400000 / 365)
  }, 0)
  const presentTerminal = zeroGrowthTerminal(normalizedFcff!, wacc) / (1 + wacc) ** ((terminalTime - start) / 86400000 / 365)
  return { status: 'calculated' as const, missing, enterpriseValue: presentCash + presentTerminal, presentCash, presentTerminal }
}

// Apply to each monthly cumulative path, rather than only to a profitable year-end balance.
export function fundingNeed(openingCash: number, netCashFlowBeforeFinancing: number, minimumCash: number) {
  if (![openingCash, netCashFlowBeforeFinancing, minimumCash].every(Number.isFinite) || minimumCash < 0) throw new Error('Invalid financing inputs')
  return Math.max(0, minimumCash - (openingCash + netCashFlowBeforeFinancing))
}
export function ownershipAfterRound(preRoundOwnership: number, preMoney: number, newPrimaryCapital: number) {
  if (![preRoundOwnership, preMoney, newPrimaryCapital].every(Number.isFinite) || preMoney <= 0 || newPrimaryCapital < 0 || preRoundOwnership < 0 || preRoundOwnership > 1) throw new Error('Invalid financing assumptions')
  return preRoundOwnership * preMoney / (preMoney + newPrimaryCapital)
}
