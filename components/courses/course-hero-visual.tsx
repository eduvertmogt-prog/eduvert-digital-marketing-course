import type { ReactNode } from "react"
import type { CourseHeroVisual } from "@/components/courses/course-data"

export function CourseHeroVisualArt({ visual }: { visual: CourseHeroVisual }) {
  switch (visual) {
    case "learning-studio":
      return <LearningStudioArt />
    case "search-workspace":
      return <SearchWorkspace />
    case "paid-campaign-studio":
      return <PaidCampaignStudio />
    case "social-content-studio":
      return <SocialContentStudio />
    case "data-analysis-studio":
      return <DataAnalysisStudio />
    default: {
      const unrecognized: never = visual
      return unrecognized
    }
  }
}

function SearchWorkspace() {
  return (
    <figure className="flex w-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
        <div className="studio-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-10 top-24 h-44 w-44 rounded-full bg-eduvert-brand-magenta opacity-25" aria-hidden="true" />
        <div className="absolute top-4 right-8 h-40 w-40 rounded-full bg-eduvert-brand-yellow opacity-40" aria-hidden="true" />
        <div className="absolute right-0 -bottom-8 h-48 w-48 rounded-full bg-eduvert-brand-blue opacity-25" aria-hidden="true" />
        <div className="relative flex flex-col gap-3 p-4 min-[1100px]:h-[370px] min-[1100px]:p-0">
          <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.12em] text-eduvert-text-secondary min-[1100px]:absolute min-[1100px]:top-4 min-[1100px]:left-6">
            SEARCH WORKSPACE
          </p>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:left-6 min-[1100px]:w-[368px]">
            <div className="flex items-center gap-2 rounded-eduvert-8 bg-eduvert-canvas-warm px-2.5 py-2">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-eduvert-text-primary">
                <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.2 10.2 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="rounded bg-eduvert-tint-yellow px-2 py-0.5 text-[13px] leading-[18px] font-eduvert-700 text-eduvert-text-primary">
                technical SEO checklist
              </p>
            </div>
            <p className="mt-3 text-[11px] leading-4 font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">Example search positions</p>
            <ol className="mt-2 flex flex-col gap-3">
              {searchRows.map((row) => (
                <li key={row.number} className="flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] leading-4 font-eduvert-700 ${row.tone}`}>
                    {row.number}
                  </span>
                  <span>
                    <span className="block text-[14px] leading-5 font-eduvert-700 text-eduvert-text-primary">{row.title}</span>
                    <span className="block text-[11px] leading-4 font-eduvert-500 text-eduvert-text-secondary">{row.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:right-5 min-[1100px]:bottom-5 min-[1100px]:w-[180px]">
            <h2 className="text-[15px] leading-5 font-eduvert-700 text-eduvert-text-primary">Website audit</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {auditChecks.map((check) => (
                <li key={check.label} className="flex items-center gap-2">
                  <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] leading-none font-eduvert-700 text-eduvert-text-primary ${check.tone}`}>
                    {check.mark}
                  </span>
                  <span className="text-[12px] leading-4 font-eduvert-600 text-eduvert-text-secondary">{check.label}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
      <figcaption className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">
        Illustrative search results and audit checks
      </figcaption>
    </figure>
  )
}

function LearningStudioArt() {
  return (
    <StudioFrame kicker="LEARNING STUDIO" caption="Illustrative assignment panels">
      <article className="rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-surface-white p-4">
        <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.08em] text-eduvert-action-primary">SAMPLE ASSIGNMENT</p>
        <h2 className="mt-1 text-[20px] leading-6 font-eduvert-700">Campaign brief</h2>
        <ol className="mt-3 flex flex-col gap-1 border-t border-eduvert-border-subtle pt-3 text-[13px] leading-5 font-eduvert-500 text-eduvert-text-secondary">
          <li>01 Define the audience</li>
          <li>02 Draft the message</li>
          <li>03 Choose the channel</li>
        </ol>
      </article>
      <article className="rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-surface-white p-4">
        <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.08em] text-eduvert-action-primary">SAMPLE PROJECT</p>
        <h2 className="mt-1 text-[18px] leading-6 font-eduvert-700">Channel mix</h2>
        <div className="mt-3 flex h-16 items-end gap-2" aria-hidden="true">
          {channelBars.map((bar) => (
            <span key={bar} className="w-4 rounded-[3px] bg-eduvert-brand-blue opacity-70" style={{ height: bar }} />
          ))}
          <span className="w-4 rounded-[3px] bg-eduvert-action-primary" style={{ height: 48 }} />
        </div>
      </article>
    </StudioFrame>
  )
}

function PaidCampaignStudio() {
  return (
    <figure className="flex w-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
        <div className="studio-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-8 top-16 h-40 w-40 rounded-full bg-eduvert-brand-yellow opacity-40" aria-hidden="true" />
        <div className="absolute top-6 right-0 h-36 w-36 rounded-full bg-eduvert-brand-blue opacity-25" aria-hidden="true" />
        <div className="absolute right-10 -bottom-10 h-40 w-40 rounded-full bg-eduvert-brand-magenta opacity-20" aria-hidden="true" />
        <div className="relative flex flex-col gap-3 p-4 min-[1100px]:h-[393px] min-[1100px]:p-0">
          <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.12em] text-eduvert-text-secondary min-[1100px]:absolute min-[1100px]:top-4 min-[1100px]:left-6">
            PAID ADVERTISING CAMPAIGN STUDIO
          </p>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:left-6 min-[1100px]:w-[300px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">SPONSORED SEARCH PREVIEW</p>
            <p className="mt-2 text-[16px] leading-6 font-eduvert-700 text-eduvert-link">SEM training in Navi Mumbai</p>
            <p className="text-[13px] leading-5 text-eduvert-text-secondary">Plan campaigns with practical guidance</p>
            <p className="mt-2 text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">eduvert.co/sem-course</p>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-tint-yellow p-4 min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:right-5 min-[1100px]:w-[188px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">KEYWORD TARGETING</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {keywordTargets.map((keyword) => (
                <li key={keyword} className="w-fit rounded-full bg-eduvert-surface-white px-2.5 py-1 text-[12px] leading-4 font-eduvert-600 text-eduvert-text-primary">
                  {keyword}
                </li>
              ))}
            </ul>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:bottom-5 min-[1100px]:left-6 min-[1100px]:w-[230px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">BIDDING & BUDGET</p>
            <p className="mt-2 text-[13px] leading-5 font-eduvert-600 text-eduvert-text-primary">Daily budget control</p>
            <div className="mt-2 flex gap-1.5">
              <span className="rounded-eduvert-8 bg-eduvert-action-primary px-2 py-1 text-[11px] leading-4 font-eduvert-700 text-eduvert-surface-white">MANUAL</span>
              <span className="rounded-eduvert-8 bg-eduvert-tint-blue px-2 py-1 text-[11px] leading-4 font-eduvert-600 text-eduvert-text-primary">GUIDED</span>
            </div>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:right-5 min-[1100px]:bottom-5 min-[1100px]:w-[188px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">CAMPAIGN PERFORMANCE</p>
            <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden="true">
              {performanceBars.map((bar) => (
                <span key={bar} className="w-3 rounded-t-[3px] bg-eduvert-brand-blue" style={{ height: bar }} />
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-4 font-eduvert-500 text-eduvert-text-secondary">Illustrative data only</p>
          </article>
        </div>
      </div>
      <figcaption className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">
        Illustrative campaign preview, not live advertising results
      </figcaption>
    </figure>
  )
}

function SocialContentStudio() {
  return (
    <figure className="flex w-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
        <div className="studio-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-8 top-20 h-40 w-40 rounded-full bg-eduvert-brand-magenta opacity-20" aria-hidden="true" />
        <div className="absolute top-4 right-6 h-36 w-36 rounded-full bg-eduvert-brand-yellow opacity-40" aria-hidden="true" />
        <div className="absolute right-16 -bottom-12 h-40 w-40 rounded-full bg-eduvert-brand-blue opacity-20" aria-hidden="true" />
        <div className="relative flex flex-col gap-3 p-4 min-[1100px]:h-[393px] min-[1100px]:p-0">
          <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.12em] text-eduvert-text-secondary min-[1100px]:absolute min-[1100px]:top-4 min-[1100px]:left-6">
            SOCIAL CONTENT STUDIO
          </p>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:left-6 min-[1100px]:w-[300px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">CONTENT CALENDAR</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {contentDays.map((day) => (
                <div key={day}>
                  <p className="text-[11px] leading-4 font-eduvert-700 text-eduvert-action-primary">{day}</p>
                  <div className="mt-1.5 h-10 rounded-eduvert-8 bg-eduvert-tint-magenta" aria-hidden="true" />
                </div>
              ))}
            </div>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-tint-yellow p-4 min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:right-5 min-[1100px]:w-[188px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">CONTENT PLAN</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-5 font-eduvert-600 text-eduvert-text-primary">
              <li>Calendar</li>
              <li>Reels</li>
              <li>Audience</li>
            </ul>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:bottom-5 min-[1100px]:left-6 min-[1100px]:right-5">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">PLATFORMS IN THE SYLLABUS</p>
            <ul className="mt-2 flex list-none flex-wrap gap-1.5">
              {socialPlatforms.map((platform) => (
                <li key={platform} className="rounded-full bg-eduvert-tint-blue px-2.5 py-1 text-[12px] leading-4 font-eduvert-600 text-eduvert-text-primary">
                  {platform}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
      <figcaption className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">
        Illustrative content plan, not platform results
      </figcaption>
    </figure>
  )
}

function DataAnalysisStudio() {
  return (
    <figure className="flex w-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
        <div className="studio-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-8 top-16 h-40 w-40 rounded-full bg-eduvert-brand-blue opacity-25" aria-hidden="true" />
        <div className="absolute top-4 right-8 h-36 w-36 rounded-full bg-eduvert-brand-yellow opacity-40" aria-hidden="true" />
        <div className="absolute right-16 -bottom-12 h-40 w-40 rounded-full bg-eduvert-brand-magenta opacity-20" aria-hidden="true" />
        <div className="relative flex flex-col gap-3 p-4 min-[1100px]:h-[393px] min-[1100px]:p-0">
          <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.12em] text-eduvert-text-secondary min-[1100px]:absolute min-[1100px]:top-4 min-[1100px]:left-6">
            DATA ANALYSIS STUDIO
          </p>
          <article className="relative z-10 overflow-hidden rounded-eduvert-12 bg-eduvert-surface-white shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:left-6 min-[1100px]:w-[300px]">
            <p className="px-4 pt-4 text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">WORKSHEET</p>
            <div className="mt-3 grid grid-cols-2 bg-eduvert-tint-blue px-4 py-2 text-[11px] leading-4 font-eduvert-700 text-eduvert-text-secondary">
              <span>Field</span>
              <span>Status</span>
            </div>
            <ul className="list-none">
              {sheetRows.map((row) => (
                <li key={row} className="grid grid-cols-2 border-t border-eduvert-border-subtle px-4 py-2 text-[13px] leading-5">
                  <span className="font-eduvert-600 text-eduvert-text-primary">{row}</span>
                  <span className="text-eduvert-text-secondary">Check</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-tint-yellow p-4 min-[1100px]:absolute min-[1100px]:top-12 min-[1100px]:right-5 min-[1100px]:w-[188px]">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">NOTEBOOK STEPS</p>
            <ul className="mt-2 flex list-none flex-col gap-1.5 text-[13px] leading-5 font-eduvert-600 text-eduvert-text-primary">
              {notebookSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
          <article className="relative z-10 rounded-eduvert-12 bg-eduvert-surface-white p-4 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:absolute min-[1100px]:bottom-5 min-[1100px]:left-6 min-[1100px]:right-5">
            <p className="text-[10px] leading-4 font-eduvert-700 tracking-[0.08em] text-eduvert-text-secondary">TOOLS IN THE SYLLABUS</p>
            <ul className="mt-2 flex list-none flex-wrap gap-1.5">
              {analysisTools.map((tool) => (
                <li key={tool} className="rounded-full bg-eduvert-tint-blue px-2.5 py-1 text-[12px] leading-4 font-eduvert-600 text-eduvert-text-primary">
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
      <figcaption className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">
        Illustrative worksheet, not a measured result
      </figcaption>
    </figure>
  )
}

function StudioFrame({ kicker, caption, children }: StudioFrameProps) {
  return (
    <figure className="flex w-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm p-4 shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)] min-[1100px]:p-6">
        <div className="studio-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-8 right-6 h-36 w-36 rounded-full bg-eduvert-brand-yellow opacity-35" aria-hidden="true" />
        <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-eduvert-brand-blue opacity-25" aria-hidden="true" />
        <div className="relative flex flex-col gap-3">
          <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.12em] text-eduvert-text-secondary">{kicker}</p>
          {children}
        </div>
      </div>
      <figcaption className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">{caption}</figcaption>
    </figure>
  )
}

const searchRows = [
  { number: "01", title: "Technical SEO checklist", detail: "Crawling and indexing basics", tone: "bg-eduvert-tint-magenta text-eduvert-action-primary" },
  { number: "02", title: "Website audit guide", detail: "Review titles and internal links", tone: "bg-eduvert-tint-blue text-eduvert-text-primary" },
  { number: "03", title: "Search visibility basics", detail: "Track organic search performance", tone: "bg-eduvert-tint-blue text-eduvert-text-primary" },
]

const auditChecks = [
  { label: "Page title", mark: "✓", tone: "bg-eduvert-tint-blue" },
  { label: "Meta description", mark: "✓", tone: "bg-eduvert-tint-blue" },
  { label: "Internal links", mark: "·", tone: "bg-eduvert-tint-yellow" },
]

const keywordTargets = ["search ads", "paid campaigns", "ad bidding"]
const performanceBars = [14, 22, 18, 28, 24]
const channelBars = [16, 28, 22, 40, 34]
const contentDays = ["Mon", "Wed", "Fri"]
const socialPlatforms = ["Facebook", "Instagram", "LinkedIn", "YouTube"]
const sheetRows = ["Audience", "Channel", "Date"]
const notebookSteps = ["Read a CSV", "Clean the rows", "Plot the fields"]
const analysisTools = ["Excel", "Python", "Jupyter", "Pandas"]

interface StudioFrameProps {
  kicker: string
  caption: string
  children: ReactNode
}
