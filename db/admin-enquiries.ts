import { reportEnquiryFilter } from "@/db/admin-reporting"
import type { ReportScope } from "@/components/admin/reporting-model"
import { and, asc, count, desc, eq, gte, inArray, lt, or, sql, type SQL } from "drizzle-orm"
import type { Db } from "@/db/client"
import { enquiries, enquiryCourseInterests, followUps, persons } from "@/db/schema"
import { isOpen, istDayEnd, pageSize, type Enquiry, type EnquiryDetail, type EnquiryPage, type EnquiryUpdate, type View } from "@/components/admin/admissions-model"

const nextAction = sql<string | null>`(
  select f.next_action_at from follow_ups f
  where f.enquiry_id = ${enquiries.id}
  order by f.created_at desc, f.id desc limit 1
)`

const selection = {
  id: enquiries.id,
  fullName: persons.fullName,
  email: persons.email,
  phone: persons.phone,
  type: enquiries.type,
  status: enquiries.status,
  courses: sql<string[]>`array(
    select i.course_label from enquiry_course_interests i
    where i.enquiry_id = ${enquiries.id}
    order by i.course_label, i.course_slug
  )`,
  courseSlugs: sql<string[]>`array(
    select i.course_slug from enquiry_course_interests i where i.enquiry_id = ${enquiries.id}
    order by i.course_label, i.course_slug
  )`,
  originPage: enquiries.originPage,
  preferredTime: enquiries.preferredTime,
  assignedTo: enquiries.assignedTo,
  createdAt: enquiries.createdAt,
  updatedAt: enquiries.updatedAt,
  nextActionAt: nextAction,
}

function serialize(row: Omit<Enquiry, "createdAt" | "updatedAt"> & { createdAt: Date; updatedAt: Date }): Enquiry {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    nextActionAt: row.nextActionAt ? new Date(row.nextActionAt).toISOString() : null,
  }
}

export async function listEnquiries(
  db: Db, email: string, view: View, search: string, page: number, scope?: ReportScope,
): Promise<EnquiryPage> {
  const now = new Date().toISOString()
  const end = istDayEnd().toISOString()
  const active = inArray(enquiries.status, ["new", "contacted", "qualified"])
  const conditions: Record<View, SQL | undefined> = {
    active,
    new: eq(enquiries.status, "new"),
    due: and(active, gte(nextAction, now), lt(nextAction, end)),
    overdue: and(active, lt(nextAction, now)),
    mine: and(active, eq(sql`lower(${enquiries.assignedTo})`, email)),
    enrolled: eq(enquiries.status, "enrolled"),
    all: undefined,
  }

  const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`
  const matches = search ? or(
    sql`${persons.fullName} ilike ${pattern}`,
    sql`${persons.email} ilike ${pattern}`,
    sql`${persons.phone} ilike ${pattern}`,
    sql`${enquiries.assignedTo} ilike ${pattern}`,
    sql`${enquiries.originPage} ilike ${pattern}`,
    sql`exists (select 1 from enquiry_course_interests i
      where i.enquiry_id = ${enquiries.id} and i.course_label ilike ${pattern})`,
  ) : undefined
  const cohort = scope ? reportEnquiryFilter(scope) : undefined
  const filtered = and(conditions[view], matches, cohort)
  const [rows, [total], [counts]] = await Promise.all([
    db.select(selection).from(enquiries).innerJoin(persons, eq(persons.id, enquiries.personId))
      .where(filtered)
      .orderBy(...(view === "due" || view === "overdue"
        ? [asc(nextAction), desc(enquiries.createdAt), desc(enquiries.id)]
        : [desc(enquiries.createdAt), desc(enquiries.id)]))
      .limit(pageSize).offset(page * pageSize),
    db.select({ value: count() }).from(enquiries).innerJoin(persons, eq(persons.id, enquiries.personId)).where(filtered),
    db.select({
      active: countWhere(conditions.active),
      new: countWhere(conditions.new),
      due: countWhere(conditions.due),
      overdue: countWhere(conditions.overdue),
      mine: countWhere(conditions.mine),
      enrolled: countWhere(conditions.enrolled),
      all: count(),
    }).from(enquiries).where(cohort),
  ])
  return { rows: rows.map(serialize), total: total.value, counts }
}

function countWhere(condition: SQL | undefined) {
  return sql<number>`count(*) filter (where ${condition})`.mapWith(Number)
}

export async function getEnquiry(db: Db, id: string): Promise<EnquiryDetail | null> {
  const [[row], activity] = await Promise.all([
    db.select(selection).from(enquiries).innerJoin(persons, eq(persons.id, enquiries.personId))
      .where(eq(enquiries.id, id)).limit(1),
    db.select({
      id: followUps.id,
      channel: followUps.channel,
      note: followUps.note,
      author: followUps.author,
      nextActionAt: followUps.nextActionAt,
      createdAt: followUps.createdAt,
    }).from(followUps).where(eq(followUps.enquiryId, id))
      .orderBy(desc(followUps.createdAt), desc(followUps.id)).limit(50),
  ])
  if (!row) return null

  return {
    enquiry: serialize(row),
    activity: activity.map(entry => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      nextActionAt: entry.nextActionAt?.toISOString() ?? null,
    })),
  }
}

export async function updateEnquiry(db: Db, id: string, email: string, change: EnquiryUpdate) {
  const current = await getEnquiry(db, id)
  if (!current || current.enquiry.updatedAt !== change.updatedAt) return false
  const previous = current.enquiry
  const owner = change.assignedTo || null
  const scheduled = isOpen(change.status) ? change.nextActionAt : null
  const history = [
    ...(previous.status !== change.status ? [`Status changed from ${previous.status} to ${change.status}.`] : []),
    ...(previous.assignedTo !== owner ? [owner ? `Assigned to ${owner}.` : "Assignment cleared."] : []),
    ...(previous.nextActionAt !== scheduled ? [scheduled ? "Follow-up scheduled." : "Follow-up cleared."] : []),
  ]
  if (!history.length && !change.note) return true

  const note = [...history, change.note].filter(Boolean).join("\n")
  // The update and history entry share one SQL statement and commit together.
  const result = await db.execute<{ id: string }>(sql`
    with updated as (
      update enquiries set status = ${change.status}::enquiry_status,
        assigned_to = ${owner},
        closed_at = case when ${isOpen(change.status)} then null else coalesce(closed_at, now()) end,
        updated_at = greatest(date_trunc('milliseconds', clock_timestamp()), date_trunc('milliseconds', updated_at) + interval '1 millisecond')
      where id = ${id}::uuid and date_trunc('milliseconds', updated_at) = ${change.updatedAt}::timestamptz
      returning id
    )
    insert into follow_ups (enquiry_id, channel, note, author, next_action_at)
    select id, ${change.note ? change.channel : "other"}::follow_up_channel, ${note}, ${email},
      ${scheduled}::timestamptz
    from updated returning enquiry_id as id
  `)
  return result.rows.length === 1
}
