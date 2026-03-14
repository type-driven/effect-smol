import * as DenoHttpServer from "@effect/platform-deno/DenoHttpServer"
import { assert, describe, it, vitest } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Option from "effect/Option"
import * as Scope from "effect/Scope"
import * as ServiceMap from "effect/ServiceMap"
import * as Stream from "effect/Stream"
import { HttpServerRequest, HttpServerResponse } from "effect/unstable/http"
import * as HttpServerResponseModule from "effect/unstable/http/HttpServerResponse"

class Prefix extends ServiceMap.Service<Prefix, string>()("Prefix") {}

const withStubbedDenoServe = Effect.fnUntraced(function*<
  A,
  E,
  R
>(
  serve: typeof globalThis.Deno.serve,
  effect: Effect.Effect<A, E, R>
) {
  const previousDeno = (globalThis as any).Deno
  ;(globalThis as any).Deno = {
    ...previousDeno,
    serve
  }
  yield* Effect.addFinalizer(() =>
    Effect.sync(() => {
      if (previousDeno === undefined) {
        delete (globalThis as any).Deno
      } else {
        ;(globalThis as any).Deno = previousDeno
      }
    })
  )
  return yield* effect
})

describe("DenoHttpServer", () => {
  it.effect("make surfaces Deno.serve failures as ServeError", () =>
    Effect.gen(function*() {
      const error = new Error("boom")
      const failure = yield* withStubbedDenoServe(
        (() => {
          throw error
        }) as typeof globalThis.Deno.serve,
        Effect.flip(DenoHttpServer.make(3000))
      )

      assert.strictEqual(failure._tag, "ServeError")
      assert.strictEqual(failure.cause, error)
    }))

  it.effect("makeHandler preserves services for stream responses", () =>
    Effect.gen(function*() {
      const scope = yield* Scope.make()
      yield* Effect.addFinalizer(() => Scope.close(scope, Exit.void))
      const handler = yield* DenoHttpServer.makeHandler(
        Effect.map(Prefix.asEffect(), (prefix) =>
          HttpServerResponse.stream(Stream.make(new TextEncoder().encode(prefix)))),
        { scope }
      ).pipe(Effect.provideService(Prefix, "ok"))

      const response = yield* Effect.promise(() =>
        Promise.resolve(handler(
          new Request("http://localhost/"),
          {
            remoteAddr: {
              hostname: "127.0.0.1",
              port: 3000,
              transport: "tcp"
            }
          } as Deno.ServeHandlerInfo
        ))
      )

      assert.strictEqual(
        yield* Effect.promise(() =>
          response.text()
        ),
        "ok"
      )
    }))

  it.effect("makeHandler sets the remote address without cloning the request", () =>
    Effect.gen(function*() {
      const scope = yield* Scope.make()
      yield* Effect.addFinalizer(() => Scope.close(scope, Exit.void))
      const handler = yield* DenoHttpServer.makeHandler(
        Effect.map(HttpServerRequest.HttpServerRequest.asEffect(), (request) =>
          HttpServerResponse.text(Option.getOrElse(request.remoteAddress, () => "missing"))),
        { scope }
      )

      const response = yield* Effect.promise(() =>
        Promise.resolve(handler(
          new Request("http://localhost/"),
          {
            remoteAddr: {
              hostname: "127.0.0.1",
              port: 3000,
              transport: "tcp"
            }
          } as Deno.ServeHandlerInfo
        ))
      )

      assert.strictEqual(
        yield* Effect.promise(() =>
          response.text()
        ),
        "127.0.0.1"
      )
    }))

  it.effect("makeHandler returns simple responses synchronously", () =>
    Effect.gen(function*() {
      const scope = yield* Scope.make()
      yield* Effect.addFinalizer(() => Scope.close(scope, Exit.void))
      const handler = yield* DenoHttpServer.makeHandler(
        Effect.succeed(HttpServerResponse.text("ok")),
        { scope }
      )

      const response = handler(
        new Request("http://localhost/"),
        {
          remoteAddr: {
            hostname: "127.0.0.1",
            port: 3000,
            transport: "tcp"
          }
        } as Deno.ServeHandlerInfo
      )

      assert.strictEqual(response instanceof Response, true)
      assert.strictEqual(
        yield* Effect.promise(() => Promise.resolve(response).then((_) => _.text())),
        "ok"
      )
    }))

  it.effect("makeHandler falls back to generic conversion for cookie responses", () =>
    Effect.gen(function*() {
      const scope = yield* Scope.make()
      yield* Effect.addFinalizer(() => Scope.close(scope, Exit.void))
      const toWebSpy = vitest.spyOn(HttpServerResponseModule, "toWeb")
      yield* Effect.addFinalizer(() => Effect.sync(() => toWebSpy.mockRestore()))
      const handler = yield* DenoHttpServer.makeHandler(
        Effect.succeed(
          HttpServerResponse.text("ok").pipe(
            HttpServerResponse.setCookieUnsafe("foo", "bar")
          )
        ),
        { scope }
      )

      const response = yield* Effect.promise(() =>
        Promise.resolve(handler(
          new Request("http://localhost/"),
          {
            remoteAddr: {
              hostname: "127.0.0.1",
              port: 3000,
              transport: "tcp"
            }
          } as Deno.ServeHandlerInfo
        ))
      )

      assert.strictEqual(toWebSpy.mock.calls.length, 1)
      assert.strictEqual(
        yield* Effect.promise(() => response.text()),
        "ok"
      )
    }))

  it.effect("makeHandler omits the body for HEAD responses", () =>
    Effect.gen(function*() {
      const scope = yield* Scope.make()
      yield* Effect.addFinalizer(() => Scope.close(scope, Exit.void))
      const handler = yield* DenoHttpServer.makeHandler(
        Effect.succeed(HttpServerResponse.text("ok")),
        { scope }
      )

      const response = yield* Effect.promise(() =>
        Promise.resolve(handler(
          new Request("http://localhost/", { method: "HEAD" }),
          {
            remoteAddr: {
              hostname: "127.0.0.1",
              port: 3000,
              transport: "tcp"
            }
          } as Deno.ServeHandlerInfo
        ))
      )

      assert.strictEqual(response.headers.get("content-length"), "2")
      assert.strictEqual(
        yield* Effect.promise(() => response.text()),
        ""
      )
    }))
})
