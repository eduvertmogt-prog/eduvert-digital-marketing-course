import { contactHref, coursesHref, dataCourseHref, flagshipProgramHref, semCourseHref, seoCourseHref, smmCourseHref } from "@/components/site-nav"

export function AboutPage() {
  return (
    <>
      <Hero />
      <Practice />
      <Difference />
      <Courses />
      <Audience />
      <TeamCta />
    </>
  )
}

function Hero() {
  return (
    <section aria-labelledby="about-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-6 py-12 min-[1100px]:grid-cols-[minmax(0,1fr)_480px] min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex min-w-0 flex-col gap-5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">ABOUT EDUVERT</p>
          <h1 id="about-heading" className="max-w-[620px] text-eduvert-h1-mobile leading-eduvert-h1-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-[46px] min-[1100px]:leading-[54px] min-[1440px]:text-eduvert-h1 min-[1440px]:leading-[59px]">
            Practical Learning. Real-World Skills.
          </h1>
          <p className="max-w-[520px] text-eduvert-body-large-mobile leading-[27px] text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
            EduVert is a digital marketing training institute in Navi Mumbai. Our courses combine hands-on assignments with industry-relevant digital marketing and data analytics skills.
          </p>
          <a href={coursesHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Explore Our Courses
          </a>
        </div>
        <figure className="relative overflow-hidden rounded-eduvert-16">
          <img
            src="/images/why-learn-by-doing.jpg"
            alt="Students working together around a laptop"
            width={1536}
            height={1024}
            className="h-[240px] w-full object-cover object-[center_22%] min-[1100px]:h-[320px]"
          />
          <figcaption className="absolute right-3 bottom-3 flex h-[26px] items-center rounded-eduvert-8 bg-eduvert-canvas-warm px-3 text-[12px] leading-[17px] font-eduvert-600 text-eduvert-text-secondary">
            Concept imagery
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Practice() {
  return (
    <section aria-labelledby="practice-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="practice-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
          Learn. Practice. Apply.
        </h2>
        <ol className="grid gap-6 min-[1100px]:grid-cols-3">
          {practiceSteps.map((step) => (
            <li key={step.title} className="flex flex-col gap-3 border-t border-eduvert-border-subtle pt-5">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{step.number}</p>
              <h3 className="text-[20px] leading-7 font-eduvert-700 text-eduvert-text-primary">{step.title}</h3>
              <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Difference() {
  return (
    <section aria-labelledby="difference-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-12 min-[1100px]:grid-cols-[360px_minmax(0,1fr)] min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="difference-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
          What Makes EduVert Different
        </h2>
        <ul className="min-w-0">
          {differences.map((item) => (
            <li key={item.title} className="flex flex-col gap-1 border-t border-eduvert-border-subtle py-5 last:border-b">
              <h3 className="text-eduvert-body leading-6 font-eduvert-700 text-eduvert-text-primary">{item.title}</h3>
              <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Courses() {
  return (
    <section aria-labelledby="about-courses-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-12 min-[1100px]:grid-cols-[360px_minmax(0,1fr)] min-[1100px]:gap-[68px] min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-3.5">
          <h2 id="about-courses-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            Courses & Skills
          </h2>
          <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
            Explore a complete program or focus on a specific skill.
          </p>
        </div>
        <ul className="min-w-0">
          {courseLinks.map((course) => (
            <li key={course.href} className="border-t border-eduvert-border-subtle last:border-b">
              <a href={course.href} className="flex items-center justify-between gap-4 py-5 hover:text-eduvert-action-primary">
                <span>
                  <span className="block text-eduvert-body leading-6 font-eduvert-700 text-eduvert-text-primary">{course.title}</span>
                  <span className="mt-1 block text-eduvert-support leading-[21px] text-eduvert-text-secondary">{course.detail}</span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-[18px] leading-6 text-eduvert-action-primary">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Audience() {
  return (
    <section aria-labelledby="about-audience-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="about-audience-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
          Who We Help
        </h2>
        <ul className="flex flex-col min-[1100px]:flex-row min-[1100px]:flex-wrap min-[1100px]:gap-x-8">
          {audiences.map((person) => (
            <li key={person} className="flex items-center gap-3 border-t border-eduvert-border-subtle py-[17px] text-[20px] leading-7 font-eduvert-600 text-eduvert-text-primary min-[1100px]:border-0 min-[1100px]:py-0">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-eduvert-action-primary" />
              {person}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function TeamCta() {
  return (
    <section aria-labelledby="about-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 min-[1100px]:px-10 min-[1100px]:pb-20 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="about-cta-heading" className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Talk to Our Team
            </h2>
            <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
              Tell us what you want to learn and we’ll help you explore the course options.
            </p>
          </div>
          <a href={contactHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Talk to Our Team
          </a>
        </div>
      </div>
    </section>
  )
}

const practiceSteps = [
  { number: "01", title: "Learn", detail: "Understand the concepts and tools behind the work." },
  { number: "02", title: "Practice", detail: "Work through guided exercises and practical assignments." },
  { number: "03", title: "Apply", detail: "Use what you’ve learned to plan, build, or analyse a project." },
]

const differences = [
  { title: "Hands-on from the start", detail: "Practise with assignments and course-relevant projects." },
  { title: "Guidance while you work", detail: "Discuss your approach and get feedback as you build practical skills." },
  { title: "Classroom and live online", detail: "Ask the team which learning formats are available for your program." },
]

const courseLinks = [
  { title: "Professional Digital Marketing Program", detail: "Campaigns, content, and measurement", href: flagshipProgramHref },
  { title: "Advanced SEO Course", detail: "Search visibility and website optimization", href: seoCourseHref },
  { title: "SEM & Performance Marketing", detail: "Paid search and campaign measurement", href: semCourseHref },
  { title: "Social Media Marketing", detail: "Social strategy, content, and advertising", href: smmCourseHref },
  { title: "Data Analytics with Python & Excel", detail: "Data preparation, analysis, and visualization", href: dataCourseHref },
]

const audiences = ["Students", "Job seekers", "Working professionals", "Business owners", "Learners upgrading their skills"]
