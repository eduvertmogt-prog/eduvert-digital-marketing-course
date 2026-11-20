import { FeeFigure } from "@/components/fee-figure"
import { programFees } from "@/components/program-fees"
import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { careerSteps } from "@/components/programs/program-content"
import { placementsHref } from "@/components/site-nav"

const careerPaths = [
  {
    role: "SEO Executive",
    portfolio: "Show how you audited a website, researched keywords, and recommended changes to help customers find it in search.",
  },
  {
    role: "Paid Media Associate",
    portfolio: "Walk through a Google Ads campaign you planned, how you tracked conversions, and what the results told you to change.",
  },
  {
    role: "Social Media Executive",
    portfolio: "Share a content calendar tailored to each platform and explain how you’d use engagement data to improve the next campaign.",
  },
]

export function ProgramCareer() {
  return (
    <section id="career" aria-labelledby="program-career-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-10 min-[1100px]:gap-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="grid max-w-[640px] gap-3">
          <h2 id="program-career-heading" className="eduvert-h2 text-eduvert-text-primary">Digital marketing career paths</h2>
          <p className="eduvert-body-large text-eduvert-text-secondary">
            See how the work you do in the program can help you build a portfolio for entry-level roles.
          </p>
        </div>
        <ul className="grid gap-6 min-[850px]:grid-cols-3 min-[1100px]:gap-8">
          {careerPaths.map(({ role, portfolio }) => (
            <li key={role} className="grid content-start gap-2">
              <h3 className="eduvert-h4 text-eduvert-text-primary">{role}</h3>
              <p className="eduvert-body text-eduvert-text-secondary">{portfolio}</p>
            </li>
          ))}
        </ul>
        <div className="grid gap-5 rounded-eduvert-16 bg-eduvert-tint-soft-blue p-5 sm:p-7">
          <h3 className="eduvert-h3 text-eduvert-text-primary">How EduVert supports you</h3>
          <ul className="grid gap-5 min-[850px]:grid-cols-3 min-[1100px]:gap-8">
            {careerSteps.map((step) => (
              <li key={step.title} className="grid content-start gap-2">
                <h4 className="eduvert-h4 text-eduvert-text-primary">{step.title}</h4>
                <p className="eduvert-body text-eduvert-text-secondary">{step.detail}</p>
              </li>
            ))}
          </ul>
          <div className="grid gap-2">
            <p className="eduvert-support text-eduvert-text-secondary">EduVert provides placement assistance. Employment is not guaranteed.</p>
            <a href={placementsHref} className="inline-flex min-h-11 w-fit items-center eduvert-button text-eduvert-link underline underline-offset-4">See how placement support works</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EnrolmentBand() {
  return (
      <section id="flagship-final-booking" aria-labelledby="enrolment-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto w-full max-w-[1440px] px-6 pt-5 pb-11 min-[1100px]:px-10 min-[1100px]:pt-8 min-[1100px]:pb-[60px] min-[1440px]:px-[120px]">
          <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-10 min-[1100px]:px-12 min-[1100px]:py-11">
            <div className="flex max-w-[620px] flex-col gap-3">
              <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">FEES & ENROLMENT</p>
              <FeeFigure fee={programFees.flagship} prominent headingId="enrolment-heading" />
              <p className="eduvert-body text-eduvert-text-secondary">
                Request admission to the next batch and our team will contact you about availability and enrolment.
              </p>
            </div>
            <CounsellorActions primaryLabel="Reserve My Seat" intent="admission_request" courseSlug="digital-marketing" courseLabel="Professional Digital Marketing Program with AI" />
          </div>
        </div>
      </section>
  )
}
