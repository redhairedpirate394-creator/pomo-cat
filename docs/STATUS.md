# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: mvp-starter (the template itself; no product yet). Products
  created from the template rewrite this section on "let's start".
- Repository/branch: `markusrt/mvp-starter`, `main` (template changes merge
  there through PRs)
- Spec language: en
- Publish choice: expert-review (the template's own changes go through PRs)
- Owner experience: see `.mvp-starter/manifest.json` (single source)

## Where we are

- Active feature: none. The starter ships no sample spec (ADR 004).
- Checkpoint: none pending. Template v3.0.0 (owner-centric loop) under review.
- Pending owner decisions: none.

## Counters

- Rounds held: 0
- Last feedback id: none (next is r01)

## Machine

- Last tool check: not run in the template (products record the date of the
  `team` skill's first-run check here)

## Worktree

- See `git status`; nothing uncommitted is expected on `main`.

## Limits

- Discardable nonsensitive demo only; no backup/export, auth, backend, sync,
  conflict resolution, or PWA/offline loading. Static GitHub Pages deployment
  per ADR 007. Storage limits: ADR 002.
- Spec Kit 1.2.1 is vendored; upgrades are a template task
  (`docs/update-from-template.md`, ADR 010).
- Delivery modes Light and Spike are untested (no feature has used them yet).
- No license chosen for the template repository.

## Exact next action

None pending in the starter. Products created from the template: the owner
says "let's start" and the `team` skill takes over (`BOOTSTRAP-PROMPT.md`).
