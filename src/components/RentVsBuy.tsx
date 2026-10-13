import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Copy, Scale } from "lucide-react";
import { formatPrice, type Listing, type MortgageSettings } from "@/lib/listings";
import { rentVsBuy } from "@/lib/rentVsBuy";

const k = (n: number) => (Math.abs(n) >= 1000 ? `$${Math.round(n / 1000)}k` : formatPrice(n));

export function RentVsBuy({ listing, mortgage }: { listing: Listing; mortgage: MortgageSettings }) {
  const [rent, setRent] = useState(2200);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [years, setYears] = useState(5);
  const [appreciation, setAppreciation] = useState(3);
  const [copied, setCopied] = useState(false);

  const r = rentVsBuy(listing, mortgage, { rent: Math.max(rent || 0, 0), rentIncrease, years, appreciation });
  const hasHack = r.rentIncome > 0;
  const tenant = r.spaces.length === 1 && r.spaces[0].label.includes("bedroom") && !r.spaces[0].label.startsWith("2")
    ? "a roommate"
    : "house hacking";
  const diff = Math.round(rent - (hasHack ? r.hackMonthly : r.ownMonthly));
  const verdict = `${hasHack ? `With ${tenant}, this` : "This"} home costs ${formatPrice(Math.abs(diff))}/mo ${diff >= 0 ? "less" : "more"} than your rent and builds ${k(r.equity)} of equity in ${years} year${years > 1 ? "s" : ""}.`;
  const best = hasHack ? r.hackAhead : r.buyAhead;
  const position = r.buyAhead >= 0 ? `Buying puts you ${formatPrice(r.buyAhead)} ahead` : `Renting saves you ${formatPrice(-r.buyAhead)}`;

  const share = async () => {
    const text = [
      `Rent vs. Buy — ${listing.address}, ${listing.city} (${formatPrice(listing.price)})`,
      verdict,
      `Monthly now: rent ${formatPrice(rent)} · own ${formatPrice(r.ownMonthly)} · own + house hack ${formatPrice(r.hackMonthly)}`,
      `Total over ${years} yrs: rent ${formatPrice(r.rentTotal)} · buy ${formatPrice(r.buyTotal)} · buy + hack ${formatPrice(r.hackTotal)}`,
      `Equity built: ${formatPrice(r.equity)}`,
      `${position}.${hasHack ? ` With house hacking: ${best >= 0 ? `${formatPrice(best)} ahead` : `renting saves ${formatPrice(-best)}`}.` : ""}`,
      "via MillenialHomeHunt",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  const cards = [
    { label: "Rent", monthly: rent, total: r.rentTotal, note: `Rising ${rentIncrease}%/yr` },
    { label: "Own", monthly: r.ownMonthly, total: r.buyTotal, note: "Full PITI + down payment" },
    { label: "Own + house hack", monthly: r.hackMonthly, total: r.hackTotal, note: hasHack ? `After ${formatPrice(r.rentIncome)}/mo rent` : "No rentable spaces" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="h-4 w-4" /> Rent vs. Buy
        </div>
        <button type="button" onClick={share} className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent">
          <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Share my results"}
        </button>
      </div>
      <p className="mt-3 rounded-lg bg-accent p-3 text-sm font-medium text-foreground">{verdict}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Current rent ($/mo)
          <input type="number" min={0} value={rent} onChange={(e) => setRent(Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm normal-case text-foreground" />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Rent increase (%/yr)
          <input type="number" min={0} step={0.5} value={rentIncrease} onChange={(e) => setRentIncrease(Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Staying: <span className="text-foreground">{years} yr{years > 1 ? "s" : ""}</span>
          <input type="range" min={1} max={10} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-3 w-full accent-primary" />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Home appreciation (%/yr)
          <input type="number" step={0.5} value={appreciation} onChange={(e) => setAppreciation(Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatPrice(c.monthly)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <p className="text-xs text-muted-foreground">{c.note}</p>
            <p className="mt-3 text-sm text-muted-foreground">Total over {years} yrs</p>
            <p className="text-sm font-semibold text-foreground">{formatPrice(c.total)}</p>
          </div>
        ))}
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-secondary p-3">
          <dt className="text-muted-foreground">Equity after {years} yrs</dt>
          <dd className="font-semibold text-foreground">{formatPrice(r.equity)}</dd>
          <dd className="text-xs text-muted-foreground">
            Down payment {formatPrice(listing.price * mortgage.downPct / 100)} + principal paid {formatPrice(r.principalPaid)} + appreciation {formatPrice(r.appreciationGain)}
          </dd>
        </div>
        <div className="rounded-lg bg-secondary p-3">
          <dt className="text-muted-foreground">Net position after {years} yrs</dt>
          <dd className={`font-semibold ${r.buyAhead >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>{position}</dd>
          {hasHack && (
            <dd className="text-xs text-muted-foreground">
              With house hacking: {r.hackAhead >= 0 ? `${formatPrice(r.hackAhead)} ahead` : `renting saves ${formatPrice(-r.hackAhead)}`}
            </dd>
          )}
        </div>
      </dl>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={r.series} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis tickFormatter={k} stroke="var(--muted-foreground)" fontSize={12} width={55} />
            <Tooltip formatter={(v: number) => formatPrice(v)} labelFormatter={(y) => `Year ${y}`} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            <Legend />
            <Line type="monotone" dataKey="rent" name="Rent" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="buy" name="Buy" stroke="var(--primary)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="hack" name="Buy + house hack" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Cumulative cash spent. Buying includes the down payment up front. Estimates only.</p>
    </div>
  );
}
