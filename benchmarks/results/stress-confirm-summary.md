# Benchmark Results

Generated: 2026-03-13T00:35:50.120Z

Repeated runs are summarized with medians per scenario and load configuration.

## Suite: stress-confirm

### 01-hello-world

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          28271 |                   41.80 |                  146.00 |   5860 |      534 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |
| deno     |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 02-json-api

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          25208 |                   43.39 |                  131.00 |   6390 |      226 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |
| deno     |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 03-routing

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          26262 |                   37.93 |                  115.00 |   6616 |      207 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |
| deno     |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 04-schema-validation

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          20325 |                   49.75 |                   91.00 |   6587 |      171 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |
| deno     |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 05-middleware-chain

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          25253 |                   38.72 |                   70.00 |   6733 |      149 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |
| deno     |    3 |              0 |                    0.00 |                    0.00 |   9600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |
