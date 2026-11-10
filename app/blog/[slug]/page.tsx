import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticlePage, articlePageDescription } from "@/components/blog/article-page"
import { getArticle, getArticleSlugs, getRelatedArticles } from "@/components/blog/articles"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogArticleRouteProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: "Article · EduVert" }
  return {
    title: `${article.title} · EduVert`,
    description: articlePageDescription(article),
  }
}

export default async function BlogArticleRoute({ params }: BlogArticleRouteProps) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <>
      <SiteHeader />
      <main>
        <ArticlePage article={article} related={getRelatedArticles(article.relatedSlugs)} />
      </main>
      <SiteFooter />
    </>
  )
}

interface BlogArticleRouteProps {
  params: Promise<{ slug: string }>
}
