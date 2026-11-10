import { counsellorActions, programStats } from "@/components/programs/program-content"
import { coursesHref } from "@/components/site-nav"

export function ProgramHero() {
  return (
    <section aria-labelledby="program-hero-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-7 min-[1100px]:gap-[30px] min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[42px]">
        <a href={coursesHref} className="inline-flex w-fit items-center text-eduvert-support leading-[22px] font-eduvert-600 text-eduvert-link">
          ← All Programs
        </a>
        <div className="flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-10 min-[1440px]:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-4 min-[1440px]:max-w-[554px]">
            <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">FLAGSHIP PROGRAM</p>
            <h1 id="program-hero-heading" className="text-eduvert-h1-mobile leading-eduvert-h1-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h1 min-[1100px]:leading-[59px]">
              Professional Digital Marketing Program
            </h1>
            <p className="text-eduvert-body-large-mobile leading-[27px] text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
              Plan campaigns, measure what works, and build a portfolio through hands-on assignments, live projects, and a capstone.
            </p>
            <div className="flex flex-col gap-3 min-[1100px]:flex-row">
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover">
                {counsellorActions.demoLabel}
              </a>
              <a href="#curriculum" className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-magenta">
                View Curriculum
              </a>
            </div>
            <p className="text-eduvert-support leading-[21px] font-eduvert-500 text-eduvert-text-secondary">
              Classroom in Seawoods, Navi Mumbai · Live Online
            </p>
          </div>
          <img src="/images/program-workspace.png" alt="Illustrative workspace" width={1951} height={806} className="h-[220px] w-full rounded-eduvert-16 object-cover min-[1100px]:h-[242px] min-[1100px]:w-[46%] min-[1100px]:max-w-[582px] min-[1100px]:shrink-0" />
        </div>
        <dl className="grid grid-cols-2 gap-4 pt-2 min-[1100px]:flex min-[1100px]:gap-[42px] min-[1100px]:pt-[21px]">
          {programStats.map((stat) => (
            <div key={stat.label} className="min-[1100px]:min-w-[140px]">
              <dt className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-eduvert-h3 min-[1100px]:leading-[34px]">{stat.value}</dt>
              <dd className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
