import * as DenoChildProcessSpawner from "@effect/platform-deno/DenoChildProcessSpawner"
import { assert, describe, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import type * as PlatformError from "effect/PlatformError"
import * as Stream from "effect/Stream"
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process"

const encoder = new TextEncoder()

const decodeByteStream = Effect.fnUntraced(function*(
  stream: Stream.Stream<Uint8Array, PlatformError.PlatformError>
) {
  const chunks = yield* Stream.runCollect(stream)
  const bytes = chunks.reduce((length, chunk) => length + chunk.length, 0)
  const buffer = new Uint8Array(bytes)
  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.length
  }
  return new TextDecoder().decode(buffer)
})

const withStubbedDeno = Effect.fnUntraced(function*<
  A,
  E,
  R
>(
  deno: Partial<typeof globalThis.Deno>,
  effect: Effect.Effect<A, E, R>
) {
  const previousDeno = (globalThis as any).Deno
  ;(globalThis as any).Deno = deno
  yield* Effect.addFinalizer(() =>
    Effect.sync(() => {
      if (previousDeno === undefined) {
        delete (globalThis as any).Deno
      } else {
        ;(globalThis as any).Deno = previousDeno
      }
    })
  )
  return yield* effect
})

describe("DenoChildProcessSpawner", () => {
  it.effect("spawns commands and merges env", () =>
    Effect.scoped(
      Effect.gen(function*() {
        const spawned: Array<{
          readonly command: string
          readonly options: Deno.CommandOptions
        }> = []
        const kills: Array<string> = []
        const deno = makeMockDeno({
          spawned,
          kills,
          onSpawn: () => ({
            pid: 1,
            stdout: readable("hello\n"),
            stderr: readable(""),
            status: Promise.resolve({ success: true, code: 0 })
          })
        })

        const handle = yield* withStubbedDeno(
          deno,
          Effect.gen(function*() {
            return yield* ChildProcess.make("echo", ["hello"], {
              cwd: "/tmp",
              env: { FOO: "bar", OMIT: undefined },
              extendEnv: true
            })
          }).pipe(Effect.provide(DenoChildProcessSpawner.layer))
        )

        const output = yield* decodeByteStream(handle.stdout)
        const exitCode = yield* handle.exitCode

        assert.strictEqual(output, "hello\n")
        assert.strictEqual(exitCode, ChildProcessSpawner.ExitCode(0))
        assert.deepStrictEqual(spawned, [{
          command: "echo",
          options: {
            args: ["hello"],
            cwd: "/tmp",
            env: { BASE: "1", FOO: "bar" },
            stdin: "piped",
            stdout: "piped",
            stderr: "piped"
          }
        }])

        yield* handle.kill()
        assert.deepStrictEqual(kills, ["SIGTERM"])
      })
    ))

  it.effect("pipes stream input into stdin", () =>
    Effect.scoped(
      Effect.gen(function*() {
        const stdinChunks: Array<Uint8Array> = []
        const deno = makeMockDeno({
          onSpawn: () => ({
            pid: 2,
            stdin: writable(stdinChunks),
            stdout: readable(""),
            stderr: readable(""),
            status: Promise.resolve({ success: true, code: 0 })
          })
        })

        const handle = yield* withStubbedDeno(
          deno,
          Effect.gen(function*() {
            return yield* ChildProcess.make("cat", [], {
              stdin: Stream.make(encoder.encode("ping"))
            })
          }).pipe(Effect.provide(DenoChildProcessSpawner.layer))
        )

        assert.strictEqual(yield* handle.exitCode, ChildProcessSpawner.ExitCode(0))
        assert.strictEqual(
          new TextDecoder().decode(concatChunks(stdinChunks)),
          "ping"
        )
      })
    ))
})

const concatChunks = (chunks: ReadonlyArray<Uint8Array>) => {
  const total = chunks.reduce((length, chunk) => length + chunk.length, 0)
  const buffer = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.length
  }
  return buffer
}

const readable = (text: string) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      if (text.length > 0) {
        controller.enqueue(encoder.encode(text))
      }
      controller.close()
    }
  })

const writable = (chunks: Array<Uint8Array>) =>
  new WritableStream<Uint8Array>({
    write(chunk) {
      chunks.push(chunk)
    }
  })

const makeMockDeno = ({
  spawned,
  kills,
  onSpawn
}: {
  readonly spawned?:
    | Array<{
      readonly command: string
      readonly options: Deno.CommandOptions
    }>
    | undefined
  readonly kills?: Array<string> | undefined
  readonly onSpawn: () => {
    readonly pid: number
    readonly stdin?: WritableStream<Uint8Array> | undefined
    readonly stdout?: ReadableStream<Uint8Array> | undefined
    readonly stderr?: ReadableStream<Uint8Array> | undefined
    readonly status: Promise<{ readonly success: boolean; readonly code?: number | undefined }>
  }
}): Partial<typeof globalThis.Deno> => ({
  env: {
    toObject: () => ({ BASE: "1" })
  } as any,
  Command: class {
    constructor(
      readonly command: string,
      readonly options: Deno.CommandOptions = {}
    ) {}

    spawn() {
      spawned?.push({ command: this.command, options: this.options })
      const process = onSpawn()
      return {
        ...process,
        kill: (signal: string) => {
          kills?.push(signal)
        }
      }
    }
  } as any
})
