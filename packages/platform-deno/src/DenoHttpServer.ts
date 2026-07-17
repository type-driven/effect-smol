/**
 * @since 1.0.0
 */
import * as Effect from "effect/Effect"
import * as Fiber from "effect/Fiber"
import { flow } from "effect/Function"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Scheduler from "effect/Scheduler"
import * as Scope from "effect/Scope"
import * as Context from "effect/Context"
import * as Cookies from "effect/unstable/http/Cookies"
import * as HttpEffect from "effect/unstable/http/HttpEffect"
import type * as Middleware from "effect/unstable/http/HttpMiddleware"
import * as HttpServer from "effect/unstable/http/HttpServer"
import { ClientAbort, ServeError } from "effect/unstable/http/HttpServerError"
import * as Request from "effect/unstable/http/HttpServerRequest"
import { HttpServerRequest } from "effect/unstable/http/HttpServerRequest"
import type { HttpServerResponse } from "effect/unstable/http/HttpServerResponse"
import * as Response from "effect/unstable/http/HttpServerResponse"

const resolveSymbol = Symbol.for("effect/platform-deno/HttpServer/resolve")

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = Effect.fnUntraced(function*(port: number) {
  const scope = yield* Effect.scope

  type DenoHandler = (
    req: globalThis.Request,
    info: Deno.ServeHandlerInfo
  ) => globalThis.Response | Promise<globalThis.Response>
  let currentHandler: DenoHandler | undefined

  let resolveReady: () => void
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve
  })

  const server: Deno.HttpServer<Deno.NetAddr> = yield* Effect.try({
    try: () =>
      Deno.serve(
        {
          port,
          onListen: () => resolveReady()
        },
        (req, info) => {
          if (currentHandler === undefined) {
            return new globalThis.Response("Service Unavailable", { status: 503 })
          }
          return currentHandler(req, info)
        }
      ),
    catch: (cause) => new ServeError({ cause })
  })

  yield* Scope.addFinalizer(scope, Effect.promise(() => server.shutdown()))
  yield* Effect.promise(() => ready)

  return HttpServer.make({
    address: {
      _tag: "TcpAddress",
      hostname: server.addr.hostname === "::" ? "0.0.0.0" : server.addr.hostname,
      port: server.addr.port
    },
    serve: Effect.fnUntraced(function*(httpApp, middleware) {
      const handlerScope = yield* Effect.scope
      const handler = yield* makeHandler(httpApp, { middleware: middleware as any, scope: handlerScope })
      currentHandler = handler
      yield* Effect.addFinalizer(() =>
        Effect.sync(() => {
          if (currentHandler === handler) {
            currentHandler = undefined
          }
        })
      )
    })
  })
})

/**
 * @since 1.0.0
 * @category Handlers
 */
export const makeHandler = <
  R,
  E,
  App extends Effect.Effect<HttpServerResponse, any, any> = Effect.Effect<HttpServerResponse, E, R>
>(
  httpEffect: Effect.Effect<HttpServerResponse, E, R>,
  options: {
    readonly scope: Scope.Scope
    readonly middleware?: Middleware.HttpMiddleware.Applied<App, E, R> | undefined
  }
): Effect.Effect<
  (request: globalThis.Request, info: Deno.ServeHandlerInfo) => globalThis.Response | Promise<globalThis.Response>,
  never,
  Exclude<Effect.Services<App>, HttpServerRequest | Scope.Scope>
> => {
  const handled = HttpEffect.toHandled(httpEffect, (request, response) => {
    const resolve: ((r: globalThis.Response) => void) | undefined = (request as any)[resolveSymbol]
    if (resolve !== undefined) {
      if (request.method === "HEAD") {
        resolve(Response.toWeb(response, { withoutBody: true }))
        return Effect.void
      }
      switch (response.body._tag) {
        case "Empty": {
          resolve(Cookies.isEmpty(response.cookies) ? toWebSimple(response, null) : Response.toWeb(response))
          return Effect.void
        }
        case "Uint8Array": {
          resolve(
            Cookies.isEmpty(response.cookies) ? toWebSimple(response, response.body.body) : Response.toWeb(response)
          )
          return Effect.void
        }
      }
      return Effect.withFiber((fiber) => {
        const transferred = HttpEffect.scopeTransferToStream(response)
        resolve(Response.toWeb(transferred, {
          context: fiber.context as any
        }))
        return Effect.void
      })
    }
    return Effect.void
  }, options.middleware as any)
  return Effect.withFiber((parent) => {
    const services = parent.context.mapUnsafe.has(Scheduler.Scheduler.key)
      ? parent.context
      : Context.add(parent.context, Scheduler.Scheduler, parent.currentScheduler)
    return Effect.succeed(function handler(
      webRequest: globalThis.Request,
      info: Deno.ServeHandlerInfo
    ): globalThis.Response | Promise<globalThis.Response> {
      let response: globalThis.Response | undefined
      let resolve: ((response: globalThis.Response) => void) | undefined
      const remoteAddr = info.remoteAddr
      const serverRequest = Request.fromWeb(webRequest).modify({
        remoteAddress: Option.fromUndefinedOr(remoteAddr && "hostname" in remoteAddr ? remoteAddr.hostname : undefined)
      })
      ;(serverRequest as any)[resolveSymbol] = (webResponse: globalThis.Response) => {
        if (resolve === undefined) {
          response = webResponse
        } else {
          resolve(webResponse)
        }
      }
      const map = new Map(services.mapUnsafe)
      map.set(HttpServerRequest.key, serverRequest)
      const fiber = Fiber.runIn(Effect.runForkWith(Context.makeUnsafe<any>(map))(handled), options.scope)
      if (response !== undefined && fiber.pollUnsafe() !== undefined) {
        return response
      }
      webRequest.signal.addEventListener("abort", () => {
        fiber.interruptUnsafe(parent.id, ClientAbort.annotation)
      }, { once: true })
      return new Promise((resume) => {
        resolve = resume
        if (response !== undefined) {
          resume(response)
        }
      })
    })
  })
}

const toWebSimple = (
  response: HttpServerResponse,
  body: unknown
): globalThis.Response => {
  const init: globalThis.ResponseInit = { status: response.status }
  const headers = toWebSimpleHeaders(response.headers)
  if (headers !== undefined) {
    init.headers = headers
  }
  if (response.statusText !== undefined) {
    init.statusText = response.statusText
  }
  return new globalThis.Response(body as any, init)
}

const toWebSimpleHeaders = (headers: HttpServerResponse["headers"]) => {
  const contentType = headers["content-type"]
  for (const key in headers) {
    if (key !== "content-length" && key !== "content-type") {
      return headers as any
    }
  }
  return contentType === undefined ? undefined : { "content-type": contentType }
}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerServer: (port: number) => Layer.Layer<HttpServer.HttpServer, ServeError> = flow(
  make,
  Layer.effect(HttpServer.HttpServer)
)

/**
 * @since 1.0.0
 * @category Layers
 */
export const layer: (port: number) => Layer.Layer<HttpServer.HttpServer, ServeError> = layerServer
