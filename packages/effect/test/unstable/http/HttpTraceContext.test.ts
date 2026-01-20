import { assert, describe, it } from "@effect/vitest"
import * as HttpTraceContext from "effect/unstable/http/HttpTraceContext"

describe("HttpTraceContext", () => {
  it("parses traceparent from native headers", () => {
    const parent = HttpTraceContext.fromWebHeaders(
      new globalThis.Headers({
        traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
      })
    )

    if (parent === undefined) {
      throw new Error("expected parent span")
    }
    assert.strictEqual(parent.traceId, "4bf92f3577b34da6a3ce929d0e0e4736")
    assert.strictEqual(parent.spanId, "00f067aa0ba902b7")
    assert.strictEqual(parent.sampled, true)
  })
})
