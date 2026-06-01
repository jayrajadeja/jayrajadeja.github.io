# Data Pipeline

Hybrid strategy: some data is fetched at build time (stocks, F1), some is fetched live on the client (crypto), and all sources have graceful fallback to committed baseline JSON. The build must never fail due to a data fetch error.

---

## Overview

```
GitHub Actions (daily 06:00 UTC + every push to master)
  └── node scripts/fetch-data.mjs   [continue-on-error: true]
        ├── Finnhub API  ──────────────────► markets.json (stocks section)
        └── Jolpica API  ──────────────────► f1.json

Client-side (browser, runtime)
  └── CoinGecko API ─────────────────────► TickerRail crypto state (in-memory)
        └── fallback: markets.json (crypto section, baked at last build)
```

---

## Data Sources

### Stocks — Finnhub (build-time)
- **API**: `https://finnhub.io/api/v1/quote?symbol={SYMBOL}&token={KEY}`
- **Symbols**: `NVDA`, `AAPL`, `TSLA`, `MSFT` (hardcoded in `fetch-data.mjs`)
- **Key**: `STOCK_API_KEY` environment variable — a free Finnhub API key injected as a GitHub Actions secret.
- **Output**: Updates `markets.json` → `stocks[]`, sets `source: "build"`, sets `asOf: YYYY-MM-DD`.
- **Fallback**: If key is absent or any fetch fails, the existing committed `markets.json` snapshot is kept. Per-symbol failures are non-fatal (logged, skipped).

### Crypto — CoinGecko (client-side, keyless)
- **API**: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`
- **Symbols**: `BTC`, `ETH` (mapped from `bitcoin`, `ethereum`).
- **Timing**: Fetched on component mount in `TickerRail` via `useEffect`. Result is never persisted to disk.
- **Fallback**: On any error (network, non-OK status), `TickerRail` keeps the baked `markets.json` crypto values in state.

### F1 — Jolpica (build-time, keyless)
- **API**: Two concurrent fetches via `Promise.all`:
  - Last race: `https://api.jolpi.ca/ergast/f1/current/last/results.json`
  - Standings leader: `https://api.jolpi.ca/ergast/f1/current/driverStandings.json`
- **Output**: Writes `f1.json` if both responses are parseable.
- **Fallback**: On any error, the committed `f1.json` snapshot is kept.

---

## Parsers (`scripts/parse-feeds.mjs`)

Three pure functions — no side effects, importable by tests without triggering fetches:

**`parseFinnhubQuote(symbol, q)`**
Validates `q.c` (close price) and `q.dp` (day-change %) are finite numbers. Returns `{ symbol, price, changePct }` or `null`.

**`parseJolpicaLastRace(json)`**
Extracts `round`, `season`, `raceName`, `date`, and winner full name from the Ergast/Jolpica `RaceTable.Races[0]` structure. Returns the object or `null` if the race node is missing.

**`parseJolpicaStandingsLeader(json)`**
Extracts the top `DriverStandings[0]` entry: driver full name, points, wins, and last constructor name. Returns the object or `null`.

---

## GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Triggers**:
- `push` to `master`
- Daily schedule: `cron: "0 6 * * *"` (06:00 UTC)
- Manual: `workflow_dispatch`

**Key step**:
```yaml
- name: Fetch live data
  run: node scripts/fetch-data.mjs
  continue-on-error: true
  env:
    STOCK_API_KEY: ${{ secrets.STOCK_API_KEY }}
```

`continue-on-error: true` is the critical safety valve: if the fetch script crashes (bad key, API outage, rate limit), the build step still runs and deploys using the last committed JSON snapshots. The site never goes down due to a data error.

---

## Output File Shapes

### `src/data/markets.json`

```json
{
  "asOf": "YYYY-MM-DD",
  "source": "seed | build",
  "stocks": [
    { "symbol": "NVDA", "price": 123.45, "changePct": 2.41 }
  ],
  "crypto": [
    { "symbol": "BTC", "price": 0, "changePct": 3.1 }
  ]
}
```

- `source: "build"` → data was fetched from Finnhub this build cycle.
- `source: "seed"` → committed baseline; Finnhub key was absent or fetch failed.
- `price` on crypto is always `0` in the baked file (only `changePct` is displayed in the ticker).
- `asOf` is the build date, not a market timestamp.

### `src/data/f1.json`

```json
{
  "asOf": "YYYY-MM-DD",
  "source": "build",
  "lastRace": {
    "round": 5,
    "season": "2026",
    "name": "Canadian Grand Prix",
    "date": "2026-05-24",
    "winner": "Andrea Kimi Antonelli"
  },
  "leader": {
    "driver": "Andrea Kimi Antonelli",
    "points": 131,
    "wins": 4,
    "constructor": "Mercedes"
  }
}
```

`lastRace` and `leader` can each be `null` if the API returned no data. Components must guard for null before rendering.

---

## TickerRail — Honest Label Logic

The label shown in the ticker rail communicates data provenance:

```
"markets · as of YYYY-MM-DD"  ← if cryptoLive (CoinGecko fetch succeeded)
                                  OR stocksReal (markets.source === "build")
"markets · illustrative"       ← all data is seed/fallback only
```

The live-status dot: `bg-up` (green) when `cryptoLive === true`; `bg-outline/60` (grey) otherwise.

This ensures the UI never silently misrepresents staleness.

---

## Graceful Degradation Contract

1. `fetch-data.mjs` exits with code `0` in all cases (failure caught, logged, `process.exit(0)`).
2. `continue-on-error: true` in the Action means even an uncaught crash doesn't fail the build.
3. Per-symbol stock failures are individually caught — a single bad symbol does not abort the rest.
4. CoinGecko failure in the browser is silently swallowed; the baked fallback remains in state.
5. F1 fetch failure keeps the committed `f1.json` untouched.
6. **Invariant: a data API outage can never break the deployment.**

---

## User Setup: Add the Finnhub Key

Stocks are illustrative (`source: "seed"`) without a real key. To enable live stock data:

1. Sign up at [finnhub.io](https://finnhub.io) — the free tier covers this use case.
2. Copy your API key.
3. In the GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `STOCK_API_KEY`
   - Value: your Finnhub API key.
4. Trigger a deploy (push or `workflow_dispatch`). The next build will fetch live quotes and write `source: "build"` to `markets.json`.
