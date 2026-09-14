import type { ReactNode } from 'react'
import sourceJson from './financialDisplayData.json'

type SourceCell = { fileId: string; sheet: string; cell: string }
type Amount = { eok: number | null; sources: SourceCell[] }
type IncomeKey = 'revenue' | 'cogs' | 'grossProfit' | 'sga' | 'ebit' | 'nonOperatingNet' | 'ebt' | 'tax' | 'netIncome'
type IncomePeriod = { year: number; status: string; badDebtOperating?: Amount } & Record<IncomeKey, Amount>
type Entity = 'parent' | 'subsidiary' | 'consolidated'
type FinancialSource = {
  entities: Record<Entity, { incomeStatement: IncomePeriod[] }>
  consolidationAdjustments: { year: number; rawAdjustmentLines: { revenue: Amount } }[]
  sources: Record<string, { nameNFC: string }>
}

const source: FinancialSource = sourceJson
const years = [2024, 2025, 2026, 2027, 2028, 2029]
const forecastYears = years.filter(year => year >= 2026)
const palette = { navy: '#18344f', cyan: '#0891b2', gold: '#ad7a16', loss: '#b42332', grid: '#dbe3ea' }
const numberFormat = new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const money = (value: number | null) => value === null ? '—' : numberFormat.format(value)
const yearLabel = (year: number) => `${year}${year >= 2026 ? 'E' : ''}`

function period(entity: Entity, year: number): IncomePeriod {
  const row = source.entities[entity].incomeStatement.find(item => item.year === year)
  if (!row) throw new Error(`V4 회사 원본 손익 누락: ${entity} ${year}`)
  return row
}

function value(entity: Entity, year: number, key: IncomeKey): number {
  const amount = period(entity, year)[key].eok
  if (amount === null || !Number.isFinite(amount)) throw new Error(`V4 회사 원본 수치 누락: ${entity} ${year} ${key}`)
  return amount
}

function cellReference(amount: Amount): string {
  return amount.sources.map(cell => `${cell.fileId} ${cell.sheet}!${cell.cell}`).join(' · ')
}

function elimination(year: number): Amount {
  const amount = source.consolidationAdjustments.find(row => row.year === year)?.rawAdjustmentLines.revenue
  if (!amount || amount.eok === null || !Number.isFinite(amount.eok)) throw new Error(`V4 연결 매출 조정 누락: ${year}`)
  return amount
}

function Frame({ title, subtitle, children, notes, cells }: {
  title: string; subtitle: string; children: ReactNode; notes: ReactNode; cells: string
}) {
  return <div className="slide-content p-8 h-full flex flex-col bg-white text-slate-800" data-financial-source>
    <div className="shrink-0 border-b-[3px] border-cyan-600 pb-3 mb-4">
      <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold tracking-[0.12em] text-cyan-700">
        <span>FINANCIAL PERFORMANCE · COMPANY SOURCE</span><span className="tracking-normal text-slate-500">단위: 억 원 · 반올림 전 원본 기준</span>
      </div>
      <h2 className="text-[28px] leading-[1.2] font-black tracking-tight" style={{ color: palette.navy }}>{title}</h2>
      <p className="mt-2 text-[13px] leading-[1.45] text-slate-600">{subtitle}</p>
    </div>
    <div data-valuation-body className="flex-1 min-h-0">{children}</div>
    <div className="shrink-0 border-t border-slate-200 pt-2 mt-3 pr-10 text-[11px] leading-[1.5] text-slate-600" data-financial-source-notes data-valuation-notes>
      {notes}
      <p className="mt-1 text-[10.5px] text-slate-500">출처: 회사 제공 모회사·자회사·연결 추정손익</p>
    </div>
  </div>
}

function SeriesLegend() {
  return <div className="flex items-center gap-5 text-[12px] font-bold">
    <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block" style={{ backgroundColor: palette.navy }} />템스코 별도</span>
    <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block" style={{ backgroundColor: palette.cyan }} />연결</span>
  </div>
}

function TrendChart({ metric, title }: { metric: 'revenue' | 'ebit'; title: string }) {
  const ticks = metric === 'revenue' ? [0, 300, 600, 900] : [-100, 0, 100, 200]
  const minimum = ticks[0]
  const maximum = ticks[ticks.length - 1]
  const y = (amount: number) => 38 + (maximum - amount) / (maximum - minimum) * 192
  const x = (index: number) => 73 + index * 75
  const zero = y(0)
  return <div className="min-w-0">
    <div className="flex items-baseline justify-between mb-1"><h3 className="text-[19px] font-black" style={{ color: palette.navy }}>{title}</h3><span className="text-[11px] text-slate-500">독립 금액 축 · 억 원</span></div>
    <svg viewBox="0 0 510 270" className="w-full h-[230px]" role="img" aria-labelledby={`source-trend-${metric}-title source-trend-${metric}-desc`}>
      <title id={`source-trend-${metric}-title`}>{`2024~2029년 템스코 별도 및 연결 ${title}`}</title>
      <desc id={`source-trend-${metric}-desc`}>2024~2025년 회사 제공 과거자료, 2026~2029년 회사 전망. 네이비 막대: 템스코 별도. 청록 막대: 연결. 연도별 수치: 바로 아래 표.</desc>
      <rect x="184" y="30" width="317" height="208" fill="#edf8fb" />
      <text x="106" y="17" textAnchor="middle" fontSize="11" fill="#64748b">회사 제공 과거자료</text>
      <text x="343" y="17" textAnchor="middle" fontSize="11" fontWeight="700" fill={palette.cyan}>회사 전망 · 2026E–2029E</text>
      {ticks.map(tick => <g key={tick}>
        <path d={`M40 ${y(tick)} H501`} stroke={tick === 0 ? '#8192a3' : palette.grid} strokeWidth={tick === 0 ? 1.2 : 0.8} />
        <text x="33" y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#64748b">{tick}</text>
      </g>)}
      {years.map((year, index) => <g key={year}>
        {(['parent', 'consolidated'] as const).map((entity, position) => {
          const amount = value(entity, year, metric)
          return <rect key={entity} x={x(index) - 25 + position * 26} y={Math.min(zero, y(amount))} width="23" height={Math.abs(zero - y(amount))} fill={entity === 'parent' ? palette.navy : palette.cyan} opacity={year < 2026 ? 0.72 : 1}>
            <title>{`${yearLabel(year)} ${entity === 'parent' ? '템스코 별도' : '연결'} ${money(amount)}억 원`}</title>
          </rect>
        })}
        <text x={x(index)} y="259" textAnchor="middle" fontSize="12" fontWeight="700" fill={year >= 2026 ? palette.cyan : '#64748b'}>{yearLabel(year)}</text>
      </g>)}
    </svg>
    <table className="w-full table-fixed border-collapse text-[12px] tabular-nums" aria-label={`${title} 연도별 수치, 2024~2029년, 단위 억원`}>
      <colgroup><col style={{ width: '17%' }} />{years.map(year => <col key={year} />)}</colgroup>
      <thead><tr className="border-y border-slate-200 bg-slate-50 text-[10.5px] text-slate-500"><th scope="col" className="py-1 text-left">구분</th>{years.map(year => <th scope="col" key={year} className="text-right pr-1 py-1">{yearLabel(year)}</th>)}</tr></thead>
      <tbody>{(['parent', 'consolidated'] as const).map(entity => <tr key={entity} className="border-b border-slate-200">
        <th scope="row" className="text-left py-2 font-bold" style={{ color: entity === 'parent' ? palette.navy : palette.cyan }}>{entity === 'parent' ? '별도' : '연결'}</th>
        {years.map(year => <td key={year} title={cellReference(period(entity, year)[metric])} className="py-2 pr-1 text-right font-semibold" style={{ color: value(entity, year, metric) < 0 ? palette.loss : undefined }}>{money(value(entity, year, metric))}</td>)}
      </tr>)}</tbody>
    </table>
  </div>
}

function Turnaround() {
  return <Frame title="별도·연결 매출 및 영업손익 추이" subtitle="2024–2025 회사 제공 과거자료 · 2026E–2029E 회사 전망 · 영업손익 회복 경로 및 법인 범위 비교"
    notes={<><p><b>전망 전제:</b> 회사 계획 원본 · 수주·수익 실현 확정과 구분 · 감사보고서 원문 독립 대사 전</p><p><b>2025 비용:</b> 템스코 영업 대손상각비 {money(period('parent', 2025).badDebtOperating?.eok ?? null)}억 포함 · 2026E 대손상각비 0: 회사 가정</p></>}
    cells="모회사 E/H/K/N/Q/T열 8·21행 및 H18 · 연결 I/M/Q/U/Y/AC열 10·23행 · 자회사 E21">
    <div className="flex items-center justify-between mb-4"><SeriesLegend /><span className="text-[12px] text-slate-500">E: 회사 전망 · 손실: 음수 표시</span></div>
    <div className="grid grid-cols-2 gap-7"><TrendChart metric="revenue" title="매출 규모" /><TrendChart metric="ebit" title="영업손익" /></div>
    <div className="mt-4 border-y border-amber-200 bg-amber-50 px-4 py-3 flex justify-between items-center gap-4">
      <span className="text-[13px] font-bold" style={{ color: palette.gold }}>2026E 영업손익 연결</span>
      <span className="text-[16px] font-bold tabular-nums" style={{ color: palette.navy }}>별도 {money(value('parent', 2026, 'ebit'))} <span className="mx-2 text-slate-400">+</span> 위폼스 <span style={{ color: palette.loss }}>{money(value('subsidiary', 2026, 'ebit'))}</span> <span className="mx-2 text-slate-400">=</span> 연결 {money(value('consolidated', 2026, 'ebit'))}억</span>
    </div>
  </Frame>
}

function RevenueBridge({ year }: { year: number }) {
  const parent = value('parent', year, 'revenue')
  const subsidiary = value('subsidiary', year, 'revenue')
  const adjustment = elimination(year)
  const removed = adjustment.eok as number
  const group = value('consolidated', year, 'revenue')
  const steps = [
    { label: '템스코 별도', start: 0, end: parent, amount: parent, color: palette.navy, cell: period('parent', year).revenue },
    { label: '위폼스 가산', start: parent, end: parent + subsidiary, amount: subsidiary, color: palette.cyan, cell: period('subsidiary', year).revenue },
    { label: '내부거래 제거', start: parent + subsidiary, end: parent + subsidiary + removed, amount: removed, color: palette.gold, cell: adjustment },
    { label: '연결 매출', start: 0, end: group, amount: group, color: palette.navy, cell: period('consolidated', year).revenue },
  ]
  const y = (amount: number) => 25 + (1_200 - amount) / 1_200 * 140
  const x = (index: number) => 42 + index * 122
  return <div className="border-t border-slate-200 pt-2">
    <div className="flex justify-between items-baseline"><h3 className="text-[20px] font-black" style={{ color: palette.navy }}>{yearLabel(year)}</h3><span className="text-[11px] text-slate-500">회사 전망 · 공통 축 0–1,200억</span></div>
    <svg viewBox="0 0 510 205" className="w-full h-[197px]" role="img" aria-labelledby={`source-bridge-${year}-title source-bridge-${year}-desc`}>
      <title id={`source-bridge-${year}-title`}>{`${yearLabel(year)} 연결 매출 조정`}</title>
      <desc id={`source-bridge-${year}-desc`}>템스코 {money(parent)}억 + 위폼스 {money(subsidiary)}억 − 내부거래 {money(Math.abs(removed))}억 = 연결 {money(group)}억. 원본 반올림 전 합산 기준.</desc>
      <path d={`M19 ${y(0)} H505`} stroke="#9babb9" />
      {steps.map((step, index) => <g key={step.label}>
        {index < 3 && <path d={`M${x(index) + 58} ${y(step.end)} H${x(index + 1)}`} stroke="#b0bfcc" strokeDasharray="3 3" />}
        <rect x={x(index)} y={Math.min(y(step.start), y(step.end))} width="58" height={Math.abs(y(step.start) - y(step.end))} fill={step.color} opacity={index === 3 ? 1 : 0.82}><title>{cellReference(step.cell)}</title></rect>
        <text x={x(index) + 29} y={Math.min(y(step.start), y(step.end)) - 8} textAnchor="middle" fontSize="15" fontWeight="800" fill={step.color}>{index === 1 ? '+' : ''}{money(step.amount)}</text>
        <text x={x(index) + 29} y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">{step.label}</text>
      </g>)}
    </svg>
  </div>
}

function Revenue() {
  return <Frame title="법인별 매출 및 내부거래 조정" subtitle="템스코 별도 매출 + 위폼스 매출 − 내부거래 중복 = 연결 외부 매출 · 2026E–2029E 회사 계획"
    notes={<><p><b>조정 범위:</b> 양방향 내부거래 매출 제거 · 동일 금액의 원가 제거 · 제거액과 추가 이익의 구분</p><p><b>계획 전제:</b> 회사 전망 원본 유지 · 미실현 재고이익·PPA 등 추가 연결조정의 검증 필요 · 표시 차이: 소수점 반올림</p></>}
    cells="모회사 K/N/Q/T8 · 자회사 E/F/G/H8 · 연결 P/T/X/AB10(제거), Q/U/Y/AC10(연결)">
    <div className="grid grid-cols-2 gap-x-8 gap-y-3">{forecastYears.map(year => <RevenueBridge key={year} year={year} />)}</div>
  </Frame>
}

const incomeRows: { label: string; key: IncomeKey | 'operatingMargin'; emphasis?: boolean }[] = [
  { label: '매출액', key: 'revenue', emphasis: true },
  { label: '매출원가', key: 'cogs' },
  { label: '매출총이익', key: 'grossProfit', emphasis: true },
  { label: '판매관리비', key: 'sga' },
  { label: '영업손익', key: 'ebit', emphasis: true },
  { label: '영업이익률', key: 'operatingMargin' },
  { label: '영업외손익', key: 'nonOperatingNet' },
  { label: '세전손익', key: 'ebt', emphasis: true },
  { label: '법인세비용', key: 'tax' },
  { label: '당기순손익', key: 'netIncome', emphasis: true },
]

function IncomeTable({ entity }: { entity: 'parent' | 'consolidated' }) {
  const name = entity === 'parent' ? '템스코 별도' : '연결'
  return <div className="min-w-0">
    <div className="flex justify-between items-center border-b-2 pb-2 mb-2" style={{ borderColor: entity === 'parent' ? palette.navy : palette.cyan }}>
      <h3 className="text-[21px] font-black" style={{ color: entity === 'parent' ? palette.navy : palette.cyan }}>{name}</h3><span className="text-[11px] text-slate-500">{entity === 'parent' ? '템스코 법인 기준' : '양사 + 연결조정 기준'}</span>
    </div>
    <table className="w-full table-fixed border-collapse text-[13px] tabular-nums" aria-label={`${name} 2024~2029년 손익계산서, 금액 단위 억원`}>
      <colgroup><col style={{ width: '23%' }} />{years.map(year => <col key={year} />)}</colgroup>
      <thead>
        <tr className="text-[10.5px] text-slate-500"><th scope="col" rowSpan={2} className="text-left font-medium border-b border-slate-300">손익 항목</th><th scope="colgroup" colSpan={2} className="bg-slate-100 py-1.5">회사 제공 과거자료</th><th scope="colgroup" colSpan={4} className="bg-cyan-50 text-cyan-700 py-1.5">회사 전망</th></tr>
        <tr className="border-b border-slate-300 text-[11px]">{years.map(year => <th scope="col" key={year} className={`text-right py-2 pr-1.5 ${year >= 2026 ? 'text-cyan-700 bg-cyan-50' : 'text-slate-600 bg-slate-100'}`}>{yearLabel(year)}</th>)}</tr>
      </thead>
      <tbody>{incomeRows.map(row => <tr key={row.key} className={`border-b border-slate-200 ${row.emphasis ? 'bg-slate-50 font-bold' : ''}`}>
        <th scope="row" className={`text-left py-[9px] whitespace-nowrap ${row.emphasis ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{row.label}</th>
        {years.map(year => {
          const current = period(entity, year)
          const amount = row.key === 'operatingMargin' ? value(entity, year, 'ebit') / value(entity, year, 'revenue') * 100 : current[row.key].eok
          const reference = row.key === 'operatingMargin' ? `${cellReference(current.ebit)} ÷ ${cellReference(current.revenue)}` : cellReference(current[row.key])
          return <td key={year} title={reference} className={`text-right pr-1.5 py-[9px] whitespace-nowrap ${year === 2026 ? 'bg-cyan-50/60' : ''}`} style={{ color: amount !== null && amount < 0 ? palette.loss : row.key === 'netIncome' ? palette.navy : undefined }}>{money(amount)}{row.key === 'operatingMargin' && amount !== null ? '%' : ''}</td>
        })}
      </tr>)}</tbody>
    </table>
  </div>
}

function Income() {
  return <Frame title="별도·연결 추정손익계산서" subtitle="동일 연도·동일 단위의 법인 범위 비교 · 회사 원본 손익 유지 · 가치평가용 재산정 손익과 구분"
    notes={<><p><b>원본 범위:</b> 2024–2025 제공 과거자료 / 2026E–2029E 회사 계획 · 연결 순손익: 비지배지분 차감 전 전체 손익</p><p><b>세금·상각:</b> 회사 세금 가정·위폼스 2027 세금 미계상 유지 · 총 D&amp;A 미분리 · DCF용 법인별 세액·상각 재산정과 구분</p></>}
    cells="모회사 E/H/K/N/Q/T열 8·12·13·20·21·29·30·31·32행 · 연결 I/M/Q/U/Y/AC열 10·14·15·22·23·31·32·33·34행">
    <div className="grid grid-cols-2 gap-6"><IncomeTable entity="parent" /><IncomeTable entity="consolidated" /></div>
  </Frame>
}

export function FinancialSourceSlide({ kind }: { kind: 'turnaround' | 'revenue' | 'income' }) {
  if (kind === 'turnaround') return <Turnaround />
  if (kind === 'revenue') return <Revenue />
  return <Income />
}
