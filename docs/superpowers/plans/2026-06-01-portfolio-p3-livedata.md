# Portfolio Elevation — P3 Live Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Replace the seed/"illustrative" market data with a real hybrid pipeline: **live crypto** fetched client-side (keyless, with graceful fallback), **real stocks** fetched at build by a scheduled GitHub Action (free API, key in a repo secret), and **F1 latest** (Jolpica, keyless) — all degrading gracefully to the committed snapshot so the build never breaks and nothing is ever misrepresented.

**Architecture:**
- **Build time** (deploy workflow): `node scripts/fetch-data.mjs` runs before `next build` — fetches stocks (if `STOCK_API_KEY` secret present) + F1 (keyless), overwriting `src/data/markets.json` (stocks) and `src/data/f1.json` ephemerally in CI, stamped `source:"build"` + `asOf`. `continue-on-error` so a failed/absent fetch just keeps the committed snapshot.
- **Runtime** (browser): `TickerRail` becomes a client component that renders baked values immediately (no hydration mismatch), then fetches **live crypto** (CoinGecko, keyless) and updates; on any error it keeps the baked values. The rail label is **data-driven and honest** (`illustrative` for seed, `as of <date>` for built, a live dot when crypto is live).
- **Static-export safe:** the client fetch is browser-only; the Action runs before build; no server runtime.

**Tech:** Node 20 ESM script (global `fetch`), Vitest for pure parsers, a client island, GitHub Actions. Stock API default: **Finnhub** free tier (`/quote` → `dp` percent change), swappable. Crypto: **CoinGecko** `simple/price` (keyless, CORS). F1: **Jolpica** (`api.jolpi.ca`, Ergast-compatible, keyless).

**Branch:** `feat/portfolio-elevation` (PR #3 open). Commit identity: personal gmail.

**Testing:** pure parsers (stock + F1 JSON → normalized shapes) get Vitest TDD; network IO + the client fetch are verified by running the script locally (F1 works keyless; stocks gracefully skip without a key) + a green build + the running dev server. The live behaviors are confirmed at runtime/CI.

**⚠️ User action required for live STOCKS:** add a `STOCK_API_KEY` repo secret (free Finnhub key). Until then, stocks gracefully stay on the committed snapshot (crypto + F1 are keyless and work without it).

---

## File Structure
- **Create** `scripts/parse-feeds.mjs` — pure parsers (no IO): `parseFinnhubQuote`, `parseJolpicaLastRace`, `parseJolpicaStandingsLeader`.
- **Create** `scripts/parse-feeds.test.mjs` — Vitest tests for the parsers.
- **Create** `scripts/fetch-data.mjs` — IO orchestration: fetch + write `markets.json`/`f1.json`; non-fatal.
- **Modify** `vitest.config.ts` — add `scripts/**/*.test.mjs` to `include`.
- **Create** `src/data/f1.json` — committed seed/fallback.
- **Modify** `src/lib/types.ts` — add `F1Data`.
- **Modify** `.github/workflows/deploy.yml` — schedule cron + fetch step.
- **Rewrite** `src/components/instruments/TickerRail.tsx` — client component, live crypto + honest label.
- **Modify** `src/app/interests/page.tsx` — small "F1 latest" accent from `f1.json`.

---

## Task 1: Feed parsers (TDD) + fetch script + seed f1.json

**Files:** create `scripts/parse-feeds.mjs`, `scripts/parse-feeds.test.mjs`, `scripts/fetch-data.mjs`, `src/data/f1.json`; modify `vitest.config.ts`.

- [ ] **Step 1: Write failing parser tests** `scripts/parse-feeds.test.mjs`:
```js
import { describe, it, expect } from "vitest";
import { parseFinnhubQuote, parseJolpicaLastRace, parseJolpicaStandingsLeader } from "./parse-feeds.mjs";

describe("parseFinnhubQuote", () => {
  it("normalizes a quote", () => {
    expect(parseFinnhubQuote("NVDA", { c: 123.456, dp: 2.413 })).toEqual({ symbol: "NVDA", price: 123.46, changePct: 2.41 });
  });
  it("returns null on malformed input", () => {
    expect(parseFinnhubQuote("NVDA", {})).toBeNull();
    expect(parseFinnhubQuote("NVDA", null)).toBeNull();
  });
});

describe("parseJolpicaLastRace", () => {
  it("extracts race + winner", () => {
    const json = { MRData: { RaceTable: { Races: [{ round: "10", season: "2026", raceName: "British GP", date: "2026-07-05", Results: [{ Driver: { givenName: "Max", familyName: "Verstappen" } }] }] } } };
    expect(parseJolpicaLastRace(json)).toEqual({ round: 10, season: "2026", name: "British GP", date: "2026-07-05", winner: "Max Verstappen" });
  });
  it("returns null when no races", () => {
    expect(parseJolpicaLastRace({ MRData: { RaceTable: { Races: [] } } })).toBeNull();
  });
});

describe("parseJolpicaStandingsLeader", () => {
  it("extracts the championship leader", () => {
    const json = { MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [{ points: "210", wins: "5", Driver: { givenName: "Lando", familyName: "Norris" }, Constructors: [{ name: "McLaren" }] }] }] } } };
    expect(parseJolpicaStandingsLeader(json)).toEqual({ driver: "Lando Norris", points: 210, wins: 5, constructor: "McLaren" });
  });
  it("returns null when empty", () => {
    expect(parseJolpicaStandingsLeader({ MRData: { StandingsTable: { StandingsLists: [] } } })).toBeNull();
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm test` → FAIL (module missing). (Also do Step 3's `vitest.config.ts` change so the new test file is picked up.)

- [ ] **Step 3: Add `scripts/**/*.test.mjs` to `vitest.config.ts` include:**
```ts
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
  },
```

- [ ] **Step 4: Implement `scripts/parse-feeds.mjs`:**
```js
export function parseFinnhubQuote(symbol, q) {
  if (!q || typeof q.c !== "number" || typeof q.dp !== "number") return null;
  return { symbol, price: Number(q.c.toFixed(2)), changePct: Number(q.dp.toFixed(2)) };
}

export function parseJolpicaLastRace(json) {
  const race = json?.MRData?.RaceTable?.Races?.[0];
  if (!race) return null;
  const w = race.Results?.[0]?.Driver;
  return {
    round: Number(race.round),
    season: race.season,
    name: race.raceName,
    date: race.date,
    winner: w ? `${w.givenName} ${w.familyName}` : null,
  };
}

export function parseJolpicaStandingsLeader(json) {
  const s = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];
  if (!s) return null;
  const cons = s.Constructors?.[s.Constructors.length - 1]?.name ?? null;
  return { driver: `${s.Driver.givenName} ${s.Driver.familyName}`, points: Number(s.points), wins: Number(s.wins), constructor: cons };
}
```

- [ ] **Step 5: Run, verify pass** — `npm test` → all parser tests + existing tests pass.

- [ ] **Step 6: Implement `scripts/fetch-data.mjs`** (IO; guarded so importing doesn't run it):
```js
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parseFinnhubQuote, parseJolpicaLastRace, parseJolpicaStandingsLeader } from "./parse-feeds.mjs";

const DATA = resolve("src/data");
const STOCK_SYMBOLS = ["NVDA", "AAPL", "TSLA", "MSFT"];

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "jayrajadeja.github.io build" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fetchStocks() {
  const key = process.env.STOCK_API_KEY;
  if (!key) { console.log("[stocks] no STOCK_API_KEY — keeping committed snapshot"); return null; }
  const out = [];
  for (const symbol of STOCK_SYMBOLS) {
    try {
      const q = await getJson(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
      const p = parseFinnhubQuote(symbol, q);
      if (p) out.push({ symbol: p.symbol, price: p.price, changePct: p.changePct });
    } catch (e) { console.log(`[stocks] ${symbol}: ${e.message}`); }
  }
  return out.length ? out : null;
}

async function fetchF1() {
  try {
    const [last, standings] = await Promise.all([
      getJson("https://api.jolpi.ca/ergast/f1/current/last/results.json"),
      getJson("https://api.jolpi.ca/ergast/f1/current/driverStandings.json"),
    ]);
    const lastRace = parseJolpicaLastRace(last);
    const leader = parseJolpicaStandingsLeader(standings);
    if (!lastRace && !leader) return null;
    return { asOf: new Date().toISOString().slice(0, 10), source: "build", lastRace, leader };
  } catch (e) { console.log(`[f1] ${e.message}`); return null; }
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const marketsPath = `${DATA}/markets.json`;
  const markets = JSON.parse(readFileSync(marketsPath, "utf8"));
  const stocks = await fetchStocks();
  if (stocks) {
    markets.stocks = stocks;
    markets.source = "build";
    markets.asOf = today;
    writeFileSync(marketsPath, JSON.stringify(markets, null, 2) + "\n");
    console.log(`[stocks] wrote ${stocks.length} symbols (asOf ${today})`);
  }
  const f1 = await fetchF1();
  if (f1) {
    writeFileSync(`${DATA}/f1.json`, JSON.stringify(f1, null, 2) + "\n");
    console.log(`[f1] wrote latest (asOf ${f1.asOf})`);
  }
  console.log("[fetch-data] done");
}

// Only run when invoked directly (so tests can import siblings without side effects)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error("[fetch-data] non-fatal failure:", e.message); process.exit(0); });
}
```

- [ ] **Step 7: Seed `src/data/f1.json`** (committed fallback; replaced at build):
```json
{
  "asOf": "2026-06-01",
  "source": "seed",
  "lastRace": null,
  "leader": null
}
```

- [ ] **Step 8: Run the script locally to verify graceful behavior + real F1:**
Run: `node scripts/fetch-data.mjs`
Expected: `[stocks] no STOCK_API_KEY — keeping committed snapshot` (no key locally), `[f1] wrote latest (asOf …)` (Jolpica is keyless — `src/data/f1.json` now has real lastRace/leader), `[fetch-data] done`. **Then `git checkout src/data/f1.json` is NOT needed** — committing the real F1 snapshot as the new fallback is fine and better than the null seed. (If Jolpica is unreachable, f1.json stays the null seed — also fine.)

- [ ] **Step 9: Verify build still green** — `npm run build` (note: dev server may hold `.next`; stop it first with the controller's background-task stop if needed, or run `next build` after). Then commit:
```bash
git add scripts/ vitest.config.ts src/data/f1.json
git commit -m "feat: add live-data fetch script + F1/stock parsers (TDD)"
```

---

## Task 2: Extend the deploy workflow

**File:** modify `.github/workflows/deploy.yml`.

- [ ] **Step 1:** Add a daily schedule to the existing `on:` block (keep `push` + `workflow_dispatch`):
```yaml
on:
  push:
    branches: [master]
  schedule:
    - cron: "0 6 * * *"
  workflow_dispatch:
```

- [ ] **Step 2:** In the `build` job, add a step AFTER "Install dependencies" and BEFORE "Build":
```yaml
      - name: Fetch live data
        run: node scripts/fetch-data.mjs
        continue-on-error: true
        env:
          STOCK_API_KEY: ${{ secrets.STOCK_API_KEY }}
```

- [ ] **Step 3:** Validate YAML (e.g. `npx --yes js-yaml .github/workflows/deploy.yml >/dev/null && echo "yaml ok"`), commit:
```bash
git add .github/workflows/deploy.yml
git commit -m "ci: fetch live market + F1 data before build (daily cron, non-fatal)"
```

---

## Task 3: Live-crypto ticker rail + honest label

**File:** rewrite `src/components/instruments/TickerRail.tsx` as a client component.

- [ ] **Step 1:** Replace with:
```tsx
"use client";

import { useEffect, useState } from "react";
import markets from "@/data/markets.json";
import TickerChip from "./TickerChip";

type Quote = { symbol: string; changePct: number };

const CRYPTO_IDS: Record<string, string> = { bitcoin: "BTC", ethereum: "ETH" };

export default function TickerRail() {
  const bakedCrypto: Quote[] = markets.crypto.map((c) => ({ symbol: c.symbol, changePct: c.changePct }));
  const [crypto, setCrypto] = useState<Quote[]>(bakedCrypto);
  const [cryptoLive, setCryptoLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (cancelled) return;
        const live = Object.entries(CRYPTO_IDS)
          .map(([id, symbol]) => {
            const ch = j?.[id]?.usd_24h_change;
            return typeof ch === "number" ? { symbol, changePct: Number(ch.toFixed(2)) } : null;
          })
          .filter((x): x is Quote => x !== null);
        if (live.length) { setCrypto(live); setCryptoLive(true); }
      })
      .catch(() => { /* keep baked fallback */ });
    return () => { cancelled = true; };
  }, []);

  const stocks: Quote[] = markets.stocks.map((s) => ({ symbol: s.symbol, changePct: s.changePct }));
  const items = [...stocks, ...crypto];
  const stocksReal = markets.source === "build";
  const label = cryptoLive || stocksReal ? `markets · as of ${markets.asOf}` : "markets · illustrative";

  const group = (prefix: string) =>
    items.map((m) => <TickerChip key={`${prefix}-${m.symbol}`} symbol={m.symbol} changePct={m.changePct} />);

  return (
    <div
      className="border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-md"
      aria-label={cryptoLive ? "Market ticker — crypto live, stocks/F1 as of last build" : "Market ticker — sample data"}
    >
      <div className="flex items-stretch">
        <span className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-outline/80 px-3 border-r border-outline-variant/20">
          <span className={`w-1 h-1 rounded-full ${cryptoLive ? "bg-up" : "bg-outline/60"}`} aria-hidden="true" />
          {label}
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-marquee flex gap-8 py-2 px-4 w-max">
            {group("a")}
            {group("b")}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Verify: `npm run lint && npm run build`. Initial server-render shows baked values (label "illustrative" while seed); after mount the browser fetches live crypto → green dot + "as of …". Commit:
```bash
git add src/components/instruments/TickerRail.tsx
git commit -m "feat: live crypto in ticker rail with baked fallback + honest data-driven label"
```

---

## Task 4: F1 "latest" accent on /interests

**Files:** modify `src/lib/types.ts` (add `F1Data`); modify `src/app/interests/page.tsx`.

- [ ] **Step 1:** Add to `src/lib/types.ts`:
```ts
export interface F1Data {
  asOf: string;
  source: string;
  lastRace: { round: number; season: string; name: string; date: string; winner: string | null } | null;
  leader: { driver: string; points: number; wins: number; constructor: string | null } | null;
}
```

- [ ] **Step 2:** In `src/app/interests/page.tsx`, import `f1Data from "@/data/f1.json"` (typed as `F1Data`). In the Formula 1 section, below the favorites, add a small mono "latest" block that renders ONLY when real data exists:
  - If `f1.leader`: `CHAMPIONSHIP LEADER — {leader.driver} · {leader.points} pts` (+ constructor).
  - If `f1.lastRace?.winner`: `LAST RACE — {lastRace.name}: {lastRace.winner}`.
  - A mono caption `· as of {f1.asOf}`.
  - If both `leader` and `lastRace` are null (seed state), render nothing (or a tiny "live standings after next deploy" muted note). Do NOT show empty/placeholder rows.
  Keep it visually consistent with the page (mono labels, `text-tertiary`/`text-on-surface-variant`, no stock images). The favorites (Mercedes / Hamilton+Verstappen) remain unchanged above it.

- [ ] **Step 3:** Verify `npm run lint && npm run build` (the committed `f1.json` from Task 1 likely now has real data, so the block renders). Commit:
```bash
git add src/lib/types.ts src/app/interests/page.tsx
git commit -m "feat: live F1 latest accent on /interests (Jolpica)"
```

---

## Task 5: P3 verification + final review

- [ ] **Step 1:** `npm run lint` clean.
- [ ] **Step 2:** `npm test` — parser tests + existing pass.
- [ ] **Step 3:** `node scripts/fetch-data.mjs` → graceful stock skip (no local key), real F1 written; `npm run build` green.
- [ ] **Step 4:** Honesty check: rail label is data-driven (no hard-coded "live" claim on seed data); `markets.json` `source` reflects reality; no fabricated numbers introduced.
- [ ] **Step 5:** Final review (subagent): static-export safety (client island only where needed), graceful degradation (no secret / API down → baked snapshot, build still green), no fabrication, code quality.
- [ ] **Step 6:** Commit any review fixes. **Surface to the user:** they must add the `STOCK_API_KEY` repo secret for live stocks; crypto + F1 already work keyless.

**P3 complete when:** crypto is live client-side with graceful fallback, the stock/F1 build pipeline + scheduled Action are in place and non-fatal, the ticker label is honest and data-driven, and lint/test/build are green.

---

## Self-Review (against spec §9)
- Build-time stocks (Action + secret) + F1 (keyless): ✅ Tasks 1–2.
- Runtime live crypto + fallback: ✅ Task 3.
- "as of"/honest labels; no fabrication; never-break build (continue-on-error + snapshot fallback): ✅ Tasks 2–3.
- F1 surfaced on /interests: ✅ Task 4.
- Deferred to P4: section-rule normalization, OG/sitemap/robots, mobile nav, Eyebrow extraction, a11y polish, `now.json.updated` freshness.
