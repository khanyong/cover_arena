/* Independent source-readback reconciliation. Run after compiling investorExitModel.ts to CommonJS. */
'use strict'
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const root = path.resolve(__dirname, '../..')
if (!process.argv[2]) throw new Error('Usage: node scripts/temsco/verify-v4-investor-exit.cjs <compiled investorExitModel.js> [prePeriodChangeModel.json]')
const compiledPath = path.resolve(process.argv[2])
const model = require(compiledPath)
const source = JSON.parse(fs.readFileSync(path.join(root, 'projects/temsco/v4/analysis/valuation-calculation.json')))
const input = JSON.parse(fs.readFileSync(path.join(root, 'components/TemscoV4/valuationData.json')))
const hashes = JSON.parse(fs.readFileSync(path.join(root, 'projects/temsco/v4/analysis/exit-strategy-preserved-hashes.json')))
const beforePath = process.argv[3] ? path.resolve(process.argv[3]) : null
const before = beforePath ? JSON.parse(fs.readFileSync(beforePath)) : null
let checks = 0
const close = (actual, expected, label) => { assert(Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)), `${label}: ${actual} != ${expected}`); checks++ }
const ok = (condition, label) => { assert(condition, label); checks++ }
const same = (actual, expected, label) => { assert.deepStrictEqual(actual, expected, label); checks++ }
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

// This older preservation file predates later authorized content/OMM changes. Keep source
// workbooks, compact company data, reinvestment logic and V1–V3 strict; record mutable
// files explicitly rather than relabeling all 19 historical hashes as unchanged.
const approvedMutableFiles = new Map([
  ['components/TemscoV4/valuationInputs.ts', 'OMM withdrawal and user-requested2026–2029 explicit forecast'],
  ['components/TemscoV4/valuationModel.ts', 'OMM nullable multiple/manual override and2029 terminal date'],
  ['projects/temsco/v4/analysis/valuation-calculation.json', 'Current four-year source-linked calculation readback'],
  ['components/TemscoV4/AcquisitionValueSlide.tsx', 'Subsequent authorized presentation/content revisions'],
  ['components/TemscoV4/AcquisitionSynergySlide.tsx', 'Subsequent authorized presentation/content revisions'],
  ['components/TemscoV4/FinancialSourceSlides.tsx', 'Subsequent authorized presentation/content revisions'],
  ['components/TemscoV4/ValuationSlides.tsx', 'Subsequent authorized presentation and OMM review'],
  ['components/TemscoV4/MarketValuationSlides.tsx', 'Subsequent authorized presentation and OMM review'],
  ['components/TemscoV4/DeckContents.tsx', 'Subsequent authorized contents/technology revisions'],
  ['components/TemscoV4/ChapterDivider.tsx', 'Subsequent authorized contents/technology revisions'],
])
const preservedFiles = [], mutableFileObservations = []
for (const [name, historicalHash] of Object.entries(hashes)) {
  const currentHash = sha(path.join(root, name))
  if (approvedMutableFiles.has(name)) {
    mutableFileObservations.push({ path: name, reason: approvedMutableFiles.get(name), historicalSha256: historicalHash, currentSha256: currentHash, changed: currentHash !== historicalHash })
  } else {
    ok(currentHash === historicalHash, `Immutable source/version/model preserved: ${name}`)
    preservedFiles.push(name)
  }
}
ok(preservedFiles.filter(file => file.endsWith('.xlsx')).length === 4, 'Four original Excel source hashes independently preserved')
ok(fs.statSync(compiledPath).mtimeMs >= fs.statSync(path.join(root, 'components/TemscoV4/investorExitModel.ts')).mtimeMs, 'Compiled exit model not older than source')
const entryShare = 70 / (source.base.consolidatedEquity + 70)
close(model.entryInvestorShare, entryShare, 'Fixed DCF entry price and share')
close(model.preIpoInvestorShare, entryShare * .8, 'Future dilution')
close(model.postIpoInvestorShare, entryShare * .8 * .8, 'Primary IPO dilution')
same(model.investorExitAssumptions.investmentYear, 2026, 'Investment-year assumption unchanged')
same(model.investorExitAssumptions.ipoTargetYear, 2031, 'IPO target remains2031, independent of DCF horizon')
same(model.investorExitAssumptions.ipoRealizationYear, 2032, 'IPO realization remains2032')
same(model.investorExitAssumptions.saleYear, 2031, 'Sale target remains2031')
same(model.investorExitAssumptions.buybackPricingYears, 5, 'Buyback pricing remainsfive years')
same(model.investorExitAssumptions.buybackNoticeDays, 90, 'Buyback notice remains90 days')
same(model.investorExitAssumptions.buybackPaymentDays, 180, 'Buyback settlement remains180 days')

model.investorExitCases.forEach((row, i) => {
  const ref = source.scenarios[i]
  ok(row.scenario === ref.scenario.id, 'Scenario alignment')
  close(row.normalizedGroupEbit, ref.consolidated.terminalEbit, 'Normalized source group EBIT')
  close(row.normalizedSubsidiaryEbit, ref.subsidiary.terminalEbit, 'Normalized source subsidiary EBIT')
  same(ref.consolidated.rows.map(period => period.year), [2026, 2027, 2028, 2029], 'DCF entry source limited tofour explicit years')
  same(ref.consolidated.terminalYear, 2029, 'DCF terminal value at2029 year-end')
  same(ref.consolidated.terminalCashFlowYear, 2030, 'Sustainable cash-flow normalization from2030')
  same(row.ipo, null, 'Unavailable multiple: IPO amount/profit package remains null')
  same(row.sale, null, 'Unavailable multiple: sale amount/profit package remains null')
  const buybackPrice = 70 * Math.pow(1 + [.08, .10, .12][i], 5)
  close(row.buyback.grossProceeds, buybackPrice, 'Buyback five-year pricing convention')
  close(row.buyback.costs, buybackPrice * .02, 'Buyback costs')
  close(row.buyback.netProceeds, buybackPrice * .98, 'Buyback cash after assumed costs')
  close(row.buyback.profit, buybackPrice * .98 - 70, 'Buyback pretax profit')
  close(row.buyback.moic, buybackPrice * .98 / 70, 'Buyback net MOIC')
  ok(!('irr' in row.buyback), 'No misleading five-year IRR with payment delay')
  if (before) {
    same(row.buyback, before.exitCases[i].buyback, 'Pre-period-change buyback unchanged')
  }
})
same(model.calculateInvestorExitCases(), model.investorExitCases, 'Omitted multiple defaults to unavailable')
same(model.calculateInvestorExitCases(undefined), model.investorExitCases, 'Undefined multiple defaults to unavailable')
same(model.calculateInvestorExitCases(null), model.investorExitCases, 'Explicit null retains unavailable state')
for (const invalid of [0, -1, NaN, Infinity, -Infinity]) {
  assert.throws(() => model.calculateInvestorExitCases(invalid), /Exit multiple must be positive or unavailable/, `Reject invalid multiple ${invalid}`)
  checks++
}

// Explicit synthetic 10x assumption: independent formulas, never a selected market peer.
const manualCases = model.calculateInvestorExitCases(10)
manualCases.forEach((row, i) => {
  const ref = source.scenarios[i]
  same(row.buyback, model.investorExitCases[i].buyback, 'Manual market multiple cannot alter buyback')
  for (const route of ['ipo', 'sale']) {
    const v = row[route], multiple = 10 * (route === 'ipo' ? [.6, .7, .8][i] : [.5, .6, .7][i])
    const ev = ref.consolidated.terminalEbit * multiple
    const subsidiaryEv = ref.subsidiary.terminalEbit * multiple
    const subsidiaryEquity = Math.max(0, subsidiaryEv - input.entities.subsidiary.balance2025.netDebt)
    const nci = subsidiaryEquity * .25
    const equity = Math.max(0, ev - input.entities.consolidated.balance2025.netDebt - nci)
    close(v.multiple, multiple, 'Manual multiple times disclosed route/scenario factor')
    close(v.groupEv, ev, 'Future EV without present-value discount')
    close(v.subsidiaryEv, subsidiaryEv, 'Subsidiary future EV')
    close(v.subsidiaryEquity, subsidiaryEquity, 'Subsidiary equity floor')
    close(v.nci, nci, 'Subsidiary equity-based NCI')
    close(v.ownerEquity, equity, 'EV to parent-owner equity')
    close(v.grossProceeds, equity * entryShare * .8, 'Shareholder proceeds')
    if (route === 'ipo') {
      close(v.listingMarketCap, equity / .8, 'IPO post-primary capitalization')
      close(v.primaryOffering, equity / .8 * .2, 'IPO primary proceeds')
      close(v.listingMarketCap - v.primaryOffering, equity, 'IPO cash conservation')
      close(v.listingMarketCap * model.postIpoInvestorShare, equity * model.preIpoInvestorShare, 'Primary dilution/value conservation')
    }
    close(v.costs, v.grossProceeds * .02, 'Transaction cost assumption')
    close(v.netProceeds, v.grossProceeds * .98, 'Net cash before investor tax')
    close(v.profit, v.grossProceeds * .98 - 70, 'Pretax net investment profit')
    close(v.moic, v.netProceeds / 70, 'Net MOIC')
    close(70 * Math.pow(1 + v.irr, route === 'ipo' ? 6 : 5), v.netProceeds, 'IRR cash-flow reconciliation')
  }
})
ok(manualCases[0].sale.profit < 0, 'Synthetic downside investor loss retained')
const synthetic = structuredClone(source.base)
synthetic.subsidiary.netDebt = 1e9
synthetic.consolidated.netDebt = 1e10
const distressed = model.futureOwnerValue(synthetic, 1)
close(distressed.nci, 0, 'No negative NCI credit')
close(distressed.ownerEquity, 0, 'Limited-liability equity floor')
const output = {
  schemaVersion: 3, verifiedAt: new Date().toISOString(), status: 'PASS', checks,
  preservedFiles, mutableFileObservations,
  prePeriodChangeEvidence: beforePath ? { path: beforePath, sha256: sha(beforePath) } : null,
  compiledModel: { path: compiledPath, sha256: sha(compiledPath) },
  assumptions: model.investorExitAssumptions,
  multiplePolicy: { selectedMultiple: null, status: 'pending-omm-peer-verification', missingRepresentation: 'IPO/sale objects null; no zero or DNP fallback', manualOverrideTested: 10, manualOverrideIsMarketEvidence: false },
  entryInvestorShare: model.entryInvestorShare, preIpoInvestorShare: model.preIpoInvestorShare, postIpoInvestorShare: model.postIpoInvestorShare,
  cases: model.investorExitCases, manualFormulaTestCases: manualCases,
  scope: 'DNP applied multiple withdrawn. IPO/sale amounts unavailable until OMM peer verification. Entry share recalculated from2026–2029 explicit DCF plus2030 normalized g0 cash flow valued at2029 year-end. IPO2031/realization2032/sale2031 dates retained independently of DCF forecast horizon. Buyback unchanged. Synthetic positive-multiple test validates formulas, not fair value; uses normalized sustainable EBIT held to future exit. Buyback usesfive-year pricing, assumed2% costs and excludes settlement delay; no guaranteed execution.',
}
fs.writeFileSync(path.join(root, 'projects/temsco/v4/analysis/exit-amount-calculation.json'), JSON.stringify(output, null, 2) + '\n')
console.log(`PASS: ${checks} investor-exit checks; ${preservedFiles.length} immutable files preserved; ${mutableFileObservations.length} authorized mutable files recorded separately`)
