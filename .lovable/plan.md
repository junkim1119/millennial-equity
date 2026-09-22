# Affordability Check Panel per Listing

Add a "Can I afford this?" button to every listing card that opens a mobile-friendly panel (modal) for a personalized affordability breakdown. All work stays in `src/routes/index.tsx`; no other pages, routes, or the existing listing layout change.

## 1. New data: HOA fees on listings
- Add an optional `hoa?: number` (monthly $) field to the `Listing` type.
- Assign realistic HOA values only where it makes sense: the two condo-style units (Hoboken "Unit 4B" ~$450/mo, Jersey City "Unit 902" ~$520/mo). All single-family homes have no HOA, so the panel simply hides that row for them.

## 2. "Can I afford this?" button on each card
- Add a button at the bottom of `ListingCard` (next to the map links area, full-width on mobile), styled with the existing primary-button look used elsewhere on the page.
- Clicking opens a modal panel, reusing the same modal pattern as the existing remodel estimator (backdrop, close button, `aria-modal`, scrollable on small screens).

## 3. Affordability panel inputs
- Monthly take-home pay (required, number input)
- Monthly student loan payment (optional, number input)
- How many people split the cost (1–4, segmented buttons)
- Down payment amount ($, number input — prefilled with 20% of the listing price)

## 4. Panel calculations (fixed assumptions: 30-year fixed, 7% interest)
- Mortgage: reuse the existing `monthlyPayment()` formula with rate 7, term 30, and the user's down payment.
- Property tax: estimated at 1.1% of price / 12 (state-typical estimate shown with an "est." label).
- Home insurance: flat estimate ~$160/mo (labeled as estimate).
- HOA row only if the listing has one.
- Total monthly cost = mortgage + tax + insurance + HOA.
- If splitting (2–4 people): show "Your share" = total ÷ people.
- Verdict compares **total monthly cost** (share, if splitting) against take-home pay minus student loan:
  - under 30% → **Comfortable** (green)
  - 30–40% → **Tight** (amber)
  - over 40% → **Stretch** (red)
  - Verdict shows as a colored badge with a one-line explanation, e.g. "That's about 34% of your take-home pay after loans."

## 5. Styling & UX
- Dark, minimal design matching the existing cards/modal (same tokens: `bg-card`, `border-border`, `text-primary`, rounded-xl).
- Mobile-friendly: modal is full-width with small margins, inputs stack vertically, verdict badge is prominent.
- Inputs validated (positive numbers, take-home pay required) with a friendly inline message if missing.
- Everything computed live as the user types.

## Verification
- Type-check, then browser-test: open the panel from a condo listing (HOA row visible) and a single-family listing (no HOA row), try each verdict threshold, and check the split-cost math on mobile-width viewport.
