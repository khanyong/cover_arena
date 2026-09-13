#!/usr/bin/env node
/* Read-only model audit. Writes only the selected verification JSON; never recalculates Excel. */
'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const root = path.resolve(__dirname, '../..')
const args = process.argv.slice(2)
const options = {
  model: '/private/tmp/temsco-v4-valuation/model/valuationModel.js',
  output: path.join(root, 'projects/temsco/v4/analysis/valuation-model-verification.json'),
  before: null,
}
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '')
  if (!(key in options) || !args[i + 1]) throw new Error('Usage: node scripts/temsco/verify-v4-valuation.cjs [--model compiledModel.js] [--output report.json] [--before prePeriodChangeModel.json]')
  options[key] = path.resolve(args[i + 1])
}

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const sourcePath = path.join(root, 'projects/temsco/v4/analysis/valuation-source.json')
const marketPath = path.join(root, 'projects/temsco/v4/analysis/valuation-market-inputs.json')
const dataPath = path.join(root, 'components/TemscoV4/valuationData.json')
const calculationPath = path.join(root, 'projects/temsco/v4/analysis/valuation-calculation.json')
const modelDir = path.dirname(options.model)
const source = read(sourcePath), market = read(marketPath), data = read(dataPath)
const sections = [], failures = [], manifest = []
let current, assertions = 0
const assertion = (condition, label) => {
  assertions++; current.assertions++
  if (!condition) { current.failures++; failures.push({ section: current.name, label }) }
}
const exact = (actual, expected, label) => assertion(Object.is(actual, expected), `${label}: actual=${actual}; expected=${expected}`)
const close = (actual, expected, label) => assertion(Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= 1e-8, `${label}: actual=${actual}; expected=${expected}`)
const deep = (actual, expected, label) => {
  if (typeof expected === 'number') return close(actual, expected, label)
  if (expected === null || typeof expected !== 'object') return exact(actual, expected, label)
  assertion(actual !== null && typeof actual === 'object', `${label}: object present`)
  if (!actual || typeof actual !== 'object') return
  if (Array.isArray(expected)) exact(actual.length, expected.length, `${label}.length`)
  for (const key of Object.keys(expected)) deep(actual[key], expected[key], `${label}.${key}`)
}
const section = (name, run) => {
  current = { name, assertions: 0, failures: 0 }
  sections.push(current)
  try { run() } catch (error) { assertion(false, `Exception: ${error.message}`) }
  current.status = current.failures ? 'FAIL' : 'PASS'
}
const fileRecord = file => ({ path: path.relative(root, file).startsWith('..') ? file : path.relative(root, file), sha256: sha(file), bytes: fs.statSync(file).size })
const entities = ['parent', 'subsidiary', 'consolidated']
const multipleEntityKeys = ['exitTerminalValue', 'exitPvTerminal', 'multipleEv', 'gap', 'gapRate', 'multipleRawEquity']
const multipleResultKeys = ['multipleNci', 'multipleParentHolding', 'multipleConsolidatedEquity', 'multipleParentSotp']
const withoutMultiple = result => {
  const clone = structuredClone(result)
  for (const key of multipleResultKeys) delete clone[key]
  for (const entity of entities) for (const key of multipleEntityKeys) delete clone[entity][key]
  return clone
}
const companyForecastYears = [2026, 2027, 2028, 2029]
const extensionYears = []
const forecastYears = [...companyForecastYears]
const terminalYear = 2029
const steadyStateYear = 2030
const fields = ['revenue', 'cogs', 'grossProfit', 'sga', 'sgaSalary', 'ebit', 'nonOperatingNet', 'ebt', 'tax', 'netIncome']
const sourceRow = (entity, year) => source.entities[entity].incomeStatement.find(row => row.year === year)
const inputRow = (entity, year) => data.entities[entity].income.find(row => row.year === year)
const forecastAnchorRow = (entity, year) => inputRow(entity, year)
const operatingTax = profit => {
  const upper = [2, 200, 3000, Infinity], rates = [.11, .22, .242, .275]
  let tax = 0, lower = 0
  for (let i = 0; i < upper.length; i++) {
    tax += Math.max(0, Math.min(Math.max(profit, 0), upper[i]) - lower) * rates[i]
    lower = upper[i]
  }
  return tax
}

section('source-and-build-provenance', () => {
  for (const file of [sourcePath, marketPath, dataPath, calculationPath, __filename]) manifest.push(fileRecord(file))
  if (options.before) manifest.push(fileRecord(options.before))
  for (const stem of ['valuationModel', 'valuationInputs', 'valuationReinvestment']) {
    const tsFile = path.join(root, `components/TemscoV4/${stem}.ts`)
    const jsFile = path.join(modelDir, `${stem}.js`)
    manifest.push(fileRecord(tsFile), fileRecord(jsFile))
    assertion(fs.statSync(jsFile).mtimeMs >= fs.statSync(tsFile).mtimeMs, `${stem}: compiled artifact not older than TypeScript source`)
  }
  const compiledData = path.join(modelDir, 'valuationData.json')
  manifest.push(fileRecord(compiledData))
  // TypeScript may re-indent resolveJsonModule output; compare parsed values, retain both byte hashes.
  assertion(JSON.stringify(read(compiledData)) === JSON.stringify(data), 'compiled JSON values = current compact data')
  for (const [id, entry] of Object.entries(source.sources)) {
    exact(sha(entry.path), entry.sha256, `${id}: original workbook SHA-256`)
    exact(data.sourceFiles[id].sha256, entry.sha256, `${id}: compact source hash`)
    manifest.push(fileRecord(entry.path))
  }
})

let model, reinvestment, inputs
section('compiled-module-loading', () => {
  model = require(options.model)
  reinvestment = require(path.join(modelDir, 'valuationReinvestment.js'))
  inputs = require(path.join(modelDir, 'valuationInputs.js'))
  exact(typeof model.calculateValuation, 'function', 'valuation export')
  exact(inputs.valuationDate, '2026-09-13', 'valuation date')
  exact(inputs.residualDays2026, 109, '2026 remaining days')
  close(inputs.residualFraction2026, 109 / 365, '2026 residual fraction')
  deep(model.years, forecastYears, 'four source forecast years2026–2029; first year remaining stub')
  exact(inputs.companyForecastEndYear, 2029, 'last original company forecast year')
  exact(inputs.forecastEndYear, terminalYear, 'explicit forecast ends2029')
  exact(inputs.terminalCashFlowYear, steadyStateYear, 'steady-state cash flow begins2030')
  assertion(!inputs.forecastExtensionAssumptions || inputs.forecastExtensionAssumptions.years?.length === 0, 'No additional explicit-year forecast assumptions')
})

section('source-financial-reconciliation', () => {
  for (const entity of entities) {
    exact(data.entities[entity].income.length, 6, `${entity}: six annual source periods`)
    for (const row of data.entities[entity].income) {
      const raw = sourceRow(entity, row.year)
      exact(row.status, raw.status, `${entity}/${row.year}: actual/forecast status`)
      for (const field of fields) exact(row[field], raw[field].eok, `${entity}/${row.year}/${field}: source amount, including null`)
      close(row.revenue - row.cogs, row.grossProfit, `${entity}/${row.year}: gross profit`)
      close(row.grossProfit - row.sga, row.ebit, `${entity}/${row.year}: EBIT`)
      close(row.ebit + row.nonOperatingNet, row.ebt, `${entity}/${row.year}: EBT`)
      if (row.tax !== null) close(row.ebt - row.tax, row.netIncome, `${entity}/${row.year}: NI with disclosed tax`)
    }
    const bs = source.entities[entity].balanceSheets.find(row => row.year === 2025)
    for (const key of ['assets', 'liabilities', 'equity', 'cash', 'interestBearingDebt', 'netDebt']) exact(data.entities[entity].balance2025[key], bs[key].eok, `${entity}/2025BS/${key}`)
    close(bs.assets.eok - bs.liabilities.eok, bs.equity.eok, `${entity}/2025BS balance identity`)
    close(bs.interestBearingDebt.eok - bs.cash.eok, bs.netDebt.eok, `${entity}/2025BS net debt`)
    for (const capex of data.entities[entity].capex) exact(capex.amount, source.entities[entity].capex.find(row => row.year === capex.year).companyScheduleTotal.eok, `${entity}/${capex.year}: source CAPEX`)
  }
  for (const row of source.consolidationAdjustments) {
    close(inputRow('parent', row.year).revenue + inputRow('subsidiary', row.year).revenue + row.rawAdjustmentLines.revenue.eok, inputRow('consolidated', row.year).revenue, `${row.year}: original sales consolidation`)
    close(inputRow('parent', row.year).ebit + inputRow('subsidiary', row.year).ebit + row.ebitEffect.eok, inputRow('consolidated', row.year).ebit, `${row.year}: original EBIT consolidation`)
  }
  for (const entity of ['parent', 'subsidiary']) for (const [key, amount] of Object.entries(data.assetPools[entity])) exact(amount, source.assetPools2025[entity][key].eok, `${entity}: asset pool ${key}`)
  for (const row of data.depreciationProxy) {
    const raw = source.forecastDaKnownAndProxy.find(item => item.year === row.year)
    exact(row.parent, raw.parentTotalDepreciationProxy.eok, `${row.year}: parent DA proxy`)
    exact(row.subsidiary, raw.subsidiaryDepreciationKnown.eok, `${row.year}: subsidiary disclosed depreciation`)
  }
  exact(data.ownership.parent, source.userProvidedInputs.parentOwnershipRatio, 'user ownership 75%')
  exact(data.ownership.nci, source.userProvidedInputs.nciOwnershipRatio, 'user NCI 25%')
  close(data.ownership.parent + data.ownership.nci, 1, 'ownership total')
})

section('market-inputs-and-wacc', () => {
  deep(data.market.wacc, market.wacc, 'WACC research to compact')
  deep(data.market.industry, market.industryOperatingAssumptions, 'industry research to compact')
  deep(data.market.tax, market.taxReference, 'tax research to compact')
  const dnp = market.peers.find(peer => peer.id === 'dnp')
  deep(data.market.dnp, dnp, 'DNP research to compact')
  const w = market.wacc, i = w.inputs
  for (const ref of w.referenceCalculations) {
    const industry = w.industryProxies.find(item => item.name === ref.industry)
    const debt = w.debtProxies.find(item => item.rating === ref.ratingExample)
    const beta = industry.unleveredBetaCashAdjusted * (1 + (1 - i.marginalTaxRate) * industry.debtToEquityMarket)
    const rf = i.governmentYield - i.sovereignDefaultSpread
    const ke = rf + beta * i.matureErp + i.countryRiskLambda * i.countryRiskPremium
    const rate = (ke + debt.yield * (1 - i.marginalTaxRate) * industry.debtToEquityMarket) / (1 + industry.debtToEquityMarket)
    close(beta, ref.betaL, `${ref.id}: relevered beta`)
    close(rate, ref.wacc, `${ref.id}: WACC reconstruction`)
  }
  const ref = w.referenceCalculations.find(item => item.id === w.selectedModelConvention.referenceId)
  close(inputs.baseWacc, ref.wacc, 'selected model WACC')
  close(inputs.ncwcRatio, market.industryOperatingAssumptions.ncwcToRevenue, 'NCWC industry ratio')
  close(inputs.developmentRatio, market.industryOperatingAssumptions.rdToRevenue * .20, 'development budget, assumed 20% share')
  exact(inputs.exitMultiple, null, 'OMM peer multiple unavailable, not zero or retained DNP')
  exact(inputs.exitMultipleBasis.status, 'pending-omm-peer-verification', 'OMM multiple research status')
  exact(inputs.exitMultipleBasis.priorityPeer, '핌스', 'primary product competitor')
  exact(inputs.exitMultipleBasis.excludedAppliedPeer, 'DNP', 'DNP withdrawn from applied multiple')
})

const scenarioSummaries = []
section('fcff-periods-scenarios-and-discounting', () => {
  deep(model.scenarioValuations.map(result => result.scenario.id), ['downside', 'base', 'upside'], 'scenario order')
  const expected = { downside: [.75, 1.2, .015], base: [1, 1, 0], upside: [1.15, .8, -.015] }
  for (const result of model.scenarioValuations) {
    const { scenario } = result, [capture, nwcFactor, spread] = expected[scenario.id]
    close(scenario.growthCapture, capture, `${scenario.id}: growth capture assumption`)
    close(scenario.nwcFactor, nwcFactor, `${scenario.id}: NWC assumption`)
    close(scenario.wacc, inputs.baseWacc + spread, `${scenario.id}: WACC scenario`)
    for (const entity of entities) {
      const valuation = result[entity]
      deep(valuation.rows.map(row => row.year), forecastYears, `${scenario.id}/${entity}: four explicit periods`)
      let previousNwc = (inputRow(entity, 2025).revenue + (inputRow(entity, 2026).revenue - inputRow(entity, 2025).revenue) * (1 - 109 / 365)) * inputs.ncwcRatio
      for (const row of valuation.rows) {
        const label = `${scenario.id}/${entity}/${row.year}`
        const anchor = forecastAnchorRow(entity, row.year)
        exact(row.referenceYear, row.year, `${label}: source reference year`)
        exact(row.inputBasis, 'companyForecast', `${label}: original vs analyst-extension provenance`)
        const projectedSales = inputRow(entity, 2026).revenue + capture * (anchor.revenue - inputRow(entity, 2026).revenue)
        close(row.revenue, projectedSales, `${label}: independent sales formula`)
        close(row.annualNwc, projectedSales * inputs.ncwcRatio * nwcFactor, `${label}: industry NCWC`)
        close(row.deltaNwc, row.annualNwc - previousNwc, `${label}: NWC stock change, no second proration`)
        previousNwc = row.annualNwc
        const fraction = row.year === 2026 ? 109 / 365 : 1
        close(row.periodFraction, fraction, `${label}: operating fraction`)
        const actualDays = (Date.UTC(row.year, 11, 31) - Date.UTC(2026, 8, 13)) / 86400000
        const discount = Math.pow(1 + scenario.wacc, -actualDays / 365)
        close(row.discountYears, actualDays / 365, `${label}: ACT/365, including leap day`)
        close(row.discountFactor, discount, `${label}: discount factor`)
        close(row.nopat, row.ebit - row.operatingTax, `${label}: NOPAT`)
        const fcff = (row.ebit - row.operatingTax + row.modeledDa - row.maintenance - row.development) * fraction - row.growthCapex - row.deltaNwc
        close(row.fcff, fcff, `${label}: FCFF; 2026 planned growth CAPEX fully unpaid assumption`)
        close(row.pv, fcff * discount, `${label}: PV of explicit FCFF`)
        close(row.modeledDa, row.nonDevelopmentDa + row.developmentAmortization, `${label}: DA composition`)
        if (entity !== 'consolidated') close(row.operatingTax, operatingTax(row.ebit), `${label}: legal-entity operating tax`)
      }
    }
    for (let i = 0; i < forecastYears.length; i++) {
      const p = result.parent.rows[i], s = result.subsidiary.rows[i], g = result.consolidated.rows[i]
      for (const key of ['ebit', 'operatingTax', 'modeledDa', 'maintenance', 'development', 'growthCapex']) close(g[key], p[key] + s[key], `${scenario.id}/${g.year}: group ${key}`)
      close(g.development, g.revenue * inputs.developmentRatio, `${scenario.id}/${g.year}: development external-sales basis`)
      close(g.fcff - p.fcff - s.fcff, p.deltaNwc + s.deltaNwc - g.deltaNwc, `${scenario.id}/${g.year}: group vs legal-entity CF difference`)
    }
  }
})

section('explicit-forecast-boundary-and-no-extra-source-years', () => {
  for (const entity of entities) {
    for (const year of forecastYears) {
      const basis = model.forecastBasis(entity, year)
      exact(basis.referenceYear, year, `${entity}/${year}: original forecast year`)
      exact(basis.inputBasis, 'companyForecast', `${entity}/${year}: no analyst extension`)
      close(basis.revenue, inputRow(entity, year).revenue, `${entity}/${year}: source-linked revenue`)
    }
    for (const year of [2030, 2031, 2032]) {
      assertion(!inputRow(entity, year), `${entity}/${year}: no fabricated compact company forecast`)
      assertion(!sourceRow(entity, year), `${entity}/${year}: no fabricated source JSON period`)
      for (const method of ['sourceRow', 'forecastBasis']) {
        let rejected = false
        try { model[method](entity, year) } catch { rejected = true }
        assertion(rejected, `${entity}/${year}: ${method} rejects year outside explicit/source forecast`)
      }
      for (const result of model.scenarioValuations) assertion(!result[entity].rows.some(row => row.year === year), `${result.scenario.id}/${entity}/${year}: absent from explicit FCFF rows`)
    }
  }
})

section('progressive-tax-boundaries', () => {
  for (const p of [-100, 0, 1, 2, 2.0001, 199.9999, 200, 200.0001, 3000, 3100]) close(model.taxOnOperatingProfit(p), operatingTax(p), `general corporate + local tax on ${p} eok`)
})

section('asset-cohorts-and-reinvestment', () => {
  for (const result of model.scenarioValuations) {
    const developmentByYear = Object.fromEntries(forecastYears.map((year, i) => [year, { parent: result.parent.rows[i].development, subsidiary: result.subsidiary.rows[i].development }]))
    const schedule = reinvestment.buildReinvestmentSchedule({ developmentByYear, endYear: terminalYear })
    deep(schedule.map(row => row.year), forecastYears, `${result.scenario.id}: asset schedule through2029`)
    for (const year of schedule) {
      for (const entity of ['parent', 'subsidiary', 'group']) {
        const row = year[entity], label = `${result.scenario.id}/${entity}/${year.year}`
        close(row.openingAssetBookValue + row.totalAdditions - row.modeledDa, row.closingAssetBookValue, `${label}: asset roll-forward`)
        close(row.maintenanceCashCapex, row.nonDevelopmentDa, `${label}: maintenance assumption`)
        close(row.totalAdditions, row.plannedGrowthCapex + row.maintenanceCapitalizedAddition + row.capitalizedDevelopmentAnnual, `${label}: additions reconciliation`)
        const sourceEntity = entity === 'group' ? 'consolidated' : entity
        close(row.plannedGrowthCapex, data.entities[sourceEntity].capex.find(item => item.year === year.year).amount, `${label}: growth plan from source`)
      }
      for (const c of year.cohortAudit) {
        close(c.openingBookValue - c.depreciation, c.closingBookValue, `${c.id}/${year.year}: cohort balance`)
        assertion(c.closingBookValue >= 0 && Number.isFinite(c.depreciation), `${c.id}/${year.year}: finite depreciation, nonnegative NBV`)
        if (c.assetClass === 'land' || c.assetClass === 'cip') close(c.depreciation, 0, `${c.id}/${year.year}: nondepreciable land/CIP`)
      }
    }
  }
})

section('zero-growth-terminal-and-unavailable-multiple', () => {
  for (const result of model.scenarioValuations) for (const entity of entities) {
    const v = result[entity], last = v.rows[v.rows.length - 1], label = `${result.scenario.id}/${entity}`
    exact(last.year, terminalYear, `${label}: terminal valuation date year2029`)
    exact(v.terminalYear, terminalYear, `${label}: exported TV timing`)
    exact(v.terminalCashFlowYear, steadyStateYear, `${label}: exported steady cash flow timing`)
    if (entity !== 'consolidated') {
      const cap = inputRow(entity, 2028).ebit / inputRow(entity, 2028).revenue
      const sustainable = Math.min(last.ebit + last.developmentAmortization, last.revenue * cap) - last.development
      close(v.terminalEbit, sustainable, `${label}: source 2028 margin cap + mature development amortization`)
      close(v.terminalTax, operatingTax(sustainable), `${label}: terminal legal-entity tax`)
    } else {
      close(v.terminalEbit, result.parent.terminalEbit + result.subsidiary.terminalEbit, `${label}: terminal group EBIT`)
      close(v.terminalTax, result.parent.terminalTax + result.subsidiary.terminalTax, `${label}: terminal group tax`)
    }
    const stableDa = last.nonDevelopmentDa + last.development
    const stableInvestment = last.nonDevelopmentDa + last.development
    close(v.terminalFcff, v.terminalEbit - v.terminalTax + stableDa - stableInvestment - 0, `${label}: full g=0 FCFF bridge`)
    close(v.terminalValue, v.terminalFcff / result.scenario.wacc, `${label}: g=0 TV`)
    const terminalDiscountYears = (Date.UTC(terminalYear, 11, 31) - Date.UTC(2026, 8, 13)) / 86400000 / 365
    close(last.discountYears, terminalDiscountYears, `${label}: TV discounted from2029-12-31, 3.301369863 years`)
    close(v.pvTerminal, v.terminalValue / Math.pow(1 + result.scenario.wacc, terminalDiscountYears), `${label}: 2030 steady FCFF capitalized at2029 year-end`)
    close(v.pvExplicit, v.rows.reduce((sum, row) => sum + row.fcff * row.discountFactor, 0), `${label}: explicit PV`)
    close(v.ev, v.pvExplicit + v.pvTerminal, `${label}: DCF EV`)
    for (const key of multipleEntityKeys) exact(v[key], null, `${label}/${key}: unavailable value retained as null`)
    close(v.terminalShare, v.pvTerminal / v.ev, `${label}: TV concentration, above100% allowed`)
  }
})

section('equity-nci-sotp-and-floor', () => {
  for (const result of model.scenarioValuations) {
    const label = result.scenario.id, p = result.parent, s = result.subsidiary, g = result.consolidated
    for (const entity of entities) {
      close(result[entity].netDebt, data.entities[entity].balance2025.netDebt, `${label}/${entity}: disclosed 2025 net debt proxy`)
      close(result[entity].rawEquity, result[entity].ev - result[entity].netDebt, `${label}/${entity}: unadjusted equity`)
    }
    const sf = Math.max(0, s.ev - s.netDebt)
    close(result.subsidiaryEquity, sf, `${label}: limited-liability floor`)
    close(result.subsidiaryFloorAdjustment, sf - s.rawEquity, `${label}: floor adjustment retained`)
    close(result.nci, sf * .25, `${label}: NCI value25%, not group EV25%`)
    close(result.parentHolding, sf * .75, `${label}: parent holding75%`)
    close(result.consolidatedEquity, g.ev - g.netDebt - sf * .25, `${label}: parent shareholders via consolidated DCF`)
    close(result.parentSotp, p.ev - p.netDebt + sf * .75, `${label}: SOTP without investment book value addition`)
    for (const key of multipleResultKeys) exact(result[key], null, `${label}/${key}: unavailable ownership bridge, no zero coercion`)
    const nwcDifferencePV = g.rows.reduce((sum, row, i) => sum + (p.rows[i].deltaNwc + s.rows[i].deltaNwc - row.deltaNwc) * row.discountFactor, 0)
    const netDebtDifference = p.netDebt + s.netDebt - g.netDebt
    close(result.scopeGap, nwcDifferencePV + netDebtDifference - result.subsidiaryFloorAdjustment, `${label}: scope gap attribution, including hypothetical floor`)
    const entityPvBridges = Object.fromEntries(entities.map(entity => {
      const v = result[entity]
      return [entity, { explicitPV: v.pvExplicit, terminalPV: v.pvTerminal, enterpriseValue: v.ev, bridgeResidual: v.pvExplicit + v.pvTerminal - v.ev }]
    }))
    scenarioSummaries.push({ scenario: result.scenario, explicitYears: forecastYears, terminalDate: `${terminalYear}-12-31`, steadyStateYear, terminalDiscountYears: g.rows[g.rows.length - 1].discountYears, entityPvBridges, parentOperatingEV: p.ev, subsidiaryOperatingEV: s.ev, consolidatedOperatingEV: g.ev, consolidatedExplicitPV: g.pvExplicit, consolidatedTerminalPV: g.pvTerminal, evBridgeResidual: g.pvExplicit + g.pvTerminal - g.ev, parentSotp: result.parentSotp, consolidatedParentEquity: result.consolidatedEquity, nci: result.nci, subsidiaryFloorAdjustment: result.subsidiaryFloorAdjustment, scopeGap: result.scopeGap, scopeGapNwcPV: nwcDifferencePV, terminalProfit: g.terminalEbit, terminalFcff: g.terminalFcff, terminalShare: g.terminalShare, conditionalExitMultipleEV: g.multipleEv, conditionalExitMultipleEquity: result.multipleConsolidatedEquity, methodEVGap: g.gap, remaining2026Fcff: g.rows[0].fcff, indicativeCashPlus70PlusUnleveredFcff: data.entities.consolidated.balance2025.cash + 70 + g.rows[0].fcff })
  }
  const stressed = model.calculateValuation('base', { wacc: .5, terminalProfitFactor: .2 })
  assertion(stressed.subsidiary.rawEquity < 0, 'stress case activates subsidiary floor')
  close(stressed.subsidiaryEquity, 0, 'stress: no negative-value NCI credit')
  close(stressed.nci, 0, 'stress: NCI floor')
  close(stressed.parentHolding, 0, 'stress: no automatic negative holding deduction')
  close(stressed.subsidiaryFloorAdjustment, -stressed.subsidiary.rawEquity, 'stress: raw shortfall preserved')
})

section('manual-multiple-override-and-source-period-preservation', () => {
  for (const base of model.scenarioValuations) {
    const id = base.scenario.id
    const manual = model.calculateValuation(id, { exitMultiple: 10 })
    assertion(JSON.stringify(withoutMultiple(manual)) === JSON.stringify(withoutMultiple(base)), `${id}: manual override preserves exact serialized nonmultiple values`)
    deep(withoutMultiple(manual), withoutMultiple(base), `${id}: positive manual multiple leaves DCF/FCFF unchanged`)
    for (const entity of entities) {
      const v = manual[entity], last = v.rows[v.rows.length - 1], label = `${id}/${entity}/manual10`
      const terminalEV = v.terminalEbit * 10
      const discountedEV = v.pvExplicit + terminalEV / Math.pow(1 + manual.scenario.wacc, last.discountYears)
      close(v.exitTerminalValue, terminalEV, `${label}: normalized EBIT times explicit assumption`)
      close(v.exitPvTerminal, terminalEV * last.discountFactor, `${label}: discounted terminal multiple`)
      close(v.multipleEv, discountedEV, `${label}: explicit PV plus terminal PV`)
      close(v.multipleRawEquity, discountedEV - v.netDebt, `${label}: EV to equity`)
      close(v.gap, discountedEV - v.ev, `${label}: method gap`)
      close(v.gap, (terminalEV - v.terminalValue) * last.discountFactor, `${label}: gap solely terminal method`)
      close(v.gapRate, discountedEV / v.ev - 1, `${label}: gap rate`)
    }
    const subsidiaryEquity = Math.max(0, manual.subsidiary.multipleEv - manual.subsidiary.netDebt)
    close(manual.multipleNci, subsidiaryEquity * .25, `${id}: manual NCI`)
    close(manual.multipleParentHolding, subsidiaryEquity * .75, `${id}: manual parent holding`)
    close(manual.multipleConsolidatedEquity, manual.consolidated.multipleEv - manual.consolidated.netDebt - subsidiaryEquity * .25, `${id}: manual consolidated owner equity`)
    close(manual.multipleParentSotp, manual.parent.multipleEv - manual.parent.netDebt + subsidiaryEquity * .75, `${id}: manual SOTP`)
    for (const supplied of [{}, { exitMultiple: undefined }, { exitMultiple: null }]) {
      deep(model.calculateValuation(id, supplied), base, `${id}: omitted/undefined/explicit-null multiple preserves unavailable state`)
    }
    for (const invalid of [0, -1, NaN, Infinity, -Infinity]) {
      let rejected = false
      try { model.calculateValuation(id, { exitMultiple: invalid }) } catch (error) { rejected = /Exit multiple/.test(error.message) }
      assertion(rejected, `${id}: invalid multiple ${invalid} rejected, never treated as missing`)
    }
  }
  if (options.before) {
    const before = read(options.before)
    exact(model.scenarioValuations.length, before.scenarios.length, 'pre-period-change scenario count')
    for (const [label, actual, previous] of [['base', model.baseValuation, before.base], ...model.scenarioValuations.map((result, i) => [`scenario${i}`, result, before.scenarios[i]])]) {
      assertion(JSON.stringify(actual.scenario) === JSON.stringify(previous.scenario), `${label}: scenario assumptions unchanged`)
      for (const entity of entities) {
        const priorRows = previous[entity].rows.filter(row => forecastYears.includes(row.year))
        assertion(JSON.stringify(actual[entity].rows) === JSON.stringify(priorRows), `${label}/${entity}: all2026–2029 annual FCFF row fields exactly unchanged`)
        deep(actual[entity].rows, priorRows, `${label}/${entity}: independent original-row comparison`)
        exact(actual[entity].netDebt, previous[entity].netDebt, `${label}/${entity}: 2025 net debt unchanged`)
        close(actual[entity].pvExplicit, priorRows.reduce((sum, row) => sum + row.pv, 0), `${label}/${entity}: explicit PV limited to preserved2026–2029 rows`)
        exact(actual[entity].terminalYear, 2029, `${label}/${entity}: changed terminal date retained`)
        exact(actual[entity].terminalCashFlowYear, 2030, `${label}/${entity}: changed steady cash-flow date retained`)
      }
    }
  }
})

section('primary-capital-injection-70', () => {
  for (const entity of ['parent', 'consolidated']) {
    const effect = model.investmentEffect(entity, 70), bs = data.entities[entity].balance2025
    close(effect.assetsAfter, bs.assets + 70, `${entity}: post-cash-injection assets`)
    close(effect.equityAfter, bs.equity + 70, `${entity}: accounting equity`)
    close(effect.cashAfter, bs.cash + 70, `${entity}: cash before deployment`)
    close(effect.netDebtAfter, bs.netDebt - 70, `${entity}: net debt, no double credit`)
    close(effect.debtRatioAfter, bs.liabilities / (bs.equity + 70), `${entity}: liabilities/equity ratio`)
    close(effect.postMoney, effect.preMoney + 70, `${entity}: pre/post equity value`)
    close(effect.newInvestorShare, 70 / (effect.preMoney + 70), `${entity}: equal-rights primary share`)
    close(effect.newInvestorShare * effect.postMoney, 70, `${entity}: subscription value conservation`)
  }
})

section('saved-calculation-parity-and-source-preservation', () => {
  const saved = read(calculationPath)
  deep(saved.base, model.baseValuation, 'saved base')
  deep(saved.scenarios, model.scenarioValuations, 'saved scenarios')
  for (const entity of ['parent', 'consolidated']) deep(saved.investment[entity], model.investmentEffect(entity, 70), `saved investment ${entity}`)
  for (const [id, entry] of Object.entries(source.sources)) exact(sha(entry.path), entry.sha256, `${id}: workbook unchanged after audit`)
})

const report = {
  schemaVersion: 4, verifiedAt: new Date().toISOString(), valuationDate: '2026-09-13',
  status: failures.length ? 'FAIL' : 'PASS', assertionCount: assertions,
  monetaryUnit: '억원', arithmeticAbsoluteToleranceEok: 1e-8,
  sourceAmountComparison: 'exact number/null equality; no missing-to-zero conversion',
  horizon: { explicitYears: forecastYears, companyForecastYears, analystExtensionYears: extensionYears, fullCalendarForecastYears: [2027, 2028, 2029], terminalDate: `${terminalYear}-12-31`, steadyStateYear, extensionConvention: 'No explicit analyst extension. Source forecast2026–2029 only; 2030 normalized sustainable FCFF enters perpetual g0 terminal value at2029 year-end.' },
  command: 'node scripts/temsco/verify-v4-valuation.cjs', compiledModel: options.model,
  scope: 'V4 source JSON/compact data and compiled numerical model. Not an audit opinion on original financial statements or confirmation of forecasts/market fair value.',
  sections, failures, scenarioSummaries, inputManifest: manifest,
  multiplePolicy: { status: inputs?.exitMultipleBasis.status, appliedMultiple: inputs?.exitMultiple, missingRepresentation: 'null; zero/negative/nonfinite rejected', positiveManualOverrideTested: 10, manualOverrideIsMarketEvidence: false, prePeriodChangeComparison: options.before },
  qualifications: [
    '회사 입력: V4 원본 캐시에서 추출한 source JSON 기준. 감사보고서 원문·원장 재감사 및 Excel 외부링크 재계산 미수행.',
    '2026 영업분109/365, 예정 성장CAPEX112.5억 전액 잔여 지급, 2025말 순차입금 유지: 분석 가정.',
    '사용자 지정 명시추정기간2026–2029만 반영. 2030·2031 추가 명시연도 미생성. 기존2026–2029 원본연결 수치·코호트·세금·재투자 행 유지.',
    '명시기간2026잔여 + 2027–2029. 2030 정상 FCFF의g0 잔존가치는2029-12-31에 산출하고 평가일까지ACT/365 할인. 4개 연도 입력이나 첫해는109/365 잔여기간.',
    '제조 D&A proxy, 내용연수, 유지CAPEX=D&A, 추가 개발비, 산업 NCWC, 정상마진 상한: 관측된 회사 정책과 구분.',
    '모든 현재 시나리오의 연결-SOTP 차이: NWC proxy 범위 차이. 세금은 법인별 합계로 동일. 스트레스 floor 발동 시 그 조정 별도.',
    'DNP 그룹배수 적용 철회. OMM 비교기업 배수 미확정으로 멀티플 EV·지분가치·DCF 격차는 null. 수동10배 검증은 수식 점검용이며 시장 관측배수 아님.',
    '70억 효과: 2025말 잔액 유지 및 증자 직후·자금집행 전 비교. 이자/원금/추가차입/현금시점 포함 현금수지와 구분.',
    '75%/25%: 사용자 제공 지분. 제한책임 floor0는 보증/지원의무 미확인 가정. 주주명부·우선권·투자조건 확인 전.',
    'UI/인쇄/페이지 표시의 적합성은 별도 화면 및 PDF 검증 대상.',
  ],
}
fs.mkdirSync(path.dirname(options.output), { recursive: true })
fs.writeFileSync(options.output, JSON.stringify(report, null, 2) + '\n')
console.log(`${report.status}: ${assertions} assertions across ${sections.length} sections; ${failures.length} failures`)
console.log(options.output)
for (const failure of failures.slice(0, 12)) console.error(`${failure.section}: ${failure.label}`)
process.exitCode = failures.length ? 1 : 0
