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
  state: string;
  zip: string;
  lat: number;
  lng: number;
  beds: number;
  baths: number;
  sqft: number;
  daysOnMarket: number;
  tag?: string;
};

const LISTINGS: Listing[] = [
  { id: 1, image: listing1, price: 685000, address: "1045 Maple Crest Dr", city: "Austin, TX", state: "TX", zip: "78704", lat: 30.245, lng: -97.766, beds: 4, baths: 3, sqft: 2680, daysOnMarket: 3, tag: "New" },
  { id: 2, image: listing2, price: 495000, address: "1254 Willow Bend Ln", city: "Austin, TX", state: "TX", zip: "78704", lat: 30.245, lng: -97.766, beds: 3, baths: 2, sqft: 1720, daysOnMarket: 9 },
  { id: 3, image: listing3, price: 2890000, address: "88 Summit Ridge Rd", city: "Scottsdale, AZ", state: "AZ", zip: "85251", lat: 33.494, lng: -111.926, beds: 6, baths: 7, sqft: 7400, daysOnMarket: 14, tag: "Luxury" },
  { id: 4, image: listing4, price: 1125000, address: "1247 Beacon Hill Ave", city: "Boston, MA", state: "MA", zip: "02108", lat: 42.357, lng: -71.065, beds: 3, baths: 2.5, sqft: 2150, daysOnMarket: 5, tag: "New" },
  { id: 5, image: listing5, price: 760000, address: "3285 Palo Verde Way", city: "Scottsdale, AZ", state: "AZ", zip: "85251", lat: 33.494, lng: -111.926, beds: 3, baths: 2, sqft: 1985, daysOnMarket: 21 },
  { id: 6, image: listing6, price: 940000, address: "17 Colonial Elm Ct", city: "Boston, MA", state: "MA", zip: "02108", lat: 42.357, lng: -71.065, beds: 5, baths: 4, sqft: 3420, daysOnMarket: 2, tag: "New" },
  { id: 7, image: listing2, price: 389000, address: "903 Pecan Grove St", city: "Austin, TX", state: "TX", zip: "78745", lat: 30.208, lng: -97.798, beds: 2, baths: 2, sqft: 1280, daysOnMarket: 30 },
  { id: 8, image: listing1, price: 1540000, address: "611 Ridgeview Ter", city: "Denver, CO", state: "CO", zip: "80206", lat: 39.731, lng: -104.954, beds: 5, baths: 4, sqft: 3980, daysOnMarket: 7 },
  { id: 9, image: listing5, price: 525000, address: "220 Desert Sage Pl", city: "Denver, CO", state: "CO", zip: "80206", lat: 39.731, lng: -104.954, beds: 3, baths: 2, sqft: 1810, daysOnMarket: 11 },
  { id: 10, image: listing4, price: 1185000, address: "412 Heights Rd", city: "Ridgewood, NJ", state: "NJ", zip: "07450", lat: 40.979, lng: -74.117, beds: 4, baths: 3, sqft: 2940, daysOnMarket: 4, tag: "New" },
  { id: 11, image: listing1, price: 879000, address: "58 Spring Valley Rd", city: "Paramus, NJ", state: "NJ", zip: "07652", lat: 40.945, lng: -74.075, beds: 4, baths: 2.5, sqft: 2410, daysOnMarket: 12 },
  { id: 12, image: listing6, price: 1395000, address: "915 Bloomfield Ave", city: "Montclair, NJ", state: "NJ", zip: "07042", lat: 40.812, lng: -74.223, beds: 5, baths: 4, sqft: 3380, daysOnMarket: 6, tag: "New" },
  { id: 13, image: listing2, price: 749000, address: "230 Garden St, Unit 4B", city: "Hoboken, NJ", state: "NJ", zip: "07030", lat: 40.744, lng: -74.032, beds: 2, baths: 2, sqft: 1180, daysOnMarket: 18 },
  { id: 14, image: listing5, price: 615000, address: "77 Newark Ave, Unit 902", city: "Jersey City, NJ", state: "NJ", zip: "07302", lat: 40.72, lng: -74.046, beds: 2, baths: 2, sqft: 1050, daysOnMarket: 25 },
  { id: 15, image: listing3, price: 1750000, address: "14 Mount Kemble Ave", city: "Morristown, NJ", state: "NJ", zip: "07960", lat: 40.791, lng: -74.478, beds: 6, baths: 5, sqft: 4620, daysOnMarket: 9, tag: "Luxury" },
  { id: 16, image: listing1, price: 995000, address: "302 Summit Ave", city: "Summit, NJ", state: "NJ", zip: "07901", lat: 40.715, lng: -74.36, beds: 3, baths: 2.5, sqft: 2190, daysOnMarket: 15 },
  { id: 17, image: listing6, price: 1290000, address: "45 Prospect St", city: "White Plains, NY", state: "NY", zip: "10601", lat: 41.033, lng: -73.763, beds: 4, baths: 3, sqft: 2760, daysOnMarket: 8 },
];

// Approximate centroid + state for a zip prefix, so unmapped zips still resolve to a region.
const ZIP_AREAS: Record<string, { state: string; lat: number; lng: number }> = {
  "07": { state: "NJ", lat: 40.83, lng: -74.15 },
  "08": { state: "NJ", lat: 40.05, lng: -74.6 },
  "10": { state: "NY", lat: 40.78, lng: -73.95 },
  "11": { state: "NY", lat: 40.7, lng: -73.75 },
  "12": { state: "NY", lat: 42.65, lng: -73.76 },
  "02": { state: "MA", lat: 42.36, lng: -71.06 },
  "78": { state: "TX", lat: 30.27, lng: -97.74 },
  "85": { state: "AZ", lat: 33.45, lng: -112.07 },
  "80": { state: "CO", lat: 39.74, lng: -104.99 },
};

function areaForZip(zip: string) {
  if (zip.length < 2) return null;
  const exact = LISTINGS.find((l) => l.zip === zip);
  if (exact) return { state: exact.state, lat: exact.lat, lng: exact.lng };
  return ZIP_AREAS[zip.slice(0, 2)] ?? null;
}

function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
}


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
      const sameState = withDistance.filter((x) => x.l.state === area.state);
      const within100 = sameState.filter((x) => x.miles <= 100);
      const pick = within100.length > 0 ? within100 : sameState;
      if (pick.length > 0) return pick.slice(0, 3).map((x) => x.l);
      return withDistance.slice(0, 3).map((x) => x.l);
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
                  Closest listings in nearby areas
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nearbyNote || `Nothing in zip ${zip}, but these homes nearby match the rest of your filters.`}
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
