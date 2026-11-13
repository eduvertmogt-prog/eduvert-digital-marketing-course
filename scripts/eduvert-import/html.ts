import { parse, HTMLElement, TextNode, type Node } from "node-html-parser"
import type { ArticleBlock, ArticleInline, ArticleListItem, ArticleTableCell } from "../../components/blog/article-types.ts"
import type { ParsedArticle, RemoteImage } from "./types.ts"

export interface LinkContext {
  migratedSlugs: Set<string>
}

export function parseArticleHtml(html: string, links: LinkContext, contentSource: ParsedArticle["contentSource"]): ParsedArticle {
  const state = createState(links)
  const container = prepareHtml(html, state)
  const blocks = parseChildren(container, state)
  const sourceText = normalizeText(container.text)
  const parsedText = normalizeText(blocksToText(blocks))
  const coverage = sourceText.length === 0 ? 0 : parsedText.length / sourceText.length
  return {
    blocks,
    coverage,
    parsedText,
    images: state.images,
    notes: state.notes,
    unmappedLinks: [...new Set(state.unmappedLinks)],
    contentSource,
  }
}

export function extractWebpageArticle(html: string) {
  const root = parse(html)
  const content = root.querySelector(".elementor-widget-theme-post-content")
    ?? root.querySelector(".entry-content")
    ?? root.querySelector("article")
  return content?.innerHTML ?? ""
}

export function plainText(html: string) {
  return normalizeText(parse(`<div>${cleanHtml(html)}</div>`).text)
}

export function clipText(value: string, max: number) {
  const text = normalizeText(value)
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  return (lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()
}

export function normalizeText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/[\u200b\u200c\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim()
}

export function normalizeImageUrl(src: string) {
  if (!src || src.startsWith("data:")) return ""
  let url: URL
  try {
    url = new URL(src, "https://www.eduvert.co")
  } catch {
    return ""
  }
  const host = url.hostname.replace(/^www\./, "")
  if (host.endsWith(".wp.com")) {
    const parts = url.pathname.split("/").filter((part) => part.length > 0)
    const origin = parts[0]?.replace(/^www\./, "") ?? ""
    if (origin === "eduvert.co") return `https://www.eduvert.co/${parts.slice(1).join("/")}`
  }
  if (host === "eduvert.co") {
    url.search = ""
    return url.toString()
  }
  return url.toString()
}

function prepareHtml(html: string, state: ParseState) {
  const root = parse(`<div id="eduvert-import-root">${cleanHtml(html)}</div>`)
  const container = root.querySelector("#eduvert-import-root")
  if (!container) throw new Error("Could not prepare article HTML")
  removeChrome(container, state)
  return container
}

function cleanHtml(html: string) {
  let next = html
  let previous = ""
  while (next !== previous) {
    previous = next
    next = next.replace(/<gwmw\b[^>]*>[\s\S]*?<\/gwmw>/gi, "")
  }
  return next
    .replace(/<\/?gwmw\b[^>]*>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
}

function removeChrome(container: HTMLElement, state: ParseState) {
  const selectors = ["script", "style", "noscript", "iframe", "form", "nav", "aside", "footer", "header", "gwmw"]
  for (const selector of selectors) {
    for (const node of container.querySelectorAll(selector)) detach(node)
  }
  for (const node of container.querySelectorAll("*")) {
    if (!isChrome(node)) continue
    state.notes.push("Removed WordPress chrome from the article body")
    detach(node)
  }
  state.notes = [...new Set(state.notes)]
}

function parseChildren(element: HTMLElement, state: ParseState) {
  const blocks: ArticleBlock[] = []
  let inlineNodes: Node[] = []
  const flush = () => {
    const parts = inlineNodes.flatMap((node) => inlinesFromNode(node, { strong: false, emphasis: false }, state))
    inlineNodes = []
    for (const group of splitByBreak(parts)) {
      const inlines = trimInlines(mergeInlines(group))
      if (inlines.length === 0) continue
      blocks.push({ type: "paragraph", inlines })
    }
  }
  for (const child of element.childNodes) {
    if (child instanceof HTMLElement && blockTags.has(child.tagName.toLowerCase())) {
      flush()
      blocks.push(...parseElement(child, state))
      continue
    }
    if (child instanceof TextNode && !child.text.trim()) continue
    if (child instanceof HTMLElement && isChrome(child)) continue
    inlineNodes.push(child)
  }
  flush()
  return blocks
}

function parseElement(element: HTMLElement, state: ParseState): ArticleBlock[] {
  const tag = element.tagName.toLowerCase()
  if (isChrome(element)) return []
  if (tag === "script" || tag === "style" || tag === "noscript" || tag === "form" || tag === "nav" || tag === "aside" || tag === "footer" || tag === "header" || tag === "gwmw") return []
  if (tag === "iframe") {
    addNote(state, "Removed an embedded frame")
    return []
  }
  if (tag === "p" || tag === "pre") return parseChildren(element, state)
  if (tag === "h1" || tag === "h2") return heading(element, 2, state, tag !== "h2")
  if (tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") return heading(element, 3, state, tag !== "h3")
  if (tag === "ul") return parseList(element, false, state)
  if (tag === "ol") return parseList(element, true, state)
  if (tag === "table") return parseTable(element, state)
  if (tag === "figure") return parseFigure(element, state)
  if (tag === "img") {
    collectImage(element, state)
    return []
  }
  if (tag === "blockquote") {
    addNote(state, "Converted a blockquote into paragraphs")
    return parseChildren(element, state)
  }
  if (tag === "hr" || tag === "br") return []
  return parseChildren(element, state)
}

function parseFigure(element: HTMLElement, state: ParseState) {
  const table = element.querySelector("table")
  if (table) return parseTable(table, state)
  const image = element.querySelector("img")
  if (image) collectImage(image, state)
  const caption = element.querySelector("figcaption")
  if (!caption) return []
  return parseChildren(caption, state)
}

function parseList(element: HTMLElement, ordered: boolean, state: ParseState) {
  const items: ArticleListItem[] = []
  const extras: ArticleBlock[] = []
  for (const child of element.childNodes) {
    if (!(child instanceof HTMLElement) || child.tagName.toLowerCase() !== "li") continue
    const inlineNodes: Node[] = []
    for (const itemChild of child.childNodes) {
      if (!(itemChild instanceof HTMLElement)) {
        inlineNodes.push(itemChild)
        continue
      }
      const tag = itemChild.tagName.toLowerCase()
      if (tag === "ul" || tag === "ol") {
        addNote(state, "Flattened a nested list")
        extras.push(...parseList(itemChild, tag === "ol", state))
        continue
      }
      if (tag === "p" || tag === "div" || tag === "span") {
        inlineNodes.push(...itemChild.childNodes)
        continue
      }
      inlineNodes.push(itemChild)
    }
    const inlines = trimInlines(mergeInlines(inlineNodes.flatMap((node) => inlinesFromNode(node, { strong: false, emphasis: false }, state)).filter((part) => part.type !== "break")))
    if (inlines.length === 0) continue
    if (inlines.length === 1 && inlines[0].type === "text") items.push(inlines[0].text)
    else items.push(inlines)
  }
  const blocks: ArticleBlock[] = []
  if (items.length > 0) blocks.push(ordered ? { type: "list", ordered: true, items } : { type: "list", items })
  blocks.push(...extras)
  return blocks
}

function parseTable(element: HTMLElement, state: ParseState) {
  const rows: ArticleTableCell[][] = []
  for (const row of element.querySelectorAll("tr")) {
    const cells: ArticleTableCell[] = []
    for (const cell of row.childNodes) {
      if (!(cell instanceof HTMLElement)) continue
      const tag = cell.tagName.toLowerCase()
      if (tag !== "td" && tag !== "th") continue
      const inlines = trimInlines(mergeInlines(inlinesFromNode(cell, { strong: false, emphasis: false }, state).filter((part) => part.type !== "break")))
      if (inlines.length === 1 && inlines[0].type === "text") cells.push(inlines[0].text)
      else cells.push(inlines.length > 0 ? inlines : "")
    }
    if (cells.length > 0) rows.push(cells)
  }
  if (rows.length === 0) return []
  return [{ type: "table", rows } satisfies ArticleBlock]
}

function heading(element: HTMLElement, level: 2 | 3, state: ParseState, remapped: boolean) {
  const text = normalizeText(element.text)
  if (!text) return []
  if (remapped) addNote(state, "Mapped a heading level outside h2–h3 onto a supported heading")
  return [{ type: "heading", level, id: uniqueHeadingId(text, state.ids), text } satisfies ArticleBlock]
}

function inlinesFromNode(node: Node, marks: Marks, state: ParseState): InlinePart[] {
  if (node instanceof TextNode) {
    const text = node.text.replace(/\u00a0/g, " ").replace(/[\u200b\u200c\u200d\ufeff]/g, "").replace(/\s+/g, " ")
    if (!text) return []
    return [marked(text, marks)]
  }
  if (!(node instanceof HTMLElement)) return []
  const tag = node.tagName.toLowerCase()
  if (tag === "br") return [{ type: "break" }]
  if (tag === "img") {
    collectImage(node, state)
    return []
  }
  if (tag === "a") return [linkInline(node, marks, state)]
  const next = {
    strong: marks.strong || tag === "strong" || tag === "b",
    emphasis: marks.emphasis || tag === "em" || tag === "i",
  }
  return node.childNodes.flatMap((child) => inlinesFromNode(child, next, state))
}

function linkInline(node: HTMLElement, marks: Marks, state: ParseState): InlinePart {
  const text = normalizeText(node.text)
  if (!text) return { type: "text", text: "" }
  const href = resolveHref(node.getAttribute("href") ?? "", state)
  if (!href) return marked(text, marks)
  return { type: "link", href, text, strong: marks.strong || Boolean(node.querySelector("strong, b")) }
}

function resolveHref(href: string, state: ParseState) {
  const trimmed = href.trim()
  if (!trimmed || trimmed.startsWith("#")) return trimmed
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) return trimmed
  let url: URL
  try {
    url = new URL(trimmed, "https://www.eduvert.co")
  } catch {
    return ""
  }
  const host = url.hostname.replace(/^www\./, "")
  if (host !== "eduvert.co") return url.toString()
  const slug = decodePath(url.pathname)
  const remapped = remapPath(slug, state)
  if (remapped) return remapped
  const absolute = `https://www.eduvert.co${url.pathname}`
  state.unmappedLinks.push(absolute)
  return absolute
}

function remapPath(slug: string, state: ParseState) {
  if (Object.hasOwn(sitePages, slug)) return sitePages[slug] ?? null
  if (slug.startsWith("blog/")) {
    const articleSlug = slug.slice("blog/".length)
    if (state.migratedSlugs.has(articleSlug)) return `/blog/${articleSlug}`
  }
  if (state.migratedSlugs.has(slug)) return `/blog/${slug}`
  return null
}

function decodePath(pathname: string) {
  try {
    return decodeURIComponent(pathname).replace(/\/+$/, "").replace(/^\//, "")
  } catch {
    return pathname.replace(/\/+$/, "").replace(/^\//, "")
  }
}

function collectImage(element: HTMLElement, state: ParseState) {
  const sourceUrl = normalizeImageUrl(element.getAttribute("src") ?? element.getAttribute("data-src") ?? "")
  if (!sourceUrl) return
  if (state.images.some((image) => image.sourceUrl === sourceUrl)) return
  state.images.push({ sourceUrl, alt: normalizeText(element.getAttribute("alt") ?? ""), role: "inline" })
}

function marked(text: string, marks: Marks): ArticleInline {
  if (marks.strong) return { type: "strong", text }
  if (marks.emphasis) return { type: "emphasis", text }
  return { type: "text", text }
}

function mergeInlines(parts: InlinePart[]) {
  const merged: ArticleInline[] = []
  for (const part of parts) {
    if (part.type === "break") {
      merged.push({ type: "text", text: "\n" })
      continue
    }
    if (!part.text) continue
    const previous = merged.at(-1)
    if (previous && previous.type === part.type && previous.type !== "link" && part.type !== "link") {
      previous.text += part.text
      continue
    }
    if (previous && previous.type === "link" && part.type === "link" && previous.href === part.href && previous.strong === part.strong) {
      previous.text += part.text
      continue
    }
    merged.push({ ...part })
  }
  return merged
}

function splitByBreak(parts: InlinePart[]) {
  const groups: ArticleInline[][] = []
  let current: ArticleInline[] = []
  for (const part of parts) {
    if (part.type === "break") {
      groups.push(current)
      current = []
      continue
    }
    current.push(part)
  }
  groups.push(current)
  return groups
}

function trimInlines(inlines: ArticleInline[]) {
  const next = inlines.map((inline) => ({ ...inline }))
  const first = next[0]
  const last = next.at(-1)
  if (first) first.text = first.text.trimStart()
  if (last) last.text = last.text.trimEnd()
  return next.filter((inline) => inline.text.trim().length > 0)
}

function blocksToText(blocks: ArticleBlock[]) {
  return blocks.map((block) => blockText(block)).join(" ")
}

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "paragraph":
      return inlineText(block.inlines)
    case "heading":
      return block.text
    case "list":
      return block.items.map((item) => typeof item === "string" ? item : inlineText(item)).join(" ")
    case "table":
      return block.rows.flatMap((row) => row.map((cell) => typeof cell === "string" ? cell : inlineText(cell))).join(" ")
    default: {
      const unhandled: never = block
      return unhandled
    }
  }
}

function inlineText(inlines: ArticleInline[]) {
  return inlines.map((part) => part.text).join("")
}

function uniqueHeadingId(text: string, used: Set<string>) {
  const base = text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "section"
  let id = base
  let suffix = 2
  while (used.has(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  used.add(id)
  return id
}

function isChrome(element: HTMLElement) {
  const label = `${element.getAttribute("class") ?? ""} ${element.getAttribute("id") ?? ""}`
  return chromePattern.test(label)
}

function detach(node: HTMLElement) {
  node.parentNode?.removeChild(node)
}

function addNote(state: ParseState, note: string) {
  if (!state.notes.includes(note)) state.notes.push(note)
}

function createState(links: LinkContext): ParseState {
  return { images: [], notes: [], unmappedLinks: [], ids: new Set(), migratedSlugs: links.migratedSlugs }
}

interface Marks {
  strong: boolean
  emphasis: boolean
}

type InlinePart = ArticleInline | { type: "break" }

interface ParseState {
  images: RemoteImage[]
  notes: string[]
  unmappedLinks: string[]
  ids: Set<string>
  migratedSlugs: Set<string>
}

const blockTags = new Set([
  "p", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "table", "figure", "blockquote",
  "div", "section", "article", "main", "center", "img", "hr", "form", "iframe", "script", "style",
  "nav", "aside", "header", "footer", "gwmw",
])

const chromePattern = /(?:^|\s)(?:sharedaddy|jp-relatedposts|related-posts|related_posts|comments-area|comment-respond|sidebar|author-box|wp-block-latest-posts|nav-links)(?:\s|$)|jp-related|sharedaddy/i

const sitePages: Record<string, string> = {
  "": "/",
  home: "/",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
  "contact-page-for-landing-page": "/contact",
  placements: "/placements",
  batches: "/batches",
  testimonials: "/testimonials",
  "privacy-policy": "/privacy-policy",
  "terms-and-conditions": "/terms-and-conditions",
  "cancellation-policy": "/cancellation-policy",
  "return-refund-policy": "/return-refund-policy",
  programs: "/programs",
  "digital-marketing": "/programs/professional-digital-marketing",
  "professional-digital-marketing": "/programs/professional-digital-marketing",
  "eduvert-digital-marketing-course": "/programs/professional-digital-marketing",
  "eduvert-digital-marketing-course-facebook": "/programs/professional-digital-marketing",
  "digital-marketing-landing-page": "/programs/professional-digital-marketing",
  "digital-marketing-new-landing-page-for-eduvert": "/programs/professional-digital-marketing",
  "seo-course-in-navi-mumbai": "/seo-course-in-navi-mumbai",
  "sem-course": "/sem-course",
  "smm-course": "/smm-course",
  "data-analytics-python": "/data-analytics-python",
}
