import type { ReactNode } from 'react'
import { baseValuation as base, labels, sourceRow } from './valuationModel'
import { waccModel } from './waccModel'
import { valuationDate } from './valuationInputs'
import valuationData from './valuationData.json'
import { shareCapital, baseShareValues } from './shareCapitalModel'
import styles from './AccountingValuationSlides.module.css'
import ValuationSlideFrame from './ValuationSlideFrame'
const decimal = (value: number, digits = 4) => value.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const percent = (value: number, digits = 2) => `${decimal(value * 100, digits)}%`
type AccountingRow = { label: ReactNode; values: ReactNode[]; className?: string; terminalValue?: ReactNode }

function Heading({ children }: { children: ReactNode }) {
  return <h3 className={styles.sectionHeading}>{children}</h3>
}

function Frame({ title, english, children, notes }: { title: string; english?: string; children: ReactNode; notes: ReactNode }) {
  return <ValuationSlideFrame title={title} subtitle={english} notes={notes}>{children}</ValuationSlideFrame>
}

function CompactTable({ title, rows, className = '' }: { title?: ReactNode; rows: AccountingRow[]; className?: string }) {
  return <table className={`${styles.table} ${className}`}>
    {title && <caption className={styles.tableCaption}>{title}</caption>}
    <tbody>{rows.map((row, i) => <tr key={i} className={row.className}>
      <th scope="row">{row.label}</th>{row.values.map((value, j) => <td key={j}>{value}</td>)}
    </tr>)}</tbody>
  </table>
}

/** Both valuation scopes share the reference's EV-to-equity layout in KRW millions. */
function ValueResults({ entity }: { entity: 'parent' | 'consolidated' }) {
  const isParent = entity === 'parent'
  const v = base[entity]
  const balance = valuationData.entities[entity].balance2025
  const equity = isParent ? base.parentSotp : base.consolidatedEquity
  const basicShareValue = isParent ? baseShareValues.parentSotp : baseShareValues.consolidatedOwner
  const dilutedShareValue = isParent ? baseShareValues.dilutedParentSotp : baseShareValues.dilutedConsolidatedOwner
  const last = v.rows[v.rows.length - 1]
  const million = (value: number) => decimal(value * 100, 0)
  const perShare = (value: number | null) => value === null ? '—' : decimal(value, 0)
  return <section className={`${styles.summaryLeft} ${styles.parentResults}`} data-value-results={entity} data-parent-value-results={isParent || undefined}>
    <Heading>기업가치 평가결과</Heading>
    <CompactTable title={<>Stock Value <span className={styles.parentResultUnit}>단위: 백만원</span></>} rows={[
      { label: '추정기간동안의 현재가치', values: [million(v.pvExplicit)] },
      { label: '영구현금흐름의 현재가치', values: [million(v.pvTerminal)], className: styles.ruleAfter },
      { label: '영업현금흐름의 현재가치', values: [million(v.ev)], className: styles.bold },
      { label: '+ 비영업용자산 · 현금', values: [million(balance.cash)] },
      { label: '− 이자부부채', values: [million(balance.interestBearingDebt)] },
      isParent
        ? { label: `+ 위폼스 보유지분가치 ${percent(valuationData.ownership.parent, 0)}`, values: [million(base.parentHolding)] }
        : { label: `− 위폼스 비지배지분가치 ${percent(valuationData.ownership.nci, 0)}`, values: [million(base.nci)] },
      { label: '자기자본가치 · 지배주주', values: [million(equity)], className: styles.finalRow },
    ]} />
    <CompactTable title="영구현금흐름의 현재가치" rows={[
      { label: `${v.terminalCashFlowYear}년 이후 추정 NOPLAT`, values: [million(v.terminalEbit - v.terminalTax)] },
      { label: '영구성장률 · 무성장모형', values: ['0%'], className: styles.ruleAfter },
      { label: `${v.terminalCashFlowYear}년 이후 순운전자본 증가액`, values: ['0'] },
      { label: `${v.terminalCashFlowYear}년 이후 추정 FCFF`, values: [million(v.terminalFcff)] },
      { label: 'WACC', values: [percent(base.scenario.wacc)] },
      { label: `${v.terminalYear}년말 잔여가치`, values: [million(v.terminalValue)] },
      { label: '현가요소', values: [decimal(last.discountFactor)], className: styles.ruleAfter },
      { label: '영구현금흐름의 현재가치', values: [million(v.pvTerminal)], className: styles.terminalRow },
    ]} />
    <CompactTable title="주식 현황 및 주당가치 · 템스코" rows={[
      { label: '액면가(원)', values: [decimal(shareCapital.parent.parValueKRW, 0)] },
      { label: '발행주식수(주)', values: [decimal(shareCapital.parent.issuedShares, 0)] },
      { label: '기본 주당가치(원)', values: [perShare(basicShareValue)], className: styles.finalRow },
      { label: 'CB·BW·주식선택권 등 잠재주식', values: [shareCapital.parent.potentialShares === 0 ? '-' : decimal(shareCapital.parent.potentialShares, 0)] },
      { label: '희석 주당가치(원)', values: [perShare(dilutedShareValue)] },
    ]} />
  </section>
}

/** Accounting-report layout from the supplied result-summary reference, with V5-only values. */
export function Summary({ entity }: { entity: 'parent' | 'consolidated' }) {
  const v = base[entity]
  // The overview and FCFF tables share the model's KRW 100 million unit.
  const money = (value: number) => value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const valueLabel = entity === 'parent' ? '템스코 개별 기업가치' : '연결 기업가치'
  const rows = v.rows
  const last = rows[rows.length - 1]
  const annualSource = rows.map(row => sourceRow(entity, row.year))
  const values = (getter: (row: typeof last, index: number) => number, format = money) => rows.map((row, i) => format(getter(row, i)))
  const sourceMoney = (key: 'cogs' | 'grossProfit' | 'sga') => annualSource.map(row => row[key] === null ? '미확인' : money(row[key]))
  const sourceMargin = annualSource.map(row => row.grossProfit === null || !row.revenue ? '미확인' : percent(row.grossProfit / row.revenue, 1))
  const forecastRows: AccountingRow[] = [
    { label: '매출', values: values(row => row.revenue), className: styles.bold },
    { label: 'Growth rate, YoY', values: rows.map((row, i) => { const prior = i ? rows[i - 1].revenue : sourceRow(entity, row.year - 1).revenue; return prior ? percent(row.revenue / prior - 1, 1) : '미확인' }), className: styles.ratio },
    { label: '매출원가', values: sourceMoney('cogs'), className: styles.ruleAfter },
    { label: '매출총이익', values: sourceMoney('grossProfit'), className: styles.bold },
    { label: 'Gross profit margin', values: sourceMargin, className: styles.ratio },
    { label: '판매관리비', values: sourceMoney('sga'), className: styles.ruleAfter },
    { label: '영업이익 · 사업계획', values: values(row => row.sourceEbit), className: styles.bold },
    { label: '감가상각비 조정', values: values(row => row.daRemovedProxy - row.modeledDa) },
    { label: '추정 영업이익', values: values(row => row.ebit), terminalValue: money(v.terminalEbit), className: styles.bold },
    { label: 'Operating income margin', values: values(row => row.ebit / row.revenue, value => percent(value, 1)), className: styles.ratio },
    { label: '영업이익에 대한 추정 법인세', values: values(row => row.operatingTax), terminalValue: money(v.terminalTax), className: styles.bold },
    { label: 'Effective tax rate', values: values(row => row.ebit > 0 ? row.operatingTax / row.ebit : 0, value => percent(value, 1)), terminalValue: percent(v.terminalEbit > 0 ? v.terminalTax / v.terminalEbit : 0, 1), className: `${styles.ratio} ${styles.ruleAfter}` },
    { label: '법인세차감후영업이익 (NOPLAT)', values: values(row => row.nopat), terminalValue: money(v.terminalEbit - v.terminalTax), className: `${styles.bold} ${styles.ruleAfter}` },
    { label: 'Depreciation and amortization', values: values(row => row.modeledDa) },
    { label: '현금흐름 적용기간', values: values(row => row.periodFraction, value => decimal(value, 4)), className: styles.ratio },
    { label: '(−) CAPEX · 유지투자 + 성장투자', values: values(row => -(row.maintenance * row.periodFraction + row.growthCapex)) },
    { label: '(−) 자산화 개발비', values: values(row => -row.development * row.periodFraction) },
    { label: '(−) 순운전자본 증가', values: values(row => -row.deltaNwc), terminalValue: money(0), className: styles.ruleAfter },
    { label: 'Free Cash Flows', values: values(row => row.fcff), terminalValue: money(v.terminalFcff), className: `${styles.bold} ${styles.ruleAfter}` },
    { label: '기간계수 · 평가일~각 연말', values: values(row => row.discountYears, value => decimal(value, 3)) },
    { label: '현가요소', values: values(row => row.discountFactor, value => decimal(value, 4)), className: styles.ruleAfter },
    { label: 'FCFF의 현재가치', values: values(row => row.pv), className: `${styles.bold} ${styles.doubleRule}` },
  ]
  return <Frame title={`${valueLabel} 및 추정현금흐름`} notes={null}>
    <div className={styles.summaryGrid}>
      <ValueResults entity={entity} />
      <section className={styles.summaryRight}><Heading>추정현금흐름</Heading>
        <table className={`${styles.table} ${styles.forecastTable}`} aria-label={`${labels[entity]} 추정현금흐름, 억원`}>
          <colgroup><col style={{ width: '34%' }} />{rows.map(row => <col key={row.year} style={{ width: `${66 / (rows.length + 1)}%` }} />)}<col style={{ width: `${66 / (rows.length + 1)}%` }} /></colgroup>
          <thead><tr><th scope="col">단위: 억원</th>{rows.map(row => <th scope="col" key={row.year}>{row.year}<br /><span>Projected</span></th>)}<th scope="col" className={styles.terminalColumn}>{v.terminalCashFlowYear}<br /><span>이후 · 연간</span></th></tr></thead>
          <tbody>{forecastRows.map((row, i) => <tr key={i} className={row.className}><th scope="row">{row.label}</th>{row.values.map((value, j) => <td key={j}>{value}</td>)}<td className={styles.terminalColumn}>{row.terminalValue ?? '—'}</td></tr>)}</tbody>
        </table>
        <div className={styles.terminalAssumptions} data-terminal-assumptions aria-label="잔여가치 산정 가정">
          <p><strong>g=0% (무성장모형 채택)</strong> · 잔여가치 현재가치 = 이후 연간 FCFF ÷ WACC × 현가요소</p>
          <p>영업이익: {v.terminalYear}년 기준 · {v.terminalYear - 1}년 이익률 상한·반복 개발비 반영{entity === 'consolidated' ? ' · 법인별 이익·세액 합산' : ''}</p>
          <p>상각비 = 유지·반복 개발투자 · 순운전자본 증가·성장투자 = 0</p>
        </div>
      </section>
    </div>
  </Frame>
}

export function WaccMethod() {
  return <Frame title="가중평균자본비용의 산정 방법" english="Weighted Average Cost of Capital" notes={<>평가기준일 {valuationDate.replaceAll('-', '.')} · 지정 평가모델 DCF 입력가정·WACC 시트 · Kd: 세후 타인자본비용 · 비교기업·목표자본구조: 입력가정</>}>
    <div className={styles.methodGrid}>
      <section><Heading>가중평균자본비용</Heading>
        <ul><li>미래 영업현금흐름의 현재가치 환산에 적용하는 할인율</li><li>자기자본비용과 타인자본비용의 자본구성 비율에 따른 가중평균</li><li>자본비용과 자본가중치의 곱을 합산하여 산정</li></ul>
        <p className={styles.formula}>WACC = Ke × E/(D+E) + Kd × D/(D+E)</p>
        <dl className={styles.definitions}><div><dt>Ke</dt><dd>자기자본비용 (cost of equity)</dd></div><div><dt>Kd</dt><dd>세후 타인자본비용 (after-tax cost of debt)</dd></div><div><dt>E</dt><dd>자기자본의 가치</dd></div><div><dt>D</dt><dd>부채의 가치</dd></div></dl>
      </section>
      <section><Heading>자기자본비용 (Cost of Equity)</Heading>
        <ul><li>CAPM 기반 자기자본비용에 규모위험프리미엄 가산</li><li>무위험이자율 + 시장위험프리미엄 × 재차입 베타 + 규모위험프리미엄</li><li>비교기업 베타의 차입효과 제거 후 목표자본구조로 재조정</li></ul>
        <p className={styles.formula}>Ke = Rf + ERP × βL + SRP</p>
        <dl className={styles.definitions}><div><dt>Rf</dt><dd>무위험이자율</dd></div><div><dt>ERP</dt><dd>시장위험프리미엄</dd></div><div><dt>βL</dt><dd>목표자본구조를 적용한 재차입 베타</dd></div><div><dt>SRP</dt><dd>규모위험프리미엄</dd></div></dl>
      </section>
      <section><Heading>타인자본비용 (Cost of Debt)</Heading>
        <ul><li>세전 차입비용에 이자비용의 법인세 절감효과를 반영한 세후 조달비용</li></ul>
        <p className={styles.formula}>Kd = 세전 타인자본비용 × (1 − t)</p>
        <p className={styles.methodDetail}>t: 법인세율 · 손실 법인의 즉시 절세 가능성 및 실제 차입조건 미확인</p>
      </section>
      <section><Heading>목표자본구조</Heading>
        <ul><li>지정 평가모델의 목표 부채/자기자본 비율에 따른 자본가중치 산정</li></ul>
        <p className={styles.formula}>E/(D+E) = 1 ÷ (1 + D/E)</p>
        <p className={styles.formula}>D/(D+E) = (D/E) ÷ (1 + D/E)</p>
        <p className={styles.methodDetail}>비교기업 베타·D/E와 목표 D/E의 구분 적용<br />실측 시장 자본구조 확인 여부: 할인율 산정근거 참조</p>
      </section>
    </div>
  </Frame>
}

export function WaccCalculation() {
  const w = waccModel
  const inputs = [
    { label: '무위험이자율 (Rf)', value: percent(w.rf), basis: '지정 평가모델 DCF 입력가정' },
    { label: 'Market Risk Premium (ERP)', value: percent(w.erp), basis: '시장위험프리미엄 입력가정' },
    { label: '비교기업 Levered Beta', value: decimal(w.peerBeta), basis: '비교기업 베타 입력값' },
    { label: '비교기업 Debt/Equity', value: percent(w.peerDebtEquity), basis: '무차입 베타 환산에 적용하는 비교기업 부채/자기자본 비율' },
    { label: 'Unlevered Beta (βU)', value: decimal(w.unleveredBeta), basis: '비교기업 βL ÷ [1 + (1 − t) × 비교기업 D/E]' },
    { label: '목표 Debt/Equity', value: percent(w.targetDebtEquity), basis: '목표자본구조 입력가정 · 재차입 베타 및 WACC 가중치에 적용' },
    { label: 'Levered Beta (βL)', value: decimal(w.leveredBeta), basis: 'βU × [1 + (1 − t) × 목표 D/E]' },
    { label: 'Size Risk Premium (SRP)', value: percent(w.sizePremium), basis: '규모위험프리미엄 입력가정' },
    { label: '자기자본비용 (Ke)', value: percent(w.costOfEquity), basis: 'Ke = Rf + ERP × βL + SRP', strong: true },
    { label: '세전 타인자본비용 (i)', value: percent(w.preTaxDebtCost), basis: '세전 차입비용 입력가정', separated: true },
    { label: '법인세율 (t)', value: percent(w.taxRate), basis: '이자비용 절세효과 및 베타 환산에 적용' },
    { label: '세후 타인자본비용 (Kd)', value: percent(w.afterTaxDebtCost), basis: 'Kd = i × (1 − t)', strong: true },
  ]
  return <Frame title="가중평균자본비용(WACC)의 산정" notes={null}>
    <Heading>가중평균자본비용(WACC)의 산정</Heading>
    <table className={`${styles.table} ${styles.rateTable}`} aria-label="할인율 입력값 및 산정근거">
      <colgroup><col style={{ width: '30%' }} /><col style={{ width: '10%' }} /><col style={{ width: '60%' }} /></colgroup>
      <thead><tr><th scope="col">구분</th><th scope="col" aria-label="적용값"></th><th scope="col">산정근거</th></tr></thead>
      <tbody>{inputs.map(row => <tr key={row.label} className={`${row.strong ? styles.rateStrong : ''} ${row.separated ? styles.separated : ''}`}><th scope="row">{row.label}</th><td>{row.value}</td><td>{row.basis}</td></tr>)}</tbody>
    </table>
    <div className={styles.waccBottom}>
      <table className={`${styles.table} ${styles.weightTable}`} aria-label="가중평균자본비용 계산">
        <colgroup><col style={{ width: '24%' }} /><col style={{ width: '11%' }} /><col style={{ width: '10%' }} /><col style={{ width: '10%' }} /><col style={{ width: '45%' }} /></colgroup>
        <thead><tr><th scope="col">WACC</th><th scope="col">Required<br />return</th><th scope="col">weighting</th><th scope="col">WACC</th><th scope="col">산정근거</th></tr></thead>
        <tbody>
          <tr><th scope="row">자기자본비용 (Ke)</th><td>{percent(w.costOfEquity)}</td><td>{percent(w.equityWeight)}</td><td>{percent(w.costOfEquity * w.equityWeight)}</td><td>Ke × E/(D+E)</td></tr>
          <tr><th scope="row">세후 타인자본비용 (Kd)</th><td>{percent(w.afterTaxDebtCost)}</td><td>{percent(w.debtWeight)}</td><td>{percent(w.afterTaxDebtCost * w.debtWeight)}</td><td>Kd × D/(D+E)</td></tr>
          <tr className={styles.waccFinal}><th scope="row" colSpan={3}>가중평균자본비용 (WACC)</th><td>{percent(w.wacc)}</td><td>Ke × E/(D+E) + Kd × D/(D+E)</td></tr>
        </tbody>
      </table>
      <table className={`${styles.table} ${styles.capitalRatios}`} aria-label="목표자본구조 가중치"><tbody>
        <tr><th scope="row">Equity to Total Capital Ratio</th><td>{percent(w.equityWeight)}</td></tr>
        <tr><th scope="row">Debt to Total Capital Ratio</th><td>{percent(w.debtWeight)}</td></tr>
      </tbody></table>
    </div>
  </Frame>
}
