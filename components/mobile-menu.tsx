"use client"

import { useId, useState } from "react"
import { primaryNavigation } from "@/components/site-nav"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  function closeMenu() {
    setIsOpen(false)
  }

  function toggleMenu() {
    setIsOpen((open) => !open)
  }

  return (
    <div className="min-[1100px]:hidden">
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggleMenu}
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <MenuIcon isOpen={isOpen} />
      </button>
      {isOpen ? (
        <nav
          id={menuId}
          aria-label="Primary"
          className="absolute inset-x-0 top-[72px] z-20 border-b border-eduvert-border-subtle bg-eduvert-canvas-warm px-6 py-2"
        >
          <ul>
            {primaryNavigation.map((item) => (
              <li key={item.href} className="border-b border-eduvert-border-subtle last:border-b-0">
                <a
                  href={item.href}
                  className="block py-3 eduvert-body font-eduvert-500 text-eduvert-text-primary"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
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
