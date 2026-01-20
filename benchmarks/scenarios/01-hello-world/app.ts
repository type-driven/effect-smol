import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

export const app = HttpRouter.add(
  "GET",
  "/",
  HttpServerResponse.text("Hello, World!")
).pipe(HttpRouter.serve)
