"use client"

import { useId, useRef, useState } from "react"
import { demoHref, primaryNavigation } from "@/components/site-nav"

const mobileNavigation = [{ href: "/", label: "Home" }, ...primaryNavigation]

export function MobileMenu({ pathname }: { pathname: string | null }) {
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
      className="min-[1100px]:hidden"
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
        className="grid size-11 place-items-center rounded-full bg-eduvert-action-primary text-eduvert-surface-white hover:bg-eduvert-action-hover"
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
        className="absolute inset-x-5 top-full max-h-[calc(100dvh-76px-var(--mobile-contact-bar-height)-12px)] overflow-y-auto overscroll-contain rounded-[22px] border border-eduvert-border-subtle bg-eduvert-surface-white px-4 py-2 shadow-[0_14px_40px_rgb(36_37_43/14%)]"
      >
        <ul className="divide-y divide-eduvert-border-subtle border-b border-eduvert-border-subtle">
          {mobileNavigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                data-current={pathname === item.href || pathname?.startsWith(`${item.href}/`) ? "true" : undefined}
                className="flex min-h-12 items-center rounded-eduvert-8 px-1 text-base font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-blue hover:text-eduvert-link data-[current=true]:text-eduvert-link"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={demoHref} className="my-3 flex min-h-12 items-center justify-center rounded-full bg-eduvert-action-primary px-3 text-center text-sm font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover">
          Start Your Learning Journey
        </a>
      </nav>
    </div>
  )
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d={isOpen ? "m4 4 10 10M14 4 4 14" : "M2 6h14M2 12h14"} />
    </svg>
  )
}
