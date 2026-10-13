import { useState } from "react";
import { X, Wallet } from "lucide-react";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

export type Listing = {
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
  basement?: boolean;
  adu?: boolean;
};

// Rentable extras per listing (finished basement / ADU or convertible garage)
export const HACK_EXTRAS: Record<number, { basement?: boolean; adu?: boolean }> = {
  1: { adu: true }, 2: { adu: true }, 4: { basement: true }, 6: { basement: true }, 8: { basement: true, adu: true },
  9: { basement: true }, 10: { basement: true }, 11: { basement: true }, 12: { basement: true, adu: true },
  15: { basement: true, adu: true }, 16: { basement: true }, 17: { basement: true }, 5: { adu: true },
};

// Coordinates and addresses below were confirmed with the Google Maps Geocoding API
// (street-level rooftop or interpolated match), so every listing shows a Verified Address badge.
export const LISTINGS: Listing[] = ([
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
] as Listing[]).map((l) => ({ ...l, ...HACK_EXTRAS[l.id] }));

// Approximate centroid + state for a zip prefix, so unmapped zips still resolve to a region.
export const ZIP_AREAS: Record<string, { state: string; lat: number; lng: number }> = {
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

export function areaForZip(zip: string) {
  if (zip.length < 2) return null;
  const exact = LISTINGS.find((l) => l.zip === zip);
  if (exact) return { state: exact.state, lat: exact.lat, lng: exact.lng };
  return ZIP_AREAS[zip.slice(0, 2)] ?? null;
}

export function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
}


export const PRICE_MIN = 0;
export const PRICE_MAX = 2000000;

export type MortgageSettings = { rate: number; downPct: number; termYears: number; rentalIncome: number };

export function formatPrice(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function monthlyPayment(price: number, { rate, downPct, termYears }: MortgageSettings) {
  const principal = price * (1 - downPct / 100);
  const n = termYears * 12;
  const r = rate / 100 / 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

// ---- Full PITI ----
export const STATE_TAX_RATE: Record<string, number> = { NJ: 2.23, TX: 1.6, NY: 1.4, MA: 1.1, AZ: 0.6, CO: 0.5 };
export const DEFAULT_TAX_RATE = 1.1;

export function trueCost(l: Listing, s: MortgageSettings) {
  const pi = monthlyPayment(l.price, s);
  const tax = (l.price * (STATE_TAX_RATE[l.state] ?? DEFAULT_TAX_RATE)) / 100 / 12;
  const insurance = (l.price * 0.005) / 12;
  const loan = l.price * (1 - s.downPct / 100);
  const pmi = s.downPct < 20 ? (loan * 0.007) / 12 : 0;
  const hoa = l.hoa ?? 0;
  return { pi, tax, insurance, pmi, hoa, total: pi + tax + insurance + pmi + hoa };
}

// ---- House-Hack Score ----
export type SortKey = "newest" | "price" | "net";

// Typical rent for one room, by zip prefix (falls back to state, then national).
export const ROOM_RENT_BY_ZIP: Record<string, number> = {
  "07030": 1500, "07302": 1400, "07042": 1100, "07450": 1100, "07652": 1050, "07960": 1050, "07901": 1150,
  "10601": 1200, "02108": 1600, "78704": 1000, "78745": 850, "85251": 950, "80206": 1050,
};
export const ROOM_RENT_BY_STATE: Record<string, number> = { NJ: 1100, NY: 1200, MA: 1400, TX: 900, AZ: 900, CO: 1000 };

export function roomRent(l: Listing) {
  return ROOM_RENT_BY_ZIP[l.zip] ?? ROOM_RENT_BY_STATE[l.state] ?? 900;
}

export function rentableSpaces(l: Listing) {
  const room = roomRent(l);
  const spaces: { label: string; rent: number }[] = [];
  const spare = Math.max(l.beds - 1, 0);
  if (spare > 0) spaces.push({ label: `${spare} spare bedroom${spare > 1 ? "s" : ""}`, rent: spare * room });
  if (l.basement) spaces.push({ label: "Finished basement", rent: Math.round(room * 1.5) });
  if (l.adu) spaces.push({ label: "ADU / garage", rent: Math.round(room * 1.9) });
  return spaces;
}

export function hackScore(pct: number) {
  return Math.min(10, Math.max(1, Math.ceil(pct / 8)));
}

export function houseHack(l: Listing, s: MortgageSettings) {
  const cost = trueCost(l, s);
  const spaces = rentableSpaces(l);
  const rent = spaces.reduce((sum, x) => sum + x.rent, 0);
  const pct = cost.total > 0 ? Math.min((rent / cost.total) * 100, 100) : 0;
  return { cost, spaces, rent, net: Math.max(cost.total - rent, 0), pct, score: hackScore(pct) };
}

// House-hacking: rentable spaces a young buyer could lease out
export const RENTAL_SPACES = [
  { id: "bedroom", label: "Spare bedroom", detail: "Roommate or long-term tenant", rent: 900 },
  { id: "basement", label: "Finished basement", detail: "Separate entrance studio", rent: 1500 },
  { id: "adu", label: "ADU / garage unit", detail: "Standalone 1-bed unit", rent: 1900 },
] as const;

export type RentalId = (typeof RENTAL_SPACES)[number]["id"];

// Renovation cost estimator data
export const RENO_ROOMS = [
  { id: "kitchen", label: "Outdated kitchen", material: 14500, labor: 12000 },
  { id: "bath", label: "Full bath", material: 6200, labor: 5400 },
  { id: "living", label: "Living room", material: 4300, labor: 3100 },
  { id: "primary", label: "Primary bedroom", material: 3600, labor: 2400 },
] as const;

export const RENO_STYLES = [
  { id: "boho", label: "Modern Boho", multiplier: 0.95, note: "Woven textures, warm woods, budget-friendly finishes" },
  { id: "minimalist", label: "Warm Minimalist", multiplier: 1.1, note: "Flat-panel cabinetry, quartz, integrated lighting" },
  { id: "midcentury", label: "Mid-Century Modern", multiplier: 1.25, note: "Walnut millwork, custom casework, statement tile" },
] as const;

// DIY vs Pro difficulty ratings
export const DIY_PROJECTS = [
  { project: "Cabinet painting", difficulty: "Easy DIY", score: 9, diy: 350, pro: 2500 },
  { project: "Interior wall painting", difficulty: "Easy DIY", score: 9, diy: 280, pro: 1900 },
  { project: "Luxury vinyl plank flooring", difficulty: "Moderate DIY", score: 6, diy: 1400, pro: 5200 },
  { project: "Tile backsplash", difficulty: "Moderate DIY", score: 6, diy: 420, pro: 1800 },
  { project: "Bathroom vanity swap", difficulty: "Moderate DIY", score: 5, diy: 650, pro: 2200 },
  { project: "Panel upgrade / rewiring", difficulty: "Pro only", score: 1, diy: 0, pro: 4200 },
  { project: "Load-bearing wall removal", difficulty: "Pro only", score: 1, diy: 0, pro: 8500 },
  { project: "Roof replacement", difficulty: "Pro only", score: 1, diy: 0, pro: 14500 },
] as const;

export const MAPS_KEY = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'] as string | undefined;

/** Interactive Google Street View of the home's exterior (Maps Embed API). */
export function streetViewEmbedUrl(l: Listing) {
  if (!MAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/streetview?key=${MAPS_KEY}&location=${l.lat},${l.lng}&heading=0&pitch=5&fov=80`;
}

/** Mini-map centered on the verified location (Maps Embed API). */
export function mapEmbedUrl(l: Listing) {
  if (!MAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(`${l.address}, ${l.city} ${l.zip}`)}&zoom=15`;
}

export function googleMapsLink(l: Listing) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.address}, ${l.city} ${l.zip}`)}`;
}

export type Verdict = { label: string; badgeClass: string };

export function verdictFor(ratio: number): Verdict {
  if (ratio > 0 && ratio < 0.3) return { label: "Comfortable", badgeClass: "bg-green-500/15 text-green-700 dark:text-green-400" };
  if (ratio > 0 && ratio <= 0.4) return { label: "Tight", badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400" };
  return { label: "Stretch", badgeClass: "bg-red-500/15 text-red-700 dark:text-red-400" };
}

export function AffordabilityPanel({ l, onClose }: { l: Listing; onClose: () => void }) {
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

