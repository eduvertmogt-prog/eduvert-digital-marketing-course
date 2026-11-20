import { IntakeAnnouncement } from "@/components/intake-announcement"
import { programFees } from "@/components/program-fees"
import { FlagshipDemoLink } from "@/components/programs/flagship-booking"
import { coursesHref, syllabusHref } from "@/components/site-nav"

const jumpLinks = [
  { href: "#who-should-join", label: "Who should join" },
  { href: "#curriculum", label: "Curriculum" },
  { href: "#flagship-comparison", label: "Compare courses" },
  { href: "#career", label: "Career paths" },
  { href: "#flagship-enrolment", label: "Fees & batches" },
]

export function ProgramHero() {
  return (
    <section aria-labelledby="program-hero-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-6 pt-6 pb-8 min-[1100px]:gap-6 min-[1100px]:px-10 min-[1100px]:pt-8 min-[1100px]:pb-12 min-[1440px]:px-[120px]">
        <a href={coursesHref} className="w-fit eduvert-support font-eduvert-600 text-eduvert-link">
          ← All Programs
        </a>
        <div className="grid items-center gap-6 min-[1100px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] min-[1100px]:gap-12">
          <div className="grid gap-3">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">
              Professional Digital Marketing Program with AI
            </p>
            <h1 id="program-hero-heading" className="eduvert-h1 text-balance text-eduvert-text-primary">
              Become Job-Ready in Digital Marketing
            </h1>
            <p className="max-w-[52ch] eduvert-body-large text-eduvert-text-secondary">
              Run real campaigns from your first class and learn how to optimise them. Over four months,
              work on live projects in small batches of 5–8 students.
            </p>
            <p className="eduvert-support font-eduvert-600 text-eduvert-action-primary">
              120+ training hours · Navi Mumbai or live online
            </p>
          </div>
          <div className="grid gap-3 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-4 min-[1100px]:p-6">
            <div>
              <p className="eduvert-h3 tabular-nums text-eduvert-text-primary">{programFees.flagship.total}</p>
              <p className="eduvert-support text-eduvert-text-secondary">Total including GST · {programFees.flagship.emiLabel}</p>
            </div>
            <FlagshipDemoLink inHero />
            <IntakeAnnouncement />
            <p className="eduvert-support text-eduvert-text-secondary">Share your details and EduVert will call to schedule your free session.</p>
            <a href={syllabusHref} download className="inline-flex min-h-11 w-fit items-center eduvert-button text-eduvert-link underline underline-offset-4">Download Syllabus</a>
          </div>
        </div>
        <nav aria-label="On this page" className="flex flex-wrap gap-x-5 border-t border-eduvert-border-subtle pt-2">
          {jumpLinks.map(({ href, label }) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center eduvert-support font-eduvert-600 text-eduvert-link underline underline-offset-4">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
