import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { enquiryStatus, enquiryType } from "@/db/schema/enums"
import { liveClassSessions } from "@/db/schema/live-classes"
import { persons } from "@/db/schema/persons"

/**
 * One row per request: a demo booking, a course enquiry, a contact
 * message, etc. Linked to exactly one person; a person may own many
 * enquiries over time.
 *
 * origin_page / origin_form record WHERE the enquiry came from
 * (e.g. "/contact", "contact-form v1") so the team can later tell
 * which pages and CTAs convert — without a separate analytics pipeline.
 *
 * assigned_to is a plain text owner label for now (name or email of the
 * counsellor). It becomes a foreign key to an admin_users table when the
 * admin dashboard adds login. See docs/DATABASE.md.
 */
export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => persons.id, { onDelete: "cascade" }),
    type: enquiryType("type").notNull(),
    status: enquiryStatus("status").notNull().default("new"),
    /** Optional subject line (used by contact messages). */
    subject: text("subject"),
    /** The visitor's message, if they wrote one. */
    message: text("message"),
    /**
     * Preferred callback window from the demo dialog
     * ("morning" | "afternoon" | "evening"). Null = anytime / not asked.
     * Fixed chips in the UI (not free text) so the admin dashboard can
     * filter on this column without normalizing ("after 5", "evening pls").
     */
    preferredTime: text("preferred_time"),
    liveClassSessionId: uuid("live_class_session_id").references(() => liveClassSessions.id),
    /** Site path the enquiry originated from, e.g. "/contact". */
    originPage: text("origin_page"),
    /** Form/CTA identifier + version, e.g. "contact-form v1". */
    originForm: text("origin_form"),
    /** Owner label until admin login exists; then an admin_users FK. */
    assignedTo: text("assigned_to"),
    /** When the enquiry reached a terminal state (enrolled/closed/spam). */
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("enquiries_person_id_idx").on(t.personId),
    index("enquiries_status_idx").on(t.status),
    index("enquiries_type_idx").on(t.type),
    index("enquiries_created_at_idx").on(t.createdAt),
    uniqueIndex("enquiries_person_live_class_idx").on(t.personId, t.liveClassSessionId),
  ],
)
