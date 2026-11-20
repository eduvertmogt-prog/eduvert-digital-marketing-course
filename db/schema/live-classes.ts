import { sql } from "drizzle-orm"
import { check, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { liveClassModes } from "@/components/live-class-model"

export const liveClassSessions = pgTable("live_class_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  mode: text("mode", { enum: liveClassModes }).notNull(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
}, table => [
  check("live_class_sessions_mode_check", sql`${table.mode} in ('classroom', 'online')`),
  uniqueIndex("live_class_sessions_active_start_mode_idx").on(table.startsAt, table.mode).where(sql`${table.cancelledAt} is null`),
])
