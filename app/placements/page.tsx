import type { Metadata } from "next"
import { PlacementsPage } from "@/components/placements/placements-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Placements · EduVert",
  description: "Career preparation and referral support in the EduVert Professional Digital Marketing Program. Placement assistance does not guarantee employment.",
}

export default function PlacementsRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <PlacementsPage />
      </main>
      <SiteFooter />
    </>
  )
}
