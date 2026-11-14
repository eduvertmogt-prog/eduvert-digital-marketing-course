import { getAdminIdentity } from "@/app/admin/access"
import { batchConflict, batchCourses, listBatches, listBatchMembers, mutateBatch } from "@/db/admin-batches"
import { createDb, resolveConnectionString } from "@/db/client"
import type { BatchDraft, BatchMutation } from "@/components/admin/batch-model"

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
}

export async function GET(request: Request) {
  if (!await getAdminIdentity(request.headers)) return json({ error: "Staff sign-in required." }, 401)
  const params = new URL(request.url).searchParams
  const batchId = params.get("batchId")
  const enquiryId = params.get("enquiryId")
  if ((batchId !== null && !uuid.test(batchId)) || (enquiryId !== null && !uuid.test(enquiryId)) || (batchId && enquiryId)) {
    return json({ error: "Invalid roster filter." }, 400)
  }

  try {
    const db = createDb(resolveConnectionString())
    if (batchId) return json(await listBatchMembers(db, { batchId }))
    if (enquiryId) return json(await listBatchMembers(db, { enquiryId }))
    return json(await listBatches(db))
  } catch {
    return json({ error: "Unable to load batches. Try again." }, 500)
  }
}

export async function POST(request: Request) {
  const actor = await getAdminIdentity(request.headers)
  if (!actor) return json({ error: "Staff sign-in required." }, 401)
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Open the dashboard directly to save changes." }, 403)
  }
  const change = parseChange(await request.json().catch(() => null))
  if (!change) return json({ error: "Check the course, dates, and capacity, then try again." }, 400)
  try {
    await mutateBatch(createDb(resolveConnectionString()), change, actor)
    return json({ ok: true })
  } catch (error) {
    const conflict = batchConflict(error)
    return conflict
      ? json({ error: conflict }, 409)
      : json({ error: "Unable to confirm the change. Refresh the batch before trying again." }, 500)
  }
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function parseChange(raw: unknown): BatchMutation | null {
  const { action, batchId, enquiryId, revision, draft } = object(raw)
  if (action === "create" || action === "edit") {
    const fields = parseDraft(draft)
    if (!fields) return null
    if (action === "create") return { action, draft: fields }
    if (typeof batchId !== "string" || !uuid.test(batchId) ||
      typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 0 || revision > 2_147_483_647) return null
    return { action, batchId, revision, draft: fields }
  }
  if (action !== "seat" && action !== "waitlist" && action !== "promote" && action !== "remove") return null
  if (typeof batchId !== "string" || !uuid.test(batchId) || typeof enquiryId !== "string" || !uuid.test(enquiryId)) return null
  return { action, batchId, enquiryId }
}

function parseDraft(raw: unknown): BatchDraft | null {
  const { courseSlug, name, startsOn, endsOn, capacity, accepting } = object(raw)
  if (typeof courseSlug !== "string" || !batchCourses.some(course => course.slug === courseSlug) ||
    typeof name !== "string" || !name.trim() || name.trim().length > 100 ||
    !isDate(startsOn) || (endsOn !== null && (!isDate(endsOn) || endsOn < startsOn)) ||
    typeof capacity !== "number" || !Number.isInteger(capacity) || capacity < 1 || capacity > 1000 ||
    typeof accepting !== "boolean") return null
  return { courseSlug, name: name.trim(), startsOn, endsOn, capacity, accepting }
}

function isDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value + "T00:00:00Z")
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}
