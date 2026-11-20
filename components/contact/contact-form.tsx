"use client"

import { useState, type FormEvent } from "react"

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus("sending")
    setError("")
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          message: data.get("message"),
          intent: "free_demo",
          source: "contact-live-class",
        }),
      })
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
      if (!response.ok || !result?.ok) throw new Error(result?.error || "Unable to send your request. Please try again.")
      form.reset()
      setStatus("sent")
    } catch (error) {
      setStatus("idle")
      setError(error instanceof Error ? error.message : "Unable to send your request. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="eduvert-h3 text-eduvert-text-primary">Book a Live Class</h2>
      <p className="eduvert-body text-eduvert-text-secondary">Share your details and we’ll contact you to arrange your session.</p>
      <fieldset disabled={status === "sending"} className="grid gap-4">
        <div className="grid gap-3 min-[700px]:grid-cols-2">
          <Field label="Name" name="name" autoComplete="name" />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Message (optional)" name="message" multiline />
        <button type="submit" className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-50 min-[1100px]:w-fit">
          {status === "sending" ? "Sending…" : "Book My Live Class"}
        </button>
      </fieldset>
      {error ? <p role="alert" className="eduvert-support text-eduvert-text-primary">{error}</p> : null}
      {status === "sent" ? (
        <p className="eduvert-support text-eduvert-text-secondary" role="status">
          Request received. EduVert will contact you to arrange your live class.
        </p>
      ) : null}
    </form>
  )
}

function Field({ label, name, type = "text", autoComplete, multiline = false }: FieldProps) {
  const controlClass = "w-full bg-transparent eduvert-body text-eduvert-text-primary outline-none placeholder:text-eduvert-text-secondary"

  return (
    <label className="eduvert-field flex flex-col gap-1 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3.5 py-2.5">
      <span className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">{label}</span>
      {multiline ? (
        <textarea name={name} maxLength={1000} rows={3} className={`${controlClass} resize-y`} />
      ) : (
        <input name={name} type={type} required autoComplete={autoComplete} className={controlClass} />
      )}
    </label>
  )
}

type FormStatus = "idle" | "sending" | "sent"

interface FieldProps {
  label: string
  name: string
  type?: "text" | "tel" | "email"
  autoComplete?: string
  multiline?: boolean
}
