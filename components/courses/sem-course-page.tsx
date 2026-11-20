import { CourseBookingFee, CourseBookingSection, CourseCurriculumTopic, CoursePracticeExample, FocusedCourseComparison, FocusedCourseHero } from "@/components/courses/focused-course-flow"
import { feeForSlug } from "@/components/program-fees"
import type { Course } from "@/components/courses/course-data"
import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { type FaqItem } from "@/components/programs/program-content"
import { PageFaq } from "@/components/programs/page-faq"

export function SemCoursePage({ course, questions }: { course: Course; questions: FaqItem[] }) {
  return (
    <>
      <FocusedCourseHero course={course} />
      <Practical course={course} />
      <Curriculum course={course} />
      <FocusedCourseComparison course={course} />
      <Skills course={course} />
      <Audience course={course} />
      <CourseInfo course={course} />
      {questions.length ? (
        <PageFaq
          id="course-questions"
          headingId="course-questions-heading"
          eyebrow="COMMON QUESTIONS"
          title="SEM Course FAQs"
          questions={questions}
          canvas
        />
      ) : null}
      <CourseBookingSection course={course}>
        <FinalCta course={course} />
      </CourseBookingSection>
    </>
  )
}

function Practical({ course }: { course: Course }) {
  return (
    <section aria-labelledby="sem-practical-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PRACTICAL LEARNING</p>
          <h2 id="sem-practical-heading" className="eduvert-h2 tracking-[-0.025em]">
            From Campaign Setup to Optimization
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            A clear progression from research to responsible campaign analysis.
          </p>
        </div>
        <div className="grid gap-6 min-[1100px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] min-[1100px]:items-start min-[1100px]:gap-12">
          <ol className="grid gap-4">
            {practicalSteps.map((step) => (
              <li key={step.label} className="flex flex-col gap-3 border-t border-eduvert-border-subtle pt-5">
                <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{step.number}</p>
                <h3 className="eduvert-h4 text-eduvert-text-primary">{step.label}</h3>
                <p className="eduvert-body text-eduvert-text-secondary">{step.detail}</p>
              </li>
            ))}
          </ol>
          <CoursePracticeExample course={course} />
        </div>
      </div>
    </section>
  )
}

function Curriculum({ course }: { course: Course }) {
  return (
    <section id="curriculum" aria-labelledby="sem-curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:flex-row min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="sem-curriculum-heading" className="eduvert-h2 tracking-[-0.025em]">
            What You’ll Learn
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Published SEM topic groupings, presented as a structured learning path.
          </p>
          <p className="eduvert-support text-eduvert-text-secondary">
            Topic groupings do not imply an official module count.
          </p>
        </div>
        <ol className="min-w-0 flex-1">
          {course.curriculum.map(group => (
            <CourseCurriculumTopic key={group.title} title={group.title} topics={group.topics} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function Skills({ course }: { course: Course }) {
  return (
    <section aria-labelledby="sem-skills-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PRACTICAL SKILLS</p>
          <h2 id="sem-skills-heading" className="eduvert-h2 tracking-[-0.025em]">
            Skills You’ll Work With
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Build practical familiarity without promising a particular advertising result.
          </p>
        </div>
        <ul className="grid gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {course.highlights.map((skill, index) => (
            <li key={skill} className={`flex min-h-[127px] items-end rounded-eduvert-12 px-4 py-5 eduvert-body font-eduvert-700 text-eduvert-text-primary ${skillTones[index % skillTones.length]}`}>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Audience({ course }: { course: Course }) {
  if (!course.audience.length) return null

  return (
    <section aria-labelledby="sem-audience-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">WHO CAN JOIN?</p>
          <h2 id="sem-audience-heading" className="eduvert-h2 tracking-[-0.025em]">
            A focused course for two starting points.
          </h2>
        </div>
        <ul className="grid gap-4 min-[1100px]:grid-cols-2">
          {course.audience.map((person, index) => (
            <li key={person} className="flex flex-col gap-2 rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
              <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{audienceLabels[index] ?? "LEARNERS"}</p>
              <p className="eduvert-h4 text-eduvert-text-primary">{person}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CourseInfo({ course }: { course: Course }) {
  const info = courseInfo(course)

  return (
    <section aria-labelledby="sem-info-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">COURSE INFORMATION</p>
          <h2 id="sem-info-heading" className="eduvert-h2 tracking-[-0.025em]">
            Plan Your Next Step
          </h2>
        </div>
        <dl className="grid gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {info.map((item) => (
            <div key={item.label} className="flex flex-col gap-2 rounded-eduvert-16 bg-eduvert-canvas-warm p-5">
              <dt className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{item.label}</dt>
              <dd className="eduvert-h4 text-eduvert-text-primary">{item.value}</dd>
              <dd className="eduvert-support text-eduvert-text-secondary">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function FinalCta({ course }: { course: Course }) {
  return (
    <section aria-labelledby="sem-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-5 pb-11 min-[1100px]:px-10 min-[1100px]:pt-8 min-[1100px]:pb-[60px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[620px] flex-col gap-3">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">READY TO BEGIN?</p>
            <h2 id="sem-cta-heading" className="eduvert-h2">
              Ready to Learn Search Engine Marketing?
            </h2>
            <p className="eduvert-body text-eduvert-text-secondary">
              Speak with EduVert about the SEM curriculum and upcoming batches.
            </p>
            <CourseBookingFee slug={course.slug} />
          </div>
          <CounsellorActions primaryLabel={course.ctaLabel} intent="course_enquiry" courseSlug={course.slug} courseLabel={course.title} />
        </div>
      </div>
    </section>
  )
}

function courseInfo(course: Course) {
  return [
    {
      label: "TYPICAL DURATION",
      value: "4–5 weeks",
      detail: course.duration ?? "4–5 weeks",
    },
    {
      label: "PRACTICAL WORK",
      value: "Projects and case studies",
      detail: course.practicalWork.at(-1) ?? "Hands-on exercises grounded in the course.",
    },
    {
      label: "FEE",
      value: feeForSlug(course.slug)?.base ?? "Enquire for details",
      detail: feeDetail(course.slug),
    },
    {
      label: "BATCH AVAILABILITY",
      value: "Confirm with EduVert",
      detail: "Ask about the next available batch.",
    },
  ]
}

function feeDetail(slug: string) {
  const fee = feeForSlug(slug)
  if (!fee) return "Ask EduVert for the current fee."
  return `GST ${fee.gst} · Total ${fee.total}`
}

const practicalSteps = [
  {
    number: "01",
    label: "PLAN",
    detail: "Research keywords, select audiences, and develop ad messaging.",
  },
  {
    number: "02",
    label: "LAUNCH",
    detail: "Understand ad creation, bidding, targeting, and campaign management.",
  },
  {
    number: "03",
    label: "OPTIMIZE",
    detail: "Explore testing, conversion tracking, remarketing, and reporting.",
  },
]

const audienceLabels = ["BEGINNERS", "MARKETING PROFESSIONALS"]

const skillTones = [
  "bg-eduvert-tint-yellow",
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-soft-blue",
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
]
