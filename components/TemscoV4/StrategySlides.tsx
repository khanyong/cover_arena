import Image from 'next/image'
import Frame from './CorporateSlideFrame'
import capital from './capitalSource.json'
import styles from './StrategySlides.module.css'

export type StrategySlideId = 'risk-resolution' | 'growth-pipeline' | 'use-of-proceeds'

const colors = { navy: '#0f2746', blue: '#2563eb', slate: '#64748b', loss: '#b42332', grid: '#e2e8f0' }

const eok = (value: number) => value / 100_000_000
const amount = (value: number) => eok(value).toFixed(2)
const badDebt = capital.operatingBadDebt2025 + capital.nonOperatingBadDebt2025
const afterBadDebt = capital.equity2024 - badDebt
const otherNetDecrease = afterBadDebt - capital.equity2025

function CapitalChart() {
  const y = (amount: number) => 287 - amount / 120 * 240
  const steps = [
    { x: 80, start: 0, end: eok(capital.equity2024), value: amount(capital.equity2024), label: '2024 자본총계', color: colors.navy },
    { x: 209, start: eok(capital.equity2024), end: eok(afterBadDebt), value: `−${amount(badDebt)}`, label: '총 대손비용', color: colors.loss },
    { x: 338, start: eok(afterBadDebt), end: eok(capital.equity2025), value: `−${amount(otherNetDecrease)}`, label: '기타 순변동', color: colors.loss },
    { x: 467, start: 0, end: eok(capital.equity2025), value: amount(capital.equity2025), label: '2025 자본총계', color: colors.blue },
  ]
  return <svg viewBox="0 0 590 339" className={styles.capitalChart} role="img" aria-labelledby="v4-capital-chart-title v4-capital-chart-desc">
    <title id="v4-capital-chart-title">2024~2025년 자본총계 및 주요 변동 금액</title>
    <desc id="v4-capital-chart-desc">단위 억 원. 2024 자본 {amount(capital.equity2024)}, 총 대손비용 {amount(badDebt)}, 기타 순감소 {amount(otherNetDecrease)}, 2025 자본 {amount(capital.equity2025)}. 반올림 전 금액으로 연결 계산.</desc>
    {[0, 30, 60, 90, 120].map(tick => <g key={tick}>
      <path d={`M43 ${y(tick)} H573`} stroke={tick === 0 ? '#94a3b8' : colors.grid} />
      <text x="32" y={y(tick) + 4} textAnchor="end" fontSize="11" fill={colors.slate}>{tick}</text>
    </g>)}
    {steps.map((step, index) => <g key={step.label}>
      {index < 2 && <path d={`M${step.x + 76} ${y(step.end)} H${steps[index + 1].x}`} stroke="#94a3b8" strokeDasharray="4 3" />}
      <rect x={step.x} y={y(Math.max(step.start, step.end))} width="76" height={Math.abs(y(step.start) - y(step.end))} fill={step.color} />
      <text x={step.x + 38} y={y(Math.max(step.start, step.end)) - 12} textAnchor="middle" fontSize="21" fontWeight="800" fill={step.color}>{step.value}</text>
      <text x={step.x + 38} y="313" textAnchor="middle" fontSize="12" fontWeight="700" fill={colors.navy}>{step.label}</text>
    </g>)}
  </svg>
}

function RiskResolution() {
  return <Frame section="04 / BUSINESS & GROWTH" title="Risk & Resolution: 파인원 사태와 재무 팩트 체크">
    <div className={styles.riskPage}>
      <div className={styles.riskSummary}><strong>부채비율 상승의 주요 원인</strong><span>과거 채권의 대손비용 반영에 따른 장부상 자본 감소 · 총부채 증가와 구분</span></div>
      <div className={styles.risk}>
        <div className={styles.capital}>
          <div className={styles.panelHeading}><h3>자본총계 변동 폭포수 차트</h3><span>단위: 억 원</span></div>
          <CapitalChart />
          <div className={styles.debtStrip}>
            <div><span>총부채</span><strong>{amount(capital.debt2024)} <i>→</i> {amount(capital.debt2025)}<small>억 원</small></strong><p>2024 → 2025</p></div>
            <div><span>2025 부채비율</span><strong>{(capital.debt2025 / capital.equity2025 * 100).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}<small>%</small></strong><p>자본총계 감소에 따른 비율 상승</p></div>
          </div>
        </div>
        <div className={styles.resolutionColumn}>
          <section className={styles.crisisSection}>
            <h3>이슈의 발생 <span>CRISIS</span></h3>
            <ul><li>2025년 9월 고객사 파인원 부도 발생</li><li>회사 설명: 제품 불량이 아닌 고객사의 상장 준비·선행투자에 따른 유동성 문제</li><li>회수 불확실 채권 약 75억 원 중 <strong>68.2억 원 대손비용 반영</strong> — 2025년 결산</li></ul>
          </section>
          <section className={styles.resolutionSection}>
            <h3>팩트 체크 및 기회 <span>RESOLUTION</span></h3>
            <div><b>01 · 부채 자체의 증가 없음</b><p>총부채 333.66억 → 328.16억 원 감소<br />부채비율 상승의 주요 원인: 분모인 자본 감소</p></div>
            <div><b>02 · 대손비용 인식 시 추가 현금 유출 없음</b><p>과거 발생 채권의 회수가능성 하락 반영<br />비용 인식과 실제 채권 미회수에 따른 현금 영향 구분</p></div>
            <div><b>03 · 최종 고객사 직납 기회 창출</b><p>중간 벤더 경유에서 최종 패널사 직접 공급으로 전환<br />중국 CSOT·Visionox 1차 직납 진입</p></div>
          </section>
        </div>
      </div>
    </div>
  </Frame>
}

function CustomerLogo({ file, name }: { file: string; name: string }) {
  return <Image className={styles.customerLogo} src={`/temsco/v4/customer-logos/${file}`} alt={`${name} 로고`} width={180} height={42} unoptimized loading="eager" />
}

function GrowthPipeline() {
  return <Frame section="04 / BUSINESS & GROWTH" title="Growth Pipeline: 주요 고객사별 양산 전개 계획" subtitle="국내외 주요 패널사 및 글로벌 반도체·XR 장비사 직납 양산 라인업">
    <div className={styles.customerGroups}>
      <section className={styles.customerGroup}>
        <h3 className={styles.groupTitle}>국내 메인 고객사 <span>디스플레이</span></h3>
        <div className={styles.customerCard}>
          <div className={styles.customerHeading}><h4>삼성디스플레이 <small>SDC</small></h4><span>4개 모델 선정</span></div>
          <div className={styles.customerLogos}><CustomerLogo file="samsung-display.svg" name="삼성디스플레이" /></div>
          <ul><li><b>부품</b> · 진공증착용 메탈마스크 2027년 본양산 신규 4개 모델 선정 완료 · 추가 2개 모델 협의 중</li><li><b>소재</b> · 고순도 알루미늄(Al) 타겟 및 Invar 특수 소재 직납 평가 동시 진행</li></ul>
        </div>
        <div className={styles.customerCard}>
          <div className={styles.customerHeading}><h4>LG디스플레이 <small>LGD</small></h4><span>메인 공급사 선정</span></div>
          <div className={styles.customerLogos}><CustomerLogo file="lg-display.svg" name="LG디스플레이" /></div>
          <ul><li><b>부품</b> · 메탈마스크 1차 벤더 최우선 협상 대상자 및 메인 공급사 공식 선정</li><li><b>소재</b> · 몰리브덴(Mo)·알루미늄(Al) 타겟 평가 후 은(Ag) 합금 타겟 순차 확대</li></ul>
        </div>
      </section>
      <section className={`${styles.customerGroup} ${styles.globalGroup}`}>
        <h3 className={styles.groupTitle}>글로벌 패널사 &amp; 반도체·XR 장비사</h3>
        <div className={styles.customerCard}>
          <div className={styles.customerHeading}><h4>중국 Visionox &amp; CSOT</h4><span>Visionox 물량 30%</span></div>
          <div className={`${styles.customerLogos} ${styles.chinaLogos}`}><CustomerLogo file="visionox.webp" name="Visionox" /><CustomerLogo file="tcl-csot.svg" name="TCL CSOT" /></div>
          <p className={styles.customerCategory}>OLED 패널 글로벌 제조사</p>
          <ul><li>파인원 대체 1차 벤더 승격 완료</li><li><b>Visionox 전체 메탈마스크 물량의 30% 배정 확정</b></li><li>2026년 4분기부터 직수출 양산 계획</li></ul>
        </div>
        <div className={styles.smallCustomers}>
          <div className={styles.customerCard}><h4>AMAT &amp; eMagin <small>미국</small></h4><div className={`${styles.customerLogos} ${styles.usLogos}`}><CustomerLogo file="applied-materials.png" name="Applied Materials" /><CustomerLogo file="emagin.svg" name="eMagin" /></div><p>글로벌 장비사 · 초고해상도 XR</p><strong className={styles.customerStatus}>1차 벤더 등록 완료</strong></div>
          <div className={styles.customerCard}><h4>반도체 신사업 파이프라인</h4><p>HF 봄베 · CuMn 타겟 · 구리기판</p><strong className={styles.customerStatus}>시제품 평가 전개</strong></div>
        </div>
      </section>
    </div>
  </Frame>
}

const allocations = [
  { label: '설비 투자', english: 'CAPEX', amount: 40, share: '57%', color: colors.navy, use: '메탈마스크 정밀 가공 설비 고도화 및 라인 증설', goal: '1차 벤더 양산 물량 대응' },
  { label: '운영 자금', english: 'WORKING CAPITAL', amount: 20, share: '29%', color: colors.blue, use: '공급 확대 대응 원소재 확보', goal: 'LG·중국 공급 확대 및 삼성 협상 타결 후 양산 대응' },
  { label: '연구 개발', english: 'R&D / NEW BUSINESS', amount: 10, share: '14%', color: colors.slate, use: '반도체 HF 가스 봄베·CuMn 타겟 및 구리기판', goal: '반도체·전력반도체 양산 테스트' },
]

function UseOfProceeds() {
  return <Frame section="07 / FUNDING & INVESTOR EXIT" title="투자 유치 및 자금 활용 계획" subtitle="재무구조 개선 및 2026–2027년 수주 대응 · 투자기관별 투자 구조 및 세부 조건 협의"
    note={<>출처: 자금 조달 계획 · 조달·배분 금액: 제안 기준 · 비중 반올림 · 투자수단·조건 및 회계상 자본·부채 분류: 계약 조건별 검토<br/>* RCPS: Redeemable Convertible Preferred Stock(상환전환우선주) · CPS: Convertible Preferred Stock(전환우선주)<br/>* CB: Convertible Bond(전환사채) · BW: Bond with Warrant(신주인수권부사채)</>}>
    <div className={styles.funding}>
      <div className={styles.allocationOverview}>
        <div className={styles.fundingLead}><span>목표 조달 금액</span><strong>70<small>억 원</small></strong><p>성장 재원 확보</p></div>
        <div className={styles.allocationChart}>
          <div className={styles.panelHeading}><h3>자금 배분 계획</h3><span>총 조달액 기준</span></div>
          <div className={styles.stackedBar} role="img" aria-label="70억 원 배분: 설비 투자 40억 57%, 운영 자금 20억 29%, 연구 개발 10억 14%">
            {allocations.map(item => <div key={item.label} style={{ flex: item.amount, background: item.color }}><strong>{item.amount}<small>억</small></strong></div>)}
          </div>
          <div className={styles.allocationLegend}>{allocations.map(item => <span key={item.label}><i style={{ background: item.color }} />{item.label}<b>{item.share}</b></span>)}</div>
        </div>
      </div>
      <table className={styles.useTable} aria-label="자금 용도별 금액과 투자 목적">
        <colgroup><col style={{ width: '18%' }} /><col style={{ width: '10%' }} /><col style={{ width: '39%' }} /><col style={{ width: '33%' }} /></colgroup>
        <thead><tr><th scope="col">자금 용도</th><th scope="col">배분</th><th scope="col">주요 집행 대상</th><th scope="col">투자 목적</th></tr></thead>
        <tbody>{allocations.map(item => <tr key={item.label}><th scope="row">{item.label}<span>{item.english}</span></th><td className={styles.amount}>{item.amount}억</td><td>{item.use}</td><td>{item.goal}</td></tr>)}</tbody>
      </table>
      <div className={styles.instrumentRows}>
        <div><h3>Equity <span>자본 확충형 제안</span></h3><b>RCPS* · CPS* · 보통주</b><p>재무구조 개선 및 기업가치 상승 참여 · 투자기관별 조건 협의</p></div>
        <div><h3>Debt <span>메자닌·부채형 제안</span></h3><b>CB* · BW*</b><p>상환·전환·신주인수 조건 설계 · 양산 실적 연계 투자 구조 협의</p></div>
      </div>
    </div>
  </Frame>
}

export default function StrategySlide({ id }: { id: StrategySlideId }) {
  switch (id) {
    case 'risk-resolution': return <RiskResolution />
    case 'growth-pipeline': return <GrowthPipeline />
    case 'use-of-proceeds': return <UseOfProceeds />
  }
}
