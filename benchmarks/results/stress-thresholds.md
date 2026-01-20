# Stress Thresholds

Generated: 2026-03-13T01:58:54.585Z

| Platform | Confirmed max healthy connections |
| -------- | --------------------------------: |
| node     |                               200 |
| bun      |                              2000 |
| deno     |                              2000 |

Lowest common denominator: 200

Notes:

- Short 5s sweeps reached 3200 connections without errors/timeouts on any scenario.
- The first long confirmation run exposed a harness bug: confirmation runs were not draining child stdout/stderr, which blocked noisy Bun/Deno servers. The harness was fixed before recomputing thresholds.
- Confirmed thresholds are based on isolated 10s per-platform verification across all 5 scenarios.

Detailed median summary: stress-lcd-summary.md
