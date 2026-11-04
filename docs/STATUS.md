# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: Pomo Cat (possibly Pomo Pet later, with other animals and rooms)
- Repository/branch: `redhairedpirate394-creator/pomo-cat` (public), `main`; next work on `001-pomo-cat-c3`
- Live URL: https://redhairedpirate394-creator.github.io/pomo-cat/
  (GitHub Pages, source: workflow; trial link: add `?probelauf`)
- Spec language: de (chat and spec). App: German and English.
- Publish choice: auto-merge ("publish automatically")
- Owner experience: see `.mvp-starter/manifest.json` (single source)

## Where we are

- Active feature: 001-pomo-cat (`specs/001-pomo-cat/`)
- Checkpoint: C2 approved 2026-11-04 and published; C3 next, delivery mode Full.
- Pending owner decisions: round 2 Q2 (the four team-chosen details).

## Counters

- Rounds held: 2
- Last feedback id: r15 (next is r16)

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

## Exact next action

C2 is live. Ask Q2 of round 2 again. Create `001-pomo-cat-c3` from the updated
`main` and record the publish there, then do T037 to T042 (the rest of Phase 9),
then the C3 GATE (T043). T040 waits for the owner's remaining drawings.
