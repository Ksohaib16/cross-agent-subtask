# Antigravity adapters

This repository keeps Antigravity installation profiles separate because Antigravity surfaces and versions do not all use the same customization paths.

## Choose one profile

### Antigravity 2.0 workspace profile

Use the repository's `.agents/` files when you want the command available only in the current workspace:

```text
.agents/skills/subtask/SKILL.md
.agents/rules/subtask-command.md
```

The current Antigravity 2.0 documentation uses `.agents/rules`. Some older surfaces use the legacy singular `.agent/rules` directory. Follow the path documented by the surface you are installing. This profile does not use `skills.json`.

### Antigravity 2.0 global profile

Use the documented global locations if you want the skill available across workspaces:

```text
~/.gemini/config/skills/subtask/SKILL.md
~/.gemini/config/rules/subtask-command.md
```

Copy the corresponding files from `.agents/`. Preserve any existing rule with the same name and merge it deliberately.

### Local AGY profile

Some local AGY configurations use a separate skill catalog at:

```text
~/.gemini/config/agy-skills/
~/.gemini/config/skills.json
```

For that profile, use the files under `antigravity/agy-skills/` and `antigravity/rules/`, then add the catalog directory to the existing `skills.json`.

An absolute path is recommended for a stable registration:

```json
{
  "entries": [
    {
      "path": "/absolute/path/to/cross-agent-subtask/antigravity/agy-skills"
    }
  ]
}
```

This local profile is not presented as the same thing as the documented Antigravity 2.0 skill locations. Do not install both profiles unless you intentionally want duplicate rules or competing skill definitions.

## Safety

- Back up existing global configuration before merging.
- Do not overwrite an existing skill or rule without reviewing the difference.
- Prefer workspace-scoped installation while testing.
- Verify the actual command discovery in the Antigravity surface you use.
