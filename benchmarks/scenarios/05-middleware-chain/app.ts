import * as Effect from "effect/Effect"
import * as ServiceMap from "effect/ServiceMap"
import * as HttpMiddleware from "effect/unstable/http/HttpMiddleware"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

class RequestId extends ServiceMap.Reference("benchmarks/RequestId", {
  defaultValue: () => ""
}) {}

class RequestStartTime extends ServiceMap.Reference("benchmarks/RequestStartTime", {
  defaultValue: (): number => 0
}) {}

const timingMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function*() {
    const start = Date.now()
    const response = yield* Effect.provideService(app, RequestStartTime, start)
    const elapsed = Date.now() - start
    return HttpServerResponse.setHeader(response, "x-response-time", `${elapsed}ms`)
  })
)

const requestIdMiddleware = HttpMiddleware.make((app) => {
  const id = `req-${Math.random().toString(36).slice(2, 10)}`
  return Effect.flatMap(
    Effect.provideService(app, RequestId, id),
    (response) => Effect.succeed(HttpServerResponse.setHeader(response, "x-request-id", id))
  )
})

const authMiddleware = HttpMiddleware.make((app) =>
  Effect.withFiber((fiber) => {
    const request = ServiceMap.getUnsafe(fiber.services, HttpServerRequest.HttpServerRequest)
    const authHeader = request.headers["x-auth-token"]
    if (!authHeader || authHeader !== "benchmark-token") {
      return Effect.succeed(HttpServerResponse.text("Unauthorized", { status: 401 }))
    }
    return app
  })
)

const applyMiddlewares = (
  effect: Effect.Effect<HttpServerResponse.HttpServerResponse>
): Effect.Effect<HttpServerResponse.HttpServerResponse> => timingMiddleware(requestIdMiddleware(authMiddleware(effect)))

export const app = HttpRouter.add(
  "GET",
  "/api/data",
  applyMiddlewares(
    Effect.gen(function*() {
      const requestId = yield* RequestId
      return yield* HttpServerResponse.json({
        message: "Authenticated response",
        requestId,
        data: { value: 42, items: ["a", "b", "c"] }
      })
    })
  )
).pipe(HttpRouter.serve)
