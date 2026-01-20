export const Platforms = ["node", "bun", "deno"] as const

export type Platform = (typeof Platforms)[number]
export const BenchmarkSuites = ["benchmark", "stress-sweep", "stress-confirm"] as const
export type BenchmarkSuite = (typeof BenchmarkSuites)[number]

export interface BenchmarkConfig {
  connections: number
  duration: number
  pipelining: number
}

export interface ScenarioConfig {
  path: string
  method: "GET" | "POST"
  headers?: Record<string, string>
  body?: string
}

export interface RequestStats {
  total: number
  average: number
  mean: number
  stddev: number
  min: number
  max: number
  p50: number
  p95: number
  p99: number
}

export interface LatencyStats {
  average: number
  mean: number
  stddev: number
  min: number
  max: number
  p50: number
  p95: number
  p99: number
}

export interface ThroughputStats {
  average: number
  mean: number
  stddev: number
  min: number
  max: number
}

export interface BenchmarkResult {
  scenario: string
  platform: Platform
  suite?: BenchmarkSuite
  nodeVersion?: string
  bunVersion?: string
  denoVersion?: string
  timestamp: string
  config: BenchmarkConfig
  results: {
    requests: RequestStats
    latency: LatencyStats
    throughput: ThroughputStats
    errors: number
    timeouts: number
  }
}
