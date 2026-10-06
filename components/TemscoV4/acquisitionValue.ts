// modified_v1 saved workbook results, verified 2026-09-14; subsidiary uses approved 4% wage forecast.
// 2023 is pre-acquisition. Consolidated 2023 is the supplied combined comparator, not statutory consolidation.
// 2024 includes pre-acquisition months; cumulative profits are not acquisition cash returns.
export type AnnualProfit = { revenue: number; operatingProfit: number; netIncome: number; source: string }
export type AcquisitionYear = { year: number; forecast: boolean; temsco: AnnualProfit; wefoms: AnnualProfit; consolidated: AnnualProfit }

export const acquisitionAnnualSources: AcquisitionYear[] = [
  {
    "year": 2023,
    "forecast": false,
    "temsco": {
      "revenue": 35986309772,
      "operatingProfit": 1896963586,
      "netIncome": 1101894565,
      "source": "modified_v1 연결파일 모회사!B8/B21/B32"
    },
    "wefoms": {
      "revenue": 5041167105,
      "operatingProfit": -1409592079,
      "netIncome": -1363527034,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!C5/C22/C31"
    },
    "consolidated": {
      "revenue": 41027476877,
      "operatingProfit": 487371507,
      "netIncome": -261632469,
      "source": "modified_v1 연결파일 연결!E10/E23/E34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
    }
  },
  {
    "year": 2024,
    "forecast": false,
    "temsco": {
      "revenue": 39858957704,
      "operatingProfit": 2057794642,
      "netIncome": 1612408048,
      "source": "modified_v1 연결파일 모회사!E8/E21/E32"
    },
    "wefoms": {
      "revenue": 9260937083,
      "operatingProfit": 1522689367,
      "netIncome": 1534212036,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!D5/D22/D31"
    },
    "consolidated": {
      "revenue": 40324731206,
      "operatingProfit": 3560424009,
      "netIncome": 3126560084,
      "source": "modified_v1 연결파일 연결!I10/I23/I34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
    }
  },
  {
    "year": 2025,
    "forecast": false,
    "temsco": {
      "revenue": 35058443364,
      "operatingProfit": -5190138779,
      "netIncome": -8369046769,
      "source": "modified_v1 연결파일 모회사!H8/H21/H32"
    },
    "wefoms": {
      "revenue": 12581202964,
      "operatingProfit": -1791426194,
      "netIncome": -1977013335,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!E5/E22/E31"
    },
    "consolidated": {
      "revenue": 34261655569,
      "operatingProfit": -7324105280,
      "netIncome": -8824123393,
      "source": "modified_v1 연결파일 연결!M10/M23/M34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
    }
  },
  {
    "year": 2026,
    "forecast": true,
    "temsco": {
      "revenue": 40000000000,
      "operatingProfit": 4151840048.2799997,
      "netIncome": 2469283142.2584,
      "source": "modified_v1 연결파일 모회사!K8/K21/K32"
    },
    "wefoms": {
      "revenue": 14000000000,
      "operatingProfit": -2822234498,
      "netIncome": -3029881038,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!G5/G22/G31"
    },
    "consolidated": {
      "revenue": 46784464186.6,
      "operatingProfit": 1329605550.2799997,
      "netIncome": -560597895.7416002,
      "source": "modified_v1 연결파일 연결!Q10/Q23/Q34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
    }
  },
  {
    "year": 2027,
    "forecast": true,
    "temsco": {
      "revenue": 59087117851,
      "operatingProfit": 6816346335.926206,
      "netIncome": 4547598046.62244,
      "source": "modified_v1 연결파일 모회사!N8/N21/N32"
    },
    "wefoms": {
      "revenue": 26884853239.436623,
      "operatingProfit": 3669898091.4366226,
      "netIncome": 3462251551.4366226,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!H5/H22/H31"
    },
    "consolidated": {
      "revenue": 65785144690.436615,
      "operatingProfit": 10486244427.362827,
      "netIncome": 8009849598.059062,
      "source": "modified_v1 연결파일 연결!U10/U23/U34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
    }
  },
  {
    "year": 2028,
    "forecast": true,
    "temsco": {
      "revenue": 68687284212.00001,
      "operatingProfit": 8103119625.492449,
      "netIncome": 5551281212.48411,
      "source": "modified_v1 연결파일 모회사!Q8/Q21/Q32"
    },
    "wefoms": {
      "revenue": 36441803732.39437,
      "operatingProfit": 7390408437.394371,
      "netIncome": 5602554279.967609,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!I5/I22/I31"
    },
    "consolidated": {
      "revenue": 80958540244.39438,
      "operatingProfit": 15493528062.88682,
      "netIncome": 11153835492.451721,
      "source": "modified_v1 연결파일 연결!Y10/Y23/Y34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
    }
  },
  {
    "year": 2029,
    "forecast": true,
    "temsco": {
      "revenue": 74428744844,
      "operatingProfit": 8878170551.04255,
      "netIncome": 6155820934.413188,
      "source": "modified_v1 연결파일 모회사!T8/T21/T32"
    },
    "wefoms": {
      "revenue": 42701206478.873245,
      "operatingProfit": 9446911964.873245,
      "netIncome": 7206627031.401132,
      "source": "modified_v1 위폼스_추정손익.xlsx 추정손익!J5/J22/J31"
    },
    "consolidated": {
      "revenue": 89220048522.87325,
      "operatingProfit": 18325082515.915802,
      "netIncome": 13362447965.814327,
      "source": "modified_v1 연결파일 연결!AC10/AC23/AC34 + 최신 위폼스와 자회사 연결값 차이; 내부거래 조정 유지"
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
