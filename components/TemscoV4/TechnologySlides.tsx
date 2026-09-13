import Image from 'next/image'
import type { ReactNode } from 'react'
import styles from './TechnologySlides.module.css'

export const technologySlideIds = [
  'technology-materials', 'technology-mask', 'technology-process',
  'technology-quality', 'technology-development',
] as const
export type TechnologySlideId = (typeof technologySlideIds)[number]

function Photo({ file, alt, height, className = '' }: { file: string; alt: string; height?: number; className?: string }) {
  return <div className={`${styles.photo} ${className}`} style={height ? { height } : undefined}>
    <Image src={`/temsco/v4/technology/${file}`} alt={alt} fill sizes="600px" unoptimized loading="eager" />
  </div>
}

function Page({ title, source, children }: { title: string; source: string; children: ReactNode }) {
  return <article className={styles.slide} data-technology-slide>
    <div className={styles.heading}>
      <p className={styles.eyebrow}>TECHNOLOGY / TEMSCO &amp; WeFOMS</p>
      <h2 className={styles.title}>{title}</h2>
    </div>
    <div className={styles.body}>{children}</div>
    <div className={styles.source}>{source}</div>
  </article>
}

function Materials() {
  return <Page title="소재 공급 및 박막 코팅 기술" source="출처: 템스코 회사소개서(2025.08) p.29·35·36·44 / 공급 소재·장비 사양 기준, 자체 제조 범위·실제 생산능력과 구분">
    <div className={styles.split}>
      <div>
        <h3 className={styles.lead}>마스크용 소재 조달과<br />대면적 박막 코팅의 연계</h3>
        <figure className={styles.figure}>
          <Photo file="temsco-sputter.jpeg" height={282} alt="템스코 회사소개서에 제시된 인라인 스퍼터 장비" />
          <figcaption className={styles.caption}>인라인 스퍼터 장비 / 템스코 회사소개서 p.44</figcaption>
        </figure>
        <div className={styles.strip}>
          <strong>PVD 기반 반응성 스퍼터링</strong>
          <p>DC·Pulsed DC 방식 / 수직·수평 시스템<br />6GH·8GH Loading 대응 사양 / Al₂O₃ 막 균일도 ±10%</p>
        </div>
      </div>
      <div>
        <h3 className={styles.subhead}>핵심 소재 및 공급 사양</h3>
        <div className={styles.materialRow}>
          <Photo file="temsco-al-tube.png" alt="회사 카탈로그의 고순도 알루미늄 관재 적용 이미지" />
          <div><h3>고순도 알루미늄</h3><p><b>Al ≥99.999% / 5N</b><br />판재·관재 / 박막 증착용 타겟</p></div>
        </div>
        <div className={styles.materialRow}>
          <Photo file="temsco-invar-frame.jpeg" alt="템스코 INVAR36 소재의 마스크 프레임 적용 이미지" />
          <div><h3>INVAR36</h3><p><b>저열팽창 Ni36 소재</b><br />판재·박판·코일 / 프레임·시트 적용</p></div>
        </div>
        <table className={styles.table} style={{ marginTop: 21 }}>
          <thead><tr><th style={{ width: '29%' }}>연계 영역</th><th>기술·사업상 역할</th></tr></thead>
          <tbody>
            <tr><td>소재 조달</td><td>글로벌 제조사 거래 / 규격·납기 관리</td></tr>
            <tr><td>마스크 제조</td><td>위폼스 시트·프레임 공정과 소재 연계</td></tr>
            <tr><td>표면 코팅</td><td>진공 내 산화물·금속물질 박막 형성</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </Page>
}

function Mask() {
  return <Page title="오픈 메탈 마스크 구조 및 적용 공정" source="출처: 위폼스 회사소개서(2026.04) p.6–9 / G6H OMM·CVD Mask 양산 공급 표기 / OMM 사업 중심 분석 · 포토마스크·FMM 시장 및 가치평가 제외">
    <div className={styles.split}>
      <div>
        <h3 className={styles.subhead}>Mask Assembly / 시트·프레임·접합</h3>
        <Photo file="wefoms-mask.jpeg" height={320} alt="위폼스 OMM·CVD Mask 어셈블리 제품 사진" />
        <div className={styles.parts}>
          <div><b>Sheet</b><p>패턴 형성<br />증착 영역 정의</p></div>
          <div><b>Frame</b><p>시트 지지<br />형상 유지</p></div>
          <div><b>Welding</b><p>인장 상태 접합<br />시트·프레임 결합</p></div>
        </div>
        <p className={styles.note}>유리 기판과 패턴의 정렬을 위한 금속 가공물<br />Sheet·Frame 재질: INVAR36</p>
      </div>
      <div>
        <Photo file="wefoms-exploded.png" height={252} alt="위폼스 원본 자료의 Sheet와 Frame 분해 구조도" />
        <table className={styles.table} style={{ marginTop: 18 }}>
          <thead><tr><th style={{ width: '36%' }}>제품</th><th>OLED 적용 공정</th></tr></thead>
          <tbody>
            <tr><td><strong>OMM</strong><br />Open Metal Mask</td><td>유기물 공통층 증착</td></tr>
            <tr><td><strong>CVD Mask</strong></td><td>박막 봉지 / ENCAP</td></tr>
          </tbody>
        </table>
        <div className={styles.strip}>
          <strong>G6H 양산 제품군</strong>
          <p>Mobile·IT·Watch·Auto 모델 제시<br />제품별 고객 승인·납품량은 별도 확인 항목</p>
        </div>
      </div>
    </div>
  </Page>
}

function Process() {
  const steps = [
    ['01', '설계', '제품·패턴 설계'], ['02', '시트 제작', '재단·노광·에칭'],
    ['03', '시트 검사', '치수·형상 확인'], ['04', '인장·용접', '시트·프레임 조립'],
    ['05', '측정·검사', '측정·이물 검사'], ['06', '세정·출하', '세정·최종 검사'],
  ]
  return <Page title="정밀 마스크 제조 및 검사 공정" source="출처: 위폼스 회사소개서(2026.04) p.10·13–17 / 공정도 요약 / p.10 세정 단계 외주 표기와 p.15·17 사내 설비 설명 병존, 제품·시점별 운영 범위 확인 필요">
    <h3 className={styles.subhead}>설계부터 출하까지의 공정별 관리</h3>
    <div className={styles.flow} role="list" aria-label="마스크 제조 공정 순서">
      {steps.map(([n, title, detail]) => <div className={styles.step} key={n} role="listitem"><span>{n}</span><b>{title}</b><p>{detail}</p></div>)}
    </div>
    <div className={styles.photoGrid}>
      <figure className={styles.figure}>
        <Photo file="wefoms-etching.png" alt="위폼스 Mask Sheet 에칭 공정 설비" />
        <h3>시트 에칭</h3><p>DFR 라미네이션·노광·현상 후 에칭<br />패턴 가공 및 검사·측정</p>
      </figure>
      <figure className={styles.figure}>
        <Photo file="wefoms-welding.png" alt="위폼스 마스크 인장·용접 설비" />
        <h3>인장·용접</h3><p>입고 시트 검사 및 인장·용접<br />조립 후 형상·치수 확인</p>
      </figure>
      <figure className={styles.figure}>
        <Photo file="wefoms-aoi.png" alt="위폼스 AOI 검사 설비" />
        <h3>AOI 및 출하 검사</h3><p>광학 검사·측정 공정<br />제품 출하 전 검사 체계</p>
      </figure>
    </div>
    <div className={styles.processNote}>
      <b>CVD Mask 코팅</b><span>별도 코팅 공정 적용 / PVD 반응성 스퍼터링 방식<br />공정별 수율·Cycle Time·외주 범위와 원가 절감액의 연결 필요</span>
    </div>
  </Page>
}

function Quality() {
  return <Page title="단면 가공 및 코팅 품질 측정" source="출처: 위폼스 회사소개서(2026.04) p.16·18–20 / SEM 첫 번째 제시 샘플 / 측정 사례와 장비 사양의 구분, 양산 수율·공정능력·공차 적합성의 입증 자료와 구분">
    <div className={styles.quality}>
      <div>
        <h3 className={styles.subhead}>CVD Mask 코팅 단면 / SEM</h3>
        <Photo file="wefoms-sem-section.png" height={246} alt="위폼스 CVD Mask 첫 샘플 전체 단면 SEM 원본 이미지" />
        <div className={styles.micrographs}>
          {[
            ['wefoms-sem-top.png', 'Top / 상면'], ['wefoms-sem-slope.png', 'Slope / 경사면'], ['wefoms-sem-bottom.png', 'Bottom / 하면'],
          ].map(([file, label]) => <figure className={styles.figure} key={file}><Photo file={file} alt={`위폼스 첫 샘플 ${label} SEM 측정 이미지`} /><figcaption>{label}</figcaption></figure>)}
        </div>
        <div className={styles.strip}><strong>정밀 가공 항목</strong><p>Half Depth·Step Height·Taper Angle<br />제품별 시트 단면 및 Rib·Dam 형상 설계</p></div>
      </div>
      <div>
        <h3 className={styles.subhead}>위치별 코팅 두께 측정 사례</h3>
        <p className={styles.sampleLabel}>원본 목표 두께 2.50 μm / 측정 장비 SEM</p>
        <table className={`${styles.table} ${styles.qualityTable}`}>
          <thead><tr><th>측정 위치</th><th>측정값</th><th>목표 대비 차이</th></tr></thead>
          <tbody>
            <tr><td>Top</td><td><strong>2.85 μm</strong></td><td>+0.35 μm</td></tr>
            <tr><td>Slope</td><td><strong>2.54 μm</strong></td><td>+0.04 μm</td></tr>
            <tr><td>Bottom</td><td><strong>2.73 μm</strong></td><td>+0.23 μm</td></tr>
          </tbody>
        </table>
        <p className={styles.note}>동일 샘플 내 위치별 측정값<br />합격 기준·균일도 산식 미제시 / 적합 판정 미수행</p>
        <h3 className={styles.subhead} style={{ marginTop: 25 }}>코팅 공정 제시 사양</h3>
        <table className={`${styles.table} ${styles.qualityTable}`}>
          <tbody>
            <tr><td style={{ width: '32%' }}>증착 방식</td><td>PVD / 반응성 스퍼터링</td></tr>
            <tr><td>코팅 물질</td><td>Al₂O₃</td></tr>
            <tr><td>두께·균일도</td><td>1.5–2.5 μm / ±10%</td></tr>
          </tbody>
        </table>
        <p className={styles.note}>CVD Mask: 적용 제품명<br />PVD: 해당 자료에 제시된 실제 코팅 방식</p>
      </div>
    </div>
  </Page>
}

function Development() {
  return <Page title="대면적 마스크 개발 및 생산 기반" source="출처: 위폼스 회사소개서(2026.04) p.4·6·21 / CAPA는 2024.06 G6H 증설 기준 / 원본의 G8.6H·G8.7H 표기 구분, 대면적 제품의 고객 양산 승인·현재 판매량과 구분">
    <div className={styles.development}>
      <div>
        <h3 className={styles.subhead}>제품별 공급·개발 단계</h3>
        <div className={styles.track}><h3>G6H</h3><div><strong>양산 공급 기반</strong><p>2022.10 국내외 양산 공급<br />2024.06 생산능력 증설 완료</p></div></div>
        <div className={styles.track}><h3>G8급</h3><div><strong>대면적 개발 및 설비 투자</strong><p>2024.08 G8.6 제품 개발·설비 투자<br />2025.01 G8.6H 양산 투자 진행<br />2026.04 소개서: G8.7H Open Mask 개발</p></div></div>
        <div className={styles.track}><h3 style={{ fontSize: 17 }}>Micro<br />OLED</h3><div><strong>고해상도 제품 개발</strong><p>2025.08 12인치·4,500 PPI 제품 개발 이력<br />2026.04 소개서: 5,500 PPI 개발 표기</p></div></div>
        <div className={styles.milestones}><h3>매출 확대와의 연결 조건</h3><p>제품 규격 확정 / 고객 평가·양산 승인<br />생산수율·가동률 확보 / 발주·납기·판매단가 확정</p></div>
      </div>
      <div>
        <figure className={styles.figure}>
          <Photo file="wefoms-large-exposure.jpg" height={240} alt="위폼스 회사소개서의 8.7G ACC Support Stick LED 노광 설비" />
          <figcaption className={styles.caption}>ACC Support Stick용 8.7G LED 노광기 / 원본 제시 설비</figcaption>
        </figure>
        <div className={styles.capacity}><strong>450</strong><span>매/월<br />G6H 생산 CAPA</span></div>
        <p className={styles.note}>2024년 6월 증설 기준 회사 제시치<br />G8급 CAPA·현재 실생산량으로 환산 불가</p>
        <div className={styles.strip}><strong>인수로 결합한 기술·사업 기반</strong><p>템스코 소재 조달·코팅 사업<br />위폼스 시트 가공·인장용접·대형 제품 개발<br />대면적 마스크 적용 및 고객 평가 대응</p></div>
      </div>
    </div>
  </Page>
}

const panels = {
  'technology-materials': Materials, 'technology-mask': Mask, 'technology-process': Process,
  'technology-quality': Quality, 'technology-development': Development,
}

export default function TechnologySlide({ id }: { id: TechnologySlideId }) {
  const Panel = panels[id]
  return <Panel />
}
