import type { Metadata } from "next"
import { refundPolicy } from "@/components/legal/legal-documents"
import { LegalPage } from "@/components/legal/legal-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Return and Refund Policy · EduVert",
  description: refundPolicy.summary,
}

export default function ReturnRefundPolicyRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <LegalPage document={refundPolicy} />
      </main>
      <SiteFooter />
    </>
  )
}
