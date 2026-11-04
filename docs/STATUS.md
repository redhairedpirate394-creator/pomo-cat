# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: Pomo Cat (possibly Pomo Pet later, with other animals and rooms)
- Repository/branch: `redhairedpirate394-creator/pomo-cat` (public), `main`; the next
  feature starts on a new branch from it
- Live URL: https://redhairedpirate394-creator.github.io/pomo-cat/
  (GitHub Pages, source: workflow; trial link: add `?probelauf`)
- Spec language: de (chat and spec). App: German and English.
- Publish choice: auto-merge ("publish automatically")
- Owner experience: see `.mvp-starter/manifest.json` (single source)

## Where we are

- Active feature: none yet. 001-pomo-cat (`specs/001-pomo-cat/`) is accepted and live.
- Checkpoint: C3 approved by the owner (r29), delivery mode Full.
- Pending owner decisions: none. T040 stays open until the drawings arrive (r16).

## Counters

- Rounds held: 4
- Last feedback id: r29 (next is r30)

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

Pomo Cat with all C3 work is live at the URL above, merged to `main`. When the owner
wants to go on, branch `002-<short-name>` from the updated `main` and start the next
feature with an interview: the real room and the two-slider sounds (r21, r22, r24,
r25; drawing in `docs/design/owner/room-draft.jpg`; plant, rug and post return with
it). When the remaining drawings arrive, finish T040.
