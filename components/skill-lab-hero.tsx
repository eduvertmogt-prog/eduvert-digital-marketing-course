import { ButtonLink } from "@/components/button-link"
import { LearningStudio } from "@/components/learning-studio"
import { coursesHref, demoHref } from "@/components/site-nav"

export function SkillLabHero() {
  return (
    <section
      id="book-a-free-demo"
      aria-labelledby="skill-lab-heading"
      className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[19px] px-6 pt-[31px] pb-[25px] min-[1100px]:grid-cols-[minmax(0,565fr)_minmax(0,674fr)] min-[1100px]:items-start min-[1100px]:gap-[9px] min-[1100px]:px-[clamp(24px,6.67vw,96px)] min-[1100px]:pt-[108px] min-[1100px]:pb-[158px]"
    >
      <div className="flex min-w-0 flex-col gap-[19px] min-[1100px]:mt-[66px] min-[1100px]:gap-[26px]">
        <p className="text-[11px] leading-4 font-eduvert-700 tracking-[0.09em] text-eduvert-action-primary min-[1100px]:text-[13px] min-[1100px]:leading-[18px]">
          DIGITAL MARKETING + DATA ANALYTICS
        </p>
        <h1 id="skill-lab-heading" className="flex flex-col">
          <span className="text-[40px] leading-[44px] font-eduvert-700 tracking-eduvert-h1 whitespace-nowrap text-eduvert-text-primary min-[1100px]:text-[clamp(48px,4.7222vw,68px)] min-[1100px]:leading-[1.0588]">
            Don&apos;t just learn it.
          </span>
          <span className="text-[40px] leading-[44px] font-eduvert-700 tracking-eduvert-h1 whitespace-nowrap text-eduvert-action-primary min-[1100px]:text-[clamp(48px,4.7222vw,68px)] min-[1100px]:leading-[1.0588]">
            Build with it.
          </span>
        </h1>
        <p className="max-w-[520px] text-eduvert-body-large-mobile leading-eduvert-body-large-mobile text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-eduvert-body-large">
          Hands-on courses, real projects, and expert guidance. Learn in Seawoods, Navi Mumbai, or live
          online.
        </p>
        <div className="flex gap-3">
          <ButtonLink href={demoHref}>Book a Free Demo</ButtonLink>
          <ButtonLink href={coursesHref} variant="secondary">
            Explore Courses
          </ButtonLink>
        </div>
        <dl className="grid w-full max-w-[342px] grid-cols-[115fr_114fr_113fr] border-t border-eduvert-border-subtle pt-3 min-[1100px]:max-w-[538px] min-[1100px]:grid-cols-[176fr_181fr_181fr] min-[1100px]:pt-[18px]">
          {heroMetrics.map((metric, index) => (
            <div
              key={metric.value}
              className={index === 0 ? "pr-2" : "border-l border-eduvert-border-subtle pl-[11px] min-[1100px]:pl-5"}
            >
              <dd className="text-[23px] leading-[25px] font-eduvert-700 tracking-[-0.04em] text-eduvert-text-primary min-[1100px]:text-[31px] min-[1100px]:leading-[34px]">
                {metric.value}
              </dd>
              <dt className="mt-0.5 text-[11px] leading-[15px] font-eduvert-600 text-eduvert-text-primary min-[1100px]:text-eduvert-support min-[1100px]:leading-[19px]">
                {metric.label}
              </dt>
              {metric.scope ? (
                <dd className="mt-0.5 text-[10px] leading-[13px] font-eduvert-500 text-eduvert-text-secondary min-[1100px]:text-[12px] min-[1100px]:leading-4">
                  {metric.scope}
                </dd>
              ) : (
                <dd
                  aria-hidden="true"
                  className="mt-0.5 text-[10px] leading-[13px] min-[1100px]:text-[12px] min-[1100px]:leading-4"
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
