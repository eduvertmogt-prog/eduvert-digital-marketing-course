import { createDb, resolveConnectionString } from "@/db/client"
import {
  ValidationError,
  createDemoEnquiry,
  demoIntents,
  isValidEmail,
  normalizeName,
  normalizePhone,
  preferredTimes,
  type DemoIntent,
  type PreferredTime,
} from "@/db/demo-enquiries"

/**
 * POST /api/demo — stores a demo/callback/course enquiry in Neon.
 * The dialog posts JSON; the response is { ok: true } or
 * { ok: false, error } with a human-readable message the dialog shows.
 *
 * Production note: this route reads DATABASE_URL from the server
 * environment. Locally that is .env; on Cloudflare it must be exposed
 * to the route as a Worker secret/var at deploy time.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return bad("Please check the form and try again.")
  }

  const input = parseBody(body)
  if (!input) return bad("Please check the form and try again.")

  try {
    const db = createDb(resolveConnectionString())
    await createDemoEnquiry(db, input)
    return Response.json({ ok: true })
  } catch (error) {
    if (error instanceof ValidationError) return bad(error.message)
    console.error("demo enquiry failed", error)
    return Response.json(
      { ok: false, error: "Something went wrong saving your request. Please try again." },
      { status: 500 },
    )
  }
}

function parseBody(body: unknown): DemoEnquiryInput | null {
  if (!body || typeof body !== "object") return null
  const b = body as Record<string, unknown>

  const fullName = typeof b.fullName === "string" ? normalizeName(b.fullName) : ""
  const email = typeof b.email === "string" ? b.email.trim() : ""
  const phone = typeof b.phone === "string" ? normalizePhone(b.phone) : null
  if (fullName.length < 2 || !isValidEmail(email) || !phone) return null

  const intent: DemoIntent = demoIntents.includes(b.intent as DemoIntent)
    ? (b.intent as DemoIntent)
    : "free_demo"
  const preferredTime: PreferredTime | null = preferredTimes.includes(b.preferredTime as PreferredTime)
    ? (b.preferredTime as PreferredTime)
    : null

  return {
    fullName,
    email: email.toLowerCase(),
    phone,
    preferredTime,
    intent,
    courseSlug: typeof b.courseSlug === "string" && b.courseSlug ? b.courseSlug.slice(0, 120) : undefined,
    courseLabel: typeof b.courseLabel === "string" && b.courseLabel ? b.courseLabel.slice(0, 200) : undefined,
    originPage: typeof b.originPage === "string" && b.originPage ? b.originPage.slice(0, 200) : undefined,
    originForm: "demo-dialog v1",
  }
}

interface DemoEnquiryInput {
  fullName: string
  email: string
  phone: string
  preferredTime: PreferredTime | null
  intent: DemoIntent
  courseSlug?: string
  courseLabel?: string
  originPage?: string
  originForm?: string
}

function bad(error: string) {
  return Response.json({ ok: false, error }, { status: 400 })
}
