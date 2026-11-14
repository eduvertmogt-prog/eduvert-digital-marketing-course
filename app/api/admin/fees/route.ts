import { getAdminIdentity } from "@/app/admin/access"
import { maxFeePaise, type FeeChange } from "@/components/admin/fee-model"
import { getStudentFees, isFeeCourse, saveStudentFee } from "@/db/admin-fees"
import { createDb, resolveConnectionString } from "@/db/client"

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
}

async function handle(request: Request, write: boolean) {
  const staff = await getAdminIdentity(request.headers)
  if (!staff) return json({ error: "Staff sign-in required." }, 401)
  const url = new URL(request.url)
  if (write && request.headers.get("origin") !== url.origin) return json({ error: "Open the dashboard directly to save changes." }, 403)
  const id = url.searchParams.get("enquiryId")
  if (!id || !uuid.test(id)) return json({ error: "Invalid enquiry." }, 400)
  const change = write ? parseChange(await request.json().catch(() => null)) : null
  if (write && !change) return json({ error: "Check the payment details and try again." }, 400)
  try {
    const db = createDb(resolveConnectionString())
    if (change) await saveStudentFee(db, id, change, staff)
    const ledger = await getStudentFees(db, id)
    return ledger ? json(ledger) : json({ error: "Enquiry not found." }, 404)
  } catch (error) {
    const cause = error instanceof Error ? error.cause ?? error : error
    if (cause && typeof cause === "object" && "code" in cause && cause.code === "EF001" && "message" in cause) {
      return json({ error: cause.message }, 409)
    }
    return json({ error: write ? "Unable to confirm the change. Reload the ledger before making another entry." : "Unable to load fee details." }, 500)
  }
}

export function GET(request: Request) { return handle(request, false) }
export function POST(request: Request) { return handle(request, true) }

function isAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= maxFeePaise
}

function isDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value + "T00:00:00Z")
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function parseChange(raw: unknown): FeeChange | null {
  if (!raw || typeof raw !== "object") return null
  const { action, courseSlug, amountPaise, expectedFee, paymentId, kind, paidOn, reference, reason } = raw as Record<string, unknown>
  if (typeof courseSlug !== "string" || !isFeeCourse(courseSlug)) return null
  if (action === "fee" && isAmount(amountPaise) && (expectedFee === null || isAmount(expectedFee))) {
    return { action, courseSlug, amountPaise, expectedFee }
  }
  if (typeof paymentId !== "string" || !uuid.test(paymentId)) return null
  if (action === "void" && typeof reason === "string" && reason.trim() && reason.trim().length <= 240) {
    return { action, courseSlug, paymentId, reason: reason.trim() }
  }
  if (action === "record" && isAmount(amountPaise) && amountPaise > 0 && (kind === "deposit" || kind === "instalment")
    && isDate(paidOn) && (reference === null || (typeof reference === "string" && reference.trim().length <= 120))) {
    return { action, courseSlug, paymentId, amountPaise, kind, paidOn, reference: reference?.trim() || null }
  }
  return null
}
