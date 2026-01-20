---
"effect": patch
"@effect/platform-deno": patch
---

Fix Deno KV binary reads and clear batching, preserve streamed HTTP response services, and surface worker disconnects.
Reduce Deno HTTP adapter overhead by fast-pathing simple responses, returning synchronously completed responses without an extra Promise, caching the scheduler in the handler runtime so requests stop cloning it into a fresh service map, and reusing native request URL, headers, and method data on the traced request path.
