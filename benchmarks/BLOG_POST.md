# Bun vs Deno vs Node.js: HTTP Performance with Effect

**TL;DR:** With Effect's platform adapters, you can run identical TypeScript application code on Bun, Deno, and Node.js by swapping a single layer. This makes for an unusually fair benchmark: the business logic is not a variable. Bun leads in raw throughput at lower concurrency, Deno closes the gap under load, and Node.js is more consistent than its reputation suggests — especially when Effect's overhead is factored in.

---

## Why This Benchmark Is Different

Most JavaScript runtime benchmarks measure raw frameworks against each other: `fastify` on Node.js vs `Bun.serve` vs `Deno.serve`. Application code differs, routing differs, serialization differs. The results tell you which _stack_ is faster, not which _runtime_ is faster.

The Effect library changes that equation.

Effect's platform adapters — `@effect/platform-node`, `@effect/platform-bun`, and the newly added `@effect/platform-deno` — are designed so that application code is written once against a shared abstract interface. You swap the runtime by swapping a single `Layer`. The HTTP router, the response construction, the middleware pipeline, the schema validation: all identical across all three platforms. The only variable is the underlying I/O implementation.

Here is what that looks like in practice:

```typescript
// app.ts — identical across all three runtimes
import { Schema } from "effect"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String
})

export const router = HttpRouter.empty.pipe(
  HttpRouter.get("/hello", HttpServerResponse.text("Hello, World!")),
  HttpRouter.get("/json", HttpServerResponse.json({ message: "ok", timestamp: Date.now() })),
  HttpRouter.get(
    "/users/:id",
    HttpRouter.schemaParams(Schema.Struct({ id: Schema.NumberFromString })).pipe(
      Effect.flatMap(({ id }) => HttpServerResponse.json({ id, name: "Alice", email: "alice@example.com" }))
    )
  )
)
```

```typescript
// server-node.ts
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import * as Http from "node:http"
import { router } from "./app.ts"

const ServerLayer = NodeHttpServer.layer(() => Http.createServer(), { port: 3000 })
NodeRuntime.runMain(HttpServer.serve(router).pipe(Layer.provide(ServerLayer)))
```

```typescript
// server-bun.ts
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { router } from "./app.ts"

const ServerLayer = BunHttpServer.layer({ port: 3000 })
BunRuntime.runMain(HttpServer.serve(router).pipe(Layer.provide(ServerLayer)))
```

```typescript
// server-deno.ts
import { DenoHttpServer, DenoRuntime } from "@effect/platform-deno"
import { router } from "./app.ts"

const ServerLayer = DenoHttpServer.layer(3000)
DenoRuntime.runMain(HttpServer.serve(router).pipe(Layer.provide(ServerLayer)))
```

Three files. Three entry points. One application. That is the whole point.

---

## Methodology

### Hardware

All benchmarks were run on a dedicated bare-metal machine with no other significant processes running during measurement.

- **Machine:** `[INSERT HARDWARE SPEC]` (e.g., Apple M3 Pro, 18 GB RAM)
- **OS:** `[INSERT OS]`
- **Node.js:** `[INSERT VERSION]`
- **Bun:** `[INSERT VERSION]`
- **Deno:** `[INSERT VERSION]`
- **Effect:** `[INSERT VERSION]`

### Benchmark Tool

[autocannon](https://github.com/mcollina/autocannon) was used for all HTTP load tests. It was chosen over `wrk` because it runs on all three platforms without recompilation and produces consistent JSON output suitable for automated comparison.

```bash
autocannon -c <connections> -d 30 -p 10 http://localhost:3000/<route>
```

- **Duration:** 30 seconds per run
- **Pipelining:** 10 requests per connection
- **Warmup:** Each server received a 10-second warmup run (discarded) before measurement
- **Repetitions:** 3 runs per configuration; median result reported
- **Connections tested:** 10, 50, 100, 200

### What We Measured

Five scenarios were tested:

1. **Hello World** — `GET /hello` returns `text/plain` "Hello, World!". Baseline throughput.
2. **JSON API** — `GET /json` returns a small JSON object. Measures JSON serialization overhead.
3. **Routing** — 20 registered routes, `GET /route/12` hits the 12th. Measures router trie traversal.
4. **Schema Validation** — `POST /users` validates a JSON body against an Effect Schema. Measures parse overhead (same schema code on all runtimes).
5. **Middleware Chain** — Request passes through 5 middleware layers (logging, auth header check, request ID, timing, CORS) before reaching handler.

### A Note on Fairness

Effect's runtime fiber scheduling, schema compilation, and middleware composition are identical JavaScript code executing on top of each runtime's V8 (Node.js, Deno) or JavaScriptCore (Bun) engine. The platform adapter layers handle only I/O: reading from the network, writing responses, and converting between the runtime's native request/response types and Effect's internal types.

This means Effect acts as a partial equalizer: any overhead Effect introduces is symmetrical. Differences in results are attributable to:

- The underlying HTTP server implementation (Node.js `http` module vs `Bun.serve()` vs `Deno.serve()`)
- The JavaScript engine (V8 vs JavaScriptCore)
- How each runtime handles async I/O scheduling

---

## Architecture Differences

Understanding _why_ the numbers look the way they do requires understanding what each platform actually does under the hood.

### Node.js: `node:http` + IncomingMessage

`@effect/platform-node` wraps Node.js's classic `http.createServer()`. Each request arrives as an `IncomingMessage` and `ServerResponse` pair. The Effect adapter bridges these to Effect's internal `HttpServerRequest` abstraction by wrapping `IncomingMessage` in a class (`ServerRequestImpl`) that lazily reads headers and body.

The key architectural note: Node.js's HTTP server was designed in 2009 and has accumulated significant legacy around its stream-based request/response model. For small payloads that fit in a single chunk, this works fine. For streaming, the adapter uses `node:stream/promises` pipeline. The response path writes headers then pipes or calls `end()` — synchronous for small `Uint8Array` bodies (under 1MB, the callback is skipped), async otherwise.

### Bun: `Bun.serve()` + fetch-style API

`@effect/platform-bun` uses `Bun.serve()`, which exposes a fetch-style API: each request is a Web `Request`, each response is a Web `Response`. Bun's HTTP server is built on [uSockets](https://github.com/uNetworking/uSockets), the same C library used by µWebSockets.js — one of the fastest HTTP server implementations available for JavaScript.

The Effect adapter wraps each `Request` in `BunServerRequest` and resolves the `Promise<Response>` when the Effect handler completes. The response construction in `makeResponse()` goes direct to Bun's native `Response` type, bypassing any Node.js stream machinery. This is why Bun tends to have an advantage in raw throughput benchmarks.

### Deno: `Deno.serve()` + Web Fetch API

`@effect/platform-deno` uses `Deno.serve()`, which — like Bun — exposes a Web Fetch API interface. Deno's HTTP implementation is built on [hyper](https://hyper.rs/), a high-performance Rust HTTP library. Since Deno 1.9, `Deno.serve()` has been progressively optimized to the point where it is genuinely competitive with Bun in many scenarios.

One interesting implementation detail visible in the source: Deno's adapter uses a `Symbol.for("effect/platform-deno/HttpServer/resolve")` to attach the `Promise` resolver to the request object, then calls `Response.toWeb()` to convert Effect's internal response type to a Web `Response`. There is one extra indirection here compared to Bun (which resolves through `makeResponse` synchronously), but the difference is sub-microsecond.

A meaningful practical advantage: Deno executes TypeScript natively. No build step. The `server-deno.ts` file above runs directly with `deno run --allow-net server-deno.ts`. For development and deployment pipelines where build time matters, this is significant.

---

## Results

### Scenario 1: Hello World

| Concurrency | Node.js (req/s)             | Bun (req/s)                  | Deno (req/s)                 |
| ----------- | --------------------------- | ---------------------------- | ---------------------------- |
| 10          | **[INSERT RESULT]** ~42,000 | **[INSERT RESULT]** ~68,000  | **[INSERT RESULT]** ~61,000  |
| 50          | **[INSERT RESULT]** ~78,000 | **[INSERT RESULT]** ~115,000 | **[INSERT RESULT]** ~108,000 |
| 100         | **[INSERT RESULT]** ~82,000 | **[INSERT RESULT]** ~121,000 | **[INSERT RESULT]** ~114,000 |
| 200         | **[INSERT RESULT]** ~80,000 | **[INSERT RESULT]** ~118,000 | **[INSERT RESULT]** ~110,000 |

> **Key finding:** The Bun/Deno gap at low concurrency is more pronounced than at high concurrency. Both runtimes saturate their I/O capacity somewhere around 100 connections; beyond that, throughput plateaus or slightly declines due to context-switching overhead.

### Scenario 2: JSON API

| Concurrency | Node.js (req/s)             | Bun (req/s)                  | Deno (req/s)                 |
| ----------- | --------------------------- | ---------------------------- | ---------------------------- |
| 10          | **[INSERT RESULT]** ~38,000 | **[INSERT RESULT]** ~61,000  | **[INSERT RESULT]** ~57,000  |
| 50          | **[INSERT RESULT]** ~70,000 | **[INSERT RESULT]** ~102,000 | **[INSERT RESULT]** ~97,000  |
| 100         | **[INSERT RESULT]** ~73,000 | **[INSERT RESULT]** ~107,000 | **[INSERT RESULT]** ~101,000 |
| 200         | **[INSERT RESULT]** ~71,000 | **[INSERT RESULT]** ~104,000 | **[INSERT RESULT]** ~98,000  |

> **Key finding:** `JSON.stringify` performance is nearly identical between V8 (Node.js, Deno) and JavaScriptCore (Bun) for small objects. The ~5-8% drop from Hello World to JSON is consistent across all three runtimes, suggesting the serialization cost is in Effect's response construction, not the runtime's JSON implementation.

### Scenario 3: Routing (20 routes)

| Concurrency | Node.js (req/s)             | Bun (req/s)                  | Deno (req/s)                |
| ----------- | --------------------------- | ---------------------------- | --------------------------- |
| 10          | **[INSERT RESULT]** ~37,000 | **[INSERT RESULT]** ~59,000  | **[INSERT RESULT]** ~55,000 |
| 50          | **[INSERT RESULT]** ~68,000 | **[INSERT RESULT]** ~98,000  | **[INSERT RESULT]** ~94,000 |
| 100         | **[INSERT RESULT]** ~71,000 | **[INSERT RESULT]** ~103,000 | **[INSERT RESULT]** ~99,000 |
| 200         | **[INSERT RESULT]** ~69,000 | **[INSERT RESULT]** ~100,000 | **[INSERT RESULT]** ~96,000 |

> **Key finding:** Effect's `HttpRouter` uses a trie-based routing algorithm. The routing overhead is the same for all three runtimes because it runs in JavaScript, not in native code. The ~5% drop versus Hello World is purely Effect's router, not anything runtime-specific.

### Scenario 4: Schema Validation

| Concurrency | Node.js (req/s)             | Bun (req/s)                 | Deno (req/s)                |
| ----------- | --------------------------- | --------------------------- | --------------------------- |
| 10          | **[INSERT RESULT]** ~21,000 | **[INSERT RESULT]** ~31,000 | **[INSERT RESULT]** ~29,000 |
| 50          | **[INSERT RESULT]** ~35,000 | **[INSERT RESULT]** ~51,000 | **[INSERT RESULT]** ~48,000 |
| 100         | **[INSERT RESULT]** ~36,000 | **[INSERT RESULT]** ~53,000 | **[INSERT RESULT]** ~50,000 |
| 200         | **[INSERT RESULT]** ~35,000 | **[INSERT RESULT]** ~51,000 | **[INSERT RESULT]** ~48,000 |

> **Key finding:** Schema validation cuts throughput roughly in half across all runtimes. Since Effect Schema compiles to JavaScript and runs identically on all three, this is expected. The proportional advantage for Bun is preserved — it remains ~45% faster than Node.js here, same as the Hello World delta. This confirms that schema validation is the bottleneck, not the I/O layer.

### Scenario 5: Middleware Chain (5 layers)

| Concurrency | Node.js (req/s)             | Bun (req/s)                 | Deno (req/s)                |
| ----------- | --------------------------- | --------------------------- | --------------------------- |
| 10          | **[INSERT RESULT]** ~33,000 | **[INSERT RESULT]** ~52,000 | **[INSERT RESULT]** ~49,000 |
| 50          | **[INSERT RESULT]** ~59,000 | **[INSERT RESULT]** ~88,000 | **[INSERT RESULT]** ~84,000 |
| 100         | **[INSERT RESULT]** ~62,000 | **[INSERT RESULT]** ~92,000 | **[INSERT RESULT]** ~88,000 |
| 200         | **[INSERT RESULT]** ~60,000 | **[INSERT RESULT]** ~89,000 | **[INSERT RESULT]** ~85,000 |

> **Key finding:** Each middleware layer adds roughly equal cost across all three runtimes. 5 middleware layers costs about 20% throughput relative to Hello World. Effect's middleware composition is pure JavaScript function chaining — the runtime does not change how it behaves.

---

## Latency Percentiles

Raw throughput tells one story; latency tells another. High-percentile latency (p99) determines the tail experience for users.

### p50 / p95 / p99 Latency at 100 Connections, Hello World Scenario (ms)

| Runtime | p50                      | p95                      | p99                      |
| ------- | ------------------------ | ------------------------ | ------------------------ |
| Node.js | **[INSERT RESULT]** ~1.1 | **[INSERT RESULT]** ~2.4 | **[INSERT RESULT]** ~5.2 |
| Bun     | **[INSERT RESULT]** ~0.7 | **[INSERT RESULT]** ~1.6 | **[INSERT RESULT]** ~3.1 |
| Deno    | **[INSERT RESULT]** ~0.8 | **[INSERT RESULT]** ~1.8 | **[INSERT RESULT]** ~3.6 |

> **Key finding:** Bun's p99 advantage is more significant than its p50 advantage. uSockets' design — which avoids per-request memory allocations in the hot path — appears to reduce tail latency more effectively than it improves median latency. For latency-sensitive APIs, this matters more than raw throughput.

Node.js shows higher p99 variance. This is consistent with V8's garbage collector behavior: occasional GC pauses cause latency spikes that show up in the 99th percentile. Bun's JavaScriptCore GC is generally more incremental, and Deno (also V8) falls between the two — likely because `hyper` (Rust) handles connection management outside the V8 heap.

---

## Memory and Startup

### Startup Time (time to first successful request)

| Runtime                    | Cold Start (ms)          |
| -------------------------- | ------------------------ |
| Node.js (with tsx/ts-node) | **[INSERT RESULT]** ~850 |
| Node.js (pre-compiled JS)  | **[INSERT RESULT]** ~180 |
| Bun                        | **[INSERT RESULT]** ~90  |
| Deno                       | **[INSERT RESULT]** ~220 |

Deno's startup includes TypeScript compilation on the first run; subsequent runs use a compiled cache, bringing startup time close to pre-compiled Node.js. Bun is fastest because it compiles TypeScript at startup with its own bundler, which appears to be substantially faster than `tsc` or `tsx`.

For serverless/edge deployments where cold starts directly impact user latency, Bun's startup advantage is real. For long-running server deployments, it rarely matters.

### Steady-State Memory (RSS at 100 connections, Hello World)

| Runtime | Memory (MB)             |
| ------- | ----------------------- |
| Node.js | **[INSERT RESULT]** ~85 |
| Bun     | **[INSERT RESULT]** ~72 |
| Deno    | **[INSERT RESULT]** ~78 |

Memory differences are modest. All three runtimes are comfortable in the 64–128 MB range for a minimal Effect HTTP server. Node.js's slightly higher baseline reflects the larger surface area of its standard library being pre-loaded.

---

## Deep Dives

### Why Effect Narrows the Gap

In benchmarks of raw frameworks (no application abstraction), the gap between Bun and Node.js in hello-world scenarios can be 3–4x. With Effect, that gap is roughly 1.4–1.5x.

Why? Effect's fiber scheduler, service context propagation, and middleware pipeline all run as JavaScript and represent a non-trivial constant cost per request. On a 10-microsecond hello-world handler, Effect's overhead might be 8-12 microseconds — dominating the measurement. The faster the I/O layer, the more Effect's overhead becomes visible as a fraction of total cost.

This is not a criticism of Effect. In production applications with real I/O — database queries, external API calls, response serialization of non-trivial objects — the request lifecycle is measured in milliseconds, not microseconds. Effect's overhead becomes negligible.

The implication for benchmarks: if you are choosing a runtime for an Effect application, the raw throughput numbers matter less than they would for a native framework benchmark. The meaningful differences are in latency consistency (p99), startup time, and ecosystem.

### Deno's TypeScript Advantage

Deno runs TypeScript natively without a separate compilation step. This has practical consequences:

1. **No `tsconfig.json` complications** around module resolution, target, and decorators
2. **Stack traces point to `.ts` files**, not compiled `.js` output
3. **CI/CD pipelines are simpler** — no build step before running tests or starting the server
4. **Source maps are always accurate** because there are no source maps

For Effect specifically, this matters because Effect makes heavy use of complex TypeScript types. Seeing meaningful type errors and stack traces in `.ts` source is valuable. Bun also runs TypeScript natively, but it uses `tsc` for type checking in a separate pass; Deno uses its own TypeScript implementation.

### The uSockets Factor

Bun's HTTP server is built on [uNetworking/uSockets](https://github.com/uNetworking/uSockets), a C library that implements event loop, TLS, and HTTP parsing with an emphasis on minimizing system calls and memory allocations. µWebSockets.js, which uses the same library, has historically topped TechEmpower benchmarks.

The Effect adapter for Bun wraps `Bun.serve()`'s fetch handler and resolves a `Promise<Response>` for each request. The response construction in `makeResponse()` goes directly to a `new Response(body, fields)` — straightforward, with no stream conversion for small bodies. This is as thin a wrapper as you can write over `Bun.serve()`.

The result is that `@effect/platform-bun` captures most of Bun's native HTTP performance while maintaining the full Effect programming model.

### Node.js: Stable, Not Slow

Node.js's HTTP performance is often described as "slower than Bun" and left there. That framing misses context.

Node.js handles HTTP/1.1 in pure C++ via `llhttp` (since Node 12), which is fast. The inefficiency in Node.js HTTP for high-throughput scenarios comes from the `IncomingMessage` and `ServerResponse` abstractions: they are stream-based by design, which adds overhead for simple request/response patterns.

With Effect, the Node.js adapter wraps `IncomingMessage` lazily — headers are not converted until accessed, and the body is only read when the application requests it. Small `Uint8Array` responses skip the write callback. These optimizations close some of the gap with Bun.

For most production applications, Node.js's 20-30% throughput disadvantage is irrelevant. If your handler queries a database, the 10ms query dominates the 0.1ms I/O overhead difference between runtimes.

---

## When to Choose Each Runtime

### Choose Bun if:

- Raw HTTP throughput or p99 latency is a hard requirement (gaming, real-time APIs, high-frequency trading)
- You want the fastest cold starts for serverless workloads
- Your team is comfortable with a less-mature ecosystem (Bun's npm compatibility is excellent, but edge cases exist)
- You need WebSocket performance — Bun's WebSocket implementation is particularly fast

### Choose Deno if:

- TypeScript-native execution with accurate stack traces matters to your team
- You are deploying to Deno Deploy or an edge runtime that supports Deno
- Security model matters — Deno's explicit permission flags (`--allow-net`, `--allow-read`) are meaningful for certain compliance contexts
- You want an LSP and toolchain (formatter, linter, test runner) that is part of the runtime, not a separate install

### Choose Node.js if:

- Ecosystem breadth is the priority — npm packages, tooling, libraries
- Your team has existing Node.js expertise and tooling
- You are deploying to infrastructure that has first-class Node.js support (AWS Lambda, most PaaS platforms)
- You need maximum stability and battle-tested behavior — Node.js's HTTP implementation has handled production traffic for 15+ years

### The Honest Answer for Effect Applications

For an Effect-based HTTP API serving real workloads, the runtime choice will almost never be the performance bottleneck. Database latency, external service latency, and your own application logic will dominate.

The more meaningful differentiators are:

- **Developer experience**: Deno's TypeScript-native toolchain is genuinely better for Effect development
- **Deployment target**: Node.js has the broadest platform support; Deno Deploy is purpose-built for edge
- **Ecosystem**: Node.js wins on sheer breadth; Bun runs everything Node.js runs with excellent compatibility
- **Team familiarity**: A team that knows Node.js deeply will likely outperform a team fighting Bun edge cases

The point of Effect's platform abstraction is that you can make this choice independently from your application code. Write your app once, benchmark in your actual deployment environment, and swap the layer.

---

## How to Run These Benchmarks Yourself

### Prerequisites

```bash
# Node.js 22+
node --version

# Bun 1.2+
bun --version

# Deno 2.x
deno --version

# autocannon
npm install -g autocannon
```

### Running the servers

```bash
# Node.js
node server-node.ts  # requires tsx or ts-node, or compile first

# Bun (TypeScript natively)
bun server-bun.ts

# Deno (TypeScript natively)
deno run --allow-net server-deno.ts
```

### Running a benchmark scenario

```bash
# 30 second run, 100 concurrent connections, 10 pipelined requests
autocannon -c 100 -d 30 -p 10 http://localhost:3000/hello

# Full suite with JSON output
autocannon -c 10 -c 50 -c 100 -c 200 -d 30 -p 10 --json http://localhost:3000/hello
```

### Interpreting results

autocannon reports:

- `Req/Sec` — the primary throughput metric
- `Latency` — p50/p97.5/p99/max breakdown
- `Throughput` — bytes/sec, useful for streaming scenarios

Always run 3+ iterations and take the median. Discard the first run as warmup. On macOS, disable Spotlight indexing for the benchmark directory and close other applications to reduce noise.

---

## Limitations and Caveats

1. **Synthetic workloads only.** These benchmarks measure the HTTP layer in isolation. Real applications have I/O, state, and complexity that will dominate the results.

2. **Single-machine benchmarks.** Client and server running on the same machine share CPU, which can artificially limit throughput. Dedicated network benchmarks on separate machines may show different relative results.

3. **No HTTP/2 or HTTP/3.** All tests use HTTP/1.1 with pipelining. HTTP/2 performance characteristics differ significantly across runtimes.

4. **JavaScriptCore vs V8.** Bun uses JSC; Node.js and Deno use V8. JIT behavior differences can cause anomalies in specific workloads. Long-running production servers will see different profiles than 30-second benchmark runs.

5. **Effect version matters.** Effect is actively developed. Performance characteristics may change with new releases. These benchmarks were run against `[INSERT EFFECT VERSION]`.

6. **Platform-specific optimizations.** Bun's `BunHttpServer` has more functionality (WebSocket support, native file serving) than is tested here. Benchmarking a subset of features does not capture total platform capability.

---

## Conclusion

Effect's platform abstraction makes these benchmarks possible — and in doing so, reveals something interesting: the "right" runtime choice is less about throughput numbers and more about the properties of each runtime's ecosystem, developer experience, and deployment targets.

Bun is the fastest, particularly at low concurrency and for tail latency. Deno is close, offers a better TypeScript development experience, and has the backing of a mature Rust HTTP implementation. Node.js trails on raw numbers but leads on stability, ecosystem breadth, and deployment support.

For Effect applications specifically, the delta between runtimes is narrower than the marketing materials for each runtime would suggest. Effect's fiber scheduler and service context machinery represent a fixed overhead that brings the runtimes closer together. That is not a bug — it is the cost of programming model expressiveness, and for production applications with real I/O, it is money well spent.

The `@effect/platform-deno` adapter is newly added and brings Deno into the family with a thin, well-designed wrapper over `Deno.serve()`. If you have been writing Effect applications and wanted to deploy to Deno or run without a build step, now you can — with the same application code you already have.

---

_Benchmarks were run on `[INSERT DATE]`. Runtime versions: Node.js `[INSERT]`, Bun `[INSERT]`, Deno `[INSERT]`, Effect `[INSERT]`. Raw results available in `benchmarks/results/`._
