import Frame from './CorporateSlideFrame'
import styles from './OverviewSlides.module.css'

export type OverviewSlideId = 'investment-highlights' | 'company-overview' | 'business-synergy'

const highlights = [
  {
    number: '01', title: '소재·정밀부품 수직계열화',
    lines: ['고순도 박막 코팅 소재와 정밀 메탈마스크 제조 역량 결합', '2024년 3월 위폼스 인수 · 인수가격 90억 원', '소재–정밀가공–코팅–세정 공정 연계'],
  },
  {
    number: '02', title: 'LG 1차 벤더 직접 판매',
    lines: ['기존 LG 1차 벤더 경유 소재 판매에서 LG 직접 판매로 전환', '위폼스 마스크의 LG·중국 고객 판매', 'LG 레퍼런스 기반 삼성 공급 가격 협상 진행'],
  },
  {
    number: '03', title: '직수출 확대 및 고객 접점 전환',
    lines: ['파인원 회생절차 이후 글로벌 패널사 직납 체제 전환', '비전옥스 전체 마스크 물량의 30% 배정 확정', '2026년 4분기 직수출 양산 계획'],
  },
  {
    number: '04', title: '별도·연결 실적 회복 및 성장 계획',
    lines: ['2025년 채권 손상에 따른 손실 반영', '2026E 영업이익 회복 및 2029E 매출 확대 계획', '4안 제공 재무제표 기준 · 별도·연결 수치 구분'],
  },
]

const businesses = [
  { label: '박막 소재', title: '고순도 박막 코팅 소재', text: 'Al · Mo · CuMn · Ag 등 스퍼터링 타겟', detail: '반도체·디스플레이 미세 배선막 및 첨단 에너지 소재' },
  { label: '정밀 부품', title: '정밀 메탈마스크', text: '위폼스 CVD · OMM 마스크', detail: 'OLED 진공증착 핵심 부품 · 인수를 통한 제조 역량 확보' },
  { label: '특수강', title: 'Ni 특수강 및 SUS420 비철소재', text: '고진공 챔버 및 정밀 가공 부품용 소재', detail: '신뢰성 기초 소재 공급 네트워크' },
]

const milestones = [
  { date: '2010.10', title: '회사 설립', lines: ['고순도 박막 소재 기반', '2010–2023년 사업 기반 구축'] },
  { date: '2024.03', title: '위폼스 인수', lines: ['인수가격 90억 원', '정밀 메탈마스크 제조 역량 결합'] },
  { date: '2025.12', title: '채권 손상 결산 반영', lines: ['기존 설명 기준 미회수 채권 80억 원', '전액 대손상각 반영'] },
  { date: '2026.01–', title: '고객사 직접 판매 확대', lines: ['LG 1차 벤더 직납 · 중국 판매', '삼성 공급 가격 협상 진행'] },
]

function Highlights() {
  return <Frame
    title="핵심 투자 하이라이트"
    section="01 / INVESTMENT OVERVIEW"
    subtitle="소재·부품 역량 결합 · 직접 판매 확대 · 별도·연결 실적 회복 계획"
    note={<>사업·고객 현황: 회사 제공 설명 기준. 재무 수치: 4안 제공 재무제표 · 단위: 억 원 · E: 회사 전망.</>}
  >
    <div className={styles.highlightsLayout} data-overview-slide="investment-highlights">
      <div className={styles.highlightRows}>
        {highlights.map(item => <section key={item.number} className={styles.highlightRow}>
          <span className={styles.rowNumber}>{item.number}</span>
          <div>
            <h3>{item.title}</h3>
            <ul>{item.lines.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
        </section>)}
      </div>
      <aside className={styles.financialPanel}>
        <p className={styles.eyebrow}>FINANCIAL OUTLOOK</p>
        <h3>2026E 실적 계획</h3>
        <div className={styles.keyMetric}>
          <span>템스코 별도 매출</span>
          <p>400.00<small>억 원</small></p>
        </div>
        <table className={styles.financialTable}>
          <caption>2026E 별도·연결 비교</caption>
          <thead><tr><th scope="col">구분</th><th scope="col">별도</th><th scope="col">연결</th></tr></thead>
          <tbody>
            <tr><th scope="row">매출액</th><td>400.00</td><td>414.63</td></tr>
            <tr><th scope="row">영업이익</th><td>41.52</td><td>13.30</td></tr>
          </tbody>
        </table>
        <div className={styles.forwardMetrics}>
          <p className={styles.eyebrow}>2029E · 회사 성장 계획</p>
          <div><span>별도 매출</span><strong>744.29<small>억 원</small></strong></div>
          <div><span>연결 매출</span><strong>832.86<small>억 원</small></strong></div>
        </div>
        <p className={styles.panelNote}>연결 수치: 내부거래 조정 반영<br />고객 협상 및 양산 계획: 진행 상태 구분</p>
      </aside>
    </div>
  </Frame>
}

function Company() {
  return <Frame
    title="회사 개요 및 기술 리더십"
    section="01 / INVESTMENT OVERVIEW"
    subtitle="고순도 박막 소재 기반 · 정밀부품 제조 역량 확장 · 기술 국산화 성과"
    note={<>수상: 한국산업기술진흥협회 명예의전당 · 세부 분야·공적 및 사업 연혁: 회사 제공. 채권 손상 연혁의 80억 원: 기존 설명 기준.</>}
  >
    <div className={styles.companyLayout} data-overview-slide="company-overview">
      <div className={styles.companyTop}>
        <section className={styles.award} data-ceo-award>
          <p className={styles.awardYear}>2026 기술개발인의 날</p>
          <h3>과학기술진흥유공</h3>
          <p className={styles.awardTitle}>대통령표창</p>
          <p className={styles.awardRecipient}>주식회사 템스코 · 오정석 대표이사</p>
          <ul>
            <li>디스플레이 증착용 마스크 프레임 조립체 국산화·상용화 주도</li>
            <li>핵심 부품 국산화 · 공급망 리스크 대응 · 산업 자립도 제고</li>
            <li>위치 정밀도 및 패턴 정합도 개선</li>
          </ul>
        </section>
        <section className={styles.businesses}>
          <h3>핵심 사업 영역</h3>
          {businesses.map(item => <div key={item.label} className={styles.businessRow}>
            <span className={styles.businessLabel}>{item.label}</span>
            <div><h4>{item.title}</h4><p>{item.text}</p><small>{item.detail}</small></div>
          </div>)}
        </section>
      </div>
      <section className={styles.timeline}>
        <div className={styles.timelineHeading}><h3>주요 사업 연혁</h3><span>소재 기반 → 제조 역량 결합 → 직접 판매 확대</span></div>
        <ol className={styles.timelineItems}>
          {milestones.map(item => <li key={item.date}>
            <p className={styles.timelineDate}>{item.date}</p>
            <span className={styles.timelinePoint} aria-hidden="true" />
            <h4>{item.title}</h4>
            {item.lines.map(line => <p key={line} className={styles.timelineDetail}>{line}</p>)}
          </li>)}
        </ol>
      </section>
    </div>
  </Frame>
}

function FlowArrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return <svg className={styles.flowArrow} viewBox="0 0 240 18" aria-hidden="true">
    {direction === 'right'
      ? <path d="M1 9 H233 M226 2 L234 9 L226 16" />
      : <path d="M239 9 H7 M14 2 L6 9 L14 16" />}
  </svg>
}

function Synergy() {
  return <Frame
    title="소재·부품 공정 연계 및 사업 시너지"
    section="02 / ACQUISITION & SYNERGY"
    subtitle="원재료 직접 조달과 정밀 제조 역량의 결합 · 소재–정밀가공–코팅–세정 연계"
    note={<>회사 제공 사업 구조 기준의 공정 연계 개념도. 손익 효과: 내부거래 제거 후 연결 기준 산정 · 개별 공정 수행 범위: 기술 소개 자료 참조.</>}
  >
    <div className={styles.synergyLayout} data-overview-slide="business-synergy">
      <div className={styles.supplyCaption}><span>공급 기반</span>Invar 박판·후판 직접 조달 · 중간 유통 마진 절감 · 마스크 원가 구조 최적화</div>
      <div className={styles.entityDiagram} role="group" aria-label="템스코와 위폼스 간 소재 공급 및 마스크 공급 구조">
        <section className={styles.entity}>
          <span className={styles.entityEnglish}>TEMSCO</span>
          <h3>템스코</h3>
          <p>박막 소재 · 코팅 · 세정</p>
          <div>원소재 조달 및 가공<br />LG 1차 벤더 판매 기반</div>
        </section>
        <div className={styles.exchange}>
          <div><p>Invar 박판·후판 직공급</p><FlowArrow /><small>소재 조달·가공 역량</small></div>
          <div><p>CVD · OMM 마스크 공급</p><FlowArrow direction="left" /><small>정밀 메탈마스크 제조 역량</small></div>
        </div>
        <section className={`${styles.entity} ${styles.entityBlue}`}>
          <span className={styles.entityEnglish}>WeFOMS</span>
          <h3>위폼스</h3>
          <p>정밀 메탈마스크 제조</p>
          <div>CVD · OMM<br />소재·정밀가공 협업</div>
        </section>
      </div>
      <div className={styles.processChain} aria-label="연계 공정: 소재, 정밀가공, 코팅, 세정">
        {['소재', '정밀가공', '코팅', '세정'].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 3 ? <b aria-hidden="true">→</b> : null}</div>)}
      </div>
      <div className={styles.outcomes}>
        <section><span>01 · 공정</span><h3>리드타임 및 품질 관리</h3><ul><li>공정 연계를 통한 품질 편차 관리</li><li>납기 개선 및 리드타임 단축 추진</li></ul></section>
        <section><span>02 · 매출</span><h3>소재·부품 판매 확대</h3><ul><li>LG 1차 벤더 기반 직접 판매</li><li>소재·마스크 고객 접점 확대</li></ul></section>
        <section><span>03 · 손익</span><h3>구매·물류 원가 절감</h3><ul><li>외부 유통마진 회수</li><li>내부거래 제거 후 연결 손익 산정</li></ul></section>
      </div>
    </div>
  </Frame>
}

export default function OverviewSlide({ id }: { id: OverviewSlideId }) {
  if (id === 'investment-highlights') return <Highlights />
  if (id === 'company-overview') return <Company />
  return <Synergy />
}
