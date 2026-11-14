import { batchConflict } from "@/db/admin-batches"
import { getAdmissionsReport } from "@/db/admin-reporting"
import { reportPeriods, type ReportPeriod, type ReportScope } from "@/components/admin/reporting-model"
import { getAdminIdentity } from "@/app/admin/access"
import { createDb, resolveConnectionString } from "@/db/client"
import { getEnquiry, listEnquiries, updateEnquiry } from "@/db/admin-enquiries"
import { channels, statuses, viewLabels, type Channel, type EnquiryUpdate, type Status, type View } from "@/components/admin/admissions-model"

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i

function respond(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  })
}

export async function GET(request: Request) {
  const user = await getAdminIdentity(request.headers)
  if (!user) return respond({ error: "Staff sign-in required." }, 401)

  const params = new URL(request.url).searchParams
  const id = params.get("id")
  if (id !== null && !uuid.test(id)) return respond({ error: "Invalid enquiry." }, 400)
  const requested = params.get("view") ?? "active"
  const view: View = Object.hasOwn(viewLabels, requested) ? requested as View : "active"
  const page = Math.min(10_000, Math.max(0, Math.floor(Number(params.get("page")) || 0)))
  const rawPeriod = params.get("period") ?? "30"
  if (!Object.hasOwn(reportPeriods, rawPeriod)) return respond({ error: "Invalid reporting period." }, 400)
  const period = rawPeriod as ReportPeriod
  const dimension = params.get("dimension")
  const key = params.get("key")
  let scope: ReportScope | undefined
  if (dimension !== null || key !== null) {
    if ((dimension !== "course" && dimension !== "source") || key === null || key.length > 200) {
      return respond({ error: "Invalid report filter." }, 400)
    }
    scope = { period, dimension, key }
  }
  try {
    const db = createDb(resolveConnectionString())
    if (params.get("report") === "1") return respond(await getAdmissionsReport(db, period))
    if (!id) return respond(await listEnquiries(db, user, view, params.get("q")?.trim().slice(0, 120) ?? "", page, scope))
    const detail = await getEnquiry(db, id)
    return detail ? respond(detail) : respond({ error: "Enquiry not found." }, 404)
  } catch {
    return respond({ error: "Unable to load enquiries. Try again." }, 500)
  }
}

export async function PATCH(request: Request) {
  const user = await getAdminIdentity(request.headers)
  if (!user) return respond({ error: "Staff sign-in required." }, 401)
  const url = new URL(request.url)
  if (request.headers.get("origin") !== url.origin) {
    return respond({ error: "Open the dashboard directly to save changes." }, 403)
  }
  const id = url.searchParams.get("id")
  if (!id || !uuid.test(id)) return respond({ error: "Invalid enquiry." }, 400)
  const raw: unknown = await request.json().catch(() => null)
  const update = parseUpdate(raw)
  if (!update) return respond({ error: "Check the status, owner, note, and follow-up date." }, 400)

  try {
    const db = createDb(resolveConnectionString())
    if (!await updateEnquiry(db, id, user, update)) {
      return respond({ error: "This enquiry changed. Reopen it to load the latest details." }, 409)
    }
    return respond(await getEnquiry(db, id))
  } catch (error) {
    const conflict = batchConflict(error)
    if (conflict) return respond({ error: conflict }, 409)
    return respond({ error: "Unable to confirm the save. Reopen the enquiry to check the latest details." }, 500)
  }
}

function parseUpdate(raw: unknown): EnquiryUpdate | null {
  if (!raw || typeof raw !== "object") return null
  const value = raw as Record<string, unknown>
  const { status, channel, assignedTo, note, updatedAt, nextActionAt } = value
  if (!statuses.includes(status as Status) || !channels.includes(channel as Channel)) return null
  if (typeof assignedTo !== "string" || assignedTo.trim().length > 120 || typeof note !== "string" || note.trim().length > 2000) return null
  if (!isTimestamp(updatedAt) || (nextActionAt !== null && !isTimestamp(nextActionAt))) return null
  return { status: status as Status, channel: channel as Channel, assignedTo: assignedTo.trim(), note: note.trim(), updatedAt, nextActionAt }
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value
}
