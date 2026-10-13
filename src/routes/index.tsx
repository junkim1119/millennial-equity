import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BedDouble, Bath, Ruler, MapPin, Search, SlidersHorizontal, X, Calculator, Home, Hammer, Wrench, PaintRoller, BadgeCheck, Map as MapIcon, ExternalLink, Wallet } from "lucide-react";
import { loadBrowse, saveBrowse, AffordabilityPanel, DEFAULT_TAX_RATE, DIY_PROJECTS, HACK_EXTRAS, LISTINGS, Listing, MAPS_KEY, MortgageSettings, PRICE_MAX, PRICE_MIN, RENO_ROOMS, RENO_STYLES, RENTAL_SPACES, ROOM_RENT_BY_STATE, ROOM_RENT_BY_ZIP, RentalId, STATE_TAX_RATE, SortKey, Verdict, ZIP_AREAS, areaForZip, formatPrice, googleMapsLink, hackScore, houseHack, mapEmbedUrl, milesBetween, monthlyPayment, rentableSpaces, roomRent, streetViewEmbedUrl, trueCost, verdictFor } from "@/lib/listings";
import { Link } from "@tanstack/react-router";
import { RentVsBuy } from "@/components/RentVsBuy";
import { AppreciationBadge, AppreciationBanner } from "@/lib/appreciation";

function ListingCard({ l, mortgage }: { l: Listing; mortgage: MortgageSettings }) {
  const [media, setMedia] = useState<"photo" | "street">("photo");
  const [showMap, setShowMap] = useState(false);
  const [affordOpen, setAffordOpen] = useState(false);
  const streetUrl = streetViewEmbedUrl(l);
  const mapUrl = mapEmbedUrl(l);
  const showStreet = media === "street" && streetUrl;

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        {showStreet ? (
          <iframe
            src={streetUrl}
            title={`Street View of ${l.address}, ${l.city}`}
            loading="lazy"
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <Link to="/listing/$id" params={{ id: String(l.id) }} aria-label={`View details for ${l.address}`}>
            <img
              src={l.image}
              alt={`Home at ${l.address}, ${l.city}`}
              loading="lazy"
              width={1024}
              height={768}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        )}
        {l.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            {l.tag}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
          {l.daysOnMarket}d on market
        </span>
        {streetUrl && (
          <button
            type="button"
            onClick={() => setMedia(showStreet ? "photo" : "street")}
            className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm hover:bg-background"
          >
            <MapIcon className="h-3.5 w-3.5" />
            {showStreet ? "Listing photo" : "Street View"}
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-2xl font-bold text-foreground">{formatPrice(l.price)}</p>
        {(() => {
          const h = houseHack(l, mortgage);
          const tone =
            h.score >= 7
              ? "bg-green-500/15 text-green-700 dark:text-green-400"
              : h.score >= 4
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                : "bg-red-500/15 text-red-700 dark:text-red-400";
          return (
            <>
              <p className="mt-1 text-sm font-medium text-primary">True cost {formatPrice(h.cost.total)}/mo</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                After house hacking {formatPrice(h.net)}/mo
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
                title={h.spaces.map((s) => `${s.label}: ${formatPrice(s.rent)}/mo`).join(" · ") || "No rentable spaces"}
              >
                Hack score {h.score}/10 · covers {Math.round(h.pct)}%
              </span>
              {h.spaces.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.spaces.map((s) => `${s.label} ${formatPrice(s.rent)}`).join(" · ")}
                </p>
              )}
            </>
          );
        })()}
        <AppreciationBadge zip={l.zip} />
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {l.beds} bd
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {l.baths} ba
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            {l.sqft.toLocaleString()} sqft
          </span>
        </div>
        <Link
          to="/listing/$id"
          params={{ id: String(l.id) }}
          className="mt-3 block text-sm font-medium text-foreground hover:text-primary hover:underline"
        >
          {l.address}
        </Link>
        <p className="text-sm text-muted-foreground">
          {l.city} {l.zip}
        </p>
        {l.verified && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-primary" />
            Verified Address
          </span>
        )}
        {mapUrl && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowMap((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <MapIcon className="h-4 w-4" />
              {showMap ? "Hide map" : "Show mini-map"}
            </button>
            {showMap && (
              <iframe
                src={mapUrl}
                title={`Map showing the location of ${l.address}, ${l.city}`}
                loading="lazy"
                className="mt-2 h-44 w-full rounded-lg border border-border"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            )}
          </div>
        )}
        <a
          href={googleMapsLink(l)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          View on Google Maps
        </a>
        <button
          type="button"
          onClick={() => setAffordOpen(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Wallet className="h-4 w-4" />
          Can I afford this?
        </button>
        {affordOpen && <AffordabilityPanel l={l} onClose={() => setAffordOpen(false)} />}
      </div>
    </article>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MillennialEquity — Your First Home, Your First Real Estate Investment" },
      { name: "description", content: "Your first home, your first real estate investment. Search listings by zip code, estimate mortgage and house-hacking payments, and compare DIY vs. pro renovation costs." },
      { property: "og:title", content: "MillennialEquity — Your First Home, Your First Real Estate Investment" },
      { property: "og:description", content: "Your first home, your first real estate investment. Search listings by zip code, estimate mortgage and house-hacking payments, and compare DIY vs. pro renovation costs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [zip, setZip] = useState("");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [rate, setRate] = useState(6.5);
  const [downPct, setDownPct] = useState(20);
  const [termYears, setTermYears] = useState(30);
  const [rentals, setRentals] = useState<Record<RentalId, boolean>>({ bedroom: false, basement: false, adu: false });
  const [rentAmounts, setRentAmounts] = useState<Record<RentalId, number>>({
    bedroom: RENTAL_SPACES[0].rent,
    basement: RENTAL_SPACES[1].rent,
    adu: RENTAL_SPACES[2].rent,
  });
  const rentalIncome = RENTAL_SPACES.reduce((sum, s) => sum + (rentals[s.id] ? rentAmounts[s.id] : 0), 0);
  const mortgage: MortgageSettings = { rate, downPct, termYears, rentalIncome };

  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const b = loadBrowse();
    setZip(b.zip); setMaxPrice(b.maxPrice); setMinBeds(b.minBeds); setMinBaths(b.minBaths);
    setRate(b.rate); setDownPct(b.downPct); setTermYears(b.termYears); setSortBy(b.sortBy);
    setRestored(true);
  }, []);

  const [renoRoom, setRenoRoom] = useState<(typeof RENO_ROOMS)[number]["id"]>("kitchen");
  const [renoStyle, setRenoStyle] = useState<(typeof RENO_STYLES)[number]["id"]>("boho");
  const [renoOpen, setRenoOpen] = useState(false);
  const room = RENO_ROOMS.find((r) => r.id === renoRoom)!;
  const style = RENO_STYLES.find((s) => s.id === renoStyle)!;
  const renoMaterial = room.material * style.multiplier;
  const renoLabor = room.labor * style.multiplier;

  const results = useMemo(
    () =>
      LISTINGS.filter(
        (l) =>
          (zip === "" || l.zip.startsWith(zip)) &&
          l.price <= maxPrice &&
          l.beds >= minBeds &&
          l.baths >= minBaths
      ),
    [zip, maxPrice, minBeds, minBaths]
  );

  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "net") return houseHack(a, mortgage).net - houseHack(b, mortgage).net;
    return a.daysOnMarket - b.daysOnMarket;
  });
  useEffect(() => {
    if (restored) saveBrowse({ zip, maxPrice, minBeds, minBaths, rate, downPct, termYears, sortBy });
  }, [restored, zip, maxPrice, minBeds, minBaths, rate, downPct, termYears, sortBy]);
  const [rvbId, setRvbId] = useState<number | null>(null);
  const pitiExample = (sortedResults[0] ?? LISTINGS[0])!;

  const area = useMemo(() => (zip === "" ? null : areaForZip(zip)), [zip]);

  // Fallback 1: same filters, closest listings in the same state (prefer under 100 miles)
  const nearbyResults = useMemo(() => {
    if (results.length > 0 || zip === "") return [];
    const matches = LISTINGS.filter(
      (l) => l.zip !== zip && l.price <= maxPrice && l.beds >= minBeds && l.baths >= minBaths
    );
    if (area) {
      const withDistance = matches
        .map((l) => ({ l, miles: milesBetween(area, l) }))
        .sort((a, b) => a.miles - b.miles);
      const inState = withDistance.filter((x) => x.l.state === area.state);
      const within100 = inState.filter((x) => x.miles <= 100);
      const ordered = [
        ...within100,
        ...inState.filter((x) => !within100.includes(x)),
        ...withDistance.filter((x) => x.l.state !== area.state),
      ];
      return ordered.slice(0, 3).map((x) => x.l);

    }
    const sharedPrefix = (other: string) => {
      let n = 0;
      while (n < zip.length && n < other.length && zip[n] === other[n]) n++;
      return n;
    };
    return matches
      .sort((a, b) => sharedPrefix(b.zip) - sharedPrefix(a.zip) || a.price - b.price)
      .slice(0, 3);
  }, [results.length, zip, area, maxPrice, minBeds, minBaths]);

  const nearbyNote = useMemo(() => {
    if (nearbyResults.length === 0) return "";
    if (area && nearbyResults.every((l) => l.state === area.state))
      return `No exact matches in ${zip}, so here are the closest homes in ${area.state}.`;
    return `No exact matches in ${zip}, so here are the closest homes we have.`;
  }, [nearbyResults, area, zip]);

  // Fallback 2: relax price/beds/baths criteria, staying in the same state when possible
  const relaxedResults = useMemo(() => {
    if (results.length > 0 || nearbyResults.length > 0) return [];
    const sameState = area ? LISTINGS.filter((l) => l.state === area.state) : [];
    const pool = sameState.length > 0 ? sameState : LISTINGS;
    return [...pool]
      .sort((a, b) => {
        const score = (l: Listing) =>
          (l.price > maxPrice ? 1 : 0) + (l.beds < minBeds ? 1 : 0) + (l.baths < minBaths ? 1 : 0);
        return score(a) - score(b) || a.price - b.price;
      })
      .slice(0, 3);
  }, [results.length, nearbyResults.length, area, maxPrice, minBeds, minBaths]);


  const relaxedNote = useMemo(() => {
    const adjustments: string[] = [];
    if (zip !== "" && relaxedResults.some((l) => !l.zip.startsWith(zip)))
      adjustments.push("other areas");
    if (maxPrice < PRICE_MAX && relaxedResults.some((l) => l.price > maxPrice))
      adjustments.push(`price above ${formatPrice(maxPrice)}`);
    if (minBeds > 0 && relaxedResults.some((l) => l.beds < minBeds))
      adjustments.push(`fewer than ${minBeds} beds`);
    if (minBaths > 0 && relaxedResults.some((l) => l.baths < minBaths))
      adjustments.push(`fewer than ${minBaths} baths`);
    return adjustments.length > 0
      ? `We relaxed your criteria to include homes with ${adjustments.join(", ")}.`
      : "";
  }, [relaxedResults, zip, maxPrice, minBeds, minBaths]);


  const hasFilters = zip !== "" || maxPrice < PRICE_MAX || minBeds > 0 || minBaths > 0;

  function clearFilters() {
    setZip("");
    setMaxPrice(PRICE_MAX);
    setMinBeds(0);
    setMinBaths(0);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">MillennialEquity</span>
          </div>
          <a
            href="#listings"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse homes
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your first home, your first real estate investment
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            More customized, more hacking, more DIY.
          </p>
          <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-lg border border-input bg-card p-2 shadow-sm">
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter a zip code — try 78704"
              aria-label="Zip code"
              className="w-full bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <a
              href="#listings"
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
            </a>
          </div>
        </div>
      </section>

      {/* Filters + listings */}
      <main id="listings" className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="zip-filter" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Zip code
              </label>
              <input
                id="zip-filter"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                placeholder="Any"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="price-filter" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Max price: <span className="text-foreground">{formatPrice(maxPrice)}</span>
              </label>
              <input
                id="price-filter"
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={25000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Min beds</span>
              <div className="mt-1 flex gap-1">
                {[0, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMinBeds(n)}
                    aria-pressed={minBeds === n}
                    className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                      minBeds === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {n === 0 ? "Any" : `${n}+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Min baths</span>
              <div className="mt-1 flex gap-1">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMinBaths(n)}
                    aria-pressed={minBaths === n}
                    className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                      minBaths === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {n === 0 ? "Any" : `${n}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            {results.length} {results.length === 1 ? "home" : "homes"} for sale
            {zip && <span className="ml-2 text-sm font-normal text-muted-foreground">in zip {zip}</span>}
          </h2>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
            >
              <option value="newest">Newest</option>
              <option value="price">Price (low to high)</option>
              <option value="net">Net payment after house hacking</option>
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="mt-8">
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-lg font-medium text-foreground">No homes match your filters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening the price range or clearing the zip code.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Reset filters
              </button>
            </div>

            {nearbyResults.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-foreground">
                  Closest listings in nearby areas
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nearbyNote || `Nothing in zip ${zip}, but these homes nearby match the rest of your filters.`}
                </p>

                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nearbyResults.map((l) => (
                    <ListingCard key={l.id} l={l} mortgage={mortgage} />
                  ))}
                </div>
              </div>
            )}

            {nearbyResults.length === 0 && relaxedResults.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-foreground">
                  Close matches with relaxed criteria
                </h3>
                {relaxedNote && <p className="mt-1 text-sm text-muted-foreground">{relaxedNote}</p>}
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relaxedResults.map((l) => (
                    <ListingCard key={l.id} l={l} mortgage={mortgage} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedResults.map((l) => (
              <ListingCard key={l.id} l={l} mortgage={mortgage} />
            ))}
          </div>
        )}

        {/* Rent vs. Buy */}
        <div className="mt-6">
          <label className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Compare against
            <select
              value={rvbId ?? pitiExample.id}
              onChange={(e) => setRvbId(Number(e.target.value))}
              className="max-w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
            >
              {LISTINGS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.address}, {x.city} — {formatPrice(x.price)}
                </option>
              ))}
            </select>
          </label>
          <RentVsBuy listing={LISTINGS.find((x) => x.id === (rvbId ?? pitiExample.id)) ?? pitiExample} mortgage={mortgage} />
        </div>

        <AppreciationBanner zip={zip} />

        {/* Mortgage calculator */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calculator className="h-4 w-4" />
            Monthly payment calculator
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Adjust these and every listing below shows its estimated monthly payment.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="rate" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Interest rate: <span className="text-foreground">{rate.toFixed(2)}%</span>
              </label>
              <input
                id="rate"
                type="range"
                min={2}
                max={10}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
            </div>
            <div>
              <label htmlFor="down" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Down payment: <span className="text-foreground">{downPct}%</span>
              </label>
              <input
                id="down"
                type="range"
                min={0}
                max={50}
                step={1}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Loan term</span>
              <div className="mt-1 flex gap-1">
                {[15, 20, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTermYears(n)}
                    aria-pressed={termYears === n}
                    className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                      termYears === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {n} yr
                  </button>
                ))}
              </div>
            </div>
          </div>
          {pitiExample && (() => {
            const c = trueCost(pitiExample, mortgage);
            const rows: [string, number][] = [
              ["Principal & interest", c.pi],
              [`Property tax (${(STATE_TAX_RATE[pitiExample.state] ?? DEFAULT_TAX_RATE).toFixed(2)}%/yr, ${pitiExample.state})`, c.tax],
              ["Homeowners insurance (0.5%/yr)", c.insurance],
              ...(c.pmi > 0 ? ([["PMI (0.7%/yr, under 20% down)", c.pmi]] as [string, number][]) : []),
              ...(c.hoa > 0 ? ([["HOA", c.hoa]] as [string, number][]) : []),
            ];
            return (
              <div className="mt-4 rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Full PITI example · {pitiExample.address}, {pitiExample.city} ({formatPrice(pitiExample.price)})
                </p>
                <dl className="mt-2 space-y-1 text-sm">
                  {rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium text-foreground">{formatPrice(v)}/mo</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-border pt-1">
                    <dt className="font-semibold text-foreground">True cost</dt>
                    <dd className="font-semibold text-primary">{formatPrice(c.total)}/mo</dd>
                  </div>
                </dl>
              </div>
            );
          })()}
          <p className="mt-3 text-xs text-muted-foreground">
            Every card shows the full PITI "true cost": principal & interest, property tax (estimated by state),
            homeowners insurance, PMI when you put down less than 20%, and HOA dues where they apply.
          </p>

          {/* House-hacking estimator */}
          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Home className="h-4 w-4" />
              House-hacking estimator
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Rent out part of the home and see how much of the mortgage it covers.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {RENTAL_SPACES.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-lg border p-3 transition-colors ${
                    rentals[s.id] ? "border-primary bg-accent" : "border-input bg-background"
                  }`}
                >
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={rentals[s.id]}
                      onChange={(e) => setRentals((p) => ({ ...p, [s.id]: e.target.checked }))}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.detail}</span>
                    </span>
                  </label>
                  <div className="mt-3">
                    <label
                      htmlFor={`rent-${s.id}`}
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Rent: <span className="text-foreground">{formatPrice(rentAmounts[s.id])}/mo</span>
                    </label>
                    <input
                      id={`rent-${s.id}`}
                      type="range"
                      min={300}
                      max={3500}
                      step={50}
                      value={rentAmounts[s.id]}
                      onChange={(e) => setRentAmounts((p) => ({ ...p, [s.id]: Number(e.target.value) }))}
                      disabled={!rentals[s.id]}
                      className="mt-2 w-full accent-primary disabled:opacity-40"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground">
              {rentalIncome > 0 ? (
                <>
                  Estimated rental income:{" "}
                  <span className="font-semibold">{formatPrice(rentalIncome)}/mo</span>. This is your custom scenario; each card also shows its own
                  House-Hack Score based on its rentable spaces and local rents.
                </>
              ) : (
                <span className="text-muted-foreground">Select a rentable space to see your reduced net payment.</span>
              )}
            </p>
          </div>
        </div>

        {/* DIY vs Pro */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Hammer className="h-4 w-4" />
            DIY vs. Pro difficulty ratings
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Common fixes ranked by how DIY-friendly they are, with the sweat equity you keep by doing it yourself.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DIY_PROJECTS.map((p) => {
              const proOnly = p.diy === 0;
              const savings = proOnly ? 0 : p.pro - p.diy;
              return (
                <div key={p.project} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{p.project}</p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        proOnly ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1" aria-label={`DIY friendliness ${p.score} of 10`}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i < p.score ? "bg-primary" : "bg-secondary"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Wrench className="h-4 w-4" />
                      DIY {proOnly ? "n/a" : formatPrice(p.diy)}
                    </span>
                    <span>Pro {formatPrice(p.pro)}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {proOnly ? "Hire a licensed pro — not a safe DIY job." : `Sweat equity saved: ${formatPrice(savings)}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Renovation cost estimator */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <PaintRoller className="h-4 w-4" />
                Instant renovation cost estimator
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a room and a style to budget your remodel before you make an offer.
              </p>
            </div>
            <button
              onClick={() => setRenoOpen(true)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Estimate a remodel
            </button>
          </div>
        </div>

        {renoOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Renovation cost estimator"
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
            onClick={() => setRenoOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-foreground">Renovation cost estimator</h3>
                <button
                  onClick={() => setRenoOpen(false)}
                  aria-label="Close"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Room</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {RENO_ROOMS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRenoRoom(r.id)}
                      aria-pressed={renoRoom === r.id}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        renoRoom === r.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-accent"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Style</span>
                <div className="mt-2 grid gap-2">
                  {RENO_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setRenoStyle(s.id)}
                      aria-pressed={renoStyle === s.id}
                      className={`rounded-md border px-3 py-2 text-left transition-colors ${
                        renoStyle === s.id
                          ? "border-primary bg-accent"
                          : "border-input bg-background hover:bg-accent"
                      }`}
                    >
                      <span className="block text-sm font-medium text-foreground">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Materials</span>
                  <span className="font-medium text-foreground">{formatPrice(renoMaterial)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Labor</span>
                  <span className="font-medium text-foreground">{formatPrice(renoLabor)}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                  <span className="text-sm font-semibold text-foreground">
                    Total — {room.label}, {style.label}
                  </span>
                  <span className="text-2xl font-bold text-foreground">{formatPrice(renoMaterial + renoLabor)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Ballpark ranges for a typical mid-size room. Local labor rates and permits can shift totals.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">MillennialEquity</span>
          </div>
          <p className="text-sm text-muted-foreground">Demo listings shown for illustration. Contact us for live MLS data.</p>
        </div>
      </footer>
    </div>
  );
}
