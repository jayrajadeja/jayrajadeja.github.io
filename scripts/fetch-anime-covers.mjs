// One-shot: resolve each anime.json title to its official cover-image URL via
// the AniList GraphQL API (keyless) and bake the URL into the `cover` field.
// Covers are static, so this isn't part of the daily deploy fetch — run it
// manually when titles change:  `node scripts/fetch-anime-covers.mjs`
// Images are served from AniList's CDN (not committed); the UI falls back to a
// text tile when a title has no cover.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const P = resolve("src/data/anime.json");
const ENDPOINT = "https://graphql.anilist.co";
const QUERY = `query ($search: String, $type: MediaType) {
  Media(search: $search, type: $type) { coverImage { large } title { romaji english } }
}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function coverFor(title, kind) {
  const type = kind === "manga" ? "MANGA" : "ANIME";
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { search: title, type } }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return j?.data?.Media?.coverImage?.large ?? null;
}

// Preserve anime.json's one-object-per-line inline style.
function serialize(list) {
  const fmt = (e) =>
    "  { " +
    Object.entries(e)
      .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
      .join(", ") +
    " }";
  return "[\n" + list.map(fmt).join(",\n") + "\n]\n";
}

async function main() {
  const list = JSON.parse(readFileSync(P, "utf8"));
  for (const e of list) {
    try {
      const url = await coverFor(e.title, e.kind);
      if (url) {
        e.cover = url;
        console.log(`[cover] ${e.title} -> ${url}`);
      } else {
        console.log(`[cover] ${e.title} -> none (left without cover)`);
      }
    } catch (err) {
      console.log(`[cover] ${e.title}: ${err.message}`);
    }
    await sleep(700); // be polite to AniList's rate limit
  }
  writeFileSync(P, serialize(list));
  console.log("[anime covers] done");
}

main().catch((e) => {
  console.error("[anime covers] non-fatal:", e.message);
  process.exit(0);
});
