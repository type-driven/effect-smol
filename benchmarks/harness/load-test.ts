import { runBenchmark, writeBenchmarkResult } from "./benchmark.ts"
import { getPort, parsePlatformList, parseScenario } from "./config.ts"
import { writeStderr, writeStdout } from "./io.ts"
import type { Platform } from "./types.ts"

function parseArgs(): {
  platform: Platform
  scenario: string
  port: number
  duration: number
  connections: number
  pipelining: number
} {
  const args = process.argv.slice(2)
  const get = (flag: string, fallback: string): string => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : fallback
  }

  const [platform] = parsePlatformList(get("--platform", "node"))
  const scenario = parseScenario(get("--scenario", "01-hello-world"))

  return {
    platform,
    scenario,
    port: parseInt(get("--port", String(getPort(platform))), 10),
    duration: parseInt(get("--duration", "30"), 10),
    connections: parseInt(get("--connections", "100"), 10),
    pipelining: parseInt(get("--pipelining", "1"), 10)
  }
}

async function main() {
  const options = parseArgs()
  const result = await runBenchmark(options)
  const outFile = writeBenchmarkResult(result)

  writeStdout(`\nResults written to: ${outFile}`)
  writeStdout("\nSummary:")
  writeStdout(`  Requests/sec: ${result.results.requests.average.toFixed(0)}`)
  writeStdout(`  Latency avg:  ${result.results.latency.average.toFixed(2)}ms`)
  writeStdout(`  Latency p99:  ${result.results.latency.p99.toFixed(2)}ms`)
  writeStdout(`  Errors:       ${result.results.errors}`)
  writeStdout(`  Timeouts:     ${result.results.timeouts}`)
}

main().catch((error) => {
  writeStderr(String(error))
  process.exit(1)
})
