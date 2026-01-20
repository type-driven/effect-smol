import { type Platform, Platforms, type ScenarioConfig } from "./types.ts"

export const SCENARIOS = [
  "01-hello-world",
  "02-json-api",
  "03-routing",
  "04-schema-validation",
  "05-middleware-chain"
] as const

export type ScenarioName = (typeof SCENARIOS)[number]

export const SCENARIO_CONFIGS: Record<ScenarioName, ScenarioConfig> = {
  "01-hello-world": {
    path: "/",
    method: "GET"
  },
  "02-json-api": {
    path: "/api/items/42",
    method: "GET"
  },
  "03-routing": {
    path: "/posts/1/comments/2",
    method: "GET"
  },
  "04-schema-validation": {
    path: "/users",
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Alice", email: "alice@example.com", age: 30 })
  },
  "05-middleware-chain": {
    path: "/api/data",
    method: "GET",
    headers: { "x-auth-token": "benchmark-token" }
  }
}

export const PLATFORMS = [...Platforms]

export const PLATFORM_PORTS: Record<Platform, number> = {
  node: 3001,
  bun: 3002,
  deno: 3003
}

const platformSet = new Set<string>(Platforms)
const scenarioSet = new Set<string>(SCENARIOS)

export function getScenarioConfig(scenario: string): ScenarioConfig {
  if (!scenarioSet.has(scenario)) {
    throw new Error(`Unknown scenario: ${scenario}`)
  }
  return SCENARIO_CONFIGS[scenario as ScenarioName]
}

export function getScenarioList(scenario?: string): ReadonlyArray<ScenarioName> {
  return scenario ? [parseScenario(scenario)] : SCENARIOS
}

export function parseScenario(scenario: string): ScenarioName {
  if (!scenarioSet.has(scenario)) {
    throw new Error(`Unknown scenario: ${scenario}`)
  }
  return scenario as ScenarioName
}

export function parsePlatformList(raw?: string): Array<Platform> {
  if (raw === undefined) {
    return [...Platforms]
  }

  const platforms = [...new Set(raw.split(",").map((platform) => platform.trim()).filter(Boolean))]
  if (platforms.length === 0) {
    throw new Error("Expected at least one platform")
  }

  for (const platform of platforms) {
    if (!platformSet.has(platform)) {
      throw new Error(`Unknown platform: ${platform}`)
    }
  }

  return platforms as Array<Platform>
}

export function getPort(platform: Platform): number {
  return PLATFORM_PORTS[platform]
}
