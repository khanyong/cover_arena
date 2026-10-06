import { acquisitionValue as model } from './acquisitionValue'
import { formatEok as money, inEok } from './transactionFinancials'

function SynergyPathways() {
  return <svg viewBox="0 0 1027 158" className="w-full h-[150px] shrink-0" role="img" aria-labelledby="acquisition-path-title acquisition-path-desc">
    <title id="acquisition-path-title">원재료 조달과 차세대 기술의 상호 시너지</title>
    <desc id="acquisition-path-desc">템스코에서 위폼스로 소재 조달·물류 경쟁력 전달, 위폼스에서 템스코로 G6 양산 및 8세대급 개발·제조 역량 연계. 직접재료비율 2023년 53%에서 2025년 24%, 회사 제시 마스크 매출 2023년 110억원에서 2030년 전망 582억원.</desc>
    <defs>{[['procurement', '#047857'], ['development', '#6d28d9']].map(([id, color]) => <marker key={id} id={`value-arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={color} /></marker>)}</defs>
    <rect x="0.5" y="4" width="225" height="146" rx="8" fill="#eff6ff" stroke="#93c5fd" />
    <text x="20" y="36" fontSize="25" fontWeight="900" fill="#1d4ed8">템스코 <tspan fontSize="12">TEMSCO</tspan></text>
    <text x="20" y="61" fontSize="11" fontWeight="700" fill="#1e40af">소재 조달 · 물류 · 코팅 · 세정 · 판매</text>
    <path d="M20 76 H205" stroke="#bfdbfe" />
    <text x="20" y="99" fontSize="12" fill="#334155">LGD · 중국 Visionox, CSOT</text>
    <text x="20" y="122" fontSize="12" fill="#334155">직접판매</text>
    <rect x="801.5" y="4" width="225" height="146" rx="8" fill="#f5f3ff" stroke="#c4b5fd" />
    <text x="821" y="36" fontSize="25" fontWeight="900" fill="#6d28d9">위폼스 <tspan fontSize="12">WeFOMS</tspan></text>
    <text x="821" y="61" fontSize="12" fontWeight="700" fill="#6d28d9">마스크 설계 · 제조 · 품질</text>
    <path d="M821 76 H1006" stroke="#ddd6fe" />
    <text x="821" y="99" fontSize="12" fill="#334155">G6H 양산 공급 역량</text>
    <text x="821" y="122" fontSize="12" fill="#334155">8세대급 개발</text>
    <text x="821" y="140" fontSize="11" fontWeight="700" fill="#6d28d9">SDC 양산공급업체 등록</text>
    <text x="514" y="23" fontSize="14" fontWeight="900" textAnchor="middle" fill="#047857">① 원재료 직조달 · 물류 통합 → 위폼스 원가 경쟁력</text>
    <path d="M236 38 H790" stroke="#047857" strokeWidth="2" markerEnd="url(#value-arrow-procurement)" />
    <text x="514" y="60" fontSize="12" textAnchor="middle" fill="#334155">직접재료비율 53% (&apos;23년) → 24% (&apos;25년)</text>
    <text x="514" y="91" fontSize="14" fontWeight="900" textAnchor="middle" fill="#6d28d9">② 제조·개발 협업 → 템스코 차세대 마스크 매출 기반</text>
    <path d="M790 107 H236" stroke="#6d28d9" strokeWidth="2" markerEnd="url(#value-arrow-development)" />
    <text x="514" y="132" fontSize="12" textAnchor="middle" fill="#334155">마스크부문 매출 110억 (&apos;23년) → 582억 (&apos;30년 전망)</text>
  </svg>
}

function ProfitTrajectory() {
  const values = model.annual.flatMap(row => [inEok(row.wefoms.operatingProfit), inEok(row.cumulative.wefoms)])
  const minimum = Math.min(0, Math.floor(Math.min(...values) / 50) * 50)
  const maximum = Math.max(100, Math.ceil(Math.max(...values, inEok(model.consideration)) / 50) * 50)
  const ticks = Array.from({ length: (maximum - minimum) / 50 + 1 }, (_, index) => minimum + index * 50)
  const groupWidth = 621 / model.annual.length
  const x = (i: number) => 29 + groupWidth * (i + 0.5)
  const y = (won: number) => 29 + (maximum - inEok(won)) / (maximum - minimum) * 139
  const forecastStart = 29 + groupWidth * model.annual.filter(row => !row.forecast).length
  const zero = y(0)
  const cumulativePath = model.annual.map((r, i) => `${i ? 'L' : 'M'}${x(i)} ${y(r.cumulative.wefoms)}`).join(' ')
  return <svg viewBox="0 0 680 198" className="w-full h-[190px]" role="img" aria-labelledby="value-trajectory-title value-trajectory-desc">
    <title id="value-trajectory-title">위폼스 연간 및 누적 영업손익, 2023년부터 연간 합산</title>
    <desc id="value-trajectory-desc">2023~2025년 실적과 2026~{model.finalForecast.year}년 추정의 구분. 2023년 인수 전 실적 포함. 2025년 누적 영업손익 {money(model.latestHistorical.cumulative.wefoms)}억원, {model.finalForecast.year}년 추정 포함 누적 영업손익 {money(model.finalForecast.cumulative.wefoms)}억원. 취득대가 90억원 참조선은 현금회수 기준이 아님. 상세 연도별 값은 아래 표.</desc>
    <rect x={forecastStart} y="20" width={650 - forecastStart} height="157" fill="#eff6ff" rx="5" />
    <text x="110" y="13" fontSize="10.5" fontWeight="700" fill="#64748b">실적 · 2023년 인수 전</text>
    <text x={forecastStart + 20} y="13" fontSize="10.5" fontWeight="700" fill="#2563eb">2026–{model.finalForecast.year} · 추정</text>
    {ticks.map(tick => <g key={tick}>
      <path d={`M29 ${y(tick * 100_000_000)} H650`} stroke={tick === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={tick === 0 ? 1.2 : 0.8} />
      <text x="23" y={y(tick * 100_000_000) + 3} fontSize="9.5" fill="#94a3b8" textAnchor="end">{tick}</text>
    </g>)}
    <path d={`M29 ${y(model.consideration)} H650`} stroke="#a16207" strokeWidth="1.2" strokeDasharray="5 4" />
    <g data-acquisition-consideration>
      <path d={`M145 ${y(model.consideration)} V50`} stroke="#a16207" strokeWidth="1.2" />
      <rect x="43" y="50" width="194" height="48" rx="5" fill="#fffbeb" stroke="#fcd34d" />
      <text x="55" y="65" fontSize="10" fontWeight="700" fill="#92400e">2024.03 · 위폼스 인수가액</text>
      <text x="55" y="89" fontSize="23" fontWeight="900" fill="#92400e">{inEok(model.consideration).toLocaleString('ko-KR')}<tspan dx="4" fontSize="13">억 원</tspan></text>
      <text x="225" y="88" fontSize="9.5" fontWeight="700" fill="#a16207" textAnchor="end">규모 비교 기준</text>
    </g>
    {model.annual.map((r, i) => <g key={r.year}>
      <rect x={x(i) - 20} y={Math.min(zero, y(r.wefoms.operatingProfit))} width="40" height={Math.abs(zero - y(r.wefoms.operatingProfit))} rx="2" fill={r.wefoms.operatingProfit < 0 ? '#fca5a5' : r.forecast ? '#93c5fd' : '#2563eb'} />
      <text x={x(i)} y="193" textAnchor="middle" fontSize="11" fontWeight="700" fill={r.forecast ? '#2563eb' : '#475569'}>{r.year}{r.forecast ? 'E' : ''}</text>
    </g>)}
    <path d={cumulativePath} fill="none" stroke="#6d28d9" strokeWidth="2.5" />
    {model.annual.map((r, i) => <circle key={r.year} cx={x(i)} cy={y(r.cumulative.wefoms)} r="3.5" fill="white" stroke="#6d28d9" strokeWidth="2" />)}
    <text x={x(2)} y={y(model.latestHistorical.cumulative.wefoms) + 25} fontSize="11" fontWeight="900" fill="#6d28d9" textAnchor="middle">{money(model.latestHistorical.cumulative.wefoms)}</text>
    <text x={x(model.annual.length - 1) + 12} y={y(model.finalForecast.cumulative.wefoms) + 20} fontSize="12" fontWeight="900" fill="#6d28d9">{money(model.finalForecast.cumulative.wefoms)}</text>
  </svg>
}

function AnnualProfitTable() {
  const rows = [
    { label: '템스코 · 연간 영업손익', values: model.annual.map(r => r.temsco.operatingProfit) },
    { label: '템스코 · 누적 영업손익', values: model.annual.map(r => r.cumulative.temsco), cumulative: true },
    { label: '위폼스 · 연간 영업손익', values: model.annual.map(r => r.wefoms.operatingProfit) },
    { label: '위폼스 · 누적 영업손익', values: model.annual.map(r => r.cumulative.wefoms), cumulative: true },
    { label: '연결 · 연간 영업손익', values: model.annual.map(r => r.consolidated.operatingProfit) },
    { label: '연결 · 누적 영업손익', values: model.annual.map(r => r.cumulative.consolidated), cumulative: true },
  ]
  return <table className="w-full table-fixed border-collapse text-[12px] tabular-nums" aria-label={`2023~${model.finalForecast.year}년 법인별 및 연결 연간·누적 영업손익, 단위 억원`}>
    <colgroup><col style={{ width: '24%' }} />{model.annual.map(row => <col key={row.year} />)}</colgroup>
    <thead className="border-y border-slate-300 bg-slate-100 text-slate-600">
      <tr><th scope="col" className="text-left py-1.5 pl-2">법인별 손익 · 억 원</th>{model.annual.map(r => <th key={r.year} scope="col" className={`text-right py-1.5 pr-3 ${r.forecast ? 'text-blue-700' : ''}`}>{r.year}{r.forecast ? 'E' : ''}</th>)}</tr>
    </thead>
    <tbody>{rows.map(row => <tr key={row.label} className={row.cumulative ? 'bg-blue-50 border-b border-slate-200 font-bold' : 'border-b border-slate-100'}>
      <th scope="row" className={`text-left py-1 pl-2 text-slate-700 ${row.cumulative ? 'font-bold' : 'font-medium'}`}>{row.label}</th>{row.values.map((value, i) => <td key={i} className={`text-right py-1 pr-3 ${value < 0 ? 'text-red-700' : row.cumulative ? 'text-blue-800' : 'text-slate-700'}`}>{money(value)}</td>)}
    </tr>)}</tbody>
  </table>
}

export default function AcquisitionValueSlide() {
  return <div className="h-full px-12 pt-6 pb-12 flex flex-col" data-acquisition-value>
    <div className="border-b-4 border-blue-600 pb-2 mb-2">
      <div className="min-w-0"><p className="text-[11px] tracking-[0.14em] text-blue-700 font-bold mb-1">ACQUISITION RATIONALE · 2023–{model.finalForecast.year}</p><h2 className="text-[29px] leading-tight whitespace-nowrap font-black text-slate-800 tracking-tight">위폼스 인수 시너지: 원가 경쟁력·차세대 매출 기반</h2></div>
    </div>
    <SynergyPathways />
    <div className="grid grid-cols-[2.15fr_1fr] gap-5 items-center mt-2 mb-3">
      <div>
        <div className="flex justify-between items-center mb-1"><h3 className="text-[14px] font-black text-slate-800">위폼스 수익성 회복 경로</h3><div className="text-[10px] flex gap-3"><span className="text-blue-600">▮ 연간 영업이익</span><span className="text-violet-700">● 누적 영업이익</span></div></div>
        <ProfitTrajectory />
      </div>
      <div className="border-l border-slate-200 pl-5 pt-0.5 text-[10px]">
        <p className="text-[11px] font-bold text-slate-500 mb-1">위폼스 2023년부터 연간 누적 영업이익</p>
        <div className="flex items-center justify-between py-1 border-b border-slate-200"><div className="text-[11px] text-slate-600">2025년 말<small className="block text-[10px] text-slate-400">실적</small></div><p className="text-[25px] font-black text-red-700">{money(model.latestHistorical.cumulative.wefoms)}<span className="text-xs ml-1">억</span></p></div>
        <div className="flex items-center justify-between py-1"><div className="text-[11px] text-slate-600">{model.finalForecast.year}년 추정 포함<small className="block text-[10px] text-slate-400">실적 + 추정</small></div><p className="text-[29px] font-black text-blue-700" data-final-cumulative-profit={model.finalForecast.cumulative.wefoms}>{money(model.finalForecast.cumulative.wefoms)}<span className="text-xs ml-1">억</span></p></div>
        <div className="bg-slate-50 rounded px-3 py-2 text-[10.5px] leading-relaxed text-slate-600"><p>누적 영업이익의 인수가액 {model.considerationLessCumulativeProfit < 0 ? '초과액' : '미달액'} <b>{money(Math.abs(model.considerationLessCumulativeProfit))}억</b></p></div>
      </div>
    </div>
    <div className="mt-auto pt-2">
    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1"><span>2023년부터 연간 합산 · 인수 전 실적 포함 · E: 추정</span><span>2023년 연결 수치: 양사 합산 비교치 · 법정 연결 실적 아님</span></div>
    <AnnualProfitTable />
    </div>

  </div>
}
