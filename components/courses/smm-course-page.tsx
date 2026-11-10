import { CourseHeroVisualArt } from "@/components/courses/course-hero-visual"
import type { Course } from "@/components/courses/course-data"
import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { counsellorActions, type FaqItem } from "@/components/programs/program-content"
import { PageFaq } from "@/components/programs/page-faq"
import { coursesHref } from "@/components/site-nav"

export function SmmCoursePage({ course, questions }: { course: Course; questions: FaqItem[] }) {
  return (
    <>
      <Hero course={course} />
      <Practical course={course} />
      <Curriculum course={course} />
      <Tools course={course} />
      <Skills course={course} />
      <Audience course={course} />
      <CourseDetails course={course} />
      {questions.length ? (
        <PageFaq
          id="course-questions"
          headingId="course-questions-heading"
          eyebrow="COMMON QUESTIONS"
          title="SMM Course FAQs"
          questions={questions}
          canvas
        />
      ) : null}
      <FinalCta course={course} />
    </>
  )
}

function Hero({ course }: { course: Course }) {
  return (
    <section aria-labelledby="course-hero-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-7 min-[1100px]:px-10 min-[1100px]:py-[42px] min-[1440px]:px-[120px]">
        <a href={coursesHref} className="inline-flex w-fit items-center text-eduvert-support leading-[22px] font-eduvert-600 text-eduvert-link">
          ← All Programs
        </a>
        <div className="flex flex-col gap-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-4 min-[1100px]:max-w-[600px]">
            <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{course.eyebrow}</p>
            <h1 id="course-hero-heading" className="text-eduvert-h1-mobile leading-eduvert-h1-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-[46px] min-[1100px]:leading-[54px] min-[1440px]:text-eduvert-h1 min-[1440px]:leading-[59px]">
              {course.title}
            </h1>
            <p className="text-eduvert-body-large-mobile leading-[27px] text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
              {course.description}
            </p>
            <div className="flex flex-col gap-3 min-[1100px]:flex-row">
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover">
                {course.ctaLabel}
              </a>
              <a href="#curriculum" className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-magenta">
                Explore Curriculum
              </a>
            </div>
          </div>
          <div className="w-full min-[1100px]:w-[552px] min-[1100px]:shrink-0">
            <CourseHeroVisualArt visual={course.heroVisual} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Practical({ course }: { course: Course }) {
  const steps = practicalLabels.map((step, index) => ({
    ...step,
    detail: course.practicalWork[index] ?? step.detail,
  }))

  return (
    <section aria-labelledby="smm-practical-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">PRACTICAL LEARNING</p>
          <h2 id="smm-practical-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Practical Assignments
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            Practice the published work: content calendars, campaign creation, and audience targeting.
          </p>
        </div>
        <ol className="grid gap-6 min-[1100px]:grid-cols-3">
          {steps.map((step) => (
            <li key={step.label} className="flex flex-col gap-3 border-t border-eduvert-border-subtle pt-5">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{step.number}</p>
              <h3 className="text-[20px] leading-7 font-eduvert-700 text-eduvert-text-primary">{step.label}</h3>
              <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Curriculum({ course }: { course: Course }) {
  return (
    <section id="curriculum" aria-labelledby="smm-curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="smm-curriculum-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            What You’ll Learn
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            Published social media topics, from platforms and content planning to paid campaigns and reporting.
          </p>
          <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">
            Topic groupings do not imply an official module count.
          </p>
        </div>
        <ol className="min-w-0 flex-1">
          {course.curriculum.map((group, index) => (
            <li key={group.title} className="flex gap-4 border-t border-eduvert-border-subtle py-5 last:border-b">
              <span className="w-7 shrink-0 text-eduvert-support leading-[21px] font-eduvert-700 text-eduvert-action-primary">{formatNumber(index + 1)}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-eduvert-body leading-6 font-eduvert-700 text-eduvert-text-primary">{group.title}</h3>
                <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">{group.topics.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Tools({ course }: { course: Course }) {
  if (!course.tools.length) return null

  return (
    <section aria-labelledby="smm-tools-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[26px] px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">SMM TOOLS</p>
          <h2 id="smm-tools-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Tools You’ll Explore
          </h2>
        </div>
        <ul className="grid gap-5 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {course.tools.map((tool, index) => (
            <li key={tool.name} className={`flex min-h-[127px] flex-col justify-between gap-[7px] rounded-eduvert-12 px-4 py-5 ${toolTones[index % toolTones.length]}`}>
              <p className="text-[20px] leading-[26px] font-eduvert-700 text-eduvert-text-primary">{tool.name}</p>
              <p className="text-[14px] leading-[21px] font-eduvert-500 text-eduvert-text-secondary">{tool.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Skills({ course }: { course: Course }) {
  return (
    <section aria-labelledby="smm-skills-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">PRACTICAL SKILLS</p>
          <h2 id="smm-skills-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Skills You’ll Work With
          </h2>
        </div>
        <ul className="grid gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {course.highlights.map((skill) => (
            <li key={skill} className="flex min-h-[112px] items-end rounded-eduvert-12 bg-eduvert-surface-white px-4 py-5 text-[16px] leading-[22px] font-eduvert-700 text-eduvert-text-primary shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
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
    <section aria-labelledby="smm-audience-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-[68px] min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">WHO IT’S FOR</p>
          <h2 id="smm-audience-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Who Can Join?
          </h2>
        </div>
        <ul className="min-w-0 flex-1">
          {course.audience.map((person) => (
            <li key={person} className="flex items-center gap-3 border-t border-eduvert-border-subtle py-[17px] text-[20px] leading-7 font-eduvert-600 text-eduvert-text-primary">
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
    <section aria-labelledby="smm-details-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <h2 id="smm-details-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Course Details & Enquiry
          </h2>
          <ul className="flex flex-col gap-3">
            {course.enquiryPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-eduvert-tint-blue text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">
                  ✓
                </span>
                <span className="text-eduvert-body leading-[27px] font-eduvert-400 text-eduvert-text-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="flex w-full flex-col gap-4 rounded-eduvert-16 bg-eduvert-tint-yellow p-7 min-[1100px]:w-[532px] min-[1100px]:shrink-0">
          <h3 className="text-[26px] leading-[34px] font-eduvert-700 text-eduvert-text-primary">Ask about this course</h3>
          <p className="text-eduvert-body leading-[27px] font-eduvert-400 text-eduvert-text-secondary">
            Contact EduVert for the current duration, fees, available batches, and learning format.
          </p>
          <a href={counsellorActions.demoHref} className="flex h-12 w-[218px] items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary text-eduvert-button leading-[21px] font-eduvert-600 whitespace-nowrap text-eduvert-surface-white hover:bg-eduvert-action-hover">
            Enquire About This Course
          </a>
        </aside>
      </div>
    </section>
  )
}

function FinalCta({ course }: { course: Course }) {
  return (
    <section aria-labelledby="smm-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-11 min-[1100px]:px-10 min-[1100px]:py-[60px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[620px] flex-col gap-3">
            <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">READY TO BEGIN?</p>
            <h2 id="smm-cta-heading" className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Ready to Learn Social Media Marketing?
            </h2>
            <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
              Speak with EduVert about the SMM curriculum, course fees, and upcoming batches.
            </p>
          </div>
          <CounsellorActions primaryLabel={course.ctaLabel} />
        </div>
      </div>
    </section>
  )
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0")
}

const practicalLabels = [
  { number: "01", label: "CALENDAR", detail: "Build content calendars" },
  { number: "02", label: "CAMPAIGN", detail: "Practice campaign creation" },
  { number: "03", label: "AUDIENCE", detail: "Work on audience targeting assignments" },
]

const toolTones = [
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-magenta",
  "bg-eduvert-tint-yellow",
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
]
