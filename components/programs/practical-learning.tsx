import { programSteps } from "@/components/programs/program-content"
import { testimonialsHref } from "@/components/site-nav"

export function PracticalLearning() {
  return (
    <section aria-labelledby="practical-learning-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-6 py-[52px] min-[1100px]:gap-[30px] min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[70px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <h2 id="practical-learning-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            What you’ll build
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Go from a guided assignment to a live campaign and a capstone you can explain in an interview.
          </p>
        </div>
        <div className="grid gap-6 min-[1100px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] min-[1100px]:items-start min-[1100px]:gap-12">
          <ol className="divide-y divide-eduvert-border-subtle border-y border-eduvert-border-subtle">
            {programSteps.map((step) => (
              <li key={step.title} className="grid gap-1 py-4">
                <h3 className="eduvert-h4 text-eduvert-text-primary">{step.title}</h3>
                <p className="eduvert-body text-eduvert-text-secondary">{step.detail}</p>
              </li>
            ))}
          </ol>
          <aside className="grid gap-4 rounded-eduvert-16 bg-eduvert-tint-blue p-5 min-[1100px]:p-6">
            <div className="grid gap-2">
              <p className="eduvert-support font-eduvert-600 text-eduvert-text-secondary">Illustrative capstone example</p>
              <h3 className="eduvert-h4 text-eduvert-text-primary">Plan a campaign for a local business</h3>
              <ul className="list-disc space-y-1 pl-5 eduvert-body text-eduvert-text-secondary">
                <li>Define the audience and campaign goal.</li>
                <li>Draft ads and choose where they’ll run.</li>
                <li>Decide how to track leads and what to test.</li>
              </ul>
            </div>
            <figure className="grid gap-2 border-t border-eduvert-border-subtle pt-4">
              <blockquote className="eduvert-body font-eduvert-600 text-eduvert-text-primary">
                “The live case studies are the real game changer.”
              </blockquote>
              <figcaption className="eduvert-support text-eduvert-text-secondary">
                Vinay Kashid · <a href={testimonialsHref} className="text-eduvert-link underline underline-offset-4">Student review via Google</a>
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>
    </section>
  )
}
