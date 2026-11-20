import { getAdminIdentity } from "@/app/admin/access"
import { toIstInput } from "@/components/admin/admissions-model"
import { isLiveClassId, liveClassModes, type LiveClassMode } from "@/components/live-class-model"
import { createDb, resolveConnectionString } from "@/db/client"
import { cancelLiveClass, listLiveClasses, publishLiveClass } from "@/db/live-classes"

export const dynamic = "force-dynamic"

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
}

export async function GET(request: Request) {
  try {
    if (!await getAdminIdentity(request.headers)) return json({ error: "Staff sign-in required." }, 401)
    return json({ sessions: await listLiveClasses(createDb(resolveConnectionString())) })
  } catch {
    return json({ error: "Unable to load live classes. Try again." }, 500)
  }
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Open the dashboard directly to save changes." }, 403)
  }
  try {
    if (!await getAdminIdentity(request.headers)) return json({ error: "Staff sign-in required." }, 401)
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") return json({ error: "Check the session details." }, 400)
    const { action, id, startsAt, mode } = body as Record<string, unknown>
    const db = createDb(resolveConnectionString())
    if (action === "cancel" && isLiveClassId(id)) {
      if (!await cancelLiveClass(db, id)) return json({ error: "This session is already removed or has started. Reload the list." }, 409)
      return json({ ok: true })
    }
    if (action === "publish" && typeof startsAt === "string" && /^[1-9]\d{3}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(startsAt) &&
      liveClassModes.includes(mode as LiveClassMode)) {
      const date = new Date(`${startsAt}:00+05:30`)
      if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now() || toIstInput(date.toISOString()) !== startsAt) {
        return json({ error: "Choose a valid future start time in India Standard Time." }, 400)
      }
      if (!await publishLiveClass(db, date, mode as LiveClassMode)) return json({ error: "A session with this time and format is already listed." }, 409)
      return json({ ok: true }, 201)
    }
    return json({ error: "Choose a session time and format." }, 400)
  } catch {
    return json({ error: "Unable to confirm the change. Reload the session list before trying again." }, 500)
  }
}
