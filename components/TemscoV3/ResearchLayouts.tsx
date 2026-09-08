import type { ReactNode } from 'react'
import s from './researchLayouts.module.css'
import raw from './companyForecast.json'
import { fmt } from './financials'
import { marketInputs as m, debtProxies } from './marketInputs'
import { terminalGrowth } from './valuation'
import { scenarios } from './scenarioValuation'
import { corporateTaxAssumptions } from './corporateTax'
import { firstPassAssumptions } from './firstPassAssumptions'
import { FirstPassAssumptionRegister, FirstPassEquityValue } from './AssumptionLayouts'

const future = raw.periods.filter(period => period.year >= 2026)
const pct = (value: number, digits = 2) => `${fmt(value * 100, digits)}%`
const money = (value: number | null | undefined) => value == null ? '미확정' : fmt(value / 1e8, 1)

function Notes({ children }: { children: ReactNode }) {
  return <div className={s.notes}>{children}</div>
}

function MarketScope() {
  const lanes = [
    { title: '메탈마스크', scope: <>OMM/CVD·프레임·코팅별 수요<br />FMM 별도 시장 구분</>, basis: <>고객 라인 수 × 라인당 소요량<br />× 교체주기 × 단가</> },
    { title: '박막코팅소재', scope: <>Al·Mo 등 타겟의 재질·순도<br />공정·지역별 접근 시장</>, basis: <>고객 사용량 × 판매 가능 비중<br />× 제품별 판매단가</> },
    { title: '특수강·비철소재', scope: <>실제 취급 품목·가공 서비스<br />외부 고객 수요</>, basis: <>고객별 물량·중량 × 단가<br />재판매·가공수익 구분</> },
  ]
  return <div className={`${s.root} ${s.marketScope}`}>
    <div className={s.laneHead}><span>사업 범위</span><span>제품별 시장·점유율의 경계</span><span>회사 매출의 산정 근거</span></div>
    {lanes.map((lane, index) => <div className={s.marketLane} key={lane.title}>
      <div className={s.laneName}><span>{String(index + 1).padStart(2, '0')}</span><h3>{lane.title}</h3></div>
      <p>{lane.scope}</p><p className={s.laneBasis}>{lane.basis}</p>
    </div>)}
    <div className={s.marketBoundary}>
      <div><span className={s.label}>수요의 선행 지표</span><strong>패널 판매액·장비 투자액</strong></div>
      <div><span className={s.label}>점유율의 산정 기준</span><strong>마스크·타겟의 제품별 시장</strong><p>패널·장비 시장의 직접 대입 제외</p></div>
    </div>
  </div>
}

function MarketEvidence() {
  return <div className={`${s.root} ${s.marketEvidence}`}>
    <div className={s.marketHero}>
      <span className={s.label}>2026 대형 OLED 출하 전망</span>
      <div className={s.heroNumber}>38.8<span>M</span></div>
      <div className={s.heroTranslation}>3,880만 대 <strong>+18.8% YoY</strong></div>
      <p className={s.heroSource}>Omdia 2026.07 전망 · 수요 지표</p>
      <div className={s.demandGrowth}><div><span>노트북</span><strong>+66%</strong></div><div><span>모니터</span><strong>+34%</strong></div></div>
    </div>
    <div className={s.evidenceStack}>
      <div><span className={s.label}>과거 발표 전망</span><h3>IT OLED 장기 전망</h3><p>2024년 $2.534bn / 2029년 $8.913bn<br />CAGR 28.6% · 2024년 발표</p><small>현재 관측치·마스크 TAM 대용 제외</small></div>
      <div><span className={s.label}>세부 금액 미제공</span><h3>Shadow Mask 시장</h3><p>2026년 3분기 조사자료의 공개 안내<br />제품·지역·기간별 규모 확보 전 점유율 산출 보류</p></div>
      <div><span className={s.label}>연도별 SAM 미확정</span><h3>소재·타겟 시장</h3><p>실제 판매 제품과 일치하는 시장 기준<br />고객 소비량·단가·승인 제품의 상향식 추정 필요</p></div>
    </div>
    <Notes><p>기존 매출 전망: 회사 계획 · 독립적인 시장 점유율 검증 전 단계</p><p>Omdia 대형 디스플레이 매출: LCD 포함 · Fineone IR 자체 추정: 외부 검증 마스크 시장 통계로 미채택</p></Notes>
  </div>
}

function RevenueBuild() {
  const rows: { label: string; get: (period: typeof future[number]) => number | null }[] = [
    { label: '템스코 마스크 / 제거 전', get: period => period.segments.parentMaskGrossRevenue },
    { label: '템스코 소재 / 제거 전', get: period => period.segments.parentMaterialsGrossRevenue },
    { label: '위폼스 외부 고객', get: period => period.segments.subsidiaryExternalAsLabelled },
    { label: '연결 외부 매출', get: period => period.consolidated.revenue },
  ]
  return <div className={`${s.root} ${s.revenueBuild}`}>
    <div className={s.revenueFlow}>
      <div><span>01</span><h3>시장 범위</h3><p>제품별 TAM·SAM<br />동일 연도·통화</p></div>
      <div><span>02</span><h3>확보 가능 매출</h3><p>시장금액 × 점유율<br />고객 배정률 별도 구분</p></div>
      <div><span>03</span><h3>수요·공급 제약</h3><p>승인·발주 수요<br />양품 CAPA × 단가</p></div>
      <div><span>04</span><h3>연결 외부 매출</h3><p>제약 반영 제품 매출<br />내부거래 제거</p></div>
    </div>
    <div className={s.revenueFormula}>제품별 매출 = min(시장금액 × 점유율, 수요금액, 양품 CAPA × 단가)</div>
    <table className={s.dataTable}><thead><tr><th scope="col">현재 계획의 매출 분해 / 억 원</th>{future.map(period => <th scope="col" key={period.year}>{period.year}E</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr className={index === 3 ? s.total : undefined} key={row.label}><th scope="row">{row.label}</th>{future.map(period => <td key={period.year}>{money(row.get(period))}</td>)}</tr>)}</tbody></table>
    <Notes><p>점유율 비교: 전체 시장 점유율 / 특정 고객의 물량 배정률 구분 · 수요·CAPA 비교: 동일 제품·연도·통화의 금액</p><p>독립 검증: 시장별 TAM/SAM·회사 출하 점유율·제품별 단가·고객 FCST 원본 연결 · 미첨부 외부참조의 연 25억 매출 가정 추가 확인</p></Notes>
  </div>
}

function ValuationScope() {
  return <div className={`${s.root} ${s.valuationScope}`}>
    <div className={s.valuationAxis}>
      <div><span className={s.label}>평가 기준일</span><strong>2026.09.08</strong><p>KRW 명목 현금흐름</p></div>
      <div><span className={s.label}>명시적 추정기간</span><strong>잔여 2026–2029</strong><p>2026 잔여분의 선형 안분 가정</p></div>
      <div><span className={s.label}>안정기</span><strong>2030 이후</strong><p>영구 명목성장률 g = 0%</p></div>
    </div>
    <div className={s.scopeRequirements}>
      <div><h3>평가일 잔액의 대용</h3><p>2025 말 순차입금·NCI 대용<br />운전자본의 산업수준 보간</p></div>
      <div><h3>잔여 FCFF의 1차 추정</h3><p>누진세금·내용연수 가정<br />산업 운전자본·추가 개발비 반영</p></div>
      <div><h3>정상화 조건의 충족</h3><p>정상 수율·마진·유지보수 투자<br />정상 운전자금 수준<br />안정성 미달 시 추정기간 연장</p></div>
    </div>
    <div className={s.valuationResult}><div><span className={s.label}>가치 산정 순서</span><strong>연결 FCFF 할인 → EV → 주주가치</strong><p>명시적 1차 가정 적용 · 실제 실적·잔액·계약조건 확보 시 재산정</p></div><div><span>중도안 1차 EV / 억 원</span><strong>{fmt(scenarios[1].dcf.enterpriseValue, 1)}</strong></div></div>
  </div>
}

function WaccInputs() {
  return <div className={`${s.root} ${s.waccInputs}`}>
    <div className={s.riskFree}>
      <span className={s.label}>원화 무위험수익률 Rf</span>
      <div className={s.riskFreeValue}>{pct(m.governmentYield - m.sovereignDefaultSpread, 3)}</div>
      <div className={s.riskFreeCalculation}><span>국고 10년</span><strong>{pct(m.governmentYield, 3)}</strong><span>− 한국 국가 부도 스프레드</span><strong>− {pct(m.sovereignDefaultSpread, 3)}</strong></div>
      <p>원화 국고채의 국가 부도 위험 차감<br />금리와 국가위험 자료의 관측일 시차</p>
    </div>
    <table className={`${s.inputTable} ${s.dataTable}`}><thead><tr><th scope="col">시장 입력</th><th scope="col">관측·적용 기준</th></tr></thead><tbody>
      <tr><th scope="row">국고채 <strong>{pct(m.governmentYield, 3)}</strong></th><td>KIS 국고 10년<br />2026.09.07</td></tr>
      <tr><th scope="row">국가 부도 스프레드 <strong>{pct(m.sovereignDefaultSpread, 3)}</strong></th><td>한국 · 2026.07.01 자료<br />7월 9일 정정</td></tr>
      <tr><th scope="row">시장 ERP / 국가 CRP <strong>{pct(m.matureErp)} / {pct(m.countryRiskPremium, 3)}</strong></th><td>9월 ERP의 NYU 국가위험 방식 환산<br />한국 CRP: 7월 자료</td></tr>
      <tr><th scope="row">차입비용 Kd 참고 <strong>{pct(debtProxies[0].debtCost, 3)} / {pct(debtProxies[1].debtCost, 3)}</strong></th><td>AA− / BBB− 회사채 10년<br />템스코 신용등급과 구분</td></tr>
      <tr><th scope="row">WACC 한계세율 <strong>{pct(m.taxRate, 0)}</strong></th><td>국세 {pct(corporateTaxAssumptions.nationalRates[1], 0)} + 지방 {pct(corporateTaxAssumptions.localRates[1], 0)}<br />과표 2–200억 구간 대용<br />손익·현금세금: 법인별 누진 적용</td></tr>
    </tbody></table>
    <Notes><p>ERP·베타: 공개 시장자료 기반 연구 추정 · 한국 위험 노출계수 λ=1: 참고 계산 가정, 해외 매출·사업위험별 재검토</p><p>WACC: 이자 절세의 한계세율 대용 · 추정손익·영업 현금세금: 2026 일반법인 누진세율 · 임의 소기업 가산금리 제외</p></Notes>
  </div>
}

function Reinvestment() {
  return <FirstPassAssumptionRegister />
}

function Terminal() {
  return <div className={`${s.root} ${s.terminal}`}>
    <div className={s.terminalEquation}>
      <div className={s.zeroGrowth}><span>영구 명목성장률</span><strong>{terminalGrowth}<small>%</small></strong><span>g = 0</span></div>
      <div className={s.terminalFraction}><span className={s.tvLabel}>TV<sub>n</sub> =</span><div><strong>정상화 FCFF<sub>n+1</sub></strong><span>WACC<sub>t</sub></span></div></div>
    </div>
    <div className={s.normalizedFormula}>정상화 FCFF = EBIT − 영업 현금세금 + D&A − 유지 CAPEX − 자산화 개발비 − ΔNWC</div>
    <div className={s.terminalRules}>
      <div><span>01</span><h3>명목 무성장의 지속 가능성</h3><p>매출·정상 영업현금의 영구 명목성장률 0%<br />2029 이익 정상화 · 미도달 시 명시기간 연장</p></div>
      <div><span>02</span><h3>유지투자·개발비의 분리</h3><p>유지 CAPEX = 비개발자산 D&A<br />자산화 개발비: 별도 현금유출 차감</p></div>
      <div><span>03</span><h3>개발비 상각의 정상화</h3><p>정상 개발비 상각 = 연간 개발비 지출<br />{firstPassAssumptions.development.usefulLifeYears}년 정액 상각의 안정상태 가정</p></div>
      <div><span>04</span><h3>영업세금·운전자금의 정상화</h3><p>법인별 누진 영업세금 적용<br />고정 매출·NCWC 비율: ΔNWC = 0</p></div>
    </div>
  </div>
}

function EquityValue() {
  return <FirstPassEquityValue />
}

function Funding() {
  const rounds = [
    { name: 'Series A', purpose: '기반 정비', amount: '70억', status: '기존 초기 제안', condition: <>현금 안정화<br />승인된 투자 집행</>, calculation: <>실제 잔여 CAPEX·운전자금<br />차입 만기 대사</> },
    { name: 'Series B', purpose: '양산 확대', amount: '미확정', status: '후속 시점·금액', condition: <>고객 발주·수율 확인<br />추가 설비·재고 소요 발생</>, calculation: <>양산 증설 현금소요에서<br />내부 창출·기확보 자금 차감</> },
    { name: 'Series C', purpose: '확장·회수 준비', amount: '미확정', status: '후속 시점·금액', condition: <>추가 제품·고객 확장 또는<br />조달구조 재편의 경제성 확인</>, calculation: <>추가 성장안·기존주주 희석<br />회수조건의 동시 비교</> },
  ]
  return <div className={`${s.root} ${s.funding}`}>
    <div className={s.rounds}>{rounds.map((round, index) => <div className={s.round} key={round.name}>
      <div className={s.roundHeading}><span>{round.name}</span><h3>{round.purpose}</h3></div>
      <div className={s.roundAmount}><strong className={index > 0 ? s.pending : undefined}>{round.amount}</strong><span>{round.status}</span></div>
      <div className={s.roundCondition}><span className={s.label}>조달 판단의 선행 조건</span><p>{round.condition}</p></div>
      <div className={s.roundCalculation}><span className={s.label}>필요 금액의 산정</span><p>{round.calculation}</p></div>
    </div>)}</div>
    <div className={s.fundingFormula}>필요 조달액 = max(0, 최소 현금 − 조달 전 예상 현금)</div>
    <Notes><p>조달 전 예상 현금 = 기초 현금 + 이자 지급 전 영업현금흐름 + 투자현금흐름 − 이자·차입 상환 + 기확약 조달 · 동일 투자 지출의 중복 차감 제외</p><p>월별 누적 현금 최저점 기준 · 연말 잔액 단독 적용 제외 · 미조달·지연·부분 조달의 CAPEX·매출 전망 반영 · 자본구조 대폭 변경 시 기간별 WACC 또는 APV 검토</p></Notes>
  </div>
}

function Dilution() {
  return <div className={`${s.root} ${s.dilution}`}>
    <div className={s.ownershipComparison}>
      <div><span className={s.label}>투자 전</span><h3>Pre-money</h3><div className={s.ownershipRow}><b>기존 주주</b><span>직전 지분율</span></div><p>투자 전 지분가치·발행가<br />구주·신주 구분</p></div>
      <div><span className={s.label}>신주 투자 후</span><h3>Post-money</h3><div className={s.ownershipRow}><b>신규 투자자</b><span>신주 투자금 / Post-money</span></div><div className={s.ownershipRow}><b>기존 주주</b><span>직전 지분율 × Pre-money / Post-money</span></div><p>Post-money = Pre-money + 신주 투자금<br />각 라운드 이후 완전희석 주식수 기준</p></div>
    </div>
    <div className={s.cumulativeDilution}><span className={s.label}>연속 라운드 이후 지분</span><div><strong>A 이후 지분</strong><span>×</span><strong>B의 잔존비율</strong><span>×</span><strong>C의 잔존비율</strong></div><p>후속 투자액·밸류에이션·옵션 확대·전환 조건 반영</p></div>
    <div className={s.exitAnalysis}><div><h3>투자자 회수 현금</h3><p>Exit 모회사 전체 주주가치·계약상 분배순서 반영<br />투자·회수 날짜 기준 XIRR 및 MOIC</p></div><div><h3>확대 가치와 희석 후 귀속 지분</h3><p>후속 투자금 유입: FCFF·투자 수익 산입 제외<br />미확정 입력: Pre-money·후속 라운드 금액·주주명부</p></div></div>
    <Notes><p>현재 지분율·IRR: 미확정 · 기본 산식: 동일 권리 보통주 신주발행 · 계약별 조정: CB·BW·우선주·옵션풀·청산우선권·발행비용</p></Notes>
  </div>
}

export const researchLayouts: Partial<Record<string, ReactNode>> = {
  'market-scope': <MarketScope />,
  'market-evidence': <MarketEvidence />,
  'revenue-build': <RevenueBuild />,
  'valuation-scope': <ValuationScope />,
  'wacc-inputs': <WaccInputs />,
  reinvestment: <Reinvestment />,
  terminal: <Terminal />,
  'equity-value': <EquityValue />,
  funding: <Funding />,
  dilution: <Dilution />,
}
