/**
 * @since 1.0.0
 */
import type { FileSystem } from "effect/FileSystem"
import * as Layer from "effect/Layer"
import type { Path } from "effect/Path"
import type { Stdio } from "effect/Stdio"
import type { Terminal } from "effect/Terminal"
import type { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner"
import * as DenoChildProcessSpawner from "./DenoChildProcessSpawner.ts"
import * as DenoFileSystem from "./DenoFileSystem.ts"
import * as DenoPath from "./DenoPath.ts"
import * as DenoStdio from "./DenoStdio.ts"
import * as DenoTerminal from "./DenoTerminal.ts"

/**
 * @since 1.0.0
 * @category models
 */
export type DenoServices = ChildProcessSpawner | FileSystem | Path | Stdio | Terminal

/**
 * @since 1.0.0
 * @category layer
 */
export const layer: Layer.Layer<DenoServices> = Layer.provideMerge(
  DenoChildProcessSpawner.layer,
  Layer.mergeAll(
    DenoFileSystem.layer,
    DenoPath.layer,
    DenoStdio.layer,
    DenoTerminal.layer
  )
)
