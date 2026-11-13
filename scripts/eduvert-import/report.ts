import { mkdir, writeFile } from "node:fs/promises"
import type { MigrationReport, MigrationRow, MigrationStatus } from "./types.ts"

export function buildReport(input: BuildReportInput): MigrationReport {
  const totals = {
    totalFetched: input.rows.length,
    alreadyExisting: count(input.rows, "alreadyExisting"),
    eligible: input.rows.filter((row) => row.status === "eligible" || row.status === "readyToImport" || row.status === "imported").length,
    excludedStudyAbroad: count(input.rows, "excludedStudyAbroad"),
    duplicates: count(input.rows, "duplicate"),
    needsReview: count(input.rows, "needsReview"),
    imported: count(input.rows, "imported"),
    failed: count(input.rows, "failed"),
    readyToImport: count(input.rows, "readyToImport"),
  }
  return {
    dryRun: input.dryRun,
    apply: input.apply,
    limit: input.limit,
    all: input.all,
    totals,
    note: input.note,
    parserChecks: input.parserChecks,
    rows: input.rows,
  }
}

export async function writeReport(directory: string, report: MigrationReport) {
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}/eduvert-blog-migration.json`, `${JSON.stringify(report, null, 2)}\n`)
  await writeFile(`${directory}/eduvert-blog-migration.csv`, toCsv(report.rows))
}

function toCsv(rows: MigrationRow[]) {
  const header = ["slug", "title", "publishedOn", "status", "category", "wordpressCategories", "sourceUrl", "coverage", "contentSource", "editorialFlags", "reasons"]
  const lines = rows.map((row) => [
    row.slug,
    row.title,
    row.publishedOn,
    row.status,
    row.category,
    row.wordpressCategories,
    row.sourceUrl,
    row.coverage === null ? "" : row.coverage.toFixed(4),
    row.contentSource,
    row.editorialFlags.join(" | "),
    row.reasons.join(" | "),
  ].map(csvCell).join(","))
  return `${[header.join(","), ...lines].join("\n")}\n`
}

function csvCell(value: string) {
  if (!/[",\n]/.test(value)) return value
  return `"${value.replace(/"/g, "\"\"")}"`
}

function count(rows: MigrationRow[], status: MigrationStatus) {
  return rows.filter((row) => row.status === status).length
}

interface BuildReportInput {
  dryRun: boolean
  apply: boolean
  limit: number | null
  all: boolean
  note: string
  parserChecks: MigrationReport["parserChecks"]
  rows: MigrationRow[]
}
