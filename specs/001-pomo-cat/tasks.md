# Tasks: Pomo Cat

**Input**: Design documents from `specs/001-pomo-cat/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: MANDATORY (constitution VIII). Every story phase includes unit tests for
domain/boundary behavior and failure paths, plus Playwright coverage for the user
journey. Tests are written alongside the code they prove, never deferred.

**Delivery Mode**: Full

## Format: `[ID] [P?] [Story] [ROUTINE?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- **[ROUTINE]**: Fully specified, may be delegated to the developer

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Adapt the starter skeleton; do not regenerate tooling

- [ ] T001 Rename the product to Pomo Cat in package.json and index.html (title, `lang="de"`)
- [ ] T002 Remove the starter demo: src/domain/items.ts, src/domain/items.test.ts, the demo App in src/ui/App.tsx and e2e/demo.spec.ts; keep equivalent failure coverage in the new store and e2e tests (FR-045)
- [ ] T003 Make German the default locale: add src/ui/i18n/de.ts, rewrite src/ui/i18n/en.ts and src/ui/i18n/messages.ts, support switching the locale at runtime in src/ui/i18n/index.tsx (FR-039)
- [ ] T004 Add `@fontsource/patrick-hand` 5.3.0 with an exact pin, list it in THIRD-PARTY-NOTICES.md (FR-041)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Rules and storage every story needs

- [ ] T005 [P] Settings limits and defaults in src/domain/settings.ts with src/domain/settings.test.ts: learn 5-60, short break 5-30, long break 5-60, multiples of 5, units 1-8, defaults 25/5/15/4 (FR-006, FR-036)
- [ ] T006 [P] Mood rules in src/domain/cat.ts with src/domain/cat.test.ts: name 1 to 20 characters after trimming, 48 h and 96 h decay, raise one step (FR-023, FR-024, FR-025)
- [ ] T007 [P] Coins in src/domain/rewards.ts and the catalog in src/domain/catalog.ts with tests: 1 coin per 5 minutes, happy `ceil(base * 1.5)`, foods, snacks at 3, room items at 5/10/20 (FR-016, FR-019, FR-027)
- [ ] T008 [P] Study log in src/domain/studyLog.ts with src/domain/studyLog.test.ts: local day key, add minutes, month view, streak with a 5-minute threshold ending today or yesterday (FR-033, FR-034)
- [ ] T009 Game state machine in src/domain/game.ts with src/domain/game.test.ts: GameState, phases, start, advance, stop, feed, resumeAfterClose and sound effects per data-model.md, including the chain that stops at an unfed break (FR-007, FR-008, FR-009, FR-012, FR-013, FR-015, FR-017, FR-018, FR-019, SC-005)
- [ ] T010 Store port and validated adapter in src/storage/port.ts and src/storage/browser.ts with src/storage/browser.test.ts per contracts/game-state.md: read, invalid, save and reset failures (FR-043, FR-045)

**Checkpoint**: Foundation ready

---

## Phase 3: User Story 1 - Lernen, füttern, Münzen bekommen (Priority: P1) 🎯 C1 Risky core

**Goal**: The full loop in the simplest form, on the sketch's screen

**Riskiest assumption tested**: The app feels very simple, without gimmicks

**Independent Test**: Run a block with `page.clock` or the demo link: name, start, feed, automatic next unit, unfed stop, stop button, closing

### Tests for User Story 1

- [ ] T011 [P] [US1] Playwright journeys in e2e/learning.spec.ts for scenarios 1 to 10 of US1, SC-001, SC-002, SC-005 and no sideways scrolling (SC-009) on both projects

### Implementation for User Story 1

- [ ] T012 [US1] Placeholder images and sound in src/ui/assets/ behind src/ui/assets/manifest.ts, the sleeping cat cut from docs/design/owner-sketch-learning-screen.jpg, a meow synthesised by the team (FR-040, research R4, R7)
- [ ] T013 [US1] Time and effects in src/ui/ticker.ts, src/ui/sounds.ts and src/ui/useGame.ts: worker tick, heartbeat, persistence queue, document title (FR-004, FR-005, FR-010, FR-014, research R1, R2)
- [ ] T014 [US1] Composition in src/main.tsx with the demo link (`?probelauf`, clock times 60, own storage key) and the browser language (FR-039, FR-048)
- [ ] T015 [US1] Screen per docs/design/owner-sketch-learning-screen.jpg and contracts/ui.md in src/ui/App.tsx, src/ui/components/NameCat.tsx, Timer.tsx, CatStage.tsx, FeedDialog.tsx, StopDialog.tsx, src/ui/style.css (FR-001, FR-002, FR-011, FR-016, FR-020, FR-041)
- [ ] T016 [US1] Load and save failures on an error screen in src/ui/App.tsx with e2e coverage in e2e/learning.spec.ts (FR-045)
- [ ] T017 [US1] Image list with sizes for the owner in docs/design/image-list.md (FR-042)

### C1 GATE

- [ ] T018 [GATE] C1 checkpoint (owner-facing: "First working slice"): run `pnpm verify`; start `pnpm dev --host 127.0.0.1 --port 5173 --strictPort` and confirm the URL responds; draft the round report from docs/templates/round-report.md (≤3 owner steps); run the `reviewer` subagent (code review plus walk-through of the owner steps with screenshots) and fix blockers; save the report as specs/001-pomo-cat/review/round-<k>.md; update docs/STATUS.md (checkpoint, round counter, next action) and the spec in the same commit, and append evidence to docs/journal/001-pomo-cat.md; commit; post the report in chat; then **STOP** and wait for an explicit owner decision. Do not start later phases until docs/STATUS.md records approval.

---

## Phase 4: User Story 2 - Pause mit der Katze (Priority: P2) C2 Useful and recoverable

**Goal**: The break replaces doomscrolling; mood shows on the cat

**Independent Test**: Pet, hold, close, reopen and continue; check mood over simulated days

- [ ] T019 [US2] Hold, continue and learn-now events with tests in src/domain/game.ts and src/domain/game.test.ts (FR-022)
- [ ] T020 [US2] Break controls and warning in src/ui/components/BreakControls.tsx, moods and reactions in src/ui/components/CatStage.tsx (FR-008, FR-021, FR-026)
- [ ] T021 [US2] Playwright journey in e2e/break.spec.ts for scenarios 1 to 6 of US2

---

## Phase 5: User Story 3 - Shop und Katzenraum (Priority: P3) C2

**Goal**: Coins buy snacks and room items

**Independent Test**: Buy with a seeded coin count; items stay after a reload

- [ ] T022 [US3] Buying with tests in src/domain/game.ts and src/domain/game.test.ts: never negative, room items once, snack raises mood at once (FR-028, FR-029, FR-031)
- [ ] T023 [US3] Collapsible panel in src/ui/components/Panel.tsx, shop in src/ui/components/ShopPanel.tsx, fixed places and toy play in src/ui/components/CatStage.tsx (FR-003, FR-027, FR-029, FR-030)
- [ ] T024 [US3] Playwright journey in e2e/shop.spec.ts for US3 and scenario 7 of US2, including SC-006

---

## Phase 6: User Story 4 - Lernkalender und Lernserie (Priority: P4) C2

**Goal**: Learned time per day, a small streak

**Independent Test**: Seed days, cancel a unit, browse months, check a gap

- [ ] T025 [US4] Calendar in src/ui/components/CalendarPanel.tsx with `Intl` month names (FR-032, FR-034)
- [ ] T026 [US4] [ROUTINE] Playwright journey in e2e/calendar.spec.ts for scenarios 1 to 5 of US4, following e2e/shop.spec.ts

---

## Phase 7: User Story 5 - To-Do-Liste (Priority: P5) C2

**Goal**: A simple list beside the timer

**Independent Test**: Add, tick, delete, reload

- [ ] T027 [US5] To-do rules with tests in src/domain/todos.ts and src/domain/todos.test.ts: text 1 to 120 characters after trimming, wired through src/domain/game.ts (FR-035)
- [ ] T028 [US5] [ROUTINE] To-do panel in src/ui/components/TodoPanel.tsx inside src/ui/components/Panel.tsx, reachable during a unit (FR-035)
- [ ] T029 [US5] [ROUTINE] Playwright journey in e2e/todos.spec.ts for scenarios 1 to 4 of US5

---

## Phase 8: User Story 6 - Einstellungen und Sprache (Priority: P6) C2

**Goal**: Times, units, sound and language

**Independent Test**: Change values, see when they apply, switch language, mute

- [ ] T030 [US6] Settings events with tests in src/domain/game.ts and src/domain/game.test.ts (FR-036, FR-037)
- [ ] T031 [US6] Settings dialog in src/ui/components/SettingsDialog.tsx with the gear button, always reachable (FR-036, FR-038)
- [ ] T032 [US6] Playwright journey in e2e/settings.spec.ts for scenarios 1 to 5 of US6, including SC-008

### Reliability for C2

- [ ] T033 Single active tab in src/ui/tabGuard.ts, wired in src/ui/useGame.ts, with e2e coverage in e2e/reliability.spec.ts (FR-046)
- [ ] T034 Reload, invalid data, read and write failure, recovery and offline-free checks in e2e/reliability.spec.ts, including no external requests (FR-043, FR-044, FR-045, SC-007)
- [ ] T035 Keyboard-only journey and labelled dialogs in e2e/reliability.spec.ts (FR-047)

### C2 GATE

- [ ] T036 [GATE] C2 checkpoint (owner-facing: "Solid and usable"): same procedure as T018 for US1-US6; **STOP** for an explicit owner decision.

---

## Phase 9: Polish & Acceptance (C3)

**Purpose**: Demonstrate agreed acceptance criteria and hand off

- [ ] T037 Accessibility pass: focus, labels, status and error announcements in src/ui/
- [ ] T038 [ROUTINE] Localization pass: no user-facing strings outside src/ui/i18n/, `Intl` formatting, layouts tolerate longer text at mobile width
- [ ] T039 Timer accuracy over 60 minutes in a hidden tab, recorded in docs/journal/001-pomo-cat.md (SC-004)
- [ ] T040 Replace the placeholders with the owner's final art, when delivered, and confirm no behavior changed (SC-003, SC-010)
- [ ] T041 Run quickstart.md validation
- [ ] T042 Document known limits and exact restart steps in docs/STATUS.md and README.md
- [ ] T043 [GATE] C3 checkpoint (owner-facing: "Ready to accept"): same procedure as T018; request explicit acceptance. **STOP**; never mark accepted without a recorded owner decision. After acceptance: write the retro entry (docs/retro.md) and offer to send it upstream.

---

## Dependencies & Execution Order

- Setup, then Foundational, then stories in priority order
- US3 needs the panel used by US4 and US5; US2 to US6 all build on US1
- GATE tasks block every later task until docs/STATUS.md records an explicit owner decision
- [P] tasks only within a phase; never across a GATE

## Implementation Strategy

1. Setup + Foundational + US1, then C1 GATE, **STOP**
2. After approval: US2 to US6 and reliability, then C2 GATE, **STOP**
3. After approval: polish and final art, then C3 GATE, **STOP**
