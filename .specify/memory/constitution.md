# MVP Starter Constitution

Durable rules for humans and any coding agent. Spec Kit reads this file during
`/speckit-plan` (Constitution Check) and amends it only through
`/speckit-constitution`. Product requirements belong in `specs/<feature>/spec.md`;
the current checkpoint and next action belong in `docs/STATUS.md`.

The person this product is built for is called the **owner** throughout. The
agents working on it are called the **team** (lead, developer, reviewer; see
`AGENTS.md`).

## The owner's loop

These rules come first because every other rule serves them.

### A. The owner reviews running software and decides; the team does the rest

The owner has exactly two jobs: try the running product and make product
decisions (what it should do, for whom, in which order, when it is good enough).
The team never requires the owner to read code, diffs, plans, task lists or
spec files to move forward. The team may show them when the owner asks or when
the owner's recorded experience setting (`.mvp-starter/manifest.json`,
`owner_experience: technical`) says to volunteer them.

### B. Every round ends in something the owner can try

A round is the unit of work between two owner decisions. It ends with a running
product at a verified address, a **round report** of at most 30 lines in the
owner's language (what is new, where to try it, at most three things to try,
decisions needed with a recommendation each, known limits), and screenshots the
reviewer took while walking those steps. Mock-ups, static screens and promises
are not a round result.

### C. The team is the scribe

The owner gives feedback in whatever form is natural: chat, screenshots,
half-sentences, another language. The team writes it down: the owner's words
quoted unchanged, plus the structure the next round needs (id, timing, type,
reference), and reads the result back. A question the owner did not answer is
recorded as **not stated** and asked again; it is never inferred from silence,
tone or a related remark.

### D. Business questions go to the owner, technical questions stay in the team

The team decides anything technical inside the shipped foundation (see VI) and
reports it in one plain sentence. It asks the owner whenever a choice changes
something the owner can feel: money, where data lives, who can see it, what the
product does in an edge case, what becomes harder later. Such questions are
asked the way `grilling` asks them: numbered, each with a recommended answer so
that "yes" is a complete reply. The team does not guess privacy, identity,
consent, retention or authorization rules (see VII); it cannot certify legal
compliance and says so when the owner's answers touch regulated data.

### E. Rules describe roles and outcomes, not models

Agent instructions in this repository say what a role is responsible for and
what a good result looks like. They do not prescribe how a model should think,
name specific model versions or add workarounds for a model's weaknesses. Model
size is expressed only through the runtime's tier aliases.

## Core Principles

### I. Learn before building

Identify the riskiest assumption early. Deliver small, end-to-end slices that
test it before adding breadth or infrastructure. The P1 user story of a product's
first feature MUST exercise that riskiest assumption. The bootstrap records, in
the owner's words, what must be true for the product to be worth building; the
first round tests it.

### II. Do not invent the domain

Record confirmed facts, assumptions, unanswered questions, and explicit
exclusions separately. Mark unknowns `[NEEDS CLARIFICATION]` instead of guessing.
Owner silence is not approval.

### III. Local first, deliberately

Prefer a useful local experience and reversible choices with a replaceable
asynchronous storage seam for future cloud needs. Local storage is not
automatically private, durable, backed up, or available offline. Reassess storage
against actual product requirements.

### IV. Keep boundaries honest and simple

Prefer the smallest usable slice over speculative abstractions. Use strict
typing. Validate untrusted input and persisted data at runtime; types alone do
not validate boundaries. Keep domain logic independent of UI, storage, and
external services.

### V. Make the experience usable

Semantic structure, keyboard operation, visible focus, labels, understandable
errors, accessible feedback, and mobile-friendly layouts are acceptance
requirements, not finishing touches.

### VI. Build on the shipped foundation

The template ships a tested foundation (stack, boundaries, checks, deployment;
`docs/adr/001-stack.md`, `002-storage.md`). Prefer current stable releases
supported together, not new majors for their own sake. Pin the toolchain and
preserve reproducibility. A plan that departs from the foundation needs an ADR
and, when the departure is something the owner can feel (rule D), the owner's
yes.

### VII. Protect people and credentials

Never commit secrets or real personal data. Do not guess privacy, retention,
consent, identity, or authorization rules. Obtain approval before sensitive
integrations, paid services, or irreversible operations.

### VIII. Prove what changed (tests are mandatory)

Cover meaningful behavior, boundaries, failure paths, accessibility, and
regressions with proportionate tests in every task list, whether or not the
spec mentions tests. Run the applicable checks and record actual commands,
outcomes, and limitations. Never fabricate passing checks, reachable URLs,
screenshots, or owner acceptance. Tests are part of done, not a follow-up.

### IX. Keep one truth

Each feature has exactly one spec (`specs/<feature>/spec.md`) with stable
requirement IDs (user stories, `FR-`, `SC-`). Update spec, tasks, and
`docs/STATUS.md` in the same change as behavior: implementation state, open
questions, and next action must agree. Distinguish planned, implemented,
verified, and owner-accepted work. History and evidence go to
`docs/journal/`; STATUS stays short.

### X. Commit complete slices

Use conventional commit subjects describing **WHAT** changed (for example,
`feat: recover unreadable demo storage`). Explain **WHY**, trade-offs, and
relevant evidence in the body. Do not create one commit per file or per task
merely because files changed.

### XI. Preserve owner control

Respect existing work and explicit scope. Stop at delivery checkpoints with a
running application and wait for an explicit owner decision; an agent cannot
approve its own exception or advance past a pending gate.

### XII. Speak the owner's language; build for localization

- **Spec language**: the language that best fits the owner, which is the language
  of their brief unless they state another. Conversation with the owner,
  questions, round reports, and the prose of `spec.md` (and its checklists) use
  it. The spec records it as `**Spec Language**: <BCP 47 tag>`.
- **Technical language is English**: constitution, AGENTS.md, README, ADRs,
  `docs/STATUS.md`, `docs/journal/`, plan/research/data-model/contracts/quickstart/tasks,
  code, identifiers, comments, test names, and commit messages.
- **Structure stays English in every document**: template headings, markers such
  as `[NEEDS CLARIFICATION]`, `## Clarifications`, `### Session`, and `GATE`, and
  IDs (`US1`, `P1`, `FR-001`, `SC-001`, `T001`, `r01`). Spec Kit commands look for them.
- **UI**: the default locale is the spec language unless the spec states
  otherwise. Every user-facing string comes from a locale message catalog, never
  hardcoded in components or thrown from domain/storage code (those layers
  return typed error codes the UI maps to messages). Set `<html lang>`, format
  dates/numbers/plurals with `Intl`, avoid sentence concatenation, and keep
  layouts tolerant of longer text. Shipping more than the default locale is a
  separate, approved feature.

## Delivery Checkpoints

The team works autonomously between checkpoints and stops at each checkpoint of
the feature's delivery mode (below). Each checkpoint is a round whose report
asks for a formal decision. The owner-facing names are in the second column;
the IDs stay in tasks and specs.

| ID | Owner-facing name | What it proves |
| --- | --- | --- |
| **C1** | First working slice | The P1 story runs end to end on real (synthetic, discardable) data and tests its important failures. |
| **C2** | Solid and usable | The approved workflow survives reload, invalid data, read/write failures, recovery, keyboard use, and agreed devices. |
| **C3** | Ready to accept | Acceptance criteria demonstrated, checks run, limits and restart steps documented, explicit acceptance requested. |

At each checkpoint: `pnpm verify` passes (or its failure is recorded), the app is
actually running at a verified URL, the reviewer has walked the review steps
and attached screenshots, and the round report gives at most three owner
steps. `AGENTS.md` defines the exact procedure.

### Delivery modes

Not every feature needs all three gates. In `/speckit-plan` the team chooses
one mode, records it with a one-line reason as `**Delivery Mode**` in `plan.md`
and in `docs/STATUS.md`, and tells the owner in one plain sentence ("this one
is small, so there will be a single review"). `/speckit-tasks` inserts only
that mode's GATE tasks.

- **Full** (C1 → C2 → C3): a product's first feature, and any feature that adds
  a new workflow whose core assumption is not yet proven.
- **Light** (one GATE after the last story, C3 procedure): a feature that
  extends a proven workflow and whose risks can be tested inside the slice. The
  single gate demonstrates, for the feature's scope, the core end to end, the C2
  behavior (reload, invalid data, failures, recovery, keyboard, devices) of
  what changed, and the acceptance criteria.
- **Spike** (C1 only, time-boxed): a feature whose central question has an open
  outcome. It ends at a C1 GATE with a recorded go/no-go result and its
  evidence. The owner decides what follows: continue as Light or Full (tasks
  refreshed), or stop and record the learning.

When in doubt, choose the mode with more gates. The team may switch to a mode
with more gates and records why; a mode with fewer gates needs the owner's yes.
The owner may set or change the mode at any time.

## Governance

This constitution supersedes conflicting template text and plan output. The
sections above are owned by the template (`.mvp-starter/manifest.json`,
`template_owned_paths`) and are refreshed by "update from template". Amend them
only with explicit owner approval, through `/speckit-constitution`, plus an ADR
in `docs/adr/` describing the reason and consequences, and prefer sending the
change upstream as a template issue (`docs/retro.md`). Bump the version per
semantic versioning (MAJOR: removed or redefined principle; MINOR: added
principle or section; PATCH: wording). Reading order and operational approval
gates are defined in `AGENTS.md`.

Rules that apply to this product only go in the section below. An update from
the template never touches it.

## Project amendments

<!-- Product-specific rules and overrides, each with a date and a one-line
reason. Empty in the template. -->

**Version**: 3.0.0 | **Ratified**: 2026-10-16 | **Last Amended**: 2026-11-01
