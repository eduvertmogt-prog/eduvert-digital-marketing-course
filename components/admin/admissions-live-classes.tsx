"use client"

import { useEffect, useState, type FormEvent } from "react"
import { liveClassLabel, type LiveClassSession } from "@/components/live-class-model"

const endpoint = "/api/admin/live-classes"
const fieldClass = "min-h-11 w-full rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 py-2 eduvert-body"
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle px-3 eduvert-button hover:bg-eduvert-tint-soft-blue disabled:opacity-50"

async function request(signal?: AbortSignal, body?: object) {
  const response = await fetch(endpoint, {
    cache: "no-store",
    signal,
    ...(body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  })
  const payload = await response.json().catch(() => null) as { sessions?: LiveClassSession[]; error?: string } | null
  if (!response.ok || !payload) throw new Error(payload?.error || "Unable to reach the live class schedule.")
  return payload.sessions ?? []
}

export function AdmissionsLiveClasses() {
  const [sessions, setSessions] = useState<LiveClassSession[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [revision, setRevision] = useState(0)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    request(controller.signal)
      .then(items => { if (!controller.signal.aborted) setSessions(items) })
      .catch((error: Error) => { if (!controller.signal.aborted) setError(error.message) })
    return () => controller.abort()
  }, [revision])

  async function change(body: object, success: string) {
    if (busy) return false
    setBusy(true)
    setError("")
    setNotice("")
    try {
      await request(undefined, body)
      setNotice(success)
      setRevision(value => value + 1)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save the session.")
      return false
    } finally {
      setBusy(false)
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (await change({ action: "publish", startsAt: data.get("startsAt"), mode: data.get("mode") }, "Session published.")) form.reset()
  }

  return (
    <section aria-labelledby="admin-live-classes-heading" className="max-w-3xl space-y-5 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-4 sm:p-6">
      <div className="space-y-1">
        <h2 id="admin-live-classes-heading" className="eduvert-h3">Live class sessions</h2>
        <p className="eduvert-body text-eduvert-text-secondary">Publish a 60-minute slot from a running batch so visitors can request that specific session.</p>
      </div>
      <form onSubmit={publish}>
        <fieldset disabled={busy} className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <label className="grid min-w-0 gap-1.5 eduvert-support font-eduvert-600">
            Start date and time (IST)
            <input type="datetime-local" name="startsAt" required className={fieldClass} />
          </label>
          <label className="grid min-w-0 gap-1.5 eduvert-support font-eduvert-600">
            Class format
            <select name="mode" required className={fieldClass}>
              <option value="classroom">Seawoods classroom</option>
              <option value="online">Live online</option>
            </select>
          </label>
          <button type="submit" className="min-h-11 rounded-eduvert-8 bg-eduvert-action-primary px-4 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-50">Publish session</button>
        </fieldset>
      </form>
      {error ? <p role="alert" className="eduvert-body">{error}</p> : null}
      {notice ? <p role="status" className="eduvert-body text-eduvert-action-primary">{notice}</p> : null}
      <div className="border-t border-eduvert-border-subtle pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="eduvert-h4">Published sessions</h3>
          <button type="button" className={buttonClass} disabled={busy} onClick={() => { setError(""); setRevision(value => value + 1) }}>Refresh</button>
        </div>
        {sessions?.length ? (
          <ul className="mt-2 divide-y divide-eduvert-border-subtle">
            {sessions.map(session => (
              <li key={session.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 eduvert-body">
                <span>{liveClassLabel(session)}</span>
                <button type="button" className={buttonClass} disabled={busy}
                  aria-label={`Remove ${liveClassLabel(session)} from the website`}
                  onClick={() => void change({ action: "cancel", id: session.id }, "Session removed from the website. Existing requests remain in Admissions.")}>
                  Unlist
                </button>
              </li>
            ))}
          </ul>
        ) : !error ? (
          <p className="mt-2 eduvert-body text-eduvert-text-secondary">{sessions ? "No upcoming sessions are published." : "Loading published sessions…"}</p>
        ) : null}
      </div>
    </section>
  )
}
