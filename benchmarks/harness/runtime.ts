import { type ChildProcess, execFileSync, spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Platform } from "./types.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const REPO_ROOT = join(ROOT, "..")
const TSX_LOADER = join(ROOT, "node_modules/tsx/dist/esm/index.cjs")

const runtimeCommand: Record<Platform, string> = {
  node: "node",
  bun: "bun",
  deno: "deno"
}

function hasRuntime(platform: Platform): boolean {
  try {
    execFileSync(runtimeCommand[platform], ["--version"], { stdio: ["pipe", "pipe", "pipe"] })
    return true
  } catch {
    return false
  }
}

export function resolvePlatforms(platforms: ReadonlyArray<Platform>): Array<Platform> {
  const missing = platforms.filter((platform) => !hasRuntime(platform))
  if (missing.length > 0) {
    throw new Error(
      `Missing runtime(s): ${missing.join(", ")}. Install them or rerun with --platform ${
        platforms.filter((platform) => hasRuntime(platform)).join(",") || "node"
      }.`
    )
  }
  return [...platforms]
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function startServer(platform: Platform, scenario: string): ChildProcess {
  const serverFile = join(ROOT, "scenarios", scenario, `server-${platform}.ts`)

  switch (platform) {
    case "node":
      return spawn("node", ["--import", TSX_LOADER, serverFile], {
        cwd: ROOT,
        stdio: "pipe"
      })
    case "bun":
      return spawn("bun", ["run", serverFile], {
        cwd: ROOT,
        stdio: "pipe"
      })
    case "deno":
      return spawn("deno", [
        "run",
        "--allow-net",
        "--allow-read",
        "--allow-env",
        "--allow-sys",
        serverFile
      ], {
        cwd: REPO_ROOT,
        stdio: "pipe"
      })
  }
}

export async function stopServer(proc: ChildProcess): Promise<void> {
  if (proc.exitCode !== null) {
    return
  }

  proc.kill("SIGTERM")
  await sleep(500)

  if (proc.exitCode === null) {
    proc.kill("SIGKILL")
    await sleep(200)
  }
}
