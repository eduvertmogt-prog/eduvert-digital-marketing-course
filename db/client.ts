import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema"

/**
 * Database client factory for the Neon HTTP driver.
 *
 * Workers safety rules baked in (see docs/DATABASE.md):
 * - No module-level client and no imported secrets. The connection
 *   string is passed in per call so request state never leaks across
 *   requests and credentials never sit in bundled source.
 * - neon-http is stateless (one HTTPS query per call, no TCP sockets),
 *   which is what Cloudflare Workers requires.
 *
 * @param connectionString A Neon pooled connection string
 *   (the -pooler host). Never commit one to source control.
 */
export function createDb(connectionString: string) {
  const sql = neon(connectionString)
  return drizzle(sql, { schema })
}

export type Db = ReturnType<typeof createDb>

interface EnvLike {
  DATABASE_URL?: string
}

/**
 * Resolve the connection string: prefer the explicitly passed environment
 * (in a Worker, pass the request `env` record holding the DATABASE_URL
 * secret) and fall back to process.env for local Node scripts.
 * Throws a plain-English error when nothing is configured.
 */
export function resolveConnectionString(env?: EnvLike): string {
  const fromEnv = env?.DATABASE_URL
  const fromProcess =
    typeof process !== "undefined" ? process.env.DATABASE_URL : undefined
  const value = fromEnv ?? fromProcess
  if (!value) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env for local work " +
        "or as a Worker secret for deploys. See docs/DATABASE.md.",
    )
  }
  return value
}
