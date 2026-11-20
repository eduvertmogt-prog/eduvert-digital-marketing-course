interface ComparisonRow {
  question: string
  answer: string
}

export function CourseComparison({ id, rows }: { id: string; rows: ComparisonRow[] }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-y border-eduvert-border-subtle bg-eduvert-tint-soft-blue">
      <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-6 py-10 min-[1100px]:grid-cols-[minmax(0,320px)_minmax(0,1fr)] min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-2">
          <h2 id={`${id}-heading`} className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            What to check before you enrol
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            Ask each provider the same questions when you compare courses. Here’s what EduVert includes.
          </p>
        </div>
        <div className="rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white">
          <div className="hidden gap-6 rounded-t-eduvert-16 bg-eduvert-tint-blue px-6 py-4 eduvert-support font-eduvert-700 text-eduvert-text-primary min-[1100px]:grid min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-hidden="true">
            <span>What to compare</span>
            <span>What EduVert includes</span>
          </div>
          <dl>
            {rows.map(({ question, answer }) => (
              <div key={question} className="grid gap-1 border-t border-eduvert-border-subtle px-4 py-4 first:border-t-0 min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[1100px]:gap-6 min-[1100px]:px-6 min-[1100px]:first:border-t">
                <dt className="eduvert-body font-eduvert-700 text-eduvert-text-primary">{question}</dt>
                <dd className="eduvert-body text-eduvert-text-secondary">{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
