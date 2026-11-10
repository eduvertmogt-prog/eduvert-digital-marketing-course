import { comparedPrograms } from "@/components/programs/program-content"
import type { ComparedProgram } from "@/components/programs/program-content"

export function ProgramComparison() {
  return (
    <section aria-labelledby="compare-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-12 min-[1100px]:gap-[26px] min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[72px]">
        <div className="flex flex-col gap-2">
          <h2 id="compare-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Compare Your Options
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">
            Choose by what you want to learn and the skill you want to build.
          </p>
        </div>
        <div className="hidden overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white min-[1100px]:block">
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.33fr)_minmax(0,1fr)_minmax(0,0.62fr)_minmax(0,0.54fr)] bg-eduvert-tint-blue px-6 py-[18px] text-[12px] leading-[18px] font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">
            <span>PROGRAM</span>
            <span>BEST SUITED FOR</span>
            <span>CORE SKILL</span>
            <span>DURATION</span>
            <span>COURSE DETAILS</span>
          </div>
          {comparedPrograms.map((program) => (
            <ComparisonRow key={program.name} program={program} />
          ))}
        </div>
        <div className="flex flex-col overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white min-[1100px]:hidden">
          {comparedPrograms.map((program) => (
            <ComparisonCard key={program.name} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonRow({ program }: { program: ComparedProgram }) {
  return (
    <div className={`grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.33fr)_minmax(0,1fr)_minmax(0,0.62fr)_minmax(0,0.54fr)] items-center border-t border-eduvert-border-subtle px-6 py-[15px] text-[15px] leading-[22px] ${program.emphasis ? "bg-eduvert-tint-magenta" : ""}`}>
      <p className="pr-4 font-eduvert-600 text-eduvert-text-primary">{program.name}</p>
      <p className="pr-4 text-eduvert-text-secondary">{program.suitedFor}</p>
      <p className="pr-4 text-eduvert-text-secondary">{program.skill}</p>
      <p className="text-eduvert-text-secondary">{program.duration}</p>
      <DetailsLink program={program} />
    </div>
  )
}

function ComparisonCard({ program }: { program: ComparedProgram }) {
  return (
    <article className={`flex flex-col gap-3 border-t border-eduvert-border-subtle px-4 pt-[19px] pb-3 first:border-t-0 ${program.emphasis ? "bg-eduvert-tint-magenta" : ""}`}>
      <h3 className="text-eduvert-body leading-6 font-eduvert-600 text-eduvert-text-primary">{program.name}</h3>
      <p className="text-[15px] leading-[22px] text-eduvert-text-secondary">{program.suitedFor}</p>
      <p className="text-[12px] leading-[17px] font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">CORE SKILL</p>
      <p className="text-[15px] leading-[22px] text-eduvert-text-primary">{program.skill}</p>
      {program.duration ? (
        <>
          <p className="text-[12px] leading-[17px] font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">DURATION</p>
          <p className="text-[15px] leading-[22px] text-eduvert-text-primary">{program.duration}</p>
        </>
      ) : null}
      <DetailsLink program={program} />
    </article>
  )
}

function DetailsLink({ program }: { program: ComparedProgram }) {
  return (
    <a href={program.href} target={program.external ? "_blank" : undefined} rel={program.external ? "noopener noreferrer" : undefined} className="text-[15px] leading-[22px] font-eduvert-600 text-eduvert-link">
      View details →
    </a>
  )
}
