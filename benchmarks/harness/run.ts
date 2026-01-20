import { getVersions, RESULTS_DIR, runBenchmark, writeBenchmarkResult } from "./benchmark.ts"
import { getPort, getScenarioList, parsePlatformList } from "./config.ts"
import { writeStderr, writeStdout } from "./io.ts"
import { loadResults, writeSummaryFiles } from "./results.ts"
import { resolvePlatforms, startServer, stopServer } from "./runtime.ts"
import type { Platform } from "./types.ts"

interface RunnerArgs {
  scenario?: string
  platforms: Array<Platform>
  duration: number
  connections: number
  pipelining: number
}

function parseArgs(): RunnerArgs {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const index = args.indexOf(flag)
    return index === -1 ? undefined : args[index + 1]
  }

  return {
    scenario: get("--scenario"),
    platforms: parsePlatformList(get("--platform") ?? get("--platforms")),
    duration: parseInt(get("--duration") ?? process.env.DURATION ?? "30", 10),
    connections: parseInt(get("--connections") ?? process.env.CONNECTIONS ?? "100", 10),
    pipelining: parseInt(get("--pipelining") ?? process.env.PIPELINING ?? "1", 10)
  }
}

async function main() {
  const options = parseArgs()
  const scenarios = getScenarioList(options.scenario)
  const platforms = resolvePlatforms(options.platforms)
  const versions = getVersions()
  const failures: Array<string> = []

  writeStdout(`\n${"=".repeat(60)}`)
  writeStdout("Effect HTTP Benchmark")
  writeStdout(
    `Node.js: ${versions.nodeVersion ?? "missing"}  Bun: ${versions.bunVersion ?? "missing"}  Deno: ${
      versions.denoVersion ?? "missing"
    }`
  )
  writeStdout(`Duration: ${options.duration}s  Connections: ${options.connections}  Pipelining: ${options.pipelining}`)
  writeStdout(`Platforms: ${platforms.join(", ")}`)
  writeStdout(`${"=".repeat(60)}`)

  for (const scenario of scenarios) {
    writeStdout(`\n${"-".repeat(60)}`)
    writeStdout(`Scenario: ${scenario}`)
    writeStdout(`${"-".repeat(60)}`)

    for (const platform of platforms) {
      const proc = startServer(platform, scenario)
      let serverOutput = ""
      const appendServerOutput = (chunk: Buffer | string) => {
        serverOutput = `${serverOutput}${chunk.toString()}`.slice(-4_000)
      }

      proc.stdout?.on("data", (chunk) => {
        appendServerOutput(chunk)
      })
      proc.stderr?.on("data", (chunk) => {
        appendServerOutput(chunk)
      })

      writeStdout(`\n▶ ${platform.toUpperCase()} (port ${getPort(platform)})`)

      try {
        const result = await runBenchmark({
          platform,
          scenario,
          port: getPort(platform),
          duration: options.duration,
          connections: options.connections,
          pipelining: options.pipelining
        })
        const outFile = writeBenchmarkResult(result)
        writeStdout(`\nResults written to: ${outFile}`)
      } catch (error) {
        failures.push(`${scenario}/${platform}`)
        writeStderr(`\n✗ ${scenario}/${platform} failed`)
        writeStderr(error instanceof Error ? error.message : String(error))
        if (serverOutput.trim().length > 0) {
          writeStderr(`Last server output:\n${serverOutput.trim().slice(-1_500)}`)
        }
      } finally {
        await stopServer(proc)
      }
    }
  }

  const results = loadResults(RESULTS_DIR)
  if (results.length > 0) {
    const summary = writeSummaryFiles(RESULTS_DIR, results)
    writeStdout(`\n${"=".repeat(60)}`)
    writeStdout(`Markdown summary written to: ${summary.markdownPath}`)
    writeStdout(`CSV summary written to: ${summary.csvPath}`)
    writeStdout(`JSON summary written to: ${summary.jsonPath}`)
    writeStdout(`${"=".repeat(60)}`)
  }

  if (failures.length > 0) {
    throw new Error(`Benchmark failures: ${failures.join(", ")}`)
  }
}

main().catch((error) => {
  writeStderr(String(error))
  process.exit(1)
})
