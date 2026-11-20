import type { ReactNode } from "react"
import { FeeFigure } from "@/components/fee-figure"
import type { Course } from "@/components/courses/course-data"
import { CourseComparison } from "@/components/courses/course-comparison"
import { CourseDemoLink, StickyCourseDemo } from "@/components/courses/course-demo-booking"
import { focusedCourseContent } from "@/components/courses/focused-course-content"
import { feeForSlug } from "@/components/program-fees"
import { coursesHref } from "@/components/site-nav"

const heroDemoId = "course-hero-demo"
const bookingId = "course-booking"
const comparisonId = "course-comparison"
const jumpLinks = [
  { href: "#curriculum", label: "Curriculum" },
  { href: `#${comparisonId}`, label: "Compare courses" },
  { href: `#${bookingId}`, label: "Fees & booking" },
]

export function FocusedCourseHero({ course }: { course: Course }) {
  const content = focusedCourseContent[course.slug]
  const fee = feeForSlug(course.slug)
  const facts = [course.duration, course.learningMode].filter(Boolean).join(" · ")

  return (
    <section aria-labelledby="course-hero-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-6 pt-6 pb-8 min-[1100px]:gap-6 min-[1100px]:px-10 min-[1100px]:pt-8 min-[1100px]:pb-12 min-[1440px]:px-[120px]">
        <a href={coursesHref} className="w-fit eduvert-support font-eduvert-600 text-eduvert-link">← All Programs</a>
        <div className="grid items-center gap-6 min-[1100px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] min-[1100px]:gap-12">
          <div className="grid gap-3">
            <h1 id="course-hero-heading" className="eduvert-h1 text-balance text-eduvert-text-primary">{course.title}</h1>
            {facts ? <p className="eduvert-support font-eduvert-600 text-eduvert-action-primary">{facts}</p> : null}
            <p className="max-w-[52ch] eduvert-body-large text-eduvert-text-secondary">{content.outcome}</p>
          </div>
          <div className="grid gap-3 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-4 min-[1100px]:p-6">
            <div>
              <p className="eduvert-h3 tabular-nums text-eduvert-text-primary">{fee?.total ?? "Ask for the current fee"}</p>
              {fee ? <p className="eduvert-support text-eduvert-text-secondary">Total including GST</p> : null}
            </div>
            <CourseDemoLink id={heroDemoId} courseSlug={course.slug} courseLabel={course.title} label={content.demoLabel} />
            <p className="eduvert-support text-eduvert-text-secondary">Share your details and EduVert will call to schedule your free session.</p>
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

export function CoursePracticeExample({ course }: { course: Course }) {
  const { example, tasks } = focusedCourseContent[course.slug]

  return (
    <aside className="grid gap-2 rounded-eduvert-16 bg-eduvert-tint-blue p-5 min-[1100px]:p-6">
      <p className="eduvert-support font-eduvert-600 text-eduvert-text-secondary">Illustrative practice example</p>
      <h3 className="eduvert-h4 text-eduvert-text-primary">{example}</h3>
      <ul className="list-disc space-y-1 pl-5 eduvert-body text-eduvert-text-secondary">
        {tasks.map(task => <li key={task}>{task}</li>)}
      </ul>
    </aside>
  )
}

export function CourseCurriculumTopic({ title, topics }: { title: string; topics: string[] }) {
  const [firstTopic, ...remainingTopics] = topics

  return (
    <li className="border-b border-eduvert-border-subtle first:border-t">
      <details className="group">
        <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-eduvert-8 px-1 py-4 [&::-webkit-details-marker]:hidden">
          <span className="grid gap-1">
            <span className="eduvert-h4 text-eduvert-text-primary">{title}</span>
            {firstTopic && remainingTopics.length > 0 ? <span className="eduvert-support text-eduvert-text-secondary">{firstTopic}</span> : null}
          </span>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-eduvert-link group-open:rotate-180">
            <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <ul className="list-disc space-y-1 pr-6 pb-4 pl-5 eduvert-body text-eduvert-text-secondary">
          {(remainingTopics.length > 0 ? remainingTopics : topics).map(topic => <li key={topic}>{topic}</li>)}
        </ul>
      </details>
    </li>
  )
}

export function FocusedCourseComparison({ course }: { course: Course }) {
  const fee = feeForSlug(course.slug)
  const rows = [
    ...focusedCourseContent[course.slug].comparison,
    { question: "How much time should I set aside?", answer: `${course.duration}. Ask EduVert about the next batch and timetable.` },
    { question: "What is the total fee?", answer: fee ? `${fee.total} including 18% GST.` : "Ask EduVert for the current fee." },
  ]

  return <CourseComparison id={comparisonId} rows={rows} />
}

export function CourseBookingFee({ slug }: { slug: string }) {
  const fee = feeForSlug(slug)
  return fee ? <FeeFigure fee={fee} /> : null
}

export function CourseBookingSection({ course, children }: { course: Course; children: ReactNode }) {
  const fee = feeForSlug(course.slug)

  return (
    <>
      <div id={bookingId}>{children}</div>
      {fee ? <StickyCourseDemo triggerId={heroDemoId} bookingId={bookingId} courseSlug={course.slug} courseLabel={course.title} total={fee.total} /> : null}
    </>
  )
}
