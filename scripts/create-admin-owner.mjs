import { Client } from "pg"
import { normalizeUsername, temporaryPassword } from "../db/admin-password.ts"

async function main() {
  const username = normalizeUsername(process.argv[2] ?? "eduvert-owner")
  if (!username || !process.env.DATABASE_URL) throw new Error("Supply a valid username and set DATABASE_URL.")
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 8000 })
  try {
    await client.connect()
    const password = temporaryPassword()
    await client.query("BEGIN")
    // Serialize one-time provisioning, even if two operators run this together.
    await client.query("LOCK TABLE admin_accounts IN SHARE ROW EXCLUSIVE MODE")
    const existing = await client.query("SELECT 1 FROM admin_accounts WHERE owner LIMIT 1")
    if (existing.rowCount) throw new Error("An owner already exists. No credentials changed.")
    await client.query("INSERT INTO admin_accounts (username, password_hash, owner) VALUES ($1, crypt($2, gen_salt('bf', 12)), true)", [username, password])
    await client.query("COMMIT")
    console.log(`Username: ${username}\nTemporary password: ${password}\nChange the password on first sign-in at /admin.`)
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  const message = error.code === "42P01" ? "Apply the admin credentials migration first."
    : ["Supply a valid username and set DATABASE_URL.", "An owner already exists. No credentials changed."].includes(error.message)
      ? error.message : `Unable to create owner${error.code ? " (" + error.code + ")" : ""}.`
  console.error(message)
  process.exitCode = 1
})
