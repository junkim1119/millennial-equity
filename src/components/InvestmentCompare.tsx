import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BENCHMARKS, BENCHMARK_FOOTNOTE, benchmarkVerdict, leveragedReturn } from "@/data/benchmarks";
import { formatPrice } from "@/lib/listings";

export function CompareBars({ zip, homeCagr }: { zip: string; homeCagr: number }) {
  const rows = [
    { label: `Homes in ${zip}`, v: homeCagr, home: true },
    { label: "REITs", v: BENCHMARKS.reit.cagrPct },
    { label: "S&P 500", v: BENCHMARKS.sp500.cagrPct },
  ];
  const max = Math.max(...rows.map((r) => r.v), 1);
  return (
    <div className="space-y-2" role="list" aria-label="Yearly growth comparison">
      {rows.map((r) => (
        <div key={r.label} role="listitem" className="grid grid-cols-[6.5rem_1fr] items-center gap-2 text-xs sm:grid-cols-[8rem_1fr]">
          <span className={r.home ? "font-semibold text-foreground" : "text-muted-foreground"}>{r.label}</span>
          <div className="flex items-center gap-2">
            <div className={`h-3 rounded-full ${r.home ? "bg-primary" : "bg-muted-foreground/40"}`} style={{ width: `${(Math.max(r.v, 0) / max) * 80}%` }} />
            <span className={r.home ? "font-semibold text-primary" : "text-foreground"}>{r.v.toFixed(2)}%/yr</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Compact version for the zip search banner. */
export function CompactCompare({ zip, homeCagr }: { zip: string; homeCagr: number }) {
  return (
    <div className="mt-3 border-t border-border pt-3">
      <CompareBars zip={zip} homeCagr={homeCagr} />
      <p className="mt-2 text-xs text-muted-foreground">{benchmarkVerdict(zip, homeCagr)}</p>
    </div>
  );
}

export function InvestmentCompare({
  zip, homeCagr, homeTotal, price, downPct, series, onOpenRentVsBuy,
}: {
  zip: string; homeCagr: number; homeTotal: number; price: number; downPct: number;
  series: { year: number; value: number | null }[] | null; onOpenRentVsBuy: () => void;
}) {
  const [leverage, setLeverage] = useState(false);
  const lev = leveragedReturn(price, homeTotal, downPct);
  const data = BENCHMARKS.years.map((year, i) => ({
    year,
    home: series?.[i]?.value != null ? Math.round(series[i].value! * 100) : null,
    reit: Math.round(BENCHMARKS.reit.index[i] * 100),
    sp: Math.round(BENCHMARKS.sp500.index[i] * 100),
  }));
  return (
    <div className="mt-6 border-t border-border pt-5">
      <h3 className="text-sm font-semibold text-foreground">Appreciation vs. Investments</h3>
      <p className="mt-1 text-sm text-foreground">{benchmarkVerdict(zip, homeCagr)}</p>
      <div className="mt-4"><CompareBars zip={zip} homeCagr={homeCagr} /></div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Growth of $10,000, 2015–2025</p>
      <div className="mt-2 h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line name={`Homes in ${zip}`} dataKey="home" stroke="var(--primary)" strokeWidth={3} dot={false} connectNulls />
            <Line name="REITs" dataKey="reit" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} />
            <Line name="S&P 500" dataKey="sp" stroke="var(--foreground)" strokeWidth={2} strokeDasharray="4 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
        <input type="checkbox" checked={leverage} onChange={(e) => setLeverage(e.target.checked)} className="accent-primary" />
        With leverage
      </label>
      {leverage && (
        <div className="mt-2 rounded-lg border border-border bg-background p-3 text-sm">
          {lev ? (
            <>
              <p className="text-lg font-semibold text-primary">{lev.cagrPct.toFixed(2)}%/yr</p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(lev.gain)} gain on a {formatPrice(lev.down)} down payment ({downPct}%) — +{lev.totalPct.toFixed(0)}% over 10 years.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Return on your down payment, from appreciation only, before mortgage interest, taxes, maintenance and selling costs.{" "}
                <button type="button" onClick={onOpenRentVsBuy} className="font-medium text-primary hover:underline">See the full picture in Rent vs. Buy →</button>
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Set a down payment above 0% to see a leveraged return.</p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-muted-foreground">{BENCHMARK_FOOTNOTE}</p>
      <p className="text-xs text-muted-foreground">Source: {BENCHMARKS.source}</p>
    </div>
  );
}
