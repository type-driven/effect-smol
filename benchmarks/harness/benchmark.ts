import autocannon from "autocannon"
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { getScenarioConfig } from "./config.ts"
import { writeStdout } from "./io.ts"
import type { BenchmarkResult, BenchmarkSuite, Platform } from "./types.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
export const RESULTS_DIR = join(__dirname, "..", "results")

export interface BenchmarkRunOptions {
  platform: Platform
  scenario: string
  port: number
  duration: number
  connections: number
  pipelining: number
  suite?: BenchmarkSuite
  warmupDuration?: number
  waitTimeoutMs?: number
  skipReadinessCheck?: boolean
}

export const defaultWarmupDuration = (platform: Platform): number => platform === "bun" || platform === "deno" ? 10 : 5

export const shouldTrackProgress = (): boolean => process.env.BENCHMARK_RENDER_PROGRESS === "1"

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function tryExec(cmd: string, args: Array<string>): string | undefined {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim()
  } catch {
    return undefined
  }
}

function buildRequest(scenario: string): autocannon.Request {
  const config = getScenarioConfig(scenario)
  return {
    method: config.method as autocannon.Request["method"],
    path: config.path,
    headers: config.headers,
    body: config.body
  }
}

export function getVersions(): { nodeVersion?: string; bunVersion?: string; denoVersion?: string } {
  return {
    nodeVersion: tryExec("node", ["--version"]),
    bunVersion: tryExec("bun", ["--version"]),
    denoVersion: tryExec("deno", ["--version"])?.split("\n")[0].replace("deno ", "") ?? undefined
  }
}

export async function waitForServer(port: number, scenario: string, timeoutMs = 10_000): Promise<void> {
  const config = getScenarioConfig(scenario)
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`http://localhost:${port}${config.path}`, {
        signal: AbortSignal.timeout(1_000),
        method: config.method,
        headers: config.headers,
        body: config.body
      })
      if (response.ok || response.status < 500) {
        return
      }
    } catch {
      // server not ready yet
    }

    await sleep(200)
  }

  throw new Error(`Server on port ${port} did not become ready within ${timeoutMs}ms`)
}

export async function runAutocannon(opts: {
  url: string
  scenario: string
  connections: number
  duration: number
  pipelining: number
}): Promise<autocannon.Result> {
  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url: opts.url,
        connections: opts.connections,
        duration: opts.duration,
        pipelining: opts.pipelining,
        requests: [buildRequest(opts.scenario)]
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      }
    )

    if (shouldTrackProgress()) {
      autocannon.track(instance, { renderProgressBar: true })
    }
  })
}

export function toBenchmarkResult(
  raw: autocannon.Result,
  opts: Omit<BenchmarkRunOptions, "warmupDuration" | "waitTimeoutMs" | "skipReadinessCheck">
): BenchmarkResult {
  return {
    scenario: opts.scenario,
    platform: opts.platform,
    suite: opts.suite ?? "benchmark",
    ...getVersions(),
    timestamp: new Date().toISOString(),
    config: {
      connections: opts.connections,
      duration: opts.duration,
      pipelining: opts.pipelining
    },
    results: {
      requests: {
        total: raw.requests.total,
        average: raw.requests.average,
        mean: raw.requests.mean,
        stddev: raw.requests.stddev,
        min: raw.requests.min,
        max: raw.requests.max,
        p50: raw.requests.p50,
        p95: raw.requests.p95,
        p99: raw.requests.p99
      },
      latency: {
        average: raw.latency.average,
        mean: raw.latency.mean,
        stddev: raw.latency.stddev,
        min: raw.latency.min,
        max: raw.latency.max,
        p50: raw.latency.p50,
        p95: raw.latency.p95,
        p99: raw.latency.p99
      },
      throughput: {
        average: raw.throughput.average,
        mean: raw.throughput.mean,
        stddev: raw.throughput.stddev,
        min: raw.throughput.min,
        max: raw.throughput.max
      },
      errors: raw.errors,
      timeouts: raw.timeouts
    }
  }
}

export async function runBenchmark(opts: BenchmarkRunOptions): Promise<BenchmarkResult> {
  const url = `http://localhost:${opts.port}`
  const warmupDuration = opts.warmupDuration ?? defaultWarmupDuration(opts.platform)

  if (opts.skipReadinessCheck !== true) {
    writeStdout(`\nWaiting for server on port ${opts.port}...`)
    await waitForServer(opts.port, opts.scenario, opts.waitTimeoutMs)
    writeStdout("Server is ready.")
  }

  if (warmupDuration > 0) {
    writeStdout(`\nWarming up for ${warmupDuration} seconds...`)
    await runAutocannon({
      url,
      scenario: opts.scenario,
      connections: opts.connections,
      duration: warmupDuration,
      pipelining: opts.pipelining
    })
  }

  writeStdout(
    `\nRunning benchmark: suite=${opts.suite ?? "benchmark"} scenario=${opts.scenario} platform=${opts.platform}`
  )
  writeStdout(`  connections=${opts.connections} duration=${opts.duration}s pipelining=${opts.pipelining}`)

  const raw = await runAutocannon({
    url,
    scenario: opts.scenario,
    connections: opts.connections,
    duration: opts.duration,
    pipelining: opts.pipelining
  })

  return toBenchmarkResult(raw, opts)
}

export function getResultFileName(result: BenchmarkResult): string {
  const timestamp = result.timestamp.replace(/[:.]/g, "-")
  return `${
    result.suite ?? "benchmark"
  }-${result.scenario}-${result.platform}-c${result.config.connections}-d${result.config.duration}-p${result.config.pipelining}-${timestamp}.json`
}

export function writeBenchmarkResult(result: BenchmarkResult, resultsDir = RESULTS_DIR): string {
  mkdirSync(resultsDir, { recursive: true })
  const outFile = join(resultsDir, getResultFileName(result))
  writeFileSync(outFile, JSON.stringify(result, null, 2))
  return outFile
}
