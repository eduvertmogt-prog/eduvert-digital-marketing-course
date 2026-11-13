"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Muted classroom loop, click-to-toggle sound-free playback.
 * Plain words: plays silently on loop unless you pause it or asked for
 * reduced motion, in which case it waits for you to press play.
 * Tech words: programmatic .play() gated on matchMedia, poster frame,
 * preload="metadata" so nothing heavy downloads until visible.
 */
export function ClassroomVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    video
      .play()
      .then(() => setStarted(true))
      .catch(() => {})
  }, [])

  async function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try {
        await video.play()
      } catch {
        return
      }
      setPaused(false)
      setStarted(true)
    } else {
      video.pause()
      setPaused(true)
    }
  }

  return (
    <section aria-labelledby="classroom-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-6 py-12 min-[1100px]:grid-cols-2 min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex max-w-[560px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">
            INSIDE EDUVERT
          </p>
          <h2 id="classroom-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Step Inside a Real Classroom
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            This is a real batch in progress at our Seawoods classroom — laptops open, the trainer walking
            the room, everyone working through live campaigns together. Press play and spend forty-two
            seconds inside an actual class.
          </p>
        </div>
        <div className="classroom-frame relative mx-auto w-full max-w-[320px] overflow-hidden rounded-eduvert-16 bg-eduvert-text-primary min-[1100px]:max-w-[340px]">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/videos/classroom-poster.jpg"
            className="aspect-[9/16] w-full object-cover"
            aria-label="Classroom at EduVert, Seawoods"
          >
            <source src="/videos/classroom.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={toggle}
            aria-label={paused || !started ? "Play classroom video" : "Pause classroom video"}
            className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-eduvert-surface-white text-eduvert-text-primary"
          >
            {paused || !started ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5 3.5v9l7-4.5-7-4.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
