import * as DenoFileSystem from "@effect/platform-deno/DenoFileSystem"
import { assert, describe, expect, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import * as Option from "effect/Option"
import * as Fs from "node:fs/promises"
import * as Os from "node:os"
import * as Path from "node:path"

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

describe("DenoFileSystem", () => {
  it.effect("maintains a read cursor in append mode", () =>
    Effect.scoped(
      Effect.gen(function*() {
        const root = yield* Effect.promise(() => Fs.mkdtemp(Path.join(Os.tmpdir(), "effect-deno-fs-")))
        yield* Effect.addFinalizer(() => Effect.promise(() => Fs.rm(root, { recursive: true, force: true })))
        const deno = createMockDeno(root)

        yield* withStubbedDeno(
          deno,
          Effect.gen(function*() {
            const fs = yield* FileSystem.FileSystem
            const filePath = yield* fs.makeTempFileScoped({ prefix: "append-" })
            const file = yield* fs.open(filePath, { flag: "a+" })

            yield* file.write(new TextEncoder().encode("foo"))
            yield* file.seek(FileSystem.Size(0), "start")

            yield* file.write(new TextEncoder().encode("bar"))
            assert.strictEqual(yield* fs.readFileString(filePath), "foobar")

            const firstRead = yield* file.readAlloc(FileSystem.Size(3)).pipe(
              Effect.map(Option.getOrThrow),
              Effect.map((_) => new TextDecoder().decode(_))
            )
            assert.strictEqual(firstRead, "foo")

            yield* file.write(new TextEncoder().encode("baz"))
            assert.strictEqual(yield* fs.readFileString(filePath), "foobarbaz")

            const secondRead = yield* file.readAlloc(FileSystem.Size(6)).pipe(
              Effect.map(Option.getOrThrow),
              Effect.map((_) => new TextDecoder().decode(_))
            )
            assert.strictEqual(secondRead, "barbaz")
          }).pipe(Effect.provide(DenoFileSystem.layer))
        )
      })
    ))
})

const createMockDeno = (root: string): Partial<typeof globalThis.Deno> => {
  class NotFound extends Error {}
  class AlreadyExists extends Error {}

  class MockFsFile {
    private position = 0

    constructor(
      readonly handle: Fs.FileHandle,
      readonly append: boolean
    ) {}

    async stat() {
      return toFileInfo(await this.handle.stat())
    }

    async seek(offset: number, mode: Deno.SeekMode) {
      this.position = mode === 0 ? offset : this.position + offset
      return this.position
    }

    async sync() {
      await this.handle.sync()
    }

    async read(buffer: Uint8Array) {
      const { bytesRead } = await this.handle.read(buffer, 0, buffer.length, this.position)
      this.position += bytesRead
      return bytesRead === 0 ? null : bytesRead
    }

    async write(buffer: Uint8Array) {
      const { bytesWritten } = await this.handle.write(
        buffer,
        0,
        buffer.length,
        this.append ? null : this.position
      )
      if (!this.append) {
        this.position += bytesWritten
      }
      return bytesWritten
    }

    async truncate(length?: number) {
      await this.handle.truncate(length)
    }

    close() {
      return this.handle.close()
    }
  }

  const fromNodeError = (error: unknown) => {
    const code = (error as NodeJS.ErrnoException).code
    if (code === "ENOENT") {
      return new NotFound(String(error))
    }
    if (code === "EEXIST") {
      return new AlreadyExists(String(error))
    }
    return error
  }

  const withErrorMap = async <A>(f: () => Promise<A>) => {
    try {
      return await f()
    } catch (error) {
      throw fromNodeError(error)
    }
  }

  const toPath = (path: string | URL) => path instanceof URL ? path.pathname : path

  return {
    SeekMode: {
      Start: 0
    } as any,
    errors: {
      NotFound,
      AlreadyExists,
      PermissionDenied: class PermissionDenied extends Error {},
      Busy: class Busy extends Error {},
      BadResource: class BadResource extends Error {},
      TimedOut: class TimedOut extends Error {},
      WouldBlock: class WouldBlock extends Error {},
      WriteZero: class WriteZero extends Error {},
      UnexpectedEof: class UnexpectedEof extends Error {}
    } as any,
    open: (filePath: string | URL, options: Deno.OpenOptions = {}) =>
      withErrorMap(async () =>
        new MockFsFile(
          await Fs.open(toPath(filePath), toNodeFlag(options), options.mode),
          options.append === true
        ) as any
      ),
    stat: (filePath: string | URL) => withErrorMap(async () => toFileInfo(await Fs.stat(toPath(filePath))) as any),
    readFile: (filePath: string | URL) => withErrorMap(async () => new Uint8Array(await Fs.readFile(toPath(filePath)))),
    makeTempDir: ({ dir, prefix }: { readonly dir?: string | undefined; readonly prefix?: string | undefined } = {}) =>
      withErrorMap(() => Fs.mkdtemp(Path.join(dir ?? root, prefix ?? ""))),
    makeTempFile: async (
      { dir, prefix = "", suffix = "" }: {
        readonly dir?: string | undefined
        readonly prefix?: string | undefined
        readonly suffix?: string | undefined
      } = {}
    ) =>
      withErrorMap(async () => {
        const tempDir = dir ?? root
        const filePath = Path.join(tempDir, `${prefix}${Math.random().toString(16).slice(2)}${suffix}`)
        await Fs.writeFile(filePath, new Uint8Array(0))
        return filePath
      }),
    remove: (filePath: string | URL, options?: { readonly recursive?: boolean | undefined }) =>
      withErrorMap(() => Fs.rm(toPath(filePath), { recursive: options?.recursive ?? false, force: false })),
    truncate: (filePath: string | URL, length?: number) =>
      withErrorMap(() => Fs.truncate(toPath(filePath), length ?? 0)),
    mkdir: (
      dirPath: string | URL,
      options?: { readonly recursive?: boolean | undefined; readonly mode?: number | undefined }
    ) =>
      withErrorMap(async () => {
        await Fs.mkdir(toPath(dirPath), { recursive: options?.recursive ?? false, mode: options?.mode })
      }),
    readDir: async function*(dirPath: string | URL) {
      const entries = await withErrorMap(() => Fs.readdir(toPath(dirPath), { withFileTypes: true }))
      for (const entry of entries) {
        yield {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          isFile: entry.isFile(),
          isSymlink: entry.isSymbolicLink()
        }
      }
    }
  }
}

const toFileInfo = (stats: Awaited<ReturnType<typeof Fs.stat>>) => ({
  isFile: stats.isFile(),
  isDirectory: stats.isDirectory(),
  isSymlink: stats.isSymbolicLink(),
  size: stats.size,
  mtime: stats.mtime,
  atime: stats.atime,
  birthtime: stats.birthtime,
  dev: stats.dev,
  ino: stats.ino,
  mode: stats.mode,
  nlink: stats.nlink,
  uid: stats.uid,
  gid: stats.gid,
  rdev: stats.rdev,
  blksize: stats.blksize,
  blocks: stats.blocks
})

const toNodeFlag = (options: Deno.OpenOptions): string => {
  if (options.read && options.write && options.createNew && options.truncate) {
    return "wx+"
  }
  if (options.read && options.write && options.create && options.truncate) {
    return "w+"
  }
  if (options.read && options.write && options.createNew && options.append) {
    return "ax+"
  }
  if (options.read && options.write && options.create && options.append) {
    return "a+"
  }
  if (options.write && options.createNew && options.truncate) {
    return "wx"
  }
  if (options.write && options.create && options.truncate) {
    return "w"
  }
  if (options.write && options.createNew && options.append) {
    return "ax"
  }
  if (options.write && options.create && options.append) {
    return "a"
  }
  if (options.read && options.write) {
    return "r+"
  }
  return "r"
}
