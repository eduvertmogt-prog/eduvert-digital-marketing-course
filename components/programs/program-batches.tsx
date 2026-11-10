import { programBatches } from "@/components/programs/program-content"
import { batchesHref } from "@/components/site-nav"

export function ProgramBatches() {
  return (
    <section aria-labelledby="program-batches-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-6 py-[52px] min-[1100px]:gap-8 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[72px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">LEARNING OPTIONS</p>
          <h2 id="program-batches-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Formats & batches
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">
            Published timings for the Professional Digital Marketing Program.
          </p>
        </div>
        <div className="flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-8 min-[1440px]:gap-12">
          <div className="min-w-0 min-[1100px]:flex-1">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr] border-b border-eduvert-border-subtle px-1 pb-3 text-[12px] leading-[18px] font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary min-[1100px]:grid">
              <span>BATCH</span>
              <span>DAYS</span>
              <span>TIME</span>
            </div>
            <ol>
              {programBatches.map((batch) => (
                <li key={batch.name} className="grid gap-1 border-b border-eduvert-border-subtle py-4 min-[1100px]:grid-cols-[1.2fr_1fr_1fr] min-[1100px]:items-center min-[1100px]:py-[18px]">
                  <p className="text-eduvert-body leading-6 font-eduvert-600 text-eduvert-text-primary">{batch.name}</p>
                  <p className="text-eduvert-body leading-6 text-eduvert-text-secondary">{batch.days}</p>
                  <p className="text-eduvert-body leading-6 text-eduvert-text-secondary">{batch.time}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-col gap-3 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between">
              <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">Confirm current availability with EduVert.</p>
              <a href={batchesHref} className="text-[15px] leading-[22px] font-eduvert-600 text-eduvert-link">View All Batches →</a>
            </div>
          </div>
          <aside className="rounded-eduvert-16 bg-eduvert-tint-blue p-6 min-[1100px]:w-[300px] min-[1100px]:shrink-0 min-[1440px]:w-[400px]">
            <h3 className="text-eduvert-h4-mobile leading-[27px] font-eduvert-600 text-eduvert-text-primary min-[1100px]:text-eduvert-h4 min-[1100px]:leading-[28px]">Choose how you learn</h3>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <h4 className="text-eduvert-body leading-6 font-eduvert-600 text-eduvert-text-primary">Classroom in Seawoods</h4>
                <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">Attend in person in Seawoods, Navi Mumbai.</p>
              </div>
              <div>
                <h4 className="text-eduvert-body leading-6 font-eduvert-600 text-eduvert-text-primary">Live Online</h4>
                <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">Join live classes remotely.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
