export function WhyEduvert() {
  return (
    <section id="why-eduvert" aria-labelledby="why-eduvert-heading" className="border-t border-eduvert-border-subtle bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-4 px-6 pt-[34px] pb-[18px] min-[1100px]:gap-6 min-[1100px]:px-10 min-[1100px]:pt-14 min-[1100px]:pb-[55px] min-[1440px]:px-[120px]">
        <div className="flex w-full flex-col gap-2">
          <h2 id="why-eduvert-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Why Choose EduVert?
          </h2>
          <p className="max-w-[294px] eduvert-body text-eduvert-text-secondary min-[1100px]:max-w-[920px] min-[1100px]:eduvert-body-large">
            Practical training, personal guidance, and career support—built into the learning experience.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 min-[1100px]:hidden">
          <LearnByDoing />
          <div className="grid grid-cols-2 gap-3">
            <SmallBatches />
            <Mentors />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CareerAssistance />
            <ClassroomOnline />
          </div>
        </div>
        <div className="hidden w-full gap-4 min-[1100px]:flex">
          <div className="flex w-[23%] min-w-0 shrink-0 flex-col gap-4 min-[1440px]:w-[278px]">
            <SmallBatches />
            <Mentors />
          </div>
          <LearnByDoing />
          <div className="flex w-[23%] min-w-0 shrink-0 flex-col gap-4 min-[1440px]:w-[278px]">
            <CareerAssistance />
            <ClassroomOnline />
          </div>
        </div>
      </div>
    </section>
  )
}

function LearnByDoing() {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-eduvert-16 bg-eduvert-surface-white min-[1100px]:h-[444px] min-[1100px]:min-w-0 min-[1100px]:flex-1 min-[1440px]:w-[612px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
      <div className="relative aspect-[2/1] max-h-[174px] shrink-0 min-[1100px]:aspect-auto min-[1100px]:h-[310px] min-[1100px]:max-h-none">
        <img
          src="/images/seawoods/classroom-home-1440.webp"
          srcSet="/images/seawoods/classroom-home-768.webp 768w, /images/seawoods/classroom-home-1440.webp 1440w"
          sizes="(min-width: 1440px) 612px, (min-width: 1100px) calc(54vw - 75px), calc(100vw - 48px)"
          alt="Rows of desks facing the EduVert display in the Seawoods classroom"
          width={1440}
          height={720}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[60%_36%]"
        />
      </div>
      <div className="relative flex min-h-[96px] shrink-0 flex-col gap-1 overflow-hidden px-3.5 py-3 min-[1100px]:h-[134px] min-[1100px]:gap-1.5 min-[1100px]:px-6 min-[1100px]:py-5">
        <h3 className="eduvert-h3 tracking-[-0.03em] text-eduvert-text-primary">
          Learn by Doing
        </h3>
        <p className="eduvert-support text-eduvert-text-secondary min-[1100px]:max-w-[464px] min-[1100px]:eduvert-body-large">
          Hands-on assignments, live projects, and practical campaign work.
        </p>
        <span className="absolute top-[39px] left-[518px] hidden size-[52px] rounded-full bg-eduvert-brand-blue opacity-[0.23] min-[1100px]:block" aria-hidden="true" />
        <span className="absolute top-[25px] left-[542px] hidden size-[53px] rounded-full bg-eduvert-brand-blue-deep opacity-[0.23] min-[1100px]:block" aria-hidden="true" />
        <span className="absolute top-[42px] left-[562px] hidden size-[43px] rounded-full bg-eduvert-brand-yellow opacity-[0.23] min-[1100px]:block" aria-hidden="true" />
      </div>
    </article>
  )
}

function SmallBatches() {
  return (
    <article className="relative flex min-h-[158px] flex-col gap-px overflow-hidden rounded-eduvert-16 bg-eduvert-tint-soft-blue p-3.5 min-[1100px]:h-[208px] min-[1100px]:w-full min-[1100px]:gap-1 min-[1100px]:p-6">
      <span className="absolute top-[-27px] left-[193px] hidden size-[106px] rounded-full border border-eduvert-brand-blue-deep opacity-[0.48] min-[1100px]:block" aria-hidden="true" />
      <span className="absolute top-[-12px] left-[209px] hidden size-[106px] rounded-full border border-eduvert-brand-blue-deep opacity-[0.48] min-[1100px]:block" aria-hidden="true" />
      <h3 className={cardTitleClass}>Small Batches</h3>
      <p className="eduvert-h2 tracking-[-0.065em] text-eduvert-action-primary">
        5–8
      </p>
      <p className={cardBodyClass}>students per batch, with more room for questions and individual attention.</p>
    </article>
  )
}

function Mentors() {
  return (
    <article className="relative flex min-h-[158px] flex-col overflow-hidden rounded-eduvert-16 bg-eduvert-tint-blue p-3.5 min-[1100px]:h-[220px] min-[1100px]:w-full min-[1100px]:justify-end min-[1100px]:p-6">
      <span className="absolute right-[-3px] bottom-0 size-[46px] rounded-full border border-eduvert-brand-blue opacity-[0.48] min-[1100px]:hidden" aria-hidden="true" />
      <span className="absolute -right-[17px] -bottom-[14px] size-[46px] rounded-full border border-eduvert-brand-blue opacity-[0.48] min-[1100px]:hidden" aria-hidden="true" />
      <span className="absolute top-[26px] left-[27px] hidden size-[58px] rounded-full bg-eduvert-brand-blue opacity-[0.23] min-[1100px]:block" aria-hidden="true" />
      <span className="absolute top-[33px] left-[58px] hidden size-[58px] rounded-full border border-eduvert-brand-blue opacity-[0.48] min-[1100px]:block" aria-hidden="true" />
      <span className="absolute top-4 left-[46px] hidden size-[58px] rounded-full border border-eduvert-brand-blue-deep opacity-[0.48] min-[1100px]:block" aria-hidden="true" />
      <div className="relative flex w-full flex-col gap-1.5 min-[1100px]:gap-2 min-[1440px]:w-[230px]">
        <h3 className={cardTitleClass}>Experienced Mentors</h3>
        <p className={cardBodyClass}>Guidance from professionals working in digital marketing.</p>
      </div>
    </article>
  )
}

function CareerAssistance() {
  return (
    <article className="flex min-h-[168px] flex-col gap-[7px] overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-3.5 min-[1100px]:h-[226px] min-[1100px]:w-full min-[1100px]:gap-[15px] min-[1100px]:p-6">
      <h3 className={cardTitleClass}>Career Assistance</h3>
      <ul>
        {careerPoints.map((point) => (
          <li key={point.index} className="flex items-start gap-[7px] border-t border-eduvert-border-subtle py-1 min-[1100px]:gap-2.5 min-[1100px]:py-2.5">
            <span className="eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-action-primary">
              {point.index}
            </span>
            <span className="eduvert-support font-eduvert-500 text-eduvert-text-secondary min-[1100px]:eduvert-body">
              {point.label}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function ClassroomOnline() {
  return (
    <article className="flex min-h-[168px] flex-col gap-1.5 overflow-hidden rounded-eduvert-16 bg-eduvert-tint-yellow p-3.5 min-[1100px]:h-[202px] min-[1100px]:w-full min-[1100px]:gap-2 min-[1100px]:p-6">
      <div className="hidden h-6 items-center gap-2 min-[1100px]:flex" aria-hidden="true">
        <span className="h-5 w-8 rounded-[4px] border border-eduvert-text-secondary bg-eduvert-surface-white" />
        <span className="h-px w-4 bg-eduvert-text-secondary opacity-[0.48]" />
        <span className="size-3 rounded-full border border-eduvert-text-secondary bg-eduvert-brand-yellow" />
      </div>
      <h3 className={cardTitleClass}>Classroom &amp; Live Online</h3>
      <p className={cardBodyClass}>Learn in Seawoods, Navi Mumbai, or participate in live online sessions.</p>
    </article>
  )
}

const cardTitleClass =
  "eduvert-h4 tracking-[-0.02em] text-eduvert-text-primary"

const cardBodyClass =
  "eduvert-support text-eduvert-text-secondary min-[1100px]:eduvert-body"

const careerPoints: CareerPoint[] = [
  { index: "01", label: "Portfolio support" },
  { index: "02", label: "Interview preparation" },
  { index: "03", label: "Job referrals" },
]

interface CareerPoint {
  index: string
  label: string
}
