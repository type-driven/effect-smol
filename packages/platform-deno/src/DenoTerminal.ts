/**
 * @since 1.0.0
 */
import type * as Cause from "effect/Cause"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import { type PlatformError, systemError } from "effect/PlatformError"
import * as Queue from "effect/Queue"
import * as RcRef from "effect/RcRef"
import type * as Scope from "effect/Scope"
import * as Terminal from "effect/Terminal"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const parseAnsiKeypress = (data: Uint8Array): Terminal.UserInput => {
  const input = decoder.decode(data)

  switch (input) {
    case "\r":
    case "\n":
      return makeInput("return", input)
    case "\u007f":
    case "\b":
      return makeInput("backspace", input)
    case "\u0003":
      return makeInput("c", input, { ctrl: true })
    case "\u0004":
      return makeInput("d", input, { ctrl: true })
    case "\u001b":
      return makeInput("escape")
  }

  if (input.startsWith("\u001b[") || input.startsWith("\u001bO")) {
    const sequence = input.slice(2)
    const name = ansiKeys[sequence] ?? sequence
    return makeInput(name)
  }

  if (input.startsWith("\u001b") && input.length === 2) {
    return makeInput(input[1]!, input[1], { meta: true })
  }

  if (input.length === 1 && input.charCodeAt(0) < 32) {
    return makeInput(String.fromCharCode(input.charCodeAt(0) + 64).toLowerCase(), input, { ctrl: true })
  }

  return makeInput(input, input)
}

const ansiKeys: Record<string, string> = {
  A: "up",
  B: "down",
  C: "right",
  D: "left",
  F: "end",
  H: "home",
  P: "f1",
  Q: "f2",
  R: "f3",
  S: "f4",
  "2~": "insert",
  "3~": "delete",
  "5~": "pageup",
  "6~": "pagedown"
}

const makeInput = (
  name: string,
  input?: string,
  options?: {
    readonly ctrl?: boolean | undefined
    readonly meta?: boolean | undefined
    readonly shift?: boolean | undefined
  }
): Terminal.UserInput => ({
  input: Option.fromUndefinedOr(input),
  key: {
    name,
    ctrl: options?.ctrl ?? false,
    meta: options?.meta ?? false,
    shift: options?.shift ?? false
  }
})

function defaultShouldQuit(input: Terminal.UserInput) {
  return input.key.ctrl && (input.key.name === "c" || input.key.name === "d")
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: (
  shouldQuit?: (input: Terminal.UserInput) => boolean
) => Effect.Effect<Terminal.Terminal, never, Scope.Scope> = Effect.fnUntraced(function*(
  shouldQuit: (input: Terminal.UserInput) => boolean = defaultShouldQuit
) {
  const readerRef = yield* RcRef.make({
    acquire: Effect.acquireRelease(
      Effect.sync(() => {
        if (Deno.stdin.isTerminal()) {
          Deno.stdin.setRaw(true)
        }
        return Deno.stdin.readable.getReader()
      }),
      (reader) =>
        Effect.sync(() => {
          reader.releaseLock()
          if (Deno.stdin.isTerminal()) {
            Deno.stdin.setRaw(false)
          }
        })
    )
  })

  const columns = Effect.sync(() => {
    try {
      return Deno.consoleSize().columns
    } catch {
      return 0
    }
  })

  const rows = Effect.sync(() => {
    try {
      return Deno.consoleSize().rows
    } catch {
      return 0
    }
  })

  const readInput: Effect.Effect<
    Queue.Dequeue<Terminal.UserInput, Cause.Done>,
    never,
    Scope.Scope
  > = Effect.gen(function*() {
    yield* RcRef.get(readerRef)
    const queue = yield* Queue.make<Terminal.UserInput, Cause.Done>()

    const read = Effect.gen(function*() {
      const reader = yield* RcRef.get(readerRef)
      while (true) {
        const result = yield* Effect.tryPromise({
          try: () => reader.read(),
          catch: () => null as null
        })
        if (result === null || result.done) {
          yield* Queue.end(queue)
          return
        }
        const input = parseAnsiKeypress(result.value ?? new Uint8Array(0))
        yield* Queue.offer(queue, input)
        if (shouldQuit(input)) {
          yield* Queue.end(queue)
          return
        }
      }
    })

    yield* read.pipe(Effect.forkScoped)
    return Queue.asDequeue(queue)
  })

  const readLine: Effect.Effect<string, Terminal.QuitError> = Effect.callback((resume) => {
    const reader = Deno.stdin.readable.getReader()
    let buffer = ""
    let finished = false

    const finish = (effect: Effect.Effect<string, Terminal.QuitError>) => {
      if (finished) {
        return
      }
      finished = true
      reader.releaseLock()
      resume(effect)
    }

    const loop = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            finish(Effect.fail(new Terminal.QuitError({ _tag: "QuitError" })))
            return
          }
          buffer += decoder.decode(value)
          const index = buffer.indexOf("\n")
          if (index !== -1) {
            finish(Effect.succeed(buffer.slice(0, index).replace(/\r$/, "")))
            return
          }
        }
      } catch {
        finish(Effect.fail(new Terminal.QuitError({ _tag: "QuitError" })))
      }
    }

    void loop()
    return Effect.sync(() => {
      if (!finished) {
        finished = true
        reader.releaseLock()
      }
    })
  })

  const display = (text: string): Effect.Effect<void, PlatformError> =>
    Effect.tryPromise({
      try: () => Deno.stdout.write(encoder.encode(text)).then(() => undefined),
      catch: (cause) =>
        systemError({
          module: "Terminal",
          method: "display",
          _tag: "Unknown",
          cause
        })
    })

  return Terminal.make({
    columns,
    rows,
    readInput,
    readLine,
    display
  })
})

/**
 * @since 1.0.0
 * @category layer
 */
export const layer: Layer.Layer<Terminal.Terminal> = Layer.effect(Terminal.Terminal, make(defaultShouldQuit))
