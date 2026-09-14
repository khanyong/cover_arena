import { entryInvestorShare, preIpoInvestorShare, postIpoInvestorShare, investorExitAssumptions as assumptions, investorExitCases } from './investorExitModel'

import { terminalCashFlowYear } from './valuationInputs'

const navy = '#0f2746'
const low = investorExitCases[0]
const high = investorExitCases[2]
const amount = (n: number, digits = 1) => n.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const percent = (n: number, digits = 2) => `${amount(n * 100, digits)}%`
const range = (a: number, b: number, digits = 1) => `${amount(a, digits)}~${amount(b, digits)}`
const profitRange = (a: number, b: number) => `${a < 0 ? '−' : '+'}${amount(Math.abs(a))}~${b < 0 ? '−' : '+'}${amount(Math.abs(b))}`

function ExitIcon({ route }: { route: 'ipo' | 'sale' | 'buyback' }) {
  const color = { ipo: '#2563eb', sale: '#0891b2', buyback: '#9a6c24' }[route]
  const label = { ipo: '주식시장 상장', sale: '투자자와 매수자 간 지분 이전', buyback: '옵션 행사와 지분 회수' }[route]
  return <svg data-exit-icon={route} viewBox="0 0 44 44" className="w-10 h-10 shrink-0" role="img" aria-label={label}>
    <rect x="1" y="1" width="42" height="42" rx="11" fill={color} fillOpacity=".08" />
    <g fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {route === 'ipo' ? <><path d="M10 31V21h5v10m5 0V15h5v16m5 0V9h5v22M8 34h29" /><path d="m9 16 8-6 6 2 10-7m-5 0h5v5" /></> : route === 'sale' ? <><rect x="6" y="12" width="12" height="18" rx="2" /><rect x="26" y="12" width="12" height="18" rx="2" /><path d="M15 8h15l-3-3m3 3-3 3M29 35H14l3-3m-3 3 3 3M10 18h4m-4 5h4m16-5h4m-4 5h4" /></> : <><path d="M10 16a13 13 0 1 1-1 14M10 9v8h8" /><path d="M22 14v9l6 4" /><circle cx="22" cy="23" r="1" /></>}
    </g>
  </svg>
}

function BuybackTimeline() {
  return <svg data-buyback-timeline viewBox="0 0 410 63" className="w-full h-[59px] mb-1" role="img" aria-label="2031말 미상장 및 잔여지분 미매각 시, 이후 90일 내 투자자 통지, 통지 후 180일 내 대주주 일시 매입">
    <defs><marker id="v4-buyback-step-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#b89961" /></marker></defs>
    <path d="M65 11h120m30 0h125" fill="none" stroke="#b89961" strokeWidth="1.5" markerEnd="url(#v4-buyback-step-arrow)" />
    {[{ x: 50, number: '1', date: '2031말', label: '미상장·미매각' }, { x: 200, number: '2', date: '90일 내', label: '투자자 통지' }, { x: 355, number: '3', date: '통지 후 180일', label: '대주주 일시 매입' }].map(step => <g key={step.number}>
      <circle cx={step.x} cy="11" r="10" fill="#9a6c24" /><text x={step.x} y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">{step.number}</text>
      <text x={step.x} y="39" textAnchor="middle" fontSize="12" fontWeight="700" fill={navy}>{step.date}</text><text x={step.x} y="56" textAnchor="middle" fontSize="11" fill="#64748b">{step.label}</text>
    </g>)}
  </svg>
}

function ProceedsRange({ minimum, maximum, color }: { minimum: number; maximum: number; color: string }) {
  const x = (value: number) => 12 + value / 160 * 278
  return <svg viewBox="0 0 305 31" className="w-full h-[27px]" role="img" aria-label={`총 회수대금 ${amount(minimum)}~${amount(maximum)}억원, 투자원금 70억원 비교`}>
    <line x1="12" x2="290" y1="10" y2="10" stroke="#e2e8f0" strokeWidth="3" />
    <line x1={x(minimum)} x2={x(maximum)} y1="10" y2="10" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <circle cx={x(minimum)} cy="10" r="4" fill={color} /><circle cx={x(maximum)} cy="10" r="4" fill={color} />
    <line x1={x(assumptions.investment)} x2={x(assumptions.investment)} y1="1" y2="17" stroke="#64748b" strokeWidth="1" />
    <text x={x(assumptions.investment)} y="29" textAnchor="middle" fontSize="10" fill="#64748b">원금 70</text>
    <text x="12" y="29" fontSize="9" fill="#94a3b8">0</text><text x="290" y="29" textAnchor="end" fontSize="9" fill="#94a3b8">160억</text>
  </svg>
}

function ReturnSummary({ route, color }: { route: 'ipo' | 'sale'; color: string }) {
  const a = low[route], b = high[route]
  if (a === null || b === null) return <div data-exit-return={route} className="pl-5 border-l border-slate-200">
    <p className="text-[10px] text-slate-500 font-bold">회수대금·예상 순이익</p>
    <p className="text-[24px] font-black mt-2" style={{ color }}>산정 보류</p>
    <p className="text-[12px] text-slate-600 mt-2">OMM 비교기업 배수 확인 필요</p>
  </div>
  return <div data-exit-return={route} className="pl-5 border-l border-slate-200">
    <p className="text-[10px] text-slate-500 font-bold">투자자 총 회수대금 <span className="font-normal">· 비용 차감 전</span></p>
    <p className="text-[25px] leading-[1.15] font-black tabular-nums mt-1" style={{ color }}>{range(a.grossProceeds, b.grossProceeds)}<span className="text-[13px] ml-1">억 원</span></p>
    <ProceedsRange minimum={a.grossProceeds} maximum={b.grossProceeds} color={color} />
    <p className="text-[13px] font-bold text-slate-800">예상 세전 순이익 <span className="tabular-nums">{profitRange(a.profit, b.profit)}억</span></p>
    <p className="text-[11px] mt-1 text-slate-500 tabular-nums">비용 후 {range(a.moic, b.moic, 2)}배 · IRR {range(a.irr * 100, b.irr * 100)}%</p>
  </div>
}

function TransactionAssumptionsTable({ route }: { route: 'ipo' | 'sale' }) {
  const isIpo = route === 'ipo'
  const rows = [
    { label: '지분가치', value: isIpo ? low.ipo && high.ipo ? `상장 후 시가총액 ${range(low.ipo.listingMarketCap, high.ipo.listingMarketCap)}억` : '상장 후 시가총액 · 산정 보류' : low.sale && high.sale ? `회사 100% 지분가치 ${range(low.sale.ownerEquity, high.sale.ownerEquity)}억` : '회사 100% 지분가치 · 산정 보류' },
    { label: '거래구조', value: isIpo ? '신주 공모 후 지분 20% 가정 · 공모금액 보류' : 'SI / PE 등 · 보유지분 전량 매각' },
    { label: '투자자 지분', value: isIpo ? `IPO 후 ${percent(postIpoInvestorShare)}` : `매각 대상 ${percent(preIpoInvestorShare)}` },
    { label: '적용배수', value: 'OMM 비교기업 배수 산정 중' },
    { label: '실행조건', value: isIpo ? '상장심사·수요예측·보유제한 해제 후 매각' : '매수자 실사·가격 합의·양도제한 해소' },
  ]
  return <div className="pr-5" data-exit-assumptions={route}>
    <table className="w-full table-fixed border-collapse text-[11px] leading-[1.4]" aria-label={`${isIpo ? 'IPO' : 'M&A'} 예상 거래 규모 및 가정`}>
      <colgroup><col style={{ width: '22%' }} /><col style={{ width: '78%' }} /></colgroup>
      <thead><tr className="border-y border-slate-300 bg-slate-50 text-slate-500 text-[10px]">
        <th scope="col" className="text-left px-2 py-[2px]">항목</th><th scope="col" className="text-left px-2 py-[2px]">규모 및 가정</th>
      </tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row.label} className="border-b border-slate-200 h-[19px]">
        <th scope="row" className="text-left px-2 py-px font-medium text-slate-500 whitespace-nowrap">{row.label}</th>
        <td className={`px-2 py-px tabular-nums ${index === 0 ? 'font-bold' : ''}`} style={{ color: navy }}>{row.value}</td>
      </tr>)}</tbody>
    </table>
    <p className={`text-[10px] leading-[1.4] mt-1 ${isIpo ? 'text-slate-500' : 'text-amber-800 font-medium'}`}>
      {isIpo ? '동일 주당 발행가액 · 공모 비중 가정' : '거래가격 미확정 · 원금손실 가능성 포함'}
    </p>
  </div>
}

export default function InvestorExitSlide() {
  return <div className="h-full bg-white text-slate-800 px-10 py-8 flex flex-col" data-investor-exit>
    <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.14em] text-blue-600 mb-2">
      <span>06 / FUNDING &amp; INVESTOR EXIT</span>
      <span className="text-amber-700 tracking-normal">분석가 가정 · 거래 조건 미확정 · 단위: 억 원</span>
    </div>
    <h2 className="text-[29px] leading-tight font-black tracking-tight whitespace-nowrap" style={{ color: navy }}>투자자 Exit Plan</h2>

    <div className="grid grid-cols-[1fr_1.25fr_1.6fr_1.15fr] gap-4 mt-2 mb-2 py-1 border-y border-slate-200 text-[11px] leading-[1.5]" data-exit-entry>
      <div><p className="text-slate-500">2026말 보통주 투자</p><strong className="text-[19px]" style={{ color: navy }}>{amount(assumptions.investment, 0)}억 원</strong></div>
      <div><p className="text-slate-500">적용 Pre-money¹</p><strong className="text-[19px]" style={{ color: navy }}>{amount(assumptions.entryPreMoney, 2)}억 원</strong></div>
      <div><p className="text-slate-500">최초 지분 → 후속 조달 희석²</p><strong className="text-[18px] tabular-nums" style={{ color: navy }}>{percent(entryInvestorShare)} → {percent(preIpoInvestorShare)}</strong></div>
      <div><p className="text-slate-500">순이익 산식 · 세전</p><strong>회수대금 × 98% − 70</strong><p className="text-slate-500">거래비용 2% · 배당 0</p></div>
    </div>

    <div className="flex-1 min-h-0 flex flex-col" data-exit-body>
      <div className="grid grid-cols-[20%_43%_37%] border-b-2 border-slate-900 pb-1.5 text-[11px] font-bold text-slate-500">
        <span>경로 및 목표 시점</span><span>예상 거래 규모 및 가정</span><span className="pl-5">70억 투자 기준 회수 범위</span>
      </div>

      <div data-exit-route="ipo" className="grid grid-cols-[20%_43%_37%] items-center py-2 border-b border-slate-200">
        <div className="pr-4"><p className="text-[10px] font-bold text-blue-600 mb-1.5">01 / 상장 경로</p><div className="flex items-center gap-2 mb-1.5"><ExitIcon route="ipo" /><h3 className="text-[25px] font-black text-blue-600">IPO</h3></div><p className="text-[14px] font-bold">2031년 상장 목표</p><p className="text-[11px] text-slate-500 mt-1">2032말 전량 회수 · 6년</p></div>
        <TransactionAssumptionsTable route="ipo" />
        <ReturnSummary route="ipo" color="#2563eb" />
      </div>

      <div data-exit-route="sale" className="grid grid-cols-[20%_43%_37%] items-center py-2 border-b border-slate-200">
        <div className="pr-4"><p className="text-[10px] font-bold text-cyan-700 mb-1.5">02 / 지분 매각 경로</p><div className="flex items-center gap-2 mb-1.5"><ExitIcon route="sale" /><div><h3 className="text-[23px] leading-tight font-black text-cyan-700">M&amp;A</h3><p className="text-[9px] tracking-wider font-bold text-cyan-700">SECONDARY</p></div></div><p className="text-[14px] font-bold">2031말 매각 목표</p><p className="text-[11px] text-slate-500 mt-1">보유지분 전량 매각 · 5년</p></div>
        <TransactionAssumptionsTable route="sale" />
        <ReturnSummary route="sale" color="#0891b2" />
      </div>

      <div data-exit-route="buyback" className="grid grid-cols-[20%_43%_37%] items-start py-2">
        <div className="pr-4"><p className="text-[10px] font-bold text-amber-800 mb-1.5">03 / 옵션 협의안</p><div className="flex items-center gap-2 mb-1.5"><ExitIcon route="buyback" /><h3 className="text-[18px] font-black text-amber-800 whitespace-nowrap">BUY-BACK</h3></div><p className="text-[13px] font-bold">투자자 Put-option</p><p className="text-[11px] text-slate-500 mt-1">대주주 매입의무 계약 전제</p></div>
        <div className="pr-5 text-[11px] leading-[1.6]" data-buyback-conditions>
          <BuybackTimeline />
          <p><b>미회수 지분 한정</b> · 대주주 자금·매입의무·담보·구제 약정</p>
          <p className="text-slate-500">회사 대체: 배당가능이익·균등조건·결의 등 법정 요건</p>
        </div>
        <div className="pl-5 border-l border-slate-200" data-exit-return="buyback">
          <p className="text-[10px] text-slate-500 font-bold">5년 기준 매입가격 · 협의 범위</p>
          <p className="text-[25px] leading-[1.15] font-black text-amber-800 tabular-nums mt-1">{range(low.buyback.grossProceeds, high.buyback.grossProceeds)}<span className="text-[13px] ml-1">억 원</span></p>
          <p className="text-[12px] font-bold mt-1.5">예상 세전 순이익 {profitRange(low.buyback.profit, high.buyback.profit)}억</p>
          <p className="text-[11px] text-slate-500 mt-1">잔여 취득원가 × (1 + 8~12%)⁵ − 수취배당</p>
          <p className="text-[10px] text-amber-800 mt-1">현재 권리·확정 수익률 없음 · 지급 지연수익 제외</p>
        </div>
      </div>
    </div>

    <div data-exit-notes className="shrink-0 border-t border-slate-200 pt-2 mt-2 pr-8 text-[10px] leading-[1.5] text-slate-500">
      <p>¹ 연결 지배주주 DCF 중도값 적용 · ² 후속 조달 누적 희석 20%·추가 납입 없음. 연도·공모비중·비용·옵션 가격률: 분석가 가정.</p>
      <p>회수 지분가치 = 정상 연결 EBIT × 배수 − 순차입금 235.10 − 위폼스 지분가치 × 25%. {terminalCashFlowYear} 정상 EBIT {range(low.normalizedGroupEbit, high.normalizedGroupEbit)}억: 회수연도까지 유지 가정(g=0).</p>
      <p>비교기업: 핌스 우선의 OMM 사업 기준. Buy-back: 회사가치와 독립된 계약 가격 가정.</p>
      <p>IPO 신주대금: 회사 유입·시가총액 가산, 발행비용 0 가정. 경로별 중복 회수 제외·투자자 세금 미반영. 옵션: 5년 가격 기준, 지급시점 수익률 변동·범위 밖 손실 가능.</p>
      <p>근거: DCF·OMM 비교기업 검토 · <a className="underline" href="https://www.krx.co.kr/contents/LST/04/04010102/LST04010102.jsp" target="_blank" rel="noreferrer">한국거래소</a> · <a className="underline" href="https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1031455411" target="_blank" rel="noreferrer">상법 제341조·제341조의4·제345조</a> / 2026.09.13 확인 · 미상장 및 미매각 시 옵션 선택·회사 소각/RCPS 상환 요건 별도</p>
    </div>
  </div>
}
