import { researchLayouts } from './ResearchLayouts'
import { evidenceLayouts } from './EvidenceLayouts'
import type { ReactNode } from 'react'
import s from './deck.module.css'
import market from './marketResearch.json'
import { chapters } from './outline'

const sourceLink = (url: string, text: string) => <a className={s.sourceLink} href={url} target="_blank" rel="noreferrer">{text}</a>
const nyu = 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/BetasGlobal.html'
const tvSource = 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/littlebook/terminalvalue.htm'
export function Contents({ onNavigate }: { onNavigate: (index: number) => void }) {
  return <div className={s.contentsLayout}>
    <aside className={s.contentsIntro}><span>ANALYSIS FRAMEWORK</span><strong>05</strong><h3>분석 영역</h3><div><p>기준일 <b>2026.09.08</b></p><p>통화·단위 <b>KRW·억 원</b></p><p>수치 구분 <b>A 실적 / E 추정</b></p></div><small>회사 수록값·시장 관측값·분석 가정의 구분<br />출처·기준일의 개별 표시</small></aside>
    <div className={s.toc}>{chapters.map(ch => <div key={ch.title} className={s.tocRow}><div><a href={`#slide-${ch.start + 1}`} onClick={e => { e.preventDefault(); onNavigate(ch.start) }}>{ch.title}</a><p>{ch.detail}</p></div><span>{ch.start + 1}{ch.end !== ch.start ? `–${ch.end + 1}` : ''}</span></div>)}</div>
  </div>
}
export type ResearchSlide = { section: string; title: string; subtitle: string; source: ReactNode; content: ReactNode }
export const researchSlides: Record<string, ResearchSlide> = {
  'market-scope': {
    section: 'II / Market and forecast', title: '시장 범위 및 매출 정의', subtitle: '시장 범위: 소재·메탈마스크 제품별 정의 · 점유율 비교: 동일 범위의 회사 외부 매출 기준',
    source: '자료: S05 회사 설명 · S06 부문별 추정 · S04 고객 구분 · SAM: 접근 가능한 시장 · SOM: 생산·승인·판매 제약을 반영한 회사 확보 매출',
    content: researchLayouts['market-scope'],
  },
  competitors: {
    section: 'II / Competition', title: '동종산업 경쟁사 비교', subtitle: '비교 기간: 한국 2026년 상반기 · 일본 4–6월 분기 · 비교 원칙: 통화·기간 차이 반영, 단순 연환산 제외',
    source: <>자료: {sourceLink(market.sources.pims_h1, '핌스 8/14')}, {sourceLink(market.sources.pw_h1, '풍원정밀 정정 8/24')}, {sourceLink(market.sources.dnp_q1, 'DNP 8/7')}, {sourceLink(market.sources.jx_q1, 'JX 8/6')} 공식 연결 실적 · 일본 기업: 마스크·타겟 외 다각화 사업 포함</>,
    content: evidenceLayouts['competitors'],
  },
  'market-evidence': {
    section: 'II / Market evidence', title: '시장 전망 및 점유율 검증', subtitle: '공개 전망: 시장 범위·발표 시점 명시 · TAM·점유율: 원문 확인 전 미확정',
    source: <>출처: {sourceLink(market.sources.omdia_2026, 'Omdia 2026.07.15')}, {sourceLink(market.sources.sdc, '삼성디스플레이 2024.03.10')}, {sourceLink(market.sources.maskreport, 'Omdia Shadow Mask 2026.09.02')} · 공개 시점: 모두 분석 기준일 이전</>,
    content: researchLayouts['market-evidence'],
  },
  'revenue-build': {
    section: 'II / Revenue build', title: '시장 기반 매출 추정', subtitle: '추정 기준: 시장 접근성·회사 공급 제약 동시 반영 · 연결 조정: 내부거래 제거',
    source: '자료: S06 부문별 매출 · S04 고객별 매출 · S02 연결조정 · 부문별 표: 내부거래 제거 전 · 연결 외부 매출 점유율 산정: 내부거래 제거 후 분자 적용',
    content: researchLayouts['revenue-build'],
  },
  'full-pl': {
    section: 'II / Projected income statement', title: '연결 추정손익계산서', subtitle: '범위: 매출부터 당기순이익까지 동일 연결 기준 · 세금 구분: 손익계산서 세금 / FCFF 영업 현금세금',
    source: '자료: S02 연결 I/M/Q/U/Y/AC열 · S04·S06 대조 · A: 제공 파일 실적 · E: 회사 추정 · 미완료 검증: 과거 연결 재무 대사·시장·점유율',
    content: evidenceLayouts['full-pl'],
  },
  'valuation-scope': {
    section: 'III / Valuation analysis', title: 'DCF 평가 기준', subtitle: '평가 방법: 연결 FCFF의 WACC 할인 · 잔존가치: 정상화 현금흐름 기반 무성장모형',
    source: <>평가 방법: FCFF DCF · 잔존가치: 무성장모형 · {sourceLink(tvSource, 'NYU · Terminal Value')} 재투자·정상화 원칙 참고</>,
    content: researchLayouts['valuation-scope'],
  },
  'wacc-inputs': {
    section: 'III / Market-based WACC', title: 'WACC 시장 입력', subtitle: '적용 기준: 관측일 시차·업종 대용값의 한계 표시 · 소기업 가산금리: 임의 가산 제외',
    source: <>출처: {sourceLink('https://www.bond.co.kr/conts/10075', 'KIS 9/7 금리')}, {sourceLink('https://pages.stern.nyu.edu/adamodar/New_Home_Page/home.htm', 'NYU 9/1 ERP')}, {sourceLink('https://pages.stern.nyu.edu/~adamodar/pc/datasets/ctrypremJuly26.xlsx', '7월 CRP')}, {sourceLink('https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7746', '국세청 2026 세율')} · 증적: 날짜별 원자료·정밀도의 별도 분석 기록</>,
    content: researchLayouts['wacc-inputs'],
  },
  'wacc-build': {
    section: 'III / Cost of capital', title: '베타 및 자본구조', subtitle: '업종 참고: 전자부품·특수화학 개별 검토 · WACC 가중치: 시장가치 기준, 장부 부채비율 1,133% 적용 제외',
    source: <>자료: {sourceLink(nyu, 'NYU 글로벌 업종 데이터')} 2026.01 · KIS 2026.09.07 · 업종 평균: 비교기업 선정 전 참고치 · 회사 최종 할인율·조달금리: 별도 확정 대상</>,
    content: evidenceLayouts['wacc-build'],
  },
  fcff: {
    section: 'III / Free cash flow', title: 'FCFF 산출', subtitle: '중도안 · 일반 누진세율·상각기간·산업 운전자본율·개발투자의 1차 가정 적용',
    source: '자료: S02·S03·S04·S06 · 신규 모델: 세금·내용연수·개발투자·산업 NCWC 가정 · 회사 손익 원표 별도 보존 / 억 원',
    content: evidenceLayouts['fcff'],
  },
  reinvestment: {
    section: 'III / Reinvestment', title: '1차 재무가정 및 재투자', subtitle: '공식 세율·산업 참고치·분석 가정의 구분 · 후속 실측자료 교체를 위한 입력 기준',
    source: '자료: 국세청·지자체 2026 일반세율 / NYU 2026.01 글로벌 전자업종 / S03 자산잔액 / 20% 자산화계수·내용연수: 분석 가정',
    content: researchLayouts['reinvestment'],
  },
  terminal: {
    section: 'III / Zero-growth terminal value', title: '무성장 잔존가치', subtitle: '영구 명목성장률: g = 0% · 안정기 재투자: 일정 현금흐름 유지에 필요한 지출 포함',
    source: <>적용 모형: 무성장모형 · 방법 참고: {sourceLink(tvSource, 'NYU · Terminal Value')} · 제3안 영구성장률: 0% · 기존 DCF의 2% 적용 제외</>,
    content: researchLayouts['terminal'],
  },
  'equity-value': {
    section: 'III / Enterprise to equity value', title: '기업가치 및 주주가치', subtitle: '기준일 통일: 현금·차입금·비지배지분 · 신주 투자금: 별도 반영',
    source: '자료: S03 과거실적 · 2025 참고 잔액: 순차입금 235.10억·비지배지분 13.30억 · 2026.09.08 평가: 2025 잔액의 대용 적용 가정 · 비영업 조정 0 · NCI 장부가 대용',
    content: researchLayouts['equity-value'],
  },
  'tv-sensitivity': {
    section: 'III / Valuation sensitivity', title: '무성장 TV 단일변수 검토', subtitle: '보조 검토: 2029년 말 TV의 계수 민감도 · 후속 3개 사업 시나리오의 현재 EV와 구분',
    source: '산식: 중도안 정상 FCFF × 80%/100%/120% ÷ WACC · 개발상각=개발투자 / 정상 ΔNWC=0 · 표: 2029말 TV, 현재 EV와 구분',
    content: evidenceLayouts['tv-sensitivity'],
  },
  funding: {
    section: 'IV / Financing roadmap', title: '단계별 투자유치 계획', subtitle: 'Series A·B·C: 단계 명칭 제안 · 후속 조달 시점·금액: 미확정',
    source: '초기 라운드: 기존 70억 제안 참고 · 후속 조달: 미확정 · 산출 근거: 영업현금·집행·차입상환·최소 현금잔액의 월별 계획',
    content: researchLayouts['funding'],
  },
  dilution: {
    section: 'IV / Ownership and returns', title: '지분 희석 및 회수 분석', subtitle: '연결 항목: 증자대금·지분율·주당 가격·우선권 · 기준: 동일 자본구조표',
    source: '기본 산식: 동일 권리 보통주 신주발행 · 계약별 조정: CB·BW·우선주·옵션풀·청산우선권·발행비용',
    content: researchLayouts['dilution'],
  },
  register: {
    section: 'V / Evidence and assumptions', title: '자료 출처 및 가정 검토', subtitle: '자료 구분: 관측값·회사 계획·분석 가정 · 검토 항목: 결론별 근거·미확정 판단',
    source: '시장·공시 자료: 기준일 이전 공개 원문 · 별도 가치추정 분석서: 회사 자료 출처 셀·시장자료 링크·가정·계산 근거',
    content: evidenceLayouts['register'],
  },
}
