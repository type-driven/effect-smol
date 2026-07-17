/**
 * @since 1.0.0
 */
import { copy as stdCopy } from "@std/fs/copy"
import { expandGlob } from "@std/fs/expand-glob"
import * as path from "@std/path"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import { type PlatformError, systemError } from "effect/PlatformError"
import type * as Scope from "effect/Scope"
import * as Stream from "effect/Stream"

const toPlatformError = (method: string, cause: unknown): PlatformError => {
  if (cause instanceof Deno.errors.NotFound) {
    return systemError({ module: "FileSystem", method, _tag: "NotFound", cause })
  }
  if (cause instanceof Deno.errors.PermissionDenied) {
    return systemError({ module: "FileSystem", method, _tag: "PermissionDenied", cause })
  }
  if (cause instanceof Deno.errors.AlreadyExists) {
    return systemError({ module: "FileSystem", method, _tag: "AlreadyExists", cause })
  }
  if (cause instanceof Deno.errors.Busy) {
    return systemError({ module: "FileSystem", method, _tag: "Busy", cause })
  }
  if (cause instanceof Deno.errors.BadResource) {
    return systemError({ module: "FileSystem", method, _tag: "BadResource", cause })
  }
  if (cause instanceof Deno.errors.TimedOut) {
    return systemError({ module: "FileSystem", method, _tag: "TimedOut", cause })
  }
  if (cause instanceof Deno.errors.WouldBlock) {
    return systemError({ module: "FileSystem", method, _tag: "WouldBlock", cause })
  }
  if (cause instanceof Deno.errors.WriteZero) {
    return systemError({ module: "FileSystem", method, _tag: "WriteZero", cause })
  }
  if (cause instanceof Deno.errors.UnexpectedEof) {
    return systemError({ module: "FileSystem", method, _tag: "UnexpectedEof", cause })
  }
  return systemError({ module: "FileSystem", method, _tag: "Unknown", cause })
}

const tryP = <A>(
  method: string,
  f: () => Promise<A>
): Effect.Effect<A, PlatformError> =>
  Effect.tryPromise({
    try: f,
    catch: (cause) => toPlatformError(method, cause)
  })

const toInfo = (info: Deno.FileInfo): FileSystem.File.Info => ({
  type: info.isFile ? "File" : info.isDirectory ? "Directory" : info.isSymlink ? "SymbolicLink" : "Unknown",
  mtime: Option.fromNullishOr(info.mtime),
  atime: Option.fromNullishOr(info.atime),
  birthtime: Option.fromNullishOr(info.birthtime),
  dev: info.dev,
  ino: Option.fromNullishOr(info.ino),
  mode: info.mode ?? 0,
  nlink: Option.fromNullishOr(info.nlink),
  uid: Option.fromNullishOr(info.uid),
  gid: Option.fromNullishOr(info.gid),
  rdev: Option.fromNullishOr(info.rdev),
  size: FileSystem.Size(info.size),
  blksize: info.blksize != null ? Option.some(FileSystem.Size(info.blksize)) : Option.none(),
  blocks: Option.fromNullishOr(info.blocks)
})

const openOptions = (flag: FileSystem.OpenFlag = "r"): Deno.OpenOptions => {
  switch (flag) {
    case "r":
      return { read: true }
    case "r+":
      return { read: true, write: true }
    case "w":
      return { write: true, create: true, truncate: true }
    case "wx":
      return { write: true, createNew: true, truncate: true }
    case "w+":
      return { read: true, write: true, create: true, truncate: true }
    case "wx+":
      return { read: true, write: true, createNew: true, truncate: true }
    case "a":
      return { write: true, create: true, append: true }
    case "ax":
      return { write: true, createNew: true, append: true }
    case "a+":
      return { read: true, write: true, create: true, append: true }
    case "ax+":
      return { read: true, write: true, createNew: true, append: true }
  }
}

const makeFile = (
  handle: Deno.FsFile,
  flag: FileSystem.OpenFlag = "r"
): FileSystem.File => {
  const append = flag.startsWith("a")
  let position = BigInt(0)

  const readAtPosition = (buffer: Uint8Array, method: string) => {
    const currentPosition = position
    return tryP(
      method,
      () =>
        handle.seek(Number(currentPosition), Deno.SeekMode.Start).then(() =>
          handle.read(buffer) as Promise<number | null>
        )
    ).pipe(
      Effect.map((bytesRead) => {
        const size = FileSystem.Size(bytesRead ?? 0)
        position = currentPosition + size
        return size
      })
    )
  }

  const writeChunk = (
    buffer: Uint8Array,
    method: string
  ): Effect.Effect<FileSystem.Size, PlatformError> =>
    Effect.suspend(() => {
      const currentPosition = position
      return tryP(
        method,
        () =>
          append
            ? handle.write(buffer)
            : handle.seek(Number(currentPosition), Deno.SeekMode.Start).then(() => handle.write(buffer))
      ).pipe(
        Effect.map((bytesWritten) => {
          const size = FileSystem.Size(bytesWritten)
          if (!append) {
            position = currentPosition + size
          }
          return size
        })
      )
    })

  const writeAllChunk = (buffer: Uint8Array): Effect.Effect<void, PlatformError> =>
    Effect.flatMap(writeChunk(buffer, "writeAll"), (bytesWritten) => {
      const written = Number(bytesWritten)
      if (written === 0) {
        return Effect.fail(
          systemError({
            module: "FileSystem",
            method: "writeAll",
            _tag: "WriteZero",
            description: "write returned 0 bytes written"
          })
        )
      }
      return written < buffer.length ? writeAllChunk(buffer.subarray(written)) : Effect.void
    })

  return {
    [FileSystem.FileTypeId]: FileSystem.FileTypeId,
    fd: FileSystem.FileDescriptor(0),
    get stat() {
      return tryP("stat", () => handle.stat()).pipe(Effect.map(toInfo))
    },
    seek: ((offset, from) =>
      Effect.sync(() => {
        const nextOffset = FileSystem.Size(offset)
        if (from === "start") {
          position = nextOffset
        } else {
          position = position + nextOffset
        }
        return position
      })) as FileSystem.File["seek"],
    get sync() {
      return tryP("sync", () => handle.sync())
    },
    read: (buffer) => readAtPosition(buffer, "read"),
    readAlloc: (size) =>
      Effect.suspend(() => {
        const chunkSize = Number(FileSystem.Size(size))
        const buffer = new Uint8Array(chunkSize)
        return readAtPosition(buffer, "readAlloc").pipe(
          Effect.map((bytesRead): Option.Option<Uint8Array> => {
            const length = Number(bytesRead)
            if (length === 0) {
              return Option.none()
            }
            return length === chunkSize ? Option.some(buffer) : Option.some(buffer.slice(0, length))
          })
        )
      }),
    truncate: (length) =>
      tryP("truncate", () => handle.truncate(length !== undefined ? Number(FileSystem.Size(length)) : undefined)).pipe(
        Effect.map(() => {
          if (!append) {
            const nextLength = BigInt(length ?? 0)
            if (position > nextLength) {
              position = nextLength
            }
          }
        })
      ),
    write: (buffer) => writeChunk(buffer, "write"),
    writeAll: writeAllChunk
  }
}

const access = (
  filePath: string,
  options?: {
    readonly ok?: boolean | undefined
    readonly readable?: boolean | undefined
    readonly writable?: boolean | undefined
  }
): Effect.Effect<void, PlatformError> =>
  Effect.gen(function*() {
    yield* tryP("access", () => Deno.stat(filePath))
    if (options?.readable) {
      const file = yield* tryP("access", () => Deno.open(filePath, { read: true }))
      file.close()
    }
    if (options?.writable) {
      const file = yield* tryP("access", () => Deno.open(filePath, { write: true }))
      file.close()
    }
  })

const copy = (
  fromPath: string,
  toPath: string,
  options?: {
    readonly overwrite?: boolean | undefined
    readonly preserveTimestamps?: boolean | undefined
  }
): Effect.Effect<void, PlatformError> =>
  tryP("copy", () =>
    stdCopy(fromPath, toPath, {
      overwrite: options?.overwrite ?? false,
      preserveTimestamps: options?.preserveTimestamps ?? false
    }))

const copyFile = (fromPath: string, toPath: string): Effect.Effect<void, PlatformError> =>
  tryP("copyFile", () => Deno.copyFile(fromPath, toPath))

const chmod = (filePath: string, mode: number): Effect.Effect<void, PlatformError> =>
  tryP("chmod", () => Deno.chmod(filePath, mode))

const chown = (
  filePath: string,
  uid: number,
  gid: number
): Effect.Effect<void, PlatformError> => tryP("chown", () => Deno.chown(filePath, uid, gid))

const link = (existingPath: string, newPath: string): Effect.Effect<void, PlatformError> =>
  tryP("link", () => Deno.link(existingPath, newPath))

const makeDirectory = (
  dirPath: string,
  options?: {
    readonly recursive?: boolean | undefined
    readonly mode?: number | undefined
  }
): Effect.Effect<void, PlatformError> => {
  const fields: Deno.MkdirOptions = { recursive: options?.recursive ?? false }
  if (options?.mode !== undefined) {
    fields.mode = options.mode
  }
  return tryP("makeDirectory", () => Deno.mkdir(dirPath, fields))
}

const makeTempDirectory = (options?: {
  readonly directory?: string | undefined
  readonly prefix?: string | undefined
}): Effect.Effect<string, PlatformError> => {
  const fields: Deno.MakeTempOptions = {}
  if (options?.directory !== undefined) {
    fields.dir = options.directory
  }
  if (options?.prefix !== undefined) {
    fields.prefix = options.prefix
  }
  return tryP("makeTempDirectory", () => Deno.makeTempDir(fields))
}

const makeTempDirectoryScoped = (
  options?: {
    readonly directory?: string | undefined
    readonly prefix?: string | undefined
  }
): Effect.Effect<string, PlatformError, Scope.Scope> =>
  Effect.acquireRelease(
    makeTempDirectory(options),
    (dir) => Effect.orDie(remove(dir, { recursive: true, force: true }))
  )

const makeTempFile = (options?: {
  readonly directory?: string | undefined
  readonly prefix?: string | undefined
  readonly suffix?: string | undefined
}): Effect.Effect<string, PlatformError> => {
  const fields: Deno.MakeTempOptions = {}
  if (options?.directory !== undefined) {
    fields.dir = options.directory
  }
  if (options?.prefix !== undefined) {
    fields.prefix = options.prefix
  }
  if (options?.suffix !== undefined) {
    fields.suffix = options.suffix
  }
  return tryP("makeTempFile", () => Deno.makeTempFile(fields))
}

const makeTempFileScoped = (
  options?: {
    readonly directory?: string | undefined
    readonly prefix?: string | undefined
    readonly suffix?: string | undefined
  }
): Effect.Effect<string, PlatformError, Scope.Scope> =>
  Effect.acquireRelease(
    makeTempFile(options),
    (filePath) => Effect.orDie(remove(filePath, { force: true }))
  )

const open = (
  filePath: string,
  options?: {
    readonly flag?: FileSystem.OpenFlag | undefined
    readonly mode?: number | undefined
  }
): Effect.Effect<FileSystem.File, PlatformError, Scope.Scope> => {
  const flag = options?.flag ?? "r"
  return Effect.gen(function*() {
    const fields: Deno.OpenOptions = { ...openOptions(flag) }
    if (options?.mode !== undefined) {
      fields.mode = options.mode
    }
    const handle = yield* Effect.acquireRelease(
      tryP("open", () => Deno.open(filePath, fields)),
      (file) =>
        Effect.sync(() => {
          try {
            file.close()
          } catch {
          }
        })
    )
    return makeFile(handle, flag)
  })
}

const readDirectory = (
  dirPath: string,
  options?: {
    readonly recursive?: boolean | undefined
  }
): Effect.Effect<Array<string>, PlatformError> =>
  Effect.tryPromise({
    try: async () => {
      if (options?.recursive) {
        const entries: Array<string> = []
        const collect = async (currentDir: string) => {
          for await (const entry of Deno.readDir(currentDir)) {
            const fullPath = path.join(currentDir, entry.name)
            entries.push(fullPath)
            if (entry.isDirectory) {
              await collect(fullPath)
            }
          }
        }
        await collect(dirPath)
        return entries
      }

      const entries: Array<string> = []
      for await (const entry of Deno.readDir(dirPath)) {
        entries.push(entry.name)
      }
      return entries
    },
    catch: (cause) => toPlatformError("readDirectory", cause)
  })

const glob = (
  pattern: string,
  options?: {
    readonly root?: string | undefined
    readonly exclude?: ReadonlyArray<string> | undefined
  }
): Effect.Effect<Array<string>, PlatformError> =>
  Effect.tryPromise({
    try: async () => {
      const exclude = options?.exclude ? [...options.exclude] : []
      const iter = options?.root !== undefined
        ? expandGlob(pattern, { root: options.root, exclude })
        : expandGlob(pattern, { exclude })
      const entries: Array<string> = []
      for await (const entry of iter) {
        entries.push(entry.path)
      }
      return entries
    },
    catch: (cause) => toPlatformError("glob", cause)
  })

const readFile = (filePath: string): Effect.Effect<Uint8Array, PlatformError> =>
  tryP("readFile", () => Deno.readFile(filePath))

const readLink = (filePath: string): Effect.Effect<string, PlatformError> =>
  tryP("readLink", () => Deno.readLink(filePath))

const realPath = (filePath: string): Effect.Effect<string, PlatformError> =>
  tryP("realPath", () => Deno.realPath(filePath))

const remove = (
  filePath: string,
  options?: {
    readonly recursive?: boolean | undefined
    readonly force?: boolean | undefined
  }
): Effect.Effect<void, PlatformError> =>
  Effect.tryPromise({
    try: async () => {
      try {
        await Deno.remove(filePath, { recursive: options?.recursive ?? false })
      } catch (cause) {
        if (options?.force && cause instanceof Deno.errors.NotFound) {
          return
        }
        throw cause
      }
    },
    catch: (cause) => toPlatformError("remove", cause)
  })

const rename = (oldPath: string, newPath: string): Effect.Effect<void, PlatformError> =>
  tryP("rename", () => Deno.rename(oldPath, newPath))

const stat = (filePath: string): Effect.Effect<FileSystem.File.Info, PlatformError> =>
  tryP("stat", () => Deno.stat(filePath)).pipe(Effect.map(toInfo))

const symlink = (fromPath: string, toPath: string): Effect.Effect<void, PlatformError> =>
  tryP("symlink", () => Deno.symlink(fromPath, toPath))

const truncate = (
  filePath: string,
  length?: FileSystem.SizeInput
): Effect.Effect<void, PlatformError> =>
  tryP("truncate", () => Deno.truncate(filePath, length !== undefined ? Number(FileSystem.Size(length)) : undefined))

const utimes = (
  filePath: string,
  atime: Date | number,
  mtime: Date | number
): Effect.Effect<void, PlatformError> => tryP("utimes", () => Deno.utime(filePath, atime, mtime))

const watch = (filePath: string): Stream.Stream<FileSystem.WatchEvent, PlatformError> =>
  Stream.unwrap(
    Effect.scoped(
      Effect.map(
        Effect.acquireRelease(
          Effect.sync(() => Deno.watchFs(filePath)),
          (watcher) => Effect.sync(() => watcher.close())
        ),
        (watcher) =>
          Stream.fromAsyncIterable(watcher, (cause) => toPlatformError("watch", cause)).pipe(
            Stream.flatMap((event) => {
              const currentPath = event.paths[0] ?? filePath
              const events: Array<FileSystem.WatchEvent> = []
              switch (event.kind) {
                case "create":
                  events.push({ _tag: "Create", path: currentPath })
                  break
                case "modify":
                case "any":
                  events.push({ _tag: "Update", path: currentPath })
                  break
                case "remove":
                  events.push({ _tag: "Remove", path: currentPath })
                  break
                case "rename":
                  events.push({ _tag: "Remove", path: currentPath })
                  if (event.paths[1]) {
                    events.push({ _tag: "Create", path: event.paths[1] })
                  }
                  break
              }
              return Stream.fromIterable(events)
            })
          )
      )
    )
  ) as Stream.Stream<FileSystem.WatchEvent, PlatformError>

const writeFile = (
  filePath: string,
  data: Uint8Array,
  options?: {
    readonly flag?: FileSystem.OpenFlag | undefined
    readonly mode?: number | undefined
  }
): Effect.Effect<void, PlatformError> =>
  Effect.scoped(
    Effect.flatMap(open(filePath, options), (file) => file.writeAll(data))
  )

/**
 * @since 1.0.0
 * @category layer
 */
export const layer: Layer.Layer<FileSystem.FileSystem> = Layer.succeed(FileSystem.FileSystem)(
  FileSystem.make({
    access,
    copy,
    copyFile,
    chmod,
    chown,
    glob,
    link,
    makeDirectory,
    makeTempDirectory,
    makeTempDirectoryScoped,
    makeTempFile,
    makeTempFileScoped,
    open,
    readDirectory,
    readFile,
    readLink,
    realPath,
    remove,
    rename,
    stat,
    symlink,
    truncate,
    utimes,
    watch,
    writeFile
  })
)
