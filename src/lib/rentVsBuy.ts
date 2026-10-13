import { houseHack, monthlyPayment, type Listing, type MortgageSettings } from "./listings";

export type RentVsBuyInputs = {
  rent: number; // current monthly rent
  rentIncrease: number; // % per year
  years: number; // 1-10
  appreciation: number; // % per year
};

export type YearPoint = { year: number; rent: number; buy: number; hack: number };

/** Remaining loan balance after `months` payments. */
export function balanceAfter(principal: number, ratePct: number, termYears: number, months: number) {
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  const m = Math.min(months, n);
  if (principal <= 0) return 0;
  if (r === 0) return principal * (1 - m / n);
  const pay = (principal * r) / (1 - Math.pow(1 + r, -n));
  return principal * Math.pow(1 + r, m) - (pay * (Math.pow(1 + r, m) - 1)) / r;
}

export function rentVsBuy(l: Listing, s: MortgageSettings, inp: RentVsBuyInputs) {
  const h = houseHack(l, s);
  const ownMonthly = h.cost.total;
  const hackMonthly = h.net;
  const down = l.price * (s.downPct / 100);
  const loan = l.price - down;
  const g = inp.rentIncrease / 100;

  const series: YearPoint[] = [{ year: 0, rent: 0, buy: down, hack: down }];
  let rentTotal = 0;
  let buyTotal = down;
  let hackTotal = down;
  for (let y = 1; y <= inp.years; y++) {
    const growth = Math.pow(1 + g, y - 1);
    rentTotal += inp.rent * growth * 12;
    buyTotal += ownMonthly * 12;
    // Rent collected from tenants grows at the same rate as market rent
    hackTotal += Math.max(ownMonthly - h.rent * growth, 0) * 12;
    series.push({ year: y, rent: Math.round(rentTotal), buy: Math.round(buyTotal), hack: Math.round(hackTotal) });
  }

  const principalPaid = loan - balanceAfter(loan, s.rate, s.termYears, inp.years * 12);
  const appreciationGain = l.price * (Math.pow(1 + inp.appreciation / 100, inp.years) - 1);
  const equity = down + principalPaid + appreciationGain;

  // Net position: what renting costs vs. what owning costs after subtracting the equity you keep
  const buyAhead = rentTotal - (buyTotal - equity);
  const hackAhead = rentTotal - (hackTotal - equity);

  return {
    ownMonthly, hackMonthly, rentMonthly: inp.rent, rentIncome: h.rent, spaces: h.spaces,
    rentTotal, buyTotal, hackTotal, principalPaid, appreciationGain, equity, buyAhead, hackAhead, series,
    pi: monthlyPayment(l.price, s),
  };
}
