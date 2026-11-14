import { and, gte, lt, ne, sql, type SQL } from "drizzle-orm"
import type { Db } from "@/db/client"
import { courses } from "@/components/courses/course-data"
import { reportWindow, sortReportRows, sourceLabel, type AdmissionsReport, type ReportCounts, type ReportPeriod, type ReportRow, type ReportScope } from "@/components/admin/reporting-model"
import { enquiries } from "@/db/schema"

const courseNames = new Map(courses.map(course => [course.slug, course.title]))

// Mirror normalizeSource for legacy paths. Invalid or missing paths share one bucket.
const sourcePath = sql`split_part(split_part(trim(coalesce(${enquiries.originPage}, '')), '?', 1), '#', 1)`
const sourceKey = sql`case when ${sourcePath} ~ '^/([^/[:space:]][^[:space:]]*)?$'
  then coalesce(nullif(rtrim(${sourcePath}, '/'), ''), '/') else '' end`

function reportPopulation(period: ReportPeriod) {
  const { start, end } = reportWindow(period)
  return and(
    ne(enquiries.status, "spam"),
    start ? gte(enquiries.createdAt, start) : undefined,
    lt(enquiries.createdAt, end),
  )
}

export function reportEnquiryFilter(scope: ReportScope): SQL | undefined {
  const interest = sql`select 1 from enquiry_course_interests i where i.enquiry_id = ${enquiries.id}`
  const matches = scope.dimension === "source"
    ? sql`${sourceKey} = ${scope.key}`
    : scope.key
      ? sql`exists (${interest} and i.course_slug = ${scope.key})`
      : sql`not exists (${interest})`
  return and(reportPopulation(scope.period), matches)
}

type RawRow = {
  dimension: "total" | "course" | "source"
  key: string
  label: string | null
  enquiries: number | string
  enrolled: number | string
  open: number | string
}

export async function getAdmissionsReport(db: Db, period: ReportPeriod): Promise<AdmissionsReport> {
  const measures = sql`
    count(*) as enquiries,
    count(*) filter (where status = 'enrolled') as enrolled,
    count(*) filter (where status in ('new', 'contacted', 'qualified')) as open
  `
  const result = await db.execute<RawRow>(sql`
    with cohort as (
      select ${enquiries.id} as id, ${enquiries.status} as status, ${sourceKey} as source
      from ${enquiries} where ${reportPopulation(period)}
    )
    select 'total' as dimension, '' as key, null as label, ${measures} from cohort
    union all
    select 'course', coalesce(i.course_slug, ''), max(i.course_label), ${measures}
      from cohort left join enquiry_course_interests i on i.enquiry_id = cohort.id
      group by coalesce(i.course_slug, '')
    union all
    select 'source', source, null, ${measures} from cohort group by source
  `)
  const report: AdmissionsReport = { totals: { enquiries: 0, enrolled: 0, open: 0 }, courses: [], sources: [] }

  for (const row of result.rows) {
    const counts: ReportCounts = { enquiries: Number(row.enquiries), enrolled: Number(row.enrolled), open: Number(row.open) }
    if (row.dimension === "total") {
      report.totals = counts
      continue
    }
    const item: ReportRow = {
      ...counts, key: row.key,
      label: row.dimension === "source" ? sourceLabel(row.key)
        : row.key ? courseNames.get(row.key) ?? row.label ?? row.key : "Course not specified",
    }
    if (row.dimension === "course") report.courses.push(item)
    else report.sources.push(item)
  }

  report.courses.sort(sortReportRows)
  report.sources.sort(sortReportRows)
  return report
}
