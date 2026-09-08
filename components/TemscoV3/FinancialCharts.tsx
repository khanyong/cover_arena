import { fmt, signed } from './financials'

const palette = { blue: '#2358cf', navy: '#172d4f', teal: '#148579', red: '#b65353', grid: '#dde3eb', muted: '#69768a' }
export type Step = { label: string; value: number; total?: boolean }

export function Waterfall({ steps, label, height = 310 }: { steps: Step[]; label: string; height?: number }) {
  let running = 0
  const data = steps.map(step => {
    const start = step.total ? 0 : running
    const end = step.total ? step.value : running + step.value
    running = end
    return { ...step, start, end }
  })
  const min = Math.min(0, ...data.flatMap(d => [d.start, d.end]))
  const max = Math.max(...data.flatMap(d => [d.start, d.end]))
  const span = max - min || 1
  const top = 35, bottom = height - 52, left = 24, width = 970
  const y = (v: number) => top + (max - v) / span * (bottom - top)
  const stepWidth = (width - left * 2) / steps.length
  const barWidth = Math.min(108, stepWidth * .61)
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} style={{ width: '100%', height: 'auto' }}>
    <title>{label}</title><desc>{data.map(d => `${d.label}: ${signed(d.value)}억 원`).join(', ')}</desc>
    <line x1={left} x2={width - left} y1={y(0)} y2={y(0)} stroke={palette.grid} />
    {data.map((d, i) => {
      const x = left + stepWidth * i + (stepWidth - barWidth) / 2
      const positive = d.value >= 0
      return <g key={d.label}>
        {i < data.length - 1 && <line x1={x + barWidth} x2={x + stepWidth} y1={y(d.end)} y2={y(d.end)} stroke="#a8b3c3" strokeDasharray="3 3" />}
        <rect x={x} y={Math.min(y(d.start), y(d.end))} width={barWidth} height={Math.max(2, Math.abs(y(d.end) - y(d.start)))} fill={d.total ? palette.blue : positive ? palette.teal : palette.red} />
        <text x={x + barWidth / 2} y={Math.min(y(d.start), y(d.end)) - 10} textAnchor="middle" fill={d.total ? palette.navy : positive ? palette.teal : palette.red} fontSize={18} fontWeight={700}>{d.total ? fmt(d.value, 2) : signed(d.value, 2)}</text>
        <text x={x + barWidth / 2} y={height - 24} textAnchor="middle" fill={palette.muted} fontSize={14}>{d.label}</text>
      </g>
    })}
  </svg>
}

export function TrendChart({ years, series, label, height = 295 }: {
  years: string[]; series: { name: string; values: number[]; color?: string }[]; label: string; height?: number
}) {
  const width = 930, left = 56, right = 54, top = 38, bottom = height - 68
  const all = series.flatMap(s => s.values), min = Math.min(0, ...all), max = Math.max(...all)
  const y = (value: number) => top + (max - value) / (max - min || 1) * (bottom - top)
  const x = (index: number) => left + index / Math.max(1, years.length - 1) * (width - left - right)
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} style={{ width: '100%', height: 'auto' }}>
    <title>{label}</title><desc>{series.map(s => `${s.name}: ${s.values.map((v, i) => `${years[i]} ${fmt(v)}억 원`).join(', ')}`).join('; ')}</desc>
    <line x1={left} x2={width - right} y1={y(0)} y2={y(0)} stroke={palette.grid} />
    {years.map((year, i) => <text key={year} x={x(i)} y={height - 14} fontSize={15} textAnchor="middle" fill={palette.muted}>{year}</text>)}
    {series.map((s, k) => <g key={s.name}>
      {s.values.slice(1).map((value, i) => <line key={i} x1={x(i)} x2={x(i + 1)} y1={y(s.values[i])} y2={y(value)} stroke={s.color || palette.blue} strokeWidth={3} strokeDasharray={years[i + 1].endsWith('E') ? '6 5' : undefined} />)}
      {s.values.map((value, i) => <g key={i}><circle cx={x(i)} cy={y(value)} r={4} fill={s.color || palette.blue} /><text x={x(i)} y={y(value) - (k === 1 ? -24 : 13)} textAnchor="middle" fontSize={17} fontWeight={650} fill={s.color || palette.blue}>{fmt(value)}</text></g>)}
    </g>)}
  </svg>
}
