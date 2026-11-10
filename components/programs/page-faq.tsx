"use client"

import { useState } from "react"
import type { FaqItem } from "@/components/programs/program-content"

export function PageFaq({ id, headingId, eyebrow, title, intro, questions, canvas }: PageFaqProps) {
  const [openId, setOpenId] = useState(questions[0].id)

  return (
    <section id={id} aria-labelledby={headingId} className={canvas ? "bg-eduvert-canvas-warm" : "bg-eduvert-surface-white"}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-12 min-[1100px]:flex-row min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-[72px] min-[1440px]:gap-[90px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-2 min-[1100px]:w-[300px] min-[1100px]:shrink-0 min-[1100px]:gap-3.5 min-[1440px]:w-[360px]">
          {eyebrow ? <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">{eyebrow}</p> : null}
          <h2 id={headingId} className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            {title}
          </h2>
          {intro ? <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:leading-[27px]">{intro}</p> : null}
        </div>
        <div className="min-w-0 min-[1100px]:flex-1">
          <div className="border-t border-eduvert-border-subtle">
            {questions.map((question) => {
              const isOpen = question.id === openId
              return (
                <div key={question.id} className="border-b border-eduvert-border-subtle">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-${question.id}`}
                    onClick={() => setOpenId(question.id)}
                    className="flex w-full items-center gap-3 py-[18px] text-left"
                  >
                    <span className={`min-w-0 flex-1 text-[16px] leading-[25px] font-eduvert-600 ${isOpen ? "text-eduvert-action-primary" : "text-eduvert-text-primary"}`}>
                      {question.question}
                    </span>
                    <FaqIcon isOpen={isOpen} />
                  </button>
                  {isOpen ? (
                    <p id={`${id}-${question.id}`} className="max-w-[680px] pb-[18px] text-eduvert-body leading-[27px] text-eduvert-text-secondary">
                      {question.answer}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className={`shrink-0 ${isOpen ? "text-eduvert-action-primary" : "text-eduvert-text-secondary"}`}>
      <path d={isOpen ? "M4.5 10h11" : "M4.5 10h11M10 4.5v11"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

interface PageFaqProps {
  id: string
  headingId: string
  eyebrow?: string
  title: string
  intro?: string
  questions: FaqItem[]
  canvas?: boolean
}
