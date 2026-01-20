# Benchmark Results

Generated: 2026-03-13T18:34:47.268Z

Repeated runs are summarized with medians per scenario and load configuration.

## Suite: benchmark

### 01-hello-world

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          36357 |                    2.15 |                    3.00 |      0 |        0 |
| bun      |    2 |          37061 |                    2.46 |                   12.00 |      0 |        0 |
| deno     |    1 |          35350 |                    2.21 |                    3.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.02x |
| deno             |      0.97x |

### 02-json-api

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30863 |                    2.81 |                    4.00 |      0 |        0 |
| bun      |    1 |          34292 |                    2.40 |                    5.00 |      0 |        0 |
| deno     |    1 |          30667 |                    2.82 |                    4.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.11x |
| deno             |      0.99x |

### 05-middleware-chain

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29124 |                    3.03 |                    4.00 |      0 |        0 |
| bun      |    1 |          30169 |                    2.74 |                    6.00 |      0 |        0 |
| deno     |    1 |          26523 |                    3.26 |                    5.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.04x |
| deno             |      0.91x |

## Suite: stress-confirm

### 01-hello-world

#### connections=100, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          37473 |                    2.19 |                    4.00 |      0 |        0 |
| bun      |    2 |              0 |                    0.00 |                    0.00 |    200 |      200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    5 |          34849 |                    6.26 |                    8.00 |      0 |        0 |
| bun      |    5 |          27963 |                    4.71 |                   12.00 |    400 |      223 |
| deno     |    4 |           4544 |                   23.98 |                  112.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.80x |
| deno             |      0.13x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          34140 |                   13.36 |                   17.00 |      0 |        0 |
| bun      |    2 |              0 |                    0.00 |                    0.00 |    800 |       21 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   2400 |     1200 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   3200 |       50 |
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
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4000 |        0 |
| deno     |    2 |          16694 |                   35.09 |                   68.00 |   2000 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.50x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          17635 |                   57.70 |                  684.00 |   1581 |        0 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4800 |        0 |
| deno     |    2 |          15381 |                   80.93 |                  353.00 |   5143 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.87x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          31588 |                   32.57 |                   52.00 |   1758 |       59 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   5705 |     2905 |
| deno     |    2 |             92 |                 2964.78 |                 7466.00 |   5412 |     2612 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    4 |          28305 |                   41.01 |                  138.00 |   7890 |      599 |
| bun      |    6 |              0 |                    0.00 |                    0.00 |  16000 |        0 |
| deno     |    5 |              0 |                    0.00 |                    0.00 |  12800 |        0 |

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
| bun      |    2 |              0 |                    0.00 |                    0.00 |    200 |      200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    5 |          17811 |                   10.72 |                   20.00 |      0 |        0 |
| bun      |    5 |           3811 |                    4.85 |                    9.00 |    400 |      256 |
| deno     |    4 |          24014 |                    6.03 |                   10.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.21x |
| deno             |      1.35x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           3591 |                  106.18 |                  346.00 |     16 |       16 |
| bun      |    2 |              0 |                    0.00 |                    0.00 |    800 |      400 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   2400 |     1200 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
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
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4000 |        0 |
| deno     |    2 |          12692 |                   42.58 |                  148.50 |   2000 |     2000 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.46x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27306 |                   37.72 |                   54.00 |   1528 |     1528 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4800 |        0 |
| deno     |    2 |           5891 |                  100.75 |                  198.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.22x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27535 |                   36.37 |                   51.00 |   1787 |       32 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   5912 |      312 |
| deno     |    2 |          15787 |                   44.06 |                   54.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.57x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    4 |          26378 |                   40.30 |                  105.00 |   8535 |      301 |
| bun      |    6 |              0 |                    0.00 |                    0.00 |  16000 |     3200 |
| deno     |    5 |              0 |                    0.00 |                    0.00 |  11192 |     1592 |

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
| bun      |    2 |              0 |                    0.00 |                    0.00 |    200 |      200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    5 |          16687 |                   13.76 |                   14.00 |      0 |        0 |
| bun      |    5 |           3013 |                   15.84 |                   94.00 |    400 |      256 |
| deno     |    4 |          28992 |                    6.54 |                    9.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.18x |
| deno             |      1.74x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29472 |                   13.07 |                   23.00 |      0 |        0 |
| bun      |    2 |              0 |                    0.00 |                    0.00 |    800 |      119 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   1600 |      791 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
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
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4000 |        0 |
| deno     |    2 |           1434 |                  346.33 |                 2910.50 |   2000 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.05x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27428 |                   37.97 |                   66.00 |   1523 |     1523 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4800 |     2400 |
| deno     |    2 |           4805 |                  137.15 |                 1217.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.18x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28424 |                   35.28 |                   49.00 |   1786 |       29 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   6219 |      619 |
| deno     |    2 |          15849 |                   43.87 |                   74.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.56x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    4 |          27212 |                   36.63 |                   94.00 |   8504 |     2095 |
| bun      |    6 |              0 |                    0.00 |                    0.00 |  16000 |        0 |
| deno     |    5 |              0 |                    0.00 |                    0.00 |  12800 |        0 |

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
| bun      |    2 |              0 |                    0.00 |                    0.00 |    200 |      200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    5 |          22968 |                    8.20 |                   15.00 |      0 |        0 |
| bun      |    5 |           1368 |                  129.68 |                  355.00 |    400 |      256 |
| deno     |    4 |           9214 |                   19.48 |                   24.00 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.06x |
| deno             |      0.40x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |           3600 |                   78.42 |                  216.00 |    124 |       80 |
| bun      |    2 |              0 |                    0.00 |                    0.00 |    800 |      172 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   1600 |        0 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
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
| bun      |    3 |              0 |                    0.00 |                    0.00 |   4000 |        0 |
| deno     |    2 |           1333 |                  374.77 |                 1645.00 |   2000 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.13x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21848 |                   42.02 |                   64.00 |   1473 |       42 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   3653 |     1234 |
| deno     |    2 |           9999 |                   59.57 |                   75.00 |   2400 |      227 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.46x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21513 |                   43.74 |                   58.00 |   1850 |       45 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   5600 |        0 |
| deno     |    2 |           9327 |                   88.05 |                 1189.00 |   2800 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.43x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    4 |          20855 |                   48.82 |                   89.00 |   8753 |      260 |
| bun      |    6 |              0 |                    0.00 |                    0.00 |  15409 |     2609 |
| deno     |    5 |              0 |                    0.00 |                    0.00 |  14361 |     2191 |

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
| bun      |    2 |              0 |                    0.00 |                    0.00 |    200 |      200 |
| deno     |    1 |              0 |                    0.00 |                    0.00 |    100 |      100 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

#### connections=200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    5 |          28904 |                    6.95 |                    9.00 |      0 |        0 |
| bun      |    5 |           1800 |                  102.33 |                  304.00 |    272 |      128 |
| deno     |    4 |           8808 |                   14.16 |                   31.50 |    200 |      128 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.06x |
| deno             |      0.30x |

#### connections=400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28375 |                   13.60 |                   22.00 |      0 |        0 |
| bun      |    2 |              0 |                    0.00 |                    0.00 |    800 |      120 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   1600 |      800 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   2400 |        0 |
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
| bun      |    2 |              0 |                    0.00 |                    0.00 |   3200 |        0 |
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
| bun      |    3 |             75 |                   71.87 |                  365.00 |   3853 |      163 |
| deno     |    2 |           1751 |                  284.50 |                 1404.50 |   2000 |     1721 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.07x |

#### connections=2400, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27356 |                   31.88 |                   47.00 |   1540 |       12 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   5223 |        0 |
| deno     |    2 |          14296 |                   41.65 |                   60.00 |   2400 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.52x |

#### connections=2800, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26366 |                   31.77 |                   53.00 |   1959 |       24 |
| bun      |    3 |              0 |                    0.00 |                    0.00 |   5600 |        0 |
| deno     |    2 |          12063 |                  238.96 |                 3516.00 |   5570 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.46x |

#### connections=3200, duration=10s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    4 |          26047 |                   38.11 |                   66.50 |   8677 |     2093 |
| bun      |    6 |              0 |                    0.00 |                    0.00 |  16609 |        0 |
| deno     |    5 |              0 |                    0.00 |                    0.00 |  17986 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      0.00x |
| deno             |      0.00x |

## Suite: stress-sweep

### 01-hello-world

#### connections=100, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          39395 |                    2.05 |                    3.00 |      0 |        0 |
| bun      |    1 |          46787 |                    1.52 |                    3.00 |      0 |        0 |
| deno     |    1 |          32518 |                    2.50 |                    5.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.19x |
| deno             |      0.83x |

#### connections=200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          38211 |                    4.77 |                    7.00 |      0 |        0 |
| bun      |    1 |          45162 |                    3.91 |                    6.00 |      0 |        0 |
| deno     |    1 |          33435 |                    5.48 |                    9.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.18x |
| deno             |      0.88x |

#### connections=400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          36158 |                   10.56 |                   17.00 |      0 |        0 |
| bun      |    1 |          40886 |                    9.30 |                   12.00 |      0 |        0 |
| deno     |    1 |          34179 |                   11.20 |                   16.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.13x |
| deno             |      0.95x |

#### connections=800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          37450 |                   16.45 |                   21.00 |      0 |        0 |
| bun      |    1 |          43133 |                   18.05 |                   22.00 |      0 |        0 |
| deno     |    1 |          32339 |                   24.24 |                   33.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.15x |
| deno             |      0.86x |

#### connections=1200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          36304 |                   17.11 |                   20.00 |      0 |        0 |
| bun      |    1 |          43926 |                   26.82 |                   32.00 |      0 |        0 |
| deno     |    1 |          34838 |                   33.91 |                   38.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.21x |
| deno             |      0.96x |

#### connections=1600, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          33883 |                   19.58 |                   27.00 |      0 |        0 |
| bun      |    1 |          41936 |                   37.64 |                   52.00 |      0 |        0 |
| deno     |    1 |          32226 |                   49.05 |                   57.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.24x |
| deno             |      0.95x |

#### connections=2000, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          34427 |                   19.63 |                   24.00 |      0 |        0 |
| bun      |    1 |          37790 |                   52.43 |                  138.00 |      0 |        0 |
| deno     |    1 |          32597 |                   60.77 |                   99.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.10x |
| deno             |      0.95x |

#### connections=2400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          35050 |                   20.99 |                   28.00 |      0 |        0 |
| bun      |    1 |          43459 |                   54.64 |                   98.00 |      0 |        0 |
| deno     |    1 |          33246 |                   71.50 |                  105.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.24x |
| deno             |      0.95x |

#### connections=2800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          33480 |                   23.13 |                   34.00 |      0 |        0 |
| bun      |    1 |          42653 |                   65.06 |                  166.00 |      0 |        0 |
| deno     |    1 |          31661 |                   87.80 |                  185.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.27x |
| deno             |      0.95x |

#### connections=3200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29298 |                   29.14 |                   62.00 |      0 |        0 |
| bun      |    1 |          36024 |                   88.27 |                  352.00 |      0 |        0 |
| deno     |    1 |          33819 |                   93.87 |                  228.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.23x |
| deno             |      1.15x |

### 02-json-api

#### connections=100, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          31515 |                    2.62 |                    5.00 |      0 |        0 |
| bun      |    1 |          39734 |                    2.17 |                    4.00 |      0 |        0 |
| deno     |    1 |          28941 |                    2.91 |                    5.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.26x |
| deno             |      0.92x |

#### connections=200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          32456 |                    5.67 |                    7.00 |      0 |        0 |
| bun      |    1 |          39862 |                    4.53 |                    7.00 |      0 |        0 |
| deno     |    1 |          32934 |                    5.54 |                    7.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.23x |
| deno             |      1.01x |

#### connections=400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26504 |                   14.57 |                   18.00 |      0 |        0 |
| bun      |    1 |          36888 |                   10.33 |                   21.00 |      0 |        0 |
| deno     |    1 |          31746 |                   12.10 |                   14.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.39x |
| deno             |      1.20x |

#### connections=800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28978 |                   19.81 |                   23.00 |      0 |        0 |
| bun      |    1 |          30270 |                   25.87 |                   47.00 |      0 |        0 |
| deno     |    1 |          26603 |                   29.54 |                   44.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.04x |
| deno             |      0.92x |

#### connections=1200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30174 |                   20.34 |                   30.00 |      0 |        0 |
| bun      |    1 |          36562 |                   32.33 |                   42.00 |      0 |        0 |
| deno     |    1 |          30018 |                   39.35 |                   62.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.21x |
| deno             |      0.99x |

#### connections=1600, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28510 |                   23.20 |                   34.00 |      0 |        0 |
| bun      |    1 |          38422 |                   41.10 |                   55.00 |      0 |        0 |
| deno     |    1 |          28123 |                   56.40 |                  101.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.35x |
| deno             |      0.99x |

#### connections=2000, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30168 |                   22.49 |                   31.00 |      0 |        0 |
| bun      |    1 |          34947 |                   56.58 |                   93.00 |      0 |        0 |
| deno     |    1 |          30594 |                   64.70 |                   73.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.16x |
| deno             |      1.01x |

#### connections=2400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27653 |                   25.64 |                   37.00 |      0 |        0 |
| bun      |    1 |          36379 |                   65.44 |                  169.00 |      0 |        0 |
| deno     |    1 |          28498 |                   83.49 |                  144.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.32x |
| deno             |      1.03x |

#### connections=2800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27989 |                   30.21 |                   48.00 |      0 |        0 |
| bun      |    1 |          38461 |                   72.18 |                  211.00 |      0 |        0 |
| deno     |    1 |          30558 |                   90.82 |                  193.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.37x |
| deno             |      1.09x |

#### connections=3200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          25365 |                   32.30 |                   48.00 |      0 |        0 |
| bun      |    1 |          35893 |                   88.45 |                  356.00 |      0 |        0 |
| deno     |    1 |          30619 |                  103.56 |                  246.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.42x |
| deno             |      1.21x |

### 03-routing

#### connections=100, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          31925 |                    2.62 |                    4.00 |      0 |        0 |
| bun      |    1 |          38499 |                    2.23 |                    5.00 |      0 |        0 |
| deno     |    1 |          31989 |                    2.64 |                    4.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.21x |
| deno             |      1.00x |

#### connections=200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29893 |                    6.21 |                    8.00 |      0 |        0 |
| bun      |    1 |          41174 |                    4.43 |                    6.00 |      0 |        0 |
| deno     |    1 |          33299 |                    5.48 |                    7.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.38x |
| deno             |      1.11x |

#### connections=400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          32566 |                   11.77 |                   14.00 |      0 |        0 |
| bun      |    1 |          39555 |                    9.62 |                   13.00 |      0 |        0 |
| deno     |    1 |          33290 |                   11.51 |                   14.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.21x |
| deno             |      1.02x |

#### connections=800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30280 |                   19.24 |                   33.00 |      0 |        0 |
| bun      |    1 |          35024 |                   22.33 |                   28.00 |      0 |        0 |
| deno     |    1 |          31312 |                   25.02 |                   37.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.16x |
| deno             |      1.03x |

#### connections=1200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29254 |                   21.29 |                   31.00 |      0 |        0 |
| bun      |    1 |          39261 |                   30.04 |                   36.00 |      0 |        0 |
| deno     |    1 |          29832 |                   39.57 |                   61.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.34x |
| deno             |      1.02x |

#### connections=1600, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          30283 |                   21.78 |                   33.00 |      0 |        0 |
| bun      |    1 |          37275 |                   42.35 |                   91.00 |      0 |        0 |
| deno     |    1 |          31949 |                   49.53 |                   57.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.23x |
| deno             |      1.06x |

#### connections=2000, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26402 |                   24.32 |                   37.00 |      0 |        0 |
| bun      |    1 |          35794 |                   55.30 |                   92.00 |      0 |        0 |
| deno     |    1 |          32426 |                   61.05 |                   69.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.36x |
| deno             |      1.23x |

#### connections=2400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27477 |                   26.77 |                   35.00 |      0 |        0 |
| bun      |    1 |          32589 |                   73.07 |                  172.00 |      0 |        0 |
| deno     |    1 |          29134 |                   81.59 |                  142.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.19x |
| deno             |      1.06x |

#### connections=2800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28456 |                   29.89 |                   42.00 |      0 |        0 |
| bun      |    1 |          36392 |                   76.32 |                  234.00 |      0 |        0 |
| deno     |    1 |          31240 |                   88.84 |                  198.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.28x |
| deno             |      1.10x |

#### connections=3200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29230 |                   30.76 |                   43.00 |      0 |        0 |
| bun      |    1 |          34976 |                   90.75 |                  374.00 |      0 |        0 |
| deno     |    1 |          29960 |                  106.05 |                  336.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.20x |
| deno             |      1.02x |

### 04-schema-validation

#### connections=100, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          22872 |                    3.82 |                    7.00 |      0 |        0 |
| bun      |    1 |          30146 |                    2.75 |                    5.00 |      0 |        0 |
| deno     |    1 |          14673 |                    6.31 |                   12.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.32x |
| deno             |      0.64x |

#### connections=200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          22194 |                    8.53 |                   14.00 |      0 |        0 |
| bun      |    1 |          24690 |                    7.61 |                   14.00 |      0 |        0 |
| deno     |    1 |          16483 |                   11.62 |                   28.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.11x |
| deno             |      0.74x |

#### connections=400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          23576 |                   16.45 |                   25.00 |      0 |        0 |
| bun      |    1 |          27368 |                   14.11 |                   25.00 |      0 |        0 |
| deno     |    1 |          12187 |                   32.29 |                   63.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.16x |
| deno             |      0.52x |

#### connections=800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          22882 |                   22.95 |                   35.00 |      0 |        0 |
| bun      |    1 |          28882 |                   27.15 |                   33.00 |      0 |        0 |
| deno     |    1 |          17575 |                   44.86 |                   73.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.26x |
| deno             |      0.77x |

#### connections=1200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          20958 |                   27.36 |                   39.00 |      0 |        0 |
| bun      |    1 |          27349 |                   43.28 |                   57.00 |      0 |        0 |
| deno     |    1 |          18562 |                   63.98 |                   87.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.30x |
| deno             |      0.89x |

#### connections=1600, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          20834 |                   29.43 |                   44.00 |      0 |        0 |
| bun      |    1 |          27400 |                   57.66 |                   82.00 |      0 |        0 |
| deno     |    1 |          19966 |                   79.24 |                   90.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.32x |
| deno             |      0.96x |

#### connections=2000, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          20991 |                   28.30 |                   46.00 |      0 |        0 |
| bun      |    1 |          22674 |                   87.45 |                  271.00 |      0 |        0 |
| deno     |    1 |          18517 |                  106.67 |                  155.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.08x |
| deno             |      0.88x |

#### connections=2400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21701 |                   32.43 |                   47.00 |      0 |        0 |
| bun      |    1 |          25547 |                   93.10 |                  389.00 |      0 |        0 |
| deno     |    1 |          17854 |                  132.95 |                  262.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.18x |
| deno             |      0.82x |

#### connections=2800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21170 |                   35.54 |                   53.00 |      0 |        0 |
| bun      |    1 |          24011 |                  115.44 |                  503.00 |      0 |        0 |
| deno     |    1 |          19029 |                  145.01 |                  273.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.13x |
| deno             |      0.90x |

#### connections=3200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          19897 |                   42.13 |                   74.00 |      0 |        0 |
| bun      |    1 |          21858 |                  145.01 |                 1077.00 |      0 |        0 |
| deno     |    1 |          16024 |                  195.02 |                  373.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.10x |
| deno             |      0.81x |

### 05-middleware-chain

#### connections=100, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          28795 |                    3.00 |                    5.00 |      0 |        0 |
| bun      |    1 |          32870 |                    2.47 |                    5.00 |      0 |        0 |
| deno     |    1 |          25106 |                    3.48 |                    8.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.14x |
| deno             |      0.87x |

#### connections=200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          29819 |                    6.21 |                   12.00 |      0 |        0 |
| bun      |    1 |          32627 |                    5.64 |                    9.00 |      0 |        0 |
| deno     |    1 |          28453 |                    6.49 |                    9.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.09x |
| deno             |      0.95x |

#### connections=400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26440 |                   14.62 |                   24.00 |      0 |        0 |
| bun      |    1 |          29192 |                   13.20 |                   17.00 |      0 |        0 |
| deno     |    1 |          27643 |                   13.96 |                   17.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.10x |
| deno             |      1.05x |

#### connections=800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          16004 |                   31.17 |                   86.00 |      0 |        0 |
| bun      |    1 |          31019 |                   25.22 |                   50.00 |      0 |        0 |
| deno     |    1 |          24661 |                   31.88 |                   54.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.94x |
| deno             |      1.54x |

#### connections=1200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          11768 |                   37.83 |                   72.00 |      0 |        0 |
| bun      |    1 |          29445 |                   40.28 |                   59.00 |      0 |        0 |
| deno     |    1 |          27358 |                   43.28 |                   50.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      2.50x |
| deno             |      2.32x |

#### connections=1600, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          22551 |                   27.64 |                   38.00 |      0 |        0 |
| bun      |    1 |          30077 |                   52.58 |                   70.00 |      0 |        0 |
| deno     |    1 |          25083 |                   63.11 |                  118.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.33x |
| deno             |      1.11x |

#### connections=2000, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          27685 |                   24.40 |                   36.00 |      0 |        0 |
| bun      |    1 |          29323 |                   67.64 |                  174.00 |      0 |        0 |
| deno     |    1 |          24485 |                   80.82 |                  103.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.06x |
| deno             |      0.88x |

#### connections=2400, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26120 |                   28.93 |                   43.00 |      0 |        0 |
| bun      |    1 |          29726 |                   80.11 |                  284.00 |      0 |        0 |
| deno     |    1 |          23880 |                   99.50 |                  174.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.14x |
| deno             |      0.91x |

#### connections=2800, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          26072 |                   30.48 |                   46.00 |      0 |        0 |
| bun      |    1 |          32813 |                   84.61 |                  315.00 |      0 |        0 |
| deno     |    1 |          26216 |                  105.90 |                  259.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.26x |
| deno             |      1.01x |

#### connections=3200, duration=5s, pipelining=1

| Platform | Runs | Req/sec median | Latency avg median (ms) | Latency p99 median (ms) | Errors | Timeouts |
| -------- | ---: | -------------: | ----------------------: | ----------------------: | -----: | -------: |
| node     |    1 |          21522 |                   43.13 |                   67.00 |      0 |        0 |
| bun      |    1 |          32304 |                   98.15 |                  446.00 |      0 |        0 |
| deno     |    1 |          26334 |                  120.18 |                  276.00 |      0 |        0 |

| Relative to node | Multiplier |
| ---------------- | ---------: |
| node             |      1.00x |
| bun              |      1.50x |
| deno             |      1.22x |
