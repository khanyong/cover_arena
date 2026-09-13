import { acquisitionValue as model, operatingDrivers as drivers } from './acquisitionValue'
import { formatEok as money, inEok } from './transactionFinancials'

function SynergyPathways() {
  return <svg viewBox="0 0 1027 158" className="w-full h-[140px] shrink-0" role="img" aria-labelledby="acquisition-path-title acquisition-path-desc">
    <title id="acquisition-path-title">원재료 조달과 차세대 기술의 상호 시너지</title>
    <desc id="acquisition-path-desc">템스코에서 위폼스로 소재 조달·물류 경쟁력 전달, 위폼스에서 템스코로 G6 양산 및 G8.6급 개발·제조 역량 연계. 원가율과 매출 수치는 회사 전망이며 인수로 인한 순증 효과는 미분리.</desc>
    <defs>{[['procurement', '#047857'], ['development', '#6d28d9']].map(([id, color]) => <marker key={id} id={`value-arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={color} /></marker>)}</defs>
    <rect x="0.5" y="4" width="225" height="146" rx="8" fill="#eff6ff" stroke="#93c5fd" />
    <text x="20" y="36" fontSize="25" fontWeight="900" fill="#1d4ed8">템스코 <tspan fontSize="12">TEMSCO</tspan></text>
    <text x="20" y="61" fontSize="12" fontWeight="700" fill="#1e40af">소재 조달 · 물류 · 코팅 · 판매</text>
    <path d="M20 76 H205" stroke="#bfdbfe" />
    <text x="20" y="99" fontSize="12" fill="#334155">LG 직접 판매 · 중국 판매</text>
    <text x="20" y="122" fontSize="11.5" fontWeight="700" fill="#92400e">오정석 대표 · 대통령표창(2026)</text>
    <rect x="801.5" y="4" width="225" height="146" rx="8" fill="#f5f3ff" stroke="#c4b5fd" />
    <text x="821" y="36" fontSize="25" fontWeight="900" fill="#6d28d9">위폼스 <tspan fontSize="12">WeFOMS</tspan></text>
    <text x="821" y="61" fontSize="12" fontWeight="700" fill="#6d28d9">마스크 설계 · 제조 · 품질</text>
    <path d="M821 76 H1006" stroke="#ddd6fe" />
    <text x="821" y="99" fontSize="12" fill="#334155">G6H 양산 공급 역량</text>
    <text x="821" y="122" fontSize="12" fill="#334155">G8.6급 개발 · 양산투자 단계</text>
    <text x="514" y="23" fontSize="14" fontWeight="900" textAnchor="middle" fill="#047857">① 원재료 직조달 · 물류 통합 → 위폼스 원가 경쟁력</text>
    <path d="M236 38 H790" stroke="#047857" strokeWidth="2" markerEnd="url(#value-arrow-procurement)" />
    <text x="514" y="60" fontSize="12" textAnchor="middle" fill="#334155">직접재료비율 가정 {(drivers.wefomsMaterialRate2026 * 100).toFixed(2)}% → {(drivers.wefomsMaterialRate2027 * 100).toFixed(2)}% · 2026E → 2027E 이후</text>
    <text x="514" y="91" fontSize="14" fontWeight="900" textAnchor="middle" fill="#6d28d9">② 제조·개발 협업 → 템스코 차세대 마스크 매출 기반</text>
    <path d="M790 107 H236" stroke="#6d28d9" strokeWidth="2" markerEnd="url(#value-arrow-development)" />
    <text x="514" y="132" fontSize="12" textAnchor="middle" fill="#334155">마스크부문 전체 매출 전망 {money(drivers.parentMaskRevenue2026)} → {money(drivers.parentMaskRevenue2029)}억 · 2026E → 2029E</text>
  </svg>
}

function ProfitTrajectory() {
  const x = (i: number) => 55 + i * 105
  const y = (won: number) => 29 + (105 - inEok(won)) / 150 * 139
  const zero = y(0)
  const cumulativePath = model.annual.map((r, i) => `${i ? 'L' : 'M'}${x(i)} ${y(r.cumulative.wefoms)}`).join(' ')
  return <svg viewBox="0 0 680 198" className="w-full h-[165px]" role="img" aria-labelledby="value-trajectory-title value-trajectory-desc">
    <title id="value-trajectory-title">위폼스 연간 및 누적 영업손익, 2024년부터 연간 합산</title>
    <desc id="value-trajectory-desc">2024~2025년 회사 제공 과거자료와 2026~2029년 전망의 구분. 2025년 누적 영업손실 2.69억원, 2029년 전망 포함 누적 영업이익 87.45억원. 취득대가 90억원 참조선은 현금회수 기준이 아님. 상세 연도별 값은 아래 표.</desc>
    <rect x="212" y="20" width="438" height="157" fill="#eff6ff" rx="5" />
    <text x="75" y="13" fontSize="10.5" fontWeight="700" fill="#64748b">회사 제공 과거자료</text>
    <text x="327" y="13" fontSize="10.5" fontWeight="700" fill="#2563eb">2026E–2029E · 회사 전망</text>
    {[-30, 0, 30, 60, 90].map(tick => <g key={tick}>
      <path d={`M29 ${y(tick * 100_000_000)} H650`} stroke={tick === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={tick === 0 ? 1.2 : 0.8} />
      <text x="23" y={y(tick * 100_000_000) + 3} fontSize="9.5" fill="#94a3b8" textAnchor="end">{tick}</text>
    </g>)}
    <path d={`M29 ${y(model.consideration)} H650`} stroke="#a16207" strokeWidth="1.2" strokeDasharray="5 4" />
    <g data-acquisition-consideration>
      <path d={`M72 ${y(model.consideration)} V50`} stroke="#a16207" strokeWidth="1.2" />
      <rect x="43" y="50" width="194" height="48" rx="5" fill="#fffbeb" stroke="#fcd34d" />
      <text x="55" y="65" fontSize="10" fontWeight="700" fill="#92400e">2024.03 · 위폼스 취득대가</text>
      <text x="55" y="89" fontSize="23" fontWeight="900" fill="#92400e">{inEok(model.consideration).toLocaleString('ko-KR')}<tspan dx="4" fontSize="13">억 원</tspan></text>
      <text x="225" y="88" fontSize="9.5" fontWeight="700" fill="#a16207" textAnchor="end">규모 비교 기준</text>
    </g>
    {model.annual.map((r, i) => <g key={r.year}>
      <rect x={x(i) - 20} y={Math.min(zero, y(r.wefoms.operatingProfit))} width="40" height={Math.abs(zero - y(r.wefoms.operatingProfit))} rx="2" fill={r.wefoms.operatingProfit < 0 ? '#fca5a5' : r.forecast ? '#93c5fd' : '#2563eb'} />
      <text x={x(i)} y="193" textAnchor="middle" fontSize="11" fontWeight="700" fill={r.forecast ? '#2563eb' : '#475569'}>{r.year}{r.forecast ? 'E' : ''}</text>
    </g>)}
    <path d={cumulativePath} fill="none" stroke="#6d28d9" strokeWidth="2.5" />
    {model.annual.map((r, i) => <circle key={r.year} cx={x(i)} cy={y(r.cumulative.wefoms)} r="3.5" fill="white" stroke="#6d28d9" strokeWidth="2" />)}
    <text x={x(1)} y={y(model.latestHistorical.cumulative.wefoms) + 25} fontSize="11" fontWeight="900" fill="#6d28d9" textAnchor="middle">{money(model.latestHistorical.cumulative.wefoms)}</text>
    <text x={x(5) + 25} y={y(model.finalForecast.cumulative.wefoms) + 20} fontSize="13" fontWeight="900" fill="#6d28d9">{money(model.finalForecast.cumulative.wefoms)}</text>
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
  return <table className="w-full border-collapse text-[11px] tabular-nums" aria-label="2024년부터 법인별 및 연결 연간·누적 영업손익, 단위 억원">
    <thead className="border-y border-slate-300 bg-slate-100 text-slate-600">
      <tr><th scope="col" className="text-left py-1.5 pl-2">법인별 손익 · 억 원</th>{model.annual.map(r => <th key={r.year} scope="col" className={`text-right py-1.5 pr-3 ${r.forecast ? 'text-blue-700' : ''}`}>{r.year}{r.forecast ? 'E' : ''}</th>)}</tr>
    </thead>
    <tbody>{rows.map(row => <tr key={row.label} className={row.cumulative ? 'bg-blue-50 border-b border-slate-200 font-bold' : 'border-b border-slate-100'}>
      <th scope="row" className={`text-left py-0.5 pl-2 text-slate-700 ${row.cumulative ? 'font-bold' : 'font-medium'}`}>{row.label}</th>{row.values.map((value, i) => <td key={i} className={`text-right py-0.5 pr-3 ${value < 0 ? 'text-red-700' : row.cumulative ? 'text-blue-800' : 'text-slate-700'}`}>{money(value)}</td>)}
    </tr>)}</tbody>
  </table>
}

export default function AcquisitionValueSlide() {
  return <div className="h-full px-12 pt-6 pb-6 flex flex-col" data-acquisition-value>
    <div className="border-b-4 border-blue-600 pb-2 mb-2">
      <div className="min-w-0"><p className="text-[11px] tracking-[0.14em] text-blue-700 font-bold mb-1">ACQUISITION RATIONALE · 2024–2029</p><h2 className="text-[29px] leading-tight whitespace-nowrap font-black text-slate-800 tracking-tight">위폼스 인수 시너지: 원가 경쟁력·차세대 매출 기반</h2></div>
    </div>
    <SynergyPathways />
    <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-600 border-b border-slate-200 pb-2 mb-2">
      <span>확보 기반 · 소재 조달 / G6 양산 / LG 직납</span><span className="text-blue-400">→</span><span>개발·투자 · G8.6급 대면적 기술</span><span className="text-blue-400">→</span><span className="text-blue-700">성장 조건 · 고객 승인 / 양산 / 매출 확대</span>
    </div>
    <div className="grid grid-cols-[2.15fr_1fr] gap-5 items-start mb-2">
      <div>
        <div className="flex justify-between items-center mb-1"><h3 className="text-[14px] font-black text-slate-800">위폼스 수익성 회복 경로</h3><div className="text-[10px] flex gap-3"><span className="text-blue-600">▮ 연간 영업손익</span><span className="text-violet-700">● 누적 영업손익</span></div></div>
        <ProfitTrajectory />
      </div>
      <div className="border-l border-slate-200 pl-5 pt-0.5 text-[10px]">
        <p className="text-[11px] font-bold text-slate-500 mb-1">위폼스 전사 · 2024년부터 연간 누적</p>
        <div className="flex items-center justify-between py-1 border-b border-slate-200"><div className="text-[11px] text-slate-600">2025년 말<small className="block text-[10px] text-slate-400">제공 과거자료 기준</small></div><p className="text-[25px] font-black text-red-700">{money(model.latestHistorical.cumulative.wefoms)}<span className="text-xs ml-1">억</span></p></div>
        <div className="flex items-center justify-between py-1"><div className="text-[11px] text-slate-600">2029E 포함<small className="block text-[10px] text-slate-400">과거자료 + 회사 전망</small></div><p className="text-[29px] font-black text-blue-700" data-final-cumulative-profit={model.finalForecast.cumulative.wefoms}>{money(model.finalForecast.cumulative.wefoms)}<span className="text-xs ml-1">억</span></p></div>
        <div className="bg-slate-50 rounded px-3 py-2 text-[10.5px] leading-relaxed text-slate-600"><p>취득대가 대비 누적 영업손익 차이 <b>{money(model.considerationLessCumulativeProfit)}억</b></p><p>동일 기간 누적 순손익 <b>{money(model.finalForecast.cumulative.wefomsNetIncome)}억</b></p><p className="font-bold text-amber-800">현금 회수액·투자수익률과 구분</p></div>
      </div>
    </div>
    <AnnualProfitTable />
    <div className="mt-2 text-[9.5px] leading-[1.55] text-slate-600" data-value-notes>
      <p><b>기간·범위</b> · 2024~2025 회사 제공 과거자료 / 2026~2029E 전망 · 누적: 2024년부터 연간 합산(인수 전 기간 포함 가능) · 2026년 누적 실적 미제공</p>
      <p><b>시너지 해석</b> · 재료비율: 위폼스 템스코향 매출 대비 전망 가정 · 마스크 매출: 템스코 부문 전체 · 조달 절감·8세대 매출의 인수 순증 기여액 미분리</p>
      <p><b>가치 판단</b> · 누적손익에 기존 사업 및 연결조정 포함 · 기업가치·인수 현금회수와 구분 · 추가 투자·운전자본·지분율 반영 필요 · 합계: 반올림 전 기준</p>
      <p className="text-slate-400 mt-1">출처: 연결 양식 모회사·자회사 21/32행, 연결 23/34행 / 템스코 추정손익 M7·V7 / 위폼스 Drivers F10·G10 / 양사 회사소개서</p>
    </div>
  </div>
}
