# Stress Benchmark Report

Generated: 2026-03-13T01:15:35.410Z
Levels: 100, 200, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200
Sweep duration: 5s
Confirm duration: 10s
Pipelining: 1
Warmup: 2s
Confirm runs: 3
Sweep lowest common denominator: not found
Confirmed lowest common denominator: not found

## Confirmation Search

| Connections | Result   |
| ----------: | -------- |
|        3200 | rejected |
|        2800 | rejected |
|        2400 | rejected |
|        2000 | rejected |
|        1600 | rejected |
|        1200 | rejected |
|         800 | rejected |
|         400 | rejected |
|         200 | rejected |
|         100 | rejected |

## 01-hello-world

Shared safe pressure: 3200

| Platform | Highest healthy | First broken | Peak req/sec | Peak at connections |
| -------- | --------------: | -----------: | -----------: | ------------------: |
| node     |            3200 |            — |        39395 |                 100 |
| bun      |            3200 |            — |        46787 |                 100 |
| deno     |            3200 |            — |        34838 |                1200 |

| Platform | Connections | Status  | Req/sec | Avg latency (ms) | p99 latency (ms) | Errors | Timeouts |
| -------- | ----------: | ------- | ------: | ---------------: | ---------------: | -----: | -------: |
| node     |         100 | healthy |   39395 |             2.05 |             3.00 |      0 |        0 |
| node     |         200 | healthy |   38211 |             4.77 |             7.00 |      0 |        0 |
| node     |         400 | healthy |   36158 |            10.56 |            17.00 |      0 |        0 |
| node     |         800 | healthy |   37450 |            16.45 |            21.00 |      0 |        0 |
| node     |        1200 | healthy |   36304 |            17.11 |            20.00 |      0 |        0 |
| node     |        1600 | healthy |   33883 |            19.58 |            27.00 |      0 |        0 |
| node     |        2000 | healthy |   34427 |            19.63 |            24.00 |      0 |        0 |
| node     |        2400 | healthy |   35050 |            20.99 |            28.00 |      0 |        0 |
| node     |        2800 | healthy |   33480 |            23.13 |            34.00 |      0 |        0 |
| node     |        3200 | healthy |   29298 |            29.14 |            62.00 |      0 |        0 |
| bun      |         100 | healthy |   46787 |             1.52 |             3.00 |      0 |        0 |
| bun      |         200 | healthy |   45162 |             3.91 |             6.00 |      0 |        0 |
| bun      |         400 | healthy |   40886 |             9.30 |            12.00 |      0 |        0 |
| bun      |         800 | healthy |   43133 |            18.05 |            22.00 |      0 |        0 |
| bun      |        1200 | healthy |   43926 |            26.82 |            32.00 |      0 |        0 |
| bun      |        1600 | healthy |   41936 |            37.64 |            52.00 |      0 |        0 |
| bun      |        2000 | healthy |   37790 |            52.43 |           138.00 |      0 |        0 |
| bun      |        2400 | healthy |   43459 |            54.64 |            98.00 |      0 |        0 |
| bun      |        2800 | healthy |   42653 |            65.06 |           166.00 |      0 |        0 |
| bun      |        3200 | healthy |   36024 |            88.27 |           352.00 |      0 |        0 |
| deno     |         100 | healthy |   32518 |             2.50 |             5.00 |      0 |        0 |
| deno     |         200 | healthy |   33435 |             5.48 |             9.00 |      0 |        0 |
| deno     |         400 | healthy |   34179 |            11.20 |            16.00 |      0 |        0 |
| deno     |         800 | healthy |   32339 |            24.24 |            33.00 |      0 |        0 |
| deno     |        1200 | healthy |   34838 |            33.91 |            38.00 |      0 |        0 |
| deno     |        1600 | healthy |   32226 |            49.05 |            57.00 |      0 |        0 |
| deno     |        2000 | healthy |   32597 |            60.77 |            99.00 |      0 |        0 |
| deno     |        2400 | healthy |   33246 |            71.50 |           105.00 |      0 |        0 |
| deno     |        2800 | healthy |   31661 |            87.80 |           185.00 |      0 |        0 |
| deno     |        3200 | healthy |   33819 |            93.87 |           228.00 |      0 |        0 |

## 02-json-api

Shared safe pressure: 3200

| Platform | Highest healthy | First broken | Peak req/sec | Peak at connections |
| -------- | --------------: | -----------: | -----------: | ------------------: |
| node     |            3200 |            — |        32456 |                 200 |
| bun      |            3200 |            — |        39862 |                 200 |
| deno     |            3200 |            — |        32934 |                 200 |

| Platform | Connections | Status  | Req/sec | Avg latency (ms) | p99 latency (ms) | Errors | Timeouts |
| -------- | ----------: | ------- | ------: | ---------------: | ---------------: | -----: | -------: |
| node     |         100 | healthy |   31515 |             2.62 |             5.00 |      0 |        0 |
| node     |         200 | healthy |   32456 |             5.67 |             7.00 |      0 |        0 |
| node     |         400 | healthy |   26504 |            14.57 |            18.00 |      0 |        0 |
| node     |         800 | healthy |   28978 |            19.81 |            23.00 |      0 |        0 |
| node     |        1200 | healthy |   30174 |            20.34 |            30.00 |      0 |        0 |
| node     |        1600 | healthy |   28510 |            23.20 |            34.00 |      0 |        0 |
| node     |        2000 | healthy |   30168 |            22.49 |            31.00 |      0 |        0 |
| node     |        2400 | healthy |   27653 |            25.64 |            37.00 |      0 |        0 |
| node     |        2800 | healthy |   27989 |            30.21 |            48.00 |      0 |        0 |
| node     |        3200 | healthy |   25365 |            32.30 |            48.00 |      0 |        0 |
| bun      |         100 | healthy |   39734 |             2.17 |             4.00 |      0 |        0 |
| bun      |         200 | healthy |   39862 |             4.53 |             7.00 |      0 |        0 |
| bun      |         400 | healthy |   36888 |            10.33 |            21.00 |      0 |        0 |
| bun      |         800 | healthy |   30270 |            25.87 |            47.00 |      0 |        0 |
| bun      |        1200 | healthy |   36562 |            32.33 |            42.00 |      0 |        0 |
| bun      |        1600 | healthy |   38422 |            41.10 |            55.00 |      0 |        0 |
| bun      |        2000 | healthy |   34947 |            56.58 |            93.00 |      0 |        0 |
| bun      |        2400 | healthy |   36379 |            65.44 |           169.00 |      0 |        0 |
| bun      |        2800 | healthy |   38461 |            72.18 |           211.00 |      0 |        0 |
| bun      |        3200 | healthy |   35893 |            88.45 |           356.00 |      0 |        0 |
| deno     |         100 | healthy |   28941 |             2.91 |             5.00 |      0 |        0 |
| deno     |         200 | healthy |   32934 |             5.54 |             7.00 |      0 |        0 |
| deno     |         400 | healthy |   31746 |            12.10 |            14.00 |      0 |        0 |
| deno     |         800 | healthy |   26603 |            29.54 |            44.00 |      0 |        0 |
| deno     |        1200 | healthy |   30018 |            39.35 |            62.00 |      0 |        0 |
| deno     |        1600 | healthy |   28123 |            56.40 |           101.00 |      0 |        0 |
| deno     |        2000 | healthy |   30594 |            64.70 |            73.00 |      0 |        0 |
| deno     |        2400 | healthy |   28498 |            83.49 |           144.00 |      0 |        0 |
| deno     |        2800 | healthy |   30558 |            90.82 |           193.00 |      0 |        0 |
| deno     |        3200 | healthy |   30619 |           103.56 |           246.00 |      0 |        0 |

## 03-routing

Shared safe pressure: 3200

| Platform | Highest healthy | First broken | Peak req/sec | Peak at connections |
| -------- | --------------: | -----------: | -----------: | ------------------: |
| node     |            3200 |            — |        32566 |                 400 |
| bun      |            3200 |            — |        41174 |                 200 |
| deno     |            3200 |            — |        33299 |                 200 |

| Platform | Connections | Status  | Req/sec | Avg latency (ms) | p99 latency (ms) | Errors | Timeouts |
| -------- | ----------: | ------- | ------: | ---------------: | ---------------: | -----: | -------: |
| node     |         100 | healthy |   31925 |             2.62 |             4.00 |      0 |        0 |
| node     |         200 | healthy |   29893 |             6.21 |             8.00 |      0 |        0 |
| node     |         400 | healthy |   32566 |            11.77 |            14.00 |      0 |        0 |
| node     |         800 | healthy |   30280 |            19.24 |            33.00 |      0 |        0 |
| node     |        1200 | healthy |   29254 |            21.29 |            31.00 |      0 |        0 |
| node     |        1600 | healthy |   30283 |            21.78 |            33.00 |      0 |        0 |
| node     |        2000 | healthy |   26402 |            24.32 |            37.00 |      0 |        0 |
| node     |        2400 | healthy |   27477 |            26.77 |            35.00 |      0 |        0 |
| node     |        2800 | healthy |   28456 |            29.89 |            42.00 |      0 |        0 |
| node     |        3200 | healthy |   29230 |            30.76 |            43.00 |      0 |        0 |
| bun      |         100 | healthy |   38499 |             2.23 |             5.00 |      0 |        0 |
| bun      |         200 | healthy |   41174 |             4.43 |             6.00 |      0 |        0 |
| bun      |         400 | healthy |   39555 |             9.62 |            13.00 |      0 |        0 |
| bun      |         800 | healthy |   35024 |            22.33 |            28.00 |      0 |        0 |
| bun      |        1200 | healthy |   39261 |            30.04 |            36.00 |      0 |        0 |
| bun      |        1600 | healthy |   37275 |            42.35 |            91.00 |      0 |        0 |
| bun      |        2000 | healthy |   35794 |            55.30 |            92.00 |      0 |        0 |
| bun      |        2400 | healthy |   32589 |            73.07 |           172.00 |      0 |        0 |
| bun      |        2800 | healthy |   36392 |            76.32 |           234.00 |      0 |        0 |
| bun      |        3200 | healthy |   34976 |            90.75 |           374.00 |      0 |        0 |
| deno     |         100 | healthy |   31989 |             2.64 |             4.00 |      0 |        0 |
| deno     |         200 | healthy |   33299 |             5.48 |             7.00 |      0 |        0 |
| deno     |         400 | healthy |   33290 |            11.51 |            14.00 |      0 |        0 |
| deno     |         800 | healthy |   31312 |            25.02 |            37.00 |      0 |        0 |
| deno     |        1200 | healthy |   29832 |            39.57 |            61.00 |      0 |        0 |
| deno     |        1600 | healthy |   31949 |            49.53 |            57.00 |      0 |        0 |
| deno     |        2000 | healthy |   32426 |            61.05 |            69.00 |      0 |        0 |
| deno     |        2400 | healthy |   29134 |            81.59 |           142.00 |      0 |        0 |
| deno     |        2800 | healthy |   31240 |            88.84 |           198.00 |      0 |        0 |
| deno     |        3200 | healthy |   29960 |           106.05 |           336.00 |      0 |        0 |

## 04-schema-validation

Shared safe pressure: 3200

| Platform | Highest healthy | First broken | Peak req/sec | Peak at connections |
| -------- | --------------: | -----------: | -----------: | ------------------: |
| node     |            3200 |            — |        23576 |                 400 |
| bun      |            3200 |            — |        30146 |                 100 |
| deno     |            3200 |            — |        19966 |                1600 |

| Platform | Connections | Status  | Req/sec | Avg latency (ms) | p99 latency (ms) | Errors | Timeouts |
| -------- | ----------: | ------- | ------: | ---------------: | ---------------: | -----: | -------: |
| node     |         100 | healthy |   22872 |             3.82 |             7.00 |      0 |        0 |
| node     |         200 | healthy |   22194 |             8.53 |            14.00 |      0 |        0 |
| node     |         400 | healthy |   23576 |            16.45 |            25.00 |      0 |        0 |
| node     |         800 | healthy |   22882 |            22.95 |            35.00 |      0 |        0 |
| node     |        1200 | healthy |   20958 |            27.36 |            39.00 |      0 |        0 |
| node     |        1600 | healthy |   20834 |            29.43 |            44.00 |      0 |        0 |
| node     |        2000 | healthy |   20991 |            28.30 |            46.00 |      0 |        0 |
| node     |        2400 | healthy |   21701 |            32.43 |            47.00 |      0 |        0 |
| node     |        2800 | healthy |   21170 |            35.54 |            53.00 |      0 |        0 |
| node     |        3200 | healthy |   19897 |            42.13 |            74.00 |      0 |        0 |
| bun      |         100 | healthy |   30146 |             2.75 |             5.00 |      0 |        0 |
| bun      |         200 | healthy |   24690 |             7.61 |            14.00 |      0 |        0 |
| bun      |         400 | healthy |   27368 |            14.11 |            25.00 |      0 |        0 |
| bun      |         800 | healthy |   28882 |            27.15 |            33.00 |      0 |        0 |
| bun      |        1200 | healthy |   27349 |            43.28 |            57.00 |      0 |        0 |
| bun      |        1600 | healthy |   27400 |            57.66 |            82.00 |      0 |        0 |
| bun      |        2000 | healthy |   22674 |            87.45 |           271.00 |      0 |        0 |
| bun      |        2400 | healthy |   25547 |            93.10 |           389.00 |      0 |        0 |
| bun      |        2800 | healthy |   24011 |           115.44 |           503.00 |      0 |        0 |
| bun      |        3200 | healthy |   21858 |           145.01 |          1077.00 |      0 |        0 |
| deno     |         100 | healthy |   14673 |             6.31 |            12.00 |      0 |        0 |
| deno     |         200 | healthy |   16483 |            11.62 |            28.00 |      0 |        0 |
| deno     |         400 | healthy |   12187 |            32.29 |            63.00 |      0 |        0 |
| deno     |         800 | healthy |   17575 |            44.86 |            73.00 |      0 |        0 |
| deno     |        1200 | healthy |   18562 |            63.98 |            87.00 |      0 |        0 |
| deno     |        1600 | healthy |   19966 |            79.24 |            90.00 |      0 |        0 |
| deno     |        2000 | healthy |   18517 |           106.67 |           155.00 |      0 |        0 |
| deno     |        2400 | healthy |   17854 |           132.95 |           262.00 |      0 |        0 |
| deno     |        2800 | healthy |   19029 |           145.01 |           273.00 |      0 |        0 |
| deno     |        3200 | healthy |   16024 |           195.02 |           373.00 |      0 |        0 |

## 05-middleware-chain

Shared safe pressure: 3200

| Platform | Highest healthy | First broken | Peak req/sec | Peak at connections |
| -------- | --------------: | -----------: | -----------: | ------------------: |
| node     |            3200 |            — |        29819 |                 200 |
| bun      |            3200 |            — |        32870 |                 100 |
| deno     |            3200 |            — |        28453 |                 200 |

| Platform | Connections | Status  | Req/sec | Avg latency (ms) | p99 latency (ms) | Errors | Timeouts |
| -------- | ----------: | ------- | ------: | ---------------: | ---------------: | -----: | -------: |
| node     |         100 | healthy |   28795 |             3.00 |             5.00 |      0 |        0 |
| node     |         200 | healthy |   29819 |             6.21 |            12.00 |      0 |        0 |
| node     |         400 | healthy |   26440 |            14.62 |            24.00 |      0 |        0 |
| node     |         800 | healthy |   16004 |            31.17 |            86.00 |      0 |        0 |
| node     |        1200 | healthy |   11768 |            37.83 |            72.00 |      0 |        0 |
| node     |        1600 | healthy |   22551 |            27.64 |            38.00 |      0 |        0 |
| node     |        2000 | healthy |   27685 |            24.40 |            36.00 |      0 |        0 |
| node     |        2400 | healthy |   26120 |            28.93 |            43.00 |      0 |        0 |
| node     |        2800 | healthy |   26072 |            30.48 |            46.00 |      0 |        0 |
| node     |        3200 | healthy |   21522 |            43.13 |            67.00 |      0 |        0 |
| bun      |         100 | healthy |   32870 |             2.47 |             5.00 |      0 |        0 |
| bun      |         200 | healthy |   32627 |             5.64 |             9.00 |      0 |        0 |
| bun      |         400 | healthy |   29192 |            13.20 |            17.00 |      0 |        0 |
| bun      |         800 | healthy |   31019 |            25.22 |            50.00 |      0 |        0 |
| bun      |        1200 | healthy |   29445 |            40.28 |            59.00 |      0 |        0 |
| bun      |        1600 | healthy |   30077 |            52.58 |            70.00 |      0 |        0 |
| bun      |        2000 | healthy |   29323 |            67.64 |           174.00 |      0 |        0 |
| bun      |        2400 | healthy |   29726 |            80.11 |           284.00 |      0 |        0 |
| bun      |        2800 | healthy |   32813 |            84.61 |           315.00 |      0 |        0 |
| bun      |        3200 | healthy |   32304 |            98.15 |           446.00 |      0 |        0 |
| deno     |         100 | healthy |   25106 |             3.48 |             8.00 |      0 |        0 |
| deno     |         200 | healthy |   28453 |             6.49 |             9.00 |      0 |        0 |
| deno     |         400 | healthy |   27643 |            13.96 |            17.00 |      0 |        0 |
| deno     |         800 | healthy |   24661 |            31.88 |            54.00 |      0 |        0 |
| deno     |        1200 | healthy |   27358 |            43.28 |            50.00 |      0 |        0 |
| deno     |        1600 | healthy |   25083 |            63.11 |           118.00 |      0 |        0 |
| deno     |        2000 | healthy |   24485 |            80.82 |           103.00 |      0 |        0 |
| deno     |        2400 | healthy |   23880 |            99.50 |           174.00 |      0 |        0 |
| deno     |        2800 | healthy |   26216 |           105.90 |           259.00 |      0 |        0 |
| deno     |        3200 | healthy |   26334 |           120.18 |           276.00 |      0 |        0 |

Confirmation search summaries: stress-confirm-search-summary.md/.csv/.json
