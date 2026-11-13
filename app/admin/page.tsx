import type { Metadata } from "next"
import { headers } from "next/headers"
import { getAdminIdentity } from "./access"
import { AdmissionsDashboard } from "@/components/admin/admissions-dashboard"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admissions · EduVert",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const identity = await getAdminIdentity(await headers())
  if (!identity) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="eduvert-h2">Staff sign-in required</h1>
        <p className="mt-4 eduvert-body text-eduvert-text-secondary">
          Open the EduVert admin URL protected by Cloudflare Access and sign in with your staff account.
        </p>
      </main>
    )
  }
  return <AdmissionsDashboard identity={identity} />
}
