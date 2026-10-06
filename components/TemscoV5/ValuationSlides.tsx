import type { ReactNode } from 'react'
import data from './valuationData.json'
import { baseValuation as base, calculateValuation, scenarioValuations, investmentEffect, labels, type EntityValuation } from './valuationModel'
import { baseWacc, ncwcRatio, developmentRatio } from './valuationInputs'
import ValuationSlideFrame from './ValuationSlideFrame'
import { shareCapital, baseShareValues, basicShareBasis } from './shareCapitalModel'

const f = (n: number | null, digits = 2) => n === null ? '산정 보류' : n.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const gap = (multiple: number | null, dcf: number) => multiple === null ? '산정 보류' : `${multiple - dcf >= 0 ? '+' : ''}${f(multiple - dcf)}`
const pct = (n: number, digits = 2) => `${f(n * 100, digits)}%`
const navy = '#0f2746', blue = '#2563eb', teal = '#0891b2', gold = '#b7791f'
export type ValuationSlideKind = 'overview' | 'source' | 'assumptions' | 'parent-fcff' | 'consolidated-fcff' | 'terminal' | 'methods' | 'scenarios' | 'sensitivity' | 'equity' | 'investment'
function Frame({ title, subtitle, children, note, dense = false, sectionLabel = '06 / VALUATION & CAPITAL STRUCTURE' }: { title: string; subtitle: string; children: ReactNode; note: ReactNode; dense?: boolean; sectionLabel?: string }) {
  return <ValuationSlideFrame title={title} section={sectionLabel} subtitle={subtitle} unit="단위: 억 원" bodyClassName={dense ? 'gap-3' : 'gap-4'} notes={note}>{children}</ValuationSlideFrame>
}
function Table({ headers, rows, compact = false, tight = false }: { headers: string[]; rows: { label: string; values: ReactNode[]; strong?: boolean }[]; compact?: boolean; tight?: boolean }) {
  return <table className={`w-full border-collapse tabular-nums ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
    <thead><tr className="bg-slate-100 border-y border-slate-300 text-slate-600">{headers.map((h, i) => <th key={i} className={`${i ? 'text-right' : 'text-left'} px-3 ${compact || tight ? 'py-2' : 'py-3'} font-bold`}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i} className={`border-b border-slate-200 ${r.strong ? 'bg-blue-50 text-blue-800 font-bold border-blue-200' : ''}`}><th className={`text-left font-medium px-3 ${compact ? 'py-1' : tight ? 'py-2' : 'py-2.5'}`}>{r.label}</th>{r.values.map((v, j) => <td key={j} className="text-right px-3">{v}</td>)}</tr>)}</tbody>
  </table>
}
function Note({ title, children }: { title: string; children: ReactNode }) { return <div className="border-l-[3px] border-blue-500 pl-4 py-1"><h3 className="text-[14px] font-bold mb-1">{title}</h3><div className="text-[12px] leading-[1.65] text-slate-600">{children}</div></div> }
function Stat({ label, value, detail, color = blue }: { label: string; value: string; detail: string; color?: string }) { return <div className="border-t-[3px] pt-4" style={{ borderColor: color }}><p className="text-[13px] font-bold">{label}</p><p className="text-[43px] font-black tabular-nums my-1" style={{ color }}>{value}<span className="text-[17px] ml-1">억</span></p><p className="text-[11px] text-slate-500">{detail}</p></div> }
const sourceFoot = '재무자료: 연결 손익·재무상태표·양사 추정손익 및 설비투자 계획 / 2024~2025 실적, 2026~2030 사업계획 / 최종 표시만 반올림'
const terminalFoot = '2031년 이후 가정: 2030년말 손익에 이익률 상한·반복 개발비 반영 · 운영유지 재투자 지속'
const baseFoot = '평가기준일 2026.09.13 / 2026~2030 5개 연도 · 2026 잔여 109/365, 연말 할인 / g=0 (무성장모형 채택)'
const valueScopes = ['parent', 'subsidiary', 'consolidated'] as const
const valueLabels = { parent: '템스코 개별 기업가치', subsidiary: '위폼스 개별 기업가치', consolidated: '연결 기업가치' }
const lastRow = (valuation: EntityValuation) => valuation.rows[valuation.rows.length - 1]
const terminalYear = base.parent.terminalYear
const stableYear = base.parent.terminalCashFlowYear
function EnterpriseValueBridge({ valuation }: { valuation: EntityValuation }) {
  return <div className="shrink-0 bg-slate-900 text-white px-5 py-2" data-fcff-value-bridge>
    <div className="grid grid-cols-[1fr_28px_1.1fr_28px_1fr] gap-3 items-center">
      <div><p className="text-[11px] text-slate-300">추정기간 FCFF 현재가치</p><p className="text-[26px] leading-tight font-black tabular-nums mt-1">{f(valuation.pvExplicit)}<span className="text-[12px] ml-1">억</span></p></div>
      <span className="text-[22px] text-slate-400 text-center">+</span>
      <div><p className="text-[11px] text-slate-300">{terminalYear}말 잔여가치의 현재가치</p><p className="text-[26px] leading-tight font-black tabular-nums mt-1 text-cyan-300">{f(valuation.pvTerminal)}<span className="text-[12px] ml-1">억</span></p></div>
      <span className="text-[22px] text-slate-400 text-center">=</span>
      <div><p className="text-[11px] text-blue-200">전체 영업가치 EV</p><p className="text-[28px] leading-tight font-black tabular-nums mt-1 text-blue-200">{f(valuation.ev)}<span className="text-[12px] ml-1">억</span></p></div>
    </div>
    <p className="text-[11px] text-slate-300 mt-1 pt-1 border-t border-slate-700">미할인 TV {f(valuation.terminalValue)}억 × 할인계수 {f(lastRow(valuation).discountFactor, 6)} / {stableYear}년 이후 추정 FCFF ÷ WACC / 합계: 반올림 전 / 순차입금·NCI 차감 전</p>
  </div>
}
function Fcff({ entity }: { entity: 'parent' | 'consolidated' }) {
  const v = base[entity], rs = v.rows
  const rows = [
    { label: '매출액 · 사업계획', values: rs.map(x => f(x.revenue)) },
    { label: '영업이익 · 사업계획', values: rs.map(x => f(x.sourceEbit)) },
    { label: '+ 기존 감가상각 제거 대용치', values: rs.map(x => f(x.daRemovedProxy)) },
    { label: '− 자산군·개발비 모델 상각', values: rs.map(x => f(x.modeledDa)) },
    { label: '= 영업이익(상각 조정 후) · 연간', values: rs.map(x => f(x.ebit)), strong: true },
    { label: '− 영업이익 기준 법인세', values: rs.map(x => f(x.operatingTax)) },
    { label: '= NOPAT · 연간', values: rs.map(x => f(x.nopat)) },
    { label: '+ 모델 D&A · 연간', values: rs.map(x => f(x.modeledDa)) },
    { label: '− 유지투자 / 개발비 · 연간', values: rs.map(x => `${f(x.maintenance)} / ${f(x.development)}`) },
    { label: '운영현금흐름 적용 기간', values: rs.map(x => x.year === 2026 ? '109/365' : '1년') },
    { label: '− 성장 CAPEX · 평가기간', values: rs.map(x => f(x.growthCapex)) },
    { label: '− Δ운전자본 · 평가기간', values: rs.map(x => f(x.deltaNwc)) },
    { label: '= FCFF · 평가기간', values: rs.map(x => f(x.fcff)), strong: true },
    { label: '할인계수 / 현재가치', values: rs.map(x => `${f(x.discountFactor, 4)} / ${f(x.pv)}`) },
  ]
  return <Frame dense title={`${labels[entity]} 추정손익 및 FCFF`} subtitle="중도안 · 2026~2030 사업계획 5개 연도 · 2026 잔여기간 적용 · 2030말 이후 영구무성장 잔여가치" note={<>{sourceFoot}<br/>{terminalFoot}<br/>{entity === 'consolidated' ? baseFoot : baseFoot} / 2026 성장 CAPEX 전액 미집행 가정<br/>FCFF = (NOPAT+D&A−유지투자−개발비)×기간−성장투자−ΔNWC / 영업가치 = 추정기간 PV + 잔여가치 PV</>}>
    <Table compact headers={['항목', ...rs.map(x => `${x.year}E${x.year === 2026 ? ' / 잔여' : ''}`)]} rows={rows}/>
    <EnterpriseValueBridge valuation={v}/>
  </Frame>
}
export default function ValuationSlide({ kind }: { kind: ValuationSlideKind }) {
  if (kind === 'parent-fcff' || kind === 'consolidated-fcff') return <Fcff entity={kind === 'parent-fcff' ? 'parent' : 'consolidated'}/>
  if (kind === 'overview') return <Frame title="개별·연결 기업가치 비교" subtitle="중도안 · FCFF 현재가치 기준 기업가치 · 순차입금 차감 전" note={null}>
    <div className="flex flex-1 flex-col justify-between gap-6 pt-3 pb-3" data-value-overview>
      <div className="grid grid-cols-3 gap-7">{valueScopes.map((entity, i) => <div key={entity} data-value-scope={entity} data-value-metric="ev"><Stat label={entity === 'consolidated' ? '그룹 전체 기업가치 · 연결' : valueLabels[entity]} value={f(base[entity].ev)} detail={entity === 'consolidated' ? '양사 영업현금흐름 합산 · 내부거래 조정' : '각 법인의 영업현금흐름 기준'} color={[navy, teal, blue][i]} /></div>)}</div>
      <div className="grid grid-cols-[1fr_24px_1fr_24px_1fr] items-center gap-4 bg-slate-50 border-y border-slate-200 px-6 py-5 text-center text-[15px] font-bold"><span>추정기간 FCFF 현재가치</span><span className="text-slate-400">+</span><span>잔여가치 현재가치</span><span className="text-slate-400">=</span><span className="text-blue-700">기업가치</span></div>
      <Table headers={['가치 산정 내역', ...valueScopes.map(entity => valueLabels[entity])]} rows={[
        {label:'2026–2030 FCFF 현재가치 합계',values:valueScopes.map(entity=>f(base[entity].pvExplicit))},
        {label:'2031년 이후 잔여가치 현재가치',values:valueScopes.map(entity=>f(base[entity].pvTerminal))},
        {label:'기업가치',values:valueScopes.map(entity=>f(base[entity].ev)),strong:true},
      ]}/>
      <div className="grid grid-cols-2 gap-7"><Note title="연결 기업가치의 산정 범위">위폼스 영업현금흐름 100% 포함 · 내부거래 조정<br/>75% 보유 효과: 투자 지분가치에서 비지배지분 25% 차감</Note><Note title="평가 가정과 시나리오">중도안 WACC {pct(baseWacc)} · 영구성장률 0%<br/>비관·중도·낙관 모두 동일한 세 가지 평가 범위 적용</Note></div>
    </div>
  </Frame>
  if (kind === 'source') return <Frame sectionLabel="별첨 A.1 / FINANCIAL SOURCE" title="재무자료 대사 및 평가 기준일" subtitle="사업계획 기준 · 원장 미확인 항목 · 평가 가정의 구분" note={<>재무자료: 연결 손익·재무상태표·양사 추정손익 및 설비투자 계획 / 2024~2025 실적 · 2026~2030 전망 / 표시 금액 반올림</>}>
    <Table headers={['2026E 손익', '템스코 별도', '위폼스 별도', '연결']} rows={[
      {label:'매출액',values: [base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].sourceRevenue))},
      {label:'영업이익',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].sourceEbit)),strong:true},
      {label:'제거 D&A · 확인치 + 대용치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].daRemovedProxy))},
      {label:'신규 모델 D&A',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].modeledDa))},
      {label:'영업이익(상각 조정 후)',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].ebit)),strong:true},
    ]}/>
    <div className="grid grid-cols-2 gap-x-8 gap-y-5 mt-2"><Note title="2025말 대차대조표 유지 가정">2026.09.13 순차입금: 별도 {f(base.parent.netDebt)}억 / 연결 {f(base.consolidated.netDebt)}억 대용<br/>기간 중 차입·현금·배당 변동 미반영</Note><Note title="제거 D&A의 제한">부모 제조상각: 2025 누계상각 증감 기반 대용치<br/>기존 무형상각 전체·PPA 내역 미확인</Note><Note title="연결 조정의 범위">2026 이후 제공 연결 영업이익 = 부모 + 자회사<br/>일회성 연결조정의 전망기간 반복 반영 제외</Note><Note title="지분가치 산정 기준">영구성장률 0% · 지정 평가모델 할인율<br/>영업가치에서 순차입금·비지배지분 차감</Note></div>
  </Frame>
  if (kind === 'assumptions') return <Frame sectionLabel="별첨 A.2 / REINVESTMENT ASSUMPTIONS" title="상각·재투자·운전자본 가정" subtitle="손익 추정기간: 2026~2030 사업계획 · 잔여가치: 2031년 이후 추정 FCFF·영구무성장" note={<>양사 재무상태표: 2025말 자산 / 양사 설비투자·감가상각 계획 / NYU Global Electronics 2026.01.05<br/>{terminalFoot}<br/>개발비 추가지출·상각기간·미집행률·유지투자 중복 0%: 분석 가정 / 회사 회계정책 또는 확정 투자집행 내역과 구분</>}>
    <div className="flex flex-1 flex-col justify-between gap-5 pt-2 pb-2 [&_tbody_th]:py-[7px]">
    <Table compact headers={['구분', '모델 입력', '적용 근거·판단']} rows={[
      {label:'기존 설비 / 신규 설비',values:['잔여 5년 / 내용연수 10년','정액법·잔존가치 0 · 신규 반기 상각']},
      {label:'건물 / 토지',values:['잔여·신규 40년 / 비상각','부모 건물 19.06억 · 토지 100.92억 기초']},
      {label:'기초 설비 순장부액',values:['부모 40.28억 / 위폼스 93.93억','2025말 유형자산 순장부액 기준']},
      {label:'성장 CAPEX · 2026→2030',values:['연결 112.50 / 16.50 / 5.00 / 0.00 / 0.00','2026 전액 미집행 · 2030 템스코 추가 성장투자 0 가정']},
      {label:'잔존기간 · 2031년 이후',values:['이익률 상한·반복 개발비 반영 · 영구성장률 0%','유지 CAPEX=D&A · 반복 개발비 · ΔNWC 0']},
      {label:'유지 CAPEX',values:['비개발 상각비 수준','성장투자와 대체·중복 0%의 보수적 가정']},
      {label:'R&D / 매출 · 산업 관측',values:[pct(data.market.industry.rdToRevenue),'Global Electronics 합계비율 · 국내 동종 평균 아님']},
      {label:'개발비 자산화 / 매출',values:[`${pct(developmentRatio)} = R&D 비율 × 20%`,'20% 별도 가정 · 사업계획 외 추가 현금지출']},
      {label:'개발비 상각',values:['5년 · 첫해 50% 상각','연결 외부매출 기준 지출 · 법인별 매출비중 배분']},
      {label:'비현금 운전자본 / 매출',values:[pct(ncwcRatio),'산업 합계비율 · 평가일 잔액은 2025~26 보간 대용']},
      {label:'영업이익에 대한 추정 법인세',values:['일반세율 누진 적용 · 지방세 포함','법인별 양의 영업이익에 과세 · NOL·상호결손 상계 제외']},
    ]}/>
    <div className="bg-amber-50 border-l-4 border-amber-500 px-4 py-3 text-[12px] leading-6"><b>현금흐름 검토 우선순위</b>　2026 투자 미집행액 → 실제 제조·무형상각 → 필요 운전자본 → 개발비 예산 중복 → 평가일 순차입금</div>
    </div>
  </Frame>
  if (kind === 'terminal') return <Frame title={`${stableYear}년 이후 손익 및 잔여가치 산정`} subtitle={`추정기간 종료 ${terminalYear}말 · ${stableYear}년 이후 추정 FCFF에 g=0 (무성장모형 채택) 적용 · 운영유지와 개발비 대체투자 지속`} note={<>{baseFoot}<br/>{terminalFoot}<br/>2029년 영업이익률 상한·개발비 상각액과 반복 지출액 일치: 분석 가정 / 연결 과세는 각 법인 세액 합산 / 성장 종료 시점의 사업 안정화 미확정</>}>
    <Table tight headers={['추정 손익 및 잔여가치', '템스코 별도', '위폼스 별도', '연결']} rows={[
      {label:`${terminalYear}E 영업이익(상각 조정 후)`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(lastRow(v).ebit))},
      {label:`${stableYear}년 이후 추정 영업이익`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalEbit)),strong:true},
      {label:`${stableYear}년 이후 추정 법인세`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalTax))},
      {label:`${stableYear}년 이후 추정 FCFF`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalFcff)),strong:true},
      {label:`${terminalYear}말 TV = FCFF ÷ ${pct(baseWacc)}`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalValue))},
      {label:'추정기간 FCFF 현재가치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.pvExplicit))},
      {label:'잔여가치 현재가치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.pvTerminal))},
      {label:'기업가치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.ev)),strong:true},
      {label:'기업가치 중 잔여가치 비중',values:[base.parent,base.subsidiary,base.consolidated].map(v=>pct(v.terminalShare))},
    ]}/>
    <div className="grid grid-cols-2 gap-7"><Note title={`${stableYear}년 이후 영업이익 산정`}>min({terminalYear} 영업이익(상각 조정 후) + 개발비 상각,<br/>{terminalYear} 매출 × 2029년 영업이익률)<br/>− 매년 반복 개발비 = {stableYear}년 이후 추정 영업이익</Note><Note title="무성장 재투자 균형">비개발 상각 = 유지 CAPEX / 개발비 상각 = 반복 개발비<br/>ΔNWC = 0 / 성장 CAPEX = 0<br/>이후 추정 FCFF = 법인세차감후영업이익(NOPAT)</Note></div>
  </Frame>
  if (kind === 'methods') return <Frame title="연결 기업가치의 DCF·배수 비교" subtitle="연결 기업가치 기준 · 동일 추정기간 FCFF에 잔여가치 평가방식만 변경" note={null}>
    <div className="flex flex-1 flex-col justify-between gap-5 pt-3 pb-3">
      <div className="grid grid-cols-2 gap-10"><Stat label="연결 기업가치 · DCF" value={f(base.consolidated.ev)} detail="2031년 이후 FCFF ÷ WACC"/><Stat label="연결 기업가치 · 배수 참고평가" value={f(base.consolidated.multipleEv)} detail="연결 외부매출 × 비교기업 평균 EV/Sales" color={teal}/></div>
      <Table headers={['연결가치 산정 내역','DCF','배수 참고평가']} rows={[
        {label:'추정기간 FCFF 현재가치',values:[f(base.consolidated.pvExplicit),f(base.consolidated.pvExplicit)]},
        {label:'잔여가치 현재가치',values:[f(base.consolidated.pvTerminal),f(base.consolidated.exitPvTerminal)]},
        {label:'연결 기업가치',values:[f(base.consolidated.ev),f(base.consolidated.multipleEv)],strong:true},
        {label:'DCF 대비 가치 차이',values:['—',gap(base.consolidated.multipleEv,base.consolidated.ev)]},
      ]}/>
      <div className="grid grid-cols-2 gap-7"><Note title="기업가치 기준의 일관성">요약·FCFF·시나리오의 연결가치 = DCF 기업가치<br/>배수 참고평가: 잔여가치의 시장가격 교차검토</Note><Note title="비교기업 선정 기준">핌스·풍원정밀 각 50% 단순평균<br/>영업적자로 EV/EBIT 적용 제외 · EV/Sales 활용</Note></div>
    </div>
  </Frame>
  if (kind === 'scenarios') return <Frame title="시나리오별 개별·연결 기업가치" subtitle="비관·중도·낙관의 사업 가정에 따른 기업가치 비교 · DCF 기준" note={null}>
    <div className="flex flex-1 flex-col justify-between gap-5 pt-3 pb-2" data-value-scenarios>
      <Table headers={['주요 가정',...scenarioValuations.map(v=>v.scenario.label)]} tight rows={[
        {label:'매출증분 실현율',values:scenarioValuations.map(v=>pct(v.scenario.growthCapture,0))},
        {label:'할인율(WACC)',values:scenarioValuations.map(v=>pct(v.scenario.wacc))},
        {label:'순운전자본 / 매출',values:scenarioValuations.map(v=>pct(ncwcRatio*v.scenario.nwcFactor))},
        {label:`${terminalYear}E 연결 매출 / 영업이익(상각 조정 후)`,values:scenarioValuations.map(v=>`${f(lastRow(v.consolidated).revenue)} / ${f(lastRow(v.consolidated).ebit)}`)},
      ]}/>
      <Table headers={['기업가치 · 억원',...scenarioValuations.map(v=>v.scenario.label)]} tight rows={[
        ...valueScopes.map(entity=>({label:valueLabels[entity],values:scenarioValuations.map(v=>f(v[entity].ev)),strong:true})),
        {label:'연결 기업가치 · 배수 참고평가',values:scenarioValuations.map(v=>f(v.consolidated.multipleEv))},
        {label:'배수 참고평가 − 연결 DCF',values:scenarioValuations.map(v=>gap(v.consolidated.multipleEv,v.consolidated.ev))},
      ]}/>
      <div className="grid grid-cols-3 gap-6">{scenarioValuations.map(v=><Note key={v.scenario.id} title={v.scenario.label}>{v.scenario.id==='downside'?'매출 전환 지연 · 운전자본 회수 지연':v.scenario.id==='base'?'사업계획 실현 · 기준 운전자본 적용':'고객 전환 가속 · 운전자본 효율 개선'}</Note>)}</div>
    </div>
  </Frame>
  if (kind === 'sensitivity') {
    const rates=[baseWacc-.015,baseWacc,baseWacc+.015], factors=[.8,1,1.2]
    return <Frame title="개별·연결 기업가치 민감도" subtitle="중도안 기준 · 할인율·2031년 이후 영업이익·남은 투자금액별 기업가치" note={null}>
      <div className="flex flex-1 flex-col justify-between gap-6 pt-3 pb-3" data-value-sensitivity>
        <div className="grid grid-cols-3 gap-5">{valueScopes.map(entity=><div key={entity}><h3 className="text-[15px] font-bold mb-3">{valueLabels[entity]}</h3><p className="text-[11px] text-slate-500 mb-2">WACC / 이후 영업이익 적용비율</p><Table headers={['WACC','80%','100%','120%']} compact rows={rates.map(rate=>({label:pct(rate),strong:rate===baseWacc,values:factors.map(factor=>f(calculateValuation('base',{wacc:rate,terminalProfitFactor:factor})[entity].ev))}))}/></div>)}</div>
        <div><h3 className="text-[15px] font-bold mb-3">2026년 남은 투자금액에 따른 기업가치</h3><Table headers={['기업가치','남은 투자 0%','남은 투자 50%','남은 투자 100% · 중도안']} rows={valueScopes.map(entity=>({label:valueLabels[entity],values:[0,.5,1].map(x=>f(calculateValuation('base',{remainingGrowthCapexFraction:x})[entity].ev)),strong:entity==='consolidated'}))}/></div>
        <div className="grid grid-cols-2 gap-7"><Note title="기업가치 비교 기준">중앙값: 중도안 WACC {pct(baseWacc)} · 영업이익 100%<br/>요약·FCFF·시나리오 중도안과 동일한 기업가치</Note><Note title="남은 투자금액의 의미">2026년 성장투자 계획 중 평가일 이후 지출할 금액의 비율<br/>100%: 전액 지출 예정 / 0%: 추가 지출 없음<br/>평가일 현금·차입금과 매출 가정은 동일하게 적용</Note></div>
      </div>
    </Frame>
  }
  if (kind === 'equity') return <Frame title="투자 지분가치 및 위폼스 보유지분 반영" subtitle="그룹 전체 기업가치에서 순차입금과 비지배지분을 차감한 템스코 주주귀속 가치" note={<>{baseFoot}<br/>순차입금: 2025말 잔액 대용 · 비영업자산·우선청구권 추가 조정 0 가정 · 비지배지분은 위폼스 지분가치 기준<br/>위폼스 지분가치 음수 시 유한책임 하한 0 · 계속지원 의무 미반영</>}>
    <div className="flex flex-1 flex-col justify-between gap-5 pt-2 pb-2" data-owner-equity-bridge>
      <Table headers={['기업가치에서 투자 지분가치로의 연결','중도안 · 억원']} rows={[
        {label:'그룹 전체 기업가치 · 연결 FCFF',values:[f(base.consolidated.ev)]},
        {label:'− 연결 순차입금',values:[f(base.consolidated.netDebt)]},
        {label:'− 위폼스 비지배지분 가치 · 25%',values:[f(base.nci)]},
        {label:'= 템스코 주주귀속 지분가치',values:[f(base.consolidatedEquity)],strong:true},
      ]}/>
      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-7 items-start">
        <Note title="위폼스 전체 지분가치">기업가치 {f(base.subsidiary.ev)}억<br/>− 순차입금 {f(base.subsidiary.netDebt)}억<br/><b className="text-slate-800">= {f(base.subsidiaryEquity)}억</b></Note>
        <Stat label="템스코 보유지분 · 75%" value={f(base.parentHolding)} detail="그룹 기업가치에 포함된 보유지분" color={teal}/>
        <Stat label="비지배지분 · 25%" value={f(base.nci)} detail="템스코 주주귀속 가치 산정 시 차감" color={gold}/>
      </div>
      <section data-share-capital-table><Table compact headers={['주식 현황 및 주당 지분가치','템스코','위폼스']} rows={[
        {label:'액면가 / 발행주식수',values:[`${f(shareCapital.parent.parValueKRW,0)}원 / ${f(shareCapital.parent.issuedShares,0)}주`,`${f(shareCapital.subsidiary.parValueKRW,0)}원 / ${f(shareCapital.subsidiary.issuedShares,0)}주`]},
        {label:'주당 지분가치 · 원',values:[f(baseShareValues.consolidatedOwner,0),f(baseShareValues.subsidiary,0)],strong:true},
        {label:'잠재주식 · CB·BW·주식선택권 등',values:['− (없음)','− (없음)']},
      ]}/><p className="mt-2 text-[10px] leading-relaxed text-slate-500" data-share-basis>{basicShareBasis} · 템스코: 연결 주주귀속 지분가치 ÷ 발행주식수</p></section>
    </div>
  </Frame>
  const g=investmentEffect('consolidated')
  const change = (value: number, digits = 2) => `${value > 0 ? '+' : ''}${f(value, digits)}`
  return <Frame title="70억 원 투자 유치 및 자본구조 변화" subtitle="2025말 연결 재무상태표에 보통주 유상증자 70억 즉시 반영 / 비용·상환·영업손익·투자집행 전 비교" note={<>{baseFoot}<br/>증자대금 70억·발행비용 0·현금 유입·부채 유지 가정 / RCPS 회계분류 미확정 / Post-money = Pre-money + 유입액 / 운영 EV에 증자액 가산 제외</>}>
    <div className="flex flex-1 min-h-0 flex-col justify-between gap-5 pt-3 pb-3">
    <Table compact headers={['재무 항목','연결 투자 전','연결 투자 후','증감']} rows={[
      {label:'자산',values:[f(g.assets),f(g.assetsAfter),change(g.assetsAfter-g.assets)]},
      {label:'현금',values:[f(g.cash),f(g.cashAfter),change(g.cashAfter-g.cash)]},
      {label:'부채 총계',values:[f(g.liabilities),f(g.liabilities),change(0)]},
      {label:'자본 총계',values:[f(g.equity),f(g.equityAfter),change(g.equityAfter-g.equity)],strong:true},
      {label:'순차입금',values:[f(g.netDebt),f(g.netDebtAfter),change(g.netDebtAfter-g.netDebt)]},
      {label:'부채 / 자본',values:[pct(g.debtRatioBefore,1),pct(g.debtRatioAfter,1),`${change((g.debtRatioAfter-g.debtRatioBefore)*100,1)}%p`]},
    ]}/>
    <div className="grid grid-cols-2 gap-9" data-investment-equity>
      <section className="border-t-[3px] border-slate-400 pt-3" aria-label="평가모형에 따른 투자 조건 참고값">
        <h3 className="text-[13px] font-bold mb-1">DCF 평가모형 기준 · 프리미엄 미반영</h3>
        <dl className="text-[13px] leading-5">
          <div className="flex justify-between gap-3 border-b border-slate-200 py-1"><dt>투자 전 주주지분가치 · Pre-money</dt><dd className="font-bold tabular-nums">{f(g.preMoney)}억</dd></div>
          <div className="flex justify-between gap-3 border-b border-slate-200 py-1"><dt>신규 투자금액</dt><dd className="font-bold tabular-nums">{f(g.capital)}억</dd></div>
          <div className="flex justify-between gap-3 border-b border-slate-200 py-1"><dt>투자 후 주주지분가치 · Post-money</dt><dd className="font-bold tabular-nums">{f(g.postMoney)}억</dd></div>
        </dl>
        <p className="text-[11px] text-slate-500 mt-1">보통주·동일 주당가격·전액 신주 투자 가정</p>
      </section>
      <section className="border-t-[3px] border-blue-600 pt-3" aria-label="프리미엄 및 투자 조건 협의" data-investment-negotiation>
        <h3 className="text-[13px] font-bold">프리미엄 및 투자 조건 협의</h3>
        <p className="text-[22px] font-bold text-blue-800 mt-1 mb-1">최종 지분율은 협의 후 확정</p>
        <div className="bg-blue-50 border-l-2 border-blue-400 px-3 py-2 text-[12px] leading-6">
          <p>협의 투자 전 지분가치 = DCF 기준 지분가치 + 협의 프리미엄</p>
          <p>신규 지분율 = {f(g.capital,0)}억 ÷ (협의 투자 전 지분가치 + {f(g.capital,0)}억)</p>
        </div>
        <p className="text-[12px] leading-5 text-slate-600 mt-1">평가에 미반영된 기술·사업가치 등을 근거로 추가 프리미엄 제안<br/>프리미엄·발행가액·최종 지분율은 실사 및 투자계약을 통해 확정</p>
      </section>
    </div>
    <Note title="후속 조달·집행 계획의 연계">연결 2026 잔여 FCFF {f(base.consolidated.rows[0].fcff)}억 / 70억 조달 후 FCFF상 차액 {f(-base.consolidated.rows[0].fcff-70)}억 · 금융비용·차입상환 전<br/>보유현금·차입 여력·CAPEX 이연 대사 후 Series A/B/C 시점·규모 결정 / 확정 후속 투자금의 선반영 제외</Note>
    </div>
  </Frame>
}
