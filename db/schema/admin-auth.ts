import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const adminAccounts = pgTable("admin_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  credentialVersion: integer("credential_version").notNull().default(1),
  owner: boolean("owner").notNull().default(false),
  needsPasswordChange: boolean("needs_password_change").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const adminSessions = pgTable("admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  accountId: uuid("account_id").notNull().references(() => adminAccounts.id, { onDelete: "cascade" }),
  credentialVersion: integer("credential_version").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, table => [
  index("admin_sessions_account_idx").on(table.accountId),
  index("admin_sessions_expiry_idx").on(table.expiresAt),
])

export const adminLoginLimits = pgTable("admin_login_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull(),
  resetsAt: timestamp("resets_at", { withTimezone: true }).notNull(),
}, table => [index("admin_login_limits_expiry_idx").on(table.resetsAt)])
