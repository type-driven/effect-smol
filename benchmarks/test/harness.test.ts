import * as HttpRouter from "effect/unstable/http/HttpRouter"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { defaultWarmupDuration, shouldTrackProgress } from "../harness/benchmark.ts"
import { getScenarioConfig, parsePlatformList } from "../harness/config.ts"
import { generateCSV, generateMarkdown, groupResults, loadResults, summarizeRuns } from "../harness/results.ts"
import {
  findGlobalLowestCommonDenominator,
  generateStressMarkdown,
  parseStressLevels,
  summarizeStressPlatform,
  summarizeStressScenario
} from "../harness/stress.ts"
import type { BenchmarkResult, Platform } from "../harness/types.ts"
import { routes as schemaValidationRoutes } from "../scenarios/04-schema-validation/app.ts"

const tempDirs: Array<string> = []
const benchmarkRenderProgress = process.env.BENCHMARK_RENDER_PROGRESS

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()
    if (dir) {
      rmSync(dir, { recursive: true, force: true })
    }
  }

  if (benchmarkRenderProgress === undefined) {
    delete process.env.BENCHMARK_RENDER_PROGRESS
  } else {
    process.env.BENCHMARK_RENDER_PROGRESS = benchmarkRenderProgress
  }
})

function makeResult(
  overrides: Partial<BenchmarkResult> & { platform?: Platform; scenario?: string } = {}
): BenchmarkResult {
  return {
    scenario: overrides.scenario ?? "04-schema-validation",
    platform: overrides.platform ?? "node",
    timestamp: overrides.timestamp ?? "2026-03-12T12:00:00.000Z",
    config: {
      connections: overrides.config?.connections ?? 100,
      duration: overrides.config?.duration ?? 30,
      pipelining: overrides.config?.pipelining ?? 1
    },
    results: {
      requests: {
        total: 1,
        average: overrides.results?.requests.average ?? 1_000,
        mean: 1_000,
        stddev: 0,
        min: 1_000,
        max: 1_000,
        p50: 1_000,
        p95: 1_000,
        p99: 1_000
      },
      latency: {
        average: overrides.results?.latency.average ?? 2,
        mean: 2,
        stddev: 0,
        min: 2,
        max: 2,
        p50: 2,
        p95: 2,
        p99: overrides.results?.latency.p99 ?? 3
      },
      throughput: {
        average: 1_000_000,
        mean: 1_000_000,
        stddev: 0,
        min: 1_000_000,
        max: 1_000_000
      },
      errors: overrides.results?.errors ?? 0,
      timeouts: overrides.results?.timeouts ?? 0
    },
    ...overrides
  }
}

describe("benchmark harness", () => {
  it("uses scenario-specific request metadata", () => {
    const schemaValidation = getScenarioConfig("04-schema-validation")
    const middlewareChain = getScenarioConfig("05-middleware-chain")

    expect(schemaValidation.method).toBe("POST")
    expect(schemaValidation.path).toBe("/users")
    expect(schemaValidation.body).toContain("alice@example.com")
    expect(middlewareChain.headers).toEqual({ "x-auth-token": "benchmark-token" })
  })

  it("parses comma-separated platform selections", () => {
    expect(parsePlatformList("node,deno,node")).toEqual(["node", "deno"])
    expect(() => parsePlatformList("node,invalid")).toThrow("Unknown platform")
  })

  it("uses a longer default warmup for Bun and Deno", () => {
    expect(defaultWarmupDuration("node")).toBe(5)
    expect(defaultWarmupDuration("deno")).toBe(10)
    expect(defaultWarmupDuration("bun")).toBe(10)
  })

  it("only enables progress tracking when explicitly requested", () => {
    delete process.env.BENCHMARK_RENDER_PROGRESS
    expect(shouldTrackProgress()).toBe(false)

    process.env.BENCHMARK_RENDER_PROGRESS = "1"
    expect(shouldTrackProgress()).toBe(true)

    process.env.BENCHMARK_RENDER_PROGRESS = "0"
    expect(shouldTrackProgress()).toBe(false)
  })

  it("schema-validation scenario accepts a valid request body", async () => {
    const { handler, dispose } = HttpRouter.toWebHandler(schemaValidationRoutes)
    const response = await handler(
      new Request("http://localhost/users", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ name: "Alice", email: "alice@example.com", age: 30 })
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      name: "Alice",
      email: "alice@example.com",
      age: 30
    })
    await dispose()
  })

  it("ignores generated summary files when loading results", () => {
    const dir = mkdtempSync(join(tmpdir(), "bench-results-"))
    tempDirs.push(dir)

    writeFileSync(join(dir, "summary.json"), JSON.stringify({ generatedAt: "now" }))
    writeFileSync(join(dir, "04-schema-validation-node-c100-d30-p1.json"), JSON.stringify(makeResult()))

    const results = loadResults(dir)
    expect(results).toHaveLength(1)
    expect(results[0].scenario).toBe("04-schema-validation")
  })

  it("keeps different load profiles separate and summarizes repeated runs with medians", () => {
    const fastRun = makeResult({
      platform: "node",
      results: {
        requests: { average: 1_000 },
        latency: { average: 4, p99: 8 },
        errors: 1,
        timeouts: 0
      }
    } as Partial<BenchmarkResult>)
    const slowRun = makeResult({
      platform: "node",
      timestamp: "2026-03-12T12:05:00.000Z",
      results: {
        requests: { average: 100 },
        latency: { average: 20, p99: 40 },
        errors: 2,
        timeouts: 1
      }
    } as Partial<BenchmarkResult>)
    const otherConfig = makeResult({
      platform: "deno",
      config: { connections: 200, duration: 30, pipelining: 1 }
    })

    const groups = groupResults([fastRun, slowRun, otherConfig])
    expect(groups).toHaveLength(2)

    const nodeGroup = groups.find((group) => group.config.connections === 100)
    expect(nodeGroup?.platforms.node).toHaveLength(2)

    const summary = summarizeRuns(nodeGroup?.platforms.node ?? [])
    expect(summary.reqPerSecMedian).toBe(550)
    expect(summary.latencyAvgMedian).toBe(12)
    expect(summary.latencyP99Median).toBe(24)
    expect(summary.errorsTotal).toBe(3)
    expect(summary.timeoutsTotal).toBe(1)
  })

  it("keeps benchmark suites separate in grouped summaries", () => {
    const benchmarkRun = makeResult({
      suite: "benchmark",
      platform: "node"
    })
    const stressRun = makeResult({
      suite: "stress-confirm",
      platform: "node"
    })

    const groups = groupResults([benchmarkRun, stressRun])
    expect(groups).toHaveLength(2)
    expect(groups.map((group) => group.suite)).toEqual(["benchmark", "stress-confirm"])

    const markdown = generateMarkdown([benchmarkRun, stressRun])
    const csv = generateCSV([benchmarkRun, stressRun])

    expect(markdown).toContain("## Suite: benchmark")
    expect(markdown).toContain("## Suite: stress-confirm")
    expect(csv).toContain("suite,scenario,platform")
    expect(csv).toContain("stress-confirm,04-schema-validation,node")
  })

  it("parses ordered unique stress levels", () => {
    expect(parseStressLevels("400,100,400,200")).toEqual([100, 200, 400])
    expect(() => parseStressLevels("100,0")).toThrow("positive integer")
  })

  it("detects scenario and global lowest common denominator for stress reports", () => {
    const node = summarizeStressPlatform("node", [
      { connections: 100, status: "healthy", reqPerSec: 1_000 },
      { connections: 200, status: "healthy", reqPerSec: 1_100 },
      { connections: 400, status: "broken" }
    ])
    const bun = summarizeStressPlatform("bun", [
      { connections: 100, status: "healthy", reqPerSec: 1_200 },
      { connections: 200, status: "broken" }
    ])
    const deno = summarizeStressPlatform("deno", [
      { connections: 100, status: "healthy", reqPerSec: 1_100 },
      { connections: 200, status: "healthy", reqPerSec: 1_150 },
      { connections: 400, status: "healthy", reqPerSec: 1_140 }
    ])

    const scenario = summarizeStressScenario("01-hello-world", {
      node,
      bun,
      deno
    })

    expect(scenario.lowestCommonDenominator).toBe(100)
    expect(findGlobalLowestCommonDenominator([scenario])).toBe(100)

    const markdown = generateStressMarkdown({
      generatedAt: "2026-03-13T00:00:00.000Z",
      levels: [100, 200, 400],
      duration: 8,
      confirmDuration: 15,
      pipelining: 1,
      warmupDuration: 3,
      confirmRuns: 3,
      scenarios: [scenario],
      sweepLowestCommonDenominator: 100,
      confirmedLowestCommonDenominator: 100,
      confirmationAttempts: [{ connections: 100, successful: true }]
    })

    expect(markdown).toContain("Sweep lowest common denominator: 100")
    expect(markdown).toContain("Confirmed lowest common denominator: 100")
    expect(markdown).toContain("| 100 | confirmed |")
    expect(markdown).toContain("| bun | 100 | 200 | 1200 | 100 |")
    expect(markdown).toContain("| node | 400 | broken |")
  })
})
