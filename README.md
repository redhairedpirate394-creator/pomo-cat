# Pomo Cat

A learning timer with a cat: learn in units, feed the cat in the breaks, earn coins
and furnish its room. It runs in the browser on phones and computers, in German and
English.

- **Live:** <https://redhairedpirate394-creator.github.io/pomo-cat/>
- **Trial run:** add `?probelauf` to the link. 2 seconds count as 1 minute, so a unit
  takes 50 seconds; mood and calendar run faster too. It keeps its own saved data.

### Start it again on this computer

```sh
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

Then open <http://127.0.0.1:5173/?probelauf>. This address only works on this
computer. "Port 5173 is already in use" means it is already running: open the
address. To check everything: `pnpm verify`.

### Known limits

- Progress lives only in this browser on this device. Clearing the browser's data
  deletes it. There is no account, backup, export or sync.
- Plant, rug and scratching post are out of the shop until their drawings and the
  real room exist; anyone who bought them keeps them. The playing cat and the cat
  enjoying a snack have no drawing yet (it shows its heart eyes); these need a small
  addition to the code when the drawings arrive, the behaviour stays the same.
- Tested automatically in Chromium, at desktop and phone size. Firefox, Safari and
  real phones were not tested, including the sound on an iPhone.
- Timer accuracy over 60 minutes in a hidden tab was measured in Chromium on one
  computer: the meow came 0.25 seconds late. Chromium did not slow this page down
  in that run, so a browser that does may behave differently, and a locked phone
  may pause the page: the time stays right, but the meow can come late.
- Keyboard use is tested. A one-time automatic accessibility scan found nothing on
  the main screens, but it is not part of `pnpm verify`, and no one has tried the app
  with a real screen reader.
- A second open tab waits with a notice. Reloading the first tab while a second one
  waits can swap which of them is active; nothing is lost.
- No licence has been chosen yet.

Decisions and history: [`specs/001-pomo-cat/`](specs/001-pomo-cat/),
[`docs/STATUS.md`](docs/STATUS.md).

---

The rest of this file describes **mvp-starter**, the template this project was built
from.

## About mvp-starter

You describe a product. A small team of AI agents builds it, in rounds. After
every round you get a link, a few things to try, and a couple of questions to
decide. You never read code — you review the running thing and say what should
change. The code lives in your own GitHub repository (the folder on GitHub
that holds your project), built on a tested foundation, with every decision
written down.

This is a template for building a first version (an MVP) of a **web app that
works on phones and desktops** — opened in a browser, nothing to install. Other
kinds of app (command-line tools, desktop apps, games) are planned as sibling
templates (the reasoning is recorded in [decision 011](docs/adr/011-stack-family.md)).

Honest limits: you need a computer you can install a few developer tools on
(below), and the team cannot certify legal compliance of what it builds — it
asks the right questions about personal data, but a human expert checks before
real customer data goes in.

## What you need

One-time setup on your computer. The team checks all of these when you start
and tells you in plain words if something is missing.

1. A [GitHub](https://github.com/signup) account (free).
2. [Git](https://git-scm.com/downloads).
3. The [GitHub CLI](https://cli.github.com/) (`gh`), the tool the team uses
   to talk to GitHub. If it isn't logged in, the team gives you the one
   command to run. Keep it current: GitHub has refused old versions before,
   and the team warns you when yours is getting old.
4. [Node.js](https://nodejs.org/) 24 (the team tells you if your version
   differs from the one the project expects).
5. [pnpm](https://pnpm.io/installation) 10.
6. [Claude Code](https://claude.com/claude-code), the program the team runs
   in. Engineers who prefer another AI coding agent: see
   [docs/port-to-another-agent.md](docs/port-to-another-agent.md).

## Start

1. Click **Use this template** at the top of this page and create your own
   repository (private is fine).
2. Get it onto your computer: on your new repository's page, **Code → Open
   with GitHub Desktop** (or any way you already know) puts a folder on your
   machine.
3. Open a terminal in that folder (right-click the folder → "Open in
   Terminal" on most systems), type `claude`, press Enter, and say
   **"let's start"** — in any language.

The team checks your computer, asks you six short questions
([what they are](BOOTSTRAP-PROMPT.md)), interviews you about the product a few
questions at a time, and builds the first working slice. A complete first
exchange, from "let's start" to the first round report, is in
[docs/example-bootstrap.md](docs/example-bootstrap.md).

## How a round works

```
you describe  →  team asks (with recommendations)  →  team builds
      ↑                                                    ↓
you decide  ←  team reads back what it noted  ←  you try it, say anything
```

- Every round ends with a **round report** in chat: what is new, a link to
  click, up to three things to try (with the screenshots the team's reviewer
  took doing exactly that), and the decisions it needs from you — each with a
  recommended answer, so "yes" is a complete reply.
- You answer however you like: a sentence, a list, a screenshot, "the button is
  in the wrong place". The team writes it down with the detail the next round
  needs, reads it back to you, and asks again about anything you didn't answer
  rather than guessing.
- Three rounds have names because they ask for a formal decision: **First
  working slice** (the riskiest part works end to end), **Solid and usable**
  (survives reloads, bad input, phones, keyboard), **Ready to accept**. Small
  follow-up features may have just one.
- Things you can say at any time: *"where are we?"*, *"go on"*, *"here's my
  feedback: …"*, *"stop here"*, *"publish it"*, *"be more technical with me"*
  or *"just show me the app"*, *"update the team process from the template"*.

## Your decisions

- **What and in which order.** The team never changes what the product does
  without asking. Technical choices inside the foundation are the team's; it
  tells you about them in one sentence each.
- **When it's good enough.** Each named round ends only when you say so.
- **Publishing.** Chosen once at the start, changeable any time: *keep it on my
  machine*; *open a pull request for someone to check* (GitHub's way of
  showing a proposed change to a person before it goes live); or *publish
  automatically* (after each approved round the team puts it on a free public
  web address from GitHub, and data stays in each visitor's browser). If your
  product handles personal or sensitive data, say so — the team recommends
  keeping it on your machine until that is sorted out.
- **Questions the team will always bring to you:** anything that costs money,
  moves data off your computer, decides who can see what, or makes something
  harder later. It will never ask you to choose a framework or read a diff.

Everything the team decides is written into the repository (what is being
built, decision records, round reports, your feedback in your own words), so
a new session, or a human engineer later, can pick up where it left off.

## Under the hood

For engineers. Nothing here is required to use the template.

- **Process engine:** [GitHub Spec Kit](https://github.com/github/spec-kit)
  1.2.1 (specify → clarify → plan → tasks → analyze → implement), vendored
  under `.specify/` and `.claude/skills/speckit-*` so no `specify init` is
  needed ([ADR 010](docs/adr/010-vendored-spec-kit.md)). The owner-facing loop
  on top is defined in the first section of the
  [constitution](.specify/memory/constitution.md) and in
  [AGENTS.md](AGENTS.md) ([ADR 009](docs/adr/009-owner-centric-loop.md)).
- **Team:** the lead (main session), `developer` and `reviewer` subagents
  (`.claude/agents/`). Model size is expressed through tier aliases only; rules
  describe roles and outcomes, not model behaviour
  ([ADR 012](docs/adr/012-model-agnostic-rules.md)). Skills in
  `.claude/skills/`: `team` (owner intents), `grilling`, `prototype`, `pr`,
  `to-questionnaire`, `wait-what` (the last five from
  [mattpocock/skills](https://github.com/mattpocock/skills), MIT; see
  `THIRD-PARTY-NOTICES.md`).
- **Glossary** (owner words → engine terms): ground rules → constitution; what
  we're building → `specs/NNN-*/spec.md`; questions for you →
  `grilling` then `/speckit-clarify`; work plan → `plan.md` + `tasks.md`; round
  → the work between two GATE decisions; First working slice / Solid and
  usable / Ready to accept → C1 / C2 / C3 GATE tasks; single review → Light
  mode, exploration → Spike mode; publish choice → ship mode `local-only` /
  `expert-review` / `auto-merge`; round report → `specs/NNN-*/review/round-<k>.md`;
  your feedback → `specs/NNN-*/feedback/round-<k>.md` (agent-written, your
  words quoted); decision record → `docs/adr/`.
- **Stack:** Vite + React + TypeScript, `src/domain` (pure) / `src/storage`
  (async port, Zod, localStorage adapter) / `src/ui` (React, i18n catalogs),
  Biome, dependency-cruiser boundaries, Vitest, Playwright (desktop + Pixel 7),
  GitHub Actions CI deploying `main` to GitHub Pages
  ([ADR 001](docs/adr/001-stack.md), [002](docs/adr/002-storage.md),
  [007](docs/adr/007-ship-flow.md)). The demo (a task list with explicit
  persistence/recovery) is a walking skeleton the first round replaces.
- **Dev commands:** `pnpm install --frozen-lockfile`,
  `pnpm exec playwright install --with-deps chromium`,
  `pnpm dev --host 127.0.0.1`, `pnpm test`, `pnpm lint:fix`, `pnpm verify`
  (lint → typecheck → architecture → test → e2e; set `E2E_PORT` if 4173 is
  taken), `pnpm ship --mode expert-review|auto-merge`.
- **State files:** `docs/STATUS.md` (bounded current handoff),
  `docs/journal/<feature>.md` (append-only evidence), `docs/retro.md` (notes
  for the template), `.mvp-starter/manifest.json` (template version, stack,
  owner experience, template-owned paths).
- **Keeping a project current:** "update the team process from the template"
  replaces only template-owned paths; see
  [docs/update-from-template.md](docs/update-from-template.md). Spec Kit
  upgrades happen there too.
- **Other agents:** [docs/port-to-another-agent.md](docs/port-to-another-agent.md).
- **Feeding back:** `docs/retro.md` entries become issues here via the
  `team` skill ("send the retro"), using the templates in
  `.github/ISSUE_TEMPLATE/`.
- **Git without the team:** `gh repo create <name> --template markusrt/mvp-starter --private --clone`.

## Folder map

`src/` domain, storage, UI and unit tests; `e2e/` browser journeys;
`.specify/` constitution, vendored Spec Kit scripts/templates and the tasks
override; `.claude/` agents and skills; `specs/NNN-*/` one spec/plan/tasks set
per feature plus `review/` and `feedback/` (none ships with the starter);
`docs/` STATUS, journal, retro, templates, ADRs, example and appendix pages;
`scripts/ship.mjs` publishing; `.github/` CI and issue templates;
`.mvp-starter/manifest.json` template metadata. No environment file or cloud
credentials are needed.
