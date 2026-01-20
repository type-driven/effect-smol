import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

const IdParams = Schema.Struct({ id: Schema.FiniteFromString })

export const app = HttpRouter.addAll([
  HttpRouter.route(
    "GET",
    "/api/items/:id",
    Effect.flatMap(
      HttpRouter.schemaParams(IdParams),
      ({ id }) =>
        HttpServerResponse.json({
          id,
          message: "Item retrieved successfully",
          timestamp: new Date().toISOString()
        })
    )
  )
]).pipe(HttpRouter.serve)
