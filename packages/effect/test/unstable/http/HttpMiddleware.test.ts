import { assert, describe, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Scheduler from "effect/Scheduler"
import type * as Tracer from "effect/Tracer"
import * as HttpMiddleware from "effect/unstable/http/HttpMiddleware"
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

describe("HttpMiddleware", () => {
  it.effect("tracer preserves parent span extraction and header redaction", () =>
    Effect.gen(function*() {
      const spans: Array<Tracer.Span> = []
      const scheduler = new Scheduler.MixedScheduler("sync")
      const request = HttpServerRequest.fromWeb(
        new Request("http://localhost/widgets?foo=bar", {
          headers: {
            "authorization": "secret",
            "traceparent": "00-11111111111111111111111111111111-2222222222222222-01",
            "user-agent": "autocannon",
            "x-test": "ok"
          }
        })
      )

      yield* HttpMiddleware.tracer(
        Effect.succeed(
          HttpServerResponse.text("ok").pipe(
            HttpServerResponse.setHeader("set-cookie", "foo=bar"),
            HttpServerResponse.setHeader("x-response", "1")
          )
        )
      ).pipe(
        Effect.provideService(HttpServerRequest.HttpServerRequest, request),
        Effect.withTracer(makeTracer(spans)),
        Effect.provideService(Scheduler.Scheduler, scheduler)
      )

      scheduler.flush()

      assert.strictEqual(spans.length, 1)
      const span = spans[0]
      assert.strictEqual(span.parent?._tag, "ExternalSpan")
      assert.strictEqual(span.parent?.traceId, "11111111111111111111111111111111")
      assert.strictEqual(span.parent?.spanId, "2222222222222222")
      assert.strictEqual(span.attributes.get("http.request.header.authorization"), "<redacted>")
      assert.strictEqual(span.attributes.get("http.request.header.x-test"), "ok")
      assert.strictEqual(span.attributes.get("http.response.header.set-cookie"), "<redacted>")
      assert.strictEqual(span.attributes.get("http.response.header.x-response"), "1")
      assert.strictEqual(span.attributes.get("user_agent.original"), "autocannon")
      assert.strictEqual(span.attributes.get("url.full"), "http://localhost/widgets?foo=bar")
    }))
})

const makeTracer = (spans: Array<Tracer.Span>): Tracer.Tracer => ({
  span(options) {
    const attributes = new Map<string, unknown>()
    const links = [...options.links]
    const span: Tracer.Span = {
      _tag: "Span",
      name: options.name,
      spanId: "span",
      traceId: options.parent?.traceId ?? "trace",
      parent: options.parent,
      annotations: options.annotations,
      status: {
        _tag: "Started",
        startTime: options.startTime
      },
      attributes,
      links,
      sampled: options.sampled,
      kind: options.kind,
      end(endTime, exit) {
        ;(span as { status: Tracer.Span["status"] }).status = {
          _tag: "Ended",
          startTime: options.startTime,
          endTime,
          exit
        }
      },
      attribute(key, value) {
        attributes.set(key, value)
      },
      event() {},
      addLinks(newLinks) {
        links.push(...newLinks)
      }
    }
    spans.push(span)
    return span
  }
})
