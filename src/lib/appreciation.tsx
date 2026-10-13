import { useEffect, useState } from "react";

type ApprData = {
  zip: Record<string, [number, number]>;
  county: Record<string, [number, number, string, string]>;
  zipCounty: Record<string, string>;
};
type HistData = { years: number[]; zip: Record<string, (number | null)[]>; county: Record<string, (number | null)[]> };

export type Appreciation = { cagr: number; total: number; label: string; level: "zip" | "county" };
export type Status = "loading" | "ready" | "error";

let apprPromise: Promise<ApprData> | null = null;
let apprCache: ApprData | null = null;
let histPromise: Promise<HistData> | null = null;
let histCache: HistData | null = null;

function loadJson<T>(url: string): Promise<T> {
  return fetch(url).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<T>;
  });
}

/** Lookup rule: zip-level, else county via zipCounty, else null. */
export function lookupAppreciation(d: ApprData, z: string): Appreciation | null {
  const zr = d.zip[z];
  if (zr) return { cagr: zr[0], total: zr[1], label: "zip-level", level: "zip" };
  const fips = d.zipCounty[z];
  const c = fips ? d.county[fips] : undefined;
  if (c) return { cagr: c[0], total: c[1], label: `${c[2].replace(/ County$/i, "")} County`, level: "county" };
  return null;
}

/** Shared hook: fetches /data/appreciation.json once and caches it in memory. */
export function useAppreciation() {
  const [data, setData] = useState<ApprData | null>(apprCache);
  const [status, setStatus] = useState<Status>(apprCache ? "ready" : "loading");
  useEffect(() => {
    if (apprCache) return;
    apprPromise ??= loadJson<ApprData>("/data/appreciation.json").then((d) => (apprCache = d));
    let alive = true;
    apprPromise.then(
      (d) => { if (alive) { setData(d); setStatus("ready"); } },
      () => { apprPromise = null; if (alive) setStatus("error"); },
    );
    return () => { alive = false; };
  }, []);
  return { status, lookup: (z: string) => (data ? lookupAppreciation(data, z) : null) };
}

/** Detail-page only: index history for a zip with county fallback. */
export function useHistory(z: string) {
  const [data, setData] = useState<HistData | null>(histCache);
  const [status, setStatus] = useState<Status>(histCache ? "ready" : "loading");
  const { status: aStatus } = useAppreciation();
  useEffect(() => {
    if (histCache) return;
    histPromise ??= loadJson<HistData>("/data/history.json").then((d) => (histCache = d));
    let alive = true;
    histPromise.then(
      (d) => { if (alive) { setData(d); setStatus("ready"); } },
      () => { histPromise = null; if (alive) setStatus("error"); },
    );
    return () => { alive = false; };
  }, []);
  let series: { year: number; value: number | null }[] | null = null;
  if (data) {
    const fips = apprCache?.zipCounty[z];
    const arr = data.zip[z] ?? (fips ? data.county[fips] : undefined);
    if (arr) series = data.years.map((year, i) => ({ year, value: arr[i] }));
  }
  const s: Status = status === "error" ? "error" : status === "ready" && aStatus !== "loading" ? "ready" : "loading";
  return { status: s, series };
}

export const SOURCE_NOTE = "Source: FHFA House Price Index (2015–2025)";

export function Skeleton({ className = "h-4 w-32" }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulse rounded bg-muted ${className}`} />;
}

export function AppreciationBadge({ zip }: { zip: string }) {
  const { status, lookup } = useAppreciation();
  if (status === "loading") return <Skeleton className="mt-2 h-5 w-40" />;
  if (status === "error") return null;
  const a = lookup(zip);
  if (!a) return <p className="mt-2 text-xs text-muted-foreground">Appreciation data unavailable</p>;
  return (
    <div className="mt-2">
      <span className="inline-block rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
        📈 {a.cagr.toFixed(2)}%/yr · 10-yr avg
      </span>
      <p className="mt-0.5 text-xs text-muted-foreground">({a.level === "zip" ? "zip" : a.label})</p>
      <p className="text-[10px] text-muted-foreground">{SOURCE_NOTE}</p>
    </div>
  );
}

export function AppreciationBanner({ zip }: { zip: string }) {
  const { status, lookup } = useAppreciation();
  if (zip.length !== 5) return null;
  if (status === "loading") return <Skeleton className="mt-4 h-14 w-full" />;
  if (status === "error") return null;
  const a = lookup(zip);
  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground">
        {a
          ? <>Homes in {zip} appreciated an average of <strong>{a.cagr.toFixed(2)}%/yr</strong> from 2015–2025 (+{a.total.toFixed(1)}% total){a.level === "county" ? ` — ${a.label} data` : ""}.</>
          : "Appreciation data unavailable."}
      </p>
      {a && <p className="mt-1 text-xs text-muted-foreground">{SOURCE_NOTE}</p>}
    </div>
  );
}
