"use client"

import { useEffect, useState } from "react"
import { reportPeriods, type AdmissionsReport, type ReportDimension, type ReportDrilldown, type ReportPeriod, type ReportRow } from "./reporting-model"

const control = "min-h-11 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 eduvert-support font-eduvert-600"
const formatCount = new Intl.NumberFormat("en-IN")
const formatPercent = new Intl.NumberFormat("en-IN", { style: "percent", maximumFractionDigits: 1 })

function conversion(enrolled: number, enquiries: number) {
  return enquiries ? formatPercent.format(enrolled / enquiries) : "—"
}

interface ReportingProps {
  period: ReportPeriod
  onPeriod: (period: ReportPeriod) => void
  onDrilldown: (scope: ReportDrilldown) => void
  loadReport: (period: ReportPeriod, signal: AbortSignal) => Promise<AdmissionsReport>
  sample?: AdmissionsReport
}

export function AdmissionsReporting({ period, onPeriod, onDrilldown, loadReport, sample }: ReportingProps) {
  const [result, setResult] = useState<AdmissionsReport | null>(null)
  const [error, setError] = useState("")
  const [revision, setRevision] = useState(0)
  const [sort, setSort] = useState<"enrolled" | "enquiries" | "conversion">("enrolled")

  const isDemo = sample !== undefined
  useEffect(() => {
    if (isDemo) return
    const controller = new AbortController()
    setResult(null)
    setError("")
    loadReport(period, controller.signal)
      .then(data => { if (!controller.signal.aborted) setResult(data) })
      .catch(reason => { if (!controller.signal.aborted) setError(reason.message) })
    return () => controller.abort()
  }, [loadReport, period, revision, isDemo])

  const report = sample ?? result
  function open(dimension: ReportDimension, row: ReportRow, outcome: ReportDrilldown["outcome"]) {
    onDrilldown({ period, dimension, key: row.key, label: row.label, outcome })
  }

  return (
    <section aria-labelledby="report-heading" className="grid min-w-0 gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 id="report-heading" className="eduvert-h3">Course and source performance</h2>
          <p className="mt-1 eduvert-support text-eduvert-text-secondary">Compare enquiries received in the selected period and see how many are now enrolled.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="grid gap-1 eduvert-support font-eduvert-600">Enquiry period (IST)
            <select className={control} value={period} onChange={event => onPeriod(event.target.value as ReportPeriod)}>
              {Object.entries(reportPeriods).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 eduvert-support font-eduvert-600">Sort breakdowns by
            <select className={control} value={sort} onChange={event => setSort(event.target.value as typeof sort)}>
              <option value="enrolled">Enrolments</option>
              <option value="enquiries">Enquiries</option>
              <option value="conversion">Conversion rate</option>
            </select>
          </label>
          {!isDemo && !error ? (
            <button type="button" className={`${control} self-end hover:bg-eduvert-tint-blue`} onClick={() => setRevision(value => value + 1)}>
              Refresh report
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="grid justify-items-start gap-2 rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-surface-white p-4">
          <p role="alert" className="eduvert-body">{error}</p>
          <button type="button" className={control} onClick={() => setRevision(value => value + 1)}>Retry report</button>
        </div>
      ) : !report ? <p role="status" className="eduvert-body">Loading reports…</p> : (
        <>
          <dl className="grid grid-cols-2 divide-eduvert-border-subtle overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white sm:grid-cols-4 sm:divide-x">
            {[
              ["Enquiries", formatCount.format(report.totals.enquiries)],
              ["Enrolled", formatCount.format(report.totals.enrolled)],
              ["Still open", formatCount.format(report.totals.open)],
              ["Conversion rate", conversion(report.totals.enrolled, report.totals.enquiries)],
            ].map(([label, value]) => (
              <div key={label} className="p-4 sm:p-5">
                <dt className="eduvert-support font-eduvert-700">{label}</dt>
                <dd className="eduvert-h2 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="eduvert-support text-eduvert-text-secondary">Conversion rate is enrolled enquiries ÷ all enquiries in the selected period, excluding spam.</p>
          <ReportBreakdown title="By course interest" rows={report.courses} sort={sort} onOpen={(row, outcome) => open("course", row, outcome)}>
            An enquiry can list more than one course. Course rows can overlap, and enrolment reflects the enquiry’s status.
          </ReportBreakdown>
          <ReportBreakdown title="By source page" rows={report.sources} sort={sort} onOpen={(row, outcome) => open("source", row, outcome)}>
            The source is the page where the enquiry started.
          </ReportBreakdown>
        </>
      )}
    </section>
  )
}

function ReportBreakdown({ title, rows, sort, onOpen, children }: {
  title: string
  rows: ReportRow[]
  sort: "enrolled" | "enquiries" | "conversion"
  onOpen: (row: ReportRow, outcome: ReportDrilldown["outcome"]) => void
  children: React.ReactNode
}) {
  const sorted = [...rows].sort((a, b) => sort === "conversion"
    ? b.enrolled / b.enquiries - a.enrolled / a.enquiries || b.enquiries - a.enquiries
    : b[sort] - a[sort])

  return (
    <section className="min-w-0 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white">
      <div className="border-b border-eduvert-border-subtle p-4 sm:px-6">
        <h3 className="eduvert-h4">{title}</h3>
        <p className="mt-1 eduvert-support text-eduvert-text-secondary">{children}</p>
      </div>
      {!sorted.length ? <p className="p-4 eduvert-body text-eduvert-text-secondary">No enquiries in this period.</p> : (
        <ul className="divide-y divide-eduvert-border-subtle">
          {sorted.map(row => (
            <li key={row.key} className="grid min-w-0 gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,1fr)] lg:items-center">
              <span className="min-w-0 [overflow-wrap:anywhere] eduvert-body font-eduvert-700">{row.label}</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <CountButton label="Enquiries" value={row.enquiries} onClick={() => onOpen(row, "all")} />
                <CountButton label="Enrolled" value={row.enrolled} onClick={() => onOpen(row, "enrolled")} />
                <CountButton label="Still open" value={row.open} onClick={() => onOpen(row, "active")} />
                <div className="grid content-center px-2">
                  <span className="eduvert-support text-eduvert-text-secondary">Conversion</span>
                  <strong className="eduvert-body tabular-nums">{conversion(row.enrolled, row.enquiries)}</strong>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function CountButton({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={!value}
      className="group grid min-h-11 rounded-eduvert-8 px-2 text-left enabled:text-eduvert-link enabled:hover:bg-eduvert-tint-blue disabled:text-eduvert-text-secondary">
      <span className="eduvert-support">{label}</span>
      <strong className="eduvert-body tabular-nums group-enabled:underline">{formatCount.format(value)}</strong>
    </button>
  )
}
