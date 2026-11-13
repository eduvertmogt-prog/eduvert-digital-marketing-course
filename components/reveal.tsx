"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

/**
 * One-shot scroll entrance. Plain words: content starts visible (so
 * no-JS and first paint are safe), hides itself once JS runs, then fades
 * and rises in the first time it scrolls into view.
 * Tech words: IntersectionObserver adding .is-shown once.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [shown, setShown] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShown(false)
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal${shown ? " is-shown" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
