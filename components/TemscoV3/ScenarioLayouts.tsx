import type { ReactNode } from 'react'
import { fmt } from './financials'
import { scenarios, compareWithMultiple, evaluateScenario, sourceNormalMarginCap, type ScenarioResult, type AnnualScenario, type ScenarioParameters } from './scenarioValuation'
import { dnpBenchmark as dnp, nanoBenchmark as nano, dnpEnterpriseValue, nanoEnterpriseValue, dnpEvEbit, nanoEvEbit } from './multiplesInputs'
import { waccReferences } from './marketInputs'
import s from './scenarioLayouts.module.css'

const pct = (value: number, digits = 1) => `${fmt(value * 100, digits)}%`
const number = (value: number | null, digits = 1) => value === null ? '산출 제외' : fmt(value, digits)
const signed = (value: number | null) => value === null ? '산출 제외' : `${value > 0 ? '+' : ''}${fmt(value, 1)}`
const num = (value: number) => <span className={value < 0 ? s.negative : undefined}>{fmt(value, 1)}</span>
const sourceLink = (href: string, label: string) => <a href={href} target="_blank" rel="noreferrer">{label}</a>

function PeerSelection() {
  return <div className={s.root}>
    <table className={`${s.table} ${s.peerTable}`}><colgroup><col /><col /><col /><col /></colgroup><thead><tr><th scope="col">기업</th><th scope="col">제품·사업의 비교</th><th scope="col">수익성·시점</th><th scope="col">평가 활용 및 차이</th></tr></thead><tbody>
      <tr className={s.target}><th scope="row"><b>템스코·위폼스</b><small>평가 대상 / 연결</small></th><td>마스크·코팅소재·특수강·비철<br />소재 공급 및 정밀부품 제조</td><td>2025 EBIT −73.2억<br />회사 2026E EBIT 13.3억</td><td><b>이익 회복 전환기</b>고객·수율·외주비·재투자의 지속성 검증</td></tr>
      <tr><th scope="row">DNP<small>7912 / TSE</small></th><td>FMM 관련 기술<br />인쇄·정보·포장 등 다각화</td><td>FY2026/3 흑자<br />3/31 종가·결산 기준</td><td><b>13.21× 역사적 앵커</b>규모·포트폴리오·재무안정성 차이<br />마스크 부문만의 배수로 해석 제외</td></tr>
      <tr><th scope="row">나노신소재<small>121600 / KOSDAQ</small></th><td>타겟·TCO 등 인접 소재<br />상반기 CNT 매출 비중 58.3%</td><td>LTM 2026/6 흑자<br />9/8 주가·6/30 잔액</td><td><b>47.44× 대체 앵커</b>CNT 성장 기대·사업 구성 차이<br />템스코 목표 배수의 직접 채택 제외</td></tr>
      <tr><th scope="row">핌스·풍원정밀<small>347770 / 371950</small></th><td>OLED 보조 마스크·OMM/SBM<br />풍원정밀 FMM 개발</td><td>영업적자<br />기간·발행주식 변동 확인</td><td><b>이익 멀티플 적용 제외</b>제품·운영 비교 유지<br />음수 EBIT 배수의 평균 편입 제외</td></tr>
      <tr><th scope="row">JX Advanced Metals<small>5016 / TSE</small></th><td>스퍼터링 타겟<br />금속·광산·지분법 수익 혼재</td><td>분기 지분법·처분이익 영향<br />7월 대규모 자사주 취득</td><td><b>이번 배수 표본 제외</b>정상 영업손익·현금·주식수 재구성 필요</td></tr>
    </tbody></table>
    <div className={s.peerRule}><strong>EV / EBIT</strong><p>연결 기준 통일 · 비영업자산·리스 보정 미완<br />전체 D&A 미검증에 따른 EV/EBITDA 적용 유보 · 임의 평균·비상장 할인율 배제</p></div>
  </div>
}

function MultipleBuild() {
  const bridges = [
    { name: 'DNP', basis: '2026.03.31 / 백만 엔', multiple: dnpEvEbit, rows: [['자사주 차감 시가총액', dnp.equityValue], ['+ 차입금·금융리스', dnp.debtIncludingFinanceLeases], ['+ 비지배지분 장부 대용', dnp.nonControllingBookProxy], ['− 현금성자산', -dnp.cashEquivalents], ['= EV 참고값', dnpEnterpriseValue], ['÷ FY2026/3 EBIT', dnp.ebit]], note: <>주가 2,827.5엔 × 순주식 431,432,864주<br />9/8 공개정보로 재구성한 3/31 배수<br />투자계정 397,627백만 엔 미차감 · 순수 영업가치 아님</> },
    { name: '나노신소재', basis: '2026.09.08 주가 / 억 원', multiple: nanoEvEbit, rows: [['자사주 차감 시가총액', nano.equityValue], ['+ 차입금·CB·BW 권면', nano.debtFaceProxy], ['+ 리스부채', nano.leases], ['− 현금·단기금융', -(nano.cash + nano.shortTermFinancialAssets)], ['= EV 참고값', nanoEnterpriseValue], ['÷ LTM 2026/6 EBIT', nano.ebit]], note: <>주가 46,250원 × 순주식 12,041,985주<br />6/30 잔액·자사주 대용 · 단기금융 전액 차감 가정<br />CB·BW 권면 대용 · 내재파생부채 중복 가산 제외</> },
  ]
  return <div className={s.root}><div className={s.bridgeGrid}>{bridges.map(bridge => <section key={bridge.name} className={s.bridge}><header><h3>{bridge.name}</h3><span>{bridge.basis}</span></header><table className={s.table}><tbody>{bridge.rows.map(([label, value], i) => <tr className={i === 4 ? s.total : undefined} key={label}><th scope="row">{label}</th><td>{fmt(Number(value), 1)}</td></tr>)}</tbody></table><div className={s.bridgeMultiple}><span>관측 EV / EBIT</span><strong>{fmt(bridge.multiple, 2)}×</strong></div><p className={s.observation}>{bridge.note}</p></section>)}</div><p className={s.note}>비교 기간: DNP 12개월 결산 / 나노신소재 2025FY + 2026H1 − 2025H1 · 각 기업 통화 내 계산 후 배수만 비교<br />시장 관측 배수의 정상화 2029 EBIT 적용: 미래에도 동일 배수 유지의 분석 가정 · 자산·이익 범위 보정 전 최종 적용배수 미확정</p></div>
}

function ScenarioAssumptions() {
  const rows: { label: string; get: (r: ScenarioResult) => ReactNode }[] = [
    { label: '2027–29 회사 매출 증분 실현율', get: r => pct(r.parameters.q, 0) },
    { label: '2029 연결 매출 / 억 원', get: r => fmt(r.annual[3].revenue, 1) },
    { label: '위폼스 외주비 / 매출', get: r => pct(r.parameters.outsourceRate, 0) },
    { label: '2029 직접재료비 / 템스코향 매출', get: r => pct(r.annual[3].subsidiaryMaterialsToParentRate, 2) },
    { label: '영업운전자본 / 연결 매출', get: r => pct(r.parameters.nwcRevenueRatio * r.parameters.nwcMultiplier, 2) },
    { label: '시장자료 기반 WACC', get: r => pct(r.parameters.wacc, 2) },
    { label: '차입비용 대용 · 회사 등급 아님', get: r => r.id === 'optimistic' ? 'AA− 5.899%' : 'BBB− 11.458%' },
  ]
  return <div className={s.root}><table className={`${s.table} ${s.scenarioAssumptions}`}><colgroup><col /><col /><col /><col /></colgroup><thead><tr><th scope="col">분석 가정 · 확률 부여 제외</th>{scenarios.map(r => <th scope="col" key={r.id}>{r.label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{scenarios.map(r => <td key={r.id}>{row.get(r)}</td>)}</tr>)}</tbody></table><div className={s.assumptionStrip}><p><b>매출·원가</b><br />2026 매출 공통 · 2027 이후 회사 증분 조정<br />비개발 원가 구조 유지 · 가정 상각으로 대체<br />NCWC 산업비율 × 80% / 100% / 120%</p><p><b>현금흐름·안정기</b><br />2026 운영현금 114/365 · CAPEX 50% 잔여 가정<br />법인별 누진세율 · 유지투자=비개발 상각<br />명목 g=0 · 정상 EBIT 마진 상한 {pct(sourceNormalMarginCap, 2)}</p></div><p className={s.note}>회사 계획 기반 조건부 실현율 · 검증된 시장 점유율·달성 확률과 구분 · 2028 회사 EBIT 마진을 안정기 상한으로 사용한 분석 규칙<br />기초 NWC: 산업비율의 중도안 보간값 공통 적용 · 개발투자: 매출의 0.8501% 추가 자산화 가정</p></div>
}

const plRows: { label: string; key: keyof AnnualScenario; kind?: string }[] = [
  { label: '매출', key: 'revenue', kind: 'total' }, { label: '매출원가', key: 'cogs' }, { label: '매출총이익', key: 'grossProfit' }, { label: '판매관리비', key: 'sga' }, { label: '영업이익 EBIT', key: 'ebit', kind: 'total' }, { label: '영업외손익', key: 'netNonOperating' }, { label: '└ 이자비용 등*', key: 'interestExpenseSigned', kind: 'subrow' }, { label: '법인세차감전이익', key: 'ebt' }, { label: '법인세비용', key: 'taxExpense' }, { label: '당기순이익', key: 'netIncome', kind: 'closing' },
]
function ScenarioForecast({ result: r }: { result: ScenarioResult }) {
  const cfRows = [
    { label: '영업이익', get: (a: AnnualScenario) => a.fcffEbit },
    { label: '− 영업 현금세금', get: (a: AnnualScenario) => a.fcffOperatingCashTax },
    { label: '= NOPAT', get: (a: AnnualScenario) => a.fcffNopat, kind: 'total' },
    { label: '+ 가정 적용 D&A', get: (a: AnnualScenario) => a.fcffDa },
    { label: '− 계획 CAPEX', get: (a: AnnualScenario) => a.plannedCashCapex },
    { label: '− 유지 CAPEX', get: (a: AnnualScenario) => a.maintenanceCashCapex },
    { label: '− ΔNWC', get: (a: AnnualScenario) => a.deltaNwc },
    { label: '− 자산화 개발비', get: (a: AnnualScenario) => a.capitalizedDevelopment },
    { label: '= FCFF', get: (a: AnnualScenario) => a.fcff - (a.year === 2029 ? r.terminal.normalNwcTransition : 0), kind: 'closing' },
    { label: '현재가치', get: (a: AnnualScenario) => a.pvFcff + (a.year === 2029 ? r.terminal.presentNwcTransition : 0) },
  ]
  return <div className={s.root}><div className={s.forecastTop}><div><span>2029 매출 / 억 원</span><strong>{fmt(r.annual[3].revenue, 1)}</strong></div><div><span>2029 영업이익률</span><strong>{pct(r.annual[3].ebitMargin)}</strong></div><div><span>조건부 DCF EV / 억 원</span><strong>{fmt(r.dcf.enterpriseValue, 1)}</strong></div></div><div className={s.forecastGrid}><section><h3>가정 적용 손익 · 2026–29 연간 / 억 원</h3><table className={s.table}><colgroup><col /><col /><col /><col /><col /></colgroup><thead><tr><th scope="col">계정</th>{r.annual.map(a => <th scope="col" key={a.year}>{a.year}E</th>)}</tr></thead><tbody>{plRows.map(row => <tr className={row.kind ? s[row.kind] : undefined} key={row.key}><th scope="row">{row.label}</th>{r.annual.map(a => <td key={a.year}>{num(a[row.key] as number)}</td>)}</tr>)}</tbody></table></section><section><h3>DCF 현금흐름 · 잔여 2026–29 / 억 원</h3><table className={s.table}><colgroup><col /><col /><col /><col /><col /></colgroup><thead><tr><th scope="col">산출 단계</th>{r.annual.map(a => <th scope="col" key={a.year}>{a.year}{a.year === 2026 ? ' 잔여' : 'E'}</th>)}</tr></thead><tbody>{cfRows.map(row => <tr className={row.kind ? s[row.kind] : undefined} key={row.label}><th scope="row">{row.label}</th>{r.annual.map(a => <td key={a.year}>{num(row.get(a))}</td>)}</tr>)}</tbody></table></section></div><div className={s.scenarioTail}><span>WACC<b>{pct(r.parameters.wacc, 2)}</b></span><span>정상 EBIT<b>{fmt(r.terminal.normalizedEbit, 1)}억</b></span><span>정상 FCFF<b>{fmt(r.terminal.normalizedFcff, 1)}억</b></span><span>TV 현재가치<b>{fmt(r.terminal.presentTerminalValue, 1)}억</b></span></div><p className={s.note}>*이자비용 등: 영업외손익의 포함항목 · 손익계산서의 재차 차감 제외 · 법인별 세금 계산, 연결 손실의 자동 상계 제외<br />2026 운영현금: 선형 안분 · NCWC: 산업 총액 비율 적용 · 안정기 개발상각=연간 개발투자, 명목 성장률 0%</p></div>
}

function ValueComparison() {
  const rows = scenarios.map(r => ({ r, dnp: compareWithMultiple(r, dnpEvEbit), nano: compareWithMultiple(r, nanoEvEbit) }))
  const max = Math.max(...rows.flatMap(({ r, dnp: c }) => [r.dcf.enterpriseValue, c.enterpriseValue ?? 0])) * 1.14
  return <div className={s.root}><div className={s.valueGrid}><section><div className={s.chartLegend}><span><i style={{ background: '#2358cf' }} />DCF · 무성장</span><span><i style={{ background: '#148579' }} />DNP Exit 배수 적용</span></div><svg className={s.valueChart} viewBox="0 0 500 253" role="img" aria-label="시나리오별 DCF와 DNP Exit 멀티플의 현재 기업가치 비교. 상세값은 우측 표.">{rows.map(({ r, dnp: c }, i) => <g key={r.id}><text x="0" y={i * 81 + 31} fill="#172d4f" fontSize="16">{r.label}</text>{[r.dcf.enterpriseValue, c.enterpriseValue ?? 0].map((v, j) => <g key={j}><rect x="72" y={i * 81 + j * 29 + 5} width={Math.max(0, v) / max * 350} height="21" fill={j ? '#148579' : '#2358cf'} /><text x={78 + Math.max(0, v) / max * 350} y={i * 81 + j * 29 + 21} fill="#172d4f" fontSize="14" fontFamily="Arial">{fmt(v, 1)}</text></g>)}</g>)}</svg></section><section><table className={`${s.table} ${s.valueTable}`}><colgroup><col /><col /><col /><col /></colgroup><thead><tr><th scope="col">현재 EV / 억 원</th>{scenarios.map(r => <th scope="col" key={r.id}>{r.label}</th>)}</tr></thead><tbody><tr><th scope="row">DCF</th>{rows.map(({ r }) => <td key={r.id}>{fmt(r.dcf.enterpriseValue, 1)}</td>)}</tr><tr className={s.total}><th scope="row">DNP Exit 배수</th>{rows.map(({ r, dnp: c }) => <td key={r.id}>{number(c.enterpriseValue)}</td>)}</tr><tr><th scope="row">차이 금액</th>{rows.map(({ r, dnp: c }) => <td key={r.id}>{signed(c.gapAmount)}</td>)}</tr><tr><th scope="row">차이 / DCF</th>{rows.map(({ r, dnp: c }) => <td key={r.id}>{signed(c.gapPercent)}%</td>)}</tr></tbody></table><div className={s.alternate}><header><h3>나노신소재 {fmt(nanoEvEbit, 2)}× 대체 적용</h3><span>현재 EV / 억 원</span></header><div className={s.alternateValues}>{rows.map(({ r, nano: c }) => <span key={r.id}>{r.label}<b>{number(c.enterpriseValue)}</b></span>)}</div><p className={s.note}>CNT 성장 기대 포함 · 적정가치 범위의 상단으로 채택 제외</p></div></section></div><div className={s.valueFormula}><b>DCF:</b> 명시 FCFF의 PV + 정상 FCFF / WACC의 PV − 정상 NWC 전환의 PV<br /><b>Exit 멀티플:</b> 동일 명시 FCFF의 PV + 정상 EBIT × 관측 EV/EBIT의 PV − 동일 NWC 전환의 PV</div><p className={s.note}>동일 기준일 2026.09.08 · 동일 정상 EBIT·할인 일정 · 미래 관측배수 유지 가정 · 명시 현금흐름 공유에 따른 독립성 제약<br />시장배수의 미래 성장 기대와 무성장 DCF의 전제 차이 · 확정 기업가치·주주가치·목표 거래가격과 구분</p></div>
}

const oatDefinitions: { label: string; detail: string; a: Partial<ScenarioParameters>; b: Partial<ScenarioParameters> }[] = [
  { label: '매출 증분 실현율', detail: '50% → 100%', a: { q: .5 }, b: { q: 1 } },
  { label: '위폼스 외주비율', detail: '40% → 30%', a: { outsourceRate: .4 }, b: { outsourceRate: .3 } },
  { label: 'NCWC 산업비율 배율', detail: '120% → 80%', a: { nwcMultiplier: 1.2 }, b: { nwcMultiplier: .8 } },
  { label: 'WACC', detail: 'BBB− → AA− 금리 대용', a: { wacc: waccReferences[1].wacc }, b: { wacc: waccReferences[0].wacc } },
  { label: '2026 CAPEX 잔여분', detail: '100% → 0%', a: { capexResidualShare: 1 }, b: { capexResidualShare: 0 } },
  { label: '개발비 자산화 가정계수', detail: '산업 R&D의 40% → 10%', a: { developmentCapitalizedShare: .4 }, b: { developmentCapitalizedShare: .1 } },
  { label: '기존 장비 잔여 상각기간', detail: '5년 → 10년', a: { existingEquipmentRemainingYears: 5 }, b: { existingEquipmentRemainingYears: 10 } },
]
export const oneAtATimeResults = oatDefinitions.map(row => ({ ...row, low: evaluateScenario('base', row.a, dnpEvEbit), high: evaluateScenario('base', row.b, dnpEvEbit) }))

function GapSensitivity() {
  const base = scenarios[1], comparison = compareWithMultiple(base, dnpEvEbit)
  const implicit = base.terminal.terminalValue / base.terminal.normalizedEbit
  return <div className={s.root}><div className={s.sensitivityGrid}><aside className={s.gapPanel}><span className={s.label}>중도안 / DNP Exit − DCF 차이</span><strong>{signed(comparison.gapAmount)}<span style={{ fontSize: 16 }}>억</span></strong><p>차이 / DCF {signed(comparison.gapPercent)}%<br />공통 명시 현금흐름의 상쇄</p><dl><div><dt>DCF 내재 TV / EBIT</dt><dd>{fmt(implicit, 2)}×</dd></div><div><dt>DNP 관측 EV / EBIT</dt><dd>{fmt(dnpEvEbit, 2)}×</dd></div><div><dt>정상화 EBIT</dt><dd>{fmt(base.terminal.normalizedEbit, 1)}억</dd></div><div><dt>TV 할인계수</dt><dd>{fmt(base.terminal.discountFactor, 4)}</dd></div></dl><small>차이 = 정상 EBIT × (관측 배수 − DCF 내재 배수) × 할인계수<br />성장·재투자·다각화·비영업자산·관측시점 차이 검토</small></aside><section><div className={s.oatTitle}><h3>중도안의 단일변수 민감도</h3><span>현재 EV / 억 원</span></div><table className={`${s.table} ${s.oatTable}`}><colgroup><col /><col /><col /></colgroup><thead><tr><th scope="col">변수 · 변경 전 → 후</th><th scope="col">DCF</th><th scope="col">DNP Exit</th></tr></thead><tbody>{oneAtATimeResults.map(row => <tr key={row.label}><th scope="row">{row.label}<small>{row.detail}</small></th><td>{fmt(row.low.dcf.enterpriseValue, 0)} → {fmt(row.high.dcf.enterpriseValue, 0)}</td><td>{number(row.low.comparison?.enterpriseValue ?? null, 0)} → {number(row.high.comparison?.enterpriseValue ?? null, 0)}</td></tr>)}</tbody></table><p className={s.note}>기타 중도안 조건 고정 · q 변경 시 재료비 개선률 동시 연동<br />범위의 단순 합산 제외 · 산업비율 및 내용연수 변경 시 재투자·세금·운전자본 동시 재계산</p></section></div><p className={s.note}>차이의 해석: 실제 거래 성사 가격의 예측 오차와 구분 · 멀티플 조정·미시적 비교기업·정상화 이익 추가 검증 필요</p></div>
}

export const scenarioSlides: { title: string; subtitle: string; source: ReactNode; content: ReactNode }[] = [
  { title: '상장 비교기업 선정 및 비교', subtitle: '제품 유사성·연결 이익·사업 구성·관측 시점의 동시 검토', source: '자료: DART 회사 공시·DNP 결산·JX 분기 공시 / DNP·나노신소재: 두 관측 앵커, 템스코 최종 적용배수 미확정', content: <PeerSelection /> },
  { title: '비교기업 멀티플 산정', subtitle: '시장 시가총액에서 EV로의 연결 및 연결 EBIT 기준 배수 · 서로 다른 관측 시점의 명시', source: <>{sourceLink('https://www.jpx.co.jp/markets/statistics-equities/price/t13vrt000000xpuw-att/st_202603-2.pdf', 'JPX')}, {sourceLink('https://www.global.dnp/content/dam/dnp-global/pdf/en/ir/library/consolidated/dnp_e_FinancialStatements_2025.pdf', 'DNP IR')}, {sourceLink('https://kind.krx.co.kr/common/stockprices.do?isurCd=12160&method=searchStockPricesMain', 'KRX 시세')}, {sourceLink('https://dart.fss.or.kr/report/viewer.do?rcpNo=20260814001307&dcmNo=11529630&eleId=17&offset=236675&length=3568920&dtd=dart4.xsd', 'DART')} · 원문·재계산·관측 시각: 별도 멀티플 분석서</>, content: <MultipleBuild /> },
  { title: '세 가지 시나리오 및 주요 가정', subtitle: '회사 전망 대비 매출·외주비·재료비·운전자본·WACC 변화의 조건부 분석', source: '자료: S02·S04·S06, KIS·NYU / 실현율·운전자본 배율·잔여 CAPEX·정상화 상한: 분석 가정 / 회사 승인 전망·최종 가치와 구분', content: <ScenarioAssumptions /> },
  ...scenarios.map(result => ({ title: `${result.label} 추정손익 및 현금흐름`, subtitle: `${result.description} · 통화: KRW · 명목 g=0%`, source: '산식: 제3안 시나리오 계산 모듈 / 일반 누진세율·내용연수·유지투자·산업NCWC·개발투자의 1차 가정 / 단위: 억 원', content: <ScenarioForecast result={result} /> })),
  { title: 'DCF·멀티플 교차가치', subtitle: '2026.09.08 현재 EV 기준 비교 · DCF 무성장 잔존가치와 시장 Exit 배수의 교차검토', source: 'DCF: g=0 / DNP 2026.03.31 관측 EV/EBIT / 나노신소재 2026.09.08 주가·6/30 LTM 대용 / 시나리오별 동일 관측 배수 적용', content: <ValueComparison /> },
  { title: '평가방식 간 차이 및 변수 민감도', subtitle: '평가 차이의 산식 분해 및 주요 입력 변화에 따른 가치 범위', source: '차이 정의: 멀티플 현재 EV − DCF 현재 EV / 차이율: 차이 ÷ DCF / 단일변수 분석: 중도안의 나머지 전제 고정', content: <GapSensitivity /> },
]
