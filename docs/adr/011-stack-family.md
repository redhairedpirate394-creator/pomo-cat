# ADR 011: One stack per template, a family of sibling templates

Status: accepted by the repository owner on 2026-11-01. Paves a route; this
repository stays the web template.

## Context

The owner wants to offer a choice of app kinds over time: the current web app
(Vite/React/TypeScript, phones and desktops), a plain command-line tool, a
command-line tool with a UI (as in markusrt/media-web-downloader), desktop
apps (platform-agnostic or Windows/Linux/web specific), and games (Godot,
Unity, Unreal). The process layer (owner's loop, rounds, Spec Kit, team roles)
is the same for all of them; the stack layer (skeleton, toolchain, CI runners,
what "running software" means, how it is published) is not. Game templates in
particular carry heavy CI runners and asset pipelines that a web template
should not inherit.

Options considered: one repository with a `stacks/` folder and a picker; a
plugin system inside one repository; sibling template repositories sharing
the process layer.

## Decision

- Each app kind is its **own template repository** named
  `mvp-starter-<kind>` (for example `mvp-starter-cli`, `mvp-starter-desktop`,
  `mvp-starter-game-godot`). This repository stays the web template and, once
  siblings exist, becomes the front door that lists them.
- Every sibling carries the same **process layer** — the
  `template_owned_paths` of ADR 010 — and refreshes it from this repository
  with the same update mechanism. The stack layer is each sibling's own.
- `.mvp-starter/manifest.json` carries `stack` (`web` here) and
  `stack_label`, the plain-language name the bootstrap uses ("a web app that
  works on phones and desktops, opened in a browser, nothing to install").
- Until siblings exist, the bootstrap offers one kind and says that others
  are coming.

## Consequences

Templates stay small and each kind can have the CI and tooling it needs. The
process layer must stay stack-neutral: nothing in the owned paths may assume
Vite, pnpm or GitHub Pages except where the file is explicitly stack-specific
(`scripts/ship.mjs`, `.github/workflows/ci.yml`, the stack section of
AGENTS.md); when the first sibling is created those parts move out of the
owned list or get a stack-specific home. The constitution's principle VI
("Build on the shipped foundation") is written to allow this.
