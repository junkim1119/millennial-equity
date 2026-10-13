export const BENCHMARKS = {
  period: "2015–2025",
  years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
  reit:  { label: "REITs (FTSE Nareit All Equity, dividends reinvested)", cagrPct: 5.78, totalPct: 75.4,
           index: [100,108.6,118.0,113.3,145.7,138.3,195.4,146.7,163.5,171.5,175.4] },
  sp500: { label: "S&P 500 (dividends reinvested)", cagrPct: 14.77, totalPct: 296.6,
           index: [100,112.0,136.4,130.4,171.5,203.1,261.4,213.8,269.8,337.0,396.6] },
  source: "Nareit; S&P 500 total returns. Home values: FHFA HPI."
};

/** Annualized return on the down payment from appreciation alone, over 10 years. */
export function leveragedReturn(price: number, totalPct: number, downPct: number) {
  const down = price * (downPct / 100);
  if (down <= 0) return null;
  const gain = price * (1 + totalPct / 100) - price;
  const multiple = 1 + gain / down;
  return { gain, down, totalPct: (gain / down) * 100, cagrPct: (Math.pow(multiple, 1 / 10) - 1) * 100 };
}

export function benchmarkVerdict(zip: string, homeCagr: number) {
  const r = BENCHMARKS.reit.cagrPct;
  const first = homeCagr > r
    ? `Homes in ${zip} grew faster than REITs (${homeCagr.toFixed(2)}% vs ${r}%/yr), even before leverage.`
    : `REITs outpaced homes in ${zip} over this period.`;
  return `${first} The S&P 500 returned ${BENCHMARKS.sp500.cagrPct}%/yr over the same period.`;
}

export const BENCHMARK_FOOTNOTE =
  "Home figures are price appreciation only and exclude ownership costs and rent savings. REIT and S&P 500 figures include reinvested dividends. Past performance doesn't guarantee future results.";
