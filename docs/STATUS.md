# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: Pomo Cat (possibly Pomo Pet later, with other animals and rooms)
- Repository/branch: `redhairedpirate394-creator/pomo-cat` (public), `001-pomo-cat-c2`
- Live URL: https://redhairedpirate394-creator.github.io/pomo-cat/
  (GitHub Pages, source: workflow; trial link: add `?probelauf`)
- Spec language: de (chat and spec). App: German and English.
- Publish choice: auto-merge ("publish automatically")
- Owner experience: see `.mvp-starter/manifest.json` (single source)

## Where we are

- Active feature: 001-pomo-cat (`specs/001-pomo-cat/`)
- Checkpoint: C1 approved 2026-11-04 and published. C2 in progress, delivery
  mode Full.
  - Done: owner's art and lettering (T044-T046), US2 to US6 (T019-T032).
  - Not started: food art (T047), single tab, reliability, keyboard (T033-T035),
    C2 gate (T036).
  - Known problems: the owner's food drawing (r06) reached the chat mid-turn and
    is not on disk; it must be sent again. One harmless CSS lint warning.
  - Checks: `pnpm verify` exit 0 (101 unit tests, 130 browser scenarios).
- Pending owner decisions: Q42 (feedback r06), resend the food drawing.

## Counters

- Rounds held: 1
- Last feedback id: r06 (next is r07)

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

Ask the owner to send the food drawing again, then save it to
`docs/design/owner/food-sheet.jpg` and do T047. Then T033-T035 on branch
`001-pomo-cat-c2`, then the C2 GATE (T036, handoff procedure). The fonts and
cut-outs were built with throwaway scripts; the steps are in the journal.
