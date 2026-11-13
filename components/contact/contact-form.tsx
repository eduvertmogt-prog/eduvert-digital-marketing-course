"use client"

import { useState, type FormEvent } from "react"

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const name = String(data.get("name") ?? "").trim()
    const phone = String(data.get("phone") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()
    const body = [`Name: ${name}`, `Phone: ${phone}`, `Email: ${email}`, "", message].join("\n")
    const mailto = `mailto:${enquiryEmail}?subject=${encodeURIComponent("EduVert enquiry")}&body=${encodeURIComponent(body)}`

    setStatus("ready")
    window.location.href = mailto
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="eduvert-h3 text-eduvert-text-primary">Send us a message</h2>
      <div className="grid gap-3 min-[700px]:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Message" name="message" multiline />
      <button type="submit" className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
        Send Message
      </button>
      {status === "ready" ? (
        <p className="eduvert-support text-eduvert-text-secondary" role="status">
          Your email app should open with this enquiry. You can also call or email EduVert directly.
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
        <textarea name={name} required rows={4} className={`${controlClass} resize-y`} />
      ) : (
        <input name={name} type={type} required autoComplete={autoComplete} className={controlClass} />
      )}
    </label>
  )
}

const enquiryEmail = "communication@eduvert.co"

type FormStatus = "idle" | "ready"

interface FieldProps {
  label: string
  name: string
  type?: "text" | "tel" | "email"
  autoComplete?: string
  multiline?: boolean
}
