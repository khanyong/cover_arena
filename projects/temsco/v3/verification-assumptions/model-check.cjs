/* Read-only checks of industry NCWC, ordinary tax and finite asset/development assumptions. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = path.resolve(__dirname, '../../../..')
require.extensions['.ts'] = (module, filename) => {
  const out = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }, reportDiagnostics: true, fileName: filename })
  assert.equal((out.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0)
  module._compile(out.outputText, filename)
}
const model = require(path.join(root, 'components/TemscoV3/scenarioValuation.ts'))
const assets = require(path.join(root, 'components/TemscoV3/reinvestmentSchedule.ts'))
const tax = require(path.join(root, 'components/TemscoV3/corporateTax.ts'))
const assumptions = require(path.join(root, 'components/TemscoV3/firstPassAssumptions.ts')).firstPassAssumptions
const legacyDcf = require(path.join(root, 'components/TemscoV3/valuation.ts'))
const source = require(path.join(root, 'components/TemscoV3/companyForecast.json'))
let checks = 0
function near(a, b, label, tolerance = 1e-8) { checks++; assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)), `${label}: ${a} vs ${b}`) }
function ok(condition, label) { checks++; assert.ok(condition, label) }
function throws(fn, label) { checks++; assert.throws(fn, undefined, label) }
function increasing(v, label) { for (let i = 1; i < v.length; i++) ok(v[i] > v[i - 1], label) }

for (const [profit, expected] of [[-1, 0], [0, 0], [2, .22], [200, 43.78], [3000, 721.38], [3001, 721.655]]) near(tax.ordinaryCorporateTax(profit).total, expected, 'National and local tax bracket boundaries')
for (const threshold of [2, 200, 3000]) ok(tax.ordinaryCorporateTax(threshold + .00001).total > tax.ordinaryCorporateTax(threshold).total, 'Continuous positive tax slope')
for (const life of [5, 10]) for (const overlap of [0, .5, 1]) for (const growth of [0, 1, 100]) {
  const result = assets.solveMaintenanceDepreciation(10, growth, overlap, life)
  near(result.totalDa, 10 + .5 / life * result.maintenanceAddition, 'Maintenance fixed point including first-year depreciation')
  near(result.maintenanceAddition, result.totalDa - overlap * Math.min(growth, result.totalDa), 'No duplicate maintenance/growth asset')
  ok(result.maintenanceAddition >= 0, 'Nonnegative new maintenance cohort')
}
near(assets.solveMaintenanceDepreciation(10, 0, 0, 10).totalDa, 10 / .95, 'Closed-form zero-overlap control')
const longSchedule = assets.buildReinvestmentSchedule({ endYear: 2040, developmentByYear: { 2026: { parent: 10, subsidiary: 5 } } })
for (const year of longSchedule) {
  for (const entity of [year.parent, year.subsidiary, year.group]) {
    near(entity.openingAssetBookValue + entity.totalAdditions - entity.modeledDa, entity.closingAssetBookValue, 'Asset roll-forward')
    near(entity.nonDevelopmentDa + entity.developmentAmortization, entity.modeledDa, 'Development separated from replacement D&A')
    near(entity.maintenanceBudget, entity.nonDevelopmentDa, 'Maintenance budget tied to non-development D&A')
    near(entity.maintenanceCapitalizedAddition, entity.maintenanceCashCapex, 'Actual maintenance addition matches cash after overlap')
  }
  for (const cohort of year.cohortAudit) {
    ok(cohort.closingBookValue >= 0 && cohort.depreciation >= 0, 'Asset value/depreciation cannot become negative')
    near(cohort.openingBookValue - cohort.depreciation, cohort.closingBookValue, 'Cohort movement')
    if (['land', 'cip'].includes(cohort.assetClass)) near(cohort.depreciation, 0, 'Land/CIP not depreciated')
  }
}
near(longSchedule.find(p => p.year === 2030).group.existingEquipmentClosingAsset, 0, 'Existing NBV exhausted after remaining five years')
near(longSchedule.find(p => p.year === 2031).group.existingEquipmentClosingAsset, 0, 'No depreciation beyond exhausted existing equipment')
near(longSchedule[0].parent.developmentAmortization, 1, 'Development first-year half convention')
near(longSchedule.find(p => p.year === 2031).parent.developmentAmortization, 1, 'Development final half-year balance')
near(longSchedule.find(p => p.year === 2032).parent.developmentAmortization, 0, 'Development floor after full amortization')
const coating = longSchedule.flatMap(p => p.cohortAudit.filter(c => c.id === 'subsidiary-growth-2026-equipment'))
near(coating[0].depreciation, .125, 'New 2.5 equipment / 10 / half')
near(coating.reduce((sum, c) => sum + c.depreciation, 0), 2.5, 'New cohort lifetime total equals cost')
const baseAssetOnly = assets.buildReinvestmentSchedule()
near(baseAssetOnly[0].parent.nonDevelopmentDa, (40.27961256 / 5 + .23041607 / 5 + 19.05527230 / 40 + 50 / 40 * .5) / .95, 'Independent parent opening-asset control')
near(baseAssetOnly[0].subsidiary.nonDevelopmentDa, (93.92622107 / 5 + .36612304 / 5 + 2.5 / 10 * .5) / .95, 'Independent subsidiary opening-asset control')
const overlapAssets = assets.buildReinvestmentSchedule({ maintenanceOverlap: 1 })
for (const row of overlapAssets) {
  for (const company of ['parent', 'subsidiary']) {
    near(row[company].openingAssetBookValue + row[company].totalAdditions - row[company].modeledDa, row[company].closingAssetBookValue, 'Overlap-adjusted asset movement')
    ok(row[company].maintenanceOverlapAdjustment <= row[company].plannedDepreciableGrowthCapex + 1e-9, 'Land cannot overlap with replacement')
  }
}

const source2025 = source.periods.find(p => p.year === 2025)
const source2026 = source.periods.find(p => p.year === 2026)
const industryNwc = assumptions.industry.ncwcToRevenue
near(model.openingIndustryNwc2025, source2025.consolidated.revenue / 1e8 * industryNwc, 'Comprehensive 2025 normalized industry NWC')
near(model.valuationOpeningNwcProxy, industryNwc * (source2025.consolidated.revenue / 1e8 + (source2026.consolidated.revenue - source2025.consolidated.revenue) / 1e8 * 251 / 365), 'Common valuation-date comprehensive NCWC')
ok(Math.abs(model.openingIndustryNwc2025 - model.openingCoreNwc2025) > 1, 'Core three balances not mixed with comprehensive industry NWC')
for (const scenario of model.scenarios) {
  near(scenario.parameters.nwcMultiplier, assumptions.workingCapital.scenarioMultipliers[scenario.id], 'Central scenario NCWC multipliers connected')
  near(scenario.parameters.nwcRevenueRatio, assumptions.industry.ncwcToRevenue, 'Central industry NCWC ratio connected')
  near(scenario.parameters.rdToRevenue, assumptions.industry.rdToRevenue, 'Central industry R&D intensity connected')
  near(scenario.parameters.developmentCapitalizedShare, assumptions.development.assumedCapitalizedShare, 'Central development capitalization assumption connected')
  near(scenario.parameters.existingEquipmentRemainingYears, assumptions.depreciation.existingEquipmentRemainingYears, 'Central existing remaining life connected')
  near(scenario.parameters.newEquipmentYears, assumptions.depreciation.newEquipmentYears, 'Central new/maintenance life connected')
  near(scenario.parameters.developmentUsefulLifeYears, assumptions.development.usefulLifeYears, 'Central development life connected')
  ok(scenario.annual.length === 4, 'Four explicit cash periods')
  for (const row of scenario.annual) {
    for (const [key, value] of Object.entries(row)) if (typeof value === 'number') ok(Number.isFinite(value), `Finite ${row.year} ${key}`)
    const original = source.periods.find(p => p.year === row.year)
    for (const entity of [row.parent, row.subsidiary, row.consolidated]) {
      near(entity.revenue - entity.cogs - entity.sga, entity.ebit, 'Modeled P&L EBIT identity')
      near(entity.ebit + entity.netNonOperating, entity.ebt, 'Interest not deducted twice')
      near(entity.ebt - entity.taxExpense, entity.netIncome, 'Modeled net income')
      near(entity.modeledDa, entity.manufacturingDaProxy + entity.sgaDa, 'New depreciation replaced in both COGS and SGA')
      near(entity.modeledDa, entity.nonDevelopmentDa + entity.developmentAmortization, 'New full D&A components')
    }
    near(row.intercompanyRevenueElimination, -row.parentToSubsidiaryRevenue - row.subsidiaryToParentRevenue, 'Both internal directions')
    near(row.revenue, row.parent.revenue + row.subsidiary.revenue + row.intercompanyRevenueElimination, 'External group sales')
    near(row.cogs, row.parent.cogs + row.subsidiary.cogs + row.intercompanyRevenueElimination, 'Same cost elimination')
    near(row.ebit, row.parent.ebit + row.subsidiary.ebit, 'Internal sales do not create EBIT')
    near(row.taxExpense, tax.ordinaryCorporateTax(row.parent.ebt).total + tax.ordinaryCorporateTax(row.subsidiary.ebt).total, 'All-year separate-entity ordinary accounting tax')
    near(row.operatingCashTax, tax.ordinaryCorporateTax(row.parent.ebit).total + tax.ordinaryCorporateTax(row.subsidiary.ebit).total, 'Unlevered ordinary operating tax')
    near(row.capitalizedDevelopmentAnnual, row.revenue * scenario.parameters.rdToRevenue * scenario.parameters.developmentCapitalizedShare, 'Industry RD intensity times analyst capitalization share')
    near(row.parent.capitalizedDevelopmentAnnual, (row.parent.revenue - row.parentToSubsidiaryRevenue) * scenario.parameters.rdToRevenue * scenario.parameters.developmentCapitalizedShare, 'Parent development allocated on external revenue')
    near(row.capitalizedDevelopmentAnnual, row.parent.capitalizedDevelopmentAnnual + row.subsidiary.capitalizedDevelopmentAnnual, 'No development on duplicate intercompany sales')
    near(row.yearEndNwc, row.revenue * scenario.parameters.nwcRevenueRatio * scenario.parameters.nwcMultiplier, 'Market ratio NCWC')
    near(row.deltaNwc, row.yearEndNwc - row.forecastOpeningNwc, 'Future NWC movement')
    if (row.year === 2026) {
      near(row.forecastOpeningNwc, model.valuationOpeningNwcProxy, 'Common valuation-date opening NWC')
      near(row.cashFraction, 114 / 365, '2026 operating period fraction')
      near(row.revenue, original.consolidated.revenue / 1e8, 'Company 2026 revenue unchanged')
      ok(Math.abs(row.ebit - original.consolidated.ebit / 1e8) > 1, '2026 modeled EBIT updated for new depreciation')
    }
    near(row.fcff, row.fcffEbit - row.fcffOperatingCashTax + row.fcffDa - row.cashCapex - row.capitalizedDevelopment - row.deltaNwc, 'Full cash-flow identity with separate development cash')
    near(row.capitalizedDevelopment, row.capitalizedDevelopmentAnnual * row.cashFraction, 'Development cash period matching')
    near(row.maintenanceCashCapex, row.nonDevelopmentDa * row.cashFraction, 'No development amortization in maintenance cash budget')
    if (scenario.id === 'optimistic') near(row.ebit + row.modeledDa, (original.consolidated.ebit + original.consolidated.totalDaIllustrativeProxy) / 1e8, 'All source noncash depreciation removed before new D&A replacement', 1e-7)
  }
  const last = scenario.annual[3], terminal = scenario.terminal
  near(terminal.matureDevelopmentEbit, last.ebit + last.developmentAmortization - last.capitalizedDevelopmentAnnual, 'Mature development expense normalization')
  near(terminal.normalizedEbit, Math.min(terminal.matureDevelopmentEbit, scenario.parameters.normalMarginCap * last.revenue), 'Profit cap after maturity normalization')
  near(terminal.parentNormalizedEbit + terminal.subsidiaryNormalizedEbit, terminal.normalizedEbit, 'Entity allocation of normalized earnings')
  near(terminal.capitalizedDevelopment, terminal.developmentAmortization, 'Mature fixed annual development cash = annual amortization')
  near(terminal.da, terminal.nonDevelopmentDa + terminal.developmentAmortization, 'Terminal D&A definition')
  near(terminal.maintenanceCapex, terminal.nonDevelopmentDa, 'Replacement and development expenditure disjoint')
  near(terminal.normalizedFcff, terminal.normalizedEbit - terminal.cashTax + terminal.da - terminal.maintenanceCapex - terminal.capitalizedDevelopment, 'Full terminal FCFF identity')
  near(terminal.normalizedFcff, terminal.normalizedEbit - terminal.cashTax, 'Mature replacement/development offset only after expense normalization')
  near(terminal.terminalValue, terminal.normalizedFcff / scenario.parameters.wacc, 'No-growth TV')
  near(terminal.normalNwcTransition, 0, 'Flat sales/rate NCWC does not create artificial terminal release')
  const cashRows = scenario.annual.map(r => ({ label: r.periodLabel, cashDate: `${r.year}-12-31`, ebit: r.fcffEbit, cashOperatingTax: r.fcffOperatingCashTax, depreciation: r.fcffDa, capex: r.cashCapex, capitalizedDevelopment: r.capitalizedDevelopment, deltaOperatingWorkingCapital: r.deltaNwc }))
  near(legacyDcf.discountDcf(cashRows, '2026-09-08', scenario.parameters.wacc, '2029-12-31', terminal.normalizedFcff).enterpriseValue, scenario.dcf.enterpriseValue, 'Independent DCF calculator')
  const comparison = model.compareWithMultiple(scenario, 13.20916)
  near(comparison.enterpriseValue, scenario.dcf.presentExplicitFcff + terminal.normalizedEbit * 13.20916 * terminal.discountFactor + terminal.presentNwcTransition, 'Same normalized EBIT and FCFF market exit')
  near(comparison.gapAmount, comparison.enterpriseValue - scenario.dcf.enterpriseValue, 'Method gap')
}
increasing(['pessimistic', 'base', 'optimistic'].map(id => model.evaluateScenario(id).dcf.enterpriseValue), 'Scenario ordering')
for (const parameter of ['nwcMultiplier', 'nwcRevenueRatio']) {
  const values = parameter === 'nwcMultiplier' ? [.8, 1, 1.2] : [.15, .18, .21]
  const results = model.evaluateOneAtATime('base', parameter, values)
  increasing(results.map(r => -r.result.dcf.enterpriseValue), 'Higher forward NWC lowers value')
  for (const result of results) near(result.result.annual[0].forecastOpeningNwc, model.valuationOpeningNwcProxy, 'OAT cannot restate opening NCWC')
}
const dev5 = model.evaluateScenario('base', { developmentUsefulLifeYears: 5 })
const dev10 = model.evaluateScenario('base', { developmentUsefulLifeYears: 10 })
near(dev5.terminal.normalizedEbit, dev10.terminal.normalizedEbit, 'Mature EBIT not inflated by longer development amortization life')
near(dev5.terminal.normalizedFcff, dev10.terminal.normalizedFcff, 'Mature FCFF consistent across development lives')
ok(dev10.annual[0].developmentAmortization < dev5.annual[0].developmentAmortization, 'Development 5 vs 10 years changes explicit amortization')
const zeroDev = model.evaluateScenario('base', { developmentCapitalizedShare: 0 })
for (const r of zeroDev.annual) { near(r.capitalizedDevelopment, 0, 'Zero development input valid'); near(r.developmentAmortization, 0, 'No stale development amortization') }
near(model.evaluateScenario('base', { dsoDays: 60, dioDays: 60, dpoDays: 60 }).dcf.enterpriseValue, model.evaluateScenario('base').dcf.enterpriseValue, 'Legacy three-day parameters unused in industry NCWC mode')
for (const input of [{ existingEquipmentRemainingYears: 0 }, { newEquipmentYears: NaN }, { developmentUsefulLifeYears: Infinity }, { nwcRevenueRatio: NaN }, { developmentCapitalizedShare: 1.1 }, { nwcMultiplier: -1 }]) throws(() => model.evaluateScenario('base', input), 'Invalid new input rejection')
throws(() => assets.buildReinvestmentSchedule({ developmentByYear: { 2026: { parent: -1, subsidiary: 0 } } }), 'Negative development cohort rejected')
for (const [group, key, unsupported] of [['development', 'alreadyIncludedInCompanyExpenseShare', .2], ['development', 'taxDeductionFollowsBookAmortization', false], ['depreciation', 'residualValueRate', .1], ['depreciation', 'landDepreciationRate', .1], ['depreciation', 'constructionInProgressInService', true]]) {
  const original = assumptions[group][key]
  try {
    assumptions[group][key] = unsupported
    throws(() => model.evaluateScenario('base'), `Unsupported policy ${key} cannot silently change displayed assumption only`)
  } finally { assumptions[group][key] = original }
}
console.log(JSON.stringify({ status: 'PASS', checks, openingIndustryNwc2025: model.openingIndustryNwc2025, valuationOpeningNwcProxy: model.valuationOpeningNwcProxy, scenarios: model.scenarios.map(s => ({ id: s.id, enterpriseValue: s.dcf.enterpriseValue, presentExplicitFcff: s.dcf.presentExplicitFcff, presentTerminalValue: s.dcf.presentTerminalValue, normalizedEbit: s.terminal.normalizedEbit, normalizedFcff: s.terminal.normalizedFcff })) }, null, 2))
