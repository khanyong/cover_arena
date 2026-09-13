// Company-provided whole-year P&L, X01 workbook cached outputs, verified 2026-09-13.
// 2024 includes pre-acquisition months; profits are not acquisition cash returns.
export type AnnualProfit = { revenue: number; operatingProfit: number; netIncome: number; source: string }
export type AcquisitionYear = { year: number; forecast: boolean; temsco: AnnualProfit; wefoms: AnnualProfit; consolidated: AnnualProfit }

export const acquisitionAnnualSources: AcquisitionYear[] = [
  {
    "year": 2024,
    "forecast": false,
    "temsco": {
      "revenue": 39858957704,
      "operatingProfit": 2057794642,
      "netIncome": 1612408048,
      "source": "모회사!E21/E32"
    },
    "wefoms": {
      "revenue": 9260937083,
      "operatingProfit": 1522689367,
      "netIncome": 1534212036,
      "source": "자회사!C21/C32"
    },
    "consolidated": {
      "revenue": 40324731206,
      "operatingProfit": 3560424009,
      "netIncome": 3126560084,
      "source": "연결!I23/I34"
    }
  },
  {
    "year": 2025,
    "forecast": false,
    "temsco": {
      "revenue": 35058443364,
      "operatingProfit": -5190138779,
      "netIncome": -8369046769,
      "source": "모회사!H21/H32"
    },
    "wefoms": {
      "revenue": 12581202964,
      "operatingProfit": -1791426194,
      "netIncome": -1977013335,
      "source": "자회사!D21/D32"
    },
    "consolidated": {
      "revenue": 34261655569,
      "operatingProfit": -7324105280,
      "netIncome": -8824123393,
      "source": "연결!M23/M34"
    }
  },
  {
    "year": 2026,
    "forecast": true,
    "temsco": {
      "revenue": 40000000000,
      "operatingProfit": 4151840048.2799997,
      "netIncome": 2469283142.2584,
      "source": "모회사!K21/K32"
    },
    "wefoms": {
      "revenue": 14000000000,
      "operatingProfit": -2822234498,
      "netIncome": -3029881038,
      "source": "자회사!E21/E32"
    },
    "consolidated": {
      "revenue": 41462759896,
      "operatingProfit": 1329605550.2799997,
      "netIncome": -560597895.7416002,
      "source": "연결!Q23/Q34"
    }
  },
  {
    "year": 2027,
    "forecast": true,
    "temsco": {
      "revenue": 59087117851,
      "operatingProfit": 6816346335.926206,
      "netIncome": 4547598046.62244,
      "source": "모회사!N21/N32"
    },
    "wefoms": {
      "revenue": 21631075070.422535,
      "operatingProfit": 1184304354.422535,
      "netIncome": 976657814.422535,
      "source": "자회사!F21/F32"
    },
    "consolidated": {
      "revenue": 60531366521.42253,
      "operatingProfit": 8000650690.348737,
      "netIncome": 5524255861.044971,
      "source": "연결!U23/U34"
    }
  },
  {
    "year": 2028,
    "forecast": true,
    "temsco": {
      "revenue": 68687284212.00001,
      "operatingProfit": 8103119625.492449,
      "netIncome": 5551281212.48411,
      "source": "모회사!Q21/Q32"
    },
    "wefoms": {
      "revenue": 29210132605.63381,
      "operatingProfit": 3939688458.633808,
      "netIncome": 2910992696.5343704,
      "source": "자회사!G21/G32"
    },
    "consolidated": {
      "revenue": 73726869117.63382,
      "operatingProfit": 12042808084.12626,
      "netIncome": 8462273909.018484,
      "source": "연결!Y23/Y34"
    }
  },
  {
    "year": 2029,
    "forecast": true,
    "temsco": {
      "revenue": 74428744844,
      "operatingProfit": 8878170551.04255,
      "netIncome": 6155820934.413188,
      "source": "모회사!T21/T32"
    },
    "wefoms": {
      "revenue": 36767527605.633804,
      "operatingProfit": 6712093416.633804,
      "netIncome": 5073468563.774367,
      "source": "자회사!H21/H32"
    },
    "consolidated": {
      "revenue": 83286369649.6338,
      "operatingProfit": 15590263967.676361,
      "netIncome": 11229289498.187563,
      "source": "연결!AC23/AC34"
    }
  }
]

export const acquisitionConsideration = 9_000_000_000
export const operatingDrivers = {
  parentMaskRevenue2026: 16_000_000_000,
  parentMaskRevenue2029: 36_388_400_000,
  wefomsMaterialRate2026: 0.23551037992776794,
  wefomsMaterialRate2027: 0.20,
  reference: 'X04 추정손익!M7/V7; X03 통합_추정가정 (Drivers)!F10/G10',
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
