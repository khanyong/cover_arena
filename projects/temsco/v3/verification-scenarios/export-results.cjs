const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = path.resolve(__dirname, '../../../..')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, filename)
const m = require(path.join(root, 'components/TemscoV3/scenarioValuation.ts'))
const b = require(path.join(root, 'components/TemscoV3/multiplesInputs.ts'))
const {outline} = require(path.join(root, 'components/TemscoV3/outline.ts'))
const global = require('../research/multiples-global.json')
const korea = require('../research/multiples-korea.json')
const near = (a, z) => assert.ok(Math.abs(a-z) < 1e-8 * Math.max(1,Math.abs(z)))
near(b.dnpEnterpriseValue, global.comparables[0].calculated.enterpriseValueJPYMillion)
near(b.dnpEvEbit, global.comparables[0].calculated.evEbit)
near(b.nanoEnterpriseValue, korea.comparables[0].anchor.enterpriseValueKRW / 1e8)
near(b.nanoEvEbit, korea.comparables[0].anchor.multiple)
const scenarios = m.scenarios.map(s => ({...s, comparisons: {dnp:m.compareWithMultiple(s,b.dnpEvEbit),nano:m.compareWithMultiple(s,b.nanoEvEbit)}}))
for (const s of scenarios) {
  near(s.annual[0].forecastOpeningNwc, m.valuationOpeningNwcProxy)
  for (const c of Object.values(s.comparisons)) {
    near(c.gapAmount, c.enterpriseValue - s.dcf.enterpriseValue)
    near(c.gapPercent, c.gapAmount / s.dcf.enterpriseValue * 100)
    near(c.gapAmount, (c.benchmarkMultiple * s.terminal.normalizedEbit - s.terminal.terminalValue) * s.terminal.discountFactor)
  }
}
const dimensions = [
  ['매출 증분 실현율','q',[.5,.75,1]], ['위폼스 외주비율','outsourceRate',[.4,.35,.3]],
  ['DSO','dsoDays',[60,45,40]], ['DIO','dioDays',[45,35,30]], ['DPO','dpoDays',[45,50,55]],
  ['WACC','wacc',[m.scenarios[1].parameters.wacc,m.scenarios[0].parameters.wacc]],
  ['2026 CAPEX 잔여 비중','capexResidualShare',[1,.5,0]], ['유지·성장 중복 비중','maintenanceOverlap',[0,.5,1]],
  ['안정기 EBIT 마진 상한','normalMarginCap',[.15,m.sourceNormalMarginCap,.223324555421]],
]
const sensitivity = dimensions.map(([label,parameter,values]) => ({label,parameter,rows:m.evaluateOneAtATime('base',parameter,values,b.dnpEvEbit)}))
const data = {asOf:'2026-09-08',unit:'억 원',status:'명시적 분석 가정의 조건부 EV, 확정가치 아님',valuationOpeningNwcProxy:m.valuationOpeningNwcProxy,benchmarks:{dnp:b.dnpBenchmark,dnpEvEbit:b.dnpEvEbit,nano:b.nanoBenchmark,nanoEvEbit:b.nanoEvEbit},scenarios,sensitivity}
fs.writeFileSync(path.join(__dirname,'scenario-results.json'),JSON.stringify(data,null,2)+'\n')
fs.writeFileSync(path.join(__dirname,'outline.json'),JSON.stringify(outline,null,2)+'\n')
const n=(x,d=2)=>Number(x).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})
const table=(headers,rows)=>'| '+headers.join(' | ')+' |\n| '+headers.map(()=> '---').join(' | ')+' |\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n'
let report=`# 템스코 제3안 — DCF·멀티플 및 3개 시나리오 분석\n\n- 분석 기준일: 2026-09-08\n- 금액: 연결 기준 억 원, 각 비교기업의 원통화 별도 표시\n- 평가 상태: **명시적 분석 가정에 의한 조건부 EV**\n- 최종 기업가치·주주가치·주당 가격·IRR: 미확정\n- 원자료의 결측값: 유지 / 검증된 값으로의 덮어쓰기 없음\n- [44장 제3안 PDF](output/TEMSCO-IR-v3-scenarios-draft-20260909.pdf) · [화면](http://localhost:3000/temsco/deck-v3#slide-27)\n\n## 1. 평가 결과 및 두 방식의 차이\n\n`
report+=table(['현재 EV / 억 원',...scenarios.map(s=>s.label)],[
 ['DCF / g=0',...scenarios.map(s=>n(s.dcf.enterpriseValue))],
 [`DNP ${n(b.dnpEvEbit)}× Exit 배수 적용`,...scenarios.map(s=>n(s.comparisons.dnp.enterpriseValue))],
 ['DNP Exit − DCF',...scenarios.map(s=>n(s.comparisons.dnp.gapAmount))],
 ['차이 / DCF',...scenarios.map(s=>n(s.comparisons.dnp.gapPercent)+'%')],
 [`나노신소재 ${n(b.nanoEvEbit)}× 대체 적용`,...scenarios.map(s=>n(s.comparisons.nano.enterpriseValue))],
 ['나노 Exit − DCF',...scenarios.map(s=>n(s.comparisons.nano.gapAmount))],
 ['나노 차이 / DCF',...scenarios.map(s=>n(s.comparisons.nano.gapPercent)+'%')],
])
report+=`\n- DCF: 명시 FCFF의 PV + 정상 FCFF/WACC의 PV − 정상 NWC 전환의 PV\n- Exit 멀티플: 동일 명시 FCFF의 PV + 정상 EBIT×관측 EV/EBIT의 PV − 동일 NWC 전환의 PV\n- 차이: 정상 EBIT × (관측 배수 − DCF 내재 TV/EBIT 배수) × 말년 할인계수\n- 평가 차이의 원인: 성장 기대·재투자·비영업자산·다각화·관측시점·회계 범위의 차이\n- **교차검토의 한계: 명시 현금흐름과 정상화 이익 가정 공유 / 두 독립 평가의 합의로 해석 제외**\n- 멀티플의 미래 유지: 시장에서 관측한 사실과 구분되는 Exit 가정\n- 나노 대체값: CNT 사업 성장 기대 포함 / TEMSCO 가치 범위의 상단·목표가격으로 채택 제외\n- 가치 차이에 따른 저평가·투자수익 보장 결론: 배제\n\n## 2. 비교기업·관측 배수의 선정 근거\n\n`
report+=table(['기업','관측값·역할','템스코와의 비교·한계'],[
 ['DNP / 7912',`${n(b.dnpEvEbit,5)}× / 역사적 외부 앵커`,'FMM·전자부품 인접 / 전자부문 매출 16.65%·다각화 / OMM·CVD·금속소재와 차이'],
 ['나노신소재 / 121600',`${n(b.nanoEvEbit,5)}× / 대체 관측 앵커`,'TCO·타겟 인접 / CNT 58.3%, 별도 배터리 성장 기대 / 타겟 단독 배수 아님'],
 ['핌스·풍원정밀','이익 배수 표본 제외','제품 비교 유지 / LTM 영업적자·현재 자본구조 조정 미완'],
 ['JX Advanced Metals','이익 배수 표본 제외','타겟 사업 인접 / 지분법·광산 이익 혼입·자사주 취득 조정 필요'],
])
report+=`\n- DNP: JPX 3/31 종가 2,827.5엔, 순주식 431,432,864주, 결산 EBIT 101,039백만 엔\n- DNP EV: 시총1,219,876.42296 + 차입·금융리스281,727 + 장부NCI76,602 − 현금성243,565 =1,334,640.42296백만 엔\n- DNP 시점: **3/31 종가·결산을 6/23 감사재무 공시로 확인한 9/8 현재의 사후 재구성** / 3/31 당시에 알려진 실적 배수·9/8 현재 거래배수와 구분\n- DNP 미조정: 투자유가증권179,612 + 관계사계정218,015 =397,627백만 엔 / 별도 정기예금54,570백만 엔·연금자산 등 검토 필요\n- DNP 한계: 관련 자산 가치가 EV에 잔존, 대응 지분법·증권매각이익은 EBIT 밖 / **순수 영업 EV 배수 아님**, 배수 상향 가능성\n- DNP 부채 공정가치 대안: EV/EBIT13.02508× / 기타 조건 고정\n- 나노: KRX 9/8 종가46,250원 × (발행12,262,191 − 6/30 자사주220,206) = 지분가치5,569.4180625억\n- 나노 EV: 지분가치 + 은행100 + CB620 + BW335 + 리스11.77286787 − 현금732.08146998 − 단기금융858.3 =5,045.80946039억\n- 나노 EBIT: 2025FY46.81087390 + 2026H1 80.95106964 − 2025H1 21.39326727 =106.36867627억\n- 나노 기준: 9/8 주가·6/30 잔액 혼합의 대용값 / 자사주 후속 변동·제한예금·필수 운영현금 미검증\n- 나노 CB·BW: 권면 청구액 대용 / 내재파생부채 중복 가산 제외 / 장부+파생 대안47.52722×\n- 나노 단기금융: 전액 초과자산 차감 가정 / 미차감 대안55.50609×, 관측 가치 범위와 구분\n- 적용 방식: 임의 평균·중앙값·비상장 할인·목표 배수 선정 없음\n- EV/EBIT 선택: TEMSCO 전체 D&A 미검증에 따른 EV/EBITDA 최종 적용 유보\n- 원수치·기간·URL·원문 지문: [국내 비교기업](research/multiples-korea.md), [국내 JSON](research/multiples-korea.json), [해외 비교기업](research/multiples-global.md), [해외 JSON](research/multiples-global.json)\n\n## 3. 세 가지 시나리오의 가정\n\n`
report+=table(['항목',...scenarios.map(s=>s.label)],[
 ['매출 증분 실현율 q',...scenarios.map(s=>n(s.parameters.q*100,0)+'%')],
 ['2029 매출',...scenarios.map(s=>n(s.annual[3].revenue))],
 ['위폼스 외주비 / 매출',...scenarios.map(s=>n(s.parameters.outsourceRate*100,0)+'%')],
 ['2029 재료비 / 템스코향',...scenarios.map(s=>n(s.annual[3].subsidiaryMaterialsToParentRate*100)+'%')],
 ['DSO / DIO / DPO · 일',...scenarios.map(s=>[s.parameters.dsoDays,s.parameters.dioDays,s.parameters.dpoDays].join(' / '))],
 ['WACC',...scenarios.map(s=>n(s.parameters.wacc*100,4)+'%')],
 ['2029 정상화 EBIT 마진',...scenarios.map(s=>n(s.terminal.normalizedMargin*100)+'%')],
 ['정상 FCFF',...scenarios.map(s=>n(s.terminal.normalizedFcff))],
])
report+=`\n- 매출: 2026 회사 계획 공통 / 2027–29 매출 = 2026매출 + q×(해당 연도 회사 매출−2026매출)\n- 연결: 각 법인·양방향 내부 매출의 동일 비율 k 조정 / 매출·원가에서 내부거래 동일액 제거\n- 직접재료비 개선: 2026비율 + q×(회사 해당 연도 비율−2026비율), 위폼스의 템스코향 매출에만 적용\n- 비용: 인건비·상각 고정 / 기타 제조·판관비 매출 연동 / 모회사 제조상각 분리 후 나머지 원가 매출 연동\n- 영업외손익·이자: 회사 전망 고정 / WACC의 차입비용 대용값과 실제 계약 차입금리의 구분 / 원금·만기·조달조건 확보 후 연계 갱신 필요\n- 2026 회계 손익: 회사 원표 유지 / 2027 이후 회계 세금: 법인별 양의 세전이익×22%\n- FCFF 현금세금: 법인별 양의 EBIT×22%, 결손금·세액공제·납부시차 혜택 미반영\n- D&A: 39.5603 /41.2103 /41.7103 /41.7103억 분석 대용값 / 누계상각 증감 기반 모회사 기존 제조상각 미검증\n- 유지 CAPEX: 위 D&A 대용값과 동일 / 계획 CAPEX와 성장·유지 중복 0% 기본 가정\n- 중복 민감도: min(비토지 계획투자, 유지투자)×중복비율 차감 / 토지 및 계획0년의 유지투자 소거 금지\n- 2026 잔여 현금: 운영 EBIT·현금세금·D&A의114/365 안분 / **기중 실제 현금흐름 확인과 구분**\n- 2026 CAPEX: 연간 취득계획112.5억의50% 잔여 + 유지상각의114/365 / 취득계획의 현금지급 변환 가정\n- 기초 2025 핵심 NWC:22.63781766억 / 공통 평가일 NWC 대용값:**${n(m.valuationOpeningNwcProxy,8)}억**\n- 공통 NWC의 도출: 2025말 + (중도2026말−2025말)×251/365 / 3개안·단일변수 검사 모두 같은 값 고정 / 실제9/8잔액 아님\n- 2026 ΔNWC: 해당 시나리오 연말 NWC − 공통 평가일 대용값, 잔여일수 재곱 없음\n- 이후 ΔNWC: 연말 NWC 차이 / 매입액 대신 매출원가 대용 / 기타 영업NWC 순액0 가정\n- 별도 자산화 개발비:0 분석 가정 / 비용처리 개발비의 중복 차감 배제 / 실제 부재의 단정 없음\n- WACC: 전자부품 업종 공개 βU·시장 D/E와 KIS AA−/BBB− 10년 금리 / 임의 소기업 프리미엄 제외 / 회사 신용등급·최종 WACC와 구분\n- 시나리오 확률·검증된 시장 점유율: 부여 없음 / 회사 제공 매출의 조건부 실현 분석\n\n## 4. 정상화 및 할인 원칙\n\n- 기준일2026.09.08, 연말 현금흐름·2029.12.31 말년가치 / ACT/365 할인\n- 안정기2030 이후 명목성장률g=0 / 매출 고정, 일정 정상 현금흐름 유지\n- 정상 EBIT 마진: min(시나리오2029마진, 회사2028마진18.787245%) / 지속성이 검증된 시장 마진과 구분되는 분석 상한\n- 정상 EBIT의 법인별 배분: 2029 EBIT 비율의 비례 조정 / 법인별 양의 이익 기준 세금\n- 유지CAPEX=D&A / 정상 ΔNWC=0 / 일회성 정상 NWC 전환만2029 현금에 별도 반영\n- 낙관안 정상 NWC 회수: 마진 하향에 따른 원가 대용값 증가 + DPO55일>DIO30일의 매입채무 효과 / 검증된 실제 회수와 구분\n- 장기 정상화 조건 미충족: 추정기간 연장·유지투자·운전자본 재산정 필요\n- 주주가치: 현재 순차입금·비영업자산·NCI·완전희석 주식수·계약상 권리 확보 전 미산출\n- 신규 조달: FCFF 유입에 신주·차입금 산입 없음 / 후속 투자 미조달·지연에 따른 운영계획 재작성 필요\n\n`
const pl=[['매출','revenue'],['매출원가','cogs'],['매출총이익','grossProfit'],['판매관리비','sga'],['영업이익','ebit'],['영업외손익','netNonOperating'],['└ 이자비용 등(포함)','interestExpenseSigned'],['세전이익','ebt'],['회계 세금','taxExpense'],['당기순이익','netIncome']]
for (const [index,s] of scenarios.entries()) {
 report+=`## ${index+5}. ${s.label} — 전체 연결 손익 및 현금흐름\n\n`
 report+=table(['연간 손익 / 억 원',...s.annual.map(a=>a.year+'E')],pl.map(([label,key])=>[label,...s.annual.map(a=>n(a[key]))]))
 report+='\n'
 const cf=[['EBIT(평가기간)',a=>a.fcffEbit],['영업 현금세금',a=>a.fcffOperatingCashTax],['NOPAT',a=>a.fcffNopat],['D&A 대용',a=>a.fcffDa],['계획 현금CAPEX',a=>a.plannedCashCapex],['유지 현금CAPEX',a=>a.maintenanceCashCapex],['기말 핵심NWC',a=>a.yearEndNwc],['평가기간 ΔNWC',a=>a.deltaNwc],['정상 NWC 전환',a=>a.year===2029?s.terminal.normalNwcTransition:0],['최종 FCFF',a=>a.fcff-(a.year===2029?s.terminal.normalNwcTransition:0)],['할인계수',a=>a.discountFactor],['FCFF 현재가치',a=>a.pvFcff+(a.year===2029?s.terminal.presentNwcTransition:0)]]
 report+=table(['평가기간 CF / 억 원',...s.annual.map(a=>a.periodLabel)],cf.map(([label,get])=>[label,...s.annual.map(a=>n(get(a),label==='할인계수'?6:2))]))
 report+=`\n- 정상 EBIT:${n(s.terminal.normalizedEbit)}억 / 정상 FCFF:${n(s.terminal.normalizedFcff)}억\n- 명시 FCFF PV:${n(s.dcf.presentExplicitFcff)}억 / NWC 전환 PV:${n(s.dcf.presentNwcTransition)}억 / TV PV:${n(s.dcf.presentTerminalValue)}억\n- TV PV / 전체 EV:${n(s.dcf.terminalShare*100)}% / 말년 가치에 대한 높은 의존도\n- DCF 내재 TV/EBIT:${n(s.terminal.terminalValue/s.terminal.normalizedEbit)}×\n\n`
}
report+='## 8. 주요 입력의 단일변수 민감도\n\n- 나머지 중도안 가정·평가일 기초 NWC 고정\n- q: 매출 실현율과 직접재료비 개선률의 연동 변수\n- 각 변수 범위의 합산·확률 해석 제외\n\n'
for(const dim of sensitivity) report+=`### ${dim.label}\n\n`+table(['입력','DCF EV','DNP Exit EV','차이'],dim.rows.map(row=>[n(row.value,4),n(row.result.dcf.enterpriseValue),n(row.result.comparison.enterpriseValue),n(row.result.comparison.gapAmount)]))+'\n'
report+=`## 9. 출처·재현·검증\n\n- 회사원표: [회사 전망 대사](research/company-forecast.md), [원자료 분석](analysis/result.md), [자료 해시](analysis/manifest.json)\n- 시장 WACC: [시장 입력](research/wacc.md), [ERP 방법](research/erp-method-review.md)\n- 배수 원문: [JPX3월 종가](https://www.jpx.co.jp/markets/statistics-equities/price/t13vrt000000xpuw-att/st_202603-2.pdf), [DNP 감사재무](https://www.global.dnp/content/dam/dnp-global/pdf/en/ir/library/consolidated/dnp_e_FinancialStatements_2025.pdf), [KRX 나노신소재](https://kind.krx.co.kr/common/stockprices.do?isurCd=12160&method=searchStockPricesMain), [나노신소재 반기 공시](https://dart.fss.or.kr/report/viewer.do?rcpNo=20260814001307&dcmNo=11529630&eleId=17&offset=236675&length=3568920&dtd=dart4.xsd)\n- 방법 참고: 비교기업의 사업·이익·기간·위험 차이 검토와 EV 기반 지표의 구분 — [CFA Market-Based Valuation](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/market-based-valuation-price-enterprise-value-multiples)\n- Exit 배수와 DCF의 구분: 시장 배수 잔존가치의 상대평가 성격 — [NYU Valuation Question9](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/valquestions/a9.htm)\n- 코드: scenarioValuation.ts, multiplesInputs.ts, ScenarioLayouts.tsx / 기존 valuation.ts·companyForecast.json 보존\n- [전체 정밀 계산 JSON](verification-scenarios/scenario-results.json), [모델 검증](verification-scenarios/model-check.json), [방법 검토](research/scenario-method-review.md), [화면·PDF 검증](verification-scenarios/result.md)\n`
fs.writeFileSync(path.join(__dirname,'../scenario-valuation-analysis.md'),report)
console.log(JSON.stringify({benchmarkParity:'PASS',commonOpeningNwc:data.valuationOpeningNwcProxy,scenarios:scenarios.map(s=>({label:s.label,dcf:s.dcf.enterpriseValue,dnp:s.comparisons.dnp.enterpriseValue,gap:s.comparisons.dnp.gapAmount,gapPercent:s.comparisons.dnp.gapPercent,nano:s.comparisons.nano.enterpriseValue}))},null,2))
