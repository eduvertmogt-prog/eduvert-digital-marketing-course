import { demoHref } from "@/components/site-nav"

export function QuestionsBand() {
  return (
    <section aria-labelledby="questions-heading" className="flex justify-center bg-eduvert-canvas-warm px-6 pb-12 min-[1100px]:px-10 min-[1100px]:pb-[72px] min-[1440px]:px-[60px]">
      <div className="flex w-full max-w-[342px] flex-col items-start gap-6 rounded-[20px] bg-eduvert-tint-yellow px-6 py-12 min-[1100px]:max-w-[1200px] min-[1100px]:items-center min-[1100px]:gap-7 min-[1100px]:rounded-[22px] min-[1100px]:px-10 min-[1100px]:py-20">
        <div className="flex w-full max-w-[294px] flex-col items-start gap-3 min-[1100px]:w-[720px] min-[1100px]:max-w-none min-[1100px]:items-center min-[1100px]:gap-3.5">
          <h2 id="questions-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-center min-[1100px]:text-eduvert-h2 min-[1100px]:leading-[46px]">
            Have questions about our courses?
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:max-w-[540px] min-[1100px]:text-center min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
            Speak with EduVert about course content, fees, batch timings, and learning in the classroom or live online.
          </p>
        </div>
        <div className="flex w-full max-w-[294px] flex-col gap-3 min-[1100px]:w-auto min-[1100px]:max-w-none min-[1100px]:flex-row min-[1100px]:gap-3.5">
          <a href={demoHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary text-eduvert-button leading-[21px] font-eduvert-700 text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-[181px]">
            Book a Free Demo
          </a>
          <a href={demoHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 border border-eduvert-action-primary text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-action-primary hover:bg-eduvert-surface-white min-[1100px]:w-[194px]">
            Talk to Our Counsellor
          </a>
        </div>
      </div>
    </section>
  )
}
