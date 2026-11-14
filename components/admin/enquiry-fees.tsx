"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { courses } from "@/components/courses/course-data"
import { feeForSlug } from "@/components/program-fees"
import type { Enquiry } from "./admissions-model"
import { batchDate } from "./batch-model"
import { feeMoney, parsePaise, receivedPaise, type FeeChange, type FeeLedger, type PaymentKind, type StudentFees } from "./fee-model"

const field = "min-h-11 w-full min-w-0 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 eduvert-support"
const button = "min-h-11 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 eduvert-button hover:bg-eduvert-tint-blue disabled:opacity-50"
const primary = "min-h-11 rounded-eduvert-8 bg-eduvert-action-primary px-3 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-50"

type DemoFees = Record<string, FeeLedger[]>
const feeCourses = courses.map(({ slug, title }) => ({ slug, title, suggestedPaise: feeForSlug(slug)?.totalPaise ?? null }))

function today() {
  return new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10)
}

async function request(id: string, change?: FeeChange, signal?: AbortSignal): Promise<StudentFees> {
  const response = await fetch(`/api/admin/fees?${new URLSearchParams({ enquiryId: id })}`, {
    cache: "no-store", signal,
    ...(change ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(change) } : {}),
  })
  if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Reload the dashboard and sign in again.")
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "The fee request failed.")
  }
  return data as StudentFees
}

export function EnquiryFees({ enquiry, identity, demo, demoFees, onDemoFees, onChanged }: {
  enquiry: Enquiry
  identity: string
  demo: boolean
  demoFees?: FeeLedger[]
  onDemoFees: (id: string, ledgers: FeeLedger[]) => void
  onChanged: () => void
}) {
  const [live, setLive] = useState<StudentFees | null>(null)
  const [courseSlug, setCourseSlug] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [pending, setPending] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    if (demo) return
    const controller = new AbortController()
    request(enquiry.id, undefined, controller.signal)
      .then(data => { if (!controller.signal.aborted) setLive(data) })
      .catch(reason => { if (!controller.signal.aborted) setError(reason.message) })
    return () => controller.abort()
  }, [demo, enquiry.id, revision])

  const ledgers = demo ? demoFees ?? [] : live?.ledgers ?? []
  const options = demo ? feeCourses.filter(item => !enquiry.courseSlugs.length || enquiry.courseSlugs.includes(item.slug)
    || ledgers.some(ledger => ledger.courseSlug === item.slug)) : live?.courses ?? []
  const course = options.find(item => item.slug === courseSlug) ?? options[0]
  const ledger = ledgers.find(item => item.courseSlug === course?.slug)
  const received = receivedPaise(ledger)
  const balance = ledger ? ledger.agreedPaise - received : null

  async function save(change: FeeChange, message: string) {
    setError("")
    setNotice("")
    setPending(true)
    try {
      if (demo) onDemoFees(enquiry.id, updateSampleFees(ledgers, change, identity))
      else setLive(await request(enquiry.id, change))
      setNotice(message)
      onChanged()
      return true
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save fee details.")
      return false
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="grid min-w-0 gap-3 rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-tint-soft-blue p-4" aria-labelledby="student-fees-heading">
      <h3 id="student-fees-heading" className="eduvert-h4">Fees and payments</h3>
      {error ? <div className="flex flex-wrap items-center gap-2"><p role="alert" className="eduvert-support">{error}</p>
        {!demo ? <button type="button" className={button} disabled={pending}
          onClick={() => { setError(""); setRevision(value => value + 1) }}>Reload ledger</button> : null}
      </div> : null}
      <p role="status" className="eduvert-support text-eduvert-link empty:hidden">{notice}</p>
      {course ? (
        <>
          <label className="grid gap-1 eduvert-support font-eduvert-600">Fee ledger course
            <select className={field} value={course.slug} disabled={pending} onChange={event => {
              setCourseSlug(event.target.value); setNotice(""); setError("")
            }}>
              {options.map(item => <option value={item.slug} key={item.slug}>{item.title}</option>)}
            </select>
          </label>
          <dl className="grid grid-cols-1 gap-2 rounded-eduvert-8 bg-eduvert-surface-white p-3 min-[380px]:grid-cols-3">
            {[
              ["Agreed fee", ledger ? feeMoney(ledger.agreedPaise) : "Not set"],
              ["Received", feeMoney(received)],
              ["Outstanding", balance === null ? "—" : feeMoney(balance)],
            ].map(([label, value]) => <div key={label}><dt className="eduvert-support text-eduvert-text-secondary">{label}</dt>
              <dd className="eduvert-body font-eduvert-700">{value}</dd></div>)}
          </dl>
          {enquiry.status === "enrolled" ? (
            <>
              <FeeForm key={`${course.slug}:${ledger?.agreedPaise}`} suggested={ledger?.agreedPaise ?? course.suggestedPaise} pending={pending} onSave={amountPaise =>
                save({ action: "fee", courseSlug: course.slug, amountPaise, expectedFee: ledger?.agreedPaise ?? null }, "Agreed fee saved.")} />
              {balance !== null && balance > 0 ? <PaymentForm key={course.slug} balance={balance} pending={pending} onSave={change =>
                save({ ...change, courseSlug: course.slug }, "Payment recorded.")} /> : null}
            </>
          ) : <p className="eduvert-support text-eduvert-text-secondary">Mark the enquiry enrolled to set a fee or record a payment.</p>}
          {ledger?.payments.length ? (
            <div className="grid gap-2">
              <h4 className="eduvert-body font-eduvert-700">Payment history</h4>
              <ul className="divide-y divide-eduvert-border-subtle">
                {ledger.payments.map(payment => (
                  <li key={payment.id} className="grid gap-1 py-3 eduvert-support [overflow-wrap:anywhere]">
                    <strong>{payment.kind === "deposit" ? "Deposit" : "Instalment"} · {feeMoney(payment.amountPaise)}{payment.voidedAt ? " · Voided" : ""}</strong>
                    <p className="text-eduvert-text-secondary">{batchDate(payment.paidOn)} · Recorded by {payment.recordedBy}</p>
                    {payment.reference ? <p>Reference {payment.reference}</p> : null}
                    {payment.voidedAt ? (
                      <p>{payment.voidReason} · Voided by {payment.voidedBy}</p>
                    ) : (
                      <details className="w-full">
                        <summary className="min-h-11 w-fit cursor-pointer py-2 text-eduvert-link">Void incorrect entry</summary>
                        <form className="grid gap-2" onSubmit={event => {
                          event.preventDefault()
                          const reason = String(new FormData(event.currentTarget).get("reason") ?? "").trim()
                          if (reason) void save({ action: "void", courseSlug: course.slug, paymentId: payment.id, reason }, "Payment voided.")
                        }}>
                          <label className="grid gap-1">Reason for voiding<input name="reason" className={field} required maxLength={240} /></label>
                          <button className={`${button} justify-self-start`} disabled={pending}>Void payment</button>
                        </form>
                      </details>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : <p className="eduvert-support text-eduvert-text-secondary">No payments recorded.</p>}
        </>
      ) : !error ? <p className="eduvert-support">{demo || live ? "No course ledger available for this enquiry." : "Loading fee details…"}</p> : null}
    </section>
  )
}

function FeeForm({ suggested, pending, onSave }: {
  suggested: number | null; pending: boolean; onSave: (amount: number) => Promise<boolean>
}) {
  return (
    <form className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2" onSubmit={event => {
      event.preventDefault()
      const input = event.currentTarget.elements.namedItem("amount")
      if (!(input instanceof HTMLInputElement)) return
      const amount = parsePaise(input.value)
      if (amount === null) {
        input.setCustomValidity("Enter an amount from ₹0 to ₹10,00,000 with up to two decimal places.")
        input.reportValidity()
      } else void onSave(amount)
    }}>
      <label className="grid gap-1 eduvert-support font-eduvert-600">Agreed fee (₹, incl. GST)
        <input name="amount" inputMode="decimal" onChange={event => event.currentTarget.setCustomValidity("")}
          defaultValue={suggested === null ? "" : suggested / 100} required className={field} />
      </label>
      <button className={button} disabled={pending}>Save fee</button>
    </form>
  )
}

function PaymentForm({ balance, pending, onSave }: {
  balance: number; pending: boolean
  onSave: (change: Omit<Extract<FeeChange, { action: "record" }>, "courseSlug">) => Promise<boolean>
}) {
  const paymentId = useRef("")
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const element = event.currentTarget
    const form = new FormData(element)
    const amount = parsePaise(String(form.get("paymentAmount")))
    const input = element.elements.namedItem("paymentAmount")
    if (amount === null || amount <= 0 || amount > balance) {
      if (input instanceof HTMLInputElement) {
        input.setCustomValidity(`Enter an amount greater than zero and up to ${feeMoney(balance)}.`)
        input.reportValidity()
      }
      return
    }
    paymentId.current ||= crypto.randomUUID()
    if (await onSave({
      action: "record", paymentId: paymentId.current, amountPaise: amount, kind: form.get("kind") as PaymentKind,
      paidOn: String(form.get("paidOn")), reference: String(form.get("reference") ?? "").trim() || null,
    })) {
      paymentId.current = ""
      element.reset()
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-2">
      <h4 className="eduvert-body font-eduvert-700">Record a payment</h4>
      <fieldset disabled={pending} className="grid min-w-0 gap-2 min-[420px]:grid-cols-2">
        <label className="grid gap-1 eduvert-support">Payment type
          <select name="kind" className={field}><option value="deposit">Deposit</option><option value="instalment">Instalment</option></select>
        </label>
        <label className="grid gap-1 eduvert-support">Payment amount (₹)
          <input name="paymentAmount" inputMode="decimal" onChange={event => event.currentTarget.setCustomValidity("")} required className={field} />
        </label>
        <label className="grid gap-1 eduvert-support">Payment date (IST)
          <input name="paidOn" type="date" max={today()} defaultValue={today()} required className={field} />
        </label>
        <label className="grid gap-1 eduvert-support">Receipt or reference (optional)
          <input name="reference" maxLength={120} className={field} />
        </label>
      </fieldset>
      <button className={`${primary} justify-self-start`} disabled={pending}>Record payment</button>
    </form>
  )
}

function updateSampleFees(ledgers: FeeLedger[], change: FeeChange, identity: string): FeeLedger[] {
  const previous = ledgers.find(ledger => ledger.courseSlug === change.courseSlug)
  if (change.action !== "fee" && !previous) throw new Error("Set an agreed fee first.")
  const ledger: FeeLedger = previous ?? { courseSlug: change.courseSlug, agreedPaise: 0, payments: [] }
  let updated: FeeLedger
  if (change.action === "fee") {
    if (change.amountPaise < receivedPaise(ledger)) throw new Error("The agreed fee cannot be below the amount already received.")
    updated = { ...ledger, agreedPaise: change.amountPaise }
  } else if (change.action === "record") {
    if (receivedPaise(ledger) + change.amountPaise > ledger.agreedPaise) throw new Error("Payment exceeds the outstanding balance.")
    if (ledger.payments.some(item => item.id === change.paymentId)) return ledgers
    const entry = {
      id: change.paymentId, amountPaise: change.amountPaise, kind: change.kind, paidOn: change.paidOn, reference: change.reference,
      recordedBy: identity, voidedAt: null, voidedBy: null, voidReason: null,
    }
    updated = { ...ledger, payments: [entry, ...ledger.payments].sort((a, b) => b.paidOn.localeCompare(a.paidOn)) }
  } else {
    updated = { ...ledger, payments: ledger.payments.map(payment => payment.id === change.paymentId && !payment.voidedAt
      ? { ...payment, voidedAt: new Date().toISOString(), voidedBy: identity, voidReason: change.reason } : payment) }
  }
  return [...ledgers.filter(item => item.courseSlug !== change.courseSlug), updated]
}

export type { DemoFees }
