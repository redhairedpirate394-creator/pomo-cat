# Running the team on another agent

Claude Code is the runtime the template is tested with. The engine underneath
(Spec Kit, the constitution, the round loop) is plain text and works anywhere;
what is Claude Code specific is the packaging: `.claude/skills/*` (skills),
`.claude/agents/*` (subagents with `model:` tier aliases), and the `@AGENTS.md`
import in `CLAUDE.md`.

Paste the prompt below into the agent you want to use, in the repository. It
rewrites the packaging; the rules stay the same.

```text
Port this repository's agent setup from Claude Code to <AGENT NAME>. Keep
every rule and every text unchanged unless a mechanism does not exist in the
target.

1. Read .mvp-starter/manifest.json, AGENTS.md, .specify/memory/constitution.md,
   .claude/skills/*/SKILL.md and .claude/agents/*.md.
2. Instructions file: <AGENT NAME> reads <its instructions file, e.g.
   AGENTS.md directly / .cursor/rules / .github/copilot-instructions.md>. Make
   sure AGENTS.md is what it loads (symlink, import, or copy with a header
   saying AGENTS.md is canonical).
3. Spec Kit commands: regenerate the speckit commands for this agent with
   `specify init --here --force --integration <key> --script sh` (specify-cli
   1.2.1; `specify integration list` shows keys), keeping
   .specify/templates/overrides/tasks-template.md and
   .specify/memory/constitution.md untouched. Commit as
   `chore: add Spec Kit commands for <AGENT NAME>`.
4. Skills: translate each .claude/skills/<name>/SKILL.md into the target's
   equivalent (rules file, custom command, prompt file). Where the target has
   no skill mechanism, append them as sections to AGENTS.md under
   "## Skills (inlined for <AGENT NAME>)" and reference them by name from the
   procedures that call them.
5. Roles: translate .claude/agents/developer.md and reviewer.md into the
   target's subagent or custom-agent mechanism, keeping the role split (lead
   / developer / reviewer), the read-only constraint on the reviewer, and the
   model TIER (large / fast), never a model version. If the target has no
   subagents, say so in AGENTS.md "Roles and models" and let the lead perform
   the developer and reviewer procedures itself in a fresh pass.
6. Update AGENTS.md "Roles and models" and README "What you need" item 6 to
   name <AGENT NAME>, and add a line to .mvp-starter/manifest.json:
   "agent_runtime": "<key>".
7. Run pnpm verify. Report what could not be translated one-to-one.
8. Note in docs/adr/ that the Spec Kit files and the target's instruction
   files now differ from the template's owned paths; "update from template"
   must re-apply steps 2-6 after each update (or the project drops those
   paths from template_owned_paths in its manifest).
```

What you lose without subagents: the independent reviewer with fresh context
(the lead reviews its own work in a second pass, which is weaker), and
parallel routine tasks. What you keep: everything the owner sees.
