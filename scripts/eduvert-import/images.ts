import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { imageSize } from "image-size"
import type { ArticleImage } from "../../components/blog/article-types.ts"
import type { RemoteImage } from "./types.ts"

export interface StoredImage extends ArticleImage {
  sourceUrl: string
}

export interface ImageFailure {
  sourceUrl: string
  reason: string
}

export async function readImageManifest(path: string) {
  try {
    const source = await readFile(path, "utf8")
    const parsed: unknown = JSON.parse(source)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((entry) => isManifestEntry(entry) ? [entry] : [])
  } catch (error) {
    if (isMissingFile(error)) return []
    throw error
  }
}

export async function writeImageManifest(path: string, entries: ManifestEntry[]) {
  const unique = new Map(entries.map((entry) => [entry.sourceUrl, entry]))
  const sorted = [...unique.values()].sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl))
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(sorted, null, 2)}\n`)
}

export async function storeImages(input: StoreImagesInput) {
  const failures: ImageFailure[] = []
  const stored: StoredImage[] = []
  for (const image of input.images) {
    const result = await storeImage({ ...input, image })
    if ("error" in result) {
      failures.push({ sourceUrl: image.sourceUrl, reason: result.error })
      continue
    }
    stored.push(result)
  }
  const featured = stored.find((image) => input.images.find((remote) => remote.sourceUrl === image.sourceUrl)?.role === "featured") ?? stored[0] ?? null
  return { featured, stored, failures }
}

async function storeImage(input: StoreImagesInput & { image: RemoteImage }): Promise<StoredImage | { error: string }> {
  const existing = input.manifest.find((entry) => entry.sourceUrl === input.image.sourceUrl)
  if (existing) {
    const bytes = await readOptionalFile(localFile(input.root, existing.localPath))
    if (bytes) return { src: existing.localPath, alt: input.image.alt, width: existing.width, height: existing.height, sourceUrl: input.image.sourceUrl }
  }
  let response: Response
  try {
    response = await fetch(input.image.sourceUrl, { headers: { "user-agent": userAgent }, signal: AbortSignal.timeout(20000) })
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Image request failed" }
  }
  if (!response.ok) return { error: `Image request returned ${response.status}` }
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (bytes.byteLength === 0 || bytes.byteLength > 12_000_000) return { error: "Image file is empty or larger than 12MB" }
  let size: { width?: number, height?: number }
  try {
    size = imageSize(bytes)
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not read image dimensions" }
  }
  if (!size.width || !size.height) return { error: "Image dimensions are missing" }
  const filename = uniqueFilename(input.image.sourceUrl, input.slug, input.manifest, input.root)
  const localPath = `/images/blog/${filename}`
  await mkdir(resolve(input.root, "public/images/blog"), { recursive: true })
  await writeFile(resolve(input.root, "public/images/blog", filename), bytes)
  const entry = { sourceUrl: input.image.sourceUrl, localPath, width: size.width, height: size.height, bytes: bytes.byteLength }
  const previous = input.manifest.findIndex((item) => item.sourceUrl === input.image.sourceUrl)
  if (previous >= 0) input.manifest.splice(previous, 1, entry)
  else input.manifest.push(entry)
  return { src: localPath, alt: input.image.alt, width: size.width, height: size.height, sourceUrl: input.image.sourceUrl }
}

function localFile(root: string, localPath: string) {
  return resolve(root, "public", localPath.replace(/^\//, ""))
}

function uniqueFilename(sourceUrl: string, slug: string, manifest: ManifestEntry[], root: string) {
  const base = filenameFromUrl(sourceUrl)
  const candidates = [base, `${slug}-${base}`, `${slug}-${manifest.length}-${base}`]
  for (const candidate of candidates) {
    const localPath = `/images/blog/${candidate}`
    const owner = manifest.find((entry) => entry.localPath === localPath)
    if (owner?.sourceUrl === sourceUrl) return candidate
    if (owner) continue
    if (existsSync(localFile(root, `/images/blog/${candidate}`))) continue
    return candidate
  }
  return `${slug}-${manifest.length}-${base}`
}

function filenameFromUrl(sourceUrl: string) {
  const pathname = new URL(sourceUrl).pathname
  const base = decodeURIComponent(pathname.split("/").pop() || "image")
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  return cleaned || "image"
}

async function readOptionalFile(path: string) {
  try {
    return await readFile(path)
  } catch (error) {
    if (isMissingFile(error)) return null
    throw error
  }
}

function isManifestEntry(value: unknown): value is ManifestEntry {
  if (typeof value !== "object" || value === null) return false
  const entry = value as Partial<ManifestEntry>
  return typeof entry.sourceUrl === "string" && typeof entry.localPath === "string" && typeof entry.width === "number" && typeof entry.height === "number" && typeof entry.bytes === "number"
}

function isMissingFile(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT"
}

interface ManifestEntry {
  sourceUrl: string
  localPath: string
  width: number
  height: number
  bytes: number
}

interface StoreImagesInput {
  root: string
  slug: string
  images: RemoteImage[]
  manifest: ManifestEntry[]
}

const userAgent = "EduVertBlogImport/1.0"
