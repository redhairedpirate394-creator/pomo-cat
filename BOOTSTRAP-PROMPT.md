# Starting your product

You don't need to copy anything from this file. Start Claude Code in your
project folder (README, "Start") and say **"let's start"** (in any language). The team checks your
computer, asks you the questions below, and takes it from there. This page
exists so you know what is coming.

## Five questions the team will ask

Answer in your own words; "I don't know yet" is a valid answer and the team
will work with it.

1. **The idea.** What should the product do, for whom, and what is better for
   them afterwards? Two or three sentences are plenty.
2. **The first users.** Who tries it first (you, a colleague, a customer)?
   Real people's data or made-up test data?
3. **What must be true for this to be worth it.** The one thing that, if it
   doesn't work, means the product isn't worth building. The team builds and
   tests that first.
4. **Language.** Which language you want to talk in and see in the app. Default:
   the language you answer in.
5. **Publishing.** After each approved round, should the team *keep it on your
   machine*, *open a pull request for someone to check* (GitHub's way of
   showing a proposed change to a person before it goes live), or *publish
   automatically* so you get a web address anyone can open? Default: publish
   automatically (data stays in each visitor's browser; if your product handles
   personal or sensitive data, say so and the team will recommend "keep it on
   my machine").

Then one question about you: *just show me the app* (the team decides technical
matters and tells you in one sentence each) or *tell me the technical decisions
too*. Default: just show me the app. You can change it any time.

## What happens next

The team asks follow-up questions about your product, a few at a time, each
with a recommended answer so a plain "yes" works. Then it builds the first
working slice and comes back with a **round report**: what is new, a link to
click, up to three things to try, and the decisions it needs from you. You
answer in chat however you like; the team writes it down and reads it back.
Rounds continue until you say the product is ready.

See a complete first exchange in [docs/example-bootstrap.md](docs/example-bootstrap.md).

---

## For the team (engine instructions)

The `team` skill runs the start procedure, then this block. Keep it in sync
with `AGENTS.md`.

```text
Build a small, useful product from this starter using Spec Kit, inside the
owner's loop (constitution, first section).

INPUTS (from the bootstrap conversation; "not stated" where the owner gave none)
IDEA, FIRST USERS, MUST BE TRUE, SPEC LANGUAGE, PUBLISH CHOICE,
OWNER EXPERIENCE, NAME (ask or propose if not stated), plus anything the owner
volunteered (devices, design, sensitivity, budget).

START / RESUME
Work from the repository, not remembered chat. Read
.specify/memory/constitution.md -> AGENTS.md -> .mvp-starter/manifest.json ->
docs/STATUS.md -> active specs/NNN-*/ files -> relevant ADRs. If STATUS names
an active feature or pending gate, this is a RESUME: continue its next action
within its gates and never re-specify it.

LANGUAGE (constitution XII): talk to the owner and write spec.md prose in the
spec language; headings, markers, IDs and everything technical in English; UI
default locale = spec language through the message catalog.

NEW PRODUCT (no product feature in specs/ yet)
1. Interview with the grilling skill until the frontier is empty: product
   decisions only, recommended answer per question, facts looked up by you.
   Record "MUST BE TRUE" as the riskiest assumption.
2. /speckit-specify with the inputs and interview results as the brief; order
   user stories so P1 exercises the riskiest assumption; record facts,
   assumptions, exclusions and [NEEDS CLARIFICATION] markers, never guesses.
3. /speckit-clarify as a residual pass (≤5 questions, each with a recommended
   answer) only for what the interview left open and that affects acceptance,
   domain, privacy, retention, paid usage, external access, or something the
   owner can feel of the architecture. Nonblocking questions go to the round
   report, and you proceed.
4. /speckit-plan. Reuse the shipped foundation (ADR 001-002); departures need
   an ADR and, when the owner can feel them, the owner's yes. Choose the
   delivery mode (the first feature is always Full) and tell the owner in one
   sentence.
5. /speckit-tasks, then /speckit-analyze; fix inconsistencies. Tag only fully
   specified tasks [ROUTINE]. Commit the planning slice.
6. /speckit-implement to the C1 GATE, delegating [ROUTINE] tasks to the
   developer and reviewing their diffs. Run the handoff procedure (AGENTS.md):
   verify, running URL, round report, reviewer walk-through with screenshots,
   STATUS + journal, commit, post the report, STOP.
Starter demo code is a walking skeleton: adapt or remove it in the Setup
phase. Starter evidence and gates are not product progress. Never clear
existing browser data.

AT EACH GATE: the handoff procedure in AGENTS.md, nothing less. Never fabricate
a URL, screenshot, passing check or review. Give the owner at most three steps
and decisions with recommendations. STOP and wait.

AFTER FEEDBACK: record it in specs/NNN-*/feedback/round-<k>.md (owner's words
quoted, rNN ids, not-stated items), commit, read it back, ask the not-stated
decisions again, triage, fold changes into spec.md (/speckit-clarify or direct
edit with stable IDs; decisions as dated Clarifications bullets), refresh
tasks (/speckit-tasks or /speckit-converge), /speckit-analyze, implement to
the next GATE. On approval: tick the GATE, publish per PUBLISH CHOICE
(AGENTS.md, Publish). After C3 acceptance: retro entry, then each new
capability is a new /speckit-specify feature with the gates of its mode.

LIMITS: do not guess domain, privacy, identity, consent, retention or
authorization rules; do not add paid services, expose data, create remote
resources, destructively change Git, or bypass checks without explicit
permission. Work on a local feature branch from the first commit; push, PRs,
merges and deployment only as the recorded publish choice allows. Silence is
not approval. A fresh agent must be able to resume solely from the repository.
```
