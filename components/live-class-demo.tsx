"use client"

import { useEffect, useState } from "react"
import { ButtonLink } from "@/components/button-link"
import { IntakeAnnouncement } from "@/components/intake-announcement"
import { liveClassLabel, type LiveClassSession } from "@/components/live-class-model"
import { demoHref, liveClassSectionId, phoneHref } from "@/components/site-nav"

export function LiveClassDemo() {
  const [sessions, setSessions] = useState<LiveClassSession[] | null>(null)
  const [selectedId, setSelectedId] = useState("")
  const [error, setError] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/live-classes", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Unable to load upcoming sessions.")
        const { sessions } = await response.json() as { sessions: LiveClassSession[] }
        if (!controller.signal.aborted) setSessions(sessions)
      })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
    return () => controller.abort()
  }, [revision])

  const selected = sessions?.find(session => session.id === selectedId)

  return (
    <section id={liveClassSectionId} aria-labelledby="live-class-heading" className="scroll-mt-6 border-t border-eduvert-border-subtle bg-eduvert-tint-soft-blue">
      <div className="mx-auto grid w-full max-w-[1440px] items-start gap-8 px-6 py-10 min-[950px]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] min-[950px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="max-w-[590px] space-y-4">
          <h2 id="live-class-heading" className="eduvert-h2 text-balance text-eduvert-text-primary">Experience a class, not a sales pitch</h2>
          <p className="eduvert-body-large text-eduvert-text-secondary">Sit in on a live 60-minute session in the batch timing that suits you:</p>
          <ul className="list-disc space-y-3 pl-5 eduvert-body text-eduvert-text-primary">
            <li>Live and interactive, with real students and a real trainer</li>
            <li>Choose any batch: morning, afternoon, evening or Sunday</li>
            <li>Classroom in Seawoods or live online</li>
            <li>Ask your questions and meet the counsellor after the session</li>
          </ul>
          <IntakeAnnouncement wording="demo" />
        </div>
        <div className="grid min-w-0 gap-4 rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white p-5 sm:p-7">
          <h3 className="eduvert-h4 text-eduvert-text-primary">Book a Demo Session</h3>
          {sessions?.length ? (
            <label className="grid min-w-0 gap-2 eduvert-support font-eduvert-600 text-eduvert-text-primary">
              Choose a date and time (IST)
              <select value={selected?.id ?? ""} onChange={event => setSelectedId(event.target.value)}
                className="min-h-12 w-full min-w-0 rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-3 py-2 eduvert-support">
                <option value="">Select a live class</option>
                {sessions.map(session => <option key={session.id} value={session.id}>{liveClassLabel(session)}</option>)}
              </select>
            </label>
          ) : (
            <p role="status" className="eduvert-body text-eduvert-text-secondary">
              {error ? "We couldn’t load the schedule. Refresh or call us for upcoming dates." :
                sessions ? "New live class dates will appear here. Call us to ask about the next session." : "Loading upcoming classes…"}
            </p>
          )}
          {selected ? <p className="eduvert-support text-eduvert-text-secondary min-[950px]:hidden">{liveClassLabel(selected)}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            {selected ? (
              <ButtonLink href={demoHref} size="course" className="flex-none px-5" data-demo-session-id={selected.id} data-demo-session-label={liveClassLabel(selected)}>
                Continue to Booking
              </ButtonLink>
            ) : sessions?.length === 0 || error ? (
              <a href={phoneHref} className="inline-flex min-h-11 items-center eduvert-button text-eduvert-link underline underline-offset-4">Call EduVert</a>
            ) : null}
            {sessions || error ? (
              <button type="button" className="min-h-11 px-1 eduvert-button text-eduvert-link hover:underline"
                onClick={() => { setError(false); setSessions(null); setSelectedId(""); setRevision(value => value + 1) }}>
                Refresh sessions
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
