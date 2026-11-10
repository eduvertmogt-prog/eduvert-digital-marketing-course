import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { careerSteps } from "@/components/programs/program-content"

export function ProgramCareer() {
  return (
      <section id="career" aria-labelledby="program-career-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-[52px] min-[1100px]:gap-7 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[72px]">
          <div className="flex max-w-[640px] flex-col gap-3.5">
            <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">CAREER SUPPORT</p>
            <h2 id="program-career-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Prepare for your next step
            </h2>
            <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">
              Get support presenting your work, preparing for interviews, and exploring opportunities.
            </p>
          </div>
          <ol className="grid gap-6 min-[1100px]:grid-cols-3 min-[1100px]:gap-6">
            {careerSteps.map((step) => (
              <li key={step.number} className="flex flex-col gap-2">
                <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{step.number}</p>
                <h3 className="text-eduvert-h4-mobile leading-[27px] font-eduvert-600 text-eduvert-text-primary min-[1100px]:text-eduvert-h4 min-[1100px]:leading-[28px]">{step.title}</h3>
                <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">{step.detail}</p>
              </li>
            ))}
          </ol>
          <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">EduVert provides placement assistance. Employment is not guaranteed.</p>
        </div>
      </section>
  )
}

export function EnrolmentBand() {
  return (
      <section aria-labelledby="enrolment-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-11 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[60px]">
          <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-10 min-[1100px]:px-12 min-[1100px]:py-11">
            <div className="flex max-w-[620px] flex-col gap-3">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">FEES & ENROLMENT</p>
              <h2 id="enrolment-heading" className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
                Talk through your next step
              </h2>
              <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">
                Ask our team about current program fees, EMI options, and upcoming batches, or see how a class works in a free demo.
              </p>
            </div>
            <CounsellorActions />
          </div>
        </div>
      </section>
  )
}
