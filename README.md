# Subtask

A portable `/subtask` command for launching background subagents across AI coding agents.

The goal is simple: make delegation explicit instead of asking the main agent to remember when it should use a subagent.

```text
/subtask Count from 1 to 20 in Roman numerals.
```

The main conversation remains available while the child session works. When the child finishes, its result is reported back in the same conversation.

## Why this exists

Most agent tools have a subagent mechanism, but ordinary instructions such as “please do this in a subagent” are model-discretion instructions. The agent may choose to delegate, or it may do the work directly.

`/subtask` gives the user a first-class workflow for delegation:

- An explicit user action triggers the command.
- The host launches the child session.
- The task is not silently replaced with a plan.
- The main conversation remains usable while the child works.
- One command launches one child by default.

## Supported adapters

This repository includes separate adapters for different agent surfaces:

- **OpenCode V2**, using a native command file with `subagent: true`.
- **Antigravity 2.0**, using the documented workspace or global Agent Skills locations and rules.
- **Local Antigravity AGY profile**, documented separately because it uses a local `skills.json` catalog.

The Antigravity profiles are intentionally separate. Do not install both the documented Antigravity 2.0 adapter and the local AGY profile unless you intentionally want duplicate rules or competing skill definitions.

Claude Code has similar subagent functionality under its own naming and configuration conventions. This repository does not claim that `/subtask` is already registered there.

## Repository layout

```text
.opencode/commands/subtask.md
.agents/skills/subtask/SKILL.md
.agents/rules/subtask-command.md
AGENTS.md
antigravity/README.md
antigravity/agy-skills/subtask/SKILL.md
antigravity/rules/subtask-command.md
antigravity/agy-skills.json.example
prompts/subtask-install-prompt.md
prompts/subtask-command-prompt.md
scripts/validate.mjs
scripts/install-opencode.mjs
```

The OpenCode and Antigravity files are surface-specific adapters. The prompts are for tools whose configuration format must be discovered before installation.

## Install for OpenCode V2

### Project installation

From the root of the project where you want `/subtask` available, run the explicit installer from the repository:

```sh
repo="/path/to/cross-agent-subtask"
node "$repo/scripts/install-opencode.mjs" --project
```

The installer refuses existing command files and symlinked parent directories. It copies `AGENTS.md` only when the target project does not already have one. If an existing `AGENTS.md` is found, the installer leaves it untouched and tells you to merge the binding manually.

### Global installation

To make the command available in every OpenCode project, run the explicit global installer:

```sh
repo="/path/to/cross-agent-subtask"
node "$repo/scripts/install-opencode.mjs" --global
```

The global installer refuses existing command files and symlinked parent directories. It does not modify any project `AGENTS.md`. Review the destination before using global installation.

The global command is available in every project. Add the `AGENTS.md` binding to a project when you want workspace-level enforcement there as well.

### Verify OpenCode

In an OpenCode session from the target project:

1. Run `/subtask` with no task. It should reply exactly:

   ```text
   What should the subtask do?
   ```

2. Run:

   ```text
   /subtask Count from 1 to 10 and return only the numbers.
   ```

3. Confirm that a child session is created, the result returns to the parent conversation, and the parent does not perform the count itself.

`npm test` validates repository structure. It does not replace this client-level smoke test.

## Install for Antigravity 2.0

Antigravity has multiple surfaces and configuration layouts. Choose the profile that matches the Antigravity version and surface you are using.

### Workspace profile

Use the documented workspace locations:

```text
<workspace-root>/.agents/skills/subtask/SKILL.md
<workspace-root>/.agents/rules/subtask-command.md
```

Copy the repository's `.agents/skills/subtask/SKILL.md` and `.agents/rules/subtask-command.md` into the target workspace. The current Antigravity 2.0 documentation uses `.agents/rules`; some older surfaces use the legacy singular `.agent/rules` directory. Follow the path documented by the surface you are installing. This profile does not use `skills.json`.

### Global profile

Use the documented global locations:

```text
~/.gemini/config/skills/subtask/SKILL.md
~/.gemini/config/rules/subtask-command.md
```

Copy the files from the repository's `.agents/` directory. If a rule already exists at the destination, merge it deliberately instead of overwriting it.

### Local AGY profile

Some local AGY configurations use:

```text
~/.gemini/config/agy-skills/
~/.gemini/config/skills.json
```

For that profile, use the files under `antigravity/agy-skills/` and `antigravity/rules/`, then add the skill catalog to the existing `skills.json`.

The repository recommends an absolute path for a stable catalog entry:

```json
{
  "entries": [
    {
      "path": "/absolute/path/to/cross-agent-subtask/antigravity/agy-skills"
    }
  ]
}
```

An absolute path avoids resolution ambiguity. It is a recommendation for this local profile, not a universal requirement for every Antigravity surface.

See [`antigravity/README.md`](antigravity/README.md) before mixing profiles.

### Verify Antigravity

Use an interactive session for the Antigravity surface you installed:

1. Run `/subtask` with no task. It should reply exactly:

   ```text
   What should the subtask do?
   ```

2. Run:

   ```text
   /subtask Count from 1 to 10 and return only the numbers.
   ```

3. Confirm that one child session is created, the result returns to the same conversation, and the parent does not perform the count itself.

If a surface supports a print or non-interactive mode, use that surface's documented syntax for an additional smoke test. Do not assume that every Antigravity version exposes the same CLI flags.

## Guided installation

If you do not want to copy files manually, give your agent the repository and ask it to use the guided prompt:

[`prompts/subtask-install-prompt.md`](prompts/subtask-install-prompt.md)

You can also provide this instruction:

```text
Read the cross-agent-subtask repository and install the /subtask command for this agent. Inspect the harness before changing files, prefer workspace scope, preserve existing configuration, preview exact destinations, ask before any global write, use the correct native mechanism, and verify the command with a real subagent launch. Do not delete or overwrite unrelated configuration.
```

The guided prompt is intentionally conservative. It asks the agent to discover the current harness instead of assuming that every tool uses the same configuration paths.

## How it works

### OpenCode V2

`/.opencode/commands/subtask.md` uses OpenCode's command frontmatter:

```yaml
subagent: true
```

The command does not select a separate built-in agent or run a shell block merely to discover the project path. The host applies its configured model and permission rules.

### Antigravity 2.0

`/.agents/skills/subtask/SKILL.md` contains the behavior using Antigravity's `invoke_subagent` tool. The rule in `/.agents/rules/subtask-command.md` asks the parent to load the skill and launch one child.

The exact tool schema can vary by Antigravity surface. The skill uses documented fields where possible and tells the agent to use the current surface's real schema.

### Local AGY profile

The files under `antigravity/` include the locally observed AGY adapter and its optional `skills.json` example. They are documented as a separate compatibility profile, not as the documented Antigravity 2.0 layout.

See [`docs/architecture.md`](docs/architecture.md) for the complete design.

## Examples

```text
/subtask Count from 1 to 20 in Roman numerals.
```

```text
/subtask Inspect the README and summarize the installation steps. Do not modify files.
```

```text
/subtask Run `sleep 30`, then tell me when the 30 seconds are complete.
```

For the final example, the main conversation can continue while the child session is running. The result should appear when the child finishes.

## Security and permissions

This project does not bypass agent permissions. A subagent receives the permissions and tools available to it through the host application.

Before installing it:

- Read the command, skill, rule, and prompt files.
- Install only the adapter for the client and surface you use.
- Back up existing configuration before merging `AGENTS.md`, rules, or skill catalogs.
- Do not put API keys, tokens, private files, or credentials in prompts or task descriptions.
- Review any task that allows shell commands or file edits.
- Remember that `/subtask` is a delegation workflow, not a safety boundary.
- Do not assume that a child automatically has the same permissions as a more restricted parent agent. Check the host's permission model.

The repository intentionally does not include an automatic installer that silently changes global configuration. The guided prompt asks the agent to preserve unrelated files, preview destinations, and show what it changed.

## Validate the repository

This repository has a dependency-free validation script:

```sh
npm test
```

The validator checks required adapters, registration examples, prompts, and security documentation. It does not replace testing the command inside each client surface.

## Contributions

This project is published for people to use, install, and star. It is not accepting outside contributions, and pull requests will not be reviewed or merged.

## License

MIT. See [`LICENSE`](LICENSE).
