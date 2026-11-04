# ADR 013: Game state in one validated local document

Status: accepted by the lead on 2026-11-04 for feature 001-pomo-cat. Amends ADR 002
(demo schema replaced); the rationale and limits of ADR 002 still apply.

## Context

Pomo Cat stores a small game state: cat, coins, purchases, study log, to-dos,
settings and the running phase. The owner wants an account later, as a separate
feature. Until then all data stays in the browser, without personal data.

## Decision

- One JSON document under `pomo-cat:game:v1`, behind the asynchronous `GameStore`
  port, validated with Zod on read and write.
- The demo link uses `pomo-cat:demo:v1`, so test runs never touch real progress.
- A read failure or invalid data blocks writes. The error screen offers a retry and,
  for invalid data, a deliberate reset of the app's own key after a confirmation.
- A single active tab (Web Locks) prevents competing writes.

## Consequences

Progress is per browser and is lost when the browser data is cleared. The owner has
been told this (Q8). The account feature adds a `GameStore` adapter and an explicit
import of the local document; it needs its own ADR on provider, data location, cost
and identity (Q16 to Q20).
