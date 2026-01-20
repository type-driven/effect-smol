import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { PLATFORMS, SCENARIOS } from "./config.ts"
import { BenchmarkSuites } from "./types.ts"
import type { BenchmarkConfig, BenchmarkResult, BenchmarkSuite, Platform } from "./types.ts"

export interface BenchmarkAggregate {
  runs: number
  reqPerSecMedian: number
  latencyAvgMedian: number
  latencyP99Median: number
  errorsTotal: number
  timeoutsTotal: number
}

export interface ResultGroup {
  suite: BenchmarkSuite
  scenario: string
  config: BenchmarkConfig
  platforms: Partial<Record<Platform, Array<BenchmarkResult>>>
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function compareNumbers(a: number, b: number): number {
  return a - b
}

export function isBenchmarkResult(value: unknown): value is BenchmarkResult {
  if (!isObject(value) || !isObject(value.config) || !isObject(value.results)) {
    return false
  }

  return typeof value.scenario === "string" &&
    typeof value.platform === "string" &&
    (value.suite === undefined || BenchmarkSuites.includes(value.suite as BenchmarkSuite)) &&
    typeof value.timestamp === "string" &&
    typeof value.config.connections === "number" &&
    typeof value.config.duration === "number" &&
    typeof value.config.pipelining === "number" &&
    isObject(value.results.requests) &&
    isObject(value.results.latency) &&
    isObject(value.results.throughput) &&
    typeof value.results.errors === "number" &&
    typeof value.results.timeouts === "number"
}

export function listResultFiles(resultsDir: string): Array<string> {
  return readdirSync(resultsDir)
    .filter((file) => file.endsWith(".json") && !file.startsWith("summary"))
    .sort()
}

export function loadResults(resultsDir: string): Array<BenchmarkResult> {
  const results: Array<BenchmarkResult> = []

  for (const file of listResultFiles(resultsDir)) {
    const parsed = JSON.parse(readFileSync(join(resultsDir, file), "utf8")) as unknown
    if (isBenchmarkResult(parsed)) {
      results.push(parsed)
    }
  }

  return results.sort((left, right) => left.timestamp.localeCompare(right.timestamp))
}

export function median(numbers: ReadonlyArray<number>): number {
  if (numbers.length === 0) {
    throw new Error("Cannot compute median of an empty list")
  }

  const sorted = [...numbers].sort(compareNumbers)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

export function summarizeRuns(runs: ReadonlyArray<BenchmarkResult>): BenchmarkAggregate {
  if (runs.length === 0) {
    throw new Error("Cannot summarize an empty result set")
  }

  return {
    runs: runs.length,
    reqPerSecMedian: median(runs.map((run) => run.results.requests.average)),
    latencyAvgMedian: median(runs.map((run) => run.results.latency.average)),
    latencyP99Median: median(runs.map((run) => run.results.latency.p99)),
    errorsTotal: runs.reduce((total, run) => total + run.results.errors, 0),
    timeoutsTotal: runs.reduce((total, run) => total + run.results.timeouts, 0)
  }
}

function configKey(config: BenchmarkConfig): string {
  return `${config.connections}:${config.duration}:${config.pipelining}`
}

export function groupResults(results: ReadonlyArray<BenchmarkResult>): Array<ResultGroup> {
  const groups = new Map<string, ResultGroup>()

  for (const result of results) {
    const suite = result.suite ?? "benchmark"
    const key = `${suite}:${result.scenario}:${configKey(result.config)}`
    const existing = groups.get(key)
    if (existing) {
      ;(existing.platforms[result.platform] ??= []).push(result)
      continue
    }

    groups.set(key, {
      suite,
      scenario: result.scenario,
      config: result.config,
      platforms: {
        [result.platform]: [result]
      }
    })
  }

  return [...groups.values()].sort((left, right) => {
    const suiteOrder = left.suite.localeCompare(right.suite)
    if (suiteOrder !== 0) {
      return suiteOrder
    }

    const scenarioIndex = SCENARIOS.indexOf(left.scenario as (typeof SCENARIOS)[number]) -
      SCENARIOS.indexOf(right.scenario as (typeof SCENARIOS)[number])

    if (scenarioIndex !== 0) {
      return scenarioIndex
    }

    return left.config.connections - right.config.connections ||
      left.config.duration - right.config.duration ||
      left.config.pipelining - right.config.pipelining
  })
}

function formatNumber(value: number, decimals = 0): string {
  return value.toFixed(decimals)
}

export function generateMarkdown(results: ReadonlyArray<BenchmarkResult>): string {
  const groups = groupResults(results)
  const lines = [
    "# Benchmark Results",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Repeated runs are summarized with medians per scenario and load configuration.",
    ""
  ]

  let currentScenario: string | undefined
  let currentSuite: BenchmarkSuite | undefined

  for (const group of groups) {
    if (group.suite !== currentSuite) {
      currentSuite = group.suite
      currentScenario = undefined
      lines.push(`## Suite: ${group.suite}`, "")
    }

    if (group.scenario !== currentScenario) {
      currentScenario = group.scenario
      lines.push(`### ${group.scenario}`, "")
    }

    lines.push(
      `#### connections=${group.config.connections}, duration=${group.config.duration}s, pipelining=${group.config.pipelining}`,
      "",
      "| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |",
      "| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |"
    )

    const aggregates: Partial<Record<Platform, BenchmarkAggregate>> = {}

    for (const platform of PLATFORMS) {
      const runs = group.platforms[platform]
      if (!runs?.length) {
        lines.push(`| ${platform} | 0 | — | — | — | — | — |`)
        continue
      }

      const aggregate = summarizeRuns(runs)
      aggregates[platform] = aggregate
      lines.push(
        `| ${platform} | ${aggregate.runs} | ${formatNumber(aggregate.reqPerSecMedian)} | ${
          formatNumber(aggregate.latencyAvgMedian, 2)
        } | ${formatNumber(aggregate.latencyP99Median, 2)} | ${aggregate.errorsTotal} | ${aggregate.timeoutsTotal} |`
      )
    }

    if (aggregates.node) {
      lines.push(
        "",
        "| Relative to node | Multiplier |",
        "| ---------------- | ---------: |",
        `| node | 1.00x |`
      )

      for (const platform of PLATFORMS) {
        if (platform === "node") {
          continue
        }

        const aggregate = aggregates[platform]
        lines.push(
          aggregate
            ? `| ${platform} | ${(aggregate.reqPerSecMedian / aggregates.node.reqPerSecMedian).toFixed(2)}x |`
            : `| ${platform} | — |`
        )
      }
    }

    lines.push("")
  }

  return lines.join("\n")
}

export function generateCSV(results: ReadonlyArray<BenchmarkResult>): string {
  const header =
    "suite,scenario,platform,timestamp,connections,duration,pipelining,req_per_sec,latency_avg_ms,latency_p50_ms,latency_p95_ms,latency_p99_ms,errors,timeouts"
  const rows = [...results]
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .map((result) =>
      [
        result.suite ?? "benchmark",
        result.scenario,
        result.platform,
        result.timestamp,
        result.config.connections,
        result.config.duration,
        result.config.pipelining,
        result.results.requests.average.toFixed(2),
        result.results.latency.average.toFixed(2),
        result.results.latency.p50,
        result.results.latency.p95,
        result.results.latency.p99,
        result.results.errors,
        result.results.timeouts
      ].join(",")
    )

  return [header, ...rows].join("\n")
}

export function writeSummaryFiles(
  resultsDir: string,
  results: ReadonlyArray<BenchmarkResult>,
  baseName = "summary"
): {
  markdownPath: string
  csvPath: string
  jsonPath: string
  markdown: string
} {
  const markdown = generateMarkdown(results)
  const csv = generateCSV(results)
  const groups = groupResults(results)

  const markdownPath = join(resultsDir, `${baseName}.md`)
  const csvPath = join(resultsDir, `${baseName}.csv`)
  const jsonPath = join(resultsDir, `${baseName}.json`)

  writeFileSync(markdownPath, markdown)
  writeFileSync(csvPath, csv)
  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), groups }, null, 2))

  return { markdownPath, csvPath, jsonPath, markdown }
}
