import type { ReactNode } from 'react'
import sourceJson from './financialDisplayData.json'
import { companyForecastEndYear } from './valuationInputs'
import styles from './FinancialSourceSlides.module.css'

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
const years = Array.from({ length: companyForecastEndYear - 2023 + 1 }, (_, index) => 2023 + index)
const forecastYears = years.filter(year => year >= 2026)
const actualYears = years.filter(year => year < 2026)
const palette = { navy: '#18344f', cyan: '#0891b2', gold: '#ad7a16', loss: '#b42332', grid: '#dbe3ea' }
const numberFormat = new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const money = (value: number | null) => value === null ? '—' : numberFormat.format(value)
const yearLabel = (year: number) => `${year}${year >= 2026 ? 'E' : ''}`

function period(entity: Entity, year: number): IncomePeriod {
  const row = source.entities[entity].incomeStatement.find(item => item.year === year)
  if (!row) throw new Error(`V5 회사 원본 손익 누락: ${entity} ${year}`)
  return row
}

function value(entity: Entity, year: number, key: IncomeKey): number {
  const amount = period(entity, year)[key].eok
  if (amount === null || !Number.isFinite(amount)) throw new Error(`V5 회사 원본 수치 누락: ${entity} ${year} ${key}`)
  return amount
}

function cellReference(amount: Amount): string {
  return amount.sources.map(cell => `${cell.fileId} ${cell.sheet}!${cell.cell}`).join(' · ')
}

function elimination(year: number): Amount {
  const amount = source.consolidationAdjustments.find(row => row.year === year)?.rawAdjustmentLines.revenue
  if (!amount || amount.eok === null || !Number.isFinite(amount.eok)) throw new Error(`V5 연결 매출 조정 누락: ${year}`)
  return amount
}

function Frame({ title, subtitle, children, notes, cells, showSource = true, showRoundingBasis = true, showHeaderUnit = true }: {
  title: string; subtitle?: string; children: ReactNode; notes?: ReactNode; cells: string; showSource?: boolean; showRoundingBasis?: boolean; showHeaderUnit?: boolean
}) {
  return <div className="slide-content p-8 h-full flex flex-col bg-white text-slate-800" data-financial-source data-source-cells={cells}>
    <div className="shrink-0 border-b-[3px] border-cyan-600 pb-3 mb-4">
      <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold tracking-[0.12em] text-cyan-700">
        <span>FINANCIAL PERFORMANCE · COMPANY SOURCE</span>{showHeaderUnit && <span className="tracking-normal text-slate-500">단위: 억 원{showRoundingBasis ? ' · 반올림 전 원본 기준' : ''}</span>}
      </div>
      <h2 className="text-[28px] leading-[1.2] font-black tracking-tight" style={{ color: palette.navy }}>{title}</h2>
      {subtitle && <p className="mt-2 text-[13px] leading-[1.45] text-slate-600">{subtitle}</p>}
    </div>
    <div data-valuation-body className="flex-1 min-h-0">{children}</div>
    {(notes || showSource) && <div className="shrink-0 border-t border-slate-200 pt-2 mt-3 pr-10 text-[11px] leading-[1.5] text-slate-600" data-financial-source-notes data-valuation-notes>
      {notes}
      {showSource && <p className="mt-1 text-[10.5px] text-slate-500">출처: 회사 제공 모회사·자회사·연결 추정손익</p>}
    </div>}
  </div>
}

function SeriesLegend() {
  return <div className="flex items-center gap-5 text-[12px] font-bold">
    <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block" style={{ backgroundColor: palette.navy }} />템스코 개별</span>
    <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block" style={{ backgroundColor: palette.cyan }} />연결</span>
  </div>
}

function TrendChart({ metric, title }: { metric: 'revenue' | 'ebit'; title: string }) {
  const amounts = years.flatMap(year => (['parent', 'consolidated'] as const).flatMap(entity => entity === 'consolidated' && year === 2023 ? [] : [value(entity, year, metric)]))
  const step = metric === 'revenue' ? 300 : 100
  const minimum = Math.min(0, Math.floor(Math.min(...amounts) / step) * step)
  const maximum = Math.max(step, Math.ceil(Math.max(...amounts) / step) * step)
  const ticks = Array.from({ length: (maximum - minimum) / step + 1 }, (_, index) => minimum + index * step)
  const y = (amount: number) => 38 + (maximum - amount) / (maximum - minimum) * 332
  const groupWidth = 461 / years.length
  const x = (index: number) => 40 + groupWidth * (index + 0.5)
  const barWidth = Math.min(19, groupWidth * 0.30)
  const forecastStartX = 40 + groupWidth * actualYears.length
  const zero = y(0)
  return <div className={styles.trendChart}>
    <div className="flex items-baseline justify-between mb-1"><h3 className="text-[19px] font-black" style={{ color: palette.navy }}>{title}</h3><span className="text-[11px] text-slate-500">단위: 억원</span></div>
    <svg viewBox="0 0 510 410" className={styles.trendPlot} role="img" aria-labelledby={`source-trend-${metric}-title source-trend-${metric}-desc`}>
      <title id={`source-trend-${metric}-title`}>{`2023~${companyForecastEndYear}년 템스코 개별 및 연결 ${title}`}</title>
      <desc id={`source-trend-${metric}-desc`}>{`2023~2025년 실적 · 2023년은 템스코 개별만 표시, 2026~${companyForecastEndYear}년 추정. 네이비 막대: 템스코 개별. 청록 막대: 연결. 연도별 수치: 바로 아래 표.`}</desc>
      <rect x={forecastStartX} y="30" width={501 - forecastStartX} height="348" fill="#edf8fb" />
      {ticks.map(tick => <g key={tick}>
        <path d={`M40 ${y(tick)} H501`} stroke={tick === 0 ? '#8192a3' : palette.grid} strokeWidth={tick === 0 ? 1.2 : 0.8} />
        <text x="33" y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#64748b">{tick}</text>
      </g>)}
      {years.map((year, index) => <g key={year}>
        {(['parent', 'consolidated'] as const).map((entity, position) => {
          if (entity === 'consolidated' && year === 2023) return null
          const amount = value(entity, year, metric)
          return <rect key={entity} x={x(index) - barWidth - 1.5 + position * (barWidth + 3)} y={Math.min(zero, y(amount))} width={barWidth} height={Math.abs(zero - y(amount))} fill={entity === 'parent' ? palette.navy : palette.cyan} opacity={year < 2026 ? 0.72 : 1}>
            <title>{`${yearLabel(year)} ${entity === 'parent' ? '템스코 개별' : '연결'} ${money(amount)}억 원`}</title>
          </rect>
        })}
        <text x={x(index)} y="399" textAnchor="middle" fontSize="11" fontWeight="700" fill={year >= 2026 ? palette.cyan : '#64748b'}>{yearLabel(year)}</text>
      </g>)}
    </svg>
    <table className="mt-6 shrink-0 w-full table-fixed border-collapse text-[11px] tabular-nums" aria-label={`${title} 연도별 수치, 2023~${companyForecastEndYear}년, 단위 억원`}>
      <colgroup><col style={{ width: '12%' }} />{years.map(year => <col key={year} />)}</colgroup>
      <thead><tr className="border-y border-slate-200 bg-slate-50 text-[10.5px] text-slate-500"><th scope="col" className="py-1 text-left">구분</th>{years.map(year => <th scope="col" key={year} className="text-right pr-1 py-1">{yearLabel(year)}</th>)}</tr></thead>
      <tbody>{(['parent', 'consolidated'] as const).map(entity => <tr key={entity} className="border-b border-slate-200">
        <th scope="row" className="text-left py-2 font-bold" style={{ color: entity === 'parent' ? palette.navy : palette.cyan }}>{entity === 'parent' ? '개별' : '연결'}</th>
        {years.map(year => entity === 'consolidated' && year === 2023 ? <td key={year} className="py-2 pr-1 text-right text-slate-400" title="2023년 연결 해당 없음">—</td> : <td key={year} title={cellReference(period(entity, year)[metric])} className="py-2 pr-1 text-right font-semibold" style={{ color: value(entity, year, metric) < 0 ? palette.loss : undefined }}>{money(value(entity, year, metric))}</td>)}
      </tr>)}</tbody>
    </table>
  </div>
}

function OperatingProfitBridge() {
  const rows: { entity: Entity; label: string; marker: string }[] = [
    { entity: 'parent', label: '템스코 개별 영업이익', marker: '' },
    { entity: 'subsidiary', label: '위폼스 영업이익', marker: '+' },
    { entity: 'consolidated', label: '연결 영업이익', marker: '=' },
  ]
  return <section className={styles.profitBridge} aria-labelledby="v5-profit-bridge-title" data-profit-bridge>
    <div className={styles.profitBridgeHeading}>
      <h3 id="v5-profit-bridge-title">{`2026–${companyForecastEndYear} 영업이익 연결 내역`}</h3>
      <span>단위: 억원</span>
    </div>
    <table className={styles.profitBridgeTable} aria-label={`2026~${companyForecastEndYear}년 템스코 개별·위폼스 영업이익 합산 및 연결 영업이익, 단위 억원`}>
      <colgroup><col style={{ width: '28%' }} />{forecastYears.map(year => <col key={year} />)}</colgroup>
      <thead><tr><th scope="col">영업이익 구성</th>{forecastYears.map(year => <th scope="col" key={year}>{yearLabel(year)}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row.entity} data-profit-bridge-entity={row.entity} className={row.entity === 'consolidated' ? styles.profitBridgeTotal : undefined}>
        <th scope="row"><span className={styles.profitBridgeOperator} aria-hidden="true">{row.marker}</span>{row.label}</th>
        {forecastYears.map(year => {
          const amount = period(row.entity, year).ebit
          return <td key={year} data-year={year} title={cellReference(amount)} style={amount.eok !== null && amount.eok < 0 ? { color: palette.loss } : undefined}>{money(amount.eok)}</td>
        })}
      </tr>)}</tbody>
    </table>
  </section>
}

function Turnaround() {
  return <Frame showSource={false} showRoundingBasis={false} showHeaderUnit={false} title="매출 및 영업이익 추이"
    cells="모회사 B/E/H/K/N/Q/T/W열 8·21행 및 H18 · 연결 I/M/Q/U/Y/AC/AG열 10·23행">
    <div className={styles.trendLayout}>
    <div className="flex items-center mb-4"><SeriesLegend /></div>
    <div className={styles.trendGrid}><TrendChart metric="revenue" title="매출" /><TrendChart metric="ebit" title="영업이익" /></div>
    </div>
  </Frame>
}

function RevenueFlowIcon({ kind }: { kind: 'parent' | 'subsidiary' | 'adjustment' | 'external' }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'parent' && <><path d="M10 42V8h21v34M31 21h7v21M6 42h36" /><path d="M16 15h3m5 0h2m-10 7h3m5 0h2m-10 7h3m5 0h2M19 42v-7h6v7" /></>}
    {kind === 'subsidiary' && <><path d="M7 41V22l11-7v11l11-8v8h12v15H7ZM34 26V8h6v18" /><path d="M13 33h4m6 0h4m6 0h3M33 8h8" /></>}
    {kind === 'adjustment' && <><path d="M10 17h27l-5-5m5 5-5 5M38 32H11l5-5m-5 5 5 5" /><circle cx="24" cy="24" r="20" strokeDasharray="2 4" /></>}
    {kind === 'external' && <><circle cx="24" cy="24" r="18" /><ellipse cx="24" cy="24" rx="8" ry="18" /><path d="M7 18h34M7 30h34" /></>}
  </svg>
}

function ConsolidationFlow() {
  return <div className={styles.flow} role="group" aria-label="매출 및 영업이익 연결 흐름: 템스코와 위폼스의 매출·영업이익 합산, 내부거래 매출·원가 동일 금액 차감, 연결 실적 산출. 내부거래 중복 차감의 영업이익 영향 없음.">
    <div className={styles.entity}><span className={styles.icon}><RevenueFlowIcon kind="parent" /></span><h4>템스코</h4><p>매출·영업이익</p></div>
    <span className={styles.operator} aria-hidden="true">+</span>
    <div className={styles.entity}><span className={styles.icon}><RevenueFlowIcon kind="subsidiary" /></span><h4>위폼스</h4><p>매출·영업이익</p></div>
    <span className={styles.operator} aria-hidden="true">→</span>
    <div className={`${styles.entity} ${styles.adjustment}`}><span className={styles.icon}><RevenueFlowIcon kind="adjustment" /></span><h4>내부거래 조정</h4><p>매출·원가 동일 금액 차감<br />영업이익 영향 없음</p></div>
    <span className={styles.operator} aria-hidden="true">→</span>
    <div className={`${styles.entity} ${styles.external}`}><span className={styles.icon}><RevenueFlowIcon kind="external" /></span><h4>연결 실적</h4><p>매출·영업이익 산출</p></div>
  </div>
}

function Revenue() {
  const bridgeRows = [
    { label: '템스코 매출', marker: '', entity: 'parent' as const },
    { label: '위폼스 매출', marker: '+', entity: 'subsidiary' as const },
    { label: '법인 매출 합계', marker: '', entity: null },
    { label: '내부거래', marker: '', entity: null },
    { label: '연결 매출', marker: '=', entity: 'consolidated' as const },
  ]
  return <Frame showSource={false} showRoundingBasis={false} showHeaderUnit={false} title="매출 및 영업이익 연결 내역"
    cells="모회사 K/N/Q/T/W열 8·21행 · 자회사 E/F/G/H/I열 8·21행 · 연결 P/T/X/AB/AF10(제거), Q/U/Y/AC/AG열 10·23행(연결)">
    <div className={styles.revenueLayout}>
    <ConsolidationFlow />
    <div>
    <div className={styles.tableHeading}>
      <h3>{`2026–${companyForecastEndYear} 매출 연결 내역`}</h3>
      <span>E: 추정 · 단위: 억원</span>
    </div>
    <table className={styles.revenueTable} aria-label={`2026~${companyForecastEndYear}년 법인별 매출과 내부거래, 단위 억원`}>
      <colgroup><col style={{ width: '28%' }} />{forecastYears.map(year => <col key={year} />)}</colgroup>
      <thead><tr><th scope="col">매출 연결 항목</th>{forecastYears.map(year => <th scope="col" key={year}>{yearLabel(year)}</th>)}</tr></thead>
      <tbody>{bridgeRows.map((row, index) => <tr key={row.label} className={index === 4 ? 'border-t-2 border-cyan-700 bg-cyan-50 font-black' : `border-b border-slate-200 ${index === 2 ? 'bg-slate-50 font-semibold' : ''}`}>
        <th scope="row" style={{ color: index === 3 ? palette.gold : palette.navy }}><span className="inline-block w-5 text-slate-400">{row.marker}</span>{row.label}</th>
        {forecastYears.map(year => {
          const parent = period('parent', year).revenue
          const subsidiary = period('subsidiary', year).revenue
          const amount = row.entity ? period(row.entity, year).revenue : index === 2 ? { eok: (parent.eok as number) + (subsidiary.eok as number), sources: [...parent.sources, ...subsidiary.sources] } : elimination(year)
          return <td key={year} title={cellReference(amount)} style={{ color: index === 3 ? palette.gold : index === 4 ? palette.cyan : palette.navy }}>{money(amount.eok)}</td>
        })}
      </tr>)}</tbody>
    </table>
    </div>
    <OperatingProfitBridge />
    </div>
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
  const name = entity === 'parent' ? '템스코 개별' : '연결'
  return <div className="min-w-0">
    <div className="flex justify-between items-center border-b-2 pb-2 mb-2" style={{ borderColor: entity === 'parent' ? palette.navy : palette.cyan }}>
      <h3 className="text-[21px] font-black" style={{ color: entity === 'parent' ? palette.navy : palette.cyan }}>{name}</h3><span className="text-[11px] text-slate-500">단위: 억원</span>
    </div>
    <table className="w-full table-fixed border-collapse text-[11px] tabular-nums" aria-label={`${name} 2023~${companyForecastEndYear}년 손익계산서, 금액 단위 억원`}>
      <colgroup><col style={{ width: '19%' }} />{years.map(year => <col key={year} />)}</colgroup>
      <thead>
        <tr className="text-[10.5px] text-slate-500"><th scope="col" rowSpan={2} className="text-left font-medium border-b border-slate-300">손익 항목</th><th scope="colgroup" colSpan={actualYears.length} className="bg-slate-100 py-1.5">실적</th><th scope="colgroup" colSpan={forecastYears.length} className="bg-cyan-50 text-cyan-700 py-1.5">추정</th></tr>
        <tr className="border-b border-slate-300 text-[10.5px]">{years.map(year => <th scope="col" key={year} className={`text-right py-2 pr-1 ${year >= 2026 ? 'text-cyan-700 bg-cyan-50' : 'text-slate-600 bg-slate-100'}`}>{yearLabel(year)}</th>)}</tr>
      </thead>
      <tbody>{incomeRows.map(row => <tr key={row.key} className={`border-b border-slate-200 ${row.emphasis ? 'bg-slate-50 font-bold' : ''}`}>
        <th scope="row" className={`text-left py-[15px] whitespace-nowrap ${row.emphasis ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{row.label}</th>
        {years.map(year => {
          if (entity === 'consolidated' && year === 2023) return <td key={year} className="text-right pr-1 py-[15px] text-slate-400" title="2023년 연결 해당 없음">—</td>
          const current = period(entity, year)
          const amount = row.key === 'operatingMargin' ? value(entity, year, 'ebit') / value(entity, year, 'revenue') * 100 : current[row.key].eok
          const reference = row.key === 'operatingMargin' ? `${cellReference(current.ebit)} ÷ ${cellReference(current.revenue)}` : cellReference(current[row.key])
          return <td key={year} title={reference} className={`text-right pr-1 py-[15px] whitespace-nowrap ${year === companyForecastEndYear ? 'bg-cyan-50/60' : ''}`} style={{ color: amount !== null && amount < 0 ? palette.loss : row.key === 'netIncome' ? palette.navy : undefined }}>{money(amount)}{row.key === 'operatingMargin' && amount !== null ? '%' : ''}</td>
        })}
      </tr>)}</tbody>
    </table>
  </div>
}

function Income() {
  return <Frame showSource={false} showHeaderUnit={false} title="개별·연결 추정손익계산서"
    cells="모회사 B/E/H/K/N/Q/T/W열 8·12·13·20·21·29·30·31·32행 · 연결 I/M/Q/U/Y/AC/AG열 10·14·15·22·23·31·32·33·34행">
    <div className="grid grid-cols-2 gap-6 pt-4"><IncomeTable entity="parent" /><IncomeTable entity="consolidated" /></div>
  </Frame>
}

export function FinancialSourceSlide({ kind }: { kind: 'turnaround' | 'revenue' | 'income' }) {
  if (kind === 'turnaround') return <Turnaround />
  if (kind === 'revenue') return <Revenue />
  return <Income />
}
