"use client"

import { useEffect, useRef, useState } from "react"
import { Reveal } from "@/components/reveal"
import { ShortCard } from "@/components/shorts"
import { shorts } from "@/components/shorts-data"

/**
 * Homepage "Wall of Wins": the graduate collage is the section background.
 * The count-up is motion-gated (final number under reduced motion).
 */
export function WallOfWins() {
  const featured = shorts[1]

  return (
    <section id="wall-of-wins" aria-labelledby="wall-of-wins-heading" className="relative overflow-hidden border-t border-eduvert-border-subtle bg-eduvert-canvas-warm">
      <img
        src="/images/testimonials-wall.jpg"
        alt="Grid of EduVert graduates holding their certificates"
        width={1600}
        height={1066}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="relative mx-auto flex w-full max-w-[980px] flex-col items-center gap-5 px-6 py-10 min-[1100px]:gap-6 min-[1100px]:py-16">
        <div className="flex w-full flex-col gap-5 min-[1100px]:flex-row min-[1100px]:items-stretch min-[1100px]:gap-5">
          <Reveal className="min-w-0 flex-1 rounded-eduvert-16 bg-eduvert-surface-white px-6 py-6 shadow-[0_12px_32px_color-mix(in_srgb,var(--color-eduvert-text-primary)_8%,transparent)] min-[1100px]:px-8 min-[1100px]:py-7">
            <h2 id="wall-of-wins-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
              Wall of Wins
            </h2>
            <p className="mt-3 eduvert-body text-eduvert-text-secondary min-[1100px]:eduvert-body-large">
              Certified learners, wall to wall — every face below finished a program at EduVert.
            </p>
          </Reveal>
          <Reveal delay={100} className="min-[1100px]:h-full min-[1100px]:w-[260px] min-[1100px]:shrink-0">
            <LearnerStat />
          </Reveal>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-eduvert-16 bg-eduvert-surface-white p-5 text-center shadow-[0_12px_32px_color-mix(in_srgb,var(--color-eduvert-text-primary)_8%,transparent)] min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-12 min-[1100px]:p-8 min-[1100px]:text-left">
          <Reveal className="flex shrink-0 justify-center">
            <ShortCard short={featured} />
          </Reveal>
          <Reveal delay={100} className="flex w-full max-w-[560px] flex-col items-center gap-3 min-[1100px]:items-start">
            <p className="eduvert-support font-eduvert-700 tracking-[0.04em] text-eduvert-action-primary">
              EduVert certified learners
            </p>
            <p className="eduvert-h4 text-eduvert-text-primary">
              Watch a success story, then read all nine Google reviews and step inside the classroom.
            </p>
            <a href="/testimonials" className="inline-flex h-11 w-fit items-center gap-2.5 eduvert-button text-eduvert-link">
              See reviews & videos
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
                <path d="M3.5 9h10.3M9.5 4.7 14 9l-4.5 4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function LearnerStat() {
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-eduvert-16 bg-eduvert-tint-soft-blue px-6 py-5">
      <span className="absolute -top-10 -right-8 size-28 rounded-full border border-eduvert-brand-blue-deep opacity-40" aria-hidden="true" />
      <span className="absolute top-10 -right-4 size-16 rounded-full bg-eduvert-brand-yellow opacity-30" aria-hidden="true" />
      <span className="absolute -bottom-8 left-24 size-16 rounded-full bg-eduvert-brand-blue opacity-20" aria-hidden="true" />
      <p className="relative eduvert-h1 tracking-[-0.04em] text-eduvert-action-primary">
        <LearnerCount />
      </p>
      <p className="relative mt-2 max-w-[160px] eduvert-body font-eduvert-600 text-eduvert-text-primary">
        certified learners and counting
      </p>
    </div>
  )
}

const certifiedLearnerCount = 5000
const learnerCountFormat = new Intl.NumberFormat("en-IN")

function LearnerCount() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(certifiedLearnerCount)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return
        done.current = true
        observer.disconnect()
        const start = performance.now()
        const duration = 1200
        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1)
          setCount(Math.round(certifiedLearnerCount * (1 - Math.pow(1 - progress, 3))))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref}>
      {learnerCountFormat.format(count)}
      <span aria-hidden="true">+</span>
    </span>
  )
}
