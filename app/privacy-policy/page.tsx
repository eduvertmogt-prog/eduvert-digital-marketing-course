import type { Metadata } from "next"
import { privacyPolicy } from "@/components/legal/legal-documents"
import { LegalPage } from "@/components/legal/legal-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Privacy Policy · EduVert",
  description: privacyPolicy.summary,
}

export default function PrivacyPolicyRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <LegalPage document={privacyPolicy} />
      </main>
      <SiteFooter />
    </>
  )
}
