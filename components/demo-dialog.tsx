"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { demoHref } from "@/components/site-nav"
import type { DemoIntent, PreferredTime } from "@/db/demo-enquiries"

/**
 * Site-wide demo/callback/enquiry dialog.
 *
 * Plain words: every "Book a Free Demo" link on the site keeps its href
 * (so no-JS still jumps to the homepage hero section), but when JS runs
 * this provider catches those clicks and opens a dialog instead. Course
 * context travels on data attributes the course pages add:
 * `data-demo-course-slug`, `data-demo-course-label`,
 * `data-demo-intent` identifies the request the visitor wants to make.
 * Tech words: delegated click interception in one effect, native <dialog>
 * for modal/Esc/backdrop/focus semantics, animated close via a closing
 * state before .close().
 */
export function DemoDialogProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<DemoRequest | null>(null)
  const [openCount, setOpenCount] = useState(0)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.(`a[href="${demoHref}"]`)
      if (!(anchor instanceof HTMLAnchorElement)) return
      event.preventDefault()
      triggerRef.current = anchor
      const intentAttr = anchor.dataset.demoIntent
      setRequest({
        intent:
          intentAttr === "counsellor_callback" || intentAttr === "course_enquiry" || intentAttr === "admission_request"
            ? intentAttr
            : "free_demo",
        courseSlug: anchor.dataset.demoCourseSlug || undefined,
        courseLabel: anchor.dataset.demoCourseLabel || undefined,
        liveClassSessionId: anchor.dataset.demoSessionId || undefined,
        liveClassLabel: anchor.dataset.demoSessionLabel || undefined,
        originPage: window.location.pathname,
      })
      setOpenCount((n) => n + 1)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  function handleClosed() {
    setRequest(null)
    triggerRef.current?.focus?.()
    triggerRef.current = null
  }

  return (
    <>
      {children}
      {request ? (
        <DemoDialog key={openCount} request={request} onClosed={handleClosed} />
      ) : null}
    </>
  )
}

interface DemoRequest {
  intent: DemoIntent
  courseSlug?: string
  courseLabel?: string
  liveClassSessionId?: string
  liveClassLabel?: string
  originPage?: string
}

const CLOSE_MS = 170

function DemoDialog({ request, onClosed }: { request: DemoRequest; onClosed: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [serverError, setServerError] = useState("")
  const [successName, setSuccessName] = useState("there")
  const closeTimer = useRef<number | null>(null)

  const requestClose = useCallback(() => {
    if (status === "sending") return
    setClosing(true)
    closeTimer.current = window.setTimeout(() => {
      dialogRef.current?.close()
      onClosed()
    }, CLOSE_MS)
  }, [status, onClosed])

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  // Keep Tab inside the dialog while it is open.
  function trapTab(event: React.KeyboardEvent) {
    if (event.key !== "Tab") return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusables = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    )
    const items = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"))
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="demo-dialog-title"
      className={`demo-dialog${closing ? " is-closing" : ""}`}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose()
      }}
      onKeyDown={trapTab}
    >
      <div className="demo-panel">
        <div className="demo-art" aria-hidden="true">
          <img src="/images/demo-session-workspace.webp" width={800} height={1200} alt="" />
        </div>
        <div className="demo-body">
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close dialog"
            className="demo-close"
            disabled={status === "sending"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {status === "success" ? (
            <DemoSuccess request={request} name={successName} onDone={requestClose} />
          ) : (
            <DemoForm
              request={request}
              status={status}
              serverError={serverError}
              onSubmit={async (values) => {
                setStatus("sending")
                setServerError("")
                try {
                  const response = await fetch("/api/demo", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      ...values,
                      intent: request.intent,
                      courseSlug: request.courseSlug,
                      courseLabel: request.courseLabel,
                      originPage: request.originPage,
                      liveClassSessionId: request.liveClassSessionId,
                    }),
                  })
                  const payload = (await response.json()) as { ok: boolean; error?: string }
                  if (!payload.ok) throw new Error(payload.error || "Please try again.")
                  setSuccessName(values.fullName.trim().split(/\s+/)[0] ?? "there")
                  setStatus("success")
                } catch (error) {
                  setServerError(error instanceof Error ? error.message : "Please try again.")
                  setStatus("error")
                }
              }}
            />
          )}
        </div>
      </div>
    </dialog>
  )
}

type FormStatus = "idle" | "sending" | "success" | "error"

interface DemoValues {
  fullName: string
  email: string
  phone: string
  preferredTime: PreferredTime | null
}

function DemoForm({
  request,
  status,
  serverError,
  onSubmit,
}: {
  request: DemoRequest
  status: FormStatus
  serverError: string
  onSubmit: (values: DemoValues) => Promise<void>
}) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [preferredTime, setPreferredTime] = useState<PreferredTime | null>(null)
  const [touched, setTouched] = useState(false)
  const sending = status === "sending"

  const copy = dialogCopy(request)
  const nameError = fullName.trim().length < 2 ? "Please share your name." : ""
  const emailError =
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? "That email doesn't look right." : ""
  const phoneError =
    !/^[\d\s+\-()]{10,16}$/.test(phone) ? "Please share a 10-digit mobile number." : ""

  return (
    <form
      className="demo-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        setTouched(true)
        if (nameError || emailError || phoneError) return
        void onSubmit({ fullName, email, phone, preferredTime })
      }}
    >
      <p className="ce-1 eduvert-support font-eduvert-700 tracking-[0.09em] text-eduvert-action-primary">
        {copy.eyebrow}
      </p>
      <h2 id="demo-dialog-title" className="ce-2 eduvert-h3 tracking-[-0.02em] text-eduvert-text-primary">
        {copy.title}
      </h2>
      <p className="ce-2 eduvert-body text-eduvert-text-secondary">{copy.sub}</p>
      {request.liveClassLabel ? (
        <p className="ce-3 demo-course-chip">Selected session · <strong>{request.liveClassLabel}</strong></p>
      ) : request.courseLabel ? (
        <p className="ce-3 demo-course-chip">
          Enquiring about: <strong>{request.courseLabel}</strong>
        </p>
      ) : null}
      <div className="ce-3 demo-fields">
        <label className="demo-field eduvert-field">
          <span>Name</span>
          <input
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            autoFocus
            aria-invalid={touched && Boolean(nameError)}
            aria-describedby={touched && nameError ? "demo-name-error" : undefined}
          />
          {touched && nameError ? <em id="demo-name-error">{nameError}</em> : null}
        </label>
        <label className="demo-field eduvert-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={touched && Boolean(emailError)}
            aria-describedby={touched && emailError ? "demo-email-error" : undefined}
          />
          {touched && emailError ? <em id="demo-email-error">{emailError}</em> : null}
        </label>
        <label className="demo-field eduvert-field">
          <span>Mobile number</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            inputMode="tel"
            aria-invalid={touched && Boolean(phoneError)}
            aria-describedby={touched && phoneError ? "demo-phone-error" : undefined}
          />
          {touched && phoneError ? <em id="demo-phone-error">{phoneError}</em> : null}
        </label>
        {!request.liveClassSessionId ? <fieldset className="demo-times">
          <legend>
            Preferred time to call <i>(optional)</i>
          </legend>
          <div role="group" aria-label="Preferred time to call">
            {timeChips.map((chip) => {
              const selected = preferredTime === chip.value
              return (
                <button
                  key={chip.value}
                  type="button"
                  aria-pressed={selected}
                  className={selected ? "is-selected" : ""}
                  onClick={() => setPreferredTime(selected ? null : chip.value)}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        </fieldset> : null}
      </div>
      {serverError ? (
        <p className="demo-error" role="alert">
          {serverError}
        </p>
      ) : null}
      <button type="submit" className="ce-4 demo-submit" disabled={sending}>
        {sending ? "Sending…" : copy.submit}
      </button>
      <p className="demo-consent">EduVert uses these details only to respond to your enquiry.</p>
    </form>
  )
}

function DemoSuccess({
  request,
  name,
  onDone,
}: {
  request: DemoRequest
  name: string
  onDone: () => void
}) {
  return (
    <div className="demo-success">
      <span className="demo-tick" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
          <path d="M9 14.5l3.5 3.5L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 id="demo-dialog-title" className="eduvert-h3 tracking-[-0.02em] text-eduvert-text-primary">
        Request received
      </h2>
      {request.liveClassLabel ? (
        <p className="eduvert-body text-eduvert-text-secondary">
          Thanks {name}. We’ll contact you to confirm joining details for <strong>{request.liveClassLabel}</strong>.
        </p>
      ) : request.intent === "admission_request" ? (
        <p className="eduvert-body text-eduvert-text-secondary">
          Thanks {name}. Admissions will contact you about availability and next steps.
        </p>
      ) : (
        <p className="eduvert-body text-eduvert-text-secondary">
          Thanks {name}. We&apos;ll call you within 24 hours
          {request.courseLabel ? (
            <>{" "}about <strong>{request.courseLabel}</strong></>
          ) : (
            " about your demo session"
          )}
          .
        </p>
      )}
      <button type="button" className="demo-submit" onClick={onDone} autoFocus>
        Done
      </button>
    </div>
  )
}

function dialogCopy(request: DemoRequest): DialogCopy {
  if (request.liveClassSessionId) {
    return {
      eyebrow: "LIVE CLASS",
      title: "Book a Live Class",
      sub: "Share your details so EduVert can confirm your session and send joining instructions.",
      submit: "Book My Live Class",
    }
  }
  if (request.intent === "admission_request") {
    return {
      eyebrow: "ADMISSIONS",
      title: "Request Admission",
      sub: "Share your details and the admissions team will contact you about seat availability and next steps.",
      submit: "Send Admission Request",
    }
  }
  if (request.intent === "counsellor_callback") {
    return {
      eyebrow: "COUNSELLOR",
      title: "Talk to Our Counsellor",
      sub: "Share your details and a counsellor will call you back.",
      submit: "Request a Callback",
    }
  }
  if (request.intent === "course_enquiry") {
    return {
      eyebrow: "ENQUIRY",
      title: "Enquire About This Course",
      sub: "Share your details and we'll send you fees, batches and syllabus.",
      submit: "Send Enquiry",
    }
  }
  return {
    eyebrow: "DEMO SESSION",
    title: "Schedule a Demo Session",
    sub: "Share your details, and we'll get in touch to schedule your session.",
    submit: "Book My Live Class",
  }
}

interface DialogCopy {
  eyebrow: string
  title: string
  sub: string
  submit: string
}

const timeChips: { value: PreferredTime; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
]

export type { DemoIntent }
