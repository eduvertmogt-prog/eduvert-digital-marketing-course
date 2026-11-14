import { parse } from "node-html-parser"
import { normalizeImageUrl } from "./html.ts"
import type { WordpressPost } from "./types.ts"

export interface ImageCandidate {
  sourceUrl: string
  alt: string
}

export function featuredImageCandidates(input: CandidateInput) {
  const ordered: string[] = []
  const push = (value: string) => {
    const normalized = normalizeCandidate(value)
    if (!normalized || ordered.includes(normalized)) return
    ordered.push(normalized)
  }
  const mediaUrls = [input.media?.sourceUrl ?? "", ...(input.media?.sizeUrls ?? [])]
  const knownUrls = [input.post.jetpack_featured_media_url ?? "", input.post.yoast_head_json?.og_image?.[0]?.url ?? "", ...input.contentUrls]
  push(input.media?.sourceUrl ?? "")
  for (const url of input.media?.sizeUrls ?? []) push(url)
  for (const url of knownUrls) push(url)
  for (const url of [...mediaUrls, ...knownUrls, input.pageOgImage]) push(withoutResizeSuffix(url))
  push(input.pageOgImage)
  for (const url of [...ordered, ...knownUrls]) push(withoutGodaddyTransform(url))
  return ordered.map((sourceUrl) => ({ sourceUrl, alt: input.media?.alt ?? "" }))
}

export function pageOgImage(html: string) {
  const root = parse(html)
  const meta = root.querySelector('meta[property="og:image"]') ?? root.querySelector('meta[name="og:image"]')
  return meta?.getAttribute("content") ?? ""
}

export function contentImageUrls(html: string) {
  const root = parse(html)
  return root.querySelectorAll("img").flatMap((image) => {
    const src = image.getAttribute("src") ?? image.getAttribute("data-src") ?? ""
    return src ? [src] : []
  })
}

export interface MediaAttachment {
  sourceUrl: string
  alt: string
  sizeUrls: string[]
}

export function mediaAttachment(value: unknown): MediaAttachment | null {
  if (typeof value !== "object" || value === null) return null
  const media = value as { source_url?: unknown, alt_text?: unknown, media_details?: { sizes?: Record<string, { source_url?: unknown }> } }
  const sourceUrl = typeof media.source_url === "string" ? media.source_url : ""
  const alt = typeof media.alt_text === "string" ? media.alt_text : ""
  const sizes = media.media_details?.sizes ?? {}
  const preferred = ["full", "large", "medium_large", "1536x1536", "2048x2048", "medium", "thumbnail"]
  const names = [...preferred.filter((name) => name in sizes), ...Object.keys(sizes).filter((name) => !preferred.includes(name)).sort()]
  const sizeUrls = names.flatMap((name) => {
    const url = sizes[name]?.source_url
    return typeof url === "string" && url ? [url] : []
  })
  if (!sourceUrl && sizeUrls.length === 0 && !alt) return null
  return { sourceUrl, alt, sizeUrls }
}

function normalizeCandidate(value: string) {
  return normalizeImageUrl(value.trim())
}

function withoutResizeSuffix(value: string) {
  const normalized = normalizeCandidate(value)
  if (!normalized) return ""
  const url = new URL(normalized)
  const next = url.pathname.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "")
  if (next === url.pathname) return ""
  url.pathname = next
  return url.toString()
}

function withoutGodaddyTransform(value: string) {
  const normalized = normalizeCandidate(value)
  if (!normalized) return ""
  const marker = normalized.indexOf("/:/")
  if (marker < 0) return ""
  return normalized.slice(0, marker)
}

interface CandidateInput {
  post: WordpressPost
  media: MediaAttachment | null
  contentUrls: string[]
  pageOgImage: string
}
