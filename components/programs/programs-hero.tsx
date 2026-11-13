import { counsellorActions, focusLinks } from "@/components/programs/program-content"

export function ProgramsHero() {
  return (
    <section aria-labelledby="programs-hero-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-10 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-16">
        <div className="flex flex-col gap-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-10 min-[1440px]:gap-[100px]">
          <div className="flex min-w-0 flex-1 flex-col gap-5 min-[1440px]:max-w-[625px]">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PROGRAMS</p>
            <h1 id="programs-hero-heading" className="eduvert-h1 text-eduvert-text-primary">
              Find the Right Course for Your Goals.
            </h1>
            <p className="eduvert-body-large text-eduvert-text-secondary">
              Explore practical Digital Marketing and Data Analytics courses designed around hands-on learning, real projects, and expert guidance.
            </p>
            <div className="flex flex-col gap-3 min-[1100px]:flex-row">
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:min-w-[174px]">
                {counsellorActions.demoLabel}
              </a>
              <a href="#all-programs" className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 eduvert-button text-eduvert-text-primary hover:bg-eduvert-tint-soft-blue min-[1100px]:min-w-[174px]">
                Explore Programs
              </a>
            </div>
            <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">
              Classroom in Seawoods, Navi Mumbai · Live Online
            </p>
          </div>
          <nav aria-label="Find your focus" className="hidden w-[320px] shrink-0 flex-col gap-1.5 pt-6 min-[1100px]:flex min-[1440px]:w-[435px]">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">FIND YOUR FOCUS</p>
            {focusLinks.map((link) => (
              <a key={link.href} href={link.href} className="flex h-[55px] items-center gap-4 border-b border-eduvert-border-subtle py-[15px]">
                <span className="w-[61px] shrink-0 eduvert-support font-eduvert-700 text-eduvert-action-primary">{link.number}</span>
                <span className="eduvert-body font-eduvert-700 text-eduvert-link">{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
