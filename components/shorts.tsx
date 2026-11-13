"use client"

import { useState } from "react"
import type { ShortItem } from "@/components/shorts-data"

/**
 * Shared vertical-video card: a lightweight facade (thumbnail + branded
 * play button + caption) that swaps in the YouTube iframe only when
 * tapped, so N embeds cost almost nothing until watched.
 * Plain words: poster first, real player on tap.
 */

export function ShortCard({ short }: { short: ShortItem }) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="flex w-[200px] shrink-0 snap-start flex-col gap-2.5 min-[1100px]:w-[240px]">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-eduvert-12 bg-eduvert-text-primary">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0`}
            title={short.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${short.title}`}
            className="group absolute inset-0 h-full w-full"
          >
            <img
              src={`/images/shorts/${short.id}.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-eduvert-text-primary opacity-[0.08] transition-opacity group-hover:opacity-0" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="flex size-14 items-center justify-center rounded-full bg-eduvert-action-primary text-eduvert-surface-white transition-colors duration-200 group-hover:bg-eduvert-action-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7 4.5v11l9-5.5-9-5.5z" fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="eduvert-support font-eduvert-600 text-eduvert-text-primary">
        {short.label}
      </figcaption>
    </figure>
  )
}
