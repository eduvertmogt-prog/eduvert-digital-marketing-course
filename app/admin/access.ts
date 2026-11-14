import { createHash, randomBytes } from "node:crypto"
import { and, eq, gt, sql } from "drizzle-orm"
import { createDb, resolveConnectionString, type Db } from "@/db/client"
import { adminAccounts, adminSessions } from "@/db/schema/admin-auth"

const cookieName = "eduvert_admin_session"
const sessionSeconds = 8 * 60 * 60
const digest = (value: string) => createHash("sha256").update(value).digest("hex")
export const adminDb = () => createDb(resolveConnectionString())

export function sessionHash(headers: Headers) {
  const token = headers.get("cookie")?.match(/(?:^|;\s*)eduvert_admin_session=([\w-]{43})(?:;|$)/)?.[1]
  return token ? digest(token) : null
}

export function sessionCookie(request: Request, token = "") {
  const local = process.env.NODE_ENV !== "production" && new URL(request.url).origin === "http://localhost:5173"
  return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${token ? sessionSeconds : 0}${local ? "" : "; Secure"}`
}

export async function getAdminSession(headers: Headers, db?: Db) {
  const hash = sessionHash(headers)
  if (!hash) return null
  const [session] = await (db ?? adminDb()).select({
    id: adminAccounts.id, username: adminAccounts.username, owner: adminAccounts.owner,
    needsPasswordChange: adminAccounts.needsPasswordChange,
  }).from(adminSessions).innerJoin(adminAccounts, and(eq(adminAccounts.id, adminSessions.accountId), eq(adminAccounts.credentialVersion, adminSessions.credentialVersion)))
    .where(and(eq(adminSessions.tokenHash, hash), gt(adminSessions.expiresAt, sql`now()`))).limit(1)
  return session ?? null
}

export async function getAdminIdentity(headers: Headers) {
  const session = await getAdminSession(headers)
  return session && !session.needsPasswordChange ? session.username : null
}

export async function createAdminSession(db: Db, accountId: string, verifiedHash: string) {
  const token = randomBytes(32).toString("base64url")
  const result = await db.execute(sql`
    WITH cleanup AS (DELETE FROM admin_sessions WHERE expires_at <= now())
    INSERT INTO admin_sessions (token_hash, account_id, credential_version, expires_at)
    SELECT ${digest(token)}, id, credential_version, now() + interval '8 hours' FROM admin_accounts
    WHERE id = ${accountId} AND password_hash = ${verifiedHash} FOR UPDATE
    RETURNING token_hash
  `)
  return result.rows.length ? token : null
}
