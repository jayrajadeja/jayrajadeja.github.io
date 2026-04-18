@AGENTS.md

## Additional Context for Claude

### Design System

The visual design uses a Material Design 3 dark theme with these key tokens:
- Primary: `#ffb4a8` (warm salmon)
- Tertiary: `#4cd6ff` (cyan accent)
- Surface: `#131313` (near-black background)
- All 30+ semantic color tokens are defined in `src/app/globals.css` under `@theme`

### Tailwind v4

This project uses Tailwind CSS v4, which configures themes in CSS (not `tailwind.config.ts`).
Theme tokens are defined in `src/app/globals.css` using `@theme { --color-*, --font-*, --radius-* }`.
There is no `tailwind.config.ts` file -- do not create one.

### Static Export Constraints

`next.config.ts` sets `output: "export"`. This means:
- No `cookies()`, `headers()`, or server actions
- No ISR or dynamic server-side rendering
- All images must use `unoptimized: true` (external URLs are fine)
- Dynamic routes require `generateStaticParams()`

### Content Architecture

Blog posts are MDX files parsed at build time with `gray-matter`. The rendering uses `remark` + `remark-html` to convert markdown to HTML. Books, papers, and nuggets are plain JSON arrays -- no database, no CMS.

### Testing Changes

Always run `npm run build` after changes to verify static generation succeeds for all routes.
