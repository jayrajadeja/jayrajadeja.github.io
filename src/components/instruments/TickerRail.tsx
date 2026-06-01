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
