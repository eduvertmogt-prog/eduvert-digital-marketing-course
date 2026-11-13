"use client"

import { useEffect, useState, type FormEvent } from "react"
import {
  channelLabels, fromIstInput, isOpen, pageSize, statusLabels, toIstInput, viewLabels,
  type Channel, type Enquiry, type EnquiryDetail, type EnquiryPage, type EnquiryUpdate, type Status, type View,
} from "./admissions-model"
import { applySampleUpdate, createSampleEnquiries, samplePage } from "./sample-enquiries"

const queueTabs: View[] = ["active", "new", "due", "overdue", "mine", "enrolled", "all"]
const metrics: { view: View; note: string }[] = [
  { view: "new", note: "Waiting for a first response" },
  { view: "overdue", note: "Follow-ups past their scheduled time" },
  { view: "due", note: "Follow-ups still due today" },
  { view: "enrolled", note: "Enquiries marked as enrolled" },
]

const typeLabels: Record<string, string> = {
  free_demo: "Free demo", counsellor_callback: "Callback", course_enquiry: "Course enquiry",
  contact_message: "Contact message", career_support: "Career support",
}
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
})
const fieldClass = "min-h-11 w-full min-w-0 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 py-2 eduvert-support"
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 eduvert-button hover:bg-eduvert-tint-soft-blue disabled:opacity-50"
const primaryClass = "inline-flex min-h-11 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-4 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-50"

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "—"
}

async function api<T>(params: URLSearchParams, signal?: AbortSignal, body?: EnquiryUpdate): Promise<T> {
  const response = await fetch(`/api/admin/enquiries?${params}`, body ? {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  } : { cache: "no-store", signal })
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Staff session expired. Reload the page to sign in again.")
  }
  const data = await response.json()
  if (!response.ok) {
    const message = data && typeof data === "object" && "error" in data ? data.error : null
    throw new Error(typeof message === "string" ? message : "The request failed.")
  }
  return data as T
}

export function AdmissionsDashboard({ identity, demo = false }: { identity: string; demo?: boolean }) {
  const [records, setRecords] = useState(() => demo ? createSampleEnquiries() : [])
  const [view, setView] = useState<View>("active")
  const [term, setTerm] = useState("")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState<EnquiryPage | null>(null)
  const [queueError, setQueueError] = useState("")
  const [loading, setLoading] = useState(!demo)
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<EnquiryDetail | null>(null)
  const [detailError, setDetailError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (demo) return
    const controller = new AbortController()
    setLoading(true)
    setQueueError("")
    api<EnquiryPage>(new URLSearchParams({ view, q: query, page: String(page) }), controller.signal)
      .then(data => {
        if (controller.signal.aborted) return
        if (page > 0 && page * pageSize >= data.total) {
          setPage(Math.max(0, Math.ceil(data.total / pageSize) - 1))
          return
        }
        setResult(data)
      })
      .catch(error => { if (!controller.signal.aborted) setQueueError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [demo, page, query, revision, view])

  useEffect(() => {
    if (demo || !selected) return
    const controller = new AbortController()
    api<EnquiryDetail>(new URLSearchParams({ id: selected }), controller.signal)
      .then(data => { if (!controller.signal.aborted) setDetail(data) })
      .catch(error => { if (!controller.signal.aborted) setDetailError(error.message) })
    return () => controller.abort()
  }, [demo, selected])

  const queue = demo ? samplePage(records, view, query, page) : result
  const activeDetail = demo ? records.find(row => row.enquiry.id === selected) : detail ?? undefined

  function chooseView(next: View) {
    setView(next)
    setPage(0)
  }

  function openRecord(id: string) {
    setDetail(null)
    setDetailError("")
    setNotice("")
    setSelected(id)
  }

  async function save(id: string, change: EnquiryUpdate) {
    if (demo) setRecords(items => items.map(item => item.enquiry.id === id ? applySampleUpdate(item, change) : item))
    else {
      const updated = await api<EnquiryDetail>(new URLSearchParams({ id }), undefined, change)
      setDetail(current => current?.enquiry.id === id ? updated : current)
      setRevision(value => value + 1)
    }
    setNotice("Enquiry saved.")
  }

  return (
    <main className="min-h-dvh bg-eduvert-tint-soft-blue text-eduvert-text-primary">
      <header className="border-b border-eduvert-border-subtle bg-eduvert-surface-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-eduvert-8 bg-eduvert-action-primary eduvert-button text-eduvert-surface-white" aria-hidden="true">E</span>
            <p className="eduvert-body font-eduvert-700">EduVert <span className="font-eduvert-400 text-eduvert-text-secondary">/ Admissions</span></p>
          </div>
          <p className="break-all eduvert-support text-eduvert-text-secondary">{demo ? "Fictional data · Changes reset on reload" : identity}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-8 sm:py-8">
        <div>
          <h1 className="eduvert-h2 tracking-[-0.025em]">Admissions desk</h1>
          <p className="mt-2 eduvert-body text-eduvert-text-secondary">Triage enquiries, assign follow-ups, and track who enrols.</p>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white lg:grid-cols-4">
          {metrics.map(({ view: key, note }, index) => (
            <button key={key} type="button" onClick={() => chooseView(key)} aria-pressed={view === key}
              className={`min-w-0 border-eduvert-border-subtle p-3 text-left hover:bg-eduvert-tint-blue sm:p-5 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b lg:border-b-0" : ""} ${index === 1 ? "lg:border-r" : ""} ${view === key ? "bg-eduvert-tint-blue" : key === "overdue" ? "bg-eduvert-tint-yellow" : ""}`}>
              <span className="block eduvert-support font-eduvert-700">{viewLabels[key]}</span>
              <span className="block eduvert-h2 tabular-nums">{queue?.counts[key] ?? "—"}</span>
              <span className="mt-1 hidden eduvert-support text-eduvert-text-secondary sm:block">{note}</span>
            </button>
          ))}
        </div>

        <section aria-labelledby="queue-heading" className="min-w-0 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white">
          <div className="grid gap-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="queue-heading" className="eduvert-h3">{viewLabels[view]}</h2>
              {!demo ? <button type="button" className={buttonClass} onClick={() => setRevision(value => value + 1)}>Refresh</button> : null}
            </div>
            <div aria-label="Filter enquiries" className="flex flex-wrap gap-2">
              {queueTabs.map(key => (
                <button key={key} type="button" onClick={() => chooseView(key)} aria-pressed={view === key}
                  className={`${buttonClass} ${view === key ? "border-eduvert-action-primary text-eduvert-action-primary" : ""}`}>{viewLabels[key]}</button>
              ))}
            </div>
            <form className="flex flex-wrap items-end gap-2" onSubmit={event => {
              event.preventDefault()
              setQuery(term.trim())
              setPage(0)
            }}>
              <label className="grid min-w-0 flex-1 basis-48 gap-1 eduvert-support font-eduvert-600">
                Search enquiries
                <input className={fieldClass} value={term} onChange={event => setTerm(event.target.value)} maxLength={120}
                  placeholder="Name, contact, course or owner" />
              </label>
              <button className={buttonClass}>Search</button>
              {query ? <button type="button" className={buttonClass} onClick={() => { setQuery(""); setTerm(""); setPage(0) }}>Clear</button> : null}
            </form>
          </div>

          <div aria-busy={loading} className="border-t border-eduvert-border-subtle">
            {queueError ? <p role="alert" className="p-4 eduvert-body text-eduvert-text-secondary">{queueError}</p> :
              loading ? <p role="status" className="p-4 eduvert-body text-eduvert-text-secondary">Loading enquiries…</p> :
                !queue?.rows.length ? <p className="p-4 eduvert-body text-eduvert-text-secondary">No enquiries match this view.</p> :
                  <EnquiryRows rows={queue.rows} onOpen={openRecord} />}
          </div>
          {queue && !queueError && !loading ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-eduvert-border-subtle px-4 py-3 sm:px-6">
              <p className="eduvert-support text-eduvert-text-secondary">{queue.total ? `${page * pageSize + 1}–${page * pageSize + queue.rows.length} of ${queue.total}` : "0 enquiries"}</p>
              {queue.total > pageSize ? <div className="flex gap-2">
                <button type="button" className={buttonClass} disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <button type="button" className={buttonClass} disabled={(page + 1) * pageSize >= queue.total} onClick={() => setPage(page + 1)}>Next</button>
              </div> : null}
            </div>
          ) : null}
        </section>
      </div>

      {selected ? (
        <EnquiryDialog key={selected} detail={activeDetail} error={detailError} identity={identity} notice={notice} demo={demo}
          onClose={() => setSelected(null)} onSave={change => save(selected, change)} />
      ) : null}
    </main>
  )
}

function EnquiryRows({ rows, onOpen }: { rows: Enquiry[]; onOpen: (id: string) => void }) {
  return (
    <ul className="divide-y divide-eduvert-border-subtle">
      {rows.map(row => (
        <li key={row.id}>
          <button type="button" onClick={() => onOpen(row.id)}
            className="grid w-full min-w-0 gap-2 px-4 py-3 text-left hover:bg-eduvert-tint-soft-blue sm:px-6 lg:grid-cols-[1.15fr_1.35fr_.9fr_.85fr_auto] lg:items-center lg:gap-4">
            <span className="min-w-0 break-words">
              <span className="block eduvert-body font-eduvert-700">{row.fullName}</span>
              <span className="block eduvert-support text-eduvert-text-secondary">{typeLabels[row.type] ?? row.type}</span>
            </span>
            <span className="min-w-0 break-words eduvert-support text-eduvert-text-secondary">{row.courses.join(", ") || "Course not specified"}</span>
            <span className="min-w-0 break-words eduvert-support text-eduvert-text-secondary">{row.assignedTo || "Unassigned"}</span>
            <span className="eduvert-support text-eduvert-text-secondary">{row.nextActionAt ? `Follow up · ${formatDate(row.nextActionAt)}` : `Received · ${formatDate(row.createdAt)}`}</span>
            <span className={`w-fit rounded-eduvert-8 px-2 py-1 eduvert-support font-eduvert-700 ${row.status === "new" ? "bg-eduvert-tint-yellow" : "bg-eduvert-tint-blue"}`}>
              {statusLabels[row.status]}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function EnquiryDialog({ detail, error, identity, notice, demo, onClose, onSave }: {
  detail?: EnquiryDetail
  error: string
  identity: string
  notice: string
  demo: boolean
  onClose: () => void
  onSave: (change: EnquiryUpdate) => Promise<void>
}) {
  return (
    <dialog ref={node => { if (node && !node.open) node.showModal() }} onClose={onClose} aria-labelledby="admissions-detail-heading"
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-lg border-l border-eduvert-border-subtle bg-eduvert-surface-white p-0 text-eduvert-text-primary backdrop:bg-eduvert-text-primary/35">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-eduvert-border-subtle bg-eduvert-surface-white px-4 py-4 sm:px-6">
        <h2 id="admissions-detail-heading" className="min-w-0 break-words eduvert-h3">{detail?.enquiry.fullName ?? "Enquiry details"}</h2>
        <button type="button" className={buttonClass} onClick={onClose}>Close</button>
      </div>
      <div className="grid gap-6 p-4 sm:p-6">
        {error ? <p role="alert" className="eduvert-body">{error}</p> : detail ? (
          <>
            <dl className="grid grid-cols-2 gap-4 rounded-eduvert-12 bg-eduvert-tint-soft-blue p-4 eduvert-support">
              <DetailItem label="Phone">{detail.enquiry.phone ? demo ? detail.enquiry.phone : <a href={`tel:${detail.enquiry.phone.replace(/[^+\d]/g, "")}`} className="text-eduvert-link underline">{detail.enquiry.phone}</a> : "—"}</DetailItem>
              <DetailItem label="Email">{detail.enquiry.email ? demo ? detail.enquiry.email : <a href={`mailto:${encodeURIComponent(detail.enquiry.email)}`} className="text-eduvert-link underline">{detail.enquiry.email}</a> : "—"}</DetailItem>
              <DetailItem label="Course">{detail.enquiry.courses.join(", ") || "Unspecified"}</DetailItem>
              <DetailItem label="Preferred callback">{detail.enquiry.preferredTime || "Any time"}</DetailItem>
              <DetailItem label="Source page">{detail.enquiry.originPage || "Unknown"}</DetailItem>
              <DetailItem label="Received (IST)">{formatDate(detail.enquiry.createdAt)}</DetailItem>
            </dl>
            <EnquiryEditor key={detail.enquiry.updatedAt} enquiry={detail.enquiry} identity={identity} onSave={onSave} />
            <p role="status" className="eduvert-support text-eduvert-link empty:hidden">{notice}</p>
            <section aria-labelledby="activity-heading" className="border-t border-eduvert-border-subtle pt-4">
              <h3 id="activity-heading" className="eduvert-h4">Recent activity</h3>
              {!detail.activity.length ? <p className="mt-2 eduvert-support text-eduvert-text-secondary">No follow-up activity yet.</p> : (
                <ol className="mt-2 divide-y divide-eduvert-border-subtle">
                  {detail.activity.map(item => (
                    <li key={item.id} className="grid gap-1 py-3">
                      <p className="break-words eduvert-support font-eduvert-700">{channelLabels[item.channel]} · {item.author ?? "Staff"}</p>
                      <p className="eduvert-support text-eduvert-text-secondary">{formatDate(item.createdAt)} IST</p>
                      <p className="whitespace-pre-wrap break-words eduvert-body">{item.note}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        ) : <p role="status" className="eduvert-body">Loading enquiry…</p>}
      </div>
    </dialog>
  )
}

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0"><dt className="text-eduvert-text-secondary">{label}</dt><dd className="break-words font-eduvert-600">{children}</dd></div>
}

function EnquiryEditor({ enquiry, identity, onSave }: {
  enquiry: Enquiry
  identity: string
  onSave: (change: EnquiryUpdate) => Promise<void>
}) {
  const [status, setStatus] = useState(enquiry.status)
  const [owner, setOwner] = useState(enquiry.assignedTo ?? "")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const element = event.currentTarget
    const form = new FormData(element)
    setPending(true)
    setError("")
    try {
      await onSave({
        updatedAt: enquiry.updatedAt, status, assignedTo: owner.trim(),
        channel: form.get("channel") as Channel,
        nextActionAt: isOpen(status) ? fromIstInput(String(form.get("next") ?? "")) : null,
        note: String(form.get("note") ?? "").trim(),
      })
      const note = element.elements.namedItem("note")
      if (note instanceof HTMLTextAreaElement) note.value = ""
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <h3 className="eduvert-h4">Update enquiry</h3>
      <label className="grid gap-1 eduvert-support font-eduvert-600">Status
        <select className={fieldClass} value={status} onChange={event => setStatus(event.target.value as Status)}>
          {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <div className="flex items-end gap-2">
        <label className="grid min-w-0 flex-1 gap-1 eduvert-support font-eduvert-600">Assigned counsellor
          <input className={fieldClass} value={owner} onChange={event => setOwner(event.target.value)} maxLength={120} placeholder="Staff email" />
        </label>
        <button type="button" className={buttonClass} onClick={() => setOwner(identity)}>Assign to me</button>
      </div>
      <label className="grid gap-1 eduvert-support font-eduvert-600">Next follow-up (IST)
        <input name="next" type="datetime-local" className={`${fieldClass} disabled:opacity-50`} defaultValue={toIstInput(enquiry.nextActionAt)} disabled={!isOpen(status)} />
      </label>
      {!isOpen(status) ? <p className="eduvert-support text-eduvert-text-secondary">A final status clears the scheduled follow-up.</p> : null}
      <label className="grid gap-1 eduvert-support font-eduvert-600">Activity type
        <select name="channel" className={fieldClass} defaultValue="other">
          {Object.entries(channelLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <label className="grid gap-1 eduvert-support font-eduvert-600">Activity note
        <textarea name="note" rows={3} maxLength={2000} placeholder="Record what happened and what you agreed to do next." className={fieldClass} />
      </label>
      {error ? <p role="alert" className="eduvert-support text-eduvert-action-hover">{error}</p> : null}
      <button className={`${primaryClass} justify-self-start`} disabled={pending}>{pending ? "Saving…" : "Save enquiry"}</button>
    </form>
  )
}
