# ADR 010: Vendored Spec Kit and template-owned paths

Status: accepted by the repository owner on 2026-11-01. Amends ADR 004
(installation and upgrade path).

## Context

ADR 004 had each product run `specify init --here --force --integration claude
--script sh` after creating the repository, which needs Python and uv on the
owner's machine and was the most technical step in the README's main path.
The template already maintained a full copy of Spec Kit's `tasks-template.md`
as its override, so a pinned copy was being maintained anyway. GitHub's
template mechanism copies once, so projects had no way to receive later
process improvements.

## Decision

- The output of `specify init` for specify-cli **1.2.1** (`.specify/scripts/bash/`,
  `.specify/templates/*.md`, `.specify/workflows/`, state files,
  `.claude/skills/speckit-*`) is committed in the template. The copy is
  verified against `.specify/integrations/claude.manifest.json` hashes. Nobody
  runs `specify init` in a product.
- `.mvp-starter/manifest.json` records the template name and version, the
  stack, the owner experience setting, minimum tool versions, and
  `template_owned_paths`: the process layer (agents, skills, Spec Kit files,
  constitution, AGENTS.md, templates, appendix docs, ship script, CI, issue
  templates). `project_owned_exceptions` names the sections inside owned files
  that belong to the project (constitution "Project amendments"; by
  convention also AGENTS.md "Project working rules").
- "Update from template" (`docs/update-from-template.md`, `team` skill)
  refreshes owned paths only, through a normal round.
- Spec Kit upgrades are a template maintainer task: regenerate in a scratch
  copy, re-diff the core tasks template against the override, bump the
  manifest; products receive it through the update.

## Consequences

A repository created from the template works immediately with Node, pnpm,
Git, the GitHub CLI and Claude Code. Spec Kit versions are frozen per template
version; a product cannot pick a newer Spec Kit on its own without leaving the
owned paths (which the update would then overwrite — an ADR in the product
should record such a departure). The owned-paths list is the contract between
template and project; adding a path to it later is a MINOR template change
that the update explains to the owner.
