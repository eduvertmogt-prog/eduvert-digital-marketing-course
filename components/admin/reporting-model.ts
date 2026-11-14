import { istDayEnd } from "./admissions-model"

export const reportPeriods = {
  "30": "Last 30 days",
  "90": "Last 90 days",
  all: "All time",
} as const

export type ReportPeriod = keyof typeof reportPeriods
export type ReportDimension = "course" | "source"
export type ReportScope = { period: ReportPeriod; dimension: ReportDimension; key: string }
export type ReportDrilldown = ReportScope & { label: string; outcome: "all" | "active" | "enrolled" }

export interface ReportCounts {
  enquiries: number
  enrolled: number
  open: number
}

export interface ReportRow extends ReportCounts {
  key: string
  label: string
}

export interface AdmissionsReport {
  totals: ReportCounts
  courses: ReportRow[]
  sources: ReportRow[]
}

const day = 86_400_000

export function reportWindow(period: ReportPeriod, now = Date.now()) {
  const end = istDayEnd(now)
  return {
    start: period === "all" ? null : new Date(end.getTime() - Number(period) * day),
    end,
  }
}

export function normalizeSource(value: string | null) {
  const path = value?.trim().split(/[?#]/, 1)[0]
  if (!path || !/^\/([^/\s][^\s]*)?$/.test(path)) return ""
  return path.replace(/\/+$/, "") || "/"
}

export function sourceLabel(key: string) {
  if (key === "/") return "Homepage"
  return key || "Source page unknown"
}

export function sortReportRows(a: ReportRow, b: ReportRow) {
  return b.enrolled - a.enrolled || b.enquiries - a.enquiries || a.label.localeCompare(b.label)
}
