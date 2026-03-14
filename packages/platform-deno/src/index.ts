/**
 * @since 1.0.0
 */

// @barrel: Auto-generated exports. Do not edit manually.

/**
 * @since 1.0.0
 */
export * as DenoChildProcessSpawner from "./DenoChildProcessSpawner.ts"

/**
 * @since 1.0.0
 */
export * as DenoFileSystem from "./DenoFileSystem.ts"

/**
 * @since 1.0.0
 */
export * as DenoHttpClient from "./DenoHttpClient.ts"

/**
 * @since 1.0.0
 */
export * as DenoHttpServer from "./DenoHttpServer.ts"

/**
 * This module exposes database primitives.
 * @module
 *
 * @since 1.0.0
 */
export * as DenoKeyValueStore from "./DenoKeyValueStore.ts"

/**
 * This module exposes path operations from the Deno Standard Library.
 * @module
 *
 * @example
 * ```ts
 * import { Path } from "effect";
 * import { DenoPath, DenoRuntime } from "@effect/platform-deno";
 * import { assertEquals } from "@std/assert";
 * import { Effect } from "effect";
 *
 * const program = Effect.gen(function* () {
 *   // Access the Path service
 *   const path = yield* Path.Path;
 *
 *   // Join parts of a path to create a complete file path
 *   const extension = path.extname("file.txt");
 *
 *   assertEquals(extension, ".txt");
 * });
 *
 * DenoRuntime.runMain(program.pipe(Effect.provide(DenoPath.layer)));
 * ```
 *
 * @since 1.0.0
 */
export * as DenoPath from "./DenoPath.ts"

/**
 * This module exposes an {@link https://effect.website/docs/runtime/ | Effect Runtime} powered by Deno.
 * @module
 *
 * @example
 * ```ts
 * import { DenoRuntime } from "@effect/platform-deno";
 * import { Console } from "effect";
 *
 * DenoRuntime.runMain(Console.log("Hello, World"));
 * ```
 *
 * @since 1.0.0
 */
export * as DenoRuntime from "./DenoRuntime.ts"

/**
 * @since 1.0.0
 */
export * as DenoServices from "./DenoServices.ts"

/**
 * @since 1.0.0
 */
export * as DenoStdio from "./DenoStdio.ts"

/**
 * @since 1.0.0
 */
export * as DenoTerminal from "./DenoTerminal.ts"

/**
 * @since 1.0.0
 */
export * as DenoWorker from "./DenoWorker.ts"

/**
 * This modules exposes primitives for multithread-communication using the standard {@linkcode MessagePort} API.
 * @module
 *
 * @since 1.0.0
 */
export * as DenoWorkerRunner from "./DenoWorkerRunner.ts"
