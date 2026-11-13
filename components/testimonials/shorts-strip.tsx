import { Reveal } from "@/components/reveal"
import { ShortCard } from "@/components/shorts"
import { shorts } from "@/components/shorts-data"

/**
 * Snap-scroll row of the four student Shorts. Players load only on tap
 * (see ShortCard), so the strip costs four small thumbnails up front.
 */
export function ShortsStrip() {
  return (
    <section aria-labelledby="shorts-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">
            STUDENT SHORTS
          </p>
          <h2 id="shorts-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Hear It From Them
          </h2>

        </div>
        <div className="shorts-row -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 min-[1100px]:mx-0 min-[1100px]:grid min-[1100px]:snap-none min-[1100px]:grid-cols-4 min-[1100px]:overflow-visible min-[1100px]:px-0">
          {shorts.map((short, index) => (
            <Reveal key={short.id} delay={index * 70} className="min-w-0 shrink-0 snap-start">
              <ShortCard short={short} />
            </Reveal>
          ))}
        </div>
        <a href="https://www.youtube.com/@eduvertonline" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-fit items-center gap-2.5 eduvert-button text-eduvert-link">
          More on YouTube @eduvertonline
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
            <path d="M3.5 9h10.3M9.5 4.7 14 9l-4.5 4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}
