import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TestimonialsPage } from "@/components/testimonials/testimonials-page"

export const metadata: Metadata = {
  title: "Testimonials · EduVert",
  description: "Selected excerpts from student reviews displayed on EduVert’s existing website.",
}

export default function TestimonialsRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <TestimonialsPage />
      </main>
      <SiteFooter />
    </>
  )
}
