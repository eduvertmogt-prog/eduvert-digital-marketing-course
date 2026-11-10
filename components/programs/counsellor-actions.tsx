import { counsellorActions } from "@/components/programs/program-content"

export function CounsellorActions({
  stacked = false,
  primaryLabel = counsellorActions.demoLabel,
  secondaryLabel = counsellorActions.talkLabel,
}: CounsellorActionsProps) {
  return (
    <div className={`flex w-full gap-2.5 ${stacked ? "flex-col" : "flex-col min-[1100px]:w-auto min-[1100px]:flex-row"}`}>
      <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:min-w-[170px]">
        {primaryLabel}
      </a>
      <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-action-primary hover:bg-eduvert-surface-white min-[1100px]:min-w-[194px]">
        {secondaryLabel}
      </a>
    </div>
  )
}

interface CounsellorActionsProps {
  stacked?: boolean
  primaryLabel?: string
  secondaryLabel?: string
}
