import { CounsellorActions } from "@/components/programs/counsellor-actions"
import { learningFormats } from "@/components/programs/program-content"

export function LearningFormats() {
  return (
    <>
      <section aria-labelledby="learning-formats-heading" className="bg-eduvert-surface-white">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-12 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[72px]">
          <div className="flex flex-col gap-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-10 min-[1440px]:gap-[88px]">
            <div className="flex min-w-0 flex-1 flex-col gap-5 min-[1440px]:max-w-[500px]">
              <div className="flex flex-col gap-2">
                <h2 id="learning-formats-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
                  How You'll Learn
                </h2>
                <p className="eduvert-body text-eduvert-text-secondary">
                  Build skills through hands-on assignments, practical projects, and trainer guidance.
                </p>
              </div>
              {learningFormats.map((format) => (
                <div key={format.eyebrow} className="flex flex-col gap-1">
                  <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{format.eyebrow}</p>
                  <h3 className="eduvert-h4 text-eduvert-text-primary">{format.title}</h3>
                  <p className="eduvert-body text-eduvert-text-secondary">{format.detail}</p>
                </div>
              ))}
            </div>
            <img src="/images/program-workspace.png" alt="Concept imagery" width={1951} height={806} className="h-[220px] w-full rounded-eduvert-16 object-cover min-[1100px]:h-[240px] min-[1100px]:w-[46%] min-[1100px]:max-w-[580px] min-[1100px]:shrink-0" />
          </div>
        </div>
      </section>
      <section aria-labelledby="start-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-9 min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-14">
          <div className="flex flex-col gap-6 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-[35px] min-[1100px]:px-10 min-[1100px]:py-10">
            <div className="flex max-w-[570px] flex-col gap-2.5">
              <h2 id="start-heading" className="eduvert-h3 text-eduvert-text-primary">
                Not Sure Where to Start?
              </h2>
              <p className="eduvert-body text-eduvert-text-secondary">
                Talk to our team about your goals, course content, fees, and available batches.
              </p>
            </div>
            <CounsellorActions />
          </div>
        </div>
      </section>
    </>
  )
}
