import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

const IdParams = Schema.Struct({ id: Schema.FiniteFromString })
const PostCommentParams = Schema.Struct({
  postId: Schema.FiniteFromString,
  commentId: Schema.FiniteFromString
})

export const app = HttpRouter.addAll([
  HttpRouter.route(
    "GET",
    "/users/:id",
    Effect.flatMap(
      HttpRouter.schemaParams(IdParams),
      ({ id }) => HttpServerResponse.json({ type: "user", id, name: `User ${id}` })
    )
  ),
  HttpRouter.route(
    "GET",
    "/users/:id/profile",
    Effect.flatMap(
      HttpRouter.schemaParams(IdParams),
      ({ id }) => HttpServerResponse.json({ type: "profile", userId: id, bio: `Bio for user ${id}` })
    )
  ),
  HttpRouter.route(
    "GET",
    "/posts/:id",
    Effect.flatMap(
      HttpRouter.schemaParams(IdParams),
      ({ id }) => HttpServerResponse.json({ type: "post", id, title: `Post ${id}` })
    )
  ),
  HttpRouter.route(
    "GET",
    "/posts/:postId/comments/:commentId",
    Effect.flatMap(HttpRouter.schemaParams(PostCommentParams), ({ postId, commentId }) =>
      HttpServerResponse.json({
        type: "comment",
        postId,
        commentId,
        body: `Comment ${commentId} on post ${postId}`
      }))
  ),
  HttpRouter.route(
    "GET",
    "/health",
    HttpServerResponse.json({ status: "ok" })
  )
]).pipe(HttpRouter.serve)
