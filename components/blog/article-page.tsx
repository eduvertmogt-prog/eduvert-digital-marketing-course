import { ArticleContents } from "@/components/blog/article-contents"
import { articleDescription } from "@/components/blog/articles"
import { formatArticleDate } from "@/components/blog/format-article-date"
import { RelatedArticleCard } from "@/components/blog/related-article-card"
import type { ArticleBlock, ArticleHeading, ArticleInline, ArticleListItem, ArticleRecord, RelatedArticle } from "@/components/blog/article-types"
import { blogHref, coursesHref } from "@/components/site-nav"

export function ArticlePage({ article, related }: ArticlePageProps) {
  const image = article.hero ?? article.featuredImage
  const headings = article.blocks.flatMap((block) => block.type === "heading" && block.level === 2 ? [block] : [])

  return (
    <>
      <article className="bg-eduvert-canvas-warm">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
          <header className="flex max-w-[860px] flex-col gap-4">
            <a href={blogHref} className="w-fit eduvert-body font-eduvert-700 text-eduvert-link hover:text-eduvert-action-hover">
              ← Back to All Articles
            </a>
            <p className="eduvert-body text-eduvert-text-secondary">
              <span className="font-eduvert-700 text-eduvert-action-primary">{article.category}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={article.publishedOn}>{formatArticleDate(article.publishedOn)}</time>
            </p>
            <h1 className="eduvert-h1 text-eduvert-text-primary">
              {article.title}
            </h1>
          </header>
          <img
            src={image.src}
            alt={image.alt || article.title}
            width={image.width}
            height={image.height}
            className="h-auto w-full rounded-eduvert-16"
          />
          <div className="grid gap-10 min-[1100px]:grid-cols-[minmax(0,1fr)_280px] min-[1100px]:gap-16">
            <div className="order-2 flex min-w-0 flex-col gap-5 min-[1100px]:order-1">
              {article.blocks.map((block, index) => (
                <ArticleBlockView key={`${block.type}-${index}`} block={block} />
              ))}
            </div>
            <div className="order-1 min-[1100px]:order-2">
              <ArticleContents headings={headings} />
            </div>
          </div>
        </div>
      </article>
      <RelatedArticles related={related} />
      <PracticeCta />
    </>
  )
}

export function articlePageDescription(article: ArticleRecord) {
  return articleDescription(article.blocks)
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="eduvert-body-large text-eduvert-text-primary">{block.inlines.map((inline, index) => <InlineView key={`${inline.type}-${index}`} inline={inline} />)}</p>
    case "heading":
      return <ArticleHeadingView heading={block} />
    case "list":
      return <ArticleListView block={block} />
    case "table":
      return <ArticleTableView block={block} />
    default: {
      const unhandled: never = block
      return unhandled
    }
  }
}

function ArticleListView({ block }: { block: Extract<ArticleBlock, { type: "list" }> }) {
  const ListTag = block.ordered ? "ol" : "ul"
  const marker = block.ordered ? "list-decimal" : "list-disc"
  return (
    <ListTag className={`${marker} space-y-2 pl-6 eduvert-body-large text-eduvert-text-primary`}>
      {block.items.map((item) => (
        <li key={listItemKey(item)}>{typeof item === "string" ? item : item.map((inline, index) => <InlineView key={`${inline.type}-${index}`} inline={inline} />)}</li>
      ))}
    </ListTag>
  )
}

function ArticleTableView({ block }: { block: Extract<ArticleBlock, { type: "table" }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left eduvert-body text-eduvert-text-primary">
        <tbody>
          {block.rows.map((row) => (
            <tr key={tableRowKey(row)}>
              {row.map((cell, index) => (
                <td key={`${tableCellKey(cell)}-${index}`} className="border border-eduvert-border-subtle px-3 py-2 align-top">
                  {typeof cell === "string" ? cell : cell.map((inline, inlineIndex) => <InlineView key={`${inline.type}-${inlineIndex}`} inline={inline} />)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function tableRowKey(row: Extract<ArticleBlock, { type: "table" }>["rows"][number]) {
  return row.map((cell) => tableCellKey(cell)).join("|")
}

function tableCellKey(cell: string | ArticleInline[]) {
  if (typeof cell === "string") return cell
  return cell.map((part) => part.text).join("")
}

function listItemKey(item: ArticleListItem) {
  if (typeof item === "string") return item
  return item.map((part) => part.text).join("")
}

function ArticleHeadingView({ heading }: { heading: ArticleHeading }) {
  switch (heading.level) {
    case 2:
      return (
        <h2 id={heading.id} className="scroll-mt-28 pt-4 eduvert-h2 tracking-[-0.02em] text-eduvert-text-primary">
          {heading.text}
        </h2>
      )
    case 3:
      return (
        <h3 id={heading.id} className="scroll-mt-28 pt-2 eduvert-h3 text-eduvert-text-primary">
          {heading.text}
        </h3>
      )
    default: {
      const unhandled: never = heading.level
      return unhandled
    }
  }
}

function InlineView({ inline }: { inline: ArticleInline }) {
  switch (inline.type) {
    case "text":
      return inline.text
    case "strong":
      return <strong className="font-eduvert-700">{inline.text}</strong>
    case "emphasis":
      return <em>{inline.text}</em>
    case "link":
      return <ArticleLinkView inline={inline} />
    default: {
      const unhandled: never = inline
      return unhandled
    }
  }
}

function ArticleLinkView({ inline }: { inline: Extract<ArticleInline, { type: "link" }> }) {
  const href = safeArticleHref(inline.href)
  if (!href) return inline.text
  const isExternal = href.startsWith("http")
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="font-eduvert-700 text-eduvert-link underline decoration-eduvert-link/30 underline-offset-2 hover:text-eduvert-action-primary"
    >
      {inline.text}
    </a>
  )
}

function RelatedArticles({ related }: { related: RelatedArticle[] }) {
  if (related.length === 0) return null
  return (
    <section aria-labelledby="related-articles-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="related-articles-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
          Related Articles
        </h2>
        <ul className="grid gap-4 min-[1100px]:grid-cols-3">
          {related.map((item) => (
            <li key={item.slug} className="min-w-0">
              <RelatedArticleCard article={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function PracticeCta() {
  return (
    <section aria-labelledby="article-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 min-[1100px]:px-10 min-[1100px]:pb-20 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-6 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="article-cta-heading" className="eduvert-h2 tracking-[-0.02em] text-eduvert-text-primary">
              Ready to Build Your Skills?
            </h2>
            <p className="eduvert-body-large text-eduvert-text-secondary">Explore practical Digital Marketing courses at EduVert.</p>
          </div>
          <a href={coursesHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Explore Our Courses
          </a>
        </div>
      </div>
    </section>
  )
}

function safeArticleHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href
  if (href.startsWith("https://") || href.startsWith("http://")) return href
  return ""
}

interface ArticlePageProps {
  article: ArticleRecord
  related: RelatedArticle[]
}
