export const preNdaContentVersion = 'pre-nda-public-allowlist-v1'

export type PreNdaSlide = {
  id: string
  section: string
  title: string
  subtitle: string
  kind: 'cover' | 'overview' | 'flow' | 'comparison' | 'roadmap' | 'framework' | 'risks' | 'closing'
  items: { label: string; heading: string; bullets: string[] }[]
}

// Independent disclosure allowlist: no imports from the full investment model.
export const preNdaSlides: PreNdaSlide[] = [
  {
    id: 'cover',
    section: 'INVESTMENT OVERVIEW',
    title: '템스코 투자검토 요약',
    subtitle: '박막 소재와 오픈 메탈 마스크의 사업 연계',
    kind: 'cover',
    items: [
      { label: 'BUSINESS', heading: '소재·부품 사업 기반', bullets: ['박막 증착용 소재 공급', '오픈 메탈 마스크 제조 역량 연계'] },
      { label: 'PURPOSE', heading: '초기 투자검토', bullets: ['사업 구조·기술 역량의 정성적 개요', '세부 재무·거래 조건의 후속 검토'] },
      { label: 'BASIS', heading: '회사 제공 자료 기준', bullets: ['사업 현황과 개발·성장 목표의 구분', '독립 실사 및 투자 조건 확인 필요'] },
    ],
  },
  {
    id: 'investment-focus',
    section: 'INVESTMENT OVERVIEW',
    title: '핵심 투자검토 관점',
    subtitle: '기술 결합의 사업성 및 지속 가능한 현금 창출력',
    kind: 'overview',
    items: [
      { label: 'CAPABILITY', heading: '소재와 제조의 결합', bullets: ['소재 조달·코팅과 정밀 마스크 가공의 연계', '공급 조건 및 공정 품질의 통합 관리 기회'] },
      { label: 'OPPORTUNITY', heading: '적용 제품 확대', bullets: ['기존 제품 공급 경험의 활용', '대면적 제품 개발 및 적용 범위 확대 목표'] },
      { label: 'DISCIPLINE', heading: '재무 회복의 검증', bullets: ['과거 손실 및 채권 손상 이력 고려', '수익성 회복·현금 회수의 실적 확인 필요'] },
    ],
  },
  {
    id: 'business-scope',
    section: 'BUSINESS & TECHNOLOGY',
    title: '사업 영역 및 역할',
    subtitle: '소재 공급부터 디스플레이용 정밀부품까지의 연계',
    kind: 'overview',
    items: [
      { label: 'MATERIALS', heading: '박막 증착용 소재', bullets: ['고순도 금속 타겟 및 특수 금속 소재 공급', '용도별 규격·납기 관리'] },
      { label: 'COMPONENTS', heading: '오픈 메탈 마스크', bullets: ['디스플레이 증착 공정용 OMM 사업', '시트·프레임·접합 구조의 정밀 제조'] },
      { label: 'INTERFACE', heading: '소재·부품 공정 연계', bullets: ['마스크용 소재 조달 및 코팅 역량 연계', '제품별 제조·외주 운영 범위 확인 필요'] },
    ],
  },
  {
    id: 'materials-capability',
    section: 'BUSINESS & TECHNOLOGY',
    title: '소재 공급 및 박막 코팅 역량',
    subtitle: '조달 네트워크와 제품 적용 기술의 연결',
    kind: 'flow',
    items: [
      { label: 'SOURCING', heading: '소재 조달', bullets: ['금속 소재 공급 네트워크 활용', '적용 제품별 규격·공급 조건 관리'] },
      { label: 'PROCESS', heading: '박막 코팅', bullets: ['스퍼터링 기반 표면 코팅 기술', '소재 특성과 후속 공정의 연계'] },
      { label: 'VALIDATION', heading: '적용성 확인', bullets: ['제품별 품질 요구사항 대응', '장비 사양과 실제 생산 성능의 구분'] },
    ],
  },
  {
    id: 'mask-capability',
    section: 'BUSINESS & TECHNOLOGY',
    title: '정밀 마스크 제조 및 품질 관리',
    subtitle: '설계·가공·조립·검사의 공정별 관리 체계',
    kind: 'flow',
    items: [
      { label: 'DESIGN', heading: '설계 및 시트 가공', bullets: ['제품·패턴 설계와 시트 가공', '형상·치수의 공정별 확인'] },
      { label: 'ASSEMBLY', heading: '인장 및 접합', bullets: ['시트·프레임 조립과 인장·용접', '조립 후 형상 및 정렬 상태 확인'] },
      { label: 'QUALITY', heading: '측정 및 출하 검사', bullets: ['광학 검사·측정·최종 검사 체계', '양산 수율·공정능력의 별도 검증 필요'] },
    ],
  },
  {
    id: 'collaboration',
    section: 'COLLABORATION & GROWTH',
    title: '소재·제조 협업 및 시너지 경로',
    subtitle: '외부 원가 절감과 제품 공급 확대의 연결 구조',
    kind: 'flow',
    items: [
      { label: 'PROCUREMENT', heading: '조달·물류 연계', bullets: ['소재 공급 기반의 제조 부문 활용', '외부 조달·물류 비용 절감 기회'] },
      { label: 'MANUFACTURING', heading: '공정·품질 연계', bullets: ['소재 특성과 마스크 가공 조건의 조율', '공정 품질 및 납기 대응력 개선 목표'] },
      { label: 'VALUE', heading: '경제적 효과 검증', bullets: ['외부 매출과 실제 원가 절감의 확인', '내부거래 제거 후 증분이익 평가 필요'] },
    ],
  },
  {
    id: 'development-roadmap',
    section: 'COLLABORATION & GROWTH',
    title: '제품 개발 및 성장 단계',
    subtitle: '기존 공급 기반·개발 목표·사업화 조건의 구분',
    kind: 'roadmap',
    items: [
      { label: 'ESTABLISHED', heading: '기존 제품 공급 기반', bullets: ['회사 자료상 기존 마스크 양산 공급 이력', '제품별 실제 납품 실적의 후속 확인'] },
      { label: 'DEVELOPMENT', heading: '대면적 제품 개발', bullets: ['대면적 마스크 개발 및 생산 기반 확장 목표', '개발 이력과 양산 승인·판매 실적의 구분'] },
      { label: 'GATES', heading: '매출 전환 조건', bullets: ['규격 확정·평가·생산 안정성 확보', '발주·납기·수익성 충족 이후 매출 확대'] },
    ],
  },
  {
    id: 'competitive-frame',
    section: 'COLLABORATION & GROWTH',
    title: '시장 범위 및 경쟁 비교 기준',
    subtitle: '오픈 메탈 마스크와 박막 소재의 사업별 분석',
    kind: 'comparison',
    items: [
      { label: 'OMM', heading: '마스크 제조 경쟁군', bullets: ['OMM 제품·공정의 직접 비교', '포토마스크·FMM 시장과의 구분'] },
      { label: 'MATERIALS', heading: '소재 공급 경쟁군', bullets: ['소재 품목·품질·공급 구조의 비교', '조달 비용·납기·서비스 경쟁력 검토'] },
      { label: 'COMPARABILITY', heading: '비교 가능성 판단', bullets: ['제품 구성·사업 규모·수익구조의 차이 조정', '시장 규모·점유율·배수의 별도 검증 필요'] },
    ],
  },
  {
    id: 'material-risks',
    section: 'FINANCIAL REVIEW',
    title: '주요 재무·사업 리스크',
    subtitle: '과거 손실과 향후 실행 불확실성의 동시 검토',
    kind: 'risks',
    items: [
      { label: 'CREDIT', heading: '채권 손상 및 자본 부담', bullets: ['과거 채권 손상과 손실의 재무 반영', '자본 감소·채권 회수·차입 부담 검토 필요'] },
      { label: 'EXECUTION', heading: '사업화 및 수익성 위험', bullets: ['개발·평가·양산 안정화의 지연 가능성', '판매 단가·수율·가동률에 따른 손익 변동'] },
      { label: 'FUNDING', heading: '현금흐름 및 조달 위험', bullets: ['재고·매출채권·설비 투자의 선행 자금 소요', '회복 전망의 미실현 및 추가 조달 가능성'] },
    ],
  },
  {
    id: 'financial-review',
    section: 'FINANCIAL REVIEW',
    title: '재무 검토 및 현금흐름 분석',
    subtitle: '회계상 손익·경제적 효과·현금 회수의 구분',
    kind: 'framework',
    items: [
      { label: 'SCOPE', heading: '별도·연결 기준', bullets: ['법인별 손익·재무상태의 개별 확인', '연결 내부거래 및 비지배지분 조정'] },
      { label: 'EARNINGS', heading: '지속 가능한 수익성', bullets: ['과거 실적과 회사 전망의 구분', '일회성 항목·정상 영업이익의 검증'] },
      { label: 'CASH', heading: '현금 전환 및 투자 부담', bullets: ['운전자본·설비·개발 투자 소요 검토', '회계상 이익과 투자금 회수의 구분'] },
    ],
  },
  {
    id: 'capital-plan',
    section: 'CAPITAL & VALUATION',
    title: '성장 자금의 활용 방향',
    subtitle: '수요·기술 검증에 따른 단계별 집행 계획',
    kind: 'roadmap',
    items: [
      { label: 'FACILITIES', heading: '생산 기반 고도화', bullets: ['정밀 가공·검사 역량 및 설비 개선', '생산 안정성·가동 여건에 따른 집행'] },
      { label: 'WORKING CAPITAL', heading: '운영 재원 확보', bullets: ['원소재·재고 및 공급 확대 대응', '회수 기간과 유동성 여유의 관리'] },
      { label: 'DEVELOPMENT', heading: '기술 개발 및 검증', bullets: ['소재·공정 개발과 제품 적용성 평가', '단계별 성과에 따른 후속 조달 검토'] },
    ],
  },
  {
    id: 'valuation-framework',
    section: 'CAPITAL & VALUATION',
    title: '기업가치 평가 접근법',
    subtitle: '현금 창출력과 비교기업 적합성의 교차 검토',
    kind: 'comparison',
    items: [
      { label: 'DCF', heading: '잉여현금흐름 평가', bullets: ['영업이익·세금·상각·재투자·운전자본의 연계', '정상 현금흐름과 영구무성장 모형 적용'] },
      { label: 'MULTIPLES', heading: '비교기업 배수 검토', bullets: ['OMM·소재 사업의 비교 가능성 우선 판단', '적합 배수 미확정에 따른 산정 보류'] },
      { label: 'SENSITIVITY', heading: '가정 및 민감도 검토', bullets: ['매출·수익성·투자 소요·할인율의 영향 분석', '낙관·중도·비관 가정과 실현 조건의 구분'] },
    ],
  },
  {
    id: 'exit-framework',
    section: 'CAPITAL & VALUATION',
    title: '투자자 Exit 검토 구조',
    subtitle: '회수 경로별 실행 조건 및 계약상 권리의 확인',
    kind: 'comparison',
    items: [
      { label: 'IPO', heading: '상장 후 지분 회수', bullets: ['상장 적격성·시장 수요·매각 제한 검토', '심사·공모·유통 여건에 따른 실행 불확실성'] },
      { label: 'STAKE SALE', heading: '전략적·재무적 지분 매각', bullets: ['인수 후보의 실사·가격 합의·양도 조건 확인', '매수자 확보 및 실제 회수 대금의 불확실성'] },
      { label: 'BUY-BACK', heading: '계약 조건부 매수 옵션', bullets: ['별도 합의 전 옵션 권리 미확정', '의무자·실행 조건·재원 확인 및 원금 손실 가능성'] },
    ],
  },
  {
    id: 'next-review',
    section: 'NEXT STEPS',
    title: '후속 투자검토 및 확인 과제',
    subtitle: '비밀유지 합의 후 근거 자료와 투자 조건의 검토',
    kind: 'closing',
    items: [
      { label: 'FINANCIAL', heading: '재무 실사', bullets: ['별도·연결 실적과 채권·차입·현금흐름 확인', '사업계획·평가 가정·자금 소요의 대사'] },
      { label: 'TECHNICAL', heading: '기술 및 사업 실사', bullets: ['제품별 공급·개발 단계와 품질 근거 확인', '지속 공급 가능성 및 경제적 효과의 검증'] },
      { label: 'TERMS', heading: '투자 구조 협의', bullets: ['투자 수단·가치·권리·자금 집행 조건 검토', '손실 위험과 회수 조건의 종합 판단'] },
    ],
  },
]
