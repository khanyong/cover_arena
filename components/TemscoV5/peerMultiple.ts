import pw from './poongwonMultipleData.json'
import { pimsEvSales } from './pimsMultiple'

export const poongwonEquity = pw.priceKRW * (pw.sharesH1 + pw.conversionShares + pw.newIssueShares)
export const poongwonLtmRevenue = pw.revenue2025KRW + pw.revenueH12026KRW - pw.revenueH12025KRW
// Book-value debt proxy; converted preference shares are already in market equity.
// New borrowing/repayment has equal cash effects; only equity proceeds change net debt here.
export const poongwonEv = poongwonEquity + pw.bankShortDebtKRW + pw.bankCurrentLongDebtKRW + pw.bankLongDebtKRW
  + pw.convertibleHostKRW + pw.convertibleDerivativeKRW + pw.nciKRW
  - pw.reportedCashKRW - pw.derivativeAssetKRW - pw.newIssueShares * pw.issuePriceKRW + pw.issueFeesAssumptionKRW
export const poongwonEvSales = poongwonEv / poongwonLtmRevenue
export const peerMultiples = [pimsEvSales, poongwonEvSales]
export const peerMean = peerMultiples.reduce((sum, value) => sum + value, 0) / peerMultiples.length
// For two observations, the median equals the arithmetic mean.
export const peerMedian = peerMean
export const peerBasisNote = `핌스·풍원정밀 EV/Sales 단순평균 ${peerMean.toFixed(4)}배 · 각 50% · 2026.09.08 주가 / 2026.06 LTM · 표본 2개`
export const peerAssumptionNote = '복합사업 연결 배수·순수 OMM 배수 아님 · 차입금 장부가 대용·증자/소각 조정 · 세우 최신 거래가치 미확인으로 평균 제외'
export { pw as poongwonSource }
