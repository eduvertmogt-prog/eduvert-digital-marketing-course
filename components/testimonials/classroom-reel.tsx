"use client"

import { useState } from "react"

const reelUrl = "https://www.instagram.com/reel/DVQzMLUguHD/"

export function ClassroomReel() {
  const [playing, setPlaying] = useState(false)

  return (
    <section aria-labelledby="classroom-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-6 pt-10 pb-8 min-[1100px]:grid-cols-2 min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:pt-16 min-[1100px]:pb-12 min-[1440px]:px-[120px]">
        <div className="flex max-w-[560px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">INSIDE EDUVERT</p>
          <h2 id="classroom-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
            Step Inside a Real Classroom
          </h2>
          <p className="eduvert-body text-eduvert-text-secondary">
            See how EduVert learners explore performance marketing through real campaign case studies.
          </p>
          <a href={reelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit items-center eduvert-button text-eduvert-link underline underline-offset-4">
            Watch on Instagram
          </a>
        </div>
        <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white">
          {playing ? (
            <iframe
              src={`${reelUrl}embed/`}
              title="EduVert classroom session on Instagram"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="block aspect-[9/16] min-h-[480px] w-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="group relative grid aspect-[4/3] w-full place-items-center overflow-hidden bg-eduvert-text-primary text-eduvert-surface-white focus-visible:-outline-offset-4">
              <img src="/images/seawoods/classroom-screen-768.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-eduvert-text-primary/45" aria-hidden="true" />
              <span className="relative inline-flex min-h-12 items-center gap-3 rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button group-hover:bg-eduvert-action-hover">
                <span aria-hidden="true">▶</span>
                Play classroom Reel
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
