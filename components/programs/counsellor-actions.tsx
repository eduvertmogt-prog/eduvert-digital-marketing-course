import type { DemoIntent } from "@/db/demo-enquiries"
import { counsellorActions } from "@/components/programs/program-content"

export function CounsellorActions({
  stacked = false,
  primaryLabel = counsellorActions.demoLabel,
  secondaryLabel = counsellorActions.talkLabel,
  intent = "free_demo",
  courseSlug,
  courseLabel,
}: CounsellorActionsProps) {
  return (
    <div className={`flex w-full gap-2.5 ${stacked ? "flex-col" : "flex-col min-[1100px]:w-auto min-[1100px]:flex-row"}`}>
      <a
        href={counsellorActions.demoHref}
        data-demo-intent={intent}
        data-demo-course-slug={courseSlug}
        data-demo-course-label={courseLabel}
        className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:min-w-[170px]"
      >
        {primaryLabel}
      </a>
      <a
        href={counsellorActions.demoHref}
        data-demo-intent="counsellor_callback"
        data-demo-course-slug={courseSlug}
        data-demo-course-label={courseLabel}
        className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 eduvert-button text-eduvert-text-primary hover:bg-eduvert-tint-soft-blue min-[1100px]:min-w-[194px]"
      >
        {secondaryLabel}
      </a>
    </div>
  )
}

interface CounsellorActionsProps {
  stacked?: boolean
  primaryLabel?: string
  secondaryLabel?: string
  intent?: DemoIntent
  courseSlug?: string
  courseLabel?: string
}
