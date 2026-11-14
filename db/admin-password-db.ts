import { sql } from "drizzle-orm"
import type { Db } from "@/db/client"

export async function hashPassword(db: Db, password: string) {
  const { rows: [row] } = await db.execute<{ hash: string }>(sql`select crypt(${password}, gen_salt('bf', 12)) as hash`)
  return row.hash
}

export async function verifyPassword(db: Db, password: string, hash?: string) {
  const salt = hash?.startsWith("$2a$12$") ? hash : "$2a$12$0123456789abcdefghijk."
  const { rows: [row] } = await db.execute<{ valid: boolean }>(sql`select crypt(${password}, ${salt}) = ${salt} as valid`)
  return row.valid && salt === hash
}
