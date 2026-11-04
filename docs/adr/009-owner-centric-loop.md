# ADR 009: The owner's loop and the team as scribe

Status: accepted by the repository owner on 2026-11-01 (design agreed in a
grilling session over three repositories' history). Amends ADR 003 and the
constitution (v2.2.0 → v3.0.0: new first section "The owner's loop", renamed
checkpoint procedure, "Project amendments" section).

## Context

Three products were built with this template's process between 2026-10-18 and
2026-10-30: kandidu (Spec Kit, this template), 365DaysOfConcentration (a
lighter in-repo spec backlog) and Lift (a deliberate hybrid of both, with its
own "what to take" table). Their history shows:

- The owner-written feedback file `specs/NNN-*/feedback/C<n>.md` was used
  exactly twice in total (kandidu C2, Lift CP0). Everywhere else the owner
  answered in chat and the agent transcribed. Lift's `CP1-feedback.md` shows
  the mature form: agent-written, the owner's words quoted unchanged, the
  agent's id/timing/type added, and "Decision: not stated" where the owner
  had not answered, followed by re-asking.
- `docs/STATUS.md` grew to 869 lines (kandidu) and 953 lines (Lift) in two to
  three checkpoints while the rules asked every fresh session to read it first.
- The README's main path required Python, uv, `specify init`, `git status`
  checks and hand-created files; the gate page told the owner to copy a
  template to a path with the right feature number.
- Owners gave business decisions easily when asked with a recommendation and
  stalled when shown IDs, task lists or plan text.

The owner's stated goal: a loop that feels like talking to your development
team, where the owner reviews running software and decides requirements and
the team handles everything technical — usable both by an engineer and by
someone with no software background.

## Decision

1. **Owner's loop as the first section of the constitution** (rules A–E):
   the owner reviews running software and decides; every round ends in
   something to try plus a ≤30-line round report with reviewer screenshots;
   the team is the scribe; business questions go to the owner (grilling
   style), technical ones stay in the team; rules describe roles and outcomes.
2. **Rounds** replace "gates" in owner-facing language. Checkpoints keep their
   IDs (C1–C3) in files and get owner-facing names (First working slice,
   Solid and usable, Ready to accept). Delivery modes are chosen by the team
   and reported in one sentence.
3. **Feedback is agent-written.** `docs/templates/feedback-round.md` replaces
   the owner template. Round and item numbers are global and monotonic
   (`round-<k>`, `rNN`), which also fixes the missing filename for a repeated
   review of the same checkpoint. Decisions are additionally written into the
   spec's `## Clarifications` as dated bullets.
4. **STATUS is bounded; the journal is append-only.** `docs/STATUS.md` holds
   the current handoff (target under 80 lines); evidence, commands, review
   findings, screenshots and context sizes go to `docs/journal/<feature>.md`.
5. **Independent review includes the owner's walk-through.** The reviewer
   performs the round report's steps against the running app and attaches
   screenshots; a step it cannot perform blocks the report.
6. **One entry skill (`team`)** maps owner intents (start, status, next round,
   feedback, pause, publish, experience, update from template, send retro) to
   procedures. No slash command is required of the owner.
7. **Owner experience setting** (`plain` | `technical`) in
   `.mvp-starter/manifest.json` changes what the team volunteers, never the
   process, the gates, the evidence or who decides.
8. **Retro goes to the template**, not into project rules: `docs/retro.md`
   entries become issues on the template via two issue templates; project-only
   rules live in the constitution's "Project amendments" and AGENTS.md
   "Project working rules".

## Consequences

The owner never creates or opens a file, never names a branch, never sees a
Spec Kit command. The repository still holds everything, now with the owner's
exact words next to the team's reading. Cost: more agent writing per round
(report, feedback record, journal) and a reviewer that runs the app, which
makes a round slower and more expensive than a bare `/speckit-implement`; the
history of three projects says that is cheaper than a misunderstood round.
Paraphrase loss (the 365 pattern) is avoided by quoting; structure loss (the
chat-only pattern) is avoided by the agent adding it. The template cannot make
a non-technical owner independent of the prerequisites (Git, Node, GitHub CLI,
Claude Code); the README says so.
