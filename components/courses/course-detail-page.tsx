import { CourseHeroVisualArt } from "@/components/courses/course-hero-visual"
import type { Course } from "@/components/courses/course-data"
import { DataAnalyticsPage } from "@/components/courses/data-analytics-course-page"
import { SemCoursePage } from "@/components/courses/sem-course-page"
import { SmmCoursePage } from "@/components/courses/smm-course-page"
import { PageFaq } from "@/components/programs/page-faq"
import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { counsellorActions } from "@/components/programs/program-content"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { coursesHref } from "@/components/site-nav"

export function CourseDetailPage({ course }: { course: Course }) {
  const facts = courseFacts(course)
  const questions = course.faqs.map((faq, index) => ({
    id: `${course.slug}-${index + 1}`,
    question: faq.question,
    answer: faq.answer,
  }))

  return (
    <>
      <SiteHeader />
      <main>
        {course.slug === "sem-course" ? (
          <SemCoursePage course={course} questions={questions} />
        ) : course.slug === "smm-course" ? (
          <SmmCoursePage course={course} questions={questions} />
        ) : course.slug === "data-analytics-python" ? (
          <DataAnalyticsPage course={course} questions={questions} />
        ) : (
          <>
            <Hero course={course} />
            <PracticalWork course={course} />
            <Curriculum course={course} />
            <Tools course={course} />
            <Audience course={course} />
            <CourseDetails course={course} facts={facts} />
            {questions.length ? (
              <PageFaq
                id="course-questions"
                headingId="course-questions-heading"
                eyebrow="COMMON QUESTIONS"
                title="Course FAQs"
                questions={questions}
                canvas
              />
            ) : null}
            <FinalCta course={course} />
          </>
        )}
      </main>
      <SiteFooter />
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
            <HeroFacts course={course} />
          </div>
          <div className="w-full min-[1100px]:w-[552px] min-[1100px]:shrink-0">
            <CourseHeroVisualArt visual={course.heroVisual} />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroFacts({ course }: { course: Course }) {
  const facts = [course.duration, course.learningMode].filter((fact): fact is string => Boolean(fact))
  if (!facts.length) return null

  return <p className="text-eduvert-support leading-[21px] font-eduvert-500 text-eduvert-text-secondary">{facts.join(" · ")}</p>
}

function PracticalWork({ course }: { course: Course }) {
  if (!course.practicalWork.length) return null

  return (
    <section aria-labelledby="practical-work-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">PRACTICAL LEARNING</p>
          <h2 id="practical-work-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Put it into practice
          </h2>
        </div>
        <ol className="grid gap-6 min-[1100px]:grid-cols-3">
          {course.practicalWork.map((item, index) => (
            <li key={item} className="flex flex-col gap-3 border-t border-eduvert-border-subtle pt-5">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{formatNumber(index + 1)}</p>
              <p className="text-eduvert-h4-mobile leading-[27px] font-eduvert-600 text-eduvert-text-primary min-[1100px]:text-eduvert-h4 min-[1100px]:leading-[28px]">{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Curriculum({ course }: { course: Course }) {
  if (!course.curriculum.length) return null

  return (
    <section id="curriculum" aria-labelledby="curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:gap-[68px] min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="curriculum-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Curriculum
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            Explore the published syllabus by topic.
          </p>
          <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">
            These topics group the published syllabus. They are not an official module count.
          </p>
        </div>
        <ol className="min-w-0 min-[1100px]:flex-1">
          {course.curriculum.map((group, index) => (
            <li key={group.title} className="flex gap-4 border-b border-eduvert-border-subtle py-5 first:border-t">
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
    <section aria-labelledby="course-tools-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[26px] px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{toolsEyebrow(course)}</p>
          <h2 id="course-tools-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
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

function Audience({ course }: { course: Course }) {
  if (!course.audience.length) return null

  return (
    <section aria-labelledby="course-audience-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-[68px] min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">WHO IT’S FOR</p>
          <h2 id="course-audience-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
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

function CourseDetails({ course, facts }: { course: Course; facts: CourseFact[] }) {
  if (!facts.length && !course.enquiryPoints.length) return null

  return (
    <section aria-labelledby="course-details-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:gap-12 min-[1440px]:px-[120px]">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <h2 id="course-details-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Course Details & Enquiry
          </h2>
          {facts.length ? (
            <dl className="grid gap-4 min-[700px]:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{fact.label}</dt>
                  <dd className="mt-1 text-eduvert-body leading-6 font-eduvert-600">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {course.enquiryPoints.length ? (
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
          ) : null}
        </div>
        <aside className="flex w-full flex-col gap-4 rounded-eduvert-16 bg-eduvert-tint-yellow p-7 min-[1100px]:w-[532px] min-[1100px]:shrink-0">
          <h3 className="text-[26px] leading-[34px] font-eduvert-700 text-eduvert-text-primary">Ask about this course</h3>
          <p className="text-eduvert-body leading-[27px] font-eduvert-400 text-eduvert-text-secondary">{enquiryCopy(facts.length > 0)}</p>
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
    <section aria-labelledby="course-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-11 min-[1100px]:px-10 min-[1100px]:py-[60px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[620px] flex-col gap-3">
            <h2 id="course-cta-heading" className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Ready to start?
            </h2>
            <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
              Speak with EduVert about the curriculum, fees, and available batches.
            </p>
          </div>
          <CounsellorActions primaryLabel={course.ctaLabel} />
        </div>
      </div>
    </section>
  )
}

function courseFacts(course: Course): CourseFact[] {
  return [
    course.duration ? { label: "DURATION", value: course.duration } : null,
    course.price ? { label: "FEES", value: course.price } : null,
    course.learningMode ? { label: "FORMAT", value: course.learningMode } : null,
  ].filter((fact): fact is CourseFact => fact !== null)
}

function enquiryCopy(hasPublishedFacts: boolean) {
  if (hasPublishedFacts) return "Confirm the current fee, batch schedule, and enrollment details with EduVert."
  return "Contact EduVert for the current duration, fees, available batches, and learning format."
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0")
}

function toolsEyebrow(course: Course) {
  if (course.slug === "seo-course-in-navi-mumbai") return "SEO TOOLS"
  return "TOOLS"
}

const toolTones = [
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
  "bg-eduvert-tint-magenta",
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
]

interface CourseFact {
  label: string
  value: string
}
