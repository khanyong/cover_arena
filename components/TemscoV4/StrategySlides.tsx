import Frame from './CorporateSlideFrame'
import styles from './StrategySlides.module.css'

export type StrategySlideId = 'risk-resolution' | 'growth-pipeline' | 'use-of-proceeds'

const colors = { navy: '#0f2746', blue: '#2563eb', slate: '#64748b', loss: '#b42332', grid: '#e2e8f0' }

function CapitalChart() {
  const y = (amount: number) => 287 - amount / 120 * 240
  const steps = [
    { x: 80, start: 0, end: 104.7, value: '104.7', label: '2024 자본총계', color: colors.navy },
    { x: 209, start: 104.7, end: 36.5, value: '−68.2', label: '대손상각비', color: colors.loss },
    { x: 338, start: 36.5, end: 21.1, value: '−15.4', label: '기타·지분법 등', color: colors.loss },
    { x: 467, start: 0, end: 21, value: '21.0', label: '2025 자본총계', color: colors.blue },
  ]
  return <svg viewBox="0 0 590 339" className={styles.capitalChart} role="img" aria-labelledby="v4-capital-chart-title v4-capital-chart-desc">
    <title id="v4-capital-chart-title">2024~2025년 자본총계 및 주요 변동 금액</title>
    <desc id="v4-capital-chart-desc">단위 억 원. 2024년 자본총계 104.7, 대손상각비 감소 68.2, 기타·지분법 등 감소 15.4, 2025년 자본총계 21.0. 표시 변동 항목의 합산과 기말 자본총계 간 0.1억 원 차이, 원본 세부 조정내역 확인 전.</desc>
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
  return <Frame section="04 / BUSINESS & GROWTH" title="채권 손상 및 재무구조 변화" subtitle="2025년 채권손상 반영 · 자본총계 감소 원인 및 고객사 직접 공급 전환"
    note={<>출처: 기존 투자제안서의 회사 설명 및 재무 요약 · 표시 변동 항목 합계와 기말 자본총계 간 0.1억 원 차이 · 원본 세부 조정내역 확인 전</>}>
    <div className={styles.risk}>
      <div className={styles.capital}>
        <div className={styles.panelHeading}><h3>자본총계 및 주요 변동</h3><span>단위: 억 원</span></div>
        <CapitalChart />
        <div className={styles.debtStrip}>
          <div><span>총부채</span><strong>333 <i>→</i> 328<small>억 원</small></strong><p>2024 → 2025</p></div>
          <div><span>2025 부채비율</span><strong>1,557<small>%</small></strong><p>자본총계 감소에 따른 비율 상승</p></div>
        </div>
      </div>
      <div className={styles.factColumn}>
        <div className={styles.fact}>
          <span className={styles.factNumber}>01</span>
          <div><h3>채권 회수 불확실성</h3><p>2025년 9월 파인원 부도 발생</p><p>약 75억 원 채권 중 68.2억 원 대손상각 반영</p><p className={styles.secondary}>회사 설명: 제품 불량과 구분 · 고객사 상장 준비 및 선행투자 관련 유동성 문제</p></div>
        </div>
        <div className={styles.fact}>
          <span className={styles.factNumber}>02</span>
          <div><h3>장부상 자본 감소</h3><p>총부채 감소에도 부채비율 상승</p><p>과거 발생 채권의 손상 비용 반영</p><p className={styles.secondary}>대손상각 인식 자체의 당기 현금 유출 없음</p></div>
        </div>
        <div className={styles.fact}>
          <span className={styles.factNumber}>03</span>
          <div><h3>최종 고객사 직납 전환</h3><p>중간 벤더 경유에서 직접 공급으로 전환</p><p>중국 CSOT·비전옥스 1차 직납 진입</p><p className={styles.secondary}>영업·기술 역량 기반 고객 접점 확대</p></div>
        </div>
      </div>
    </div>
  </Frame>
}

const pipelineRows = [
  { customer: '삼성디스플레이', english: 'SDC · 국내 디스플레이', status: '1차 벤더 진입 추진', timing: '가격 협상·최종 공급 조건 협의', parts: ['OMM 공급 가격 협상'], materials: ['기존 공급사 YMC와 경쟁', 'LG 레퍼런스 기반 직접 납품 추진'] },
  { customer: 'LG디스플레이', english: 'LGD · 국내 디스플레이', status: '1차 벤더 · 직납', timing: '직접 판매 전환', parts: ['위폼스 마스크 매입', '템스코의 LG 직접 판매'], materials: ['기존 LG 1차 벤더 경유 판매', 'LG 직접 판매로 전환'] },
  { customer: 'Visionox · CSOT', english: '중국 · OLED 패널', status: '1차 벤더 승격 완료', timing: '2026년 4분기 직수출 양산 계획', parts: ['비전옥스 전체 메탈마스크', '물량 30% 배정 확정'], materials: ['소재 공급 내역 미기재'] },
  { customer: 'AMAT · eMagin', english: '미국 · 장비 / 초고해상도 XR', status: '1차 벤더 등록 완료', timing: '고객별 공급 확대 추진', parts: ['글로벌 장비사·XR 고객 기반'], materials: ['품목별 세부 내역 미기재'] },
  { customer: '반도체 신사업', english: '신규 사업 파이프라인', status: '시제품 평가 전개', timing: '양산 테스트 추진', parts: ['HF 가스 봄베'], materials: ['CuMn 타겟', '전력반도체 구리기판'] },
]

function GrowthPipeline() {
  return <Frame section="04 / BUSINESS & GROWTH" title="주요 고객사별 공급 현황" subtitle="LG 1차 벤더 직접 판매 · 중국 고객 판매 · 삼성 가격 협상 및 신규 고객 공급 확대"
    note={<>출처: 기존 투자제안서 및 회사 제공 고객 진행 현황 · YMC와의 경쟁 및 삼성 1차 벤더 진입: 회사 제공 추진 현황, 선정·수주 확정 아님 · 비전옥스 물량 30% 및 일정: 회사 기재 기준</>}>
    <div className={styles.pipeline}>
      <div className={styles.pipelineLabel}><h3>고객별 공급 범위 및 진행 단계</h3><span>현재 상태와 향후 협의 사항 구분</span></div>
      <table className={styles.pipelineTable} aria-label="주요 고객사별 공급 현황 및 진행 단계">
        <colgroup><col style={{ width: '24%' }} /><col style={{ width: '26%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /></colgroup>
        <thead><tr><th scope="col">고객사 / 시장</th><th scope="col">진행 상태 / 일정</th><th scope="col">부품 / 마스크</th><th scope="col">소재 / 적용 품목</th></tr></thead>
        <tbody>{pipelineRows.map(row => <tr key={row.customer}>
          <th scope="row"><strong>{row.customer}</strong><span>{row.english}</span></th>
          <td><b>{row.status}</b><p>{row.timing}</p></td>
          <td>{row.parts.map(line => <p key={line}>{line}</p>)}</td>
          <td>{row.materials.map(line => <p key={line}>{line}</p>)}</td>
        </tr>)}</tbody>
      </table>
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
    note={<>출처: 기존 투자제안서 자금 조달 계획 · 조달·배분 금액: 제안 기준 · 비중 반올림 · 투자수단·조건 및 회계상 자본·부채 분류: 계약 조건별 검토</>}>
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
        <div><h3>Equity <span>자본 확충형 제안</span></h3><b>RCPS · CPS · 보통주</b><p>재무구조 개선 및 기업가치 상승 참여 · 투자기관별 조건 협의</p></div>
        <div><h3>Debt <span>메자닌·부채형 제안</span></h3><b>CB · BW</b><p>상환·전환·신주인수 조건 설계 · 양산 실적 연계 투자 구조 협의</p></div>
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
