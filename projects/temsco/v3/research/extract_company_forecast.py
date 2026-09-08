"""Read-only extraction of company forecasts for the V3 financial analysis."""
from pathlib import Path
from datetime import date
import hashlib
import json
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
manifest = {v['id']: v for v in json.loads((ROOT / 'analysis/manifest.json').read_text())}
books = {k: openpyxl.load_workbook(manifest[k]['path'], data_only=True) for k in ['S02', 'S03', 'S04', 'S06']}
formulas = {k: openpyxl.load_workbook(manifest[k]['path'], data_only=False) for k in books}
evidence = {}

def cell(source, sheet, address):
    key = f'{source}:{sheet}!{address}'
    v = books[source][sheet][address].value
    f = formulas[source][sheet][address]
    evidence[key] = {'value': v, 'formula': f.value if f.data_type == 'f' else None}
    return v

def read_rows(source, sheet, column, rows):
    return {label: cell(source, sheet, f'{column}{r}') for label, r in rows.items()}

parent_rows = {'revenue': 7, 'cogs': 11, 'grossProfit': 12, 'sgaPayroll': 15, 'sgaDa': 16,
    'sgaBadDebt': 17, 'sgaOther': 18, 'sga': 19, 'ebit': 20, 'interestIncome': 23,
    'equityMethodResult': 24, 'nonOperatingBadDebt': 25, 'interestExpenseSigned': 26,
    'otherNonOperating': 27, 'netNonOperating': 28, 'ebt': 29, 'taxExpense': 30, 'netIncome': 31}
subsidiary_rows = {'revenue': 5, 'toParentAsLabelled': 6, 'externalAsLabelled': 7,
    'cogs': 9, 'directMaterials': 10, 'outsourcing': 11, 'manufacturingPayroll': 12,
    'manufacturingDa': 13, 'manufacturingOther': 14, 'grossProfit': 15, 'sga': 17,
    'sgaPayroll': 18, 'sgaDa': 19, 'sgaOther': 20, 'sgaBadDebt': 21, 'ebit': 22,
    'ebitda': 24, 'netNonOperating': 25, 'netInterestExpenseSigned': 27,
    'otherNonOperating': 28, 'ebt': 29, 'taxExpense': 30, 'netIncome': 31}
consolidated_rows = {'revenue': 10, 'cogs': 14, 'grossProfit': 15, 'sgaPayroll': 18,
    'sgaDa': 19, 'sgaBadDebt': 20, 'sgaOther': 21, 'sga': 22, 'ebit': 23,
    'interestIncome': 26, 'equityMethodResult': 27, 'nonOperatingBadDebt': 28,
    'interestExpenseSigned': 29, 'otherNonOperating': 30, 'netNonOperating': 31,
    'ebt': 32, 'taxExpense': 33, 'netIncome': 34}
periods = []
for year, pcol, mcol, scol, wcol, ccol, adjcol in zip(range(2024, 2030),
        ['F', 'I', 'L', 'O', 'R', 'U'], ['G', 'J', 'M', 'P', 'S', 'V'],
        ['H', 'K', 'N', 'Q', 'T', 'W'], ['D', 'E', 'G', 'H', 'I', 'J'],
        ['I', 'M', 'Q', 'U', 'Y', 'AC'], ['D', 'E', 'F', 'G', 'H', 'I']):
    parent = read_rows('S06', '추정손익', pcol, parent_rows)
    subsidiary = read_rows('S04', '추정손익', wcol, subsidiary_rows)
    consolidated = read_rows('S02', '연결', ccol, consolidated_rows)
    subsidiary['totalDa'] = subsidiary['manufacturingDa'] + subsidiary['sgaDa']
    consolidated['daDisclosedSubtotal'] = parent['sgaDa'] + subsidiary['totalDa']
    consolidated['totalDa'] = None  # Parent manufacturing D&A not separated in current forecast.
    consolidated['nopat'] = None  # Legal-entity operating tax/NOL schedule not supplied.
    consolidated['operatingCashTax'] = None
    consolidated['deltaNwc'] = None
    consolidated['fcff'] = None
    consolidated['salesGrowth'] = None if not periods else consolidated['revenue'] / periods[-1]['consolidated']['revenue'] - 1
    consolidated['grossMargin'] = consolidated['grossProfit'] / consolidated['revenue']
    consolidated['ebitMargin'] = consolidated['ebit'] / consolidated['revenue']
    segments = {
        'parentMaskGrossRevenue': cell('S06', '추정손익', mcol + '7'),
        'parentMaterialsGrossRevenue': cell('S06', '추정손익', scol + '7'),
        'subsidiaryToParentAsLabelled': subsidiary['toParentAsLabelled'],
        'subsidiaryExternalAsLabelled': subsidiary['externalAsLabelled'],
        'historicalSubsidiaryCustomerLabelsReliable': year >= 2026,
    }
    if year >= 2026:
        n = {2026: 7, 2027: 15, 2028: 23, 2029: 31}[year]
        segments['subsidiaryToParentRevenue'] = -cell('S02', '연결조정 내역', f'G{n}')
        segments['parentToSubsidiaryRevenue'] = -cell('S02', '연결조정 내역', f'G{n+2}')
        segments['intercompanyRevenueElimination'] = -(segments['subsidiaryToParentRevenue'] + segments['parentToSubsidiaryRevenue'])
    else:
        segments['intercompanyRevenueElimination'] = consolidated['revenue'] - parent['revenue'] - subsidiary['revenue']
    capex = {'parent': None, 'subsidiary': None, 'combinedPlannedAdditions': None,
        'cashPaymentSchedule': None, 'maintenanceVsGrowthSplitConfirmed': False}
    if year >= 2026:
        cp = ['C', 'D', 'E', 'F'][year - 2026]
        cw = ['E', 'F', 'G', 'H'][year - 2026]
        capex['parent'] = cell('S06', 'CAPEX', cp + '11')
        capex['subsidiary'] = cell('S04', 'CAPEX_감가상각', cw + '7')
        capex['combinedPlannedAdditions'] = capex['parent'] + capex['subsidiary']
        capex['parentLand'] = cell('S06', 'CAPEX', cp + '7')
        capex['parentBuilding'] = cell('S06', 'CAPEX', cp + '8')
        capex['parentRAndDEquipment'] = cell('S06', 'CAPEX', cp + '6')
        parent['newDaFromCapex'] = sum(cell('S06', 'CAPEX', cp + str(r)) or 0 for r in [14, 15])
        parent['totalDa'] = None
        parent['existingDaAccumulatedBalanceChangeProxy2025'] = cell('S03', '과거실적', 'J12')
        parent['totalDaIllustrativeProxy'] = parent['existingDaAccumulatedBalanceChangeProxy2025'] + parent['newDaFromCapex']
        consolidated['totalDaIllustrativeProxy'] = parent['totalDaIllustrativeProxy'] + subsidiary['totalDa']
    periods.append({'year': year, 'status': 'company_historical_unreconciled' if year < 2026 else 'company_annual_forecast',
        'parent': parent, 'subsidiary': subsidiary, 'consolidated': consolidated,
        'segments': segments, 'capex': capex,
        'sourceColumns': {'parent': f'S06:추정손익!{pcol}', 'subsidiary': f'S04:추정손익!{wcol}', 'consolidated': f'S02:연결!{ccol}'}})

def balance(entity, sheet, r):
    raw = {k: cell('S03', sheet, a) for k, a in r.items()}
    raw['tradeReceivablesNet'] = raw['tradeReceivablesGross'] - abs(raw['tradeAllowanceRaw'])
    raw['coreTradeNwc'] = raw['tradeReceivablesNet'] + raw['inventory'] - raw['tradePayables']
    revenue = periods[1][entity]['revenue']; cogs = periods[1][entity]['cogs']
    raw['closingBalanceProxyDsoDays'] = raw['tradeReceivablesNet'] / revenue * 365
    raw['closingBalanceProxyDioDays'] = raw['inventory'] / cogs * 365
    raw['closingBalanceProxyDpoDays'] = raw['tradePayables'] / cogs * 365
    raw['coreTradeNwcToRevenue'] = raw['coreTradeNwc'] / revenue
    raw['sources'] = {k: f'S03:{sheet}!{a}' for k, a in r.items()}
    return raw

balances = {
    'parent': balance('parent', '재무상태표(T)', {'tradeReceivablesGross':'B8', 'tradeAllowanceRaw':'B9',
        'inventory':'C17', 'tradePayables':'B50', 'otherReceivables':'B14', 'prepayments':'B15',
        'prepaidExpenses':'B13', 'otherPayables':'B51', 'accruals':'B56', 'customerAdvances':'B53',
        'cash':'B6', 'currentAssets':'C4', 'currentLiabilities':'C49'}),
    'subsidiary': balance('subsidiary', '재무상태표(W)', {'tradeReceivablesGross':'B6', 'tradeAllowanceRaw':'B7',
        'inventory':'C13', 'tradePayables':'B40', 'otherReceivables':'B9', 'prepayments':'B10',
        'otherPayables':'B41', 'accruals':'B45', 'customerAdvances':'B43',
        'cash':'B5', 'currentAssets':'C3', 'currentLiabilities':'C39'}),
    'consolidated': balance('consolidated', '재무상태표(T)', {'tradeReceivablesGross':'I8', 'tradeAllowanceRaw':'I9',
        'inventory':'J17', 'tradePayables':'I50', 'otherReceivables':'I14', 'prepayments':'I15',
        'prepaidExpenses':'I13', 'otherPayables':'I51', 'accruals':'I56', 'customerAdvances':'I53',
        'cash':'I6', 'currentAssets':'J4', 'currentLiabilities':'J49'})}

reconciliations = []
for p in periods:
    c = p['consolidated']; s = p['segments']
    reconciliations.append({'year': p['year'],
        'revenueLessCogsLessGrossProfit': c['revenue'] - c['cogs'] - c['grossProfit'],
        'grossProfitLessSgaLessEbit': c['grossProfit'] - c['sga'] - c['ebit'],
        'ebitPlusNetNonOperatingLessEbt': c['ebit'] + c['netNonOperating'] - c['ebt'],
        'ebtLessTaxLessNetIncome': c['ebt'] - c['taxExpense'] - c['netIncome'],
        'parentPlusSubsidiaryPlusEliminationLessRevenue': p['parent']['revenue'] + p['subsidiary']['revenue'] + s['intercompanyRevenueElimination'] - c['revenue']})

output = {
    'generatedDate': '2026-09-08', 'unit': 'KRW', 'displayUnitDivisorForEokKrw': 100000000,
    'valueType': 'Excel saved cached values; original formulas retained as evidence; no Excel-engine recalculation',
    'nullMeaning': 'not separately available / not confirmed; never silently substitute zero',
    'sourceFiles': [{**manifest[k], 'currentSha256': hashlib.sha256(Path(manifest[k]['path']).read_bytes()).hexdigest()} for k in books],
    'periods': periods,
    'extension2030': {'year': 2030, 'status': 'company_source_has_broken_references',
        'revenue': None, 'ebit': None, 'cashFlow': None,
        'requiredControls': ['external market/volume/price/share forecast', 'steady-state cost ratios', 'asset useful lives and replacement capex', 'DSO/DIO/DPO and opening balances', 'operating tax and NOL by legal entity'],
        'noAutomaticTenPercentRevenueGrowth': True,
        'terminalG': 0, 'terminalGrowthMandateAppliesAfterExplicitForecast': True},
    'balances2025': balances,
    'legacyDcfNwc': {'incrementalRevenueRatio': cell('S03', '입력가정', 'B15'),
        'formula': 'deltaNwc = 0.20 * (Revenue_t - Revenue_t-1)',
        'historicalValidation': 'No supporting DSO/DIO/DPO calibration; not market-sourced evidence'},
    'evToEquityHistoricalReference2025': {'debt': cell('S03', '과거실적', 'M14'), 'cash': cell('S03', '과거실적', 'M15'),
        'netDebt': cell('S03', '과거실적', 'M16'), 'nciBookValue': cell('S03', '재무상태표(T)', 'J74'),
        'nciFairValue': None, 'currentNetDebt20260908': None,
        'note': '2025 book NCI is not automatically fair-value deduction. Confirm parent-shareholder scope, debt-like items, leases and operating/nonoperating cash.'},
    'valuationTiming': {'requestedAnalysisDate': '2026-09-08', 'latestBalanceSheetDate': '2025-12-31',
        'annualForecastYears': [2026, 2027, 2028, 2029], 'remaining2026Fcff': None,
        'currentEnterpriseValue': None,
        'note': 'Annual 2026 cash flow includes pre-valuation cash flows; require actual YTD and remaining-period cash schedule before computing current EV. Do not prorate annual cash flow without evidence.'},
    'terminalPolicy': {'growthRate': 0, 'formula': 'TV_at_terminal_date = sustainable_FCFF_next_year / WACC',
        'sustainableFcff': 'normalized EBIT - normalized unlevered cash tax + sustainable D&A - maintenance/replacement CAPEX - normalized deltaNWC',
        'steadyStateDeltaNwcAssumption': 0,
        'maintenanceCapexEqualDa': 'Allowed only as separately disclosed simplifying proxy after productive asset base and useful lives are checked; source 2029 CAPEX zero is not sustainable reinvestment evidence.',
        'nopatOverWaccShortcut': 'Only when maintenance capex equals D&A, deltaNWC=0 and normalized cash tax applies. No automatic shortcut from reported NI.'},
    'fundraisingPolicy': {'previousIrRaiseReferenceKrw': 7000000000,
        'raiseReferenceSource': 'Existing IR funding proposal; not a signed commitment or a derived requirement from the supplied cash-flow schedule',
        'seriesBAmount': None, 'seriesCAmount': None,
        'requiredRaiseFormula': 'max(0, required minimum cash - lowest forecast cash before financing) plus transaction fees, less committed funding',
        'preFinancingCashFormula': 'opening unrestricted cash + operating cash receipts/payments - tax - cash capex - debt principal + committed debt draws',
        'triggers': ['verified orders and utilization', 'yield and margin milestones', 'capacity expansion lead time', 'minimum cash buffer and debt maturities'],
        'newInvestorOwnershipFormula': 'new equity / (pre-money equity value + new equity)',
        'existingInvestorRetentionFormula': 'prior ownership * product(1 - subsequent new-money ownership)',
        'note': 'Equity proceeds are financing flows, not FCFF. If financed assets/revenue are already in forecasts, do not add equity proceeds again to operating EV. Different security terms, NCI funding and preferences need a cap table.'},
    'reconciliations': reconciliations,
    'evidence': evidence,
}
OUT.mkdir(exist_ok=True)
(OUT / 'company-forecast.json').write_text(json.dumps(output, ensure_ascii=False, indent=2))
print(json.dumps({'periods': len(periods), 'evidenceCells': len(evidence),
    'sourceHashesUnchanged': all(s['currentSha256'] == s['sha256'] for s in output['sourceFiles']),
    'maxReconciliationAbsoluteKrw': max(abs(v) for row in reconciliations for k,v in row.items() if k != 'year')}, ensure_ascii=False))
