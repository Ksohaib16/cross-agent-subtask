import { copyFileSync, existsSync, lstatSync, mkdirSync, realpathSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sourceCommand = join(sourceRoot, ".opencode/commands/subtask.md")
const sourceAgents = join(sourceRoot, "AGENTS.md")
const scope = process.argv[2]

if (scope !== "--project" && scope !== "--global") {
  console.error("Usage: node scripts/install-opencode.mjs --project | --global")
  process.exit(1)
}

function pathExists(path) {
  try {
    lstatSync(path)
    return true
  } catch (error) {
    if (error.code === "ENOENT") return false
    throw error
  }
}

function isWithin(root, target) {
  const pathFromRoot = relative(root, target)
  return pathFromRoot === "" || (pathFromRoot !== ".." && !pathFromRoot.startsWith(`..${sep}`) && !isAbsolute(pathFromRoot))
}

function ensureSafeDirectory(root, directory) {
  const realRoot = realpathSync(root)
  const pathFromRoot = relative(realRoot, directory)
  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    throw new Error(`Refusing directory outside the intended root: ${directory}`)
  }

  let current = realRoot
  for (const part of pathFromRoot.split(sep).filter(Boolean)) {
    current = join(current, part)
    if (pathExists(current)) {
      if (lstatSync(current).isSymbolicLink()) throw new Error(`Refusing symlinked directory: ${current}`)
      if (!lstatSync(current).isDirectory()) throw new Error(`Refusing non-directory path: ${current}`)
    } else {
      mkdirSync(current)
    }
  }

  if (!isWithin(realRoot, realpathSync(current))) {
    throw new Error(`Refusing directory outside the intended root: ${current}`)
  }
}

function copyWithoutOverwrite(source, destination) {
  if (pathExists(destination)) {
    throw new Error(`Refusing to overwrite existing path: ${destination}`)
  }
  copyFileSync(source, destination)
  console.log(`Installed: ${destination}`)
}

const projectRoot = scope === "--project" ? realpathSync(process.cwd()) : realpathSync(homedir())
const commandDirectory = scope === "--project"
  ? join(projectRoot, ".opencode", "commands")
  : join(projectRoot, ".config", "opencode", "commands")

ensureSafeDirectory(projectRoot, commandDirectory)
copyWithoutOverwrite(sourceCommand, join(commandDirectory, "subtask.md"))

if (scope === "--project") {
  const destination = join(projectRoot, "AGENTS.md")
  if (pathExists(destination)) {
    console.log(`Kept existing file: ${destination}`)
    console.log("Merge the /subtask binding manually after reviewing the existing instructions.")
  } else {
    copyWithoutOverwrite(sourceAgents, destination)
  }
}
