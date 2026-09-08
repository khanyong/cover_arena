import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import s from '../../components/TemscoV3/deck.module.css'
import { outline, contentTitles, chapters, pageForContent } from '../../components/TemscoV3/outline'
import { ChapterDivider } from '../../components/TemscoV3/ChapterDivider'
import { Contents, researchSlides } from '../../components/TemscoV3/dcfSlides'
import { scenarioSlides } from '../../components/TemscoV3/ScenarioLayouts'
import { financialLayouts } from '../../components/TemscoV3/FinancialLayouts'
import { financials as f, fmt } from '../../components/TemscoV3/financials'

const titles = outline
const n = (value: number) => <span className={value < 0 ? s.negative : undefined}>{fmt(value)}</span>

export default function TemscoDeckV3Page() {
  const [mode, setMode] = useState<'presentation' | 'scroll'>('presentation')
  const [current, setCurrent] = useState(0)
  const [scale, setScale] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const navigate = (index: number) => {
    const next = Math.max(0, Math.min(titles.length - 1, index))
    setCurrent(next)
    window.history.replaceState(null, '', `#slide-${next + 1}`)
    if (mode === 'scroll') document.getElementById(`slide-${next + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const toggleFullscreen = async () => {
    try {
      setFullscreenError('')
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { setFullscreenError('전체화면 전환 실패') }
  }
  useEffect(() => {
    const readHash = () => {
      const match = window.location.hash.match(/^#slide-(\d+)$/)
      if (match) setCurrent(Math.max(0, Math.min(titles.length - 1, Number(match[1]) - 1)))
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    const change = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', change)
    return () => { window.removeEventListener('hashchange', readHash); document.removeEventListener('fullscreenchange', change) }
  }, [])
  useEffect(() => {
    const update = () => setScale(Math.max(.15, Math.min((window.innerWidth - 28) / 1123, mode === 'scroll' ? 1 : (window.innerHeight - (fullscreen ? 130 : 175)) / 794, 1.4)))
    update(); window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [mode, fullscreen])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName)) return
      if (mode === 'scroll') return
      if (['ArrowRight', 'PageDown', ' ', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault()
        navigate(event.key === 'Home' ? 0 : event.key === 'End' ? titles.length - 1 : current + (['ArrowLeft', 'PageUp'].includes(event.key) ? -1 : 1))
      } else if (event.key.toLowerCase() === 'f') { event.preventDefault(); void toggleFullscreen() }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [current, mode])

  const slide = (contentIndex: number, section: string, title: string, subtitle: string, source: ReactNode, children: ReactNode) => {
    const index = pageForContent(contentIndex)
    return <div key={index} id={`slide-${index + 1}`} className={`${s.frame} ${mode === 'presentation' && current !== index ? s.hidden : ''}`} style={{ width: 1123 * scale, height: 794 * scale }}>
    <section className={`${s.slide} temsco-slide`} style={{ transform: `scale(${scale})` }} aria-labelledby={`title-${index}`}>
      <div className={s.slideHead}><strong>TEMSCO</strong><span>{section}</span><span>제3안 · 검토용 초안</span></div>
      <h2 id={`title-${index}`}>{title}</h2><p className={s.deck}>{subtitle}</p>
      <div className={s.content}>{children}</div>
      <footer className={s.foot}><span>{source}</span><b>{String(index + 1).padStart(2, '0')}</b></footer>
    </section>
  </div>
  }

  const extraSlide = (index: number, key: string) => {
    const d = researchSlides[key]
    return slide(index, d.section, contentTitles[index], d.subtitle, d.source, d.content)
  }

  return <div className={s.root}>
    <Head><title>템스코 | 제3안 투자제안서</title><meta name="description" content="템스코 제3안 투자제안서: 인수 전후 실적, 연결 손익 및 투자자금의 재무 효과" /><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></Head>
    <header className={s.toolbar}><div><Link href="/temsco" className={s.brand}>TEMSCO</Link><span className={s.toolbarTitle}>제3안 투자제안서 · DCF·멀티플 시나리오</span></div><div className={s.controls}>
      <select aria-label="슬라이드 선택" value={current} onChange={e => navigate(Number(e.target.value))}>{titles.map((title, i) => <option key={title} value={i}>{String(i + 1).padStart(2, '0')}. {title}</option>)}</select>
      <button onClick={() => setMode(mode === 'presentation' ? 'scroll' : 'presentation')}>{mode === 'presentation' ? '전체 보기' : '발표 보기'}</button>
      <button onClick={() => void toggleFullscreen()}>{fullscreen ? '전체화면 종료' : '전체화면'}</button><button onClick={() => window.print()}>인쇄 / PDF</button><Link href="/temsco/deck">기존 최종본</Link>
    </div></header>
    {fullscreenError && <p role="status" style={{ color: '#fff', padding: '8px 24px' }}>{fullscreenError}</p>}
    <main className={s.stage}>
      <div id="slide-1" className={`${s.frame} ${mode === 'presentation' && current !== 0 ? s.hidden : ''}`} style={{ width: 1123 * scale, height: 794 * scale }}>
        <section className={`${s.slide} ${s.cover} temsco-slide`} style={{ transform: `scale(${scale})` }} aria-labelledby="cover-title">
          <div className={s.coverMain}>
            <div className={s.coverTop}><div className={s.coverBrand}>TEMSCO</div><span>INVESTMENT PROPOSAL<br />2026.09 · V3</span></div>
            <div className={s.coverKicker}>FINANCIAL PERFORMANCE &amp; VALUATION</div>
            <h1 id="cover-title">자본 확충 및<br />연결 수익성 회복</h1>
            <p>템스코·위폼스의 인수 전후 실적<br />신규 투자금의 재무 효과 및 미래가치 분석</p>
            <div className={s.coverIndex}><p><b>01</b>과거 실적</p><p><b>02</b>미래 손익</p><p><b>03</b>가치추정</p></div>
            <div className={s.coverBottom}><span>주식회사 템스코<br />전문 투자자 검토용 · 제3안 초안</span><span>회사 제공자료 기준 / 2026.09.08<br />투자조건·가치평가 협의 대상</span></div>
          </div>
        </section>
      </div>
      {slide(1, 'Contents', contentTitles[1], '과거 실적·미래 손익의 근거·가치추정·후속 조달의 단계별 분석', '수치 구분: 회사 자료·시장 관측값·분석 가정 / III장: 가치추정 분석 별도 구성', <Contents onNavigate={navigate} />)}
      <ChapterDivider chapter={chapters[0]} scale={scale} hidden={mode === 'presentation' && current !== chapters[0].start} />
      {slide(2, 'Investment overview', contentTitles[2], '자본 확충의 즉시 효과 및 영업 회복의 실행 조건', '자료: 연결 추정손익(S02), 위폼스 추정손익(S04), 기존 최종 제안안 / E: 회사 추정, 확정 실적 아님', financialLayouts[2])}
      {slide(3, 'Acquisition rationale', contentTitles[3], '소재 공급·정밀부품 제조의 결합 및 고객 직접 공급 범위 확대 목적', '자료: 회사 설명(S05), 투자자 요구사항(S07) / 현재 설명에 따른 인수 목적 재구성 / 당시 투자심의서·가격산정·자금조달 내역 미제공', financialLayouts[3])}
      {slide(4, 'Acquisition performance', contentTitles[4], '인수 첫해 연간 실적 개선 및 2025년 매출 증가 속 적자 전환', '자료: S04 추정손익 / 2024년 연간 실적 기준, 인수 이후 기간 한정 성과 아님 / 실적 개선의 인과관계: 구매·수율·원가 자료 확인 필요', financialLayouts[4])}
      {slide(5, 'Earnings bridge', contentTitles[5], '2024년 영업이익 대비 2025년 영업손실의 변동 요인 · 단위: 억 원', '자료: S04 추정손익 D/E열 / 2024 외주비 행 공란: 별도 계상액 0 기준 비교 / 실제 비용 발생·계정 재분류 여부 확인 필요', financialLayouts[5])}
      {slide(6, 'Quality of earnings', contentTitles[6], '2025년 판관 대손 가산 비교 · 회계상 정상화 이익의 확정 아님', '자료: S02 연결, S06 템스코 추정손익, S04 위폼스 추정손익 / 대손의 비경상성 인정·재발 가능성 별도 검토 / 단위: 억 원', financialLayouts[6])}
      {slide(7, 'Capital structure', contentTitles[7], '2025년 연결 재무상태 수록값 · 최근 월별 현금수지·차입 만기 갱신 필요', '자료: S03 재무상태표(T) 연결 수록값 / 2025년 말 기준, 2026년 현재 잔액 아님 / 단위: 억 원', financialLayouts[7])}
      {slide(8, 'Consolidation', contentTitles[8], '내부 매출·매입 상계 후 그룹 외부 매출 기준 평가', '자료: S02 연결·연결조정 내역, S04 추정손익 / 현재 모델의 내부 매출·원가 동일액 차감 / 미실현손익 등 추가 연결조정 별도 대사', financialLayouts[8])}
      <ChapterDivider chapter={chapters[1]} scale={scale} hidden={mode === 'presentation' && current !== chapters[1].start} />
      {extraSlide(9, 'market-scope')}
      {extraSlide(10, 'competitors')}
      {extraSlide(11, 'market-evidence')}
      {extraSlide(12, 'revenue-build')}
      {extraSlide(13, 'full-pl')}
      {slide(14, 'Operating assumptions', contentTitles[14], '회사 전망의 주요 전제와 실제 수율·외주비·고객별 판매량의 연계 검증', '자료: S04 추정손익·Drivers·CAPEX / 직접재료비율의 템스코향 매출 한정 적용 / 외부 고객 재료비 처리·생산능력 근거 확인 필요', <>
        <div className={s.assumptionMain}>
          <div className={s.assumptionHero}><p>2026E → 2029E</p><strong>2.76<span>×</span></strong><h3>위폼스 매출 전망</h3><p className={s.assumptionNote}>2028~29 신규 설비투자 0원 가정<br />공정별 양품 CAPA 검증 필요</p></div>
          <table className={`${s.table} ${s.assumptionTable}`}><thead><tr><th scope="col">주요 가정 / 억 원</th><th scope="col">2026E</th><th scope="col">2027E</th><th scope="col">2028E</th><th scope="col">2029E</th></tr></thead><tbody><tr><td>매출</td>{f.subsidiary.revenue.slice(2).map((v, i) => <td key={i}>{fmt(v)}</td>)}</tr><tr><td>외주비 / 전체 매출</td>{[40, 30, 30, 30].map((v, i) => <td key={i}>{v}%</td>)}</tr><tr><td>직접재료비 / 템스코향 매출</td><td>23.55%</td><td>20%</td><td>14%</td><td>10%</td></tr><tr><td>신규 CAPEX</td><td>2.5</td><td>11.5</td><td>0.0</td><td>0.0</td></tr><tr className={s.total}><td>영업손익</td>{f.subsidiary.op.slice(2).map((v, i) => <td key={i}>{n(v)}</td>)}</tr></tbody></table>
        </div>
        <div className={s.assumptionSplit}><div><p>2027E 매출 구성</p><strong>229.5<span>억</span></strong></div><div><p>템스코향</p><strong>184.2<span>억</span></strong></div><div><p>외부 고객</p><strong>45.2<span>억</span></strong></div><p>외부 고객 매출: 2026E 48.4억 대비 감소<br /><b>외부 매출 확대만으로 회복 설명 불가</b></p></div>

      </>)}
      <ChapterDivider chapter={chapters[2]} scale={scale} hidden={mode === 'presentation' && current !== chapters[2].start} />
      {extraSlide(15, 'valuation-scope')}
      {extraSlide(16, 'wacc-inputs')}
      {extraSlide(17, 'wacc-build')}
      {extraSlide(18, 'fcff')}
      {extraSlide(19, 'reinvestment')}
      {extraSlide(20, 'terminal')}
      {extraSlide(21, 'equity-value')}
      {extraSlide(22, 'tv-sensitivity')}
      {scenarioSlides.map((d, i) => slide(23 + i, 'III / Scenarios and market valuation', contentTitles[23 + i], d.subtitle, d.source, d.content))}
      <ChapterDivider chapter={chapters[3]} scale={scale} hidden={mode === 'presentation' && current !== chapters[3].start} />
      {slide(31, 'Use of proceeds', contentTitles[31], '기존 제안의 배분안 유지 · 설비·수주 계획에 따른 법인별 수혜·집행 시점 확정 필요', '자료: 기존 최종본의 CAPEX 40억·운전자금 20억·R&D 10억 배분 / 성과 지표: 집행 검토 기준 제안, 회사 확정 목표 아님', financialLayouts[23])}
      {slide(32, 'Illustrative pro forma', contentTitles[32], '2025년 연결 수록값 기준 · 70억 전액 자본성 신주 현금납입의 단순 반영 예시', '산식: S03의 2025 연결 자산·현금·자본 각 70억 가산, 부채 유지 / 발행비용·이후 손익·집행 미반영 / 실제 증권 조건별 결과 차이', financialLayouts[24])}
      {extraSlide(33, 'funding')}
      {extraSlide(34, 'dilution')}
      {slide(35, 'Capital deployment', contentTitles[35], '모회사·자회사 간 내부 자금 이동의 그룹 현금 유입 중복 계상 배제', '투자금 사용 경로 검토 / 법인별 출자·대여·구매 형태, 신규 상각·운전자금·세금 자료 미비 / 투자 유무별 현금흐름 미산출', financialLayouts[27])}
      {slide(36, 'Operating sensitivity', contentTitles[36], '2027년 매출 229.47억 고정 · 외주비율 1%p 개선 시 영업이익 약 2.3억 증가', '산식: S04 2027 매출 × 외주비율 차이 / 매출·다른 원가·감가상각·세금·CAPEX 고정 / 부분 민감도, 전체 하방 전망·투자수익률 아님', financialLayouts[28])}
      {slide(37, 'Investment terms', contentTitles[37], '재무 확인·운영 성과 연계 조건 협의안', '투자조건·집행 기준 미확정 / 근거: 투자자 요구사항(S07) 및 S02·S03·S04·S06 분석 / 원금 보장·확정 수익률 전제 없음', financialLayouts[29])}
      <ChapterDivider chapter={chapters[4]} scale={scale} hidden={mode === 'presentation' && current !== chapters[4].start} />
      {extraSlide(38, 'register')}
    </main>
    <nav className={`${s.bottom} ${s.controls}`} aria-label="발표 이동"><button disabled={current === 0} onClick={() => navigate(current - 1)}>이전</button><span aria-live="polite">{current + 1} / {titles.length}</span><progress max={titles.length} value={current + 1} aria-label="발표 진행" /><button disabled={current === titles.length - 1} onClick={() => navigate(current + 1)}>다음</button><span>방향키로 이동 · F 전체화면</span></nav>
  </div>
}
