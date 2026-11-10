import type { Metadata } from "next"
import { cancellationPolicy } from "@/components/legal/legal-documents"
import { LegalPage } from "@/components/legal/legal-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Cancellation Policy · EduVert",
  description: cancellationPolicy.summary,
}

export default function CancellationPolicyRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <LegalPage document={cancellationPolicy} />
      </main>
      <SiteFooter />
    </>
  )
}
