/**
 * @since 1.0.0
 */
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { systemError } from "effect/PlatformError"
import * as Sink from "effect/Sink"
import * as Stdio from "effect/Stdio"
import * as Stream from "effect/Stream"

const encoder = new TextEncoder()

const toBytes = (chunk: string | Uint8Array): Uint8Array => typeof chunk === "string" ? encoder.encode(chunk) : chunk

const makeWriteSink = (
  name: "stdout" | "stderr"
) =>
  Sink.forEach((chunk: string | Uint8Array) =>
    Effect.tryPromise({
      try: () => (name === "stdout" ? Deno.stdout : Deno.stderr).write(toBytes(chunk)).then(() => undefined),
      catch: (cause) =>
        systemError({
          module: "Stdio",
          method: name,
          _tag: "Unknown",
          cause
        })
    })
  )

/**
 * @since 1.0.0
 * @category layer
 */
export const layer: Layer.Layer<Stdio.Stdio> = Layer.succeed(Stdio.Stdio)(
  Stdio.make({
    args: Effect.sync(() => Deno.args),
    stdout: () => makeWriteSink("stdout"),
    stderr: () => makeWriteSink("stderr"),
    stdin: Stream.fromReadableStream({
      evaluate: () => Deno.stdin.readable,
      onError: (cause) =>
        systemError({
          module: "Stdio",
          method: "stdin",
          _tag: "Unknown",
          cause
        })
    })
  })
)
