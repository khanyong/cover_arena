import data from './valuationData.json'
import { buildReinvestmentSchedule } from './valuationReinvestment'
import { baseWacc, ncwcRatio, developmentRatio, exitMultiple, residualFraction2026, valuationDate, forecastEndYear, terminalCashFlowYear } from './valuationInputs'

export type Entity = 'parent' | 'subsidiary' | 'consolidated'
export type ScenarioId = 'downside' | 'base' | 'upside'
export const labels: Record<Entity, string> = { parent: '템스코 별도', subsidiary: '위폼스 별도', consolidated: '연결' }
export const years = Array.from({ length: forecastEndYear - 2026 + 1 }, (_, i) => 2026 + i)
export const scenarios = [
  { id: 'downside' as const, label: '비관안', growthCapture: 0.75, wacc: baseWacc + 0.015, nwcFactor: 1.2 },
  { id: 'base' as const, label: '중도안', growthCapture: 1, wacc: baseWacc, nwcFactor: 1 },
  { id: 'upside' as const, label: '낙관안', growthCapture: 1.15, wacc: baseWacc - 0.015, nwcFactor: 0.8 },
]
export type Scenario = typeof scenarios[number]
export function sourceRow(entity: Entity, year: number) {
  const row = data.entities[entity].income.find(row => row.year === year)
  if (!row) throw new Error(`Missing V4 source ${entity}/${year}`)
  return row
}
/** Explicit forecasts use company-plan years only; later cash flows enter through terminal value. */
export function forecastBasis(entity: Entity, year: number) {
  if (year > forecastEndYear) throw new Error(`Year outside explicit forecast: ${year}`)
  return {
    ...sourceRow(entity, year), year, referenceYear: year,
    inputBasis: 'companyForecast' as const,
  }
}
function required(value: number | null, label: string): number {
  if (value === null || !Number.isFinite(value)) throw new Error(`Missing numeric input: ${label}`)
  return value
}
export function taxOnOperatingProfit(profit: number) {
  // 억원: 2억원 / 200억원 / 3,000억원. 법인별 일반 법인세 + 지방소득세.
  const p = Math.max(0, profit)
  return Math.min(p, 2) * .11 + Math.min(Math.max(0, p - 2), 198) * .22 + Math.min(Math.max(0, p - 200), 2800) * .242 + Math.max(0, p - 3000) * .275
}
export type ForecastYear = {
  year: number; inputBasis: 'companyForecast'; referenceYear: number; revenue: number; sourceRevenue: number; sourceEbit: number;
  scenarioEbitBeforeDa: number; daRemovedProxy: number; modeledDa: number; ebit: number;
  operatingTax: number; nopat: number; maintenance: number; growthCapex: number;
  development: number; developmentAmortization: number; nonDevelopmentDa: number;
  annualNwc: number; deltaNwc: number; periodFraction: number; fcff: number; discountYears: number; discountFactor: number; pv: number;
}
export type EntityValuation = {
  entity: Entity; rows: ForecastYear[]; terminalYear: number; terminalCashFlowYear: number; terminalEbit: number; terminalTax: number; terminalFcff: number;
  terminalValue: number; pvTerminal: number; pvExplicit: number; ev: number; terminalShare: number;
  exitTerminalValue: number | null; exitPvTerminal: number | null; multipleEv: number | null; gap: number | null; gapRate: number | null;
  netDebt: number; rawEquity: number; multipleRawEquity: number | null;
}
export type ValuationResult = {
  scenario: Scenario; parent: EntityValuation; subsidiary: EntityValuation; consolidated: EntityValuation;
  subsidiaryEquity: number; subsidiaryFloorAdjustment: number; nci: number; parentHolding: number;
  consolidatedEquity: number; parentSotp: number; scopeGap: number;
  multipleNci: number | null; multipleParentHolding: number | null; multipleConsolidatedEquity: number | null; multipleParentSotp: number | null;
}
export type Overrides = { wacc?: number; terminalProfitFactor?: number; remainingGrowthCapexFraction?: number; daProxyFactor?: number; exitMultiple?: number | null }

/** Unrounded V4 company inputs for 2026–2029; normalized g=0 cash flows from 2030. KRW 100 million. */
export function calculateValuation(id: ScenarioId = 'base', overrides: Overrides = {}): ValuationResult {
  const original = scenarios.find(s => s.id === id)!
  const scenario = { ...original, wacc: overrides.wacc ?? original.wacc }
  if (!(scenario.wacc > 0)) throw new Error('WACC must be positive')
  const appliedMultiple = overrides.exitMultiple === undefined ? exitMultiple : overrides.exitMultiple
  if (appliedMultiple !== null && (!Number.isFinite(appliedMultiple) || appliedMultiple <= 0)) throw new Error('Exit multiple must be positive or unavailable')
  const growthRemaining = overrides.remainingGrowthCapexFraction ?? 1
  if (growthRemaining < 0 || growthRemaining > 1) throw new Error('Remaining capex fraction outside [0,1]')
  const companyRevenue = (entity: Entity, year: number) => required(forecastBasis(entity, year).revenue, 'revenue')
  const scenarioRevenue = (entity: Entity, year: number) => {
    const start = companyRevenue(entity, 2026)
    return start + (companyRevenue(entity, year) - start) * scenario.growthCapture
  }
  // Group development is allocated to entities by source revenue, but based on external sales only.
  const developmentByYear = Object.fromEntries(years.map(year => {
    const parent = scenarioRevenue('parent', year), sub = scenarioRevenue('subsidiary', year)
    const spend = scenarioRevenue('consolidated', year) * developmentRatio
    return [year, { parent: spend * parent / (parent + sub), subsidiary: spend * sub / (parent + sub) }]
  }))
  const assets = buildReinvestmentSchedule({ developmentByYear, endYear: forecastEndYear })
  const annual = {} as Record<Entity, ForecastYear[]>
  for (const entity of ['parent', 'subsidiary'] as const) {
    // Same opening NWC across scenarios. September balances unknown; interpolate industry proxy.
    const opening = (companyRevenue(entity, 2025) + (companyRevenue(entity, 2026) - companyRevenue(entity, 2025)) * (1 - residualFraction2026)) * ncwcRatio
    let previousNwc = opening
    annual[entity] = years.map((year, index) => {
      const src = forecastBasis(entity, year)
      const revenue = scenarioRevenue(entity, year)
      const factor = revenue / companyRevenue(entity, year)
      const proxy = data.depreciationProxy.find(row => row.year === src.referenceYear)
      if (!proxy) throw new Error(`Missing D&A proxy: ${entity}/${src.referenceYear}`)
      const daRemovedProxy = proxy[entity] * (overrides.daProxyFactor ?? 1)
      const sourceEbit = required(src.ebit, 'EBIT')
      // Preserve source cash margin; fixed salary, other cash costs scale with revenue.
      const salary = required(src.sgaSalary, 'salary')
      const cashEbit = (sourceEbit + daRemovedProxy + salary) * factor - salary
      const reinvest = assets[index][entity]
      const ebit = cashEbit - reinvest.modeledDa
      const operatingTax = taxOnOperatingProfit(ebit)
      const annualNwc = revenue * ncwcRatio * scenario.nwcFactor
      const deltaNwc = annualNwc - previousNwc
      previousNwc = annualNwc
      const periodFraction = year === 2026 ? residualFraction2026 : 1
      const discountYears = (Date.parse(`${year}-12-31T00:00:00Z`) - Date.parse(`${valuationDate}T00:00:00Z`)) / 86400000 / 365
      const discountFactor = Math.pow(1 + scenario.wacc, -discountYears)
      const fcff = (ebit - operatingTax + reinvest.modeledDa - reinvest.maintenanceCashCapex - reinvest.capitalizedDevelopmentAnnual) * periodFraction - reinvest.plannedGrowthCapex * (year === 2026 ? growthRemaining : 1) - deltaNwc
      return { year, inputBasis: src.inputBasis, referenceYear: src.referenceYear, revenue, sourceRevenue: required(src.revenue, 'revenue'), sourceEbit, scenarioEbitBeforeDa: cashEbit - daRemovedProxy, daRemovedProxy, modeledDa: reinvest.modeledDa, ebit, operatingTax, nopat: ebit - operatingTax, maintenance: reinvest.maintenanceCashCapex, growthCapex: reinvest.plannedGrowthCapex, development: reinvest.capitalizedDevelopmentAnnual, developmentAmortization: reinvest.developmentAmortization, nonDevelopmentDa: reinvest.nonDevelopmentDa, annualNwc, deltaNwc, periodFraction, fcff, discountYears, discountFactor, pv: fcff * discountFactor }
    })
  }
  let priorGroupNwc = (companyRevenue('consolidated', 2025) + (companyRevenue('consolidated', 2026) - companyRevenue('consolidated', 2025)) * (1 - residualFraction2026)) * ncwcRatio
  annual.consolidated = years.map((year, i) => {
    const p = annual.parent[i], s = annual.subsidiary[i]
    const revenue = scenarioRevenue('consolidated', year)
    const annualNwc = revenue * ncwcRatio * scenario.nwcFactor
    const deltaNwc = annualNwc - priorGroupNwc
    priorGroupNwc = annualNwc
    const sumKeys = ['daRemovedProxy', 'modeledDa', 'ebit', 'operatingTax', 'nopat', 'maintenance', 'growthCapex', 'development', 'developmentAmortization', 'nonDevelopmentDa', 'scenarioEbitBeforeDa'] as const
    const sums = Object.fromEntries(sumKeys.map(key => [key, p[key] + s[key]])) as Pick<ForecastYear, typeof sumKeys[number]>
    const fcff = p.fcff + s.fcff + p.deltaNwc + s.deltaNwc - deltaNwc
    return { ...p, ...sums, sourceRevenue: companyRevenue('consolidated', year), sourceEbit: required(forecastBasis('consolidated', year).ebit, 'group EBIT'), revenue, annualNwc, deltaNwc, fcff, pv: fcff * p.discountFactor }
  })
  const valuations = {} as Record<Entity, EntityValuation>
  for (const entity of ['parent', 'subsidiary', 'consolidated'] as const) {
    const rows = annual[entity], last = rows[rows.length - 1]
    let terminalEbit: number, terminalTax: number
    if (entity === 'consolidated') {
      terminalEbit = valuations.parent.terminalEbit + valuations.subsidiary.terminalEbit
      terminalTax = valuations.parent.terminalTax + valuations.subsidiary.terminalTax
    } else {
      const marginCap = required(sourceRow(entity, 2028).ebit, '2028 EBIT') / companyRevenue(entity, 2028)
      // Immediate steady state from 2030, not a further explicit asset-cohort forecast.
      // Mature annual development amortization equals recurring development cash spending at g=0.
      terminalEbit = (Math.min(last.ebit + last.developmentAmortization, last.revenue * marginCap) - last.development) * (overrides.terminalProfitFactor ?? 1)
      terminalTax = taxOnOperatingProfit(terminalEbit)
    }
    const terminalFcff = terminalEbit - terminalTax
    const terminalValue = terminalFcff / scenario.wacc
    const pvTerminal = terminalValue * last.discountFactor
    const pvExplicit = rows.reduce((sum, row) => sum + row.pv, 0)
    const ev = pvExplicit + pvTerminal
    // Exit-multiple cross-check shares explicit forecast cash flows with DCF; terminal methods are alternatives.
    const exitTerminalValue = appliedMultiple === null ? null : terminalEbit * appliedMultiple
    const exitPvTerminal = exitTerminalValue === null ? null : exitTerminalValue * last.discountFactor
    const multipleEv = exitPvTerminal === null ? null : pvExplicit + exitPvTerminal
    const netDebt = data.entities[entity].balance2025.netDebt
    valuations[entity] = { entity, rows, terminalYear: forecastEndYear, terminalCashFlowYear, terminalEbit, terminalTax, terminalFcff, terminalValue, pvTerminal, pvExplicit, ev, terminalShare: ev === 0 ? 0 : pvTerminal / ev, exitTerminalValue, exitPvTerminal, multipleEv, gap: multipleEv === null ? null : multipleEv - ev, gapRate: multipleEv === null || ev === 0 ? null : multipleEv / ev - 1, netDebt, rawEquity: ev - netDebt, multipleRawEquity: multipleEv === null ? null : multipleEv - netDebt }
  }
  const { parent, subsidiary, consolidated } = valuations
  const subsidiaryEquity = Math.max(0, subsidiary.rawEquity)
  const subsidiaryFloorAdjustment = subsidiaryEquity - subsidiary.rawEquity
  const parentHolding = subsidiaryEquity * data.ownership.parent
  const nci = subsidiaryEquity * data.ownership.nci
  const parentSotp = parent.rawEquity + parentHolding
  const consolidatedEquity = consolidated.rawEquity - nci
  const multipleNci = subsidiary.multipleRawEquity === null ? null : Math.max(0, subsidiary.multipleRawEquity) * data.ownership.nci
  const multipleParentHolding = subsidiary.multipleRawEquity === null ? null : Math.max(0, subsidiary.multipleRawEquity) * data.ownership.parent
  return { scenario, ...valuations, subsidiaryEquity, subsidiaryFloorAdjustment, nci, parentHolding, consolidatedEquity, parentSotp, scopeGap: consolidatedEquity - parentSotp, multipleNci, multipleParentHolding, multipleConsolidatedEquity: consolidated.multipleRawEquity === null || multipleNci === null ? null : consolidated.multipleRawEquity - multipleNci, multipleParentSotp: parent.multipleRawEquity === null || multipleParentHolding === null ? null : parent.multipleRawEquity + multipleParentHolding }
}

export const baseValuation = calculateValuation()
export const scenarioValuations = scenarios.map(s => calculateValuation(s.id))
export function investmentEffect(entity: 'parent' | 'consolidated', capital = 70) {
  const bs = data.entities[entity].balance2025
  const preMoney = entity === 'parent' ? baseValuation.parentSotp : baseValuation.consolidatedEquity
  return { ...bs, capital, assetsAfter: bs.assets + capital, equityAfter: bs.equity + capital, cashAfter: bs.cash + capital, netDebtAfter: bs.netDebt - capital, debtRatioBefore: bs.liabilities / bs.equity, debtRatioAfter: bs.liabilities / (bs.equity + capital), preMoney, postMoney: preMoney + capital, newInvestorShare: preMoney > 0 ? capital / (preMoney + capital) : null }
}
