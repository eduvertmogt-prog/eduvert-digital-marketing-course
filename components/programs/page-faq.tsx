"use client"

import { Fragment, useState } from "react"
import type { FaqItem } from "@/components/programs/program-content"

export function PageFaq({ id, headingId, eyebrow, title, intro, questions, groupHeadings, canvas }: PageFaqProps) {
  const [openId, setOpenId] = useState(questions[0].id)

  return (
    <section id={id} aria-labelledby={headingId} className={canvas ? "bg-eduvert-canvas-warm" : "bg-eduvert-surface-white"}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 py-10 min-[1100px]:flex-row min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:gap-[90px] min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-2 min-[1100px]:w-[300px] min-[1100px]:shrink-0 min-[1100px]:gap-3.5 min-[1440px]:w-[360px]">
          {eyebrow ? <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{eyebrow}</p> : null}
          <h2 id={headingId} className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            {title}
          </h2>
          {intro ? <p className="eduvert-body text-eduvert-text-secondary">{intro}</p> : null}
        </div>
        <div className="min-w-0 min-[1100px]:flex-1">
          <div className="border-t border-eduvert-border-subtle">
            {questions.map((question) => {
              const isOpen = question.id === openId
              return (
                <Fragment key={question.id}>
                  {groupHeadings?.[question.id] ? (
                    <h3 className="border-b border-eduvert-border-subtle bg-eduvert-tint-soft-blue px-3 py-2 eduvert-support font-eduvert-700 text-eduvert-text-primary">
                      {groupHeadings[question.id]}
                    </h3>
                  ) : null}
                  <div className="border-b border-eduvert-border-subtle">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-${question.id}`}
                      onClick={() => setOpenId(question.id)}
                      className="flex w-full items-center gap-3 py-[18px] text-left"
                    >
                      <span className={`min-w-0 flex-1 eduvert-body font-eduvert-600 ${isOpen ? "text-eduvert-action-primary" : "text-eduvert-text-primary"}`}>
                        {question.question}
                      </span>
                      <FaqIcon isOpen={isOpen} />
                    </button>
                    {isOpen ? (
                      <p id={`${id}-${question.id}`} className="max-w-[680px] pb-[18px] eduvert-body text-eduvert-text-secondary">
                        {question.answer}
                      </p>
                    ) : null}
                  </div>
                </Fragment>
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
  groupHeadings?: Record<string, string>
  canvas?: boolean
}
