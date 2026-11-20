import { createDb, resolveConnectionString } from "@/db/client"
import { isLiveClassId } from "@/components/live-class-model"
import {
  LiveClassUnavailableError,
  ValidationError,
  createDemoEnquiry,
  demoIntents,
  isValidEmail,
  normalizeName,
  normalizePhone,
  preferredTimes,
  type DemoIntent,
  type DemoEnquiryInput,
  type PreferredTime,
} from "@/db/demo-enquiries"

/**
 * POST /api/demo stores booking, callback, course and admission requests in Neon.
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
    if (error instanceof LiveClassUnavailableError) return Response.json({ ok: false, error: error.message }, { status: 409 })
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
  const isContactBooking = intent === "free_demo" && b.source === "contact-live-class"
  const liveClassSessionId = b.liveClassSessionId
  if (liveClassSessionId !== undefined && (intent !== "free_demo" || !isLiveClassId(liveClassSessionId))) return null
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
    originPage: isContactBooking ? "/contact" : typeof b.originPage === "string" && b.originPage ? b.originPage.slice(0, 200) : undefined,
    originForm: isContactBooking ? "contact-live-class v1" : "demo-dialog v1",
    message: isContactBooking && typeof b.message === "string" ? b.message.trim().slice(0, 1000) || undefined : undefined,
    liveClassSessionId,
  }
}

function bad(error: string) {
  return Response.json({ ok: false, error }, { status: 400 })
}
