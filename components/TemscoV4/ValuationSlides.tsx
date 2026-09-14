import type { ReactNode } from 'react'
import data from './valuationData.json'
import { baseValuation as base, calculateValuation, scenarioValuations, investmentEffect, labels, type EntityValuation } from './valuationModel'
import { baseWacc, ncwcRatio, developmentRatio } from './valuationInputs'

const f = (n: number | null, digits = 2) => n === null ? '산정 보류' : n.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const gap = (multiple: number | null, dcf: number) => multiple === null ? '산정 보류' : `${multiple - dcf >= 0 ? '+' : ''}${f(multiple - dcf)}`
const pct = (n: number, digits = 2) => `${f(n * 100, digits)}%`
const navy = '#0f2746', blue = '#2563eb', teal = '#0891b2', gold = '#b7791f'
export type ValuationSlideKind = 'overview' | 'source' | 'assumptions' | 'parent-fcff' | 'consolidated-fcff' | 'terminal' | 'methods' | 'scenarios' | 'sensitivity' | 'equity' | 'investment'
function Frame({ title, subtitle, children, note, dense = false, sectionLabel = '05 / VALUATION & CAPITAL STRUCTURE' }: { title: string; subtitle: string; children: ReactNode; note: ReactNode; dense?: boolean; sectionLabel?: string }) {
  return <div className={`h-full bg-white text-slate-800 flex flex-col ${dense ? 'px-10 py-8' : 'p-10'}`} data-valuation-panel>
    <div className={`flex items-center justify-between text-[10px] font-bold tracking-[0.18em] text-blue-600 ${dense ? 'mb-1' : 'mb-4'}`}><span>{sectionLabel}</span><span className="text-amber-700 tracking-normal">가정 기반 1차 평가 · 단위: 억 원</span></div>
    <h2 className={`text-[29px] font-black tracking-tight whitespace-nowrap ${dense ? 'leading-[1.2]' : ''}`} style={{ color: navy }}>{title}</h2>
    <p className={`text-[12px] text-slate-500 border-b border-slate-200 ${dense ? 'mt-1 mb-3 pb-2' : 'mt-2 mb-5 pb-4'}`}>{subtitle}</p>
    <div data-valuation-body className={`flex-1 min-h-0 flex flex-col ${dense ? 'gap-3' : 'gap-4'}`}>{children}</div>
    <div data-valuation-notes className={`shrink-0 text-[10px] leading-[1.55] text-slate-500 border-t border-slate-200 pr-8 ${dense ? 'pt-2 mt-2' : 'pt-3 mt-4'}`}>{note}</div>
  </div>
}
function Table({ headers, rows, compact = false, tight = false }: { headers: string[]; rows: { label: string; values: ReactNode[]; strong?: boolean }[]; compact?: boolean; tight?: boolean }) {
  return <table className={`w-full border-collapse tabular-nums ${compact ? 'text-[11px]' : 'text-[13px]'}`}>
    <thead><tr style={{ backgroundColor: navy }} className="text-white">{headers.map((h, i) => <th key={i} className={`${i ? 'text-right' : 'text-left'} px-3 ${compact || tight ? 'py-2' : 'py-3'} font-bold`}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i} className={`border-b border-slate-200 ${r.strong ? 'bg-blue-50 text-blue-900 font-bold' : i % 2 ? 'bg-slate-50/60' : ''}`}><th className={`text-left font-medium px-3 ${compact ? 'py-1' : tight ? 'py-2' : 'py-2.5'}`}>{r.label}</th>{r.values.map((v, j) => <td key={j} className="text-right px-3">{v}</td>)}</tr>)}</tbody>
  </table>
}
function Note({ title, children }: { title: string; children: ReactNode }) { return <div className="border-l-[3px] border-blue-500 pl-4 py-1"><h3 className="text-[14px] font-bold mb-1">{title}</h3><div className="text-[12px] leading-[1.65] text-slate-600">{children}</div></div> }
function Stat({ label, value, detail, color = blue }: { label: string; value: string; detail: string; color?: string }) { return <div className="border-t-[3px] pt-4" style={{ borderColor: color }}><p className="text-[13px] font-bold">{label}</p><p className="text-[43px] font-black tabular-nums my-1" style={{ color }}>{value}<span className="text-[17px] ml-1">억</span></p><p className="text-[11px] text-slate-500">{detail}</p></div> }
const sourceFoot = '회사 재무: 회사 제공 연결 손익·재무상태표·양사 추정손익 및 설비투자 계획 / 2024~2025 회사 제공 과거자료, 2026~2029 회사 계획 / 최종 표시만 반올림'
const terminalFoot = '2030 이후 정상상태 가정: 2029말 손익 정상화·반복 재투자 유지'
const baseFoot = '평가기준일 2026.09.13 / 2026~2029 4개 연도 · 2026 잔여 109/365, 연말 할인 / 2025말 순차입금 유지 대용 / g=0 / 보유지분 75%·NCI 25%: 회사 제공'
const lastRow = (valuation: EntityValuation) => valuation.rows[valuation.rows.length - 1]
const terminalYear = base.parent.terminalYear
const stableYear = base.parent.terminalCashFlowYear
function EnterpriseValueBridge({ valuation }: { valuation: EntityValuation }) {
  return <div className="shrink-0 bg-slate-900 text-white px-5 py-2" data-fcff-value-bridge>
    <div className="grid grid-cols-[1fr_28px_1.1fr_28px_1fr] gap-3 items-center">
      <div><p className="text-[11px] text-slate-300">명시기간 FCFF 현재가치</p><p className="text-[26px] leading-tight font-black tabular-nums mt-1">{f(valuation.pvExplicit)}<span className="text-[12px] ml-1">억</span></p></div>
      <span className="text-[22px] text-slate-400 text-center">+</span>
      <div><p className="text-[11px] text-slate-300">{terminalYear}말 잔여가치의 현재가치</p><p className="text-[26px] leading-tight font-black tabular-nums mt-1 text-cyan-300">{f(valuation.pvTerminal)}<span className="text-[12px] ml-1">억</span></p></div>
      <span className="text-[22px] text-slate-400 text-center">=</span>
      <div><p className="text-[11px] text-blue-200">전체 영업가치 EV</p><p className="text-[28px] leading-tight font-black tabular-nums mt-1 text-blue-200">{f(valuation.ev)}<span className="text-[12px] ml-1">억</span></p></div>
    </div>
    <p className="text-[11px] text-slate-300 mt-1 pt-1 border-t border-slate-700">미할인 TV {f(valuation.terminalValue)}억 × 할인계수 {f(lastRow(valuation).discountFactor, 6)} / {stableYear} 정상 FCFF ÷ WACC / 합계: 반올림 전 / 순차입금·NCI 차감 전</p>
  </div>
}
function ComparisonBars({ pairs }: { pairs: { label: string; dcf: number; multiple: number | null }[] }) {
  const maximum = Math.max(...pairs.flatMap(x => x.multiple === null ? [x.dcf] : [x.dcf, x.multiple])) * 1.18
  return <svg viewBox={`0 0 1000 ${pairs.length * 112 + 30}`} className="w-full" role="img" aria-label="동일 기준 DCF와 출구배수법의 가치 비교">
    {pairs.map((x, i) => <g key={x.label} transform={`translate(0,${i * 112})`}><text x="0" y="32" fontSize="16" fontWeight="700" fill={navy}>{x.label}</text><rect x="182" y="10" width={Math.max(0, x.dcf) / maximum * 720} height="29" fill={blue} /><text x={190 + Math.max(0, x.dcf) / maximum * 720} y="31" fontSize="15" fill={blue}>{f(x.dcf)}</text>{x.multiple === null ? <><text x="182" y="70" fontSize="15" fill="#b7791f">OMM 비교기업 배수 확인 후 산정</text><text x="182" y="100" fontSize="12" fill="#64748b">배수 가치·DCF 대비 격차 산정 보류</text></> : <><rect x="182" y="49" width={Math.max(0, x.multiple) / maximum * 720} height="29" fill={teal}/><text x={190 + Math.max(0, x.multiple) / maximum * 720} y="70" fontSize="15" fill={teal}>{f(x.multiple)}</text><text x="182" y="100" fontSize="12" fill="#64748b">DCF 대비 차이 {gap(x.multiple,x.dcf)}억 / {pct(x.multiple / x.dcf - 1)}</text></>}</g>)}
  </svg>
}
function Fcff({ entity }: { entity: 'parent' | 'consolidated' }) {
  const v = base[entity], rs = v.rows
  const rows = [
    { label: '매출액 · 회사계획', values: rs.map(x => f(x.revenue)) },
    { label: '영업이익 · 회사계획', values: rs.map(x => f(x.sourceEbit)) },
    { label: '+ 기존 감가상각 제거 대용치', values: rs.map(x => f(x.daRemovedProxy)) },
    { label: '− 자산군·개발비 모델 상각', values: rs.map(x => f(x.modeledDa)) },
    { label: '= 평가용 EBIT · 연간', values: rs.map(x => f(x.ebit)), strong: true },
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
  return <Frame dense title={`${labels[entity]} 추정손익 및 FCFF`} subtitle="중도안 · 2026~2029 회사계획 4개 연도 · 2026 잔여기간 적용 · 2029말 이후 영구무성장 잔여가치" note={<>{sourceFoot}<br/>{terminalFoot}<br/>{baseFoot} / 2026 성장 CAPEX 전액 미집행 가정<br/>FCFF = (NOPAT+D&A−유지투자−개발비)×기간−성장투자−ΔNWC / 영업가치 = 명시기간 PV + 잔여가치 PV</>}>
    <Table compact headers={['항목', ...rs.map(x => `${x.year}E${x.year === 2026 ? ' / 잔여' : ''}`)]} rows={rows}/>
    <EnterpriseValueBridge valuation={v}/>
  </Frame>
}
export default function ValuationSlide({ kind }: { kind: ValuationSlideKind }) {
  if (kind === 'parent-fcff' || kind === 'consolidated-fcff') return <Fcff entity={kind === 'parent-fcff' ? 'parent' : 'consolidated'}/>
  if (kind === 'overview') return <Frame title="기업가치 평가 체계 및 지분가치 비교" subtitle="별도·연결 DCF 및 보유지분을 반영한 기업가치 비교" note={<>{baseFoot}<br/>신규 투자 유입 전 가치 / 순차입금·운전자본·상각 대용치 반영 참고평가 / 공정가치 확정 또는 투자조건 제시와 구분</>}>
    <div className="grid grid-cols-2 gap-12"><Stat label="연결 DCF · 지배주주 지분가치" value={f(base.consolidatedEquity)} detail="그룹 영업가치 − 그룹 순차입금 − 위폼스 비지배지분"/><Stat label="별도 DCF + 위폼스 75% · SOTP" value={f(base.parentSotp)} detail="템스코 영업가치 − 별도 순차입금 + 위폼스 보유지분" color={teal}/></div>
    <svg viewBox="0 0 1000 208" className="w-full mt-2" role="img" aria-label="템스코의 위폼스 보유지분 75% 및 연결 가치 산출 체계"><defs><marker id="v4ownershiparrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10" fill={blue}/></marker></defs><rect x="10" y="20" width="275" height="132" rx="5" fill={navy}/><text x="35" y="53" fill="#93c5fd" fontSize="13">PARENT / STANDALONE</text><text x="35" y="89" fill="white" fontSize="24" fontWeight="800">템스코 영업 EV</text><text x="35" y="127" fill="white" fontSize="27">{f(base.parent.ev)}억</text><line x1="287" y1="78" x2="570" y2="78" stroke={blue} strokeWidth="3" markerEnd="url(#v4ownershiparrow)"/><text x="365" y="63" fontSize="19" fontWeight="800" fill={blue}>보유지분 75%</text><text x="342" y="108" fontSize="12" fill="#64748b">지분가치 {f(base.parentHolding)}억</text><rect x="584" y="20" width="300" height="132" rx="5" fill="#eff6ff" stroke="#93c5fd"/><text x="608" y="53" fill={teal} fontSize="13">SUBSIDIARY / 100% VALUE</text><text x="608" y="89" fill={navy} fontSize="24" fontWeight="800">위폼스 지분가치</text><text x="608" y="127" fill={navy} fontSize="27">{f(base.subsidiaryEquity)}억</text><text x="10" y="190" fill="#64748b" fontSize="14">연결 FCFF: 위폼스 100% 포함 / 연결 지분가치: 비지배지분 25% ({f(base.nci)}억) 차감</text></svg>
    <div className="grid grid-cols-2 gap-7"><Note title={`평가 범위 차이 ${f(base.scopeGap)}억`} >내부거래 운전자본 제거에 따른 차이<br/>별도·연결 지분율 조정의 동일 기준 적용</Note><Note title="기업가치 평가 구성">재무자료·평가기준일 → FCFF·할인율 → 잔여가치<br/>시장배수 교차검토 → 민감도 → 70억 증자 효과</Note></div>
  </Frame>
  if (kind === 'source') return <Frame sectionLabel="별첨 A.1 / FINANCIAL SOURCE" title="재무 원본 대사 및 평가 기준일" subtitle="원본 회사계획 · 원장 미확인 항목 · 평가 가정의 구분" note={<>{sourceFoot}</>}>
    <Table headers={['2026E 손익 원본', '템스코 별도', '위폼스 별도', '연결']} rows={[
      {label:'매출액',values: [base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].sourceRevenue))},
      {label:'회사 영업이익',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].sourceEbit)),strong:true},
      {label:'제거 D&A · 확인치 + 대용치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].daRemovedProxy))},
      {label:'신규 모델 D&A',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].modeledDa))},
      {label:'평가용 EBIT',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.rows[0].ebit)),strong:true},
    ]}/>
    <div className="grid grid-cols-2 gap-x-8 gap-y-5 mt-2"><Note title="2025말 대차대조표 유지 가정">2026.09.13 순차입금: 별도 {f(base.parent.netDebt)}억 / 연결 {f(base.consolidated.netDebt)}억 대용<br/>기간 중 차입·현금·배당 변동 미반영</Note><Note title="제거 D&A의 제한">부모 제조상각: 2025 누계상각 증감 기반 대용치<br/>기존 무형상각 전체·PPA 내역 미확인</Note><Note title="연결 조정의 범위">2026 이후 제공 연결 영업이익 = 부모 + 자회사<br/>일회성 연결조정의 전망기간 반복 반영 제외</Note><Note title="지분가치 산정 기준">영구성장률 0% · 시장지표 기반 할인율<br/>영업가치에서 순차입금·비지배지분 차감</Note></div>
  </Frame>
  if (kind === 'assumptions') return <Frame sectionLabel="별첨 A.3 / REINVESTMENT ASSUMPTIONS" title="상각·재투자·운전자본 가정" subtitle="명시 추정: 2026~2029 회사계획 · 잔여가치: 2030 이후 정상 FCFF·영구무성장" note={<>양사 재무상태표: 2025말 자산 / 양사 설비투자·감가상각 계획 / NYU Global Electronics 2026.01.05<br/>{terminalFoot}<br/>개발비 추가지출·상각기간·미집행률·유지투자 중복 0%: 분석 가정 / 회사 회계정책 또는 확정 투자집행 내역과 구분</>}>
    <Table compact headers={['구분', '모델 입력', '적용 근거·판단']} rows={[
      {label:'기존 설비 / 신규 설비',values:['잔여 5년 / 내용연수 10년','정액법·잔존가치 0 · 신규 반기 상각']},
      {label:'건물 / 토지',values:['잔여·신규 40년 / 비상각','부모 건물 19.06억 · 토지 100.92억 기초']},
      {label:'기초 설비 순장부액',values:['부모 40.28억 / 위폼스 93.93억','2025말 유형자산 순장부액 기준']},
      {label:'성장 CAPEX · 2026→2029',values:['연결 112.50 / 16.50 / 5.00 / 0.00','원본 연간계획 · 2026 전액 미집행 가정']},
      {label:'잔존기간 · 2030년 이후',values:['2029말 손익 정상화 · 영구성장률 0%','유지 CAPEX=D&A · 반복 개발비 · ΔNWC 0']},
      {label:'유지 CAPEX',values:['비개발 상각비 수준','성장투자와 대체·중복 0%의 보수적 가정']},
      {label:'R&D / 매출 · 산업 관측',values:[pct(data.market.industry.rdToRevenue),'Global Electronics 합계비율 · 국내 동종 평균 아님']},
      {label:'개발비 자산화 / 매출',values:[`${pct(developmentRatio)} = R&D 비율 × 20%`,'20% 별도 가정 · 회사계획 외 추가 현금지출']},
      {label:'개발비 상각',values:['5년 · 첫해 50% 상각','연결 외부매출 기준 지출 · 법인별 매출비중 배분']},
      {label:'비현금 운전자본 / 매출',values:[pct(ncwcRatio),'산업 합계비율 · 평가일 잔액은 2025~26 보간 대용']},
      {label:'NOPAT 법인세',values:['일반세율 누진 적용 · 지방세 포함','법인별 양의 EBIT에 과세 · NOL·상호결손 상계 제외']},
    ]}/>
    <div className="bg-amber-50 border-l-4 border-amber-500 px-4 py-3 text-[12px] leading-6"><b>현금흐름 검토 우선순위</b>　2026 투자 미집행액 → 실제 제조·무형상각 → 정상 운전자본 → 개발비 예산 중복 → 평가일 순차입금</div>
  </Frame>
  if (kind === 'terminal') return <Frame title="무성장 잔여가치 및 정상 이익" subtitle={`명시 추정 종료 ${terminalYear}말 · ${stableYear} 정상 FCFF부터 g=0 · 운영유지와 개발비 대체투자 지속`} note={<>{baseFoot}<br/>{terminalFoot}<br/>2028 회사 영업이익률 상한·개발비 완전상각 정상화: 분석가 가정 / 연결 과세는 각 법인 세액 합산 / 성장 종료 시점의 사업 안정화 미확정</>}>
    <Table tight headers={['정상화 및 잔여가치', '템스코 별도', '위폼스 별도', '연결']} rows={[
      {label:`${terminalYear}E 평가용 EBIT`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(lastRow(v).ebit))},
      {label:`${stableYear} 정상화 EBIT`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalEbit)),strong:true},
      {label:'정상 법인세',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalTax))},
      {label:`${stableYear} 정상 FCFF`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalFcff)),strong:true},
      {label:`${terminalYear}말 TV = FCFF ÷ ${pct(baseWacc)}`,values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.terminalValue))},
      {label:'명시기간 FCFF 현재가치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.pvExplicit))},
      {label:'잔여가치 현재가치',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.pvTerminal))},
      {label:'영업가치 EV',values:[base.parent,base.subsidiary,base.consolidated].map(v=>f(v.ev)),strong:true},
      {label:'EV 중 잔여가치 비중',values:[base.parent,base.subsidiary,base.consolidated].map(v=>pct(v.terminalShare))},
    ]}/>
    <div className="grid grid-cols-2 gap-7"><Note title={`${stableYear} 정상화 계산`}>min({terminalYear} EBIT + 개발비 상각, {terminalYear} 매출 × 2028 회사 OPM)<br/>− 매년 반복 개발비 = 정상화 EBIT</Note><Note title="무성장 재투자 균형">비개발 상각 = 유지 CAPEX / 개발비 상각 = 반복 개발비<br/>ΔNWC = 0 / 성장 CAPEX = 0 / 정상 FCFF = NOPAT</Note></div>
  </Frame>
  if (kind === 'methods') return <Frame title="DCF 가치 및 OMM 배수 검토" subtitle="핌스 우선의 OMM 비교기업 검토 · 배수 가치 및 방법 간 격차 산정 보류" note={<>{baseFoot}<br/>OMM 비교기업의 동일 기준일 EV·LTM 매출·EBITDA 대사 필요 / EV/Sales 적용 시 사업별 매출·수익성 조정 / 소재 유통과 OMM 제조의 범위 구분</>}>
    <div className="flex gap-7 text-[12px] font-bold"><span style={{color:blue}}>■ 무성장 DCF</span><span className="text-amber-700">OMM 배수 · 산정 보류</span></div>
    <ComparisonBars pairs={[{label:'연결 영업가치 EV',dcf:base.consolidated.ev,multiple:base.consolidated.multipleEv},{label:'연결 지배주주',dcf:base.consolidatedEquity,multiple:base.multipleConsolidatedEquity},{label:'별도 + 75% SOTP',dcf:base.parentSotp,multiple:base.multipleParentSotp}]}/>
    <Note title="비교기업 선정 기준">핌스 우선 · 풍원정밀·세우인코퍼레이션의 OMM 사업 비교<br/>영업적자 기업도 경쟁 분석에 포함 · 양의 EV/EBIT 산정과 제품 경쟁성의 구분</Note>
  </Frame>
  if (kind === 'scenarios') return <Frame title="비관·중도·낙관 시나리오별 가치" subtitle={`${terminalYear}E 명시기간 말 손익 및 ${stableYear} 정상가치 비교 · 확률가중 또는 신뢰구간 미설정`} note={<>{baseFoot}<br/>2026 매출 공통 · 2026→2029 회사 매출증분의 75%/100%/115% 적용 · 원본 판관급여 고정·기타 현금비용 매출연동<br/>동일 기초 운전자본 적용 / OMM 비교기업 배수 미확정으로 배수 가치·격차 산정 보류</>}>
    <Table headers={['주요 입력·산출',...scenarioValuations.map(v=>v.scenario.label)]} compact rows={[
      {label:'회사 매출증분 실현율',values:scenarioValuations.map(v=>pct(v.scenario.growthCapture,0))},
      {label:'WACC / NWC 비율',values:scenarioValuations.map(v=>`${pct(v.scenario.wacc)} / ${pct(ncwcRatio*v.scenario.nwcFactor)}`)},
      {label:`${terminalYear}E 별도 / 연결 매출`,values:scenarioValuations.map(v=>`${f(lastRow(v.parent).revenue)} / ${f(lastRow(v.consolidated).revenue)}`)},
      {label:`${terminalYear}E 별도 / 연결 평가 EBIT`,values:scenarioValuations.map(v=>`${f(lastRow(v.parent).ebit)} / ${f(lastRow(v.consolidated).ebit)}`)},
      {label:'연결 영업가치 EV · DCF',values:scenarioValuations.map(v=>f(v.consolidated.ev))},
      {label:'연결 지배주주 가치 · DCF',values:scenarioValuations.map(v=>f(v.consolidatedEquity)),strong:true},
      {label:'연결 지배주주 · 출구배수',values:scenarioValuations.map(v=>f(v.multipleConsolidatedEquity))},
      {label:'두 방법 차이 · 연결 지분',values:scenarioValuations.map(v=>gap(v.multipleConsolidatedEquity,v.consolidatedEquity))},
      {label:'별도 + 75% SOTP · DCF',values:scenarioValuations.map(v=>f(v.parentSotp)),strong:true},
      {label:'별도 + 75% SOTP · 출구배수',values:scenarioValuations.map(v=>f(v.multipleParentSotp))},
      {label:'두 방법 차이 · SOTP',values:scenarioValuations.map(v=>gap(v.multipleParentSotp,v.parentSotp))},
    ]}/>
    <div className="grid grid-cols-3 gap-6 pt-2">{scenarioValuations.map(v=><Note key={v.scenario.id} title={v.scenario.label}>{v.scenario.id==='downside'?'매출 전환 지연 · 운전자본 회수 지연':v.scenario.id==='base'?'회사 매출계획 실현 · 산업 운전자본 적용':'고객 전환 가속 · 운전자본 효율 개선'}<br/>연결 2026 잔여 FCFF {f(v.consolidated.rows[0].fcff)}억</Note>)}</div>
  </Frame>
  if (kind === 'sensitivity') {
    const rates=[baseWacc-.015,baseWacc,baseWacc+.015], factors=[.8,1,1.2]
    return <Frame title="할인율·정상 이익·투자시점 민감도" subtitle="중도안 기준 단일 요인 재계산 / g=0 고정 / 위폼스 지분가치 및 NCI 동시 재계산" note={<>{baseFoot}<br/>정상화 EBIT ±20%·WACC ±1.5%p: 분석가 선택 범위 / CAPEX 미집행률만 변경한 민감도는 기집행 시 현금·차입 변동을 고정한 부분 분석</>}>
      <div className="grid grid-cols-2 gap-7">{(['consolidated','parent'] as const).map(entity=><div key={entity}><h3 className="text-[15px] font-bold mb-3">{entity==='parent'?'별도 + 위폼스 75% SOTP':'연결 지배주주 지분가치'}</h3><Table headers={['WACC / 정상 EBIT','80%','100%','120%']} compact rows={rates.map(rate=>({label:pct(rate),strong:rate===baseWacc,values:factors.map(factor=>{const v=calculateValuation('base',{wacc:rate,terminalProfitFactor:factor});return f(entity==='parent'?v.parentSotp:v.consolidatedEquity)})}))}/></div>)}</div>
      <h3 className="text-[15px] font-bold mt-3">2026 성장투자 미집행률에 따른 가치 영향</h3>
      <Table headers={['2026 계획 CAPEX 미집행률','0%','50%','100% · 중도안']} rows={[
        {label:'별도 + 75% SOTP',values:[0,.5,1].map(x=>f(calculateValuation('base',{remainingGrowthCapexFraction:x}).parentSotp))},
        {label:'연결 지배주주',values:[0,.5,1].map(x=>f(calculateValuation('base',{remainingGrowthCapexFraction:x}).consolidatedEquity)),strong:true},
      ]}/>
      <Note title="제거 상각 대용치의 검증 필요">제조상각·PPA·무형자산 상각 내역의 원장 대사 우선<br/>영업이익에 포함된 상각을 과다 제거할 경우 FCFF·가치의 과대 추정 가능성</Note>
    </Frame>
  }
  if (kind === 'equity') return <Frame title="영업가치·지분가치 연결 및 비지배지분" subtitle="위폼스 75% 보유 반영 / 원본 투자주식 장부가와 평가 지분가치의 중복 합산 방지" note={<>{baseFoot}<br/>그 외 비영업자산·우선청구권 조정 0 가정 / 위폼스 원시 지분가치 음수 시 유한책임 하한 0, 계속지원 의무 미반영 / 연결장부 NCI 13.30억 추가 차감 제외</>}>
    <div className="grid grid-cols-2 gap-8"><div><h3 className="font-bold text-[16px] mb-3">연결 지배주주 지분가치</h3><Table headers={['가치 연결','중도안']} rows={[
      {label:'그룹 영업가치 EV',values:[f(base.consolidated.ev)]},
      {label:'− 그룹 순차입금',values:[f(base.consolidated.netDebt)]},
      {label:'− 위폼스 비지배지분 25%',values:[f(base.nci)]},
      {label:'= 템스코 지배주주 가치',values:[f(base.consolidatedEquity)],strong:true},
    ]}/></div><div><h3 className="font-bold text-[16px] mb-3">별도 영업 + 보유지분 합산</h3><Table headers={['SOTP 연결','중도안']} rows={[
      {label:'템스코 별도 영업 EV',values:[f(base.parent.ev)]},
      {label:'− 별도 순차입금',values:[f(base.parent.netDebt)]},
      {label:'+ 위폼스 지분가치 × 75%',values:[f(base.parentHolding)]},
      {label:'= 템스코 SOTP 지분가치',values:[f(base.parentSotp)],strong:true},
    ]}/></div></div>
    <div className="bg-slate-900 text-white px-6 py-5 grid grid-cols-4 gap-4 text-[12px]"><div>위폼스 영업 EV<b className="block text-[23px] mt-2">{f(base.subsidiary.ev)}</b></div><div>− 위폼스 순차입금<b className="block text-[23px] mt-2">{f(base.subsidiary.netDebt)}</b></div><div>= 위폼스 원시 지분가치<b className="block text-[23px] mt-2">{f(base.subsidiary.rawEquity)}</b></div><div>유한책임 하한 조정<b className="block text-[23px] mt-2">{f(base.subsidiaryFloorAdjustment)}</b></div></div>
    <div className="grid grid-cols-2 gap-7"><Note title={`연결 − SOTP = ${f(base.scopeGap)}억`}>명시기간 내부거래 운전자본 중복 제거 효과<br/>본 가정상 세금·상각·정상 이익은 법인별 합계와 일치</Note><Note title="중복 가산·차감 제외 항목">부모 투자주식 장부가 73.36억 별도 가산 제외<br/>인수대금 90억의 EV 추가 차감 제외 · 기존 재무 반영</Note></div>
  </Frame>
  const p=investmentEffect('parent'),g=investmentEffect('consolidated')
  return <Frame title="70억 원 투자 유치 및 자본구조 변화" subtitle="2025말 재무상태표에 보통주 유상증자 70억 즉시 반영 / 비용·상환·영업손익·투자집행 전 비교" note={<>{baseFoot}<br/>증자대금 70억·발행비용 0·현금 유입·부채 유지 가정 / RCPS 회계분류 미확정 / Post-money = Pre-money + 유입액 / 운영 EV에 증자액 가산 제외</>}>
    <Table compact headers={['재무 항목','별도 투자 전','별도 투자 후','연결 투자 전','연결 투자 후']} rows={[
      {label:'자산',values:[p.assets,p.assetsAfter,g.assets,g.assetsAfter].map(x=>f(x))},
      {label:'현금',values:[p.cash,p.cashAfter,g.cash,g.cashAfter].map(x=>f(x))},
      {label:'부채 총계',values:[p.liabilities,p.liabilities,g.liabilities,g.liabilities].map(x=>f(x))},
      {label:'자본 총계',values:[p.equity,p.equityAfter,g.equity,g.equityAfter].map(x=>f(x)),strong:true},
      {label:'순차입금',values:[p.netDebt,p.netDebtAfter,g.netDebt,g.netDebtAfter].map(x=>f(x))},
      {label:'부채 / 자본',values:[p.debtRatioBefore,p.debtRatioAfter,g.debtRatioBefore,g.debtRatioAfter].map(x=>pct(x,1))},
    ]}/>
    <div className="grid grid-cols-2 gap-9"><Stat label="연결 DCF 기준 Post-money" value={f(g.postMoney)} detail={`Pre-money ${f(g.preMoney)}억 + 신규 자본 70억 / 신규 지분 ${pct(g.newInvestorShare!)}`}/><Stat label="별도 SOTP 기준 Post-money" value={f(p.postMoney)} detail={`Pre-money ${f(p.preMoney)}억 + 신규 자본 70억 / 신규 지분 ${pct(p.newInvestorShare!)}`} color={teal}/></div>
    <Note title="후속 조달·집행 계획의 연계">연결 2026 잔여 FCFF {f(base.consolidated.rows[0].fcff)}억 / 70억 조달 후 FCFF상 차액 {f(-base.consolidated.rows[0].fcff-70)}억 · 금융비용·차입상환 전<br/>보유현금·차입 여력·CAPEX 이연 대사 후 Series A/B/C 시점·규모 결정 / 확정 후속 투자금의 선반영 제외</Note>
  </Frame>
}
