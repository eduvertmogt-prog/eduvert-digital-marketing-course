import { demoHref } from "@/components/site-nav"

export function BatchesPage() {
  return (
    <>
      <Hero />
      <Timings />
      <Formats />
      <DemoCta />
    </>
  )
}

function Hero() {
  return (
    <section aria-labelledby="batches-page-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-6 py-12 min-[1100px]:grid-cols-[minmax(0,1fr)_420px] min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex min-w-0 flex-col gap-5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">BATCHES</p>
          <h1 id="batches-page-heading" className="max-w-[620px] eduvert-h1 text-eduvert-text-primary">
            Find a Batch That Fits Your Schedule.
          </h1>
          <p className="max-w-[520px] eduvert-body-large text-eduvert-text-secondary">
            Compare the published weekday and weekend timings for the Professional Digital Marketing Program.
          </p>
          <div className="flex flex-col gap-3 min-[1100px]:flex-row">
            <a href={demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover">
              Book a Free Demo
            </a>
            <a href="#batch-timings" className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 eduvert-button text-eduvert-text-primary hover:bg-eduvert-tint-soft-blue">
              View Batch Timings
            </a>
          </div>
        </div>
        <aside className="rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[0_12px_32px_color-mix(in_srgb,var(--color-eduvert-text-primary)_6%,transparent)] min-[1100px]:p-7">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">PROFESSIONAL DIGITAL MARKETING PROGRAM</p>
          <h2 className="mt-3 eduvert-h3 text-eduvert-text-primary">Weekday and weekend options</h2>
          <p className="mt-2 eduvert-body text-eduvert-text-secondary">
            Compare times and learning modes before checking current availability.
          </p>
        </aside>
      </div>
    </section>
  )
}

function Timings() {
  return (
    <section id="batch-timings" aria-labelledby="batch-timings-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex max-w-[640px] flex-col gap-2">
          <h2 id="batch-timings-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Published Batch Timings
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">Professional Digital Marketing Program</p>
        </div>
        <div>
          <div className="hidden grid-cols-4 border-b border-eduvert-border-subtle pb-3 eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary min-[1100px]:grid">
            <span>BATCH TYPE</span>
            <span>DAYS</span>
            <span>TIMING</span>
            <span>MODE</span>
          </div>
          <ul>
            {publishedBatches.map((batch) => (
              <li key={`${batch.type}-${batch.time}`} className={`border-b border-eduvert-border-subtle ${batch.highlighted ? "bg-eduvert-tint-yellow" : ""}`}>
                <div className="grid gap-1 px-1 py-4 min-[1100px]:grid-cols-4 min-[1100px]:items-center min-[1100px]:py-5">
                  <p className="eduvert-body font-eduvert-700 text-eduvert-text-primary">{batch.type}</p>
                  <p className="order-4 eduvert-body text-eduvert-text-secondary min-[1100px]:order-none">{batch.days}</p>
                  <p className="order-3 eduvert-body font-eduvert-600 text-eduvert-text-primary min-[1100px]:order-none">{batch.time}</p>
                  <p className="order-2 eduvert-support text-eduvert-text-secondary min-[1100px]:order-none min-[1100px]:eduvert-body">{batch.mode}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="eduvert-support text-eduvert-text-secondary">
          Batch schedules are subject to change. Please confirm current availability with EduVert.
        </p>
      </div>
    </section>
  )
}

function Formats() {
  return (
    <section aria-labelledby="learning-formats-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <h2 id="learning-formats-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-center">
          Choose How You Learn
        </h2>
        <ul className="grid gap-4 min-[1100px]:grid-cols-2">
          {learningFormats.map((format) => (
            <li key={format.title} className="flex flex-col gap-2 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-7">
              <h3 className="eduvert-h4 text-eduvert-text-primary">{format.title}</h3>
              <p className="eduvert-body text-eduvert-text-secondary">{format.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function DemoCta() {
  return (
    <section aria-labelledby="batch-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 min-[1100px]:px-10 min-[1100px]:pb-20 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="batch-cta-heading" className="eduvert-h2 text-eduvert-text-primary">
              See How a Class Works
            </h2>
            <p className="eduvert-body text-eduvert-text-secondary">
              Book a demo session and ask EduVert about current batch availability.
            </p>
          </div>
          <a href={demoHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Book a Demo Session
          </a>
        </div>
      </div>
    </section>
  )
}

const publishedBatches = [
  { type: "Weekday", days: "Mon / Wed / Fri", time: "8:00–10:00 AM", mode: "Online / Offline" },
  { type: "Weekday", days: "Mon / Wed / Fri", time: "10:00 AM–12:00 PM", mode: "Online / Offline" },
  { type: "Weekday", days: "Mon / Wed / Fri", time: "2:30–4:30 PM", mode: "Online / Offline" },
  { type: "Weekday", days: "Mon / Wed / Thu", time: "7:00–9:00 PM", mode: "Online / Offline" },
  { type: "Weekend", days: "Sunday", time: "11:00 AM–3:00 PM", mode: "Online / Offline", highlighted: true },
] satisfies BatchRow[]

interface BatchRow {
  type: string
  days: string
  time: string
  mode: string
  highlighted?: boolean
}

const learningFormats = [
  { title: "Classroom Training", detail: "Attend trainer-led sessions in Seawoods, Navi Mumbai." },
  { title: "Live Online Learning", detail: "Join live, trainer-led sessions remotely." },
]
