import { sql } from "drizzle-orm"
import { boolean, check, date, foreignKey, index, integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"
import { enquiries } from "./enquiries"
import { persons } from "./persons"

export const courseBatches = pgTable("course_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseSlug: text("course_slug").notNull(),
  name: text("name").notNull(),
  startsOn: date("starts_on").notNull(),
  endsOn: date("ends_on"),
  capacity: integer("capacity").notNull(),
  accepting: boolean("accepting").notNull().default(true),
  revision: integer("revision").notNull().default(0),
}, t => [
  unique("course_batches_id_course").on(t.id, t.courseSlug),
  index("course_batches_starts_on_idx").on(t.startsOn),
  check("course_batches_capacity_check", sql`${t.capacity} between 1 and 1000`),
  check("course_batches_dates_check", sql`${t.endsOn} >= ${t.startsOn}`),
])

export const batchPlacements = pgTable("batch_placements", {
  batchId: uuid("batch_id").notNull(),
  courseSlug: text("course_slug").notNull(),
  personId: uuid("person_id").notNull().references(() => persons.id),
  enquiryId: uuid("enquiry_id").notNull().references(() => enquiries.id),
  state: text("state", { enum: ["seated", "waitlisted"] }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
}, t => [
  foreignKey({ name: "batch_placements_batch_course_fk", columns: [t.batchId, t.courseSlug], foreignColumns: [courseBatches.id, courseBatches.courseSlug] }),
  unique("batch_placements_person_course").on(t.personId, t.courseSlug),
  index("batch_placements_batch_idx").on(t.batchId, t.state, t.addedAt, t.enquiryId),
  index("batch_placements_enquiry_idx").on(t.enquiryId),
  check("batch_placements_state_check", sql`${t.state} in ('seated', 'waitlisted')`),
])
