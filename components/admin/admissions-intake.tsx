"use client"

import { useEffect, useState, type FormEvent } from "react"
import { intakeHasClosed, intakeMessage, type IntakeSettings } from "@/components/intake-model"

const endpoint = "/api/admin/intake"
const fieldClass = "min-h-11 w-full rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 py-2 eduvert-body"

async function requestIntake(signal?: AbortSignal, settings?: IntakeSettings): Promise<IntakeSettings> {
  const response = await fetch(endpoint, {
    cache: "no-store",
    signal,
    ...(settings ? {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    } : {}),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) {
    const message = data && typeof data === "object" && "error" in data ? data.error : null
    throw new Error(typeof message === "string" ? message : "Unable to reach the intake editor. Reload and try again.")
  }
  return data as IntakeSettings
}

export function AdmissionsIntake() {
  const [settings, setSettings] = useState<IntakeSettings | null>(null)
  const [reload, setReload] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    requestIntake(controller.signal)
      .then(data => { if (!controller.signal.aborted) setSettings(data) })
      .catch((error: Error) => { if (!controller.signal.aborted) setError(error.message) })
    return () => controller.abort()
  }, [reload])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!settings || saving) return
    const form = new FormData(event.currentTarget)
    setSaving(true)
    setError("")
    setNotice("")
    try {
      const updated = await requestIntake(undefined, {
        closesOn: String(form.get("closesOn")),
        seatsRemaining: Number(form.get("seatsRemaining")),
        enabled: form.has("enabled"),
        revision: settings.revision,
      })
      setSettings(updated)
      setNotice("Intake announcement saved.")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save the announcement.")
    } finally {
      setSaving(false)
    }
  }

  function reloadSettings() {
    setSettings(null)
    setError("")
    setNotice("")
    setReload(value => value + 1)
  }

  const visible = settings && settings.enabled && settings.seatsRemaining > 0 && !intakeHasClosed(settings.closesOn)
  return (
    <section aria-labelledby="intake-heading" className="max-w-2xl space-y-5 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 id="intake-heading" className="eduvert-h3">Next intake</h2>
          <p className="eduvert-body text-eduvert-text-secondary">Edit the announcement on the homepage and flagship Program page.</p>
        </div>
        <button type="button" onClick={reloadSettings} disabled={saving || (!settings && !error)}
          className="min-h-11 rounded-eduvert-8 border border-eduvert-border-subtle px-3 eduvert-button hover:bg-eduvert-tint-soft-blue disabled:opacity-50">
          Reload
        </button>
      </div>
      {error ? <p role="alert" className="eduvert-body font-eduvert-600">{error}</p> : null}
      {notice ? <p role="status" className="eduvert-body text-eduvert-action-primary">{notice}</p> : null}
      {settings ? (
        <form key={settings.revision} onSubmit={save}>
          <fieldset disabled={saving} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 eduvert-support font-eduvert-600">
                Application deadline
                <input type="date" name="closesOn" defaultValue={settings.closesOn} required className={fieldClass} />
              </label>
              <label className="grid gap-1.5 eduvert-support font-eduvert-600">
                Seats remaining
                <input type="number" name="seatsRemaining" defaultValue={settings.seatsRemaining} min={0} max={1000} step={1} required className={fieldClass} />
              </label>
            </div>
            <label className="flex min-h-11 items-center gap-2 eduvert-body">
              <input type="checkbox" name="enabled" className="size-4 accent-eduvert-action-primary" defaultChecked={settings.enabled} />
              Show announcement on the website
            </label>
            <p className="eduvert-support text-eduvert-text-secondary">The announcement hides when seats reach zero or the deadline passes in India Standard Time.</p>
            <p className="rounded-eduvert-8 bg-eduvert-tint-soft-blue px-3 py-2 eduvert-support">
              {visible ? intakeMessage(settings) : "The saved announcement is hidden."}
            </p>
            <button type="submit" className="min-h-11 justify-self-start rounded-eduvert-8 bg-eduvert-action-primary px-4 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-50">
              {saving ? "Saving…" : "Save announcement"}
            </button>
          </fieldset>
        </form>
      ) : error ? null : <p role="status" className="eduvert-body text-eduvert-text-secondary">Loading announcement…</p>}
    </section>
  )
}
