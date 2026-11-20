import { CourseBookingFee, CourseBookingSection, CourseCurriculumTopic, CoursePracticeExample, FocusedCourseComparison, FocusedCourseHero } from "@/components/courses/focused-course-flow"
import type { Course } from "@/components/courses/course-data"
import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { counsellorActions, type FaqItem } from "@/components/programs/program-content"
import { PageFaq } from "@/components/programs/page-faq"

export function DataAnalyticsPage({ course, questions }: { course: Course; questions: FaqItem[] }) {
  return (
    <>
      <FocusedCourseHero course={course} />
      <Practical course={course} />
      <Curriculum course={course} />
      <FocusedCourseComparison course={course} />
      <Tools course={course} />
      <Skills course={course} />
      <Audience course={course} />
      <CourseDetails course={course} />
      {questions.length ? (
        <PageFaq
          id="course-questions"
          headingId="course-questions-heading"
          eyebrow="COMMON QUESTIONS"
          title="Data Analytics Course FAQs"
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
  const steps = practicalLabels.map((step, index) => ({
    ...step,
    detail: course.practicalWork[index] ?? step.detail,
  }))

  return (
    <section aria-labelledby="data-practical-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PRACTICAL LEARNING</p>
          <h2 id="data-practical-heading" className="eduvert-h2 tracking-[-0.025em]">
            Practical Assignments
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Practice the published work: Excel analysis, Python and Pandas, and an assignment or project.
          </p>
        </div>
        <div className="grid gap-6 min-[1100px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] min-[1100px]:items-start min-[1100px]:gap-12">
          <ol className="grid gap-4">
            {steps.map((step) => (
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
    <section id="curriculum" aria-labelledby="data-curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:flex-row min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="data-curriculum-heading" className="eduvert-h2 tracking-[-0.025em]">
            What You’ll Learn
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Published data topics, from Excel and Python basics to cleaning, visualization, and a project.
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

function Tools({ course }: { course: Course }) {
  if (!course.tools.length) return null

  return (
    <section aria-labelledby="data-tools-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[26px] px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">DATA TOOLS</p>
          <h2 id="data-tools-heading" className="eduvert-h2 tracking-[-0.025em]">
            Tools You’ll Explore
          </h2>
        </div>
        <ul className="grid gap-5 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {course.tools.map((tool, index) => (
            <li key={tool.name} className={`flex min-h-[127px] flex-col justify-between gap-[7px] rounded-eduvert-12 px-4 py-5 ${toolTones[index % toolTones.length]}`}>
              <p className="eduvert-h4 text-eduvert-text-primary">{tool.name}</p>
              <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">{tool.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Skills({ course }: { course: Course }) {
  return (
    <section aria-labelledby="data-skills-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PRACTICAL SKILLS</p>
          <h2 id="data-skills-heading" className="eduvert-h2 tracking-[-0.025em]">
            Skills You’ll Work With
          </h2>
        </div>
        <ul className="grid gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {course.highlights.map((skill) => (
            <li key={skill} className="flex min-h-[112px] items-end rounded-eduvert-12 bg-eduvert-surface-white px-4 py-5 eduvert-body font-eduvert-700 text-eduvert-text-primary shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
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
    <section aria-labelledby="data-audience-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">WHO IT’S FOR</p>
          <h2 id="data-audience-heading" className="eduvert-h2 tracking-[-0.025em]">
            Who Can Join?
          </h2>
        </div>
        <ul className="min-w-0 flex-1">
          {course.audience.map((person) => (
            <li key={person} className="flex items-center gap-3 border-t border-eduvert-border-subtle py-[17px] eduvert-h4 text-eduvert-text-primary">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-eduvert-action-primary" />
              {person}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CourseDetails({ course }: { course: Course }) {
  return (
    <section aria-labelledby="data-details-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <h2 id="data-details-heading" className="eduvert-h2 tracking-[-0.025em]">
            Course Details & Enquiry
          </h2>
          <ul className="flex flex-col gap-3">
            {course.enquiryPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-eduvert-tint-blue eduvert-support font-eduvert-700 text-eduvert-action-primary">
                  ✓
                </span>
                <span className="eduvert-body font-eduvert-400 text-eduvert-text-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="flex w-full flex-col gap-4 rounded-eduvert-16 bg-eduvert-tint-yellow p-7 min-[1100px]:w-[532px] min-[1100px]:shrink-0">
          <h3 className="eduvert-h3 text-eduvert-text-primary">Ask about this course</h3>
          <p className="eduvert-body font-eduvert-400 text-eduvert-text-secondary">
            The syllabus covers 30 hours. Ask about the current timetable and the next batch.
          </p>
          <a
            href={counsellorActions.demoHref}
            data-demo-intent="course_enquiry"
            data-demo-course-slug={course.slug}
            data-demo-course-label={course.title}
            className="flex h-12 w-full max-w-[218px] items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary eduvert-button whitespace-nowrap text-eduvert-surface-white hover:bg-eduvert-action-hover"
          >
            Enquire About This Course
          </a>
        </aside>
      </div>
    </section>
  )
}

function FinalCta({ course }: { course: Course }) {
  return (
    <section aria-labelledby="data-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-5 pb-11 min-[1100px]:px-10 min-[1100px]:pt-8 min-[1100px]:pb-[60px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[620px] flex-col gap-3">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">READY TO BEGIN?</p>
            <h2 id="data-cta-heading" className="eduvert-h2">
              Ready to Learn Data Analytics?
            </h2>
            <p className="eduvert-body text-eduvert-text-secondary">
              Speak with EduVert about the data analytics curriculum and upcoming batches.
            </p>
            <CourseBookingFee slug={course.slug} />
          </div>
          <CounsellorActions primaryLabel={course.ctaLabel} intent="course_enquiry" courseSlug={course.slug} courseLabel={course.title} />
        </div>
      </div>
    </section>
  )
}

const practicalLabels = [
  { number: "01", label: "EXCEL", detail: "Analyze data in Excel" },
  { number: "02", label: "PYTHON", detail: "Practice working with data in Python and Pandas" },
  { number: "03", label: "PROJECT", detail: "Complete an assignment or project" },
]

const toolTones = [
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
  "bg-eduvert-tint-soft-blue",
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
]
