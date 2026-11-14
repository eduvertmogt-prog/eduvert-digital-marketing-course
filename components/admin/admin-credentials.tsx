"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { maxAdminPasswordBytes, minAdminPasswordLength } from "./password-policy"

const panel = "rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-5 sm:p-6"
const button = "rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-4 py-2 eduvert-button hover:bg-eduvert-tint-blue disabled:opacity-60"
const primary = "rounded-eduvert-8 bg-eduvert-action-primary px-4 py-2 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-60"
const field = "mt-1 w-full rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 py-2 eduvert-body focus-visible:outline-2 focus-visible:outline-eduvert-link"

async function auth<T>(payload?: object, signal?: AbortSignal): Promise<T> {
  const response = await fetch("/api/admin/auth", payload
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    : { cache: "no-store", signal })
  const result = await response.json()
  if (!response.ok) throw new Error((result as { error?: string } | null)?.error || "Unable to complete that request.")
  return result as T
}

const errorText = (error: unknown) => error instanceof Error ? error.message : "Please try again."

export function AdminSignOut() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  async function signOut() {
    setBusy(true)
    setError("")
    try { await auth({ action: "logout" }); window.location.replace("/admin") }
    catch (error) { setError(errorText(error)); setBusy(false) }
  }
  return <div><button type="button" className={button} disabled={busy} onClick={signOut}>Sign out</button>
    {error && <p role="alert" className="eduvert-support">{error}</p>}</div>
}

function PasswordForm({ firstSignIn = false, children }: { firstSignIn?: boolean; children?: ReactNode }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    if (values.get("new") !== values.get("confirm")) { setError("The new passwords don’t match."); return }
    setBusy(true)
    setError("")
    try {
      await auth({ action: "password", currentPassword: values.get("current"), newPassword: values.get("new") })
      window.location.replace("/admin")
    } catch (error) { setError(errorText(error)); setBusy(false) }
  }
  return <form onSubmit={submit} className="grid gap-4">
    {children}
    <label className="eduvert-support">{firstSignIn ? "Temporary password" : "Current password"}
      <input className={field} required name="current" type="password" autoComplete="current-password" maxLength={maxAdminPasswordBytes} />
    </label>
    <label className="eduvert-support">New password (at least {minAdminPasswordLength} characters)
      <input className={field} required name="new" type="password" autoComplete="new-password" minLength={minAdminPasswordLength} maxLength={maxAdminPasswordBytes} />
    </label>
    <label className="eduvert-support">Confirm new password
      <input className={field} required name="confirm" type="password" autoComplete="new-password" minLength={minAdminPasswordLength} maxLength={maxAdminPasswordBytes} />
    </label>
    {error && <p role="alert" className="eduvert-support text-eduvert-link">{error}</p>}
    <button className={primary} disabled={busy}>{busy ? "Saving…" : "Save password and sign in again"}</button>
  </form>
}

export function AdminSignIn({ mustChange }: { mustChange: boolean }) {
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setBusy(true)
    setError("")
    try { await auth({ action: "login", username: values.get("username"), password: values.get("password") }); window.location.replace("/admin") }
    catch (error) { setError(errorText(error)); setBusy(false) }
  }
  return <main className="grid min-h-dvh place-items-center bg-eduvert-tint-soft-blue px-4 py-12 text-eduvert-text-primary">
    <section className={`w-full max-w-md ${panel}`}>
      <p className="eduvert-support font-eduvert-700 text-eduvert-link">EduVert / Admissions</p>
      <h1 className="mb-5 mt-2 eduvert-h2">{mustChange ? "Choose a new password" : "Staff sign-in"}</h1>
      {mustChange ? <>
        <PasswordForm firstSignIn><p className="eduvert-body text-eduvert-text-secondary">Replace your temporary password to open the Admissions Desk.</p></PasswordForm>
        <div className="mt-4"><AdminSignOut /></div>
      </> : <form className="grid gap-4" onSubmit={submit}>
        <label className="eduvert-support">Username<input className={field} name="username" required autoComplete="username" maxLength={80} /></label>
        <label className="eduvert-support">Password<input className={field} name="password" required type="password" autoComplete="current-password" maxLength={maxAdminPasswordBytes} /></label>
        {error && <p className="eduvert-support text-eduvert-link" role="alert">{error}</p>}
        <button className={primary} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>}
    </section>
  </main>
}

type Account = { id: string; username: string; owner: boolean; needsPasswordChange: boolean }
type Credential = { username: string; password: string }

export function AdminAccountSettings({ owner }: { owner: boolean }) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [credential, setCredential] = useState<Credential | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState("")
  async function load(signal?: AbortSignal) { setAccounts((await auth<{ accounts: Account[] }>(undefined, signal)).accounts) }
  useEffect(() => {
    if (!owner) return
    const controller = new AbortController()
    void load(controller.signal).catch(error => { if (!controller.signal.aborted) setError(errorText(error)) })
    return () => controller.abort()
  }, [owner])
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const { value: username } = form.elements.namedItem("username") as HTMLInputElement
    setBusy(true); setError("")
    try { setCredential(await auth<Credential>({ action: "create", username })); form.reset(); await load() }
    catch (error) { setError(errorText(error)) }
    finally { setBusy(false) }
  }
  async function revoke(id: string) {
    setBusy(true); setError("")
    try { await auth({ action: "revoke", id }); setConfirm(""); await load() }
    catch (error) { setError(errorText(error)) }
    finally { setBusy(false) }
  }
  return <div className="grid items-start gap-6 lg:grid-cols-2">
    {owner && <section className={panel}>
      <h2 className="eduvert-h3">Staff accounts</h2>
      <p className="mb-4 mt-2 eduvert-body text-eduvert-text-secondary">Create a login for each staff member. They’ll choose a new password on their first sign-in.</p>
      <form onSubmit={create} className="flex flex-wrap items-end gap-3">
        <label className="flex-1 eduvert-support">New username<input className={field} required name="username" minLength={3} maxLength={80} autoComplete="off" /></label>
        <button className={primary} disabled={busy || Boolean(credential)}>Create account</button>
      </form>
      {credential && <div className="mt-4 grid gap-2 rounded-eduvert-8 bg-eduvert-tint-blue p-3 eduvert-support" role="status">
        <p>Share this temporary login privately. The password is shown once.</p>
        <p>Username: <strong>{credential.username}</strong></p>
        <p className="break-all">Temporary password: <code>{credential.password}</code></p>
        <button type="button" className={button} onClick={() => setCredential(null)}>Hide credentials</button>
      </div>}
      {error && <p role="alert" className="mt-3 eduvert-support text-eduvert-link">{error}</p>}
      <ul className="mt-4 divide-y divide-eduvert-border-subtle">
        {accounts.map(account => <li key={account.id} className="flex flex-wrap items-center justify-between gap-2 py-3 eduvert-support">
          <span className="break-all">{account.username} · {account.owner ? "Owner" : account.needsPasswordChange ? "Awaiting first sign-in" : "Staff"}</span>
          {!account.owner && (confirm === account.id
            ? <div className="flex gap-2"><button type="button" className={button} disabled={busy} onClick={() => setConfirm("")}>Cancel</button><button type="button" className={primary} disabled={busy} onClick={() => revoke(account.id)}>Confirm removal</button></div>
            : <button type="button" className={button} disabled={busy} onClick={() => setConfirm(account.id)}>Remove access</button>)}
        </li>)}
      </ul>
    </section>}
    <section className={panel}><h2 className="mb-4 eduvert-h3">Change your password</h2><PasswordForm /></section>
  </div>
}
