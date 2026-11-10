import { programSteps } from "@/components/programs/program-content"

export function PracticalLearning() {
  return (
    <section aria-labelledby="practical-learning-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-6 py-[52px] min-[1100px]:gap-[30px] min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[70px]">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">PRACTICAL LEARNING</p>
          <h2 id="practical-learning-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Build as you learn
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">
            Move from planning and setup to measurement and a capstone project.
          </p>
        </div>
        <ol className="grid gap-6 min-[1100px]:grid-cols-3 min-[1100px]:gap-6">
          {programSteps.map((step) => (
            <li key={step.title} className="flex flex-col gap-2">
              <h3 className="text-eduvert-h4-mobile leading-[27px] font-eduvert-600 text-eduvert-text-primary min-[1100px]:text-eduvert-h4 min-[1100px]:leading-[28px]">{step.title}</h3>
              <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
