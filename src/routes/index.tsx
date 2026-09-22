import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BedDouble, Bath, Ruler, MapPin, Search, SlidersHorizontal, X, Calculator, Home, Hammer, Wrench, PaintRoller, BadgeCheck, Map as MapIcon, ExternalLink, Wallet } from "lucide-react";

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
  verified?: boolean;
  hoa?: number;
};

// Coordinates and addresses below were confirmed with the Google Maps Geocoding API
// (street-level rooftop or interpolated match), so every listing shows a Verified Address badge.
const LISTINGS: Listing[] = [
  { id: 1, image: listing1, price: 685000, address: "1045 S 5th St", city: "Austin, TX", state: "TX", zip: "78704", lat: 30.2554333, lng: -97.7572973, beds: 4, baths: 3, sqft: 2680, daysOnMarket: 3, tag: "New", verified: true },
  { id: 2, image: listing2, price: 495000, address: "1254 Newning Ave", city: "Austin, TX", state: "TX", zip: "78704", lat: 30.2505005, lng: -97.7439042, beds: 3, baths: 2, sqft: 1720, daysOnMarket: 9, verified: true },
  { id: 3, image: listing3, price: 2890000, address: "6801 N 74th St", city: "Scottsdale, AZ", state: "AZ", zip: "85251", lat: 33.5046857, lng: -111.9218719, beds: 6, baths: 7, sqft: 7400, daysOnMarket: 14, tag: "Luxury", verified: true },
  { id: 4, image: listing4, price: 1125000, address: "45 Beacon St", city: "Boston, MA", state: "MA", zip: "02108", lat: 42.3569118, lng: -71.0670806, beds: 3, baths: 2.5, sqft: 2150, daysOnMarket: 5, tag: "New", verified: true },
  { id: 5, image: listing5, price: 760000, address: "3285 N 68th St", city: "Scottsdale, AZ", state: "AZ", zip: "85251", lat: 33.4852678, lng: -111.934758, beds: 3, baths: 2, sqft: 1985, daysOnMarket: 21, verified: true },
  { id: 6, image: listing6, price: 940000, address: "17 Chestnut St", city: "Boston, MA", state: "MA", zip: "02108", lat: 42.357784, lng: -71.0670711, beds: 5, baths: 4, sqft: 3420, daysOnMarket: 2, tag: "New", verified: true },
  { id: 7, image: listing2, price: 389000, address: "903 Pecan Grove Rd", city: "Austin, TX", state: "TX", zip: "78745", lat: 30.2488936, lng: -97.7423255, beds: 2, baths: 2, sqft: 1280, daysOnMarket: 30, verified: true },
  { id: 8, image: listing1, price: 1540000, address: "611 Detroit St", city: "Denver, CO", state: "CO", zip: "80206", lat: 39.725891, lng: -104.9547168, beds: 5, baths: 4, sqft: 3980, daysOnMarket: 7, verified: true },
  { id: 9, image: listing5, price: 525000, address: "220 Adams St", city: "Denver, CO", state: "CO", zip: "80206", lat: 39.7199215, lng: -104.9483451, beds: 3, baths: 2, sqft: 1810, daysOnMarket: 11, verified: true },
  { id: 10, image: listing4, price: 1185000, address: "412 Heights Rd", city: "Ridgewood, NJ", state: "NJ", zip: "07450", lat: 40.9922055, lng: -74.1204896, beds: 4, baths: 3, sqft: 2940, daysOnMarket: 4, tag: "New", verified: true },
  { id: 11, image: listing1, price: 879000, address: "58 Spring Valley Rd", city: "Paramus, NJ", state: "NJ", zip: "07652", lat: 40.9218133, lng: -74.0598417, beds: 4, baths: 2.5, sqft: 2410, daysOnMarket: 12, verified: true },
  { id: 12, image: listing6, price: 1395000, address: "915 Bloomfield Ave", city: "Montclair, NJ", state: "NJ", zip: "07042", lat: 40.8041039, lng: -74.2068673, beds: 5, baths: 4, sqft: 3380, daysOnMarket: 6, tag: "New", verified: true },
  { id: 13, image: listing2, price: 749000, address: "230 Garden St, Unit 4B", city: "Hoboken, NJ", state: "NJ", zip: "07030", lat: 40.739943, lng: -74.0322387, beds: 2, baths: 2, sqft: 1180, daysOnMarket: 18, verified: true, hoa: 450 },
  { id: 14, image: listing5, price: 615000, address: "177 Newark Ave, Unit 902", city: "Jersey City, NJ", state: "NJ", zip: "07302", lat: 40.7209809, lng: -74.0455105, beds: 2, baths: 2, sqft: 1050, daysOnMarket: 25, verified: true, hoa: 520 },
  { id: 15, image: listing3, price: 1750000, address: "14 Mt Kemble Ave", city: "Morristown, NJ", state: "NJ", zip: "07960", lat: 40.7936835, lng: -74.4847224, beds: 6, baths: 5, sqft: 4620, daysOnMarket: 9, tag: "Luxury", verified: true },
  { id: 16, image: listing1, price: 995000, address: "302 Summit Ave", city: "Summit, NJ", state: "NJ", zip: "07901", lat: 40.7313373, lng: -74.3564501, beds: 3, baths: 2.5, sqft: 2190, daysOnMarket: 15, verified: true },
  { id: 17, image: listing6, price: 1290000, address: "45 Prospect St", city: "White Plains, NY", state: "NY", zip: "10601", lat: 41.0203901, lng: -73.7690274, beds: 4, baths: 3, sqft: 2760, daysOnMarket: 8, verified: true },
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
const PRICE_MAX = 2000000;

type MortgageSettings = { rate: number; downPct: number; termYears: number; rentalIncome: number };

function formatPrice(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function monthlyPayment(price: number, { rate, downPct, termYears }: MortgageSettings) {
  const principal = price * (1 - downPct / 100);
  const n = termYears * 12;
  const r = rate / 100 / 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

// House-hacking: rentable spaces a young buyer could lease out
const RENTAL_SPACES = [
  { id: "bedroom", label: "Spare bedroom", detail: "Roommate or long-term tenant", rent: 900 },
  { id: "basement", label: "Finished basement", detail: "Separate entrance studio", rent: 1500 },
  { id: "adu", label: "ADU / garage unit", detail: "Standalone 1-bed unit", rent: 1900 },
] as const;

type RentalId = (typeof RENTAL_SPACES)[number]["id"];

// Renovation cost estimator data
const RENO_ROOMS = [
  { id: "kitchen", label: "Outdated kitchen", material: 14500, labor: 12000 },
  { id: "bath", label: "Full bath", material: 6200, labor: 5400 },
  { id: "living", label: "Living room", material: 4300, labor: 3100 },
  { id: "primary", label: "Primary bedroom", material: 3600, labor: 2400 },
] as const;

const RENO_STYLES = [
  { id: "boho", label: "Modern Boho", multiplier: 0.95, note: "Woven textures, warm woods, budget-friendly finishes" },
  { id: "minimalist", label: "Warm Minimalist", multiplier: 1.1, note: "Flat-panel cabinetry, quartz, integrated lighting" },
  { id: "midcentury", label: "Mid-Century Modern", multiplier: 1.25, note: "Walnut millwork, custom casework, statement tile" },
] as const;

// DIY vs Pro difficulty ratings
const DIY_PROJECTS = [
  { project: "Cabinet painting", difficulty: "Easy DIY", score: 9, diy: 350, pro: 2500 },
  { project: "Interior wall painting", difficulty: "Easy DIY", score: 9, diy: 280, pro: 1900 },
  { project: "Luxury vinyl plank flooring", difficulty: "Moderate DIY", score: 6, diy: 1400, pro: 5200 },
  { project: "Tile backsplash", difficulty: "Moderate DIY", score: 6, diy: 420, pro: 1800 },
  { project: "Bathroom vanity swap", difficulty: "Moderate DIY", score: 5, diy: 650, pro: 2200 },
  { project: "Panel upgrade / rewiring", difficulty: "Pro only", score: 1, diy: 0, pro: 4200 },
  { project: "Load-bearing wall removal", difficulty: "Pro only", score: 1, diy: 0, pro: 8500 },
  { project: "Roof replacement", difficulty: "Pro only", score: 1, diy: 0, pro: 14500 },
] as const;

const MAPS_KEY = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'] as string | undefined;

/** Interactive Google Street View of the home's exterior (Maps Embed API). */
function streetViewEmbedUrl(l: Listing) {
  if (!MAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/streetview?key=${MAPS_KEY}&location=${l.lat},${l.lng}&heading=0&pitch=5&fov=80`;
}

/** Mini-map centered on the verified location (Maps Embed API). */
function mapEmbedUrl(l: Listing) {
  if (!MAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(`${l.address}, ${l.city} ${l.zip}`)}&zoom=15`;
}

function googleMapsLink(l: Listing) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.address}, ${l.city} ${l.zip}`)}`;
}

type Verdict = { label: string; badgeClass: string };

function verdictFor(ratio: number): Verdict {
  if (ratio > 0 && ratio < 0.3) return { label: "Comfortable", badgeClass: "bg-green-500/15 text-green-700 dark:text-green-400" };
  if (ratio > 0 && ratio <= 0.4) return { label: "Tight", badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400" };
  return { label: "Stretch", badgeClass: "bg-red-500/15 text-red-700 dark:text-red-400" };
}

function AffordabilityPanel({ l, onClose }: { l: Listing; onClose: () => void }) {
  const [takeHome, setTakeHome] = useState("");
  const [studentLoan, setStudentLoan] = useState("");
  const [people, setPeople] = useState(1);
  const [downPayment, setDownPayment] = useState<number>(Math.round(l.price * 0.2));

  const income = Math.max(Number(takeHome) || 0, 0);
  const loan = Math.max(Number(studentLoan) || 0, 0);
  const down = Math.min(Math.max(downPayment || 0, 0), l.price);

  // Fixed assumptions: 30-year fixed at 7%
  const mortgage = useMemo(() => {
    const principal = l.price - down;
    const r = 0.07 / 12;
    const n = 360;
    if (principal <= 0) return 0;
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }, [l.price, down]);

  const tax = (l.price * 0.011) / 12;
  const insurance = 160;
  const hoa = l.hoa ?? 0;
  const total = mortgage + tax + insurance + hoa;
  const share = total / people;
  const available = income - loan;
  const ratio = income > 0 ? share / available : null;
  const verdict = ratio === null ? null : verdictFor(ratio);

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Affordability check for ${l.address}, ${l.city}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Can I afford this home?</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {l.address}, {l.city} {l.zip} — {formatPrice(l.price)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`income-${l.id}`} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Monthly take-home pay
            </label>
            <input
              id={`income-${l.id}`}
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="e.g. 8500"
              value={takeHome}
              onChange={(e) => setTakeHome(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor={`loan-${l.id}`} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Student loan / mo <span className="normal-case">(optional)</span>
            </label>
            <input
              id={`loan-${l.id}`}
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="e.g. 400"
              value={studentLoan}
              onChange={(e) => setStudentLoan(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor={`down-${l.id}`} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Down payment
            </label>
            <input
              id={`down-${l.id}`}
              type="number"
              min={0}
              max={l.price}
              step={1000}
              inputMode="numeric"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">People splitting</span>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPeople(n)}
                  aria-pressed={people === n}
                  className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                    people === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-background p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Mortgage (30-yr fixed, 7%)</dt>
              <dd className="font-medium text-foreground">{formatPrice(mortgage)}/mo</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Property tax (est.)</dt>
              <dd className="font-medium text-foreground">{formatPrice(tax)}/mo</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Home insurance (est.)</dt>
              <dd className="font-medium text-foreground">{formatPrice(insurance)}/mo</dd>
            </div>
            {hoa > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">HOA fees</dt>
                <dd className="font-medium text-foreground">{formatPrice(hoa)}/mo</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-semibold text-foreground">Total monthly cost</dt>
              <dd className="font-semibold text-foreground">{formatPrice(total)}/mo</dd>
            </div>
            {people > 1 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Your share ({people} ways)</dt>
                <dd className="font-medium text-primary">{formatPrice(share)}/mo</dd>
              </div>
            )}
          </dl>

          {verdict && ratio !== null ? (
            <div className="mt-4 border-t border-border pt-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${verdict.badgeClass}`}>
                {verdict.label}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                That's about {Math.round(ratio * 100)}% of your take-home pay
                {loan > 0 ? " after student loans" : ""}
                {people > 1 ? ` (split ${people} ways)` : ""}.
              </p>
            </div>
          ) : (
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              Enter your take-home pay above to see your verdict.
            </p>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Estimates only — actual rates, taxes, insurance, and loan approval vary. Talk to a lender before making decisions.
        </p>
      </div>
    </div>
  );
}

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
          <img
            src={l.image}
            alt={`Home at ${l.address}, ${l.city}`}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
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
          const pay = monthlyPayment(l.price, mortgage);
          const net = Math.max(pay - mortgage.rentalIncome, 0);
          const offset = pay > 0 ? Math.min((mortgage.rentalIncome / pay) * 100, 100) : 0;
          return (
            <>
              <p className="mt-1 text-sm font-medium text-primary">Est. {formatPrice(pay)}/mo</p>
              {mortgage.rentalIncome > 0 && (
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {formatPrice(net)}/mo after rent
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {Math.round(offset)}% offset
                  </span>
                </p>
              )}
            </>
          );
        })()}
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
      { title: "MillenialHomeHunt — Find Homes for Sale by Zip Code" },
      { name: "description", content: "Find homes tailored for young homeowners. Search listings by zip code, estimate mortgage and house-hacking payments, and compare DIY vs. pro renovation costs." },
      { property: "og:title", content: "MillenialHomeHunt — Find Homes for Sale by Zip Code" },
      { property: "og:description", content: "Find homes tailored for young homeowners. Search listings by zip code, estimate mortgage and house-hacking payments, and compare DIY vs. pro renovation costs." },
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
            <span className="text-xl font-bold tracking-tight">MillenialHomeHunt</span>
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
            Finding the right home for young homeowners
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
          <p className="mt-3 text-xs text-muted-foreground">
            Principal and interest only. Taxes, insurance, and HOA dues are not included.
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
                  <span className="font-semibold">{formatPrice(rentalIncome)}/mo</span>. Every listing below now shows
                  its net payment and how much of the mortgage is offset.
                </>
              ) : (
                <span className="text-muted-foreground">Select a rentable space to see your reduced net payment.</span>
              )}
            </p>
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
            {results.map((l) => (
              <ListingCard key={l.id} l={l} mortgage={mortgage} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">MillenialHomeHunt</span>
          </div>
          <p className="text-sm text-muted-foreground">Demo listings shown for illustration. Contact us for live MLS data.</p>
        </div>
      </footer>
    </div>
  );
}
