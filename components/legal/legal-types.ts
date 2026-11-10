export interface LegalText {
  type: "text"
  text: string
}

export interface LegalStrong {
  type: "strong"
  text: string
}

export interface LegalEmphasis {
  type: "emphasis"
  text: string
}

export interface LegalLink {
  type: "link"
  href: string
  text: string
  strong: boolean
}

export interface LegalParagraph {
  type: "paragraph"
  inlines: LegalInline[]
  highlight?: boolean
}

export interface LegalHeading {
  type: "heading"
  level: 2 | 3
  id: string
  text: string
}

export interface LegalList {
  type: "list"
  ordered?: boolean
  items: LegalListItem[]
}

export interface LegalDocument {
  slug: string
  title: string
  summary: string
  blocks: LegalBlock[]
}

export type LegalInline = LegalText | LegalStrong | LegalEmphasis | LegalLink

export type LegalListItem = string | LegalInline[]

export type LegalBlock = LegalParagraph | LegalHeading | LegalList
