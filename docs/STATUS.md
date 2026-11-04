# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: Pomo Cat (possibly Pomo Pet later, with other animals and rooms)
- Repository/branch: `redhairedpirate394-creator/pomo-cat` (public), `001-pomo-cat-c3`
- Live URL: https://redhairedpirate394-creator.github.io/pomo-cat/
  (GitHub Pages, source: workflow; trial link: add `?probelauf`)
- Spec language: de (chat and spec). App: German and English.
- Publish choice: auto-merge ("publish automatically")
- Owner experience: see `.mvp-starter/manifest.json` (single source)

## Where we are

- Active feature: 001-pomo-cat (`specs/001-pomo-cat/`)
- Checkpoint: C2 approved 2026-11-04 and published; C3 next, delivery mode Full.
- Pending owner decisions: none before the gate. Q43 (r16): acceptance does not wait
  for the remaining drawings, T040 stays open. Order of r17 to r23 decided (r24).

## Counters

- Rounds held: 2
- Last feedback id: r27 (next is r28)

## Machine

- Last tool check: 2026-11-04 (Windows 11; Node 24.22.0, pnpm 10.34.7, git
  2.56.0, gh 2.102.0, Playwright Chromium installed; `pnpm verify` passes)

## Worktree

- See `git status`; nothing uncommitted is expected between steps.

## Limits

- No backup/export, auth, backend, sync, conflict resolution, or PWA/offline
  loading in the foundation. Static GitHub Pages deployment per ADR 007.
  Storage limits: ADR 002.
- Spec Kit 1.2.1 is vendored; upgrades are a template task
  (`docs/update-from-template.md`, ADR 010).
- Delivery modes Light and Spike are untested (no feature has used them yet).
- No license chosen yet.
- Product limits and exact restart steps: `README.md`, top section.

## Exact next action

C2 is live (PR #2 merged). On branch `001-pomo-cat-c3`: finish T039 (the hidden tab
measurement), then the C3 GATE (T043). T040 stays open until the owner delivers the
remaining drawings (r16).
