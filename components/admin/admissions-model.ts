export const statuses = ["new", "contacted", "qualified", "enrolled", "closed", "spam"] as const
export type Status = (typeof statuses)[number]

export const channels = ["phone", "whatsapp", "email", "in_person", "other"] as const
export type Channel = (typeof channels)[number]

export const statusLabels: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  enrolled: "Enrolled",
  closed: "Closed",
  spam: "Spam",
}

export const channelLabels: Record<Channel, string> = {
  phone: "Phone call",
  whatsapp: "WhatsApp",
  email: "Email",
  in_person: "In person",
  other: "Internal note",
}

export const viewLabels = {
  active: "Open enquiries",
  new: "New",
  due: "Due today",
  overdue: "Overdue",
  mine: "Assigned to me",
  enrolled: "Enrolled",
  all: "All enquiries",
} as const
export type View = keyof typeof viewLabels
export const pageSize = 20

export interface Enquiry {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  type: string
  status: Status
  courses: string[]
  originPage: string | null
  preferredTime: string | null
  assignedTo: string | null
  createdAt: string
  updatedAt: string
  nextActionAt: string | null
}

export interface Activity {
  id: string
  author: string | null
  channel: Channel
  note: string
  nextActionAt: string | null
  createdAt: string
}

export interface EnquiryDetail {
  enquiry: Enquiry
  activity: Activity[]
}

export interface EnquiryPage {
  rows: Enquiry[]
  total: number
  counts: Record<View, number>
}

export interface EnquiryUpdate {
  updatedAt: string
  status: Status
  assignedTo: string
  channel: Channel
  note: string
  nextActionAt: string | null
}

export function isOpen(status: Status) {
  return status === "new" || status === "contacted" || status === "qualified"
}

const istOffset = 330 * 60 * 1000

export function istDayEnd(now = Date.now()) {
  return new Date(Math.floor((now + istOffset) / 86_400_000 + 1) * 86_400_000 - istOffset)
}

export function fromIstInput(value: string) {
  return value ? new Date(value + "+05:30").toISOString() : null
}

export function toIstInput(value: string | null) {
  return value ? new Date(Date.parse(value) + istOffset).toISOString().slice(0, 16) : ""
}
