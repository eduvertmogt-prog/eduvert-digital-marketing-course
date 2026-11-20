"use client"

import { useEffect, useState } from "react"
import { intakeMessage, type PublicIntake } from "@/components/intake-model"

export function IntakeAnnouncement() {
  const [intake, setIntake] = useState<PublicIntake | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/intake", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) return
        const data: { intake: PublicIntake | null } = await response.json()
        if (!controller.signal.aborted) setIntake(data.intake)
      })
      .catch(() => { /* Booking remains available when the announcement cannot load. */ })
    return () => controller.abort()
  }, [])

  if (!intake) return null
  return (
    <p className="w-fit rounded-eduvert-8 bg-eduvert-tint-yellow px-3 py-2 eduvert-support font-eduvert-700 text-eduvert-text-primary">
      {intakeMessage(intake)}
    </p>
  )
}
