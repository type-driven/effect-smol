/**
 * @since 1.0.0
 */
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type * as PlatformError from "effect/PlatformError"
import { systemError } from "effect/PlatformError"
import type * as Scope from "effect/Scope"
import * as Sink from "effect/Sink"
import * as Stream from "effect/Stream"
import type * as ChildProcess from "effect/unstable/process/ChildProcess"
import type { ChildProcessHandle } from "effect/unstable/process/ChildProcessSpawner"
import {
  ChildProcessSpawner,
  ExitCode,
  make as makeSpawner,
  makeHandle,
  ProcessId
} from "effect/unstable/process/ChildProcessSpawner"

const toError = (
  method: string,
  cause: unknown
): PlatformError.PlatformError =>
  systemError({
    module: "ChildProcess",
    method,
    _tag: "Unknown",
    cause
  })

const streamFromReadable = (
  readable: ReadableStream<Uint8Array>,
  method: string
): Stream.Stream<Uint8Array, PlatformError.PlatformError> =>
  Stream.fromReadableStream({
    evaluate: () => readable,
    onError: (cause) => toError(method, cause)
  })

const sinkToWritable = (
  writable: WritableStream<Uint8Array>,
  method: string
): Sink.Sink<void, Uint8Array, never, PlatformError.PlatformError> => {
  const writer = writable.getWriter()
  return Sink.forEach((chunk: Uint8Array) =>
    Effect.tryPromise({
      try: () => writer.write(chunk),
      catch: (cause) => toError(method, cause)
    })
  )
}

type DenoStdio = "piped" | "inherit" | "null"

const toDenoStdio = (
  value: ChildProcess.CommandInput | ChildProcess.CommandOutput | undefined
): DenoStdio => {
  if (value === "inherit") {
    return "inherit"
  }
  if (value === "ignore") {
    return "null"
  }
  return "piped"
}

const resolveStdin = (options: ChildProcess.CommandOptions): ChildProcess.StdinConfig => {
  const defaultConfig: ChildProcess.StdinConfig = { stream: "pipe", endOnDone: true, encoding: "utf-8" }
  if (options.stdin === undefined) {
    return defaultConfig
  }
  if (typeof options.stdin === "string" || Stream.isStream(options.stdin)) {
    return { ...defaultConfig, stream: options.stdin }
  }
  return {
    stream: options.stdin.stream,
    endOnDone: options.stdin.endOnDone ?? defaultConfig.endOnDone,
    encoding: options.stdin.encoding ?? defaultConfig.encoding
  }
}

const resolveStdout = (
  options: ChildProcess.CommandOptions
): ChildProcess.StdoutConfig => {
  if (options.stdout === undefined) {
    return { stream: "pipe" }
  }
  if (typeof options.stdout === "string" || Sink.isSink(options.stdout)) {
    return { stream: options.stdout }
  }
  return { stream: options.stdout.stream }
}

const resolveStderr = (
  options: ChildProcess.CommandOptions
): ChildProcess.StderrConfig => {
  if (options.stderr === undefined) {
    return { stream: "pipe" }
  }
  if (typeof options.stderr === "string" || Sink.isSink(options.stderr)) {
    return { stream: options.stderr }
  }
  return { stream: options.stderr.stream }
}

const resolveEnv = (
  options: ChildProcess.CommandOptions
): Record<string, string> | undefined => {
  if (options.env === undefined) {
    return options.extendEnv ? Deno.env.toObject() : undefined
  }
  const cleaned = Object.fromEntries(
    Object.entries(options.env).filter((entry): entry is [string, string] => entry[1] !== undefined)
  )
  return options.extendEnv ? { ...Deno.env.toObject(), ...cleaned } : cleaned
}

const quoteShellArg = (arg: string) => `'${arg.replaceAll("'", `'\\''`)}'`

const shellCommand = (
  command: ChildProcess.StandardCommand
): readonly [string, ReadonlyArray<string>] => {
  if (!command.options.shell) {
    return [command.command, command.args]
  }
  const shell = typeof command.options.shell === "string"
    ? command.options.shell
    : Deno.build.os === "windows"
    ? "cmd.exe"
    : "/bin/sh"
  const commandLine = [command.command, ...command.args].map(quoteShellArg).join(" ")
  return Deno.build.os === "windows" && shell.endsWith("cmd.exe")
    ? [shell, ["/d", "/s", "/c", commandLine]]
    : [shell, ["-c", commandLine]]
}

const spawnStandard = (
  command: ChildProcess.StandardCommand
): Effect.Effect<ChildProcessHandle, PlatformError.PlatformError, Scope.Scope> =>
  Effect.gen(function*() {
    const stdinConfig = resolveStdin(command.options)
    const stdoutConfig = resolveStdout(command.options)
    const stderrConfig = resolveStderr(command.options)
    const [commandName, args] = shellCommand(command)
    const options: Deno.CommandOptions = {
      args: [...args],
      stdin: toDenoStdio(stdinConfig.stream),
      stdout: toDenoStdio(stdoutConfig.stream),
      stderr: toDenoStdio(stderrConfig.stream)
    }
    if (command.options.cwd !== undefined) {
      options.cwd = command.options.cwd
    }
    const env = resolveEnv(command.options)
    if (env !== undefined) {
      options.env = env
    }
    const process = yield* Effect.acquireRelease(
      Effect.try({
        try: () => new Deno.Command(commandName, options).spawn(),
        catch: (cause) => toError("spawn", cause)
      }),
      (child) =>
        Effect.sync(() => {
          try {
            child.kill((command.options.killSignal ?? "SIGTERM") as Deno.Signal)
          } catch {
          }
        })
    )

    const exitDeferred = yield* Deferred.make<ExitCode, PlatformError.PlatformError>()

    yield* Effect.tryPromise({
      try: async () => {
        const status = await process.status
        return ExitCode(status.code ?? (status.success ? 0 : 1))
      },
      catch: (cause) => toError("exitCode", cause)
    }).pipe(
      Effect.flatMap((code) => Deferred.succeed(exitDeferred, code)),
      Effect.catch((error) => Deferred.fail(exitDeferred, error)),
      Effect.forkScoped
    )

    let stdin: Sink.Sink<void, Uint8Array, never, PlatformError.PlatformError> = Sink.drain
    if (process.stdin) {
      stdin = sinkToWritable(process.stdin, "stdin")
      if (Stream.isStream(stdinConfig.stream)) {
        yield* Stream.run(stdinConfig.stream, stdin).pipe(Effect.forkScoped)
      }
    }

    let stdout: Stream.Stream<Uint8Array, PlatformError.PlatformError> = process.stdout
      ? streamFromReadable(process.stdout, "stdout")
      : Stream.empty
    if (stdoutConfig.stream && Sink.isSink(stdoutConfig.stream)) {
      stdout = Stream.transduce(stdout, stdoutConfig.stream)
    }

    let stderr: Stream.Stream<Uint8Array, PlatformError.PlatformError> = process.stderr
      ? streamFromReadable(process.stderr, "stderr")
      : Stream.empty
    if (stderrConfig.stream && Sink.isSink(stderrConfig.stream)) {
      stderr = Stream.transduce(stderr, stderrConfig.stream)
    }

    return makeHandle({
      pid: ProcessId(process.pid),
      exitCode: Deferred.await(exitDeferred),
      isRunning: Deferred.isDone(exitDeferred).pipe(Effect.map((done) => !done)),
      kill: (options) =>
        Effect.try({
          try: () => process.kill((options?.killSignal ?? command.options.killSignal ?? "SIGTERM") as Deno.Signal),
          catch: (cause) => toError("kill", cause)
        }),
      stdin,
      stdout,
      stderr,
      all: Stream.merge(stdout, stderr),
      getInputFd: () => Sink.drain,
      getOutputFd: () => Stream.empty
    })
  })

const spawnPiped = (
  command: ChildProcess.PipedCommand
): Effect.Effect<ChildProcessHandle, PlatformError.PlatformError, Scope.Scope> =>
  Effect.gen(function*() {
    const left = yield* spawnCommand(command.left)
    const right = yield* spawnCommand(command.right)

    const source = command.options.from === "stderr"
      ? left.stderr
      : command.options.from === "all"
      ? left.all
      : typeof command.options.from === "string" && command.options.from.startsWith("fd")
      ? left.getOutputFd(Number(command.options.from.slice(2)))
      : left.stdout

    const target = typeof command.options.to === "string" && command.options.to.startsWith("fd")
      ? right.getInputFd(Number(command.options.to.slice(2)))
      : right.stdin

    yield* Stream.run(source, target).pipe(Effect.forkScoped)

    return makeHandle({
      pid: right.pid,
      exitCode: right.exitCode,
      isRunning: right.isRunning,
      kill: right.kill,
      stdin: left.stdin,
      stdout: right.stdout,
      stderr: Stream.merge(left.stderr, right.stderr),
      all: Stream.merge(left.all, right.all),
      getInputFd: left.getInputFd,
      getOutputFd: right.getOutputFd
    })
  })

const spawnCommand = (
  command: ChildProcess.Command
): Effect.Effect<ChildProcessHandle, PlatformError.PlatformError, Scope.Scope> => {
  switch (command._tag) {
    case "StandardCommand":
      return spawnStandard(command)
    case "PipedCommand":
      return spawnPiped(command)
  }
}

/**
 * @since 1.0.0
 * @category layer
 */
export const layer: Layer.Layer<ChildProcessSpawner> = Layer.succeed(ChildProcessSpawner)(
  makeSpawner(spawnCommand)
)
