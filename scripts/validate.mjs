import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(fileURLToPath(new URL("..", import.meta.url)))
const failures = []

function check(condition, message) {
  if (!condition) failures.push(message)
}

function read(relativePath) {
  const fullPath = join(root, relativePath)
  check(existsSync(fullPath), `Missing required file: ${relativePath}`)
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : ""
}

function listFiles(directory) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue
    const fullPath = join(directory, entry.name)
    if (entry.isSymbolicLink()) {
      check(false, `Symbolic links are not allowed in the repository: ${relative(root, fullPath)}`)
    } else if (entry.isDirectory()) {
      files.push(...listFiles(fullPath))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }
  return files
}

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  ".opencode/commands/subtask.md",
  ".agents/skills/subtask/SKILL.md",
  ".agents/rules/subtask-command.md",
  "antigravity/README.md",
  "antigravity/agy-skills/subtask/SKILL.md",
  "antigravity/rules/subtask-command.md",
  "antigravity/agy-skills.json.example",
  "prompts/subtask-install-prompt.md",
  "prompts/subtask-command-prompt.md",
  "docs/architecture.md",
  "LICENSE",
  "scripts/validate.mjs",
  "scripts/install-opencode.mjs",
]

for (const file of requiredFiles) read(file)

const opencodeCommand = read(".opencode/commands/subtask.md")
check(opencodeCommand.includes("subagent: true"), "OpenCode adapter must set subagent: true")
check(opencodeCommand.includes("$ARGUMENTS"), "OpenCode adapter must pass $ARGUMENTS")
check(!opencodeCommand.includes("agent: general"), "OpenCode adapter must not escalate to the broad general agent")
check(!opencodeCommand.includes("!`"), "OpenCode adapter must not execute a shell expansion block")

const agents = read("AGENTS.md")
check(agents.includes("/subtask"), "AGENTS.md must bind /subtask")
check(agents.includes("child session"), "AGENTS.md must require a child session")
check(agents.includes("Antigravity"), "AGENTS.md must describe the Antigravity adapter")

for (const skillPath of [
  ".agents/skills/subtask/SKILL.md",
  "antigravity/agy-skills/subtask/SKILL.md",
]) {
  const skill = read(skillPath)
  check(skill.includes("name: subtask"), `${skillPath} must declare name: subtask`)
  check(skill.includes("description:"), `${skillPath} must include a description`)
  check(skill.includes("invoke_subagent"), `${skillPath} must use invoke_subagent`)
  check(skill.includes("TypeName"), `${skillPath} must document subagent type selection`)
  check(skill.includes("exactly one child") || skill.includes("exactly one"), `${skillPath} must require one child by default`)
}

const officialRule = read(".agents/rules/subtask-command.md")
check(officialRule.includes("trigger: always_on"), "Official Antigravity rule must be always_on")
check(officialRule.includes("MUST"), "Official Antigravity rule must contain enforcement language")

const legacyRule = read("antigravity/rules/subtask-command.md")
check(legacyRule.includes("trigger: always_on"), "Local AGY rule must be always_on")
check(legacyRule.includes("MUST"), "Local AGY rule must contain enforcement language")

for (const jsonPath of ["antigravity/agy-skills.json.example", "package.json"]) {
  try {
    JSON.parse(read(jsonPath))
  } catch (error) {
    check(false, `${jsonPath} must contain valid JSON: ${error.message}`)
  }
}

const skillsExample = read("antigravity/agy-skills.json.example")
check(skillsExample.includes("/absolute/path/to/cross-agent-subtask"), "AGY example must include an absolute placeholder path")
check(!skillsExample.includes("~/"), "AGY example must not use a home-relative path")

const readme = read("README.md")
for (const term of [
  "OpenCode V2",
  "Antigravity 2.0",
  "Local Antigravity AGY profile",
  "subagent: true",
  "invoke_subagent",
  "Security and permissions",
  "Back up existing configuration",
  "Do not put API keys",
  "not a safety boundary",
]) {
  check(readme.includes(term), `README.md must mention ${term}`)
}

const allFiles = listFiles(root)
for (const file of allFiles) {
  const relativePath = relative(root, file)
  check(!lstatSync(file).isSymbolicLink(), `Symbolic links are not allowed: ${relativePath}`)
  const text = readFileSync(file, "utf8")
  check(!/\/(?:Users|home)\/[^\/\s"'`]+/.test(text), `${relativePath} must not contain a personal absolute path`)
  check(!/\bsk-[A-Za-z0-9]{20,}\b/.test(text), `${relativePath} must not contain an API-key-like string`)
  check(!/\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}\b/.test(text), `${relativePath} must not contain a GitHub-token-like string`)
  check(!/\bAIza[0-9A-Za-z_-]{20,}\b/.test(text), `${relativePath} must not contain a Google API-key-like string`)
  check(!/-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(text), `${relativePath} must not contain private-key material`)
}

if (failures.length > 0) {
  console.error("Validation failed:")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Validation passed: ${requiredFiles.length} required files and ${allFiles.length} repository files checked.`)
}
