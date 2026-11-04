# Retro notes

Written by the team after each accepted checkpoint (at least after "Ready to accept") (`AGENTS.md`, handoff step
9): three to five bullets per entry on what slowed the team down, which template
rule would have helped, and which rule was unclear or contradicted another. The
owner can send an entry upstream with "send the retro" (`team` skill): the
team strips anything confidential and opens an issue on the template
repository named in `.mvp-starter/manifest.json`, using
`.github/ISSUE_TEMPLATE/experience-report.md`, or `rule-ambiguity.md` for an
unclear rule (that is a bug in the template).

Rules the owner wants for this product only go into the constitution's
"Project amendments" or AGENTS.md "Project working rules", not here.

## Entries

<!--
### <date> after <checkpoint> of <feature>
- ...
- Sent upstream: <issue link, or "not yet">
-->

## Pomo Cat, C1 (2026-11-04)

- A fresh clone on Windows fails `pnpm verify` before any work: Git for Windows
  defaults to `core.autocrlf=true`, Biome expects LF. The template could ship
  `* text=auto eol=lf` in `.gitattributes`.
- An exact Node pin with `engine-strict` blocks every `pnpm` command on a newer
  version of the same LTS line. A range, or a rule for raising the pin, would have
  spared a stop on the first run.
- Timers cannot be reviewed at real speed. The template has no rule for a sped-up
  demo; a stated pattern would have saved design time.
- The reviewer's mutation checks found tests that proved less than the ticked tasks
  claimed. Worth making a standing part of the reviewer's brief.
- The owner kept trying the app and answering while the review ran. The handoff
  steps assume the report comes first; a line on feedback before the report would
  remove the doubt about what such an answer approves.

## Pomo Cat, C2 (2026-11-04)

- The e2e suite tests a production build while owners review on the dev server, so a
  bug that exists only under StrictMode reached the owner. A dev smoke test belongs
  in the template.
- Owners often send wishes during the review. The handoff has no step for what a
  review means when the code changes right after it.
- A mid-turn image may not reach the disk, so an owner has to send it twice.
- Round numbers in report questions (Q1, Q2) clash with interview numbers.

## Pomo Cat, C3 (2026-11-04)

- Every C3 wish changed the app, so C3 took two extra rounds. The handoff has no rule
  for what a small change after the last independent review still needs: the final
  rebuild had tests and a visual check, but no second review.
- An owner's request for the finished thing is close to approval without being one.
  "Silence is not acceptance" covers silence, not this. One line would help: a request
  for the result is answered with the links and the acceptance question.
- Reports say "reachable on this computer" while the owner asks for the website. Each
  report could say in one line how the public link differs from the review link.
- A scratchpad script rebuilt an asset (the frame) and is gone, so the next rebuild
  needs it written again. Generators of committed assets could live in the repository.
- A visual wish is hard to judge from a description: rounded versus square corners took
  two rounds. A cheap one-screen prototype first would have saved one.
