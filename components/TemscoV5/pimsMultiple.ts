import source from './pimsMultipleData.json'

// KRW inputs, unrounded calculations. This is a disclosed valuation proxy, not a pure OMM segment quote.
export const pimsShares = source.issuedSharesBeforeCancellation - source.cancelledShares - source.treasurySharesAfterCancellation
export const pimsEquity = source.priceKRW * pimsShares
export const pimsAdjustedCash = source.reportedCashKRW - source.buybackCashPaidKRW
export const pimsLtmRevenue = source.revenue2025KRW + source.revenueH12026KRW - source.revenueH12025KRW
export const pimsLtmEbit = source.ebit2025KRW + source.ebitH12026KRW - source.ebitH12025KRW
export const pimsEv = pimsEquity + source.bankDebtKRW + source.leaseDebtKRW + source.nciMarketValueAssumptionKRW - pimsAdjustedCash - source.fairValueFinancialAssetsKRW * source.financialAssetDeductionRateAssumption
export const pimsEvSales = pimsEv / pimsLtmRevenue
export const pimsBasisNote = `핌스 EV/Sales ${pimsEvSales.toFixed(4)}배 · 2026.09.08 주가 / 2026.06 LTM · 연결 매출배수 대용`
export const pimsAssumptionNote = '6월말 재무+7월 자사주 현금조정 · 비영업 금융자산 공정가치 차감·NCI 시장가치 0 가정 · 외부매출 법인비중 배분'
export { source as pimsSource }
