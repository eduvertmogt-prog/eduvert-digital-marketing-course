import { curriculumModules } from "@/components/programs/program-content"

export function ProgramCurriculum() {
  return (
    <section id="curriculum" aria-labelledby="curriculum-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-[52px] min-[1100px]:flex-row min-[1100px]:gap-10 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:gap-[68px] min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-3.5 min-[1100px]:w-[280px] min-[1100px]:shrink-0 min-[1440px]:w-[360px]">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">CURRICULUM</p>
          <h2 id="curriculum-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            What you’ll learn
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">
            Explore all seven modules, from measuring website activity to completing your capstone.
          </p>
        </div>
        <ol className="min-w-0 min-[1100px]:flex-1">
          {curriculumModules.map((module) => (
            <li key={module.number} className="flex gap-4 border-b border-eduvert-border-subtle py-5 first:border-t">
              <span className="w-6 shrink-0 text-eduvert-support leading-[21px] font-eduvert-700 text-eduvert-action-primary">{module.number}</span>
              <div className="flex flex-col gap-[5px]">
                <h3 className="text-eduvert-body leading-6 font-eduvert-700 text-eduvert-text-primary">{module.name}</h3>
                {module.title ? <p className="text-eduvert-body leading-[25px] font-eduvert-500 text-eduvert-text-primary">{module.title}</p> : null}
                <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">{module.tools}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
