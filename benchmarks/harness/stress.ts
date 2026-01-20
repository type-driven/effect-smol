import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { getVersions, RESULTS_DIR, runBenchmark, writeBenchmarkResult } from "./benchmark.ts"
import { getPort, getScenarioList, parsePlatformList } from "./config.ts"
import { writeStderr, writeStdout } from "./io.ts"
import { writeSummaryFiles } from "./results.ts"
import { resolvePlatforms, startServer, stopServer } from "./runtime.ts"
import type { BenchmarkResult, Platform } from "./types.ts"

export interface StressStageResult {
  connections: number
  status: "healthy" | "broken"
  reqPerSec?: number
  latencyAvgMs?: number
  latencyP99Ms?: number
  errors?: number
  timeouts?: number
  resultFile?: string
  error?: string
}

export interface StressPlatformReport {
  platform: Platform
  highestHealthyConnections?: number
  firstBrokenConnections?: number
  peakReqPerSec?: number
  peakReqPerSecConnections?: number
  stages: Array<StressStageResult>
}

export interface StressScenarioReport {
  scenario: string
  lowestCommonDenominator?: number
  platforms: Partial<Record<Platform, StressPlatformReport>>
}

export interface StressReport {
  generatedAt: string
  nodeVersion?: string
  bunVersion?: string
  denoVersion?: string
  levels: Array<number>
  duration: number
  confirmDuration: number
  pipelining: number
  warmupDuration: number
  confirmRuns: number
  scenarios: Array<StressScenarioReport>
  sweepLowestCommonDenominator?: number
  confirmedLowestCommonDenominator?: number
  confirmationAttempts: Array<ConfirmationAttempt>
  confirmSummaryBaseName?: string
  confirmSearchSummaryBaseName?: string
}

export interface ConfirmationAttempt {
  connections: number
  successful: boolean
}

interface StressArgs {
  scenario?: string
  platforms: Array<Platform>
  levels: Array<number>
  duration: number
  confirmDuration: number
  pipelining: number
  warmupDuration: number
  confirmRuns: number
}

function parseInteger(name: string, value: string): number {
  const parsed = parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Expected ${name} to be a positive integer, received: ${value}`)
  }
  return parsed
}

export function parseStressLevels(raw?: string): Array<number> {
  const levels = (raw ?? "50,100,200,400,800,1200,1600")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => parseInteger("stress levels", value))

  if (levels.length === 0) {
    throw new Error("Expected at least one stress level")
  }

  return [...new Set(levels)].sort((left, right) => left - right)
}

function parseArgs(): StressArgs {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const index = args.indexOf(flag)
    return index === -1 ? undefined : args[index + 1]
  }

  return {
    scenario: get("--scenario"),
    platforms: parsePlatformList(get("--platform") ?? get("--platforms")),
    levels: parseStressLevels(get("--levels") ?? process.env.STRESS_LEVELS),
    duration: parseInteger("duration", get("--duration") ?? process.env.STRESS_DURATION ?? "8"),
    confirmDuration: parseInteger(
      "confirm duration",
      get("--confirm-duration") ?? process.env.STRESS_CONFIRM_DURATION ?? "15"
    ),
    pipelining: parseInteger("pipelining", get("--pipelining") ?? process.env.PIPELINING ?? "1"),
    warmupDuration: parseInteger(
      "warmup duration",
      get("--warmup-duration") ?? process.env.STRESS_WARMUP_DURATION ?? "3"
    ),
    confirmRuns: parseInteger("confirm runs", get("--confirm-runs") ?? process.env.STRESS_CONFIRM_RUNS ?? "3")
  }
}

export function summarizeStressPlatform(
  platform: Platform,
  stages: ReadonlyArray<StressStageResult>
): StressPlatformReport {
  const healthyStages = stages.filter((stage) => stage.status === "healthy")
  const highestHealthy = healthyStages.at(-1)?.connections
  const firstBroken = stages.find((stage) => stage.status === "broken")?.connections
  const peakStage = healthyStages.reduce<StressStageResult | undefined>((best, stage) => {
    if (stage.reqPerSec === undefined) {
      return best
    }
    if (best?.reqPerSec === undefined || stage.reqPerSec > best.reqPerSec) {
      return stage
    }
    return best
  }, undefined)

  return {
    platform,
    highestHealthyConnections: highestHealthy,
    firstBrokenConnections: firstBroken,
    peakReqPerSec: peakStage?.reqPerSec,
    peakReqPerSecConnections: peakStage?.connections,
    stages: [...stages]
  }
}

export function summarizeStressScenario(
  scenario: string,
  platformReports: Partial<Record<Platform, StressPlatformReport>>
): StressScenarioReport {
  const highestHealthy = Object.values(platformReports)
    .map((report) => report?.highestHealthyConnections)
    .filter((value): value is number => value !== undefined)

  const reportCount = Object.values(platformReports).filter((report) => report !== undefined).length

  return {
    scenario,
    lowestCommonDenominator: reportCount > 0 && highestHealthy.length === reportCount
      ? Math.min(...highestHealthy)
      : undefined,
    platforms: platformReports
  }
}

export function findGlobalLowestCommonDenominator(
  scenarios: ReadonlyArray<StressScenarioReport>
): number | undefined {
  const values = scenarios
    .map((scenario) => scenario.lowestCommonDenominator)
    .filter((value): value is number => value !== undefined)

  return values.length === scenarios.length && values.length > 0 ? Math.min(...values) : undefined
}

function formatMetric(value?: number, decimals = 0): string {
  return value === undefined ? "—" : value.toFixed(decimals)
}

export function generateStressMarkdown(report: StressReport): string {
  const lines = [
    "# Stress Benchmark Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Levels: ${report.levels.join(", ")}`,
    `Sweep duration: ${report.duration}s`,
    `Confirm duration: ${report.confirmDuration}s`,
    `Pipelining: ${report.pipelining}`,
    `Warmup: ${report.warmupDuration}s`,
    `Confirm runs: ${report.confirmRuns}`,
    `Sweep lowest common denominator: ${report.sweepLowestCommonDenominator ?? "not found"}`,
    `Confirmed lowest common denominator: ${report.confirmedLowestCommonDenominator ?? "not found"}`,
    ""
  ]

  if (report.confirmationAttempts.length > 0) {
    lines.push(
      "## Confirmation Search",
      "",
      "| Connections | Result |",
      "| ----------: | ------ |"
    )

    for (const attempt of report.confirmationAttempts) {
      lines.push(`| ${attempt.connections} | ${attempt.successful ? "confirmed" : "rejected"} |`)
    }

    lines.push("")
  }

  for (const scenario of report.scenarios) {
    lines.push(`## ${scenario.scenario}`, "")
    lines.push(`Shared safe pressure: ${scenario.lowestCommonDenominator ?? "not found"}`, "")
    lines.push(
      "| Platform | Highest healthy | First broken | Peak req/sec | Peak at connections |",
      "| -------- | --------------: | -----------: | -----------: | ------------------: |"
    )

    for (const platform of Object.keys(scenario.platforms) as Array<Platform>) {
      const current = scenario.platforms[platform]
      if (!current) {
        continue
      }

      lines.push(
        `| ${platform} | ${current.highestHealthyConnections ?? "—"} | ${current.firstBrokenConnections ?? "—"} | ${
          formatMetric(current.peakReqPerSec)
        } | ${current.peakReqPerSecConnections ?? "—"} |`
      )
    }

    lines.push("")
    lines.push(
      "| Platform | Connections | Status | Req/sec | Avg latency (ms) | p99 latency (ms) | Errors | Timeouts |",
      "| -------- | ----------: | ------ | ------: | ---------------: | ---------------: | -----: | -------: |"
    )

    for (const platform of Object.keys(scenario.platforms) as Array<Platform>) {
      const current = scenario.platforms[platform]
      if (!current) {
        continue
      }

      for (const stage of current.stages) {
        lines.push(
          `| ${platform} | ${stage.connections} | ${stage.status} | ${formatMetric(stage.reqPerSec)} | ${
            formatMetric(stage.latencyAvgMs, 2)
          } | ${formatMetric(stage.latencyP99Ms, 2)} | ${stage.errors ?? "—"} | ${stage.timeouts ?? "—"} |`
        )
      }
    }

    lines.push("")
  }

  if (report.confirmSummaryBaseName) {
    lines.push(`Confirmation summaries: ${report.confirmSummaryBaseName}.md/.csv/.json`, "")
  }
  if (report.confirmSearchSummaryBaseName) {
    lines.push(`Confirmation search summaries: ${report.confirmSearchSummaryBaseName}.md/.csv/.json`, "")
  }

  return lines.join("\n")
}

export function writeStressReportFiles(
  report: StressReport,
  resultsDir = RESULTS_DIR,
  baseName = "stress-report"
): { jsonPath: string; markdownPath: string; markdown: string } {
  const markdown = generateStressMarkdown(report)
  mkdirSync(resultsDir, { recursive: true })
  const jsonPath = join(resultsDir, `${baseName}.json`)
  const markdownPath = join(resultsDir, `${baseName}.md`)

  writeFileSync(jsonPath, JSON.stringify(report, null, 2))
  writeFileSync(markdownPath, markdown)

  return { jsonPath, markdownPath, markdown }
}

function isHealthy(result: BenchmarkResult): boolean {
  return result.results.errors === 0 && result.results.timeouts === 0
}

async function runStressSweepForPlatform(args: {
  scenario: string
  platform: Platform
  levels: ReadonlyArray<number>
  duration: number
  pipelining: number
  warmupDuration: number
}): Promise<StressPlatformReport> {
  const proc = startServer(args.platform, args.scenario)
  const stages: Array<StressStageResult> = []
  let serverOutput = ""
  const appendServerOutput = (chunk: Buffer | string) => {
    serverOutput = `${serverOutput}${chunk.toString()}`.slice(-4_000)
  }

  proc.stdout?.on("data", appendServerOutput)
  proc.stderr?.on("data", appendServerOutput)

  try {
    for (const [index, connections] of args.levels.entries()) {
      writeStdout(
        `\n▶ sweep scenario=${args.scenario} platform=${args.platform} connections=${connections} pipelining=${args.pipelining}`
      )

      try {
        const result = await runBenchmark({
          suite: "stress-sweep",
          scenario: args.scenario,
          platform: args.platform,
          port: getPort(args.platform),
          duration: args.duration,
          connections,
          pipelining: args.pipelining,
          warmupDuration: index === 0 ? args.warmupDuration : 0,
          skipReadinessCheck: index !== 0
        })
        const resultFile = writeBenchmarkResult(result)
        const healthy = isHealthy(result)

        stages.push({
          connections,
          status: healthy ? "healthy" : "broken",
          reqPerSec: result.results.requests.average,
          latencyAvgMs: result.results.latency.average,
          latencyP99Ms: result.results.latency.p99,
          errors: result.results.errors,
          timeouts: result.results.timeouts,
          resultFile
        })

        if (!healthy) {
          break
        }
      } catch (error) {
        stages.push({
          connections,
          status: "broken",
          error: error instanceof Error ? error.message : String(error)
        })
        break
      }
    }
  } finally {
    await stopServer(proc)
  }

  const report = summarizeStressPlatform(args.platform, stages)

  if (report.firstBrokenConnections !== undefined && serverOutput.trim().length > 0) {
    writeStderr(`Last server output for ${args.scenario}/${args.platform}:\n${serverOutput.trim().slice(-1_500)}`)
  }

  return report
}

async function runConfirmBenchmarks(args: {
  scenarios: ReadonlyArray<string>
  platforms: ReadonlyArray<Platform>
  connections: number
  duration: number
  pipelining: number
  warmupDuration: number
  confirmRuns: number
}): Promise<Array<BenchmarkResult>> {
  const results: Array<BenchmarkResult> = []

  for (const scenario of args.scenarios) {
    for (const platform of args.platforms) {
      const proc = startServer(platform, scenario)
      let serverOutput = ""
      const appendServerOutput = (chunk: Buffer | string) => {
        serverOutput = `${serverOutput}${chunk.toString()}`.slice(-4_000)
      }

      proc.stdout?.on("data", appendServerOutput)
      proc.stderr?.on("data", appendServerOutput)

      try {
        for (let iteration = 0; iteration < args.confirmRuns; iteration++) {
          writeStdout(
            `\n▶ confirm scenario=${scenario} platform=${platform} run=${
              iteration + 1
            }/${args.confirmRuns} connections=${args.connections}`
          )
          const result = await runBenchmark({
            suite: "stress-confirm",
            scenario,
            platform,
            port: getPort(platform),
            duration: args.duration,
            connections: args.connections,
            pipelining: args.pipelining,
            warmupDuration: iteration === 0 ? args.warmupDuration : 0,
            skipReadinessCheck: iteration !== 0
          })
          writeBenchmarkResult(result)
          results.push(result)
        }
      } catch (error) {
        if (serverOutput.trim().length > 0) {
          writeStderr(`Last server output for ${scenario}/${platform}:\n${serverOutput.trim().slice(-1_500)}`)
        }
        throw error
      } finally {
        await stopServer(proc)
      }
    }
  }

  return results
}

function areStableResults(results: ReadonlyArray<BenchmarkResult>): boolean {
  return results.every(isHealthy)
}

export async function confirmLowestCommonDenominator(args: {
  scenarios: ReadonlyArray<string>
  platforms: ReadonlyArray<Platform>
  levels: ReadonlyArray<number>
  maxConnections?: number
  duration: number
  pipelining: number
  warmupDuration: number
  confirmRuns: number
}): Promise<{
  confirmedConnections?: number
  attempts: Array<ConfirmationAttempt>
  searchResults: Array<BenchmarkResult>
  finalResults: Array<BenchmarkResult>
}> {
  const candidates = [...args.levels]
    .filter((connections) => args.maxConnections === undefined || connections <= args.maxConnections)
    .sort((left, right) => right - left)

  const attempts: Array<ConfirmationAttempt> = []
  const searchResults: Array<BenchmarkResult> = []

  for (const connections of candidates) {
    writeStdout(`\nTrying confirmed LCD candidate: ${connections}`)

    const probeResults = await runConfirmBenchmarks({
      scenarios: args.scenarios,
      platforms: args.platforms,
      connections,
      duration: args.duration,
      pipelining: args.pipelining,
      warmupDuration: args.warmupDuration,
      confirmRuns: 1
    })
    searchResults.push(...probeResults)

    if (!areStableResults(probeResults)) {
      attempts.push({ connections, successful: false })
      continue
    }

    let finalResults = [...probeResults]

    if (args.confirmRuns > 1) {
      const extraResults = await runConfirmBenchmarks({
        scenarios: args.scenarios,
        platforms: args.platforms,
        connections,
        duration: args.duration,
        pipelining: args.pipelining,
        warmupDuration: args.warmupDuration,
        confirmRuns: args.confirmRuns - 1
      })
      searchResults.push(...extraResults)
      finalResults = [...finalResults, ...extraResults]
    }

    const successful = areStableResults(finalResults)
    attempts.push({ connections, successful })

    if (successful) {
      return {
        confirmedConnections: connections,
        attempts,
        searchResults,
        finalResults
      }
    }
  }

  return {
    attempts,
    searchResults,
    finalResults: []
  }
}

async function main() {
  const args = parseArgs()
  const scenarios = getScenarioList(args.scenario)
  const platforms = resolvePlatforms(args.platforms)
  const versions = getVersions()

  writeStdout(`\n${"=".repeat(60)}`)
  writeStdout("Effect HTTP Stress Benchmark")
  writeStdout(
    `Node.js: ${versions.nodeVersion ?? "missing"}  Bun: ${versions.bunVersion ?? "missing"}  Deno: ${
      versions.denoVersion ?? "missing"
    }`
  )
  writeStdout(`Levels: ${args.levels.join(", ")}`)
  writeStdout(
    `Sweep duration: ${args.duration}s  Confirm duration: ${args.confirmDuration}s  Pipelining: ${args.pipelining}`
  )
  writeStdout(`Warmup: ${args.warmupDuration}s  Confirm runs: ${args.confirmRuns}`)
  writeStdout(`Platforms: ${platforms.join(", ")}`)
  writeStdout(`${"=".repeat(60)}`)

  const scenarioReports: Array<StressScenarioReport> = []

  for (const scenario of scenarios) {
    writeStdout(`\n${"-".repeat(60)}`)
    writeStdout(`Stress scenario: ${scenario}`)
    writeStdout(`${"-".repeat(60)}`)

    const platformReports: Partial<Record<Platform, StressPlatformReport>> = {}

    for (const platform of platforms) {
      platformReports[platform] = await runStressSweepForPlatform({
        scenario,
        platform,
        levels: args.levels,
        duration: args.duration,
        pipelining: args.pipelining,
        warmupDuration: args.warmupDuration
      })
    }

    scenarioReports.push(summarizeStressScenario(scenario, platformReports))
  }

  const globalLowestCommonDenominator = findGlobalLowestCommonDenominator(scenarioReports)
  let confirmSummaryBaseName: string | undefined
  let confirmSearchSummaryBaseName: string | undefined
  let confirmedLowestCommonDenominator: number | undefined
  let confirmationAttempts: Array<ConfirmationAttempt> = []

  if (globalLowestCommonDenominator !== undefined) {
    writeStdout(`\nSweep lowest common denominator: ${globalLowestCommonDenominator} connections`)
    const confirmation = await confirmLowestCommonDenominator({
      scenarios,
      platforms,
      duration: args.confirmDuration,
      levels: args.levels,
      maxConnections: globalLowestCommonDenominator,
      pipelining: args.pipelining,
      warmupDuration: args.warmupDuration,
      confirmRuns: args.confirmRuns
    })
    confirmationAttempts = confirmation.attempts

    confirmSearchSummaryBaseName = "stress-confirm-search-summary"
    const searchSummary = writeSummaryFiles(RESULTS_DIR, confirmation.searchResults, confirmSearchSummaryBaseName)
    writeStdout(`Confirmation search markdown summary written to: ${searchSummary.markdownPath}`)
    writeStdout(`Confirmation search CSV summary written to: ${searchSummary.csvPath}`)
    writeStdout(`Confirmation search JSON summary written to: ${searchSummary.jsonPath}`)

    if (confirmation.confirmedConnections !== undefined) {
      confirmedLowestCommonDenominator = confirmation.confirmedConnections
      confirmSummaryBaseName = "stress-confirm-summary"
      const summary = writeSummaryFiles(RESULTS_DIR, confirmation.finalResults, confirmSummaryBaseName)
      writeStdout(`Confirmation markdown summary written to: ${summary.markdownPath}`)
      writeStdout(`Confirmation CSV summary written to: ${summary.csvPath}`)
      writeStdout(`Confirmation JSON summary written to: ${summary.jsonPath}`)
    } else {
      writeStderr("No confirmed lowest common denominator found.")
    }
  } else {
    writeStderr("No sweep lowest common denominator found; skipping confirmation benchmarks.")
  }

  const report: StressReport = {
    generatedAt: new Date().toISOString(),
    ...versions,
    levels: args.levels,
    duration: args.duration,
    confirmDuration: args.confirmDuration,
    pipelining: args.pipelining,
    warmupDuration: args.warmupDuration,
    confirmRuns: args.confirmRuns,
    scenarios: scenarioReports,
    sweepLowestCommonDenominator: globalLowestCommonDenominator,
    confirmedLowestCommonDenominator,
    confirmationAttempts,
    confirmSummaryBaseName,
    confirmSearchSummaryBaseName
  }

  const output = writeStressReportFiles(report)
  writeStdout(`Stress report written to: ${output.markdownPath}`)
  writeStdout(`Stress report JSON written to: ${output.jsonPath}`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    writeStderr(error instanceof Error ? error.stack ?? error.message : String(error))
    process.exit(1)
  })
}
