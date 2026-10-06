import financial from './valuationData.json'
import { companyForecastEndYear } from './valuationInputs'

// Annual results share the audited inputs used by the valuation and financial slides.
// 2023 is pre-acquisition; its combined comparator is not statutory consolidation.
// 2024 includes pre-acquisition months; cumulative profits are not acquisition cash returns.
export type AnnualProfit = { revenue: number; operatingProfit: number; netIncome: number; source: string }
export type AcquisitionYear = { year: number; forecast: boolean; temsco: AnnualProfit; wefoms: AnnualProfit; consolidated: AnnualProfit }

function annualProfit(entity: 'parent' | 'subsidiary' | 'consolidated', year: number): AnnualProfit {
  const row = financial.entities[entity].income.find(item => item.year === year)
  if (!row) throw new Error('Missing acquisition financial input: ' + entity + '/' + year)
  const won = (value: number | null, name: string) => {
    if (value === null || !Number.isFinite(value)) throw new Error('Missing acquisition financial amount: ' + entity + '/' + year + '/' + name)
    return value * 100_000_000
  }
  return { revenue: won(row.revenue, 'revenue'), operatingProfit: won(row.ebit, 'ebit'), netIncome: won(row.netIncome, 'netIncome'), source: row.source }
}

export const acquisitionAnnualSources: AcquisitionYear[] = Array.from({ length: companyForecastEndYear - 2023 + 1 }, (_, index) => {
  const year = 2023 + index
  const temsco = annualProfit('parent', year)
  const wefoms = annualProfit('subsidiary', year)
  const consolidated = year === 2023 ? {
    revenue: temsco.revenue + wefoms.revenue,
    operatingProfit: temsco.operatingProfit + wefoms.operatingProfit,
    netIncome: temsco.netIncome + wefoms.netIncome,
    source: '2023년 양사 합산 비교치 · 법정 연결 실적 아님 / ' + temsco.source + '; ' + wefoms.source,
  } : annualProfit('consolidated', year)
  return { year, forecast: year >= 2026, temsco, wefoms, consolidated }
})

export const acquisitionConsideration = 9_000_000_000
export const operatingDrivers = {
  parentMaskRevenue2026: 16_000_000_000,
  parentMaskRevenue2029: 36_388_400_000,
  wefomsMaterialRate2026: 0.23551037992776794,
  wefomsMaterialRate2027: 0.20,
  reference: 'X04 추정손익!M7/V7; X03 통합_추정가정 (Drivers)!G10/H10',
}

export function buildAcquisitionValue(years: AcquisitionYear[] = acquisitionAnnualSources, consideration = acquisitionConsideration) {
  const cumulative = { temsco: 0, wefoms: 0, consolidated: 0, wefomsNetIncome: 0 }
  const annual = years.map(year => {
    cumulative.temsco += year.temsco.operatingProfit
    cumulative.wefoms += year.wefoms.operatingProfit
    cumulative.consolidated += year.consolidated.operatingProfit
    cumulative.wefomsNetIncome += year.wefoms.netIncome
    return { ...year, cumulative: { ...cumulative } }
  })
  const latestHistorical = annual.filter(year => !year.forecast).at(-1)!
  const finalForecast = annual.at(-1)!
  return {
    annual, latestHistorical, finalForecast, consideration,
    // Difference of accounting magnitudes only, not unrecovered capital or equity value.
    considerationLessCumulativeProfit: consideration - finalForecast.cumulative.wefoms,
  }
}
export const acquisitionValue = buildAcquisitionValue()
