import type { ReactNode } from 'react'
import { financials as f, historicalBalance as bs, closingBalance as post, investment, addBack, normalizedOp, outsourcingSensitivity, fmt, signed } from './financials'
import s from './financialLayouts.module.css'

const C = { navy: '#172d4f', blue: '#2358cf', teal: '#148579', loss: '#b65353', line: '#dbe3ee', muted: '#66758b', pale: '#edf3fc' }
const Unit = () => <span className={s.unit}>억 원</span>
const Note = ({ children }: { children: ReactNode }) => <p className={s.note}>{children}</p>
const Label = ({ children }: { children: ReactNode }) => <p className={s.label}>{children}</p>
const Root = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`${s.root} ${className}`}>{children}</div>

function Bridge({ data, label, height = 280, width = 1015 }: { data: { label: string; value: number; total?: boolean }[]; label: string; height?: number; width?: number }) {
  let total = 0
  const points = data.map(d => { const start = d.total ? 0 : total; total = d.total ? d.value : total + d.value; return { ...d, start, end: total } })
  const min = Math.min(0, ...points.flatMap(d => [d.start, d.end])), max = Math.max(0, ...points.flatMap(d => [d.start, d.end]))
  const y = (v: number) => 40 + (max - v) / (max - min || 1) * (height - 105)
  const pitch = (width - 45) / points.length, bar = Math.min(100, pitch * .66)
  return <svg className={s.svg} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}><title>{label}</title><desc>{points.map(d => `${d.label} ${signed(d.value, 2)}억 원`).join(', ')}</desc>
    <line x1="15" x2={width - 20} y1={y(0)} y2={y(0)} stroke={C.line} />
    {points.map((d, i) => { const x = 20 + i * pitch + (pitch - bar) / 2, color = d.value < 0 ? C.loss : d.total ? C.blue : C.teal; return <g key={d.label}>
      {i < points.length - 1 && <line x1={x + bar} x2={x + pitch} y1={y(d.end)} y2={y(d.end)} stroke="#a9b7cb" strokeDasharray="4 4" />}
      <rect x={x} y={Math.min(y(d.start), y(d.end))} width={bar} height={Math.max(2, Math.abs(y(d.start) - y(d.end)))} fill={color} />
      <text x={x + bar / 2} y={Math.min(y(d.start), y(d.end)) - 12} textAnchor="middle" fontSize="19" fontWeight="700" fill={color}>{d.total ? fmt(d.value, 2) : signed(d.value, 2)}</text>
      <text x={x + bar / 2} y={height - 20} textAnchor="middle" fontSize="15" fill={C.navy}>{d.label}</text>
    </g> })}
  </svg>
}

function RevenueBars() {
  const values = [50.41167105, ...f.subsidiary.revenue.slice(0, 3)], years = ['2023A', '2024A', '2025A', '2026E']
  const base = 237, scale = 1.28
  return <svg className={s.svg} viewBox="0 0 490 285" role="img" aria-label="위폼스 2023년부터 2026년 예상 매출, 억 원"><title>위폼스 매출 추이</title><desc>{values.map((v, i) => `${years[i]} ${fmt(v, 2)}억 원`).join(', ')}</desc>
    {[0, 50, 100, 150].map(v => <g key={v}><line x1="32" x2="480" y1={base - v * scale} y2={base - v * scale} stroke={C.line} /><text x="25" y={base - v * scale + 5} textAnchor="end" fontSize="15" fill={C.muted}>{v}</text></g>)}
    {values.map((v, i) => <g key={years[i]}><rect x={57 + i * 108} y={base - v * scale} width="60" height={v * scale} fill={i === 3 ? '#b6c9ee' : C.blue} /><text x={87 + i * 108} y={base - v * scale - 12} textAnchor="middle" fontSize="19" fontWeight="700" fill={C.blue}>{fmt(v)}</text><text x={87 + i * 108} y="271" textAnchor="middle" fontSize="15" fill={C.muted}>{years[i]}</text></g>)}
  </svg>
}

function ProfitBars() {
  const values = [-14.09592079, ...f.subsidiary.op.slice(0, 3)], years = ['2023A', '2024A', '2025A', '2026E']
  const y = (v: number) => 129 - v * 3.5
  return <svg className={s.svg} viewBox="0 0 490 285" role="img" aria-label="위폼스 영업손익, 2023년 -14.1억, 2024년15.2억, 2025년-17.9억, 2026년 예상-28.2억"><title>위폼스 영업손익 추이</title>
    {[-30, -15, 0, 15].map(v => <g key={v}><line x1="35" x2="480" y1={y(v)} y2={y(v)} stroke={v === 0 ? '#9aaac1' : C.line} /><text x="28" y={y(v) + 5} textAnchor="end" fontSize="15" fill={C.muted}>{v}</text></g>)}
    {values.map((v, i) => <g key={years[i]}><rect x={57 + i * 108} y={Math.min(y(0), y(v))} width="60" height={Math.abs(v * 3.5)} fill={v < 0 ? C.loss : C.teal} opacity={i === 3 ? .62 : 1} /><text x={87 + i * 108} y={v >= 0 ? y(v) - 12 : y(v) + 23} textAnchor="middle" fontSize="19" fontWeight="700" fill={v < 0 ? C.loss : C.teal}>{fmt(v)}</text><text x={87 + i * 108} y="271" textAnchor="middle" fontSize="15" fill={C.muted}>{years[i]}</text></g>)}
  </svg>
}

function AllocationDonut() {
  const radius = 108, circumference = 2 * Math.PI * radius
  let running = 0
  return <svg className={s.svg} viewBox="0 0 340 340" role="img" aria-label="기존 투자금70억 배분안, 설비40억, 운전자금20억, 연구개발10억"><title>70억 투자금 배분안</title>
    {[{ value: investment.capex, color: C.navy }, { value: investment.workingCapital, color: C.blue }, { value: investment.research, color: C.teal }].map(d => {
      const offset = -running / investment.total * circumference; running += d.value
      return <circle key={d.color} cx="170" cy="165" r={radius} fill="none" stroke={d.color} strokeWidth="45" strokeDasharray={`${d.value / investment.total * circumference} ${circumference}`} strokeDashoffset={offset} transform="rotate(-90 170 165)" />
    })}
    <text x="170" y="140" textAnchor="middle" fill={C.muted} fontSize="16">기존 조달 제안</text><text x="170" y="193" textAnchor="middle" fill={C.navy} fontSize="59" fontWeight="700">70</text><text x="170" y="222" textAnchor="middle" fill={C.muted} fontSize="16">억 원</text>
  </svg>
}

function LiquidityChart() {
  const max = bs.currentLiabilities, width = 445
  return <svg className={s.svg} viewBox="0 0 685 220" role="img" aria-label="2025 유동자산105.49억, 유동부채247.84억, 현금34.71억"><title>유동성 규모 비교</title>
    {[{ label: '유동부채', value: bs.currentLiabilities, color: C.navy }, { label: '유동자산', value: bs.currentAssets, color: C.blue }, { label: '현금', value: bs.cash, color: C.teal }].map((d, i) => <g key={d.label}><text x="0" y={39 + i * 65} fontSize="16" fill={C.navy}>{d.label}</text><rect x="92" y={16 + i * 65} width={width * d.value / max} height="34" fill={d.color} /><text x={102 + width * d.value / max} y={39 + i * 65} fill={d.color} fontWeight="700" fontSize="19">{fmt(d.value, 2)}</text></g>)}
  </svg>
}

function BalanceComposition({ after = false }: { after?: boolean }) {
  const state = after ? post : bs, w = 850, denom = post.assets
  return <svg className={s.svg} viewBox="0 0 1015 108" role="img" aria-label={`${after ? '70억 납입 직후 예시' : '2025 수록값'} 자산${fmt(state.assets, 2)}억, 부채${fmt(state.liabilities, 2)}억, 자본${fmt(state.equity, 2)}억`}>
    <text x="0" y="18" fontSize="15" fill={C.muted}>{after ? '납입 직후 예시' : '2025 수록값'}</text>
    <rect x="0" y="31" width={state.liabilities / denom * w} height="39" fill={C.navy} /><rect x={state.liabilities / denom * w} y="31" width={state.equity / denom * w} height="39" fill={after ? C.teal : C.blue} />
    <text x={state.liabilities / denom * w / 2} y="57" textAnchor="middle" fontSize="16" fill="white">부채 {fmt(state.liabilities, 2)}</text>
    <text x={state.assets / denom * w + 15} y="57" fontSize="20" fontWeight="700" fill={C.navy}>{fmt(state.assets, 2)}</text>
    <text x={state.liabilities / denom * w + 4} y="94" fontSize="15" fill={after ? C.teal : C.blue}>자본 {fmt(state.equity, 2)}</text>
  </svg>
}

function SensitivityChart() {
  const zero = 295, px = 13.5
  return <svg className={s.svg} viewBox="0 0 705 292" role="img" aria-label="위폼스 2027 외주비율 민감도, 29%,30%,31%,40%의 영업이익과 기준 대비 변화"><title>외주비율별 영업손익</title>
    <text x="0" y="17" fontSize="14" fill={C.muted}>외주비율</text><text x="415" y="17" fontSize="14" fill={C.muted}>영업손익 / 억 원</text><text x="696" y="17" fontSize="14" fill={C.muted} textAnchor="end">기준 대비</text>
    <line x1={zero} x2={zero} y1="31" y2="259" stroke="#b8c5d7" />
    {[29, 30, 31, 40].map((rate, i) => { const delta = (30 - rate) * outsourcingSensitivity, op = f.subsidiary.op[3] + delta, y = 44 + i * 57; return <g key={rate}>
      {rate === 30 && <rect x="-1" y={y - 10} width="706" height="49" fill={C.pale} />}
      <text x="0" y={y + 18} fontSize="18" fontWeight={rate === 30 ? 700 : 500} fill={C.navy}>{rate}%</text><text x="58" y={y + 18} fontSize="14" fill={C.muted}>{rate === 30 ? '회사 기준' : rate === 40 ? '2026E 유지' : ''}</text>
      <rect x={op < 0 ? zero + op * px : zero} y={y - 3} width={Math.abs(op * px)} height="29" fill={op < 0 ? C.loss : rate === 30 ? C.blue : '#6f92d9'} />
      <text x={op < 0 ? zero + op * px - 10 : zero + op * px + 10} y={y + 18} textAnchor={op < 0 ? 'end' : 'start'} fontSize="17" fontWeight="700" fill={op < 0 ? C.loss : C.navy}>{fmt(op, 1)}</text>
      <text x="696" y={y + 18} textAnchor="end" fontSize="17" fill={delta < 0 ? C.loss : delta > 0 ? C.teal : C.muted}>{signed(delta, 2)}</text>
    </g> })}<text x={zero} y="284" textAnchor="middle" fontSize="14" fill={C.muted}>0</text>
  </svg>
}

const earningsBridge = [
  { label: '2024 영업익', value: 15.22689367, total: true }, { label: '매출 증가', value: 33.20265881 },
  { label: '재료비', value: -9.68330245 }, { label: '외주비', value: -22.99726160 },
  { label: '인건비', value: -6.49089981 }, { label: '감가상각', value: -12.40056078 },
  { label: '제조경비', value: -9.60548535 }, { label: '판관비', value: -5.16630443 },
  { label: '2025 영업익', value: -17.91426194, total: true },
]

/** Layout-only alternatives, keyed by original content index. Source and title remain in the page shell. */
export const financialLayouts: Partial<Record<number, ReactNode>> = {
  2: <Root><div className={s.overview}><div className={s.hero}><Label>2026E 연결 매출</Label><div className={s.heroValue}>{fmt(f.group.revenue[2])}<Unit /></div><p>내부매출 125.4억 제거 후</p><div className={s.heroSub}><span>2026E 위폼스 영업손익</span><strong>{fmt(f.subsidiary.op[2])}<Unit /></strong><p>연결 수익성 회복의 핵심 과제</p></div></div><div className={s.theses}><div className={s.raise}><span>기존 제안 기준 투자금<br /><small>최종 금액·증권 조건 협의 대상</small></span><strong>70<Unit /></strong></div>{[
    ['01', '과거 손실의 성격', '2025년 대손·제조 원가 증가의 구분', '대손 조정 후 연결 영업손실 8.7억 잔존'],
    ['02', '인수자산의 수익 전환', '2027년 위폼스 흑자 전망의 매출·원가율 개선 전제', '공정별 생산능력·실적 검증 필요'],
    ['03', '신규 자금의 회수 가능성', '자본 확충의 즉시 효과 및 집행 조건', '설비·운전자금의 연결 현금흐름 전환'],
  ].map(([n, title, a, b]) => <div key={n} className={s.thesis}><b>{n}</b><div><h3>{title}</h3><p>{a}<br />{b}</p></div></div>)}</div></div></Root>,

  3: <Root><div className={s.acquisitionTimeline}>{[
    ['2010.10', '템스코 설립', '박막코팅·특수강·비철소재'], ['2024.03', '위폼스 인수', '진공증착용 메탈마스크 제조'], ['2025.09', '거래처 신용사건', '인수 이후 파인원 채권 미회수'],
  ].map(([date, title, body], i) => <div key={date} className={i === 1 ? s.timelineFocus : undefined}><span>{date}</span><h3>{title}</h3><p>{body}</p></div>)}</div><div className={s.acquisitionLogic}>{[
    ['소재·제조 결합', '제품당 부가가치 확대', '원소재 조달·정밀 제조 연계', '구매단가·수율·외주비 비교'],
    ['고객 직접 공급', '1차 공급 기회 확장', '2차 공급 중심 사업의 범위 확대', '당시 평가 단계·공급 계획·후속 계약'],
    ['포트폴리오 확대', '소재·부품 고객 접점 공유', '박막소재·메탈마스크 사업 연계', '인수 사업계획·대안·통합 실행계획'],
  ].map(([title, outcome, mechanism, evidence], i) => <article key={title}><span className={s.logicNumber}>0{i + 1}</span><h3>{title}</h3><strong>{outcome}</strong><p>{mechanism}</p><div><small>판단 근거</small><p>{evidence}</p></div></article>)}</div><Note>투자자 메모의 인수 투자금 약 90억 · 취득 지분·구주/신주·지급 내역·조달 원천의 계약자료 확인 필요</Note></Root>,

  4: <Root><div className={s.dualCharts}><section><Label>위폼스 매출 / 억 원</Label><RevenueBars /></section><section><Label>위폼스 영업손익 / 억 원</Label><ProfitBars /></section></div><div className={s.growthStrip}><div><span>2024년 매출 성장</span><strong>+83.7%</strong><p>영업손익 -14.1억 → +15.2억</p></div><div><span>2025년 매출 성장</span><strong>+35.9%</strong><p>영업손익 -17.9억으로 하락</p></div></div><Note>2024년 연간 실적 기준 · 매출 성장·인수 시너지 실현의 구분 · 가격·제품 구성·원가분류 대사 및 조달력·수율 기여 검증 필요</Note></Root>,

  5: <Root><Bridge data={earningsBridge} label="위폼스 2024년에서2025년 영업손익 변동, 억 원" height={305} /><div className={s.bridgeSummary}><div><span>매출 증가</span><strong>+33.2<Unit /></strong></div><div><span>매출원가 증가</span><strong className={s.loss}>+61.2<Unit /></strong></div><div className={s.summaryText}><h3>매출 증가액을 상회한 원가 증가액</h3><p>판관 대손 0.84억 외 제조 원가 부담<br />외주·상각·인력의 병행 검토</p></div></div><Note>2024 외주비 행 공란의 별도 계상액 0 기준 비교 · 실제 비용 발생·계정 재분류 여부 확인 필요</Note></Root>,

  6: <Root><div className={s.qoe}><section><Label>2025년 연결 손익의 대손 조정 / 억 원</Label><Bridge height={280} width={650} label="연결 영업손익 -73.24억, 판관 대손64.54억 가산, 가산후-8.70억" data={[{ label: '보고 영업손익', value: f.group.op[1], total: true }, { label: '판관 대손 가산', value: addBack.group }, { label: '가산 후 손익', value: normalizedOp.group, total: true }]} /><p className={s.subline}>대손: 모회사 63.70억 + 위폼스 0.84억<br />2024 연결 영업이익 {fmt(f.group.op[0])}억</p></section><aside><Label>모회사 별도 비교 / 억 원</Label><div className={s.comparisonNumber}><span>2024 영업이익</span><strong>{fmt(f.parent.op[0])}</strong></div><div className={`${s.comparisonNumber} ${s.emphasized}`}><span>2025 대손 조정 후</span><strong>{fmt(normalizedOp.parent)}</strong></div><p className={s.smallEquation}>{fmt(f.parent.op[1])} + {fmt(addBack.parent)} = {fmt(normalizedOp.parent)}</p><p>2024 이익 수준 하회<br />매출의 질·제조 원가의 동반 개선 필요</p></aside></div><div className={s.conclusion}><strong className={s.loss}>연결 영업손실 8.7억 잔존</strong><span>제조 원가·기타 조정 부담 및 대손의 비경상성·재발 가능성 검토</span></div><Note>미회수채권 약 80억과 손익계산서 대손의 범위 차이 · 채권 잔액·충당금·상각·회수액 대사 필요 · 정상화 이익 확정 아님</Note></Root>,

  7: <Root><div className={s.liquidityTop}><div><Label>2025 연결 현금·현금성자산</Label><strong>{fmt(bs.cash)}<Unit /></strong><p>위폼스 별도 현금 0.31억</p></div><div><Label>부채 / 자본</Label><strong className={s.loss}>{fmt(bs.liabilities / bs.equity * 100)}<span className={s.unit}>%</span></strong><p>부채 389.54억 / 자본 34.37억</p></div><div><Label>유동비율</Label><strong>{fmt(bs.currentAssets / bs.currentLiabilities * 100)}<span className={s.unit}>%</span></strong><p>유동자산 105.49억 / 유동부채 247.84억</p></div></div><div className={s.liquidityBottom}><section><Label>유동성 규모 비교 / 억 원</Label><LiquidityChart /></section><aside><Label>연결 자산의 조달 구성</Label><strong>{fmt(bs.assets, 2)}<Unit /></strong><div className={s.capitalStack}><span style={{ flex: bs.liabilities }}>부채</span><span style={{ flex: bs.equity }} /></div><div className={s.stackLabels}><span>부채 389.54</span><span>자본 34.37</span></div><p>손실 인식 이후<br />현금 부족 해소 여부 별도 확인</p></aside></div><Note>2025년 말 수록값 · 월별 통합 관리: 채권 회수·재고·차입 상환·신규 투자 집행 · 현재 잔액으로 갱신 필요</Note></Root>,

  8: <Root><div className={s.consolidationFlow}><div className={s.entity}><Label>템스코</Label><strong>400<Unit /></strong></div><div className={s.internalFlows}><p>위폼스 → 템스코 <b>91.56억</b></p><span className={s.leftArrow} /><span className={s.rightArrow} /><p>템스코 → 위폼스 <b>33.81억</b></p></div><div className={s.entity}><Label>위폼스</Label><strong>140<Unit /></strong></div><div className={s.elimination}><Label>내부매출 차감</Label><strong>−125.37</strong></div><div className={s.externalSales}><Label>2026E 연결 외부매출</Label><strong>{fmt(f.group.revenue[2], 2)}<Unit /></strong></div></div><table className={s.numericTable}><thead><tr><th>연결 매출 대사 / 억 원</th>{f.years.slice(2).map(y => <th key={y}>{y}</th>)}</tr></thead><tbody>{[
    ['템스코 매출', f.parent.revenue.slice(2)], ['위폼스 매출', f.subsidiary.revenue.slice(2)], ['내부매출 차감', f.group.revenue.slice(2).map((v, i) => v - f.parent.revenue[i + 2] - f.subsidiary.revenue[i + 2])], ['연결 외부매출', f.group.revenue.slice(2)],
  ].map(([label, values], row) => <tr key={label as string} className={row === 3 ? s.totalRow : undefined}><td>{label as string}</td>{(values as number[]).map((v, i) => <td key={i} className={v < 0 ? s.loss : undefined}>{fmt(v, 1)}</td>)}</tr>)}</tbody></table><Note>내부 매출·원가 동일액 차감 · 제거 자체의 연결 이익 증가 효과 없음 · 미실현손익 등 추가 연결조정 별도 대사</Note></Root>,

  23: <Root><div className={s.allocationLayout}><div><AllocationDonut /><p className={s.donutCaption}>기존 제안 배분 · 투자조건 협의 대상</p></div><div className={s.allocationRows}>{[
    { label: '설비투자', value: 40, color: C.navy, purpose: '위폼스 등 병목 해소·외주 의존도 개선', kpi: '양품 CAPA · 외주비 절감 · 신규 상각' },
    { label: '운전자금', value: 20, color: C.blue, purpose: '템스코 소재 매입·양사 양산 준비', kpi: '재고일수 · 채권 회수 · 매입채무 · 현금' },
    { label: '연구개발', value: 10, color: C.teal, purpose: '소재·부품 개발·고객 평가 진행', kpi: '평가 통과 · 개발 지출 · 상업화 일정' },
  ].map(d => <div key={d.label} style={{ borderLeftColor: d.color }}><div><h3>{d.label}</h3><strong style={{ color: d.color }}>{d.value}<Unit /></strong><small>{fmt(d.value / investment.total * 100)}%</small></div><p>{d.purpose}</p><p className={s.kpi}>집행 확인: {d.kpi}</p></div>)}</div></div><Note>2026 Excel CAPEX: 템스코 110억·위폼스 2.5억 · 40억 배분안과 대상·시기 차이 가능성 · 기집행·기타 조달원 대사 필요 · 성과 지표의 회사 확정 목표 아님</Note></Root>,

  24: <Root><div className={s.proFormaHeadline}><div><Label>2025 수록값 기준 단순 납입 예시</Label><p>자산·현금·자본 각 70억 증가<br />부채 원금 유지·이자비용 절감 미반영</p></div><div><span>납입 직후 연결 자본</span><strong>{fmt(post.equity)}<Unit /></strong></div></div><div className={s.balanceComparisons}><BalanceComposition /><BalanceComposition after /></div><div className={s.proFormaRatios}>{[
    ['현금 / 억 원', fmt(bs.cash), fmt(post.cash)], ['부채 / 자본', `${fmt(bs.liabilities / bs.equity * 100)}%`, `${fmt(post.liabilities / post.equity * 100)}%`], ['유동비율', `${fmt(bs.currentAssets / bs.currentLiabilities * 100)}%`, `${fmt((bs.currentAssets + investment.total) / bs.currentLiabilities * 100)}%`],
  ].map(([label, before, after]) => <div key={label}><Label>{label}</Label><p><span>{before}</span><b>→</b><strong>{after}</strong></p></div>)}</div><Note>전액 자본성 신주 현금납입·발행비용/이후 손익/집행 미반영 · 납입 직후와 사용 후 재무상태의 구분 · 최종 효과: 집행·영업현금·차입 상환</Note></Root>,

  27: <Root><div className={s.cashPath}>{['신주 납입', '법인별 투입', '외부 지출', '외부고객 회수'].map((label, i) => <div key={label}><span>0{i + 1}</span><strong>{label}</strong></div>)}</div><div className={s.cashLanes}>{[
    ['설비', '법인별 취득·병목 해소', 'CAPEX·신규 감가상각', '양품 생산량·외주비 절감'],
    ['운전자금', '재고·매출채권 증가 지원', '외부 채권 + 재고 − 매입채무', '회수일수·현금 잔액'],
    ['개발·평가', '소재·부품의 고객 평가', '개발 현금지출·비용/자산 구분', '평가 통과·상업화 후 회수'],
  ].map(([name, use, cash, result]) => <div key={name}><b>{name}</b><span>{use}</span><span>{cash}</span><span>{result}</span></div>)}</div><div className={s.fcffEquation}><span>FCFF</span><div>연결 EBIT + 감가상각·무형자산상각 − 영업 기준 현금세금<br />− 영업운전자금 증가 − 유형자산·자산화 개발비 투자</div></div><Note>내부 자금·채권·채무의 연결 중복 계상 배제 · 비용 처리 개발비 중복 차감 배제 · 세금의 이자효과 제외 · 개발 판매의 시기·실현 여부 불확실</Note><Note>미투자 비교안 부재 · 법인별 출자·대여·구매·신규 상각·운전자금·세금 자료 미비 · 2027 연결 증익 70.8억 전체의 70억 투자금 순증 효과 귀속 불가</Note></Root>,

  28: <Root><div className={s.sensitivityLayout}><aside><Label>외주비율 1%p 개선 효과</Label><strong>+{fmt(outsourcingSensitivity, 2)}<Unit /></strong><p>2027 매출 229.47억 고정<br />위폼스 영업이익의 산술 변화</p><div className={s.sensitivityCondition}><h3>이익 전환 조건</h3><p>비용 절감액의<br />신규 상각·유지비 초과</p></div></aside><section><SensitivityChart /><Note>매출·다른 원가·감가상각·세금·CAPEX 고정 · 연결 내부거래 제거 외 추가 조정 미반영</Note></section></div><div className={s.evidenceStrip}><span>설비 견적</span><span>공정별 처리량</span><span>양품률</span><span>외주 발주액</span></div><Note>40% 유지 시 영업손익 -7.0억: 외주비율만 변경한 부분 민감도 · 실제 하방의 물량·단가·수율·고정비 동반 변동 가능성 · 매출·원가 개선의 중복 반영 배제</Note></Root>,

  29: <Root><div className={s.decisionStages}>{[
    ['가격·증권', '확정 연결 손익·순차입금', '취득 지분·주주명부·가치평가', '투자금·Pre-money', '지분·희석·증권별 권리'],
    ['납입·초기 집행', '월별 현금수지·차입 만기', 'CAPEX 견적·기타 조달원', '법인별 용도·집행 일정', '자금 사용 보고'],
    ['양산·회복', '발주·CAPA·수율·외주비', '채권 회수·운영 실적', '성과 확인·추가 집행 조건', '정기 재무보고'],
    ['회수 검토', '연결 현금 창출·잔여 차입', '배당·매각 가능성', '조건별 회수 경로', '하방 시나리오'],
  ].map(([title, a, b, x, y], i) => <section key={title}><span className={s.stageNumber}>0{i + 1}</span><h3>{title}</h3><Label>확인 근거</Label><p>{a}<br />{b}</p><Label>협의 항목</Label><p>{x}<br />{y}</p></section>)}</div><div className={s.decisionConclusion}><strong>외부 매출·현금 창출</strong><span>인수자산의 성과 확인 및 집행 기준의 연계</span></div><Note>투자조건·집행 기준 미확정 · 원금 보장·확정 수익률 전제 없음 · 근거: S02·S03·S04·S05·S06·S07 · 별도 표기 외 금액 단위: 억 원</Note></Root>,
}
