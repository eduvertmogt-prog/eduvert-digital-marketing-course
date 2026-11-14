import type { Status } from "./admissions-model"

export interface BatchDraft {
  courseSlug: string
  name: string
  startsOn: string
  endsOn: string | null
  capacity: number
  accepting: boolean
}

export interface Batch extends BatchDraft {
  id: string
  revision: number
  seated: number
  waiting: number
}

export interface BatchMember {
  batchId: string
  courseSlug: string
  enquiryId: string
  state: "seated" | "waitlisted"
  fullName: string
  status: Status
  addedAt: string
}

export type PlacementAction = "seat" | "waitlist" | "promote" | "remove"
export type BatchMutation =
  | { action: "create"; draft: BatchDraft }
  | { action: "edit"; draft: BatchDraft; batchId: string; revision: number }
  | { action: PlacementAction; batchId: string; enquiryId: string }

export interface BatchDirectory {
  batches: Batch[]
  courses: { slug: string; title: string }[]
}

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
})

export function batchDate(date: string) {
  return dateFormat.format(new Date(date + "T00:00:00Z"))
}

export function batchHasEnded(batch: Batch) {
  return Boolean(batch.endsOn && batch.endsOn < new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10))
}
