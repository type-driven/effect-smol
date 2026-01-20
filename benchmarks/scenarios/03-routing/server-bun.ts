import * as BunHttpServer from "@effect/platform-bun/BunHttpServer"
import * as BunRuntime from "@effect/platform-bun/BunRuntime"
import * as Layer from "effect/Layer"
import { app } from "./app.ts"

app.pipe(
  Layer.provide(BunHttpServer.layer({ port: 3002 })),
  Layer.launch,
  BunRuntime.runMain
)
