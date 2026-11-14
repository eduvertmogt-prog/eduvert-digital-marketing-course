import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import type { ArticleImage, ArticleMark, ArticleRecord } from "../../components/blog/article-types.ts"
import { classifyPost, decodeSlug, editorialFlags, normalizeTitle } from "./classify.ts"
import { readExistingArticles } from "./existing.ts"
import { appendGeneratedArticles, appendGeneratedJournal, appendMetadata } from "./generate.ts"
import { clipText, extractWebpageArticle, normalizeImageUrl, parseArticleHtml, plainText } from "./html.ts"
import { downloadImage, readImageManifest, saveDownloadedImage, writeImageManifest, type ImageDownload, type ImageManifestEntry } from "./images.ts"
import { contentImageUrls, featuredImageCandidates, mediaAttachment, pageOgImage } from "./recover-images.ts"
import type { ExistingArticle, MigrationRow, ParsedArticle, WordpressPost } from "./types.ts"

const postsUrl = "https://www.eduvert.co/wp-json/wp/v2/posts"
const userAgent = "EduVertBlogImport/1.0"

export async function retryFailed(input: RetryOptions) {
  const reportPath = resolve(input.root, "scripts/reports/eduvert-blog-migration.json")
  const failed = await readFailedRows(reportPath)
  const existing = await readExistingArticles(resolve(input.root, "components/blog/articles.ts"), resolve(input.root, "components/blog/journal.ts"))
  const existingSlugs = new Set(existing.map((article) => article.slug))
  const generatedSlugs = await readGeneratedSlugs(resolve(input.root, "components/blog/articles.generated.ts"))
  const manifest = await readImageManifest(resolve(input.root, "scripts/reports/image-manifest.json"))
  const downloads = new Map<string, ImageDownload>()
  const articles: RecoveryArticle[] = []
  const records: ArticleRecord[] = []
  const metadata = []
  const pending: PendingRecovery[] = []

  for (const row of failed) {
    if (existingSlugs.has(row.slug) || generatedSlugs.has(row.slug)) {
      articles.push({ slug: row.slug, title: row.title, outcome: "skipped", reason: "Article is already imported", attempts: [], inlineFailures: [] })
      continue
    }
    const post = await fetchPost(row.slug)
    if (!post) {
      articles.push({ slug: row.slug, title: row.title, outcome: "stillMissing", reason: "WordPress post could not be fetched", attempts: [], inlineFailures: [] })
      continue
    }
    const recovered = await recoverFeaturedImage({ post, manifest, downloads, root: input.root, apply: input.apply })
    const imageUnavailable = !recovered.image
    if (imageUnavailable && !input.allowMissingFeatured) {
      articles.push({ slug: row.slug, title: plainText(post.title.rendered), outcome: "stillMissing", reason: "Every featured-image candidate failed", attempts: recovered.attempts, inlineFailures: [] })
      continue
    }
    pending.push({ row, post, recovered, imageUnavailable })
  }

  const migratedSlugs = new Set([...existingSlugs, ...generatedSlugs, ...pending.map((item) => decodeSlug(item.post.slug))])
  for (const item of pending) {
    const { row, post, recovered, imageUnavailable } = item
    const chosen = await chooseParse(post, migratedSlugs)
    const assessment = assessParse(chosen.parsed)
    if (!assessment.ok) {
      articles.push({ slug: row.slug, title: plainText(post.title.rendered), outcome: "stillMissing", reason: assessment.reason, attempts: recovered.attempts, inlineFailures: [] })
      continue
    }
    const prepared = preparePost(post)
    const category = row.category || classifyCategory(prepared, existing)
    const inlineFailures = await inlineImageFailures(post, recovered.image?.sourceUrl ?? "", downloads)
    const title = prepared.title
    const featured: ArticleImage | null = recovered.image?.localPath
      ? { src: recovered.image.localPath, alt: recovered.image.alt, width: recovered.image.width, height: recovered.image.height }
      : null
    const importingWithoutImage = imageUnavailable && input.allowMissingFeatured
    if (input.apply && (featured || importingWithoutImage)) {
      const record: ArticleRecord = {
        slug: prepared.slug,
        title,
        category,
        publishedOn: prepared.publishedOn,
        summary: clipText(prepared.excerpt || chosen.parsed.parsedText, 240),
        mark: categoryMark(category),
        hero: featured,
        featuredImage: featured,
        relatedSlugs: relatedSlugs(category, prepared.slug, existing),
        blocks: chosen.parsed.blocks,
      }
      records.push(record)
      metadata.push({
        slug: prepared.slug,
        sourceUrl: post.link,
        wordpressId: post.id,
        contentSource: chosen.parsed.contentSource,
        coverage: Number(chosen.parsed.coverage.toFixed(4)),
        editorialFlags: editorialFlags(title, prepared.publishedOn, chosen.parsed.parsedText),
        notes: chosen.parsed.notes,
        featuredImageStatus: featured ? "available" : "unavailable",
        featuredImage: featured ? { sourceUrl: recovered.image?.sourceUrl ?? "", localPath: featured.src, alt: featured.alt } : null,
        unavailableImageUrls: recovered.attempts.filter((attempt) => !attempt.ok),
        inlineImages: [],
        imageFailures: inlineFailures,
        unmappedLinks: chosen.parsed.unmappedLinks,
        recovery: true,
      })
    }
    articles.push({
      slug: prepared.slug,
      title,
      outcome: input.apply ? "imported" : importingWithoutImage ? "readyWithoutImage" : "imageRecovered",
      reason: importingWithoutImage ? "Original featured image is unavailable. Article text is preserved with an editorial cover." : input.apply ? "Featured image recovered and article appended" : "Featured image is available. Dry-run did not write it.",
      attempts: recovered.attempts,
      inlineFailures,
      ...(recovered.image ? { recoveredImage: { sourceUrl: recovered.image.sourceUrl, localPath: input.apply ? recovered.image.localPath : "", alt: recovered.image.alt, width: recovered.image.width, height: recovered.image.height } } : {}),
    })
  }

  if (input.apply && records.length > 0) {
    const clash = records.find((article) => existingSlugs.has(article.slug) || generatedSlugs.has(article.slug))
    if (clash) throw new Error(`Refusing to rewrite existing article ${clash.slug}`)
    await appendGeneratedArticles(resolve(input.root, "components/blog/articles.generated.ts"), records)
    await appendGeneratedJournal(resolve(input.root, "components/blog/journal.generated.ts"), records)
    await appendMetadata(resolve(input.root, "components/blog/articles.generated.meta.json"), metadata)
    await writeImageManifest(resolve(input.root, "scripts/reports/image-manifest.json"), manifest)
  }

  const recovery = {
    dryRun: input.dryRun,
    apply: input.apply,
    attempted: failed.length,
    imagesRecovered: articles.filter((article) => article.recoveredImage).length,
    imported: articles.filter((article) => article.outcome === "imported").length,
    stillMissingImages: articles.filter((article) => article.outcome === "stillMissing").length,
    articles,
  }
  const directory = resolve(input.root, "scripts/reports")
  await mkdir(directory, { recursive: true })
  await writeFile(resolve(directory, "eduvert-blog-recovery.json"), `${JSON.stringify(recovery, null, 2)}\n`)
  await writeFile(resolve(directory, "eduvert-blog-recovery.csv"), recoveryCsv(recovery.articles))
  console.log(JSON.stringify({ attempted: recovery.attempted, imagesRecovered: recovery.imagesRecovered, imported: recovery.imported, stillMissingImages: recovery.stillMissingImages }, null, 2))
  return recovery
}

async function recoverFeaturedImage(input: RecoverInput) {
  const attempts: RecoveryAttempt[] = []
  const mediaResponse = input.post.featured_media ? await requestMedia(input.post.featured_media) : null
  if (input.post.featured_media) {
    attempts.push({ sourceUrl: `https://www.eduvert.co/wp-json/wp/v2/media/${input.post.featured_media}`, status: mediaResponse?.status ?? null, ok: Boolean(mediaResponse?.media), reason: mediaResponse?.media ? "Media attachment found" : mediaResponse?.reason ?? "No featured media" })
  } else {
    attempts.push({ sourceUrl: "", status: null, ok: false, reason: "Post has no featured_media id" })
  }
  const page = await requestText(input.post.link)
  const candidates = featuredImageCandidates({
    post: input.post,
    media: mediaResponse?.media ?? null,
    contentUrls: contentImageUrls(input.post.content.rendered),
    pageOgImage: page.html ? pageOgImage(page.html) : "",
  })
  if (page.status !== null && !page.html) attempts.push({ sourceUrl: input.post.link, status: page.status, ok: false, reason: page.reason })
  for (const candidate of candidates) {
    const download = await cachedDownload(candidate.sourceUrl, input.downloads)
    attempts.push({ sourceUrl: candidate.sourceUrl, status: download.status, ok: download.ok, reason: download.ok ? "Image decoded" : download.reason })
    if (!download.ok) continue
    if (!input.apply) return { attempts, image: { sourceUrl: candidate.sourceUrl, localPath: "", alt: candidate.alt, width: download.width, height: download.height } }
    const saved = await saveDownloadedImage({ root: input.root, slug: decodeSlug(input.post.slug), sourceUrl: candidate.sourceUrl, alt: candidate.alt, bytes: download.bytes, width: download.width, height: download.height, manifest: input.manifest })
    return { attempts, image: { sourceUrl: saved.sourceUrl, localPath: saved.src, alt: saved.alt, width: saved.width, height: saved.height } }
  }
  return { attempts, image: null }
}

async function inlineImageFailures(post: WordpressPost, featuredUrl: string, downloads: Map<string, ImageDownload>) {
  const failures: RecoveryAttempt[] = []
  for (const url of contentImageUrls(post.content.rendered)) {
    const sourceUrl = normalizeImageUrl(url)
    if (!sourceUrl || sourceUrl === featuredUrl) continue
    const download = await cachedDownload(sourceUrl, downloads)
    if (download.ok) continue
    failures.push({ sourceUrl, status: download.status, ok: false, reason: download.reason })
  }
  return failures
}

async function cachedDownload(url: string, downloads: Map<string, ImageDownload>) {
  const cached = downloads.get(url)
  if (cached) return cached
  const download = await downloadImage(url)
  downloads.set(url, download)
  return download
}

async function chooseParse(post: WordpressPost, migratedSlugs: Set<string>) {
  const api = parseArticleHtml(post.content.rendered, { migratedSlugs }, "api")
  if (api.coverage >= 0.9 && api.coverage <= 1.08) return { parsed: api, sourceHtml: post.content.rendered }
  const page = await requestText(post.link)
  const extracted = page.html ? extractWebpageArticle(page.html) : ""
  const webpage = extracted ? parseArticleHtml(extracted, { migratedSlugs }, "webpage") : null
  if (webpage && webpage.coverage > api.coverage && webpage.coverage <= 1.08) return { parsed: webpage, sourceHtml: extracted }
  return { parsed: api, sourceHtml: post.content.rendered }
}

function assessParse(parsed: ParsedArticle) {
  if (parsed.parsedText.length < 400) return { ok: false, reason: "Article text is shorter than 400 characters" }
  if (!parsed.blocks.some((block) => block.type === "paragraph")) return { ok: false, reason: "Article has no paragraphs" }
  if (parsed.coverage < 0.9 || parsed.coverage > 1.08) return { ok: false, reason: `Content coverage is ${parsed.coverage.toFixed(2)} against the source` }
  return { ok: true, reason: "" }
}

function preparePost(post: WordpressPost) {
  return {
    slug: decodeSlug(post.slug),
    title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt.rendered).replace(/\s*continue reading\b.*/i, "").trim(),
    publishedOn: post.date.slice(0, 10),
  }
}

function classifyCategory(post: ReturnType<typeof preparePost>, existing: ExistingArticle[]) {
  const classified = classifyPost({ slug: post.slug, title: post.title, excerpt: post.excerpt, categoryNames: [], categorySlugs: [], existingSlugs: new Set(existing.map((article) => article.slug)), existingTitles: new Set(existing.map((article) => normalizeTitle(article.title))) })
  if (classified.kind !== "include") return "Digital Marketing"
  return classified.category
}

function categoryMark(category: string): ArticleMark {
  const mark = categoryMarks[category]
  if (!mark) throw new Error(`No article mark for ${category}`)
  return mark
}

function relatedSlugs(category: string, slug: string, existing: ExistingArticle[]) {
  const same = existing.filter((article) => article.category === category && article.slug !== slug).map((article) => article.slug)
  const rest = existing.filter((article) => article.category !== category && article.slug !== slug).map((article) => article.slug)
  return [...same, ...rest].filter((item, index, list) => list.indexOf(item) === index).slice(0, 3)
}

async function readFailedRows(path: string) {
  const source = await readFile(path, "utf8")
  const parsed: unknown = JSON.parse(source)
  if (typeof parsed !== "object" || parsed === null || !("rows" in parsed) || !Array.isArray(parsed.rows)) throw new Error("Migration report is missing rows")
  return parsed.rows.flatMap((row) => isFailedRow(row) ? [row] : [])
}

async function readGeneratedSlugs(path: string) {
  const source = await readFile(path, "utf8")
  return new Set([...source.matchAll(/"slug": "([^"]+)"/g)].map((match) => match[1] ?? "").filter((slug) => slug.length > 0))
}

async function fetchPost(slug: string) {
  const response = await request(`${postsUrl}?slug=${encodeURIComponent(slug)}&_fields=id,date,slug,link,title,content,excerpt,categories,featured_media,jetpack_featured_media_url,yoast_head_json`)
  if (!response) return null
  const body: unknown = await response.json()
  if (!Array.isArray(body) || !isPost(body[0])) return null
  return body[0]
}

async function requestMedia(id: number) {
  const url = `https://www.eduvert.co/wp-json/wp/v2/media/${id}?_fields=source_url,alt_text,media_details`
  const response = await request(url)
  if (!response) return { status: null, media: null, reason: "Media request failed" }
  if (!response.ok) return { status: response.status, media: null, reason: `Media request returned ${response.status}` }
  return { status: response.status, media: mediaAttachment(await response.json()), reason: "" }
}

async function requestText(url: string) {
  const response = await request(url)
  if (!response) return { status: null, html: "", reason: "Page request failed" }
  if (!response.ok) return { status: response.status, html: "", reason: `Page request returned ${response.status}` }
  return { status: response.status, html: await response.text(), reason: "" }
}

async function request(url: string) {
  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": userAgent }, signal: AbortSignal.timeout(30000) })
      if (response.ok || response.status < 500) return response
      lastError = new Error(`${response.status} ${url}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 400))
  }
  console.error(lastError instanceof Error ? lastError.message : lastError)
  return null
}

function recoveryCsv(articles: RecoveryArticle[]) {
  const lines = articles.flatMap((article) => {
    const attempts = article.attempts.length > 0 ? article.attempts : [{ sourceUrl: "", status: null, ok: false, reason: article.reason }]
    return attempts.map((attempt) => [article.slug, article.title, article.outcome, attempt.sourceUrl, attempt.status === null ? "" : String(attempt.status), attempt.reason].map(csvCell).join(","))
  })
  return `slug,title,outcome,url,status,reason\n${lines.join("\n")}\n`
}

function csvCell(value: string) {
  if (!/[",\n]/.test(value)) return value
  return `"${value.replace(/"/g, "\"\"")}"`
}

function isFailedRow(value: unknown): value is MigrationRow {
  if (typeof value !== "object" || value === null) return false
  const row = value as Partial<MigrationRow>
  return row.status === "failed" && typeof row.slug === "string" && typeof row.title === "string"
}

function isPost(value: unknown): value is WordpressPost {
  if (typeof value !== "object" || value === null) return false
  const post = value as Partial<WordpressPost>
  return typeof post.id === "number" && typeof post.slug === "string" && typeof post.link === "string" && typeof post.date === "string" && typeof post.content?.rendered === "string" && typeof post.title?.rendered === "string" && typeof post.excerpt?.rendered === "string" && Array.isArray(post.categories)
}

interface RetryOptions {
  root: string
  apply: boolean
  dryRun: boolean
  allowMissingFeatured: boolean
}

interface PendingRecovery {
  row: MigrationRow
  post: WordpressPost
  recovered: { attempts: RecoveryAttempt[], image: { sourceUrl: string, localPath: string, alt: string, width: number, height: number } | null }
  imageUnavailable: boolean
}

interface RecoverInput {
  post: WordpressPost
  manifest: ImageManifestEntry[]
  downloads: Map<string, ImageDownload>
  root: string
  apply: boolean
}

interface RecoveryAttempt {
  sourceUrl: string
  status: number | null
  ok: boolean
  reason: string
}

interface RecoveryArticle {
  slug: string
  title: string
  outcome: "imported" | "imageRecovered" | "readyWithoutImage" | "stillMissing" | "skipped"
  reason: string
  attempts: RecoveryAttempt[]
  inlineFailures: RecoveryAttempt[]
  recoveredImage?: { sourceUrl: string, localPath: string, alt: string, width: number, height: number }
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
