# Verify the "Can I afford this?" panel with 7 acceptance tests

## Goal

Run your 7 tests against the live preview in an automated browser and fix anything that fails. No new features — this is a verify-and-repair pass on the existing affordability panel.

## Tests to run

1. **Panel opens** — Click "Can I afford this?" on a listing card, confirm the input panel appears.
2. **Happy path** — $5,000 take-home, $0 loans, 1 person, $40,000 down on a ~$400,000 listing: confirm a monthly total and a verdict appear.
3. **Splitting** — Switch people from 1 to 2: confirm each person's share is half the total and the verdict text updates (verdict is based on each person's share, so it should improve or stay correct).
4. **Student loan** — Add a $400 monthly loan: confirm the affordability percentage rises and the verdict gets worse (or stays accurate).
5. **Blank take-home** — Leave the pay field empty: confirm the panel shows the friendly "Enter your take-home pay above to see your verdict" message with no crash, no NaN, no red console errors.
6. **Mobile fit** — Repeat the flow at phone width (390px): confirm the panel fits with no horizontal scrolling.
7. **No regressions** — Confirm the rest of the homepage (filters, calculator, reno tools, DIY section, map/street-view buttons) looks and behaves unchanged.

## How

- Automated browser checks (Playwright) at desktop and phone sizes, with screenshots of each step.
- Inspect console errors on every step.
- Any failure gets fixed in `src/routes/index.tsx` (the only file that holds this feature), then re-verified. Possible small fixes if a test exposes them: input validation messaging, verdict logic, or mobile overflow tweaks.

## Technical details

- All changes, if needed, stay in `src/routes/index.tsx`; the button label, verdict thresholds (under 30% Comfortable, 30–40% Tight, over 40% Stretch), and design stay as they are.
- Note: verdict math today uses take-home minus student loan, and the percentage is based on each person's share when splitting — tests 3 and 4 will confirm that matches your expectations.
