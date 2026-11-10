import { ButtonLink } from "@/components/button-link"
import { MobileMenu } from "@/components/mobile-menu"
import { demoHref, primaryNavigation } from "@/components/site-nav"

export function SiteHeader() {
  return (
    <header className="relative h-[72px] border-b border-eduvert-border-subtle bg-eduvert-canvas-warm min-[1100px]:h-[88px]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 min-[1100px]:px-16">
        <a href="/" className="shrink-0 rounded-eduvert-8">
          <img
            src="/images/eduvert-logo.webp"
            alt="EduVert"
            width={1080}
            height={316}
            className="h-[35px] w-[118px] min-[1100px]:h-[43px] min-[1100px]:w-[146px]"
          />
        </a>
        <nav className="hidden items-center gap-6 min-[1100px]:flex" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] leading-[21px] font-eduvert-500 text-eduvert-text-primary hover:text-eduvert-action-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden min-[1100px]:block">
          <ButtonLink href={demoHref} size="nav">
            Book a Free Demo
          </ButtonLink>
        </div>
        <MobileMenu />
      </div>
    </header>
  )
}
