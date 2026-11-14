"use client"

import { useId, useRef, useState } from "react"
import { primaryNavigation } from "@/components/site-nav"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  function closeMenu() {
    setIsOpen(false)
  }

  function toggleMenu() {
    setIsOpen((open) => !open)
  }

  return (
    <div
      className="flex shrink-0 items-stretch min-[1100px]:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.stopPropagation()
          closeMenu()
          toggleRef.current?.focus()
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="flex min-w-12 items-center justify-center border-l border-eduvert-border-subtle bg-eduvert-surface-white hover:bg-eduvert-tint-blue focus-visible:-outline-offset-2"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggleMenu}
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <MenuIcon isOpen={isOpen} />
      </button>
      <nav
        id={menuId}
        hidden={!isOpen}
        aria-label="Primary"
        className="absolute inset-x-0 top-full z-20 border-b border-eduvert-border-subtle bg-eduvert-surface-white"
      >
        <ul>
          {primaryNavigation.map((item) => (
            <li key={item.href} className="border-t border-eduvert-border-subtle">
              <a
                href={item.href}
                className="flex min-h-12 items-center px-eduvert-12 text-eduvert-body-large-mobile font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-blue hover:text-eduvert-link focus-visible:-outline-offset-2"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function MenuIcon({ isOpen }: MenuIconProps) {
  if (isOpen)
    return (
      <span className="relative block size-[18px]" aria-hidden="true">
        <span className="absolute top-1/2 left-0 h-[1.5px] w-[18px] -translate-y-1/2 rotate-45 bg-eduvert-text-primary" />
        <span className="absolute top-1/2 left-0 h-[1.5px] w-[18px] -translate-y-1/2 -rotate-45 bg-eduvert-text-primary" />
      </span>
    )

  return (
    <span className="flex flex-col items-start gap-[5px]" aria-hidden="true">
      <span className="h-[1.5px] w-[18px] bg-eduvert-text-primary" />
      <span className="h-[1.5px] w-[18px] bg-eduvert-text-primary" />
      <span className="h-[1.5px] w-3 bg-eduvert-text-primary" />
    </span>
  )
}

interface MenuIconProps {
  isOpen: boolean
}
