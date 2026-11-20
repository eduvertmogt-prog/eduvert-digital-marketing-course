import { getAdminIdentity } from "@/app/admin/access"
import { intakeHasClosed, type IntakeSettings } from "@/components/intake-model"
import { createDb, resolveConnectionString } from "@/db/client"
import { readIntake, saveIntake } from "@/db/intake"

export const dynamic = "force-dynamic"

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
}

export async function GET(request: Request) {
  try {
    if (!await getAdminIdentity(request.headers)) return json({ error: "Staff sign-in required." }, 401)
    return json(await readIntake(createDb(resolveConnectionString())))
  } catch {
    return json({ error: "Unable to load the intake announcement. Try again." }, 500)
  }
}

export async function PATCH(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Open the dashboard directly to save changes." }, 403)
  }

  try {
    if (!await getAdminIdentity(request.headers)) return json({ error: "Staff sign-in required." }, 401)
    const settings = parseSettings(await request.json().catch(() => null))
    if (!settings) return json({ error: "Enter a valid deadline and a whole seat count from 0 to 1,000." }, 400)
    if (settings.enabled && intakeHasClosed(settings.closesOn)) {
      return json({ error: "Choose a deadline of today or later to show the announcement." }, 400)
    }

    const updated = await saveIntake(createDb(resolveConnectionString()), settings)
    return updated ? json(updated) : json({ error: "Another staff member saved a change. Reload the announcement before saving again." }, 409)
  } catch {
    return json({ error: "Unable to confirm the change. Reload the announcement before saving again." }, 500)
  }
}

function parseSettings(value: unknown): IntakeSettings | null {
  if (!value || typeof value !== "object") return null
  const { enabled, closesOn, seatsRemaining, revision } = value as Record<string, unknown>
  if (typeof enabled !== "boolean" ||
    typeof closesOn !== "string" || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(closesOn) ||
    typeof seatsRemaining !== "number" || !Number.isInteger(seatsRemaining) || seatsRemaining < 0 || seatsRemaining > 1000 ||
    typeof revision !== "number" || !Number.isInteger(revision) || revision < 0 || revision >= 2_147_483_647) return null

  const deadline = new Date(closesOn + "T00:00:00Z")
  if (!Number.isFinite(deadline.getTime()) || deadline.toISOString().slice(0, 10) !== closesOn) return null
  return { enabled, closesOn, seatsRemaining, revision }
}
