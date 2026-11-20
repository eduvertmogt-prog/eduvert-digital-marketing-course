import type { ProgramFee } from "@/components/program-fees"

export function FeeFigure({ fee, prominent = false, headingId, showTotal = true }: FeeFigureProps) {
  const amountClass = prominent ? "eduvert-h2" : "eduvert-h3"

  return (
    <div className="flex w-full max-w-[320px] flex-col gap-1.5">
      {headingId ? (
        <h2 id={headingId} className={`${amountClass} tracking-[-0.025em] text-eduvert-text-primary`}>
          {fee.base}
        </h2>
      ) : (
        <p className={`${amountClass} tracking-[-0.025em] text-eduvert-text-primary`}>{fee.base}</p>
      )}
      <dl className="flex flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="eduvert-support text-eduvert-text-secondary">GST 18%</dt>
          <dd className="eduvert-support font-eduvert-600 text-eduvert-text-primary">{fee.gst}</dd>
        </div>
        {showTotal ? (
          <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-eduvert-border-subtle pt-1">
            <dt className="eduvert-support font-eduvert-600 text-eduvert-text-primary">Total</dt>
            <dd className="eduvert-body font-eduvert-700 text-eduvert-text-primary">{fee.total}</dd>
          </div>
        ) : null}
      </dl>
      {fee.emiLabel ? <p className="eduvert-support font-eduvert-600 text-eduvert-action-primary">{fee.emiLabel}</p> : null}
    </div>
  )
}

interface FeeFigureProps {
  fee: ProgramFee
  prominent?: boolean
  headingId?: string
  showTotal?: boolean
}
