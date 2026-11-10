import type { Metadata } from "next"
import { termsPage } from "@/components/legal/legal-documents"
import { LegalPage } from "@/components/legal/legal-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Terms and Conditions · EduVert",
  description: termsPage.summary,
}

export default function TermsRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <LegalPage document={termsPage} />
      </main>
      <SiteFooter />
    </>
  )
}
