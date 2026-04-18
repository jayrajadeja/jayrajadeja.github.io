# jayrajadeja.github.io

Personal portfolio site for Jayraj Jadeja — Software Engineer.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [Tailwind CSS v4](https://tailwindcss.com/)
- MDX for blog content
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
| `src/app/` | App Router pages — Home, Blog, Library, Interests |
| `src/components/` | Reusable UI components |
| `src/lib/` | Utilities and type definitions |
| `src/data/` | JSON data for books, papers, and nuggets |
| `content/blog/` | MDX blog posts with frontmatter |

## Adding Content

**New blog post** — create `content/blog/your-slug.mdx`:

```yaml
---
title: "Your Post Title"
date: "2024-11-01"
tags: ["TAG1", "TAG2"]
excerpt: "A brief summary of the post."
---
```

**New book** — append to `src/data/books.json`

**New research paper** — append to `src/data/papers.json`

## License

All rights reserved.
