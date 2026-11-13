import { contactHref } from "@/components/site-nav"

export function PlacementsPage() {
  return (
    <>
      <Hero />
      <Steps />
      <Portfolio />
      <SupportCta />
    </>
  )
}

function Hero() {
  return (
    <section aria-labelledby="placements-page-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-6 py-12 min-[1100px]:grid-cols-[minmax(0,1fr)_420px] min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex min-w-0 flex-col gap-5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PLACEMENTS & CAREER SUPPORT</p>
          <h1 id="placements-page-heading" className="max-w-[620px] eduvert-h1 text-eduvert-text-primary">
            Prepare for What Comes Next.
          </h1>
          <p className="max-w-[520px] eduvert-body-large text-eduvert-text-secondary">
            Explore the career preparation and referral support available through the Professional Digital Marketing Program.
          </p>
          <a href={contactHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Enquire About Career Support
          </a>
        </div>
        <aside className="rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[0_12px_32px_color-mix(in_srgb,var(--color-eduvert-text-primary)_6%,transparent)] min-[1100px]:p-7">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PROJECT → PORTFOLIO</p>
          <h2 className="mt-3 eduvert-h3 text-eduvert-text-primary">Show how you work</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {portfolioSteps.map((step) => (
              <li key={step.number} className="flex items-center gap-3">
                <span className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{step.number}</span>
                <span className="eduvert-body font-eduvert-600 text-eduvert-text-primary">{step.title}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}

function Steps() {
  return (
    <section aria-labelledby="career-steps-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="career-steps-heading" className="max-w-[640px] eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
          Career Preparation, Step by Step
        </h2>
        <ol className="grid gap-6 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {careerSteps.map((step) => (
            <li key={step.number} className="flex flex-col gap-3 border-t border-eduvert-border-subtle pt-5">
              <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{step.number}</p>
              <h3 className="eduvert-h4 text-eduvert-text-primary">{step.title}</h3>
              <p className="eduvert-body text-eduvert-text-secondary">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Portfolio() {
  return (
    <section aria-labelledby="portfolio-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="grid gap-4 min-[1100px]:grid-cols-2">
          <article className="flex flex-col gap-3 rounded-eduvert-16 bg-eduvert-surface-white px-6 py-7">
            <h2 id="portfolio-heading" className="eduvert-h3 text-eduvert-text-primary">Turn Projects Into Portfolio Pieces</h2>
            <p className="eduvert-body text-eduvert-text-secondary">
              Use your project work to explain the brief, the choices you made, and what you learned. A portfolio gives you examples to discuss in interviews.
            </p>
          </article>
          <article className="flex flex-col gap-4 rounded-eduvert-16 bg-eduvert-tint-blue px-6 py-7">
            <h2 className="eduvert-h3 text-eduvert-text-primary">Support Along the Way</h2>
            <ul className="flex flex-col">
              {supportItems.map((item) => (
                <li key={item} className="border-t border-eduvert-border-subtle py-3 eduvert-body font-eduvert-600 text-eduvert-text-primary first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <p className="eduvert-support text-eduvert-text-secondary">
          Placement assistance does not guarantee employment.
        </p>
      </div>
    </section>
  )
}

function SupportCta() {
  return (
    <section aria-labelledby="placements-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 min-[1100px]:px-10 min-[1100px]:pb-20 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="placements-cta-heading" className="eduvert-h2 text-eduvert-text-primary">
              Ask About Career Support
            </h2>
            <p className="eduvert-body text-eduvert-text-secondary">
              Speak with EduVert about practical projects and the support available with the program.
            </p>
          </div>
          <a href={contactHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-center eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Enquire About Career Support
          </a>
        </div>
      </div>
    </section>
  )
}

const portfolioSteps = [
  { number: "01", title: "The brief" },
  { number: "02", title: "Your approach" },
  { number: "03", title: "What you learned" },
]

const careerSteps = [
  { number: "01", title: "Practical project experience", detail: "Work on practical assignments and projects you can discuss in an interview." },
  { number: "02", title: "Resume and portfolio guidance", detail: "Organize your skills and examples of your work." },
  { number: "03", title: "Mock interview preparation", detail: "Practise explaining your decisions and responding to interview questions." },
  { number: "04", title: "Job referral assistance", detail: "Ask about referral support for relevant opportunities." },
]

const supportItems = ["Resume and portfolio guidance", "Mock interview preparation", "Job referral assistance"]
