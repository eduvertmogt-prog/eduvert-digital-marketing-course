import type { Metadata } from "next"
import { headers } from "next/headers"
import { getAdminSession } from "./access"
import { AdmissionsDashboard } from "@/components/admin/admissions-dashboard"
import { AdminSignIn } from "@/components/admin/admin-credentials"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admissions · EduVert",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const session = await getAdminSession(await headers())
  if (!session || session.needsPasswordChange) return <AdminSignIn mustChange={Boolean(session)} />
  return <AdmissionsDashboard identity={session.username} owner={session.owner} />
}
