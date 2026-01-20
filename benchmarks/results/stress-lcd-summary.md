# Benchmark Results

Generated: 2026-03-13T01:57:56.292Z

Repeated runs are summarized with medians per scenario and load configuration.

## Suite: stress-confirm

### 01-hello-world

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          34849 |                    6.26 |                    8.00 |      0 |        0 |
| bun      |    3 |          37497 |                    4.84 |                   12.00 |      0 |        0 |
| deno     |    3 |           4712 |                   42.48 |                  213.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.08x |
| deno             |      0.14x |

### 02-json-api

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          17811 |                   10.72 |                   26.00 |      0 |        0 |
| bun      |    3 |          21688 |                    9.91 |                   16.00 |      0 |        0 |
| deno     |    3 |          29971 |                    6.17 |                   11.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.22x |
| deno             |      1.68x |

### 03-routing

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          16523 |                   14.01 |                   22.00 |      0 |        0 |
| bun      |    3 |           3583 |                   54.66 |                  188.00 |      0 |        0 |
| deno     |    3 |          29084 |                    7.29 |                    9.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.22x |
| deno             |      1.76x |

### 04-schema-validation

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          23330 |                    8.06 |                   13.00 |      0 |        0 |
| bun      |    3 |           1482 |                  134.61 |                  445.00 |      0 |        0 |
| deno     |    3 |           9851 |                   20.71 |                   27.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.06x |
| deno             |      0.42x |

### 05-middleware-chain

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    3 |          28904 |                    7.37 |                    7.00 |      0 |        0 |
| bun      |    3 |           1946 |                  104.68 |                 2169.00 |      0 |        0 |
| deno     |    3 |          14539 |                   15.08 |                   33.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.07x |
| deno             |      0.50x |
