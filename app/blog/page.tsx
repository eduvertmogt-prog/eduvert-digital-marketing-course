import type { Metadata } from "next"
import { BlogPage } from "@/components/blog/blog-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Blog · EduVert",
  description: "Explore articles on digital marketing, SEO, performance marketing, AI tools, and building practical skills.",
}

export default function BlogRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <BlogPage />
      </main>
      <SiteFooter />
    </>
  )
}
