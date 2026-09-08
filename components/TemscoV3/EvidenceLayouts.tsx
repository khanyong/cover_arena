import type { CSSProperties, ReactNode } from 'react'
import raw from './companyForecast.json'
import market from './marketResearch.json'
import { fmt } from './financials'
import { scenarios, type AnnualScenario } from './scenarioValuation'
import { debtProxies, industryProxies, waccReferences } from './marketInputs'
import { terminalGrowth, zeroGrowthTerminal } from './valuation'
import s from './evidenceLayouts.module.css'

const periods = raw.periods
const base = scenarios[1]
const future = base.annual
const percent = (value: number, digits = 2) => `${fmt(value * 100, digits)}%`
const terminalFcff = base.terminal.normalizedFcff
const sensitivityFactors = [.8, 1, 1.2] as const
const sensitivityValues = waccReferences.flatMap(row => sensitivityFactors.map(factor => zeroGrowthTerminal(terminalFcff * factor, row.wacc)))
const sensitivityMin = Math.min(...sensitivityValues)
const sensitivityMax = Math.max(...sensitivityValues)

function Amount({ value, digits = 1 }: { value: number | null | undefined; digits?: number }) {
  if (value === null || value === undefined) return <span className={s.pending}>미확정</span>
  return <span className={value < 0 ? s.loss : undefined}>{fmt(value / 1e8, digits)}</span>
}

const peerLabels = [
  { name: '핌스', product: 'OLED 보조 마스크', scope: 'Frame·Coating 내재화 공시 · 단순 임가공 분류 제외' },
  { name: '풍원정밀', product: 'OMM/SBM·FMM 개발', scope: '개발비·양산 부담 · 품목별 상업화 단계 구분' },
  { name: 'DNP', product: 'FMM 기술 비교', scope: '광학필름·반도체 등 다각화 사업 포함' },
  { name: 'JX Advanced Metals', product: '스퍼터링 타겟', scope: '금속·자원·지분법 이익 등 혼합 사업 영향' },
] as const

function Competitors() {
  return <div className={s.layout}>
    <div className={s.peerColumns}>
      {[0, 1].map(region => <section className={s.region} key={region}>
        <header className={s.regionHeader}>
          <h3>{region === 0 ? '한국 / 마스크 제품 비교' : '일본 / 인접 기술 비교'}</h3>
          <span>{region === 0 ? '2026.01–06 · 억 원' : '2026.04–06 · 백만 엔'}</span>
        </header>
        {[region * 2, region * 2 + 1].map(index => {
          const peer = market.peers[index]
          const label = peerLabels[index]
          const divisor = index < 2 ? 1e8 : 1
          const digits = index < 2 ? 2 : 0
          return <article className={s.peer} key={peer.name}>
            <div className={s.peerName}><h4>{label.name}</h4><span>{label.product}</span></div>
            <dl className={s.peerNumbers}>
              <div><dt>연결 매출</dt><dd>{fmt(peer.latest.revenue / divisor, digits)}</dd></div>
              <div><dt>연결 영업손익</dt><dd className={peer.latest.operating_profit < 0 ? s.loss : undefined}>{fmt(peer.latest.operating_profit / divisor, digits)}</dd></div>
            </dl>
            <p className={s.note}>{label.scope}</p>
          </article>
        })}
      </section>)}
    </div>
    <div className={s.comparisonRule}><b>베타 표본 선정</b><span>제품 경쟁사와 주식 베타 비교기업의 구분<br />제품·고객·영업레버리지·상장기업 사업 구성 검토</span></div>
    <p className={s.note}>2025 연결 매출 / 영업손익: 핌스 {fmt(market.peers[0].annual.revenue / 1e8, 2)} / {fmt(market.peers[0].annual.operating_profit / 1e8, 2)}억 · 풍원정밀 {fmt(market.peers[1].annual.revenue / 1e8, 2)} / {fmt(market.peers[1].annual.operating_profit / 1e8, 2)}억<br />수치 불일치: DART 원문 우선 · 비교 기준: 서로 다른 통화·누적기간, 단순 연환산 제외</p>
  </div>
}

const plRows = [
  { label: '매출', key: 'revenue', level: 'total' },
  { label: '매출원가', key: 'cogs', level: 'detail' },
  { label: '매출총이익', key: 'grossProfit', level: 'subtotal' },
  { label: '판매관리비', key: 'sga', level: 'detail' },
  { label: '영업이익 EBIT', key: 'ebit', level: 'total' },
  { label: '영업외손익', key: 'netNonOperating', level: 'detail' },
  { label: '└ 이자비용 등*', key: 'interestExpenseSigned', level: 'detail' },
  { label: '법인세차감전이익', key: 'ebt', level: 'subtotal' },
  { label: '법인세비용', key: 'taxExpense', level: 'detail' },
  { label: '당기순이익', key: 'netIncome', level: 'closing' },
] as const

function FullIncomeStatement() {
  return <div className={s.layout}>
    <div className={s.plLegend}><span><i />A · 회사 수록 실적</span><span><i />E · 회사 추정</span><b>연결 / 억 원</b></div>
    <table className={`${s.table} ${s.plTable}`} data-evidence-table="full-pl">
      <colgroup><col className={s.plLabelColumn} />{periods.map(period => <col key={period.year} />)}</colgroup>
      <thead>
        <tr className={s.periodGroups}><th scope="col">손익 단계</th><th scope="colgroup" colSpan={2}>과거 실적</th><th scope="colgroup" colSpan={4}>회사 전망</th></tr>
        <tr><th scope="col">계정</th>{periods.map(period => <th className={period.year === 2026 ? s.forecastBoundary : undefined} scope="col" key={period.year}>{period.year}{period.year < 2026 ? 'A' : 'E'}</th>)}</tr>
      </thead>
      <tbody>{plRows.map(row => <tr key={row.key} className={s[row.level]}>
        <th scope="row">{row.label}</th>
        {periods.map(period => <td key={period.year} className={`${period.year >= 2026 ? s.forecastCell : ''} ${period.year === 2026 ? s.forecastBoundary : ''}`}><Amount value={period.consolidated[row.key]} /></td>)}
      </tr>)}</tbody>
    </table>
    <p className={s.note}>*연결 이자비용: 위폼스 순이자비용 합산 · 2026 세전이익 1.4억 / 세금 7.0억: 법인별 세금·결손금 공제 검토<br />자회사 손실·모회사 과세소득의 자동 상계 제외 · 손익계산서 세금과 FCFF 영업 현금세금 구분</p>
  </div>
}

function WaccBuild() {
  return <div className={s.layout}>
    <div className={s.waccColumns}>
      <section className={s.calculationPath} aria-label="WACC 계산 순서">
        <div className={s.pathStep}><span>01</span><div><h3>자본구조 조정</h3><p>βL = βU × [1 + (1 − T) × D/E]</p><small>βU: 현금 조정 무차입 베타</small></div></div>
        <div className={s.pathStep}><span>02</span><div><h3>자기자본비용</h3><p>Ke = Rf + βL × ERP + CRP × λ</p><small>한국 위험 노출계수 λ = 1 가정</small></div></div>
        <div className={s.pathStep}><span>03</span><div><h3>시장가치 가중</h3><p>WACC = Ke × E/V<br />+ Kd × (1 − T) × D/V</p><small>E: 시가총액 · D: 금융부채 시장가치</small></div></div>
      </section>
      <section className={s.industryPanel} aria-label="업종별 WACC 참고 범위">
        <div className={s.panelLabel}><b>업종별 WACC</b><span>2개 업종 × 2개 차입금리</span></div>
        {industryProxies.map((industry, index) => <article className={s.industry} key={industry.name}>
          <header><h3>{industry.name}</h3><span>{industry.firms.toLocaleString('en-US')}개사</span></header>
          <dl className={s.betaInputs}><div><dt>βU</dt><dd>{fmt(industry.betaUnlevered, 2)}</dd></div><div><dt>시장 D/E</dt><dd>{percent(industry.debtEquity)}</dd></div><div><dt>조정 βL</dt><dd>{fmt(waccReferences[index * 2].betaLevered, 3)}</dd></div></dl>
          <div className={s.waccResults}>{debtProxies.map((debt, debtIndex) => <div key={debt.label}>
            <div><span>{debt.label} 기준 WACC</span><strong>{percent(waccReferences[index * 2 + debtIndex].wacc)}</strong></div>
            <small>참고 Kd {percent(debt.debtCost, 3)}</small>
          </div>)}</div>
        </article>)}
      </section>
    </div>
    <p className={s.note}>참고 범위: 사업군·차입금리 대용값, 업종 비중 임의 가중 제외 · AA−·BBB−: 템스코 신용등급 부여와 구분<br />최종 WACC 선정: 개별 비교기업 베타의 빈도·기간·지수·조정 방식·D 범위 통일 · 회사 장부 부채비율 1,133%의 가중치 적용 제외</p>
  </div>
}

const fcffRows: { label: string; value: (period: AnnualScenario) => number; kind?: string }[] = [
  { label: '영업이익 EBIT', value: a => a.fcffEbit, kind: 'total' },
  { label: '− 영업 현금 법인세', value: a => a.fcffOperatingCashTax },
  { label: '= 세후 영업이익', value: a => a.fcffNopat },
  { label: '+ 가정 적용 D&A', value: a => a.fcffDa },
  { label: '− 계획 현금 CAPEX', value: a => a.plannedCashCapex },
  { label: '− 유지 현금 CAPEX', value: a => a.maintenanceCashCapex },
  { label: '− 자산화 개발비', value: a => a.capitalizedDevelopment },
  { label: '− 영업운전자금 증가', value: a => a.deltaNwc },
  { label: '= FCFF', value: a => a.fcff, kind: 'closing' },
]

function FcffBuild() {
  return <div className={s.layout}>
    <div className={s.fcffColumns}>
      <aside className={s.cashBridge}>
        <span className={s.eyebrow}>영업손익 → 잉여현금</span>
        <ol>
          <li><span>01</span><div><b>세후 영업이익</b><p>EBIT − 영업 현금법인세</p></div></li>
          <li><span>02</span><div><b>감가상각·무형상각 가산</b><p>+ 전체 연결 D&A</p></div></li>
          <li><span>03</span><div><b>설비·개발 재투자</b><p>− CAPEX − 자산화 개발비</p></div></li>
          <li><span>04</span><div><b>운전자본 반영</b><p>− 영업운전자금 증가</p></div></li>
        </ol>
        <div className={s.pendingResult}><span>2029 FCFF</span><strong>{fmt(base.annual[3].fcff, 1)}억</strong></div>
        <p className={s.note}>중도안 · 1차 가정 적용<br />회사 원표와 별도 모델 구분</p>
      </aside>
      <div className={s.fcffMatrix}>
        <div className={s.panelLabel}><b>중도안 · 1차 가정 현금흐름</b><span>연결 / 억 원</span></div>
        <table className={`${s.table} ${s.fcffTable}`} data-evidence-table="fcff">
          <colgroup><col className={s.fcffLabelColumn} />{future.map(period => <col key={period.year} />)}</colgroup>
          <thead><tr><th scope="col">산출 항목</th>{future.map(period => <th scope="col" key={period.year}>{period.year}{period.year === 2026 ? ' 잔여' : 'E'}</th>)}</tr></thead>
          <tbody>{fcffRows.map(row => <tr key={row.label} className={row.kind ? s[row.kind] : undefined}><th scope="row">{row.label}</th>{future.map(period => <td key={period.year}><span className={row.value(period) < 0 ? s.loss : undefined}>{fmt(row.value(period), 1)}</span></td>)}</tr>)}</tbody>
        </table>
        <p className={s.note}>2026 영업현금·유지투자·개발비: 114/365 · 계획 CAPEX: 50% 잔여 가정<br />ΔNWC: 연말 잔액 − 공통 평가일 잔액 · 일수 재안분 제외<br />FCFF 제외: 신주·차입 유입, 이자·원금 상환</p>
      </div>
    </div>
  </div>
}

function TvSensitivity() {
  return <div className={s.layout}>
    <div className={s.tvColumns}>
      <aside className={s.terminalBasis}>
        <span className={s.eyebrow}>중도안 · 1차 가정 기준</span>
        <p>정상화 FCFF</p>
        <strong className={s.terminalNumber}>{fmt(terminalFcff, 2)}<small>억 원</small></strong>
        <div className={s.terminalRule} />
        <dl><div><dt>잔존가치 시점</dt><dd>2029년 말</dd></div><div><dt>영구성장률</dt><dd>g = {terminalGrowth}%</dd></div></dl>
        <p className={s.terminalAssumption}>유지 CAPEX = 비개발 D&A<br />개발상각 = 개발 재투자<br />정상 ΔNWC = 0</p>
        <p className={s.terminalWarning}>기준 마진의 지속 가능성 미확정<br />현재 기업가치와 구분</p>
      </aside>
      <section className={s.sensitivityPanel}>
        <div className={s.panelLabel}><b>무성장 TV 민감도</b><span>단위: 억 원 · g = 0%</span></div>
        <table className={`${s.table} ${s.heatmap}`} data-evidence-table="tv-sensitivity">
          <colgroup><col className={s.sensitivityLabelColumn} /><col /><col /><col /></colgroup>
          <thead><tr><th scope="col">참고 WACC / 정상화 수준</th>{sensitivityFactors.map(factor => <th scope="col" className={factor === 1 ? s.baselineHead : undefined} key={factor}>FCFF {fmt(factor * 100, 0)}%</th>)}</tr></thead>
          <tbody>{waccReferences.map(row => <tr key={`${row.name}-${row.rating}`}>
            <th scope="row"><span>{row.name}</span><small>{row.rating} Kd 적용 · WACC {percent(row.wacc)}</small></th>
            {sensitivityFactors.map(factor => {
              const value = zeroGrowthTerminal(terminalFcff * factor, row.wacc)
              const shade = .045 + (value - sensitivityMin) / (sensitivityMax - sensitivityMin) * .17
              return <td key={factor} className={factor === 1 ? s.baseline : undefined} style={{ '--heat': shade } as CSSProperties}>{fmt(value)}</td>
            })}
          </tr>)}</tbody>
        </table>
        <div className={s.sensitivityDirection}><span>유지비 &gt; 감가상각</span><b>정상화 FCFF ↓</b><b>잔존가치 ↓</b></div>
        <p className={s.note}>80%·120%: 분석 민감도, 시장 관측 확률·실적 예측과 구분<br />정상화 현금흐름 음수 시 양의 영구가치 예시 적용 제외 · 색상 강도: 표 안의 상대 금액 수준</p>
      </section>
    </div>
  </div>
}

const evidenceGroups = [
  { number: '01', title: '시장·공개 연구', label: '관측·범위', facts: ['국고·회사채 수익률 / ERP·CRP', '업종 βU·시장 D/E', '공개 시장 전망의 범위·경쟁사 실적'], checks: ['동일 기준일·적합 비교기업·차입 견적', '마스크·소재 SAM·회사 점유율', '제품 승인·양품 CAPA'] },
  { number: '02', title: '회사 자료', label: '실적·계획', facts: ['과거 손익·인수 설명', '2026–29 손익·설비 계획', '내부거래 제거·연결 수록값'], checks: ['감사 재무 대사·인수 조달', '회사 자료의 출처 셀·연결 범위', '고객 FCST·발주·단가·CAPA 검증', '시장 수요와 공급 능력의 연결'] },
  { number: '03', title: '분석 가정', label: '적용·검산', facts: ['g = 0 · 업종 WACC 참고', '누진세율·상각 5/10년', '산업 운전자본율·개발투자 대용'], checks: ['안정기 마진·유지 CAPEX', '현금세금·운전자금', '후속 투자에 따른 지분 희석'] },
] as const

function EvidenceRegister() {
  return <div className={s.layout}>
    <div className={s.ledger}>
      {evidenceGroups.map(group => <section className={s.ledgerColumn} key={group.number}>
        <header><span>{group.number}</span><div><small>{group.label}</small><h3>{group.title}</h3></div></header>
        <div className={s.ledgerBlock}><b>현재 반영</b><ul>{group.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></div>
        <div className={s.ledgerBlock}><b>확정·갱신 항목</b><ul>{group.checks.map(check => <li key={check}>{check}</li>)}</ul></div>
      </section>)}
    </div>
    <section className={s.confirmationSequence} aria-label="가치 확정 순서">
      <div><span>자료 대사</span><b>시장·회사 근거 연결</b><small>관측일·출처·연결 범위 통일</small></div>
      <div><span>현금흐름 확정</span><b>평가기준일 이후 잔여 FCFF</b><small>현금세금·상각·재투자·운전자본</small></div>
      <div><span>가치·지분 확정</span><b>EV·주주가치의 1차 산출</b><small>주당 가격·IRR: 지분·계약조건 확인</small></div>
    </section>
    <p className={s.note}>기준일 이후 정보의 소급 적용 제외 · 과거 자료의 발표·관측일 명시 · 상세 출처·시장 링크·가정·계산 근거: 별도 가치추정 분석서</p>
  </div>
}

export const evidenceLayouts: Partial<Record<string, ReactNode>> = {
  competitors: <Competitors />,
  'full-pl': <FullIncomeStatement />,
  'wacc-build': <WaccBuild />,
  fcff: <FcffBuild />,
  'tv-sensitivity': <TvSensitivity />,
  register: <EvidenceRegister />,
}
