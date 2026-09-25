# Architecture

## The shared behavior

The user-facing behavior is the same across adapters:

1. The user invokes `/subtask <task>`.
2. The host recognizes the command or skill.
3. One child session launches immediately.
4. The child receives a self-contained task.
5. The child works with the permissions available to it.
6. The result returns to the parent conversation.
7. The parent does not silently perform the delegated task itself.

Exactly one child is launched by default. Parallel children require an explicit user request because independent tasks can still conflict on files, generated output, or external state.

## OpenCode V2 adapter

OpenCode uses a native command file:

```text
.opencode/commands/subtask.md
```

The frontmatter contains:

```yaml
subagent: true
```

`subagent: true` tells OpenCode to run the command in a child session. The command does not select a separate built-in agent or run a shell block merely to discover the workspace path. The host's active project location and configured model and permission rules are used.

The root `AGENTS.md` file provides a workspace enforcement layer. It tells the parent agent that `/subtask` is a direct command rather than an optional suggestion.

## Antigravity 2.0 adapter

The documented Antigravity 2.0 workspace profile uses:

```text
.agents/skills/subtask/SKILL.md
.agents/rules/subtask-command.md
```

The current documentation uses `.agents/rules`; some older surfaces use the legacy `.agent/rules` path. The repository does not assume that those surfaces are interchangeable.

The skill contains the launch workflow. The always-on rule asks the parent agent to load the skill and launch one child. This is instruction-enforced delegation through Antigravity's customization system, not a claim that every Antigravity surface behaves identically.

The documented global profile uses:

```text
~/.gemini/config/skills/subtask/SKILL.md
~/.gemini/config/rules/subtask-command.md
```

## Local AGY compatibility profile

The repository also includes the profile observed on the local machine:

```text
antigravity/agy-skills/subtask/SKILL.md
antigravity/rules/subtask-command.md
antigravity/agy-skills.json.example
```

That profile uses a local `skills.json` catalog. It is kept separate because it is not the same documented Antigravity 2.0 workspace layout. The example uses an absolute path to avoid resolution ambiguity, but users must preserve their existing catalog entries.

## Why there are adapters

The name `/subtask` is the common user experience, but command metadata, skill registration, enforcement rules, and subagent tool arguments are not universal. The repository keeps the common behavior and the surface-specific implementation separate.

## Safety boundary

The command is a workflow convenience, not a security boundary. A child session may still be able to read, edit, or execute according to the host's permissions. Users must review the task and the adapter before installation.

The repository does not include an automatic global installer because a silent configuration change is harder to review and can overwrite user settings.
