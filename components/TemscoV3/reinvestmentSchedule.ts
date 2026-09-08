import { firstPassAssumptions as assumptions } from './firstPassAssumptions'

export type AssetCompany = 'parent' | 'subsidiary'
type AssetClass = 'land' | 'building' | 'equipment' | 'finiteIntangible' | 'development' | 'cip'
type CohortKind = 'existing' | 'growth' | 'maintenance' | 'development'
type Cohort = { id: string; company: AssetCompany; assetClass: AssetClass; kind: CohortKind; year: number; cost: number; remaining: number; life: number | null; firstFraction: number }

/** 2025-12-31 NBV, 억 원; source: research/assumed-depreciation.json, S03 separate balance sheets. */
export const openingAssetPools = {
  parent: { land: 100.91660492, building: 19.05527230, equipment: 40.27961256, finiteIntangible: .23041607, cip: 0 },
  subsidiary: { land: 0, building: 0, equipment: 93.92622107, finiteIntangible: .36612304, cip: .00924 },
} as const
/** Source S06 CAPEX and S04 CAPEX_감가상각. No separately identified development in these additions. */
export const growthAssetPlan = [
  { year: 2026, company: 'parent', assetClass: 'land', cost: 60 },
  { year: 2026, company: 'parent', assetClass: 'building', cost: 50 },
  { year: 2026, company: 'subsidiary', assetClass: 'equipment', cost: 2.5 },
  { year: 2027, company: 'parent', assetClass: 'equipment', cost: 5 },
  { year: 2027, company: 'subsidiary', assetClass: 'equipment', cost: 11.5 },
  { year: 2028, company: 'parent', assetClass: 'equipment', cost: 5 },
] as const

export type ReinvestmentOptions = {
  endYear?: number
  developmentByYear?: Record<number, { parent: number; subsidiary: number }>
  maintenanceOverlap?: number
  existingEquipmentRemainingYears?: number
  newEquipmentYears?: number
  developmentUsefulLifeYears?: number
}
export type CohortAudit = { id: string; company: AssetCompany; kind: CohortKind; assetClass: AssetClass; acquiredYear: number; originalAmount: number; usefulLifeYears: number | null; openingBookValue: number; depreciation: number; closingBookValue: number }
export type EntityReinvestment = {
  nonDevelopmentDa: number
  developmentAmortization: number
  modeledDa: number
  beforeCurrentMaintenanceDa: number
  maintenanceBudget: number
  maintenanceOverlapAdjustment: number
  maintenanceCashCapex: number
  maintenanceCapitalizedAddition: number
  plannedGrowthCapex: number
  plannedDepreciableGrowthCapex: number
  capitalizedDevelopmentAnnual: number
  developmentClosingAsset: number
  openingAssetBookValue: number
  totalAdditions: number
  closingAssetBookValue: number
  existingEquipmentClosingAsset: number
}
export type ReinvestmentYear = { year: number; parent: EntityReinvestment; subsidiary: EntityReinvestment; group: EntityReinvestment; cohortAudit: CohortAudit[] }

function validateLife(value: number, label: string) {
  if (!Number.isFinite(value) || value < 1 || value > 100) throw new Error(`${label} must be between 1 and 100 years`)
}

/** Solves D = A + k*(D-o*min(G,D)); new maintenance never duplicates planned growth assets. */
export function solveMaintenanceDepreciation(beforeMaintenanceDa: number, eligibleGrowth: number, overlap: number, life: number) {
  validateLife(life, 'Maintenance life')
  if (![beforeMaintenanceDa, eligibleGrowth, overlap].every(Number.isFinite) || beforeMaintenanceDa < 0 || eligibleGrowth < 0 || overlap < 0 || overlap > 1) throw new Error('Invalid maintenance inputs')
  const k = assumptions.depreciation.firstYearFraction / life
  const withinGrowth = beforeMaintenanceDa / (1 - k * (1 - overlap))
  const totalDa = withinGrowth <= eligibleGrowth ? withinGrowth : (beforeMaintenanceDa - k * overlap * eligibleGrowth) / (1 - k)
  const overlapAmount = overlap * Math.min(eligibleGrowth, totalDa)
  const maintenanceAddition = totalDa - overlapAmount
  return { totalDa, overlapAmount, maintenanceAddition, currentMaintenanceDa: k * maintenanceAddition }
}

export function buildReinvestmentSchedule(options: ReinvestmentOptions = {}): ReinvestmentYear[] {
  if (assumptions.depreciation.residualValueRate !== 0 || assumptions.depreciation.landDepreciationRate !== 0 || assumptions.depreciation.constructionInProgressInService) throw new Error('This first-pass schedule requires zero residual value, non-depreciable land and uncommissioned CIP')
  const endYear = options.endYear ?? 2029
  if (!Number.isInteger(endYear) || endYear < 2026 || endYear > 2100) throw new Error('Invalid asset schedule end year')
  const equipmentRemaining = options.existingEquipmentRemainingYears ?? assumptions.depreciation.existingEquipmentRemainingYears
  const equipmentLife = options.newEquipmentYears ?? assumptions.depreciation.newEquipmentYears
  const developmentLife = options.developmentUsefulLifeYears ?? assumptions.development.usefulLifeYears
  const overlap = options.maintenanceOverlap ?? 0
  validateLife(equipmentRemaining, 'Existing equipment remaining life')
  validateLife(equipmentLife, 'New and maintenance equipment life')
  validateLife(developmentLife, 'Development life')
  if (!Number.isFinite(overlap) || overlap < 0 || overlap > 1) throw new Error('Invalid maintenance overlap')
  for (const [year, amounts] of Object.entries(options.developmentByYear ?? {})) {
    if (!Number.isInteger(Number(year)) || Number(year) < 2026 || Number(year) > endYear || !amounts || ![amounts.parent, amounts.subsidiary].every(amount => Number.isFinite(amount) && amount >= 0)) throw new Error('Invalid development cohort')
  }
  const cohorts: Cohort[] = []
  for (const company of ['parent', 'subsidiary'] as const) {
    for (const [assetClass, amount] of Object.entries(openingAssetPools[company])) {
      if (amount <= 0) continue
      const life = assetClass === 'equipment' ? equipmentRemaining : assetClass === 'building' ? assumptions.depreciation.existingBuildingRemainingYears : assetClass === 'finiteIntangible' ? assumptions.depreciation.finiteIntangibleYears : null
      cohorts.push({ id: `${company}-existing-${assetClass}`, company, assetClass: assetClass as AssetClass, kind: 'existing', year: 2025, cost: amount, remaining: amount, life, firstFraction: 1 })
    }
  }
  const output: ReinvestmentYear[] = []
  for (let year = 2026; year <= endYear; year++) {
    const audit: CohortAudit[] = []
    const entities = {} as Record<AssetCompany, EntityReinvestment>
    for (const company of ['parent', 'subsidiary'] as const) {
      const openingAssetBookValue = cohorts.filter(cohort => cohort.company === company).reduce((sum, cohort) => sum + cohort.remaining, 0)
      const growth = growthAssetPlan.filter(asset => asset.year === year && asset.company === company)
      const plannedGrowthCapex = growth.reduce((sum, asset) => sum + asset.cost, 0)
      const plannedDepreciableGrowthCapex = growth.filter(asset => asset.assetClass !== 'land').reduce((sum, asset) => sum + asset.cost, 0)
      for (const asset of growth) cohorts.push({ id: `${company}-growth-${year}-${asset.assetClass}`, company, assetClass: asset.assetClass, kind: 'growth', year, cost: asset.cost, remaining: asset.cost, life: asset.assetClass === 'land' ? null : asset.assetClass === 'building' ? assumptions.depreciation.newBuildingYears : equipmentLife, firstFraction: assumptions.depreciation.firstYearFraction })
      const capitalizedDevelopmentAnnual = options.developmentByYear?.[year]?.[company] ?? 0
      if (capitalizedDevelopmentAnnual > 0) cohorts.push({ id: `${company}-development-${year}`, company, assetClass: 'development', kind: 'development', year, cost: capitalizedDevelopmentAnnual, remaining: capitalizedDevelopmentAnnual, life: developmentLife, firstFraction: assumptions.development.firstYearFraction })
      const depreciate = (cohort: Cohort) => {
        const openingBookValue = cohort.remaining
        const depreciation = cohort.life === null ? 0 : Math.min(openingBookValue, cohort.cost / cohort.life * (cohort.year === year ? cohort.firstFraction : 1))
        cohort.remaining = Math.max(0, openingBookValue - depreciation)
        audit.push({ id: cohort.id, company, kind: cohort.kind, assetClass: cohort.assetClass, acquiredYear: cohort.year, originalAmount: cohort.cost, usefulLifeYears: cohort.life, openingBookValue, depreciation, closingBookValue: cohort.remaining })
        return depreciation
      }
      let beforeCurrentMaintenanceDa = 0, developmentAmortization = 0
      for (const cohort of cohorts.filter(cohort => cohort.company === company)) {
        const expense = depreciate(cohort)
        if (cohort.assetClass === 'development') developmentAmortization += expense
        else beforeCurrentMaintenanceDa += expense
      }
      const maintenance = solveMaintenanceDepreciation(beforeCurrentMaintenanceDa, plannedDepreciableGrowthCapex, overlap, equipmentLife)
      const maintenanceCohort: Cohort = { id: `${company}-maintenance-${year}`, company, assetClass: 'equipment', kind: 'maintenance', year, cost: maintenance.maintenanceAddition, remaining: maintenance.maintenanceAddition, life: equipmentLife, firstFraction: assumptions.depreciation.firstYearFraction }
      cohorts.push(maintenanceCohort)
      const maintenanceDa = depreciate(maintenanceCohort)
      const nonDevelopmentDa = beforeCurrentMaintenanceDa + maintenanceDa
      const companyCohorts = cohorts.filter(cohort => cohort.company === company)
      entities[company] = {
        nonDevelopmentDa, developmentAmortization, modeledDa: nonDevelopmentDa + developmentAmortization,
        beforeCurrentMaintenanceDa, maintenanceBudget: maintenance.totalDa,
        maintenanceOverlapAdjustment: maintenance.overlapAmount,
        maintenanceCashCapex: maintenance.maintenanceAddition, maintenanceCapitalizedAddition: maintenance.maintenanceAddition,
        plannedGrowthCapex, plannedDepreciableGrowthCapex, capitalizedDevelopmentAnnual,
        developmentClosingAsset: companyCohorts.filter(cohort => cohort.assetClass === 'development').reduce((sum, cohort) => sum + cohort.remaining, 0),
        openingAssetBookValue, totalAdditions: plannedGrowthCapex + maintenance.maintenanceAddition + capitalizedDevelopmentAnnual,
        closingAssetBookValue: companyCohorts.reduce((sum, cohort) => sum + cohort.remaining, 0),
        existingEquipmentClosingAsset: companyCohorts.filter(cohort => cohort.kind === 'existing' && cohort.assetClass === 'equipment').reduce((sum, cohort) => sum + cohort.remaining, 0),
      }
    }
    const group = {} as EntityReinvestment
    for (const key of Object.keys(entities.parent) as (keyof EntityReinvestment)[]) group[key] = entities.parent[key] + entities.subsidiary[key]
    output.push({ year, ...entities, group, cohortAudit: audit })
  }
  return output
}
