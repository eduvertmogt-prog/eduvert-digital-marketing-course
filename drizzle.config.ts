import { defineConfig } from "drizzle-kit"

/**
 * drizzle-kit configuration. The schema is the source of truth;
 * SQL migrations are generated into db/migrations and reviewed
 * before being applied to Neon.
 *
 * DATABASE_URL is only needed for commands that TALK to the database
 * (migrate, push, pull, studio). `generate` and `check` work offline.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
})
