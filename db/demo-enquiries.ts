import { eq, sql } from "drizzle-orm"
import type { Db } from "@/db/client"
import { enquiries } from "@/db/schema/enquiries"
import { enquiryCourseInterests } from "@/db/schema/enquiry-course-interests"
import type { EnquiryType } from "@/db/schema/enums"
import { persons } from "@/db/schema/persons"

/**
 * The write path behind POST /api/demo — kept as a plain function (not
 * inside the route) so it can be exercised against live Neon from a
 * throwaway probe without booting the server. See docs/DATABASE.md.
 *
 * Person matching (so one human is never two rows):
 * 1. case-insensitive email match, 2. exact phone match, 3. create.
 * A repeat enquirer gets a NEW enquiry each time but keeps ONE person.
 */

export const demoIntents = ["free_demo", "counsellor_callback", "course_enquiry"] as const

export type DemoIntent = (typeof demoIntents)[number]

export const preferredTimes = ["morning", "afternoon", "evening"] as const

export type PreferredTime = (typeof preferredTimes)[number]

export interface DemoEnquiryInput {
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

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim())
}

/**
 * Plain words: tidy any Indian phone entry into 10 digits, or reject it.
 * Tech words: strips non-digits, drops a leading 91/0 trunk prefix,
 * accepts exactly 10 remaining digits.
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "")
  // Only strip a country/trunk prefix when the length proves one is there:
  // 91 + 10 digits, or 0 + 10 digits. A bare 10-digit number starting
  // with 9 (e.g. 9123456780) must be left alone.
  let local = digits
  if (/^91\d{10}$/.test(digits)) local = digits.slice(2)
  else if (/^0\d{10}$/.test(digits)) local = digits.slice(1)
  return /^\d{10}$/.test(local) ? local : null
}

export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ")
}

export async function createDemoEnquiry(
  db: Db,
  input: DemoEnquiryInput,
): Promise<{ enquiryId: string; personId: string }> {
  const fullName = normalizeName(input.fullName)
  const email = input.email.trim().toLowerCase()
  const phone = normalizePhone(input.phone)
  if (fullName.length < 2) throw new ValidationError("Please share your name.")
  if (!isValidEmail(email)) throw new ValidationError("That email doesn't look right.")
  if (!phone) throw new ValidationError("Please share a 10-digit mobile number.")

  const intent: EnquiryType = input.intent
  const preferredTime = input.preferredTime ?? null
  const courseSlug = input.courseSlug?.trim() || undefined
  const courseLabel = input.courseLabel?.trim() || undefined

  const byEmail = await db.query.persons.findFirst({
    where: eq(sql`lower(${persons.email})`, email),
  })
  const person =
    byEmail ??
    (await db.query.persons.findFirst({ where: eq(persons.phone, phone) }))

  let personId: string
  if (person) {
    personId = person.id
    await db
      .update(persons)
      .set({
        fullName,
        email,
        phone,
        marketingConsent: true,
        consentAt: new Date(),
        consentSource: input.originForm ?? "demo-dialog",
        updatedAt: new Date(),
      })
      .where(eq(persons.id, personId))
  } else {
    const [created] = await db
      .insert(persons)
      .values({
        fullName,
        email,
        phone,
        marketingConsent: true,
        consentAt: new Date(),
        consentSource: input.originForm ?? "demo-dialog",
      })
      .returning({ id: persons.id })
    personId = created.id
  }

  const [enquiry] = await db
    .insert(enquiries)
    .values({
      personId,
      type: intent,
      preferredTime,
      originPage: input.originPage?.slice(0, 200) ?? null,
      originForm: input.originForm ?? "demo-dialog v1",
    })
    .returning({ id: enquiries.id })

  if (courseSlug) {
    await db.insert(enquiryCourseInterests).values({
      enquiryId: enquiry.id,
      courseSlug,
      courseLabel: courseLabel ?? courseSlug,
    })
  }

  return { enquiryId: enquiry.id, personId }
}

export class ValidationError extends Error {}
