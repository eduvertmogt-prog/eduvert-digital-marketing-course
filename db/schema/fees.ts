import { sql } from "drizzle-orm"
import { check, date, foreignKey, index, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { enquiries } from "./enquiries"
import { persons } from "./persons"

export const studentFees = pgTable("student_fees", {
  personId: uuid("person_id").notNull().references(() => persons.id),
  courseSlug: text("course_slug").notNull(),
  agreedPaise: integer("agreed_paise").notNull(),
  setBy: text("set_by").notNull(),
  setAt: timestamp("set_at", { withTimezone: true }).notNull().defaultNow(),
}, t => [
  primaryKey({ columns: [t.personId, t.courseSlug] }),
  check("student_fees_amount_check", sql`${t.agreedPaise} between 0 and 100000000`),
])

export const studentPayments = pgTable("student_payments", {
  id: uuid("id").primaryKey(),
  personId: uuid("person_id").notNull(),
  courseSlug: text("course_slug").notNull(),
  enquiryId: uuid("enquiry_id").notNull().references(() => enquiries.id),
  kind: text("kind", { enum: ["deposit", "instalment"] }).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  paidOn: date("paid_on").notNull(),
  reference: text("reference"),
  recordedBy: text("recorded_by").notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  voidedBy: text("voided_by"),
  voidReason: text("void_reason"),
}, t => [
  foreignKey({ name: "student_payments_fee_fk", columns: [t.personId, t.courseSlug], foreignColumns: [studentFees.personId, studentFees.courseSlug] }),
  index("student_payments_fee_idx").on(t.personId, t.courseSlug, t.paidOn),
  check("student_payments_kind_check", sql`${t.kind} in ('deposit', 'instalment')`),
  check("student_payments_amount_check", sql`${t.amountPaise} between 1 and 100000000`),
])
