import { comparedPrograms } from "@/components/programs/program-content"
import type { ComparedProgram } from "@/components/programs/program-content"

export function ProgramComparison() {
  return (
    <section aria-labelledby="compare-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-12 min-[1100px]:gap-[26px] min-[1100px]:px-10 min-[1440px]:px-[120px] min-[1100px]:py-[72px]">
        <div className="flex flex-col gap-2">
          <h2 id="compare-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Compare Your Options
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Choose by what you want to learn and the skill you want to build.
          </p>
        </div>
        <div className="hidden overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white min-[1100px]:block">
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.55fr)_minmax(0,0.9fr)_minmax(0,0.5fr)] bg-eduvert-tint-blue px-6 py-[18px] eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">
            <span>PROGRAM</span>
            <span>BEST SUITED FOR</span>
            <span>CORE SKILL</span>
            <span>DURATION</span>
            <span>FEE</span>
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
    <div className={`grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.55fr)_minmax(0,0.9fr)_minmax(0,0.5fr)] items-center border-t border-eduvert-border-subtle px-6 py-[15px] eduvert-body ${program.emphasis ? "bg-eduvert-tint-soft-blue" : ""}`}>
      <p className="pr-4 font-eduvert-600 text-eduvert-text-primary">{program.name}</p>
      <p className="pr-4 text-eduvert-text-secondary">{program.suitedFor}</p>
      <p className="pr-4 text-eduvert-text-secondary">{program.skill}</p>
      <p className="pr-4 text-eduvert-text-secondary">{program.duration}</p>
      <div className="pr-4">
        <p className="font-eduvert-700 text-eduvert-text-primary">{program.feeTotal}</p>
        <p className="eduvert-support text-eduvert-text-secondary">{program.fee}</p>
      </div>
      <DetailsLink program={program} />
    </div>
  )
}

function ComparisonCard({ program }: { program: ComparedProgram }) {
  return (
    <article className={`flex flex-col gap-3 border-t border-eduvert-border-subtle px-4 pt-[19px] pb-3 first:border-t-0 ${program.emphasis ? "bg-eduvert-tint-soft-blue" : ""}`}>
      <h3 className="eduvert-h4 text-eduvert-text-primary">{program.name}</h3>
      <p className="eduvert-body text-eduvert-text-secondary">{program.suitedFor}</p>
      <p className="eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">CORE SKILL</p>
      <p className="eduvert-body text-eduvert-text-primary">{program.skill}</p>
      <p className="eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">DURATION</p>
      <p className="eduvert-body text-eduvert-text-primary">{program.duration}</p>
      <p className="eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-text-secondary">FEE</p>
      <p className="eduvert-h4 text-eduvert-text-primary">{program.feeTotal}</p>
      <p className="eduvert-support text-eduvert-text-secondary">{program.fee}</p>
      <DetailsLink program={program} />
    </article>
  )
}

function DetailsLink({ program }: { program: ComparedProgram }) {
  return (
    <a href={program.href} target={program.external ? "_blank" : undefined} rel={program.external ? "noopener noreferrer" : undefined} className="eduvert-button text-eduvert-link">
      View details →
    </a>
  )
}
