import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdmissionsDashboard } from "@/components/admin/admissions-dashboard"
import { sampleUser } from "@/components/admin/sample-enquiries"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admissions Preview · EduVert",
  robots: { index: false, follow: false },
}

export default function AdminDemoPage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <AdmissionsDashboard identity={sampleUser} demo />
}
