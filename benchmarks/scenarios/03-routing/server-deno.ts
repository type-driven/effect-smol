import * as DenoHttpServer from "@effect/platform-deno/DenoHttpServer"
import * as DenoRuntime from "@effect/platform-deno/DenoRuntime"
import * as Layer from "effect/Layer"
import { app } from "./app.ts"

app.pipe(
  Layer.provide(DenoHttpServer.layerServer(3003)),
  Layer.launch,
  DenoRuntime.runMain
)
