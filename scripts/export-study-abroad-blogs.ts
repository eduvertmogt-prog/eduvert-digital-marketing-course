import { createHash } from "node:crypto"
import { mkdir, mkdtemp, rename, rm, rmdir, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { parseArgs } from "node:util"
import { imageSize } from "image-size"
import { parse } from "node-html-parser"

const source = "https://www.eduvert.co/wp-json/wp/v2"
const imageLimit = 12_000_000
const headers = { "user-agent": "EduVertStudyAbroadExport/1.0" }
const direct = /\b(?:stud(?:y|ying) abroad|(?:stud(?:y|ying)|education|courses?|program(?:me)?s?|degrees?|admissions?|universit(?:y|ies)|colleges?|accommodation) (?:abroad|overseas)|overseas (?:stud(?:y|ies)|education)|international (?:students?|education|admissions?|universit(?:y|ies))|student visas?|scholarships?|ielts|toefl|pte)\b/i
const education = /\b(?:stud(?:y|ying|ies)|students?|universit(?:y|ies)|colleges?|courses?|degrees?|admissions?|applications?|intakes?|undergraduates?|masters?|bachelors?|postgraduates?|campus|tuition|engineering|healthcare|nursing)\b/i
const destination = /\b(?:u\.?k\.?|united kingdom|u\.?s\.?a\.?|united states|canada|australia|ireland|new zealand|germany|france|europe|singapore|dubai|netherlands|imperial college london|cambridge computer science)\b/i
const related = /\b(?:visas?|statement of purpose|international applicants?|universit(?:y|ies)|colleges?)\b/i

interface Rendered {
  rendered: string
  protected?: boolean
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Media {
  source_url?: string
  alt_text?: string
  media_details?: { sizes?: Record<string, { source_url?: string }> }
}

interface Post {
  id: number
  status: string
  slug: string
  link: string
  date: string
  date_gmt: string | null
  modified: string
  modified_gmt: string | null
  title: Rendered
  excerpt: Rendered
  content: Rendered
  categories: number[]
  featured_media: number
  jetpack_featured_media_url?: string
  yoast_head_json?: { og_image?: { url?: string }[] }
  _embedded?: { "wp:featuredmedia"?: Media[] }
}

interface ImageReference {
  originalUrl: string
  sourceUrl: string | null
  alt: string
}

interface ImageResult {
  localPath: string | null
  downloadedFrom: string | null
  width: number | null
  height: number | null
  errors: { url: string, reason: string }[]
}

type ExportedImages = Awaited<ReturnType<typeof exportImages>>
type ReportImageError = NonNullable<ExportedImages["featured"]> | ExportedImages["inline"][number]

const htmlText = (html: string) => parse(html).structuredText.replace(/\s+/g, " ").trim()
const message = (error: unknown) => error instanceof Error ? error.message : String(error)
const hash = (value: string) => createHash("sha256").update(value).digest("hex")

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/[\p{P}\s]+/gu, " ").trim()
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

function classify(post: Post, categories: Category[], title: string, excerpt: string, body: string) {
  const heading = `${title} ${decodeSlug(post.slug).replace(/-/g, " ")}`
  const category = categories.some((item) => direct.test(`${item.name} ${item.slug.replace(/-/g, " ")}`))
  const opening = `${excerpt} ${body.slice(0, 1200)}`
  const bodyMatches = [...body.matchAll(new RegExp(direct.source, "gi"))]
  const titleMatch = direct.test(heading) || (education.test(heading) && destination.test(heading))
  const contextualMatch = education.test(heading) && destination.test(opening)
  const destinationCourse = destination.test(heading) && education.test(opening)
  const bodyMatch = direct.test(opening) && bodyMatches.length >= 2
  const evidence = [
    category && "Study-abroad WordPress category",
    titleMatch && "Study-abroad topic in title or slug",
    contextualMatch && "Education in title or slug and a study destination in the excerpt or opening",
    destinationCourse && "Study destination or institution in title or slug and education in the excerpt or opening",
    bodyMatch && "Repeated study-abroad wording in article text, including the excerpt or opening",
  ].filter((item): item is string => Boolean(item))
  if (!body && (evidence.length || direct.test(excerpt))) {
    return { status: "needsReview", evidence: [...evidence, "WordPress did not expose article text"] } as const
  }
  if (titleMatch || (category && (bodyMatch || contextualMatch || destinationCourse || education.test(heading)))
    || (bodyMatch && (contextualMatch || education.test(heading) || related.test(heading)))) {
    return { status: "eligible", evidence } as const
  }
  if (category || bodyMatch || related.test(heading) || direct.test(excerpt)) {
    return { status: "needsReview", evidence: [...evidence, "Study-abroad signals are inconclusive"] } as const
  }
  return { status: "excluded", evidence } as const
}

async function request(url: string) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) })
      if (response.ok) return response
      await response.body?.cancel()
      if (response.status !== 429 && response.status < 500) {
        throw new HttpError(response.status, url)
      }
      if (attempt === 3) throw new HttpError(response.status, url)
    } catch (error) {
      if (attempt === 3 || error instanceof HttpError) throw error
    }
    await delay(attempt * 500)
  }
}

class HttpError extends Error {
  constructor(status: number, url: string) {
    super(`HTTP ${status} from ${url}`)
  }
}

async function fetchArchive<T>(endpoint: string, params: Record<string, string>) {
  const items: T[] = []
  let pages = 1
  let total = 0
  for (let page = 1; page <= pages; page += 1) {
    const query = new URLSearchParams({ ...params, page: String(page) })
    const response = await request(`${source}/${endpoint}?${query}`)
    const pageCount = response.headers.get("x-wp-totalpages")
    const itemCount = response.headers.get("x-wp-total")
    const body: unknown = await response.json()
    if (!Array.isArray(body) || pageCount === null || itemCount === null
      || !/^\d+$/.test(pageCount) || !/^\d+$/.test(itemCount)) {
      throw new Error(`Invalid WordPress pagination for ${endpoint} page ${page}`)
    }
    if (page === 1) {
      pages = Number(pageCount)
      total = Number(itemCount)
    } else if (pages !== Number(pageCount) || total !== Number(itemCount)) {
      throw new Error(`WordPress ${endpoint} changed during pagination. Run the export again.`)
    }
    items.push(...body)
  }
  if (items.length !== total) throw new Error(`Expected ${total} ${endpoint}, fetched ${items.length}`)
  return items
}

function prepare(post: Post, categories: Map<number, Category>) {
  if (!Number.isSafeInteger(post.id) || post.status !== "publish" || !post.slug || !post.link
    || typeof post.title?.rendered !== "string" || typeof post.content?.rendered !== "string"
    || typeof post.excerpt?.rendered !== "string" || !Array.isArray(post.categories)) {
    throw new Error(`Unexpected published WordPress record ${post.id}`)
  }
  const wordpressCategories = post.categories.map((id) => {
    const category = categories.get(id)
    if (!category) throw new Error(`Missing WordPress category ${id} on post ${post.id}`)
    return category
  })
  const title = htmlText(post.title.rendered)
  const excerpt = htmlText(post.excerpt.rendered)
  const body = htmlText(post.content.rendered)
  return {
    post, body,
    metadata: {
      wordpressId: post.id,
      title,
      titleHtml: post.title.rendered,
      slug: post.slug,
      publicationDate: post.date,
      publicationDateGmt: post.date_gmt,
      modifiedDate: post.modified,
      modifiedDateGmt: post.modified_gmt,
      originalUrl: post.link,
      category: "Study Abroad",
      wordpressCategories,
      excerpt,
      excerptHtml: post.excerpt.rendered,
      featuredMediaId: post.featured_media,
    },
    classification: classify(post, wordpressCategories, title, excerpt, body),
  }
}

type Prepared = ReturnType<typeof prepare>

function identify(post: Prepared) {
  const { wordpressId, title, slug, originalUrl } = post.metadata
  return { wordpressId, title, slug, originalUrl, evidence: post.classification.evidence }
}

function uniqueArticles(articles: Prepared[]) {
  const owners = new Map<string, Prepared>()
  const duplicates = []
  const unique = []
  // As in the original importer, keep the fullest copy of a repeated title.
  for (const article of [...articles].sort((a, b) => b.body.length - a.body.length || a.post.id - b.post.id)) {
    const slug = normalize(decodeSlug(article.post.slug))
    const title = normalize(article.metadata.title)
    const keys = [
      ["WordPress ID", String(article.post.id)],
      ["slug", slug],
      ["normalized title", title],
      ["normalized article text", hash(normalize(article.body))],
    ].filter(([, value]) => value)
    const match = keys.find(([field, value]) => owners.has(`${field}:${value}`))
    if (match) {
      const [field, value] = match
      const kept = owners.get(`${field}:${value}`)!
      duplicates.push({ ...identify(article), reason: `Repeated ${field}`, keptWordpressId: kept.post.id, keptSlug: kept.post.slug })
      continue
    }
    for (const [field, value] of keys) owners.set(`${field}:${value}`, article)
    unique.push(article)
  }
  unique.sort((a, b) => b.post.date.localeCompare(a.post.date) || b.post.id - a.post.id)
  return { unique, duplicates }
}

function resolveImage(value: string, base: string) {
  try {
    const url = new URL(value, base)
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}

function inlineImages(post: Post) {
  const root = parse(post.content.rendered, { blockTextElements: { noscript: false } })
  const refs = new Map<string, ImageReference>()
  for (const element of root.querySelectorAll("img, picture source")) {
    const alt = element.getAttribute("alt") ?? ""
    const urls = ["src", "data-src", "data-lazy-src", "data-original"].map((attr) => element.getAttribute(attr) ?? "")
    for (const attr of ["srcset", "data-srcset", "data-lazy-srcset"]) {
      const value = element.getAttribute(attr) ?? ""
      // Read each URL token, including data URLs with an internal comma.
      urls.push(...Array.from(value.matchAll(/\s*(\S+?)(?:\s+\d+(?:\.\d+)?[wx]\s*(?:,|$)|,(?=\s|$)|$)/g), (match) => match[1]))
    }
    for (const originalUrl of urls.map((url) => url.trim()).filter(Boolean)) {
      if (originalUrl.startsWith("data:")) continue // Already embedded in the original HTML.
      const sourceUrl = resolveImage(originalUrl, post.link)
      const key = sourceUrl ?? originalUrl
      if (!refs.has(key) || (!refs.get(key)?.alt && alt)) refs.set(key, { originalUrl, sourceUrl, alt })
    }
  }
  return [...refs.values()]
}

// Recovery candidates adapted from EduVert's normalizeImageUrl and recover-images helpers.
function imageCandidates(url: string) {
  const original = new URL(url)
  const candidates = [url]
  const host = original.hostname.replace(/^www\./, "")
  if (host === "eduvert.co" && original.search) {
    const clean = new URL(url)
    clean.search = ""
    candidates.push(clean.href)
  }
  if (host.endsWith(".wp.com") && /^\/(?:www\.)?eduvert\.co\//.test(original.pathname)) {
    candidates.push(`https://www.eduvert.co${original.pathname.replace(/^\/[^/]+/, "")}`)
  }
  for (const candidate of [...candidates]) {
    const recovered = new URL(candidate)
    recovered.pathname = recovered.pathname.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "")
    if (recovered.href !== candidate) candidates.push(recovered.href)
    if (candidate.includes("/:/")) candidates.push(candidate.split("/:/")[0])
  }
  return [...new Set(candidates)]
}

async function download(url: string, folder: string) {
  const response = await request(url)
  const type = response.headers.get("content-type") ?? ""
  const reader = response.body?.getReader()
  if (!reader) throw new Error("Empty image response")
  if (/text\/html|application\/json/i.test(type) || Number(response.headers.get("content-length")) > imageLimit) {
    await reader.cancel()
    throw new Error(`Invalid or oversized image response (${type || "unknown content type"})`)
  }
  const chunks = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > imageLimit) {
      await reader.cancel()
      throw new Error("Image exceeds 12 MB")
    }
    chunks.push(value)
  }
  const bytes = Buffer.concat(chunks, size)
  const dimensions = imageSize(bytes)
  if (!dimensions.width || !dimensions.height || !dimensions.type || !/^[a-z0-9]+$/.test(dimensions.type)) {
    throw new Error("Image type or dimensions could not be verified")
  }
  const filename = `${createHash("sha256").update(bytes).digest("hex")}.${dimensions.type}`
  await writeFile(join(folder, "images", filename), bytes)
  return { localPath: `images/${filename}`, width: dimensions.width, height: dimensions.height }
}

function imageDownloader(folder: string) {
  const cache = new Map<string, Promise<Awaited<ReturnType<typeof download>>>>()
  return async (urls: string[]): Promise<ImageResult> => {
    const errors: ImageResult["errors"] = []
    for (const url of new Set(urls.flatMap(imageCandidates))) {
      try {
        let pending = cache.get(url)
        if (!pending) {
          pending = download(url, folder)
          cache.set(url, pending)
        }
        return { ...await pending, downloadedFrom: url, errors }
      } catch (error) {
        errors.push({ url, reason: message(error) })
      }
    }
    return { localPath: null, downloadedFrom: null, width: null, height: null, errors }
  }
}

async function exportImages(post: Post, recover: ReturnType<typeof imageDownloader>) {
  const embedded = post._embedded?.["wp:featuredmedia"]?.[0]
  let media = embedded
  const featuredErrors: ImageResult["errors"] = []
  if (!media?.source_url && post.featured_media) {
    const url = `${source}/media/${post.featured_media}?_fields=source_url,alt_text,media_details`
    try {
      media = await (await request(url)).json() as Media
    } catch (error) {
      featuredErrors.push({ url, reason: message(error) })
    }
  }
  const inline = inlineImages(post)
  const sizes = media?.media_details?.sizes ?? {}
  const preferred = ["full", "large", "medium_large", "1536x1536", "2048x2048", "medium", "thumbnail"]
  const sizeNames = [...new Set([...preferred, ...Object.keys(sizes)])]
  const originalUrls = [...new Set([
    media?.source_url,
    post.jetpack_featured_media_url,
    post.yoast_head_json?.og_image?.[0]?.url,
    ...sizeNames.map((name) => sizes[name]?.source_url),
  ].filter((url): url is string => Boolean(url)))]
  const urls = originalUrls.map((url) => resolveImage(url, post.link)).filter((url): url is string => Boolean(url))
  let featured = null
  if (post.featured_media || originalUrls.length) {
    let result = await recover(urls)
    let pageOgUrl: string | null = null
    if (!result.localPath) {
      try {
        const page = parse(await (await request(post.link)).text())
        const meta = page.querySelector('meta[property="og:image"], meta[name="og:image"]')
        const raw = meta?.getAttribute("content")
        pageOgUrl = raw ? resolveImage(raw, post.link) : null
        if (raw && !originalUrls.includes(raw)) originalUrls.push(raw)
      } catch (error) {
        featuredErrors.push({ url: post.link, reason: message(error) })
      }
      if (pageOgUrl && !urls.includes(pageOgUrl)) {
        const fallback = await recover([pageOgUrl])
        result = { ...fallback, errors: [...result.errors, ...fallback.errors] }
      }
      if (!originalUrls.length) featuredErrors.push({ url: post.link, reason: "No featured image URL was available" })
    }
    featured = {
      originalUrls,
      sourceUrl: urls[0] ?? pageOgUrl,
      alt: media?.alt_text ?? "",
      ...result,
      errors: [...featuredErrors, ...result.errors],
    }
  }
  const inlineResults = []
  for (let start = 0; start < inline.length; start += 6) {
    const batch = await Promise.all(inline.slice(start, start + 6).map(async (image) => {
      const result = await recover(image.sourceUrl ? [image.sourceUrl] : [])
      if (!image.sourceUrl) result.errors.push({ url: image.originalUrl, reason: "Image URL is not HTTP(S)" })
      return { ...image, ...result }
    }))
    inlineResults.push(...batch)
  }
  return { featured, inline: inlineResults }
}

async function json(path: string, data: unknown) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`)
}

async function main() {
  const { values } = parseArgs({ options: {
    "dry-run": { type: "boolean" },
    apply: { type: "boolean" },
    all: { type: "boolean" },
    limit: { type: "string" },
    output: { type: "string" },
    help: { type: "boolean" },
  } })
  if (values.help) {
    console.log("node export-study-abroad-blogs.ts [--dry-run | --apply] [--all | --limit N] [--output PATH]")
    return
  }
  if (values.apply && values["dry-run"]) throw new Error("Choose either --dry-run or --apply")
  if (values.all && values.limit !== undefined) throw new Error("Choose either --all or --limit")
  const limit = values.limit === undefined ? undefined : Number(values.limit)
  if (limit !== undefined && (!/^\d+$/.test(values.limit!) || !Number.isSafeInteger(limit) || limit < 1)) {
    throw new Error("--limit expects a positive integer")
  }
  if (values.apply && !values.all && limit === undefined) throw new Error("--apply requires --all or --limit N")
  const output = resolve(values.output ?? "exports/study-abroad")

  const [categories, posts] = await Promise.all([
    fetchArchive<Category>("categories", { per_page: "100", _fields: "id,name,slug" }),
    fetchArchive<Post>("posts", { per_page: "20", status: "publish", orderby: "id", order: "asc", _embed: "wp:featuredmedia" }),
  ])
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const prepared = posts.map((post) => prepare(post, categoryById))
  const matched = prepared.filter((article) => article.classification.status === "eligible")
  const { unique, duplicates } = uniqueArticles(matched)
  const selected = limit === undefined ? unique : unique.slice(0, limit)
  const needsReview = prepared.filter((article) => article.classification.status === "needsReview").map(identify)
  const failed: { wordpressId: number, slug: string, reason: string }[] = []
  const imageErrors: (ReportImageError & { wordpressId: number, slug: string, role: "featured" | "inline" })[] = []
  const totals = {
    publishedPosts: posts.length,
    matched: matched.length,
    eligible: unique.length,
    selected: selected.length,
    exported: 0,
    failed: 0,
    duplicates: duplicates.length,
    needsReview: needsReview.length,
    excluded: prepared.length - matched.length - needsReview.length,
    imagesDownloaded: 0,
    imagesUnavailable: 0,
  }
  const report = {
    schemaVersion: 1,
    source: `${source}/posts`,
    generatedAt: new Date().toISOString(),
    dryRun: !values.apply,
    totals,
    eligible: unique.map(identify),
    selected: selected.map((article) => article.post.id),
    duplicates,
    needsReview,
    failed,
    imageErrors,
  }
  if (!values.apply) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  await mkdir(dirname(output), { recursive: true })
  // Claim the output directory so a rerun or concurrent export cannot overwrite an archive.
  await mkdir(output)
  let folder: string | undefined
  let committed = false
  try {
    folder = await mkdtemp(join(dirname(output), ".study-abroad-"))
    await mkdir(join(folder, "articles"))
    await mkdir(join(folder, "images"))
    const recover = imageDownloader(folder)
    const index = []
    for (const article of selected) {
      const { post, metadata } = article
      try {
        const slug = post.slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 140)
        const file = `articles/${post.id}-${slug}.json`
        const images = await exportImages(post, recover)
        const entry = { ...metadata, file, images }
        await json(join(folder, file), { ...entry, contentFormat: "html", content: post.content.rendered })
        index.push(entry)
        for (const [role, references] of [["featured", images.featured ? [images.featured] : []], ["inline", images.inline]] as const) {
          for (const image of references) {
            if (image.localPath) totals.imagesDownloaded += 1
            else totals.imagesUnavailable += 1
            if (image.errors.length) imageErrors.push({ wordpressId: post.id, slug: post.slug, role, ...image })
          }
        }
        console.error(`Exported ${post.id} ${post.slug}`)
      } catch (error) {
        failed.push({ wordpressId: post.id, slug: post.slug, reason: message(error) })
        console.error(`Failed ${post.id}: ${message(error)}`)
      }
    }
    totals.exported = index.length
    totals.failed = failed.length
    await json(join(folder, "index.json"), { schemaVersion: 1, source: report.source, articles: index })
    await json(join(folder, "report.json"), report)
    await rename(folder, output)
    committed = true
    console.log(JSON.stringify(totals, null, 2))
    if (failed.length) process.exitCode = 1
  } finally {
    if (!committed) {
      if (folder) await rm(folder, { recursive: true, force: true })
      await rmdir(output).catch(() => {})
    }
  }
}

main().catch((error: unknown) => {
  console.error(message(error))
  process.exitCode = 1
})
