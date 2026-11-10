import type { Metadata } from "next"
import { AboutPage } from "@/components/about/about-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "About · EduVert",
  description: "EduVert is a digital marketing training institute in Navi Mumbai. Courses combine hands-on assignments with digital marketing and data analytics skills.",
}

export default function AboutRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutPage />
      </main>
      <SiteFooter />
    </>
  )
}
