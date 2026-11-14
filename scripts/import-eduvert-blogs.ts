import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { ArticleImage, ArticleMark, ArticleRecord } from "../components/blog/article-types.ts"
import { classifyPost, decodeSlug, editorialFlags, normalizeTitle, type Classification } from "./eduvert-import/classify.ts"
import { readExistingArticles } from "./eduvert-import/existing.ts"
import { writeGeneratedModules, writeMetadata } from "./eduvert-import/generate.ts"
import { clipText, extractWebpageArticle, normalizeImageUrl, parseArticleHtml, plainText } from "./eduvert-import/html.ts"
import { readImageManifest, storeImages, writeImageManifest } from "./eduvert-import/images.ts"
import { buildReport, writeReport } from "./eduvert-import/report.ts"
import { retryFailed } from "./eduvert-import/retry-failed.ts"
import type { ExistingArticle, MigrationRow, ParsedArticle, RemoteImage, WordpressCategory, WordpressPost } from "./eduvert-import/types.ts"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const postsUrl = "https://www.eduvert.co/wp-json/wp/v2/posts"
const categoriesUrl = "https://www.eduvert.co/wp-json/wp/v2/categories"
const userAgent = "EduVertBlogImport/1.0"
const parserCheckSlugs = [
  "how-is-ai-improving-ad-copywriting-and-campaign-optimization",
  "how-to-track-landing-page-conversions-in-google-ads-forms-calls-whatsapp",
]

async function main() {
  const options = readOptions(process.argv.slice(2))
  if (options.help) {
    console.log(usage)
    return
  }
  if (options.retryFailed) {
    await retryFailed({ root, apply: options.apply, dryRun: options.dryRun, allowMissingFeatured: options.allowMissingFeatured })
    return
  }
  const existing = await readExistingArticles(resolve(root, "components/blog/articles.ts"), resolve(root, "components/blog/journal.ts"))
  const existingSlugs = new Set(existing.map((article) => article.slug))
  const existingTitles = new Set(existing.map((article) => normalizeTitle(article.title)))
  const categories = await fetchCategories()
  const posts = await fetchPosts()
  console.log(`Fetched ${posts.length} published WordPress posts`)

  const prepared = posts.map((post) => preparePost(post, categories))
  const classified = prepared.map((post) => ({
    post,
    classification: classifyPost({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      categoryNames: post.categoryNames,
      categorySlugs: post.categorySlugs,
      existingSlugs,
      existingTitles,
    }),
  }))
  markDuplicateTitles(classified)

  const parserChecks = []
  for (const slug of parserCheckSlugs) {
    const post = prepared.find((item) => item.slug === slug)
    if (!post) continue
    const chosen = await chooseParse(post.post, existingSlugs)
    parserChecks.push({ slug, parsed: chosen.parsed })
    console.log(`Parser check ${slug}: coverage ${chosen.parsed.coverage.toFixed(3)} via ${chosen.parsed.contentSource}`)
  }

  const rows: MigrationRow[] = []
  const valid: PreparedImport[] = []
  for (const item of classified) {
    const { post, classification } = item
    if (classification.kind !== "include") {
      rows.push(rowFrom(post, statusFrom(classification.kind), classification.reasons, null))
      continue
    }
    const chosen = await chooseParse(post.post, existingSlugs)
    const assessment = assessParse(chosen.parsed)
    const flags = editorialFlags(post.title, post.publishedOn, chosen.parsed.parsedText)
    const images = articleImages(post.post, chosen.parsed)
    if (!assessment.ok) {
      rows.push(rowFrom(post, assessment.status, [assessment.reason, ...chosen.parsed.notes], chosen.parsed, flags, classification.category))
      continue
    }
    if (images.length === 0) {
      rows.push(rowFrom(post, "needsReview", ["No featured image or inline illustration"], chosen.parsed, flags, classification.category))
      continue
    }
    valid.push(toImportable(post, classification.category, chosen, flags, existing))
    rows.push(rowFrom(post, "eligible", classification.reasons, chosen.parsed, flags, classification.category))
  }

  const importable = valid.filter((article) => !existingSlugs.has(article.slug)).sort(byDate)
  const selected = options.all ? importable : options.limit === null ? [] : importable.slice(0, options.limit)
  const selectedSlugs = new Set(selected.map((article) => article.slug))
  markSelection(rows, selected, options.apply)

  if (options.apply) {
    const migratedSlugs = new Set([...existingSlugs, ...selectedSlugs])
    const manifest = await readImageManifest(resolve(root, "scripts/reports/image-manifest.json"))
    const records: ArticleRecord[] = []
    const metadata = []
    for (const article of selected) {
      const reparsed = parseArticleHtml(article.sourceHtml, { migratedSlugs }, article.parsed.contentSource)
      const images = articleImages(article.post, reparsed)
      const stored = await storeImages({ root, slug: article.slug, images, manifest })
      const row = rows.find((item) => item.slug === article.slug)
      if (!stored.featured || !row) {
        if (row) {
          row.status = "failed"
          row.reasons = [...row.reasons, ...stored.failures.map((failure) => `${failure.sourceUrl}: ${failure.reason}`), "Featured image could not be downloaded"]
        }
        continue
      }
      if (stored.failures.length > 0 && row) row.reasons = [...row.reasons, ...stored.failures.map((failure) => `Inline image failed: ${failure.reason}`)]
      const mediaAlt = await featuredAlt(article.post)
      const featured: ArticleImage = { src: stored.featured.src, alt: stored.featured.alt || mediaAlt, width: stored.featured.width, height: stored.featured.height }
      records.push({ ...article.record, blocks: reparsed.blocks, featuredImage: featured, hero: featured })
      metadata.push({
        slug: article.slug,
        sourceUrl: article.post.link,
        wordpressId: article.post.id,
        contentSource: reparsed.contentSource,
        coverage: Number(reparsed.coverage.toFixed(4)),
        editorialFlags: article.editorialFlags,
        notes: reparsed.notes,
        featuredImage: { sourceUrl: stored.featured.sourceUrl, localPath: stored.featured.src, alt: featured.alt },
        inlineImages: stored.stored.filter((image) => image.sourceUrl !== stored.featured?.sourceUrl).map((image) => ({ sourceUrl: image.sourceUrl, localPath: image.src, alt: image.alt })),
        imageFailures: stored.failures,
        unmappedLinks: reparsed.unmappedLinks,
      })
    }
    const handwrittenClash = records.find((article) => existingSlugs.has(article.slug))
    if (handwrittenClash) throw new Error(`Refusing to overwrite handwritten article ${handwrittenClash.slug}`)
    await writeGeneratedModules(resolve(root, "components/blog/articles.generated.ts"), resolve(root, "components/blog/journal.generated.ts"), records)
    await writeMetadata(resolve(root, "components/blog/articles.generated.meta.json"), metadata)
    const usedImageUrls = new Set(metadata.flatMap((item) => [item.featuredImage.sourceUrl, ...item.inlineImages.map((image) => image.sourceUrl)]))
    await writeImageManifest(resolve(root, "scripts/reports/image-manifest.json"), manifest.filter((entry) => usedImageUrls.has(entry.sourceUrl)))
  }

  const note = options.apply
    ? "Applied the selected import. Existing handwritten articles were left unchanged."
    : options.limit === null && !options.all
      ? "Dry run only. Pass --limit or --all with --apply to write articles."
      : "Dry run only. No article files or images were written."
  const report = buildReport({ ...options, note, parserChecks: parserChecks.map((check) => ({ slug: check.slug, coverage: check.parsed.coverage, contentSource: check.parsed.contentSource })), rows: rows.sort(byRow) })
  await writeReport(resolve(root, "scripts/reports"), report)
  console.log(JSON.stringify(report.totals, null, 2))
  if (selected.length > 0) console.log(`${options.apply ? "Imported" : "Ready"}: ${selected.map((article) => article.slug).join(", ")}`)
}

function preparePost(post: WordpressPost, categories: Map<number, WordpressCategory>) {
  const names = post.categories.flatMap((id) => {
    const category = categories.get(id)
    return category ? [category] : []
  })
  return {
    post,
    slug: decodeSlug(post.slug),
    title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt.rendered).replace(/\s*continue reading\b.*/i, "").trim(),
    publishedOn: post.date.slice(0, 10),
    categoryNames: names.map((category) => category.name),
    categorySlugs: names.map((category) => category.slug),
    sourceUrl: post.link,
  }
}

async function chooseParse(post: WordpressPost, migratedSlugs: Set<string>) {
  const api = parseArticleHtml(post.content.rendered, { migratedSlugs }, "api")
  if (api.coverage >= 0.9 && api.coverage <= 1.08) return { parsed: api, sourceHtml: post.content.rendered }
  try {
    const extracted = extractWebpageArticle(await fetchWebpage(post.link))
    const page = extracted ? parseArticleHtml(extracted, { migratedSlugs }, "webpage") : null
    if (page && pageQuality(page) > pageQuality(api)) return { parsed: page, sourceHtml: extracted }
  } catch (error) {
    api.notes.push(error instanceof Error ? `Webpage fallback failed: ${error.message}` : "Webpage fallback failed")
  }
  return { parsed: api, sourceHtml: post.content.rendered }
}

function pageQuality(parsed: ParsedArticle) {
  if (parsed.coverage > 1.08) return 0
  return parsed.coverage
}

function assessParse(parsed: ParsedArticle) {
  if (parsed.parsedText.length < 400) return { ok: false, status: "needsReview" as const, reason: "Article text is shorter than 400 characters" }
  if (!parsed.blocks.some((block) => block.type === "paragraph")) return { ok: false, status: "failed" as const, reason: "Article has no paragraphs" }
  if (parsed.coverage < 0.75) return { ok: false, status: "failed" as const, reason: `Content coverage is ${parsed.coverage.toFixed(2)} against the source` }
  if (parsed.coverage < 0.9) return { ok: false, status: "needsReview" as const, reason: `Content coverage is ${parsed.coverage.toFixed(2)} against the source` }
  if (parsed.coverage > 1.08) return { ok: false, status: "failed" as const, reason: "Parsed text is longer than the source" }
  return { ok: true, status: "eligible" as const, reason: "" }
}

function articleImages(post: WordpressPost, parsed: ParsedArticle) {
  const images: RemoteImage[] = []
  const featured = normalizeImageUrl(post.jetpack_featured_media_url || post.yoast_head_json?.og_image?.[0]?.url || "")
  if (featured) images.push({ sourceUrl: featured, alt: "", role: "featured" })
  for (const image of parsed.images) {
    if (images.some((item) => item.sourceUrl === image.sourceUrl)) continue
    images.push(image)
  }
  return images
}

function toImportable(post: ReturnType<typeof preparePost>, category: string, chosen: { parsed: ParsedArticle, sourceHtml: string }, flags: string[], existing: ExistingArticle[]): PreparedImport {
  const mark = categoryMarks[category]
  if (!mark) throw new Error(`No article mark for ${category}`)
  const summary = clipText(post.excerpt || chosen.parsed.parsedText, 240)
  const featured: ArticleImage = { src: "/images/blog/pending", alt: "", width: 1, height: 1 }
  const record: ArticleRecord = {
    slug: post.slug,
    title: post.title,
    category,
    publishedOn: post.publishedOn,
    summary,
    mark,
    hero: null,
    featuredImage: featured,
    relatedSlugs: relatedSlugs(category, post.slug, existing),
    blocks: chosen.parsed.blocks,
  }
  return { ...post, category, parsed: chosen.parsed, editorialFlags: flags, record, sourceHtml: chosen.sourceHtml }
}

function relatedSlugs(category: string, slug: string, existing: ExistingArticle[]) {
  const same = existing.filter((article) => article.category === category && article.slug !== slug).map((article) => article.slug)
  const rest = existing.filter((article) => article.category !== category && article.slug !== slug).map((article) => article.slug)
  return [...same, ...rest].filter((item, index, list) => list.indexOf(item) === index).slice(0, 3)
}

function markDuplicateTitles(items: { post: ReturnType<typeof preparePost>, classification: { kind: string, category: string, reasons: string[] } }[]) {
  const groups = new Map<string, typeof items>()
  for (const item of items) {
    if (item.classification.kind !== "include") continue
    const key = normalizeTitle(item.post.title)
    const group = groups.get(key) ?? []
    group.push(item)
    groups.set(key, group)
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const sorted = [...group].sort((left, right) => right.post.post.content.rendered.length - left.post.post.content.rendered.length)
    for (const duplicate of sorted.slice(1)) {
      duplicate.classification.kind = "duplicate"
      duplicate.classification.reasons = [`Duplicate title of ${sorted[0]?.post.slug ?? "another post"}`]
    }
  }
}

function markSelection(rows: MigrationRow[], addition: PreparedImport[], apply: boolean) {
  const selected = new Set(addition.map((article) => article.slug))
  for (const row of rows) {
    if (!selected.has(row.slug)) continue
    row.status = apply ? "imported" : "readyToImport"
  }
}

function rowFrom(post: ReturnType<typeof preparePost>, status: MigrationRow["status"], reasons: string[], parsed: ParsedArticle | null, flags: string[] = [], category = ""): MigrationRow {
  return {
    wordpressId: post.post.id,
    slug: post.slug,
    title: post.title,
    publishedOn: post.publishedOn,
    status,
    category,
    wordpressCategories: post.categoryNames.join(" | "),
    sourceUrl: post.sourceUrl,
    coverage: parsed ? Number(parsed.coverage.toFixed(4)) : null,
    contentSource: parsed?.contentSource ?? "",
    editorialFlags: flags,
    reasons,
  }
}

function statusFrom(kind: Exclude<Classification["kind"], "include">): MigrationRow["status"] {
  switch (kind) {
    case "alreadyExisting":
      return "alreadyExisting"
    case "excludedStudyAbroad":
      return "excludedStudyAbroad"
    case "needsReview":
      return "needsReview"
    case "duplicate":
      return "duplicate"
    default: {
      const unhandled: never = kind
      return unhandled
    }
  }
}

async function featuredAlt(post: WordpressPost) {
  if (!post.featured_media) return ""
  const response = await request(`https://www.eduvert.co/wp-json/wp/v2/media/${post.featured_media}?_fields=alt_text`)
  const body: unknown = await response.json()
  if (typeof body !== "object" || body === null || !("alt_text" in body) || typeof body.alt_text !== "string") return ""
  return plainText(body.alt_text)
}

async function fetchWebpage(link: string) {
  const response = await request(link)
  return await response.text()
}

async function fetchCategories() {
  const categories = new Map<number, WordpressCategory>()
  let page = 1
  let totalPages = 1
  while (page <= totalPages) {
    const response = await request(`${categoriesUrl}?per_page=100&page=${page}&_fields=id,name,slug`)
    totalPages = Number(response.headers.get("x-wp-totalpages") ?? "1")
    const body: unknown = await response.json()
    if (!Array.isArray(body)) throw new Error("WordPress categories response was not a list")
    for (const category of body) {
      if (!isCategory(category)) continue
      categories.set(category.id, category)
    }
    page += 1
  }
  return categories
}

async function fetchPosts() {
  const posts: WordpressPost[] = []
  let page = 1
  let totalPages = 1
  const fields = "id,date,slug,link,title,content,excerpt,categories,featured_media,jetpack_featured_media_url,yoast_head_json"
  while (page <= totalPages) {
    const response = await request(`${postsUrl}?per_page=20&page=${page}&_fields=${fields}`)
    totalPages = Number(response.headers.get("x-wp-totalpages") ?? "1")
    const body: unknown = await response.json()
    if (!Array.isArray(body)) throw new Error(`WordPress posts page ${page} was not a list`)
    for (const post of body) {
      if (!isPost(post)) throw new Error(`WordPress post on page ${page} was missing required fields`)
      posts.push(post)
    }
    page += 1
  }
  return posts
}

async function request(url: string) {
  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": userAgent }, signal: AbortSignal.timeout(30000) })
      if (response.ok) return response
      lastError = new Error(`${response.status} ${url}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 500))
  }
  throw lastError instanceof Error ? lastError : new Error(`Request failed for ${url}`)
}

function readOptions(argv: string[]) {
  if (argv.includes("--help")) return { help: true, apply: false, dryRun: true, all: false, limit: null, retryFailed: false, allowMissingFeatured: false }
  const requestedApply = argv.includes("--apply")
  const dryRun = !requestedApply || argv.includes("--dry-run")
  const limitIndex = argv.indexOf("--limit")
  const limitText = limitIndex >= 0 ? argv[limitIndex + 1] : undefined
  const limit = limitText === undefined ? null : Number(limitText)
  if (limit !== null && (!Number.isInteger(limit) || limit < 1)) throw new Error("--limit expects a positive integer")
  const all = argv.includes("--all")
  const retryFailed = argv.includes("--retry-failed")
  const allowMissingFeatured = argv.includes("--allow-missing-featured")
  if (allowMissingFeatured && !retryFailed) throw new Error("--allow-missing-featured requires --retry-failed")
  if (requestedApply && !dryRun && !all && limit === null && !retryFailed) throw new Error("Refusing to apply without --limit, --all, or --retry-failed. Dry-run remains the default.")
  return { help: false, apply: requestedApply && !dryRun, dryRun, all, limit, retryFailed, allowMissingFeatured }
}

function byDate(left: { publishedOn: string, slug: string }, right: { publishedOn: string, slug: string }) {
  return right.publishedOn.localeCompare(left.publishedOn) || left.slug.localeCompare(right.slug)
}

function byRow(left: MigrationRow, right: MigrationRow) {
  return right.publishedOn.localeCompare(left.publishedOn) || left.slug.localeCompare(right.slug)
}

function isCategory(value: unknown): value is WordpressCategory {
  if (typeof value !== "object" || value === null) return false
  const category = value as Partial<WordpressCategory>
  return typeof category.id === "number" && typeof category.name === "string" && typeof category.slug === "string"
}

function isPost(value: unknown): value is WordpressPost {
  if (typeof value !== "object" || value === null) return false
  const post = value as Partial<WordpressPost>
  return typeof post.id === "number" && typeof post.date === "string" && typeof post.slug === "string" && typeof post.link === "string" && Array.isArray(post.categories) && typeof post.title?.rendered === "string" && typeof post.content?.rendered === "string" && typeof post.excerpt?.rendered === "string"
}

interface PreparedImport {
  post: WordpressPost
  slug: string
  title: string
  publishedOn: string
  category: string
  parsed: ParsedArticle
  editorialFlags: string[]
  record: ArticleRecord
  sourceHtml: string
}

const categoryMarks: Record<string, ArticleMark> = {
  "SEO & Search": "search",
  "AI & Marketing": "letters",
  "Paid Advertising": "pair",
  "Social Media Marketing": "quote",
  "Analytics": "search",
  "Digital Marketing": "tasks",
  "Career & Skills": "work",
}

const usage = `Usage: node --experimental-strip-types scripts/import-eduvert-blogs.ts [--limit N] [--all] [--retry-failed] [--apply]

Dry-run is the default and writes only scripts/reports/eduvert-blog-migration.json and .csv.
--limit N writes the first N eligible articles. Running it again rewrites those same articles.
--all writes every eligible article that is not already handwritten.
--retry-failed retries only the failed rows in scripts/reports/eduvert-blog-migration.json and appends recovered articles.
--allow-missing-featured with --retry-failed imports those articles when every original image URL is unavailable.
--apply writes components/blog/articles.generated.ts, journal cards, images, and metadata.`

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
