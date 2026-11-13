"use client"

import { useEffect, useState } from "react"
import { ButtonLink } from "@/components/button-link"
import { demoHref } from "@/components/site-nav"

interface CourseDemoLinkProps {
  id?: string
  courseSlug: string
  courseLabel: string
}

interface StickyCourseDemoProps extends Omit<CourseDemoLinkProps, "id"> {
  triggerId: string
  bookingId: string
  total: string
}

export function CourseDemoLink({ id, courseSlug, courseLabel }: CourseDemoLinkProps) {
  return (
    <ButtonLink
      id={id}
      href={demoHref}
      size="course"
      className="w-full px-5 min-[1100px]:w-fit"
      data-demo-course-slug={courseSlug}
      data-demo-course-label={courseLabel}
    >
      Book a Free Demo
    </ButtonLink>
  )
}

export function StickyCourseDemo({ triggerId, bookingId, courseSlug, courseLabel, total }: StickyCourseDemoProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const heroDemo = document.getElementById(triggerId)
    const enrolment = document.getElementById(bookingId)
    if (!heroDemo || !enrolment) return

    function updateVisibility() {
      if (!heroDemo || !enrolment) return
      setVisible(
        heroDemo.getBoundingClientRect().bottom <= 0 &&
          enrolment.getBoundingClientRect().top >= window.innerHeight,
      )
    }

    const observer = new IntersectionObserver(updateVisibility)
    observer.observe(heroDemo)
    observer.observe(enrolment)
    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("resize", updateVisibility)
    updateVisibility()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("resize", updateVisibility)
    }
  }, [triggerId, bookingId])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-eduvert-border-subtle bg-eduvert-surface-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] min-[1100px]:hidden">
      <div className="mx-auto flex max-w-md items-center gap-4">
        <div className="shrink-0">
          <p className="eduvert-body font-eduvert-700 text-eduvert-text-primary">{total}</p>
          <p className="eduvert-support text-eduvert-text-secondary">Incl. GST</p>
        </div>
        <CourseDemoLink courseSlug={courseSlug} courseLabel={courseLabel} />
      </div>
    </div>
  )
}
