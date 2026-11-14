import { desc, eq, sql } from "drizzle-orm"
import { courses } from "@/components/courses/course-data"
import { feeForSlug } from "@/components/program-fees"
import type { FeeChange, StudentFees } from "@/components/admin/fee-model"
import type { Db } from "@/db/client"
import { batchPlacements, enquiries, enquiryCourseInterests, studentFees, studentPayments } from "@/db/schema"

const knownCourses = courses.map(({ slug, title }) => ({ slug, title, suggestedPaise: feeForSlug(slug)?.totalPaise ?? null }))

export function isFeeCourse(slug: string) {
  return knownCourses.some(course => course.slug === slug)
}

export async function getStudentFees(db: Db, enquiryId: string): Promise<StudentFees | null> {
  const [lead] = await db.select({ personId: enquiries.personId }).from(enquiries).where(eq(enquiries.id, enquiryId))
  if (!lead) return null
  const [entries, interests, assigned] = await Promise.all([
    db.select({ fee: studentFees, payment: studentPayments }).from(studentFees)
      .leftJoin(studentPayments, sql`${studentPayments.personId} = ${studentFees.personId} and ${studentPayments.courseSlug} = ${studentFees.courseSlug}`)
      .where(eq(studentFees.personId, lead.personId))
      .orderBy(desc(studentPayments.paidOn), desc(studentPayments.recordedAt), desc(studentPayments.id)),
    db.select({ courseSlug: enquiryCourseInterests.courseSlug }).from(enquiryCourseInterests)
      .where(eq(enquiryCourseInterests.enquiryId, enquiryId)),
    db.select({ courseSlug: batchPlacements.courseSlug }).from(batchPlacements)
      .where(sql`${batchPlacements.enquiryId} = ${enquiryId} and ${batchPlacements.state} = 'seated'`),
  ])
  const ledgers = new Map<string, StudentFees["ledgers"][number]>()
  for (const { fee, payment } of entries) {
    const ledger = ledgers.get(fee.courseSlug) ?? { courseSlug: fee.courseSlug, agreedPaise: fee.agreedPaise, payments: [] }
    if (payment) ledger.payments.push({
      id: payment.id, kind: payment.kind, paidOn: payment.paidOn, amountPaise: payment.amountPaise,
      reference: payment.reference, recordedBy: payment.recordedBy,
      voidReason: payment.voidReason, voidedBy: payment.voidedBy, voidedAt: payment.voidedAt?.toISOString() ?? null,
    })
    ledgers.set(ledger.courseSlug, ledger)
  }
  const eligible = new Set([...interests.map(row => row.courseSlug), ...assigned.map(row => row.courseSlug), ...ledgers.keys()])
  return {
    courses: knownCourses.filter(course => !interests.length || eligible.has(course.slug)),
    ledgers: [...ledgers.values()],
  }
}

export async function saveStudentFee(db: Db, enquiryId: string, change: FeeChange, actor: string) {
  await db.execute(sql`select manage_student_fee(
    ${enquiryId}::uuid, ${change.courseSlug}, ${change.action}, ${actor},
    ${change.action !== "void" ? change.amountPaise : null}::integer,
    ${change.action === "fee" ? change.expectedFee : null}::integer,
    ${change.action !== "fee" ? change.paymentId : null}::uuid,
    ${change.action === "record" ? change.kind : null},
    ${change.action === "record" ? change.paidOn : null}::date,
    ${change.action === "record" ? change.reference : change.action === "void" ? change.reason : null}
  )`)
}
