import { normalizeSource, reportWindow, sortReportRows, sourceLabel, type AdmissionsReport, type ReportPeriod, type ReportScope, type ReportRow } from "./reporting-model"
import { isOpen, istDayEnd, pageSize, viewLabels, type EnquiryDetail, type EnquiryPage, type EnquiryUpdate, type View } from "@/components/admin/admissions-model"

export const sampleUser = "counsellor@example.test"

export function createSampleEnquiries(): EnquiryDetail[] {
  const now = Date.now()
  const date = (offset: number) => new Date(now + offset).toISOString()
  const hour = 3_600_000
  const todayAt = new Date((now + istDayEnd(now).getTime()) / 2).toISOString()
  const people = [
    { name: "Aanya Mehta", slug: "digital-marketing", course: "Professional Digital Marketing with AI", status: "new", intent: "free_demo", next: null, owner: null, page: "/programs/professional-digital-marketing" },
    { name: "Rohan Shah", slug: "seo-course-in-navi-mumbai", course: "Advanced SEO", status: "contacted", intent: "course_enquiry", next: date(-4 * hour), owner: sampleUser, page: "/seo-course-in-navi-mumbai" },
    { name: "Isha Verma", slug: "data-analytics-python", course: "Data Analytics with Python & Excel", status: "qualified", intent: "counsellor_callback", next: todayAt, owner: sampleUser, page: "/data-analytics-python" },
    { name: "Neel Desai", slug: "sem-course", course: "SEM & Performance Marketing", status: "new", intent: "free_demo", next: null, owner: null, page: "/sem-course" },
    { name: "Mira Nair", slug: "smm-course", course: "Social Media Marketing & Meta Ads", status: "qualified", intent: "free_demo", next: date(36 * hour), owner: "admissions@example.test", page: "/smm-course" },
    { name: "Arjun Rao", slug: "digital-marketing", course: "Professional Digital Marketing with AI", status: "enrolled", intent: "free_demo", next: null, owner: sampleUser, page: "/" },
  ] as const

  const records: EnquiryDetail[] = people.map((person, i) => {
    const id = String(i + 1)
    const updatedAt = date(-(i + 1) * hour)
    return {
      enquiry: {
        id, fullName: person.name, email: person.name.toLowerCase().replace(" ", ".") + "@example.test",
        phone: null, type: person.intent, status: person.status, courses: [person.course], courseSlugs: [person.slug],
        originPage: person.page, preferredTime: ["morning", "afternoon", "evening"][i % 3],
        assignedTo: person.owner, createdAt: date(-(i + 2) * hour), updatedAt, nextActionAt: person.next,
      },
      activity: person.next ? [{
        id, author: person.owner, channel: "phone", note: "Discussed course goals and availability for a follow-up.",
        nextActionAt: person.next, createdAt: updatedAt,
      }] : [],
    }
  })
  records.push({
    enquiry: {
      ...records[5].enquiry, id: "7", fullName: "Kavya Sen", email: "kavya.sen@example.test",
      courses: ["Advanced SEO", "SEM & Performance Marketing"],
      courseSlugs: ["seo-course-in-navi-mumbai", "sem-course"],
      originPage: "/programs/", createdAt: date(-45 * 24 * hour),
    },
    activity: [],
  }, {
    enquiry: {
      ...records[0].enquiry, id: "8", fullName: "Dev Patel", email: "dev.patel@example.test",
      courses: [], courseSlugs: [], originPage: null, status: "closed",
    },
    activity: [],
  })
  return records
}

export function samplePage(records: EnquiryDetail[], view: View, query: string, page: number, scope?: ReportScope): EnquiryPage {
  const now = Date.now()
  const end = istDayEnd(now).getTime()
  const rows = records.map(record => record.enquiry).filter(row => !scope || inReport(row, scope))
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
  const filtered = views[view].filter(row => [row.fullName, row.email, row.phone, row.assignedTo, row.originPage, ...row.courses]
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

function inPeriod(row: EnquiryDetail["enquiry"], period: ReportPeriod) {
  const time = Date.parse(row.createdAt)
  const { start, end } = reportWindow(period)
  return row.status !== "spam" && (!start || time >= start.getTime()) && time < end.getTime()
}

function inReport(row: EnquiryDetail["enquiry"], scope: ReportScope) {
  return inPeriod(row, scope.period) && (scope.dimension === "source"
    ? normalizeSource(row.originPage) === scope.key
    : scope.key ? row.courseSlugs.includes(scope.key) : !row.courseSlugs.length)
}

export function sampleReport(records: EnquiryDetail[], period: ReportPeriod): AdmissionsReport {
  const totals = { enquiries: 0, open: 0, enrolled: 0 }
  const courses = new Map<string, ReportRow>()
  const sources = new Map<string, ReportRow>()
  function tally(counts: typeof totals, row: EnquiryDetail["enquiry"]) {
    counts.enquiries++
    if (row.status === "enrolled") counts.enrolled++
    if (isOpen(row.status)) counts.open++
  }
  function group(groups: Map<string, ReportRow>, key: string, label: string, row: EnquiryDetail["enquiry"]) {
    const counts = groups.get(key) ?? { key, label, enquiries: 0, enrolled: 0, open: 0 }
    tally(counts, row)
    groups.set(key, counts)
  }
  for (const { enquiry } of records) {
    if (!inPeriod(enquiry, period)) continue
    tally(totals, enquiry)
    const source = normalizeSource(enquiry.originPage)
    group(sources, source, sourceLabel(source), enquiry)
    if (!enquiry.courseSlugs.length) group(courses, "", "Course not specified", enquiry)
    enquiry.courseSlugs.forEach((key, i) => group(courses, key, enquiry.courses[i] ?? key, enquiry))
  }
  return { totals, courses: [...courses.values()].sort(sortReportRows), sources: [...sources.values()].sort(sortReportRows) }
}
