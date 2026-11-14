"use client"

import { useCallback, useState } from "react"
import type { EnquiryDetail } from "./admissions-model"
import { batchHasEnded, type BatchDirectory, type BatchMember, type BatchMutation } from "./batch-model"

async function request<T>(params: URLSearchParams, signal?: AbortSignal, change?: BatchMutation): Promise<T> {
  const response = await fetch(`/api/admin/batches?${params}`, {
    cache: "no-store",
    signal,
    ...(change ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(change) } : {}),
  })
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Reload the dashboard and sign in again.")
  }
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data && typeof data === "object" && "error" in data && typeof data.error === "string"
      ? data.error : "The batch request failed.")
  }
  return data as T
}

export interface BatchData {
  directory: (signal: AbortSignal) => Promise<BatchDirectory>
  members: (filter: { batchId: string } | { enquiryId: string }, signal: AbortSignal) => Promise<BatchMember[]>
  save: (change: BatchMutation) => Promise<void>
}

const demoCourses = [
  { slug: "digital-marketing", title: "Professional Digital Marketing with AI" },
  { slug: "seo-course-in-navi-mumbai", title: "Advanced SEO" },
  { slug: "sem-course", title: "SEM & Performance Marketing" },
  { slug: "smm-course", title: "Social Media Marketing & Meta Ads" },
  { slug: "data-analytics-python", title: "Data Analytics with Python & Excel" },
]

export function useBatchData(demo: boolean, records: EnquiryDetail[], logActivity: (id: string, note: string) => void) {
  const [directory, setDirectory] = useState<BatchDirectory | null>(null)
  const [placements, setPlacements] = useState<BatchMember[]>([])
  const getDirectory = useCallback(async (signal: AbortSignal) => {
    if (!demo) return request<BatchDirectory>(new URLSearchParams(), signal)
    if (directory) return directory
    const startsOn = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
    const initial: BatchDirectory = {
      courses: demoCourses,
      batches: [
        { id: "demo-flagship", courseSlug: "digital-marketing", name: "Flagship weekend batch", startsOn, endsOn: null, capacity: 6, seated: 0, waiting: 0, accepting: true, revision: 0 },
        { id: "demo-seo", courseSlug: "seo-course-in-navi-mumbai", name: "Advanced SEO weekday batch", startsOn, endsOn: null, capacity: 4, seated: 0, waiting: 0, accepting: true, revision: 0 },
      ],
    }
    setDirectory(initial)
    return initial
  }, [demo, directory])

  const getMembers = useCallback(async (filter: { batchId: string } | { enquiryId: string }, signal: AbortSignal) => {
    if (!demo) return request<BatchMember[]>(new URLSearchParams(filter), signal)
    return placements.filter(member => "batchId" in filter ? member.batchId === filter.batchId : member.enquiryId === filter.enquiryId)
      .map(member => ({ ...member, status: records.find(record => record.enquiry.id === member.enquiryId)?.enquiry.status ?? member.status }))
  }, [demo, placements, records])

  async function save(change: BatchMutation) {
    if (!demo) {
      await request(new URLSearchParams(), undefined, change)
      return
    }
    if (!directory) throw new Error("Load the batches first.")
    if (change.action === "create" || change.action === "edit") {
      const { name, startsOn, endsOn, capacity } = change.draft
      if (!name || !startsOn || !Number.isInteger(capacity) || capacity < 1 || capacity > 1000) {
        throw new Error("Enter a batch name, start date, and capacity from 1 to 1,000.")
      }
      if (endsOn && endsOn < startsOn) throw new Error("End date must be on or after the start date.")
    }
    if (change.action === "create") {
      setDirectory({ ...directory, batches: [...directory.batches, {
        ...change.draft, id: crypto.randomUUID(), revision: 0, seated: 0, waiting: 0,
      }] })
      return
    }
    const batch = directory.batches.find(item => item.id === change.batchId)
    if (!batch) throw new Error("Batch not found.")
    if (change.action === "edit") {
      if (change.revision !== batch.revision) throw new Error("This batch changed. Refresh it before editing.")
      if (change.draft.capacity < batch.seated) throw new Error("Capacity cannot be below the number of assigned seats.")
      setDirectory({ ...directory, batches: directory.batches.map(item => item.id === batch.id
        ? { ...item, ...change.draft, revision: item.revision + 1 } : item) })
      return
    }
    const enquiry = records.find(item => item.enquiry.id === change.enquiryId)?.enquiry
    if (!enquiry) throw new Error("Enquiry not found.")
    const existing = placements.find(item => item.enquiryId === enquiry.id && item.courseSlug === batch.courseSlug)
    const first = placements.find(item => item.batchId === batch.id && item.state === "waitlisted")
    if (change.action !== "remove") {
      if (!batch.accepting || batchHasEnded(batch)) throw new Error("This batch is not accepting learners.")
      if (enquiry.status === "closed" || enquiry.status === "spam" ||
        (change.action !== "waitlist" && enquiry.status !== "enrolled")) throw new Error("An enrolled enquiry is required to assign a seat.")
      if (enquiry.courseSlugs.length && !enquiry.courseSlugs.includes(batch.courseSlug)) throw new Error("This batch does not match the enquiry’s course.")
      if (change.action !== "waitlist" && batch.seated >= batch.capacity) throw new Error("This batch is full.")
      if (change.action === "seat" && first) throw new Error("Promote the first learner on the waitlist before assigning a new seat.")
      if (change.action === "promote" && first?.enquiryId !== enquiry.id) throw new Error("Only the first learner on this waitlist can be promoted.")
      if (existing && change.action !== "promote") throw new Error("This learner already has a placement for this course.")
    } else if (existing?.batchId !== batch.id) {
      throw new Error("This placement changed.")
    }
    const next = placements.filter(item => item !== existing)
    if (change.action !== "remove") {
      next.push({
        batchId: batch.id, courseSlug: batch.courseSlug, enquiryId: enquiry.id,
        fullName: enquiry.fullName, status: enquiry.status,
        state: change.action === "waitlist" ? "waitlisted" : "seated",
        addedAt: existing?.addedAt ?? new Date().toISOString(),
      })
    }
    setPlacements(next)
    setDirectory({ ...directory, batches: directory.batches.map(item => item.id === batch.id ? {
      ...item,
      seated: next.filter(member => member.batchId === item.id && member.state === "seated").length,
      waiting: next.filter(member => member.batchId === item.id && member.state === "waitlisted").length,
    } : item) })
    const verb = {
      seat: "Assigned a seat in", waitlist: "Added to waitlist for", promote: "Promoted from the waitlist into",
      remove: existing?.state === "seated" ? "Released seat in" : "Removed from waitlist for",
    }[change.action]
    logActivity(enquiry.id, `${verb} ${batch.name}.`)
  }

  return { directory: getDirectory, members: getMembers, save, placements }
}
