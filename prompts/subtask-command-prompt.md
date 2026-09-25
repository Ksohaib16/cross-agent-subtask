# Portable prompt: build a strict `/subtask` command

Use this prompt when you want an agent to build or install the behavior in a harness that is not already covered by a native adapter in this repository.

Replace `TARGET_HARNESS` and `COMMAND_NAME` with the current values. Do not assume that the OpenCode or Antigravity file format applies to another tool.

```text
TARGET HARNESS: <name of the current agent and surface>
COMMAND NAME: /subtask

Build a strict /subtask <task> command that launches exactly one subagent in the current conversation, does not ask clarifying questions before launching, and reports the child's result in the same thread.

Work in phases.

Phase 1: Discover this harness
- Find the official documentation, built-in help, configuration directories, and available tools.
- Identify the first-class slash-command mechanism, if one exists.
- Identify the native skill or always-on instruction mechanism, if one exists.
- Identify the real subagent tool name and argument schema from the tool list or a real session.
- Identify global and project-level configuration roots and precedence.
- Show the evidence you used. Do not guess.

Phase 2: Inventory existing behavior
- Search the current global and workspace configuration for existing delegate, task, agent, spawn, or subtask commands.
- List each relevant file and whether it appears active.
- Do not delete anything. Preserve unrelated configuration.

Phase 3: Build
- Create a first-class command when the harness supports one.
- Add the shortest reliable always-on enforcement rule when the harness can load one.
- Make /subtask with no task reply exactly: What should the subtask do?
- For a task, launch exactly one child by default.
- Do not answer the task on the main thread.
- Use the current model behavior of the host. Do not add model fields unless the current tool schema documents them.
- Give the child a self-contained prompt with absolute paths and clear completion criteria.
- Tell the child not to ask questions or launch more subagents.
- Present the result in the same conversation when it completes.
- Require explicit user opt-in before launching multiple children.

Phase 4: Install safely
- Prefer workspace scope while testing.
- Preview exact destinations before writing.
- Refuse to overwrite an existing file without showing its contents and receiving confirmation.
- Ask before any global configuration change.
- Back up global files before modifying them.
- Preserve unrelated settings and catalog entries.
- Do not install unrelated software.

Phase 5: Verify empirically
- Run /subtask with no arguments and show the exact response.
- Run a small read-only task and show the actual subagent launch and child session.
- Verify that the parent did not perform the task.
- If verification fails, diagnose and fix the failing step.
- Report what was verified and what was not.

Do not bypass permissions, delete configuration, commit, or push. If a required mechanism is unavailable, name the blocker instead of pretending the command works.
```
