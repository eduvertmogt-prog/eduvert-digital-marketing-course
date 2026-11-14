import { randomBytes } from "node:crypto"
import { maxAdminPasswordBytes, minAdminPasswordLength } from "../components/admin/password-policy.ts"

export function normalizeUsername(value: unknown) {
  if (typeof value !== "string") return null
  const username = value.trim().toLowerCase()
  return /^[a-z0-9][a-z0-9._@+-]{2,79}$/.test(username) ? username : null
}

export function validPassword(value: unknown): value is string {
  return typeof value === "string" && Array.from(value).length >= minAdminPasswordLength
    && new TextEncoder().encode(value).length <= maxAdminPasswordBytes
    && !value.includes("\0")
}

export const temporaryPassword = () => randomBytes(24).toString("base64url")
