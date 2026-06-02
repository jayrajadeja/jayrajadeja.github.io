# jayrajadeja.github.io

Personal portfolio site for Jayraj Jadeja — Software Engineer.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [Tailwind CSS v4](https://tailwindcss.com/)
- MDX for long-form writing
- Deployed on GitHub Pages

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Build

```bash
npm run build
```

Generates a fully static site in the `out/` directory, ready for GitHub Pages.

## Project Structure

| Path | Description |
|------|-------------|
| `src/app/` | App Router pages — home, work, writing, interests, about, now, uses |
| `src/components/` | Reusable UI components (Navbar, Footer, instruments) |
| `src/lib/` | Utilities (`blog.ts` MDX parsing, `site.ts` constants) and type definitions |
| `src/data/` | JSON data — work, stats, books, papers, anime, systems, fieldnotes, now, uses, interests, markets, f1 |
| `content/writing/` | MDX posts with frontmatter |

## Adding Content

**New writing post** — create `content/writing/your-slug.mdx`:

```yaml
---
title: "Your Post Title"
date: "2026-01-01"
tags: ["TAG1", "TAG2"]
excerpt: "A brief summary of the post."
---
```

**New book** — append to `src/data/books.json`

**New research paper** — append to `src/data/papers.json`

## License

All rights reserved.
