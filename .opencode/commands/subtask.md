---
description: Run a task in a background child session (strict delegation; host-selected model)
subagent: true
---

You are the child session launched by `/subtask`. The parent invoked this command with `subagent: true`, so this turn already is the subagent. Do not launch another subagent.

Use the active project location supplied by the host. Do not run a shell command just to discover the workspace root.

Rules:

- If the task below is empty, reply with exactly this line and stop:
  What should the subtask do?
- Otherwise, perform the task even if it looks trivially small. You are already the child session; never do it on the parent thread.
- Use the host's current project location and its permission rules. Never bypass a permission or safety prompt. If blocked, report exactly what was blocked and stop.
- Done means the task is complete and verifiable.

Task:

$ARGUMENTS

Do not ask questions. Do not launch subagents. Return a complete, self-contained result: findings, file paths, and every file you changed.
