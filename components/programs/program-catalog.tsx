import { FeeFigure } from "@/components/fee-figure"
import { programFees } from "@/components/program-fees"
import { flagshipCourse, focusedCourses } from "@/components/programs/program-content"
import type { FocusedCourse } from "@/components/programs/program-content"

export function ProgramCatalog() {
  return (
    <section id="all-programs" aria-labelledby="all-programs-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-12 min-[1100px]:gap-7 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[72px]">
        <div className="flex flex-col gap-2">
          <h2 id="all-programs-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Explore All Programs
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Choose a complete program or focus on a specific skill.
          </p>
        </div>
        <article id="complete-program" className="flex flex-col gap-5 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-tint-soft-blue p-[22px] min-[1100px]:gap-[18px] min-[1100px]:p-[34px]">
          <div className="flex flex-col gap-5 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-16">
            <div className="flex max-w-[490px] flex-col gap-2.5">
              <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{flagshipCourse.eyebrow}</p>
              <h3 className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
                {flagshipCourse.title}
              </h3>
              <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">{flagshipCourse.duration}</p>
              <FeeFigure fee={programFees.flagship} />
            </div>
            <div className="flex flex-col gap-3 border-t border-eduvert-border-subtle pt-4 min-[1100px]:border-t-0 min-[1100px]:border-l min-[1100px]:pt-0 min-[1100px]:pl-11">
              <p className="eduvert-support font-eduvert-700 text-eduvert-text-secondary">{flagshipCourse.highlightsLabel}</p>
              <ul className="flex flex-col gap-1.5">
                {flagshipCourse.highlights.map((highlight) => (
                  <li key={highlight} className="eduvert-body font-eduvert-500 text-eduvert-text-primary">{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
          <a href={flagshipCourse.href} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-[170px]">
            {flagshipCourse.action}
          </a>
        </article>
        <div id="focused-courses" className="grid gap-6 min-[1100px]:grid-cols-2 min-[1100px]:gap-x-6 min-[1100px]:gap-y-6">
          {focusedCourses.map((course) => (
            <FocusedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FocusedCourseCard({ course }: { course: FocusedCourse }) {
  return (
    <article id={course.id === "data" ? "data-analytics" : undefined} className="flex flex-col overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white">
      <div className={`flex flex-col gap-[7px] px-6 py-6 ${headerTone(course.tone)}`}>
        <p className="eduvert-support font-eduvert-700 text-eduvert-text-secondary">{course.eyebrow}</p>
        <h3 className="eduvert-h3 text-eduvert-text-primary">
          {course.title}
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <ul className="flex flex-col gap-1.5">
          {course.highlights.map((highlight) => (
            <li key={highlight} className="eduvert-body font-eduvert-500 text-eduvert-text-primary">{highlight}</li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3">
          <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">{course.duration}</p>
          <FeeFigure fee={feeForFocusedCourse(course.id)} showTotal={false} />
          <a href={course.href} target={course.external ? "_blank" : undefined} rel={course.external ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 eduvert-button text-eduvert-text-primary">
            View Course <span className="font-eduvert-500 text-eduvert-text-secondary" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  )
}

function feeForFocusedCourse(id: FocusedCourse["id"]) {
  switch (id) {
    case "seo":
      return programFees.seo
    case "sem":
      return programFees.sem
    case "smm":
      return programFees.smm
    case "data":
      return programFees.data
    default: {
      const exhaustive: never = id
      return exhaustive
    }
  }
}

function headerTone(tone: FocusedCourse["tone"]) {
  switch (tone) {
    case "blue":
      return "bg-eduvert-tint-blue"
    case "soft-blue":
      return "bg-eduvert-tint-soft-blue"
    case "white":
      return "bg-eduvert-surface-white"
    default: {
      const exhaustive: never = tone
      return exhaustive
    }
  }
}
