export interface PublicIntake {
  closesOn: string
  seatsRemaining: number
}

export interface IntakeSettings extends PublicIntake {
  enabled: boolean
  revision: number
}

const intakeDateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: "UTC", day: "numeric", month: "long", year: "numeric",
})

export function intakeHasClosed(closesOn: string, now = Date.now()) {
  return now > Date.parse(`${closesOn}T23:59:59.999+05:30`)
}

/** Client-supplied intake shown when the admin announcement is switched off. */
export const fallbackIntake: PublicIntake = { closesOn: "2026-12-05", seatsRemaining: 5 }

export type IntakeWording = "default" | "program" | "demo"

const shortDateFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", day: "numeric", month: "long" })

export function intakeMessage({ closesOn, seatsRemaining }: PublicIntake, wording: IntakeWording = "default") {
  const date = new Date(`${closesOn}T00:00:00Z`)
  const seats = `${seatsRemaining} ${seatsRemaining === 1 ? "seat" : "seats"}`
  if (wording === "program") return `Next intake: applications close ${intakeDateFormat.format(date)}. ${seats} remaining.`
  if (wording === "demo") return `Apply by ${shortDateFormat.format(date)} · only ${seats} left in the next batch`
  return `Apply by ${intakeDateFormat.format(date)} · ${seats} remaining`
}
