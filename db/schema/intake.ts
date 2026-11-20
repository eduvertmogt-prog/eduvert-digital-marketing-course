import { sql } from "drizzle-orm"
import { boolean, check, date, integer, pgTable } from "drizzle-orm/pg-core"

export const intakeAnnouncement = pgTable("intake_announcement", {
  id: integer("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  closesOn: date("closes_on").notNull(),
  seatsRemaining: integer("seats_remaining").notNull(),
  revision: integer("revision").notNull().default(0),
}, table => [
  check("intake_announcement_single_row", sql`${table.id} = 1`),
  check("intake_announcement_seats_check", sql`${table.seatsRemaining} between 0 and 1000`),
])
