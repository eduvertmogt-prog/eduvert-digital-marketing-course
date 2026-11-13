import type { ArticleBlock, ArticleImage, ArticleMark, ArticleRecord } from "../../components/blog/article-types.ts"

export interface ExistingArticle {
  slug: string
  title: string
  category: string
}

export interface WordpressCategory {
  id: number
  name: string
  slug: string
}

export interface WordpressPost {
  id: number
  date: string
  slug: string
  link: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  categories: number[]
  featured_media: number
  jetpack_featured_media_url?: string
  yoast_head_json?: {
    og_image?: { url?: string }[]
  }
}

export interface RemoteImage {
  sourceUrl: string
  alt: string
  role: "featured" | "inline"
}

export interface ParsedArticle {
  blocks: ArticleBlock[]
  coverage: number
  parsedText: string
  images: RemoteImage[]
  notes: string[]
  unmappedLinks: string[]
  contentSource: "api" | "webpage"
}

export type MigrationStatus = "alreadyExisting" | "excludedStudyAbroad" | "duplicate" | "needsReview" | "failed" | "eligible" | "readyToImport" | "imported"

export interface MigrationRow {
  wordpressId: number
  slug: string
  title: string
  publishedOn: string
  status: MigrationStatus
  category: string
  wordpressCategories: string
  sourceUrl: string
  coverage: number | null
  contentSource: "api" | "webpage" | ""
  editorialFlags: string[]
  reasons: string[]
}

export interface ImportableArticle {
  post: WordpressPost
  slug: string
  title: string
  publishedOn: string
  category: string
  summary: string
  mark: ArticleMark
  parsed: ParsedArticle
  editorialFlags: string[]
  record: ArticleRecord
  featured: ArticleImage | null
}

export interface MigrationReport {
  dryRun: boolean
  apply: boolean
  limit: number | null
  all: boolean
  totals: {
    totalFetched: number
    alreadyExisting: number
    eligible: number
    excludedStudyAbroad: number
    duplicates: number
    needsReview: number
    imported: number
    failed: number
    readyToImport: number
  }
  note: string
  parserChecks: { slug: string, coverage: number, contentSource: "api" | "webpage" }[]
  rows: MigrationRow[]
}
