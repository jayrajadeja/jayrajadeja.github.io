@AGENTS.md

## Additional Context for Claude

### Design System

Material Design 3 dark theme; all tokens are defined in `src/app/globals.css` under `@theme`. Key tokens:
- Primary `#ffb4a8` (warm salmon — accent/headline)
- Tertiary `#4cd6ff` (cyan — the "data" color)
- Market up `#3ddc84` / down `#ff6b6b`
- Canvas/surface `#0c0e0f` (near-black)

Three font roles: `font-headline` (Space Grotesk, display/UI), `font-body` (Newsreader, serif/editorial), `font-mono` (JetBrains Mono, data/terminal). Full reference: `docs/knowledge/design-system.md`.

### Tailwind v4

Themes are configured in CSS via `@theme` in `src/app/globals.css` — **not** in `tailwind.config.ts`. There is no config file; do not create one.

### Static Export Constraints

`next.config.ts` sets `output: "export"`. This means:
- No `cookies()`, `headers()`, server actions, ISR, or dynamic server rendering
- All images `unoptimized` (external URLs fine)
- Dynamic routes need `generateStaticParams()` and must `await params`
- Metadata routes (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) need `export const dynamic = "force-static"`

### Testing Changes

Always run `npm run build` after changes to verify static generation succeeds for all routes. Use Vitest (`npm test`) for logic in `src/lib/` and `scripts/`.

### Honesty

Follow the honesty & disclosure rules in `AGENTS.md` and `docs/knowledge/profile.md`: real, interview-defensible content only; aggregate employer metrics + a one-line domain (no internal codenames/keys/repo/vendor names; SAFE named only in `experience.json`); no market-data-platform claim; label live/animated data honestly (`illustrative` vs `as of <date>`).
