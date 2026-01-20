#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TSX_LOADER="$SCRIPT_DIR/node_modules/tsx/dist/esm/index.cjs"
RUNNER="$SCRIPT_DIR/harness/run.ts"

if [[ ! -f "$TSX_LOADER" || ! -x "$SCRIPT_DIR/node_modules/.bin/autocannon" ]]; then
  echo "Installing benchmark harness dependencies..."
  (cd "$SCRIPT_DIR" && pnpm install)
fi

node --import "$TSX_LOADER" "$RUNNER" "$@"
