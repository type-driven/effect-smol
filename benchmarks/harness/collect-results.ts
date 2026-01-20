import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { writeStdout } from "./io.ts"
import { loadResults, writeSummaryFiles } from "./results.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
const resultsDir = join(__dirname, "..", "results")

function main() {
  const results = loadResults(resultsDir)
  if (results.length === 0) {
    writeStdout("No results found in results/")
    return
  }

  writeStdout(`Found ${results.length} result file(s).`)

  const summary = writeSummaryFiles(resultsDir, results)
  writeStdout(`Markdown summary written to: ${summary.markdownPath}`)
  writeStdout(`CSV summary written to: ${summary.csvPath}`)
  writeStdout(`JSON summary written to: ${summary.jsonPath}`)
  writeStdout(`\n${summary.markdown}`)
}

main()
