import * as DenoWorkerRunner from "@effect/platform-deno/DenoWorkerRunner"
import { assert, describe, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Fiber from "effect/Fiber"
import * as Queue from "effect/Queue"

const awaitReady = (port: MessagePort) =>
  Effect.callback<void>((resume) => {
    const onMessage = (event: MessageEvent) => {
      const message = event.data as ReadonlyArray<unknown>
      if (Array.isArray(message) && message[0] === 0) {
        port.removeEventListener("message", onMessage as any)
        resume(Effect.void)
      }
    }
    port.addEventListener("message", onMessage as any)
    return Effect.sync(() => {
      port.removeEventListener("message", onMessage as any)
    })
  })

describe("DenoWorkerRunner", () => {
  it.effect("surfaces disconnects for a dedicated message port", () =>
    Effect.gen(function*() {
      const channel = new MessageChannel()
      if ("start" in channel.port2) {
        channel.port2.start()
      }
      yield* Effect.addFinalizer(() =>
        Effect.sync(() => {
          channel.port2.close()
        })
      )

      const runner = yield* DenoWorkerRunner.make(channel.port1).start<never, never>()
      assert(runner.disconnects !== undefined)
      const disconnects = runner.disconnects

      const runFiber = yield* runner.run(() => Effect.void).pipe(Effect.forkScoped)

      yield* awaitReady(channel.port2)
      channel.port2.postMessage([1])

      assert.strictEqual(yield* Queue.take(disconnects), 0)
      yield* Fiber.join(runFiber)
    }).pipe(Effect.scoped))
})
