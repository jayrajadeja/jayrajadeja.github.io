"use client";

import { useEffect, useState } from "react";
import marketsRaw from "@/data/markets.json";
import type { MarketsJson } from "@/lib/types";
import TickerChip from "./TickerChip";

const markets = marketsRaw as MarketsJson;

type Quote = { symbol: string; changePct: number };

const CRYPTO_IDS: Record<string, string> = { bitcoin: "BTC", ethereum: "ETH" };
const CRYPTO_CACHE_KEY = "ticker-crypto-v1";
const CRYPTO_TTL_MS = 90_000;

export default function TickerRail() {
  const bakedCrypto: Quote[] = markets.crypto.map((c) => ({ symbol: c.symbol, changePct: c.changePct }));
  const [crypto, setCrypto] = useState<Quote[]>(bakedCrypto);
  const [cryptoLive, setCryptoLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const apply = (live: Quote[]) => {
      if (cancelled || !live.length) return;
      setCrypto(live);
      setCryptoLive(true);
    };

    // Serve a recent cached result first — avoids re-hitting CoinGecko's
    // keyless (rate-limited) endpoint on every navigation within the tab.
    try {
      const raw = sessionStorage.getItem(CRYPTO_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { t: number; data: Quote[] };
        if (cached && Date.now() - cached.t < CRYPTO_TTL_MS && Array.isArray(cached.data)) {
          apply(cached.data);
          return () => { cancelled = true; };
        }
      }
    } catch { /* ignore a malformed cache entry */ }

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
        if (live.length) {
          apply(live);
          try {
            sessionStorage.setItem(CRYPTO_CACHE_KEY, JSON.stringify({ t: Date.now(), data: live }));
          } catch { /* ignore storage quota / disabled */ }
        }
      })
      .catch(() => { /* keep baked fallback */ });
    return () => { cancelled = true; };
  }, []);

  const stocks: Quote[] = markets.stocks.map((s) => ({ symbol: s.symbol, changePct: s.changePct }));
  const items = [...stocks, ...crypto];
  const stocksReal = markets.source === "build";
  const label = stocksReal
    ? `markets i read · as of ${markets.asOf}`
    : cryptoLive
      ? "markets i read · crypto live · stocks illustrative"
      : "markets i read · illustrative";
  const ariaLabel = stocksReal
    ? `Market ticker, data as of ${markets.asOf}`
    : cryptoLive
      ? "Market ticker, crypto live and stock data illustrative"
      : "Market ticker, illustrative sample data";

  const group = (prefix: string) =>
    items.map((m) => <TickerChip key={`${prefix}-${m.symbol}`} symbol={m.symbol} changePct={m.changePct} />);

  return (
    <div
      className="border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-md"
      aria-label={ariaLabel}
    >
      <div className="flex items-stretch">
        <span className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-outline px-3 border-r border-outline-variant/20">
          <span className={`w-1 h-1 rounded-full ${cryptoLive ? "bg-up" : "bg-outline/60"}`} aria-hidden="true" />
          {label}
        </span>
        <div className="overflow-hidden flex-1">
          <div aria-hidden="true" className="ticker-marquee flex gap-8 py-2 px-4 w-max">
            {group("a")}
            {group("b")}
          </div>
        </div>
      </div>
    </div>
  );
}
