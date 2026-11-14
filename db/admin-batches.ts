import { asc, desc, eq, sql } from "drizzle-orm"
import type { Db } from "@/db/client"
import { batchPlacements, courseBatches, enquiries, persons } from "@/db/schema"
import { courses } from "@/components/courses/course-data"
import type { BatchDirectory, BatchMember, BatchMutation } from "@/components/admin/batch-model"

export const batchCourses = courses.map(({ slug, title }) => ({ slug, title }))

export async function listBatches(db: Db): Promise<BatchDirectory> {
  const count = (state: BatchMember["state"]) => sql<number>`(
    select count(*) from batch_placements p where p.batch_id = ${courseBatches.id} and p.state = ${state}
  )`.mapWith(Number)

  const batches = await db.select({
    id: courseBatches.id, courseSlug: courseBatches.courseSlug, name: courseBatches.name,
    startsOn: courseBatches.startsOn, endsOn: courseBatches.endsOn, capacity: courseBatches.capacity,
    accepting: courseBatches.accepting, revision: courseBatches.revision,
    seated: count("seated"), waiting: count("waitlisted"),
  }).from(courseBatches).orderBy(desc(courseBatches.startsOn), asc(courseBatches.name), asc(courseBatches.id))
  return { batches, courses: batchCourses }
}

export async function listBatchMembers(db: Db, filter: { batchId: string } | { enquiryId: string }): Promise<BatchMember[]> {
  const rows = await db.select({
    batchId: batchPlacements.batchId, courseSlug: batchPlacements.courseSlug,
    enquiryId: batchPlacements.enquiryId, state: batchPlacements.state,
    addedAt: batchPlacements.addedAt, fullName: persons.fullName, status: enquiries.status,
  }).from(batchPlacements)
    .innerJoin(enquiries, eq(enquiries.id, batchPlacements.enquiryId))
    .innerJoin(persons, eq(persons.id, batchPlacements.personId))
    .where("batchId" in filter ? eq(batchPlacements.batchId, filter.batchId) : sql`
      ${batchPlacements.personId} = (select e.person_id from enquiries e where e.id = ${filter.enquiryId}::uuid)
    `)
    .orderBy(asc(batchPlacements.addedAt), asc(batchPlacements.enquiryId))
  return rows.map(row => ({ ...row, addedAt: row.addedAt.toISOString() }))
}

export async function mutateBatch(db: Db, change: BatchMutation, actor: string) {
  switch (change.action) {
    case "create":
      await db.insert(courseBatches).values(change.draft)
      return
    case "edit":
      await db.execute(sql`select update_course_batch(${change.batchId}::uuid, ${change.revision},
        ${change.draft.name}, ${change.draft.startsOn}::date, ${change.draft.endsOn}::date,
        ${change.draft.capacity}, ${change.draft.accepting})`)
      return
    default:
      await db.execute(sql`select change_batch_placement(${change.batchId}::uuid, ${change.enquiryId}::uuid, ${change.action}, ${actor})`)
  }
}

export function batchConflict(error: unknown): string | null {
  const cause = error instanceof Error ? error.cause ?? error : error
  if (!cause || typeof cause !== "object" || !("code" in cause) || cause.code !== "EB001") return null
  return "message" in cause && typeof cause.message === "string" ? cause.message : "Refresh the batch and try again."
}
