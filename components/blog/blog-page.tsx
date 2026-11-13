import { ArticleExplorer } from "@/components/blog/article-explorer"
import { portfolioArticle } from "@/components/blog/articles"
import { formatArticleDate } from "@/components/blog/format-article-date"
import { journalArticles } from "@/components/blog/journal"
import { coursesHref } from "@/components/site-nav"

export function BlogPage() {
  const featured = portfolioArticle

  return (
    <>
      <section aria-labelledby="journal-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
          <div className="flex max-w-[760px] flex-col gap-3.5">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">THE EDUVERT JOURNAL</p>
            <h1 id="journal-heading" className="eduvert-h1 text-eduvert-text-primary">
              Ideas, Insights & Practical Guides
            </h1>
            <p className="eduvert-body-large text-eduvert-text-secondary">
              Explore articles on digital marketing, SEO, performance marketing, AI tools, and building practical skills.
            </p>
          </div>
          <article className="grid overflow-hidden rounded-eduvert-16 bg-eduvert-tint-soft-blue min-[1100px]:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="order-2 flex flex-col gap-4 px-6 py-7 min-[1100px]:order-1 min-[1100px]:px-10 min-[1100px]:py-10">
              <p className="eduvert-body font-eduvert-700 text-eduvert-action-primary">Featured article</p>
              <p className="eduvert-body text-eduvert-text-secondary">
                <span className="font-eduvert-700 text-eduvert-action-primary">{featured.category}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={featured.publishedOn}>{formatArticleDate(featured.publishedOn)}</time>
              </p>
              <h2 className="max-w-[640px] eduvert-h2 tracking-[-0.02em] text-eduvert-text-primary">
                {featured.title}
              </h2>
              <p className="max-w-[560px] eduvert-body text-eduvert-text-secondary">{featured.summary}</p>
              <a href={`/blog/${featured.slug}`} className="mt-2 flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
                Read Article
              </a>
            </div>
            {featured.hero ? (
              <img
                src={featured.hero.src}
                alt={featured.hero.alt}
                width={featured.hero.width}
                height={featured.hero.height}
                className="order-1 h-[220px] w-full object-cover min-[1100px]:order-2 min-[1100px]:h-full"
              />
            ) : null}
          </article>
        </div>
      </section>
      <ArticleExplorer articles={journalArticles} />
      <section aria-labelledby="journal-cta-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
          <div className="flex flex-col gap-6 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
            <div className="flex max-w-[720px] flex-col gap-3">
              <h2 id="journal-cta-heading" className="eduvert-h2 tracking-[-0.02em] text-eduvert-text-primary">
                Ready to Put What You've Learned Into Practice?
              </h2>
              <p className="eduvert-body-large text-eduvert-text-secondary">Explore EduVert's practical Digital Marketing and Data Analytics courses.</p>
            </div>
            <a href={coursesHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
              Explore Our Courses
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
