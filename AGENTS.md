# `/subtask` binding

- `/subtask` is a direct delegation command, not a request for the parent to decide whether delegation is useful.
- In OpenCode, the native command is `.opencode/commands/subtask.md` with `subagent: true`.
- In Antigravity, the native adapter is the registered `subtask` skill plus the always-on rule in the Antigravity adapter.
- A task passed to `/subtask` must run in a child session, even when it looks trivial.
- Do not answer the task on the parent thread, replace it with a plan, or ask for execution details before launching the child.
- If no task is provided, reply exactly: `What should the subtask do?`
- The host normally uses the active session model, but configured command or agent model overrides still apply.
- If the command cannot launch a subagent, name the blocker instead of silently doing the work on the parent thread.
