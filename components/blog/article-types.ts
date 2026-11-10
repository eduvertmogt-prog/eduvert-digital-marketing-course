export interface ArticleText {
  type: "text"
  text: string
}

export interface ArticleStrong {
  type: "strong"
  text: string
}

export interface ArticleEmphasis {
  type: "emphasis"
  text: string
}

export interface ArticleLink {
  type: "link"
  href: string
  text: string
  strong: boolean
}

export interface ArticleParagraph {
  type: "paragraph"
  inlines: ArticleInline[]
}

export interface ArticleHeading {
  type: "heading"
  level: 2 | 3
  id: string
  text: string
}

export interface ArticleList {
  type: "list"
  ordered?: boolean
  items: ArticleListItem[]
}

export interface ArticleTable {
  type: "table"
  rows: ArticleTableCell[][]
}

export interface ArticleImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface RelatedArticle {
  slug: string
  title: string
  category: string
  publishedOn: string
  summary: string
  mark: ArticleMark
}

export interface ArticleRecord extends RelatedArticle {
  blocks: ArticleBlock[]
  hero: ArticleImage | null
  featuredImage: ArticleImage
  relatedSlugs: string[]
}

export type ArticleInline = ArticleText | ArticleStrong | ArticleEmphasis | ArticleLink

export type ArticleListItem = string | ArticleInline[]

export type ArticleTableCell = string | ArticleInline[]

export type ArticleBlock = ArticleParagraph | ArticleHeading | ArticleList | ArticleTable

export type ArticleMark = "letters" | "work" | "tasks" | "pair" | "search" | "quote" | "calendar" | "authority"
