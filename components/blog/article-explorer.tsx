"use client"

import { useState } from "react"
import { journalFilters, type JournalFilter } from "@/components/blog/journal"
import { RelatedArticleCard } from "@/components/blog/related-article-card"
import type { RelatedArticle } from "@/components/blog/article-types"

export function ArticleExplorer({ articles }: ArticleExplorerProps) {
  const [filter, setFilter] = useState<JournalFilter>("All Articles")
  const visibleArticles = filter === "All Articles" ? articles : articles.filter((article) => article.category === filter)

  return (
    <section aria-labelledby="explore-articles-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="explore-articles-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
          Explore Articles
        </h2>
        <div role="group" aria-label="Article categories" className="flex flex-wrap gap-2">
          {journalFilters.map((item) => {
            const isSelected = item === filter
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setFilter(item)}
                className={`flex h-10 items-center rounded-full px-4 text-[15px] leading-[21px] font-eduvert-700 ${isSelected ? "bg-eduvert-action-primary text-eduvert-surface-white" : "border border-eduvert-border-subtle bg-eduvert-surface-white text-eduvert-text-primary hover:bg-eduvert-tint-magenta"}`}
              >
                {item}
              </button>
            )
          })}
        </div>
        <ul className="grid gap-4 min-[1100px]:grid-cols-3">
          {visibleArticles.map((article) => (
            <li key={article.slug} className="min-w-0">
              <RelatedArticleCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

interface ArticleExplorerProps {
  articles: RelatedArticle[]
}
