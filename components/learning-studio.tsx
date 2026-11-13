export function LearningStudio() {
  return (
    <figure className="relative aspect-[342/283] w-full overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm shadow-[inset_0_0_0_1px_var(--color-eduvert-border-subtle)] min-[1100px]:aspect-[674/646]">
      <div className="studio-grid absolute inset-0" aria-hidden="true" />
      <div className="studio-deep-blue absolute rounded-full" aria-hidden="true" />
      <div className="studio-yellow absolute rounded-full" aria-hidden="true" />
      <div className="studio-blue absolute rounded-full" aria-hidden="true" />
      <img
        src="/images/exec-09668476-d664-4115-bc99-630f3e60408d.png"
        alt="A student working on a laptop beside a student writing in a notebook"
        width={1536}
        height={1024}
        className="studio-portrait absolute object-cover object-center"
      />
      <p className="studio-kicker absolute z-10 text-[10px] leading-[13px] font-eduvert-700 tracking-[0.13em] text-eduvert-text-primary min-[1100px]:text-[13px] min-[1100px]:leading-[18px]">
        LEARNING STUDIO
      </p>
      <p className="studio-mark absolute z-10 hidden text-right text-[11px] leading-4 font-eduvert-600 tracking-[0.11em] text-eduvert-text-secondary min-[1100px]:block">
        THE SKILL LAB
      </p>
      <div className="studio-header-rule absolute z-10 hidden min-[1100px]:block" aria-hidden="true" />
      <article className="studio-campaign absolute z-10 hidden flex-col gap-2 rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-surface-white p-4 min-[1100px]:flex">
        <p className="text-[10px] leading-[14px] font-eduvert-700 tracking-[0.09em] text-eduvert-action-primary">
          01 / SAMPLE ASSIGNMENT
        </p>
        <h2 className="text-[20px] leading-6 font-eduvert-700 text-eduvert-text-primary">Campaign brief</h2>
        <div className="flex flex-col gap-1 border-t border-eduvert-border-subtle pt-2">
          <p className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">01 Define the audience</p>
          <p className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">02 Draft the message</p>
        </div>
      </article>
      <article className="studio-channel absolute z-10 flex flex-col gap-1 rounded-eduvert-12 border border-eduvert-border-subtle bg-eduvert-surface-white p-2.5 min-[1100px]:gap-2 min-[1100px]:p-[14px]">
        <p className="text-[9px] leading-[11px] font-eduvert-700 tracking-[0.09em] text-eduvert-action-primary min-[1100px]:text-[10px] min-[1100px]:leading-[14px]">
          <span className="min-[1100px]:hidden">SAMPLE PROJECT</span>
          <span className="hidden min-[1100px]:inline">02 / SAMPLE ASSIGNMENT</span>
        </p>
        <h2 className="text-[14px] leading-4 font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-[20px] min-[1100px]:leading-6">
          Channel analysis
        </h2>
        <div className="flex h-8 shrink-0 items-end gap-1.5" aria-hidden="true">
          {channelBars.map((bar) => (
            <span
              key={`${bar.height}-${bar.tone}`}
              className={`w-[7px] rounded-[2px] min-[1100px]:w-4 ${barTones[bar.tone]}`}
              style={{ height: bar.height }}
            />
          ))}
        </div>
      </article>
      <div className="studio-footer-rule absolute z-10" aria-hidden="true" />
    </figure>
  )
}

const channelBars: ChannelBar[] = [
  { height: 10, tone: "blue" },
  { height: 18, tone: "blue" },
  { height: 15, tone: "blue" },
  { height: 25, tone: "blue" },
  { height: 21, tone: "blue" },
  { height: 31, tone: "blueDeep" },
  { height: 26, tone: "blue" },
]

const barTones = {
  blue: "bg-eduvert-brand-blue opacity-[0.62]",
  blueDeep: "bg-eduvert-brand-blue-deep",
}

interface ChannelBar {
  height: number
  tone: keyof typeof barTones
}
