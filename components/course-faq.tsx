"use client"

import { useState } from "react"
import { programFeeSummary } from "@/components/program-fees"
import { demoHref } from "@/components/site-nav"

export function CourseFaq() {
  const [openId, setOpenId] = useState(courseQuestions[0].id)

  return (
    <section id="faq" aria-labelledby="faq-heading" className="flex justify-center bg-eduvert-canvas-warm px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[60px]">
      <div className="flex w-full max-w-[342px] flex-col items-start gap-[30px] min-[1100px]:max-w-[1200px] min-[1100px]:flex-row min-[1100px]:gap-10 min-[1440px]:gap-20">
        <div className="flex flex-col gap-2.5 min-[1100px]:w-[34%] min-[1100px]:shrink-0 min-[1100px]:gap-3.5 min-[1440px]:w-[408px]">
          <h2 id="faq-heading" className="max-w-[320px] eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:max-w-[374px]">
            Frequently Asked Questions
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary min-[1100px]:max-w-[330px] min-[1100px]:eduvert-body-large">
            A few things you may want to know before choosing a course.
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-[15px] min-[1100px]:flex-1 min-[1100px]:gap-4 min-[1440px]:w-[712px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
          <div className="border-t border-eduvert-border-subtle">
            {courseQuestions.map((question) => {
              const isOpen = question.id === openId
              return (
                <div key={question.id} className="border-b border-eduvert-border-subtle">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${question.id}`}
                    onClick={() => setOpenId(question.id)}
                    className="flex w-full items-center gap-3.5 py-[15px] text-left min-[1100px]:gap-5 min-[1100px]:py-[19px]"
                  >
                    <span className={`min-w-0 flex-1 eduvert-body-large font-eduvert-600 ${isOpen ? "text-eduvert-action-primary" : "text-eduvert-text-primary"}`}>
                      {question.question}
                    </span>
                    <span className={isOpen ? "text-eduvert-action-primary" : "text-eduvert-text-secondary"}>
                      <FaqIcon isOpen={isOpen} />
                    </span>
                  </button>
                  {isOpen ? (
                    <div id={`faq-${question.id}`} className="max-w-[334px] pb-5 min-[1100px]:max-w-[620px] min-[1100px]:pb-6">
                      <p className="eduvert-body text-eduvert-text-secondary">{question.answer}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <a href={demoHref} data-demo-intent="counsellor_callback" className="inline-flex h-11 w-fit items-center eduvert-button text-eduvert-link underline decoration-1">
            Talk to Our Counsellor
          </a>
        </div>
      </div>
    </section>
  )
}

function FaqIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <path d={isOpen ? "M4.5 10h11" : "M4.5 10h11M10 4.5v11"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const courseQuestions: CourseQuestion[] = [
  {
    id: "courses",
    question: "Which courses does EduVert offer?",
    answer:
      "EduVert offers a four-month Professional Digital Marketing Program, focused certifications in SEO, SEM, and Social Media Marketing, and a Data Analytics with Python & Excel course. Explore the course details to choose the right starting point.",
  },
  {
    id: "format",
    question: "Can I learn in the classroom or live online?",
    answer: "Yes. You can attend classroom sessions in Seawoods, Navi Mumbai, or join live online sessions.",
  },
  {
    id: "duration",
    question: "How long are the courses?",
    answer:
      "The Professional Digital Marketing Program runs for 4 months and includes 120+ hours. The SEO, SEM, and Social Media Marketing courses are scheduled for 4–5 weeks, and Data Analytics with Python & Excel is 30 hours.",
  },
  {
    id: "fees",
    question: "What are the fees, and is EMI available?",
    answer:
      programFeeSummary,
  },
  {
    id: "practical",
    question: "Is the training practical?",
    answer: "Yes. Training includes hands-on assignments, live projects, and practical campaign work.",
  },
  {
    id: "placement",
    question: "Does EduVert provide placement assistance?",
    answer:
      "EduVert provides placement assistance, including resume support, mock interview sessions, and job referrals. Placement assistance does not guarantee employment.",
  },
]

interface CourseQuestion {
  id: string
  question: string
  answer: string
}
