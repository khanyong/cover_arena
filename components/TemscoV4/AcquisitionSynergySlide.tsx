import { formatEok as money, transactionFinancials as model, transactionSources as source, type ProfitRow } from './transactionFinancials'

const colors = { goods: '#2563eb', cash: '#047857', technology: '#7c3aed', pending: '#a16207' }

function Flow({ y, label, kind, reverse = false, left = 224, right = 416, both = false }: {
  y: number; label: string; kind: keyof typeof colors; reverse?: boolean; left?: number; right?: number; both?: boolean
}) {
  return <g fill={colors[kind]}>
    <text x={(left + right) / 2} y={y - 11} fontSize="12" fontWeight="700" textAnchor="middle">{label}</text>
    <path d={`M${reverse ? right : left} ${y} H${reverse ? left : right}`} stroke={colors[kind]} strokeWidth="1.8"
      strokeDasharray={kind === 'technology' || kind === 'pending' ? '5 4' : undefined}
      markerStart={both ? `url(#synergy-arrow-${kind})` : undefined} markerEnd={`url(#synergy-arrow-${kind})`} />
  </g>
}

function TransactionDiagram() {
  const entities = [
    { x: 0.5, name: '위폼스', en: 'WeFOMS', desc: '마스크 설계·제조·품질', fill: '#f5f3ff', border: '#c4b5fd', color: '#6d28d9', total: model.subsidiaryTotal },
    { x: 420, name: '템스코', en: 'TEMSCO', desc: '소재·코팅 / 조달·물류·판매', fill: '#eff6ff', border: '#93c5fd', color: '#1d4ed8', total: model.parentTotal },
  ]
  return <svg viewBox="0 0 1027 232" className="w-full h-[205px] shrink-0" role="img" aria-labelledby="synergy-flow-title synergy-flow-description">
    <title id="synergy-flow-title">2026년 추정 원재료·마스크 내부거래 및 법인별 손익</title>
    <desc id="synergy-flow-description">템스코에서 위폼스로 원재료 33.81억원 공급, 반대 방향의 매입대금. 위폼스에서 템스코로 마스크 91.56억원 공급, 반대 방향의 매입대금. 발생기준 거래액이며 실제 입출금과 구분. 위폼스 전사 영업손실 28.22억원, 템스코 전사 영업이익 41.52억원. 양사의 기술 연계, LG 직접 판매, 중국 판매, 삼성 가격 협상.</desc>
    <defs>{Object.entries(colors).map(([key, color]) => <marker key={key} id={`synergy-arrow-${key}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={color} /></marker>)}</defs>
    {entities.map(e => <g key={e.name}>
      <rect x={e.x} y="8" width="220" height="207" rx="10" fill={e.fill} stroke={e.border} />
      <rect x={e.x} y="8" width="220" height="5" rx="2" fill={e.color} />
      <text x={e.x + 19} y="44" fontSize="24" fontWeight="900" fill={e.color}>{e.name} <tspan fontSize="12">{e.en}</tspan></text>
      <text x={e.x + 19} y="67" fontSize="12" fontWeight="700" fill={e.color}>{e.desc}</text>
      <path d={`M${e.x + 19} 83 H${e.x + 201}`} stroke={e.border} />
      <text x={e.x + 19} y="108" fontSize="13" fill="#475569">전사 매출</text>
      <text x={e.x + 201} y="108" textAnchor="end" fontSize="18" fontWeight="900" fill={e.color}>{money(e.total.revenue)}</text>
      <text x={e.x + 19} y="143" fontSize="13" fill="#475569">영업손익</text>
      <text x={e.x + 201} y="143" textAnchor="end" fontSize="25" fontWeight="900" fill={e.total.operatingProfit < 0 ? '#b91c1c' : e.color}>{e.total.operatingProfit > 0 ? '+' : ''}{money(e.total.operatingProfit)}</text>
      <text x={e.x + 19} y="185" fontSize="11" fill="#64748b">제공 추정손익의 법인 전체 기준</text>
    </g>)}
    <Flow y={34} label={`① 원재료 ${money(source.rawMaterialSales)}`} kind="goods" reverse />
    <Flow y={73} label={`매입대금 ${money(source.rawMaterialSales)}`} kind="cash" />
    <Flow y={119} label={`② 마스크 ${money(source.subsidiary.salesToParent)}`} kind="goods" />
    <Flow y={158} label={`매입대금 ${money(source.subsidiary.salesToParent)}`} kind="cash" reverse />
    <Flow y={205} label="소재·제조 기술 연계" kind="technology" both />
    <rect x="830" y="8" width="196" height="111" rx="10" fill="#f8fafc" stroke="#94a3b8" />
    <text x="847" y="38" fontSize="20" fontWeight="900" fill="#0f172a">LG · 중국</text>
    <text x="847" y="63" fontSize="12" fontWeight="700" fill="#1d4ed8">LG 1차 벤더 직접 판매</text>
    <text x="847" y="85" fontSize="12" fill="#475569">중국 마스크 판매</text>
    <text x="847" y="104" fontSize="10.5" fill="#64748b">고객별 금액 미분리</text>
    <Flow y={34} label="소재·마스크 판매" kind="goods" left={644} right={826} />
    <Flow y={73} label="판매대금 회수" kind="cash" left={644} right={826} reverse />
    <text x="735" y="105" fontSize="10.5" textAnchor="middle" fill="#64748b">마스크부문 전체 {money(source.parent.maskRevenue)}</text>
    <rect x="830" y="147" width="196" height="68" rx="10" fill="#fffbeb" stroke="#d97706" strokeDasharray="5 4" />
    <text x="847" y="175" fontSize="19" fontWeight="900" fill="#854d0e">삼성</text>
    <text x="847" y="198" fontSize="12" fontWeight="700" fill="#a16207">가격 협상 중</text>
    <Flow y={180} label="LG 레퍼런스 활용" kind="pending" left={644} right={826} />
  </svg>
}

function ProfitTable({ title, rows, total }: { title: string; rows: ProfitRow[]; total: ProfitRow }) {
  const fields = ['revenue', 'cost', 'grossProfit', 'sga', 'operatingProfit'] as const
  return <div>
    <h3 className="text-[15px] font-black text-slate-800 mb-1">{title}</h3>
    <table className="w-full text-[11.5px] tabular-nums border-collapse" aria-label={`${title} 관리회계 배부표`}>
      <thead className="bg-slate-100 text-slate-600 border-y border-slate-300 text-[10.5px]">
        <tr><th scope="col" className="text-left py-1.5 pl-1">거래 구분</th>{['매출', '원가', '매출총익', '판관비', '영업손익'].map(label => <th scope="col" key={label} className="text-right py-1.5 pr-1 font-bold">{label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(r => <tr key={r.label} className="border-b border-slate-100" data-profit-row={r.label}>
          <th scope="row" className="text-left py-1.5 pl-1 font-medium text-slate-700">{r.label}</th>
          {fields.map(field => <td key={field} className={`text-right pr-1 py-1.5 ${r[field] < 0 ? 'text-red-700' : 'text-slate-700'} ${field === 'operatingProfit' ? 'font-black' : ''}`}>{money(r[field])}</td>)}
        </tr>)}
        {rows.length < 3 && <tr aria-hidden="true"><td colSpan={6} className="h-[29px]"></td></tr>}
      </tbody>
      <tfoot className="bg-blue-50 border-t-2 border-blue-600 font-bold" data-profit-total={title}>
        <tr><th scope="row" className="text-left py-1.5 pl-1">전사 합계 · 원본</th>{fields.map(field => <td key={field} className={`text-right pr-1 py-1.5 ${total[field] < 0 ? 'text-red-700' : 'text-blue-800'}`}>{money(total[field])}</td>)}</tr>
      </tfoot>
    </table>
  </div>
}

export default function AcquisitionSynergySlide() {
  return <div className="h-full px-12 pt-6 pb-6 flex flex-col" data-acquisition-synergy>
    <div className="flex items-start justify-between border-b-4 border-blue-600 pb-2 mb-2 gap-4">
      <div><p className="text-blue-700 font-bold text-[11px] tracking-[0.14em] mb-1">2026E · 제공 추정손익 기준 · 단위: 억 원</p><h2 className="text-[29px] font-black text-slate-800 tracking-tight">위폼스 인수 · 거래별 수익과 법인별 손익</h2></div>
      <div className="text-right shrink-0"><p className="text-[10px] text-slate-500 font-bold">2024.03 인수 · 과거 취득대가</p><p className="font-black text-blue-700 leading-tight"><span className="text-[33px]">90</span><span className="text-base ml-1">억 원</span></p></div>
    </div>
    <div className="flex justify-between items-center mb-1 text-[10.5px] font-bold">
      <p className="text-slate-500">화살표 금액: 발생기준 거래액 · 지급·회수 시점 및 재고변동 미반영</p>
      <div className="flex gap-4" aria-label="다이어그램 범례"><span className="text-blue-700">→ 상품</span><span className="text-emerald-700">→ 대금 방향</span><span className="text-violet-700">⇠ ⇢ 기술</span></div>
    </div>
    <TransactionDiagram />
    <div className="flex items-center justify-between mb-2 border-t border-slate-200 pt-2"><h3 className="text-[16px] font-black text-slate-800">거래별 이익 기여 · 전사 손익 대사</h3><p className="text-[11px] font-bold text-amber-800">거래별 비용·영업손익: 관리회계 배부 추정</p></div>
    <div className="grid grid-cols-2 gap-6"><ProfitTable title="템스코" rows={model.parentRows} total={model.parentTotal} /><ProfitTable title="위폼스" rows={model.subsidiaryRows} total={model.subsidiaryTotal} /></div>
    <div className="mt-3 bg-blue-700 rounded-lg text-white px-4 py-2.5 flex items-center justify-between" data-consolidated-operating-profit={model.consolidated.operatingProfit}>
      <div><p className="text-[12px] font-bold">2026E 연결 영업손익 · 원본 전망</p><p className="text-[10.5px] text-blue-100 mt-1">템스코 {money(model.parentTotal.operatingProfit)} + 위폼스 ({money(-model.subsidiaryTotal.operatingProfit)}) + 원본 손익조정 {money(model.adjustmentProfit)}</p></div>
      <p className="text-[30px] font-black">+{money(model.consolidated.operatingProfit)}<span className="text-base ml-1">억</span></p>
      <div className="text-right text-[11px] text-blue-100"><p>연결 매출 {money(model.consolidated.revenue)}</p><p>내부매출·원가 각 {money(-source.adjustment.sales)} 제거</p></div>
    </div>
    <div className="mt-2.5 text-[10px] leading-[1.6] text-slate-600">
      <p><b className="text-slate-800">배부 기준</b> · 템스코 원재료: 소재부문 총이익률 {(model.materialMargin * 100).toFixed(0)}% 적용 · 템스코 판관비: 매출비례 · 위폼스 원가·판관비: 고객별 매출비례(템스코향 {(model.subsidiaryShare * 100).toFixed(2)}%)</p>
      <p><b className="text-amber-800">대사 필요</b> · 원재료 거래 {money(source.rawMaterialSales)} vs 위폼스 직접재료비 {money(source.subsidiary.directMaterialCost)} · 차이 {money(model.materialReconciliationGap)}의 재고·원가 구분 미확인 · 내부재고 미실현이익 조정 명세 미제공</p>
      <p><b className="text-slate-800">해석 범위</b> · ② 템스코: 마스크부문 전체 / 위폼스: 템스코향 매출 · 동일 제품별 원가 추적 및 인수 전후 증분이익과 구분 · 합계: 반올림 전 기준</p>
      <p className="text-slate-400 mt-1">출처: 템스코 추정손익 L7:L20·M7:N13 / 위폼스 추정손익 G5:G22 / 연결 양식 ‘연결조정 내역’ G7·G9, ‘연결’ N10:Q34</p>
    </div>
  </div>
}
