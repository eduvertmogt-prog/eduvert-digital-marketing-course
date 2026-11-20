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

export function intakeMessage({ closesOn, seatsRemaining }: PublicIntake) {
  const deadline = intakeDateFormat.format(new Date(`${closesOn}T00:00:00Z`))
  return `Apply by ${deadline} · ${seatsRemaining} ${seatsRemaining === 1 ? "seat" : "seats"} remaining`
}
