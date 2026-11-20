import { ButtonLink } from "@/components/button-link"
import { LearningStudio } from "@/components/learning-studio"
import { coursesHref, liveClassHref, syllabusHref } from "@/components/site-nav"

export function SkillLabHero() {
  return (
    <section
      id="book-a-free-demo"
      aria-labelledby="skill-lab-heading"
      className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[19px] px-6 pt-[31px] pb-[25px] min-[1100px]:grid-cols-[minmax(0,565fr)_minmax(0,674fr)] min-[1100px]:items-start min-[1100px]:gap-[9px] min-[1100px]:px-[clamp(24px,6.67vw,96px)] min-[1100px]:py-16"
    >
      <div className="flex min-w-0 flex-col gap-[19px] min-[1100px]:mt-8 min-[1100px]:gap-[26px]">
        <p className="eduvert-support font-eduvert-700 tracking-[0.09em] text-eduvert-action-primary">
          DIGITAL MARKETING + AI
        </p>
        <h1 id="skill-lab-heading" className="flex flex-col text-balance eduvert-h1">
          <span className="text-eduvert-text-primary">
            Start Applying Digital Marketing Skills from Day 1.
          </span>
          <span className="text-eduvert-action-primary">
            Run, Measure and Optimise Real Campaigns
          </span>
        </h1>
        <p className="max-w-[520px] eduvert-body-large text-eduvert-text-secondary">
          Apply what you learn from your first class. In 4 months, run result-driven campaigns, learn how
          to optimise them, and become job-ready, in small batches of 5-8 students with live projects.
        </p>
        <div className="flex gap-3">
          <ButtonLink href={liveClassHref}>
            Book a Demo Session
            <ArrowUpRight />
          </ButtonLink>
          <ButtonLink href={coursesHref} variant="secondary">
            Explore Courses
          </ButtonLink>
        </div>
        <a href={syllabusHref} download className="inline-flex min-h-11 w-fit items-center eduvert-button text-eduvert-link underline underline-offset-4">Download Syllabus</a>
        <dl className="grid w-full max-w-[342px] grid-cols-[115fr_114fr_113fr] border-t border-eduvert-border-subtle pt-3 min-[1100px]:max-w-[538px] min-[1100px]:grid-cols-[176fr_181fr_181fr] min-[1100px]:pt-[18px]">
          {heroMetrics.map((metric, index) => (
            <div
              key={metric.value}
              className={index === 0 ? "pr-2" : "border-l border-eduvert-border-subtle pl-[11px] min-[1100px]:pl-5"}
            >
              <dd className="eduvert-h3 tracking-[-0.04em] text-eduvert-text-primary">
                {metric.value}
              </dd>
              <dt className="mt-0.5 eduvert-support font-eduvert-600 text-eduvert-text-primary">
                {metric.label}
              </dt>
              {metric.scope ? (
                <dd className="mt-0.5 eduvert-support font-eduvert-500 text-eduvert-text-secondary">
                  {metric.scope}
                </dd>
              ) : (
                <dd
                  aria-hidden="true"
                  className="mt-0.5 eduvert-support"
                >
                  &nbsp;
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
      <LearningStudio />
    </section>
  )
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="cta-arrow ml-2 shrink-0"
    >
      <path
        d="M4 12 12 4m0 0H6m6 0v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const heroMetrics: HeroMetric[] = [
  { value: "5–8", label: "Students per Batch", scope: "" },
  { value: "120+", label: "Hours", scope: "Flagship Program" },
  { value: "80+", label: "Tools", scope: "Flagship Program" },
]

interface HeroMetric {
  value: string
  label: string
  scope: string
}
