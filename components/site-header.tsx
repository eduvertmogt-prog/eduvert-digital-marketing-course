import { MobileMenu } from "@/components/mobile-menu"
import { demoHref, primaryNavigation } from "@/components/site-nav"

export function SiteHeader() {
  return (
    <header className="relative w-full border-b border-eduvert-border-subtle bg-eduvert-surface-white">
      <div className="flex min-h-14 w-full items-stretch min-[1100px]:min-h-16">
        <div className="min-w-0 flex-1 min-[1100px]:flex-[0_1_50%]">
          <a
            href="/"
            className="flex h-full w-fit max-w-full items-center px-eduvert-12 focus-visible:-outline-offset-2 min-[1100px]:px-eduvert-16"
          >
            <img
              src="/images/eduvert-logo.webp"
              alt="EduVert"
              width={1080}
              height={316}
              className="h-auto w-[120px] max-w-full min-[1100px]:w-[146px]"
            />
          </a>
        </div>
        <nav className="hidden flex-auto shrink-0 items-stretch min-[1100px]:flex" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex grow items-center justify-center whitespace-nowrap border-l border-eduvert-border-subtle px-eduvert-8 text-eduvert-body font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-blue hover:text-eduvert-link focus-visible:-outline-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <MobileMenu />
        <a
          href={demoHref}
          className="flex shrink-0 items-center justify-center whitespace-nowrap border-l border-eduvert-border-subtle bg-eduvert-action-primary px-eduvert-12 text-eduvert-body font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover focus-visible:-outline-offset-4 focus-visible:outline-eduvert-surface-white min-[1100px]:px-eduvert-16 min-[1100px]:text-eduvert-body-large"
        >
          Book a Free Demo
        </a>
      </div>
    </header>
  )
}
