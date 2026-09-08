import raw from './companyForecast.json'
import { industryProxies, marketInputs, debtProxies } from './marketInputs'
import { calculateWacc, terminalGrowth, valuationDate, zeroGrowthTerminal } from './valuation'
import { firstPassAssumptions } from './firstPassAssumptions'
import { ordinaryCorporateTax } from './corporateTax'
import { buildReinvestmentSchedule } from './reinvestmentSchedule'

/** Conditional analyst scenarios. Monetary values in this module are KRW 100 million (억 원). */
const unit = 1e8
const sourcePeriods = raw.periods.filter(period => period.year >= 2026)
const source2026 = sourcePeriods[0]
const source2028 = sourcePeriods.find(period => period.year === 2028)!
const endDate = '2029-12-31'
const asTime = Date.parse(`${valuationDate}T00:00:00Z`)
const yearsTo = (date: string) => (Date.parse(`${date}T00:00:00Z`) - asTime) / 86400000 / 365
export const residual2026Fraction = yearsTo('2026-12-31')
export const openingCoreNwc2025 = 2263781766 / unit
export const sourceNormalMarginCap = source2028.consolidated.ebitMargin
const industry = industryProxies[0]
const waccForDebt = (debtCost: number) => calculateWacc({ ...marketInputs, ...industry, debtCost }).wacc

export type ScenarioId = 'optimistic' | 'base' | 'pessimistic'
export type ScenarioParameters = {
  q: number
  outsourceRate: number
  dsoDays: number
  dioDays: number
  dpoDays: number
  wacc: number
  capexResidualShare: number
  maintenanceOverlap: number
  normalMarginCap: number
  nwcRevenueRatio: number
  nwcMultiplier: number
  rdToRevenue: number
  developmentCapitalizedShare: number
  existingEquipmentRemainingYears: number
  newEquipmentYears: number
  developmentUsefulLifeYears: number
}
export type ScenarioDefinition = {
  id: ScenarioId
  label: string
  description: string
  parameters: ScenarioParameters
}

const common = {
  capexResidualShare: .5, maintenanceOverlap: 0, normalMarginCap: sourceNormalMarginCap,
  nwcRevenueRatio: firstPassAssumptions.industry.ncwcToRevenue,
  rdToRevenue: firstPassAssumptions.industry.rdToRevenue,
  developmentCapitalizedShare: firstPassAssumptions.development.assumedCapitalizedShare,
  existingEquipmentRemainingYears: firstPassAssumptions.depreciation.existingEquipmentRemainingYears,
  newEquipmentYears: firstPassAssumptions.depreciation.newEquipmentYears,
  developmentUsefulLifeYears: firstPassAssumptions.development.usefulLifeYears,
}
export const scenarioDefinitions: ScenarioDefinition[] = [
  { id: 'optimistic', label: '낙관안', description: '회사 매출 계획 100% · 외주비율 30% · 시장 AA− 금리 대용', parameters: { ...common, q: 1, outsourceRate: .30, nwcMultiplier: firstPassAssumptions.workingCapital.scenarioMultipliers.optimistic, dsoDays: 40, dioDays: 30, dpoDays: 55, wacc: waccForDebt(debtProxies[0].debtCost) } },
  { id: 'base', label: '중도안', description: '계획 매출 증분 75% · 외주비율 35% · 시장 BBB− 금리 대용', parameters: { ...common, q: .75, outsourceRate: .35, nwcMultiplier: firstPassAssumptions.workingCapital.scenarioMultipliers.base, dsoDays: 45, dioDays: 35, dpoDays: 50, wacc: waccForDebt(debtProxies[1].debtCost) } },
  { id: 'pessimistic', label: '비관안', description: '계획 매출 증분 50% · 외주비율 40% · 시장 BBB− 금리 대용', parameters: { ...common, q: .5, outsourceRate: .40, nwcMultiplier: firstPassAssumptions.workingCapital.scenarioMultipliers.pessimistic, dsoDays: 60, dioDays: 45, dpoDays: 45, wacc: waccForDebt(debtProxies[1].debtCost) } },
]

// One fixed valuation-date balance for all forward scenarios and OAT evaluations.
// This interpolation is an analyst proxy, not a measured September balance.
const source2025Revenue = raw.periods.find(period => period.year === 2025)!.consolidated.revenue / unit
export const openingIndustryNwc2025 = source2025Revenue * firstPassAssumptions.industry.ncwcToRevenue
export const valuationOpeningNwcProxy = firstPassAssumptions.industry.ncwcToRevenue * (source2025Revenue + (source2026.consolidated.revenue / unit - source2025Revenue) * (1 - residual2026Fraction))

export const scenarioAssumptions = {
  valuationDate,
  terminalDate: endDate,
  terminalGrowth,
  monetaryUnit: 'KRW 100 million / 억 원',
  status: '조건부 분석 시나리오 · 회사 확정가치·경영진 승인 전망과 구분',
  source: 'S02·S04·S06 저장 수치 / companyForecast.json',
  revenue: '2026 회사 연간 계획 공통 · 2027–29 계획 연결매출 증분 q 실현 · 각 법인·내부매출 동일 비율 조정',
  depreciation: '2025 말 자산 NBV의 잔여5년·건물40년 / 신규·유지장비10년·반기 / 개발비5년·반기 / 자산잔액 하한0의 1차 가정',
  operatingTax: '법인별 EBIT에 2026 일반법인 국세·지방세 누진율 적용 · 과세표준=장부이익 · 공제·결손금·납부시차 0',
  accountingTax: '모든 전망연도 법인별 EBT에 2026 일반법인 국세·지방세 누진율 적용 · 회사 원본 손익과 별도 1차 가정',
  residual2026: '영업손익·세금·상각에 114/365 적용 · ΔNWC는 공통 평가일 기초 잔액에서 시나리오 말 잔액까지의 전액 변동',
  capex: '2026 회사 취득계획의 50% 잔여 · 유지 CAPEX=비개발상각 · 유지 신규자산의 당기 반기상각 고정점 및 이후 cohort 상각 반영',
  overlap: '기본 0% 중복 · 중복 비율은 비토지 계획투자와 유지투자 중 작은 금액에만 적용 · 0 계획 연도 유지투자 존속',
  development: '업종 R&D/매출 ×20%의 추가 자산화 지출 대용 · 회사 기존비용 가산 없음 · 20%는 산업 관측 자산화율 아님 · 5년 반기상각',
  nwc: 'NYU Global Electronics NCWC/매출18.4223% × 외부매출 × 시나리오0.8/1/1.2 · 핵심3계정 방식과 합산 제외',
  openingNwc: '2025 매출×산업 포괄 NCWC율에서 중도2026 말로 보간한 공통 평가일 기초 · 모든 시나리오·OAT 고정 · 실제 잔액과 구분',
  terminal: 'g=0 · 개발지출=성숙 개발상각으로 EBIT 정상화 후 회사2028마진 상한 · 유지 CAPEX=비개발상각 · 개발재투자 별도 차감',
  multiple: '동일 명시 FCFF와 정상화 EBIT 기반 시장 Exit 교차검토 · 독립된 두 평가모형의 합의로 해석 제외',
  equity: '순차입금·NCI는 2025 수록잔액 대용, 기타조정0으로 1차 주주가치 연결 · 기준일 잔액·NCI 공정가치 미확정 · 주당가격·IRR 산출 제외',
} as const

export type EntityIncomeStatement = {
  revenue: number; cogs: number; grossProfit: number; sga: number; ebit: number
  netNonOperating: number; interestExpenseSigned: number; ebt: number; taxExpense: number; netIncome: number
  daProxy: number; manufacturingDaProxy: number; sgaDa: number
  sgaPayroll: number; sgaOther: number
  modeledDa: number; nonDevelopmentDa: number; developmentAmortization: number
  capitalizedDevelopmentAnnual: number; developmentClosingAsset: number
}
export type AnnualScenario = EntityIncomeStatement & {
  year: number
  periodLabel: string
  isResidualPeriod: boolean
  cashFraction: number
  parent: EntityIncomeStatement
  subsidiary: EntityIncomeStatement
  consolidated: EntityIncomeStatement
  revenueScale: number
  subsidiaryToParentRevenue: number
  parentToSubsidiaryRevenue: number
  intercompanyRevenueElimination: number
  subsidiaryMaterialsToParentRate: number
  subsidiaryOutsourceRate: number
  ebitMargin: number
  ebitdaProxy: number
  operatingCashTax: number
  nopat: number
  yearOpeningNwc: number
  forecastOpeningNwc: number
  yearEndNwc: number
  annualDeltaNwc: number
  deltaNwc: number
  fcffEbit: number
  fcffOperatingCashTax: number
  fcffNopat: number
  fcffDa: number
  plannedAnnualCapex: number
  plannedCashCapex: number
  maintenanceCashCapex: number
  overlapCashAdjustment: number
  cashCapex: number
  capitalizedDevelopment: number
  maintenanceBudget: number
  nwcRevenueRatio: number
  nwcMultiplier: number
  fcff: number
  discountYears: number
  discountFactor: number
  pvFcff: number
}
export type TerminalScenario = {
  date: string; rawEbit: number; normalizedEbit: number; rawMargin: number; normalizedMargin: number
  marginCap: number; parentNormalizedEbit: number; subsidiaryNormalizedEbit: number
  revenue: number; cashTax: number; da: number; maintenanceCapex: number; normalizedFcff: number
  rawNwc: number; normalNwc: number; normalNwcTransition: number
  terminalValue: number; discountYears: number; discountFactor: number
  presentTerminalValue: number; presentNwcTransition: number
  nonDevelopmentDa: number; developmentAmortization: number; capitalizedDevelopment: number; matureDevelopmentEbit: number
}
export type MultipleComparison = {
  status: 'calculated' | 'not-meaningful'
  benchmarkMultiple: number
  normalizedExitEbit: number
  exitEnterpriseValue: number | null
  presentExitValue: number | null
  presentExplicitFcff: number
  presentNwcTransition: number
  enterpriseValue: number | null
  gapAmount: number | null
  gapRatio: number | null
  gapPercent: number | null
  reason?: string
}
export type ScenarioResult = {
  id: ScenarioId
  label: string
  name: string
  description: string
  parameters: ScenarioParameters
  assumptions: typeof scenarioAssumptions
  annual: AnnualScenario[]
  terminal: TerminalScenario
  dcf: {
    enterpriseValue: number
    presentExplicitFcff: number
    presentTerminalValue: number
    presentNwcTransition: number
    terminalShare: number | null
  }
  comparison?: MultipleComparison
}

function assertParameters(p: ScenarioParameters) {
  if (firstPassAssumptions.development.alreadyIncludedInCompanyExpenseShare !== 0 || !firstPassAssumptions.development.taxDeductionFollowsBookAmortization) throw new Error('This first-pass model supports only additional development spending and book-matched tax amortization')
  const fields: (keyof ScenarioParameters)[] = ['q', 'outsourceRate', 'dsoDays', 'dioDays', 'dpoDays', 'wacc', 'capexResidualShare', 'maintenanceOverlap', 'normalMarginCap', 'nwcRevenueRatio', 'nwcMultiplier', 'rdToRevenue', 'developmentCapitalizedShare', 'existingEquipmentRemainingYears', 'newEquipmentYears', 'developmentUsefulLifeYears']
  if (fields.some(key => !Number.isFinite(p[key]))) throw new Error('Scenario parameters must be finite')
  for (const key of ['q', 'outsourceRate', 'capexResidualShare', 'maintenanceOverlap', 'normalMarginCap', 'nwcRevenueRatio', 'rdToRevenue', 'developmentCapitalizedShare'] as const) {
    if (p[key] < 0 || p[key] > 1) throw new Error(`${key} must lie between 0 and 1`)
  }
  for (const key of ['dsoDays', 'dioDays', 'dpoDays'] as const) if (p[key] < 0 || p[key] > 730) throw new Error(`${key} must lie between 0 and 730 days`)
  if (p.wacc <= 0) throw new Error('WACC must be positive')
  if (p.nwcMultiplier < 0 || p.nwcMultiplier > 3) throw new Error('NWC multiplier must lie between 0 and 3')
  for (const key of ['existingEquipmentRemainingYears', 'newEquipmentYears', 'developmentUsefulLifeYears'] as const) if (p[key] < 1 || p[key] > 100) throw new Error(`${key} must lie between 1 and 100 years`)
}

function requiredSource(value: number | null | undefined, label: string): number {
  if (value === null || value === undefined || !Number.isFinite(value)) throw new Error(`Missing scenario source: ${label}`)
  return value
}

function incomeStatement(input: Omit<EntityIncomeStatement, 'grossProfit' | 'ebit' | 'ebt' | 'taxExpense' | 'netIncome'>, consolidatedTax?: number): EntityIncomeStatement {
  const grossProfit = input.revenue - input.cogs
  const ebit = grossProfit - input.sga
  const ebt = ebit + input.netNonOperating
  const taxExpense = consolidatedTax ?? ordinaryCorporateTax(ebt).total
  return { ...input, grossProfit, ebit, ebt, taxExpense, netIncome: ebt - taxExpense }
}

const operatingNwc = (revenue: number, p: ScenarioParameters) => revenue * p.nwcRevenueRatio * p.nwcMultiplier

function buildAnnual(p: ScenarioParameters): AnnualScenario[] {
  let previousYearNwc = openingIndustryNwc2025
  const developmentByYear = Object.fromEntries(sourcePeriods.map(source => {
    const scale = (source2026.consolidated.revenue + p.q * (source.consolidated.revenue - source2026.consolidated.revenue)) / source.consolidated.revenue
    const parentExternal = (source.parent.revenue - requiredSource(source.segments.parentToSubsidiaryRevenue, `${source.year} parent internal sales`)) * scale / unit
    const subsidiaryExternal = (source.subsidiary.revenue - requiredSource(source.segments.subsidiaryToParentRevenue, `${source.year} subsidiary internal sales`)) * scale / unit
    if (parentExternal < 0 || subsidiaryExternal < 0) throw new Error('Negative external revenue in development allocation')
    const rate = p.rdToRevenue * p.developmentCapitalizedShare
    return [source.year, { parent: parentExternal * rate, subsidiary: subsidiaryExternal * rate }]
  }))
  const reinvestment = buildReinvestmentSchedule({ developmentByYear, maintenanceOverlap: p.maintenanceOverlap, existingEquipmentRemainingYears: p.existingEquipmentRemainingYears, newEquipmentYears: p.newEquipmentYears, developmentUsefulLifeYears: p.developmentUsefulLifeYears })
  const originalMaterialsRate = source2026.subsidiary.directMaterials / source2026.subsidiary.toParentAsLabelled
  return sourcePeriods.map(source => {
    const year = source.year
    const parentSource = source.parent
    const subSource = source.subsidiary
    const isResidualPeriod = year === 2026
    const cashFraction = isResidualPeriod ? residual2026Fraction : 1
    const assets = reinvestment.find(period => period.year === year)!
    const targetRevenue = source2026.consolidated.revenue + p.q * (source.consolidated.revenue - source2026.consolidated.revenue)
    const scale = targetRevenue / source.consolidated.revenue
    const oldParentDa = requiredSource(parentSource.totalDaIllustrativeProxy, `${year} parent D&A proxy`) / unit
    const oldParentManufacturingDa = oldParentDa - parentSource.sgaDa / unit
    const parentManufacturingDa = assets.parent.nonDevelopmentDa * oldParentManufacturingDa / oldParentDa
    const parentSgaDa = assets.parent.nonDevelopmentDa - parentManufacturingDa + assets.parent.developmentAmortization
    const parentCogs = (parentSource.cogs / unit - oldParentManufacturingDa) * scale + parentManufacturingDa
    const parentSga = (parentSource.sgaPayroll + parentSource.sgaOther * scale) / unit + parentSgaDa
    const parent = incomeStatement({
      revenue: parentSource.revenue * scale / unit,
      cogs: parentCogs,
      sga: parentSga,
      netNonOperating: parentSource.netNonOperating / unit,
      interestExpenseSigned: parentSource.interestExpenseSigned / unit,
      daProxy: assets.parent.modeledDa,
      manufacturingDaProxy: parentManufacturingDa,
      sgaDa: parentSgaDa,
      sgaPayroll: parentSource.sgaPayroll / unit,
      sgaOther: parentSource.sgaOther * scale / unit,
      modeledDa: assets.parent.modeledDa, nonDevelopmentDa: assets.parent.nonDevelopmentDa, developmentAmortization: assets.parent.developmentAmortization,
      capitalizedDevelopmentAnnual: assets.parent.capitalizedDevelopmentAnnual, developmentClosingAsset: assets.parent.developmentClosingAsset,
    })
    const companyMaterialsRate = subSource.directMaterials / subSource.toParentAsLabelled
    const materialsRate = isResidualPeriod ? companyMaterialsRate : originalMaterialsRate + p.q * (companyMaterialsRate - originalMaterialsRate)
    const outsourcingRate = isResidualPeriod ? requiredSource(subSource.outsourcing, `${year} outsourcing`) / subSource.revenue : p.outsourceRate
    const subManufacturingDa = assets.subsidiary.nonDevelopmentDa * subSource.manufacturingDa / subSource.totalDa
    const subSgaDa = assets.subsidiary.nonDevelopmentDa - subManufacturingDa + assets.subsidiary.developmentAmortization
    const subCashCogs = isResidualPeriod ? (subSource.cogs - subSource.manufacturingDa) / unit : (
      subSource.toParentAsLabelled * scale * materialsRate + subSource.revenue * scale * outsourcingRate
      + subSource.manufacturingPayroll + subSource.manufacturingOther * scale
    ) / unit
    const subCogs = subCashCogs + subManufacturingDa
    const subSga = (subSource.sgaPayroll + subSource.sgaOther * scale) / unit + subSgaDa
    const subsidiary = incomeStatement({
      revenue: subSource.revenue * scale / unit,
      cogs: subCogs,
      sga: subSga,
      netNonOperating: subSource.netNonOperating / unit,
      interestExpenseSigned: subSource.netInterestExpenseSigned / unit,
      daProxy: assets.subsidiary.modeledDa,
      manufacturingDaProxy: subManufacturingDa,
      sgaDa: subSgaDa,
      sgaPayroll: subSource.sgaPayroll / unit,
      sgaOther: subSource.sgaOther * scale / unit,
      modeledDa: assets.subsidiary.modeledDa, nonDevelopmentDa: assets.subsidiary.nonDevelopmentDa, developmentAmortization: assets.subsidiary.developmentAmortization,
      capitalizedDevelopmentAnnual: assets.subsidiary.capitalizedDevelopmentAnnual, developmentClosingAsset: assets.subsidiary.developmentClosingAsset,
    })
    const elimination = source.segments.intercompanyRevenueElimination * scale / unit
    const consolidated = incomeStatement({
      revenue: parent.revenue + subsidiary.revenue + elimination,
      cogs: parent.cogs + subsidiary.cogs + elimination,
      sga: parent.sga + subsidiary.sga,
      netNonOperating: parent.netNonOperating + subsidiary.netNonOperating,
      interestExpenseSigned: parent.interestExpenseSigned + subsidiary.interestExpenseSigned,
      daProxy: parent.daProxy + subsidiary.daProxy,
      manufacturingDaProxy: parent.manufacturingDaProxy + subsidiary.manufacturingDaProxy,
      sgaDa: parent.sgaDa + subsidiary.sgaDa,
      sgaPayroll: parent.sgaPayroll + subsidiary.sgaPayroll,
      sgaOther: parent.sgaOther + subsidiary.sgaOther,
      modeledDa: assets.group.modeledDa, nonDevelopmentDa: assets.group.nonDevelopmentDa, developmentAmortization: assets.group.developmentAmortization,
      capitalizedDevelopmentAnnual: assets.group.capitalizedDevelopmentAnnual, developmentClosingAsset: assets.group.developmentClosingAsset,
    }, parent.taxExpense + subsidiary.taxExpense)
    const operatingCashTax = ordinaryCorporateTax(parent.ebit).total + ordinaryCorporateTax(subsidiary.ebit).total
    const nopat = consolidated.ebit - operatingCashTax
    const yearEndNwc = operatingNwc(consolidated.revenue, p)
    const yearOpeningNwc = previousYearNwc
    const annualDeltaNwc = yearEndNwc - yearOpeningNwc
    const forecastOpeningNwc = isResidualPeriod ? valuationOpeningNwcProxy : yearOpeningNwc
    const deltaNwc = yearEndNwc - forecastOpeningNwc
    previousYearNwc = yearEndNwc
    const plannedAnnualCapex = requiredSource(source.capex.combinedPlannedAdditions, `${year} planned CAPEX`) / unit
    const plannedCashCapex = plannedAnnualCapex * (isResidualPeriod ? p.capexResidualShare : 1)
    const maintenanceCashCapex = assets.group.maintenanceBudget * cashFraction
    const overlapCashAdjustment = assets.group.maintenanceOverlapAdjustment * cashFraction
    const cashCapex = plannedCashCapex + maintenanceCashCapex - overlapCashAdjustment
    const capitalizedDevelopment = assets.group.capitalizedDevelopmentAnnual * cashFraction
    const fcffEbit = consolidated.ebit * cashFraction
    const fcffOperatingCashTax = operatingCashTax * cashFraction
    const fcffNopat = nopat * cashFraction
    const fcffDa = consolidated.daProxy * cashFraction
    const fcff = fcffNopat + fcffDa - cashCapex - capitalizedDevelopment - deltaNwc
    const discountYears = yearsTo(`${year}-12-31`)
    const discountFactor = (1 + p.wacc) ** -discountYears
    return {
      ...consolidated, year, periodLabel: isResidualPeriod ? '2026 잔여' : `${year}E`, isResidualPeriod, cashFraction,
      parent, subsidiary, consolidated, revenueScale: scale,
      subsidiaryToParentRevenue: requiredSource(source.segments.subsidiaryToParentRevenue, `${year} subsidiary-to-parent sales`) * scale / unit,
      parentToSubsidiaryRevenue: requiredSource(source.segments.parentToSubsidiaryRevenue, `${year} parent-to-subsidiary sales`) * scale / unit,
      intercompanyRevenueElimination: elimination, subsidiaryMaterialsToParentRate: materialsRate,
      subsidiaryOutsourceRate: outsourcingRate, ebitMargin: consolidated.ebit / consolidated.revenue,
      ebitdaProxy: consolidated.ebit + consolidated.daProxy, operatingCashTax, nopat,
      yearOpeningNwc, forecastOpeningNwc, yearEndNwc, annualDeltaNwc, deltaNwc,
      fcffEbit, fcffOperatingCashTax, fcffNopat, fcffDa, plannedAnnualCapex, plannedCashCapex,
      maintenanceCashCapex, overlapCashAdjustment, cashCapex, capitalizedDevelopment,
      maintenanceBudget: assets.group.maintenanceBudget, nwcRevenueRatio: p.nwcRevenueRatio, nwcMultiplier: p.nwcMultiplier,
      fcff, discountYears, discountFactor, pvFcff: fcff * discountFactor,
    }
  })
}

export function evaluateScenario(idOrDefinition: ScenarioId | ScenarioDefinition, overrides: Partial<ScenarioParameters> = {}, benchmarkMultiple?: number): ScenarioResult {
  const definition = typeof idOrDefinition === 'string' ? scenarioDefinitions.find(item => item.id === idOrDefinition) : idOrDefinition
  if (!definition) throw new Error('Unknown valuation scenario')
  const parameters = { ...definition.parameters, ...overrides }
  assertParameters(parameters)
  const annual = buildAnnual(parameters)
  const last = annual[annual.length - 1]
  const parentMatureEbit = last.parent.ebit + last.parent.developmentAmortization - last.parent.capitalizedDevelopmentAnnual
  const subsidiaryMatureEbit = last.subsidiary.ebit + last.subsidiary.developmentAmortization - last.subsidiary.capitalizedDevelopmentAnnual
  const matureDevelopmentEbit = parentMatureEbit + subsidiaryMatureEbit
  const normalizedEbit = Math.min(matureDevelopmentEbit, parameters.normalMarginCap * last.revenue)
  const normalizedMargin = normalizedEbit / last.revenue
  const normalizationFactor = matureDevelopmentEbit > 0 ? normalizedEbit / matureDevelopmentEbit : 1
  const parentNormalizedEbit = parentMatureEbit * normalizationFactor
  const subsidiaryNormalizedEbit = subsidiaryMatureEbit * normalizationFactor
  const cashTax = ordinaryCorporateTax(parentNormalizedEbit).total + ordinaryCorporateTax(subsidiaryNormalizedEbit).total
  const nonDevelopmentDa = last.nonDevelopmentDa
  const capitalizedDevelopment = last.capitalizedDevelopmentAnnual
  const developmentAmortization = capitalizedDevelopment
  const da = nonDevelopmentDa + developmentAmortization
  const maintenanceCapex = nonDevelopmentDa
  const normalizedFcff = normalizedEbit - cashTax + da - maintenanceCapex - capitalizedDevelopment
  const normalNwc = operatingNwc(last.revenue, parameters)
  const normalNwcTransition = normalNwc - last.yearEndNwc
  const terminalValue = zeroGrowthTerminal(normalizedFcff, parameters.wacc)
  const discountYears = yearsTo(endDate)
  const discountFactor = (1 + parameters.wacc) ** -discountYears
  const presentTerminalValue = terminalValue * discountFactor
  const presentNwcTransition = -normalNwcTransition * discountFactor
  const presentExplicitFcff = annual.reduce((sum, period) => sum + period.pvFcff, 0)
  const enterpriseValue = presentExplicitFcff + presentTerminalValue + presentNwcTransition
  if (![normalizedFcff, terminalValue, presentExplicitFcff, presentTerminalValue, presentNwcTransition, enterpriseValue].every(Number.isFinite)) throw new Error('Non-finite scenario valuation result')
  const terminal: TerminalScenario = {
    date: endDate, rawEbit: last.ebit, normalizedEbit, rawMargin: last.ebitMargin,
    normalizedMargin, marginCap: parameters.normalMarginCap, parentNormalizedEbit, subsidiaryNormalizedEbit,
    revenue: last.revenue, cashTax, da, maintenanceCapex, normalizedFcff,
    rawNwc: last.yearEndNwc, normalNwc, normalNwcTransition,
    terminalValue, discountYears, discountFactor, presentTerminalValue, presentNwcTransition,
    nonDevelopmentDa, capitalizedDevelopment, developmentAmortization, matureDevelopmentEbit,
  }
  const result: ScenarioResult = {
    id: definition.id, label: definition.label, name: definition.label, description: definition.description,
    parameters, assumptions: scenarioAssumptions, annual, terminal,
    dcf: { enterpriseValue, presentExplicitFcff, presentTerminalValue, presentNwcTransition, terminalShare: enterpriseValue > 0 ? presentTerminalValue / enterpriseValue : null },
  }
  if (benchmarkMultiple !== undefined) result.comparison = compareWithMultiple(result, benchmarkMultiple)
  return result
}

export function compareWithMultiple(result: ScenarioResult, benchmarkMultiple: number): MultipleComparison {
  if (!Number.isFinite(benchmarkMultiple) || benchmarkMultiple <= 0) throw new Error('Observed EV/EBIT multiple must be finite and positive')
  const commonComparison = { benchmarkMultiple, normalizedExitEbit: result.terminal.normalizedEbit, presentExplicitFcff: result.dcf.presentExplicitFcff, presentNwcTransition: result.dcf.presentNwcTransition }
  if (result.terminal.normalizedEbit <= 0) return { ...commonComparison, status: 'not-meaningful', exitEnterpriseValue: null, presentExitValue: null, enterpriseValue: null, gapAmount: null, gapRatio: null, gapPercent: null, reason: '정상화 EBIT 0 이하: 양의 EV/EBIT 배수 적용 제외' }
  const exitEnterpriseValue = result.terminal.normalizedEbit * benchmarkMultiple
  const presentExitValue = exitEnterpriseValue * result.terminal.discountFactor
  const enterpriseValue = result.dcf.presentExplicitFcff + presentExitValue + result.dcf.presentNwcTransition
  if (![exitEnterpriseValue, presentExitValue, enterpriseValue].every(Number.isFinite)) throw new Error('Non-finite multiple valuation result')
  const gapAmount = enterpriseValue - result.dcf.enterpriseValue
  const gapRatio = result.dcf.enterpriseValue > 0 ? gapAmount / result.dcf.enterpriseValue : null
  return { ...commonComparison, status: 'calculated', exitEnterpriseValue, presentExitValue, enterpriseValue, gapAmount, gapRatio, gapPercent: gapRatio === null ? null : gapRatio * 100 }
}

export function evaluateOneAtATime(id: ScenarioId, parameter: keyof ScenarioParameters, values: number[], benchmarkMultiple?: number) {
  return values.map(value => ({ parameter, value, result: evaluateScenario(id, { [parameter]: value }, benchmarkMultiple) }))
}

export const scenarios: ScenarioResult[] = scenarioDefinitions.map(definition => evaluateScenario(definition))
