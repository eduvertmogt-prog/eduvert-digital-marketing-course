import { batchesHref, demoHref } from "@/components/site-nav"

export function LearningOptions() {
  return (
    <section id="batches" aria-labelledby="batches-heading" className="flex justify-center border-t border-eduvert-border-subtle bg-eduvert-surface-white px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[60px]">
      <div className="flex w-full max-w-[342px] flex-col gap-8 min-[1100px]:max-w-[1200px] min-[1100px]:gap-10">
        <div className="flex flex-col gap-2.5 min-[1100px]:w-[700px] min-[1100px]:gap-3">
          <h2 id="batches-heading" className="max-w-[250px] eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:max-w-none">
            Batches &amp; Learning Options
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary min-[1100px]:max-w-[680px] min-[1100px]:eduvert-body-large">
            Explore the published batch timings for our Professional Digital Marketing Program, with classroom and live online options.
          </p>
        </div>
        <div className="flex flex-col items-start gap-8 min-[1100px]:flex-row min-[1100px]:gap-12">
          <div className="flex w-full min-w-0 flex-col gap-[18px] min-[1100px]:flex-1 min-[1100px]:gap-[22px] min-[1440px]:w-[792px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
            <div className="flex flex-col gap-[7px] min-[1100px]:gap-2">
              <h3 className="max-w-[284px] eduvert-h3 tracking-[-0.016em] text-eduvert-text-primary min-[1100px]:max-w-none">
                Professional Digital Marketing Program
              </h3>
              <p className="eduvert-body text-eduvert-text-secondary min-[1100px]:max-w-[720px]">
                Choose a convenient time. Confirm current availability when booking your demo.
              </p>
            </div>
            <div>
              <div className="hidden h-[42px] items-center border-b border-eduvert-border-subtle min-[1100px]:flex">
                <span className="w-[355px] shrink-0 eduvert-support font-eduvert-600 text-eduvert-text-secondary">Batch</span>
                <span className="w-[192px] shrink-0 eduvert-support font-eduvert-600 text-eduvert-text-secondary">Days</span>
                <span className="w-[245px] shrink-0 eduvert-support font-eduvert-600 text-eduvert-text-secondary">Time</span>
              </div>
              <ul className="border-t border-eduvert-border-subtle min-[1100px]:border-t-0">
                {programBatches.map((batch) => (
                  <li key={batch.index} className="flex items-start border-b border-eduvert-border-subtle py-3 min-[1100px]:h-[74px] min-[1100px]:items-center min-[1100px]:py-0">
                    <span className="w-[34px] shrink-0 eduvert-support font-eduvert-500 text-eduvert-text-secondary min-[1100px]:w-11">
                      {batch.index}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 min-[1100px]:contents">
                      <span className="eduvert-body font-eduvert-700 text-eduvert-text-primary min-[1100px]:min-w-0 min-[1100px]:flex-1 min-[1100px]:eduvert-body-large min-[1440px]:w-[311px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
                        {batch.name}
                      </span>
                      <div className="flex min-[1100px]:contents">
                        <span className="w-[135px] shrink-0 eduvert-body text-eduvert-text-secondary min-[1100px]:w-[28%] min-[1440px]:w-[192px]">
                          {batch.days}
                        </span>
                        <span className="eduvert-body font-eduvert-600 text-eduvert-text-primary min-[1100px]:w-[32%] min-[1100px]:shrink-0 min-[1440px]:w-[245px]">
                          {batch.time}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="flex w-full flex-col gap-[18px] rounded-eduvert-12 bg-eduvert-tint-blue p-[22px] min-[1100px]:w-[280px] min-[1100px]:shrink-0 min-[1100px]:gap-5 min-[1100px]:p-7 min-[1440px]:w-[360px]">
            <h3 className="eduvert-h3 tracking-[-0.016em] text-eduvert-text-primary">
              Learn your way
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h4 className="eduvert-h4 text-eduvert-text-primary">Classroom in Seawoods</h4>
                <p className="eduvert-body text-eduvert-text-secondary">
                  Attend in-person sessions at EduVert&apos;s Navi Mumbai location.
                </p>
              </div>
              <div className="flex flex-col gap-1 border-t border-eduvert-border-subtle pt-4">
                <h4 className="eduvert-h4 text-eduvert-text-primary">Live Online</h4>
                <p className="eduvert-body text-eduvert-text-secondary">Join live sessions remotely.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <a href={demoHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover">
                Book a Free Demo
              </a>
              <a href={batchesHref} className="inline-flex h-11 w-fit items-center gap-[9px] eduvert-button text-eduvert-link">
                View All Batches
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
                  <path d="M3.5 9h10.3M9.5 4.7 14 9l-4.5 4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p className="max-w-[239px] eduvert-support text-eduvert-text-secondary">
                Published timings are indicative; please confirm the current batch schedule with EduVert.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

const programBatches: ProgramBatch[] = [
  { index: "01", name: "Weekday · Morning", days: "Mon / Wed / Fri", time: "8:00–10:00 AM" },
  { index: "02", name: "Weekday · Late morning", days: "Mon / Wed / Fri", time: "10:00 AM–12:00 PM" },
  { index: "03", name: "Weekday · Afternoon", days: "Mon / Wed / Fri", time: "2:30–4:30 PM" },
  { index: "04", name: "Weekday · Evening", days: "Mon / Wed / Thu", time: "7:00–9:00 PM" },
  { index: "05", name: "Weekend · Sunday", days: "Sunday", time: "11:00 AM–3:00 PM" },
]

interface ProgramBatch {
  index: string
  name: string
  days: string
  time: string
}
