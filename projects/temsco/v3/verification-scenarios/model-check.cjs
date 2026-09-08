/* Read-only verification of the conditional scenario model. No workbook/database writes. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = path.resolve(__dirname, '../../../..')
const previousTs = require.extensions['.ts']
require.extensions['.ts'] = function compile(module, filename) {
  const source = fs.readFileSync(filename, 'utf8')
  const result = ts.transpileModule(source, {
    fileName: filename,
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  })
  assert.equal(result.diagnostics?.filter(item => item.category === ts.DiagnosticCategory.Error).length ?? 0, 0, filename)
  module._compile(result.outputText, filename)
}
const model = require(path.join(root, 'components/TemscoV3/scenarioValuation.ts'))
const valuation = require(path.join(root, 'components/TemscoV3/valuation.ts'))
const source = require(path.join(root, 'components/TemscoV3/companyForecast.json'))
if (previousTs) require.extensions['.ts'] = previousTs
else delete require.extensions['.ts']

let assertions = 0
function near(actual, expected, label, tolerance = 1e-7) {
  assertions++
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${label}: ${actual} vs ${expected}`)
}
function ok(value, label) { assertions++; assert.ok(value, label) }
function throws(fn, label) { assertions++; assert.throws(fn, undefined, label) }
function monotonic(values, direction, label) {
  for (let i = 1; i < values.length; i++) ok(direction > 0 ? values[i] > values[i - 1] : values[i] < values[i - 1], label)
}
const base = model.evaluateScenario('base')
near(model.residual2026Fraction, 114 / 365, 'Exact remaining 2026 days')
near(model.openingCoreNwc2025, 22.63781766, 'Source opening three-component NWC')
near(model.valuationOpeningNwcProxy, 22.63781766 + (((414.62759896 * 45 + 362.57923577 * (35 - 50)) / 365) - 22.63781766) * 251 / 365, 'Fixed valuation-date opening NWC based on central interpolation')
near(model.sourceNormalMarginCap, source.periods.find(p => p.year === 2028).consolidated.ebitMargin, '2028 source margin cap')
ok(model.scenarios.length === 3, 'Three independently evaluated scenarios')
for (const scenario of model.scenarios) {
  ok(scenario.annual.length === 4, 'Four explicit periods')
  ok(scenario.comparison === undefined, 'Unprovided benchmark remains missing')
  for (const row of scenario.annual) {
    const original = source.periods.find(p => p.year === row.year)
    for (const [key, value] of Object.entries(row)) if (typeof value === 'number') ok(Number.isFinite(value), `${row.year} ${key} finite`)
    for (const entity of [row.parent, row.subsidiary, row.consolidated]) {
      near(entity.revenue - entity.cogs, entity.grossProfit, 'Gross profit identity')
      near(entity.grossProfit - entity.sga, entity.ebit, 'EBIT identity')
      near(entity.ebit + entity.netNonOperating, entity.ebt, 'EBT: no second interest deduction')
      near(entity.ebt - entity.taxExpense, entity.netIncome, 'Net income identity')
    }
    near(row.intercompanyRevenueElimination, -row.subsidiaryToParentRevenue - row.parentToSubsidiaryRevenue, 'Both internal revenue directions eliminated')
    near(row.revenue, row.parent.revenue + row.subsidiary.revenue + row.intercompanyRevenueElimination, 'Group sales scope')
    near(row.cogs, row.parent.cogs + row.subsidiary.cogs + row.intercompanyRevenueElimination, 'Equal COGS elimination')
    near(row.ebit, row.parent.ebit + row.subsidiary.ebit, 'Internal elimination does not create EBIT')
    near(row.netIncome, row.parent.netIncome + row.subsidiary.netIncome, 'Group NI scope')
    near(row.operatingCashTax, .22 * (Math.max(0, row.parent.ebit) + Math.max(0, row.subsidiary.ebit)), 'Entity-level operating tax; no automatic loss offset')
    near(row.daProxy, original.consolidated.totalDaIllustrativeProxy / 1e8, 'Explicit proxy D&A')
    ok(original.consolidated.totalDa === null, 'Missing confirmed D&A retained in original')
    near(row.yearEndNwc - row.forecastOpeningNwc, row.deltaNwc, 'NWC balance movement')
    near(row.fcff, row.fcffEbit - row.fcffOperatingCashTax + row.fcffDa - row.cashCapex - row.capitalizedDevelopment - row.deltaNwc, 'Complete FCFF reconciliation')
    near(row.pvFcff, row.fcff / (1 + scenario.parameters.wacc) ** row.discountYears, 'Period discount arithmetic')
    if (row.year === 2026) {
      for (const key of ['revenue', 'cogs', 'grossProfit', 'sga', 'ebit', 'netNonOperating', 'interestExpenseSigned', 'ebt', 'taxExpense', 'netIncome']) near(row[key], original.consolidated[key] / 1e8, `2026 source P&L ${key}`)
      near(row.deltaNwc, row.yearEndNwc - model.valuationOpeningNwcProxy, 'Full prospective NWC movement from common valuation-date balance')
      near(row.forecastOpeningNwc, model.valuationOpeningNwcProxy, 'Same illustrative September opening balance in all scenarios')
      near(row.cashCapex, 112.5 * .5 + row.daProxy * 114 / 365, '2026 CAPEX independently timed from operating cash')
      ok(row.operatingCashTax > row.ebit * .22, '2026 taxable parent / loss subsidiary distinction')
    } else {
      near(row.cashCapex, row.plannedAnnualCapex + row.daProxy, 'Planned expansion plus maintenance assumption')
      near(row.taxExpense, .22 * (Math.max(0, row.parent.ebt) + Math.max(0, row.subsidiary.ebt)), 'Modeled accounting tax by entity')
    }
  }
  const terminal = scenario.terminal
  near(terminal.normalizedEbit, Math.min(terminal.rawMargin, scenario.parameters.normalMarginCap) * terminal.revenue, 'Terminal profit cap')
  near(terminal.parentNormalizedEbit + terminal.subsidiaryNormalizedEbit, terminal.normalizedEbit, 'Terminal normalization allocated to entities')
  near(terminal.cashTax, .22 * (Math.max(0, terminal.parentNormalizedEbit) + Math.max(0, terminal.subsidiaryNormalizedEbit)), 'Terminal cash tax')
  near(terminal.maintenanceCapex, terminal.da, 'g=0 still requires replacement capex')
  near(terminal.normalizedFcff, terminal.normalizedEbit - terminal.cashTax, 'D&A / maintenance cancellation disclosed')
  near(terminal.terminalValue, terminal.normalizedFcff / scenario.parameters.wacc, 'g=0 perpetuity')
  near(terminal.presentNwcTransition, -(terminal.normalNwc - terminal.rawNwc) * terminal.discountFactor, 'One-time normalization NWC transition')
  near(scenario.dcf.enterpriseValue, scenario.annual.reduce((a, p) => a + p.pvFcff, 0) + terminal.presentTerminalValue + terminal.presentNwcTransition, 'Complete EV PV bridge')
  const periods = scenario.annual.map(row => ({ label: row.periodLabel, cashDate: `${row.year}-12-31`, ebit: row.fcffEbit, cashOperatingTax: row.fcffOperatingCashTax, depreciation: row.fcffDa, capex: row.cashCapex, capitalizedDevelopment: row.capitalizedDevelopment, deltaOperatingWorkingCapital: row.deltaNwc + (row.year === 2029 ? terminal.normalNwcTransition : 0) }))
  const independent = valuation.discountDcf(periods, '2026-09-08', scenario.parameters.wacc, '2029-12-31', terminal.normalizedFcff)
  ok(independent.status === 'calculated', 'Existing independent DCF function complete')
  near(independent.enterpriseValue, scenario.dcf.enterpriseValue, 'Independent DCF implementation')
  const comparison = model.compareWithMultiple(scenario, 10)
  near(comparison.exitEnterpriseValue, terminal.normalizedEbit * 10, 'Normalized rather than raw Exit EBIT')
  near(comparison.enterpriseValue, scenario.dcf.presentExplicitFcff + terminal.normalizedEbit * 10 * terminal.discountFactor + terminal.presentNwcTransition, 'Market exit PV scope')
  near(comparison.gapAmount, comparison.enterpriseValue - scenario.dcf.enterpriseValue, 'Gap amount direction')
  near(comparison.gapPercent, comparison.gapAmount / scenario.dcf.enterpriseValue * 100, 'Gap % of DCF')
  const implied = terminal.terminalValue / terminal.normalizedEbit
  near(model.compareWithMultiple(scenario, implied).enterpriseValue, scenario.dcf.enterpriseValue, 'Equal exit terminal gives equal total EV')
}
monotonic(['pessimistic', 'base', 'optimistic'].map(id => model.evaluateScenario(id).dcf.enterpriseValue), 1, 'Main-case value ordering')
const tests = [
  ['q', [.5, .75, 1], 1], ['outsourceRate', [.3, .35, .4], -1],
  ['dsoDays', [30, 45, 60], -1], ['dioDays', [25, 35, 45], -1], ['dpoDays', [40, 50, 60], 1],
  ['wacc', [.09, .11, .13], -1], ['capexResidualShare', [0, .5, 1], -1],
  ['maintenanceOverlap', [0, .5, 1], 1], ['normalMarginCap', [.1, .15, .2], 1],
]
for (const [parameter, values, direction] of tests) {
  const samples = model.evaluateOneAtATime('base', parameter, values)
  monotonic(samples.map(item => item.result.dcf.enterpriseValue), direction, `OAT ${parameter}`)
  for (const sample of samples) near(sample.result.annual[0].forecastOpeningNwc, model.valuationOpeningNwcProxy, `OAT ${parameter} cannot alter pre-valuation opening NWC`)
}
const fullOverlap = model.evaluateScenario('base', { maintenanceOverlap: 1 })
near(fullOverlap.annual[3].cashCapex, fullOverlap.annual[3].daProxy, 'Zero planned 2029 capex cannot erase maintenance')
ok(fullOverlap.annual[0].cashCapex >= 30 + fullOverlap.annual[0].maintenanceCashCapex, 'Land excluded from replacement overlap')
const zeroMargin = model.evaluateScenario('base', { normalMarginCap: 0 }, 10)
near(zeroMargin.terminal.normalizedEbit, 0, 'Valid zero is not missing')
near(zeroMargin.terminal.terminalValue, 0, 'Zero normalized EBIT does not create positive terminal value')
ok(zeroMargin.comparison.status === 'not-meaningful', 'EV/EBIT unavailable for non-positive normalized profit')
const loss = model.evaluateScenario('base', { q: 0, outsourceRate: 1 })
ok(loss.terminal.normalizedEbit < 0 && loss.terminal.terminalValue < 0, 'Loss case is not silently floored to positive value')
ok(model.compareWithMultiple(loss, 10).status === 'not-meaningful', 'No positive EV/EBIT multiple on loss')
for (const overrides of [{ q: NaN }, { q: 1.1 }, { q: -1 }, { wacc: 0 }, { wacc: Infinity }, { dsoDays: -1 }, { maintenanceOverlap: 1.1 }, { capexResidualShare: -1 }, { normalMarginCap: NaN }]) throws(() => model.evaluateScenario('base', overrides), 'Invalid parameter rejection')
for (const multiple of [0, -1, NaN, Infinity, null]) throws(() => model.compareWithMultiple(base, multiple), 'Missing/invalid multiple not replaced by zero')
throws(() => model.evaluateScenario('unknown'), 'Unknown scenario rejection')
console.log(JSON.stringify({ status: 'PASS', assertions, basis: '2026-09-08 conditional analyst assumptions; monetary unit KRW 100 million', scenarios: model.scenarios.map(item => ({ id: item.id, wacc: item.parameters.wacc, conditionalEnterpriseValue: item.dcf.enterpriseValue, presentExplicitFcff: item.dcf.presentExplicitFcff, presentTerminalValue: item.dcf.presentTerminalValue, presentNwcTransition: item.dcf.presentNwcTransition, terminalMargin: item.terminal.normalizedMargin })) }, null, 2))
