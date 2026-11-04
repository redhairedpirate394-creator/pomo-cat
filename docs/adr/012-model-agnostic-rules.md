# ADR 012: Model-agnostic rules and tier aliases

Status: accepted by the repository owner on 2026-11-01. Supersedes ADR 006
(model routing check); the routing table stays, the check script goes.

## Context

ADR 006 pinned roles to models and added `scripts/check-model-routing.mjs`,
which read Claude Code's local transcript files to prove which model answered
per agent and required a routing table in STATUS at every gate. The script
depended on an undocumented transcript layout (noted as a risk in ADR 006),
saw only the current session, and produced routine false alarms (kandidu
STATUS, Lift STATUS). Separately, the owner wants the template to keep working
as models improve: skills and agent files must not encode workarounds for a
particular model's weaknesses, and must not conflict with improvements the
models make on their own.

## Decision

- Agent and skill instructions describe **roles, responsibilities and what a
  good result looks like**. They do not prescribe reasoning style, name model
  versions, or add behavioural nudges aimed at a known model weakness.
- Model size is expressed only through the runtime's **tier aliases**
  (Claude Code: `opus`, `sonnet`, `haiku`, `inherit`), which resolve to the
  current model of that tier. The lead runs on the largest general tier; the
  developer on the fast tier; the reviewer on the largest tier with fresh
  context and read-only tools.
- `scripts/check-model-routing.mjs`, `pnpm models:check`, the probe
  delegation and the per-gate routing table are removed. If the lead notices
  it runs on a smaller tier than intended, it tells the owner once and
  continues.
- Other runtimes map the three tiers to their own mechanism
  (`docs/port-to-another-agent.md`); where no tiers exist, all roles run in
  the main session.

## Consequences

The template follows model upgrades without edits. The cost is that routing
is no longer proven at every gate; a wrong `/model` choice is caught by the
lead's own check at session start and by review quality, not by a script.
Rules that previously compensated for a model's habits (for example "do not
infer completion from a document") remain where they describe an outcome the
team owes the owner, and are removed where they only described a model.
