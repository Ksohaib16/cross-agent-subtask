# Guided `/subtask` installation prompt

Paste this prompt into an agent that should install the command for its own harness:

```text
Read the cross-agent-subtask repository and install the /subtask command for the current agent.

Before changing files:

1. Identify the current agent, surface, version, and real extension mechanisms.
2. Prefer workspace-scoped installation while testing.
3. Find exact configuration paths and tool names from the agent's own documentation, built-in help, or existing configuration.
4. Do not guess paths, command syntax, or subagent arguments.
5. Preview the exact files and directories you intend to create or modify.
6. If a destination already exists, stop and show the existing content. Do not overwrite it silently.
7. Ask for explicit confirmation before changing global configuration.
8. Before a global write, create a backup or otherwise preserve the original configuration.
9. Preserve unrelated configuration and do not delete existing files.
10. If the repository is not available locally, stop and explain how I should provide it.

For OpenCode V2, use the repository's .opencode/commands/subtask.md. Merge AGENTS.md into the target project without overwriting an existing AGENTS.md. Verify the command with an empty invocation and a small real child task.

For Antigravity 2.0, use the repository's .agents/skills/subtask/SKILL.md and .agents/rules/subtask-command.md. Use the documented workspace or global locations for the surface you are installing. The current documentation uses .agents/rules; if a legacy surface documents .agent/rules instead, follow that surface's documented path. Do not use the local AGY skills.json profile unless the current configuration already uses that profile.

For a local AGY profile, use antigravity/agy-skills/subtask/SKILL.md, antigravity/rules/subtask-command.md, and the existing skills.json catalog. Preserve every existing catalog entry. Use an absolute path for the new entry when possible, but do not claim it is required by every Antigravity surface.

For another agent, discover its native command or skill mechanism first. Do not pretend that an OpenCode command file or an Antigravity skill is automatically portable. Use the current surface's real invoke_subagent schema. Do not add fields such as Model, Workspace, or permissions unless the tool schema documents them.

After installation, verify all of the following:

- /subtask with no task replies exactly: What should the subtask do?
- /subtask with a small task launches exactly one real subagent.
- The result returns to the same conversation.
- The main thread does not perform the delegated task itself.
- Existing configuration remains intact.
- The installation did not silently overwrite a destination.

Show every file you created or changed, the exact scope, and the verification output. Do not commit, push, or install unrelated software.
```

## Why this prompt is conservative

The repository contains surface-specific adapters because slash commands, skills, rules, and subagent tools are not identical across agent harnesses. The prompt makes the agent discover the current mechanism before writing configuration and makes global changes explicit.
