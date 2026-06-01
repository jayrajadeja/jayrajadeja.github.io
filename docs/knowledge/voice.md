# Voice & Copy Guidelines

Reference for drafting site copy, blog posts, field notes, and data labels in Jayraj's voice.

---

## The Spine

> "I take systems apart to see how they tick."

Every piece of copy flows from this: curiosity about internals, not credentials. The posture is always engineer-who-builds, not analyst-who-observes.

---

## Voice Characteristics

**Technical and precise.** Names things correctly — "composite index", "fan-out-on-write", "durable workflow", "consensus protocol". Does not hedge with vague terms when a precise one exists.

**Analytical, not academic.** Explanations aim at the sharp colleague who skipped the paper. Cuts to the mechanism: what is the actual trade-off, where is the actual cost?

**Pragmatic about performance.** Interested in real throughput and latency, not theoretical bounds. Values "read the EXPLAIN before you blame the engine" over cargo-culted advice.

**Finance × engineering lens.** Reads market structure and distributed systems through the same conceptual frame. A matching engine and a consensus protocol are "solving cousins of the same problem." This double exposure is the distinctive angle.

**Modern shorthand.** Uses terms like "OP" for impressively well-designed (e.g., "The Temporal API is OP for this use case"). Not formal, not chatty — calibrated.

**Short sentences. Short paragraphs.** The blog post and field notes show the cadence: a thesis line, a few supporting lines, move on. No padding.

---

## Tone Calibration

| Context | Tone |
|---------|------|
| Blog posts | Technical essay — precise, confident, collegial |
| Field notes | Aphoristic — one observation, one quote, done |
| Work case files | Interview-defensible — concrete, no jargon for jargon's sake |
| Systems studied | Curious student, not expert — "how it works", not "what I built" |
| Now / uses | Casual first-person, present tense, brief |
| UI labels / copy | Declarative, minimal — label the thing, don't explain it |

---

## Do / Don't Examples

**DO** — Name the mechanism:
> "MySQL's null-safe equality (`<=>`) quietly saves you from NULL-comparison bugs."

**DON'T** — Hedge or inflate:
> "There are various approaches to handling nulls in databases that can improve robustness."

---

**DO** — Show the double lens:
> "A matching engine and a consensus protocol are solving cousins of the same problem: agreeing on an ordered truth under contention, fast."

**DON'T** — Stay in one lane:
> "I'm interested in both financial systems and distributed systems."

---

**DO** — Short, punchy field-note quote:
> "= lies about NULL; <=> tells the truth."

**DON'T** — Over-explain the punchline:
> "This is why using <=> is better because it handles NULL correctly in all cases."

---

**DO** — Confident, concise case file summary:
> "Durable, event-driven workflow orchestration on Temporal — composable flows with retries, timers, and human-in-the-loop steps at platform scale."

**DON'T** — Generic / buzzword-padded:
> "Led the development of a cutting-edge, scalable workflow management solution leveraging best-in-class technologies."

---

## Honesty Constraints (Hard Rules)

These are non-negotiable. Voice and accuracy are not in tension — they reinforce each other.

1. **Real only.** No fabricated metrics, no inflated scope. If a number isn't in `stats.json` or `profile.md`, don't use it.

2. **Aggregate metrics only for SAFE work.** Publish the numbers from `stats.json` (issues, PRs, lines, repos). Do NOT publish internal codenames, Jira keys, repository names, vendor/customer names, or specific PR titles.

3. **"Systems studied" ≠ "systems I built."** The systems section (`systems.json`) is explicitly curiosity, not employment. Copy must reflect this — "studied", "analyzed", "how it works" — never "I built" or "I shipped."

4. **Market data is not his production system.** The ticker shows markets he follows. No UI element may frame a throughput/latency figure as Jayraj's own production system metric unless it comes from `stats.json`.

5. **No SAFE branding beyond the experience entry.** The one-line domain description in `experience.json` is the limit. No internal project names, no client names, no feature names.

6. **Live vs. illustrative.** The ticker label (`"markets · as of DATE"` vs. `"markets · illustrative"`) exists specifically because of this rule. Copy should reinforce, not undermine, that distinction.

---

## Substack Voice Notes

The Substack (`substack.com/@jayrajadeja`) sits at the intersection of finance and engineering. Posts are:
- Short and technical — written for a sharp colleague, not a general audience.
- Grounded in real examples — papers, systems, market mechanics.
- Never tutorial-style — assumes the reader can look up syntax; focuses on the *why* and the *trade-off*.

The blog post `content/writing/finance-meets-engineering.mdx` is the canonical voice sample.
