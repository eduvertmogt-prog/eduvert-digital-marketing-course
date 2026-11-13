import { createRemoteJWKSet, jwtVerify } from "jose"

const accessKeys = new Map<string, ReturnType<typeof createRemoteJWKSet>>()

export async function getAdminIdentity(headers: Headers): Promise<string | null> {
  const issuer = process.env.ADMIN_ACCESS_ISSUER?.trim().replace(/\/$/, "")
  const audience = process.env.ADMIN_ACCESS_AUDIENCE?.trim()
  const token = headers.get("cf-access-jwt-assertion")

  if (!issuer || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/i.test(issuer) || !audience || !token) {
    return null
  }

  try {
    let jwks = accessKeys.get(issuer)
    if (!jwks) {
      jwks = createRemoteJWKSet(new URL("/cdn-cgi/access/certs", issuer))
      accessKeys.set(issuer, jwks)
    }
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "sub", "email"],
    })
    return typeof payload.email === "string" && payload.email.includes("@")
      ? payload.email.toLowerCase()
      : null
  } catch {
    return null
  }
}
