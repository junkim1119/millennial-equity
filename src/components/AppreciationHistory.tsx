import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { formatPrice, type Listing } from "@/lib/listings";
import { InvestmentCompare } from "@/components/InvestmentCompare";
import { SOURCE_NOTE, Skeleton, useAppreciation, useHistory } from "@/lib/appreciation";

export function AppreciationHistory({ l, downPct, onOpenRentVsBuy }: { l: Listing; downPct: number; onOpenRentVsBuy: () => void }) {
  const { status, lookup } = useAppreciation();
  const hist = useHistory(l.zip);
  if (status === "error") return null;
  const a = lookup(l.zip);
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-6 lg:col-span-2">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><TrendingUp className="h-4 w-4" /> Appreciation History</h2>
      {status === "loading" ? (
        <div className="mt-3 space-y-2"><Skeleton className="h-5 w-64" /><Skeleton className="h-48 w-full" /></div>
      ) : !a ? (
        <p className="mt-3 text-sm text-muted-foreground">Appreciation data unavailable.</p>
      ) : (
        <>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div><p className="text-xs text-muted-foreground">Yearly rate ({a.level === "zip" ? "zip-level" : a.label})</p><p className="text-lg font-semibold text-foreground">{a.cagr.toFixed(2)}%/yr</p></div>
            <div><p className="text-xs text-muted-foreground">Total growth 2015–2025</p><p className="text-lg font-semibold text-foreground">+{a.total.toFixed(1)}%</p></div>
            <div><p className="text-xs text-muted-foreground">Est. 2015 value</p><p className="text-lg font-semibold text-foreground">{formatPrice(l.price / (1 + a.total / 100))}</p></div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            At this rate, this home would have been worth about {formatPrice(l.price / (1 + a.total / 100))} in 2015.
          </p>
          <div className="mt-4 h-56 w-full">
            {hist.status === "loading" ? <Skeleton className="h-full w-full" /> : hist.series ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hist.series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip formatter={(v) => [`${v}`, "Index (2015 = 100)"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground">Yearly history unavailable for this area.</p>}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Index, 2015 = 100. {SOURCE_NOTE}</p>
          <InvestmentCompare zip={l.zip} homeCagr={a.cagr} homeTotal={a.total} price={l.price} downPct={downPct} series={hist.series} onOpenRentVsBuy={() => { onOpenRentVsBuy(); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}
    </section>
  );
}
