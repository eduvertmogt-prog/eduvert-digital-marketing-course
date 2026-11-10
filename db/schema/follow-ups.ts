import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { enquiries } from "@/db/schema/enquiries"
import { followUpChannel } from "@/db/schema/enums"

/**
 * Append-only log of every follow-up touch on an enquiry: calls made,
 * WhatsApps sent, emails, in-person visits. The admin dashboard reads
 * this as the enquiry's timeline.
 *
 * Intentionally IMMUTABLE: no updated_at, no edits. Corrections are new
 * rows. This keeps the history trustworthy ("who promised what, when").
 *
 * author is a plain text label (name/email of the counsellor) until the
 * admin dashboard adds login; then it becomes a foreign key to
 * admin_users. next_action_at powers "due follow-ups" views.
 */
export const followUps = pgTable(
  "follow_ups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    channel: followUpChannel("channel").notNull(),
    note: text("note").notNull(),
    /** Who logged it; a future admin_users FK. */
    author: text("author"),
    /** When the next touch is due. Null = no follow-up scheduled. */
    nextActionAt: timestamp("next_action_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("follow_ups_enquiry_id_idx").on(t.enquiryId),
    index("follow_ups_next_action_at_idx").on(t.nextActionAt),
  ],
)
