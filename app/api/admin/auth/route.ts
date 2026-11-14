import { maxAdminPasswordBytes, minAdminPasswordLength } from "@/components/admin/password-policy"
import { createHash } from "node:crypto"
import { and, eq, sql } from "drizzle-orm"
import { adminDb, createAdminSession, getAdminSession, sessionCookie, sessionHash } from "@/app/admin/access"
import { hashPassword, verifyPassword } from "@/db/admin-password-db"
import { normalizeUsername, temporaryPassword, validPassword } from "@/db/admin-password"
import { adminAccounts, adminSessions } from "@/db/schema/admin-auth"
import type { Db } from "@/db/client"

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", ...headers } })
}

export async function GET(request: Request) {
  const session = await getAdminSession(request.headers)
  if (!session || session.needsPasswordChange) return json({ error: "Sign in first." }, 401)
  if (!session.owner) return json({ error: "Only the owner can manage staff accounts." }, 403)
  const accounts = await adminDb().select({ id: adminAccounts.id, username: adminAccounts.username,
    owner: adminAccounts.owner, needsPasswordChange: adminAccounts.needsPasswordChange })
    .from(adminAccounts).orderBy(adminAccounts.createdAt)
  return json({ accounts })
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Open the dashboard directly and try again." }, 403)
  }
  try {
    const body = await readPayload(request)
    if (!body) return json({ error: "Check the sign-in details and try again." }, 400)
    const db = adminDb()
    if (body.action === "login") return await login(request, db, body)
    if (body.action === "logout") {
      const hash = sessionHash(request.headers)
      if (hash) await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hash))
      return json({}, 200, { "Set-Cookie": sessionCookie(request) })
    }
    const session = await getAdminSession(request.headers, db)
    if (!session) return json({ error: "Sign in first." }, 401)
    if (body.action === "password") {
      const { currentPassword, newPassword } = body
      if (!validPassword(currentPassword) || !validPassword(newPassword) || currentPassword === newPassword) {
        return json({ error: `Choose a different password with at least ${minAdminPasswordLength} characters and at most ${maxAdminPasswordBytes} bytes.` }, 400)
      }
      const [account] = await db.select({ hash: adminAccounts.passwordHash }).from(adminAccounts)
        .where(eq(adminAccounts.id, session.id))
      if (!account || !await verifyPassword(db, currentPassword, account.hash)) {
        return json({ error: "The current password is incorrect." }, 400)
      }
      const result = await db.execute(sql`
        WITH changed AS (
          UPDATE admin_accounts SET password_hash = ${await hashPassword(db, newPassword)}, needs_password_change = false, credential_version = credential_version + 1
          WHERE id = ${session.id} AND password_hash = ${account.hash} RETURNING id
        ), revoked AS (
          DELETE FROM admin_sessions WHERE account_id IN (SELECT id FROM changed)
        )
        SELECT id FROM changed
      `)
      if (!result.rows.length) return json({ error: "Sign in again and retry." }, 409)
      return json({}, 200, { "Set-Cookie": sessionCookie(request) })
    }
    if (!session.owner || session.needsPasswordChange) {
      return json({ error: "Only the owner can manage staff accounts." }, 403)
    }
    if (body.action === "create") {
      const username = normalizeUsername(body.username)
      if (!username) return json({ error: "Use 3–80 characters: letters, numbers, or . _ @ + -." }, 400)
      const password = temporaryPassword()
      const [account] = await db.insert(adminAccounts).values({ username, passwordHash: await hashPassword(db, password) })
        .onConflictDoNothing().returning({ id: adminAccounts.id })
      if (!account) return json({ error: "That username is already in use." }, 409)
      return json({ username, password }, 201)
    }
    if (body.action === "revoke" && typeof body.id === "string" && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(body.id)) {
      const [account] = await db.delete(adminAccounts).where(and(eq(adminAccounts.id, body.id), eq(adminAccounts.owner, false)))
        .returning({ id: adminAccounts.id })
      return account ? json({}) : json({ error: "Staff account not found." }, 404)
    }
    return json({ error: "Unknown action." }, 400)
  } catch {
    return json({ error: "Unable to complete that request. Try again." }, 500)
  }
}

async function login(request: Request, db: Db, body: Record<string, unknown>) {
  const username = normalizeUsername(body.username)
  if (!username || !validPassword(body.password)) return json({ error: "Incorrect username or password." }, 401)
  const ip = request.headers.get("cf-connecting-ip") ?? "local"
  const digest = (value: string) => createHash("sha256").update(value).digest("hex")
  const limits = await db.execute<{ key: string; attempts: number }>(sql`
    WITH cleanup AS (
      DELETE FROM admin_login_limits WHERE resets_at < now() - interval '1 hour'
      AND key NOT IN (${"account:" + digest(username)}, ${"ip:" + digest(ip)})
    )
    INSERT INTO admin_login_limits (key, attempts, resets_at) VALUES
      (${"account:" + digest(username)}, 1, now() + interval '15 minutes'),
      (${"ip:" + digest(ip)}, 1, now() + interval '15 minutes')
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN admin_login_limits.resets_at <= now() THEN 1 ELSE least(admin_login_limits.attempts + 1, 1000) END,
      resets_at = CASE WHEN admin_login_limits.resets_at <= now() THEN excluded.resets_at ELSE admin_login_limits.resets_at END
    RETURNING key, attempts
  `)
  if (limits.rows.some(row => row.attempts > (row.key.startsWith("account:") ? 10 : 40))) {
    return json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, 429)
  }
  const [account] = await db.select().from(adminAccounts).where(eq(adminAccounts.username, username))
  if (!await verifyPassword(db, body.password, account?.passwordHash) || !account) {
    return json({ error: "Incorrect username or password." }, 401)
  }
  const token = await createAdminSession(db, account.id, account.passwordHash)
  if (!token) return json({ error: "Sign in again." }, 409)
  return json({}, 200, { "Set-Cookie": sessionCookie(request, token) })
}

async function readPayload(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.startsWith("application/json") || !request.body) return null
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let raw = "", length = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > 4096) { await reader.cancel(); return null }
      raw += decoder.decode(value, { stream: true })
    }
    const parsed = JSON.parse(raw + decoder.decode())
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}
