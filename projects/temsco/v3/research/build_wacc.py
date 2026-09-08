"""Market-reference WACC calculations, not a final TEMSCO discount-rate opinion."""
import json
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RETRIEVED = '2026-09-08T14:42:50Z'
inputs = {
    'valuationDate': '2026-09-08',
    'currency': 'KRW',
    'governmentBondYield10y': 0.04390,
    'governmentBondObservationDate': '2026-09-07',
    'sovereignDefaultSpread': 0.003930214513416281,
    'sovereignSpreadObservationDate': '2026-07-01',
    'sovereignSpreadCorrectionDate': '2026-07-09',
    'matureMarketErp': 0.0414,
    'matureMarketErpObservationDate': '2026-09-01',
    'countryRiskPremium': 0.00610950087834357,
    'countryRiskPremiumObservationDate': '2026-07-01',
    'countryRiskLambda': 1,
    'countryRiskLambdaStatus': 'reference convention; company geographic exposure not yet established',
    'marginalTaxRate': 0.22,
    'taxEffectiveDate': '2026-01-01',
    'taxAssumption': 'normal profitable company taxable-income bracket KRW 0.2bn–20bn: national 20% + local 2%; actual cash tax and interest tax shield require NOL schedule',
    'sizePremium': None,
    'companySpecificPremium': None,
    'terminalGrowth': 0,
}
sectors = [
    {'id': 'electronics_general', 'name': 'Electronics (General)', 'firmCount': 1481,
     'unleveredBetaCashAdjusted': 1.57, 'debtToEquityMarket': 0.1417,
     'observationDate': '2026-01', 'precision': 'rounded values displayed by source HTML',
     'fit': 'electronic components broad proxy; display materials/metalmasks pure-play basket not established'},
    {'id': 'chemical_specialty', 'name': 'Chemical (Specialty)', 'firmCount': 952,
     'unleveredBetaCashAdjusted': 1.04, 'debtToEquityMarket': 0.2352,
     'observationDate': '2026-01', 'precision': 'rounded values displayed by source HTML',
     'fit': 'specialty materials broad proxy; physical metal distribution and manufacturing mix not identical'},
]
debt_proxies = [
    {'rating': 'AA-', 'tenorYears': 10, 'yield': 0.05899, 'code': '7010123'},
    {'rating': 'BBB-', 'tenorYears': 10, 'yield': 0.11458, 'code': '7010213'},
]
rates = json.loads((ROOT / 'evidence/kis-ytm-20260907.json').read_text())
by_code = {r['divCode']: r for r in rates}
assert abs(float(by_code['1013000']['value12']) / 100 - inputs['governmentBondYield10y']) < 1e-12
for debt in debt_proxies:
    assert abs(float(by_code[debt['code']]['value12']) / 100 - debt['yield']) < 1e-12
scenarios = []
rf = inputs['governmentBondYield10y'] - inputs['sovereignDefaultSpread']
for sector in sectors:
    de = sector['debtToEquityMarket']
    beta = sector['unleveredBetaCashAdjusted'] * (1 + (1-inputs['marginalTaxRate'])*de)
    e = 1/(1+de)
    d = de/(1+de)
    ke = rf + beta*inputs['matureMarketErp'] + inputs['countryRiskLambda']*inputs['countryRiskPremium']
    for debt in debt_proxies:
        kd = debt['yield']
        scenarios.append({
            'id': sector['id'] + '_' + debt['rating'].replace('-', 'minus'),
            'sector': sector['name'], 'debtRatingExample': debt['rating'],
            'riskFreeRate': rf, 'leveredBeta': beta, 'debtToEquityMarket': de,
            'equityWeight': e, 'debtWeight': d, 'costOfEquity': ke,
            'costOfDebtPretax': kd, 'costOfDebtAfterTax': kd*(1-inputs['marginalTaxRate']),
            'wacc': e*ke+d*kd*(1-inputs['marginalTaxRate']),
            'waccDebtTaxShieldZeroKeepingBetaFixed': e*ke+d*kd,
            'status': 'market-reference scenario; not TEMSCO credit rating or final WACC',
        })
sources = [
    {'id':'KIS_20260907','title':'KIS YTM Matrix, Sep 7 2026',
     'sourceUrl':'https://www.bond.co.kr/conts/10075',
     'queryUrl':'https://www.bond.co.kr/kisnet/500?baseDate=2026.09.07',
     'observationDate':'2026-09-07','publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'국고채 code1013000; 공모무보증 회사채AA- code7010123; BBB- code7010213; value12=10Y; value08=3Y; value10=5Y',
     'note':'Official public page JavaScript calls same read-only endpoint. Publication clock not displayed. KIS evaluated yields, not KOFIA final quote.'},
    {'id':'KIS_CROSSCHECK','title':'KIS Weekly 1202, Sep 4 2026',
     'sourceUrl':'https://www.bond.co.kr/post/dawn/36898','observationDate':'2026-09-04',
     'publicationDate':'2026-09-07','retrievedAt':RETRIEVED,
     'locator':'PDF p9 table1: KIS10y4.350%; page8 narrative separately quotes KOFIA final10y4.360%',
     'note':'Sep4 public API returns4.350 matching KIS own table; confirms date-query mapping. Website lists publicationSep7 while document coverSep4.'},
    {'id':'NYU_ERP_SEP','title':'Damodaran current ERP, Sep 1 2026',
     'sourceUrl':'https://pages.stern.nyu.edu/adamodar/New_Home_Page/home.htm',
     'observationDate':'2026-09-01','publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'Equity Risk Premiums: trailing12-month adjusted payout ERP4.14%; UST4.75%; USdefaultspread0.22%',
     'note':'Mature ERP convention consistent with current summary: (4.14%+0.22%)−0.22%=4.14%. This is an implied market estimate, not observed realized excess return.'},
    {'id':'NYU_CRP_JUL','title':'Damodaran Country Risk Premiums, Jul 2026 correctedJul9',
     'sourceUrl':'https://pages.stern.nyu.edu/~adamodar/pc/datasets/ctrypremJuly26.xlsx',
     'observationDate':'2026-07-01','publicationDate':'2026-07-01','correctionDate':'2026-07-09',
     'retrievedAt':RETRIEVED,
     'locator':"ERPs by country!B2,C2,D86:F86; E3 July matureERP4.20%",
     'note':'Korea Aa2 spread0.3930214513%; CRP0.6109500878%; published July totalERP4.8109500878%. Workbook FAQ and update-note wording differ on USCRP subtraction; calculation uses current update-note/defaultspread convention explicitly.'},
    {'id':'NYU_BETA_GLOBAL','title':'Damodaran Betas by Sector (Global), Jan2026',
     'sourceUrl':'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/BetasGlobal.html',
     'downloadUrl':'https://pages.stern.nyu.edu/~adamodar/pc/datasets/betaGlobal.xls',
     'observationDate':'2026-01','publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'Electronics (General) and Chemical (Specialty) rows; cash-adjusted unleveredbeta and D/E columns',
     'note':'HTML rounded inputs used consistently. Broad global industry groups; not a verified TEMSCO pure-play peer set.'},
    {'id':'NYU_METHOD','title':'Damodaran valuation formulas and country risk treatment',
     'sourceUrl':'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/Seminars/postseminar.html',
     'observationDate':None,'publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'Riskfree Rate, Expected Return, Beta, Pre-tax Cost of Debt rows',
     'note':'Historical illustrative rates on this teaching page are not current market inputs.'},
    {'id':'NYU_DEFINITIONS','title':'Damodaran Financial measures & ratios',
     'sourceUrl':'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/definitions.html',
     'observationDate':None,'publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'Debt, Debt(Market value), Debt Ratio(Market Value), Unlevered beta corrected for cash',
     'note':'Debt means interest-bearing debt plus lease obligations, not total liabilities. Market-value ratio; nontradeddebt commonly proxied bybookvalue subject to default-risk adjustment.'},
    {'id':'NTS_TAX','title':'국세청 법인세 세율(2026년 이후)',
     'sourceUrl':'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7746',
     'effectiveDate':'2026-01-01','publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'영리법인 각사업연도 소득:2억초과200억이하20%'},
    {'id':'LOCAL_TAX','title':'안양시 2026년 달라지는 지방세',
     'sourceUrl':'https://www.anyang.go.kr/main/contents.do?key=482',
     'effectiveDate':'2026-01-01','publicationDate':None,'retrievedAt':RETRIEVED,
     'locator':'법인지방소득세 세율환원; 지방세법103조의20;2억원~200억원2.0%'},
]
evidence = []
for p in sorted((ROOT/'evidence').glob('*')):
    if p.name in ['kis-ytm-20260907.json','kis-ytm-20260904.json','ctrypremJuly26.xlsx']:
        evidence.append({'file':'evidence/'+p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size})
payload = {'title':'TEMSCO market-reference WACC research','status':'provisional references; final company WACC not established',
           'inputs':inputs,'sectors':sectors,'debtProxies':debt_proxies,'scenarios':scenarios,
           'formulas':{'rf':'governmentBondYield10y - sovereignDefaultSpread',
                       'betaL':'betaU_cash_adjusted * (1 + (1-taxRate)*marketDE)',
                       'ke':'rf + betaL*matureMarketERP + countryRiskLambda*countryRiskPremium',
                       'wacc':'ke/(1+marketDE) + kd*(1-taxRate)*marketDE/(1+marketDE)',
                       'terminalValue':'normalizedSustainableFCFF_next / terminalWACC; g=0'},
           'sources':sources,'evidence':evidence,
           'selection':{'defaultCompanyWacc':None,'reason':'Pure-play beta/market capital structure and TEMSCO marginalborrowing rate not yet evidenced',
                        'sectorBlend':None,'creditRatingAssignedToTemsco':None,
                        'note':'Show all4 reference scenarios separately. Do not call min/max confidencebounds.'}}
(ROOT/'wacc.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'riskFreeRate':rf,'scenarios':scenarios},ensure_ascii=False,indent=2))
