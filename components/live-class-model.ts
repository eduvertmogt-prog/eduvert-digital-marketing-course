export const liveClassModes = ["classroom", "online"] as const
export type LiveClassMode = (typeof liveClassModes)[number]

export interface LiveClassSession {
  id: string
  startsAt: string
  mode: LiveClassMode
}

const date = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric",
})
const time = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true,
})

export function liveClassLabel(session: Pick<LiveClassSession, "startsAt" | "mode">) {
  const start = new Date(session.startsAt)
  const end = new Date(start.getTime() + 60 * 60_000)
  return `${date.format(start)} · ${time.format(start)}–${time.format(end)} IST · ${session.mode === "online" ? "Live online" : "Seawoods classroom"}`
}

export function isLiveClassId(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value)
}
