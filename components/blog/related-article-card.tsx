import type { RelatedArticle } from "@/components/blog/article-types"
import { EditorialCover } from "@/components/blog/editorial-cover"
import { formatArticleDate } from "@/components/blog/format-article-date"

export function RelatedArticleCard({ article }: RelatedArticleCardProps) {
  return (
    <a href={`/blog/${article.slug}`} className="flex h-full flex-col overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white hover:border-eduvert-action-primary">
      {article.featuredImage === null ? <EditorialCover title={article.title} category={article.category} variant="card" /> : <ArticleMark mark={article.mark} />}
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <p className="eduvert-support text-eduvert-text-secondary">
          <span className="font-eduvert-700 text-eduvert-action-primary">{article.category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={article.publishedOn}>{formatArticleDate(article.publishedOn)}</time>
        </p>
        <h3 className="eduvert-h3 tracking-[-0.02em] text-eduvert-text-primary">{article.title}</h3>
        <p className="eduvert-body text-eduvert-text-secondary">{article.summary}</p>
        <p className="mt-auto pt-2 eduvert-button text-eduvert-link">Read Article →</p>
      </div>
    </a>
  )
}

function ArticleMark({ mark }: { mark: RelatedArticle["mark"] }) {
  switch (mark) {
    case "letters":
      return (
        <div className="flex h-[140px] items-end justify-center gap-3 bg-eduvert-tint-blue pb-5">
          <p className="text-[52px] leading-none font-eduvert-700 text-eduvert-action-primary">A</p>
          <p className="mb-3 text-[52px] leading-none font-eduvert-700 text-eduvert-action-primary">B</p>
        </div>
      )
    case "work":
      return (
        <div className="flex h-[140px] items-center justify-center bg-eduvert-tint-soft-blue">
          <p className="text-[40px] leading-none font-eduvert-700 text-eduvert-action-primary">Work</p>
        </div>
      )
    case "tasks":
      return (
        <div className="grid h-[140px] grid-cols-2 content-center gap-x-6 gap-y-2 bg-eduvert-tint-yellow px-8">
          {taskLabels.map((label) => (
            <p key={label} className="text-[13px] leading-5 font-eduvert-700 text-eduvert-action-primary">{label}</p>
          ))}
        </div>
      )
    case "pair":
      return (
        <div className="flex h-[140px] items-end justify-center gap-3 bg-eduvert-tint-soft-blue pb-5">
          <p className="text-[52px] leading-none font-eduvert-700 text-eduvert-action-primary">A</p>
          <p className="mb-3 text-[52px] leading-none font-eduvert-700 text-eduvert-action-primary">B</p>
        </div>
      )
    case "search":
      return (
        <div className="relative h-[140px] overflow-hidden bg-eduvert-tint-blue">
          <div className="absolute top-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-eduvert-brand-blue" />
          <div className="absolute top-12 left-8 h-8 w-[120px] rounded-eduvert-8 bg-eduvert-surface-white" />
          <div className="absolute top-11 left-[46%] h-6 w-6 rounded-eduvert-8 bg-eduvert-tint-yellow" />
        </div>
      )
    case "quote":
      return (
        <div className="relative flex h-[140px] items-center justify-center bg-eduvert-tint-soft-blue">
          <p className="text-[72px] leading-none font-eduvert-700 text-eduvert-action-primary">“</p>
          <p className="absolute right-8 bottom-6 text-[18px] leading-none font-eduvert-700 text-eduvert-action-primary">[ ]</p>
        </div>
      )
    case "calendar":
      return (
        <div className="flex h-[140px] items-center justify-center gap-4 bg-eduvert-tint-yellow">
          <div className="text-center text-eduvert-action-primary">
            <p className="text-[34px] leading-none font-eduvert-700">May</p>
            <p className="mt-1 text-[16px] leading-5 font-eduvert-700">2026</p>
          </div>
          <p className="text-[28px] leading-none font-eduvert-700 text-eduvert-action-primary">↗</p>
        </div>
      )
    case "authority":
      return (
        <div className="flex h-[140px] items-center justify-center gap-3 bg-eduvert-tint-soft-blue">
          <p className="text-[48px] leading-none font-eduvert-700 text-eduvert-action-primary">Aa</p>
          <p className="text-[30px] leading-none font-eduvert-700 text-eduvert-action-primary">✓</p>
        </div>
      )
    default: {
      const unhandled: never = mark
      return unhandled
    }
  }
}

const taskLabels = ["Research", "Write", "Analyse", "Report"]

interface RelatedArticleCardProps {
  article: RelatedArticle
}
