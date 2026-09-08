import { fmt } from './financials'
import { firstPassAssumptions as a, assumedCapitalizedDevelopmentToRevenue } from './firstPassAssumptions'
import { corporateTaxAssumptions as tax } from './corporateTax'
import { scenarios } from './scenarioValuation'
import s from './assumptionLayouts.module.css'

const pct = (value: number, digits = 2) => `${fmt(value * 100, digits)}%`
const years = (value: number) => `${value}년`
const taxBrackets = tax.thresholds.map(value => fmt(value, 0)).join(' / ')
const nationalRates = tax.nationalRates.map(value => pct(value, 0)).join(' / ')
const localRates = tax.localRates.map(value => pct(value, 1).replace('.0%', '%')).join(' / ')

export function FirstPassAssumptionRegister() {
  const multiplier = a.workingCapital.scenarioMultipliers
  return <div className={s.root}>
    <div className={s.registerIntro}><span>공개 산업자료·일반 세율·내용연수의 1차 적용</span><strong>실제 결산·자산대장 확보 시 가정 갱신</strong></div>
    <table className={s.table}>
      <colgroup><col className={s.subjectColumn} /><col className={s.assumptionColumn} /><col /></colgroup>
      <thead><tr><th scope="col">추정 항목</th><th scope="col">1차 적용 가정</th><th scope="col">근거·후속 확인</th></tr></thead>
      <tbody>
        <tr><th scope="row">법인세·지방소득세<small>{tax.effectiveYear} 일반 영리법인</small></th><td>국세 <b>{nationalRates}</b><br />지방 <b>{localRates}</b><br /><small>과표 경계 {taxBrackets}억 원 · 법인별 누진 계산</small></td><td>과표=장부이익 대용<br />결손금·공제·납부시차 0 가정<small>세무조정·이월결손금·공제명세</small></td></tr>
        <tr><th scope="row">감가상각·무형상각<small>정액법·잔존가 {pct(a.depreciation.residualValueRate, 0)}</small></th><td>기존 설비 잔여 <b>{years(a.depreciation.existingEquipmentRemainingYears)}</b> / 신규 <b>{years(a.depreciation.newEquipmentYears)}</b><br />유한 무형 <b>{years(a.depreciation.finiteIntangibleYears)}</b> / 건물 <b>{years(a.depreciation.newBuildingYears)}</b><br /><small>신규·유지 취득연도 {pct(a.depreciation.firstYearFraction, 0)} · 토지 상각 {pct(a.depreciation.landDepreciationRate, 0)}</small></td><td>기존 순장부액의 잔여기간 대용<br />미가동 건설중자산·영업권 제외<small>자산대장·가동일·제조/판관 배부</small></td></tr>
        <tr><th scope="row">비현금 운전자본<small>내부거래 제거 후 연결매출</small></th><td>산업 NCWC/매출 <b>{pct(a.industry.ncwcToRevenue, 4)}</b><br /><small>낙관 ×{fmt(multiplier.optimistic, 1)} / 중도 ×{fmt(multiplier.base, 1)} / 비관 ×{fmt(multiplier.pessimistic, 1)}</small></td><td>Global 전자업종 {fmt(a.industry.firms, 0)}개<small>{a.industry.observedAt} · 합산잔액/합산매출<br />시나리오 배율: 분석 가정</small></td></tr>
        <tr><th scope="row">추가 자산화 개발비<small>별도 현금지출 예산 대용</small></th><td>산업 R&D <b>{pct(a.industry.rdToRevenue, 4)}</b> × 가정 <b>{pct(a.development.assumedCapitalizedShare, 0)}</b><br />연결매출의 <b>{pct(assumedCapitalizedDevelopmentToRevenue, 4)}</b> 추가 지출<br /><small>기존 비용 포함 e={a.development.alreadyIncludedInCompanyExpenseShare} · {years(a.development.usefulLifeYears)} 상각 · 첫해 {pct(a.development.firstYearFraction, 0)}</small></td><td>{pct(a.development.assumedCapitalizedShare, 0)}: 실제 산업 자산화율과 구분<br />회사 기존 R&D 비용 환입 제외<small>프로젝트 예산·인식 요건·세무시점</small></td></tr>
        <tr><th scope="row">EV → 주주가치<small>{a.equityBridge.balanceDate} 잔액 대용</small></th><td>순차입금 <b>{fmt(a.equityBridge.netDebtProxy, 1)}억</b> · NCI <b>{fmt(a.equityBridge.nonControllingInterestProxy, 1)}억</b><br /><small>비영업자산·기타 조정 {fmt(a.equityBridge.otherAdjustment, 0)} 가정</small></td><td>평가일 잔액 대용 · NCI 장부가<small>평가일 부채·현금·비지배지분 가치</small></td></tr>
      </tbody>
    </table>
    <div className={s.registerFoot}><p>연말 NCWC = 연결매출 × 산업비율 × 시나리오 배율 · ΔNCWC = 기말 − 기초 · 기존 회전일수 방식과 중복 제외</p><p>법인별 누진 손익·영업세금과 WACC 한계세율의 구분 · 개발비 지출·상각·현금세금의 동시 반영</p></div>
  </div>
}

export function FirstPassEquityValue() {
  const bridge = a.equityBridge
  const values = scenarios.map(result => ({ result, equity: result.dcf.enterpriseValue - bridge.netDebtProxy - bridge.nonControllingInterestProxy + bridge.otherAdjustment }))
  return <div className={`${s.root} ${s.equityRoot}`}>
    <div className={s.equityBasis}><span>평가 기준일 2026.09.08</span><span>조정 잔액: {bridge.balanceDate}의 평가일 대용</span></div>
    <div className={s.equityGrid}>
      <table className={`${s.table} ${s.equityTable}`}>
        <colgroup><col className={s.equityLabelColumn} /><col /><col /><col /></colgroup>
        <thead><tr><th scope="col">현재가치 / 억 원</th>{values.map(({ result }) => <th scope="col" key={result.id}>{result.label}</th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">연결 DCF 기업가치</th>{values.map(({ result }) => <td key={result.id}>{fmt(result.dcf.enterpriseValue, 1)}</td>)}</tr>
          <tr><th scope="row">− 순차입금 대용</th>{values.map(({ result }) => <td key={result.id}>{fmt(bridge.netDebtProxy, 1)}</td>)}</tr>
          <tr><th scope="row">− 비지배지분 대용</th>{values.map(({ result }) => <td key={result.id}>{fmt(bridge.nonControllingInterestProxy, 1)}</td>)}</tr>
          <tr><th scope="row">+ 기타 조정 가정</th>{values.map(({ result }) => <td key={result.id}>{fmt(bridge.otherAdjustment, 1)}</td>)}</tr>
          <tr className={s.equityTotal}><th scope="row">모회사 전체 주주가치</th>{values.map(({ result, equity }) => <td className={equity < 0 ? s.negative : undefined} key={result.id}>{fmt(equity, 1)}</td>)}</tr>
        </tbody>
      </table>
      <aside className={s.equityHero}><span>중도안 1차 주주가치</span><strong className={values[1].equity < 0 ? s.negative : undefined}>{fmt(values[1].equity, 1)}<small>억</small></strong><p>전체 모회사 주주 귀속의 대용값<br />특정 투자자의 귀속가치와 구분</p><div>주당가·완전희석 주식수<br /><b>미산출</b></div></aside>
    </div>
    <div className={s.equityConditions}>
      <section><h3>잔액·범위의 1차 가정</h3><p>2025 말 순차입금의 평가일 대용<br />NCI 장부가 대용 · 비영업자산·기타 조정 0<br />실제 평가일 잔액·NCI 시장가치 미반영</p></section>
      <section><h3>증권별 귀속 및 투자금의 구분</h3><p>우선권·전환증권·옵션·완전희석 주식수 추가 검토<br />신주 현금 유입·구주 거래·발행비용의 분리<br />미래 조달금의 FCFF·EV 중복 가산 제외</p></section>
    </div>
    <p className={s.equityFoot}>주주가치 = 연결 기업가치 − 순차입금 − 비지배지분 + 기타 조정 · 실사·계약조건 반영 전 1차 추정</p>
  </div>
}
