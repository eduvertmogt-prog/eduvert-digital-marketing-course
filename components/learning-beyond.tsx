export function LearningBeyond() {
  return (
    <section id="learning-beyond" aria-labelledby="learning-beyond-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-16 min-[1100px]:gap-[34px] min-[1100px]:px-10 min-[1100px]:py-[88px] min-[1440px]:px-[120px]">
        <div className="flex max-w-[690px] flex-col gap-2.5 min-[1100px]:gap-3">
          <h2 id="learning-beyond-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Learning That Goes Beyond Theory
          </h2>
          <p className="text-eduvert-body leading-[27px] text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
            Classroom and live online sessions, hands-on exercises, and guided projects help you put what you learn into practice.
          </p>
        </div>
        <figure className="relative h-[328px] overflow-hidden rounded-eduvert-16 bg-eduvert-canvas-warm min-[1100px]:h-[496px] min-[1100px]:rounded-[20px]">
          <img
            src="/images/learning-beyond-mobile.png"
            alt="A student working on a laptop, with marketing and analytics panels connected above the screen"
            width={1226}
            height={1283}
            className="absolute inset-0 h-full w-full object-cover object-[center_65%] min-[1100px]:hidden"
          />
          <img
            src="/images/learning-beyond-desktop.png"
            alt="A student working on a laptop, with marketing and analytics panels connected above the screen"
            width={1951}
            height={806}
            className="absolute inset-0 hidden h-full w-full object-cover object-center min-[1100px]:block"
          />
        </figure>
        <ol className="min-[1100px]:grid min-[1100px]:grid-cols-3 min-[1100px]:gap-6 min-[1440px]:grid-cols-[379px_378px_379px] min-[1440px]:gap-8">
          {learningSteps.map((step) => (
            <li key={step.index} className="flex flex-col gap-2 border-t border-eduvert-border-subtle py-[19px] last:pb-0 min-[1100px]:gap-2.5 min-[1100px]:pt-6 min-[1100px]:pb-0">
              <div className="flex items-center gap-[11px]">
                <span className="text-[12px] leading-[17px] text-eduvert-text-secondary">{step.index}</span>
                <h3 className="text-eduvert-h3-mobile leading-[30px] font-eduvert-400 tracking-[-0.015em] text-eduvert-text-primary min-[1100px]:text-eduvert-h3 min-[1100px]:leading-[34px]">
                  {step.title}
                </h3>
              </div>
              <p className="text-eduvert-body leading-[27px] text-eduvert-text-secondary min-[1100px]:max-w-[352px]">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const learningSteps: LearningStep[] = [
  {
    index: "01 /",
    title: "Learn",
    body: "Attend classroom or live online sessions with guidance from trainers.",
  },
  {
    index: "02 /",
    title: "Practice",
    body: "Work through hands-on assignments using the tools covered in your course.",
  },
  {
    index: "03 /",
    title: "Apply",
    body: "Bring your learning together through course-relevant projects and assessments.",
  },
]

interface LearningStep {
  index: string
  title: string
  body: string
}
