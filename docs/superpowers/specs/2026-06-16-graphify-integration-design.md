# Graphify Integration — Design

**Date:** 2026-06-16
**Status:** Approved (design)
**Branch:** `chore/graphify` (off `master`; independent of the open terminal-hero PR #14)

## Context

[Graphify](https://github.com/safishamsi/graphify) (MIT) is an AI-coding-assistant "skill" that parses a project locally (tree-sitter, 33 languages, **zero API calls for code**) into a queryable knowledge graph, so an assistant can run `graphify query "<question>"` instead of grepping raw files. We're adding it to this repo as **developer tooling** (not a portfolio feature).

This is a **tooling/config task, not application code** — no app source changes, no tests in the TDD sense. The implementation plan is an ordered *verify → install → generate → wire → verify* checklist.

## Decisions (locked)

- **Commit everything, incl. the generated graph.**
- **Code-only, fully local indexing** — no AI backend, no API key, nothing leaves the machine. (Code is the bulk of this ~30-file repo; we have no PDFs/office/video, so no `[extras]`.)
- **Full auto-use:** project-scoped skill + a `PreToolUse` query-nudge hook + rebuild-on-commit.
- **Hybrid install approach:** use Graphify's own installers to produce canonical skill/hook *content*, but apply edits to curated files (`CLAUDE.md`, `.claude/settings.json`) **by hand** so the installer can't clobber them.

## Prerequisites (verified present)

- `uv 0.11.14`, Python 3.14 — available.
- **Verify-before-trusting:** the exact PyPI package name (docs say `graphifyy`, double-y; CLI `graphify`) and all flags must be confirmed against live `graphify --help` / the README at implementation time. Do not assume the summarized commands are exact.

## Implementation outline

1. **Verify** package name + the code-only / no-backend invocation against `graphify --help` and the README.
2. **Install CLI:** `uv tool install graphifyy` (base only, no extras).
3. **Generate graph (code-only, local):** run `graphify .` with no AI backend configured ⇒ tree-sitter only. Produces `graphify-out/`.
4. **Project skill:** `graphify install --project` → `.claude/skills/graphify/SKILL.md`.
5. **PreToolUse nudge hook:** merge Graphify's canonical hook into the existing `.claude/settings.json`, **preserving** the current `enabledPlugins.frontend-design` and adding `hooks.PreToolUse`. The hook fires only when `graphify-out/graph.json` exists, suggesting `graphify query` before `grep/rg/find/fd/ack/ag`. (Reference hook shape: the Safe-workspace setup doc — adapted, not copied verbatim.)
6. **CLAUDE.md:** append a short "Graphify" section after the existing curated content (do not disturb the `@AGENTS.md` import). Explains the graph + the one-time clone step in #7.
7. **Rebuild-on-commit:** `graphify hook install` writes `.git/hooks/post-commit` — **machine-local, not committable**. Document the one-time `graphify hook install` in the CLAUDE.md Graphify section for anyone cloning (we do not fake-commit a git hook or set `core.hooksPath` — YAGNI for a solo repo).
8. **`.gitignore`:** add `graphify-out/cost.json` (local-only) and `graphify-out/cache/` (regenerable/churny).

## Files committed (net)

| File | Change |
|---|---|
| `.claude/skills/graphify/SKILL.md` | new (from `graphify install --project`) |
| `.claude/settings.json` | modified — add `hooks.PreToolUse`, keep `enabledPlugins` |
| `CLAUDE.md` | modified — append short Graphify section |
| `.gitignore` | modified — +`graphify-out/cost.json`, +`graphify-out/cache/` |
| `graphify-out/graph.json`, `GRAPH_REPORT.md`, `graph.html`, `manifest.json` | new |

**Not** touched: `package.json` (Graphify is a uv-installed CLI, not an npm dep); any `src/` app code.

## Caveats (acknowledged)

- Exact CLI flags/package name verified at run time, not assumed.
- `graph.html` (interactive viz) may be a chunky file in a public repo — accepted under "commit everything."
- Value is modest on a small repo; the win is the indexed graph + the query-over-grep habit, and dogfooding the tool.
- The rebuild-on-commit git hook is per-machine (documented, not committed).

## Verification

- `graphify query "…"` returns sensible output against the committed graph.
- `graphify-out/graph.json` + `GRAPH_REPORT.md` generated and committed; `cost.json`/`cache/` correctly ignored.
- `.claude/settings.json` is valid JSON containing **both** `enabledPlugins` and `hooks`; a Claude session loads it without error.
- The `PreToolUse` reminder appears when a grep/find is attempted with `graph.json` present.
- `npm run build && npm run lint && npm test` still green (tooling must not affect app code).
