---
name: subtask
description: Run a task in the local Antigravity AGY subagent profile. Use this skill when the user types /subtask or asks to hand work to a child agent.
---

# `/subtask` for the local AGY profile

This adapter targets the local AGY profile that registers a skill catalog through `~/.gemini/config/skills.json`. For the documented Antigravity 2.0 workspace and global skill locations, use the adapters under `.agents/` instead.

`/subtask <task>` means: launch one subagent for `<task>` immediately, keep the result in this conversation, and do not perform the task on the main thread.

## Hard rules

1. Never ask first about execution mode, model, scope, parallelism, or permission.
2. Never do the task yourself on the main thread.
3. Keep the same conversation and workspace.
4. Do not launch multiple children unless the user explicitly asks for multiple children. This command launches exactly one child by default.
5. Present the child's result when it finishes.

## Launch

Call the current AGY surface's real `invoke_subagent` schema. The local profile has been observed to accept this shape:

```json
{
  "Subagents": [
    {
      "Model": "inherit",
      "TypeName": "research",
      "Role": "Short task label",
      "Prompt": "Complete, self-contained task prompt"
    }
  ]
}
```

Use `Model: "inherit"` only when the current AGY tool schema documents it. Otherwise omit the field and let the host select its current model.

Choose `TypeName` based on the task:

- `research` for read-only investigation, search, explanation, review, or audit.
- `self` for work that writes files, runs commands, or changes state.

The prompt must be self-contained because the child starts with fresh context. Include the complete task, constraints, absolute paths, completion criteria, and this instruction:

`Do not ask questions. Do not launch subagents. Return a complete, self-contained result: findings, file paths, and every file you changed.`

## While it runs

- Say one line: `Subtask launched: <Role>.`
- Do not redo the task or start unrelated work.
- Present the result under a short heading when it completes.
- Report failures plainly and do not silently retry.

## Empty command

If `/subtask` has no task, reply exactly:

```text
What should the subtask do?
```

Then stop.
