import { createDb, resolveConnectionString } from "@/db/client"
import { listLiveClasses } from "@/db/live-classes"

export const dynamic = "force-dynamic"

export async function GET() {
  const headers = { "Cache-Control": "no-store" }
  try {
    return Response.json({ sessions: await listLiveClasses(createDb(resolveConnectionString())) }, { headers })
  } catch {
    return Response.json({ error: "Unable to load upcoming sessions." }, { status: 503, headers })
  }
}
