import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Layer from "effect/Layer"
import * as http from "node:http"
import { app } from "./app.ts"

app.pipe(
  Layer.provide(NodeHttpServer.layerServer(() => http.createServer(), { port: 3001 })),
  Layer.launch,
  NodeRuntime.runMain
)
