const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), ts = require('typescript')
const root = path.resolve(__dirname, '../../../..')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, filename)
const m = require(path.join(root, 'components/TemscoV3/scenarioValuation.ts'))
const b = require(path.join(root, 'components/TemscoV3/multiplesInputs.ts'))
const { firstPassAssumptions: assumptions } = require(path.join(root, 'components/TemscoV3/firstPassAssumptions.ts'))
const { corporateTaxAssumptions } = require(path.join(root, 'components/TemscoV3/corporateTax.ts'))
const {outline} = require(path.join(root, 'components/TemscoV3/outline.ts'))
const previous = require('../verification-scenarios/scenario-results.json')
const scenarios = m.scenarios.map(s => ({...s, comparisons: {dnp:m.compareWithMultiple(s,b.dnpEvEbit),nano:m.compareWithMultiple(s,b.nanoEvEbit)}}))
const dimensions = [
 ['매출 증분 실현율','q',[.5,.75,1]], ['위폼스 외주비율','outsourceRate',[.4,.35,.3]],
 ['NCWC 산업비율 배율','nwcMultiplier',[1.2,1,.8]], ['개발비 자산화 가정계수','developmentCapitalizedShare',[.4,.2,.1]],
 ['기존 장비 잔여기간','existingEquipmentRemainingYears',[5,7,10]], ['신규 장비 내용연수','newEquipmentYears',[5,7,10]], ['개발비 상각기간','developmentUsefulLifeYears',[5,7,10]],
 ['WACC','wacc',[m.scenarios[1].parameters.wacc,m.scenarios[0].parameters.wacc]], ['2026 CAPEX 잔여 비중','capexResidualShare',[1,.5,0]], ['유지·성장 중복 비중','maintenanceOverlap',[0,.5,1]],
]
const sensitivity=dimensions.map(([label,parameter,values])=>({label,parameter,rows:m.evaluateOneAtATime('base',parameter,values,b.dnpEvEbit)}))
const bridge=assumptions.equityBridge
const data={asOf:'2026-09-08',updatedAt:'2026-09-09',unit:'억 원',status:'사용자 승인 1차 가정 적용 / 실측 대체 예정',assumptions,corporateTaxAssumptions,valuationOpeningNwcProxy:m.valuationOpeningNwcProxy,benchmarks:{dnp:b.dnpBenchmark,dnpEvEbit:b.dnpEvEbit,nano:b.nanoBenchmark,nanoEvEbit:b.nanoEvEbit},scenarios,sensitivity,equityProxies:scenarios.map(s=>({id:s.id,label:s.label,enterpriseValue:s.dcf.enterpriseValue,...bridge,equityValue:s.dcf.enterpriseValue-bridge.netDebtProxy-bridge.nonControllingInterestProxy+bridge.otherAdjustment}))}
const n=(v,d=2)=>Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})
const table=(h,rows)=>'| '+h.join(' | ')+' |\n| '+h.map(()=> '---').join(' | ')+' |\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n'
let report=`# 템스코 제3안 — 1차 가정 적용 DCF·멀티플 분석\n\n- 평가 기준일: 2026-09-08 / 가정 갱신: 2026-09-09\n- 범위: 연결 외부 매출·연결 FCFF / 금액: 억 원\n- 상태: **미확정 재무항목의 명시적 1차 가정 적용, 후속 실측 교체 예정**\n- 원자료 손익표: 보존 / 아래 손익: 상각·세금·개발투자 가정 적용 모델\n- [44장 PDF](output/TEMSCO-IR-v3-assumptions-draft-20260909.pdf) · [제3안 화면](http://localhost:3000/temsco/deck-v3) · [가정·변경 위치](first-pass-assumptions.md)\n\n## 1. 현재가치 및 방식별 차이\n\n`
report+=table(['현재 EV / 억 원',...scenarios.map(s=>s.label)],[
 ['DCF / g=0',...scenarios.map(s=>n(s.dcf.enterpriseValue))], ['DNP '+n(b.dnpEvEbit)+'× Exit',...scenarios.map(s=>n(s.comparisons.dnp.enterpriseValue))],
 ['DNP Exit − DCF',...scenarios.map(s=>n(s.comparisons.dnp.gapAmount))], ['차이 / DCF',...scenarios.map(s=>n(s.comparisons.dnp.gapPercent)+'%')],
 ['나노신소재 '+n(b.nanoEvEbit)+'× Exit',...scenarios.map(s=>n(s.comparisons.nano.enterpriseValue))], ['나노 Exit − DCF',...scenarios.map(s=>n(s.comparisons.nano.gapAmount))], ['차이 / DCF',...scenarios.map(s=>n(s.comparisons.nano.gapPercent)+'%')],
])
report+='\n- DCF: 명시 FCFF PV + 정상 FCFF/WACC의 PV\n- Exit: 동일 명시 FCFF PV + 정상 EBIT×관측 배수의 PV\n- 차이: 정상 EBIT × (관측 배수 − DCF 내재 TV/EBIT) × TV 할인계수\n- 동일 명시 현금흐름·정상 이익 공유에 따른 교차검토 / 두 독립 평가의 합의로 해석 제외\n- DNP: 비영업 투자자산 미조정의 다각화기업 역사적 앵커 / 순수 마스크 EV 배수와 구분\n- 나노: CNT 성장 기대 포함 / 템스코 가치 상단·목표 배수로 채택 제외\n\n## 2. 가정 갱신 전후 비교\n\n'
report+=table(['DCF 현재 EV',...scenarios.map(s=>s.label)],[['종전 분석 가정',...previous.scenarios.map(s=>n(s.dcf.enterpriseValue))],['이번 1차 가정',...scenarios.map(s=>n(s.dcf.enterpriseValue))],['변동',...scenarios.map((s,i)=>n(s.dcf.enterpriseValue-previous.scenarios[i].dcf.enterpriseValue))]])
report+='\n- 변경요인: 일반 누진세율·자산군별 상각·유지투자 코호트·추가 개발투자·산업 총NCWC\n- 매출 원표·시장 배수·평가일·명목 g=0: 동일 / 순수 한 변수 효과의 합산과 구분\n\n## 3. 세 가지 시나리오 입력\n\n'
report+=table(['항목',...scenarios.map(s=>s.label)],[['2027–29 회사 매출 증분 실현율',...scenarios.map(s=>n(s.parameters.q*100,0)+'%')],['2029 매출',...scenarios.map(s=>n(s.annual[3].revenue))],['위폼스 외주비/매출',...scenarios.map(s=>n(s.parameters.outsourceRate*100,0)+'%')],['NCWC/외부매출',...scenarios.map(s=>n(s.parameters.nwcRevenueRatio*s.parameters.nwcMultiplier*100,4)+'%')],['개발투자/외부매출',...scenarios.map(s=>n(s.parameters.rdToRevenue*s.parameters.developmentCapitalizedShare*100,4)+'%')],['WACC',...scenarios.map(s=>n(s.parameters.wacc*100,4)+'%')]])
report+=`\n- 공통 평가일 NWC 대용잔액: **${n(m.valuationOpeningNwcProxy,8)}억**\n- 2025말 산업NWC(외부매출×18.4223%)에서 중도2026말까지251/365 선형 보간\n- 2026 Δ: 시나리오별2026말 NCWC − 공통 평가일 잔액 / 114/365 재곱 제외\n- 이후 Δ: 외부매출×업종비율×시나리오배율의 연말 차이 / 핵심3계정 추가 합산 제외\n- 비용: 원표 비상각 제조·판관 구조 유지, 종전 상각 대용분 제거 후 새 자산상각·개발상각 대체\n- 법인세: 각 법인 EBT별 누진세율 / FCFF 영업세금: 각 법인 EBIT별 누진세율 / 손실법인 자동 상계 제외\n- 영업외손익·이자: 원표 고정 / 신규 조달조건·차입잔액의 실제 변동 미반영 가정\n- 2026 현금: EBIT·세금·상각·유지·개발투자114/365, 계획 CAPEX50%잔여\n- 현금 지급비율과 자산 취득·가동시점의 별도 가정 / 평가일 미지급금·기집행분 추가 대사\n\n`
const pl=[['매출','revenue'],['매출원가','cogs'],['매출총이익','grossProfit'],['판매관리비','sga'],['영업이익','ebit'],['영업외손익','netNonOperating'],['└ 이자비용 등(포함)','interestExpenseSigned'],['세전이익','ebt'],['가정 적용 법인세','taxExpense'],['당기순이익','netIncome']]
for (const [i,s] of scenarios.entries()) {
 report+=`## ${i+4}. ${s.label} 추정손익·현금흐름\n\n`
 report+=table(['연간 손익 / 억 원',...s.annual.map(a=>a.year+'E')],pl.map(([l,k])=>[l,...s.annual.map(a=>n(a[k]))]))+'\n'
 const cf=[['EBIT(평가기간)','fcffEbit'],['영업 현금세금','fcffOperatingCashTax'],['NOPAT','fcffNopat'],['D&A','fcffDa'],['계획 현금CAPEX','plannedCashCapex'],['유지 현금CAPEX','maintenanceCashCapex'],['개발투자','capitalizedDevelopment'],['기말 총NCWC','yearEndNwc'],['평가기간 ΔNWC','deltaNwc'],['FCFF','fcff'],['할인계수','discountFactor'],['FCFF PV','pvFcff']]
 report+=table(['평가기간 CF / 억 원',...s.annual.map(a=>a.periodLabel)],cf.map(([l,k])=>[l,...s.annual.map(a=>n(a[k],k==='discountFactor'?6:2))]))+'\n'
 report+=table(['연간 자산·상각 참고 / 억 원',...s.annual.map(a=>a.year+'E')],[['비개발 D&A',...s.annual.map(a=>n(a.nonDevelopmentDa))],['개발상각',...s.annual.map(a=>n(a.developmentAmortization))],['연간 개발 자산화 지출',...s.annual.map(a=>n(a.capitalizedDevelopmentAnnual))],['기말 개발자산',...s.annual.map(a=>n(a.developmentClosingAsset))]])
 report+=`\n- 정상 EBIT: ${n(s.terminal.normalizedEbit)} / 정상 FCFF: ${n(s.terminal.normalizedFcff)}\n- 정상 개발상각 = 정상 연간 개발투자: ${n(s.terminal.capitalizedDevelopment)}\n- 정상 비개발 D&A = 유지투자: ${n(s.terminal.nonDevelopmentDa)}\n- 명시 FCFF PV: ${n(s.dcf.presentExplicitFcff)} / TV PV: ${n(s.dcf.presentTerminalValue)}\n- TV PV / EV: ${n(s.dcf.terminalShare*100)}% / 안정기 이익·재투자 가정의 높은 영향\n\n`
}
report+='## 7. 무성장 정상화 및 주주가치\n\n- 안정기: 명목 g=0%, 매출 고정, 총NCWC 일정 및Δ0\n- 개발자산의 완전 성숙 가정: 연간 개발상각=계속되는 연간 개발투자\n- 정상 EBIT: min(2029EBIT+2029개발상각−성숙개발상각, 2028회사EBIT마진×2029매출)\n- 개발비 비용 반영 후 정상EBIT의 양 평가 공통 사용 / 비용처리 기업 대비 일시 자산화 이익의 배수 적용 방지\n- FCFF: 정상EBIT−법인별영업세금 + 비개발D&A + 개발상각 − 유지CAPEX − 개발투자\n- 비개발 상각·유지투자: 말년 수준 고정의 안정기 가정 / 장기 자산 교체·생산능력 검증 필요\n\n'
report+=table(['DCF 기반 1차 주주가치 / 억 원',...scenarios.map(s=>s.label)],[['연결 EV',...scenarios.map(s=>n(s.dcf.enterpriseValue))],['− 순차입금 대용',...scenarios.map(()=>n(bridge.netDebtProxy))],['− 비지배지분 대용',...scenarios.map(()=>n(bridge.nonControllingInterestProxy))],['+ 기타 조정 가정',...scenarios.map(()=>n(bridge.otherAdjustment))],['= 모회사 전체 주주가치 대용',...data.equityProxies.map(s=>n(s.equityValue))]])
report+='\n- 잔액: 2025말 자료를 평가일 대용으로 사용 / NCI장부가 대용·기타조정0의 별도 가정\n- 기업가치와 주주가치 구분 / 주당 가격·우선권·회수 IRR: 주주명부·계약조건 확인 후 산출\n- 후속 자금 유입: FCFF 산입 제외 / 투자·대여·차입 상환 및 자회사 내부이동의 이중계상 제외\n\n## 8. 단일변수 민감도\n\n- 기타 중도안 입력·공통 평가일 NWC 고정 / 각 범위의 합산 제외\n\n'
for(const d of sensitivity)report+=`### ${d.label}\n\n`+table(['입력','DCF EV','DNP Exit EV','차이'],d.rows.map(r=>[n(r.value,4),n(r.result.dcf.enterpriseValue),n(r.result.comparison.enterpriseValue),n(r.result.comparison.gapAmount)]))+'\n'
report+='## 9. 출처·검증·갱신\n\n- [법인세·산업비율·내용연수 등 가정표](first-pass-assumptions.md)\n- [회사 원표·근거 셀](research/company-forecast.md), [상각 자산잔액](research/assumed-depreciation.md), [산업 운전자본](research/assumed-working-capital.md), [산업 R&D 및 개발비 가정](research/assumed-development.md)\n- [WACC](research/wacc.md), [국내 배수 원문](research/multiples-korea.md), [해외 배수 원문](research/multiples-global.md)\n- [전체 정밀 계산](verification-assumptions/scenario-results.json), [모델 검증](verification-assumptions/model-check.json), [독립 검토](verification-assumptions/independent-review.md), [화면·PDF 검증](verification-assumptions/result.md)\n'
assert.ok(!/NaN|undefined/.test(report))
fs.writeFileSync(path.join(__dirname,'scenario-results.json'),JSON.stringify(data,null,2)+'\n')
fs.writeFileSync(path.join(__dirname,'outline.json'),JSON.stringify(outline,null,2)+'\n')
fs.writeFileSync(path.join(__dirname,'../scenario-valuation-analysis.md'),report)
console.log(JSON.stringify(data.scenarios.map(s=>({label:s.label,dcf:s.dcf.enterpriseValue,dnp:s.comparisons.dnp.enterpriseValue,nano:s.comparisons.nano.enterpriseValue,gap:s.comparisons.dnp.gapAmount,gapPercent:s.comparisons.dnp.gapPercent})),null,2))
