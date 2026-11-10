"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ButtonLink } from "@/components/button-link"
import { CourseMark } from "@/components/course-marks"
import { courseCatalog, courseTones } from "@/components/course-catalog"
import type { Course } from "@/components/course-catalog"
import { demoHref } from "@/components/site-nav"

/**
 * Single-open course accordion with animated switching.
 *
 * How the motion works (plain language first, technical term after):
 * - All five courses stay mounted and the open one stretches wide
 *   while the others squeeze into rails (flex-grow / flex-basis
 *   transition on desktop, grid-rows 0fr→1fr on mobile).
 *   Panel height grows/collapses through the same grid-rows trick, so
 *   the page below never jumps when courses have different heights.
 * - The outgoing panel dissolves quickly (opacity fade, ~140ms)
 *   while the incoming panel's content rises in piece by piece
 *   (staggered keyframe entrance, re-triggered by React `key`).
 * - The list drifts in once when first scrolled into view
 *   (one-shot IntersectionObserver adding `.is-entered`).
 * - Everything travel-related lives behind
 *   `prefers-reduced-motion: no-preference` in globals.css, and the
 *   click handler skips the dissolve phase entirely when reduced
 *   motion is requested. Initial state is visible, so content never
 *   stays hidden if scripts fail.
 */
export function CourseList() {
  const [openCourseId, setOpenCourseId] = useState(courseCatalog[0].id)
  const [leavingId, setLeavingId] = useState<string | null>(null)
  const [entered, setEntered] = useState(true)
  // Width freeze (plain words): while panels stretch/shrink, their text is
  // locked to the settled panel width, so lines never re-wrap mid-flight
  // (re-wrapping is what made the row balloon tall then shorten back).
  // Tech words: measured px width pinned during the flex transition.
  const [frozenWidth, setFrozenWidth] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const leaveTimer = useRef<number | null>(null)
  const freezeTimer = useRef<number | null>(null)

  useEffect(() => {
    setEntered(false)
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setEntered(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
      if (freezeTimer.current !== null) window.clearTimeout(freezeTimer.current)
    },
    [],
  )

  useEffect(() => {
    const clearFreeze = () => setFrozenWidth(null)
    window.addEventListener("resize", clearFreeze)
    return () => window.removeEventListener("resize", clearFreeze)
  }, [])

  function selectCourse(id: string) {
    if (id === openCourseId) return
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
    if (freezeTimer.current !== null) window.clearTimeout(freezeTimer.current)
    const previous = openCourseId
    setOpenCourseId(id)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const desktop = window.matchMedia("(min-width: 1100px)").matches
    if (reduce || !desktop) {
      setLeavingId(null)
      setFrozenWidth(null)
      return
    }
    // Same row, so the incoming panel settles at exactly the width the
    // outgoing panel has now. Freeze both at that width for the switch.
    const openArticle = rootRef.current?.querySelector(".course-item.is-open .course-panel article")
    setFrozenWidth(openArticle ? openArticle.getBoundingClientRect().width : null)
    freezeTimer.current = window.setTimeout(() => setFrozenWidth(null), FREEZE_MS)
    setLeavingId(previous)
    leaveTimer.current = window.setTimeout(() => setLeavingId(null), LEAVE_MS)
  }

  return (
    <div
      ref={rootRef}
      className={`course-accordion${entered ? " is-entered" : ""} flex flex-col gap-2 min-[1100px]:flex-row min-[1100px]:items-stretch min-[1100px]:gap-1.5`}
    >
      {courseCatalog.map((course, index) => (
        <CourseItem
          key={course.id}
          course={course}
          index={index}
          open={course.id === openCourseId}
          leaving={course.id === leavingId}
          frozenWidth={frozenWidth}
          onSelect={() => selectCourse(course.id)}
        />
      ))}
    </div>
  )
}

const LEAVE_MS = 500
const FREEZE_MS = 650

function CourseItem({ course, index, open, leaving, frozenWidth, onSelect }: CourseItemProps) {
  const tone = courseTones[course.tone]
  const programLink = course.href.startsWith("http")
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {}
  // Height smoothing: a freshly opened panel mounts collapsed (0fr) and
  // grows to its natural height on the next frames, so the row below
  // never jumps. Skipped on first mount (initial open course) and for
  // reduced motion.
  const [expanding, setExpanding] = useState(false)
  const firstMount = useRef(true)
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false
      return
    }
    if (!open) {
      setExpanding(false)
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setExpanding(true)
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setExpanding(false)),
    )
    return () => cancelAnimationFrame(raf)
  }, [open, course.id])

  return (
    <div
      style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
      className={`course-item course-reveal relative w-full min-w-0 overflow-hidden rounded-eduvert-16 min-[1100px]:min-h-[408px] min-[1100px]:w-auto ${open ? "is-open border " + tone.open : `border border-eduvert-border-subtle ${tone.rail}`}`}
    >
      <DesktopRail course={course} visible={!open} onSelect={onSelect} />
      {(open || leaving) && (
        <div
          className={`course-panel relative hidden min-[1100px]:block${leaving && !open ? " is-leaving pointer-events-none" : ""}${expanding && open ? " is-expanding" : ""}`}
        >
          <div className="course-panel-inner">
            <ExpandedPanel course={course} toneClass={tone.open} programLink={programLink} enterKey={open ? `open-${course.id}` : "leaving"} frozenWidth={frozenWidth} />
          </div>
        </div>
      )}
      <MobileCard course={course} open={open} onSelect={onSelect} programLink={programLink} />
    </div>
  )
}

function DesktopRail({ course, visible, onSelect }: DesktopRailProps) {
  return (
    <button
      type="button"
      aria-expanded={!visible}
      aria-controls={`course-${course.id}`}
      onClick={onSelect}
      tabIndex={visible ? 0 : -1}
      inert={!visible}
      className={`course-rail absolute inset-0 hidden w-full cursor-pointer flex-col items-center gap-[19px] overflow-hidden px-[5px] pt-[22px] pb-[18px] font-eduvert min-[1100px]:flex ${visible ? "" : "is-hidden"}`}
    >
      <span className="text-[12px] leading-4 font-eduvert-700 tracking-[0.09em] text-eduvert-text-secondary">{course.number}</span>
      <span className="text-center text-[15px] leading-[19px] font-eduvert-700 text-eduvert-text-primary">
        {course.shortName.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </span>
      <CourseMark name={course.mark} className="course-rail-mark pointer-events-none absolute top-[161px] -left-[49px] h-[176px] w-[191px] opacity-[0.19]" />
      <span className="absolute bottom-[18px] left-[17px] h-px w-[53px] bg-eduvert-border-subtle" aria-hidden="true" />
      <span className="sr-only">Expand {course.title.join(" ")}</span>
    </button>
  )
}

function ExpandedPanel({ course, toneClass, programLink, enterKey, frozenWidth }: ExpandedPanelProps) {
  return (
    <article
      id={`course-${course.id}`}
      style={frozenWidth ? { width: `${frozenWidth}px` } : undefined}
      className={`relative flex w-full min-w-0 flex-col justify-between gap-[18px] overflow-hidden p-[19px] px-8 py-[25px] ${toneClass}`}
    >
      <CourseMark
        name={course.mark}
        className="pointer-events-none absolute top-[31px] right-[7px] h-[353px] w-[384px] opacity-[0.13]"
      />
      <div key={enterKey} className="course-stagger relative z-10 flex flex-col gap-[11px]">
        <p className="ce-1 hidden text-[12px] leading-4 font-eduvert-700 tracking-[0.09em] text-eduvert-action-primary min-[1100px]:block">
          {course.eyebrow}
        </p>
        <h3 className="ce-2 text-[40px] leading-[44px] font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary">
          {course.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p className="ce-3 text-[15px] leading-[23px] text-eduvert-text-secondary">{course.summary}</p>
        {course.description ? (
          <p className="ce-3 max-w-[640px] text-[14px] leading-[21px] text-eduvert-text-secondary">{course.description}</p>
        ) : null}
        <div className={`ce-4 hidden w-full max-w-[760px] items-start gap-5 border-t pt-[13px] min-[1100px]:flex ${courseTones[course.tone].rule}`}>
          <div className="flex w-[244px] shrink-0 flex-col gap-[3px]">
            <PriceBlock course={course} />
          </div>
          <span className={`w-px self-stretch ${courseTones[course.tone].fill}`} aria-hidden="true" />
          <FeatureList course={course} className="gap-0.5" itemClassName="gap-2" />
        </div>
      </div>
      <div className="ce-4 relative z-10 flex gap-3">
        <ButtonLink href={course.href} size="course" className="course-cta min-[1100px]:w-[151px]" {...programLink}>
          View Program
        </ButtonLink>
        <ButtonLink href={demoHref} variant="secondary" size="course" className="course-cta min-[1100px]:w-[161px]">
          Book Free Demo
        </ButtonLink>
      </div>
    </article>
  )
}

function MobileCard({ course, open, onSelect, programLink }: MobileCardProps) {
  const tone = courseTones[course.tone]

  return (
    <div className={`min-[1100px]:hidden ${tone.rail} border-t border-eduvert-border-subtle first:border-t-0 min-[1100px]:border-t-0`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`course-${course.id}-mobile`}
        onClick={onSelect}
        className="relative flex min-h-[82px] w-full cursor-pointer items-center gap-2.5 overflow-hidden px-[13px] py-[11px] text-left font-eduvert"
      >
        <CourseMark name={course.mark} className="pointer-events-none absolute top-[-5px] right-[29px] h-[96px] w-[104px] opacity-[0.13]" />
        <span className="relative w-[22px] shrink-0 text-[12px] leading-4 font-eduvert-700 text-eduvert-text-secondary">{course.number}</span>
        <span className="relative flex min-w-0 flex-1 flex-col gap-px">
          <span className="text-[15px] leading-[18px] font-eduvert-700 text-eduvert-text-primary">
            {course.mobileName.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          <span className="text-[12px] leading-[18px] font-eduvert-400 text-eduvert-text-secondary">{course.duration}</span>
        </span>
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-eduvert-border-subtle bg-eduvert-surface-white text-eduvert-text-primary">
          <CourseGlyph kind={open ? "minus" : "plus"} spin={open} />
        </span>
      </button>
      <div id={`course-${course.id}-mobile`} className={`course-detail ${open ? "is-open" : ""}`}>
        <div className="course-detail-inner">
          <div key={open ? `m-${course.id}` : "m-closed"} className="course-stagger flex flex-col gap-3 px-[13px] pb-[15px]">
            <div className="ce-1 flex flex-col gap-3 border-t border-eduvert-border-subtle pt-3">
              <PriceBlock course={course} />
              <FeatureList course={course} className="gap-[3px]" itemClassName="gap-[7px]" />
            </div>
            <p className="ce-2 text-[14px] leading-[21px] text-eduvert-text-secondary">{course.summary}</p>
            <div className="ce-3 flex gap-2">
              <ButtonLink href={course.href} size="course" className="course-cta" {...programLink}>
                View Program
              </ButtonLink>
              <ButtonLink href={demoHref} variant="secondary" size="course" className="course-cta">
                Book Free Demo
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceBlock({ course }: CourseProps) {
  const isEnquiry = !course.priceNote

  return (
    <>
      <p className="flex flex-wrap items-baseline gap-1.5 min-[1100px]:gap-2">
        <span
          className={`font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary ${isEnquiry ? "text-[22px] leading-7 min-[1100px]:text-[28px] min-[1100px]:leading-9" : "text-[27px] leading-8 min-[1100px]:text-[35px] min-[1100px]:leading-10"}`}
        >
          {course.price}
        </span>
        {course.priceNote ? <span className="text-[13px] leading-5 text-eduvert-text-secondary">{course.priceNote}</span> : null}
      </p>
      {course.priceCaption ? (
        <p className="text-[13px] leading-5 text-eduvert-text-secondary min-[1100px]:text-[14px] min-[1100px]:leading-[21px]">
          {course.priceCaption}
        </p>
      ) : null}
    </>
  )
}

function FeatureList({ course, className, itemClassName }: FeatureListProps) {
  return (
    <ul className={`flex flex-col ${className}`}>
      {course.highlights.map((highlight) => (
        <li key={highlight.label} className={`flex items-center text-[14px] leading-5 font-eduvert-500 text-eduvert-text-primary ${itemClassName}`}>
          <span className="size-1 shrink-0 rounded-full bg-eduvert-action-primary" aria-hidden="true" />
          {highlight.mobileLabel ? (
            <>
              <span className="min-[1100px]:hidden">{highlight.mobileLabel}</span>
              <span className="hidden min-[1100px]:inline">{highlight.label}</span>
            </>
          ) : (
            highlight.label
          )}
        </li>
      ))}
    </ul>
  )
}

function CourseGlyph({ kind, spin = false }: CourseGlyphProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={`course-glyph ${spin ? "is-spun" : ""}`}>
      {kind === "plus" ? (
        <path d="M3 7h8m-4-4v8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      ) : (
        <path d="M3 7h8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      )}
    </svg>
  )
}

interface CourseProps {
  course: Course
}

interface CourseItemProps {
  course: Course
  index: number
  open: boolean
  leaving: boolean
  frozenWidth: number | null
  onSelect: () => void
}

interface DesktopRailProps {
  course: Course
  visible: boolean
  onSelect: () => void
}

interface ExpandedPanelProps {
  course: Course
  toneClass: string
  programLink: { target?: "_blank"; rel?: string }
  enterKey: string
  frozenWidth: number | null
}

interface MobileCardProps {
  course: Course
  open: boolean
  onSelect: () => void
  programLink: { target?: "_blank"; rel?: string }
}

interface FeatureListProps {
  course: Course
  className: string
  itemClassName: string
}

interface CourseGlyphProps {
  kind: "plus" | "minus"
  spin?: boolean
}
