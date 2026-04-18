# Agent Instructions

This is a Next.js 16 portfolio site statically exported for GitHub Pages.

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router, static export)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (theme tokens in `src/app/globals.css` via `@theme`)
- **Fonts**: Space Grotesk (headlines/labels), Newsreader (body) via `next/font/google`
- **Icons**: Material Symbols Outlined (Google Fonts CDN)
- **Content**: MDX blog posts in `content/blog/`, JSON data in `src/data/`

## Project Structure

```
src/
  app/           # App Router pages (layout.tsx, page.tsx, blog/, library/, interests/)
  components/    # Reusable UI components (Navbar, Footer, section components)
  lib/           # Utilities (blog.ts for MDX parsing, types.ts)
  data/          # JSON data files (books.json, papers.json, nuggets.json)
content/
  blog/          # MDX blog posts with frontmatter
```

## Key Conventions

- All pages are Server Components except `Navbar.tsx` (uses `usePathname()`)
- Theme colors use Material Design 3 naming: `primary`, `on-surface`, `surface-container-low`, etc.
- Font classes: `font-headline` (Space Grotesk), `font-body` (Newsreader), `font-label` (Space Grotesk)
- Static export: no API routes, no server actions, no dynamic server functions
- Blog posts use `generateStaticParams()` for pre-rendering all slugs
- Dynamic route params are Promises in Next.js 16 -- always `await params`

## Adding Content

- **Blog post**: Add a `.mdx` file to `content/blog/` with frontmatter (title, date, tags, excerpt)
- **Book**: Append to `src/data/books.json`
- **Research paper**: Append to `src/data/papers.json`
- **Velocity nugget**: Append to `src/data/nuggets.json`

## Build & Deploy

```bash
npm run build    # Generates static export to `out/`
npm run dev      # Local development server
npm run lint     # ESLint check
```
