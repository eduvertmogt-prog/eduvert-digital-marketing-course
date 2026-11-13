import { isOpen, istDayEnd, pageSize, viewLabels, type EnquiryDetail, type EnquiryPage, type EnquiryUpdate, type View } from "@/components/admin/admissions-model"

export const sampleUser = "counsellor@example.test"

export function createSampleEnquiries(): EnquiryDetail[] {
  const now = Date.now()
  const date = (offset: number) => new Date(now + offset).toISOString()
  const hour = 3_600_000
  const todayAt = new Date((now + istDayEnd(now).getTime()) / 2).toISOString()
  const people = [
    { name: "Aanya Mehta", course: "Professional Digital Marketing with AI", status: "new", intent: "free_demo", next: null, owner: null, page: "/programs/professional-digital-marketing" },
    { name: "Rohan Shah", course: "Advanced SEO", status: "contacted", intent: "course_enquiry", next: date(-4 * hour), owner: sampleUser, page: "/seo-course-in-navi-mumbai" },
    { name: "Isha Verma", course: "Data Analytics with Python & Excel", status: "qualified", intent: "counsellor_callback", next: todayAt, owner: sampleUser, page: "/data-analytics-python" },
    { name: "Neel Desai", course: "SEM & Performance Marketing", status: "new", intent: "free_demo", next: null, owner: null, page: "/sem-course" },
    { name: "Mira Nair", course: "Social Media Marketing & Meta Ads", status: "qualified", intent: "free_demo", next: date(36 * hour), owner: "admissions@example.test", page: "/smm-course" },
    { name: "Arjun Rao", course: "Professional Digital Marketing with AI", status: "enrolled", intent: "free_demo", next: null, owner: sampleUser, page: "/" },
  ] as const

  return people.map((person, i) => {
    const id = String(i + 1)
    const updatedAt = date(-(i + 1) * hour)
    return {
      enquiry: {
        id, fullName: person.name, email: person.name.toLowerCase().replace(" ", ".") + "@example.test",
        phone: null, type: person.intent, status: person.status, courses: [person.course],
        originPage: person.page, preferredTime: ["morning", "afternoon", "evening"][i % 3],
        assignedTo: person.owner, createdAt: date(-(i + 2) * hour), updatedAt, nextActionAt: person.next,
      },
      activity: person.next ? [{
        id, author: person.owner, channel: "phone", note: "Discussed course goals and availability for a follow-up.",
        nextActionAt: person.next, createdAt: updatedAt,
      }] : [],
    }
  })
}

export function samplePage(records: EnquiryDetail[], view: View, query: string, page: number): EnquiryPage {
  const now = Date.now()
  const end = istDayEnd(now).getTime()
  const rows = records.map(record => record.enquiry)
  const views: Record<View, typeof rows> = {
    active: rows.filter(row => isOpen(row.status)),
    new: rows.filter(row => row.status === "new"),
    due: rows.filter(row => isOpen(row.status) && row.nextActionAt && Date.parse(row.nextActionAt) >= now && Date.parse(row.nextActionAt) < end),
    overdue: rows.filter(row => isOpen(row.status) && row.nextActionAt && Date.parse(row.nextActionAt) < now),
    mine: rows.filter(row => isOpen(row.status) && row.assignedTo?.toLowerCase() === sampleUser),
    enrolled: rows.filter(row => row.status === "enrolled"),
    all: rows,
  }
  const counts = Object.fromEntries(Object.keys(viewLabels).map(key => [key, views[key as View].length])) as EnquiryPage["counts"]
  const filtered = views[view].filter(row => [row.fullName, row.email, row.phone, row.assignedTo, ...row.courses]
    .some(value => value?.toLowerCase().includes(query.toLowerCase())))
  if (view === "due" || view === "overdue") filtered.sort((a, b) => (a.nextActionAt ?? "").localeCompare(b.nextActionAt ?? ""))
  return { rows: filtered.slice(page * pageSize, (page + 1) * pageSize), counts, total: filtered.length }
}

export function applySampleUpdate(record: EnquiryDetail, change: EnquiryUpdate): EnquiryDetail {
  const { enquiry, activity } = record
  const nextActionAt = isOpen(change.status) ? change.nextActionAt : null
  const assignedTo = change.assignedTo || null
  const note = [
    enquiry.status === change.status ? "" : `Status changed from ${enquiry.status} to ${change.status}.`,
    enquiry.assignedTo === assignedTo ? "" : assignedTo ? `Assigned to ${assignedTo}.` : "Assignment cleared.",
    enquiry.nextActionAt === nextActionAt ? "" : nextActionAt ? "Follow-up scheduled." : "Follow-up cleared.",
    change.note,
  ].filter(Boolean).join("\n")
  if (!note) return record
  const createdAt = new Date().toISOString()
  return {
    enquiry: { ...enquiry, status: change.status, assignedTo, nextActionAt, updatedAt: createdAt },
    activity: [{ id: crypto.randomUUID(), author: sampleUser, channel: change.note ? change.channel : "other", note, nextActionAt, createdAt }, ...activity],
  }
}
