import { defineWebWorkers } from "@vitest/web-worker/pure"

defineWebWorkers({
  clone: "none"
})
// oxlint-disable-next-line effect/no-import-from-barrel-package
import { addEqualityTesters } from "@effect/vitest"

addEqualityTesters()
