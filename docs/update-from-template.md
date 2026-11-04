# Updating a project from the template

GitHub templates copy files once; nothing keeps a project in sync afterwards.
mvp-starter therefore declares which paths it **owns** in
`.mvp-starter/manifest.json` (`template_owned_paths`): the team's way of
working, not the product. Owners say "update the team process from the
template" and the `team` skill does the following. Engineers can do the same
by hand (bottom).

## What the team does

1. Read `.mvp-starter/manifest.json`: `template`, `template_version`, `stack`,
   `template_owned_paths`, `project_owned_exceptions`.
2. Fetch the template's `main`:
   `git fetch https://github.com/<template>.git main` (or `gh repo clone` into
   the scratchpad). Read its manifest and compare versions. If the constitution
   version is a MAJOR bump, read the template's ADRs since the project's
   version and tell the owner in plain words what changes before touching
   files.
3. On a new branch (`chore/template-<new version>`), replace every path in
   `template_owned_paths` with the template's copy. Respect
   `project_owned_exceptions`: for `.specify/memory/constitution.md` that
   means keeping the project's "Project amendments" section verbatim and
   keeping the "Project working rules" section of `AGENTS.md`. Never touch
   anything outside the owned paths (product code, specs, STATUS, journal,
   retro, product ADRs, CI secrets).
4. Update `template_version` and `spec_kit_version` in the project's manifest;
   keep `owner_experience`, `stack` and project-specific keys.
5. Run `pnpm verify`. The only stack-specific files in the owned paths are
   `scripts/ship.mjs` and `.github/workflows/ci.yml`; if the template changed
   anything else in the stack layer, that is a separate, explained change,
   not part of an update.
6. Tell the owner, in plain words, what changed in how the team works (for
   example: "round reports now include screenshots", "new question at the
   start about publishing"). Then follow the publish choice: local commit, or
   PR for review, or merge.

## Spec Kit upgrades

Spec Kit's generated files (`.specify/scripts/`, `.specify/templates/*.md`,
`.claude/skills/speckit-*`, state files) are template-owned, so a Spec Kit
upgrade reaches projects through this same update. On the template side the
maintainer runs `specify init --here --force --integration claude --script sh`
with the new version in a scratch copy, re-diffs the core `tasks-template.md`
against `.specify/templates/overrides/tasks-template.md`, commits the result,
and records the version in the manifest ([ADR 010](adr/010-vendored-spec-kit.md)).

## By hand

```sh
git remote add template https://github.com/markusrt/mvp-starter.git
git fetch template main
git checkout -b chore/template-update
# for each owned path:
git checkout template/main -- AGENTS.md .claude/skills .specify/scripts ...
# then restore the project-owned sections by hand, run pnpm verify, commit.
```
