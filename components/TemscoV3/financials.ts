// KRW 100 million (억 원). Cached source values, not audited/recalculated outputs.
// Source IDs and exact cells: projects/temsco/v3/analysis/result.md.
export const financials = {
  years: ['2024A', '2025A', '2026E', '2027E', '2028E', '2029E'],
  parent: {
    revenue: [398.58957704, 350.58443364, 400, 590.87117851, 686.87284212, 744.28744844],
    op: [20.57794642, -51.90138779, 41.51840048, 68.16346336, 81.03119625, 88.78170551],
    net: [16.12408048, -83.69046769, 24.69283142, 45.47598047, 55.51281212, 61.55820934],
  },
  subsidiary: {
    revenue: [92.60937083, 125.81202964, 140, 229.47035070, 307.85787606, 385.86947606],
    op: [15.22689367, -17.91426194, -28.22234498, 15.93876374, 59.18636696, 101.60497507],
    net: [15.34212036, -19.77013335, -30.29881038, 13.86229834, 44.54572321, 77.63223754],
  },
  group: {
    revenue: [403.24731206, 342.61655569, 414.62759896, 602.94493721, 746.34446398, 852.51343250],
    op: [35.60424009, -73.24105280, 13.29605550, 84.10222710, 140.21756321, 190.38668058],
    net: [31.26560084, -88.24123393, -5.60597896, 59.33827881, 100.05853534, 139.19044688],
  },
}

export const historicalBalance = {
  // S03 재무상태표(T), 2025 consolidated column; debt/cash scope still to reconcile.
  assets: 423.91401621,
  liabilities: 389.54333077,
  equity: 34.37068544,
  cash: 34.70800669,
  currentAssets: 105.49335533,
  currentLiabilities: 247.83768221,
}

export const investment = { total: 70, capex: 40, workingCapital: 20, research: 10 }
export const closingBalance = {
  assets: historicalBalance.assets + investment.total,
  liabilities: historicalBalance.liabilities,
  equity: historicalBalance.equity + investment.total,
  cash: historicalBalance.cash + investment.total,
}
export const addBack = { parent: 63.6954705, group: 64.5374766 }
export const normalizedOp = {
  parent: financials.parent.op[1] + addBack.parent,
  group: financials.group.op[1] + addBack.group,
}
export const outsourcingSensitivity = financials.subsidiary.revenue[3] * 0.01
export const fmt = (value: number, digits = 1) => value.toLocaleString('en-US', {
  minimumFractionDigits: digits, maximumFractionDigits: digits,
})
export const signed = (value: number, digits = 1) => `${value > 0 ? '+' : ''}${fmt(value, digits)}`
