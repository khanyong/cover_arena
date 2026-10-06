import Frame from './CorporateSlideFrame'
import { pimsEvSales, pimsEv, pimsLtmRevenue } from './pimsMultiple'
import { poongwonEvSales, poongwonEv, poongwonLtmRevenue, peerMean, peerMedian, peerBasisNote, peerAssumptionNote } from './peerMultiple'

const ommPeers = [
  {
    company: '핌스',
    priority: '최우선',
    products: 'OMM · S-Mask · CVD Mask',
    overlap: '프레임·에칭·인장 공정 내재화',
    valuation: `EV/Sales ${pimsEvSales.toFixed(4)}배 · 평균에 50% 반영`,
    caveat: '연결 매출 기준 · NCI·금융자산 조정 가정',
  },
  {
    company: '풍원정밀',
    priority: '평균에 포함',
    products: 'OMM · SBM · ACC 등',
    overlap: 'OMM 제품·고객·공정 비교',
    valuation: `EV/Sales ${poongwonEvSales.toFixed(4)}배 · 50% 반영`,
    caveat: 'FMM 포함 복합사업 · 채무 장부가 대용',
  },
  {
    company: '세우인코퍼레이션',
    priority: '사업 비교',
    products: 'OLED Metal Mask · 코팅',
    overlap: '메탈마스크 제조·설비 확장 이력',
    valuation: '제품·공정 경쟁구도 비교',
    caveat: '최신 거래가치 미확인 · 평균에서 제외',
  },
]

export function OmmPeersSlide() {
  return <Frame
    title="OMM 경쟁사 및 비교기업 선정"
    section="06 / VALUATION & INVESTMENT"
    subtitle="오픈 메탈 마스크 사업 기준 · 핌스 우선 비교 · 소재 경쟁군 별도 구분"
    note={<>
      출처: <a href="https://pimskorea.com/product/pdt02.php">핌스 제품</a> · <a href="https://kind.krx.co.kr/external/2026/03/20/000786/20260320003100/11011.htm">핌스 공시</a> · <a href="https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260824000174">풍원정밀 공시</a> · <a href="https://www.sewooinc.com/en/company/history.php">세우 연혁</a> · <a href="https://www.cometnet.biz/cbiz0200010.asp">코멧 계열사</a> · <a href="https://kind.krx.co.kr/external/2026/03/13/002056/20260313005055/11011.htm">YMC 공시</a><br />
      {peerBasisNote}<br />{peerAssumptionNote}
    </>}
  >
    <div className="omm-peers" data-omm-peers-slide>
      <div className="scope-line">
        <strong>분석 대상 <span>OPEN METAL MASK</span></strong>
        <span>경쟁사 연결 배수 사용 · FMM 등 사업혼합 유의</span>
      </div>

      <table className="peer-table">
        <caption>OMM 경쟁사 및 가치평가 적용 범위</caption>
        <colgroup><col style={{ width: '21%' }} /><col style={{ width: '37%' }} /><col style={{ width: '42%' }} /></colgroup>
        <thead><tr><th scope="col">경쟁사 · 우선순위</th><th scope="col">제품·공정 비교</th><th scope="col">가치평가 적용 기준</th></tr></thead>
        <tbody>{ommPeers.map(peer => <tr key={peer.company} className={peer.company === '핌스' ? 'primary-peer' : ''}>
          <th scope="row"><strong>{peer.company}</strong><span className="priority">{peer.priority}</span></th>
          <td><strong>{peer.products}</strong><span>{peer.overlap}</span></td>
          <td><strong>{peer.valuation}</strong><span>{peer.caveat}</span></td>
        </tr>)}</tbody>
      </table>

      <div className="review-grid">
        <section className="materials">
          <p className="eyebrow">MATERIALS · 별도 경쟁군</p>
          <h3>코멧네트워크 · YMC</h3>
          <div className="materials-row"><strong>코멧네트워크<small>코멧 계열</small></strong><p>타겟 소재·본딩·Backing Plate<br /><span>그룹과 제조 법인 재무 구분</span></p></div>
          <div className="materials-row"><strong>YMC<small>와이엠씨</small></strong><p>스퍼터링 타겟·본딩 · 삼성디스플레이 공급<br /><span>소재·부품·용역의 복합사업 구조</span></p></div>
          <div className="samsung-strategy"><strong>삼성 소재 1차벤더 진입 추진</strong><span>YMC와의 경쟁 · 회사 제공 전략 · 공급 확정 전</span></div>
        </section>

        <section className="multiple-review">
          <p className="eyebrow">MULTIPLE REVIEW · 배수 적용 기준</p>
          <h3>OMM 비교기업 배수 검토</h3>
          <ol>
            <li><span>01</span><div><strong>OMM 사업·재무 비교기업 선정</strong><p>핌스·풍원정밀 각 50% · 소재 경쟁군 별도</p></div></li>
            <li><span>02</span><div><strong>개별 EV / LTM 매출 (억원)</strong><p>핌스 {(pimsEv/1e8).toFixed(2)} / {(pimsLtmRevenue/1e8).toFixed(2)}<br />풍원정밀 {(poongwonEv/1e8).toFixed(2)} / {(poongwonLtmRevenue/1e8).toFixed(2)}</p></div></li>
            <li><span>03</span><div><strong>평균·중앙값 및 관측 범위</strong><p>평균 {peerMean.toFixed(4)}배 · 중앙값 {peerMedian.toFixed(4)}배<br />범위 {pimsEvSales.toFixed(4)}~{poongwonEvSales.toFixed(4)}배 · 표본 2개</p></div></li>
          </ol>
        </section>
      </div>
    </div>
    <style jsx>{`
      .omm-peers { display: flex; flex-direction: column; gap: 12px; height: 100%; color: #0f2746; }
      .scope-line { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #eff6ff; border-left: 3px solid #2563eb; font-size: 11px; line-height: 1.5; }
      .scope-line strong { font-size: 12px; }
      .scope-line strong span { color: #2563eb; margin-left: 12px; letter-spacing: .055em; }
      .scope-line > span { color: #475569; }
      .peer-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; line-height: 1.5; }
      .peer-table caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
      .peer-table thead { color: #64748b; font-size: 10px; text-align: left; }
      .peer-table thead th { padding: 0 14px 9px; border-bottom: 1px solid #94a3b8; font-weight: 600; }
      .peer-table tbody th, .peer-table tbody td { text-align: left; padding: 9px 14px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
      .peer-table tbody th > strong { display: block; font-size: 14px; font-weight: 800; }
      .peer-table td > strong { display: block; font-weight: 700; }
      .peer-table td > span { display: block; font-size: 11px; color: #64748b; margin-top: 3px; }
      .priority { display: inline-block; margin-top: 4px; font-size: 10px; font-weight: 600; color: #64748b; }
      .primary-peer { background: #f8fbff; }
      .primary-peer .priority { color: #2563eb; }
      .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; flex: 1; min-height: 0; }
      .eyebrow { margin: 0 0 6px; color: #2563eb; font-size: 9px; font-weight: 700; letter-spacing: .09em; }
      h3 { margin: 0 0 9px; font-size: 17px; font-weight: 800; letter-spacing: -.03em; }
      .materials-row { display: grid; grid-template-columns: 115px 1fr; padding: 8px 0; border-top: 1px solid #e2e8f0; }
      .materials-row > strong { font-size: 11px; line-height: 1.45; }
      .materials-row small { display: block; color: #64748b; font-size: 10px; font-weight: 500; }
      .materials-row p { margin: 0; font-size: 11px; line-height: 1.6; }
      .materials-row p span { color: #64748b; font-size: 10px; }
      .samsung-strategy { border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 1px; }
      .samsung-strategy strong { display: block; color: #2563eb; font-size: 12px; }
      .samsung-strategy span { display: block; color: #64748b; font-size: 10px; margin-top: 3px; }
      .multiple-review { border-left: 1px solid #e2e8f0; padding-left: 27px; }
      .multiple-review ol { list-style: none; margin: 0; padding: 0; }
      .multiple-review li { display: grid; grid-template-columns: 25px 1fr; gap: 10px; padding: 7px 0; border-top: 1px solid #e2e8f0; }
      .multiple-review li > span { font-size: 11px; font-weight: 800; color: #2563eb; line-height: 1.5; }
      .multiple-review li strong { font-size: 11px; line-height: 1.5; }
      .multiple-review li p { margin: 3px 0 0; color: #64748b; font-size: 10px; line-height: 1.5; }
    `}</style>
  </Frame>
}

export default OmmPeersSlide
