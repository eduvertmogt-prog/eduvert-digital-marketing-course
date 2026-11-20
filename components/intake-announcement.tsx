"use client"

import { useEffect, useState } from "react"
import { fallbackIntake, intakeHasClosed, intakeMessage, type IntakeWording, type PublicIntake } from "@/components/intake-model"

/** The admin intake wins when enabled; otherwise the client's fixed intake shows until it closes. */
function withFallback(intake: PublicIntake | null) {
  if (intake) return intake
  return intakeHasClosed(fallbackIntake.closesOn) ? null : fallbackIntake
}

export function IntakeAnnouncement({ wording = "default" }: { wording?: IntakeWording }) {
  const [intake, setIntake] = useState<PublicIntake | null>(() => withFallback(null))

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/intake", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) return
        const data: { intake: PublicIntake | null } = await response.json()
        if (!controller.signal.aborted) setIntake(withFallback(data.intake))
      })
      .catch(() => { /* Booking remains available when the announcement cannot load. */ })
    return () => controller.abort()
  }, [])

  if (!intake) return null
  return (
    <p className="w-fit rounded-eduvert-8 bg-eduvert-tint-yellow px-3 py-2 eduvert-support font-eduvert-700 text-eduvert-text-primary">
      {intakeMessage(intake, wording)}
    </p>
  )
}
