"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import type { Enquiry } from "./admissions-model"
import type { BatchData } from "./batch-data"
import { batchDate, batchHasEnded, type Batch, type BatchDirectory, type BatchDraft, type BatchMember, type BatchMutation, type PlacementAction } from "./batch-model"

const panel = "min-w-0 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-4 sm:p-5"
const field = "min-h-11 w-full min-w-0 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 py-2 eduvert-support"
const action = "min-h-11 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 eduvert-button hover:bg-eduvert-tint-soft-blue disabled:opacity-50"
const primary = "min-h-11 rounded-eduvert-8 bg-eduvert-action-primary px-3 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover disabled:opacity-50"

function useBatchDirectory(data: BatchData, externalRevision = 0) {
  const load = data.directory
  const [directory, setDirectory] = useState<BatchDirectory | null>(null)
  const [revision, setRevision] = useState(0)
  const [error, setError] = useState("")
  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(result => {
      if (!controller.signal.aborted) { setDirectory(result); setError("") }
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message) })
    return () => controller.abort()
  }, [load, revision, externalRevision])
  return { directory, error, refresh: () => setRevision(value => value + 1) }
}

function useBatchMembers(data: BatchData, batchId: string, enquiryId?: string, externalRevision = 0) {
  const load = data.members
  const key = enquiryId ?? batchId
  const [result, setResult] = useState<{ key: string; rows: BatchMember[]; error: string } | null>(null)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (!key) return
    const controller = new AbortController()
    load(enquiryId ? { enquiryId } : { batchId }, controller.signal).then(rows => {
      if (!controller.signal.aborted) setResult({ key, rows, error: "" })
    }).catch(reason => {
      if (!controller.signal.aborted) setResult({ key, rows: [], error: reason.message })
    })
    return () => controller.abort()
  }, [batchId, enquiryId, key, load, revision, externalRevision])
  return { members: result?.key === key ? result : null, refresh: () => setRevision(value => value + 1) }
}

function useBatchSave(data: BatchData, reload: () => void) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  async function save(change: BatchMutation, success: string) {
    setPending(true)
    setError("")
    setNotice("")
    try {
      await data.save(change)
      setNotice(success)
      return true
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save the batch change.")
      return false
    } finally {
      reload()
      setPending(false)
    }
  }
  return { pending, error, notice, save }
}

function Feedback({ error, notice }: { error: string; notice: string }) {
  return <>
    {error ? <p role="alert" className="eduvert-support text-eduvert-action-hover">{error}</p> : null}
    <p role="status" className="eduvert-support text-eduvert-link empty:hidden">{notice}</p>
  </>
}

export function AdmissionsBatches({ data, onOpenEnquiry, revision }: {
  data: BatchData
  revision: number
  onOpenEnquiry: (id: string, button: HTMLButtonElement) => void
}) {
  const { directory, error, refresh } = useBatchDirectory(data, revision)
  const [course, setCourse] = useState("")
  const [selected, setSelected] = useState("")
  const [editor, setEditor] = useState<"create" | "edit" | null>(null)
  const available = directory?.batches.filter(batch => !course || batch.courseSlug === course) ?? []
  const batch = available.find(item => item.id === selected) ?? available[0]
  const roster = useBatchMembers(data, batch?.id ?? "", undefined, revision)
  const change = useBatchSave(data, () => { refresh(); roster.refresh() })

  return (
    <section aria-labelledby="batches-heading" className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="batches-heading" className="eduvert-h3">Batches and seats</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={action} onClick={() => { refresh(); roster.refresh() }}>Refresh batches</button>
          <button type="button" className={primary} disabled={!directory || change.pending} onClick={() => setEditor("create")}>New batch</button>
        </div>
      </div>
      <Feedback error={error || change.error} notice={change.notice} />
      {directory ? (
        <>
          {editor ? <BatchEditor key={editor === "create" ? "create" : batch?.id}
            batch={editor === "edit" ? batch : undefined} courses={directory.courses} pending={change.pending}
            onCancel={() => setEditor(null)} onSave={async (draft, expectedRevision) => {
              const mutation: BatchMutation = editor === "edit" && batch
                ? { action: "edit", batchId: batch.id, revision: expectedRevision, draft }
                : { action: "create", draft }
              if (await change.save(mutation, editor === "edit" ? "Batch updated." : "Batch created.")) {
                if (editor === "create") { setCourse(draft.courseSlug); setSelected("") }
                setEditor(null)
              }
            }} /> : null}
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(17rem,1fr)_minmax(0,2fr)]">
            <div className={panel}>
              <label className="grid gap-1 eduvert-support font-eduvert-600">Filter batches by course
                <select className={field} value={course} onChange={event => { setCourse(event.target.value); setSelected(""); setEditor(null) }}>
                  <option value="">All courses</option>
                  {directory.courses.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
                </select>
              </label>
              <ul className="mt-4 divide-y divide-eduvert-border-subtle">
                {available.map(item => (
                  <li key={item.id}>
                    <button type="button" aria-pressed={batch?.id === item.id} onClick={() => { setSelected(item.id); setEditor(null) }}
                      className={`grid w-full gap-1 rounded-eduvert-8 p-3 text-left [overflow-wrap:anywhere] ${batch?.id === item.id ? "bg-eduvert-tint-blue" : "hover:bg-eduvert-tint-soft-blue"}`}>
                      <strong className="eduvert-body">{item.name}</strong>
                      <span className="eduvert-support text-eduvert-text-secondary">{batchDate(item.startsOn)} · {item.seated}/{item.capacity} seats · {item.waiting} waiting</span>
                    </button>
                  </li>
                ))}
              </ul>
              {!available.length ? <p className="mt-4 eduvert-support text-eduvert-text-secondary">No batches for this course.</p> : null}
            </div>
            {batch ? (
              <div className={`${panel} grid content-start gap-5`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 [overflow-wrap:anywhere]">
                    <p className="eduvert-support text-eduvert-text-secondary">{directory.courses.find(item => item.slug === batch.courseSlug)?.title ?? batch.courseSlug}</p>
                    <h3 className="eduvert-h4">{batch.name}</h3>
                    <p className="eduvert-support text-eduvert-text-secondary">
                      {batchDate(batch.startsOn)}{batch.endsOn ? ` – ${batchDate(batch.endsOn)}` : ""}
                      {" · "}{batchHasEnded(batch) ? "Ended" : batch.accepting ? "Accepting learners" : "Closed to new placements"}
                    </p>
                  </div>
                  <button type="button" className={action} disabled={change.pending} onClick={() => setEditor("edit")}>Edit batch</button>
                </div>
                <dl className="grid grid-cols-3 gap-2 rounded-eduvert-12 bg-eduvert-tint-soft-blue p-3">
                  {[["Seats used", batch.seated], ["Seats left", batch.capacity - batch.seated], ["Waitlisted", batch.waiting]].map(([label, count]) => (
                    <div key={label}><dt className="eduvert-support">{label}</dt><dd className="eduvert-h3">{count}</dd></div>
                  ))}
                </dl>
                {roster.members?.error ? <p role="alert">{roster.members.error}</p> : roster.members ? (
                  <BatchRoster batch={batch} members={roster.members.rows} pending={change.pending}
                    onOpen={onOpenEnquiry} onAction={(member, operation) => change.save(
                      { action: operation, batchId: batch.id, enquiryId: member.enquiryId },
                      operation === "promote" ? "Learner assigned a seat." : member.state === "seated" ? "Seat released." : "Removed from waitlist.",
                    )} />
                ) : <p role="status" className="eduvert-support">Loading roster…</p>}
              </div>
            ) : (
              <div className={panel}><p className="eduvert-body text-eduvert-text-secondary">Create a batch to start assigning seats from the CRM.</p></div>
            )}
          </div>
        </>
      ) : !error ? <p role="status">Loading batches…</p> : null}
    </section>
  )
}

function BatchEditor({ batch, courses, pending, onCancel, onSave }: {
  batch?: Batch
  courses: BatchDirectory["courses"]
  pending: boolean
  onCancel: () => void
  onSave: (draft: BatchDraft, expectedRevision: number) => Promise<void>
}) {
  const [expectedRevision] = useState(batch?.revision ?? 0)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    void onSave({
      courseSlug: batch?.courseSlug ?? String(form.get("course")),
      name: String(form.get("name")).trim(), startsOn: String(form.get("start")), endsOn: String(form.get("end") || "") || null,
      capacity: Number(form.get("capacity")), accepting: form.has("accepting"),
    }, expectedRevision)
  }

  return (
    <form onSubmit={submit} className={`${panel} grid gap-3`}>
      <h3 className="eduvert-h4">{batch ? "Edit batch details" : "Create a batch"}</h3>
      <fieldset disabled={pending} className="grid min-w-0 gap-3 sm:grid-cols-2">
        <Control label="Course"><select name="course" className={field} defaultValue={batch?.courseSlug} disabled={Boolean(batch)} required>
          {courses.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select></Control>
        <Control label="Batch name"><input className={field} name="name" maxLength={100} defaultValue={batch?.name} required /></Control>
        <Control label="Start date"><input className={field} name="start" type="date" defaultValue={batch?.startsOn} required /></Control>
        <Control label="End date (optional)"><input className={field} name="end" type="date" defaultValue={batch?.endsOn ?? ""} /></Control>
        <Control label="Seat capacity"><input className={field} name="capacity" type="number" min={Math.max(1, batch?.seated ?? 0)} max={1000} step={1} defaultValue={batch?.capacity ?? 8} required /></Control>
        <label className="flex min-h-11 items-center gap-2 self-end eduvert-support">
          <input name="accepting" type="checkbox" defaultChecked={batch?.accepting ?? true} className="accent-eduvert-action-primary" />
          Accepting new placements
        </label>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={primary} disabled={pending}>{pending ? "Saving…" : "Save batch"}</button>
        <button type="button" className={action} disabled={pending} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid min-w-0 gap-1 eduvert-support font-eduvert-600">{label}{children}</label>
}

function BatchRoster({ batch, members, pending, onOpen, onAction }: {
  batch: Batch
  members: BatchMember[]
  pending: boolean
  onOpen: (id: string, button: HTMLButtonElement) => void
  onAction: (member: BatchMember, action: PlacementAction) => Promise<boolean>
}) {
  const seated = members.filter(member => member.state === "seated")
  const waiting = members.filter(member => member.state === "waitlisted")

  return (
    <>
      <section>
        <h4 className="eduvert-body font-eduvert-700">Assigned seats</h4>
        {seated.length ? <ul className="mt-2 divide-y divide-eduvert-border-subtle">{seated.map(member => (
          <li key={member.enquiryId} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <button type="button" className="min-h-11 [overflow-wrap:anywhere] text-left eduvert-support text-eduvert-link underline"
              onClick={event => onOpen(member.enquiryId, event.currentTarget)}>{member.fullName}</button>
            <button type="button" className={action} disabled={pending} onClick={() => void onAction(member, "remove")}>Release seat</button>
          </li>
        ))}</ul> : <p className="mt-1 eduvert-support text-eduvert-text-secondary">No seats assigned yet.</p>}
      </section>
      <section>
        <h4 className="eduvert-body font-eduvert-700">Waitlist</h4>
        {waiting.length ? (
          <>
            <p className="mt-1 eduvert-support text-eduvert-text-secondary">Promote in order when the first learner is enrolled and a seat is free.</p>
            <ol className="mt-2 divide-y divide-eduvert-border-subtle">{waiting.map((member, index) => (
              <li key={member.enquiryId} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <button type="button" className="min-h-11 [overflow-wrap:anywhere] text-left eduvert-support text-eduvert-link underline"
                  onClick={event => onOpen(member.enquiryId, event.currentTarget)}>{index + 1}. {member.fullName}</button>
                <div className="flex flex-wrap gap-2">
                  {index === 0 ? <button type="button" className={primary} disabled={pending || member.status !== "enrolled"
                    || batch.seated >= batch.capacity || !batch.accepting || batchHasEnded(batch)}
                    onClick={() => void onAction(member, "promote")}>Promote to seat</button> : null}
                  <button type="button" className={action} disabled={pending} onClick={() => void onAction(member, "remove")}>Remove</button>
                </div>
              </li>
            ))}</ol>
          </>
        ) : <p className="mt-1 eduvert-support text-eduvert-text-secondary">Nobody is waiting.</p>}
      </section>
    </>
  )
}

export function EnquiryBatchPlacement({ enquiry, data, onChanged }: {
  enquiry: Enquiry
  data: BatchData
  onChanged: () => void
}) {
  const { directory, error, refresh } = useBatchDirectory(data)
  const roster = useBatchMembers(data, "", enquiry.id)
  const [selected, setSelected] = useState("")
  const change = useBatchSave(data, () => { refresh(); roster.refresh(); onChanged() })
  const placements = roster.members?.rows ?? []
  const options = directory?.batches.filter(batch => batch.accepting && !batchHasEnded(batch)
    && (!enquiry.courseSlugs.length || enquiry.courseSlugs.includes(batch.courseSlug))
    && !placements.some(item => item.courseSlug === batch.courseSlug)) ?? []
  const batch = options.find(item => item.id === selected) ?? options[0]

  return (
    <section className="grid gap-3 rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-tint-soft-blue p-4" aria-labelledby="enquiry-batch-heading">
      <h3 id="enquiry-batch-heading" className="eduvert-h4">Batch placement</h3>
      <Feedback error={error || roster.members?.error || change.error} notice={change.notice} />
      {placements.map(member => (
        <div key={member.batchId} className="flex flex-wrap items-center justify-between gap-2 border-b border-eduvert-border-subtle pb-2">
          <p className="min-w-0 [overflow-wrap:anywhere] eduvert-support">
            <strong>{directory?.batches.find(item => item.id === member.batchId)?.name ?? "Batch"}</strong>
            {" · "}{member.state === "seated" ? "Seat assigned" : "Waitlisted"}
            {member.enquiryId !== enquiry.id ? " from another enquiry" : ""}
          </p>
          {member.enquiryId === enquiry.id ? (
            <button type="button" className={action} disabled={change.pending} onClick={() => void change.save(
              { action: "remove", batchId: member.batchId, enquiryId: enquiry.id },
              member.state === "seated" ? "Seat released." : "Removed from waitlist.",
            )}>{member.state === "seated" ? "Release seat" : "Remove from waitlist"}</button>
          ) : null}
        </div>
      ))}
      {directory && roster.members && !roster.members.error ? (
        batch && enquiry.status !== "closed" && enquiry.status !== "spam" ? (
          <>
            <Control label="Choose a batch">
              <select className={field} value={batch.id} onChange={event => setSelected(event.target.value)} disabled={change.pending}>
                {options.map(item => <option key={item.id} value={item.id}>{item.name} · {batchDate(item.startsOn)} · {item.capacity - item.seated} free</option>)}
              </select>
            </Control>
            <div className="flex flex-wrap gap-2">
              {enquiry.status === "enrolled" ? (
                <button type="button" className={primary} disabled={change.pending || batch.seated >= batch.capacity || batch.waiting > 0}
                  onClick={() => void change.save({ action: "seat", batchId: batch.id, enquiryId: enquiry.id }, "Seat assigned.")}>Assign seat</button>
              ) : null}
              <button type="button" className={action} disabled={change.pending}
                onClick={() => void change.save({ action: "waitlist", batchId: batch.id, enquiryId: enquiry.id }, "Added to waitlist.")}>Add to waitlist</button>
            </div>
            {enquiry.status !== "enrolled" ? <p className="eduvert-support text-eduvert-text-secondary">Save the enquiry as enrolled to assign a seat.</p>
              : batch.waiting > 0 ? <p className="eduvert-support text-eduvert-text-secondary">This batch has a waitlist. Promotions are managed in Batches.</p> : null}
          </>
        ) : !placements.length ? <p className="eduvert-support text-eduvert-text-secondary">No eligible batches available.</p> : null
      ) : !error && !roster.members?.error ? <p role="status" className="eduvert-support">Loading placements…</p> : null}
    </section>
  )
}
