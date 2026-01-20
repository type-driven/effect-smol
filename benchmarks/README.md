# Effect Platform Benchmarks

Benchmark suite comparing `@effect/platform-node`, `@effect/platform-bun`, and `@effect/platform-deno` using identical application logic.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Bun](https://bun.sh/) >= 1.0
- [Deno](https://deno.land/) >= 2.0

Install harness dependencies:

```sh
cd benchmarks
pnpm install
```

## Running

**All scenarios, all platforms:**

```sh
pnpm bench:all
# or
bash run-all.sh
```

**Single scenario:**

```sh
pnpm bench:schema-validation
# or
bash run-all.sh --scenario 04-schema-validation
```

**Subset of platforms:**

```sh
pnpm bench:all -- --platform node,deno
# or
bash run-all.sh --platform node,deno
```

**Custom load parameters:**

```sh
DURATION=60 CONNECTIONS=200 PIPELINING=10 bash run-all.sh --platform node,deno
```

**Extreme stress sweep with automatic LCD detection:**

```sh
pnpm bench:stress
# or
node --import tsx/esm harness/stress.ts \
  --levels 100,200,400,800,1200 \
  --duration 8 \
  --confirm-duration 15 \
  --confirm-runs 3
```

**Individual load test** (server must already be running):

```sh
node --import tsx/esm harness/load-test.ts \
  --platform node \
  --scenario 04-schema-validation \
  --port 3001 \
  --duration 30 \
  --connections 100 \
  --pipelining 1
```

**Collect and display results:**

```sh
pnpm collect
# or
node --import tsx/esm harness/collect-results.ts
```

## Scenarios

| #  | Scenario          | What it tests                                       |
| -- | ----------------- | --------------------------------------------------- |
| 01 | hello-world       | Baseline latency, `text/plain` response             |
| 02 | json-api          | JSON serialization, URL param parsing via `Schema`  |
| 03 | routing           | Router overhead across 5 routes with URL params     |
| 04 | schema-validation | `Schema.Struct` body parsing and validation on POST |
| 05 | middleware-chain  | 3-layer middleware (timing, request ID, auth check) |

## Port assignment

Each platform uses a fixed port within a scenario run:

| Platform | Port |
| -------- | ---- |
| Node.js  | 3001 |
| Bun      | 3002 |
| Deno     | 3003 |

## Results

Each benchmark run writes a JSON result file to `results/` with scenario and load metadata in the filename. `collect-results.ts` also generates:

- `results/summary.md`: median-based summary grouped by scenario and load config
- `results/summary.csv`: raw run export for further analysis
- `results/summary.json`: machine-readable grouped summary
- `results/stress-report.md`: last healthy pressure, first broken pressure, and per-stage metrics
- `results/stress-report.json`: machine-readable stress sweep report
- `results/stress-confirm-summary.md`: median summary for confirmation runs at the global lowest common denominator

Repeated runs are summarized with medians only when `suite`, `scenario`, `connections`, `duration`, and `pipelining` match. Different load profiles and stress suites are kept separate.

## Fairness notes

1. All platforms run identical Effect application code. Only the server layer differs.
2. Readiness checks use the real benchmark route and HTTP method for each scenario.
3. Warmup traffic uses the same request shape as measured traffic.
4. Run the same configuration 3+ times and compare medians, not a single run.
5. Keep client and server load isolated from other heavy processes when possible.
6. Missing runtimes are a configuration error unless you explicitly limit `--platform`.
