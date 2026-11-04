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
- Checkpoint: C3 report posted (round 4), delivery mode Full. C2 approved and live.
- Pending owner decisions: round 4 Q1 (accept C3).
  T040 stays open until the drawings arrive (r16).

## Counters

- Rounds held: 4
- Last feedback id: r28 (next is r29)

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

Round 4 is reported on `001-pomo-cat-c3`, reachable locally at
`http://127.0.0.1:5173/?probelauf` (`README.md` has the restart steps). Wait for the
owner's C3 decision and do not publish before it. On approval: record it here, tick
T043, write `docs/retro.md`, publish with auto-merge. Then start the next feature
with an interview: the real room and the two-slider sounds (r21, r22, r24, r25;
drawing in `docs/design/owner/room-draft.jpg`; plant, rug and post return with it).
