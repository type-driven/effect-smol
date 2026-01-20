import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

const CreateUserBody = Schema.Struct({
  name: Schema.NonEmptyString,
  email: Schema.String.check(Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  age: Schema.Number.check(Schema.isBetween({ minimum: 0, maximum: 150 }))
})

const CreateUserResponse = Schema.Struct({
  id: Schema.Number,
  name: Schema.NonEmptyString,
  email: Schema.String,
  age: Schema.Number,
  createdAt: Schema.String
})

const respondUser = HttpServerResponse.schemaJson(CreateUserResponse)

let nextId = 1

export const routes = HttpRouter.add(
  "POST",
  "/users",
  Effect.flatMap(
    HttpServerRequest.schemaBodyJson(CreateUserBody),
    (body) =>
      respondUser({
        id: nextId++,
        name: body.name,
        email: body.email,
        age: body.age,
        createdAt: new Date().toISOString()
      })
  ).pipe(
    Effect.catchTag("SchemaError", () => HttpServerResponse.text("Validation failed", { status: 422 })),
    Effect.catchTag("RequestError", () => HttpServerResponse.text("Bad request", { status: 400 }))
  )
)

export const app = routes.pipe(HttpRouter.serve)
