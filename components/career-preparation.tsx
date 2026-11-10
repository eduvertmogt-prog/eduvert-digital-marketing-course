import { placementsHref } from "@/components/site-nav"

export function CareerPreparation() {
  return (
    <section id="placements" aria-labelledby="placements-heading" className="flex justify-center border-t border-eduvert-border-subtle bg-eduvert-canvas-warm px-6 py-16 min-[1100px]:px-10 min-[1100px]:py-24 min-[1440px]:px-[60px]">
      <div className="flex w-full max-w-[342px] flex-col gap-8 min-[1100px]:max-w-[1200px] min-[1100px]:gap-11">
        <div className="flex flex-col gap-[38px] min-[1100px]:gap-[60px]">
          <div className="flex flex-col gap-3 min-[1100px]:w-[740px] min-[1100px]:gap-3.5">
            <h2 id="placements-heading" className="max-w-[275px] text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:max-w-none min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Career Preparation at EduVert
            </h2>
            <p className="text-eduvert-body leading-[26px] text-[#5b6070] min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
              In the Professional Digital Marketing Program, practical projects are complemented by resume support, mock interview sessions, and job referral assistance.
            </p>
          </div>
          <ol className="relative flex flex-col gap-8 min-[1100px]:flex-row">
            <span className="absolute top-[11px] left-[5px] h-[423px] w-px bg-eduvert-border-subtle min-[1100px]:top-[5px] min-[1100px]:left-[6px] min-[1100px]:h-px min-[1100px]:w-[calc(100%-6px)]" aria-hidden="true" />
            {careerSteps.map((step) => (
              <li key={step.index} className="relative flex min-w-0 flex-col gap-[5px] pl-[30px] min-[1100px]:flex-1 min-[1100px]:pt-[29px] min-[1100px]:pl-0 min-[1440px]:w-[276px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
                <span className={`absolute top-[5px] left-0 size-3 rounded-full min-[1100px]:top-0 ${step.dot}`} aria-hidden="true" />
                <span className="text-eduvert-support leading-[21px] font-eduvert-600 tracking-[0.055em] text-[#5b6070]">{step.index}</span>
                <h3 className="text-eduvert-h4-mobile leading-[26px] font-eduvert-600 tracking-[-0.013em] text-eduvert-text-primary min-[1100px]:text-[21px] min-[1100px]:leading-[27px]">
                  {step.title}
                </h3>
                <p className={`text-eduvert-body leading-[26px] text-[#5b6070] min-[1100px]:leading-[27px] ${step.detailWidth}`}>{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col min-[1100px]:pt-1.5">
          <a href={careerHref} className="inline-flex h-11 w-fit items-center gap-2.5 text-eduvert-button leading-[21px] font-eduvert-700 text-eduvert-action-primary">
            Explore Career Support
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
              <path d="M3.5 9h10.3M9.5 4.7 14 9l-4.5 4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="max-w-[239px] text-eduvert-support leading-[21px] text-[#5b6070] min-[1100px]:max-w-[550px]">
            Placement assistance does not guarantee employment.
          </p>
        </div>
      </div>
    </section>
  )
}

const careerHref = placementsHref

const careerSteps: CareerStep[] = [
  {
    index: "01",
    title: "Project Experience",
    detail: "Apply what you learn through live projects and capstone work.",
    detailWidth: "min-[1100px]:max-w-[250px]",
    dot: "bg-eduvert-brand-blue",
  },
  {
    index: "02",
    title: "Resume Support",
    detail: "Get guidance on preparing your resume for digital marketing opportunities.",
    detailWidth: "min-[1100px]:max-w-[221px]",
    dot: "bg-eduvert-brand-magenta",
  },
  {
    index: "03",
    title: "Mock Interviews",
    detail: "Practice for interviews with dedicated mock interview sessions.",
    detailWidth: "min-[1100px]:max-w-[276px]",
    dot: "bg-eduvert-brand-yellow",
  },
  {
    index: "04",
    title: "Job Referral Assistance",
    detail: "Access placement assistance that includes job referrals.",
    detailWidth: "min-[1100px]:max-w-[247px]",
    dot: "bg-eduvert-brand-blue",
  },
]

interface CareerStep {
  index: string
  title: string
  detail: string
  detailWidth: string
  dot: string
}
