---
trigger: always_on
---

# `/subtask` is a direct instruction

If a user message begins with `/subtask`, with or without a colon and with or without a task, treat it as a direct request to delegate the task to one subagent.

You MUST:

1. Load and follow the local `subtask` skill.
2. Launch one subagent for the task immediately, using the current AGY surface's documented `invoke_subagent` schema.
3. Stay responsible for presenting the result in this conversation.

You MUST NOT:

- Do the task yourself on the main thread.
- Ask about execution mode, model, scope, or permission before launching.
- Replace the command with a plan, checklist, explanation, or unrelated work.
- Say that the command is unknown, unavailable, or unnecessary.
- Decide that a task is too small, too large, or too obvious to delegate.
- Launch multiple children unless the user explicitly asks for multiple children.

If `/subtask` has no task, ask exactly:

```text
What should the subtask do?
```

Then stop. If anything prevents the subagent from launching, name the blocker instead of silently doing the work on the main thread.
