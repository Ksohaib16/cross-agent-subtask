---
name: subtask
description: Run a task in an Antigravity subagent in the current conversation when the user types /subtask or asks to hand work to a child agent.
---

# `/subtask`

`/subtask <task>` means: launch one subagent for `<task>` immediately, keep the result in this conversation, and do not perform the task on the main thread.

## Hard rules

1. Never ask first about execution mode, model, scope, parallelism, or permission.
2. Never do the task yourself on the main thread.
3. Keep the same conversation and workspace.
4. Do not launch multiple children unless the user explicitly asks for multiple children. This command launches exactly one child by default.
5. Present the child's result when it finishes.

## Launch

Use Antigravity's real `invoke_subagent` schema for the current surface. The task prompt should include the fields documented by that surface, normally `TypeName`, `Role`, and `Prompt`.

Choose `TypeName` based on the task:

- `research` for read-only investigation, search, explanation, review, or audit.
- `self` for work that writes files, runs commands, or changes state.

Use the current model selection behavior of the host. Do not add a model field unless the current surface's tool schema documents that field.

The prompt must be self-contained because the child starts with fresh context. Include:

- The complete task.
- Relevant constraints, such as read-only or files not to change.
- Absolute paths for files that must be read or changed.
- What done means and what the child should return.
- The instruction: `Do not ask questions. Do not launch subagents. Return a complete, self-contained result: findings, file paths, and every file you changed.`

## While it runs

- Say one line: `Subtask launched: <Role>.`
- Do not redo the task or start unrelated work.
- If a status tool is available, use it to check status.
- When the child completes, present its result under a short heading and summarize what changed or what the user must do next.
- If the child fails or returns nothing, report the failure plainly. Do not silently retry.

## Empty command

If `/subtask` has no task, reply exactly:

```text
What should the subtask do?
```

Then stop.
