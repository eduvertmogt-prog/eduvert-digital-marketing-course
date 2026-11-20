import { programBatches } from "@/components/programs/program-content"
import { batchesHref } from "@/components/site-nav"

export function ProgramBatches() {
  return (
    <section aria-labelledby="program-batches-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-6 pt-10 pb-9 min-[1100px]:gap-8 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:pt-16 min-[1100px]:pb-12">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">LEARNING OPTIONS</p>
          <h2 id="program-batches-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Formats & batches
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Both formats include live instruction, AI-tool assignments, campaign simulations, and time with mentors to work through questions.
          </p>
        </div>
        <div className="flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-8 min-[1440px]:gap-12">
          <div className="min-w-0 min-[1100px]:flex-1">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr] border-b border-eduvert-border-subtle px-1 pb-3 eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary min-[1100px]:grid">
              <span>BATCH</span>
              <span>DAYS</span>
              <span>TIME</span>
            </div>
            <ol>
              {programBatches.map((batch) => (
                <li key={batch.name} className="grid gap-1 border-b border-eduvert-border-subtle py-4 min-[1100px]:grid-cols-[1.2fr_1fr_1fr] min-[1100px]:items-center min-[1100px]:py-[18px]">
                  <p className="eduvert-body font-eduvert-600 text-eduvert-text-primary">{batch.name}</p>
                  <p className="eduvert-body text-eduvert-text-secondary">{batch.days}</p>
                  <p className="eduvert-body text-eduvert-text-secondary">{batch.time}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-col gap-3 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between">
              <p className="eduvert-support text-eduvert-text-secondary">Confirm current availability with EduVert.</p>
              <a href={batchesHref} className="eduvert-button text-eduvert-link">View All Batches →</a>
            </div>
          </div>
          <aside className="rounded-eduvert-16 bg-eduvert-tint-blue p-6 min-[1100px]:w-[300px] min-[1100px]:shrink-0 min-[1440px]:w-[400px]">
            <h3 className="eduvert-h4 text-eduvert-text-primary">Choose how you learn</h3>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <h4 className="eduvert-h4 text-eduvert-text-primary">Classroom in Navi Mumbai</h4>
                <p className="eduvert-body text-eduvert-text-secondary">Attend interactive, trainer-led sessions in person.</p>
              </div>
              <div>
                <h4 className="eduvert-h4 text-eduvert-text-primary">Live Online</h4>
                <p className="eduvert-body text-eduvert-text-secondary">Join scheduled classes remotely and get mentor support as you work through assignments.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
