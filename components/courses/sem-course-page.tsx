import { CourseHeroVisualArt } from "@/components/courses/course-hero-visual"
import type { Course } from "@/components/courses/course-data"
import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { counsellorActions, type FaqItem } from "@/components/programs/program-content"
import { PageFaq } from "@/components/programs/page-faq"
import { coursesHref } from "@/components/site-nav"

export function SemCoursePage({ course, questions }: { course: Course; questions: FaqItem[] }) {
  return (
    <>
      <Hero course={course} />
      <Practical />
      <Curriculum course={course} />
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
            {course.duration ? <p className="text-eduvert-support leading-[21px] font-eduvert-500 text-eduvert-text-secondary">{course.duration}</p> : null}
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

function Practical() {
  return (
    <section aria-labelledby="sem-practical-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">PRACTICAL LEARNING</p>
          <h2 id="sem-practical-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            From Campaign Setup to Optimization
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            A clear progression from research to responsible campaign analysis.
          </p>
        </div>
        <ol className="grid gap-6 min-[1100px]:grid-cols-3">
          {practicalSteps.map((step) => (
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
    <section id="curriculum" aria-labelledby="sem-curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[360px] min-[1100px]:shrink-0">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="sem-curriculum-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            What You’ll Learn
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            Published SEM topic groupings, presented as a structured learning path.
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

function Skills({ course }: { course: Course }) {
  return (
    <section aria-labelledby="sem-skills-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">PRACTICAL SKILLS</p>
          <h2 id="sem-skills-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Skills You’ll Work With
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            Build practical familiarity without promising a particular advertising result.
          </p>
        </div>
        <ul className="grid gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-5">
          {course.highlights.map((skill, index) => (
            <li key={skill} className={`flex min-h-[127px] items-end rounded-eduvert-12 px-4 py-5 text-[16px] leading-[22px] font-eduvert-700 text-eduvert-text-primary ${skillTones[index % skillTones.length]}`}>
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
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[68px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">WHO CAN JOIN?</p>
          <h2 id="sem-audience-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            A focused course for two starting points.
          </h2>
        </div>
        <ul className="grid gap-4 min-[1100px]:grid-cols-2">
          {course.audience.map((person, index) => (
            <li key={person} className="flex flex-col gap-2 rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)]">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{audienceLabels[index] ?? "LEARNERS"}</p>
              <p className="text-[20px] leading-7 font-eduvert-600 text-eduvert-text-primary">{person}</p>
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
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">COURSE INFORMATION</p>
          <h2 id="sem-info-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Plan Your Next Step
          </h2>
        </div>
        <dl className="grid gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {info.map((item) => (
            <div key={item.label} className="flex flex-col gap-2 rounded-eduvert-16 bg-eduvert-canvas-warm p-5">
              <dt className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{item.label}</dt>
              <dd className="text-[20px] leading-7 font-eduvert-700 text-eduvert-text-primary">{item.value}</dd>
              <dd className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">{item.detail}</dd>
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
      <div className="mx-auto w-full max-w-[1440px] px-6 py-11 min-[1100px]:px-10 min-[1100px]:py-[60px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[620px] flex-col gap-3">
            <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">READY TO BEGIN?</p>
            <h2 id="sem-cta-heading" className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Ready to Learn Search Engine Marketing?
            </h2>
            <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
              Speak with EduVert about the SEM curriculum, course fees, and upcoming batches.
            </p>
          </div>
          <CounsellorActions primaryLabel={course.ctaLabel} />
        </div>
      </div>
    </section>
  )
}

function courseInfo(course: Course) {
  return [
    {
      label: "TYPICAL DURATION",
      value: "4–6 weeks",
      detail: course.duration ?? "Varies by batch",
    },
    {
      label: "PRACTICAL WORK",
      value: "Projects and case studies",
      detail: course.practicalWork.at(-1) ?? "Hands-on exercises grounded in the course.",
    },
    {
      label: "FEES",
      value: course.price ?? "Enquire for details",
      detail: "No unverified fee is published here.",
    },
    {
      label: "BATCH AVAILABILITY",
      value: "Confirm with EduVert",
      detail: "Ask about the next available batch.",
    },
  ]
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0")
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
  "bg-eduvert-tint-magenta",
  "bg-eduvert-tint-blue",
  "bg-eduvert-tint-yellow",
]
