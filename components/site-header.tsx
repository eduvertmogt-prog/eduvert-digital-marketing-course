"use client"

import { usePathname } from "next/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { demoHref, primaryNavigation } from "@/components/site-nav"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="eduvert-site-header sticky top-0 z-40 bg-eduvert-canvas-warm/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-5 min-[1100px]:grid min-[1100px]:grid-cols-[1fr_auto_1fr] min-[1100px]:px-[clamp(2rem,4.5vw,4.5rem)]">
        <a href="/" aria-label="EduVert home" className="inline-flex w-fit rounded-eduvert-8">
          <img src="/images/eduvert-logo.webp" alt="EduVert" width={1080} height={316} className="h-auto w-[154px]" />
        </a>
        <nav className="hidden items-center gap-0.5 rounded-full border border-eduvert-border-subtle bg-eduvert-surface-white p-1 shadow-[0_8px_28px_rgb(36_37_43/8%)] min-[1100px]:flex" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              data-current={pathname === item.href || pathname?.startsWith(`${item.href}/`) ? "true" : undefined}
              className="flex h-10 items-center whitespace-nowrap rounded-full px-3 text-sm font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-blue hover:text-eduvert-link data-[current=true]:bg-eduvert-tint-blue data-[current=true]:text-eduvert-link min-[1280px]:px-3.5"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <MobileMenu pathname={pathname} />
        <a
          href={demoHref}
          className="hidden min-h-12 items-center justify-center justify-self-end whitespace-nowrap rounded-full bg-eduvert-action-primary px-4 text-sm font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:inline-flex min-[1280px]:px-5"
        >
          Start Your Learning Journey
        </a>
      </div>
    </header>
  )
}
