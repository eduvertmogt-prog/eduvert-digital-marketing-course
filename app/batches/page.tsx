import type { Metadata } from "next"
import { BatchesPage } from "@/components/batches/batches-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Batches · EduVert",
  description: "Published weekday and weekend timings for the EduVert Professional Digital Marketing Program. Confirm current availability with the team.",
}

export default function BatchesRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <BatchesPage />
      </main>
      <SiteFooter />
    </>
  )
}
