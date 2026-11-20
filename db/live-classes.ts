import { and, asc, eq, gt, isNull, sql } from "drizzle-orm"
import type { LiveClassMode } from "@/components/live-class-model"
import type { Db } from "@/db/client"
import { liveClassSessions } from "@/db/schema/live-classes"

export async function listLiveClasses(db: Db) {
  const sessions = await db.select({
    id: liveClassSessions.id,
    startsAt: liveClassSessions.startsAt,
    mode: liveClassSessions.mode,
  }).from(liveClassSessions)
    .where(and(gt(liveClassSessions.startsAt, sql`now()`), isNull(liveClassSessions.cancelledAt)))
    .orderBy(asc(liveClassSessions.startsAt), asc(liveClassSessions.mode))
  return sessions.map(session => ({ ...session, startsAt: session.startsAt.toISOString() }))
}

export async function publishLiveClass(db: Db, startsAt: Date, mode: LiveClassMode) {
  const [session] = await db.insert(liveClassSessions).values({ startsAt, mode }).onConflictDoNothing().returning({ id: liveClassSessions.id })
  return Boolean(session)
}

export async function cancelLiveClass(db: Db, id: string) {
  const [session] = await db.update(liveClassSessions).set({ cancelledAt: sql`now()` })
    .where(and(eq(liveClassSessions.id, id), gt(liveClassSessions.startsAt, sql`now()`), isNull(liveClassSessions.cancelledAt)))
    .returning({ id: liveClassSessions.id })
  return Boolean(session)
}

export async function createLiveClassEnquiry(db: Db, sessionId: string, personId: string, enquiryId: string) {
  const result = await db.execute<{ id: string }>(sql`
    WITH session AS (
      SELECT id FROM live_class_sessions
      WHERE id = ${sessionId}::uuid AND starts_at > now() AND cancelled_at IS NULL
      FOR SHARE
    ), booked AS (
      INSERT INTO enquiries (id, person_id, live_class_session_id, type, origin_page, origin_form)
      SELECT ${enquiryId}::uuid, ${personId}::uuid, id, 'free_demo'::enquiry_type, '/', 'homepage-live-class v1'
      FROM session
      ON CONFLICT (person_id, live_class_session_id) DO UPDATE
      SET live_class_session_id = excluded.live_class_session_id
      RETURNING id
    ), course_interest AS (
      INSERT INTO enquiry_course_interests (enquiry_id, course_slug, course_label)
      SELECT id, 'digital-marketing', 'Professional Digital Marketing Program with AI' FROM booked
      ON CONFLICT DO NOTHING
    )
    SELECT id FROM booked
  `)
  return result.rows[0]?.id ?? null
}
