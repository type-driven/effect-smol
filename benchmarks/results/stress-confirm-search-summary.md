# Benchmark Results

Generated: 2026-03-13T01:15:35.406Z

Repeated runs are summarized with medians per scenario and load configuration.

## Suite: stress-confirm

### 01-hello-world

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          37473 |                    2.19 |                    4.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29831 |                    6.82 |                    9.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          34140 |                   13.36 |                   17.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    400 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    400 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          31647 |                   27.59 |                   68.00 |     36 |       36 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    800 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30332 |                   27.41 |                   62.00 |    377 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1200 |     1200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1200 |     1200 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1600, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           4233 |                  153.72 |                  535.00 |    961 |      392 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    939 |      939 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2000, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          33307 |                   29.40 |                   44.00 |   1037 |        9 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          17635 |                   57.70 |                  684.00 |   1581 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          31588 |                   32.57 |                   52.00 |   1758 |       59 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          32613 |                   35.52 |                  121.00 |   2030 |       65 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   3200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 02-json-api

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          34678 |                    2.32 |                    4.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          17493 |                   12.08 |                   20.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           3591 |                  106.18 |                  346.00 |     16 |       16 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    400 |      400 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    400 |       19 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           3725 |                  127.35 |                  540.00 |    330 |      109 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          17333 |                   37.33 |                   90.00 |    544 |       61 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1600, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26309 |                   29.03 |                   38.00 |    832 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2000, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27893 |                   33.66 |                   55.00 |   1065 |       18 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2000 |     2000 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27306 |                   37.72 |                   54.00 |   1528 |     1528 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27535 |                   36.37 |                   51.00 |   1787 |       32 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27950 |                   37.21 |                   76.00 |   2145 |       75 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   3200 |     3200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1592 |     1592 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 03-routing

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          17899 |                    5.85 |                   11.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30094 |                    8.43 |                   12.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29472 |                   13.07 |                   23.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    400 |      117 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    400 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26837 |                   29.65 |                   56.00 |     50 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30069 |                   28.79 |                   49.00 |    377 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1600, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28334 |                   30.43 |                   58.00 |    764 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2000, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28543 |                   32.77 |                   43.00 |   1189 |       41 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27428 |                   37.97 |                   66.00 |   1523 |     1523 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28424 |                   35.28 |                   49.00 |   1786 |       29 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28955 |                   35.33 |                   73.00 |   1888 |     1888 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   3200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 04-schema-validation

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           9371 |                   11.88 |                   69.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          22968 |                    8.20 |                   18.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           3600 |                   78.42 |                  216.00 |    124 |       80 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    400 |       44 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |     72 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          12676 |                   47.01 |                  183.00 |    368 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    800 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          22436 |                   34.28 |                   51.00 |    445 |       11 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1600, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21264 |                   36.59 |                   57.00 |    815 |       22 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2000, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           9980 |                   84.91 |                 2012.00 |   1236 |       63 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2000 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21848 |                   42.02 |                   64.00 |   1473 |       42 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1117 |     1117 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2400 |      227 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21513 |                   43.74 |                   58.00 |   1850 |       45 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21384 |                   47.89 |                   87.00 |   2166 |       89 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2609 |     2609 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2191 |     2191 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

### 05-middleware-chain

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          32502 |                    3.25 |                    5.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26816 |                    6.95 |                   13.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |     72 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28375 |                   13.60 |                   22.00 |      0 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    400 |       78 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    400 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          24040 |                   31.30 |                   62.00 |    124 |      124 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |    800 |      800 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    800 |      800 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          14662 |                   46.20 |                  245.00 |    709 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=1600, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          25244 |                   28.66 |                   43.00 |    768 |        0 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   1600 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2000, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          25859 |                   39.38 |                   46.00 |   1149 |     1149 |
| bun      |    1 |             75 |                   71.87 |                  365.00 |   1853 |      163 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2000 |     1721 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27356 |                   31.88 |                   47.00 |   1540 |       12 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26366 |                   31.77 |                   53.00 |   1959 |       24 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27566 |                   37.50 |                   61.00 |   1944 |     1944 |
| bun      |    1 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |   3200 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |
