import { readFile } from "node:fs/promises"
import type { ExistingArticle } from "./types.ts"

export async function readExistingArticles(articlesPath: string, journalPath: string) {
  const [articlesSource, journalSource] = await Promise.all([readFile(articlesPath, "utf8"), readFile(journalPath, "utf8")])
  const articles = readArticleRecords(articlesSource)
  const journal = readArticleRecords(journalSource)
  const bySlug = new Map<string, ExistingArticle>()
  for (const article of [...journal, ...articles]) bySlug.set(article.slug, article)
  return [...bySlug.values()]
}

function readArticleRecords(source: string) {
  const records: ExistingArticle[] = []
  const lines = source.split("\n")
  for (let index = 0; index < lines.length; index += 1) {
    const slug = readField(lines[index] ?? "", "slug")
    if (!slug) continue
    const title = readNearbyField(lines, index, "title")
    const category = readNearbyField(lines, index, "category")
    if (!title || !category) continue
    records.push({ slug, title: unescapeTsString(title), category })
  }
  return records
}

function readNearbyField(lines: string[], start: number, field: string) {
  for (let index = start; index < Math.min(lines.length, start + 6); index += 1) {
    const value = readField(lines[index] ?? "", field)
    if (value) return value
  }
  return ""
}

function readField(line: string, field: string) {
  const match = line.match(new RegExp(`^\\s*(?:"${field}"|${field}):\\s*"((?:\\\\.|[^"\\\\])*)"`))
  return match?.[1] ?? ""
}

function unescapeTsString(value: string) {
  return value.replace(/\\"/g, "\"").replace(/\\\\/g, "\\")
}
