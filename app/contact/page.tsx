import type { Metadata } from "next"
import { ContactPage } from "@/components/contact/contact-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Contact · EduVert",
  description: "Ask EduVert about courses, available batches, or booking a demo session in Seawoods, Navi Mumbai.",
}

export default function ContactRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <ContactPage />
      </main>
      <SiteFooter />
    </>
  )
}
