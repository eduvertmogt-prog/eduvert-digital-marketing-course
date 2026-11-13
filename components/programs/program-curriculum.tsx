import { curriculumModules } from "@/components/programs/program-content"

export function ProgramCurriculum() {
  return (
    <section id="curriculum" aria-labelledby="curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:gap-10 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:gap-[68px] min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[280px] min-[1100px]:shrink-0 min-[1440px]:w-[360px]">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="curriculum-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            What you’ll learn
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Work through seven modules spanning search, paid media, social, email, analytics, and mobile marketing. Apply them together in your capstone.
          </p>
        </div>
        <ol className="min-w-0 min-[1100px]:flex-1">
          {curriculumModules.map((module) => (
            <li key={module.number} className="border-b border-eduvert-border-subtle first:border-t">
              <details className="group">
                <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-eduvert-8 px-1 py-4 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="w-6 eduvert-support font-eduvert-700 text-eduvert-action-primary">{module.number}</span>
                  <span className="grid gap-1">
                    <span className="eduvert-h4 text-eduvert-text-primary">{module.name}</span>
                    <span className="eduvert-support text-eduvert-text-secondary">{module.outcome}</span>
                  </span>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-eduvert-link group-open:rotate-180">
                    <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="grid gap-2 pr-6 pb-4 pl-10">
                  <p className="eduvert-body text-eduvert-text-secondary">{module.detail}</p>
                  <p className="eduvert-support text-eduvert-text-secondary">
                    <span className="font-eduvert-600 text-eduvert-text-primary">Tools and topics</span> · {module.topics}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
