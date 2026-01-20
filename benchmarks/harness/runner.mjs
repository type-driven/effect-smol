#!/usr/bin/env node

import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const TSX_LOADER = join(ROOT, "node_modules/tsx/dist/esm/index.cjs")
const RUNNER = join(__dirname, "run.ts")

const proc = spawn("node", ["--import", TSX_LOADER, RUNNER, ...process.argv.slice(2)], {
  cwd: ROOT,
  stdio: "inherit"
})

proc.on("exit", (code) => {
  process.exit(code ?? 1)
})
