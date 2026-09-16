import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BedDouble, Bath, Ruler, MapPin, Search, SlidersHorizontal, X } from "lucide-react";

import listing1 from "../assets/listing-1.jpg";
import listing2 from "../assets/listing-2.jpg";
import listing3 from "../assets/listing-3.jpg";
import listing4 from "../assets/listing-4.jpg";
import listing5 from "../assets/listing-5.jpg";
import listing6 from "../assets/listing-6.jpg";

type Listing = {
  id: number;
  image: string;
  price: number;
  address: string;
  city: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  daysOnMarket: number;
  tag?: string;
};

const LISTINGS: Listing[] = [
  { id: 1, image: listing1, price: 685000, address: "1045 Maple Crest Dr", city: "Austin, TX", zip: "78704", beds: 4, baths: 3, sqft: 2680, daysOnMarket: 3, tag: "New" },
  { id: 2, image: listing2, price: 495000, address: "1254 Willow Bend Ln", city: "Austin, TX", zip: "78704", beds: 3, baths: 2, sqft: 1720, daysOnMarket: 9 },
  { id: 3, image: listing3, price: 2890000, address: "88 Summit Ridge Rd", city: "Scottsdale, AZ", zip: "85251", beds: 6, baths: 7, sqft: 7400, daysOnMarket: 14, tag: "Luxury" },
  { id: 4, image: listing4, price: 1125000, address: "1247 Beacon Hill Ave", city: "Boston, MA", zip: "02108", beds: 3, baths: 2.5, sqft: 2150, daysOnMarket: 5, tag: "New" },
  { id: 5, image: listing5, price: 760000, address: "3285 Palo Verde Way", city: "Scottsdale, AZ", zip: "85251", beds: 3, baths: 2, sqft: 1985, daysOnMarket: 21 },
  { id: 6, image: listing6, price: 940000, address: "17 Colonial Elm Ct", city: "Boston, MA", zip: "02108", beds: 5, baths: 4, sqft: 3420, daysOnMarket: 2, tag: "New" },
  { id: 7, image: listing2, price: 389000, address: "903 Pecan Grove St", city: "Austin, TX", zip: "78745", beds: 2, baths: 2, sqft: 1280, daysOnMarket: 30 },
  { id: 8, image: listing1, price: 1540000, address: "611 Ridgeview Ter", city: "Denver, CO", zip: "80206", beds: 5, baths: 4, sqft: 3980, daysOnMarket: 7 },
  { id: 9, image: listing5, price: 525000, address: "220 Desert Sage Pl", city: "Denver, CO", zip: "80206", beds: 3, baths: 2, sqft: 1810, daysOnMarket: 11 },
];

const PRICE_MIN = 0;
const PRICE_MAX = 3000000;

function formatPrice(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function ListingCard({ l }: { l: Listing }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={l.image}
          alt={`Home at ${l.address}, ${l.city}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {l.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            {l.tag}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
          {l.daysOnMarket}d on market
        </span>
      </div>
      <div className="p-4">
        <p className="text-2xl font-bold text-foreground">{formatPrice(l.price)}</p>
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
        <p className="mt-3 text-sm font-medium text-foreground">{l.address}</p>
        <p className="text-sm text-muted-foreground">
          {l.city} {l.zip}
        </p>
      </div>
    </article>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HomeHunt — Find Homes for Sale by Zip Code" },
      { name: "description", content: "Search recent property listings by zip code. Filter by price, bedrooms, and bathrooms to find your next home." },
      { property: "og:title", content: "HomeHunt — Find Homes for Sale by Zip Code" },
      { property: "og:description", content: "Search recent property listings by zip code with live filters for price, beds, and baths." },
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

  // Fallback 1: same filters, closest zip codes by shared prefix (regional match)
  const nearbyResults = useMemo(() => {
    if (results.length > 0 || zip === "") return [];
    const sharedPrefix = (other: string) => {
      let n = 0;
      while (n < zip.length && n < other.length && zip[n] === other[n]) n++;
      return n;
    };
    return LISTINGS.filter(
      (l) =>
        l.zip !== zip && l.price <= maxPrice && l.beds >= minBeds && l.baths >= minBaths
    )
      .sort((a, b) => sharedPrefix(b.zip) - sharedPrefix(a.zip) || a.price - b.price)
      .slice(0, 3);
  }, [results.length, zip, maxPrice, minBeds, minBaths]);

  // Fallback 2: relax price/beds/baths criteria across all listings
  const relaxedResults = useMemo(() => {
    if (results.length > 0 || nearbyResults.length > 0) return [];
    return [...LISTINGS]
      .sort((a, b) => {
        const score = (l: Listing) =>
          (l.price > maxPrice ? 1 : 0) + (l.beds < minBeds ? 1 : 0) + (l.baths < minBaths ? 1 : 0);
        return score(a) - score(b) || a.price - b.price;
      })
      .slice(0, 3);
  }, [results.length, nearbyResults.length, maxPrice, minBeds, minBaths]);

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
            <span className="text-xl font-bold tracking-tight">HomeHunt</span>
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
            Find your next home by zip code
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Fresh listings updated daily. Filter by price, bedrooms, and bathrooms to zero in on the right place.
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

        <div className="mt-8 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {results.length} {results.length === 1 ? "home" : "homes"} for sale
          </h2>
          {zip && <span className="text-sm text-muted-foreground">in zip {zip}</span>}
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
                  Nearby in neighboring zip codes
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nothing in zip {zip}, but these homes nearby match the rest of your filters.
                </p>
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nearbyResults.map((l) => (
                    <ListingCard key={l.id} l={l} />
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
                    <ListingCard key={l.id} l={l} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">HomeHunt</span>
          </div>
          <p className="text-sm text-muted-foreground">Demo listings shown for illustration. Contact us for live MLS data.</p>
        </div>
      </footer>
    </div>
  );
}
