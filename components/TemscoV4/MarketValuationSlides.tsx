import type { ReactNode } from 'react'
import valuationData from './valuationData.json'
import OmmPeersSlide from './OmmPeersSlide'

const market = valuationData.market
const wacc = market.wacc
const selected = wacc.referenceCalculations.find(row => row.id === wacc.selectedModelConvention.referenceId)
const industry = wacc.industryProxies.find(row => row.id === 'electronics_general')
if (!selected || !industry) throw new Error('V4 할인율 시장 대용치 누락')
const selectedWacc = selected
const selectedIndustry = industry
const navy = '#18344f'
const cyan = '#0891b2'
const amount = (value: number, digits = 2) => value.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const pct = (value: number, digits = 2) => `${amount(value * 100, digits)}%`

function SourceLink({ id, children }: { id: string; children: ReactNode }) {
  const source = market.sources.find(item => item.id === id)
  return source?.url
    ? <a href={source.url} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-2" title={source.title}>{children}</a>
    : <span>{children}</span>
}

function Frame({ kind, title, subtitle, children, notes, sources }: {
  kind: 'wacc' | 'peers'; title: string; subtitle: string; children: ReactNode; notes: ReactNode; sources: ReactNode
}) {
  return <div className="slide-content p-10 h-full flex flex-col bg-white text-slate-800" data-market-valuation={kind}>
    <div className="shrink-0 border-b-[3px] border-cyan-600 pb-3 mb-3">
      <div className="flex justify-between mb-1.5 text-[11px] font-bold tracking-[0.12em] text-cyan-700">
        <span>{kind === 'wacc' ? '별첨 A.2 / WACC · MARKET EVIDENCE' : 'VALUATION · MARKET EVIDENCE'}</span><span className="tracking-normal text-slate-500">평가 기준일 2026.09.13 · 관측일별 고정 입력</span>
      </div>
      <h2 className="text-[28px] leading-[1.2] font-black tracking-tight whitespace-nowrap" style={{ color: navy }}>{title}</h2>
      <p className="mt-2 text-[13px] leading-[1.45] text-slate-600">{subtitle}</p>
    </div>
    <div data-valuation-body className="flex-1 min-h-0">{children}</div>
    <div className="shrink-0 mt-3 pt-2 border-t border-slate-200 text-[11px] leading-[1.5] text-slate-600" data-market-valuation-notes data-valuation-notes>
      {notes}
      <p className="mt-1 text-slate-500">출처: {sources} · 원자료 재조회 2026.09.13</p>
    </div>
  </div>
}

function InputTable({ caption, rows }: { caption: string; rows: { label: string; value: string; basis: string; emphasis?: boolean }[] }) {
  return <table className="w-full table-fixed border-collapse text-[12px] leading-[1.35] tabular-nums" aria-label={caption}>
    <caption className="text-left text-[14px] font-black pb-2" style={{ color: navy }}>{caption}</caption>
    <colgroup><col style={{ width: '39%' }} /><col style={{ width: '25%' }} /><col style={{ width: '36%' }} /></colgroup>
    <thead><tr className="border-y border-slate-300 bg-slate-50 text-slate-500 text-[11px]"><th scope="col" className="py-1.5 pl-2 text-left">시장 입력</th><th scope="col" className="py-1.5 pr-2 text-right">적용값</th><th scope="col" className="py-1.5 pl-3 text-left">관측일·근거</th></tr></thead>
    <tbody>{rows.map(row => <tr key={row.label} className={`border-b border-slate-200 ${row.emphasis ? 'bg-cyan-50/60 font-bold' : ''}`}>
      <th scope="row" className="py-[5px] pl-2 text-left font-medium">{row.label}</th><td className="py-[5px] pr-2 text-right whitespace-nowrap font-bold" style={{ color: row.emphasis ? cyan : navy }}>{row.value}</td><td className="py-[5px] pl-3 text-[11px] text-slate-500">{row.basis}</td>
    </tr>)}</tbody>
  </table>
}

function WaccSlide() {
  const inputs = wacc.inputs
  const rateRows = [
    { label: '국고채 10년 수익률', value: pct(inputs.governmentYield, 3), basis: '2026.09.07 · KIS' },
    { label: '한국 소버린 스프레드 차감', value: `−${pct(inputs.sovereignDefaultSpread, 6)}`, basis: '2026.07.01 · 07.09 정정' },
    { label: '조정 무위험수익률 Rf', value: pct(inputs.riskFreeAdjusted, 6), basis: '국고채 − 소버린 위험', emphasis: true },
    { label: '성숙시장 위험프리미엄 ERP', value: pct(inputs.matureErp, 2), basis: '2026.09.01 · NYU 방식¹' },
    { label: '한국 국가위험 CRP', value: pct(inputs.countryRiskPremium, 6), basis: '2026.07.01 · 07.09 정정' },
    { label: '국가위험 노출계수 λ', value: amount(inputs.countryRiskLambda, 1), basis: '회사 노출 대용 가정' },
    { label: '정상 한계세율 T', value: pct(inputs.marginalTaxRate, 0), basis: '국세 20% + 지방 2%²' },
  ]
  const capitalRows = [
    { label: '무차입 베타 βU · 현금 조정', value: amount(selectedIndustry.unleveredBetaCashAdjusted, 2), basis: `2026.01 · ${amount(selectedIndustry.firmCount, 0)}개사` },
    { label: '시장가치 부채 / 자기자본', value: pct(selectedWacc.marketDebtEquity, 2), basis: '2026.01 · 업종 D/E' },
    { label: '재차입 베타 βL', value: amount(selectedWacc.betaL, 6), basis: '업종 βU·D/E 및 T 적용' },
    { label: '자기자본비용 Ke', value: pct(selectedWacc.ke, 6), basis: 'Rf + βL × ERP + λ × CRP', emphasis: true },
    { label: '세전 부채비용 Kd', value: pct(selectedWacc.kdPretax, 3), basis: '2026.09.07 · BBB− 10년' },
    { label: '자기자본 가중치 E/(D+E)', value: pct(selectedWacc.equityWeight, 4), basis: '1 / (1 + 시장 D/E)' },
    { label: '부채 가중치 D/(D+E)', value: pct(selectedWacc.debtWeight, 4), basis: '시장 D/E / (1 + 시장 D/E)' },
  ]
  return <Frame kind="wacc" title="시장지표 기반 할인율 산정" subtitle="원화 명목 FCFF · 글로벌 전자부품 업종과 국내 회사채 수익률의 대용치 조합 · 최신 시장가와 구분"
    notes={<>
      <p><b>¹ ERP 정합성</b> · 미국 국채 4.75% 대비 내재 ERP 4.14% → 무위험 조정 기준 4.36% → 미국 위험 0.22% 차감 · 성숙시장 ERP 4.14% 채택</p>
      <p><b>방법 한계</b> · NYU 웹·실제 수식 기준의 분석가 적용 · 7월 FAQ의 변동성 배수 방식과 차이 · 한국 위험의 Rf 차감 및 CRP 1회 가산</p>
      <p><b>² 세율 범위</b> · 일반법인 과표 2억 초과–200억 원 구간 · 실제 연도별 납부세율과 구분 · 손실 법인의 즉시 절세효과 미확정</p>
    </>}
    sources={<><SourceLink id="KIS_20260907">KIS</SourceLink> · <SourceLink id="NYU_BETA_GLOBAL">NYU β</SourceLink> / <SourceLink id="NYU_ERP_SEP">ERP</SourceLink> / <SourceLink id="NYU_CRP_JUL">CRP</SourceLink> · <SourceLink id="NTS_TAX">국세청</SourceLink> / <SourceLink id="LOCAL_TAX">지방세</SourceLink></>}>
    <div className="flex items-center justify-between gap-6 pb-3 mb-3 border-b border-slate-200">
      <div className="flex items-baseline gap-4"><span className="text-[13px] font-bold text-slate-500">적용 WACC</span><strong className="text-[36px] leading-none font-black tabular-nums" style={{ color: navy }}>{pct(wacc.selectedModelConvention.wacc, 4)}</strong></div>
      <div className="text-right text-[12px] leading-[1.5]"><p className="font-bold text-cyan-700">Electronics (General) × BBB− 회사채 대용</p><p className="text-slate-600">별도·연결 공통 기준 · 사업위험 동일성의 근거와 구분</p></div>
    </div>
    <div className="grid grid-cols-2 gap-6"><InputTable caption="01 · 무위험수익률 및 위험프리미엄" rows={rateRows} /><InputTable caption="02 · 베타, 자본구조 및 조달비용" rows={capitalRows} /></div>
    <div className="mt-3 px-4 py-2.5 border-y border-cyan-200 bg-cyan-50/60 text-[13px] leading-[1.6]" style={{ color: navy }}>
      <div className="flex justify-between gap-3"><span>βL = βU × [1 + (1 − T) × D/E]</span><span>Ke = Rf + βL × ERP + λ × CRP</span></div>
      <p className="font-bold">WACC = Ke × E/(D+E) + Kd × (1 − T) × D/(D+E) = {pct(wacc.selectedModelConvention.wacc, 4)}</p>
    </div>
    <div className="mt-3 grid grid-cols-[1.12fr_1fr] gap-6 text-[11px] leading-[1.55]">
      <div><p className="font-bold text-[12px] text-slate-700">회사 실측값과 구분</p><p>템스코 실제 신용등급·차입금리·순수 비교기업군 미확정</p><p>BBB−: 공개 수익률 예시 · 실제 조달 가능성의 보장과 구분</p></div>
      <div className="border-l border-slate-200 pl-5"><p className="font-bold text-[12px] text-slate-700">할인율 민감도 · 분석가 설정 ±{amount(wacc.selectedModelConvention.sensitivityAbsoluteShift * 100, 1)}%p</p><p className="font-bold tabular-nums text-cyan-700">{wacc.selectedModelConvention.sensitivityWaccValues.map(value => pct(value, 4)).join(' / ')}</p><p>관측 범위·통계적 신뢰구간과 구분</p></div>
    </div>
  </Frame>
}

export function MarketValuationSlide({ kind }: { kind: 'wacc' | 'peers' }) {
  return kind === 'wacc' ? <WaccSlide /> : <OmmPeersSlide />
}
