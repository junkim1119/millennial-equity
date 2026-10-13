import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bath, BedDouble, Ruler, Heart, Share2, Wallet, ExternalLink, Hammer, Home, Calculator, BadgeCheck } from "lucide-react";
import {
  LISTINGS,
  DIY_PROJECTS,
  AffordabilityPanel,
  formatPrice,
  houseHack,
  trueCost,
  mapEmbedUrl,
  googleMapsLink,
  loadBrowse,
  DEFAULT_BROWSE,
  STATE_TAX_RATE,
  DEFAULT_TAX_RATE,
  type Listing,
  type MortgageSettings,
} from "@/lib/listings";
import { RentVsBuy } from "@/components/RentVsBuy";
import { AppreciationHistory } from "@/components/AppreciationHistory";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => {
    const listing = LISTINGS.find((l) => String(l.id) === params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    const l = loaderData?.listing;
    const title = l ? `${l.address}, ${l.city} — ${formatPrice(l.price)} | MillenialHomeHunt` : "Listing unavailable | MillenialHomeHunt";
    const description = l
      ? `${l.beds} bd · ${l.baths} ba · ${l.sqft.toLocaleString()} sqft in ${l.city}. See true monthly cost, house-hack potential, and DIY fixer upside.`
      : "This listing could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-lg font-semibold text-foreground">We couldn't find that home.</p>
      <Link to="/" className="mt-4 inline-block text-primary hover:underline">Back to listings</Link>
    </div>
  ),
  component: ListingDetail,
});

const SAVED_KEY = "mhh-saved";

// Pick DIY-friendly projects that fit this home: condos skip exterior/structural work, bigger homes get flooring.
function fixerProjects(l: Listing) {
  const diyOnly = DIY_PROJECTS.filter((p) => p.diy > 0);
  const ranked = [...diyOnly].sort((a, b) => b.pro - b.diy - (a.pro - a.diy));
  const picks = l.sqft >= 1800 ? ranked.slice(0, 4) : ranked.filter((p) => !p.project.includes("flooring")).slice(0, 3);
  return picks;
}

function ListingDetail() {
  const { listing: l } = Route.useLoaderData();
  const [settings, setSettings] = useState(DEFAULT_BROWSE);
  useEffect(() => setSettings(loadBrowse()), []);
  const mortgage: MortgageSettings = { rate: settings.rate, downPct: settings.downPct, termYears: settings.termYears, rentalIncome: 0 };

  const gallery = Array.from(new Set([l.image, ...LISTINGS.filter((x) => x.id !== l.id).map((x) => x.image)])).slice(0, 4);
  const [active, setActive] = useState(0);

  const hack = houseHack(l, mortgage);
  const cost = trueCost(l, mortgage);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const isOn = (label: string) => enabled[label] !== false;
  const rent = hack.spaces.reduce((s, x) => s + (isOn(x.label) ? x.rent : 0), 0);
  const net = Math.max(cost.total - rent, 0);
  const pct = cost.total > 0 ? Math.min((rent / cost.total) * 100, 100) : 0;

  const projects = fixerProjects(l);
  const diyTotal = projects.reduce((s, p) => s + p.diy, 0);
  const proTotal = projects.reduce((s, p) => s + p.pro, 0);
  // Cosmetic updates typically return ~1.5x their pro cost in resale value
  const valueAfter = l.price + Math.round(proTotal * 1.5);

  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      setSaved((JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") as number[]).includes(l.id));
    } catch { /* ignore */ }
  }, [l.id]);
  const toggleSave = () => {
    try {
      const list = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") as number[];
      const next = saved ? list.filter((x) => x !== l.id) : [...list, l.id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
    setSaved(!saved);
  };
  const [shareMsg, setShareMsg] = useState("");
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: l.address, url });
      else {
        await navigator.clipboard.writeText(url);
        setShareMsg("Link copied");
        setTimeout(() => setShareMsg(""), 2000);
      }
    } catch { /* cancelled */ }
  };
  const [affordOpen, setAffordOpen] = useState(false);
  const [tab, setTab] = useState<"overview" | "rvb">("overview");

  const tone = (score: number) =>
    score >= 7
      ? "bg-green-500/15 text-green-700 dark:text-green-400"
      : score >= 4
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "bg-red-500/15 text-red-700 dark:text-red-400";
  const liveScore = Math.min(10, Math.max(1, Math.ceil(pct / 8)));
  const mapUrl = mapEmbedUrl(l);
  const taxRate = STATE_TAX_RATE[l.state] ?? DEFAULT_TAX_RATE;

  const costRows: [string, number][] = [
    ["Principal & interest", cost.pi],
    [`Property tax (${taxRate.toFixed(2)}%/yr)`, cost.tax],
    ["Homeowners insurance", cost.insurance],
    ["PMI", cost.pmi],
    ["HOA", cost.hoa],
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>
      </div>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <img src={gallery[active]} alt={`Photo ${active + 1} of ${l.address}`} width={1024} height={768} className="aspect-[16/9] w-full object-cover" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === active}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 sm:h-20 sm:w-28 ${i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Header */}
      <header className="mx-auto mt-6 max-w-6xl px-4">
        <div className="flex flex-wrap items-center gap-2">
          {l.tag && <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">{l.tag}</span>}
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone(hack.score)}`}>
            Hack score {hack.score}/10 · covers {Math.round(hack.pct)}%
          </span>
          {l.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified Address
            </span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{formatPrice(l.price)}</h1>
        <p className="mt-1 text-lg text-foreground">{l.address}</p>
        <p className="text-sm text-muted-foreground">{l.city} {l.zip}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><BedDouble className="h-4 w-4" /> {l.beds} bd</span>
          <span className="inline-flex items-center gap-1"><Bath className="h-4 w-4" /> {l.baths} ba</span>
          <span className="inline-flex items-center gap-1"><Ruler className="h-4 w-4" /> {l.sqft.toLocaleString()} sqft</span>
          <span>{l.daysOnMarket} days on market</span>
        </div>
      </header>

      <div role="tablist" className="mx-auto mt-6 flex max-w-6xl gap-1 px-4">
        {([["overview", "Overview"], ["rvb", "Rent vs. Buy"]] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${tab === id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-accent"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "rvb" ? (
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <RentVsBuy listing={l} mortgage={mortgage} />
        </div>
      ) : (
      <main className="mx-auto mt-4 grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
        <AppreciationHistory l={l} />
        {/* True monthly cost */}
        <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Calculator className="h-4 w-4" /> True Monthly Cost</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {settings.rate.toFixed(2)}% rate · {settings.downPct}% down · {settings.termYears}-yr term (from your calculator)
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            {costRows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-foreground">{formatPrice(v)}/mo</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t border-border pt-2">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="text-lg font-bold text-primary">{formatPrice(cost.total)}/mo</dd>
            </div>
          </dl>
        </section>

        {/* House-hack breakdown */}
        <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Home className="h-4 w-4" /> House-Hack Breakdown</h2>
          {hack.spaces.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">This home has no extra rentable spaces.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {hack.spaces.map((s) => (
                <li key={s.label}>
                  <label className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm ${isOn(s.label) ? "border-primary bg-accent" : "border-input bg-background"}`}>
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isOn(s.label)}
                        onChange={(e) => setEnabled((p) => ({ ...p, [s.label]: e.target.checked }))}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="font-medium text-foreground">{s.label}</span>
                    </span>
                    <span className={isOn(s.label) ? "font-medium text-foreground" : "text-muted-foreground line-through"}>{formatPrice(s.rent)}/mo</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Total rent</dt><dd className="font-medium text-foreground">{formatPrice(rent)}/mo</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Net monthly payment</dt><dd className="font-semibold text-foreground">{formatPrice(net)}/mo</dd></div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <dt className="text-muted-foreground">Mortgage covered</dt>
              <dd className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone(liveScore)}`}>{Math.round(pct)}% · {liveScore}/10</dd>
            </div>
          </dl>
        </section>

        {/* Fixer potential */}
        <section className="rounded-xl border border-border bg-card p-4 sm:p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Hammer className="h-4 w-4" /> Fixer Potential</h2>
          <p className="mt-1 text-sm text-muted-foreground">DIY-friendly upgrades that suit this home.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <div key={p.project} className="rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-semibold text-foreground">{p.project}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.difficulty}</p>
                <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">DIY</span><span className="text-foreground">{formatPrice(p.diy)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pro</span><span className="text-foreground">{formatPrice(p.pro)}</span></div>
              </div>
            ))}
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-secondary p-3"><dt className="text-muted-foreground">DIY cost vs pro</dt><dd className="font-semibold text-foreground">{formatPrice(diyTotal)} vs {formatPrice(proTotal)}</dd></div>
            <div className="rounded-lg bg-secondary p-3"><dt className="text-muted-foreground">Sweat equity saved</dt><dd className="font-semibold text-foreground">{formatPrice(proTotal - diyTotal)}</dd></div>
            <div className="rounded-lg bg-secondary p-3"><dt className="text-muted-foreground">Est. value after upgrades</dt><dd className="font-semibold text-primary">{formatPrice(valueAfter)}</dd></div>
          </dl>
        </section>

        {/* Map */}
        <section className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
          {mapUrl ? (
            <iframe src={mapUrl} title={`Map of ${l.address}, ${l.city}`} loading="lazy" className="h-72 w-full border-0" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Map unavailable</div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <p className="text-sm text-foreground">{l.address}, {l.city} {l.zip}</p>
            <a href={googleMapsLink(l)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </main>
      )}

      {/* Sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 py-3">
          <button type="button" onClick={toggleSave} aria-pressed={saved} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
            <Heart className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} /> {saved ? "Saved" : "Save home"}
          </button>
          <button type="button" onClick={share} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
            <Share2 className="h-4 w-4" /> {shareMsg || "Share"}
          </button>
          <button type="button" onClick={() => setAffordOpen(true)} className="inline-flex flex-[1.4] items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Wallet className="h-4 w-4" /> Can I afford this?
          </button>
        </div>
      </div>
      {affordOpen && <AffordabilityPanel l={l} onClose={() => setAffordOpen(false)} />}
    </div>
  );
}
