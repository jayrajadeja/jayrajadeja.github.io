import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  parseFinnhubQuote,
  parseJolpicaLastRace,
  parseJolpicaStandingsLeader,
  parseJolpicaStandings,
  parseJolpicaNextRace,
} from "./parse-feeds.mjs";

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
    const [last, standings, next] = await Promise.all([
      getJson("https://api.jolpi.ca/ergast/f1/current/last/results.json"),
      getJson("https://api.jolpi.ca/ergast/f1/current/driverStandings.json"),
      // The season may be over → no next race. Don't fail the whole fetch for it.
      getJson("https://api.jolpi.ca/ergast/f1/current/next.json").catch(() => null),
    ]);
    const lastRace = parseJolpicaLastRace(last);
    const leader = parseJolpicaStandingsLeader(standings);
    const table = parseJolpicaStandings(standings, 5);
    const nextRace = next ? parseJolpicaNextRace(next) : null;
    if (!lastRace && !leader && table.length === 0) return null;
    return { asOf: new Date().toISOString().slice(0, 10), source: "build", lastRace, leader, standings: table, nextRace };
  } catch (e) { console.log(`[f1] ${e.message}`); return null; }
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const marketsPath = `${DATA}/markets.json`;
  let markets = null;
  try {
    markets = JSON.parse(readFileSync(marketsPath, "utf8"));
  } catch (e) {
    console.log(`[stocks] markets.json unreadable (${e.message}) — skipping stocks update`);
  }
  if (markets) {
    const stocks = await fetchStocks();
    if (stocks) {
      markets.stocks = stocks;
      markets.source = "build";
      markets.asOf = today;
      writeFileSync(marketsPath, JSON.stringify(markets, null, 2) + "\n");
      console.log(`[stocks] wrote ${stocks.length} symbols (asOf ${today})`);
    }
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
