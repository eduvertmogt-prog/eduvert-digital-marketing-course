"use client"

import { useEffect, useState } from "react"
import type { ArticleHeading } from "@/components/blog/article-types"

export function ArticleContents({ headings }: ArticleContentsProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "")

  useEffect(() => {
    const sections = headings.flatMap((heading) => {
      const section = document.getElementById(heading.id)
      return section ? [section] : []
    })
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
        if (visible?.target.id) setActiveId(visible.target.id)
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: [0, 1] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [headings])

  return (
    <nav aria-label="On this page" className="min-[1100px]:sticky min-[1100px]:top-24">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left eduvert-body-large font-eduvert-700 text-eduvert-text-primary min-[1100px]:hidden"
        aria-expanded={isOpen}
        aria-controls={contentsId}
        onClick={() => setIsOpen((current) => !current)}
      >
        On this page
        <span aria-hidden="true" className="text-eduvert-action-primary">{isOpen ? "–" : "+"}</span>
      </button>
      <p className="hidden eduvert-body-large font-eduvert-700 text-eduvert-text-primary min-[1100px]:block">On this page</p>
      <ol id={contentsId} className={`mt-4 flex flex-col gap-3 ${isOpen ? "" : "hidden"} min-[1100px]:flex`}>
        {headings.map((heading) => {
          const isActive = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block eduvert-body ${isActive ? "font-eduvert-700 text-eduvert-action-primary" : "font-eduvert-500 text-eduvert-text-secondary hover:text-eduvert-text-primary"}`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

const contentsId = "article-contents"

interface ArticleContentsProps {
  headings: ArticleHeading[]
}
