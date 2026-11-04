# Implementation Plan: Pomo Cat

**Branch**: `001-pomo-cat` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-pomo-cat/spec.md`

**Delivery Mode**: Full (a product's first feature; C1, C2, C3)

## Summary

A browser Pomodoro timer with a cat. Everything lives in one validated game state
document in the browser. Game rules are a pure state machine driven by timestamps,
so timers survive background tabs, sleep and reloads; React only renders the state
and dispatches events. Art and sound are plain replaceable files behind one
manifest, so the owner's final drawings need no code change.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node 24.22.0 for tooling

**Primary Dependencies**: React 19, Vite 7, Zod (shipped foundation, ADR 001); new:
`@fontsource/patrick-hand` 5.3.0 (OFL-1.1, bundled, research R6)

**Storage**: localStorage behind an async port, one versioned document (ADR 013,
amends ADR 002)

**Testing**: Vitest for domain and storage, Playwright (desktop Chrome, Pixel 7) with
`page.clock` for time

**Target Platform**: Current desktop and mobile browsers; static GitHub Pages

**Project Type**: Single-page web app, static, no backend

**Performance Goals**: Timer drift at most 1 s over 60 minutes, also in a hidden tab
(SC-004)

**Constraints**: No external requests at runtime (FR-044), all text in catalogs, de
and en (FR-039), art replaceable (FR-040)

**Scale/Scope**: One user per browser, 6 stories, 1 screen, small state document

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Status |
| --- | --- |
| A-E owner's loop | Pass. Rounds C1-C3. A demo link makes the loop tryable without waiting 25 minutes (R5). |
| I Learn before building | Pass. P1 is the full learn, feed, coins loop and is judged on simplicity (SC-003). |
| II Do not invent the domain | Pass. Team-chosen details are listed under Assumptions in the spec and shown at C1. |
| III Local first | Pass. The async port stays, so the account feature can add an adapter. |
| IV Boundaries | Pass. Pure domain, Zod at the storage boundary. |
| V Usable | Pass. Keyboard and screen reader in FR-047, covered at C2. |
| VI Foundation | Pass. No departure; ADR 013 replaces the demo schema. One font package added. |
| VII People and credentials | Pass. No personal data, no accounts in this feature. |
| VIII Tests | Pass. Unit plus Playwright per story. |
| XII Localization | Pass. de is the default, en is approved by the owner (Q4). |

Re-check after design: no change, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-pomo-cat/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── game-state.md    # persisted document
│   └── ui.md            # states, controls and accessible names
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── settings.ts      # limits, defaults, plan snapshot
│   ├── cat.ts           # mood rules
│   ├── rewards.ts       # coins
│   ├── catalog.ts       # foods, snacks, room items, prices
│   ├── studyLog.ts      # day keys, minutes, streak, month view
│   ├── todos.ts
│   ├── game.ts          # GameState, phases, events, advance, resumeAfterClose
│   └── *.test.ts
├── storage/
│   ├── port.ts          # GameStore, StoreError
│   ├── browser.ts       # localStorage adapter, Zod schema
│   └── browser.test.ts
├── ui/
│   ├── App.tsx          # load, error screens, composition of the screen
│   ├── useGame.ts       # state, dispatch, persistence queue, ticking, heartbeat
│   ├── ticker.ts        # worker tick plus interval fallback
│   ├── tabGuard.ts      # single active tab
│   ├── sounds.ts        # plays the meow
│   ├── components/      # Timer, CatStage, Panel, FeedDialog, ShopPanel,
│   │                    # CalendarPanel, TodoPanel, SettingsDialog, NameCat
│   ├── assets/          # images, sound, manifest.ts
│   ├── i18n/            # de.ts, en.ts, messages.ts, index.tsx
│   └── style.css
└── main.tsx             # composition root, demo-mode clock and storage key
e2e/                     # one Playwright journey per story
docs/design/image-list.md # the images the owner paints
```

**Structure Decision**: The shipped single-project layout, unchanged. `useGame` is
the only place that connects the domain with time, storage and sound.

## Complexity Tracking

No constitution violations.
